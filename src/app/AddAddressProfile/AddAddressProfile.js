import React, { Component } from "react";
import { Col, Image, Row } from "react-bootstrap";
import { connect } from "react-redux";
import {
  PasswordPurpleIcon,
  PremiumBannerCheckCircleIcon,
  PremiumBannerDiamondIcon,
  PremiumBannerDownloadIcon,
  PremiumBannerLayersIcon,
  PremiumBannerLochIcon,
  PremiumBannerTelegramIcon,
  PremiumBannerWalletIcon,
  UserCreditScrollRightArrowIcon,
} from "../../assets/images/icons/index.js";
import {
  dontOpenLoginPopup,
  mobileCheck,
  scrollToTop,
} from "../../utils/ReusableFunctions.js";
import WelcomeCard from "../Portfolio/WelcomeCard.js";
import PageHeader from "../common/PageHeader.js";
import TopWalletAddressList from "../header/TopWalletAddressList.js";
import MobileLayout from "../layout/MobileLayout.js";
import ProfileLochCreditPoints from "../profile/ProfileLochCreditPoints.js";
import AddAddressProfileMobile from "./AddAddressProfileMobile.js";
import "./_addAddressProfile.scss";
import { getCurrentUser, getToken } from "../../utils/ManageToken.js";
import { CopyTradeWelcomeAddressAdded } from "../../utils/AnalyticsFunctions.js";

class AddAddressProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      premiumBannerItems: [
        // { icon: PremiumBannerSwapIcon, text: "Unlimited Copy trades" },
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
  componentDidMount() {
    scrollToTop();
    dontOpenLoginPopup();
    let tempToken = getToken();
    if (tempToken && tempToken !== "jsk") {
      this.props.history.push("/profile");
    }
  }
  goBackToWelcome = () => {
    this.props.history.push("/copy-trade-welcome");
  };
  funAfterUserCreate = () => {
    CopyTradeWelcomeAddressAdded({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      page: "Profile page",
    });
  };
  render() {
    if (mobileCheck()) {
      return (
        <MobileLayout
          showTopSearchBar
          isAddNewAddressLoggedIn
          history={this.props.history}
          isSidebarClosed={this.props.isSidebarClosed}
          currentPage={"insights"}
          hideAddresses
          hideFooter
          goBackToWelcomePage={this.goBackToWelcome}
          blurredElement
          goToPageAfterLogin="/profile"
          isAddNewAddress
          hideShare
          funAfterUserCreate={this.funAfterUserCreate}
        >
          <AddAddressProfileMobile
            premiumBannerItems={this.state.premiumBannerItems}
          />
        </MobileLayout>
      );
    } else
      return (
        <div className="add-address-profile-page-container">
          {/* topbar */}
          <div className="portfolio-page-section ">
            <div
              className="portfolio-container page"
              style={{ overflow: "visible" }}
            >
              <div className="portfolio-section">
                {/* welcome card */}
                <WelcomeCard
                  showTopSearchBar
                  openConnectWallet={this.props.openConnectWallet}
                  connectedWalletAddress={this.props.connectedWalletAddress}
                  connectedWalletevents={this.props.connectedWalletevents}
                  disconnectWallet={this.props.disconnectWallet}
                  isSidebarClosed={this.props.isSidebarClosed}
                  apiResponse={(e) => this.CheckApiResponse(e)}
                  // history
                  history={this.props.history}
                  // add wallet address modal
                  handleAddModal={this.handleAddModal}
                  updateTimer={this.updateTimer}
                  goToPageAfterLogin="/profile"
                  funAfterUserCreate={this.funAfterUserCreate}
                />
              </div>
            </div>
          </div>
          <div onClick={this.goBackToWelcome} className="blurredElement">
            <div className="portfolio-page-section">
              <div
                className="portfolio-container page"
                style={{ overflow: "visible" }}
              >
                <div className="portfolio-section">
                  {/* welcome card */}
                  <WelcomeCard
                    showTopSearchBar
                    isAddNewAddressLoggedIn
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
                    isAddNewAddress
                    goToPageAfterLogin="/profile"
                    funAfterUserCreate={this.funAfterUserCreate}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="profile-page-section">
            <div className="profile-section page">
              <TopWalletAddressList apiResponse={(e) => null} hideFollow />
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
                      showFocusedInput={this.showFocusedInput}
                      dontCallApis
                    />
                  </Col>
                </Row>
              </div>

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
                      <div className="pslpl-banner">
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
                            <div key={index} className="pslpl-item-block">
                              <Image
                                className="pslpl-item-block-icon"
                                src={itemBlock.icon}
                              />
                              <div className="inter-display-medium pslpl-item-block-text">
                                {itemBlock.text}
                              </div>
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
                            <div key={index} className="pslpl-item-block">
                              <Image
                                className="pslpl-item-block-icon"
                                src={itemBlock.icon}
                              />
                              <div className="inter-display-medium pslpl-item-block-text">
                                {itemBlock.text}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                    <div className="pslp-right">
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
              {/* <Wallet
                hidePageHeader={true}
                isUpdate={this.state.isUpdate}
                updateTimer={this.updateTimer}
              /> */}

              {/* <PageHeader
                title="Your details"
                subTitle=""
                // btnText={"Add wallet"}
                // handleBtn={this.handleAddModal}
                // // connect exchange btn
                // SecondaryBtn={true}
                // handleUpdate={this.handleUpdateWallet}
              /> */}
              {/* 
              <div
                className="profile-form-section"
                style={{ marginBottom: "4rem" }}
              >
                <Row>
                  <Col md={12}>
                    <ProfileForm userDetails={this.state.lochUser} />
                  </Col>
                </Row>
              </div> */}
            </div>
          </div>
        </div>
      );
  }
}
const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(AddAddressProfile);
