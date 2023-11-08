import React, { Component } from "react";
import { connect } from "react-redux";
import PageHeader from "../common/PageHeader";
import insight from "../../assets/images/icons/insight.svg";
import BarGraphSection from "../common/BarGraphSection";
import { getAllCoins } from "../onboarding/Api.js";
import { Col, Image, Row } from "react-bootstrap";
import {
  InsightsViewMore,
  IntelligencePage,
  IntShare,
  netflowAssetFilter,
  netflowChainFilter,
  netflowExplainer1,
  netflowExplainer2,
  NetflowSwitch,
  netflowTimeFilter,
  TimeSpentIntelligence,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import moment from "moment/moment";
import { getAllWalletListApi } from "../wallet/Api";
import {
  getAssetProfitLoss,
  getProfitAndLossApi,
  getTransactionAsset,
} from "./Api";
import Loading from "../common/Loading";
import reduceCost from "../../assets/images/icons/reduce-cost.svg";
import reduceRisk from "../../assets/images/icons/reduce-risk.svg";
import increaseYield from "../../assets/images/icons/increase-yield.svg";
import { getAllInsightsApi } from "./Api";
import { BASE_URL_S3, InsightType } from "../../utils/Constant";
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
import { UpgradeTriggered, mobileCheck } from "../../utils/ReusableFunctions";
import UpgradeModal from "../common/upgradeModal";
import { toast } from "react-toastify";
import Footer from "../common/footer";
import WelcomeCard from "../Portfolio/WelcomeCard";
import InflowOutflowChart from "./InflowOutflowChart";
import { EyeThinIcon } from "../../assets/images/icons";
import Calendar from "react-calendar";
import OutsideClickHandler from "react-outside-click-handler";

class Intelligence extends Component {
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
      userWalletList: window.sessionStorage.getItem("addWallet")
        ? JSON.parse(window.sessionStorage.getItem("addWallet"))
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
        JSON.parse(window.sessionStorage.getItem("currentPlan")) || "Free",
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
      userPlan: JSON.parse(window.sessionStorage.getItem("currentPlan")),
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
    IntelligencePage({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    // Inactivity Check
    window.checkIntelligenceTimer = setInterval(() => {
      this.checkForInactivity();
    }, 900000);
  };

  componentDidMount() {
    if (mobileCheck()) {
      this.props.history.push("/home");
    }
    if (this.props.intelligenceState?.updatedInsightList) {
      const newTempHolder =
        this.props.intelligenceState.updatedInsightList.filter(
          (resRes) => resRes.insight_type !== 30
        );
      this.setState({
        updatedInsightList: newTempHolder,
      });
    }
    const tempLeftExplainerClosed = window.sessionStorage.getItem(
      "netFlowLeftExplainerClosed"
    );
    if (tempLeftExplainerClosed) {
      this.setState({ LeftShow: false });
    }
    const tempRightExplainerClosed = window.sessionStorage.getItem(
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
      moment(this.state.fromDate).unix(),
      moment(this.state.toDate).unix(),
      [],
      this.state.selectedAssets
    );
    this.props.getProfitAndLossApi(
      this,
      moment(this.state.fromDate).unix(),
      moment(this.state.toDate).unix(),
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
    if (prevState.apiResponse != this.state.apiResponse) {
      // this.props.getAllCoins();
      // this.timeFilter(0);
      // this.props.getAllInsightsApi(this);
      // this.assetList();
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

    if (!this.props.commonState.insight) {
      this.props.updateWalletListFlag("insight", true);
      this.props.getAllInsightsApi(this);
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
        this.props.history.replace("/intelligence");
      }, 1000);
    }
    if (
      this.props?.location?.pathname + this.props?.location?.hash ===
        "/intelligence#price" ||
      this.props?.location?.pathname + this.props?.location?.hash ===
        "/top-accounts/intelligence#price"
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
        this.props.history.replace("/intelligence");
      }, 1000);
    }
  }
  updateTimer = (first) => {
    const tempExistingExpiryTime = window.sessionStorage.getItem(
      "intelligencePageExpiryTime"
    );
    if (!tempExistingExpiryTime && !first) {
      this.startPageView();
    }
    const tempExpiryTime = Date.now() + 1800000;
    window.sessionStorage.setItem("intelligencePageExpiryTime", tempExpiryTime);
  };
  endPageView = () => {
    clearInterval(window.checkIntelligenceTimer);
    window.sessionStorage.removeItem("intelligencePageExpiryTime");
    if (this.state.startTime) {
      let endTime = new Date() * 1;
      let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
      TimeSpentIntelligence({
        time_spent: TimeSpent,
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
    }
  };
  checkForInactivity = () => {
    const tempExpiryTime = window.sessionStorage.getItem(
      "intelligencePageExpiryTime"
    );
    if (tempExpiryTime && tempExpiryTime < Date.now()) {
      this.endPageView();
    }
  };
  componentWillUnmount() {
    const tempExpiryTime = window.sessionStorage.getItem(
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
      this.setState({
        fromDate: passedDate,
        isFromCalendar: false,
        isToCalendar: false,
      });
    }
  };
  changeToDate = (passedDate) => {
    if (passedDate) {
      this.setState({
        toDate: passedDate,
        isToCalendar: false,
        isFromCalendar: false,
      });
    }
  };
  // timeFilter = (option, first) => {
  //   let selectedChains = [];
  //   // if(activeBadgeList){
  //   //   this.props.OnboardingState.coinsList.map((item)=>{
  //   //     if(activeBadgeList.includes(item.id)){
  //   //       selectedChains.push(item.code)
  //   //     }
  //   //   })
  //   // }
  //   let handleSelected = "All";
  //   this.setState({
  //     graphValue: "",
  //     netFlowLoading: true,
  //     isGraphLoading: true,
  //   });
  //   const today = moment().unix();
  //   if (option == 0) {
  //     this.props.getProfitAndLossApi(
  //       this,
  //       false,
  //       false,
  //       selectedChains,
  //       this.state.selectedAssets
  //     );
  //     // for asset Breakdown
  //     this.props.getAssetProfitLoss(
  //       this,
  //       false,
  //       false,
  //       selectedChains,
  //       this.state.selectedAssets
  //     );
  //     handleSelected = "All";
  //   } else if (option == 1) {
  //     const fiveyear = moment().subtract(5, "years").unix();
  //     this.props.getProfitAndLossApi(
  //       this,
  //       fiveyear,
  //       today,
  //       selectedChains,
  //       this.state.selectedAssets
  //     );
  //     // for asset Breakdown
  //     this.props.getAssetProfitLoss(
  //       this,
  //       fiveyear,
  //       today,
  //       selectedChains,
  //       this.state.selectedAssets
  //     );
  //     handleSelected = "5 years";
  //   } else if (option == 2) {
  //     handleSelected = "4 years";
  //     const fouryear = moment().subtract(4, "years").unix();
  //     this.props.getProfitAndLossApi(
  //       this,
  //       fouryear,
  //       today,
  //       selectedChains,
  //       this.state.selectedAssets
  //     );
  //     this.props.getAssetProfitLoss(
  //       this,
  //       fouryear,
  //       today,
  //       selectedChains,
  //       this.state.selectedAssets
  //     );
  //   } else if (option == 3) {
  //     handleSelected = "3 years";
  //     const threeyear = moment().subtract(3, "years").unix();
  //     this.props.getProfitAndLossApi(
  //       this,
  //       threeyear,
  //       today,
  //       selectedChains,
  //       this.state.selectedAssets
  //     );
  //     this.props.getAssetProfitLoss(
  //       this,
  //       threeyear,
  //       today,
  //       selectedChains,
  //       this.state.selectedAssets
  //     );
  //   } else if (option == 4) {
  //     handleSelected = "2 years";
  //     const twoyear = moment().subtract(2, "years").unix();
  //     this.props.getProfitAndLossApi(
  //       this,
  //       twoyear,
  //       today,
  //       selectedChains,
  //       this.state.selectedAssets
  //     );
  //     this.props.getAssetProfitLoss(
  //       this,
  //       twoyear,
  //       today,
  //       selectedChains,
  //       this.state.selectedAssets
  //     );
  //   } else if (option == 5) {
  //     handleSelected = "1 year";
  //     const year = moment().subtract(1, "years").unix();
  //     this.props.getProfitAndLossApi(
  //       this,
  //       year,
  //       today,
  //       selectedChains,
  //       this.state.selectedAssets
  //     );
  //     this.props.getAssetProfitLoss(
  //       this,
  //       year,
  //       today,
  //       selectedChains,
  //       this.state.selectedAssets
  //     );
  //   } else if (option == 6) {
  //     handleSelected = "6 months";
  //     const sixmonth = moment().subtract(6, "months").unix();
  //     this.props.getProfitAndLossApi(
  //       this,
  //       sixmonth,
  //       today,
  //       selectedChains,
  //       this.state.selectedAssets
  //     );
  //     this.props.getAssetProfitLoss(
  //       this,
  //       sixmonth,
  //       today,
  //       selectedChains,
  //       this.state.selectedAssets
  //     );
  //   } else if (option == 7) {
  //     handleSelected = "1 month";
  //     const month = moment().subtract(1, "month").unix();
  //     this.props.getProfitAndLossApi(
  //       this,
  //       month,
  //       today,
  //       selectedChains,
  //       this.state.selectedAssets
  //     );
  //     this.props.getAssetProfitLoss(
  //       this,
  //       month,
  //       today,
  //       selectedChains,
  //       this.state.selectedAssets
  //     );
  //   } else if (option == 8) {
  //     handleSelected = "1 week";
  //     const week = moment().subtract(1, "week").unix();
  //     this.props.getProfitAndLossApi(
  //       this,
  //       week,
  //       today,
  //       selectedChains,
  //       this.state.selectedAssets
  //     );
  //     this.props.getAssetProfitLoss(
  //       this,
  //       week,
  //       today,
  //       selectedChains,
  //       this.state.selectedAssets
  //     );
  //   } else if (option == 9) {
  //     handleSelected = "1 day";
  //     const day = moment().subtract(1, "day").unix();
  //     this.props.getProfitAndLossApi(
  //       this,
  //       day,
  //       today,
  //       selectedChains,
  //       this.state.selectedAssets
  //     );
  //     this.props.getAssetProfitLoss(
  //       this,
  //       day,
  //       today,
  //       selectedChains,
  //       this.state.selectedAssets
  //     );
  //   }
  //   if (!first) {
  //     netflowTimeFilter({
  //       session_id: getCurrentUser().id,
  //       email_address: getCurrentUser().email,
  //       selected: handleSelected,
  //     });
  //     this.updateTimer();
  //   }
  //   this.setState({
  //     title: option,
  //   });
  // };

  handleBadge = (activeBadgeList, activeFooter = this.state.title) => {
    this.setState({
      selectedActiveBadge: activeBadgeList,
      netFlowLoading: true,
      isGraphLoading: true,
    });
    let startDate = moment(this.state.fromDate).unix();
    let endDate = moment(this.state.toDate).unix();

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
    window.sessionStorage.setItem("netFlowRightExplainerClosed", true);
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
    window.sessionStorage.setItem("netFlowLeftExplainerClosed", true);
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
          selected: arr[0] === "All" ? "All assets" : arr.map((e) => e?.name),
          isSearchUsed: tempIsSearchUsed,
        });
        this.setState({ isAssetSearchUsed: false });
        this.handleBadge(this.state.selectedActiveBadge, this.state.title);
      }
    );
  };

  handleShare = () => {
    let lochUser = getCurrentUser().id;
    let userWallet = JSON.parse(window.sessionStorage.getItem("addWallet"));
    let slink =
      userWallet?.length === 1
        ? userWallet[0].displayAddress || userWallet[0].address
        : lochUser;
    let shareLink =
      BASE_URL_S3 + "home/" + slink + "?redirect=intelligence#netflow";
    navigator.clipboard.writeText(shareLink);
    toast.success("Link copied");

    IntShare({
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
          <div className="intelligence-section page">
            {this.state.upgradeModal && (
              <UpgradeModal
                show={this.state.upgradeModal}
                onHide={this.upgradeModal}
                history={this.props.history}
                isShare={window.sessionStorage.getItem("share_id")}
                isStatic={this.state.isStatic}
                triggerId={this.state.triggerId}
                pname="intelligence"
                updateTimer={this.updateTimer}
              />
            )}
            <div className="m-b-32">
              <PageHeader
                title="Portfolio"
                subTitle="Automated and personalized financial intelligence"
                // btnText={"Add wallet"}
                // handleBtn={this.handleAddModal}
                ShareBtn={true}
                handleShare={this.handleShare}
                updateTimer={this.updateTimer}
              />
            </div>

            <div className="insights-image m-b-32">
              <PageHeader
                title="Insights"
                showImg={insight}
                viewMore={true}
                // viewMoreRedirect={"/intelligence/insights"}
                handleClick={() => {
                  this.props.history.push("/intelligence/insights");
                  InsightsViewMore({
                    session_id: getCurrentUser().id,
                    email_address: getCurrentUser().email,
                  });
                }}
                updateTimer={this.updateTimer}
              />
              <div style={{ position: "relative" }}>
                <div className="insights-wrapper">
                  {/* <h2 className="inter-display-medium f-s-25 lh-30 black-191">This week</h2> */}
                  {this.state.isLoading ? (
                    <Loading />
                  ) : this.state.updatedInsightList &&
                    this.state.updatedInsightList.length > 0 ? (
                    this.state.updatedInsightList
                      ?.slice(0, 2)
                      .map((insight, key) => {
                        return (
                          <div
                            style={{
                              marginBottom: key === 1 ? "0rem" : "",
                            }}
                            className="insights-card"
                            key={key}
                          >
                            <Image
                              src={
                                insight.insight_type ===
                                InsightType.COST_REDUCTION
                                  ? reduceCost
                                  : insight.insight_type ===
                                    InsightType.RISK_REDUCTION
                                  ? reduceRisk
                                  : increaseYield
                              }
                              className="insight-icon"
                            />
                            <div className="insights-content">
                              <div className="chips-wrapper">
                                <h5 className="inter-display-bold f-s-10 lh-12 title-chip">
                                  {InsightType.getText(insight.insight_type)}
                                </h5>
                                {insight?.sub_type && (
                                  <h5 className="inter-display-bold f-s-10 lh-12 risk-chip">
                                    {InsightType.getRiskType(insight.sub_type)}
                                  </h5>
                                )}
                              </div>
                              <p
                                className="inter-display-medium f-s-13 lh-16 grey-969"
                                dangerouslySetInnerHTML={{
                                  __html: insight.sub_title,
                                }}
                              ></p>
                              <h4
                                className="inter-display-medium f-s-16 lh-19 grey-313"
                                dangerouslySetInnerHTML={{
                                  __html: insight.title,
                                }}
                              ></h4>
                            </div>
                          </div>
                        );
                      })
                  ) : (
                    <h5 className="inter-display-medium f-s-16 lh-19 grey-313 m-b-8 text-center">
                      {
                        "This wallet is not active enough for us to generate any useful insights here :)."
                      }
                    </h5>
                  )}
                </div>
              </div>
            </div>
            <div className="portfolio-bar-graph">
              <div id="netflow" style={{ paddingTop: "0.4rem" }}>
                <PageHeader
                  showNetflowExplainers
                  title="Realized profit and loss"
                  showImg={EyeThinIcon}
                />
              </div>
              {/* Netflow Info Start */}

              {/* Second */}
              {/* Netflow Info End */}
              {/* <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <OutsideClickHandler onOutsideClick={this.hideFromCalendar}>
                  <div className="intelligenceCalendarContainer">
                    <div onClick={this.showFromCalendar}>From</div>
                    {this.state.isFromCalendar ? (
                      <div className="intelligenceCalendar">
                        <Calendar
                          date={this.state.fromDate}
                          className={
                            "calendar-select inter-display-medium f-s-13 lh-16"
                          }
                          onChange={this.changeFromDate}
                          maxDate={this.state.maxDate}
                          minDate={this.state.minDate}
                          defaultValue={this.state.fromDate}
                        />
                      </div>
                    ) : null}
                  </div>
                </OutsideClickHandler>
                <OutsideClickHandler onOutsideClick={this.hideToCalendar}>
                  <div className="intelligenceCalendarContainer">
                    <div onClick={this.showToCalendar}>To</div>
                    {this.state.isToCalendar ? (
                      <div className="intelligenceCalendar">
                        <Calendar
                          date={this.state.toDate}
                          className={
                            "calendar-select inter-display-medium f-s-13 lh-16"
                          }
                          onChange={this.changeToDate}
                          maxDate={this.state.maxDate}
                          minDate={this.state.minDate}
                          defaultValue={this.state.toDate}
                        />
                      </div>
                    ) : null}
                  </div>
                </OutsideClickHandler>
              </div> */}

              <div
                style={{
                  position: "relative",
                  minWidth: "85rem",
                }}
              >
                {this.props.intelligenceState.graphValue ? (
                  <BarGraphSection
                    dontShowAssets
                    showToCalendar={this.showToCalendar}
                    hideToCalendar={this.hideToCalendar}
                    hideFromCalendar={this.hideFromCalendar}
                    showFromCalendar={this.showFromCalendar}
                    changeToDate={this.changeToDate}
                    changeFromDate={this.changeFromDate}
                    isFromCalendar={this.state.isFromCalendar}
                    toDate={this.state.toDate}
                    isToCalendar={this.state.isToCalendar}
                    fromDate={this.state.fromDate}
                    maxDate={this.state.maxDate}
                    minDate={this.state.minDate}
                    showFromAndTo
                    isScrollVisible={false}
                    data={this.props.intelligenceState.graphValue[0]}
                    options={this.props.intelligenceState.graphValue[1]}
                    coinsList={this.props.OnboardingState.coinsList}
                    isSwitch={this.state.isSwitch}
                    setSwitch={this.setSwitch}
                    marginBottom="m-b-32"
                    // showFooter={false}
                    showFooterDropdown={false}
                    // showFooter={true}
                    showToken={true}
                    activeTitle={this.state.title}
                    assetList={this.state.AssetList}
                    showPercentage={this.props.intelligenceState.graphValue[2]}
                    handleBadge={(activeBadgeList, activeFooter) =>
                      this.handleBadge(activeBadgeList, activeFooter)
                    }
                    ProfitLossAsset={
                      this.props.intelligenceState.ProfitLossAsset
                    }
                    handleAssetSelected={this.handleAssetSelected}
                    getObj={true}
                    isGraphLoading={this.state.isGraphLoading}
                    chainSearchIsUsed={this.chainSearchIsUsed}
                    assetSearchIsUsed={this.assetSearchIsUsed}
                    // hiding loader for now
                    // isLoading={this.state.netFlowLoading}
                    // loaderHeight={57.8}

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
              <div id="price" style={{ paddingTop: "0.4rem" }}>
                <InflowOutflowChart
                  userWalletList={this.state.userWalletList}
                />
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
              updateTimer={this.updateTimer}
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
  getAllWalletListApi,
  GetAllPlan,
  getUser,
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

Intelligence.propTypes = {
  // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Intelligence);
