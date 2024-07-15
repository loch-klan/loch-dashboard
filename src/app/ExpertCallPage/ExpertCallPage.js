import { Component } from "react";

import { connect } from "react-redux";
import { mobileCheck } from "../../utils/ReusableFunctions";
import WelcomeCard from "../Portfolio/WelcomeCard";
import { getUser } from "../common/Api";
import MobileLayout from "../layout/MobileLayout";
import ExpertCallContent from "./ExpertCallContent";
import ExpertCallPageMobile from "./ExpertCallPageMobile";
import "./_expertCallPage.scss";
import PageHeader from "../common/PageHeader";

class ExpertCallPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: mobileCheck(),
    };
  }

  goToExpertsPage = () => {
    this.props.history.push("/experts");
  };
  render() {
    if (this.state.isMobile) {
      return (
        <MobileLayout
          hideShare
          hideFooter
          hideAddresses
          history={this.props.history}
          currentPage={"expert-call-page"}
          customeHomeClassName="mpcHomePageNoSidePadding"
        >
          <ExpertCallPageMobile
            goToExpertsPage={this.goToExpertsPage}
            onHide={this.onHide}
          />
        </MobileLayout>
      );
    }
    return (
      <div className="insightsPageContainer">
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
                history={this.props.history}
              />
            </div>
          </div>
          <div className="page-scroll">
            <div className="page-scroll-child">
              {this.props.isPreviousCall ? (
                <div
                  style={{
                    zIndex: "2",
                  }}
                >
                  <div
                    style={{
                      marginTop: "2rem",
                    }}
                  />
                  <PageHeader
                    title={"Transcript and Chat"}
                    subTitle={
                      "Browse Transcript and Chat of your previous calls with experts"
                    }
                    currentPage={"expertCallLogs"}
                    history={this.props.history}
                    ShareBtn={false}
                    updateTimer={this.updateTimer}
                  />
                </div>
              ) : null}
              <ExpertCallContent
                isPreviousCall={this.props.isPreviousCall}
                goToExpertsPage={this.goToExpertsPage}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({});

const mapDispatchToProps = { getUser };

export default connect(mapStateToProps, mapDispatchToProps)(ExpertCallPage);
