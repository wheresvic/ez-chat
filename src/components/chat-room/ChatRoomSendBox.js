import React, { Component } from "react";
// import Chance from "chance";
import moment from "moment";

// const chance = new Chance();
const Fragment = React.Fragment;

class ChatRoomSendBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentChatMessage: ""
    };

    this.inputRef = React.createRef();
  }

  onChatMessageFormSubmit = event => {
    event.preventDefault();

    if (this.state.currentChatMessage) {
      this.props.onSendBoxSend({
        message: this.state.currentChatMessage,
        from: this.props.username,
        when: moment().unix()
      });

      this.setState({
        currentChatMessage: ""
      });
    }
  };

  onChatMessageFormSendClick = event => {
    this.onChatMessageFormSubmit(event);
  };

  onChatMessageFormInputChange = event => {
    const val = event.target.value;
    this.setState({
      currentChatMessage: val
    });
  };

  onChatMessageFormUserClick = event => {
    event.preventDefault();
  };

  componentDidMount() {
    if (this.inputRef.current) {
      this.inputRef.current.focus();
    }
  }

  render() {
    return (
      <Fragment>
        <section id="send-box" className="section">
          <div className="container">
            <div className="columns is-centered">
              <div className="column is-8">
                <h4 className="title is-4">Free room</h4>
              </div>
            </div>
            <div className="columns is-centered">
              <div className="column is-8">
                <div className="box">
                  <form onSubmit={this.onChatMessageFormSubmit}>
                    <div className="field has-addons has-addons-centered">
                      <p className="control">
                        <a className="button is-static" onClick={this.onChatMessageFormUserClick}>
                          {this.props.username}
                        </a>
                      </p>
                      <p className="control is-expanded">
                        <input
                          ref={this.inputRef}
                          className="input"
                          type="text"
                          placeholder="Your message"
                          onChange={this.onChatMessageFormInputChange}
                          value={this.state.currentChatMessage}
                        />
                      </p>
                      <p className="control">
                        <a
                          className="button is-primary"
                          onClick={this.onChatMessageFormSendClick}
                          disabled={!this.state.currentChatMessage}
                        >
                          Send
                        </a>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Fragment>
    );
  }
}

export default ChatRoomSendBox;
