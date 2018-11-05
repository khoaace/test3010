import React from "react";
import { firebaseConnect, isLoaded, isEmpty } from "react-redux-firebase";

import { compose } from "redux";
import { connect } from "react-redux";
import UserSection from "./User";

import Notification from "../components/Notification";

require("../style/style.scss");

const UserList = ({ firebase, users, presence, sessions }) => {
  var _ = require("lodash");
  var users_Arr,
    status_users_Arr,
    user_Render = [];
  if (!isEmpty(users)) {
    users_Arr = _.map(users, (val, id) => {
      return { ...val, id: id };
    });
    status_users_Arr = _.map(presence, (val, id) => {
      return { ...val };
    });
    user_Render = users_Arr.map((user, index) => {
      if (!isEmpty(presence) && isLoaded(presence)) {
        if (presence[user.id]) {
          return (
            <UserSection
              key={index}
              id={user.id}
              displayName={user.displayName}
              avatarUrl={user.avatarUrl}
              status={"online"}
            />
          );
        } else {
  
          return (
            <UserSection
              key={index}
              id={user.id}
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
            id={user.id}
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
        <ul className="list">{user_Render}</ul>
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
    }
  ]),
  connect(state => ({
    users: state.firebase.data["users"],
    presence: state.firebase.data["presence"],
    sessions: state.firebase.data["sessions"]
  }))
)(UserList);
