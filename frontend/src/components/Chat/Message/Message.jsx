import React, { Component } from "react";
import "./Message.scss";

class Message extends Component {
  constructor(props) {
    super(props);
    let temp = JSON.parse(this.props.message);
    this.state = {
      message: temp
    };
  }

  displayTime() {
    console.log(this.state.message.timeStamp)
    return this.state.message.timeStamp;
  }

  render() {
    return <div className="Message">
      <p class="timeStamp">{this.displayTime()}</p>
      <p class="userName">{this.state.message.user}:&nbsp;</p>
      <p class="messageBody">{this.state.message.body}</p>
    </div>;
  }
}

export default Message