import React, { Component } from "react";
import auth from '../../authorization/auth';
import "./LoginPage.scss";

class LoginPage extends Component {

  
  render() {
    return (
      <div className="LoginPage">
        <button onClick={() => this.submitLogin()}>Login</button>
      </div>
    )
  }

  submitLogin(cb) {
    auth.login(() => {
      this.props.history.push("/chat");
    })
  }
}

export default LoginPage