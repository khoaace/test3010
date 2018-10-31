import React from "react";
import { Router, Switch, Route } from "react-router-dom";
import Login from "../components/Login";
import history from "../history";

const routes = [
  {
    path: "/login",
    exact: true,
    main: () => <Login />
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
