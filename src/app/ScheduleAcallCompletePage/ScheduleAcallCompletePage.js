import { Component } from "react";

import { connect } from "react-redux";
import { mobileCheck } from "../../utils/ReusableFunctions";
import WelcomeCard from "../Portfolio/WelcomeCard";
import { getUser } from "../common/Api";
import MobileLayout from "../layout/MobileLayout";
import ScheduleAcallCompleteContent from "./ScheduleAcallCompleteContent";
import ScheduleAcallCompletePageMobile from "./ScheduleAcallCompletePageMobile";
import "./_scheduleAcallCompletePage.scss";

class ScheduleAcallCompletePage extends Component {
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
          currentPage={"become-an-expert-complete-page"}
          customeHomeClassName="mpcHomePageNoSidePadding"
        >
          <ScheduleAcallCompletePageMobile
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
          <ScheduleAcallCompleteContent
            goToExpertsPage={this.goToExpertsPage}
          />
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({});

const mapDispatchToProps = { getUser };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScheduleAcallCompletePage);
