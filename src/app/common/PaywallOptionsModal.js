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
} from "../../assets/images/icons";
import InfoIcon from "../../assets/images/icons/info-icon.svg";
import LockIcon from "../../assets/images/icons/lock-icon.svg";
import {
  CopyTradePayCreditCardPayment,
  CopyTradePayCryptoPayment,
  PayModalUpgrade,
  PayModalUpgradeBack,
  PayModalUpgradeClose,
} from "../../utils/AnalyticsFunctions";
import { STRIPE_SECRET_KEY } from "../../utils/Constant";
import { getCurrentUser } from "../../utils/ManageToken";
import {
  loadingAnimation,
  whichSignUpMethod,
} from "../../utils/ReusableFunctions";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import { createUserPayment } from "./Api";

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
    const userDetails = JSON.parse(window.sessionStorage.getItem("lochUser"));
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
        "X-CC-Api-Key": "03c1c210-ace2-4b5e-bc66-de26a70b283e",
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
    if (this.state.isCreditBtnLoading) {
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
            price: "price_1P8EGbFKqIbhlomARI3I5ddt",
            quantity: 1,
          },
        ],
      })
      .then((res) => {
        const createUserData = new URLSearchParams();
        createUserData.append("price_id", "price_1P8EGbFKqIbhlomARI3I5ddt");
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
    PayModalUpgradeClose({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      path: path,
      paymentMethod: "stripe",
    });
    await stripe.prices
      .create({
        currency: "usd",
        unit_amount: 50,
        recurring: {
          interval: "month",
        },
        product_data: {
          name: "Loch Premium",
        },
      })
      .then((res) => {
        this.getCurrentUrl(res.id);
      })
      .catch(() => {
        this.setState({
          isCreditBtnLoading: false,
        });
        toast.error("Something went wrong");
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
        dialogClassName={"exit-overlay-modal"}
        centered
        aria-labelledby="contained-modal-title-vcenter"
        backdropClassName="exitoverlaymodal"
        animation={false}
        style={{
          zIndex: "10001",
        }}
      >
        <Modal.Header>
          {this.props.isMobile ? (
            <div className="mobile-copy-trader-popup-header">
              <div
                onClick={this.goBackToPayWallPass}
                className="mobile-copy-trader-popup-header-close-icon"
              >
                <Image src={NewModalBackArrowIcon} />
              </div>
              <h6 className="inter-display-medium f-s-20 mobile-copy-trader-popup-header-title">
                Do more with
                <br />
                Loch
              </h6>
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
                }}
                className="exit-overlay-body"
              >
                {this.props.isMobile ? null : (
                  <>
                    <h6 className="inter-display-medium f-s-25">
                      Do more with Loch
                    </h6>
                    <p className="inter-display-medium f-s-16 ctpb-sub-text text-center">
                      Upgrade your plan
                    </p>
                  </>
                )}
              </div>

              <div className="ctpb-plans-container ctpb-plans-payment-container">
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
                      Access to all the limited Loch features
                    </div>
                  </div>
                  <div className="ctpb-plan-plus-seperator">
                    <div className="ctpb-plan-plus-seperator-stick" />
                    <div className="ctpb-plan-plus-seperator-text">Plus</div>
                    <div className="ctpb-plan-plus-seperator-stick" />
                  </div>
                  <div
                    style={{
                      marginBottom: "0rem",
                    }}
                    className="ctpb-plan-disable-button inter-display-medium f-s-16 ctpb-plan-purple-button"
                  >
                    <div className="ctpb-plan-purple-button-icon">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_10314_2925)">
                          <path
                            opacity="0.2"
                            d="M12 5.25C4.5 5.25 1.5 12 1.5 12C1.5 12 4.5 18.75 12 18.75C19.5 18.75 22.5 12 22.5 12C22.5 12 19.5 5.25 12 5.25ZM12 15.75C11.2583 15.75 10.5333 15.5301 9.91661 15.118C9.29993 14.706 8.81928 14.1203 8.53545 13.4351C8.25162 12.7498 8.17736 11.9958 8.32205 11.2684C8.46675 10.541 8.8239 9.8728 9.34835 9.34835C9.8728 8.8239 10.541 8.46675 11.2684 8.32205C11.9958 8.17736 12.7498 8.25162 13.4351 8.53545C14.1203 8.81928 14.706 9.29993 15.118 9.91661C15.5301 10.5333 15.75 11.2583 15.75 12C15.75 12.9946 15.3549 13.9484 14.6517 14.6517C13.9484 15.3549 12.9946 15.75 12 15.75Z"
                            fill="var(--purpleHighlight)"
                          />
                          <path
                            d="M12 5.25C4.5 5.25 1.5 12 1.5 12C1.5 12 4.5 18.75 12 18.75C19.5 18.75 22.5 12 22.5 12C22.5 12 19.5 5.25 12 5.25Z"
                            stroke="var(--purpleHighlight)"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M12 15.75C14.0711 15.75 15.75 14.0711 15.75 12C15.75 9.92893 14.0711 8.25 12 8.25C9.92893 8.25 8.25 9.92893 8.25 12C8.25 14.0711 9.92893 15.75 12 15.75Z"
                            stroke="var(--purpleHighlight)"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_10314_2925">
                            <rect width="24" height="24" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                    {this.props.description}
                  </div>
                </div>
                <div className="ctpb-plan ctpb-payment">
                  <div className="inter-display-medium ctpb-payment-title-text f-s-16">
                    Choose your payment method
                  </div>
                  <div
                    onClick={this.payWithStripe}
                    className={`ctpb-plan-disable-button inter-display-medium f-s-16 ctpb-plan-payment-button ${
                      this.state.isCryptoBtnLoading
                        ? "ctpb-plan-payment-button-disabled"
                        : this.state.isCreditBtnLoading
                        ? "ctpb-plan-payment-button-loading"
                        : ""
                    }`}
                  >
                    {this.state.isCreditBtnLoading ? (
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
                    onClick={this.goCopyTrade}
                    className={`ctpb-plan-disable-button inter-display-medium f-s-16 ctpb-plan-payment-button ${
                      this.state.isCreditBtnLoading
                        ? "ctpb-plan-payment-button-disabled"
                        : this.state.isCryptoBtnLoading
                        ? "ctpb-plan-payment-button-loading"
                        : ""
                    }`}
                  >
                    {this.state.isCryptoBtnLoading ? (
                      loadingAnimation()
                    ) : (
                      <>
                        <Image
                          className="ctpb-plan-payment-button-icons"
                          src={CryptoWalletPaywallIcon}
                        />
                        <span>Crypto</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: "3rem",
              }}
              className="ctpb-user-discalmier"
            >
              <p className="inter-display-medium f-s-13 lh-16 grey-ADA">
                Don't worry. All your information remains private and anonymous.
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
