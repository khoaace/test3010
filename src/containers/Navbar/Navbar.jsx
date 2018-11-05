import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";

import { compose } from "redux";
import { connect } from "react-redux";
import { firebaseConnect, isLoaded, isEmpty } from "react-redux-firebase";

const styles = {
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
};

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null
    };
  }

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleSignIn = () => {
    this.props.firebase
      .login({ provider: "google", type: "popup" })
      .then(() => {
        console.log(this.props.auth);
      });
  };

  handleSignOut = () => {
    this.props.firebase.logout();
    window.location.href = "/";
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
    var currentDate = new Date();
    const open = Boolean(anchorEl);
    if (!isEmpty(this.props.auth))
      this.props.firebase.updateProfile({
        lastLogin: currentDate,
        endedAt: this.props.firebase.database.ServerValue.TIMESTAMP
      });
    return (
      <AppBar position="static">
        <Toolbar>
          <IconButton
            className={classes.menuButton}
            color="inherit"
            aria-label="Menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            Mét sen gơ
          </Typography>
          {!isEmpty(this.props.auth) && (
            <div>
              <IconButton
                aria-owns={open ? "menu-appbar" : undefined}
                aria-haspopup="true"
                onClick={this.handleMenu}
                color="inherit"
              >
                <Avatar
                  alt="Remy Sharp"
                  src={this.props.auth.photoURL}
                  className={classes.avatar}
                />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right"
                }}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "right"
                }}
                open={open}
                onClose={this.handleClose}
              >
                <MenuItem onClick={this.handleClose}>
                  {this.props.auth.displayName}
                </MenuItem>
                <MenuItem onClick={this.handleSignOut}>Logout</MenuItem>
              </Menu>
            </div>
          )}
          {isEmpty(this.props.auth) && (
            <div>
              <Button color="inherit" onClick={this.handleSignIn}>
                Login
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
    );
  }
}

Navbar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default compose(
  firebaseConnect(), // withFirebase can also be used
  connect(({ firebase: { auth } }) => ({ auth }))
)(withStyles(styles)(Navbar));
