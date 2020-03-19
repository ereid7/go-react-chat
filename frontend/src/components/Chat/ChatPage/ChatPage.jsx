import React, { Component } from "react";
//import { connect, sendMsg } from '../../../api';
import "./ChatPage.scss";
import ChatHistory from "../ChatHistory/ChatHistory";
import ChatInput from "../ChatInput";
import auth from '../../../authorization/auth';

class ChatPage extends Component {

  _socket;

  constructor(props) {
    super(props);
    this._socket = null;
    this.state = {
      isActive: false,
      chatHistory: []
    }
  }

  handleShow = () => {
    this.setState({
      isActive: true
    });
  };

  handleHide = () => {
    this.setState({
      isActive: false
    });
  };

  // TODO create web socket service/helper
  connect(cb) {
    console.log("Attempting Connection...");
  
    this._socket.onopen = () => {
      console.log("Successfully Connected");
    };
  
    this._socket.onmessage = (msg) => {
      console.log(msg);
      cb(msg)
    };
  
    this._socket.onclose = (event) => {
      console.log("Socket Closed Connection: ", event);
    };
  
    this._socket.onerror = (error) => {
      console.log("Socket Error: ", error);
    };
  };

  sendMsg(user, msg) {
    console.log("sending msg: ", msg);
  
    let messageData = {
      "message": msg,
      "user": user
    }
    this._socket.send(JSON.stringify(messageData));
  };

  componentDidMount() {
    // TODO provide real authentication to differentiate users
    if (auth.isAuthenticated()) {
      this._socket = new WebSocket("ws://localhost:8080/ws");
      this.connect((msg) => {
        var msgData = JSON.parse(msg.data);
        if (msgData.type === 2) {
          console.log(msgData.clientCount)
        }
        else {
          this.setState(prevState => ({
            chatHistory: [...prevState.chatHistory, msg]
          }))
        }
      });
    }
  }

  componentWillUnmount() {
    this._socket.close();
  }

  send(event) {
    if(event.keyCode === 13) {
      this.sendMsg(auth.getUser(), event.target.value);
      event.target.value = "";
    }
  }

  render() {
    return (
      <div className="ChatPage">
        <button onClick={() => {
          auth.logout(() => {
            this.props.history.push("/");
          });
        }}>Logout</button>
        
        <ChatHistory chatHistory={this.state.chatHistory} />
        <ChatInput send={e => this.send(e)} />
      </div>
    );
  }
}

export default ChatPage;

