import React, { Component } from "react";
import { connect } from "react-redux";
import {
  hasUserAddedAddressesFun,
  mobileCheck,
  openLoginPopUp,
  openSignUpPopUpDirectly,
  scrollToTop,
} from "../../utils/ReusableFunctions";
import MobileLayout from "../layout/MobileLayout.js";
import WelcomeCard from "../Portfolio/WelcomeCard.js";
import "./_copyTradeWelcome.scss";
import { Image } from "react-bootstrap";
import {
  GreekOne,
  GreekThree,
  GreekTwo,
  LochBigLogoCopyTradeWelcome,
  WhaleTail,
} from "../../assets/images/index.js";
import CopyTradeMobileWelcome from "./CopyTradeMobileWelcome.js";
import { getCurrentUser, getToken } from "../../utils/ManageToken.js";
import {
  CopyTradeWelcomeAddressAdded,
  CopyTradeWelcomeGetStartedClicked,
  CopyTradeWelcomePageSpent,
  CopyTradeWelcomePageView,
} from "../../utils/AnalyticsFunctions.js";

class CopyTradeWelcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: "",
    };
  }
  startPageView = () => {
    this.setState({
      startTime: new Date() * 1,
    });
    CopyTradeWelcomePageView({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    // Inactivity Check
    window.checkCopyTradeWelcomeTimer = setInterval(() => {
      this.checkForInactivity();
    }, 900000);
  };
  updateTimer = (first) => {
    const tempExistingExpiryTime = window.localStorage.getItem(
      "copyTradeWelcomePageExpiryTime"
    );
    if (!tempExistingExpiryTime && !first) {
      this.startPageView();
    }
    const tempExpiryTime = Date.now() + 1800000;
    window.localStorage.setItem(
      "copyTradeWelcomePageExpiryTime",
      tempExpiryTime
    );
  };
  endPageView = () => {
    clearInterval(window.checkCopyTradeWelcomeTimer);
    window.localStorage.removeItem("copyTradeWelcomePageExpiryTime");
    if (this.state.startTime) {
      let endTime = new Date() * 1;
      let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
      CopyTradeWelcomePageSpent({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        time_spent: TimeSpent,
      });
    }
  };
  checkForInactivity = () => {
    const tempExpiryTime = window.localStorage.getItem(
      "copyTradeWelcomePageExpiryTime"
    );
    if (tempExpiryTime && tempExpiryTime < Date.now()) {
      this.endPageView();
    }
  };
  componentDidMount() {
    scrollToTop();
    let tempToken = getToken();
    if (tempToken && tempToken !== "jsk") {
      if (hasUserAddedAddressesFun()) {
        this.props.history.push("/home");
      } else {
        this.props.history.push("/copy-trade");
      }
    } else {
      this.startPageView();
      this.updateTimer(true);
    }
  }
  openLoginPopUpPass = () => {
    CopyTradeWelcomeGetStartedClicked({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    window.localStorage.setItem("copyTradeWelcome", true);
    openSignUpPopUpDirectly();
    // openLoginPopUp();
  };
  funAfterUserCreate = () => {
    CopyTradeWelcomeAddressAdded({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      page: "Copy Trade welcome page",
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
          currentPage={"Copy Trade Welcome"}
          hideAddresses
          hideFooter
          hideShare
          isAddNewAddress
          goToPageAfterLogin="/home"
          funAfterUserCreate={this.funAfterUserCreate}
        >
          <CopyTradeMobileWelcome
            openLoginPopUpPass={this.openLoginPopUpPass}
          />
        </MobileLayout>
      );
    } else
      return (
        <div className="copy-trade-welcome-page-container">
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
                  isAddNewAddressLoggedIn
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
                  isAddNewAddress
                  goToPageAfterLogin="/home"
                  funAfterUserCreate={this.funAfterUserCreate}
                />
              </div>
            </div>
          </div>
          <div className="inter-display-medium copy-trade-welcome-page">
            <div className="ctwp-block ctwp-block-one">
              <div className="ctwpbo-circular-gradient ctwpbo-circular-gradient1" />
              <div className="ctwpbo-circular-gradient ctwpbo-circular-gradient2" />
              <div className="ctwpbo-circular-gradient ctwpbo-circular-gradient3" />
              <div className="ctwp-block-items">
                <div className="ctwpbo-left">
                  <div className="ctwpbol-header">
                    Enabling
                    <br />
                    Onchain Imitation
                  </div>
                  <div className="ctwpbol-desc">Welcome to Loch</div>
                  <div
                    onClick={this.openLoginPopUpPass}
                    className="copy-trade-welcome-button"
                  >
                    Get started
                  </div>
                </div>
                <div className="ctwpbo-right">
                  <Image className="ctwpbor-greek-man" src={GreekOne} />
                </div>
              </div>
            </div>
            <div className="ctwp-block ctwp-block-two">
              <div className="ctwp-block-items">
                <div className="ctwpbtwo-left">
                  <Image className="ctwpbtwor-greek-man" src={GreekTwo} />
                  <div className="ctwpbtwor-greek-man-shadow-container">
                    <div className="ctwpbtwor-greek-man-shadow-gradient" />
                    <Image
                      className="ctwpbtwor-greek-man ctwpbtwor-greek-man-shadow"
                      src={GreekTwo}
                    />
                  </div>
                </div>
                <div className="ctwpbtwo-right">
                  <div className="ctwpbtwor-desc">VERSATILITY</div>
                  <div className="ctwpbtwor-title">
                    Follow, copy-trade, or
                    <br />
                    consult anyone on the
                    <br />
                    blockchain in seconds
                  </div>
                </div>
              </div>
            </div>
            <div className="ctwp-block ctwp-block-one ctwp-block-three">
              <div className="ctwp-block-items">
                <div className="ctwpbo-left">
                  <div className="ctwpbothird-desc">ON THE GO</div>
                  <div className="ctwpbothird-header">
                    Accomplish whale-like
                    <br />
                    returns without monitoring
                    <br />
                    your screen all day
                  </div>
                </div>
                <div className="ctwpbo-right">
                  <Image className="ctwpbor-greek-man" src={WhaleTail} />
                </div>
              </div>
            </div>
            <div className="ctwp-block ctwp-block-four">
              <Image
                className="ctwpbf-loch"
                src={LochBigLogoCopyTradeWelcome}
              />

              <div className="ctwpbf-content">
                <div className="ctwpbofour-header">
                  Don’t be someone else’s exit liquidity
                </div>
                <div className="ctwpbofour-desc">
                  Use Loch’s copy trader to enter and exit safety
                </div>
                <div
                  onClick={this.openLoginPopUpPass}
                  className="copy-trade-welcome-button"
                >
                  Get started
                </div>
              </div>
            </div>
            <div className="ctwp-block ctwp-block-five">
              <div className="ctwpbofive-image">
                <Image className="ctwpbfive-loch" src={GreekThree} />
              </div>
              <div className="ctwpbofive-content-container">
                <div className="ctwpbofive-content">
                  <div className="ctwpbofive-header">
                    “Man differs from animals in his greater aptitude
                    <br />
                    for imitation and mimesis”
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
  }
}
const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CopyTradeWelcome);
