import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import ChatSocket from '../../../api/ChatSocket';
import "./ChatPage.scss";
import ChatHistory from "../ChatHistory/ChatHistory";
import ChatInput from "../ChatInput";
import UserList from "../UserList";
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

  componentWillUnmount() {
    this._chatSocket.closeSocket();
  }

  handleSocketEvent(event) {
    switch (event.type) {
      case "close":
        // TODO notify user about logout due to websocket closed
        this.handleLogout()
        break;
      case "message":
        this.handleMessage(event)
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
    const msgData = JSON.parse(event.data);
    switch(msgData.type) {
      case 0:
        this.setState({
          userList: msgData.clientList
        });
        break;
      case 1:
        this.setState(prevState => ({
          chatHistory: [...prevState.chatHistory, event]
        }))
        break;
      default:
    }
  }

  send(event) {
    if(event.keyCode === 13 && event.target.value !== "") {
      this._chatSocket.sendMsg(event.target.value, auth.getUserId());
      event.target.value = "";
    }
  }

  render() {
    if (!auth.isAuthenticated()) {
      return <Redirect to='/' />
    }

    return (
      <div className="ChatPage">
        <UserList userList={this.state.userList}></UserList>
        
        <ChatHistory chatHistory={this.state.chatHistory} />
        <ChatInput send={e => this.send(e)} />
      </div>
    );
  }
}

export default ChatPage;

