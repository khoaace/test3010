import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { firebaseConnect, isLoaded, isEmpty } from "react-redux-firebase";
import { Values } from "react-lodash";

const Profile = ({ firebase, auth, profile, users, presence, sessions }) => {
  var _ = require("lodash");

  var arr;
  var test;
  if (!isEmpty(sessions)) {
    arr = _.map(sessions, (val, id) => {
      return { ...val, id: id };
    });
  }
  console.log(test);
  if (!isEmpty(presence)) {
    if (presence["EIPCnZOhpcdu9Syv6liIagZBtAc2"]) console.log("best");
  }

  return (
    <div>
      <hr />
      {JSON.stringify(auth)}
      <hr />
      {JSON.stringify(profile)}
      <hr />
      {JSON.stringify(users)}
      <hr />
      {JSON.stringify(presence)}
      <hr />
      {JSON.stringify(sessions)}
      <hr />
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
      path: "/sessions",
      queryParams: ["orderByValue:EIPCnZOhpcdu9Syv6liIagZBtAc2"]
    }
  ]),
  connect(state => ({
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    users: state.firebase.data["users"],
    presence: state.firebase.data["presence"],
    sessions: state.firebase.data["sessions"]
  }))
)(Profile);
