import React, { Component } from "react";
import BarGraphSection from "../common/BarGraphSection";
import PageHeader from "../common/PageHeader";
import { info } from "../cost/dummyData.js";
import { connect } from "react-redux";
import { getAllCoins } from "../onboarding/Api.js";
import GainIcon from "../../assets/images/icons/GainIcon.svg";
import LossIcon from "../../assets/images/icons/LossIcon.svg";
import { Image } from "react-bootstrap";
import CoinChip from "../wallet/CoinChip";
import TransactionTable from "../intelligence/TransactionTable";
import sortByIcon from "../../assets/images/icons/triangle-down.svg";
import {
  TopCostsShare,
  PageviewTopCosts,
  TimeSpentTopCosts,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import { getCounterGraphData, getGraphData } from "../cost/getGraphData";
import {
  getAllFeeApi,
  getAllCounterFeeApi,
  updateCounterParty,
  updateFeeGraph,
  getAvgCostBasis,
  updateAverageCostBasis,
  ResetAverageCostBasis,
} from "../cost/Api";
import moment from "moment/moment";
import LinkIcon from "../../assets/images/icons/link.svg";
import ConnectModal from "../common/ConnectModal";
import FixAddModal from "../common/FixAddModal";

// add wallet
import AddWalletModalIcon from "../../assets/images/icons/wallet-icon.svg";
import { GetAllPlan, getUser, setPageFlagDefault } from "../common/Api";
import {
  CurrencyType,
  noExponents,
  numToCurrency,
} from "../../utils/ReusableFunctions";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import { BASE_URL_S3 } from "../../utils/Constant";
import { toast } from "react-toastify";
import WelcomeCard from "../Portfolio/WelcomeCard";
import { Buffer } from "buffer";

class TopCost extends Component {
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
      userWalletList: [],
      // localStorage.getItem("addWallet")
      //   ? JSON.parse(localStorage.getItem("addWallet"))
      //   :
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
        { title: "Current value", down: false },
        { title: "Gain amount", down: true },
        { title: "Gain percentage", down: true },
      ],

      // this is used in api to check api call fromt op acount page or not
      isTopAccountPage: true,
    };
  }
  startPageView = () => {
    this.setState({ startTime: new Date() * 1 });
    PageviewTopCosts({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    // Inactivity Check
    window.checkTopCostTimer = setInterval(() => {
      this.checkForInactivity();
    }, 900000);
  };
  componentDidMount() {
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
    this.updateTimer(true);
    this.props.getAllCoins();
    this.getBlockchainFee(0, true);
    this.getCounterPartyFee(0, true);
    this.props.getAvgCostBasis(this);
    this.props.GetAllPlan();
    this.props.getUser();
  }
  updateTimer = (first) => {
    const tempExistingExpiryTime = localStorage.getItem(
      "topCostPageExpiryTime"
    );
    if (!tempExistingExpiryTime && !first) {
      this.startPageView();
    }
    const tempExpiryTime = Date.now() + 1800000;
    localStorage.setItem("topCostPageExpiryTime", tempExpiryTime);
  };
  endPageView = () => {
    clearInterval(window.checkTopCostTimer);
    localStorage.removeItem("topCostPageExpiryTime");
    if (this.state.startTime) {
      let endTime = new Date() * 1;
      let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
      TimeSpentTopCosts({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        time_spent: TimeSpent,
      });
    }
  };
  checkForInactivity = () => {
    const tempExpiryTime = localStorage.getItem("topCostPageExpiryTime");
    if (tempExpiryTime && tempExpiryTime < Date.now()) {
      this.endPageView();
    }
  };
  componentWillUnmount() {
    const tempExpiryTime = localStorage.getItem("topCostPageExpiryTime");
    if (tempExpiryTime) {
      this.endPageView();
    }
    this.props.ResetAverageCostBasis(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.apiResponse != this.state.apiResponse) {
      this.props.getAllCoins();
      this.getBlockchainFee(0, true);
      this.getCounterPartyFee(0, true);
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
    this.props.setPageFlagDefault();
  };

  getBlockchainFee(option, first) {
    const today = moment().valueOf();
    let handleSelected = "";
    if (option == 0) {
      this.props.getAllFeeApi(this, false, false);
      handleSelected = "All";
    } else if (option == 1) {
      const fiveyear = moment().subtract(5, "years").valueOf();

      this.props.getAllFeeApi(this, fiveyear, today);
      handleSelected = "5 Years";
    } else if (option == 2) {
      const year = moment().subtract(1, "years").valueOf();
      this.props.getAllFeeApi(this, year, today);
      handleSelected = "1 Year";
    } else if (option == 3) {
      const sixmonth = moment().subtract(6, "months").valueOf();

      this.props.getAllFeeApi(this, sixmonth, today);
      handleSelected = "6 Months";
    } else if (option == 4) {
      const month = moment().subtract(1, "month").valueOf();
      this.props.getAllFeeApi(this, month, today);
      handleSelected = "1 Month";
    } else if (option == 5) {
      const week = moment().subtract(1, "week").valueOf();
      this.props.getAllFeeApi(this, week, today);
      handleSelected = "Week";
    }
    // FeesTimePeriodFilter({
    //   session_id: getCurrentUser().id,
    //   email_address: getCurrentUser().email,
    //   time_period_selected: handleSelected,
    // });
  }

  getCounterPartyFee(option, first) {
    const today = moment().unix();
    let handleSelected = "";
    if (option == 0) {
      this.props.getAllCounterFeeApi(this, false, false);
      handleSelected = "All";
    } else if (option == 1) {
      const fiveyear = moment().subtract(5, "years").unix();

      this.props.getAllCounterFeeApi(this, fiveyear, today);
      handleSelected = "5 Years";
    } else if (option == 2) {
      const year = moment().subtract(1, "years").unix();
      this.props.getAllCounterFeeApi(this, year, today);
      handleSelected = "1 Year";
    } else if (option == 3) {
      const sixmonth = moment().subtract(6, "months").unix();

      this.props.getAllCounterFeeApi(this, sixmonth, today);
      handleSelected = "6 Months";
    } else if (option == 4) {
      const month = moment().subtract(1, "month").unix();
      this.props.getAllCounterFeeApi(this, month, today);
      handleSelected = "1 Month";
    } else if (option == 5) {
      const week = moment().subtract(1, "week").unix();
      this.props.getAllCounterFeeApi(this, week, today);
      handleSelected = "Week";
    }

    // CounterpartyFeesTimeFilter;
    // CounterpartyFeesTimeFilter({
    //   session_id: getCurrentUser().id,
    //   email_address: getCurrentUser().email,
    //   time_period_selected: handleSelected,
    // });
  }

  handleBadge = (activeBadgeList, type) => {
    const { GraphfeeData, counterPartyData } = this.props.topAccountState;
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
      this.props.updateFeeGraph(
        GraphfeeData,
        getGraphData(graphDataObj, this),
        this
      );
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
        getCounterGraphData(counterPartyDataMaster, this),
        this
      );
    }
  };
  handleConnectModal = () => {
    this.setState({ connectModal: !this.state.connectModal });
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
    this.props.updateAverageCostBasis(sortedList, this);
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
    } else if (e.title === "Gain amount") {
      this.sortArray("GainAmount", isDown);
      this.setState({
        sortBy: sort,
      });

      this.updateTimer();
    } else if (e.title === "Gain percentage") {
      this.sortArray("GainLoss", isDown);
      this.setState({
        sortBy: sort,
      });

      this.updateTimer();
    }
  };

  handleDust = (ishide) => {
    if (!ishide) {
      let array = this.props.topAccountState?.Average_cost_basis?.filter(
        (e) => e.CurrentValue >= 1
      ); //all data
      this.props.updateAverageCostBasis(array, this);
    } else {
      this.props.ResetAverageCostBasis(this);
    }
  };

  handleShare = () => {
    const previewAddress = localStorage.getItem("previewAddress")
      ? JSON.parse(localStorage.getItem("previewAddress"))
      : "";
    const encodedAddress = Buffer.from(previewAddress?.address).toString(
      "base64"
    );
    let shareLink =
      BASE_URL_S3 + `top-account/${encodedAddress}?redirect=intelligence/costs`;
    navigator.clipboard.writeText(shareLink);
    toast.success("Link copied");
    TopCostsShare({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    this.updateTimer();
  };

  render() {
    let tableData = this.props.topAccountState.Average_cost_basis;
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
        labelName: "",
        dataKey: "Numbering",
        coumnWidth: 0.05,
        isCell: true,
        cell: (rowData, dataKey, index) => {
          if (dataKey === "Numbering" && index > -1) {
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={Number(noExponents(index, 1)).toLocaleString("en-US")}
              >
                <span className="inter-display-medium f-s-13">
                  {Number(noExponents(index + 1)).toLocaleString("en-US")}
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
            id="Asset"
            onClick={() => this.handleSort(this.state.sortBy[0])}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Asset
            </span>
            <Image
              src={sortByIcon}
              className={!this.state.sortBy[0].down ? "rotateDown" : "rotateUp"}
            />
          </div>
        ),
        dataKey: "Asset",
        // coumnWidth: 118,
        coumnWidth: 0.125,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "Asset") {
            return (
              <CoinChip
                coin_img_src={rowData.Asset}
                coin_code={rowData.AssetCode}
                chain={rowData?.chain}
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
              Avg cost price
            </span>
            <Image
              src={sortByIcon}
              className={!this.state.sortBy[1].down ? "rotateDown" : "rotateUp"}
            />
          </div>
        ),
        dataKey: "AverageCostPrice",
        // coumnWidth: 153,
        coumnWidth: 0.125,
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
                    : CurrencyType(false) +
                      Number(
                        noExponents(rowData.AverageCostPrice.toFixed(2))
                      ).toLocaleString("en-US")
                }
              >
                <div className="cost-common-container">
                  <div className="cost-common">
                    <span className="inter-display-medium f-s-13 lh-16 grey-313">
                      {rowData.AverageCostPrice === 0
                        ? "N/A"
                        : CurrencyType(false) +
                          numToCurrency(
                            rowData.AverageCostPrice.toFixed(2)
                          ).toLocaleString("en-US")}
                    </span>
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
            id="Current Price"
            onClick={() => this.handleSort(this.state.sortBy[2])}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Current price
            </span>
            <Image
              src={sortByIcon}
              className={!this.state.sortBy[2].down ? "rotateDown" : "rotateUp"}
            />
          </div>
        ),
        dataKey: "CurrentPrice",
        // coumnWidth: 128,
        coumnWidth: 0.125,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "CurrentPrice") {
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={
                  CurrencyType(false) +
                  Number(
                    noExponents(rowData.CurrentPrice.toFixed(2))
                  ).toLocaleString("en-US")
                }
              >
                <div className="cost-common-container">
                  <div className="cost-common">
                    <span className="inter-display-medium f-s-13 lh-16 grey-313">
                      {CurrencyType(false) +
                        numToCurrency(
                          rowData.CurrentPrice.toFixed(2)
                        ).toLocaleString("en-US")}
                    </span>
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
            id="Amount"
            onClick={() => this.handleSort(this.state.sortBy[3])}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Amount
            </span>
            <Image
              src={sortByIcon}
              className={!this.state.sortBy[3].down ? "rotateDown" : "rotateUp"}
            />
          </div>
        ),
        dataKey: "Amount",
        // coumnWidth: 108,
        coumnWidth: 0.125,
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
                  {numToCurrency(rowData.Amount).toLocaleString("en-US")}
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
              Cost basis
            </span>
            <Image
              src={sortByIcon}
              className={!this.state.sortBy[4].down ? "rotateDown" : "rotateUp"}
            />
          </div>
        ),
        dataKey: "CostBasis",
        // coumnWidth: 100,
        coumnWidth: 0.13,
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
                      numToCurrency(
                        rowData.CostBasis.toFixed(2)
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
              Current value
            </span>
            <Image
              src={sortByIcon}
              className={!this.state.sortBy[5].down ? "rotateDown" : "rotateUp"}
            />
          </div>
        ),
        dataKey: "CurrentValue",
        // coumnWidth: 140,
        coumnWidth: 0.13,
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
                    numToCurrency(
                      rowData.CurrentValue.toFixed(2)
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
            id="Gainamount"
            onClick={() => this.handleSort(this.state.sortBy[6])}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Unrealized gain
            </span>
            <Image
              src={sortByIcon}
              className={!this.state.sortBy[6].down ? "rotateDown" : "rotateUp"}
            />
          </div>
        ),
        dataKey: "GainAmount",
        // coumnWidth: 128,
        coumnWidth: 0.13,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "GainAmount") {
            const tempDataHolder = numToCurrency(rowData.GainAmount);
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={
                  rowData.GainAmount
                    ? CurrencyType(false) +
                      Math.abs(
                        Number(noExponents(rowData.GainAmount.toFixed(2)))
                      ).toLocaleString("en-US")
                    : CurrencyType(false) + "0.00"
                }
                colorCode="#000"
              >
                <div className="gainLossContainer">
                  <div
                    className={`gainLoss ${
                      rowData.GainAmount < 0 ? "loss" : "gain"
                    }`}
                  >
                    {rowData.GainAmount !== 0 ? (
                      <Image
                        className="mr-2"
                        src={rowData.GainAmount < 0 ? LossIcon : GainIcon}
                      />
                    ) : null}
                    <span className="inter-display-medium f-s-13 lh-16 grey-313">
                      {tempDataHolder
                        ? CurrencyType(false) +
                          tempDataHolder.toLocaleString("en-US")
                        : "0.00"}
                    </span>
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
            id="Gain loss"
            onClick={() => this.handleSort(this.state.sortBy[7])}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Return
            </span>
            <Image
              src={sortByIcon}
              className={!this.state.sortBy[7].down ? "rotateDown" : "rotateUp"}
            />
          </div>
        ),
        dataKey: "GainLoss",
        // coumnWidth: 128,
        coumnWidth: 0.13,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "GainLoss") {
            const tempDataHolder = Number(
              noExponents(rowData.GainLoss.toFixed(2))
            );
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={
                  tempDataHolder
                    ? Math.abs(tempDataHolder).toLocaleString("en-US") + "%"
                    : "0%"
                }
                colorCode="#000"
              >
                <div className="gainLossContainer">
                  <div
                    className={`gainLoss ${
                      rowData.GainLoss < 0 ? "loss" : "gain"
                    }`}
                  >
                    {rowData.GainLoss !== 0 ? (
                      <Image
                        className="mr-2"
                        src={rowData.GainLoss < 0 ? LossIcon : GainIcon}
                      />
                    ) : null}
                    <span className="inter-display-medium f-s-13 lh-16 grey-313">
                      {tempDataHolder
                        ? Math.abs(tempDataHolder).toLocaleString("en-US") + "%"
                        : "0.00%"}
                    </span>
                  </div>
                </div>
              </CustomOverlay>
            );
          }
        },
      },
    ];

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
                isPreviewing={true}
              />
            </div>
          </div>
        </div>
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
          <div className="cost-section page">
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
              // btnText={"Add wallet"}
              // handleBtn={this.handleAddModal}
              showpath={true}
              currentPage={"costs"}
              ShareBtn={true}
              handleShare={this.handleShare}
              topaccount={true}
            />
            <div
              style={{ marginBottom: "2.8rem" }}
              className="cost-table-section"
            >
              <div style={{ position: "relative" }}>
                {/* <div className="coming-soon-div">
                <Image src={ExportIconWhite} className="coming-soon-img" />
                <p className="inter-display-regular f-s-13 lh-16 black-191">
                  This feature is coming soon.
                </p>
              </div> */}
                <TransactionTable
                  noSubtitleBottomPadding
                  title="Unrealized gains"
                  subTitle="Understand your unrealized gains per token"
                  tableData={tableData}
                  columnList={columnData}
                  headerHeight={64}
                  comingSoon={false}
                  isArrow={false}
                  isLoading={this.state.AvgCostLoading}
                  isGainLoss={true}
                  ishideDust={true}
                  totalPercentage={this.props.topAccountState.totalPercentage}
                  handleDust={this.handleDust}
                  // handleExchange={this.handleConnectModal}
                  isStickyHead={true}
                  className="cost-basis-table"
                  addWatermark
                />
              </div>
            </div>
            <div
              style={{
                position: "relative",
                // minHeight: "66.25rem",
                minWidth: "85rem",
              }}
            >
              <BarGraphSection
                headerTitle="Blockchain fees over time"
                headerSubTitle="Understand your gas costs"
                data={
                  this.props.topAccountState.graphfeeValue &&
                  this.props.topAccountState.graphfeeValue[0]
                }
                options={
                  this.props.topAccountState?.graphfeeValue &&
                  this.props.topAccountState.graphfeeValue[1]
                }
                options2={
                  this.props.topAccountState?.graphfeeValue &&
                  this.props.topAccountState.graphfeeValue[2]
                }
                digit={this.state.GraphDigit}
                coinsList={this.props.OnboardingState.coinsList}
                timeFunction={(e) => {
                  this.getBlockchainFee(e);
                }}
                marginBottom="marginBot2point8"
                showFooter={true}
                showBadges={true}
                isScrollVisible={false}
                isScroll={true}
                isLoading={this.state.gasFeesGraphLoading}
                // isLoading={true}
                handleBadge={(activeBadgeList) =>
                  this.handleBadge(activeBadgeList, 1)
                }
                loaderHeight={47.3}

                // height={420}
                // width={824}
                // comingSoon={false}
              />
            </div>
            <div
              id="cp"
              style={{
                position: "relative",
                // minHeight: "66.5rem",
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
                headerTitle="Counterparty volume over time"
                headerSubTitle="Understand where you’ve exchanged the most value"
                data={
                  this.props.topAccountState.counterPartyValue &&
                  this.props.topAccountState.counterPartyValue[0]
                }
                options={
                  this.props.topAccountState.counterPartyValue &&
                  this.props.topAccountState.counterPartyValue[1]
                }
                options2={
                  this.props.topAccountState.counterPartyValue &&
                  this.props.topAccountState.counterPartyValue[2]
                }
                digit={this.state.counterGraphDigit}
                coinsList={this.props.OnboardingState.coinsList}
                timeFunction={(e) => this.getCounterPartyFee(e)}
                showFooter={true}
                showBadges={true}
                isScrollVisible={false}
                isScroll={true}
                isLoading={this.state.counterGraphLoading}
                // isLoading={true}
                handleBadge={(activeBadgeList) =>
                  this.handleBadge(activeBadgeList, 2)
                }
                loaderHeight={45}
                // height={"400px"}
                // width={"824px"}
                // comingSoon={true}
              />
            </div>

            {/* <FeedbackForm page={"Cost Page"} /> */}
          </div>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  OnboardingState: state.OnboardingState,
  intelligenceState: state.IntelligenceState,

  // top account
  topAccountState: state.TopAccountState,
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
  GetAllPlan,
  getUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(TopCost);
