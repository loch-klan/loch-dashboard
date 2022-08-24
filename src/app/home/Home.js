import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from "react-redux";
import OnboardingModal from "../common/OnboardingModal";
import "../../assets/scss/onboarding/_onboarding.scss";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: true
    }
    // this.onClose = this.onClose.bind(this);   
  }

  componentDidMount() { }

  onClose = () => {
    console.log("on close");
    this.setState({ showModal: false })
  }

  render() {
  
    return (
      <>
        {/* <h1 className="red-hat-display-black f-s-50 lh-30 ">Hello</h1> */}
        <OnboardingModal show={this.state.showModal} showImage={true} onHide={this.onClose} title="Welcome to Loch">
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
Home.propTypes = {
  // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);