import React, { Component } from "react";
import "./Message.scss";

class Message extends Component {

  constructor(props) {
    super(props);
    let temp = JSON.parse(this.props.message);
    this.state = {
      message: temp,
      timeStamp: this.displayTime(temp.timeStamp)
    };
  }

  render() {
    return <div className="Message">
      <span className="timeStamp">{this.state.timeStamp}</span>
      <span className="userName" style={{ color: this.state.message.color }}>{this.state.message.user}&nbsp;</span>
      <span className="messageBody">{this.state.message.body}</span>
    </div>;
  }

  displayTime(timeStamp) {
    var localeTime = new Date(timeStamp).toLocaleTimeString();
    return `${localeTime.substr(0, localeTime.length - 6)}\u00A0${localeTime.substr(localeTime.length - 2, localeTime.length)}`;
  }
}

export default Message