import React, { Component } from "react";
import "./Message.scss";

class Message extends Component {

  // TODO have chathistory pass property to display timestamp
  constructor(props) {
    super(props);
    let temp = JSON.parse(this.props.message);
    this.state = {
      message: temp,
      timeStamp: this.displayTime(temp.timeStamp)
    };
  }

  displayTime(timeStamp) {
    var localeTime = new Date(timeStamp).toLocaleTimeString();
    return `${localeTime.substr(0, localeTime.length - 6)}\u00A0${localeTime.substr(localeTime.length - 2, localeTime.length)}`;
  }

  render() {
    return <div className="Message">
      <span className="timeStamp">{this.state.timeStamp}</span>
      <span className="userName">{this.state.message.user}:&nbsp;</span>
      <span className="messageBody">{this.state.message.body}</span>
    </div>;
  }
}

export default Message