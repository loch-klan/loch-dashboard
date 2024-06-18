import React, { Component } from "react";
import { connect } from "react-redux";

import SignInIcon from "../../assets/images/icons/ActiveProfileIcon.svg";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import WalletIcon from "../../assets/images/icons/wallet-icon.svg";
import LockIcon from "../../assets/images/icons/lock-icon.svg";
import InfoIcon from "../../assets/images/icons/info-icon.svg";
import LinkIcon from "../../assets/images/icons/link.svg";
import OnboardingModal from "../common/OnboardingModal";
import "../../assets/scss/onboarding/_onboarding.scss";
import UpgradeModal from "../common/upgradeModal";
import ConnectModal from "../common/ConnectModal";
import { Image } from "react-bootstrap";
import AddWallet from "./addWallet";
import SignIn from "./signIn";

import {
  OnboardingPage,
  PrivacyMessage,
  TimeSpentOnboarding,
} from "../../utils/AnalyticsFunctions.js";
import { mobileCheck } from "../../utils/ReusableFunctions";
class OnBoarding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: "",
    };
  }

  startPageView = () => {
    this.setState({ startTime: new Date() * 1 });
    OnboardingPage({});
    // Inactivity Check
    window.checkOnboardingTimer = setInterval(() => {
      this.checkForInactivity();
    }, 900000);
  };
  componentDidMount() {
    if (!mobileCheck()) {
      this.startPageView();
      this.updateTimer(true);
    }
  }
  updateTimer = (first) => {
    const tempExistingExpiryTime = window.localStorage.getItem(
      "onboardingPageExpiryTime"
    );
    if (!tempExistingExpiryTime && !first) {
      this.startPageView();
    }
    const tempExpiryTime = Date.now() + 1800000;
    window.localStorage.setItem("onboardingPageExpiryTime", tempExpiryTime);
  };
  endPageView = () => {
    clearInterval(window.checkOnboardingTimer);
    window.localStorage.removeItem("onboardingPageExpiryTime");
    if (this.state.startTime) {
      let endTime = new Date() * 1;
      let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
      TimeSpentOnboarding({ time_spent: TimeSpent });
    }
  };
  checkForInactivity = () => {
    const tempExpiryTime = window.localStorage.getItem(
      "onboardingPageExpiryTime"
    );
    if (tempExpiryTime && tempExpiryTime < Date.now()) {
      this.endPageView();
    }
  };
  componentWillUnmount() {
    const tempExpiryTime = window.localStorage.getItem(
      "onboardingPageExpiryTime"
    );
    if (tempExpiryTime) {
      this.endPageView();
    }
  }

  privacymessage = () => {
    PrivacyMessage({});
    this.updateTimer();
  };
  render() {
    return (
      <>
        {this.props.showPrevModal ? (
          <OnboardingModal
            show={this.props.showModal}
            showImage={true}
            onHide={this.props.onboardingOnClose}
            title={this.props.signInReq ? "Sign in" : "Welcome to Loch"}
            subTitle={
              this.props.signInReq
                ? "Get right back into your account"
                : "Add your wallet address(es) to get started"
            }
            icon={this.props.signInReq ? SignInIcon : WalletIcon}
            isSignInActive={this.props.signInReq}
            handleBack={this.props.onboardingSwitchSignIn}
            modalAnimation={this.props.modalAnimation}
          >
            {this.props.signInReq ? (
              <SignIn
                isVerificationRequired={this.props.isVerificationRequired}
                history={this.props.history}
                activemodal={this.props.currentActiveModal}
                signInReq={this.props.signInReq}
                handleStateChange={this.props.onboardingHandleStateChange}
              />
            ) : (
              <AddWallet
                {...this.props}
                makeTrendingAddressesVisible={
                  this.props.makeTrendingAddressesVisible
                }
                addTrendingAddress={this.props.addTrendingAddress}
                trendingAddresses={this.props.trendingAddresses}
                isTrendingAddresses={this.props.isTrendingAddresses}
                switchSignIn={this.props.onboardingSwitchSignIn}
                hideModal={this.props.hideModal}
                upgradeModal={this.props.onboardingHandleUpgradeModal}
                walletAddress={this.props.onboardingWalletAddress}
                connectWallet={this.props.onboardingShowConnectModal}
                exchanges={this.props.exchanges}
                copyWalletAddress={this.props.copyWalletAddress}
              />
            )}
            <div className="ob-modal-body-info">
              <p className="inter-display-medium f-s-13 lh-16 grey-ADA">
                Don't worry. All your information remains private and anonymous.
                <CustomOverlay
                  text="Your privacy is protected. No third party will know which wallet addresses(es) you added."
                  position="top"
                  isIcon={true}
                  IconImage={LockIcon}
                  isInfo={true}
                  className={"fix-width"}
                >
                  <Image
                    src={InfoIcon}
                    className="info-icon"
                    onMouseEnter={this.privacymessage}
                    style={{ cursor: "pointer" }}
                  />
                </CustomOverlay>
              </p>
            </div>
          </OnboardingModal>
        ) : null}
        {this.props.upgradeModal && (
          <UpgradeModal
            show={this.props.upgradeModal}
            onHide={this.props.onboardingHandleUpgradeModal}
            history={this.props.history}
            triggerId={this.props.triggerId}
            signinBack={true}
            from="home"
            pname="index"
          />
        )}

        {this.props.connectExchangeModal && (
          <ConnectModal
            show={this.props.connectExchangeModal}
            onHide={this.props.onboardingHideConnectModal}
            history={this.props.history}
            headerTitle={"Connect exchanges"}
            modalType={"connectModal"}
            iconImage={LinkIcon}
            ishome={true}
            tracking="landing page"
            walletAddress={this.props?.onboardingWalletAddress}
            exchanges={this.props.exchanges}
            handleBackConnect={this.props.onboardingHandleBackConnect}
            onboardingHandleUpdateConnect={
              this.props.onboardingHandleUpdateConnect
            }
            modalAnimation={this.props.modalAnimation}
          />
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {};
OnBoarding.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(OnBoarding);
