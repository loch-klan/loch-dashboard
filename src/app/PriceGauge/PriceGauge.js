import moment from "moment/moment";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  IntShare,
  netflowAssetFilter,
  netflowChainFilter,
  netflowDateFilter,
  netflowExplainer1,
  netflowExplainer2,
  NetflowSwitch,
  PriceGaugePageTimeSpentMP,
  PriceGaugePageViewMP,
} from "../../utils/AnalyticsFunctions.js";
import { getCurrentUser } from "../../utils/ManageToken.js";
import PageHeader from "../common/PageHeader.js";
import {
  getAssetProfitLoss,
  getProfitAndLossApi,
  getTransactionAsset,
} from "../intelligence/Api.js";
import { getAllCoins } from "../onboarding/Api.js";
import { getAllWalletListApi } from "../wallet/Api.js";

import AddWalletModalIcon from "../../assets/images/icons/wallet-icon.svg";
import { BASE_URL_S3 } from "../../utils/Constant.js";
import { setPageFlagDefault, updateWalletListFlag } from "../common/Api.js";

// Add new Wallet
import {
  getCoinRate,
  getUserWallet,
  settingDefaultValues,
} from "../Portfolio/Api.js";

import { toast } from "react-toastify";
import {
  mobileCheck,
  scrollToTop,
  UpgradeTriggered,
} from "../../utils/ReusableFunctions.js";
import { GetAllPlan, getUser } from "../common/Api.js";
import FixAddModal from "../common/FixAddModal.js";
import Footer from "../common/footer.js";
import UpgradeModal from "../common/upgradeModal.js";
import InflowOutflowChart from "../intelligence/InflowOutflowChart";
import WelcomeCard from "../Portfolio/WelcomeCard.js";
import TopWalletAddressList from "../header/TopWalletAddressList.js";
import MobileLayout from "../layout/MobileLayout.js";
import PriceGuageMobile from "./PriceGuageMobile.js";

class PriceGauge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fromDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
      toDate: new Date(new Date().setDate(new Date().getDate() - 1)),
      maxDate: new Date(new Date().setDate(new Date().getDate() - 1)),
      minDate: new Date(new Date().setFullYear(2011, 0, 1)),
      // showPercentage: {
      //   icon: arrowUpRight,
      //   percent: "25",
      //   status: "Increase",
      //   GraphData: [],
      //   graphValue: "null",
      // },

      startTime: "",
      updatedInsightList: [],
      isLoading: false,
      // profit loss asset data
      ProfitLossAsset: [],
      // title: "Max",
      title: 0,
      RightShow: true,
      LeftShow: true,

      // add new wallet
      userWalletList: window.localStorage.getItem("addWallet")
        ? JSON.parse(window.localStorage.getItem("addWallet"))
        : [],
      addModal: false,
      isUpdate: 0,
      apiResponse: false,
      isSwitch: false,
      AssetList: [],
      selectedAssets: [],
      selectedOption: 0,
      selectedActiveBadge: [],

      userPlan:
        JSON.parse(window.localStorage.getItem("currentPlan")) || "Free",
      upgradeModal: false,
      isStatic: false,
      triggerId: 0,
      netFlowLoading: false,
      isGraphLoading: true,
      isChainSearchUsed: false,
      isAssetSearchUsed: false,
      waitForMixpannelCall: false,
      isFromCalendar: false,
      isToCalendar: false,
      lochToken: JSON.parse(window.localStorage.getItem("stopClick")),
    };
  }
  showFromCalendar = () => {
    this.setState({
      isFromCalendar: !this.state.isFromCalendar,
    });
  };
  hideFromCalendar = () => {
    if (this.state.isFromCalendar) {
      this.setState({
        isFromCalendar: false,
      });
    }
  };
  showToCalendar = () => {
    this.setState({
      isToCalendar: !this.state.isToCalendar,
    });
  };
  hideToCalendar = () => {
    if (this.state.isToCalendar) {
      this.setState({
        isToCalendar: false,
      });
    }
  };
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
      userPlan: JSON.parse(window.localStorage.getItem("currentPlan")),
    });
  };

  setSwitch = () => {
    this.setState({
      isSwitch: !this.state.isSwitch,
    });

    NetflowSwitch({
      email_address: getCurrentUser().email,
      session_id: getCurrentUser().id,
    });
    this.updateTimer();
  };

  startPageView = () => {
    this.setState({
      startTime: new Date() * 1,
    });
    PriceGaugePageViewMP({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    // Inactivity Check
    window.checkIntelligenceTimer = setInterval(() => {
      this.checkForInactivity();
    }, 900000);
  };

  componentDidMount() {
    scrollToTop();
    if (this.props.intelligenceState?.updatedInsightList) {
      const newTempHolder =
        this.props.intelligenceState.updatedInsightList.filter(
          (resRes) => resRes.insight_type !== 30
        );
      this.setState({
        updatedInsightList: newTempHolder,
      });
    }
    const tempLeftExplainerClosed = window.localStorage.getItem(
      "netFlowLeftExplainerClosed"
    );
    if (tempLeftExplainerClosed) {
      this.setState({ LeftShow: false });
    }
    const tempRightExplainerClosed = window.localStorage.getItem(
      "netFlowRightExplainerClosed"
    );
    if (tempRightExplainerClosed) {
      this.setState({ RightShow: false });
    }

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
    this.startPageView();
    this.props.getAllCoins();
    //here this.timeFilter(0, true);
    this.callTimeFilter();
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

    const search = this.props.location.search;
    const params = new URLSearchParams(search);
    const addAddress = params.get("add-address");
    if (addAddress) {
      this.handleAddModal();
      this.props.history.replace("/intelligence#netflow");
    }

    this.updateTimer(true);
    return () => {
      clearInterval(window.checkIntelligenceTimer);
    };
  }
  callTimeFilter = () => {
    this.setState({
      graphValue: "",
      netFlowLoading: true,
      isGraphLoading: true,
    });
    this.props.getAssetProfitLoss(
      this,
      moment.utc(this.state.fromDate).add(1, "days").unix(),
      moment.utc(this.state.toDate).add(1, "days").unix(),
      [],
      this.state.selectedAssets
    );
    this.props.getProfitAndLossApi(
      this,
      moment.utc(this.state.fromDate).add(1, "days").unix(),
      moment.utc(this.state.toDate).add(1, "days").unix(),
      [],
      this.state.selectedAssets
    );
  };
  componentDidUpdate(prevProps, prevState) {
    // add wallet
    // used for filter
    if (
      prevState.fromDate !== this.state.fromDate ||
      prevState.toDate !== this.state.toDate
    ) {
      this.callTimeFilter();
    }
    if (
      prevProps.intelligenceState?.updatedInsightList !==
      this.props.intelligenceState?.updatedInsightList
    ) {
      // insight_type: 30
      const newTempHolder =
        this.props.intelligenceState.updatedInsightList.filter(
          (resRes) => resRes.insight_type !== 30
        );
      this.setState({
        updatedInsightList: newTempHolder,
      });
    }
    if (prevProps.intelligenceState !== this.props.intelligenceState) {
      this.setState({ isGraphLoading: false });
    }
    if (prevState.apiResponse !== this.state.apiResponse) {
      this.setState({
        apiResponse: false,
      });
    }

    if (!this.props.commonState.intelligence) {
      this.props.updateWalletListFlag("intelligence", true);
      this.props.getAllCoins();
      //here this.timeFilter(0);
      this.callTimeFilter();
      this.assetList();
      let tempData = new URLSearchParams();
      tempData.append("start", 0);
      tempData.append("conditions", JSON.stringify([]));
      tempData.append("limit", 50);
      tempData.append("sorts", JSON.stringify([]));
      this.props.getAllWalletListApi(tempData, this);
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
                100,
            });
          }
        }, 0);
      } else {
        window.scrollTo(0, 0);
      }
      setTimeout(() => {
        this.props.history.replace("/intelligence");
      }, 1000);
    }
    if (
      this.props?.location?.pathname + this.props?.location?.hash ===
        "/intelligence#price" ||
      this.props?.location?.pathname + this.props?.location?.hash ===
        "/top-accounts/intelligence#price"
    ) {
      window.scrollTo(0, 0);
      setTimeout(() => {
        this.props.history.replace("/intelligence");
      }, 1000);
    }
  }
  updateTimer = (first) => {
    const tempExistingExpiryTime = window.localStorage.getItem(
      "intelligencePageExpiryTime"
    );
    if (!tempExistingExpiryTime && !first) {
      this.startPageView();
    }
    const tempExpiryTime = Date.now() + 1800000;
    window.localStorage.setItem("intelligencePageExpiryTime", tempExpiryTime);
  };
  endPageView = () => {
    clearInterval(window.checkIntelligenceTimer);
    window.localStorage.removeItem("intelligencePageExpiryTime");
    if (this.state.startTime) {
      let endTime = new Date() * 1;
      let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
      PriceGaugePageTimeSpentMP({
        time_spent: TimeSpent,
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
    }
  };
  checkForInactivity = () => {
    const tempExpiryTime = window.localStorage.getItem(
      "intelligencePageExpiryTime"
    );
    if (tempExpiryTime && tempExpiryTime < Date.now()) {
      this.endPageView();
    }
  };
  componentWillUnmount() {
    const tempExpiryTime = window.localStorage.getItem(
      "intelligencePageExpiryTime"
    );
    if (tempExpiryTime) {
      this.endPageView();
    }
  }

  assetList = () => {
    let data = new URLSearchParams();
    // data.append("end_datetime", endDate);
    getTransactionAsset(data, this, true);
  };
  changeFromDate = (passedDate) => {
    if (passedDate) {
      let toText = "";
      if (this.state.toDate) {
        toText = moment(this.state.toDate).format("MMMM Do YYYY");
      }
      let fromText = moment(passedDate).format("MMMM Do YYYY");
      this.setState({
        fromDate: passedDate,
        isFromCalendar: false,
        isToCalendar: false,
      });
      netflowDateFilter({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        from: fromText,
        to: toText,
      });
    }
  };
  changeToDate = (passedDate) => {
    if (passedDate) {
      let fromText = "";
      if (this.state.fromDate) {
        fromText = moment(this.state.fromDate).format("MMMM Do YYYY");
      }
      let toText = moment(passedDate).format("MMMM Do YYYY");

      this.setState({
        toDate: passedDate,
        isToCalendar: false,
        isFromCalendar: false,
      });
      netflowDateFilter({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        from: fromText,
        to: toText,
      });
    }
  };

  handleBadge = (activeBadgeList, activeFooter = this.state.title) => {
    this.setState({
      selectedActiveBadge: activeBadgeList,
      netFlowLoading: true,
      isGraphLoading: true,
    });

    let startDate = moment.utc(this.state.fromDate).add(1, "days").unix();
    let endDate = moment.utc(this.state.toDate).add(1, "days").unix();

    let selectedChains = [];
    this.props.OnboardingState.coinsList?.map((item) => {
      if (activeBadgeList?.includes(item.id)) {
        selectedChains.push(item.code);
      }
    });

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

    const tempIsSearchUsed = this.state.isChainSearchUsed;
    netflowChainFilter({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      selected: selectedChains,
      isSearchUsed: tempIsSearchUsed,
    });
    this.updateTimer();
    this.setState({ isChainSearchUsed: false });
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
    window.localStorage.setItem("netFlowRightExplainerClosed", true);
    this.setState({
      RightShow: false,
    });
    netflowExplainer2({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    this.updateTimer();
  };

  LeftClose = () => {
    window.localStorage.setItem("netFlowLeftExplainerClosed", true);
    this.setState({
      LeftShow: false,
    });

    netflowExplainer1({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    this.updateTimer();
  };

  handleAssetSelected = (arr) => {
    this.setState(
      {
        selectedAssets: arr[0].name === "All" ? [] : arr.map((e) => e?.id),
      },
      () => {
        const tempIsSearchUsed = this.state.isAssetSearchUsed;
        netflowAssetFilter({
          session_id: getCurrentUser().id,
          email_address: getCurrentUser().email,
          selected: arr[0] === "All" ? "All tokens" : arr.map((e) => e?.name),
          isSearchUsed: tempIsSearchUsed,
        });
        this.setState({ isAssetSearchUsed: false });
        this.handleBadge(this.state.selectedActiveBadge, this.state.title);
      }
    );
  };

  handleShare = () => {
    let lochUser = getCurrentUser().id;
    let userWallet = JSON.parse(window.localStorage.getItem("addWallet"));
    let slink =
      userWallet?.length === 1
        ? userWallet[0].displayAddress || userWallet[0].address
        : lochUser;
    let shareLink = BASE_URL_S3 + "home/" + slink + "?redirect=price-gauge";
    navigator.clipboard.writeText(shareLink);
    toast.success("Link copied");

    IntShare({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    this.updateTimer();
  };
  render() {
    if (mobileCheck()) {
      return (
        <MobileLayout
          showTopSearchBar
          handleShare={this.handleShare}
          isSidebarClosed={this.props.isSidebarClosed}
          history={this.props.history}
          CheckApiResponse={(e) => this.CheckApiResponse(e)}
          showpath
          currentPage={"price-gauge"}
        >
          <PriceGuageMobile
            userWalletList={this.state.userWalletList}
            lochToken={this.state.lochToken}
            apiResponse={this.state.apiResponse}
          />
        </MobileLayout>
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
              <WelcomeCard
                showTopSearchBar
                openConnectWallet={this.props.openConnectWallet}
                connectedWalletAddress={this.props.connectedWalletAddress}
                connectedWalletevents={this.props.connectedWalletevents}
                disconnectWallet={this.props.disconnectWallet}
                handleShare={this.handleShare}
                isSidebarClosed={this.props.isSidebarClosed}
                apiResponse={(e) => this.CheckApiResponse(e)}
                // history
                history={this.props.history}
                // add wallet address modal
                handleAddModal={this.handleAddModal}
                updateTimer={this.updateTimer}
              />
            </div>
          </div>
        </div>
        <div className="intelligence-page-section">
          <div className="intelligence-section page-scroll">
            <div className="page-scroll-child">
              <TopWalletAddressList
                apiResponse={(e) => this.CheckApiResponse(e)}
                handleShare={this.handleShare}
                showpath
                currentPage={"price-gauge"}
              />
              {this.state.upgradeModal && (
                <UpgradeModal
                  show={this.state.upgradeModal}
                  onHide={this.upgradeModal}
                  history={this.props.history}
                  isShare={window.localStorage.getItem("share_id")}
                  isStatic={this.state.isStatic}
                  triggerId={this.state.triggerId}
                  pname="intelligence"
                  updateTimer={this.updateTimer}
                />
              )}
              <div className="m-b-32">
                <PageHeader
                  title="Price gauge"
                  subTitle="Understand when these tokens were bought and sold"
                  currentPage="price-gauge"
                  ShareBtn={true}
                  handleShare={this.handleShare}
                  updateTimer={this.updateTimer}
                  hoverText={`This chart reflects the price for any token held by this portfolio ever. Understand if this trader can buy low and sell high.`}
                />
              </div>

              <div id="price" style={{ paddingTop: "0.4rem" }}>
                <InflowOutflowChart
                  userWalletList={this.state.userWalletList}
                  apiResponse={this.state.apiResponse}
                />
              </div>

              <Footer />
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
                updateTimer={this.updateTimer}
              />
            )}
          </div>
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
  darkModeState: state.darkModeState,
});
const mapDispatchToProps = {
  // getPosts: fetchPosts
  getAllCoins,
  getCoinRate,
  getUserWallet,
  settingDefaultValues,

  getProfitAndLossApi,
  getAssetProfitLoss,
  updateWalletListFlag,
  setPageFlagDefault,
  getAllWalletListApi,
  GetAllPlan,
  getUser,
};

PriceGauge.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(PriceGauge);
