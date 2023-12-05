import React, { Component } from "react";
import BarGraphSection from "../common/BarGraphSection";
import PageHeader from "../common/PageHeader";
import { info } from "./dummyData.js";
import { connect } from "react-redux";
import { getAllCoins } from "../onboarding/Api.js";
import GainIcon from "../../assets/images/icons/GainIcon.svg";

import { Image } from "react-bootstrap";
import CoinChip from "../wallet/CoinChip";
import TransactionTable from "../intelligence/TransactionTable";
import { getAllWalletListApi } from "../wallet/Api";
import sortByIcon from "../../assets/images/icons/triangle-down.svg";

import {
  TimeSpentCosts,
  FeesTimePeriodFilter,
  CounterpartyFeesTimeFilter,
  CostsPage,
  CostShare,
  CostHideDust,
  CAverageCostBasisSort,
  CostSortByAsset,
  CostSortByCostPrice,
  CostSortByCurrentPrice,
  CostSortByAmount,
  SortByCurrentValue,
  SortByGainLoss,
  costFeesChainFilter,
  costVolumeChainFilter,
  CostAssetHover,
  CostAverageCostPriceHover,
  CostCurrentPriceHover,
  CostAmountHover,
  CostCostBasisHover,
  CostCurrentValueHover,
  CostGainLossHover,
  CostAvgCostBasisExport,
  CostBlockchainFeesExport,
  CostCounterpartyFeesExport,
  CostGainHover,
  SortByGainAmount,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import { getCounterGraphData, getGraphData } from "./getGraphData";
import {
  getAllFeeApi,
  getAllCounterFeeApi,
  updateCounterParty,
  updateFeeGraph,
  getAvgCostBasis,
  updateAverageCostBasis,
  ResetAverageCostBasis,
} from "./Api";
import moment from "moment/moment";
import LinkIcon from "../../assets/images/icons/link.svg";
import ConnectModal from "../common/ConnectModal";
import FixAddModal from "../common/FixAddModal";

// add wallet
import AddWalletModalIcon from "../../assets/images/icons/wallet-icon.svg";
import {
  GetAllPlan,
  getUser,
  setPageFlagDefault,
  updateWalletListFlag,
} from "../common/Api";
import {
  CurrencyType,
  mobileCheck,
  noExponents,
  numToCurrency,
} from "../../utils/ReusableFunctions";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import { BASE_URL_S3 } from "../../utils/Constant";
import { toast } from "react-toastify";
import WelcomeCard from "../Portfolio/WelcomeCard";
import ExitOverlay from "../common/ExitOverlay";
import {
  ArrowDownLeftSmallIcon,
  ArrowUpRightSmallIcon,
  ExportIconWhite,
} from "../../assets/images/icons";

class Cost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstTimeUnrealizedPNL: true,
      combinedCostBasis: 0,
      combinedCurrentValue: 0,
      combinedUnrealizedGains: 0,
      combinedReturn: 0,
      exportHeaderTitle: "Download all unrealized profit and loss",
      exportHeaderSubTitle: "Export your unrealized profit and loss from Loch",
      exportSelectExportOption: 4,
      exportModal: false,
      callFeesOverTime: true,
      callCounterpartyVolumeOverTime: true,
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
      showDust: true,

      // counter party
      // counterPartyData: [],
      // counterPartyValue: null,
      currentPage: "Cost",
      connectModal: false,
      counterGraphDigit: 3,
      GraphDigit: 3,

      // add new wallet
      userWalletList: window.sessionStorage.getItem("addWallet")
        ? JSON.parse(window.sessionStorage.getItem("addWallet"))
        : [],
      addModal: false,
      isUpdate: 0,
      apiResponse: false,
      isFeesChainSearchUsed: false,
      isVolumeChainSearchUsed: false,
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
    };
  }
  history = this.props;
  handleExportModal = () => {
    this.setState({
      exportModal: !this.state.exportModal,
    });
  };
  setAverageCostExportModal = () => {
    CostAvgCostBasisExport({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    this.setState(
      {
        exportHeaderTitle: "Download unrealized profit and loss",
        exportHeaderSubTitle:
          "Export your unrealized profit and loss from Loch",
        exportSelectExportOption: 4,
      },
      () => {
        this.setState({
          exportModal: true,
        });
      }
    );
  };
  setBlockChainFeesExportModal = () => {
    CostBlockchainFeesExport({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    this.setState(
      {
        exportHeaderTitle: "Download all blockchain fees",
        exportHeaderSubTitle: "Export your blockchain fees over time from Loch",
        exportSelectExportOption: 2,
      },
      () => {
        this.setState({
          exportModal: true,
        });
      }
    );
  };
  setCounterpartyVolumeExportModal = () => {
    CostCounterpartyFeesExport({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    this.setState(
      {
        exportHeaderTitle: "Download counterparty volume",
        exportHeaderSubTitle:
          "Export your counterparty volume over time from Loch",
        exportSelectExportOption: 3,
      },
      () => {
        this.setState({
          exportModal: true,
        });
      }
    );
  };
  feesOverTimeOn = () => {
    if (!this.state.callFeesOverTime) {
      this.setState({
        callFeesOverTime: true,
      });
    }
  };
  feesOverTimeOff = () => {
    if (this.state.callFeesOverTime) {
      this.setState({
        callFeesOverTime: false,
      });
    }
  };
  counterpartyVolumeOverTimeOn = () => {
    if (!this.state.callCounterpartyVolumeOverTime) {
      this.setState({
        callCounterpartyVolumeOverTime: true,
      });
    }
  };
  counterpartyVolumeOverTimeOff = () => {
    if (this.state.callCounterpartyVolumeOverTime) {
      this.setState({
        callCounterpartyVolumeOverTime: false,
      });
    }
  };
  feesChainSearchIsUsed = () => {
    this.setState({ isFeesChainSearchUsed: true });
  };
  volumeChainSearchIsUsed = () => {
    this.setState({ isVolumeChainSearchUsed: true });
  };
  startPageView = () => {
    this.setState({ startTime: new Date() * 1 });
    CostsPage({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    // Inactivity Check
    window.checkCostTimer = setInterval(() => {
      this.checkForInactivity();
    }, 900000);
  };
  componentDidMount() {
    if (mobileCheck()) {
      this.props.history.push("/home");
    }
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

    this.props.getAllCoins();
    this.getBlockchainFee(0, true);
    this.getCounterPartyFee(0, true);
    this.props.getAvgCostBasis(this);
    this.props.GetAllPlan();
    this.props.getUser();

    const search = this.props.location.search;
    const params = new URLSearchParams(search);
    const addAddress = params.get("add-address");
    if (addAddress) {
      this.handleAddModal();
      this.props.history.replace("/intelligence/costs");
    }
    this.startPageView();
    this.updateTimer(true);

    return () => {
      clearInterval(window.checkCostTimer);
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.intelligenceState.Average_cost_basis !==
      this.props.intelligenceState.Average_cost_basis
    ) {
      let array = this.props.intelligenceState?.Average_cost_basis?.filter(
        (e) => e.CurrentValue < 1
      );

      if (array.length > 0 && this.state.showDust) {
        let array = this.props.intelligenceState?.Average_cost_basis?.filter(
          (e) => e.CurrentValue >= 1
        );
        this.props.updateAverageCostBasis(array, this);
      } else {
        let tempcombinedCostBasis = 0;
        let tempcombinedCurrentValue = 0;
        let tempcombinedUnrealizedGains = 0;
        let tempcombinedReturn = 0;
        if (this.props.intelligenceState?.net_return) {
          tempcombinedReturn = this.props.intelligenceState?.net_return;
        }
        if (this.props.intelligenceState?.total_bal) {
          tempcombinedCurrentValue = this.props.intelligenceState?.total_bal;
        }
        if (this.props.intelligenceState?.total_cost) {
          tempcombinedCostBasis = this.props.intelligenceState?.total_cost;
        }
        if (this.props.intelligenceState?.total_gain) {
          tempcombinedUnrealizedGains =
            this.props.intelligenceState?.total_gain;
        }

        this.setState({
          combinedCostBasis: tempcombinedCostBasis,
          combinedCurrentValue: tempcombinedCurrentValue,
          combinedUnrealizedGains: tempcombinedUnrealizedGains,
          combinedReturn: tempcombinedReturn,
        });
      }
    }
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
    if (!this.props.commonState.cost) {
      this.props.updateWalletListFlag("cost", true);
      let tempData = new URLSearchParams();
      tempData.append("start", 0);
      tempData.append("conditions", JSON.stringify([]));
      tempData.append("limit", 50);
      tempData.append("sorts", JSON.stringify([]));
      this.props.getAllWalletListApi(tempData, this);
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

  getBlockchainFee(option, first) {
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
    if (!first) {
      FeesTimePeriodFilter({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        time_period_selected: handleSelected,
      });
      this.updateTimer();
    }
  }

  getCounterPartyFee(option, first) {
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
    if (!first) {
      CounterpartyFeesTimeFilter({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        time_period_selected: handleSelected,
      });
      this.updateTimer();
    }
  }
  updateTimer = (first) => {
    const tempExistingExpiryTime =
      window.sessionStorage.getItem("costPageExpiryTime");
    if (!tempExistingExpiryTime && !first) {
      this.startPageView();
    }
    const tempExpiryTime = Date.now() + 1800000;
    window.sessionStorage.setItem("costPageExpiryTime", tempExpiryTime);
  };
  endPageView = () => {
    clearInterval(window.checkCostTimer);
    window.sessionStorage.removeItem("costPageExpiryTime");
    if (this.state.startTime) {
      let endTime = new Date() * 1;
      let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
      TimeSpentCosts({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        time_spent: TimeSpent,
      });
      this.props.ResetAverageCostBasis(this);
    }
  };
  checkForInactivity = () => {
    const tempExpiryTime = window.sessionStorage.getItem("costPageExpiryTime");
    if (tempExpiryTime && tempExpiryTime < Date.now()) {
      this.endPageView();
    }
  };
  componentWillUnmount() {
    const tempExpiryTime = window.sessionStorage.getItem("costPageExpiryTime");
    if (tempExpiryTime) {
      this.endPageView();
    }
  }

  handleBadge = (activeBadgeList, type) => {
    let selectedChains = [];
    this.props.OnboardingState.coinsList?.map((item) => {
      if (activeBadgeList?.includes(item.id)) {
        selectedChains.push(item.code);
      }
    });
    const { GraphfeeData, counterPartyData } = this.props.intelligenceState;
    let graphDataMaster = [];
    let counterPartyDataMaster = [];
    if (type === 1) {
      GraphfeeData.gas_fee_overtime &&
        GraphfeeData.gas_fee_overtime?.map((tempGraphData) => {
          if (
            activeBadgeList &&
            (activeBadgeList.includes(tempGraphData?.chain?._id) ||
              activeBadgeList.length === 0)
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
      const tempIsSearchUsed = this.state.isFeesChainSearchUsed;
      costFeesChainFilter({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        selected: selectedChains,
        isSearchUsed: tempIsSearchUsed,
      });
      this.updateTimer();
      this.setState({ isFeesChainSearchUsed: false });
    } else {
      counterPartyData &&
        counterPartyData?.map((tempGraphData) => {
          if (
            activeBadgeList &&
            (activeBadgeList.includes(tempGraphData?.chain?._id) ||
              activeBadgeList.length === 0)
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
      const tempIsSearchUsed = this.state.isVolumeChainSearchUsed;
      costVolumeChainFilter({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        selected: selectedChains,
        isSearchUsed: tempIsSearchUsed,
      });
      this.updateTimer();
      this.setState({ isVolumeChainSearchUsed: false });
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
      CostSortByAsset({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
      this.updateTimer();
      // console.log("asset")
    } else if (e.title === "Average cost price") {
      this.sortArray("AverageCostPrice", isDown);
      this.setState({
        sortBy: sort,
      });
      CostSortByCostPrice({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
      this.updateTimer();
    } else if (e.title === "Current price") {
      this.sortArray("CurrentPrice", isDown);
      this.setState({
        sortBy: sort,
      });
      CostSortByCurrentPrice({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
      this.updateTimer();
    } else if (e.title === "Amount") {
      this.sortArray("Amount", isDown);
      this.setState({
        sortBy: sort,
      });
      CostSortByAmount({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
      this.updateTimer();
    } else if (e.title === "Cost basis") {
      this.sortArray("CostBasis", isDown);
      this.setState({
        sortBy: sort,
      });
      CAverageCostBasisSort({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
      this.updateTimer();
    } else if (e.title === "Current value") {
      this.sortArray("CurrentValue", isDown);
      this.setState({
        sortBy: sort,
      });
      SortByCurrentValue({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
      this.updateTimer();
    } else if (e.title === "Gain amount") {
      this.sortArray("GainAmount", isDown);
      this.setState({
        sortBy: sort,
      });
      SortByGainAmount({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
      this.updateTimer();
    } else if (e.title === "Gain percentage") {
      this.sortArray("GainLoss", isDown);
      this.setState({
        sortBy: sort,
      });
      SortByGainLoss({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
      this.updateTimer();
    }
  };

  handleDust = () => {
    this.setState(
      {
        showDust: !this.state.showDust,
      },
      () => {
        if (this.state.showDust) {
          let array = this.props.intelligenceState?.Average_cost_basis?.filter(
            (e) => e.CurrentValue >= 1
          ); //all data
          this.props.updateAverageCostBasis(array, this);
        } else {
          this.props.ResetAverageCostBasis(this);
        }

        CostHideDust({
          session_id: getCurrentUser().id,
          email_address: getCurrentUser().email,
        });
        this.updateTimer();
      }
    );
  };

  handleShare = () => {
    let lochUser = getCurrentUser().id;
    // let shareLink = BASE_URL_S3 + "home/" + lochUser.link;
    let userWallet = JSON.parse(window.sessionStorage.getItem("addWallet"));
    let slink =
      userWallet?.length === 1
        ? userWallet[0].displayAddress || userWallet[0].address
        : lochUser;
    let shareLink =
      BASE_URL_S3 + "home/" + slink + "?redirect=intelligence/costs";
    navigator.clipboard.writeText(shareLink);
    toast.success("Link copied");

    CostShare({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    this.updateTimer();
  };

  render() {
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
    //       symbol: ArrowDownLeftSmallIcon,
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
                text={Number(noExponents(index + 1)).toLocaleString("en-US")}
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
              <div
                onMouseEnter={() => {
                  CostAssetHover({
                    session_id: getCurrentUser().id,
                    email_address: getCurrentUser().email,
                    asset_hover: rowData.AssetCode,
                  });
                }}
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <CustomOverlay
                  position="top"
                  isIcon={false}
                  isInfo={true}
                  isText={true}
                  text={rowData.AssetCode}
                >
                  <div>
                    <CoinChip
                      coin_img_src={rowData.Asset}
                      coin_code={rowData.AssetCode}
                      chain={rowData?.chain}
                    />
                  </div>
                </CustomOverlay>
              </div>
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
              <div
                onMouseEnter={() => {
                  CostAverageCostPriceHover({
                    session_id: getCurrentUser().id,
                    email_address: getCurrentUser().email,
                  });
                }}
              >
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
                  <span className="inter-display-medium f-s-13 lh-16 grey-313">
                    {rowData.AverageCostPrice === 0
                      ? "N/A"
                      : CurrencyType(false) +
                        numToCurrency(
                          rowData.AverageCostPrice.toFixed(2)
                        ).toLocaleString("en-US")}
                  </span>
                </CustomOverlay>
              </div>
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
              <div
                onMouseEnter={() => {
                  CostCurrentPriceHover({
                    session_id: getCurrentUser().id,
                    email_address: getCurrentUser().email,
                  });
                }}
              >
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
                  <span className="inter-display-medium f-s-13 lh-16 grey-313">
                    {CurrencyType(false) +
                      numToCurrency(
                        rowData.CurrentPrice.toFixed(2)
                      ).toLocaleString("en-US")}
                  </span>
                </CustomOverlay>
              </div>
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
              <span
                onMouseEnter={() => {
                  CostAmountHover({
                    session_id: getCurrentUser().id,
                    email_address: getCurrentUser().email,
                  });
                }}
              >
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
              </span>
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
              <div className="cost-common-container">
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
                  <div className="cost-common">
                    <span
                      onMouseEnter={() => {
                        CostCostBasisHover({
                          session_id: getCurrentUser().id,
                          email_address: getCurrentUser().email,
                        });
                      }}
                    >
                      {rowData.CostBasis === 0
                        ? "N/A"
                        : CurrencyType(false) +
                          numToCurrency(
                            rowData.CostBasis.toFixed(2)
                          ).toLocaleString("en-US")}
                    </span>
                  </div>
                </CustomOverlay>
              </div>
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
              <div className="cost-common-container">
                <CustomOverlay
                  position="top"
                  isIcon={false}
                  isInfo={true}
                  isText={true}
                  text={
                    rowData.CurrentValue
                      ? CurrencyType(false) +
                        Number(
                          noExponents(rowData.CurrentValue.toFixed(2))
                        ).toLocaleString("en-US")
                      : CurrencyType(false) + "0.00"
                  }
                >
                  <div className="cost-common">
                    <span
                      onMouseEnter={() => {
                        CostCurrentValueHover({
                          session_id: getCurrentUser().id,
                          email_address: getCurrentUser().email,
                        });
                      }}
                    >
                      {CurrencyType(false) +
                        numToCurrency(
                          rowData.CurrentValue.toFixed(2)
                        ).toLocaleString("en-US")}
                    </span>
                  </div>
                </CustomOverlay>
              </div>
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
              <div
                onMouseEnter={() => {
                  CostGainHover({
                    session_id: getCurrentUser().id,
                    email_address: getCurrentUser().email,
                  });
                }}
                className="gainLossContainer"
              >
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
                  <div className={`gainLoss`}>
                    {rowData.GainAmount !== 0 ? (
                      <Image
                        className="mr-2"
                        style={{
                          height: "1.5rem",
                          width: "1.5rem",
                        }}
                        src={
                          rowData.GainAmount < 0
                            ? ArrowDownLeftSmallIcon
                            : ArrowUpRightSmallIcon
                        }
                      />
                    ) : null}
                    <span className="inter-display-medium f-s-13 lh-16 grey-313">
                      {tempDataHolder
                        ? CurrencyType(false) +
                          tempDataHolder.toLocaleString("en-US")
                        : "0.00"}
                    </span>
                  </div>
                </CustomOverlay>
              </div>
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
              <div
                onMouseEnter={() => {
                  CostGainLossHover({
                    session_id: getCurrentUser().id,
                    email_address: getCurrentUser().email,
                  });
                }}
                className="gainLossContainer"
              >
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
                  <div className={`gainLoss`}>
                    {rowData.GainLoss !== 0 ? (
                      <Image
                        className="mr-2"
                        style={{
                          height: "1.5rem",
                          width: "1.5rem",
                        }}
                        src={
                          rowData.GainLoss < 0
                            ? ArrowDownLeftSmallIcon
                            : ArrowUpRightSmallIcon
                        }
                      />
                    ) : null}
                    <span className="inter-display-medium f-s-13 lh-16 grey-313">
                      {tempDataHolder
                        ? Math.abs(tempDataHolder).toLocaleString("en-US") + "%"
                        : "0.00%"}
                    </span>
                  </div>
                </CustomOverlay>
              </div>
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
                updateTimer={this.updateTimer}
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
              updateTimer={this.updateTimer}
            />
          ) : (
            ""
          )}
          <div className="cost-section page">
            {this.state.exportModal ? (
              <ExitOverlay
                show={this.state.exportModal}
                onHide={this.handleExportModal}
                history={this.history}
                headerTitle={this.state.exportHeaderTitle}
                headerSubTitle={this.state.exportHeaderSubTitle}
                modalType={"exportModal"}
                iconImage={ExportIconWhite}
                selectExportOption={this.state.exportSelectExportOption}
              />
            ) : null}
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
                updateTimer={this.updateTimer}
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
              ExportBtn
              exportBtnTxt="Click to export costs"
              handleExportModal={this.setAverageCostExportModal}
              handleShare={this.handleShare}
              updateTimer={this.updateTimer}
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
                  bottomCombiedValues
                  combinedCostBasis={this.state.combinedCostBasis}
                  combinedCurrentValue={this.state.combinedCurrentValue}
                  combinedUnrealizedGains={this.state.combinedUnrealizedGains}
                  combinedReturn={this.state.combinedReturn}
                  noSubtitleBottomPadding
                  title="Unrealized profit and loss"
                  subTitle="Understand your unrealized profit and loss per token"
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
                  showDust={this.state.showDust}
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
                ExportBtn
                exportBtnTxt="Click to export blockchain fees"
                handleExportModal={this.setBlockChainFeesExportModal}
                headerTitle="Blockchain fees over time"
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
                chainSearchIsUsed={this.feesChainSearchIsUsed}
                oldBar
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
                ExportBtn
                exportBtnTxt="Click to export counterparty volume"
                handleExportModal={this.setCounterpartyVolumeExportModal}
                headerTitle="Counterparty volume over time"
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
                chainSearchIsUsed={this.volumeChainSearchIsUsed}
                oldBar
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
  commonState: state.CommonState,
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
  updateWalletListFlag,
  getAllWalletListApi,
  getUser,
  GetAllPlan,
};

export default connect(mapStateToProps, mapDispatchToProps)(Cost);
