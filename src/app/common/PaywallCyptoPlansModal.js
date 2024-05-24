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
  PayModalCrypto,
  PayModalCryptoBack,
  PayModalCryptoClose,
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

class PaywallCyptoPlansModal extends BaseReactComponent {
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
    PayModalCryptoBack({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      path: path,
    });
    this.props.goBackToPayWall();
  };
  componentDidMount() {
    const path = whichSignUpMethod();
    PayModalCrypto({
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
    PayModalCryptoClose({
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
    PayModalCryptoClose({
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
  payQuarterly = () => {
    PayModalPay({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      path: "",
      paymentMethod: "crypto quarterly",
    });
  };
  payYearly = () => {
    PayModalPay({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      path: "",
      paymentMethod: "crypto yearly",
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
      >
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
                    Upgrade to Loch Premium
                  </h6>
                  <p
                    className={`inter-display-medium ctpb-sub-text text-center ${
                      this.props.isMobile ? "f-s-16" : "f-s-16"
                    }`}
                  >
                    Pay with Crypto
                  </p>
                </>
              </div>

              <div className="ctpb-plans-container ctpb-plans-payment-container">
                <div className="ctpb-plan ctpb-payment">
                  <div
                    style={{
                      marginTop: "2.5rem",
                    }}
                    className="inter-display-medium ctpb-payment-title-text f-s-16"
                  >
                    Choose longer and save more
                  </div>
                  <div
                    onClick={this.payQuarterly}
                    className={`ctpb-plan-disable-button inter-display-medium f-s-16 ctpb-plan-payment-button ctpb-plan-payment-button-multiple-months ${
                      this.props.isCreditBtnLoading
                        ? "ctpb-plan-payment-button-disabled"
                        : ""
                    }`}
                  >
                    {/* {this.state.isCreditBtnLoading ? (
                      loadingAnimation()
                    ) : ( */}
                    <>
                      <span>Quarterly</span>
                      <span>$55</span>
                    </>
                    {/* )} */}
                  </div>
                  <div
                    onClick={this.payYearly}
                    className={`ctpb-plan-disable-button inter-display-medium f-s-16 ctpb-plan-payment-button ctpb-plan-payment-button-multiple-months ${
                      this.props.isCreditBtnLoading
                        ? "ctpb-plan-payment-button-disabled"
                        : ""
                    }`}
                  >
                    {/* {this.state.isCreditBtnLoading ? (
                      loadingAnimation()
                    ) : ( */}
                    <>
                      <span>Yearly</span>
                      <span>$200</span>
                    </>
                    {/* )} */}
                  </div>

                  <div
                    style={{
                      margin: "2rem 0rem",
                    }}
                    className="inter-display-medium ctpb-payment-title-text f-s-16"
                  >
                    Or
                  </div>
                  <div
                    onClick={this.props.payWithStripe}
                    className={`ctpb-plan-disable-button inter-display-medium f-s-16 ctpb-plan-payment-button ctpb-plan-payment-button-grey ${
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
                        <span>Pay with Credit Card</span>
                      </>
                    )}
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

PaywallCyptoPlansModal.propTypes = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaywallCyptoPlansModal);
