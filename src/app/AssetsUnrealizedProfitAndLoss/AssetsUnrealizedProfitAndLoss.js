import React, { Component } from "react";
import PageHeader from "../common/PageHeader.js";
import { connect } from "react-redux";
import { getAllCoins } from "../onboarding/Api.js";

import { Image } from "react-bootstrap";
import CoinChip from "../wallet/CoinChip.js";
import TransactionTable from "../intelligence/TransactionTable.js";
import { getAllWalletListApi } from "../wallet/Api.js";
import sortByIcon from "../../assets/images/icons/triangle-down.svg";

import {
  TimeSpentCosts,
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
  CostAssetHover,
  CostAverageCostPriceHover,
  CostCurrentPriceHover,
  CostAmountHover,
  CostCostBasisHover,
  CostCurrentValueHover,
  CostGainLossHover,
  CostAvgCostBasisExport,
  CostGainHover,
  SortByGainAmount,
  AssetsPageViewMP,
  AssetsPageTimeSpentMP,
} from "../../utils/AnalyticsFunctions.js";
import { getCurrentUser } from "../../utils/ManageToken.js";

import {
  getAllFeeApi,
  getAllCounterFeeApi,
  updateCounterParty,
  updateFeeGraph,
  getAvgCostBasis,
  updateAverageCostBasis,
  ResetAverageCostBasis,
} from "../cost/Api.js";
import LinkIcon from "../../assets/images/icons/link.svg";
import ConnectModal from "../common/ConnectModal.js";
import FixAddModal from "../common/FixAddModal.js";

// add wallet
import AddWalletModalIcon from "../../assets/images/icons/wallet-icon.svg";
import {
  GetAllPlan,
  getUser,
  setPageFlagDefault,
  updateWalletListFlag,
} from "../common/Api.js";
import {
  CurrencyType,
  mobileCheck,
  noExponents,
  numToCurrency,
} from "../../utils/ReusableFunctions.js";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay.js";
import { BASE_URL_S3 } from "../../utils/Constant.js";
import { toast } from "react-toastify";
import WelcomeCard from "../Portfolio/WelcomeCard.js";
import ExitOverlay from "../common/ExitOverlay.js";
import {
  ArrowDownLeftSmallIcon,
  ArrowUpRightSmallIcon,
  ExportIconWhite,
} from "../../assets/images/icons/index.js";
import Footer from "../common/footer.js";

class AssetsUnrealizedProfitAndLoss extends Component {
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

  startPageView = () => {
    this.setState({ startTime: new Date() * 1 });
    AssetsPageViewMP({
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
    
    this.props.getAllCoins();

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
      AssetsPageTimeSpentMP({
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
    let shareLink = BASE_URL_S3 + "home/" + slink + "?redirect=assets";
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
              title="Assets"
              subTitle="Understand your unrealized profit and loss per token"
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
              // DUST
              showHideDust
              showHideDustVal={this.state.showDust}
              showHideDustFun={this.handleDust}
            />
            <div
              style={{ marginBottom: "2.8rem" }}
              className="cost-table-section"
            >
              <div style={{ position: "relative" }}>
                <TransactionTable
                  bottomCombiedValues
                  combinedCostBasis={this.state.combinedCostBasis}
                  combinedCurrentValue={this.state.combinedCurrentValue}
                  combinedUnrealizedGains={this.state.combinedUnrealizedGains}
                  combinedReturn={this.state.combinedReturn}
                  noSubtitleBottomPadding
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

            <Footer />
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AssetsUnrealizedProfitAndLoss);
