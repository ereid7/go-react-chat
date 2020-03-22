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
    var test =  new Date(this.state.message.timeStamp);
    // TODO convert to local time zone
    return test.toLocaleString();
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