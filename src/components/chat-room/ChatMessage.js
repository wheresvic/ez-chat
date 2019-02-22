import React from "react";
import moment from "moment";

const getWhenStr = when => {
  return moment(when * 1000).fromNow();
};

class ChatMessage extends React.Component {
  state = {
    whenStr: getWhenStr(this.props.chatMessage.when)
  };

  componentDidMount() {
    this.updateTimeId = setInterval(() => {
      this.setState({
        whenStr: getWhenStr(this.props.chatMessage.when)
      });
    }, 1000 * 60);
  }

  componentWillUnmount() {
    clearInterval(this.updateTimeId);
  }

  render() {
    return (
      <div className="columns chat-message is-mobile">
        <div className="column is-4">
          <div className="chat-message-from">{this.props.chatMessage.from}</div>
          <div className="chat-message-when">{this.state.whenStr}</div>
        </div>
        <div className="column is-8 chat-message-content">{this.props.chatMessage.message}</div>
      </div>
    );
  }
}

export default ChatMessage;
