import React from "react";
import { Image, Modal } from "react-bootstrap";
import { connect } from "react-redux";

import {
  ChartDonutPaywallIcon,
  ChartLinePaywallIcon,
  CloseIcon,
  LightBulbPaywallIcon,
  LochLogoWhiteIcon,
  NewModalBackArrowIcon,
  PurpleCheckIcon,
} from "../../assets/images/icons";
import InfoIcon from "../../assets/images/icons/info-icon.svg";
import LockIcon from "../../assets/images/icons/lock-icon.svg";
import {
  PayModalClosed,
  PayModalOpened,
  PayModalPay,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import {
  loadingAnimation,
  whichSignUpMethod,
} from "../../utils/ReusableFunctions";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import PaywallOptionsModal from "./PaywallOptionsModal";
import "./_paywallModal.scss";
import { createUserPayment } from "./Api";
import { COINBASE_SECRET_KEY } from "../../utils/Constant";

class PaywallModal extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      isPayWallOptions: false,
      isCreditBtnLoading: false,
      show: props.show,
      onHide: this.props.onHide,
      userDetailsState: undefined,
      customerData: [
        {
          name: "0xKyle",
          twitterHandle: "",
          review: "Damn. Great product. I like it a lot. Very clean UI",
          rating: 5,
        },
        {
          name: "Shual",
          twitterHandle: "@0xShual",
          review: "It's a great tool. and I use dozens of diff on chain tools.",
          rating: 5,
        },
        {
          name: "@zKVect",
          twitterHandle: "",
          review: "Wow, I’m surprised at how clean the UI is. Good job.",
          rating: 5,
        },
        {
          name: "Waleed",
          twitterHandle: "Elixir Capital",
          review: "it’s what I've been trying to search for, for months.",
          rating: 5,
        },
        {
          name: "Matt A",
          twitterHandle: "",
          review: "UI and latency is unmatched. Loch is something special",
          rating: 5,
        },
        {
          name: "Toshi",
          twitterHandle: "Family office fund manager",
          review: "Found 2k so far I forgot about, 4k now",
          rating: 4,
        },
        {
          name: "RJ G",
          twitterHandle: "",
          review: "I really liked how many diverse features there are.",
          rating: 5,
        },

        {
          name: "Erik H",
          twitterHandle: "",
          review: "Thoughtfully designed features and UI",
          rating: 5,
        },
      ],
    };
  }
  componentDidMount() {
    const userDetails = JSON.parse(window.localStorage.getItem("lochUser"));
    this.setState({
      userDetailsState: userDetails,
    });
    if (this.props.openWithOptions) {
      // this.goToPayWallOptions();
    } else {
      setTimeout(() => {
        const path = whichSignUpMethod();
        PayModalOpened({
          session_id: getCurrentUser().id,
          email_address: getCurrentUser().email,
          path: path,
        });
      }, 1000);
    }
  }
  async createCharge() {
    const url = "https://api.commerce.coinbase.com/charges";

    let redirectLink = this.props.redirectLink;
    let minAmount = 20;

    const requestBody = {
      local_price: {
        amount: minAmount,
        currency: "USD",
      },
      pricing_type: "fixed_price",

      name: "Email notifications",
      description: "Get notified when a trade is ready to be executed",
      redirect_url: redirectLink,

      metadata: {
        email:
          this.state.userDetailsState && this.state.userDetailsState.email
            ? this.state.userDetailsState.email
            : "",
      },
    };

    const payload = {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CC-Api-Key": COINBASE_SECRET_KEY,
      },
      body: JSON.stringify(requestBody),
    };
    try {
      const response = await fetch(url, payload);
      if (!response.ok) {
        throw new Error(`HTTP error Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating charge:", error);
      this.setState({
        isBtnLoading: false,
      });
    }
  }
  fetchChargeData = async () => {
    const chargeData = await this.createCharge();
    if (chargeData && chargeData.data && chargeData.data.hosted_url) {
      // setHostedUrl(chargeData.data.hosted_url);
      return chargeData.data.hosted_url;
    }
  };

  hideModal = () => {
    const path = whichSignUpMethod();
    PayModalClosed({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      path: path,
    });
    this.state.onHide();
  };
  goToPayWallOptions = () => {
    this.setState({
      isPayWallOptions: true,
    });
  };
  goBackToPayWall = () => {
    this.setState({
      isPayWallOptions: false,
    });
  };

  // Pay with string
  payWithStripe = async () => {
    if (this.state.isCreditBtnLoading) {
      return;
    }

    this.setState({
      isCreditBtnLoading: true,
    });
    const path = whichSignUpMethod();
    PayModalPay({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      path: path,
      paymentMethod: "stripe",
    });
    const createUserData = new URLSearchParams();
    createUserData.append("price_id", process.env.REACT_APP_STRIPE_PRICE_ID);

    this.props.createUserPayment(createUserData, this.stopCreditBtnLoading);
  };
  stopCreditBtnLoading = () => {
    this.setState({
      isCreditBtnLoading: false,
    });
  };
  // Pay with string
  render() {
    return (
      <Modal
        show={this.state.show}
        className={`exit-overlay-form pay-wall-modal ${
          this.props.isMobile ? "pay-wall-modal-mobile" : "zoomedElements"
        }`}
        onHide={this.hideModal}
        size="lg"
        dialogClassName={`exit-overlay-modal ${
          this.props.isMobile ? "bottom-modal" : ""
        }`}
        centered
        aria-labelledby="contained-modal-title-vcenter"
        backdropClassName="exitoverlaymodal"
        animation={false}
        style={{
          opacity: this.state.isPayWallOptions ? 0 : 1,
        }}
      >
        {this.state.isPayWallOptions ? (
          <PaywallOptionsModal
            show={this.state.isPayWallOptions}
            isCreditBtnLoading={this.state.isCreditBtnLoading}
            onHide={this.props.onHide}
            redirectLink={this.props.redirectLink}
            goBackToPayWall={this.goBackToPayWall}
            payWithStripe={this.payWithStripe}
            isMobile={this.props.isMobile}
            description={this.props.description}
          />
        ) : null}
        <div
          style={{
            width: this.props.isMobile ? "100%" : "",
          }}
          className="modal-purple-top-gradient"
        />
        <Modal.Header>
          {this.props.isMobile ? (
            <>
              <div className="mobile-copy-trader-popup-header">
                {this.props.hideBackBtn ? (
                  <div
                    className="mobile-copy-trader-popup-header-close-icon mobile-solid-close-icon"
                    style={{
                      opacity: 0,
                    }}
                  >
                    <Image src={NewModalBackArrowIcon} />
                  </div>
                ) : (
                  <div
                    onClick={this.props.onGoBackPayModal}
                    className="mobile-copy-trader-popup-header-close-icon mobile-solid-close-icon"
                  >
                    <Image src={NewModalBackArrowIcon} />
                  </div>
                )}
                <div
                  style={{
                    transform: "translateY(0.8rem)",
                  }}
                  className="api-modal-header api-modal-header-mobile popup-main-icon-with-border"
                >
                  <Image src={LochLogoWhiteIcon} className="imageDarker" />
                </div>

                <div
                  onClick={this.hideModal}
                  className="mobile-copy-trader-popup-header-close-icon mobile-solid-close-icon"
                >
                  <Image src={CloseIcon} />
                </div>
              </div>
            </>
          ) : (
            <>
              {this.props.hideBackBtn ? null : (
                <div
                  className="closebtn"
                  style={{
                    left: "2.8rem",
                  }}
                  onClick={this.props.onGoBackPayModal}
                >
                  <Image src={NewModalBackArrowIcon} />
                </div>
              )}
              <div className="api-modal-header popup-main-icon-with-border">
                <Image src={LochLogoWhiteIcon} className="imageDarker" />
              </div>
              <div className="closebtn" onClick={this.hideModal}>
                <Image src={CloseIcon} />
              </div>
            </>
          )}
        </Modal.Header>
        <Modal.Body>
          <div className="addWatchListWrapperParent addCopyTradeWrapperParent paywall-body">
            <div className="paywall-body-padding">
              <div
                style={{
                  marginBottom: this.props.isMobile ? "2.3rem" : "3.3rem",
                  marginTop: this.props.isMobile ? "1rem" : "",
                  padding: this.props.isMobile ? "0.25rem" : "",
                }}
                className="exit-overlay-body"
              >
                <>
                  <h6
                    className={`text-center inter-display-medium ${
                      this.props.isMobile ? "f-s-20" : "f-s-25"
                    }`}
                  >
                    {this.props.isMobile ? (
                      "Create, Track, and Protect your Onchain Fortune"
                    ) : (
                      <span>
                        Create, Track, and Protect your
                        <br />
                        Onchain Fortune
                      </span>
                    )}
                  </h6>
                  <p
                    className={`inter-display-medium ctpb-sub-text text-center ${
                      this.props.isMobile ? "f-s-16" : "f-s-16"
                    }`}
                  >
                    Upgrade your plan
                  </p>
                </>
              </div>

              <div className="ctpb-plans-container">
                {this.props.isMobile ? null : (
                  <div className="ctpb-plan">
                    <div className="ctpb-plan-header">
                      <div className="inter-display-medium f-s-20">Loch</div>
                      <div className="inter-display-medium grey-ADA f-s-20">
                        Free
                      </div>
                    </div>
                    <div className="ctpb-plan-body">
                      <div className="ctpb-plan-body-icons-container">
                        <Image
                          className="ctpb-plan-body-icon"
                          src={ChartDonutPaywallIcon}
                        />
                        <Image
                          className="ctpb-plan-body-icon"
                          src={ChartLinePaywallIcon}
                        />
                        <Image
                          className="ctpb-plan-body-icon"
                          src={LightBulbPaywallIcon}
                        />
                      </div>
                      <div className="inter-display-medium ctpb-plan-desc-text f-s-16">
                        Access to all the essential Loch features
                      </div>
                    </div>
                    <div className="ctpb-plan-disable-button inter-display-medium f-s-16">
                      Current tier
                    </div>
                  </div>
                )}
                <div className="ctpb-plan ctpb-plan-selected">
                  <div className="ctpb-plan-header">
                    <div className="ctpb-plan-header-title-container">
                      <div className="inter-display-medium f-s-20">Loch</div>
                      <div className="ctpb-plan-header-black-badge">
                        Premium
                      </div>
                    </div>
                    <div className="inter-display-medium f-s-20">
                      $20 <span className="grey-ADA f-s-13">/ month</span>
                    </div>
                  </div>
                  <div className="ctpb-plan-body">
                    <div className="ctpb-plan-body-icons-container">
                      <Image
                        className="ctpb-plan-body-icon"
                        src={ChartDonutPaywallIcon}
                      />
                      <Image
                        className="ctpb-plan-body-icon"
                        src={ChartLinePaywallIcon}
                      />
                      <Image
                        className="ctpb-plan-body-icon"
                        src={LightBulbPaywallIcon}
                      />
                    </div>
                    <div className="inter-display-medium ctpb-plan-desc-text f-s-16">
                      Access to all the essential Loch features
                    </div>
                  </div>
                  <div className="ctpb-plan-plus-seperator">
                    <div className="ctpb-plan-plus-seperator-stick" />
                    <div className="ctpb-plan-plus-seperator-text">Plus</div>
                    <div className="ctpb-plan-plus-seperator-stick" />
                  </div>
                  <div className="ctpb-plan-disable-button inter-display-medium f-s-16 ctpb-plan-purple-button">
                    {/* <div
                      style={{
                        padding: this.props.isMobile ? "0.25rem" : "",
                        paddingTop: "0rem",
                      }}
                      className="ctpb-plan-purple-button-child"
                    >
                      <Image
                        className="ctpb-plan-purple-button-icon"
                        src={PurpleCheckIcon}
                      />
                      Notifications
                    </div> */}
                    <div
                      style={{
                        padding: this.props.isMobile ? "0.25rem" : "",
                      }}
                      className="ctpb-plan-purple-button-child"
                    >
                      <Image
                        className="ctpb-plan-purple-button-icon"
                        src={PurpleCheckIcon}
                      />
                      PnL calculations
                    </div>
                    <div
                      style={{
                        padding: this.props.isMobile ? "0.25rem" : "",
                      }}
                      className="ctpb-plan-purple-button-child"
                    >
                      <Image
                        className="ctpb-plan-purple-button-icon"
                        src={PurpleCheckIcon}
                      />
                      Netflows
                    </div>
                    <div
                      style={{
                        padding: this.props.isMobile ? "0.25rem" : "",
                      }}
                      className="ctpb-plan-purple-button-child"
                    >
                      <Image
                        className="ctpb-plan-purple-button-icon"
                        src={PurpleCheckIcon}
                      />
                      Copy trader
                    </div>
                    <div
                      style={{
                        padding: this.props.isMobile ? "0.25rem" : "",
                      }}
                      className="ctpb-plan-purple-button-child"
                    >
                      <Image
                        className="ctpb-plan-purple-button-icon"
                        src={PurpleCheckIcon}
                      />
                      Export data
                    </div>
                    <div
                      style={{
                        padding: this.props.isMobile ? "0.25rem" : "",
                      }}
                      className="ctpb-plan-purple-button-child"
                    >
                      <Image
                        className="ctpb-plan-purple-button-icon"
                        src={PurpleCheckIcon}
                      />
                      Earn 10 points each month
                    </div>
                    <div
                      style={{
                        padding: this.props.isMobile ? "0.25rem" : "",
                      }}
                      className="ctpb-plan-purple-button-child"
                    >
                      <Image
                        className="ctpb-plan-purple-button-icon"
                        src={PurpleCheckIcon}
                      />
                      Aggregate multiple wallets
                    </div>

                    <div
                      style={{
                        padding: this.props.isMobile ? "0.25rem" : "",
                      }}
                      className="ctpb-plan-purple-button-child"
                    >
                      <Image
                        className="ctpb-plan-purple-button-icon"
                        src={PurpleCheckIcon}
                      />
                      Apply to join Platinum Telegram
                    </div>
                    <div
                      style={{
                        marginTop: this.props.isMobile ? "0rem" : "0.5rem",
                      }}
                      className="ctpb-plan-purple-button-child ctpb-plan-purple-button-child-extra-text"
                    >
                      <Image
                        className="ctpb-plan-purple-button-icon"
                        src={PurpleCheckIcon}
                      />
                      <div className="ctpb-plan-purple-button-bullet" />

                      <span>Over $400m liquid onchain AUM</span>
                    </div>
                    <div
                      style={{
                        marginTop: this.props.isMobile ? "0rem" : "0.5rem",
                      }}
                      className="ctpb-plan-purple-button-child ctpb-plan-purple-button-child-extra-text"
                    >
                      <Image
                        className="ctpb-plan-purple-button-icon"
                        src={PurpleCheckIcon}
                      />
                      <div className="ctpb-plan-purple-button-bullet" />

                      <span>Over 500k twitter followers</span>
                    </div>
                    <div
                      style={{
                        marginTop: this.props.isMobile ? "0rem" : "0.5rem",
                      }}
                      className="ctpb-plan-purple-button-child ctpb-plan-purple-button-child-extra-text"
                    >
                      <Image
                        className="ctpb-plan-purple-button-icon"
                        src={PurpleCheckIcon}
                      />
                      <div className="ctpb-plan-purple-button-bullet" />

                      <span>Daily trade ideas</span>
                    </div>
                  </div>
                  <div
                    onClick={this.goToPayWallOptions}
                    // onClick={this.payWithStripe}
                    className={`ctpb-plan-disable-button inter-display-medium f-s-16 ctpb-plan-button ${
                      this.state.isCreditBtnLoading
                        ? "ctpb-plan-button-loading"
                        : ""
                    }`}
                  >
                    {this.state.isCreditBtnLoading
                      ? loadingAnimation()
                      : "Upgrade"}
                  </div>
                </div>
              </div>
            </div>

            <div className="ctpb-user-discalmier">
              {this.props.isMobile ? (
                <p className="inter-display-medium f-s-13 lh-16 grey-ADA">
                  Don't worry.{" "}
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
                      style={{ cursor: "pointer" }}
                    />
                  </CustomOverlay>
                  <div>All your information remains private and anonymous.</div>
                </p>
              ) : (
                <p className="inter-display-medium f-s-13 lh-16 grey-ADA">
                  Don't worry. All your information remains private and
                  anonymous.
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
                      style={{ cursor: "pointer" }}
                    />
                  </CustomOverlay>
                </p>
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  OnboardingState: state.OnboardingState,
});
const mapDispatchToProps = { createUserPayment };

PaywallModal.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(PaywallModal);
