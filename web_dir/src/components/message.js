import React, { Component } from 'react';
import './message.css';

class Message extends Component {
    render () {
        return (
            <div class={this.props.isUser?"usermessage":"message"}>
            <img src={this.props.image}></img>
            <div>
                <div class={this.props.isUser?"kiminonawa":"name"}>{this.props.name}</div>
                <div class={this.props.isUser?"mytext":"text"}>{this.props.transcript}</div>
            </div>
            </div>
        );
    }
}

export default Message;