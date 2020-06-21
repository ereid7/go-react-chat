import React, { Component } from "react";
import auth from '../../authorization/auth';
import "./LoginPage.scss";

class LoginPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: ''
    };
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  
  render() {
    return (
      <div className="LoginPage">
        <div className="loginContainer" onKeyPress={this.keyPressed}>
          <div className="form__group field">
            <input type="input" className="form__field" name='name' id="name" value={this.state.name} onChange={e => this.handleChange(e)} />
            <label htmlFor="name" className="form__label">Username</label>
          </div>

          <button className="login-button" onKeyPress={this.onKeyPress} onClick={this.submitLogin}>Login</button>
        </div>
      </div>
    )
  }

  submitLogin = () => {
    auth.login(this.state.name, () => {
      this.props.history.push("/chat");
    })
  }

  keyPressed = (event) => {
    if (event.key === "Enter") {
      this.submitLogin();
    }
  }
}

export default LoginPage