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
import { fixWalletApi, SendOtp, VerifyEmail } from "./Api.js";
import { updateUser } from "../profile/Api";
import { toHaveStyle } from "@testing-library/jest-dom/dist/matchers";
import backIcon from "../../assets/images/icons/Icon-back.svg";
import { getCurrentUser } from "../../utils/ManageToken";
import {
  WhaleCreateAccountEmailSaved,
  WhaleCreateAccountPrivacyHover,
} from "../../utils/AnalyticsFunctions";
import CheckoutModal from "./checkout-modal";
import AuthModal from "./AuthModal";

class UpgradeModal extends BaseReactComponent {
  constructor(props) {
    super(props);
    const dummyUser = localStorage.getItem("lochDummyUser");
    const userDetails = JSON.parse(localStorage.getItem("lochUser"));
    // const Plans = JSON.parse(localStorage.getItem("Plans"));

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
      CheckOutModal: false,
      planList: [
        {
          price: 0,
          price_id: "price_1MbJGiFKqIbhlomAxxadBadm",
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
        {
          price: 300,
          price_id: "price_1MbJGiFKqIbhlomAxxadBadm",
          features: [
            {
              name: "Wallet addresses",
              limit: 50,
            },
            {
              name: "Whale pod",
              limit: 100,
            },
            {
              name: "Whale pod addresses",
              limit: 50,
            },
            {
              name: "Notifications provided",
              limit: true,
            },
            {
              name: "Notifications limit",
              limit: 100,
            },
            {
              name: "Defi details provided",
              limit: false,
            },
            {
              name: "Export addresses",
              limit: "Unlimited",
            },
            {
              name: "upload address csv/text",
              limit: 50,
            },
          ],
          name: "Baron",
        },
        {
          price: 1000,
          price_id: "price_1MbJHEFKqIbhlomAPfEjgShp",
          features: [
            {
              name: "Wallet addresses",
              limit: "Unlimited",
            },
            {
              name: "Whale pod",
              limit: "Unlimited",
            },
            {
              name: "Whale pod addresses",
              limit: "Unlimited",
            },
            {
              name: "Notifications provided",
              limit: true,
            },
            {
              name: "Notifications limit",
              limit: 100,
            },
            {
              name: "Defi details provided",
              limit: false,
            },
            {
              name: "Export addresses",
              limit: "Unlimited",
            },
            {
              name: "upload address csv/text",
              limit: "Unlimited",
            },
          ],
          name: "Sovereign",
        },
      ],
      hideUpgradeModal: false,
      RegisterModal: false,
      price_id:0,
    };
  }

  checkoutModal = () => {

    

    this.setState(
      {
        CheckOutModal: !this.state.CheckOutModal,
        hideUpgradeModal: true,
      },

     
    );
  };

  AddEmailModal = () => {
    // console.log("handle emailc close");
    const isDummy = localStorage.getItem("lochDummyUser");
    const islochUser = JSON.parse(localStorage.getItem("lochUser"));
    if (islochUser) {
      this.setState({
        RegisterModal: false,
        email: islochUser?.email || "",
      
      }, () => {
        this.checkoutModal();
      });
    } else {
      this.setState({
        RegisterModal: !this.state.RegisterModal,
      });
    }
  };

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

  submit = () => {
    // console.log('Hey');
  };

  render() {
    return (
      <>
        {!this.state.hideUpgradeModal && (
          <Modal
            show={this.state.show}
            className="exit-overlay-form"
            onHide={this.state.onHide}
            size="xl"
            dialogClassName={"exit-overlay-modal upgrade"}
            centered
            aria-labelledby="contained-modal-title-vcenter"
            backdropClassName="exitoverlaymodal"
            keyboard={false}
            backdrop={this.props.isShare ? "static" : true}
          >
            <Modal.Header>
              {this.props.iconImage ? (
                <div className="api-modal-header">
                  <Image src={this.props.iconImage} />
                </div>
              ) : (
                <div className="exitOverlayIcon">
                  <Image src={ExitOverlayIcon} />
                </div>
              )}
             {!this.props.isShare &&  <div
                className="closebtn"
                onClick={() => {
                  this.state.onHide();
                }}
              >
                <Image src={CloseIcon} />
              </div>}
            </Modal.Header>
            <Modal.Body>
              <div className="upgrade-overlay-body">
                <h6 className="inter-display-medium f-s-20 lh-24 ">
                  {this.state.modalTitle
                    ? this.state.modalTitle
                    : "Upgrade you plan"}
                </h6>
                <p className="inter-display-medium f-s-16 lh-19 grey-7C7 m-b-24 text-center">
                  {this.state.modalDescription
                    ? this.state.modalDescription
                    : "Take your usage to the next level"}
                </p>
                {/* this.props.isSkip(); */}
                <div className="pricing-plan">
                  {this.state?.planList.map((plan, i) => {
                    return (
                      <div className="plan-card-wrapper">
                        <div className={`plan-card ${i === 0 ? "active" : ""}`}>
                          <div className="plan-name-wrapper">
                            <div>{plan.name} </div>{" "}
                            <div>{"$" + plan.price}</div>
                          </div>
                          <div className="feature-list-wrapper">
                            {plan?.features.map((list) => {
                              return (
                                <div className="feature-list">
                                  <h3>{list.name}</h3>
                                  <h4>
                                    {list.limit === false
                                      ? "No"
                                      : list.limit === true
                                      ? "Yes"
                                      : list.limit}
                                  </h4>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        <Button
                          className="primary-btn"
                          onClick={() => {
                            this.AddEmailModal();
                            this.setState({
                              price_id:plan.price_id
                            })
                          }}
                        >
                          Upgrade now
                        </Button>
                      </div>
                    );
                  })}
                </div>

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
        )}
        {this.state.CheckOutModal && (
          <CheckoutModal
            show={this.state.CheckOutModal}
            onHide={this.checkoutModal}
            history={this.props.history}
            price_id={this.state.price_id}
          />
        )}
        {this.state.RegisterModal ? (
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
        )}
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
