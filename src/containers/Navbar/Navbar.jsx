import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Button from "@material-ui/core/Button";

import { connect } from "react-redux";
import { userLogin, checkLogined, userLogout } from "../../actions";

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

  componentDidMount() {
    this.props.checkLogined();
  }

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleSignIn = () => {
    this.props.userLogin();
  };

  handleSignOut = () => {
    this.props.userLogout();
  };

  render() {
    const { classes } = this.props;
    const { auth, anchorEl } = this.state;
    const open = Boolean(anchorEl);
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
            Chat Group
          </Typography>
          {this.props.data.logined && (
            <div>
              <IconButton
                aria-owns={open ? "menu-appbar" : undefined}
                aria-haspopup="true"
                onClick={this.handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right"
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right"
                }}
                open={open}
                onClose={this.handleClose}
              >
                <MenuItem onClick={this.handleClose}>
                  {this.props.data.user.displayName}
                </MenuItem>
                <MenuItem onClick={this.handleSignOut}>Logout</MenuItem>
              </Menu>
            </div>
          )}
          {!this.props.data.logined && (
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

function mapStateToProps(state) {
  return {
    data: state.loginGoogle
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userLogin: () => dispatch(userLogin()),
    checkLogined: () => dispatch(checkLogined()),
    userLogout: () => dispatch(userLogout())
  };
}

Navbar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Navbar));