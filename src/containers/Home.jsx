import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { firebaseConnect, isLoaded, isEmpty } from "react-redux-firebase";

const users = "users";
const Home = ({ firebase, users }) => {
  return (
    <div>
      <h1>Todos</h1>
      <div>{JSON.stringify(users)}</div>
      <button onClick={() => firebase.watchEvent("value", users)}>
        Load Todos
      </button>
      <hr />
      {/*       <div>{JSON.stringify(presence)}</div> */}
    </div>
  );
};

export default compose(
  firebaseConnect([
    {
      path: "/presence"
    }
  ]),
  connect(state => ({
    users: state.firebase.data["presence"]
    // todos: state.firebase.ordered[todosPath] // for ordered data (array)
  }))
)(Home);
