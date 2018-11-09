import React, { Fragment } from "react";
import moment from "moment";

import { connect } from "react-redux";
import { compose } from "redux";
import { firebaseConnect } from "react-redux-firebase";

import ListItem from "@material-ui/core/ListItem";
import history from "../history";
import Divider from "@material-ui/core/Divider";

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: moment(this.props.lastLogin).fromNow()
    };
  }
  componentDidMount = () => {
    setInterval(async () => {
      await this.setState({ date: moment(this.props.lastLogin).fromNow() });
    }, 1000);
  };
  handleClickUser = () => {
    if (this.props.id < this.props.auth.uid)
      history.replace(`/chat/${this.props.id}/${this.props.auth.uid}`);
    else history.replace(`/chat/${this.props.auth.uid}/${this.props.id}`);
  };
  render() {
    return (
      <Fragment>
        <ListItem button onClick={this.handleClickUser}>
          <img
            src={this.props.avatarUrl}
            alt="avatar"
            style={{
              width: 54,
              height: 54,
              borderRadius: "50%"
            }}
          />
          <div className="about">
            <div className="name">{this.props.displayName}</div>
            <div className="status">
              <i className={`fa fa-circle ${this.props.status}`} />{" "}
              {this.props.status} <br />
              {this.props.lastLogin ? `Last login at ${this.state.date}` : ``}
            </div>
          </div>
          <div style={{ clear: "both" }} />
        </ListItem>
        <Divider light />
      </Fragment>
    );
  }
}

export default compose(
  firebaseConnect([
    {
      path: "/users"
    }
  ]),
  connect(state => ({
    auth: state.firebase.auth
  }))
)(User);
