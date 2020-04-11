// App.js
import React, { Component } from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';
import Header from './components/Header/Header';
import ChatPage from './components/Chat/ChatPage';
import LoginPage from './components/Login/LoginPage';
import { ProtectedRoute } from './authorization/protected.route';

// TODO dockerize
class App extends Component {

  render() {
    return (
      <div className="App">
        <Header />
        <Switch>
          <Route exact path="/" component={LoginPage} />
          <ProtectedRoute exact path="/chat" component={ChatPage} />
          <Route path="*" component = {() => "404 NOT FOUND"} />
        </Switch>
      </div>
    );
  }
}

export default App;
