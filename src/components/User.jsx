import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import moment from "moment";

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: moment(this.props.lastLogin).fromNow()
    };
  }
  componentDidMount = () => {
    var intervalId = setInterval(async () => {
      await this.setState({ date: moment(this.props.lastLogin).fromNow() });
    }, 10000);
  };
  render() {
    return (
      <li className="clearfix">
        <img
          src={this.props.avatarUrl}
          alt="avatar"
          style={{
            width: 54,
            height: 54,
            borderRadius: "50%"
          }}
        />
        <div className="about">
          <div className="name">{this.props.displayName}</div>
          <div className="status">
            <i className={`fa fa-circle ${this.props.status}`} />{" "}
            {this.props.status} <br />
            {this.props.lastLogin ? `Last login at ${this.state.date}` : ``}
          </div>
        </div>
        <div style={{ clear: "both" }} />
        <hr />
      </li>
    );
  }
}

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

export default withStyles(styles)(User);
