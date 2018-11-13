import React, { Component, Fragment } from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { routesMain } from "./routes/index";

import Navbar from "./containers/Navbar";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Fragment>
          <Navbar />
          <div>{routesMain()}</div>
        </Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
