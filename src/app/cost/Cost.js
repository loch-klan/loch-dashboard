import React, { Component } from "react";
import BarGraphSection from "../common/BarGraphSection";
import PageHeader from "../common/PageHeader";
import Sidebar from "../common/Sidebar";
import { info, years5, ethereum } from "./dummyData.js";
import { connect } from "react-redux";
import { getAllCoins } from "../onboarding/Api.js";
import Ethereum from "../../assets/images/icons/ether-coin.svg";
import GainIcon from "../../assets/images/icons/GainIcon.svg";
import LossIcon from "../../assets/images/icons/LossIcon.svg";
import { Image } from "react-bootstrap";
import CoinChip from "../wallet/CoinChip";
import TransactionTable from "../intelligence/TransactionTable";
import sortByIcon from "../../assets/images/icons/triangle-down.svg";
import {
  TimeSpentCosts,
  FeesTimePeriodFilter,
  CounterpartyFeesTimeFilter,
  CostsPage,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import ExportIconWhite from "../../assets/images/apiModalFrame.svg";
import {getCounterGraphData, getGraphData} from "./getGraphData";
import { getAllFeeApi, getAllCounterFeeApi, updateCounterParty, updateFeeGraph, getAvgCostBasis, updateAverageCostBasis, ResetAverageCostBasis } from "./Api";
import Loading from "../common/Loading";
import moment from "moment/moment";
import graphImage from '../../assets/images/gas-fees-graph.png'
import FeedbackForm from "../common/FeedbackForm";
import LinkIcon from '../../assets/images/icons/link.svg';
import ConnectModal from "../common/ConnectModal";import FixAddModal from "../common/FixAddModal";

// add wallet
import AddWalletModalIcon from "../../assets/images/icons/wallet-icon.svg";
import { GetAllPlan, getUser, setPageFlagDefault } from "../common/Api";
import { CurrencyType, noExponents } from "../../utils/ReusableFunctions";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";


class Cost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      durationgraphdata: {
        data: info[0],
        options: info[1],
        options2: info[2],
      },
      startTime: "",
      // gas fees
      // GraphfeeData: [],
      // graphfeeValue: null,

      counterGraphLoading: true,
      gasFeesGraphLoading: true,

      AvgCostLoading: true,

      // counter party
      // counterPartyData: [],
      // counterPartyValue: null,
      currentPage: "Cost",
      connectModal: false,
      counterGraphDigit: 3,
      GraphDigit: 3,

      // add new wallet
      userWalletList: localStorage.getItem("addWallet")
        ? JSON.parse(localStorage.getItem("addWallet"))
        : [],
      addModal: false,
      isUpdate: 0,
      apiResponse: false,

      // sort
      sortBy: [
        { title: "Asset", down: true },
        { title: "Average cost price", down: true },
        { title: "Current price", down: true },
        { title: "Amount", down: true },
        { title: "Cost basis", down: true },
        { title: "Current value", down: true },
        { title: "Gain loss", down: true },
      ],
    };
  }

  componentDidMount() {
    CostsPage({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    if (this.props.location.hash !== "") {
      setTimeout(() => {
        const id = this.props.location.hash.replace("#", "");
        // console.log('id',id);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView();
        }
      }, 0);
    } else {
      window.scrollTo(0, 0);
    }
    this.state.startTime = new Date() * 1;
    // console.log("page Enter", this.state.startTime / 1000);

    this.props.getAllCoins();
    this.getBlockchainFee(0);
    this.getCounterPartyFee(0);
    this.props.getAvgCostBasis(this);
    GetAllPlan();
    getUser();
  }

  componentDidUpdate(prevProps, prevState) {
    // add wallet

    if (prevState.apiResponse != this.state.apiResponse) {
      // console.log("update");

      this.props.getAllCoins();
      this.getBlockchainFee(0);
      this.getCounterPartyFee(0);
      this.props.getAvgCostBasis(this);
      this.setState({
        apiResponse: false,
      });
    }
  }

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
      counterGraphLoading: true,
      gasFeesGraphLoading: true,
    });
  };
  CheckApiResponse = (value) => {
    this.setState({
      apiResponse: value,
    });
    // console.log("api respinse", value);
    this.props.setPageFlagDefault();
  };

  getBlockchainFee(option) {
    const today = moment().valueOf();
    let handleSelected = "";
    // console.log("headle click");
    if (option == 0) {
      this.props.getAllFeeApi(this, false, false);
      // console.log(option, "All");
      handleSelected = "All";
    } else if (option == 1) {
      const fiveyear = moment().subtract(5, "years").valueOf();

      this.props.getAllFeeApi(this, fiveyear, today);
      // console.log(fiveyear, today, "5 years");
      handleSelected = "5 Years";
    } else if (option == 2) {
      const year = moment().subtract(1, "years").valueOf();
      this.props.getAllFeeApi(this, year, today);
      // console.log(year, today, "1 year");
      handleSelected = "1 Year";
    } else if (option == 3) {
      const sixmonth = moment().subtract(6, "months").valueOf();

      this.props.getAllFeeApi(this, sixmonth, today);
      // console.log(sixmonth, today, "6 months");
      handleSelected = "6 Months";
    } else if (option == 4) {
      const month = moment().subtract(1, "month").valueOf();
      this.props.getAllFeeApi(this, month, today);
      // console.log(month, today, "1 month");
      handleSelected = "1 Month";
    } else if (option == 5) {
      const week = moment().subtract(1, "week").valueOf();
      this.props.getAllFeeApi(this, week, today);
      // console.log(week, today, "week");
      handleSelected = "Week";
    }
    // console.log("handle select", handleSelected);
    FeesTimePeriodFilter({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      time_period_selected: handleSelected,
    });
  }

  getCounterPartyFee(option) {
    const today = moment().unix();
    let handleSelected = "";
    // console.log("headle click");
    if (option == 0) {
      this.props.getAllCounterFeeApi(this, false, false);
      // console.log(option, "All");
      handleSelected = "All";
    } else if (option == 1) {
      const fiveyear = moment().subtract(5, "years").unix();

      this.props.getAllCounterFeeApi(this, fiveyear, today);
      // console.log(fiveyear, today, "5 years");
      handleSelected = "5 Years";
    } else if (option == 2) {
      const year = moment().subtract(1, "years").unix();
      this.props.getAllCounterFeeApi(this, year, today);
      // console.log(year, today, "1 year");
      handleSelected = "1 Year";
    } else if (option == 3) {
      const sixmonth = moment().subtract(6, "months").unix();

      this.props.getAllCounterFeeApi(this, sixmonth, today);
      // console.log(sixmonth, today, "6 months");
      handleSelected = "6 Months";
    } else if (option == 4) {
      const month = moment().subtract(1, "month").unix();
      this.props.getAllCounterFeeApi(this, month, today);
      // console.log(month, today, "1 month");
      handleSelected = "1 Month";
    } else if (option == 5) {
      const week = moment().subtract(1, "week").unix();
      this.props.getAllCounterFeeApi(this, week, today);
      // console.log(week, today, "week");
      handleSelected = "Week";
    }

    // console.log("handle select", handleSelected)
    // CounterpartyFeesTimeFilter;
    CounterpartyFeesTimeFilter({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      time_period_selected: handleSelected,
    });
  }

  componentWillUnmount() {
    let endTime = new Date() * 1;
    let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
    // console.log("page Leave", endTime / 1000);
    // console.log("Time Spent", TimeSpent);
    TimeSpentCosts({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      time_spent: TimeSpent,
    });

    // get all data on page leave
    // console.log("data");
    // this.getBlockchainFee(0);
    // this.getCounterPartyFee(0);
    this.props.ResetAverageCostBasis();
    // updateAverageCostBasis,
  }

  handleBadge = (activeBadgeList, type) => {
    const { GraphfeeData, counterPartyData } = this.props.intelligenceState;
    let graphDataMaster = [];
    let counterPartyDataMaster = [];
    if (type === 1) {
      GraphfeeData.gas_fee_overtime &&
        GraphfeeData.gas_fee_overtime?.map((tempGraphData) => {
          if (
            activeBadgeList.includes(tempGraphData?.chain?._id) ||
            activeBadgeList.length === 0
          ) {
            graphDataMaster.push(tempGraphData);
          }
        });
      let gas_fee_overtime = graphDataMaster;
      let asset_prices = GraphfeeData.asset_prices;
      let graphDataObj = { asset_prices, gas_fee_overtime };
      // this.setState({
      //   graphfeeValue: getGraphData(graphDataObj, this),
      // });
      this.props.updateFeeGraph(GraphfeeData, getGraphData(graphDataObj, this));
    } else {
      counterPartyData &&
        counterPartyData?.map((tempGraphData) => {
          if (
            activeBadgeList.includes(tempGraphData?.chain?._id) ||
            activeBadgeList.length === 0
          ) {
            counterPartyDataMaster.push(tempGraphData);
          }
        });
      // this.setState({
      //   counterPartyValue: getCounterGraphData(counterPartyDataMaster, this),
      // });
      this.props.updateCounterParty(
        counterPartyData,
        getCounterGraphData(counterPartyDataMaster, this)
      );
    }
  };
  handleConnectModal = () => {
    this.setState({ connectModal: !this.state.connectModal });
  };

  sortArray = (key, order) => {
    let array = this.props.intelligenceState?.Average_cost_basis; //all data
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
      console.log("asset")
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

  handleDust = (ishide) => {
    if (!ishide) {
       let array = this.props.intelligenceState?.Average_cost_basis?.filter(
         (e) => e.CurrentValue >= 1
       ); //all data
       this.props.updateAverageCostBasis(array);
    } else {
      this.props.ResetAverageCostBasis()
    }
   
    
  }

  render() {
    // console.log("counter", this.state.counterGraphDigit);
    // console.log("fes", this.state.GraphDigit);

    let tableData = this.props.intelligenceState.Average_cost_basis;
    // const tableData = [
    //   {
    //     Asset: Ethereum,
    //     AverageCostPrice: "$800.00",
    //     CurrentPrice: "$1,390.00",
    //     Amount: 3.97,
    //     CostBasis: 1.75,
    //     CurrentValue: "$5,514.00",
    //     GainLoss: {
    //       status: "gain",
    //       symbol: GainIcon,
    //       // "42.45%",
    //       value: "42.45%",
    //     },
    //   },
    //   {
    //     Asset: Ethereum,
    //     AverageCostPrice: "$25,000.00",
    //     CurrentPrice: "$21,080.00",
    //     Amount: 3.97,
    //     CostBasis: 2.56,
    //     CurrentValue: "$22,280.50",
    //     GainLoss: {
    //       status: "loss",
    //       symbol: LossIcon,
    //       // "-18.45%"
    //       value: "-18.45%",
    //     },
    //   },
    // ];

    const columnData = [
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
        coumnWidth: 0.2,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "Asset") {
            return (
              <CoinChip
                coin_img_src={rowData.Asset}
                coin_code={rowData.AssetCode}
              />
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col"
            id="Average Cost Price"
            onClick={() => this.handleSort(this.state.sortBy[1])}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Average Cost Price
            </span>
            <Image
              src={sortByIcon}
              className={this.state.sortBy[1].down ? "rotateDown" : "rotateUp"}
            />
          </div>
        ),
        dataKey: "AverageCostPrice",
        // coumnWidth: 153,
        coumnWidth: 0.2,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "AverageCostPrice") {
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={
                  rowData.AverageCostPrice === 0
                    ? "N/A"
                    : CurrencyType(false) + rowData.AverageCostPrice.toFixed(2)
                }
              >
                <div className="inter-display-medium f-s-13 lh-16 grey-313 cost-common">
                  {rowData.AverageCostPrice === 0
                    ? "N/A"
                    : CurrencyType(false) + rowData.AverageCostPrice.toFixed(2)}
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
            id="Current Price"
            onClick={() => this.handleSort(this.state.sortBy[2])}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Current Price
            </span>
            <Image
              src={sortByIcon}
              className={this.state.sortBy[2].down ? "rotateDown" : "rotateUp"}
            />
          </div>
        ),
        dataKey: "CurrentPrice",
        // coumnWidth: 128,
        coumnWidth: 0.2,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "CurrentPrice") {
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={CurrencyType(false) + rowData.CurrentPrice.toFixed(2)}
              >
                <div className="inter-display-medium f-s-13 lh-16 grey-313 cost-common">
                  {CurrencyType(false) + rowData.CurrentPrice.toFixed(2)}
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
            id="Amount"
            onClick={() => this.handleSort(this.state.sortBy[3])}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Amount
            </span>
            <Image
              src={sortByIcon}
              className={this.state.sortBy[3].down ? "rotateDown" : "rotateUp"}
            />
          </div>
        ),
        dataKey: "Amount",
        // coumnWidth: 108,
        coumnWidth: 0.2,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "Amount") {
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={Number(noExponents(rowData.Amount)).toLocaleString(
                  "en-US"
                )}
              >
                <span>
                  {Number(noExponents(rowData.Amount)).toLocaleString("en-US")}
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
        coumnWidth: 0.2,
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
                    : CurrencyType(false) + rowData.CostBasis.toFixed(2)
                }
              >
                <span>
                  {rowData.CostBasis === 0
                    ? "N/A"
                    : CurrencyType(false) + rowData.CostBasis.toFixed(2)}
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
        coumnWidth: 0.2,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "CurrentValue") {
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={CurrencyType(false) + rowData.CurrentValue.toFixed(2)}
              >
                <span>
                  {CurrencyType(false) + rowData.CurrentValue.toFixed(2)}
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
        coumnWidth: 0.25,
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
      <div className="cost-page-section">
        {this.state.connectModal ? (
          <ConnectModal
            show={this.state.connectModal}
            onHide={this.handleConnectModal}
            history={this.props.history}
            headerTitle={"Connect exchanges"}
            modalType={"connectModal"}
            iconImage={LinkIcon}
          />
        ) : (
          ""
        )}
        <div className="m-t-50 cost-section page">
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
              from="cost"
            />
          )}
          <PageHeader
            title="Costs"
            subTitle="Bring light to your hidden costs"
            btnText={"Add wallet"}
            handleBtn={this.handleAddModal}
            showpath={true}
            currentPage={"costs"}
          />
          <div className="m-b-40 cost-table-section">
            <div style={{ position: "relative" }}>
              {/* <div className="coming-soon-div">
                <Image src={ExportIconWhite} className="coming-soon-img" />
                <p className="inter-display-regular f-s-13 lh-16 black-191">
                  This feature is coming soon.
                </p>
              </div> */}
              <TransactionTable
                title="Average Cost Basis"
                subTitle="Understand your average entry price"
                tableData={tableData}
                columnList={columnData}
                headerHeight={64}
                comingSoon={false}
                isArrow={false}
                isLoading={this.state.AvgCostLoading}
                isGainLoss={true}
                ishideDust={true}
                totalPercentage={this.props.intelligenceState.totalPercentage}
                handleDust={this.handleDust}
                // handleExchange={this.handleConnectModal}
              />
            </div>
          </div>
          <div
            style={{
              position: "relative",
              minHeight: "68rem",
              minWidth: "85rem",
            }}
          >
            <BarGraphSection
              headerTitle="Blockchain Fees over Time"
              headerSubTitle="Understand your gas costs"
              data={
                this.props.intelligenceState.graphfeeValue &&
                this.props.intelligenceState.graphfeeValue[0]
              }
              options={
                this.props.intelligenceState.graphfeeValue &&
                this.props.intelligenceState.graphfeeValue[1]
              }
              options2={
                this.props.intelligenceState.graphfeeValue &&
                this.props.intelligenceState.graphfeeValue[2]
              }
              digit={this.state.GraphDigit}
              coinsList={this.props.OnboardingState.coinsList}
              timeFunction={(e) => {
                this.getBlockchainFee(e);
              }}
              marginBottom="m-b-32"
              showFooter={true}
              showBadges={true}
              isScrollVisible={false}
              isScroll={true}
              isLoading={this.state.gasFeesGraphLoading}
              // isLoading={true}
              handleBadge={(activeBadgeList) =>
                this.handleBadge(activeBadgeList, 1)
              }

              // height={420}
              // width={824}
              // comingSoon={false}
            />
          </div>
          <div
            id="cp"
            style={{
              position: "relative",
              minHeight: "68rem",
              minWidth: "85rem",
            }}
          >
            {/* <div className="coming-soon-div">
              <Image src={ExportIconWhite} className="coming-soon-img" />
              <p className="inter-display-regular f-s-13 lh-16 black-191">
                This feature is coming soon.
              </p>
            </div> */}

            <BarGraphSection
              headerTitle="Counterparty Volume Over Time"
              headerSubTitle="Understand where you’ve exchanged the most value"
              data={
                this.props.intelligenceState.counterPartyValue &&
                this.props.intelligenceState.counterPartyValue[0]
              }
              options={
                this.props.intelligenceState.counterPartyValue &&
                this.props.intelligenceState.counterPartyValue[1]
              }
              options2={
                this.props.intelligenceState.counterPartyValue &&
                this.props.intelligenceState.counterPartyValue[2]
              }
              digit={this.state.counterGraphDigit}
              coinsList={this.props.OnboardingState.coinsList}
              timeFunction={(e) => this.getCounterPartyFee(e)}
              marginBottom="m-b-32"
              showFooter={true}
              showBadges={true}
              isScrollVisible={false}
              isScroll={true}
              isLoading={this.state.counterGraphLoading}
              // isLoading={true}
              handleBadge={(activeBadgeList) =>
                this.handleBadge(activeBadgeList, 2)
              }
              // height={"400px"}
              // width={"824px"}
              // comingSoon={true}
            />
          </div>

          {/* <FeedbackForm page={"Cost Page"} /> */}
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  OnboardingState: state.OnboardingState,
  intelligenceState: state.IntelligenceState,
});
const mapDispatchToProps = {
  getAllCoins,
  getAllFeeApi,
  getAllCounterFeeApi,

  // avg cost
  getAvgCostBasis,

  // update counter party
  updateCounterParty,
  // update fee
  updateFeeGraph,
  setPageFlagDefault,

  // average cost
  ResetAverageCostBasis,
  updateAverageCostBasis,
};

export default connect(mapStateToProps, mapDispatchToProps)(Cost);
