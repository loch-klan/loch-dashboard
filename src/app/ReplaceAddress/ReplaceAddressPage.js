import { Component } from "react";

import { connect } from "react-redux";
import { mobileCheck } from "../../utils/ReusableFunctions";
import WelcomeCard from "../Portfolio/WelcomeCard";
import { getUser, updateUserWalletApi } from "../common/Api";
import MobileLayout from "../layout/MobileLayout";
import StripeSuccessPageMobile from "./ReplaceAddressPageMobile";
import "./_replaceAddressPage.scss";
import Loading from "../common/Loading";
import { getToken } from "../../utils/ManageToken";
import { createAnonymousUserApi } from "../onboarding/Api";

class ReplaceAddressPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: mobileCheck(),
    };
  }

  componentDidMount() {
    const search = this.props.location.search;
    const params = new URLSearchParams(search);
    const address = params.get("address");

    const data = new URLSearchParams();
    const yieldData = new URLSearchParams();
    // data.append("wallet_addresses", JSON.stringify(arr))
    const nicknameArr = [];
    const addressList = [];
    addressList.push(address);
    nicknameArr.push("");

    data.append("wallet_address_nicknames", JSON.stringify(nicknameArr));
    data.append("wallet_addresses", JSON.stringify(addressList));
    yieldData.append("wallet_addresses", JSON.stringify(addressList));

    let tempToken = getToken();
    if (!tempToken || tempToken === "jsk") {
      let finalArr = [];
      finalArr.push(address);
      this.props.createAnonymousUserApi(data, this, finalArr, null);
    } else {
      this.props.updateUserWalletApi(data, this, yieldData, true);
    }
  }
  goToHomeAfterReplace = () => {
    this.props.history.push("/home");
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
          <StripeSuccessPageMobile onHide={this.onHide} />
        </MobileLayout>
      );
    }
    return (
      <div className="insightsPageContainer replace-address-page">
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
              <div className="insights-section m-t-80">
                <div className="insights-page page">
                  <div className="replace-address-body">
                    <Loading />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  OnboardingState: state.OnboardingState,
});

const mapDispatchToProps = {
  getUser,
  updateUserWalletApi,
  createAnonymousUserApi,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReplaceAddressPage);
