import React from "react";
import { Router, Switch, Route } from "react-router-dom";
import history from "../history";
import Home from "../components/Home";

const routes = [
  {
    path: "/",
    exact: true,
    main: () => <Home />
  }
];

export const routesMain = () => {
  var result = null;
  if (routes.length > 0) {
    result = routes.map((route, index) => {
      return (
        <Route
          key={index}
          path={route.path}
          exact={route.exact}
          component={route.main}
        />
      );
    });
  }
  return (
    <Router history={history}>
      <Switch>{result}</Switch>
    </Router>
  );
};
