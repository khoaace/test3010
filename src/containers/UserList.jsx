import React from "react";
import { firebaseConnect, isLoaded, isEmpty } from "react-redux-firebase";

import { compose } from "redux";
import { connect } from "react-redux";
import UserSection from "../components/User";
import List from "@material-ui/core/List";

import Notification from "../components/Notification";
import Divider from "@material-ui/core/Divider";

var _ = require("lodash");
require("../style/style.scss");

var userArr = [];

class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { search: "", userList: [] };
  }
  handleSearch = e => {
    this.setState({ search: e.target.value });
  };

  handleSortUser = async (auth, users, messages, profile, presence) => {
    let users_arr = [];
    users_arr = _.map(users, (val, id) => {
      return { ...val, id: id };
    });
    let usersSearchArr = [];
    if (this.state.search.trim() !== "") {
      usersSearchArr = users_arr.map((user, index) => {
        if (
          user.displayName
            .toLowerCase()
            .search(this.state.search.toLowerCase().trim()) !== -1
        ) {
          return user;
        }
        return null;
      });
      userArr = usersSearchArr;
    } else {
      if (profile.favoriteList !== null && profile.favoriteList !== undefined) {
        let pos = profile.favoriteList.map(function (e) { return e.favorite; }).indexOf(true);
        if (pos !== -1) {
          let favoriteUser = users_arr.filter((user, index) => (profile.favoriteList[index].favorite && presence[user.id]));
          let normalUser = users_arr.filter((user, index) => (!profile.favoriteList[index].favorite || !presence[user.id]));
          let lastResult = favoriteUser.concat(sortByMessage(messages, normalUser, auth));
          userArr = lastResult;
        }
        else {
          userArr = sortByMessage(messages, users_arr, auth);
        }
      }
    }
  };

  updateFavotireList = () => {
    const { firebase, users, profile, auth } = this.props;
    let favoriteList = [];
    let users_arr = _.map(users, (val, id) => {
      return { ...val, id: id };
    });
    if (profile.favoriteList === undefined) {
      for (let i = 0; i < users_arr.length; i++) {
        favoriteList.push({ favorite: false, id: users_arr[i].id });
      }
      firebase
        .database()
        .ref("users/" + auth.uid + "/favoriteList")
        .set(favoriteList);
    }
    else {
      if (profile.favoriteList.length !== users_arr.length) {
        for (let i = 0; i < users_arr.length; i++) {
          if (profile.favoriteList[i] === null || profile.favoriteList[i] === undefined) {
            favoriteList.push({ favorite: false, id: users_arr[i].id });
          }
          else {
            favoriteList.push({ favorite: profile.favoriteList[i].favorite, id: users_arr[i].id });
          }
        }
        firebase
          .database()
          .ref("users/" + auth.uid + "/favoriteList")
          .set(favoriteList);
      }
      else
        return;
    }
  }

  render() {
    const { users, presence, messages, auth, profile } = this.props;
    var user_Render = [];
    if (
      !isEmpty(users) &&
      !isEmpty(auth) &&
      !isEmpty(profile) &&
      (!isEmpty(messages) || messages === null)
    ) {
      this.updateFavotireList();
      this.handleSortUser(auth, users, messages, profile, presence);
      user_Render = userArr.map((user, index) => {
        if (user !== undefined && user !== null) {
          if (!isEmpty(presence) && isLoaded(presence)) {
            if (presence[user.id]) {
              return (
                <UserSection
                  key={index}
                  id={user.id}
                  displayName={user.displayName}
                  avatarUrl={user.avatarUrl}
                  status={"online"}
                />
              );
            } else {
              return (
                <UserSection
                  key={index}
                  id={user.id}
                  displayName={user.displayName}
                  avatarUrl={user.avatarUrl}
                  status={"offline"}
                  lastLogin={user.lastLogin}
                />
              );
            }
          } else {
            return (
              <UserSection
                key={index}
                id={user.id}
                displayName={user.displayName}
                avatarUrl={user.avatarUrl}
                status={"offline"}
                lastLogin={user.lastLogin}
              />
            );
          }
        }
        return null;
      });
    }
    return (
      <div className="container clearfix">
        {isLoaded(users) || isLoaded(presence) ? (
          <Notification open={true} message={"Loading"} />
        ) : (
            <Notification open={true} message={"Loading"} />
          )}
        <div className="people-list" id="people-list">
          <div className="search">
            <input
              type="text"
              placeholder="search"
              onChange={this.handleSearch}
            />
            <i className="fa fa-search" />
          </div>
          <List component="nav">
            <Divider light />
            {user_Render}
          </List>
        </div>
      </div>
    );
  }
}

export default compose(
  firebaseConnect([
    {
      path: "/users"
    },
    {
      path: "/presence"
    },
    {
      path: "/sessions"
    },
    {
      path: "/messages"
    }
  ]),
  connect(state => ({
    users: state.firebase.data["users"],
    presence: state.firebase.data["presence"],
    sessions: state.firebase.data["sessions"],
    messages: state.firebase.data["messages"],
    auth: state.firebase.auth,
    profile: state.firebase.profile
  }))
)(UserList);

function sortUid(user1_id, user2_id) {
  if (user1_id < user2_id) return `${user1_id}-${user2_id}`;
  else return `${user2_id}-${user1_id}`;
}

function sortByMessage(messages, users_arr, auth) {
  if (messages !== null) {
    let result = users_arr.map((user, index) => {
      if (sortUid(auth.uid, user.userId) in messages) {
        if (messages[sortUid(auth.uid, user.userId)] !== null) {
          let user_messgage = Object.values(
            messages[sortUid(auth.uid, user.userId)]
          );
          let time = user_messgage[user_messgage.length - 1].chatTime;
          return { ...user, lastChat: time };
        } else {
          return { ...user, lastChat: "0" };
        }
      }
      return { ...user, lastChat: "0" };
    });
    let lastresult = _.orderBy(result, "lastChat", "desc");
    return lastresult;
  } else {
    return users_arr;
  }
}
