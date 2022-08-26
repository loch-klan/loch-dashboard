import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from "react-redux";
import OnBoarding from "../onboarding";
import "../../assets/scss/onboarding/_onboarding.scss";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: true,
      signedIn: false,
    }
  }

  componentDidMount() { }

  render() {
    return (
      <>
        {/* <h1 className="red-hat-display-black f-s-50 lh-30 ">Hello</h1> */}
        {this.signedIn ? null : <OnBoarding />}
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