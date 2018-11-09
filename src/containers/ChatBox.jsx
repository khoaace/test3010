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

import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Input from '@material-ui/core/Input';

import history from "../history";

import ScrollToBottom from "react-scroll-to-bottom";
import { css } from "glamor";

var moment = require('moment');

const ROOT_CSS = css({
  height: 515,
  width: "100%"
});

const filesPath = 'uploadedFiles';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const enhance = compose(
  firebaseConnect(props => {
    return [
      {
        path: `messages/${props.match.params.user1}-${props.match.params.user2}`
      },
      { path: `users/${props.match.params.user1}` },
      { path: `users/${props.match.params.user2}` },
      { path: filesPath }
    ];
  }),
  connect(( firebase ,props) => ({
    messages: getVal(
      firebase,
      `data/messages/${props.match.params.user1}-${props.match.params.user2}`
    ), // lodash's get can also be used
    auth: firebase.auth,
    user1: getVal(firebase, `data/users/${props.match.params.user1}`),
    user2: getVal(firebase, `data/users/${props.match.params.user2}`),
    authExists: !!firebase.auth && !!firebase.auth.uid,
  }))
);

class ChatBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { content: "", open: false, imageURL: '' };
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

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
        history.replace("/error");
    }
  }

  handleChangeContent = e => {
    this.setState({ content: e.target.value });
  };

  handleChangeImageContent = e => {
    this.setState({ imageURL: e.target.value });
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

  handleUploadfile=(event)=>{
    const file = event.target.files[0]
    this.props.firebase.uploadFiles(filesPath, file, filesPath);
    console.log(event.target.files[0]);
  }

  handleClick = async () => {
    if (this.state.open) {
      if (!testImage(this.state.imageURL)) {
        alert('Wrong image URL');
        return;
      }

    }
    if (!isEmpty(this.props.auth)) {
      await this.props.firebase.push(
        `messages/${this.props.match.params.user1}-${this.props.match.params.user2}`,
        {
          content: this.state.content,
          userId: this.props.auth.uid,
          chatTime: moment().toISOString(),
          username: this.props.auth.displayName,
          imageURL: this.state.imageURL
        }
      );
    }
    await this.setState({ content: "", imageURL: "", open: false });
  };

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

    var renderMessages = messages_Arr.map((message, index) => {
      if (!isEmpty(messages)) {
        console.log(message.imageURL);
        if (message.userId === auth.uid)
          return (
            <Message
              key={index}
              content={message.content}
              name={message.username}
              date={moment(message.chatTime).format('LLL')}
              owner={true}
              imageURL={message.imageURL}
            />
          );
        else
          return (
            <Message
              key={index}
              content={message.content}
              name={message.username}
              date={moment(message.chatTime).format('LLL')}
              owner={false}
              imageURL={message.imageURL}
            />
          );
      }
    });

    return (
      <Fragment>

        {/* Dialog for image link input */}
        <Dialog
          open={this.state.open}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
            {"Insert your image URL"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <Input
                placeholder="Image URL"
                inputProps={{
                  'aria-label': 'Image URL',
                }}
                onChange={e => this.handleChangeImageContent(e)}
                value={this.state.imageURL}
                style={{ width: "100%" }}
              />
              Preview
              <img src={this.state.imageURL} style={{ maxWidth: "600px" }} alt="preview" />
              <input type="file" onChange={this.handleUploadfile}/>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={this.handleClick} color="primary">
              Send
            </Button>
          </DialogActions>
        </Dialog>

        <UserList />
        <div className="chat">
          <div className="chat-header clearfix">
            <img
              src={otherUser.avatarUrl}
              alt="avatar"
              onClick={this.handleClick}
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
            <Button onClick={this.handleClick} variant="contained" color="secondary">Send</Button>
            <Button onClick={this.handleClickOpen} variant="contained" color="secondary">Image</Button>
          </div>
        </div>
      </Fragment>
    );
  }
}

function testImage(URL) {
  try {
    var img = document.createElement("img");
    img.src = URL;
  } catch (err) {
    return false;
  }

  if (img.height > 0) {
    return true;
  } else {
    return false;
  }
}


export default withRouter(enhance(ChatBox));
