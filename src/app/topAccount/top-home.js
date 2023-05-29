import React from "react";
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import { connect } from "react-redux";
import WelcomeCard from "../Portfolio/WelcomeCard";
import LineChartSlider from "../Portfolio/LineCharSlider";
import prevIcon from "../../assets/images/icons/prev-arrow.svg";
import nextIcon from "../../assets/images/icons/next-arrow.svg";
import LightBulb from "../../assets/images/icons/lightbulb.svg";
import ArrowRight from "../../assets/images/icons/arrow-right.svg";
import GainIcon from "../../assets/images/icons/GainIcon.svg";
import LossIcon from "../../assets/images/icons/LossIcon.svg";

import {
  getCoinRate,
  getDetailsByLinkApi,
  getUserWallet,
  getYesterdaysBalanceApi,
  settingDefaultValues,
  getExternalEventsApi,
  getExchangeBalances,
} from "../Portfolio/Api";
import { Button, Image, Row, Col } from "react-bootstrap";
import { getAllCoins, getAllParentChains } from "../onboarding/Api.js";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import TransactionTable from "../intelligence/TransactionTable";
import BarGraphSection from "./../common/BarGraphSection";
import {
  getAllInsightsApi,
  getProfitAndLossApi,
  searchTransactionApi,
} from "../intelligence/Api.js";

import {
  getDetectedChainsApi,
  setPageFlagDefault,
  updateWalletListFlag,
} from "../common/Api";
import {
  GroupByOptions,
  GROUP_BY_DATE,
  InsightType,
} from "../../utils/Constant";
import sortByIcon from "../../assets/images/icons/triangle-down.svg";
import reduceCost from "../../assets/images/icons/reduce-cost-img.svg";
import reduceRisk from "../../assets/images/icons/reduce-risk-img.svg";
import increaseYield from "../../assets/images/icons/increase-yield-img.svg";
import {
  TimeSpentHome,
  ProfitLossEV,
  HomePage,
  HomeInsightsExpand,
} from "../../utils/AnalyticsFunctions.js";
import { deleteToken, getCurrentUser } from "../../utils/ManageToken";
import { getAssetGraphDataApi } from "../Portfolio/Api";
import {
  getAvgCostBasis,
  ResetAverageCostBasis,
  updateAverageCostBasis,
} from "../cost/Api";
import Loading from "../common/Loading";
import {
  CurrencyType,
  noExponents,
  UpgradeTriggered,
} from "../../utils/ReusableFunctions";
import PieChart2 from "../Portfolio/PieChart2";
import UpgradeModal from "../common/upgradeModal";
import { GetAllPlan, getUser } from "../common/Api";
import { toast } from "react-toastify";
import { GraphHeader } from "../common/GraphHeader";
import Slider from "react-slick";
import Footer from "../common/footer";
import { ASSET_VALUE_GRAPH_DAY } from "../Portfolio/ActionTypes";
import TopPiechart from "./top-piechart";

class TopPortfolio extends BaseReactComponent {
  constructor(props) {
    super(props);
    const settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 1.5,
      slidesToScroll: 1,
      nextArrow: <Image src={nextIcon} />,
      prevArrow: <Image src={prevIcon} />,
    };

    this.state = {
      settings,
      id: props.match.params?.id,
      userWalletList: localStorage.getItem("addWallet")
        ? JSON.parse(localStorage.getItem("addWallet"))
        : [],

      // page loader
      loader: false,

      // piechart loading
      isLoading: false,
      // networth total loader
      isLoadingNet: false,

      // asset value laoder
      graphLoading: false,

      // not used any where but update on api
      barGraphLoading: false,

      // not used any where
      toggleAddWallet: true,

      // page start time to calc page spent
      startTime: "",

      // netflow loader
      netFlowLoading: false,

      // when go btn clicked run all api
      isUpdate: 0,

      // current page name
      currentPage: "Home",

      // get currency
      currency: JSON.parse(localStorage.getItem("currency")),

      // not used any where on this page
      counterGraphDigit: 3,


      // undetected btn
      showBtn: false,

      // when we get response from api then its true
      apiResponse: false,

      // upgrade plan
      userPlan: JSON.parse(localStorage.getItem("currentPlan")) || "Free",
      upgradeModal: false,
      isStatic: false,
      triggerId: 0,

      // get lock token
      lochToken: JSON.parse(localStorage.getItem("stopClick")),

      // insight
      updatedInsightList: "",
      isLoadingInsight: false,

      // Asset value data loaded
      assetValueDataLoaded: false,

      // set false when get portfolio by link api run 1 time
      portfolioLink: true,

      // cost basis table
      sortBy: [
        { title: "Asset", down: true },
        { title: "Average cost price", down: true },
        { title: "Current price", down: true },
        { title: "Amount", down: true },
        { title: "Cost basis", down: true },
        { title: "Current value", down: true },
        { title: "Gain loss", down: true },
      ],
      AvgCostLoading: false,

      chainLoader: false,
      totalChainDetechted: 0,

      // this is used in api to check api call fromt op acount page or not
      isTopAccountPage:true
    };
  }

  // get token
  getToken = () => {
    // console.log(this.state.lochToken)
    let token = localStorage.getItem("lochToken");
    if (!this.state.lochToken) {
      this.setState({
        lochToken: JSON.parse(localStorage.getItem("stopClick")),
      });
      setTimeout(() => {
        this.getToken();
      }, 1000);
    }

    if (token !== "jsk") {
      localStorage.setItem("stopClick", true);
      let obj = UpgradeTriggered();

      if (obj.trigger) {
        this.setState(
          {
            triggerId: obj.id,
            isStatic: true,
            isLoading: false,
            isLoadingNet: false,
          },
          () => {
            this.upgradeModal();
          }
        );
      }
    } else {
      this.setState({
        isLoadingInsight: true,
        netFlowLoading: true,
        isLoading: true,
        isLoadingNet: true,
        graphLoading: true,
        AvgCostLoading: true,
        chainLoader: true,
      });
    }
  };

  // upgrade modal
  upgradeModal = () => {
    this.setState({
      upgradeModal: !this.state.upgradeModal,
      userPlan: JSON.parse(localStorage.getItem("currentPlan")),
    });
  };


  // add wallet modal
  handleAddModal = () => {
    this.setState({
      addModal: !this.state.addModal,
      toggleAddWallet: false,
    });
  };

  componentDidMount() {
    this.setState({
      settings: {
        ...this.state.settings,
        slidesToShow:
          this.props.topAccountState.updatedInsightList?.length === 1
            ? 1
            : 1.5,
      },
    });

    this.state.startTime = new Date() * 1;

    // HomePage({
    //   session_id: getCurrentUser().id,
    //   email_address: getCurrentUser().email,
    // });
    this.apiCall();
    // get token to check if wallet address not loaded
    this.getToken();
  }

  componentDidUpdate(prevProps, prevState) {

    // Check if the coin rate api values are changed
    if (!this.props.commonState.top_home && this.state.lochToken) {
      this.props.updateWalletListFlag("top_home", true);
      this.setState({
        isLoadingInsight: true,
        netFlowLoading: true,
        isLoading: true,
        isLoadingNet: true,
        graphLoading: true,
        AvgCostLoading: true,
        chainLoader: true,
      });

      // if wallet address change
      if (
        this.state &&
        this.state.userWalletList &&
        this.state.userWalletList?.length > 0
      ) {
        // console.log("inside if");
        // Resetting the user wallet list, total and chain wallet
        this.props.settingDefaultValues();

        // Loops on coins to fetch details of each coin which exist in wallet
        let isFound = false;
        this.state.userWalletList?.map((wallet, i) => {
          if (wallet.coinFound) {
            isFound = true;
            wallet.coins.map((coin) => {
              if (coin.chain_detected) {
                let userCoinWallet = {
                  address: wallet.address,
                  coinCode: coin.coinCode,
                };
                this.props.getUserWallet(userCoinWallet, this, false, i);
              }
            });
          }

          if (i === this.state.userWalletList?.length - 1) {
            this.props.getYesterdaysBalanceApi(this);
          }
        });
        // connect exchange balance
        // this.props.getExchangeBalances(this, false);
      } else {
        // Resetting the user wallet list, total and chain wallet
        this.props.settingDefaultValues();

        // when wallet address not present run connect exchnage api
        this.props.getExchangeBalances(this, false);

        // run this api if itws value 0
        this.props.getYesterdaysBalanceApi(this);
      }

      // aset value chart
      this.getGraphData();

      // add netflows
      this.props.getProfitAndLossApi(this, false, false, false);

      // insights
      this.props.getAllInsightsApi(this);

      // avg cost basis
      this.props.getAvgCostBasis(this);

      // for chain detect
      setTimeout(() => {
        this.props.getAllCoins();
        this.props.getAllParentChains();
        getDetectedChainsApi(this);
      }, 1000);

      GetAllPlan();
      getUser(this);
    }
  }

  // get refresh btn
  setLoader = (value) => {
    // console.log("stop");
    this.setState({
      isLoading: value,
      isLoadingNet: value,
    });
  };

  apiCall = () => {
    this.props.getAllCoins();
    this.props.getCoinRate();
  };

  componentWillUnmount() {
    let endTime = new Date() * 1;
    let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
    TimeSpentHome({
      time_spent: TimeSpent,
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });

    // reset all sort average cost
    this.props.ResetAverageCostBasis();
  }

  // asset value chart api call
  getGraphData = (groupByValue = GROUP_BY_DATE) => {
    //console.log("calling graph");
    let ActionType = ASSET_VALUE_GRAPH_DAY;
    this.setState({ graphLoading: true }, () => {
      let addressList = [];
      this.state.userWalletList.map((wallet) =>
        addressList.push(wallet.address)
      );
      let data = new URLSearchParams();
      data.append("wallet_addresses", JSON.stringify(addressList));
      data.append("group_criteria", groupByValue);
      this.props.getAssetGraphDataApi(data, this, ActionType);
    });
  };

  // filter asset value chart
  handleGroupBy = (value) => {
    let groupByValue = GroupByOptions.getGroupBy(value);
    this.getGraphData(groupByValue);
  }; 

  // this is for undetected wallet button zIndex
  undetectedWallet = (e) => {
    this.setState({
      showBtn: e,
    });
  };

  // click add wallet address btn
  simulateButtonClick = () => {
    const buttonElement = document.querySelector("#address-button");
    buttonElement.click();
  };

  sortArray = (key, order) => {
    let array = this.props.topAccountState?.Average_cost_basis; //all data
    let sortedList = array.sort((a, b) => {
      let valueA = a[key];
      let valueB = b[key];
      if (key === "AssetCode") {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
        return order
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else {
        valueA = parseFloat(valueA);
        valueB = parseFloat(valueB);
      }
      if (order) {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }
    });

    // this.setState({
    //   sortedList,
    // });
    this.props.updateAverageCostBasis(sortedList);
  };
  // sort
  handleSort = (e) => {
    // down == true means ascending and down == false means descending
    let isDown = true;
    let sort = [...this.state.sortBy];
    sort.map((el) => {
      if (el.title === e.title) {
        el.down = !el.down;
        isDown = el.down;
      } else {
        el.down = true;
      }
    });

    if (e.title === "Asset") {
      this.sortArray("AssetCode", isDown);
      this.setState({
        sortBy: sort,
      });
      console.log("asset");
    } else if (e.title === "Average cost price") {
      this.sortArray("AverageCostPrice", isDown);
      this.setState({
        sortBy: sort,
      });
    } else if (e.title === "Current price") {
      this.sortArray("CurrentPrice", isDown);
      this.setState({
        sortBy: sort,
      });
    } else if (e.title === "Amount") {
      this.sortArray("Amount", isDown);
      this.setState({
        sortBy: sort,
      });
    } else if (e.title === "Cost basis") {
      this.sortArray("CostBasis", isDown);
      this.setState({
        sortBy: sort,
      });
    } else if (e.title === "Current value") {
      this.sortArray("CurrentValue", isDown);
      this.setState({
        sortBy: sort,
      });
    } else if (e.title === "Gain loss") {
      this.sortArray("GainLoss", isDown);
      this.setState({
        sortBy: sort,
      });
    }
  };
  render() {

    // Cost basis
    let tableDataCostBasis = this.props.topAccountState.Average_cost_basis;
    const CostBasisColumnData = [
      {
        labelName: (
          <div
            className="cp history-table-header-col"
            id="Asset"
            onClick={() => this.handleSort(this.state.sortBy[0])}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Asset
            </span>
            <Image
              src={sortByIcon}
              className={this.state.sortBy[0].down ? "rotateDown" : "rotateUp"}
            />
          </div>
        ),
        dataKey: "Asset",
        // coumnWidth: 118,
        coumnWidth: 0.26,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "Asset") {
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={rowData.AssetCode}
              >
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div style={{ position: "relative", width: "fit-content" }}>
                    <Image
                      src={rowData.Asset}
                      className="history-table-icon"
                      style={{ width: "2rem", height: "2rem" }}
                      onMouseEnter={() => {
                      
                      }}
                    />
                    {rowData.chain && (
                      <Image
                        src={rowData.chain.symbol}
                        style={{
                          width: "1rem",
                          height: "1rem",
                          border: "1px solid #ffffff",
                          borderRadius: "50%",
                          position: "absolute",
                          top: "-1px",
                          right: "-3px",
                        }}
                        className="chain-img"
                      />
                    )}
                  </div>
                </div>
              </CustomOverlay>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col"
            id="Cost Basis"
            onClick={() => this.handleSort(this.state.sortBy[4])}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Cost Basis
            </span>
            <Image
              src={sortByIcon}
              className={this.state.sortBy[4].down ? "rotateDown" : "rotateUp"}
            />
          </div>
        ),
        dataKey: "CostBasis",
        // coumnWidth: 100,
        coumnWidth: 0.34,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "CostBasis") {
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={
                  rowData.CostBasis === 0
                    ? "N/A"
                    : CurrencyType(false) +
                      Number(
                        noExponents(rowData.CostBasis.toFixed(2))
                      ).toLocaleString("en-US")
                }
              >
                <span>
                  {rowData.CostBasis === 0
                    ? "N/A"
                    : CurrencyType(false) +
                      Number(
                        noExponents(rowData.CostBasis.toFixed(2))
                      ).toLocaleString("en-US")}
                </span>
              </CustomOverlay>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col"
            id="Current Value"
            onClick={() => this.handleSort(this.state.sortBy[5])}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Current Value
            </span>
            <Image
              src={sortByIcon}
              className={this.state.sortBy[5].down ? "rotateDown" : "rotateUp"}
            />
          </div>
        ),
        dataKey: "CurrentValue",
        // coumnWidth: 140,
        coumnWidth: 0.37,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "CurrentValue") {
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={
                  CurrencyType(false) +
                  Number(
                    noExponents(rowData.CurrentValue.toFixed(2))
                  ).toLocaleString("en-US")
                }
              >
                <span>
                  {CurrencyType(false) +
                    Number(
                      noExponents(rowData.CurrentValue.toFixed(2))
                    ).toLocaleString("en-US")}
                </span>
              </CustomOverlay>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col"
            id="Gain loss"
            onClick={() => this.handleSort(this.state.sortBy[6])}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              % Gain / Loss
            </span>
            <Image
              src={sortByIcon}
              className={this.state.sortBy[6].down ? "rotateDown" : "rotateUp"}
            />
          </div>
        ),
        dataKey: "GainLoss",
        // coumnWidth: 128,
        coumnWidth: 0.37,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "GainLoss") {
            return (
              <div
                className={`gainLoss ${rowData.GainLoss < 0 ? "loss" : "gain"}`}
              >
                <Image src={rowData.GainLoss < 0 ? LossIcon : GainIcon} />
                <div className="inter-display-medium f-s-13 lh-16 grey-313">
                  {rowData.GainLoss.toFixed(2) + "%"}
                </div>
              </div>
            );
          }
        },
      },
    ];
    return (
      <div>
        {this.state.loader ? (
          <Loading />
        ) : (
          <div className="portfolio-page-section">
            <div
              className="portfolio-container page"
              style={{ overflow: "visible" }}
            >
              <div className="portfolio-section">
                {/* welcome card */}
                <WelcomeCard
                  showNetworth={true}
                  // yesterday balance
                  yesterdayBalance={this.props.topAccountState.yesterdayBalance}
                  // total network and percentage calculate
                  assetTotal={
                    this.props.topAccountState &&
                    this.props.topAccountState.walletTotal
                      ? this.props.topAccountState.walletTotal +
                        this.props.defiState.totalYield -
                        this.props.defiState.totalDebt
                      : 0 +
                        this.props.defiState.totalYield -
                        this.props.defiState.totalDebt
                  }
                  // history
                  history={this.props.history}
                  // net worth total
                  isLoading={this.state.isLoadingNet}
                  isPreviewing={true}
                />
              </div>

              <div
                className="portfolio-section"
                style={{
                  minWidth: "85rem",
                  marginTop: "9rem",
                }}
              >
                <TopPiechart
                  setLoader={this.setLoader}
                  chainLoader={this.state.chainLoader}
                  totalChainDetechted={this.state.totalChainDetechted}
                  userWalletData={
                    this.props.topAccountState &&
                    this.props.topAccountState.chainWallet &&
                    Object.keys(this.props.topAccountState.chainWallet).length >
                      0
                      ? Object.values(this.props.topAccountState.chainWallet)
                      : null
                  }
                  chainPortfolio={
                    this.props.topAccountState &&
                    this.props.topAccountState.chainPortfolio &&
                    Object.keys(this.props.topAccountState.chainPortfolio)
                      .length > 0
                      ? Object.values(this.props.topAccountState.chainPortfolio)
                      : null
                  }
                  allCoinList={
                    this.props.OnboardingState &&
                    this.props.OnboardingState.coinsList &&
                    Object.keys(this.props.OnboardingState.coinsList).length > 0
                      ? Object.values(this.props.OnboardingState.coinsList)
                      : null
                  }
                  assetTotal={
                    this.props.topAccountState &&
                    this.props.topAccountState.walletTotal
                      ? this.props.topAccountState.walletTotal
                      : 0
                  }
                  assetPrice={
                    this.props.topAccountState.assetPrice &&
                    Object.keys(this.props.topAccountState.assetPrice).length >
                      0
                      ? Object.values(this.props.topAccountState.assetPrice)
                      : null
                  }
                  isLoading={this.state.isLoading}
                  isUpdate={this.state.isUpdate}
                  walletTotal={this.props.topAccountState.walletTotal}
                  undetectedWallet={(e) => this.undetectedWallet(e)}
                  getProtocolTotal={this.getProtocolTotal}
                />
              </div>

              <div className="m-b-22 graph-table-section">
                <Row>
                  <Col md={6}>
                    <div
                      className="m-r-16 section-table"
                      // style={{ paddingBottom: "1.15rem" }}
                    >
                      <LineChartSlider
                        assetValueData={
                          this.props.topAccountState.assetValueDay &&
                          this.props.topAccountState.assetValueDay
                        }
                        externalEvents={
                          this.props.topAccountState.externalEvents &&
                          this.props.topAccountState.externalEvents
                        }
                        coinLists={this.props.OnboardingState.coinsLists}
                        isScrollVisible={false}
                        handleGroupBy={(value) => this.handleGroupBy(value)}
                        graphLoading={this.state.graphLoading}
                        // graphLoading={true}
                        isUpdate={this.state.isUpdate}
                        handleClick={() => {
                          if (this.state.lochToken) {
                            this.props.history.push(
                              "/intelligence/asset-value"
                            );
                          }
                        }}
                        hideTimeFilter={true}
                        hideChainFilter={true}
                        dataLoaded={
                          this.props.topAccountState.assetValueDataLoaded
                        }
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="profit-chart">
                      <BarGraphSection
                        headerTitle="Net Flows"
                        headerSubTitle="Understand your portfolio's profitability"
                        isArrow={true}
                        handleClick={() => {
                          if (this.state.lochToken) {
                            ProfitLossEV({
                              session_id: getCurrentUser().id,
                              email_address: getCurrentUser().email,
                            });
                            this.props.history.push("/intelligence#netflow");
                          }
                        }}
                        isScrollVisible={false}
                        data={
                          this.props.topAccountState.graphValue &&
                          this.props.topAccountState.graphValue[0]
                        }
                        options={
                          this.props.topAccountState.graphValue &&
                          this.props.topAccountState.graphValue[1]
                        }
                        coinsList={this.props.OnboardingState.coinsList}
                        marginBottom="m-b-32"
                        showFooter={false}
                        showBadges={false}
                        showPercentage={
                          this.props.topAccountState.graphValue &&
                          this.props.topAccountState.graphValue[2]
                        }
                        isLoading={this.state.netFlowLoading}
                        className={"portfolio-profit-and-loss"}
                        isMinichart={true}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
              <div className="m-b-22 graph-table-section">
                <Row>
                  <Col md={6}>
                    <div className="m-r-16 profit-chart">
                      <div
                        className={`bar-graph-section m-b-32`}
                        style={{ paddingBottom: "0rem", position: "relative" }}
                      >
                        <GraphHeader
                          title={"Insights"}
                          subtitle={"Valuable insights based on your assets"}
                          isArrow={true}
                          handleClick={() => {
                            // console.log("wallet", this.state.userWalletList);
                            if (this.state.lochToken) {
                              HomeInsightsExpand({
                                session_id: getCurrentUser().id,
                                email_address: getCurrentUser().email,
                              });
                              this.props.history.push("/intelligence/insights");
                            }
                          }}
                        />
                        <div className="insights-wrapper">
                          {/* <h2 className="inter-display-medium f-s-25 lh-30 black-191">This week</h2> */}
                          {this.state.isLoadingInsight ? (
                            <div
                              style={{
                                height: "30rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Loading />
                            </div>
                          ) : (
                            <>
                              <div className="insight-slider">
                                {this.props.topAccountState
                                  .updatedInsightList &&
                                  this.props.topAccountState.updatedInsightList
                                    .length > 0 && (
                                    <Slider {...this.state.settings}>
                                      {this.props.topAccountState.updatedInsightList
                                        ?.slice(0, 3)
                                        .map((insight, key) => {
                                          // console.log("insignt", insight);
                                          return (
                                            <div>
                                              <div className="steps">
                                                <div className="top-section">
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
                                                  <div className="insight-title">
                                                    <h5 className="inter-display-medium f-s-16 lh-19">
                                                      {InsightType.getSmallText(
                                                        insight.insight_type
                                                      )}
                                                    </h5>
                                                    {insight?.sub_type ? (
                                                      <h6
                                                        className="inter-display-bold f-s-10 lh-12"
                                                        style={{
                                                          color: "#ffffff",
                                                          background: "#19191A",
                                                          borderRadius:
                                                            "0.8rem",
                                                          padding:
                                                            "0.4rem 0.8rem",
                                                          width: "fit-content",
                                                          textTransform:
                                                            "uppercase",
                                                          marginTop: "0.4rem",
                                                        }}
                                                      >
                                                        {InsightType.getRiskType(
                                                          insight.sub_type
                                                        )}
                                                      </h6>
                                                    ) : (
                                                      <h6 className="inter-display-semi-bold f-s-10 lh-12 m-t-04">
                                                        INSIGHT
                                                      </h6>
                                                    )}
                                                  </div>
                                                </div>

                                                <div className="content-section">
                                                  <p
                                                    className="inter-display-medium f-s-13 lh-16 grey-969"
                                                    dangerouslySetInnerHTML={{
                                                      __html: insight.sub_title,
                                                    }}
                                                  ></p>
                                                  <h4
                                                    className="inter-display-medium f-s-16 lh-19 grey-313 m-t-12"
                                                    dangerouslySetInnerHTML={{
                                                      __html: insight.title,
                                                    }}
                                                  ></h4>
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        })}
                                    </Slider>
                                  )}

                                {/* <div className="bottom-msg">
                                  <div className="row-insight op">
                                    <Image src={LightBulb} />
                                    <h5 className="inter-display-medium f-s-13 lh-15 m-l-12">
                                      Add all your wallets and <br />
                                      exchanges to gain more insights
                                    </h5>
                                  </div>
                                  <div
                                    className="row-insight-arrow cp"
                                    onClick={this.simulateButtonClick}
                                  >
                                    <h6 className="inter-display-medium f-s-13 lh-15 m-r-5">
                                      Add more
                                    </h6>
                                    <Image src={ArrowRight} />
                                  </div>
                                </div> */}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div
                      className="section-table"
                      style={{
                        paddingBottom: "1.6rem",
                        height: "51rem",
                        minHeight: "51rem",
                        marginBottom: 0,
                      }}
                    >
                      <TransactionTable
                        title="Average cost basis"
                        handleClick={() => {
                          if (this.state.lochToken) {
                            this.props.history.push("/intelligence/costs");
                          }
                        }}
                        subTitle="Understand your average entry price"
                        tableData={tableDataCostBasis.slice(0, 6)}
                        columnList={CostBasisColumnData}
                        headerHeight={60}
                        isArrow={true}
                        isLoading={this.state.AvgCostLoading}
                      />
                    </div>
                  </Col>
                </Row>
              </div>

              {/* footer  */}
              <Footer />
            </div>
          </div>
        )}

        {this.state.upgradeModal && (
          <UpgradeModal
            show={this.state.upgradeModal}
            onHide={this.upgradeModal}
            history={this.props.history}
            isShare={localStorage.getItem("share_id")}
            isStatic={this.state.isStatic}
            triggerId={this.state.triggerId}
            pname="portfolio"
          />
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

  // top account
  topAccountState: state.TopAccountState,
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
  getExchangeBalances,
  getYesterdaysBalanceApi,
  getExternalEventsApi,
  getAllInsightsApi,
  updateWalletListFlag,
  setPageFlagDefault,

  // avg cost
  getAvgCostBasis,
  // average cost
  ResetAverageCostBasis,
  updateAverageCostBasis,
};
TopPortfolio.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(TopPortfolio);
