import React from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom";
import history from "../history";
import ChatBox from "../containers/ChatBox";
import Login from "../components/Login";

const routes = [
  {
    path: "/login",
    exact: true,
    main: () => <Login />
  },
  {
    path: "/chat/:user1/:user2",
    exact: true,
    main: () => <ChatBox />
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
      <Switch>
        {result}
        <Redirect from="/" to="/login" />
      </Switch>
    </Router>
  );
};
