import React from "react";
import { connect } from "react-redux";

import history from "../history";

class Error extends React.Component {
  componentWillReceiveProps({ authExists, auth }) {
    if (authExists) {
      history.replace(`/chat/${auth.uid}/${auth.uid}`);
    }
  }
  render() {
    return (
      <center>
        <h1>404 NOT FOUND</h1>
      </center>
    );
  }
}

export default connect(({ firebase: { auth } }) => ({
  authExists: !!auth && !!auth.uid,
  auth: auth
}))(Error);
