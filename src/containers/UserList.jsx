import React from "react";
import { firebaseConnect, isLoaded, isEmpty } from "react-redux-firebase";

import { compose } from "redux";
import { connect } from "react-redux";
import UserSection from "./User";
import List from "@material-ui/core/List";

import Notification from "../components/Notification";
import Divider from "@material-ui/core/Divider";

var _ = require("lodash");
require("../style/style.scss");

const UserList = ({ firebase, users, presence, messages, sessions, auth }) => {
  var users_Arr,
    user_Render = [];
  if (
    !isEmpty(users) &&
    !isEmpty(auth) &&
    (!isEmpty(messages) || messages === null)
  ) {
    users_Arr = handleSortUser(auth, users, messages);
    user_Render = users_Arr.map((user, index) => {
      if (!isEmpty(presence) && isLoaded(presence)) {
        if (presence[user.userId]) {
          return (
            <UserSection
              key={index}
              id={user.userId}
              displayName={user.displayName}
              avatarUrl={user.avatarUrl}
              status={"online"}
            />
          );
        } else {
          return (
            <UserSection
              key={index}
              id={user.userId}
              displayName={user.displayName}
              avatarUrl={user.avatarUrl}
              status={"offline"}
              lastLogin={user.lastLogin}
            />
          );
        }
      } else {
        return (
          <UserSection
            key={index}
            id={user.userId}
            displayName={user.displayName}
            avatarUrl={user.avatarUrl}
            status={"offline"}
            lastLogin={user.lastLogin}
          />
        );
      }
    });
  }

  return (
    <div className="container clearfix">
      {isLoaded(users) || isLoaded(presence) ? (
        <Notification open={true} message={"Loading"} />
      ) : (
        <Notification open={true} message={"Loading"} />
      )}
      <div className="people-list" id="people-list">
        <div className="search">
          <input type="text" placeholder="search" />
          <i className="fa fa-search" />
        </div>
        <List component="nav">
          {" "}
          <Divider light />
          {user_Render}
        </List>
      </div>
    </div>
  );
};
export default compose(
  firebaseConnect([
    {
      path: "/users"
    },
    {
      path: "/presence"
    },
    {
      path: "/sessions"
    },
    {
      path: "/messages"
    }
  ]),
  connect(state => ({
    users: state.firebase.data["users"],
    presence: state.firebase.data["presence"],
    sessions: state.firebase.data["sessions"],
    messages: state.firebase.data["messages"],
    auth: state.firebase.auth
  }))
)(UserList);

function handleSortUser(auth, users, messages) {
  let users_arr = [];
  users_arr = _.map(users, (val, id) => {
    return { ...val, id: id };
  });
  let result = users_arr.map((user, index) => {
    if (sortUid(auth.uid, user.userId) in messages) {
      if (messages[sortUid(auth.uid, user.userId)] !== null) {
        let user_messgage = Object.values(
          messages[sortUid(auth.uid, user.userId)]
        );
        let time = user_messgage[user_messgage.length - 1].chatTime;
        return { ...user, lastChat: time };
      } else {
        return { ...user, lastChat: "0" };
      }
    }
    return { ...user, lastChat: "0" };
  });
  let lastresult = _.orderBy(result, "lastChat", "desc");
  return lastresult;
}

function sortUid(user1_id, user2_id) {
  if (user1_id < user2_id) return `${user1_id}-${user2_id}`;
  else return `${user2_id}-${user1_id}`;
}
