import React from "react";
import { Image, Modal } from "react-bootstrap";
import { connect } from "react-redux";

import { toast } from "react-toastify";
import {
  ChartDonutPaywallIcon,
  ChartLinePaywallIcon,
  CloseIcon,
  CreditCardPaywallIcon,
  CryptoWalletPaywallIcon,
  LightBulbPaywallIcon,
  LochLogoWhiteIcon,
  NewModalBackArrowIcon,
  PurpleCheckIcon,
} from "../../assets/images/icons";
import InfoIcon from "../../assets/images/icons/info-icon.svg";
import LockIcon from "../../assets/images/icons/lock-icon.svg";
import {
  PayModalPay,
  PayModalUpgrade,
  PayModalUpgradeBack,
  PayModalUpgradeClose,
} from "../../utils/AnalyticsFunctions";
import { COINBASE_SECRET_KEY, STRIPE_SECRET_KEY } from "../../utils/Constant";
import { getCurrentUser } from "../../utils/ManageToken";
import {
  loadingAnimation,
  whichSignUpMethod,
} from "../../utils/ReusableFunctions";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import { createUserPayment } from "./Api";
import PaywallCyptoPlansModal from "./PaywallCyptoPlansModal";

const stripe = require("stripe")(STRIPE_SECRET_KEY);

class PaywallOptionsModal extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      isCryptoBtnLoading: false,
      isCreditBtnLoading: false,
      show: props.show,
      onHide: this.props.onHide,
      userDetailsState: undefined,
      isPayWallCrptoPlans: false,
    };
  }
  goBackToPayWallPass = () => {
    const path = whichSignUpMethod();
    PayModalUpgradeBack({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      path: path,
    });
    this.props.goBackToPayWall();
  };
  componentDidMount() {
    const path = whichSignUpMethod();
    PayModalUpgrade({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      path: path,
    });
    const userDetails = JSON.parse(window.localStorage.getItem("lochUser"));
    this.setState({
      userDetailsState: userDetails,
    });
  }
  async createCharge() {
    const url = "https://api.commerce.coinbase.com/charges";

    let redirectLink = this.props.redirectLink;

    let minAmount = 20;

    const requestBody = {
      local_price: {
        amount: minAmount, //price of charge
        currency: "USD", //currency
      },
      pricing_type: "fixed_price",

      name: "Email notifications",
      description: "Get notified when a trade is ready to be executed",
      redirect_url: redirectLink, //optional redirect URL

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
        isCryptoBtnLoading: false,
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
  goCopyTrade = () => {
    if (this.props.isCreditBtnLoading) {
      return;
    }
    // CopyTradePayCryptoPayment({
    //   session_id: getCurrentUser().id,
    //   email_address: getCurrentUser().email,
    // });
    if (this.state.isCryptoBtnLoading) {
      return;
    }
    this.setState({
      isCryptoBtnLoading: true,
    });
    const path = whichSignUpMethod();
    PayModalUpgradeClose({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      path: path,
      paymentMethod: "crypto",
    });
    this.fetchChargeData()
      .then((res) => {
        if (res) {
          let tempIdHolderArr = res.split("/");
          if (tempIdHolderArr && tempIdHolderArr.length > 0) {
            window.open(res, "_self");
          } else {
            toast.error("Something went wrong");
          }
        }
      })
      .catch((err) => {
        this.setState({
          isCryptoBtnLoading: false,
        });
        toast.error("Something went wrong");
      });
  };
  hideModal = () => {
    const path = whichSignUpMethod();
    PayModalUpgradeClose({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      path: path,
    });
    this.state.onHide();
  };
  stopCreditBtnLoading = () => {
    this.setState({
      isCreditBtnLoading: false,
    });
  };
  getCurrentUrl = async (passedId) => {
    await stripe.paymentLinks
      .create({
        line_items: [
          {
            price: process.env.REACT_APP_STRIPE_PRICE_ID,
            quantity: 1,
          },
        ],
      })
      .then((res) => {
        const createUserData = new URLSearchParams();
        createUserData.append(
          "price_id",
          process.env.REACT_APP_STRIPE_PRICE_ID
        );
        this.props.createUserPayment(createUserData, this.stopCreditBtnLoading);
        setTimeout(() => {
          window.open(res.url, "_blank");
          this.state.onHide();
        }, 500);
      })
      .catch(() => {
        this.setState({
          isCreditBtnLoading: false,
        });
        toast.error("Something went wrong");
      });
  };
  payWithStripe = async () => {
    if (this.state.isCryptoBtnLoading) {
      return;
    }
    // CopyTradePayCreditCardPayment({
    //   session_id: getCurrentUser().id,
    //   email_address: getCurrentUser().email,
    // });
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
    setTimeout(() => {
      // window.open(res.url, "_blank");
      // this.state.onHide();
    }, 500);
    // await stripe.prices
    //   .create({
    //     currency: "usd",
    //     unit_amount: 50,
    //     recurring: {
    //       interval: "month",
    //     },
    //     product_data: {
    //       name: "Loch Premium",
    //     },
    //   })
    //   .then((res) => {
    //     this.getCurrentUrl(res.id);
    //   })
    //   .catch(() => {
    //     this.setState({
    //       isCreditBtnLoading: false,
    //     });
    //     toast.error("Something went wrong");
    //   });
  };

  goToCryptoPlans = () => {
    this.setState({
      isPayWallCrptoPlans: true,
    });
  };
  goBackToPayWall = () => {
    this.setState({
      isPayWallCrptoPlans: false,
    });
  };

  render() {
    return (
      <Modal
        show={this.state.show}
        className={`exit-overlay-form pay-wall-modal pay-wall-options-modal ${
          this.props.isMobile ? "pay-wall-modal-mobile" : ""
        }`}
        onHide={this.state.onHide}
        size="lg"
        dialogClassName={`exit-overlay-modal ${
          this.props.isMobile ? "bottom-modal" : ""
        }`}
        centered
        aria-labelledby="contained-modal-title-vcenter"
        backdropClassName="exitoverlaymodal"
        animation={false}
        style={{
          opacity: this.state.isPayWallCrptoPlans ? 0 : 1,
        }}
      >
        {this.state.isPayWallCrptoPlans ? (
          <PaywallCyptoPlansModal
            show={this.state.isPayWallCrptoPlans}
            onHide={this.props.onHide}
            redirectLink={this.props.redirectLink}
            goBackToPayWall={this.goBackToPayWall}
            isCreditBtnLoading={this.props.isCreditBtnLoading}
            payWithStripe={this.props.payWithStripe}
            isMobile={this.props.isMobile}
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
            <div className="mobile-copy-trader-popup-header">
              <div
                onClick={this.goBackToPayWallPass}
                className="mobile-copy-trader-popup-header-close-icon mobile-solid-close-icon"
              >
                <Image src={NewModalBackArrowIcon} />
              </div>
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
          ) : (
            <>
              <div
                className="closebtn"
                style={{
                  left: "2.8rem",
                }}
                onClick={this.goBackToPayWallPass}
              >
                <Image src={NewModalBackArrowIcon} />
              </div>
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

              <div className="ctpb-plans-container ctpb-plans-payment-container">
                {this.props.isMobile ? null : (
                  <div className="ctpb-plan ctpb-plan-selected ctpb-plan-selected-shadow">
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
                  </div>
                )}
                <div className="ctpb-plan ctpb-payment">
                  <div className="inter-display-medium ctpb-payment-title-text f-s-16">
                    Choose your payment method
                  </div>
                  <div
                    onClick={this.props.payWithStripe}
                    className={`ctpb-plan-disable-button inter-display-medium f-s-16 ctpb-plan-payment-button ${
                      this.state.isCryptoBtnLoading
                        ? "ctpb-plan-payment-button-disabled"
                        : this.props.isCreditBtnLoading
                        ? "ctpb-plan-payment-button-loading"
                        : ""
                    }`}
                  >
                    {this.props.isCreditBtnLoading ? (
                      loadingAnimation()
                    ) : (
                      <>
                        <Image
                          className="ctpb-plan-payment-button-icons"
                          src={CreditCardPaywallIcon}
                        />
                        <span>Credit Card</span>
                      </>
                    )}
                  </div>
                  <div
                    onClick={this.goToCryptoPlans}
                    className={`ctpb-plan-disable-button inter-display-medium f-s-16 ctpb-plan-payment-button ${
                      this.props.isCreditBtnLoading
                        ? "ctpb-plan-payment-button-disabled"
                        : ""
                    }`}
                  >
                    <Image
                      className="ctpb-plan-payment-button-icons"
                      src={CryptoWalletPaywallIcon}
                    />
                    <span>Crypto</span>
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: "3rem",
                position: this.props.isMobile ? "absolute" : "",
                bottom: "2rem",
              }}
              className="ctpb-user-discalmier"
            >
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

PaywallOptionsModal.propTypes = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaywallOptionsModal);
