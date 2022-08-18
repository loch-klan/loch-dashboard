import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from "react-redux";
import ChangePasswordModal from '../common/ChangePasswordModal';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastName: "",
      changePasswordModal: false,
    }
  }

  componentDidMount() { }

  handleSubmit = () => {
    console.log('hey');
  }

  openCloseChangePassword = () => {
    this.setState({ changePasswordModal: !this.state.changePasswordModal });
  };

  render() {
    return (
      <>
        {/* <Sidenav />
        <Navbar /> */}
        {
          this.state.changePasswordModal &&
          <ChangePasswordModal
            show={this.state.changePasswordModal}
            handleClose={this.openCloseChangePassword}
          />
        }
        <h1>Hello</h1>
      </>

    )
  }
}

const mapStateToProps = state => ({
  homeState: state.HomeState
});
const mapDispatchToProps = {
  // getPosts: fetchPosts
}
Home.propTypes = {
  // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);