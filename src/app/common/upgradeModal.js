import React from "react";
import BaseReactComponent from "./../../utils/form/BaseReactComponent";
import { connect } from "react-redux";
import { Modal, Image, Button, Col, Row } from "react-bootstrap";
import ExitOverlayIcon from "../../assets/images/icons/ExitOverlayWalletIcon.svg";
import Form from "../../utils/form/Form";
import FormElement from "../../utils/form/FormElement";
import FormValidator from "./../../utils/form/FormValidator";
// import CloseIcon from '../../assets/images/icons/close-icon.svg'
import CloseIcon from "../../assets/images/icons/dummyX.svg";
import CustomTextControl from "./../../utils/form/CustomTextControl";
import InfoIcon from "../../assets/images/icons/info-icon.svg";
import LochIcon from "../../assets/images/icons/loch-icon.svg";
import {
  getAllCoins,
  detectCoin,
  getAllParentChains,
} from "../onboarding//Api";
import LockIcon from "../../assets/images/icons/lock-icon.svg";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import { fixWalletApi, SendOtp, VerifyEmail } from "./Api.js";
import { updateUser } from "../profile/Api";
import { toHaveStyle } from "@testing-library/jest-dom/dist/matchers";
import backIcon from "../../assets/images/icons/Back-icon.svg";
import { getCurrentUser } from "../../utils/ManageToken";
import {
  WhaleCreateAccountEmailSaved,
  WhaleCreateAccountPrivacyHover,
} from "../../utils/AnalyticsFunctions";
import CheckoutModal from "./checkout-modal";
import AuthModal from "./AuthModal";

import DefiIcon from "../../assets/images/icons/upgrade-defi.svg";
import ExportIcon from "../../assets/images/icons/upgrade-export.svg";
import NotificationLimitIcon from "../../assets/images/icons/upgrade-notification-limit.svg";
import NotificationIcon from "../../assets/images/icons/upgrade-notifications.svg";
import UploadIcon from "../../assets/images/icons/upgrade-upload.svg";
import WalletIcon from "../../assets/images/icons/upgrade-wallet.svg";
import WhalePodAddressIcon from "../../assets/images/icons/upgrade-whale-pod-add.svg";
import WhalePodIcon from "../../assets/images/icons/upgrade-whale-pod.svg";

class UpgradeModal extends BaseReactComponent {
  constructor(props) {
    super(props);
    const dummyUser = localStorage.getItem("lochDummyUser");
    const userDetails = JSON.parse(localStorage.getItem("lochUser"));
    const Plans = JSON.parse(localStorage.getItem("Plans"));

    let AllPlan = Plans?.map((plan) => {
      return {
        // Upgrade plan
        price: plan.prices ? plan.prices[0]?.unit_amount / 100 : 0,
        price_id: plan.prices ? plan.prices[0]?.id : "",
        name: plan.name,
        id: plan.id,
        plan_reference_id: plan.plan_reference_id,
        features: [
          {
            name: "Wallet addresses",
            limit: plan.wallet_address_limit,
            img: WalletIcon,
            id: 1,
          },
          {
            name: "Whale pod",
            limit: plan.whale_pod_limit,
            img: WhalePodIcon,
            id: 2,
          },
          {
            name: "Whale pod addresses",
            limit: plan.whale_pod_address_limit,
            img: WhalePodAddressIcon,
            id: 3,
          },
          {
            name: "Notifications provided",
            limit: plan.notifications_provided,
            img: NotificationIcon,
            id: 4,
          },
          {
            name: "Notifications limit",
            limit: plan.notifications_limit,
            img: NotificationLimitIcon,
            id: 5,
          },
          {
            name: "Defi details provided",
            limit: plan.defi_enabled,
            img: DefiIcon,
            id: 6,
          },
          {
            name: "Export addresses",
            limit: plan.export_address_limit,
            img: ExportIcon,
            id: 7,
          },
          {
            name: "upload address csv/text",
            limit: plan.whale_pod_address_limit,
            img: UploadIcon,
            id: 8,
          },
        ],
      };
    });

    // console.log("AllPlan ", AllPlan);

    this.state = {
      // limit exceed id this is used for modal message and highlight feature
      upgradeType: 4,

      // if user form pricing page set true and show auth modal if not login in else show checkout page and redirect to home
      UserFromPage: false,

      // Auth Modal
      firstName: userDetails?.first_name || "",
      lastName: userDetails?.last_name || "",
      mobileNumber: userDetails?.mobile || "",
      link: userDetails?.link || dummyUser || "",
      email: "",
      otp: "",
      prevOtp: "",
      isEmailNotExist: false,
      isOptInValid: false,
      isShowOtp: false,

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
      CheckOutModal: false,
      planList: AllPlan ? AllPlan : [],
      hideUpgradeModal: false,
      RegisterModal: false,
      price_id: 0,
      userPlan: JSON.parse(localStorage.getItem("currentPlan")) || {
        price: 0,
        price_id: "",
        name: "Free",
        features: [
          {
            name: "Wallet addresses",
            limit: 5,
          },
          {
            name: "Whale pod",
            limit: 1,
          },
          {
            name: "Whale pod addresses",
            limit: 5,
          },
          {
            name: "Notifications provided",
            limit: false,
          },
          {
            name: "Notifications limit",
            limit: 0,
          },
          {
            name: "Defi details provided",
            limit: false,
          },
          {
            name: "Export addresses",
            limit: 1,
          },
          {
            name: "upload address csv/text",
            limit: 5,
          },
        ],
      },
      userPlan: JSON.parse(localStorage.getItem("currentPlan")),
      selectedPlan: JSON.parse(localStorage.getItem("currentPlan")),

      //
      hideAuthModal: false
    };
  }

  // Auth
  handleAccountCreate = () => {
    //   console.log("create email", this.state.email);
    let data = new URLSearchParams();
    data.append("email", this.state.email);
    SendOtp(data, this);

    // WhaleCreateAccountEmailSaved({
    //   session_id: getCurrentUser().id,
    //   email_address: this.state.email,
    // });

    //   check email valid or not if valid set email exist to true then this will change copy of signin and if invalid then show copy for signup
  };

  handleOtp = () => {
    this.setState({
      isOptInValid: false,
    });
    // console.log("enter otp", this.state.otp, typeof this.state.otp);
    let data = new URLSearchParams();
    data.append("email", this.state.email);
    data.append("otp_token", this.state.otp);
    VerifyEmail(data, this);
  };

  checkoutModal = () => {
    this.setState(
      {
        CheckOutModal: !this.state.CheckOutModal,
        hideUpgradeModal: true,
      },
      () => {
        
      }
    );
  };

  AddEmailModal = () => {
    // console.log("handle emailc close");
    const isDummy = localStorage.getItem("lochDummyUser");
    const islochUser = JSON.parse(localStorage.getItem("lochUser"));
    if (islochUser) {
      this.setState(
        {
          RegisterModal: false,
          email: islochUser?.email || "",
        },
        () => {
          this.checkoutModal();
        }
      );
    } else {
      this.setState(
        {
          RegisterModal: !this.state.RegisterModal,
          hideUpgradeModal: true,
        },
        () => {
          // this.setState({});
        }
      );
    }
  };

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {}

  handleBack = () => {
    this.setState({
      hideUpgradeModal: false,
      RegisterModal: false,
      CheckOutModal: false,

      // autho
      email: "",
      otp: "",
      isShowOtp: false,
      isEmailNotExist: false,
    });
  };

  submit = () => {
    // console.log('Hey');
  };

  render() {
    return (
      <>
        <Modal
          show={this.state.show}
          className="exit-overlay-form"
          onHide={this.state.onHide}
          size="xl"
          dialogClassName={"upgrade"}
          centered
          aria-labelledby="contained-modal-title-vcenter"
          backdropClassName="exitoverlaymodal"
          keyboard={false}
          backdrop={this.props.isShare && this.props.isStatic ? "static" : true}
        >
          <Modal.Header>
            <div className="UpgradeIcon">
              <Image src={LochIcon} />
            </div>
            {!this.props.isStatic && (
              <div
                className="closebtn"
                onClick={() => {
                  this.state.onHide();
                }}
              >
                <Image src={CloseIcon} />
              </div>
            )}
            {(this.state.RegisterModal || this.state.CheckOutModal) && (
              <div className="back-icon-upgrade cp" onClick={this.handleBack}>
                <Image src={backIcon} />
              </div>
            )}
            <h6 className="inter-display-medium f-s-25 lh-30 m-t-28">
              {"Do more with Loch"}
            </h6>
            <p className="inter-display-medium f-s-16 lh-19 grey-969 text-center m-t-5">
              {"Upgrade your plan"}
            </p>
          </Modal.Header>
          <Modal.Body>
            <div className="upgrade-overlay-body">
              {/* this.props.isSkip(); */}
              {!this.state.hideUpgradeModal ? (
                <div className="pricing-plan">
                  <Row>
                    {this.state?.planList.map((plan, i) => {
                      return (
                        <Col md={4}>
                          <div className="plan-card-wrapper">
                            <div
                              className={`plan-card ${
                                plan.name === this.state.userPlan.name
                                  ? "active"
                                  : ""
                              }`}
                            >
                              <div
                                className={`pricing-section
                              ${
                                i === 1
                                  ? "baron-bg"
                                  : i === 2
                                  ? "soverign-bg"
                                  : ""
                              }
                              `}
                              >
                                <h3>{plan.name}</h3>
                                <div className="price">
                                  <h4>${plan.price}</h4>
                                  {i !== 0 && <p>monthly</p>}
                                </div>
                              </div>
                              <div className="feature-list-wrapper">
                                {plan?.features.map((list) => {
                                  return (
                                    <div
                                      className={`feature-list ${
                                        this.state.upgradeType === list?.id
                                          ? i === 0
                                            ? "free-plan"
                                            : i === 1
                                            ? "baron-plan"
                                            : i === 2
                                            ? "soverign-plan"
                                            : ""
                                          : ""
                                      }`}
                                    >
                                      <div className="label">
                                        <Image src={list?.img} />
                                        <h3>{list.name}</h3>
                                      </div>
                                      <h4>
                                        {list.limit === false
                                          ? "No"
                                          : list.limit === true
                                          ? "Yes"
                                          : list.limit === -1
                                          ? "Unlimited"
                                          : list.limit}
                                      </h4>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                            <Button
                              className={`primary-btn ${
                                plan.name === this.state.userPlan.name
                                  ? "disabled"
                                  : ""
                              }`}
                              style={
                                i === 0
                                  ? { position: "relative", top: "2.3rem" }
                                  : {}
                              }
                              onClick={() => {
                                if (plan.name !== this.state.userPlan.name) {
                                  this.AddEmailModal();
                                  this.setState({
                                    price_id: plan.price_id,
                                    selectedPlan: plan,
                                  });
                                }
                              }}
                            >
                              {plan.name === this.state.userPlan.name
                                ? "Current tier"
                                : "Upgrade"}
                            </Button>
                          </div>
                        </Col>
                      );
                    })}
                  </Row>
                </div>
              ) : (
                <div className="pricing-plan">
                  <Row>
                    <Col md={4}>
                      <div className="plan-card-wrapper">
                        <div className={"plan-card active"}>
                          <div
                            className={`pricing-section
                              ${
                                this.state.selectedPlan?.id ===
                                "63eb32769b5e4daf6b588206"
                                  ? "baron-bg"
                                  : this.state.selectedPlan?.id ===
                                    "63eb32769b5e4daf6b588207"
                                  ? "soverign-bg"
                                  : ""
                              }
                              `}
                          >
                            <h3>{this.state.selectedPlan?.name}</h3>
                            <div className="price">
                              <h4>${this.state.selectedPlan?.price}</h4>
                              {this.state.selectedPlan?.name !== "Free" && (
                                <p>monthly</p>
                              )}
                            </div>
                          </div>
                          <div className="feature-list-wrapper">
                            {this.state.selectedPlan?.features.map((list) => {
                              return (
                                <div
                                  className={`feature-list ${
                                    this.state.upgradeType === list?.id
                                      ? this.state.selectedPlan?.id ===
                                        "63eb32759b5e4daf6b588205"
                                        ? "free-plan"
                                        : this.state.selectedPlan?.id ===
                                          "63eb32769b5e4daf6b588206"
                                        ? "baron-plan"
                                        : this.state.selectedPlan?.id ===
                                          "63eb32769b5e4daf6b588207"
                                        ? "soverign-plan"
                                        : ""
                                      : ""
                                  }`}
                                >
                                  <div className="label">
                                    <Image src={list?.img} />
                                    <h3>{list.name}</h3>
                                  </div>
                                  <h4>
                                    {list.limit === false
                                      ? "No"
                                      : list.limit === true
                                      ? "Yes"
                                      : list.limit === -1
                                      ? "Unlimited"
                                      : list.limit}
                                  </h4>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        <Button
                          className={`primary-btn  disabled`}
                          onClick={() => {
                            // if (plan.name !== this.state.userPlan.name) {
                            //   this.AddEmailModal();
                            //   this.setState({
                            //     price_id: plan.price_id,
                            //     selectedPlan: plan,
                            //   });
                            // }
                          }}
                        >
                          Your choosen plan
                        </Button>
                      </div>
                    </Col>
                    <Col md={8}>
                      <p>
                        {this.state.RegisterModal
                          ? "Verify your email address to create an account with Loch"
                          : this.state.isShowOtp
                          ? "We’ve sent you a verification code to your email"
                          : this.state.CheckOutModal
                          ? "Great! We’ve verified your account. You’re just one step away to becoming a Baron!"
                          : ""}
                      </p>
                      <div className="email-section auth-modal">
                        {/* For Signin or Signup */}
                        {this.state.RegisterModal && (
                          <>
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
                                  >
                                    Confirm
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
                          </>
                        )}
                        {this.state.CheckOutModal && (
                          <Button
                            className={`primary-btn`}
                            onClick={() => {
                              // if (plan.name !== this.state.userPlan.name) {
                              //   this.AddEmailModal();
                              //   this.setState({
                              //     price_id: plan.price_id,
                              //     selectedPlan: plan,
                              //   });
                              // }
                            }}
                          >
                            Complete payment
                          </Button>
                        )}
                      </div>
                    </Col>
                  </Row>
                </div>
              )}

              <div className="m-b-36 footer">
                <p className="inter-display-medium f-s-13 lh-16 grey-ADA m-r-5">
                  At Loch, we care intensely about your privacy and
                  pseudonymity.
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

        {/* {this.state.CheckOutModal && (
          <CheckoutModal
            show={this.state.CheckOutModal}
            onHide={this.checkoutModal}
            history={this.props.history}
            price_id={this.state.price_id}
            selectedPlan={this.state.selectedPlan}
          />
        )} */}
        {/* {this.state.RegisterModal ? (
          <AuthModal
            show={this.state.RegisterModal}
            // link="http://loch.one/a2y1jh2jsja"
            onHide={this.AddEmailModal}
            history={this.props.history}
            modalType={"create_account"}
            // iconImage={CohortIcon}
            hideSkip={true}
            // headerTitle={"Create a Wallet cohort"}
            // changeWalletList={this.handleChangeList}
            // apiResponse={(e) => this.CheckApiResponse(e)}
          />
        ) : (
          ""
        )} */}
      </>
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
};

UpgradeModal.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(UpgradeModal);
