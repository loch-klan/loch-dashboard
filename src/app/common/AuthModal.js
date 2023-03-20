import React from "react";
import BaseReactComponent from "./../../utils/form/BaseReactComponent";
import { connect } from "react-redux";
import { Modal, Image, Button } from "react-bootstrap";
import ExitOverlayIcon from "../../assets/images/icons/ExitOverlayWalletIcon.svg";
import Form from "../../utils/form/Form";
import FormElement from "../../utils/form/FormElement";
import FormValidator from "./../../utils/form/FormValidator";
// import CloseIcon from '../../assets/images/icons/close-icon.svg'
import CloseIcon from "../../assets/images/icons/dummyX.svg";
import CustomTextControl from "./../../utils/form/CustomTextControl";
import InfoIcon from "../../assets/images/icons/info-icon.svg";
import {
  getAllCoins,
  detectCoin,
  getAllParentChains,
} from "../onboarding//Api";
import LockIcon from "../../assets/images/icons/lock-icon.svg";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import {fixWalletApi, SendOtp, setPageFlagDefault, VerifyEmail } from "./Api.js";
import { updateUser } from "../profile/Api";
import { toHaveStyle } from "@testing-library/jest-dom/dist/matchers";
import backIcon from "../../assets/images/icons/Icon-back.svg";
import { getCurrentUser } from "../../utils/ManageToken";
import { WhaleCreateAccountEmailSaved, WhaleCreateAccountPrivacyHover } from "../../utils/AnalyticsFunctions";

class AuthModal extends BaseReactComponent {
  constructor(props) {
    super(props);
    const dummyUser = localStorage.getItem("lochDummyUser");
    const userDetails = JSON.parse(localStorage.getItem("lochUser"));
    this.state = {
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
      modalDescription: props.description  || null,
    };
  }

  componentDidMount() {
    // this.props.getAllCoins();
    // this.props.getAllParentChains();
     
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
         data.append("email", this.state.email);
    SendOtp(data, this);
    
    WhaleCreateAccountEmailSaved({
      session_id: getCurrentUser().id,
      email_address: this.state.email,
    });
      
    //   check email valid or not if valid set email exist to true then this will change copy of signin and if invalid then show copy for signup 
    
  };
    
    handleOtp = () => {
        this.setState({
            isOptInValid: false,
        })
        // console.log("enter otp", this.state.otp, typeof this.state.otp);
        let data = new URLSearchParams();
        data.append("email", this.state.email);
         data.append("otp_token", this.state.otp);
        VerifyEmail(data,this);
    }

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
    }

  submit = () => {
    // console.log('Hey');
  };

  render() {
    return (
      <Modal
        show={this.state.show}
        className="exit-overlay-form"
        // backdrop="static"
        onHide={this.state.onHide}
        size="lg"
        dialogClassName={"exit-overlay-modal"}
        centered
        aria-labelledby="contained-modal-title-vcenter"
        backdropClassName="exitoverlaymodal"
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
            <div className="api-modal-header">
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
            <p className="inter-display-medium f-s-16 lh-19 grey-7C7 m-b-24 text-center">
              {this.state.modalDescription
                ? this.state.modalDescription
                : "Don’t let your hard work go to waste. Add your email so you can watch your whales with binoculars"}
            </p>
            {/* this.props.isSkip(); */}
            <div className="email-section auth-modal">
              {/* For Signin or Signup */}
              {!this.state.isShowOtp ? (
                <Form onValidSubmit={this.handleAccountCreate}>
                  <FormElement
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
  setPageFlagDefault
};

AuthModal.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(AuthModal);
