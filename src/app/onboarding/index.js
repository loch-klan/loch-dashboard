import React, { Component } from 'react';
import { connect } from "react-redux";
import OnboardingModal from "../common/OnboardingModal";
import "../../assets/scss/onboarding/_onboarding.scss";
import InfoIcon from "../../assets/images/icons/info-icon.svg";
import WalletIcon from "../../assets/images/icons/wallet-icon.svg";
// import SignInIcon from "../../image/profile-icon.png";
import SignInIcon from '../../assets/images/icons/ActiveProfileIcon.svg'
import AddWallet from "./addWallet";
import SignIn from "./signIn";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import { Image } from "react-bootstrap";
import LockIcon from "../../assets/images/icons/lock-icon.svg";
import LinkIcon from "../../assets/images/icons/link.svg";
import {
  LPConnectExchange,
  OnboardingPage,
  PrivacyMessage, TimeSpentOnboarding
} from "../../utils/AnalyticsFunctions.js";
import { GetAllPlan } from '../common/Api';
import UpgradeModal from '../common/upgradeModal';
import ConnectModal from '../common/ConnectModal';
import { getCurrentUser } from '../../utils/ManageToken';
// export { default as OnboardingReducer } from "./OnboardingReducer";
class OnBoarding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: true,
      signInReq: false,
      isVerificationRequired: false,
      isVerified: false,
      currentActiveModal: "signIn",
      startTime: "",
      // showSignText  :false

      // Upgrade
      upgradeModal: false,
      isStatic: false,
      triggerId: 1,
      showPrevModal: true,

      // connect exchange
      connectExchangeModal: false,
      walletAddress: null,
      exchanges: null,

      // showEmailPopup
      showEmailPopup: true,
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
        // this.props.hideModal(value);
        // console.log("eejbhf")
        const userDetails = JSON.parse(localStorage.getItem("lochUser"));
        if (userDetails) {
          this.props.history.push("/home");
        }
      }
    );
  };

  handleConnectModal = (address = this.state.walletAddress) => {
    // console.log("test", address)
    this.setState({
      connectExchangeModal: !this.state.connectExchangeModal,
      walletAddress: address
    }, () => {
      if (this.state.connectExchangeModal) {
         LPConnectExchange({
           session_id: getCurrentUser().id,
           email_address: getCurrentUser().email,
         });
      }
      let value = this.state.connectExchangeModal ? false : true;
      this.setState({
        showPrevModal: value,
      });
      // console.log("test 2")
    });
  }

  handleBackConnect = (exchanges = this.state.exchanges) => {
    // console.log("backed clicked in index.js")
    this.setState(
      {
        connectExchangeModal: !this.state.connectExchangeModal,
        walletAddress: this.state.walletAddress,
        exchanges: exchanges
      },
      () => {
        let value = this.state.connectExchangeModal ? false : true;
        this.setState({
          showPrevModal: value,
        });
        
      }
    );
  }

  componentDidMount() {
    this.state.startTime = new Date() * 1;
    // console.log("page Enter", (this.state.startTime / 1000));
    // let date = moment();
    // let currentDate = date.format("D/MM/YYYY");
    // // "17/06/2022"

    OnboardingPage({});

      // console.log("test mount index.js");
  }

  componentWillUnmount() {
    let endTime = new Date() * 1;
    let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
    // console.log("page Leave", endTime/1000);
    // console.log("Time Spent", TimeSpent);
    TimeSpentOnboarding({ time_spent: TimeSpent });
   
  }
  onClose = () => {
    this.setState({ showModal: false });
  };

  handleStateChange = (value) => {
    if (value === "verifyCode") {
      this.setState({
        currentActiveModal: value,
      });
    } else {
      this.setState({
        currentActiveModal: "signIn",
      });
    }
  };
  switchSignIn = (e) => {
    // console.log("active modalin indexx",this.state.currentActiveModal)
    // console.log("verification req indexx",this.state.isVerificationRequired)
    if (this.state.currentActiveModal === "verifyCode") {
      this.setState({
        // isVerificationRequired:false,
        signInReq: true,
        currentActiveModal: "signIn",
      });
    } else {
      this.setState({
        signInReq: !this.state.signInReq,
      });
    }
    // if(this.state.showSignText){
    //     this.handleShowSignText(false)
    // }
  };
  // handleShowSignText = (val)=>{
  //     console.log("HELLO",val)
  //     this.setState({
  //         showSignText:val
  //     })
  // }

  privacymessage = () => {
    PrivacyMessage({});
    // console.log("on hover privacy msg");
  };
  render() {
        return (
      <>
        {this.state.showPrevModal && (
          <OnboardingModal
            show={this.state.showModal}
            showImage={true}
            onHide={this.onClose}
            
            title={this.state.signInReq ? "Sign in" : "Welcome to Loch"}
            subTitle={
              this.state.signInReq
                ? "Get right back into your account"
                : "Add any ENS or wallet address(es) to get started"
            }
            icon={this.state.signInReq ? SignInIcon : WalletIcon}
            isSignInActive={this.state.signInReq}
            handleBack={this.switchSignIn}
          >
            {this.state.signInReq ? (
              <SignIn
                isVerificationRequired={this.state.isVerificationRequired}
                history={this.props.history}
                activemodal={this.state.currentActiveModal}
                signInReq={this.state.signInReq}
                handleStateChange={this.handleStateChange}
              />
            ) : (
              <AddWallet
                {...this.props}
                switchSignIn={this.switchSignIn}
                hideModal={this.props.hideModal}
                upgradeModal={this.upgradeModal}
                walletAddress={this.state.walletAddress}
                connectWallet={this.handleConnectModal}
                exchanges={this.state.exchanges}

                // showSignText={this.state.showSign}
                // handleShowSignText={this.handleShowSignText}
              />
            )}
            <div className="ob-modal-body-info">
              {/* {
                        this.state.signInReq ?
                         null
                         :
                         this.state.showSignText ?
                          <h4 className='inter-display-medium f-s-13 lh-16 grey-ADA'>
                            Already have an account?
                             <span className='inter-display-bold black-191 cp' onClick={this.switchSignIn}>Sign in</span>
                            </h4>
                            :
                            ""
                          } */}
              <p className="inter-display-medium f-s-13 lh-16 grey-ADA">
                At Loch, we care intensely about your privacy and pseudonymity.
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
                  />
                </CustomOverlay>
              </p>
            </div>
          </OnboardingModal>
        )}
        {this.state.upgradeModal && (
          <UpgradeModal
            show={this.state.upgradeModal}
            onHide={this.upgradeModal}
            history={this.props.history}
            triggerId={this.state.triggerId}
            signinBack={true}
            from="home"
            pname="index.js"
            // isShare={localStorage.getItem("share_id")}
            // isStatic={this.state.isStatic}
          />
        )}

        {this.state.connectExchangeModal && (
          <ConnectModal
            show={this.state.connectExchangeModal}
            onHide={this.handleConnectModal}
            history={this.props.history}
            headerTitle={"Connect exchanges"}
            modalType={"connectModal"}
            iconImage={LinkIcon}
            ishome={true}
            tracking="landing page"
            walletAddress={this.state?.walletAddress}
            exchanges={this.state.exchanges}
            handleBackConnect={this.handleBackConnect}
          />
        )}
      </>
    );
  }
}

const mapStateToProps = state => ({
});
const mapDispatchToProps = {
}
OnBoarding.propTypes = {
};

export default connect(mapStateToProps, mapDispatchToProps)(OnBoarding);