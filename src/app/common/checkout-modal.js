import React from "react";
import { Button, Image, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import ExitOverlayIcon from "../../assets/images/icons/ExitOverlayWalletIcon.svg";
import BaseReactComponent from "./../../utils/form/BaseReactComponent";
// import CloseIcon from '../../assets/images/icons/close-icon.svg'
import CloseIcon from "../../assets/images/icons/dummyX.svg";
import InfoIcon from "../../assets/images/icons/info-icon.svg";
import LockIcon from "../../assets/images/icons/lock-icon.svg";
import {
  WhaleCreateAccountEmailSaved,
  WhaleCreateAccountPrivacyHover,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import {
  detectCoin,
  getAllCoins,
  getAllParentChains,
} from "../onboarding//Api";
import { CreatePyment, SendOtp, fixWalletApi } from "./Api.js";
import AuthModal from "./AuthModal";

class CheckoutModal extends BaseReactComponent {
  constructor(props) {
    super(props);
    const dummyUser = window.localStorage.getItem("lochDummyUser");
    const userDetails = JSON.parse(window.localStorage.getItem("lochUser"));
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
      planList: this.props.selectedPlan
        ? [this.props.selectedPlan]
        : [
            {
              price: 1000,
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
      RegisterModal: false,
      payment_link: "",
    };
  }

  componentDidMount() {
    // this.props.getAllCoins();
    // this.props.getAllParentChains();
    //    this.AddEmailModal();

    let data = new URLSearchParams();
    data.append("price_id", this.props.price_id);
    CreatePyment(data, this);
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

  AddEmailModal = () => {
    // console.log("handle emailc close");
    const isDummy = window.localStorage.getItem("lochDummyUser");
    const islochUser = JSON.parse(window.localStorage.getItem("lochUser"));
    if (islochUser) {
      this.setState({
        RegisterModal: false,
        email: islochUser?.email || "",
      });
    } else {
      this.setState({
        RegisterModal: !this.state.RegisterModal,
      });
    }
  };

  handleAccountCreate = () => {
    //   console.log("create email", this.state.email);
    let data = new URLSearchParams();
    data.append(
      "email",
      this.state.email ? this.state.email.toLowerCase() : ""
    );
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
        <Modal
          show={this.state.show}
          className="exit-overlay-form"
          onHide={this.state.onHide}
          size="lg"
          dialogClassName={"exit-overlay-modal"}
          centered
          aria-labelledby="contained-modal-title-vcenter"
          backdropClassName="exitoverlaymodal"
        >
          <Modal.Header>
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
            <div className="upgrade-overlay-body">
              <h6 className="inter-display-medium f-s-20 lh-24 ">
                {this.state.modalTitle ? this.state.modalTitle : "Checkout"}
              </h6>
              <p className="inter-display-medium f-s-16 lh-19 grey-7C7 m-b-24 text-center">
                {this.state.modalDescription
                  ? this.state.modalDescription
                  : "Take your usage to the next level"}
              </p>
              {/* this.props.isSkip(); */}
              <div
                className="pricing-plan"
                style={{ justifyContent: "center" }}
              >
                {this.state?.planList.map((plan, i) => {
                  return (
                    <div className="plan-card-wrapper">
                      <div className={`plan-card ${i === 0 ? "active" : ""}`}>
                        <div className="plan-name-wrapper">
                          <div>{plan.name} </div> <div>{"$" + plan.price}</div>
                        </div>
                        <div className="feature-list-wrapper">
                          {plan?.features?.map((list) => {
                            return (
                              <div className="feature-list">
                                <h3>{list.name}</h3>
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
                        className="primary-btn"
                        onClick={() => {
                          // this.handleExportNow()
                          //  payment_link;
                          window.open(this.state.payment_link);
                        }}
                      >
                        Pay now
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
                    style={{ cursor: "pointer" }}
                  />
                </CustomOverlay>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        {this.state.RegisterModal ? (
          <AuthModal
            show={this.state.RegisterModal}
            // link="http://loch.one/a2y1jh2jsja"
            onHide={this.AddEmailModal}
            history={this.props.history}
            modalType={"create_account"}
            // iconImage={CohortIcon}

            hideSkip={false}
            tracking="Whale watching"
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

CheckoutModal.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutModal);
