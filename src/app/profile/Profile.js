import React, { Component } from "react";
// import PropTypes from 'prop-types';
import { connect } from "react-redux";
// import Sidebar from '../common/Sidebar';
import {
  ProfilePage,
  TimeSpentProfile,
  UpgradeBannerClicked,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import PageHeader from "./../common/PageHeader";
import ProfileForm from "./ProfileForm";

// add wallet
import { Col, Image, Row } from "react-bootstrap";
import AddWalletModalIcon from "../../assets/images/icons/wallet-icon.svg";
import {
  GetAllPlan,
  getUser,
  setPageFlagDefault,
  updateWalletListFlag,
} from "../common/Api";
import FixAddModal from "../common/FixAddModal";

// Upgrade
import {
  PasswordPurpleIcon,
  PremiumBannerCheckCircleIcon,
  PremiumBannerDiamondIcon,
  PremiumBannerDownloadIcon,
  PremiumBannerLayersIcon,
  PremiumBannerLochIcon,
  PremiumBannerSwapIcon,
  PremiumBannerTelegramIcon,
  PremiumBannerWalletIcon,
  UserCreditScrollRightArrowIcon,
} from "../../assets/images/icons";
import insight from "../../assets/images/icons/InactiveIntelligenceIcon.svg";
import DefiIcon from "../../assets/images/icons/upgrade-defi.svg";
import ExportIcon from "../../assets/images/icons/upgrade-export.svg";
import NotificationLimitIcon from "../../assets/images/icons/upgrade-notification-limit.svg";
import NotificationIcon from "../../assets/images/icons/upgrade-notifications.svg";
import UploadIcon from "../../assets/images/icons/upgrade-upload.svg";
import WalletIcon from "../../assets/images/icons/upgrade-wallet.svg";
import WhalePodAddressIcon from "../../assets/images/icons/upgrade-whale-pod-add.svg";
import WhalePodIcon from "../../assets/images/icons/upgrade-whale-pod.svg";
import { BASE_URL_S3 } from "../../utils/Constant";
import {
  isPremiumUser,
  mobileCheck,
  scrollToTop,
} from "../../utils/ReusableFunctions";
import WelcomeCard from "../Portfolio/WelcomeCard";
import { getReferallCodes } from "../ReferralCodes/ReferralCodesApi";
import { PaywallModal } from "../common";
import UpgradeModal from "../common/upgradeModal";
import TopWalletAddressList from "../header/TopWalletAddressList";
import MobileLayout from "../layout/MobileLayout";
import Wallet from "../wallet/Wallet";
import { ManageLink } from "./Api";
import ProfileLochCreditPoints from "./ProfileLochCreditPoints";
import ProfileMobile from "./ProfileMobile";

class Profile extends Component {
  constructor(props) {
    super(props);
    const Plans = JSON.parse(window.localStorage.getItem("Plans"));
    let selectedPlan = {};
    let userPlan =
      JSON.parse(window.localStorage.getItem("currentPlan")) || "Free";
    Plans?.map((plan) => {
      if (plan.name === userPlan.name) {
        let price = plan.prices ? plan.prices[0]?.unit_amount / 100 : 0;
        selectedPlan = {
          // Upgrade plan
          price: price,
          price_id: plan.prices ? plan.prices[0]?.id : "",
          name: plan.name,
          id: plan.id,
          plan_reference_id: plan.plan_reference_id,
          plan_valid: userPlan?.subscription?.valid_till,
          features: [
            {
              name: "Wallet addresses",
              limit: plan.wallet_address_limit,
              img: WalletIcon,
              id: 1,
            },
            {
              name: plan.whale_pod_limit > 1 ? "Whale pods" : "Whale pod",
              limit: plan.whale_pod_limit,
              img: WhalePodIcon,
              id: 2,
            },
            {
              name:
                plan.name === "Free"
                  ? "Influencer whale pod"
                  : "Influencer whale pods",
              limit: plan.name === "Free" ? 1 : -1,
              img: WhalePodAddressIcon,
              id: 3,
            },
            {
              name: "Notifications",
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
              name: "DeFi details",
              limit: plan.defi_enabled,
              img: DefiIcon,
              id: 6,
            },
            {
              name: "Insights",
              limit: plan?.insight ? true : price > 0 ? true : false,
              img: insight,
              id: 9,
            },
            {
              name: "Export addresses",
              limit: plan.export_address_limit,
              img: ExportIcon,
              id: 7,
            },
            {
              name: "Upload address csv/txt",
              limit: plan.upload_csv,
              img: UploadIcon,
              id: 8,
            },
          ],
        };
      }
    });

    this.state = {
      // add new wallet
      isLochPaymentModal: false,
      isPremium: isPremiumUser(),
      isInputFocused: false,
      isMobileDevice: false,
      codesLeftToUse: false,
      userWalletList: window.localStorage.getItem("addWallet")
        ? JSON.parse(window.localStorage.getItem("addWallet"))
        : [],
      addModal: false,
      isUpdate: 0,
      selectedPlan: selectedPlan ? selectedPlan : {},
      manageUrl: "",
      upgradeModal: false,

      startTime: "",
      followFlag: false,
      lochUser: undefined,
      premiumBannerItems: [
        { icon: PremiumBannerSwapIcon, text: "Unlimited Copy trades" },
        { icon: PremiumBannerWalletIcon, text: "Analyze wallets PnL" },
        // { icon: PremiumBannerBellIcon, text: "Unlimited Notifications" },
        { icon: PremiumBannerLayersIcon, text: "Analyze gas fees" },
        { icon: PremiumBannerDownloadIcon, text: "Unlimited data exports" },
        { icon: PremiumBannerLochIcon, text: "10 points each month" },
        {
          icon: PremiumBannerWalletIcon,
          text: "Unlimited wallets aggregation",
        },
        {
          icon: PremiumBannerTelegramIcon,
          text: "Platinum telegram channel",
        },
      ],
    };
  }

  onFollowUpdate = () => {
    this.setState({
      followFlag: !this.state.followFlag,
    });
  };
  startPageView = () => {
    this.setState({
      startTime: new Date() * 1,
    });
    ProfilePage({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    // Inactivity Check
    window.checkProfileTimer = setInterval(() => {
      this.checkForInactivity();
    }, 900000);
  };
  componentDidMount() {
    scrollToTop();
    setTimeout(() => {
      this.setState({
        isPremium: isPremiumUser(),
      });
    }, 1000);
    if (mobileCheck()) {
      // this.props.history.push("/home");
      this.setState({
        isMobileDevice: true,
      });
    }
    const isLochUser = JSON.parse(window.localStorage.getItem("lochUser"));
    if (isLochUser) {
      this.setState({
        lochUser: isLochUser,
      });
    }
    this.props.GetAllPlan();
    this.props.getUser();
    if (isLochUser && isLochUser.email) {
      this.props.getReferallCodes();
    } else {
      this.setState({
        codesLeftToUse: 20,
      });
    }
    ManageLink(this);

    this.startPageView();
    this.updateTimer(true);

    return () => {
      clearInterval(window.checkProfileTimer);
    };
  }
  CheckApiResponse = () => {
    this.props.setPageFlagDefault();
  };
  componentDidUpdate(prevProps) {
    if (!this.props.commonState.profilePage) {
      this.setState({
        isPremium: isPremiumUser(),
      });
      this.props.updateWalletListFlag("profilePage", true);
      this.props.GetAllPlan();
      this.props.getUser();
      const isLochUser = JSON.parse(window.localStorage.getItem("lochUser"));
      if (isLochUser && isLochUser.email) {
        this.props.getReferallCodes();
      }
      setTimeout(() => {
        const isLochUser = JSON.parse(window.localStorage.getItem("lochUser"));
        if (isLochUser) {
          this.setState({
            lochUser: isLochUser,
          });
        }
      }, 3000);
    }
    if (prevProps.referralCodesState !== this.props.referralCodesState) {
      let tempCodesLeft = 0;
      this.props.referralCodesState.forEach((curReferralCode) => {
        if (!curReferralCode.used) {
          tempCodesLeft++;
        }
      });
      this.setState({
        codesLeftToUse: tempCodesLeft,
      });
    }
  }
  updateTimer = (first) => {
    const tempExistingExpiryTime = window.localStorage.getItem(
      "profilePageExpiryTime"
    );
    if (!tempExistingExpiryTime && !first) {
      this.startPageView();
    }
    const tempExpiryTime = Date.now() + 1800000;
    window.localStorage.setItem("profilePageExpiryTime", tempExpiryTime);
  };
  endPageView = () => {
    clearInterval(window.checkProfileTimer);
    window.localStorage.removeItem("profilePageExpiryTime");
    if (this.state.startTime) {
      let endTime = new Date() * 1;
      let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
      TimeSpentProfile({
        time_spent: TimeSpent,
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
    }
  };
  checkForInactivity = () => {
    const tempExpiryTime = window.localStorage.getItem("profilePageExpiryTime");
    if (tempExpiryTime && tempExpiryTime < Date.now()) {
      this.endPageView();
    }
  };
  componentWillUnmount() {
    const tempExpiryTime = window.localStorage.getItem("profilePageExpiryTime");
    if (tempExpiryTime) {
      this.endPageView();
    }
  }
  upgradeModal = () => {
    this.setState({
      upgradeModal: !this.state.upgradeModal,
      userPlan: JSON.parse(window.localStorage.getItem("currentPlan")),
    });
  };

  // For add new address
  handleAddModal = () => {
    this.setState({
      addModal: !this.state.addModal,
    });
  };

  handleUpdateWallet = () => {
    // window.location.reload()
    this.setState({
      isUpdate: this.state.isUpdate === 0 ? 1 : 0,
    });
  };

  handleChangeList = (value) => {
    this.setState({
      // for add wallet
      userWalletList: value,
      isUpdate: this.state.isUpdate === 0 ? 1 : 0,
    });

    this.props.setPageFlagDefault();
  };
  goToMyReferralCodes = () => {
    if (this.state.lochUser && this.state.lochUser.email) {
      if (isPremiumUser()) {
        this.props.history.push("/profile/referral-codes");
      } else {
        this.showPaymentModal();
      }
    } else {
      window.localStorage.setItem("referralCodesSignInModal", true);
      if (document.getElementById("sidebar-open-sign-in-btn")) {
        document.getElementById("sidebar-open-sign-in-btn").click();
        this.dontOpenLoginPopup();
      } else if (document.getElementById("sidebar-closed-sign-in-btn")) {
        document.getElementById("sidebar-closed-sign-in-btn").click();
        this.dontOpenLoginPopup();
      }
    }
  };
  dontOpenLoginPopup = () => {
    window.localStorage.setItem("dontOpenLoginPopup", true);
  };
  showFocusedInput = () => {
    this.setState({
      isInputFocused: true,
    });
  };
  hideFocusedInput = () => {
    this.setState({
      isInputFocused: false,
    });
  };
  focusOriginalInputBar = () => {
    if (
      document.getElementById("topBarContainerInputBlockInputId") &&
      document.getElementById("topBarContainerInputBlockInputId").focus
    ) {
      document.getElementById("topBarContainerInputBlockInputId").focus();
    }
    if (this.state.isMobileDevice) {
      if (
        document.getElementById("newWelcomeWallet-1") &&
        document.getElementById("newWelcomeWallet-1").focus
      ) {
        document.getElementById("newWelcomeWallet-1").focus();
      }
    }
  };
  hidePaymentModal = () => {
    this.setState({
      isLochPaymentModal: false,
    });
  };
  showPaymentModal = () => {
    this.setState({
      isLochPaymentModal: true,
    });
  };
  upgradeNowBtnClick = () => {
    const isLochUser = JSON.parse(window.localStorage.getItem("lochUser"));
    if (isLochUser && isLochUser.email) {
      UpgradeBannerClicked({
        session_id: getCurrentUser ? getCurrentUser()?.id : "",
        email_address: getCurrentUser ? getCurrentUser()?.email : "",
      });
      this.showPaymentModal();
    } else {
      window.localStorage.setItem(
        "upgradePremiumProfileBannerSignInModal",
        true
      );
      if (document.getElementById("sidebar-open-sign-in-btn")) {
        document.getElementById("sidebar-open-sign-in-btn").click();
      } else if (document.getElementById("sidebar-closed-sign-in-btn")) {
        document.getElementById("sidebar-closed-sign-in-btn").click();
      }
    }
  };
  render() {
    if (this.state.isMobileDevice) {
      return (
        <MobileLayout
          handleShare={() => null}
          currentPage={"profile"}
          hideFooter
          history={this.props.history}
          isUpdate={this.state.isUpdate}
          updateTimer={this.updateTimer}
          hideShare
          hideAddresses
        >
          {this.state.isLochPaymentModal ? (
            <PaywallModal
              show={this.state.isLochPaymentModal}
              onHide={this.hidePaymentModal}
              redirectLink={BASE_URL_S3 + "/intelligence/insights"}
              hideBackBtn
              isMobile
            />
          ) : null}
          <ProfileMobile
            goToMyReferralCodes={this.goToMyReferralCodes}
            upgradeNowBtnClick={this.upgradeNowBtnClick}
            followFlag={this.state.followFlag}
            isUpdate={this.state.isUpdate}
            lochUser={this.state.lochUser}
            codesLeftToUse={this.state.codesLeftToUse}
            premiumBannerItems={this.state.premiumBannerItems}
            isPremium={this.state.isPremium}
            history={this.props.history}
          />
        </MobileLayout>
      );
    }
    return (
      <>
        {/* topbar */}
        <div className="portfolio-page-section">
          <div
            className="portfolio-container page"
            style={{ overflow: "visible" }}
          >
            <div className="portfolio-section">
              {/* welcome card */}
              <WelcomeCard
                openConnectWallet={this.props.openConnectWallet}
                connectedWalletAddress={this.props.connectedWalletAddress}
                connectedWalletevents={this.props.connectedWalletevents}
                disconnectWallet={this.props.disconnectWallet}
                updateOnFollow={this.onFollowUpdate}
                isSidebarClosed={this.props.isSidebarClosed}
                apiResponse={(e) => this.CheckApiResponse(e)}
                history={this.props.history}
                // add wallet address modal
                handleAddModal={this.handleAddModal}
                handleUpdate={this.handleUpdateWallet}
              />
            </div>
          </div>
        </div>
        {this.state.isInputFocused ? (
          <div onClick={this.hideFocusedInput} className="blurredElement">
            <div className="portfolio-page-section">
              <div
                className="portfolio-container page"
                style={{ overflow: "visible" }}
              >
                <div className="portfolio-section">
                  {/* welcome card */}
                  <WelcomeCard
                    isBlurred
                    focusOriginalInputBar={this.focusOriginalInputBar}
                    hideFocusedInput={this.hideFocusedInput}
                    openConnectWallet={this.props.openConnectWallet}
                    connectedWalletAddress={this.props.connectedWalletAddress}
                    connectedWalletevents={this.props.connectedWalletevents}
                    disconnectWallet={this.props.disconnectWallet}
                    updateOnFollow={this.onFollowUpdate}
                    isSidebarClosed={this.props.isSidebarClosed}
                    apiResponse={(e) => this.CheckApiResponse(e)}
                    history={this.props.history}
                    // add wallet address modal
                    handleAddModal={this.handleAddModal}
                    handleUpdate={this.handleUpdateWallet}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : null}
        <div className="profile-page-section m-t-80">
          <div className="profile-section page-scroll">
            <div className="page-scroll-child">
              {this.state.addModal && (
                <FixAddModal
                  show={this.state.addModal}
                  onHide={this.handleAddModal}
                  modalIcon={AddWalletModalIcon}
                  title="Add wallet address"
                  subtitle="Add more wallet address here"
                  modalType="addwallet"
                  btnStatus={false}
                  btnText="Go"
                  history={this.props.history}
                  changeWalletList={this.handleChangeList}
                  from="profile"
                />
              )}

              <PageHeader
                title="Profile"
                subTitle="Manage your profile here"
                // btnText={"Add wallet"}
                // handleBtn={this.handleAddModal}
                // // connect exchange btn
                // SecondaryBtn={true}
                // handleUpdate={this.handleUpdateWallet}
              />
              <div style={{ marginBottom: "3rem" }}>
                <Row>
                  <Col md={12}>
                    <ProfileLochCreditPoints
                      followFlag={this.state.followFlag}
                      isUpdate={this.state.isUpdate}
                      history={this.props.history}
                      lochUser={this.state.lochUser}
                      showFocusedInput={this.showFocusedInput}
                    />
                  </Col>
                </Row>
              </div>
              {this.state.isLochPaymentModal ? (
                <PaywallModal
                  show={this.state.isLochPaymentModal}
                  onHide={this.hidePaymentModal}
                  redirectLink={BASE_URL_S3 + "/intelligence/insights"}
                  hideBackBtn
                />
              ) : null}
              <div className="profile-section-loch-premium-banner">
                <div className="pslpl-heading">
                  <Image
                    className="pslpl-icon"
                    src={PremiumBannerDiamondIcon}
                  />
                  <div className="inter-display-medium pslpl-text">
                    Loch Premium
                  </div>
                </div>
                {this.state.isPremium ? (
                  <div
                    style={{
                      marginTop: "3rem",
                    }}
                    className="profile-section-loch-premium"
                  >
                    <div className="pslp-left">
                      <div
                        style={{
                          transform: "translateY(-5rem)",
                        }}
                        className="pslpl-banner"
                      >
                        <div className="inter-display-medium pslpl-banner-des">
                          Exclusive benefits
                        </div>
                        <div className="pslpl-banner-heading">
                          <Image
                            src={PremiumBannerCheckCircleIcon}
                            className="pslpl-banner-heading-image"
                          />
                          <div className="inter-display-medium pslpl-banner-heading-text">
                            Activated
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="pslp-right">
                      <div className="pslpl-conent">
                        {this.state.premiumBannerItems.map(
                          (itemBlock, index) => (
                            <div>
                              <div key={index} className="pslpl-item-block">
                                <Image
                                  className="pslpl-item-block-icon"
                                  src={itemBlock.icon}
                                />
                                <div className="inter-display-medium pslpl-item-block-text">
                                  {itemBlock.text}
                                </div>
                              </div>
                              {itemBlock.text ===
                              "Platinum telegram channel" ? (
                                <>
                                  <div
                                    style={{
                                      marginTop: "0.5rem",
                                    }}
                                    className="pslpl-item-block"
                                  >
                                    <Image
                                      className="pslpl-item-block-icon"
                                      src={itemBlock.icon}
                                      style={{
                                        opacity: "0",
                                      }}
                                    />
                                    <div className="pslpl-item-block-bullet-item" />
                                    <div className="inter-display-medium pslpl-item-block-text">
                                      <span>Over $400m liquid onchain AUM</span>
                                    </div>
                                  </div>
                                  <div
                                    style={{
                                      marginTop: "0.5rem",
                                    }}
                                    className="pslpl-item-block"
                                  >
                                    <Image
                                      className="pslpl-item-block-icon"
                                      src={itemBlock.icon}
                                      style={{
                                        opacity: "0",
                                      }}
                                    />
                                    <div className="pslpl-item-block-bullet-item" />
                                    <div className="inter-display-medium pslpl-item-block-text">
                                      <span>Over 500k twitter followers</span>
                                    </div>
                                  </div>
                                  <div
                                    style={{
                                      marginTop: "0.5rem",
                                    }}
                                    className="pslpl-item-block"
                                  >
                                    <Image
                                      className="pslpl-item-block-icon"
                                      src={itemBlock.icon}
                                      style={{
                                        opacity: "0",
                                      }}
                                    />
                                    <div className="pslpl-item-block-bullet-item" />
                                    <div className="inter-display-medium pslpl-item-block-text">
                                      <span>Daily trade ideas</span>
                                    </div>
                                  </div>
                                </>
                              ) : null}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="profile-section-loch-premium">
                    <div className="pslp-left">
                      <div className="pslpl-conent">
                        {this.state.premiumBannerItems.map(
                          (itemBlock, index) => (
                            <div>
                              <div key={index} className="pslpl-item-block">
                                <Image
                                  className="pslpl-item-block-icon"
                                  src={itemBlock.icon}
                                />
                                <div className="inter-display-medium pslpl-item-block-text">
                                  {itemBlock.text}
                                </div>
                              </div>
                              {itemBlock.text ===
                              "Platinum telegram channel" ? (
                                <>
                                  <div
                                    style={{
                                      marginTop: "0.5rem",
                                    }}
                                    className="pslpl-item-block"
                                  >
                                    <Image
                                      className="pslpl-item-block-icon"
                                      src={itemBlock.icon}
                                      style={{
                                        opacity: "0",
                                      }}
                                    />
                                    <div className="pslpl-item-block-bullet-item" />
                                    <div className="inter-display-medium pslpl-item-block-text">
                                      <span>Over $400m liquid onchain AUM</span>
                                    </div>
                                  </div>
                                  <div
                                    style={{
                                      marginTop: "0.5rem",
                                    }}
                                    className="pslpl-item-block"
                                  >
                                    <Image
                                      className="pslpl-item-block-icon"
                                      src={itemBlock.icon}
                                      style={{
                                        opacity: "0",
                                      }}
                                    />
                                    <div className="pslpl-item-block-bullet-item" />
                                    <div className="inter-display-medium pslpl-item-block-text">
                                      <span>Over 500k twitter followers</span>
                                    </div>
                                  </div>
                                  <div
                                    style={{
                                      marginTop: "0.5rem",
                                    }}
                                    className="pslpl-item-block"
                                  >
                                    <Image
                                      className="pslpl-item-block-icon"
                                      src={itemBlock.icon}
                                      style={{
                                        opacity: "0",
                                      }}
                                    />
                                    <div className="pslpl-item-block-bullet-item" />
                                    <div className="inter-display-medium pslpl-item-block-text">
                                      <span>Daily trade ideas</span>
                                    </div>
                                  </div>
                                </>
                              ) : null}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                    <div
                      style={{
                        transform: "translateY(-4rem)",
                      }}
                      className="pslp-right"
                    >
                      <div className="pslpr-desc">Not a member yet</div>
                      <div className="pslpr-heading">
                        Join Loch Premium and enjoy
                        <br />
                        exclusive benefits
                      </div>
                      <button
                        onClick={this.upgradeNowBtnClick}
                        className="pslpr-btn"
                      >
                        Upgrade now
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div
                onClick={this.goToMyReferralCodes}
                className="profile-section-referall-code-btn"
              >
                <div className="psrcb-left">
                  <Image className="psrcb-icon" src={PasswordPurpleIcon} />
                  <div className="inter-display-medium psrcb-text">
                    Referral codes
                  </div>
                </div>
                <div className="psrcb-right">
                  {this.state.codesLeftToUse ? (
                    <div className="inter-display-medium psrcb-small-text">
                      {this.state.codesLeftToUse} left
                    </div>
                  ) : null}
                  <Image
                    className="psrcb-arrow-icon"
                    src={UserCreditScrollRightArrowIcon}
                  />
                </div>
              </div>
              {/* wallet page component */}
              <Wallet
                hidePageHeader={true}
                isUpdate={this.state.isUpdate}
                updateTimer={this.updateTimer}
              />

              <PageHeader
                title="Your details"
                subTitle=""
                // btnText={"Add wallet"}
                // handleBtn={this.handleAddModal}
                // // connect exchange btn
                // SecondaryBtn={true}
                // handleUpdate={this.handleUpdateWallet}
              />

              <div
                className="profile-form-section"
                style={{ marginBottom: "4rem" }}
              >
                <Row>
                  <Col md={12}>
                    <ProfileForm userDetails={this.state.lochUser} />
                  </Col>
                </Row>
              </div>

              {this.state.upgradeModal && (
                <UpgradeModal
                  show={this.state.upgradeModal}
                  onHide={this.upgradeModal}
                  history={this.props.history}
                  isShare={window.localStorage.getItem("share_id")}
                  isStatic={this.state.isStatic}
                  triggerId={0}
                  pname="profile"
                  updateTimer={this.updateTimer}
                />
              )}
              {/* <FeedbackForm page={"Profile Page"} /> */}
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  profileState: state.ProfileState,
  commonState: state.CommonState,
  referralCodesState: state.ReferralCodesState,
});
const mapDispatchToProps = {
  // getPosts: fetchPosts
  setPageFlagDefault,
  GetAllPlan,
  getUser,
  updateWalletListFlag,
  getReferallCodes,
};
Profile.propTypes = {
  // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
