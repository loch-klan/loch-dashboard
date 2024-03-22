import React from "react";
import { Image, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { detectCoin, getAllCoins, getAllParentChains } from "../onboarding/Api";

import {
  ChartDonutPaywallIcon,
  ChartLinePaywallIcon,
  CloseIcon,
  CopyTradePayWallIllustrationIcon,
  CopyTradeReviewStarIcon,
  EmultionSidebarIcon,
  LightBulbPaywallIcon,
  LochLogoWhiteIcon,
  PurpleEyeIcon,
} from "../../assets/images/icons";
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import { detectNameTag } from "../common/Api";
import InfoIcon from "../../assets/images/icons/info-icon.svg";
import LockIcon from "../../assets/images/icons/lock-icon.svg";
import { addCopyTrade, copyTradePaid } from "./EmulationsApi";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import { toast } from "react-toastify";
import { BASE_URL_S3 } from "../../utils/Constant";
import { loadingAnimation } from "../../utils/ReusableFunctions";
import { CopyTradePayCryptoPayment } from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";

class EmulationsPaywall extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      isBtnLoading: false,
      show: props.show,
      onHide: this.props.onHide,
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
  async createCharge() {
    const url = "https://api.commerce.coinbase.com/charges";

    let emailHolder = "";
    if (this.props.passedCTNotificationEmailAddress) {
      emailHolder = this.props.passedCTNotificationEmailAddress.toLowerCase();
    }
    let walletHolder = "";
    if (this.props.passedCTAddress) {
      walletHolder = this.props.passedCTAddress;
    }
    let amountHolder = 0;
    if (this.props.passedCTCopyTradeAmount) {
      amountHolder = this.props.passedCTCopyTradeAmount;
    }
    let redirectLink =
      BASE_URL_S3 +
      "copy-trade?addTrade=true&ctrEmail=" +
      emailHolder +
      "&ctrWallet=" +
      walletHolder +
      "&ctrAmount=" +
      amountHolder;

    // let tempToken = getToken();
    // let redirectLink =
    //   BASE_URL_S3 + "auto-login?token=" + tempToken + "&redirect=copy-trade";
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
          this.props.userDetailsState && this.props.userDetailsState.email
            ? this.props.userDetailsState.email
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
    CopyTradePayCryptoPayment({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    if (this.state.isBtnLoading) {
      return;
    }
    this.setState({
      isBtnLoading: true,
    });
    this.fetchChargeData()
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
            toast.error("Something went wrong");
          }
        }
      })
      .catch((err) => {
        this.setState({
          isBtnLoading: false,
        });
        toast.error("Something went wrong");
      });
  };
  hideModal = () => {
    this.state.onHide();
  };
  render() {
    return (
      <Modal
        show={this.state.show}
        className={`exit-overlay-form copy-trade-pay-wall-modal ${
          this.props.isMobile ? "mobile-add-copy-trade-modal" : ""
        }`}
        onHide={this.state.onHide}
        size="lg"
        dialogClassName={"exit-overlay-modal"}
        centered
        aria-labelledby="contained-modal-title-vcenter"
        backdropClassName="exitoverlaymodal"
        animation={false}
      >
        <Modal.Header>
          {this.props.isMobile ? (
            <div className="mobile-copy-trader-popup-header">
              <div className="mobile-copy-trader-popup-header-title-container">
                <Image
                  className="mobile-copy-trader-popup-header-title-icon"
                  src={EmultionSidebarIcon}
                />
                <h6 className="inter-display-medium f-s-20">Copy Trade</h6>
              </div>
              <div
                onClick={this.hideModal}
                className="mobile-copy-trader-popup-header-close-icon"
              >
                <Image src={CloseIcon} />
              </div>
            </div>
          ) : (
            <>
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
          <div className="addWatchListWrapperParent addCopyTradeWrapperParent copy-trade-paywall-body">
            <div className="copy-trade-paywall-body-padding">
              <div
                style={{
                  marginBottom: this.props.isMobile ? "2.3rem" : "3.3rem",
                }}
                className="exit-overlay-body"
              >
                {this.props.isMobile ? null : (
                  <>
                    <h6 className="inter-display-medium f-s-25">
                      Copy Trade with Loch
                    </h6>
                    <p className="inter-display-medium f-s-16 ctpb-sub-text text-center">
                      Upgrade your plan
                    </p>
                  </>
                )}
              </div>

              <div className="ctpb-banner">
                <Image
                  src={CopyTradePayWallIllustrationIcon}
                  className="ctpb-banner-image"
                />
                <div className="ctpb-banner-text">
                  <div className="inter-display-medium f-s-20">
                    The equivalent of a beer to{" "}
                    <span className="ctpb-banner-text-highlited">track</span>,
                  </div>
                  <div className="inter-display-medium f-s-20 mt-1">
                    <span className="ctpb-banner-text-highlited">protect</span>,
                    and{" "}
                    <span className="ctpb-banner-text-highlited">create</span>{" "}
                    your future?
                  </div>
                </div>
              </div>
              <div className="ctpb-plans-container">
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
                    {/* <Image
                      className="ctpb-plan-purple-button-icon"
                      src={PurpleEyeIcon}
                    /> */}
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
                    Unlimited wallets to copy trade
                  </div>
                  <div
                    onClick={this.goCopyTrade}
                    className={`ctpb-plan-disable-button inter-display-medium f-s-16 ctpb-plan-button ${
                      this.state.isBtnLoading ? "ctpb-plan-button-loading" : ""
                    }`}
                  >
                    {this.state.isBtnLoading ? loadingAnimation() : "Upgrade"}
                  </div>
                </div>
              </div>
            </div>

            <div className="ctpb-user-reviews">
              <div className="ctpb-user-reviews-title">
                What our users have to say
              </div>
              <div className="ctpb-user-reviews-scroll-container">
                {this.state.customerData.map((data, index) => (
                  <div
                    style={{
                      marginRight:
                        index === this.state.customerData.length - 1
                          ? "0"
                          : "1.5rem",
                    }}
                    className="ctpb-user-reviews-scroll-block"
                  >
                    <div className="ctpb-uscb-name inter-display-medium f-s-10">
                      {data.name}
                    </div>
                    <div className="ctpb-uscb-twitter inter-display-medium f-s-10">
                      {data.twitterHandle}
                    </div>
                    <div className="ctpb-uscb-rating">
                      {[...Array(data.rating)].map((e, i) => (
                        <Image
                          key={i}
                          src={CopyTradeReviewStarIcon}
                          className="ctpb-uscb-rating-star"
                        />
                      ))}
                    </div>
                    <div className="ctpb-uscb-review inter-display-medium f-s-16">
                      {data.review}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="ctpb-user-discalmier">
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
const mapDispatchToProps = {
  getAllCoins,
  getAllParentChains,
  detectCoin,
  detectNameTag,
  copyTradePaid,
  addCopyTrade,
};

EmulationsPaywall.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(EmulationsPaywall);
