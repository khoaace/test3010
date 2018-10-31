import React, { Component } from "react";

import { connect } from "react-redux";
import { userLogin, checkLogined, userLogout } from "../actions";

class Login extends Component {
  componentDidMount() {
    this.props.checkLogined();
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          {this.props.data.logined ? (
            <button
              onClick={this.props.userLogout}
              style={{ width: "200px", height: "200px" }}
            >
              Log Out
            </button>
          ) : (
            <button
              onClick={this.props.userLogin}
              style={{ width: "200px", height: "200px" }}
            >
              Log In
            </button>
          )}
        </header>
        {this.props.data.logined ? (
          <div>
            <div className="user-profile">
              <img src={this.props.data.user.photoURL} />
            </div>
          </div>
        ) : (
          <div className="wrapper">
            <p>
              You must be logged in to see the potluck list and submit to it.
            </p>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.loginGoogle
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userLogin: () => dispatch(userLogin()),
    checkLogined: () => dispatch(checkLogined()),
    userLogout: () => dispatch(userLogout())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
