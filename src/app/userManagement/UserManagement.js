import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from "react-redux";

class UserManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() { }

  render() {
    return (
      <div>UserManagement Component {this.props.userManagementState}</div>
    )
  }
}

const mapStateToProps = state => ({
  userManagementState: state.UserManagementState
});
const mapDispatchToProps = {
  // getPosts: fetchPosts
}
UserManagement.propTypes = {
  // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManagement);