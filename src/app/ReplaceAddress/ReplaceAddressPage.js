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
import {
  createAnonymousUserApi,
  detectCoin,
  getAllParentChains,
} from "../onboarding/Api";

class ReplaceAddressPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: mobileCheck(),
    };
  }

  handleSetCoin = () => {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
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
    }, 1000);
  };
  getCoinBasedOnWalletAddress = (name, value) => {
    let parentCoinList = this.props.OnboardingState.parentCoinList;
    if (parentCoinList && value) {
      const tempWalletAddress = [value];
      const data = new URLSearchParams();
      data.append("wallet_addresses", JSON.stringify(tempWalletAddress));

      for (let i = 0; i < parentCoinList.length; i++) {
        this.props.detectCoin(
          {
            id: name,
            coinCode: parentCoinList[i].code,
            coinSymbol: parentCoinList[i].symbol,
            coinName: parentCoinList[i].name,
            address: value,
            coinColor: parentCoinList[i].color,
            subChains: parentCoinList[i].sub_chains,
          },
          this,
          false,
          0,
          false,
          false
        );
      }
    }
  };
  componentDidMount() {
    this.props.getAllParentChains();
    setTimeout(() => {
      const search = this.props.location.search;
      const params = new URLSearchParams(search);
      const address = params.get("address");

      this.getCoinBasedOnWalletAddress("wallet-1", address);
    }, 1000);
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
          hideShare
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
  detectCoin,
  getAllParentChains,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReplaceAddressPage);
