import React from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { compose } from "redux";
import { connect } from "react-redux";
import { firebaseConnect, isLoaded, isEmpty } from "react-redux-firebase";
import GoogleButton from "react-google-button";
import history from "../history";

export class LoginPage extends React.Component {
  render() {
    return (
      <div style={{ textAlign: "center" }}>
        <GoogleButton // <GoogleButton/> button can be used instead
          onClick={() =>
            this.props.firebase.login({ provider: "google", type: "popup" })
          }
        >
          Login With Googlesss
        </GoogleButton>
        <br />
        <br />
        <br />
        <br />
        <br />
        <GoogleButton // <GoogleButton/> button can be used instead
          onClick={() => {
            this.props.firebase.logout();
            window.location.href = "/";
          }}
        >
          Logout
        </GoogleButton>
        <div>
          <h2>Auth</h2>
          {!isLoaded(this.props.auth) ? (
            <span>Loading...</span>
          ) : isEmpty(this.props.auth) ? (
            <span>Not Authed</span>
          ) : (
            <pre>{JSON.stringify(this.props.auth, null, 2)}</pre>
          )}
        </div>
      </div>
    );
  }
}

LoginPage.propTypes = {
  firebase: PropTypes.shape({
    login: PropTypes.func.isRequired
  }),
  auth: PropTypes.object
};

export default compose(
  firebaseConnect(), // withFirebase can also be used
  connect(({ firebase: { auth } }) => ({ auth }))
)(LoginPage);
