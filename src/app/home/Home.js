import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from "react-redux";
import OnBoarding from "../onboarding";
import "../../assets/scss/onboarding/_onboarding.scss";
import { Image } from "react-bootstrap";
import Banner from "../../assets/images/Overlay.png";
import { deleteToken, getToken } from '../../utils/ManageToken';
import { GetDefaultPlan } from '../common/Api';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: true,
      signedIn: false,
    }
  }

  componentDidMount() {
    if (getToken()) {
      this.props.history.push("/home");
    } else {
      deleteToken();
         let isRefresh = JSON.parse(localStorage.getItem("refresh"));
         if (!isRefresh) {
           localStorage.setItem("refresh", true);
           window.location.reload(true);
         }
    }
     GetDefaultPlan();
 
  }

  render() {
    return (
      <>
        {this.signedIn ? null :
          <div>
            <Image src={Banner} className="overlay-banner" />
            <OnBoarding {...this.props}/>
          </div>}

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