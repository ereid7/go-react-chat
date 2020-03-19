import React, { Component } from "react";
//import { connect, sendMsg } from '../../../api';
import ChatSocket from '../../../api/ChatSocket';
import "./ChatPage.scss";
import ChatHistory from "../ChatHistory/ChatHistory";
import ChatInput from "../ChatInput";
import auth from '../../../authorization/auth';

class ChatPage extends Component {

  _chatSocket;

  constructor(props) {
    super(props);
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

  componentDidMount() {
    // TODO provide real authentication to differentiate users
    if (auth.isAuthenticated()) {
      this._chatSocket = new ChatSocket("ws://localhost:8080/ws", true)
      this._chatSocket.connect((msg) => {
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
    this._chatSocket.closeSocket();
  }

  send(event) {
    if(event.keyCode === 13) {
      this._chatSocket.sendMsg(auth.getUser(), event.target.value);
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

