import React, { Component } from "react";
// import PropTypes from 'prop-types';
import { connect } from "react-redux";
import BaseReactComponent from "./../../utils/form/BaseReactComponent";
import OnBoarding from "../onboarding";
import "../../assets/scss/onboarding/_onboarding.scss";
import { Button, Image } from "react-bootstrap";
import Banner from "../../assets/images/bg-img-welcome.png";
import {
  deleteToken,
  getToken,
  setLocalStoraage,
  getCurrentUser,
} from "../../utils/ManageToken";
import {
  getAllCurrencyRatesApi,
  GetDefaultPlan,
  setPageFlagDefault,
} from "../common/Api";
import UpgradeModal from "../common/upgradeModal";
import FormElement from "../../utils/form/FormElement";
import FormValidator from "./../../utils/form/FormValidator";
import CustomTextControl from "./../../utils/form/CustomTextControl";
import LochIcon from "../../assets/images/icons/loch-icon-white.svg";
import Form from "../../utils/form/Form";
import {
  DiscountEmailPage,
  DiscountEmailSkip,
  EmailAddedDiscount,
  TimeSpentDiscountEmail,
  TimeSpentOnboarding,
  LPConnectExchange,
  LPDiscover,
} from "../../utils/AnalyticsFunctions";
import {
  CompassWhiteIcon,
  LinkVectorWhiteIcon,
  ProfileVectorWhiteIcon,
} from "../../assets/images/icons";
import LinkIconBtn from "../../assets/images/link.svg";
import { AppFeaturesCreateUser } from "../onboarding/Api";
import { setHeaderReducer } from "../header/HeaderAction";

class Home extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      showModal: true,
      signedIn: true,
      upgradeModal: false,
      isStatic: true,
      triggerId: 0,
      selectedId: 0,

      showPrevModal: true,

      showEmailPopup: false,
      emailAdded: false,
      startTime: "",

      // Onboarding
      onboardingShowModal: true,
      onboardingSignInReq: false,
      onboardingIsVerificationRequired: false,
      onboardingIsVerified: false,
      onboardingCurrentActiveModal: "signIn",
      onboardingUpgradeModal: false,
      onboardingIsStatic: false,
      onboardingTriggerId: 1,
      onboardingShowPrevModal: true,
      onboardingConnectExchangeModal: false,
      onboardingWalletAddress: [
        {
          id: `wallet1`,
          address: "",
          coins: [],
          displayAddress: "",
          wallet_metadata: {},
          nickname: "",
          showAddress: true,
          showNickname: true,
          apiAddress: "",
          showNameTag: true,
          nameTag: "",
        },
      ],
      onboardingExchanges: null,
      onboardingShowEmailPopup: true,
    };
  }
  // Onboarding
  onboardingHandleUpgradeModal = () => {
    this.setState(
      {
        onboardingUpgradeModal: !this.state.onboardingUpgradeModal,
      },
      () => {
        let onboardingUpgradeModalValue = this.state.onboardingUpgradeModal
          ? false
          : true;
        this.setState({
          onboardingShowPrevModal: onboardingUpgradeModalValue,
        });
        const userDetails = JSON.parse(localStorage.getItem("lochUser"));
        if (userDetails) {
          this.props.history.push("/home");
        }
      }
    );
  };
  copyWalletAddress = (copyWallet) => {
    this.setState({ onboardingWalletAddress: copyWallet });
  };
  handleRedirection = () => {
    this.props.history.push(`/top-accounts`);
  };
  goToDiscover = () => {
    LPDiscover({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    const data = new URLSearchParams();
    data.append("wallet_addresses", JSON.stringify([]));
    AppFeaturesCreateUser(data, this, this.handleRedirection);
  };

  onboardingShowConnectModal = (
    address = this.state.onboardingWalletAddress
  ) => {
    this.setState(
      {
        onboardingConnectExchangeModal: true,
      },
      () => {
        if (this.state.onboardingConnectExchangeModal) {
          LPConnectExchange();
        }
        let value = this.state.onboardingConnectExchangeModal ? false : true;
        this.setState({
          onboardingShowPrevModal: value,
        });
      }
    );
  };
  onboardingHideConnectModal = () => {
    this.setState(
      {
        onboardingConnectExchangeModal: false,
        onboardingSignInReq: false,
      },
      () => {
        if (this.state.onboardingConnectExchangeModal) {
          LPConnectExchange({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
          });
        }
        let value = this.state.onboardingConnectExchangeModal ? false : true;
        this.setState({
          onboardingShowPrevModal: value,
        });
      }
    );
  };
  onboardingHandleBackConnect = (
    exchanges = this.state.onboardingExchanges
  ) => {
    this.setState(
      {
        onboardingSignInReq: false,
        onboardingConnectExchangeModal:
          !this.state.onboardingConnectExchangeModal,
        onboardingWalletAddress: this.state.onboardingWalletAddress,
        onboardingExchanges: exchanges,
      },
      () => {
        let value = this.state.onboardingConnectExchangeModal ? false : true;
        this.setState({
          onboardingShowPrevModal: value,
        });
      }
    );
  };
  onboardingOnClose = () => {
    this.setState({ onboardingShowModal: false });
  };
  onboardingHandleStateChange = (value) => {
    if (value === "verifyCode") {
      this.setState({
        onboardingCurrentActiveModal: value,
      });
    } else {
      this.setState({
        onboardingCurrentActiveModal: "signIn",
      });
    }
  };

  onboardingShowSignIn = () => {
    this.onboardingHideConnectModal();
    if (this.state.onboardingCurrentActiveModal === "verifyCode") {
      this.setState({
        onboardingSignInReq: true,
        onboardingCurrentActiveModal: "signIn",
      });
    } else {
      this.setState({
        onboardingSignInReq: true,
      });
    }
  };
  onboardingSwitchSignIn = () => {
    if (this.state.onboardingCurrentActiveModal === "verifyCode") {
      this.setState({
        onboardingSignInReq: true,
        onboardingCurrentActiveModal: "signIn",
      });
    } else {
      this.setState({
        onboardingSignInReq: !this.state.onboardingSignInReq,
      });
    }
  };
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
      }
    );
  };

  componentDidMount() {
    this.props.setHeaderReducer([]);
    this.setState({ startTime: new Date() * 1 });
    // DiscountEmailPage();
    let isEmailadded = JSON.parse(localStorage.getItem("discountEmail"));
    if (isEmailadded) {
      this.setState({
        emailAdded: true,
        showEmailPopup: false,
      });
    }
    const searchParams = new URLSearchParams(this.props.location.search);
    const planId = searchParams.get("plan_id");
    let currencyRates = JSON.parse(localStorage.getItem("currencyRates"));
    if (!currencyRates) {
      getAllCurrencyRatesApi();
    }

    if (planId) {
      this.setState(
        {
          selectedId: planId,
        },
        () => {
          this.upgradeModal();
        }
      );
    } else {
      if (getToken()) {
        let isStopRedirect =
          localStorage.getItem("stop_redirect") &&
          JSON.parse(localStorage.getItem("stop_redirect"));
        if (isStopRedirect) {
          this.props.setPageFlagDefault();
          deleteToken();
        } else {
          // check if user is signed in or not if yes reidrect them to home page if not delete tokens and redirect them to welcome page
          let user = localStorage.getItem("lochUser")
            ? JSON.parse(localStorage.getItem("lochUser"))
            : false;
          if (user) {
            this.props.history.push("/home");
          } else {
            this.props.setPageFlagDefault();
            deleteToken();
            //  localStorage.setItem("defi_access", true);
            //  localStorage.setItem("isPopup", true);
            //  // localStorage.setItem("whalepodview", true);
            //  localStorage.setItem(
            //    "whalepodview",
            //    JSON.stringify({ access: true, id: "" })
            //  );
            // localStorage.setItem(
            //   "isSubmenu",
            //   JSON.stringify({
            //     me: false,
            //     discover: false,
            //     intelligence: false,
            //   })
            // );
            setLocalStoraage();
            let isRefresh = JSON.parse(localStorage.getItem("refresh"));
            if (!isRefresh) {
              localStorage.setItem("refresh", true);
              window.location.reload(true);
            }
          }
        }
      } else {
        this.props.setPageFlagDefault();
        deleteToken();
        // localStorage.setItem("defi_access", true);
        // localStorage.setItem("isPopup", true);
        // // localStorage.setItem("whalepodview", true);
        // localStorage.setItem(
        //   "whalepodview",
        //   JSON.stringify({ access: true, id: "" })
        // );
        // // localStorage.setItem("isSubmenu", false);
        //  localStorage.setItem(
        //    "isSubmenu",
        //    JSON.stringify({
        //      me: false,
        //      discover: false,
        //      intelligence: false,
        //    })
        //  );
        setLocalStoraage();
        let isRefresh = JSON.parse(localStorage.getItem("refresh"));
        if (!isRefresh) {
          localStorage.setItem("refresh", true);
          window.location.reload(true);
        }
      }
    }

    GetDefaultPlan();
  }

  componentWillUnmount() {
    if (this.state.startTime) {
      let endTime = new Date() * 1;
      let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
      TimeSpentDiscountEmail({ time_spent: TimeSpent });
    }
  }

  hideModal = (value) => {};
  handleSave = () => {
    this.setState({
      emailAdded: true,
    });

    EmailAddedDiscount({ email_address: this.state.email });

    setTimeout(() => {
      this.setState({
        showEmailPopup: false,
      });
      localStorage.setItem("discountEmail", true);
    }, 2000);
  };
  handleSkip = () => {
    DiscountEmailSkip();
    this.setState({
      showEmailPopup: false,
    });
  };

  render() {
    return (
      <>
        {this.state.showEmailPopup && (
          <div className="discount-email-wrapper">
            <div className="discount-row">
              <div className="img-section">
                <Image src={LochIcon} />
              </div>
              <div className="content-section">
                {!this.state.emailAdded ? (
                  <>
                    <h1 className="inter-display-medium f-s-39 lh-46 grey-B0B m-b-26">
                      Get exclusive discounts to Loch
                    </h1>
                    <Form onValidSubmit={this.handleSave}>
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
                            message: "Enter valid email",
                          },
                          // {
                          //     validate: () => {
                          //        return !this.state.isOptInValid;
                          //   },
                          //     message:"invalid verification code"
                          // }
                        ]}
                        control={{
                          type: CustomTextControl,
                          settings: {
                            placeholder: "Your email address",
                          },
                        }}
                        // className={"is-valid"}
                      />
                      <Button
                        className={`primary-btn inter-display-semi-bold f-s-16 lh-19`}
                        type="submit"
                      >
                        Get discount
                      </Button>
                    </Form>

                    <h3
                      className="inter-display-medium f-s-16 lh-19 m-t-40"
                      onClick={this.handleSkip}
                    >
                      No thanks, just let me enter
                    </h3>
                  </>
                ) : (
                  <>
                    <h1 className="inter-display-medium f-s-26 lh-30 m-b-26">
                      Great! <br />
                      You’ll hear from us very soon!
                    </h1>
                    <div className="upload-loader"></div>
                    <h2 className="inter-display-semi-bold f-s-14 lh-16 m-t-20 grey-B0B">
                      Directing you to Loch
                    </h2>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        {this.state.showPrevModal && (
          <div>
            {!this.state.showEmailPopup && (
              <div className="overlayContainer">
                <div className="overlay-bg"></div>
                <Image src={Banner} className="overlay-banner" />
                <div className="overLayHeader">
                  {/* <div
                    onClick={this.goToDiscover}
                    className="inter-display-medium f-s-13 overLayHeaderOptions overLayHeaderFadedOptions"
                  >
                    <img
                      className="overLayHeaderOptionsIcons p-1"
                      src={CompassWhiteIcon}
                      alt="ProfileVectorIcon"
                    />
                    <div>Discover</div>
                  </div> */}
                  <div
                    onClick={this.onboardingShowConnectModal}
                    className="inter-display-medium f-s-13 overLayHeaderOptions overLayHeaderFadedOptions"
                  >
                    <img
                      className="overLayHeaderOptionsIcons p-1"
                      src={LinkVectorWhiteIcon}
                      alt="ProfileVectorIcon"
                    />
                    <div>Connect exchange</div>
                  </div>
                  <div
                    onClick={this.onboardingShowSignIn}
                    className="inter-display-medium f-s-13 overLayHeaderOptions overLayHeaderWhiteOptions"
                  >
                    <img
                      className="overLayHeaderOptionsIcons"
                      src={ProfileVectorWhiteIcon}
                      alt="ProfileVectorIcon"
                    />
                    <div>Sign in</div>
                  </div>
                </div>
                <OnBoarding
                  {...this.props}
                  hideModal={this.hideModal}
                  showModal={this.state.onboardingShowModal}
                  signInReq={this.state.onboardingSignInReq}
                  isVerificationRequired={
                    this.state.onboardingIsVerificationRequired
                  }
                  isVerified={this.state.onboardingIsVerified}
                  currentActiveModal={this.state.onboardingCurrentActiveModal}
                  upgradeModal={this.state.onboardingUpgradeModal}
                  isStatic={this.state.onboardingIsStatic}
                  triggerId={this.state.onboardingTriggerId}
                  showPrevModal={this.state.onboardingShowPrevModal}
                  connectExchangeModal={
                    this.state.onboardingConnectExchangeModal
                  }
                  onboardingWalletAddress={this.state.onboardingWalletAddress}
                  exchanges={this.state.onboardingExchanges}
                  showEmailPopup={this.state.onboardingShowEmailPopup}
                  onboardingHandleUpgradeModal={
                    this.onboardingHandleUpgradeModal
                  }
                  onboardingShowConnectModal={this.onboardingShowConnectModal}
                  onboardingHideConnectModal={this.onboardingHideConnectModal}
                  onboardingHandleBackConnect={this.onboardingHandleBackConnect}
                  onboardingHandleStateChange={this.onboardingHandleStateChange}
                  onboardingSwitchSignIn={this.onboardingSwitchSignIn}
                  onboardingOnClose={this.onboardingOnClose}
                  copyWalletAddress={this.copyWalletAddress}
                  modalAnimation={false}
                />
              </div>
            )}
          </div>
        )}

        {this.state.upgradeModal && (
          <UpgradeModal
            show={this.state.upgradeModal}
            onHide={this.upgradeModal}
            history={this.props.history}
            triggerId={this.state.triggerId}
            // isShare={localStorage.getItem("share_id")}
            isStatic={this.state.isStatic}
            selectedId={this.state.selectedId}
            signinBack={true}
            form="home"
            pname="home"
          />
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  homeState: state.HomeState,
  OnboardingState: state.OnboardingState,
});
const mapDispatchToProps = {
  // getPosts: fetchPosts
  setPageFlagDefault,
  setHeaderReducer,
};
Home.propTypes = {
  // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
