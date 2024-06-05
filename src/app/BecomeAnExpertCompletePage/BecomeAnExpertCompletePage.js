import { Component } from "react";

import { connect } from "react-redux";
import { mobileCheck } from "../../utils/ReusableFunctions";
import WelcomeCard from "../Portfolio/WelcomeCard";
import { getUser } from "../common/Api";
import MobileLayout from "../layout/MobileLayout";
import BecomeAnExpertCompletePageMobile from "./BecomeAnExpertCompletePageMobile";
import "./_becomeAnExpertCompletePage.scss";
import { Image } from "react-bootstrap";
import { BecomeAnExpertCompleteHourGlassIcon } from "../../assets/images/icons";

class BecomeAnExpertCompletePage extends Component {
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
          handleShare={() => null}
          isSidebarClosed={this.props.isSidebarClosed}
          history={this.props.history}
          currentPage={"stripe-success-page"}
          hideFooter
          hideAddresses
        >
          <BecomeAnExpertCompletePageMobile onHide={this.onHide} />
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
          <div className="schedule-a-call-complete-page-page inter-display-medium">
            <div className="becomne-an-expert-page-block-top-gradient" />
            <div className="becomne-an-expert-page-block">
              <Image
                src={BecomeAnExpertCompleteHourGlassIcon}
                className="bae-pb-image"
              />
              <div className="bae-pb-title">Application in review..</div>
              <div className="bae-pb-desc">
                While we review, you can start browse
                <br />
                Loch and check out other experts
              </div>
              <button
                onClick={this.goToExpertsPage}
                className="bae-pb-btn inter-display-medium"
              >
                Browse other experts
              </button>
            </div>
          </div>
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
)(BecomeAnExpertCompletePage);
