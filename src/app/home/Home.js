import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from "react-redux";
import OnBoarding from "../onboarding";
import "../../assets/scss/onboarding/_onboarding.scss";
import { Image } from "react-bootstrap";
import Banner from "../../assets/images/Overlay.png";
import { deleteToken, getToken } from '../../utils/ManageToken';
import { getAllCurrencyRatesApi, GetDefaultPlan, setPageFlagDefault } from '../common/Api';
import UpgradeModal from '../common/upgradeModal';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: true,
      signedIn: true,
      upgradeModal: false,
      isStatic: true,
      triggerId: 0,
      selectedId: 0,

      showPrevModal: true,
    };
  }

  upgradeModal = () => {
    this.setState(
      {
        upgradeModal: !this.state.upgradeModal,
      },
      () => {
        let value = this.state.upgradeModal ? false : true;
        this.setState({
          showPrevModal: value,
        });
      }
    );
  };

  componentDidMount() {
    const searchParams = new URLSearchParams(this.props.location.search);
    const planId = searchParams.get("plan_id");
let currencyRates = JSON.parse(localStorage.getItem("currencyRates"));
    if (!currencyRates) {
      getAllCurrencyRatesApi();
    }
    
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
          this.props.setPageFlagDefault();
        deleteToken();
        localStorage.setItem("defi_access", true);
         localStorage.setItem("isPopup", true);
        let isRefresh = JSON.parse(localStorage.getItem("refresh"));
        if (!isRefresh) {
          localStorage.setItem("refresh", true);
          window.location.reload(true);
        }
      }
    }

    GetDefaultPlan();
   
  }

  hideModal = (value) => {
    
  }

  render() {
    return (
      <>
        {this.state.showPrevModal && (
          <div>
            <Image src={Banner} className="overlay-banner" />
            <OnBoarding {...this.props} hideModal={this.hideModal} />
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
            signinBack={true}
            form="home"
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
  setPageFlagDefault
}
Home.propTypes = {
  // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);