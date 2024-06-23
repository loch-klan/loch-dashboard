import React, { Component } from "react";
import { Col, Image, Row } from "react-bootstrap";
import { connect } from "react-redux";
import {
  HomeTabArrowIcon,
  InfoIconI,
} from "../../assets/images/icons/index.js";
import {
  dontOpenLoginPopup,
  mobileCheck,
  scrollToTop,
} from "../../utils/ReusableFunctions.js";
import WelcomeCard from "../Portfolio/WelcomeCard.js";
import Footer from "../common/footer.js";
import MobileLayout from "../layout/MobileLayout.js";
import AddAddressWalletViewerMobile from "./AddAddressWalletViewerMobile.js";
import "./_addAddressWalletViewer.scss";
import { getCurrentUser, getToken } from "../../utils/ManageToken.js";
import { CopyTradeWelcomeAddressAdded } from "../../utils/AnalyticsFunctions.js";

class AddAddressWalletViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blockOneSelectedItem: 1,
      blockTwoSelectedItem: 1,
      blockThreeSelectedItem: mobileCheck() ? 4 : 1,
      blockFourSelectedItem: 1,
      lochUserState: window.localStorage.getItem("lochToken"),
    };
  }
  componentDidMount() {
    scrollToTop();
    dontOpenLoginPopup();
    const userWalletList = window.localStorage.getItem("addWallet")
      ? JSON.parse(window.localStorage.getItem("addWallet"))
      : [];
    if (userWalletList && userWalletList.length > 0) {
      this.props.history.push("/home");
    }
    // let tempToken = getToken();
    // if (tempToken && tempToken !== "jsk") {
    //   this.props.history.push("/home");
    // }
  }
  goBackToWelcome = () => {
    this.props.history.push("/copy-trade-welcome");
  };
  funAfterUserCreate = (passedAddress) => {
    CopyTradeWelcomeAddressAdded({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      page: "Wallet viewer page",
    });
  };
  CheckApiResponse = () => {};
  handleUpdateWallet = () => {};
  render() {
    if (mobileCheck()) {
      return (
        <MobileLayout
          showTopSearchBar
          shouldGoToHomeAfterReplace
          history={this.props.history}
          isSidebarClosed={this.props.isSidebarClosed}
          currentPage={"home"}
          hideAddresses
          hideFooter
          goBackToWelcomePage={this.goBackToWelcome}
          blurredElement
          goToPageAfterLogin="/home"
          isAddNewAddress
          isAddNewAddressLoggedIn={
            !this.state.lochUserState || this.state.lochUserState === "jsk"
          }
          hideShare
          funAfterUserCreate={this.funAfterUserCreate}
        >
          <AddAddressWalletViewerMobile
            blockOneSelectedItem={this.state.blockOneSelectedItem}
            blockTwoSelectedItem={this.state.blockTwoSelectedItem}
            blockThreeSelectedItem={this.state.blockThreeSelectedItem}
            blockFourSelectedItem={this.state.blockFourSelectedItem}
          />
        </MobileLayout>
      );
    } else
      return (
        <div className="add-address-wv-page-container portfolio-page-section">
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
                  goToPageAfterLogin="/home"
                  funAfterUserCreate={this.funAfterUserCreate}
                />
              </div>
            </div>
          </div>
          <div
            className="portfolio-section"
            style={{
              minWidth: "85rem",
              maxWidth: "100rem",
              width: "100rem",
              marginTop: "11rem",
            }}
          ></div>
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
                    shouldGoToHomeAfterReplace
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
                    isAddNewAddressLoggedIn={
                      !this.state.lochUserState ||
                      this.state.lochUserState === "jsk"
                    }
                    funAfterUserCreate={this.funAfterUserCreate}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="portfolio-page-section">
            <div
              className="portfolio-container page"
              style={{ overflow: "visible" }}
            >
              <div className="m-b-22 graph-table-section">
                <Row>
                  <Col md={6}>
                    <div
                      className="m-r-16 section-table"
                      style={{
                        height: "41rem",
                        display: "flex",
                        flexDirection: "column",
                        minHeight: "41rem",
                        marginBottom: 0,
                      }}
                    >
                      <div className="section-table-toggle-container">
                        <div className="section-table-toggle">
                          <div
                            className={`inter-display-medium section-table-toggle-element mr-1 ${
                              this.state.blockOneSelectedItem === 1
                                ? "section-table-toggle-element-selected"
                                : ""
                            }`}
                            onClick={() => {
                              if (this.state.blockOneSelectedItem === 1)
                                this.goToAssetsPage();
                              else this.changeBlockOneItem(1);
                            }}
                          >
                            Tokens
                            <Image
                              src={InfoIconI}
                              className="infoIcon info-icon-home"
                              style={{
                                cursor: "pointer",
                                height: "13px",
                              }}
                            />
                            <Image
                              className="homeTabArrowIcon"
                              src={HomeTabArrowIcon}
                            />
                          </div>

                          <div
                            className={`inter-display-medium section-table-toggle-element ml-1 mr-1 ${
                              this.state.blockOneSelectedItem === 2
                                ? "section-table-toggle-element-selected"
                                : ""
                            }`}
                            onClick={() => {
                              if (this.state.blockOneSelectedItem === 2)
                                this.goToTransactionHistoryPage();
                              else this.changeBlockOneItem(2);
                            }}
                          >
                            Transactions
                            <Image
                              src={InfoIconI}
                              className="infoIcon info-icon-home"
                              style={{
                                cursor: "pointer",
                                height: "13px",
                              }}
                            />
                            <Image
                              className="homeTabArrowIcon"
                              src={HomeTabArrowIcon}
                            />
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          width: "100%",
                          flex: 1,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          color: "var(--tableCostCommonColor)",
                          fontSize: "13px",
                          textAlign: "center",
                        }}
                        className="inter-display-medium"
                      >
                        Understand your unrealized profit and loss per token
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div
                      className="section-table"
                      style={{
                        height: "41rem",
                        display: "flex",
                        flexDirection: "column",
                        minHeight: "41rem",
                        marginBottom: 0,
                      }}
                    >
                      <div className="section-table-toggle-container">
                        <div className="section-table-toggle">
                          <div
                            className={`inter-display-medium section-table-toggle-element mr-1 ${
                              this.state.blockTwoSelectedItem === 1
                                ? "section-table-toggle-element-selected"
                                : ""
                            }`}
                            onClick={() => {
                              if (this.state.blockTwoSelectedItem === 1)
                                this.goToRealizedGainsPage();
                              else this.changeBlockTwoItem(1);
                            }}
                          >
                            Flows
                            <Image
                              src={InfoIconI}
                              className="infoIcon info-icon-home"
                              style={{
                                cursor: "pointer",
                                height: "13px",
                              }}
                            />
                            <Image
                              className="homeTabArrowIcon"
                              src={HomeTabArrowIcon}
                            />
                          </div>
                          <div
                            className={`inter-display-medium section-table-toggle-element ml-1 mr-1 ${
                              this.state.blockTwoSelectedItem === 2
                                ? "section-table-toggle-element-selected"
                                : ""
                            }`}
                            onClick={() => {
                              if (this.state.blockTwoSelectedItem === 2)
                                this.goToGasFeesSpentPage();
                              else this.changeBlockTwoItem(2);
                            }}
                          >
                            Gas fees
                            <Image
                              src={InfoIconI}
                              className="infoIcon info-icon-home"
                              style={{
                                cursor: "pointer",
                                height: "13px",
                              }}
                            />
                            <Image
                              className="homeTabArrowIcon"
                              src={HomeTabArrowIcon}
                            />
                          </div>
                          <div
                            className={`inter-display-medium section-table-toggle-element mr-1 ${
                              this.state.blockTwoSelectedItem === 3
                                ? "section-table-toggle-element-selected"
                                : ""
                            }`}
                            onClick={() => {
                              if (this.state.blockTwoSelectedItem === 3)
                                this.goToNftPage();
                              else this.changeBlockTwoItem(3);
                            }}
                          >
                            NFTs
                            <Image
                              src={InfoIconI}
                              className="infoIcon info-icon-home"
                              style={{
                                cursor: "pointer",
                                height: "13px",
                              }}
                            />
                            <Image
                              className="homeTabArrowIcon"
                              src={HomeTabArrowIcon}
                            />
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          width: "100%",
                          flex: 1,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          color: "var(--tableCostCommonColor)",
                          fontSize: "13px",
                          textAlign: "center",
                        }}
                        className="inter-display-medium"
                      >
                        Understand your portfolio's net flows
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
              <div
                style={{
                  marginBottom: "-0.8rem",
                }}
                className="graph-table-section"
              >
                <Row>
                  <Col md={6}>
                    <div
                      className="m-r-16 section-table"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        minHeight: "41rem",
                        height: "41rem",
                        marginBottom: 0,
                      }}
                    >
                      <div className="section-table-toggle-container homepage-table-charts">
                        <div className="section-table-toggle">
                          <div
                            className={`inter-display-medium section-table-toggle-element mr-1 ${
                              this.state.blockThreeSelectedItem === 1
                                ? "section-table-toggle-element-selected"
                                : ""
                            }`}
                            onClick={() => {
                              if (this.state.blockThreeSelectedItem === 1)
                                this.goToCounterPartyVolumePage();
                              else this.changeBlockThreeItem(1);
                            }}
                          >
                            Counterparties
                            <Image
                              src={InfoIconI}
                              className="infoIcon info-icon-home"
                              style={{
                                cursor: "pointer",
                                height: "13px",
                              }}
                            />
                            <Image
                              className="homeTabArrowIcon"
                              src={HomeTabArrowIcon}
                            />
                          </div>
                          <div
                            className={`inter-display-medium section-table-toggle-element ml-1 ${
                              this.state.blockThreeSelectedItem === 2
                                ? "section-table-toggle-element-selected"
                                : ""
                            }`}
                            onClick={() => {
                              if (this.state.blockThreeSelectedItem === 2)
                                this.goToYieldOppPage();
                              else this.changeBlockThreeItem(2);
                            }}
                          >
                            Yield opportunities
                            <Image
                              src={InfoIconI}
                              className="infoIcon info-icon-home"
                              style={{
                                cursor: "pointer",
                                height: "13px",
                              }}
                            />
                            <Image
                              className="homeTabArrowIcon"
                              src={HomeTabArrowIcon}
                            />
                          </div>
                          <div
                            className={`inter-display-medium section-table-toggle-element ml-1 ${
                              this.state.blockThreeSelectedItem === 3
                                ? "section-table-toggle-element-selected section-table-toggle-element-selected-no-hover"
                                : ""
                            }`}
                            onClick={() => {
                              this.changeBlockThreeItem(3);
                            }}
                          >
                            Networks
                            <Image
                              src={InfoIconI}
                              className="infoIcon info-icon-home"
                              style={{
                                cursor: "pointer",
                                height: "13px",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          width: "100%",
                          flex: 1,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          color: "var(--tableCostCommonColor)",
                          fontSize: "13px",
                          textAlign: "center",
                        }}
                        className="inter-display-medium"
                      >
                        Understand where you’ve exchanged the most value
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div
                      className="section-table"
                      style={{
                        height: "41rem",
                        display: "flex",
                        flexDirection: "column",
                        minHeight: "41rem",
                        marginBottom: 0,
                      }}
                    >
                      <div className="section-table-toggle-container">
                        <div className="section-table-toggle">
                          <div
                            className={`inter-display-medium section-table-toggle-element mr-1 ${
                              this.state.blockFourSelectedItem === 1
                                ? "section-table-toggle-element-selected"
                                : ""
                            }`}
                            onClick={() => {
                              if (this.state.blockFourSelectedItem === 1)
                                this.goToPriceGaugePage();
                              else this.changeBlockFourItem(1);
                            }}
                          >
                            Price gauge
                            <Image
                              src={InfoIconI}
                              className="infoIcon info-icon-home"
                              style={{
                                cursor: "pointer",
                                height: "13px",
                              }}
                            />
                            <Image
                              className="homeTabArrowIcon"
                              src={HomeTabArrowIcon}
                            />
                          </div>

                          <div
                            className={`inter-display-medium section-table-toggle-element ml-1 ${
                              this.state.blockFourSelectedItem === 2
                                ? "section-table-toggle-element-selected"
                                : ""
                            }`}
                            onClick={() => {
                              if (this.state.blockFourSelectedItem === 2) {
                                this.goToInsightsPage();
                              } else this.changeBlockFourItem(2);
                            }}
                          >
                            Insights
                            <Image
                              src={InfoIconI}
                              className="infoIcon info-icon-home"
                              style={{
                                cursor: "pointer",
                                height: "13px",
                              }}
                            />
                            <Image
                              className="homeTabArrowIcon"
                              src={HomeTabArrowIcon}
                            />
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          width: "100%",
                          flex: 1,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          color: "var(--tableCostCommonColor)",
                          fontSize: "13px",
                          textAlign: "center",
                        }}
                        className="inter-display-medium"
                      >
                        Understand when this token was bought and sold
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
              <Footer />
            </div>
          </div>

          {/* footer  */}
        </div>
      );
  }
}
const mapStateToProps = (state) => ({
  intelligenceState: state.IntelligenceState,
  OnboardingState: state.OnboardingState,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddAddressWalletViewer);
