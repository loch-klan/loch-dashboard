import React from "react";
import { Button, Image, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import ExitOverlayIcon from "../../assets/images/icons/ExitOverlayWalletIcon.svg";
import Form from "../../utils/form/Form";
import FormElement from "../../utils/form/FormElement";
import BaseReactComponent from "./../../utils/form/BaseReactComponent";
import FormValidator from "./../../utils/form/FormValidator";
// import CloseIcon from '../../assets/images/icons/close-icon.svg'
import CloseIcon from "../../assets/images/icons/dummyX.svg";
import InfoIcon from "../../assets/images/icons/info-icon.svg";
import LockIcon from "../../assets/images/icons/lock-icon.svg";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import {
  detectCoin,
  getAllCoins,
  getAllParentChains,
} from "../onboarding//Api";
import CustomTextControl from "./../../utils/form/CustomTextControl";
import {
  SendOtp,
  SigninWallet,
  VerifyEmail,
  fixWalletApi,
  setPageFlagDefault,
} from "./Api.js";

import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import backIcon from "../../assets/images/icons/Icon-back.svg";
import {
  ConnectExPopupEmailAdded,
  CopyTradePopupEmailAdded,
  GeneralPopupEmailAdded,
  LochPointsSignInPopupEmailAdded,
  SignInModalEmailAdded,
  SigninMenuEmailAdded,
  UpgradeSignInEmailVerified,
  WhaleCreateAccountPrivacyHover,
  WhalePopupEmailAdded,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import {
  mobileCheck,
  whichSignUpMethod,
} from "../../utils/ReusableFunctions.js";

class AuthModal extends BaseReactComponent {
  constructor(props) {
    super(props);
    const dummyUser = window.localStorage.getItem("lochDummyUser");
    const userDetails = JSON.parse(window.localStorage.getItem("lochUser"));
    this.state = {
      isMobile: mobileCheck(),
      firstName: userDetails?.first_name || "",
      lastName: userDetails?.last_name || "",
      mobileNumber: userDetails?.mobile || "",
      link: userDetails?.link || dummyUser || "",

      dummyUser,
      show: props.show,
      email: "",
      otp: "",
      prevOtp: "",
      isEmailNotExist: false,
      isOptInValid: false,
      isShowOtp: false,
      onHide: props.onHide,
      changeList: props.changeWalletList,
      modalTitle: props.title || null,
      modalSecondTitle: props.secondTitle || null,
      modalDescription: props.description || null,

      // metamask
      MetamaskExist: false,
      MetaAddress: "",
      balance: 0,
      btnloader: false,
    };
  }

  componentDidMount() {
    // set popup active
    window.localStorage.setItem("isPopupActive", true);
    // this.props.getAllCoins();
    // this.props.getAllParentChains();
  }

  componentWillUnmount() {
    // set popup active
    window.localStorage.setItem("isPopupActive", false);
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log("prev", prevState.otp, this.state.otp);
    // if (prevState.otp !== this.state.otp) {
    //     console.log("in update")
    //     this.setState({
    //         isOptInValid:false,
    //     })
    // }
    // if (this.state.isOptInValid) {
    //     setTimeout(() => {
    //       this.setState({
    //         isOptInValid: false,
    //       });
    //     }, 5000);
    // }
  }

  handleAccountCreate = () => {
    //   console.log("create email", this.state.email);
    let data = new URLSearchParams();
    data.append(
      "email",
      this.state.email ? this.state.email.toLowerCase() : ""
    );

    const signUpMethod = whichSignUpMethod();
    SignInModalEmailAdded({
      session_id: getCurrentUser().id,
      email_address: this.state.email,
      signUpMethod: signUpMethod,
    });

    SendOtp(data, this);

    if (this.props.tracking === "Sign in button") {
      SigninMenuEmailAdded({
        session_id: getCurrentUser().id,
        email_address: this.state.email,
      });
    } else if (this.props.tracking === "Whale watching") {
      WhalePopupEmailAdded({
        session_id: getCurrentUser().id,
        email_address: this.state.email,
      });
    } else if (this.props.tracking === "Loch points profile") {
      LochPointsSignInPopupEmailAdded({
        session_id: getCurrentUser().id,
        email_address: this.state.email,
      });
    } else if (this.props.tracking === "Wallet connect exchange") {
      ConnectExPopupEmailAdded({
        session_id: getCurrentUser().id,
        email_address: this.state.email,
        from: this.props.tracking,
      });
    } else if (this.props.tracking === "Home connect exchange") {
      ConnectExPopupEmailAdded({
        session_id: getCurrentUser().id,
        email_address: this.state.email,
        from: this.props.tracking,
      });
    } else if (this.props.tracking === "Upgrade sign in popup") {
      UpgradeSignInEmailVerified({
        session_id: getCurrentUser().id,
        email_address: this.state.email,
        from: this.props.tracking,
      });
    } else if (this.props.tracking === "Copy trade") {
      CopyTradePopupEmailAdded({
        session_id: getCurrentUser().id,
        email_address: this.state.email,
      });
    }

    if (this.props?.popupType === "general_popup") {
      GeneralPopupEmailAdded({
        session_id: getCurrentUser().id,
        email_added: this.state.email,
        from: this.props?.tracking,
      });
    }

    // WhaleCreateAccountEmailSaved({
    //   session_id: getCurrentUser().id,
    //   email_address: this.state.email,
    // });
  };

  handleOtp = () => {
    this.setState({
      isOptInValid: false,
    });
    // console.log("enter otp", this.state.otp, typeof this.state.otp);
    let data = new URLSearchParams();
    data.append(
      "email",
      this.state.email ? this.state.email.toLowerCase() : ""
    );
    data.append("otp_token", this.state.otp);
    data.append(
      "signed_up_from",
      this.props?.popupType === "general_popup"
        ? "generic pop up"
        : this.props.tracking
    );
    VerifyEmail(
      data,
      this,
      false,
      this.state.email ? this.state.email.toLowerCase() : ""
    );
  };

  handleBack = () => {
    // console.log("handle back")
    this.setState({
      email: "",
      otp: "",
      isShowOtp: false,
      modalTitle: null,
      modalDescription: null,
      isEmailNotExist: false,
    });
  };

  submit = () => {
    // console.log('Hey');
  };

  //

  // Signin wit wallet
  SigninWallet = () => {
    // get device id
    const deviceId = window.localStorage.getItem("deviceId") || uuidv4();

    if (!window.localStorage.getItem("deviceId")) {
      // console.log("no device id");
      window.localStorage.setItem("deviceId", deviceId);
    }

    if (!window.localStorage.getItem("connectWalletAddress")) {
      window.localStorage.setItem(
        "connectWalletAddress",
        this.state.MetaAddress
      );
    }

    let data = new URLSearchParams();
    data.append("device_id", deviceId);
    data.append("wallet_address", this.state.MetaAddress);

    SigninWallet(data, this);
  };

  render() {
    return (
      <Modal
        show={this.state.show}
        className={`exit-overlay-form ${
          this.state.isMobile ? "" : "zoomedElements"
        }`}
        // backdrop="static"
        onHide={this.state.onHide}
        size="lg"
        dialogClassName={"exit-overlay-modal"}
        centered
        aria-labelledby="contained-modal-title-vcenter"
        backdropClassName="exitoverlaymodal"
        animation={
          this.props.modalAnimation !== undefined ||
          this.props.modalAnimation !== null
            ? this.props.modalAnimation
            : true
        }
      >
        <Modal.Header>
          {this.state.isShowOtp || this.props.signinBack ? (
            <div
              className="signin-header back-icon "
              onClick={
                this.state.isShowOtp ? this.handleBack : this.props.signinBack
              }
            >
              <Image className="cp" src={backIcon} />
            </div>
          ) : null}
          {this.props.iconImage ? (
            <div className="api-modal-header popup-main-icon-with-border">
              <Image src={this.props.iconImage} />
            </div>
          ) : (
            <div className="exitOverlayIcon">
              <Image src={ExitOverlayIcon} />
            </div>
          )}
          <div
            className="closebtn"
            onClick={() => {
              this.state.onHide();
            }}
          >
            <Image src={CloseIcon} />
          </div>
        </Modal.Header>
        <Modal.Body>
          <div
            className="exit-overlay-body"
            style={{ padding: "0rem 10.5rem" }}
          >
            <h6 className="inter-display-medium f-s-20 lh-24 ">
              {this.state.modalTitle
                ? this.state.modalTitle
                : "Don’t lose your data"}
            </h6>
            {this.state.modalSecondTitle ? (
              <h6
                style={{
                  marginBottom: "2rem",
                }}
                className="inter-display-medium f-s-20 lh-24"
              >
                {this.state.modalSecondTitle}
              </h6>
            ) : null}
            <p className="inter-display-medium f-s-16 lh-19 grey-7C7 m-b-24 text-center">
              {this.state.modalDescription
                ? this.state.modalDescription
                : "Don’t let your hard work go to waste. Add your email so you can watch your whales with binoculars"}
            </p>
            {/* this.props.isSkip(); */}
            <div className="email-section auth-modal input-noshadow-dark input-hover-states">
              {/* For Signin or Signup */}
              {!this.state.isShowOtp ? (
                <Form onValidSubmit={this.handleAccountCreate}>
                  <FormElement
                    hideOnblur={this.props.hideOnblur}
                    showHiddenError={this.props.showHiddenError}
                    valueLink={this.linkState(this, "email")}
                    // label="Email Info"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "",
                      },
                      {
                        validate: FormValidator.isEmail,
                        message: "Please enter valid email id",
                      },
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Email",
                      },
                    }}
                  />
                  <div className="save-btn-section">
                    <Button
                      className={`inter-display-semi-bold f-s-16 lh-19 white save-btn ${
                        this.state.email ? "active" : ""
                      }`}
                      type="submit"
                      style={{ padding: "1.7rem 3.1rem" }}
                    >
                      Send verification
                    </Button>
                  </div>
                </Form>
              ) : (
                <>
                  <Form onValidSubmit={this.handleOtp}>
                    <FormElement
                      valueLink={this.linkState(this, "otp")}
                      // label="Email Info"
                      required
                      validations={
                        [
                          // {
                          //   validate: FormValidator.isRequired,
                          //   message: "",
                          // },
                          //   {
                          //     validate: FormValidator.isNum,
                          //     message: "Verification code can have only numbers",
                          //     },
                          // {
                          //     validate: () => {
                          //       console.log("state", this.state.isOptInValid);
                          //        return !this.state.isOptInValid;
                          //   },
                          //     message:"invalid verification code"
                          // }
                        ]
                      }
                      control={{
                        type: CustomTextControl,
                        settings: {
                          placeholder: "Enter Verification Code",
                        },
                      }}
                      // className={"is-valid"}
                    />
                    <div className="save-btn-section">
                      <Button
                        className={`inter-display-semi-bold f-s-16 lh-19 white save-btn ${
                          this.state.otp ? "active" : ""
                        }`}
                        type="submit"
                      >
                        Verify
                      </Button>
                    </div>
                  </Form>
                  {this.state.isOptInValid && (
                    <p
                      className="inter-display-regular f-s-10 lh-11 m-t-5"
                      style={{ color: "#ea4e3c" }}
                    >
                      Invalid verification code
                    </p>
                  )}
                </>
              )}
            </div>
            {/* <div>
              <p className="text-center inter-display-medium f-s-13 grey-969">
                or
              </p>
              <Button
                className={`primary-btn m-t-16 m-b-16 ${
                  this.state.btnloader ? "disabled" : ""
                }`}
                style={{
                  width: "100%",
                  padding: "1.4rem 4rem",
                }}
                onClick={() => {
                  if (this.state.btnloader) {
                  } else {
                    this.connectMetamask();
                  }
                }}
              >
                {this.state.btnloader ? loadingAnimation() : "Connect metamask"}
              </Button>
            </div> */}
            {!this.props.hideSkip && (
              <p
                className="inter-display-medium f-s-16 lh-19 grey-7C7 text-center cp m-b-10 skip-link"
                onClick={() => {
                  this.props.isSkip();
                }}
              >
                Skip for now
              </p>
            )}
            {this.props.goToSignUp && !this.state.isShowOtp ? (
              <p
                onClick={this.props.goToSignUp}
                className="goToSingUp m-b-36 inter-display-medium f-s-13 lh-16 grey-ADA m-r-5"
              >
                Don’t have an account yet? Click here to sign up.
              </p>
            ) : null}
            <div className="m-b-36 footer">
              <p className="inter-display-medium f-s-13 lh-16 grey-ADA m-r-5">
                At Loch, we care intensely about your privacy and pseudonymity.
              </p>
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
                  onMouseEnter={() => {
                    WhaleCreateAccountPrivacyHover({
                      session_id: getCurrentUser().id,
                      email_address: this.state.email,
                    });
                  }}
                  style={{ cursor: "pointer" }}
                />
              </CustomOverlay>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  OnboardingState: state.OnboardingState,
  portfolioState: state.PortfolioState,
});
const mapDispatchToProps = {
  fixWalletApi,
  getAllCoins,
  detectCoin,
  getAllParentChains,
  setPageFlagDefault,
};

AuthModal.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(AuthModal);
