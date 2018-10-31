import React, { Component, Fragment } from "react";
import logo from "./logo.svg";
import "./App.css";
import firebase, { auth, provider } from "./config/firebase";
import { BrowserRouter } from "react-router-dom";
import { routesMain } from "./routes/index";

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
      console.log(user);
      this.setState({
        user
      });
    });
  };
  render() {
    return (
      <BrowserRouter>
        <Fragment>
          <div>{routesMain()}</div>
        </Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
