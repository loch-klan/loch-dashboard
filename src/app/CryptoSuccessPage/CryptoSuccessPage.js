import { Component } from "react";

import { connect } from "react-redux";
import WelcomeCard from "../Portfolio/WelcomeCard";
import PaymentSuccessModal from "../common/PaymentSuccessModal";
import MobileLayout from "../layout/MobileLayout";
import { mobileCheck } from "../../utils/ReusableFunctions";
import StripeSuccessPageMobile from "./CryptoSuccessPageMobile";
import { getUser } from "../common/Api";
import { PaymentSuccessfulMP } from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";

class StripeSuccessPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: mobileCheck(),
    };
  }

  onHide = () => {
    this.props.getUser();
    this.props.history.push("/home");
  };
  componentDidMount() {
    PaymentSuccessfulMP({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      paymentMethod: "crypto",
    });
  }

  render() {
    if (this.state.isMobile) {
      return (
        <MobileLayout
          isSidebarClosed={this.props.isSidebarClosed}
          history={this.props.history}
          currentPage={"stripe-success-page"}
          hideFooter
          hideAddresses
        >
          <StripeSuccessPageMobile
            subText="It will take up to 30 minutes for your payment to be confirmed"
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
          <PaymentSuccessModal
            subText="It will take up to 30 minutes for your payment to be confirmed"
            show
            onHide={this.onHide}
          />
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({});

const mapDispatchToProps = { getUser };

export default connect(mapStateToProps, mapDispatchToProps)(StripeSuccessPage);
