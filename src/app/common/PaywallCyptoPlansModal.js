import React from "react";
import { Image, Modal } from "react-bootstrap";
import { connect } from "react-redux";

import { toast } from "react-toastify";
import {
  CloseIcon,
  CreditCardPaywallIcon,
  LochLogoWhiteIcon,
  NewModalBackArrowIcon,
} from "../../assets/images/icons";
import InfoIcon from "../../assets/images/icons/info-icon.svg";
import LockIcon from "../../assets/images/icons/lock-icon.svg";
import {
  PayModalCrypto,
  PayModalCryptoBack,
  PayModalCryptoClose,
  PayModalPay,
} from "../../utils/AnalyticsFunctions";
import { BASE_URL_S3, COINBASE_SECRET_KEY } from "../../utils/Constant";
import { getCurrentUser } from "../../utils/ManageToken";
import {
  loadingAnimation,
  whichSignUpMethod,
} from "../../utils/ReusableFunctions";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import { copyTradePaid } from "../Emulations/EmulationsApi";
import { createUserPayment } from "./Api";

class PaywallCyptoPlansModal extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      isCryptoBtnOneLoading: false,
      isCryptoBtnTwoLoading: false,
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
  async createCharge(payPlan) {
    const url = "https://api.commerce.coinbase.com/charges";

    let redirectLink = BASE_URL_S3 + "crypto-success";

    let minAmount = 20;
    if (payPlan === "quarterly") {
      minAmount = 55;
    } else if (payPlan === "yearly") {
      minAmount = 200;
    }
    const requestBody = {
      local_price: {
        amount: minAmount, //price of charge
        currency: "USD", //currency
      },
      pricing_type: "fixed_price",

      name: "Loch Premium",
      description: "Get access to Loch's premium features",
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
      const myX = await response.json();
      console.log("response.json() ", myX);
      return myX;
    } catch (error) {
      console.error("Error creating charge:", error);
      this.setState({
        isCryptoBtnOneLoading: false,
        isCryptoBtnTwoLoading: false,
      });
    }
  }
  fetchChargeData = async (payPlan) => {
    const chargeData = await this.createCharge(payPlan);
    if (chargeData && chargeData.data && chargeData.data.hosted_url) {
      // setHostedUrl(chargeData.data.hosted_url);
      return chargeData.data.hosted_url;
    }
  };
  payWithCrypto = (payPlan) => {
    if (
      this.state.isCryptoBtnOneLoading ||
      this.state.isCryptoBtnTwoLoading ||
      this.state.isCreditBtnLoading
    ) {
      return;
    }
    if (payPlan === "quarterly") {
      this.setState({
        isCryptoBtnOneLoading: true,
      });
    } else if (payPlan === "yearly") {
      this.setState({
        isCryptoBtnTwoLoading: true,
      });
    }
    this.fetchChargeData(payPlan)
      .then((res) => {
        if (res) {
          let tempIdHolderArr = res.split("/");
          if (tempIdHolderArr && tempIdHolderArr.length > 0) {
            const tempIdHolder = tempIdHolderArr[tempIdHolderArr.length - 1];

            let passData = new URLSearchParams();
            passData.append("charge_id", tempIdHolder);

            this.props.copyTradePaid(passData, res, this.hideModal);
            window.open(res, "_self");
          } else {
            toast.error("Something went wrong here?");
          }
        }
      })
      .catch((err) => {
        this.setState({
          isCryptoBtnOneLoading: false,
          isCryptoBtnTwoLoading: false,
        });
        toast.error("Something went wrong here?");
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

  payQuarterly = () => {
    this.setState({
      isCryptoBtnOneLoading: true,
    });
    this.payWithCrypto("quarterly");
    PayModalPay({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      path: "",
      paymentMethod: "crypto quarterly",
    });
  };
  payYearly = () => {
    this.setState({
      isCryptoBtnTwoLoading: true,
    });
    this.payWithCrypto("yearly");
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
          this.props.isMobile ? "pay-wall-modal-mobile" : "zoomedElements"
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
                      marginTop: "2rem",
                    }}
                    className="inter-display-medium ctpb-payment-title-text f-s-16"
                  >
                    Choose longer and save more
                  </div>
                  <div
                    onClick={this.payQuarterly}
                    className={`ctpb-plan-disable-button inter-display-medium f-s-16 ctpb-plan-payment-button ctpb-plan-payment-button-multiple-months ${
                      this.state.isCryptoBtnOneLoading
                        ? "ctpb-plan-payment-button-disabled ctpb-plan-payment-button-loading"
                        : ""
                    } ${
                      this.state.isCryptoBtnTwoLoading ||
                      this.props.isCreditBtnLoading
                        ? "ctpb-plan-payment-button-disabled"
                        : ""
                    }`}
                  >
                    {this.state.isCryptoBtnOneLoading ? (
                      loadingAnimation()
                    ) : (
                      <>
                        <span>Quarterly</span>
                        <span>$55</span>
                      </>
                    )}
                  </div>
                  <div
                    onClick={this.payYearly}
                    className={`ctpb-plan-disable-button inter-display-medium f-s-16 ctpb-plan-payment-button ctpb-plan-payment-button-multiple-months ${
                      this.state.isCryptoBtnTwoLoading
                        ? "ctpb-plan-payment-button-disabled ctpb-plan-payment-button-loading"
                        : ""
                    } ${
                      this.state.isCryptoBtnOneLoading ||
                      this.props.isCreditBtnLoading
                        ? "ctpb-plan-payment-button-disabled"
                        : ""
                    }`}
                  >
                    {this.state.isCryptoBtnTwoLoading ? (
                      loadingAnimation()
                    ) : (
                      <>
                        <span>Yearly</span>
                        <span>$200</span>
                      </>
                    )}
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
                      this.state.isCryptoBtnOneLoading ||
                      this.state.isCryptoBtnTwoLoading
                        ? "ctpb-plan-payment-button-disabled"
                        : this.props.isCreditBtnLoading
                        ? "ctpb-plan-payment-button-loading"
                        : ""
                    }`}
                    style={{
                      marginBottom: this.props.isMobile ? "" : "12rem",
                    }}
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
const mapDispatchToProps = { createUserPayment, copyTradePaid };

PaywallCyptoPlansModal.propTypes = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaywallCyptoPlansModal);
