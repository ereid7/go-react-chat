// App.js
import React, { Component } from 'react';
import './App.css';
import { connect, sendMsg } from './api';
import Header from './components/Header/Header';
import ChatHistory from './components/ChatHistory/ChatHistory'
import ChatInput from './components/ChatInput';
import LoginForm from './components/Login/LoginForm';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
      user: null,
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
    connect((msg) => {
      console.log("New Message")
      this.setState(prevState => ({
        chatHistory: [...prevState.chatHistory, msg]
      }))
      console.log(this.state)
    });
  }

  send(event) {
    if(event.keyCode === 13) {
      sendMsg(event.target.value);
      event.target.value = "";
    }
  }

  // Login Methods
  signIn(username, password) {
    // add auth here
    this.setState({
      user: {
        username,
        password
      }
    })
  }

  signOut() {
    // clear user from state
    this.setState({
      user: null
    })
  }

  render() {
    return (
      <div className="App">
      <Header />
      {  
          (this.state.user) ?
            <div>
              <ChatHistory chatHistory={this.state.chatHistory} />
              <ChatInput send={this.send} />
            </div>
          :
            <LoginForm
              onSignIn={this.signIn.bind(this)}
            />
      }      
      </div>
    );
  }
}

export default App;
