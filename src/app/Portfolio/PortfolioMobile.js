import React from "react";
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import { connect } from "react-redux";
import {
  getCoinRate,
  getDetailsByLinkApi,
  getUserWallet,
  getYesterdaysBalanceApi,
  settingDefaultValues,
  getExternalEventsApi,
  getExchangeBalances,
} from "./Api";
import { Image } from "react-bootstrap";
import SearchIcon from "../../assets/images/icons/search-icon.svg";
import { getAllCoins, getAllParentChains } from "../onboarding/Api.js";
import { getAllWalletListApi } from "../wallet/Api";
import {
  getAllInsightsApi,
  getAssetProfitLoss,
  getProfitAndLossApi,
  searchTransactionApi,
} from "../intelligence/Api.js";
import {
  getDetectedChainsApi,
  setPageFlagDefault,
  updateWalletListFlag,
} from "../common/Api";
import { getAssetGraphDataApi } from "./Api";
import {
  getAvgCostBasis,
  ResetAverageCostBasis,
  updateAverageCostBasis,
} from "../cost/Api";
import Loading from "../common/Loading";
import { GetAllPlan, getUser } from "../common/Api";
import "./_mobilePortfolio.scss";
import PieChart2 from "./PieChart2";
import Footer from "../common/footer";
import WelcomeCard from "./WelcomeCard";
import { SharePortfolioIconWhite } from "../../assets/images/icons";
import { getCurrentUser } from "../../utils/ManageToken";
import { BASE_URL_S3 } from "../../utils/Constant";
import { toast } from "react-toastify";

class PortfolioMobile extends BaseReactComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }
  componentDidMount() {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  }
  handleShare = () => {
    let lochUser = getCurrentUser().id;
    let userWallet = JSON.parse(window.sessionStorage.getItem("addWallet"));
    let slink =
      userWallet?.length === 1
        ? userWallet[0].displayAddress || userWallet[0].address
        : lochUser;
    let shareLink = BASE_URL_S3 + "home/" + slink + "?redirect=home";
    // navigator.clipboard.writeText(shareLink);
    this.copyTextToClipboard(shareLink);

    // HomeShare({
    //   session_id: getCurrentUser().id,
    //   email_address: getCurrentUser().email,
    // });
  };
  async copyTextToClipboard(text) {
    if ("clipboard" in navigator) {
      toast.success("Link copied");
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  }
  goToWelcome = () => {
    this.props.history.push("/welcome?FromMobileHome=true");
  };
  render() {
    return (
      <div className="mobilePortfolioContainer">
        {this.props.loader ? (
          <div className="mpLoadingContainer">
            <Loading />
          </div>
        ) : (
          <div className="mpcHomeContainer">
            <div className="mpcMobileSearch">
              <div onClick={this.goToWelcome} className="mpcMobileSearchInput">
                <Image className="mpcMobileSearchImage" src={SearchIcon} />
                <div className="mpcMobileSearchPlaceholder inter-display-medium f-s-12">
                  Search for another address / ENS
                </div>
              </div>
              <div className="mpcMobileShare" onClick={this.handleShare}>
                <Image
                  className="mpcMobileSearchImage"
                  src={SharePortfolioIconWhite}
                />
              </div>
            </div>
            <div className="mpcHomePage">
              <WelcomeCard
                changeWalletList={this.props.handleChangeList}
                apiResponse={(e) => this.props.CheckApiResponse(e)}
                showNetworth={true}
                // yesterday balance
                yesterdayBalance={this.props.portfolioState.yesterdayBalance}
                // toggleAddWallet={this.state.toggleAddWallet}
                // handleToggleAddWallet={this.handleToggleAddWallet}

                // decrement={true}

                // total network and percentage calculate
                assetTotal={this.props.getTotalAssetValue()}
                // assetTotal={
                //   this.props.portfolioState &&
                //   this.props.portfolioState.walletTotal
                //     ? this.props.portfolioState.walletTotal +
                //       this.props.defiState.totalYield -
                //       this.props.defiState.totalDebt
                //     : 0 +
                //       this.props.defiState.totalYield -
                //       this.props.defiState.totalDebt
                // }
                // history
                history={this.props.history}
                // add wallet address modal
                handleAddModal={this.props.handleAddModal}
                // net worth total
                isLoading={this.props.isLoadingNet}
                // walletTotal={
                //   this.props.portfolioState.walletTotal +
                //   this.state.totalYield -
                //   this.state.totalDebt
                // }

                // manage wallet
                handleManage={() => {}}
                isMobileRender
              />
              <PieChart2
                setLoader={this.props.setLoader}
                chainLoader={this.props.chainLoader}
                totalChainDetechted={this.state.totalChainDetechted}
                userWalletData={
                  this.props.portfolioState &&
                  this.props.portfolioState.chainWallet &&
                  Object.keys(this.props.portfolioState.chainWallet).length > 0
                    ? Object.values(this.props.portfolioState.chainWallet)
                    : null
                }
                chainPortfolio={
                  this.props.portfolioState &&
                  this.props.portfolioState.chainPortfolio &&
                  Object.keys(this.props.portfolioState.chainPortfolio).length >
                    0
                    ? Object.values(this.props.portfolioState.chainPortfolio)
                    : null
                }
                allCoinList={
                  this.props.OnboardingState &&
                  this.props.OnboardingState.coinsList &&
                  Object.keys(this.props.OnboardingState.coinsList).length > 0
                    ? Object.values(this.props.OnboardingState.coinsList)
                    : null
                }
                assetTotal={this.props.getTotalAssetValue()}
                assetPrice={
                  this.props.portfolioState.assetPrice &&
                  Object.keys(this.props.portfolioState.assetPrice).length > 0
                    ? Object.values(this.props.portfolioState.assetPrice)
                    : null
                }
                isLoading={this.props.isLoading}
                isUpdate={this.props.isUpdate}
                walletTotal={this.props.portfolioState.walletTotal}
                // handleAddModal={this.handleAddModal}
                // handleManage={() => {
                //   this.props.history.push("/wallets");
                //   ManageWallets({
                //     session_id: getCurrentUser().id,
                //     email_address: getCurrentUser().email,
                //   });
                // }}
                undetectedWallet={(e) => this.props.undetectedWallet(e)}
                getProtocolTotal={this.props.getProtocolTotal}
                updateTimer={this.props.updateTimer}
              />

              <Footer />
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  portfolioState: state.PortfolioState,
  OnboardingState: state.OnboardingState,
  intelligenceState: state.IntelligenceState,
  commonState: state.CommonState,
  defiState: state.DefiState,
});
const mapDispatchToProps = {
  getCoinRate,
  getUserWallet,
  settingDefaultValues,
  getAllCoins,
  getAllParentChains,
  searchTransactionApi,
  getAssetGraphDataApi,
  getDetailsByLinkApi,
  getProfitAndLossApi,
  // getExchangeBalance,
  getExchangeBalances,
  getYesterdaysBalanceApi,
  getExternalEventsApi,
  getAllInsightsApi,
  updateWalletListFlag,
  setPageFlagDefault,
  getAllWalletListApi,
  // avg cost
  getAvgCostBasis,
  // average cost
  ResetAverageCostBasis,
  updateAverageCostBasis,
  getAssetProfitLoss,
  getDetectedChainsApi,
  GetAllPlan,
  getUser,
};
PortfolioMobile.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(PortfolioMobile);
