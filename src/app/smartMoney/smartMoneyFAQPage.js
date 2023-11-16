import React from "react";
import { connect } from "react-redux";
import { BaseReactComponent } from "../../utils/form";
import { getCurrentUser } from "../../utils/ManageToken";
import { mobileCheck } from "../../utils/ReusableFunctions";

import {
  SmartMoneyPageView,
  SmartMoneyTimeSpent,
} from "../../utils/AnalyticsFunctions";

import "./_smartMoney.scss";
import SmartMoneyHeader from "./smartMoneyHeader";
import SmartMoneyMobilePage from "./smartMoneyMobilePage.js";
import MobileDevice from "../common/mobileDevice.js";

class SmartMoneyFAQPage extends BaseReactComponent {
  constructor(props) {
    super(props);

    this.state = {
      delayTimer: 0,

      startTime: "",
    };
    this.delayTimer = 0;
  }

  startPageView = () => {
    this.setState({
      startTime: new Date() * 1,
    });
    SmartMoneyPageView({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      isMobile: mobileCheck(),
    });
    // Inactivity Check
    window.checkSmartMoneyTimer = setInterval(() => {
      this.checkForInactivity();
    }, 900000);
  };

  componentDidMount() {
    this.startPageView();
    this.updateTimer(true);
  }
  updateTimer = (first) => {
    const tempExistingExpiryTime = window.sessionStorage.getItem(
      "smartMoneyPageExpiryTime"
    );
    if (!tempExistingExpiryTime && !first) {
      this.startPageView();
    }
    const tempExpiryTime = Date.now() + 1800000;
    window.sessionStorage.setItem("smartMoneyPageExpiryTime", tempExpiryTime);
  };
  endPageView = () => {
    clearInterval(window.checkSmartMoneyTimer);
    window.sessionStorage.removeItem("smartMoneyPageExpiryTime");
    if (this.state.startTime) {
      let endTime = new Date() * 1;
      let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
      SmartMoneyTimeSpent({
        time_spent: TimeSpent,
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        isMobile: mobileCheck(),
      });
    }
  };
  checkForInactivity = () => {
    const tempExpiryTime = window.sessionStorage.getItem(
      "smartMoneyPageExpiryTime"
    );
    if (tempExpiryTime && tempExpiryTime < Date.now()) {
      this.endPageView();
    }
  };
  componentWillUnmount() {
    const tempExpiryTime = window.sessionStorage.getItem(
      "smartMoneyPageExpiryTime"
    );
    if (tempExpiryTime) {
      this.endPageView();
    }
  }

  render() {
    if (mobileCheck()) {
      return (
        <MobileDevice isSmartMoney />
        // <SmartMoneyMobilePage
        //   location={this.props.location}
        //   history={this.props.history}
        //   accountList={this.state.accountList}
        //   currency={this.state.currency}
        //   isLoading={this.state.tableLoading}
        //   currentPage={this.state.currentPage}
        //   totalPage={this.state.totalPage}
        //   pageLimit={this.state.pageLimit}
        //   changePageLimit={this.changePageLimit}
        //   onPageChange={this.onPageChange}
        // />
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
              <SmartMoneyHeader
                openAddAddressModal={this.showAddSmartMoneyAddresses}
                apiResponse={(e) => this.CheckApiResponse(e)}
                // history
                history={this.props.history}
                // add wallet address modal
                handleAddModal={this.handleAddModal}
                hideButton={true}
                onSignInClick={this.loginFunction}
                blurTable={this.state.blurTable}
                signOutFun={this.openSignOutModal}
                isFaq
              />
            </div>
          </div>
        </div>
        <div className="history-table-section m-t-80 inter-display-medium">
          <div className="smartMoneyFAQContainer">
            <div className="smfaqPointsContainer">
              <div
                style={{
                  marginTop: "0rem",
                }}
                className="smfaqPoints"
              >
                You see a token 2x in price.
              </div>
              <div className="smfaqPoints">
                You see another token plummet by 4x overnight.
              </div>
              <div className="smfaqPoints">
                You think to yourself, how is this possible?
              </div>
              <div className="smfaqPoints">Most adjacent tokens are flat.</div>
              <div className="smfaqPoints">
                The answer is always simple --
                <span
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  {" "}
                  Follow the smart money.
                </span>
              </div>

              <div className="smfaqPoints">
                Loch’s team of sleuth’s and researchers have assiduously put
                together this list of the smartest money on-chain.{" "}
              </div>

              <div className="smfaqPoints">
                This is the lazy analyst’s ultimate guide to alpha.{" "}
              </div>

              <div className="smfaqPoints">
                The list is updated daily. We know it’s not enough to just look
                at net worth. That’s why Loch gives you the realized and
                unrealized PnL for each address.
              </div>

              <div className="smfaqPoints">
                You can click, analyze, and follow any or all of these
                addresses.
              </div>

              <div className="smfaqPoints">
                The best part of using this leaderboard is that you’ll get the
                confidence backed by your own increasingly successful results.{" "}
              </div>

              <div className="smfaqPoints">
                You’ll become more proficient in the most valuable skill in
                crypto, which is finding and analyzing smart money.{" "}
              </div>

              <div className="smfaqPoints">
                Loch’s team has benefited immensely from this leaderboard.{" "}
              </div>

              <div className="smfaqPoints">It’s your turn now. </div>
            </div>
            <div className="smfaqHeading m-t-40">FAQ</div>
            <div className="smfaqQuestionAns">
              <div className="smfaqQuestionAnsNumbering">1.</div>
              <div>
                <div className="smfaqQuestion">How are addresses found?</div>
                <div className="smfaqAns">
                  Addresses are discovered through a combination of Loch’s
                  in-house sleuths and Loch community members. We vet and screen
                  all addresses added to the leaderboard personally.
                </div>
              </div>
            </div>
            <div className="smfaqQuestionAns">
              <div className="smfaqQuestionAnsNumbering">2.</div>
              <div>
                <div className="smfaqQuestion">
                  How often are addresses added?
                </div>
                <div className="smfaqAns">
                  Smart money addresses are added every day.
                </div>
              </div>
            </div>
            <div className="smfaqQuestionAns">
              <div className="smfaqQuestionAnsNumbering">3.</div>
              <div>
                <div className="smfaqQuestion">What’s net worth?</div>
                <div className="smfaqAns">
                  Net worth refers to the sum total of all assets held by a
                  wallet address. This does not include credit positions and
                  debt positions held in on-chain decentralized finance
                  platforms.
                </div>
              </div>
            </div>
            <div className="smfaqQuestionAns">
              <div className="smfaqQuestionAnsNumbering">4.</div>
              <div>
                <div className="smfaqQuestion">What’s Realized PnL?</div>
                <div className="smfaqAns">
                  Realized PnL refers to the difference between all funds that
                  left the wallet address and all funds that entered the wallet
                  address in the last year.
                </div>
              </div>
            </div>
            <div className="smfaqQuestionAns">
              <div className="smfaqQuestionAnsNumbering">5.</div>
              <div>
                <div className="smfaqQuestion">What’s Unrealized PnL?</div>
                <div className="smfaqAns">
                  Unrealized PnL is the sum of the (current net worth minus
                  average cost price for each asset) held in the portfolio.
                </div>
              </div>
            </div>
            <div className="smfaqQuestionAns">
              <div className="smfaqQuestionAnsNumbering">6.</div>
              <div>
                <div className="smfaqQuestion">
                  How often are PnL calculations updated?
                </div>
                <div className="smfaqAns">
                  PnL calculations are updated every week.
                </div>
              </div>
            </div>
            <div className="smfaqQuestionAns">
              <div className="smfaqQuestionAnsNumbering">7.</div>
              <div>
                <div className="smfaqQuestion">
                  Should I be worried about my privacy?
                </div>
                <div className="smfaqAns">
                  No you should not be worried at all. All your information
                  remains confidential and private. Customer data added on
                  app.loch.one is not used to populate smart money. We don’t
                  sell any user data to third parties.
                </div>
              </div>
            </div>
            <div className="smfaqQuestionAns">
              <div className="smfaqQuestionAnsNumbering">8.</div>
              <div>
                <div className="smfaqQuestion">
                  How are smart money addresses ranked?
                </div>
                <div className="smfaqAns">
                  The community generated smart money leaderboard is ranked in
                  descending order by net worth. Soon, you’ll be able to sort it
                  by any of the other columns.
                </div>
              </div>
            </div>
            <div className="smfaqQuestionAns">
              <div className="smfaqQuestionAnsNumbering">9.</div>
              <div>
                <div className="smfaqQuestion">
                  How long will it take for an address I added to get listed?
                </div>
                <div className="smfaqAns">
                  It can take up to a day for an address added by a community
                  member to get listed. We vet and screen all addresses added to
                  the leaderboard personally.
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {};

SmartMoneyFAQPage.propTypes = {};
export default connect(mapStateToProps, mapDispatchToProps)(SmartMoneyFAQPage);
