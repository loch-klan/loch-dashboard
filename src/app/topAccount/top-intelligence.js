import React, { Component } from "react";
import { connect } from "react-redux";
import PageHeader from "../common/PageHeader";
import eyeIcon from "../../assets/images/icons/eyeIcon.svg";
import BarGraphSection from "../common/BarGraphSection";
import { getAllCoins } from "../onboarding/Api.js";
import { Col, Image, Row } from "react-bootstrap";
import {
  NetflowSwitchTop,
  topNetflowAssetFilter,
  topNetflowChainFilter,
  topNetflowTimeFilter,
  PageviewTopInt,
  TimeSpentTopInt,
  TopIntShare,
  topNetflowExplainer1,
  topNetflowExplainer2,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import moment from "moment/moment";
import {
  getAssetProfitLoss,
  getProfitAndLossApi,
  getTransactionAsset,
} from "../intelligence/Api";
import Loading from "../common/Loading";
import { getAllInsightsApi } from "../intelligence/Api";
import { BASE_URL_S3 } from "../../utils/Constant";

import AddWalletModalIcon from "../../assets/images/icons/wallet-icon.svg";
import NetflowImg from "../../assets/images/icons/netflow.svg";
import NetflowClose from "../../assets/images/icons/netflow-close.svg";
import { setPageFlagDefault, updateWalletListFlag } from "../common/Api";

// Add new Wallet
import {
  getCoinRate,
  getUserWallet,
  settingDefaultValues,
} from "../Portfolio/Api";

import FixAddModal from "../common/FixAddModal";
import { GetAllPlan, getUser } from "../common/Api";
import { UpgradeTriggered } from "../../utils/ReusableFunctions";
import UpgradeModal from "../common/upgradeModal";
import { toast } from "react-toastify";
import Footer from "../common/footer";
import WelcomeCard from "../Portfolio/WelcomeCard";
import { Buffer } from "buffer";

class TopIntelligence extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: "",
      updatedInsightList: "",
      isLoading: false,
      // profit loss asset data
      ProfitLossAsset: [],
      // title: "Max",
      title: 0,
      RightShow: true,
      LeftShow: true,

      // add new wallet
      userWalletList: localStorage.getItem("addWallet")
        ? JSON.parse(localStorage.getItem("addWallet"))
        : [],
      addModal: false,
      isUpdate: 0,
      apiResponse: false,
      isSwitch: false,
      AssetList: [],
      selectedAssets: [],
      selectedOption: 0,
      selectedActiveBadge: [],

      userPlan: JSON.parse(localStorage.getItem("currentPlan")) || "Free",
      upgradeModal: false,
      isStatic: false,
      triggerId: 0,
      isGraphLoading: false,
      // this is used in api to check api call fromt op acount page or not
      isTopAccountPage: true,
      isChainSearchUsed: false,
      isAssetSearchUsed: false,
      waitForMixpannelCall: false,
    };
  }
  waitForMixpannelCallOn = () => {
    this.setState({
      waitForMixpannelCall: true,
    });
  };
  waitForMixpannelCallOff = () => {
    this.setState({
      waitForMixpannelCall: false,
    });
  };
  chainSearchIsUsed = () => {
    this.setState({ isChainSearchUsed: true });
  };
  assetSearchIsUsed = () => {
    this.setState({ isAssetSearchUsed: true });
  };

  upgradeModal = () => {
    this.setState({
      upgradeModal: !this.state.upgradeModal,
      userPlan: JSON.parse(localStorage.getItem("currentPlan")),
    });
  };

  setSwitch = () => {
    this.setState({
      isSwitch: !this.state.isSwitch,
    });

    NetflowSwitchTop({
      email_address: getCurrentUser().email,
      session_id: getCurrentUser().id,
    });

    this.updateTimer();
  };

  startPageView = () => {
    this.setState({ startTime: new Date() * 1 });
    PageviewTopInt({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    // Inactivity Check
    window.checkTopIntelligenceTimer = setInterval(() => {
      this.checkForInactivity();
    }, 900000);
  };

  componentDidMount() {
    if (this.props.location.hash !== "") {
      setTimeout(() => {
        const id = this.props.location.hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          window.scrollTo({
            top:
              element.getBoundingClientRect().top -
              document.body.getBoundingClientRect().top -
              15,
          });
        }
      }, 0);
    } else {
      window.scrollTo(0, 0);
    }
    this.props.getAllCoins();
    this.timeFilter(0, true);
    this.startPageView();
    this.updateTimer(true);
    this.props.GetAllPlan();
    this.props.getUser();
    this.assetList();

    let obj = UpgradeTriggered();

    if (obj.trigger) {
      this.setState(
        {
          triggerId: obj.id,
          isStatic: true,
        },
        () => {
          this.upgradeModal();
        }
      );
    }
  }
  updateTimer = (first) => {
    const tempExistingExpiryTime = localStorage.getItem(
      "topIntelligencePageExpiryTime"
    );
    if (!tempExistingExpiryTime && !first) {
      this.startPageView();
    }
    const tempExpiryTime = Date.now() + 1800000;
    localStorage.setItem("topIntelligencePageExpiryTime", tempExpiryTime);
  };
  endPageView = () => {
    clearInterval(window.checkTopIntelligenceTimer);
    localStorage.removeItem("topIntelligencePageExpiryTime");
    if (this.state.startTime) {
      let endTime = new Date() * 1;
      let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
      TimeSpentTopInt({
        time_spent: TimeSpent,
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
    }
  };
  checkForInactivity = () => {
    const tempExpiryTime = localStorage.getItem(
      "topIntelligencePageExpiryTime"
    );
    if (tempExpiryTime && tempExpiryTime < Date.now()) {
      this.endPageView();
    }
  };
  componentWillUnmount() {
    const tempExpiryTime = localStorage.getItem(
      "topIntelligencePageExpiryTime"
    );
    if (tempExpiryTime) {
      this.endPageView();
    }
  }
  componentDidUpdate(prevProps, prevState) {
    // add wallet
    if (prevProps !== this.props) {
      this.setState({ isGraphLoading: false });
    }
    if (prevState.apiResponse != this.state.apiResponse) {
      this.setState({
        apiResponse: false,
      });
    }

    if (!this.props.commonState.top_intelligence) {
      this.props.updateWalletListFlag("top_intelligence", true);
      this.props.getAllCoins();
      this.timeFilter(0, true);
      this.assetList();
    }

    if (
      this.props?.location?.pathname + this.props?.location?.hash ===
        "/intelligence#netflow" ||
      this.props?.location?.pathname + this.props?.location?.hash ===
        "/top-accounts/intelligence#netflow"
    ) {
      if (this.props.location.hash !== "") {
        setTimeout(() => {
          const id = this.props.location.hash.replace("#", "");
          const element = document.getElementById(id);
          if (element) {
            window.scrollTo({
              top:
                element.getBoundingClientRect().top -
                document.body.getBoundingClientRect().top -
                15,
            });
          }
        }, 0);
      } else {
        window.scrollTo(0, 0);
      }
      setTimeout(() => {
        this.props.history.replace("/top-accounts/intelligence");
      }, 1000);
    }
  }

  assetList = () => {
    let data = new URLSearchParams();
    let addressObj = localStorage.getItem("previewAddress")
      ? [JSON.parse(localStorage.getItem("previewAddress"))]
      : [];
    let address = addressObj?.map((e) => e?.address);
    data.append("wallet_address", JSON.stringify(address));
    // data.append("end_datetime", endDate);
    getTransactionAsset(data, this);
  };
  timeFilter = (option, first) => {
    let selectedChains = [];
    let handleSelected = "All";
    this.setState({ graphValue: "", isGraphLoading: true });
    const today = moment().unix();
    if (option == 0) {
      this.props.getProfitAndLossApi(
        this,
        false,
        false,
        selectedChains,
        this.state.selectedAssets
      );
      // for asset Breakdown
      this.props.getAssetProfitLoss(
        this,
        false,
        false,
        selectedChains,
        this.state.selectedAssets
      );
      handleSelected = "All";
    } else if (option == 1) {
      const fiveyear = moment().subtract(5, "years").unix();
      this.props.getProfitAndLossApi(
        this,
        fiveyear,
        today,
        selectedChains,
        this.state.selectedAssets
      );
      // for asset Breakdown
      this.props.getAssetProfitLoss(
        this,
        fiveyear,
        today,
        selectedChains,
        this.state.selectedAssets
      );
      handleSelected = "5 years";
    } else if (option == 2) {
      handleSelected = "4 years";
      const fouryear = moment().subtract(4, "years").unix();
      this.props.getProfitAndLossApi(
        this,
        fouryear,
        today,
        selectedChains,
        this.state.selectedAssets
      );
      this.props.getAssetProfitLoss(
        this,
        fouryear,
        today,
        selectedChains,
        this.state.selectedAssets
      );
    } else if (option == 3) {
      handleSelected = "3 years";
      const threeyear = moment().subtract(3, "years").unix();
      this.props.getProfitAndLossApi(
        this,
        threeyear,
        today,
        selectedChains,
        this.state.selectedAssets
      );
      this.props.getAssetProfitLoss(
        this,
        threeyear,
        today,
        selectedChains,
        this.state.selectedAssets
      );
    } else if (option == 4) {
      handleSelected = "2 years";
      const twoyear = moment().subtract(2, "years").unix();
      this.props.getProfitAndLossApi(
        this,
        twoyear,
        today,
        selectedChains,
        this.state.selectedAssets
      );
      this.props.getAssetProfitLoss(
        this,
        twoyear,
        today,
        selectedChains,
        this.state.selectedAssets
      );
    } else if (option == 5) {
      handleSelected = "1 year";
      const year = moment().subtract(1, "years").unix();
      this.props.getProfitAndLossApi(
        this,
        year,
        today,
        selectedChains,
        this.state.selectedAssets
      );
      this.props.getAssetProfitLoss(
        this,
        year,
        today,
        selectedChains,
        this.state.selectedAssets
      );
    } else if (option == 6) {
      handleSelected = "6 months";
      const sixmonth = moment().subtract(6, "months").unix();
      this.props.getProfitAndLossApi(
        this,
        sixmonth,
        today,
        selectedChains,
        this.state.selectedAssets
      );
      this.props.getAssetProfitLoss(
        this,
        sixmonth,
        today,
        selectedChains,
        this.state.selectedAssets
      );
    } else if (option == 7) {
      handleSelected = "1 month";
      const month = moment().subtract(1, "month").unix();
      this.props.getProfitAndLossApi(
        this,
        month,
        today,
        selectedChains,
        this.state.selectedAssets
      );
      this.props.getAssetProfitLoss(
        this,
        month,
        today,
        selectedChains,
        this.state.selectedAssets
      );
    } else if (option == 8) {
      handleSelected = "1 week";
      const week = moment().subtract(1, "week").unix();
      this.props.getProfitAndLossApi(
        this,
        week,
        today,
        selectedChains,
        this.state.selectedAssets
      );
      this.props.getAssetProfitLoss(
        this,
        week,
        today,
        selectedChains,
        this.state.selectedAssets
      );
    } else if (option == 9) {
      handleSelected = "1 day";
      const day = moment().subtract(1, "day").unix();
      this.props.getProfitAndLossApi(
        this,
        day,
        today,
        selectedChains,
        this.state.selectedAssets
      );
      this.props.getAssetProfitLoss(
        this,
        day,
        today,
        selectedChains,
        this.state.selectedAssets
      );
    }
    if (!first) {
      topNetflowTimeFilter({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        selected: handleSelected,
      });

      this.updateTimer();
    }
    this.setState({
      title: option,
    });
  };

  handleBadge = (activeBadgeList, activeFooter = this.state.title) => {
    this.setState({
      selectedActiveBadge: activeBadgeList,
      isGraphLoading: true,
    });
    let startDate = moment().unix();
    let endDate;
    if (activeFooter == "0") {
      startDate = "";
      endDate = "";
    } else if (activeFooter == "1") {
      endDate = moment().subtract(5, "years").unix();
    } else if (activeFooter == "2") {
      endDate = moment().subtract(4, "years").unix();
    } else if (activeFooter == "3") {
      endDate = moment().subtract(3, "years").unix();
    } else if (activeFooter == "4") {
      endDate = moment().subtract(2, "years").unix();
    } else if (activeFooter == "5") {
      endDate = moment().subtract(1, "years").unix();
    } else if (activeFooter == "6") {
      endDate = moment().subtract(6, "months").unix();
    } else if (activeFooter == "7") {
      endDate = moment().subtract(1, "month").unix();
    } else if (activeFooter == "8") {
      endDate = moment().subtract(1, "week").unix();
    } else if (activeFooter == "9") {
      endDate = moment().subtract(1, "day").unix();
    }

    let selectedChains = [];
    this.props.OnboardingState.coinsList?.map((item) => {
      if (activeBadgeList?.includes(item.id)) {
        selectedChains.push(item.code);
      }
    });

    if ((activeFooter = 0)) {
      this.props.getProfitAndLossApi(
        this,
        false,
        false,
        selectedChains,
        this.state.selectedAssets
      );
      this.props.getAssetProfitLoss(
        this,
        false,
        false,
        selectedChains,
        this.state.selectedAssets
      );
    } else {
      this.props.getProfitAndLossApi(
        this,
        startDate,
        endDate,
        selectedChains,
        this.state.selectedAssets
      );

      // for asset Breakdown
      this.props.getAssetProfitLoss(
        this,
        startDate,
        endDate,
        selectedChains,
        this.state.selectedAssets
      );
    }

    const tempIsSearchUsed = this.state.isChainSearchUsed;
    topNetflowChainFilter({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      selected: selectedChains,
      isSearchUsed: tempIsSearchUsed,
    });

    this.updateTimer();
    this.setState({ isChainSearchUsed: false });
  };

  handleSelect = (opt) => {
    const t = opt.split(" ")[1];
    const x = opt.split(" ")[2];
    this.setState({
      title: t == "Max" ? t : t + " " + x,
    });
    this.timeFilter(t == "Max" ? t : t + " " + x);
  };

  // For add new address
  handleAddModal = () => {
    this.setState({
      addModal: !this.state.addModal,
    });
  };

  handleChangeList = (value) => {
    this.setState({
      // for add wallet
      userWalletList: value,
      isUpdate: this.state.isUpdate === 0 ? 1 : 0,
      // for page
      isLoading: true,
      graphValue: null,
    });
  };
  CheckApiResponse = (value) => {
    this.setState({
      apiResponse: value,
    });
    // wallet updated set all falg to default
    // this.props.updateWalletListFlag("home", false);
    this.props.setPageFlagDefault();
  };

  RightClose = () => {
    this.setState({
      RightShow: false,
    });
    topNetflowExplainer2({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    this.updateTimer();
  };

  LeftClose = () => {
    this.setState({
      LeftShow: false,
    });

    topNetflowExplainer1({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    this.updateTimer();
  };

  handleAssetSelected = (arr) => {
    this.setState(
      {
        selectedAssets: arr === "allAssets" ? [] : arr,
      },
      () => {
        const tempIsSearchUsed = this.state.isAssetSearchUsed;
        topNetflowAssetFilter({
          session_id: getCurrentUser().id,
          email_address: getCurrentUser().email,
          selected: arr[0] === "All" ? "All assets" : arr.map((e) => e?.name),
          isSearchUsed: tempIsSearchUsed,
        });

        this.updateTimer();
        this.setState({ isAssetSearchUsed: false });
        this.handleBadge(this.state.selectedActiveBadge, this.state.title);
      }
    );
  };

  handleShare = () => {
    const previewAddress = localStorage.getItem("previewAddress")
      ? JSON.parse(localStorage.getItem("previewAddress"))
      : "";
    const encodedAddress = Buffer.from(previewAddress?.address).toString(
      "base64"
    );

    let shareLink =
      BASE_URL_S3 +
      `top-account/${encodedAddress}?redirect=intelligence#netflow`;
    navigator.clipboard.writeText(shareLink);
    toast.success("Link copied");
    TopIntShare({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });

    this.updateTimer();
  };

  render() {
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
              <WelcomeCard
                // history
                history={this.props.history}
                // add wallet address modal
                handleAddModal={this.handleAddModal}
                isPreviewing={true}
              />
            </div>
          </div>
        </div>
        <div className="intelligence-page-section m-t-80">
          <div className="intelligence-section page">
            {this.state.upgradeModal && (
              <UpgradeModal
                show={this.state.upgradeModal}
                onHide={this.upgradeModal}
                history={this.props.history}
                isShare={localStorage.getItem("share_id")}
                isStatic={this.state.isStatic}
                triggerId={this.state.triggerId}
                pname="intelligence"
              />
            )}
            <PageHeader
              title="Portfolio"
              subTitle="Automated and personalized financial intelligence"
              showpath={true}
              currentPage={"intelligence"}
              // btnText={"Add wallet"}
              // handleBtn={this.handleAddModal}
              ShareBtn={true}
              handleShare={this.handleShare}
            />

            <div className="portfolio-bar-graph" id="netflow">
              <PageHeader
                showNetflowExplainers
                title="Realized gains"
                showImg={eyeIcon}
              />
              {/* Netflow Info Start */}

              {/* Netflow Info End */}

              <div style={{ position: "relative", minWidth: "85rem" }}>
                {this.props.topAccountState.graphValue ? (
                  <BarGraphSection
                    isScrollVisible={false}
                    data={this.props.topAccountState.graphValue[0]}
                    options={this.props.topAccountState.graphValue[1]}
                    coinsList={this.props.OnboardingState.coinsList}
                    timeFunction={(e, activeBadgeList) =>
                      this.timeFilter(e, activeBadgeList)
                    }
                    showSwitch={true}
                    isSwitch={this.state.isSwitch}
                    setSwitch={this.setSwitch}
                    marginBottom="m-b-32"
                    // showFooter={false}
                    showFooterDropdown={false}
                    showFooter={true}
                    showToken={true}
                    footerLabels={[
                      "Max",
                      "5 Y",
                      "4 Y",
                      "3 Y",
                      "2 Y",
                      "1 Y",
                      "6 M",
                      "1 M",
                      "1 W",
                      "1 D",
                    ]}
                    activeTitle={this.state.title}
                    assetList={this.state.AssetList}
                    // handleSelect={(opt) => this.handleSelect(opt)}
                    showBadges={true}
                    showPercentage={this.props.topAccountState.graphValue[2]}
                    handleBadge={(activeBadgeList, activeFooter) =>
                      this.handleBadge(activeBadgeList, activeFooter)
                    }
                    ProfitLossAsset={this.props.topAccountState.ProfitLossAsset}
                    handleAssetSelected={this.handleAssetSelected}
                    isGraphLoading={this.state.isGraphLoading}
                    chainSearchIsUsed={this.chainSearchIsUsed}
                    assetSearchIsUsed={this.assetSearchIsUsed}
                    // comingSoon={true}
                  />
                ) : (
                  <div
                    className="loading-wrapper"
                    style={{
                      height: "57.8rem",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Loading />
                    <br />
                    <br />
                  </div>
                )}
              </div>
              {/* footer */}
              <Footer />
            </div>
          </div>
          {this.state.addModal && (
            <FixAddModal
              show={this.state.addModal}
              onHide={this.handleAddModal}
              modalIcon={AddWalletModalIcon}
              title="Add wallet address"
              subtitle="Add more wallet address here"
              modalType="addwallet"
              btnStatus={false}
              btnText="Go"
              history={this.props.history}
              changeWalletList={this.handleChangeList}
              apiResponse={(e) => this.CheckApiResponse(e)}
              from="intelligence"
            />
          )}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  intelligenceState: state.IntelligenceState,
  OnboardingState: state.OnboardingState,

  // add wallet
  portfolioState: state.PortfolioState,
  commonState: state.CommonState,

  // top account
  topAccountState: state.TopAccountState,
});
const mapDispatchToProps = {
  // getPosts: fetchPosts
  getAllCoins,
  getCoinRate,
  getUserWallet,
  settingDefaultValues,
  getAllInsightsApi,
  getProfitAndLossApi,
  getAssetProfitLoss,
  updateWalletListFlag,
  setPageFlagDefault,
  getUser,
  GetAllPlan,
};

// const mapDispatchToProps = {
//   getCoinRate,
//   getUserWallet,
//   settingDefaultValues,
//   getAllCoins,
//   searchTransactionApi,
//   getAssetGraphDataApi,
//   getDetailsByLinkApi,
// };

TopIntelligence.propTypes = {
  // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(TopIntelligence);
