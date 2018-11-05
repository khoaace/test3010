import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { isLoaded, isEmpty } from "react-redux-firebase";

import history from "../history";

class Login extends React.Component {
  componentWillReceiveProps({ authExists, auth }) {
    if (authExists) {
      history.replace(`/chat/${auth.uid}/${auth.uid}`);
    }
  }
  render() {
    return <h1>Đăng nhập đi má</h1>;
  }
}

export default connect(({ firebase: { auth } }) => ({
  authExists: !!auth && !!auth.uid,
  auth: auth
}))(Login);
