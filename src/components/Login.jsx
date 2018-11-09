import React from "react";
import { connect } from "react-redux";

import history from "../history";

class Login extends React.Component {
  componentWillReceiveProps({ authExists, auth }) {
    if (authExists) {
      history.replace(`/chat/${auth.uid}/${auth.uid}`);
    }
  }
  render() {
    return (
      <center>
        <h1>You are not logged in. Please log in and try again</h1>
      </center>
    );
  }
}

export default connect(({ firebase: { auth } }) => ({
  authExists: !!auth && !!auth.uid,
  auth: auth
}))(Login);
