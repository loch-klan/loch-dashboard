import React from "react";
import { Image, Modal } from "react-bootstrap";
import { connect } from "react-redux";

import validator from "validator";
import {
  CloseIcon,
  CopyTradeSignInUpCheckIcon,
  CopyTradeSignInUpCheckStepTwoIcon,
  CopyTradeSignInUpLochIcon,
  NewModalBackArrowIcon,
} from "../../assets/images/icons";
import { CustomButton } from "../../utils/form";
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import { whichSignUpMethod } from "../../utils/ReusableFunctions";
import {
  CopyTradeSignIn,
  SignInModalEmailAdded,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import {
  CheckPremiumAfterAPI,
  SendOtp,
  VerifyEmail,
  getUser,
} from "../common/Api";
import OTPInputs from "../home/NewAuth/OTPInputs";
import { toast } from "react-toastify";
// import { addAddressToWatchList } from "./redux/WatchListApi";

class AddEmulationsSignInUpModal extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      show: props.show,
      onHide: this.props.onHide,
      emailAddress: this.props.passedEmail ? this.props.passedEmail : "",
      otpCode: "",
      isAddBtnDisabled: this.props.passedEmail ? false : true,
      loadAddBtn: false,
      isVerifyOtpBtnDisabled: true,
      loadVerifyOtpBtn: false,
      isOtpPage: false,
      isSignUp: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {}
  componentDidMount() {
    CopyTradeSignIn({
      session_id: getCurrentUser().id,
      email_address: this.props.passedEmail,
    });
  }

  handleOnEmailChange = (e) => {
    let { value } = e.target;
    this.setState(
      {
        emailAddress: value,
      },
      () => {
        if (validator.isEmail(value)) {
          this.setState({
            isAddBtnDisabled: false,
          });
        } else {
          this.setState({
            isAddBtnDisabled: true,
          });
        }
      }
    );
  };

  verifyOtp = () => {
    this.setState({
      loadVerifyOtpBtn: true,
    });
    let data = new URLSearchParams();
    data.append(
      "email",
      this.state.emailAddress ? this.state.emailAddress.toLowerCase() : ""
    );
    data.append("otp_token", this.state.otpCode);
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
      this.state.emailAddress ? this.state.emailAddress.toLowerCase() : "",
      this.verifyOtpHandleError
    );
  };
  verifyOtpSuccessfull = () => {
    this.props.getUser();
    this.props.CheckPremiumAfterAPI();
    setTimeout(() => {
      this.props.CheckPremiumAfterAPI();
    }, 1000);
    setTimeout(() => {
      this.props.CheckPremiumAfterAPI();
    }, 1500);
    setTimeout(() => {
      this.props.CheckPremiumAfterAPI();
    }, 2000);
    setTimeout(() => {
      this.props.CheckPremiumAfterAPI();
    }, 2500);

    setTimeout(() => {
      this.props.btnClickFunctionPass();
    }, 3000);
    this.hideModal(true);
  };
  verifyOtpHandleError = (isWrongOtp) => {
    this.setState({
      loadVerifyOtpBtn: false,
    });
    if (isWrongOtp) {
      toast.error("Invalid OTP");
    }
  };
  sendOtp = (resend = false) => {
    let data = new URLSearchParams();
    data.append(
      "email",
      this.state.emailAddress ? this.state.emailAddress.toLowerCase() : ""
    );

    const signUpMethod = whichSignUpMethod();
    this.setState({
      loadAddBtn: true,
    });

    if (this.state.isSignUp) {
    } else {
      SignInModalEmailAdded({
        session_id: getCurrentUser().id,
        email_address: this.state.emailAddress,
        signUpMethod: signUpMethod,
      });
      SendOtp(data, this, true, false, resend === true ? true : false);
    }
  };
  showSignInOtpPage = () => {
    this.setState({
      loadAddBtn: false,
      isOtpPage: true,
    });
  };
  handleError = () => {
    this.setState({
      loadAddBtn: false,
    });
  };
  handleKeyDown = (e, type) => {
    if (e.key === "Enter") {
      if (!this.state.isAddBtnDisabled) {
        this.sendOtp();
      }
    }
  };
  handleChangeOTP = (val) => {
    this.setState(
      {
        otpCode: val,
      },
      () => {
        if (val.length === 6) {
          this.setState({
            isVerifyOtpBtnDisabled: false,
          });
        } else {
          this.setState({
            isVerifyOtpBtnDisabled: true,
          });
        }
      }
    );
  };
  submitOtp = (e) => {
    if (!this.state.isVerifyOtpBtnDisabled) {
      this.verifyOtp();
    }
  };
  goBack = () => {
    if (this.state.isOtpPage) {
      this.setState({
        isOtpPage: false,
      });
    } else {
      if (this.props.goBackToParent) {
        this.props.goBackToParent();
      }
    }
  };
  hideModal = (isRecall = false) => {
    this.state.onHide(isRecall === true ? true : false);
  };

  toggleSignUpIn = () => {
    this.setState({
      isSignUp: !this.state.isSignUp,
    });
  };

  render() {
    return (
      <Modal
        show={this.state.show}
        className={`exit-overlay-form onTop copy-trade-sing-in-up-modal ${
          this.props.hiddenModal ? "zeroOpacity" : ""
        } ${
          this.props.isMobile ? "mobile-add-copy-trade-modal" : "zoomedElements"
        }`}
        onHide={this.hideModal}
        size="lg"
        dialogClassName={`exit-overlay-modal ${
          this.props.isMobile ? "exit-overlay-modal-mobile-full" : ""
        } `}
        centered
        aria-labelledby="contained-modal-title-vcenter"
        backdropClassName="exitoverlaymodal"
        animation={false}
      >
        <Modal.Header>
          {this.props.isMobile ? (
            <div className="mobile-copy-trader-popup-header">
              <div
                onClick={this.goBack}
                className="mobile-copy-trader-popup-header-close-icon"
              >
                <Image src={NewModalBackArrowIcon} />
              </div>
              <div
                onClick={this.hideModal}
                className="mobile-copy-trader-popup-header-close-icon"
              >
                <Image src={CloseIcon} />
              </div>
            </div>
          ) : (
            <>
              <div
                className="closebtn"
                style={{
                  left: "2.8rem",
                }}
                onClick={this.goBack}
              >
                <Image src={NewModalBackArrowIcon} />
              </div>
              <div className="closebtn" onClick={this.hideModal}>
                <Image src={CloseIcon} />
              </div>
            </>
          )}
        </Modal.Header>
        <Modal.Body>
          <div className="copy-trade-sing-in-up-body inter-display-medium addWatchListWrapperParent addCopyTradeWrapperParent">
            <Image
              src={
                this.state.isSignUp
                  ? CopyTradeSignInUpLochIcon
                  : this.state.isOtpPage
                  ? CopyTradeSignInUpCheckStepTwoIcon
                  : CopyTradeSignInUpCheckIcon
              }
              className={`ctl-icon ${
                this.state.isSignUp ? "ctl-icon-big" : ""
              }`}
            />
            <div className="ctl-heading">
              {this.state.isSignUp ? "Sign up with Loch" : "Almost there"}
            </div>

            <div className="ctl-desc">
              {this.state.isSignUp
                ? "Don’t have an account yet? Sign up with Loch"
                : "Your copy trade is ready, sign in to get started right away"}
            </div>

            {this.state.isOtpPage ? (
              <>
                <div className="ctl-otp-top-text">
                  Enter the verification code sent to your email
                </div>
                <div className="ctl-otp-input">
                  <OTPInputs
                    onSubmit={this.submitOtp}
                    numberOfDigits={6}
                    handleChangeOTP={this.handleChangeOTP}
                  />
                </div>
                <div
                  className={`ctl-btn-container watchListAddressBtnContainer copeTraderBtnContainer`}
                >
                  <CustomButton
                    handleClick={this.verifyOtp}
                    className={`ctl-btn ctl-otp-btn primary-btn go-btn main-button-invert ${
                      this.state.isVerifyOtpBtnDisabled
                        ? "ctl-btn-disabled"
                        : ""
                    } ${this.state.loadVerifyOtpBtn ? "ctl-btn-loading" : ""}`}
                    type="submit"
                    isDisabled={this.state.isVerifyOtpBtnDisabled}
                    buttonText={"Verify"}
                    isLoading={this.state.loadVerifyOtpBtn}
                  />
                </div>
                <div
                  onClick={() => {
                    this.sendOtp(true);
                  }}
                  className="ctl-otp-bottom-text"
                >
                  Send code again
                </div>
              </>
            ) : (
              <>
                <div className="ctl-input addWatchListWrapperContainer">
                  <div
                    className={`addCopyTraderWrapperContainer  ${
                      this.state.loadAddBtn
                        ? "addCopyTraderWrapperContainerDisabled"
                        : ""
                    }`}
                  >
                    <>
                      <div className="addWalletWrapper inter-display-regular f-s-15 lh-20">
                        <div
                          className={`awInputWrapper awInputWrapperCopyTrader`}
                        >
                          <div className="awTopInputWrapper input-noshadow-dark">
                            <div className="awInputContainer">
                              <input
                                value={this.state.emailAddress}
                                placeholder="Your email address"
                                className={`inter-display-regular f-s-16 lh-20 awInput addCopyTradeInput`}
                                onChange={this.handleOnEmailChange}
                                autoComplete="off"
                                onKeyDown={this.handleKeyDown}
                                disabled={this.state.loadAddBtn}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  </div>
                </div>

                <div
                  className={`ctl-btn-container watchListAddressBtnContainer copeTraderBtnContainer`}
                >
                  <CustomButton
                    handleClick={this.sendOtp}
                    className={`ctl-btn primary-btn go-btn main-button-invert ${
                      this.state.isAddBtnDisabled ? "ctl-btn-disabled" : ""
                    } ${this.state.loadAddBtn ? "ctl-btn-loading" : ""}`}
                    type="submit"
                    isDisabled={this.state.isAddBtnDisabled}
                    buttonText={"Verify email"}
                    isLoading={this.state.loadAddBtn}
                  />
                </div>
                {/* <div
                  onClick={this.toggleSignUpIn}
                  className={`ctl-otp-bottom-text ${
                    this.state.loadAddBtn ? "ctl-otp-bottom-text-disabled" : ""
                  }`}
                >
                  Click here to sign {this.state.isSignUp ? "in" : "up"}.
                </div> */}
              </>
            )}
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({ OnboardingState: state.OnboardingState });
const mapDispatchToProps = { CheckPremiumAfterAPI, getUser };

AddEmulationsSignInUpModal.propTypes = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddEmulationsSignInUpModal);
