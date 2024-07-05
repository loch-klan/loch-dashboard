import React from "react";
import BaseReactComponent from "../../utils/form/BaseReactComponent.js";
import { connect } from "react-redux";
import { Modal, Image, Button } from "react-bootstrap";
import ExitOverlayIcon from "../../assets/images/icons/ExitOverlayWalletIcon.svg";
import Form from "../../utils/form/Form.js";
import FormElement from "../../utils/form/FormElement.js";
import FormValidator from "../../utils/form/FormValidator.js";
// import CloseIcon from '../../assets/images/icons/close-icon.svg'
import CloseIcon from "../../assets/images/icons/dummyX.svg";
import CustomTextControl from "../../utils/form/CustomTextControl.js";
import InfoIcon from "../../assets/images/icons/info-icon.svg";
import {
  getAllCoins,
  detectCoin,
  getAllParentChains,
} from "../onboarding/Api.js";
import LockIcon from "../../assets/images/icons/lock-icon.svg";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay.js";
import {
  fixWalletApi,
  SendOtp,
  setPageFlagDefault,
  SigninWallet,
} from "../common/Api.js";

import backIcon from "../../assets/images/icons/Icon-back.svg";
import { getCurrentUser } from "../../utils/ManageToken.js";
import { WhaleCreateAccountPrivacyHover } from "../../utils/AnalyticsFunctions.js";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { VerifySmartMoneyEmailOtp } from "./Api.js";
import { mobileCheck } from "../../utils/ReusableFunctions.js";

class AuthSmartMoneyModal extends BaseReactComponent {
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
    SendOtp(data, this);
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
    this.props.VerifySmartMoneyEmailOtp(data, this, this.state.email, false);
    // VerifyEmail(data, this);
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
  emailIsVerified = () => {
    this.state.onHide();
    toast.success(`Email verified`);
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
              className="signin-header back-icon"
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
            <div className="exitOverlayIcon popup-main-icon-with-border">
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
            <p className="inter-display-medium f-s-16 lh-19 grey-7C7 m-b-24 text-center">
              {this.state.modalDescription
                ? this.state.modalDescription
                : "Add your email so you can view, analyze, and follow any or all of the smartest actors on-chain."}
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
  VerifySmartMoneyEmailOtp,
};

AuthSmartMoneyModal.propTypes = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthSmartMoneyModal);
