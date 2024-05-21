import React from "react";
import { v4 as uuidv4 } from "uuid";

import {
  SendOtp,
  VerifyEmail,
  fixWalletApi,
  SigninWallet,
  setPageFlagDefault,
} from "./Api.js";
import { GeneralPopupEmailAdded } from "../../utils/AnalyticsFunctions";
import Draggable from "react-draggable";

import { connect } from "react-redux";
import Form from "../../utils/form/Form";
import { Modal, Image, Button } from "react-bootstrap";
import FormElement from "../../utils/form/FormElement";
import { getCurrentUser } from "../../utils/ManageToken";
import FormValidator from "../../utils/form/FormValidator";
import { CheckGreenIcon } from "../../assets/images/icons";
import CloseIcon from "../../assets/images/icons/dummyX.svg";
import CustomTextControl from "../../utils/form/CustomTextControl";
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import { getAllCoins, detectCoin, getAllParentChains } from "../onboarding/Api";

class DontLoseDataModal extends BaseReactComponent {
  constructor(props) {
    super(props);
    const dummyUser = window.localStorage.getItem("lochDummyUser");
    this.state = {
      otp: "",
      email: "",
      dummyUser,
      isShowOtp: false,
      show: props.show,
      isOptInValid: false,
      onHide: props.onHide,
      isEmailVerified: false,
      isEmailNotExist: false,

      // metamask
      balance: 0,
      MetaAddress: "",
      btnloader: false,
      MetamaskExist: false,
    };
  }

  componentDidMount() {
    window.localStorage.setItem("isPopupActive", true);
  }

  componentWillUnmount() {
    window.localStorage.setItem("isPopupActive", false);
  }

  handleAccountCreate = () => {
    let data = new URLSearchParams();
    data.append(
      "email",
      this.state.email ? this.state.email.toLowerCase() : ""
    );
    SendOtp(data, this);

    GeneralPopupEmailAdded({
      session_id: getCurrentUser().id,
      email_added: this.state.email,
      from: this.props?.tracking,
    });
  };
  emailIsVerified = () => {
    this.setState({
      isEmailVerified: true,
    });
  };

  handleOtp = () => {
    this.setState({
      isOptInValid: false,
    });
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
    VerifyEmail(data, this);
  };

  handleBack = () => {
    this.setState({
      otp: "",
      email: "",
      isShowOtp: false,
      isEmailNotExist: false,
    });
  };

  // connectMetamask = async (isSignin = true) => {
  //   if (window.ethereum) {
  //     try {
  //       await window.ethereum.request({ method: "eth_requestAccounts" });
  //       const provider = new ethers.providers.Web3Provider(window.ethereum);
  //       const signer = provider.getSigner();
  //       const address = await signer.getAddress();
  //       const balance = ethers.utils.formatEther(
  //         await provider.getBalance(address)
  //       );

  //       this.setState({
  //         MetaAddress: address,
  //         balance: balance,
  //         signer: signer,
  //         provider: provider,
  //         btnloader: true,
  //       });

  //       this.SigninWallet();
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   } else {
  //     console.error("Please install MetaMask!");
  //     toast.error("Please install Metamask extension");
  //   }
  // };

  // Signin wit wallet
  SigninWallet = () => {
    const deviceId = window.localStorage.getItem("deviceId") || uuidv4();

    if (!window.localStorage.getItem("deviceId")) {
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
      <div className="sidebarCustonDontLoseDataModalContainerTwo">
        <div className="sidebarCustonDontLoseDataModalContainer">
          <Draggable
            onDrag={(e, data) => this.props.trackPos(data)}
            position={
              this.props.dragPosition ? this.props.dragPosition : { x: 0, y: 0 }
            }
            bounds="parent"
            handle="#draggableHandle"
          >
            <div
              id="draggableHandle"
              className="sidebarCustonDontLoseDataModal "
            >
              <div className="modal-dialog exit-overlay-modal sidebarModalCustom modal-lg">
                <div className="modal-content">
                  <Modal.Body>
                    <div className="sidebarModalBodyContainer">
                      <div className="exit-overlay-body sidebarModalBody">
                        <div>
                          {this.state.isEmailVerified ? (
                            <>
                              <h6 className="inter-display-medium f-s-16">
                                Perfect, your data is saved with us!
                              </h6>
                              <p className="inter-display-medium f-s-12 grey-7C7">
                                Simply sign in with your email next time
                              </p>
                            </>
                          ) : (
                            <>
                              <h6 className="inter-display-medium f-s-16">
                                {this.state.isShowOtp
                                  ? "Verify your email"
                                  : "Don’t lose your data"}
                              </h6>
                              <p className="inter-display-medium f-s-12 grey-7C7">
                                {this.state.isShowOtp
                                  ? "Enter verification code"
                                  : "Sign in now"}
                              </p>
                            </>
                          )}
                        </div>
                        {/* this.props.isSkip(); */}
                        {!this.state.isEmailVerified ? (
                          <div className="email-section auth-modal f-s-14 input-noshadow-dark input-hover-states">
                            {/* For Signin or Signup */}
                            {!this.state.isShowOtp ? (
                              <Form onValidSubmit={this.handleAccountCreate}>
                                <FormElement
                                  valueLink={this.linkState(this, "email")}
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
                                      placeholder: "Your email address",
                                    },
                                  }}
                                />
                                <div className="save-btn-section">
                                  <Button
                                    className={`inter-display-semi-bold f-s-14 white save-btn ${
                                      this.state.email ? "active" : ""
                                    }`}
                                    type="submit"
                                  >
                                    Add
                                  </Button>
                                </div>
                              </Form>
                            ) : (
                              <>
                                <Form onValidSubmit={this.handleOtp}>
                                  <FormElement
                                    valueLink={this.linkState(this, "otp")}
                                    required
                                    control={{
                                      type: CustomTextControl,
                                      settings: {
                                        placeholder: "Verification code",
                                      },
                                    }}
                                  />
                                  <div className="save-btn-section">
                                    <Button
                                      className={`inter-display-semi-bold f-s-14 white save-btn ${
                                        this.state.otp ? "active" : ""
                                      }`}
                                      type="submit"
                                    >
                                      Done
                                    </Button>
                                  </div>
                                </Form>
                                {this.state.isOptInValid && (
                                  <small className="has-error custom-form-error form-text">
                                    Invalid verification code
                                  </small>
                                )}
                              </>
                            )}
                          </div>
                        ) : null}
                        {this.state.isEmailVerified ? (
                          <div className="closebtnContainer">
                            <div
                              className="checkbtn"
                              onClick={() => {
                                this.state.onHide();
                              }}
                            >
                              <Image
                                className="checkbtnIcon"
                                src={CheckGreenIcon}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="closebtnContainer">
                            <div
                              className="closebtn"
                              onClick={() => {
                                this.state.onHide();
                              }}
                            >
                              <Image className="closebtnIcon" src={CloseIcon} />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="sidebarModalBodyGoToSignUpTextContainer">
                        <div
                          onClick={this.props.openSignupModalDirect}
                          className="sidebarModalBodyGoToSignUpText inter-display-medium f-s-14 grey-7C7"
                        >
                          Don’t have an account yet? Click here to sign up.
                        </div>
                      </div>
                    </div>
                  </Modal.Body>
                </div>
              </div>
            </div>
          </Draggable>
        </div>
      </div>
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

DontLoseDataModal.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(DontLoseDataModal);
