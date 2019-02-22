import React, { Component } from "react";
import moment from "moment";

import ChatRoomSendBox from "./ChatRoomSendBox";
import ChatMessage from "./ChatMessage";

const Fragment = React.Fragment;

class ChatRoom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chatMessages: []
    };

    // this.refLastMessage = React.createRef();
    this.refDummyMessage = React.createRef();
    this.refEndOfPage = React.createRef();
  }

  onChatMessageServerReceive = msg => {
    this.setState({
      chatMessages: [...this.state.chatMessages, msg]
    });

    if (window.Notification && Notification.permission === "granted") {
      if (msg.from !== "Anonymous" && msg.from !== this.props.username) {
        const notification = new Notification("From: " + msg.from + "\n\n" + msg.message);
      }
    }
  };

  onChatMessageHistoryReceive = messages => {
    this.setState({
      chatMessages: [...messages, ...this.state.chatMessages]
    });
  };

  componentDidMount() {
    this.props.socket.on("chat-message", this.onChatMessageServerReceive);
    this.props.socket.on("chat-message-history", this.onChatMessageHistoryReceive);

    this.props.socket.emit("get-chat-message-history", { fromTime: moment().unix(), limit: 100 });

    if (document) {
      document.title = "Ez Chat - Free Room";
    }
  }

  componentWillUnmount() {
    this.props.socket.removeListener("chat-message", this.onChatMessageServerReceive);
    this.props.socket.removeListener("chat-message-history", this.onChatMessageHistoryReceive);
  }

  componentDidUpdate() {
    /*
    if (this.refLastMessage.current) {
      this.refLastMessage.current.scrollIntoView({
        behavior: "smooth"
      });
    }
    */

    /*
    this.refDummyMessage.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest"
    });
    */

    if (this.state.chatMessages.length && this.refEndOfPage.current) {
      this.refEndOfPage.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest"
      });
    }

    console.log(this.state);
  }

  onSendBoxSend = msg => {
    console.log(msg);
    this.props.socket.emit("chat-message", msg);
  };

  render() {
    return (
      <Fragment>
        <section className="section">
          <div className="container">
            <div className="columns is-centered">
              <div className="column is-8">
                {this.renderChatMessages()}
                <div id="dummy-message" ref={this.refDummyMessage} />
              </div>
            </div>
          </div>
        </section>

        <ChatRoomSendBox onSendBoxSend={this.onSendBoxSend} username={this.props.username} />

        <div ref={this.refEndOfPage} />
      </Fragment>
    );
  }

  renderChatMessages() {
    if (!this.state.chatMessages.length) {
      return <div className="notification">No messages, write something to get started!</div>;
    }

    const renderedMessages = [];
    for (let i = 0; i < this.state.chatMessages.length; ++i) {
      const renderedChatMessage = (
        <ChatMessage key={this.state.chatMessages[i]._id} chatMessage={this.state.chatMessages[i]} />
      );
      renderedMessages.push(renderedChatMessage);
    }

    return <Fragment>{renderedMessages}</Fragment>;
  }
}

export default ChatRoom;
