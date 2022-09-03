import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from "react-redux";
import OnboardingModal from "../common/OnboardingModal";
import "../../assets/scss/onboarding/_onboarding.scss";

class Home2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: true
    }
  }

  componentDidMount() { }

  onClose = () => {
    console.log("on close");
    this.setState({ showModal: false })
  }

  render() {

    return (
      <>
        <OnboardingModal
          show={this.state.showModal}
          onHide={this.onClose}
        >
        </OnboardingModal>
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
Home2.propTypes = {
  // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Home2);