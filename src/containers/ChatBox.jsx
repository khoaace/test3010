import React, { Fragment } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import {
  firebaseConnect,
  getVal,
  isEmpty,
  isLoaded
} from "react-redux-firebase";
import { withRouter } from "react-router";
import Message from "../components/Message";
import UserList from "../containers/UserList";

import history from "../history";

import ScrollToBottom from "react-scroll-to-bottom";
import { css } from "glamor";

const ROOT_CSS = css({
  height: 515,
  width: "100%"
});

const enhance = compose(
  firebaseConnect(props => {
    return [
      {
        path: `messages/${props.match.params.user1}-${props.match.params.user2}`
      },
      { path: `users/${props.match.params.user1}` },
      { path: `users/${props.match.params.user2}` }
    ];
  }),
  connect(({ firebase }, props) => ({
    messages: getVal(
      firebase,
      `data/messages/${props.match.params.user1}-${props.match.params.user2}`
    ), // lodash's get can also be used
    auth: firebase.auth,
    user1: getVal(firebase, `data/users/${props.match.params.user1}`),
    user2: getVal(firebase, `data/users/${props.match.params.user2}`),
    authExists: !!firebase.auth && !!firebase.auth.uid
  }))
);

class ChatBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { content: "" };
  }

  componentWillReceiveProps({ authExists, user1, user2, auth }) {
    if (isEmpty(auth)) {
      if (!authExists) {
        history.replace("/login");
      }
    }
    if (!isEmpty(auth)) {
      if (
        this.props.match.params.user1 !== auth.uid &&
        this.props.match.params.user2 !== auth.uid
      )
        history.replace("/login");
    }
  }

  handleChangeContent = e => {
    this.setState({ content: e.target.value });
  };

  scrollToBottom() {
    const scrollHeight = this.messageList.scrollHeight;
    const height = this.messageList.clientHeight;
    const maxScrollTop = scrollHeight - height;
    this.messageList.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  render() {
    const { firebase, messages, auth, match, user1, user2 } = this.props;
    var otherUser = {};
    if (!isEmpty(user1) && !isEmpty(user2)) {
      if (match.params.user1 === auth.uid) otherUser = user2;
      else otherUser = user1;
    }
    var _ = require("lodash");
    var messages_Arr = [];
    if (!isEmpty(messages)) {
      messages_Arr = _.map(messages, (val, id) => {
        return { ...val, id: id };
      });
    }
    var dateTime = new Date().toDateString();
    const handleClick = async () => {
      await firebase.push(
        `messages/${match.params.user1}-${match.params.user2}`,
        {
          content: this.state.content,
          userId: auth.uid,
          dateTime: dateTime,
          username: auth.displayName
        }
      );
      await this.setState({ content: "" });
    };
    var renderMessages = messages_Arr.map((message, index) => {
      if (!isEmpty(messages)) {
        if (message.userId === auth.uid)
          return (
            <Message
              key={index}
              content={message.content}
              name={message.username}
              date={message.dateTime}
              owner={true}
            />
          );
        else
          return (
            <Message
              key={index}
              content={message.content}
              name={message.username}
              date={message.dateTime}
              owner={false}
            />
          );
      }
    });

    return (
      <Fragment>
        <UserList />
        <div className="chat">
          <div className="chat-header clearfix">
            <img
              src={otherUser.avatarUrl}
              alt="avatar"
              onClick={handleClick}
              style={{
                width: 54,
                height: 54,
                borderRadius: "50%"
              }}
            />
            <div className="chat-about">
              <div className="chat-with">Chat with {otherUser.displayName}</div>
            </div>
            <i className="fa fa-star" />
          </div>{" "}
          {/* end chat-header */}
          <div className="chat-history">
            <ul
              className="MessageList"
              ref={div => {
                this.messageList = div;
              }}
            >
              <ScrollToBottom className={ROOT_CSS}>
                {renderMessages}
              </ScrollToBottom>
            </ul>
          </div>
          <div className="chat-message clearfix">
            <textarea
              name="message-to-send"
              id="message-to-send"
              placeholder="Type your message"
              rows={3}
              value={this.state.content}
              onChange={e => this.handleChangeContent(e)}
            />
            <i className="fa fa-file-o" />
            <i className="fa fa-file-image-o" />
            <button onClick={handleClick}>Send</button>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default withRouter(enhance(ChatBox));
