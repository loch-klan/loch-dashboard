import React, { Component } from "react";
import { connect } from "react-redux";
import {
  dontOpenLoginPopup,
  mobileCheck,
} from "../../utils/ReusableFunctions.js";
import WelcomeCard from "../Portfolio/WelcomeCard.js";
import MobileLayout from "../layout/MobileLayout.js";
import AddAddressWalletViewerMobile from "./AddAddressWalletViewerMobile.js";
import "./_addAddressWalletViewer.scss";
import { Image } from "react-bootstrap";
import { DummyHomePageImage } from "../../assets/images/index.js";

class AddAddressWalletViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    dontOpenLoginPopup();
  }
  goBackToWelcome = () => {
    this.props.history.push("/copy-trade-welcome");
  };
  render() {
    if (mobileCheck()) {
      return (
        <MobileLayout
          history={this.props.history}
          isSidebarClosed={this.props.isSidebarClosed}
          currentPage={"insights"}
          hideAddresses
          hideFooter
        >
          <AddAddressWalletViewerMobile />
        </MobileLayout>
      );
    } else
      return (
        <div className="add-address-wv-page-container">
          {/* topbar */}
          <div className="portfolio-page-section ">
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
                  isSidebarClosed={this.props.isSidebarClosed}
                  apiResponse={(e) => this.CheckApiResponse(e)}
                  // history
                  history={this.props.history}
                  // add wallet address modal
                  handleAddModal={this.handleAddModal}
                  updateTimer={this.updateTimer}
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
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="add-address-wv-page">
            <Image className="add-address-wv-bg" src={DummyHomePageImage} />
          </div>
        </div>
      );
  }
}
const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddAddressWalletViewer);
