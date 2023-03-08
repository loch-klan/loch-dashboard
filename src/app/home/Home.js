import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from "react-redux";
import OnBoarding from "../onboarding";
import "../../assets/scss/onboarding/_onboarding.scss";
import { Image } from "react-bootstrap";
import Banner from "../../assets/images/Overlay.png";
import { deleteToken, getToken } from '../../utils/ManageToken';
import { GetDefaultPlan } from '../common/Api';
import UpgradeModal from '../common/upgradeModal';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: true,
      signedIn: false,
      upgradeModal: false,
      isStatic: true,
      triggerId: 0,
      selectedId:0,
    };
  }

  upgradeModal = () => {
    this.setState(
      {
        upgradeModal: !this.state.upgradeModal,
      },
    );
  };

  componentDidMount() {
    const searchParams = new URLSearchParams(this.props.location.search);
    const planId = searchParams.get("plan_id");
    // console.log(planId);
    if (planId) {
      // console.log("plan id", planId);
      this.setState({
        selectedId:planId,
      }, () => {
        this.upgradeModal();
      });
    } else {
      if (getToken()) {
        this.props.history.push("/home");
      } else {
        deleteToken();
           localStorage.setItem("defi_access", true);
        let isRefresh = JSON.parse(localStorage.getItem("refresh"));
        if (!isRefresh) {
          localStorage.setItem("refresh", true);
          window.location.reload(true);
        }
      }
    }

    GetDefaultPlan();
  }

  render() {
    return (
      <>
        {this.signedIn ? null : (
          <div>
            <Image src={Banner} className="overlay-banner" />
            <OnBoarding {...this.props} />
          </div>
        )}
        {this.state.upgradeModal && (
          <UpgradeModal
            show={this.state.upgradeModal}
            onHide={this.upgradeModal}
            history={this.props.history}
            triggerId={this.state.triggerId}
            // isShare={localStorage.getItem("share_id")}
            isStatic={this.state.isStatic}
            selectedId={this.state.selectedId}
          />
        )}
      </>
    );
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