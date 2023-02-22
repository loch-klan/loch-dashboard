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
import {
  OnboardingPage,
  PrivacyMessage, TimeSpentOnboarding
} from "../../utils/AnalyticsFunctions.js";
import { GetAllPlan } from '../common/Api';
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
        }
    }

  componentDidMount() {
    this.state.startTime = new Date() * 1;
    // console.log("page Enter", (this.state.startTime / 1000));
      // let date = moment();
      // let currentDate = date.format("D/MM/YYYY");
      // // "17/06/2022"
   
   
    OnboardingPage({});
    }

  componentWillUnmount() {
    let endTime = new Date() * 1;
    let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
    // console.log("page Leave", endTime/1000);
    // console.log("Time Spent", TimeSpent);
    TimeSpentOnboarding({ time_spent: TimeSpent });
    localStorage.setItem("refresh", false);
  }
    onClose = () => {
        this.setState({ showModal: false })
    }

    handleStateChange=(value)=>{
        if(value === "verifyCode"){
            this.setState({
                currentActiveModal:value
            })
        }
        else{
            this.setState({
                currentActiveModal:"signIn"
            })
        }
    }
    switchSignIn = (e) => {
        // console.log("active modalin indexx",this.state.currentActiveModal)
        // console.log("verification req indexx",this.state.isVerificationRequired)
        if (this.state.currentActiveModal === "verifyCode") {
            this.setState({
                // isVerificationRequired:false,
                signInReq:true,
                currentActiveModal:"signIn"
            })
        } else {
            this.setState({
                signInReq: !this.state.signInReq,
            })
        }
        // if(this.state.showSignText){
        //     this.handleShowSignText(false)
        // }
    }
    // handleShowSignText = (val)=>{
    //     console.log("HELLO",val)
    //     this.setState({
    //         showSignText:val
    //     })
    // }

    privacymessage = ()=> {
        PrivacyMessage({  });
        // console.log("on hover privacy msg");
    }
    render() {

        return (
          <>
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
                  At Loch, we care intensely about your privacy and
                  pseudonymity.
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