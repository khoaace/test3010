import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import firebase, { auth, provider } from "./config/firebase";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentItem: "",
      username: "",
      items: [],
      user: null // <-- add this line
    };
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
      }
    });
  }

  logout = () => {
    auth.signOut().then(() => {
      this.setState({
        user: null
      });
    });
  };

  login = () => {
    auth.signInWithPopup(provider).then(result => {
      const user = result.user;
      this.setState({
        user
      });
    });
  };
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {this.state.user ? (
            <button
              onClick={this.logout}
              style={{ width: "200px", height: "200px" }}
            >
              Log Out
            </button>
          ) : (
            <button
              onClick={this.login}
              style={{ width: "200px", height: "200px" }}
            >
              Log In
            </button>
          )}
        </header>
        {this.state.user ? (
          <div>
            <div className="user-profile">
              <img src={this.state.user.photoURL} />
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

export default App;
