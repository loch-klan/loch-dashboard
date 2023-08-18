import React, { Component } from "react";
import { connect } from "react-redux";
import PageHeader from "../common/PageHeader";
import eyeIcon from "../../assets/images/icons/eyeIcon.svg";
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
import { UpgradeTriggered } from "../../utils/ReusableFunctions";
import UpgradeModal from "../common/upgradeModal";
import { toast } from "react-toastify";
import Footer from "../common/footer";
import WelcomeCard from "../Portfolio/WelcomeCard";

class Intelligence extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // showPercentage: {
      //   icon: arrowUpRight,
      //   percent: "25",
      //   status: "Increase",
      //   GraphData: [],
      //   graphValue: "null",
      // },

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
      netFlowLoading: false,
      isGraphLoading: true,
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
          element.scrollIntoView();
        }
      }, 0);
    } else {
      window.scrollTo(0, 0);
    }
    this.startPageView();
    this.props.getAllCoins();
    this.timeFilter(0, true);
    GetAllPlan();
    getUser();
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

  componentDidUpdate(prevProps, prevState) {
    // add wallet
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
      this.timeFilter(0);
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
            element.scrollIntoView();
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
    const tempExistingExpiryTime = localStorage.getItem(
      "intelligencePageExpiryTime"
    );
    if (!tempExistingExpiryTime && !first) {
      this.startPageView();
    }
    const tempExpiryTime = Date.now() + 1800000;
    localStorage.setItem("intelligencePageExpiryTime", tempExpiryTime);
  };
  endPageView = () => {
    clearInterval(window.checkIntelligenceTimer);
    localStorage.removeItem("intelligencePageExpiryTime");
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
    const tempExpiryTime = localStorage.getItem("intelligencePageExpiryTime");
    if (tempExpiryTime && tempExpiryTime < Date.now()) {
      this.endPageView();
    }
  };
  componentWillUnmount() {
    const tempExpiryTime = localStorage.getItem("intelligencePageExpiryTime");
    if (tempExpiryTime) {
      this.endPageView();
    }
  }

  assetList = () => {
    let data = new URLSearchParams();
    // data.append("end_datetime", endDate);
    getTransactionAsset(data, this);
  };
  timeFilter = (option, first) => {
    let selectedChains = [];
    // if(activeBadgeList){
    //   this.props.OnboardingState.coinsList.map((item)=>{
    //     if(activeBadgeList.includes(item.id)){
    //       selectedChains.push(item.code)
    //     }
    //   })
    // }
    let handleSelected = "All";
    this.setState({
      graphValue: "",
      netFlowLoading: true,
      isGraphLoading: true,
    });
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
      netflowTimeFilter({
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
      netFlowLoading: true,
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
    netflowChainFilter({
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
    let userWallet = JSON.parse(localStorage.getItem("addWallet"));
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
                // history
                history={this.props.history}
                // add wallet address modal
                handleAddModal={this.handleAddModal}
                updateTimer={this.updateTimer}
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
                updateTimer={this.updateTimer}
              />
            )}
            <PageHeader
              title="Intelligence"
              subTitle="Automated and personalized financial intelligence"
              // btnText={"Add wallet"}
              // handleBtn={this.handleAddModal}
              ShareBtn={true}
              handleShare={this.handleShare}
              updateTimer={this.updateTimer}
            />

            <div className="insights-image m-b-60">
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
                  ) : this.props.intelligenceState.updatedInsightList &&
                    this.props.intelligenceState.updatedInsightList.length >
                      0 ? (
                    this.props.intelligenceState.updatedInsightList
                      ?.slice(0, 2)
                      .map((insight, key) => {
                        return (
                          <div className="insights-card" key={key}>
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
            <div className="portfolio-bar-graph" id="netflow">
              <PageHeader title="Net flows" showImg={eyeIcon} />
              {/* Netflow Info Start */}

              <Row
                style={
                  this.state.RightShow || this.state.LeftShow
                    ? { marginBottom: "2.6rem" }
                    : {}
                }
              >
                {/* 1st */}
                {this.state.LeftShow && (
                  <Col md={5} style={{ paddingRight: "10px" }} sm={12}>
                    <div className="InfoCard">
                      <Image
                        src={NetflowClose}
                        className="CloseBtn"
                        onClick={this.LeftClose}
                      />
                      <div className="m-b-30 InfoItem">
                        <div className="title">
                          <h3 className="inter-display-medium f-s-13 lh-15 black-191">
                            Inflows
                          </h3>
                        </div>
                        <div className="description">
                          <p className="inter-display-medium f-s-13 lh-15 grey-969">
                            sum total of all assets received by your portfolio
                          </p>
                        </div>
                      </div>

                      <div className="m-b-30 InfoItem">
                        <div className="title">
                          <h3 className="inter-display-medium f-s-13 lh-15 black-191">
                            Outflows
                          </h3>
                        </div>
                        <div className="description">
                          <p className="inter-display-medium f-s-13 lh-15 grey-969">
                            sum total of all assets and fees sent out by your
                            portfolio
                          </p>
                        </div>
                      </div>

                      <div className="InfoItem">
                        <div className="title">
                          <h3 className="inter-display-medium f-s-13 lh-15 black-191">
                            Net
                          </h3>
                        </div>
                        <div className="description">
                          <p className="inter-display-medium f-s-13 lh-15 grey-969">
                            outflows - inflows
                          </p>
                        </div>
                      </div>
                    </div>
                  </Col>
                )}

                {/* Second */}
                {this.state.RightShow && (
                  <Col md={7} style={{ paddingLeft: "10px" }} sm={12}>
                    <div className="InfoCardRight">
                      <Image
                        src={NetflowClose}
                        className="CloseBtn"
                        onClick={this.RightClose}
                      />
                      <div className="imageSection">
                        <Image src={NetflowImg} />
                        <h3 className="inter-display-bold f-s-10 lh-12 black-191 m-t-12 explainer-text">
                          EXPLAINER
                        </h3>
                      </div>

                      <div className="RightSection">
                        <h3
                          className="inter-display-medium f-s-16 lh-19 black-191 m-b-12"
                          // style={{ width: "75px" }}
                        >
                          Inflows and Outflows might appear inflated if the same
                          funds went in and out of a single wallet multiple
                          times.
                        </h3>
                        <p
                          className="inter-display-medium f-s-13 lh-15 grey-969"
                          // style={{ width: "215px" }}
                        >
                          This chart is most accurate when all your wallet
                          addresses are added to Loch. This way we don't double
                          count funds.
                        </p>
                      </div>
                    </div>
                  </Col>
                )}
              </Row>

              {/* Netflow Info End */}

              <div style={{ position: "relative", minWidth: "85rem" }}>
                {this.props.intelligenceState.graphValue ? (
                  <BarGraphSection
                    isScrollVisible={false}
                    data={this.props.intelligenceState.graphValue[0]}
                    options={this.props.intelligenceState.graphValue[1]}
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
