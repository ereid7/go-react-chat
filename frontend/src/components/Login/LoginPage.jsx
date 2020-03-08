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
        <input name='name' value={this.state.name} onChange={e => this.handleChange(e)} />
        <button onClick={() => this.submitLogin()}>Login</button>
      </div>
    )
  }

  submitLogin(cb) {
    auth.login(this.state.name, () => {
      this.props.history.push("/chat");
    })
  }
}

export default LoginPage