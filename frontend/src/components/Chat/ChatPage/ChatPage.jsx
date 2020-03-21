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
      chatHistory: [],
      userList: []
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
    if (auth.isAuthenticated()) {
      this._chatSocket = new ChatSocket("ws://localhost:8080/ws", auth.getUserName(), auth.getUserId(), true)
      this._chatSocket.connect((event) => {
        this.handleSocketEvent(event)
      });
    }
  }

  handleSocketEvent(event) {
    switch (event.type) {
      case "close":
        // TODO notify user about logout due to websocket closed
        this.handleLogout()
        break;
      case 1:
      case "message":
        this.handleMessage(event)
        break;
      case 2:
        this.handleStateMessage(event)
        break;
      default:
    }
  }

  handleLogout() {
    auth.logout(() => {
      this.props.history.push("/")
    })
  }

  handleMessage(event) {
    this.setState(prevState => ({
      chatHistory: [...prevState.chatHistory, event]
    }))
  }

  handleStateMessage(event) {
    const msgData = JSON.parse(event.data)
    console.log(msgData.clientList)
  }

  componentWillUnmount() {
    this._chatSocket.closeSocket();
  }

  send(event) {
    if(event.keyCode === 13) {
      this._chatSocket.sendMsg(event.target.value, auth.getUserId());
      event.target.value = "";
    }
  }

  render() {
    return (
      <div className="ChatPage">
        <button onClick={() => {
          this.handleLogout()
        }}>Logout</button>
        
        <ChatHistory chatHistory={this.state.chatHistory} />
        <ChatInput send={e => this.send(e)} />
      </div>
    );
  }
}

export default ChatPage;

