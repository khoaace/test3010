import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import rootReducer from "./reducers";
import thunk from "redux-thunk";
import * as serviceWorker from "./serviceWorker";
import { compose } from "redux";
import { reactReduxFirebase } from "react-redux-firebase";
import firebase from "firebase";
import { reduxFirestore } from "redux-firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCkyGjw4vdSlBEDpU3q7lHI6ooAy1kjQIk",
  authDomain: "chat-group-tdk.firebaseapp.com",
  databaseURL: "https://chat-group-tdk.firebaseio.com",
  projectId: "chat-group-tdk",
  storageBucket: "chat-group-tdk.appspot.com",
  messagingSenderId: "551455828957"
};

firebase.initializeApp(firebaseConfig);

// react-redux-firebase options
const config = {
  userProfile: "users", // firebase root where user profiles are stored
  enableLogging: false, // enable/disable Firebase's database logging
  presence: "presence", // where list of online users is stored in database
  sessions: "sessions" // where list of user sessions is stored in database (presence must be enabled)
};

// Add redux Firebase to compose
const createStoreWithFirebase = compose(
  reduxFirestore(firebase),
  reactReduxFirebase(firebase, config)
)(createStore);

const store = createStoreWithFirebase(rootReducer, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
