import React, { Component } from "react";
import "./ChatHistory.scss"
import Message from '../Message';

class ChatHistory extends Component {

    componentDidMount() {
      this.scrollToBottom();
    }
    
    componentDidUpdate() {
      this.scrollToBottom();
    }
    
    scrollToBottom() {
      this.el.scrollIntoView({ behavior: 'smooth' });
    }

    render() {
        //console.log(this.props.chatHistory)
        // TODO give each message unique key
        const messages = this.props.chatHistory.map(msg => <Message message={msg.data} />);
        //console.log(messages)
        return (
            <div className="ChatHistory">
                <div id="chatHistory">
                    <div id="history">
                    {messages}
                    </div>
                    <div ref={el => { this.el = el; }} />
                </div>
            </div>
        );
    }
}

export default ChatHistory;
