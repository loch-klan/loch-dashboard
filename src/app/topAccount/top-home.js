import React from "react";
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import { connect } from "react-redux";
import WelcomeCard from "../Portfolio/WelcomeCard";
import LineChartSlider from "../Portfolio/LineCharSlider";
import prevIcon from "../../assets/images/icons/prev-arrow.svg";
import nextIcon from "../../assets/images/icons/next-arrow.svg";
import GainIcon from "../../assets/images/icons/GainIcon.svg";
import LossIcon from "../../assets/images/icons/LossIcon.svg";
import unrecognizedIcon from "../../assets/images/icons/unrecognisedicon.svg";
import {
  getCoinRate,
  getDetailsByLinkApi,
  getUserWallet,
  getYesterdaysBalanceApi,
  settingDefaultValues,
  getExternalEventsApi,
  getExchangeBalances,
} from "../Portfolio/Api";
import { Image, Row, Col } from "react-bootstrap";
import {
  detectCoin,
  getAllCoins,
  getAllParentChains,
} from "../onboarding/Api.js";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import TransactionTable from "../intelligence/TransactionTable";
import BarGraphSection from "./../common/BarGraphSection";
import CopyClipboardIcon from "../../assets/images/CopyClipboardIcon.svg";
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
import {
  GroupByOptions,
  GROUP_BY_DATE,
  SORT_BY_TIMESTAMP,
  SORT_BY_FROM_WALLET,
  SORT_BY_TO_WALLET,
  SORT_BY_ASSET,
  SORT_BY_USD_VALUE_THEN,
  SORT_BY_METHOD,
  START_INDEX,
  SEARCH_BY_WALLET_ADDRESS_IN,
  BASE_URL_S3,
} from "../../utils/Constant";
import sortByIcon from "../../assets/images/icons/triangle-down.svg";
import {
  TopHomeShare,
  PageviewTopHome,
  TimeSpentTopHome,
  NetflowSwitchTopHome,
} from "../../utils/AnalyticsFunctions.js";
import { getCurrentUser, resetPreviewAddress } from "../../utils/ManageToken";
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
  TruncateText,
  UpgradeTriggered,
} from "../../utils/ReusableFunctions";
import UpgradeModal from "../common/upgradeModal";
import { GetAllPlan, getUser } from "../common/Api";
import { toast } from "react-toastify";
import Footer from "../common/footer";
import TopPiechart from "./top-piechart";
import { TOP_ASSET_VALUE_GRAPH_DAY } from "./ActionTypes";
import moment from "moment";
import PageHeader from "../common/PageHeader";
import { Buffer } from "buffer";

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
      userWalletList: localStorage.getItem("previewAddress")
        ? [JSON.parse(localStorage.getItem("previewAddress"))]
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
      // updatedInsightList: "",
      // isLoadingInsight: false,

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

      // transaction history table
      tableLoading: false,
      // sort
      sort: [{ key: SORT_BY_TIMESTAMP, value: false }],

      // transaction history table row limit
      limit: 6,

      // transaction history sort
      tableSortOpt: [
        {
          title: "time",
          up: false,
        },
        {
          title: "from",
          up: false,
        },
        {
          title: "to",
          up: false,
        },
        {
          title: "asset",
          up: false,
        },
        {
          title: "usdValue",
          up: false,
        },
        {
          title: "method",
          up: false,
        },
      ],

      // this is used in api to check api call fromt op acount page or not
      isTopAccountPage: true,

      // netflow switch
      isSwitch: false,
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
        // isLoadingInsight: true,
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

  startPageView = () => {
    this.setState({ startTime: new Date() * 1 });
    PageviewTopHome({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    // Inactivity Check
    window.checkTopHomeTimer = setInterval(() => {
      this.checkForInactivity();
    }, 900000);
  };
  componentDidMount() {
    window.scrollTo(0, 0);
    this.startPageView();
    this.updateTimer(true);
    this.apiCall();
    this.getToken();
  }
  updateTimer = (first) => {
    const tempExistingExpiryTime = localStorage.getItem(
      "topHomePageExpiryTime"
    );
    if (!tempExistingExpiryTime && !first) {
      this.startPageView();
    }
    const tempExpiryTime = Date.now() + 1800000;
    localStorage.setItem("topHomePageExpiryTime", tempExpiryTime);
  };
  endPageView = () => {
    clearInterval(window.checkTopHomeTimer);
    localStorage.removeItem("topHomePageExpiryTime");
    if (this.state.startTime) {
      let endTime = new Date() * 1;
      let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
      TimeSpentTopHome({
        time_spent: TimeSpent,
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
    }
  };
  checkForInactivity = () => {
    const tempExpiryTime = localStorage.getItem("topHomePageExpiryTime");
    if (tempExpiryTime && tempExpiryTime < Date.now()) {
      this.endPageView();
    }
  };
  CalculateOverview = () => {
    // if wallet address change
    // console.log("overview");
    if (
      this.state &&
      this.state.userWalletList &&
      this.state.userWalletList?.length > 0
    ) {
      // console.log("inside if");
      // Resetting the user wallet list, total and chain wallet
      this.props.settingDefaultValues(this);

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
      this.props.settingDefaultValues(this);
      // console.log("inside else");
      // // when wallet address not present run connect exchnage api
      // this.props.getExchangeBalances(this, false);

      // run this api if itws value 0
      this.props.getYesterdaysBalanceApi(this);
    }

    // aset value chart
    this.getGraphData();
  };

  getCoinBasedOnWalletAddress = () => {
    //  console.log("detect coin");
    let parentCoinList = this.props.OnboardingState.parentCoinList;
    if (parentCoinList && this.state.userWalletList[0]?.address) {
      for (let i = 0; i < parentCoinList.length; i++) {
        // console.log("in loop");
        this.props.detectCoin(
          {
            id: "wallet1",
            coinCode: parentCoinList[i].code,
            coinSymbol: parentCoinList[i].symbol,
            coinName: parentCoinList[i].name,
            address: this.state.userWalletList[0]?.address,
            coinColor: parentCoinList[i].color,
            subChains: parentCoinList[i].sub_chains,
          },
          this,
          false,
          i
        );
      }
    }
  };

  handleSetCoin = (data) => {
    // console.log("data", data);
    let coinList = {
      chain_detected: data.chain_detected,
      coinCode: data.coinCode,
      coinName: data.coinName,
      coinSymbol: data.coinSymbol,
      coinColor: data.coinColor,
    };
    let newCoinList = [];
    newCoinList.push(coinList);
    data.subChains &&
      data.subChains?.map((item) =>
        newCoinList.push({
          chain_detected: data.chain_detected,
          coinCode: item.code,
          coinName: item.name,
          coinSymbol: item.symbol,
          coinColor: item.color,
        })
      );

    let newAddress = [...this.state.userWalletList];
    newAddress[0].coins.push(...newCoinList);

    newAddress[0].coinFound = newAddress[0].coins.some(
      (e) => e.chain_detected === true
    );

    newAddress[0].apiAddress = data?.apiaddress;
    newAddress[0].address = data?.apiaddress;
    this.setState(
      {
        userWalletList: newAddress,
      },
      () => {
        let obj = JSON.parse(localStorage.getItem("previewAddress"));
        localStorage.setItem(
          "previewAddress",
          JSON.stringify({
            ...obj,
            ...this.state.userWalletList[0],
          })
        );
      }
    );
  };

  componentDidUpdate(prevProps, prevState) {
    // Check if the coin rate api values are changed
    if (!this.props.commonState.top_home && this.state.lochToken) {
      this.props.updateWalletListFlag("top_home", true);
      this.setState({
        // isLoadingInsight: true,
        netFlowLoading: true,
        isLoading: true,
        isLoadingNet: true,
        graphLoading: true,
        AvgCostLoading: true,
        chainLoader: true,
      });

      //  get chain detect

      // current data
      let addressObj = localStorage.getItem("previewAddress")
        ? JSON.parse(localStorage.getItem("previewAddress"))
        : [];
      if (addressObj?.coinFound) {
        // console.log("coint found")
        this.CalculateOverview();
      } else {
        resetPreviewAddress();
        //  console.log("reset");
        // after reset previewAddress obj
        // when user refresh then parent chain get empty so we are calling api to get parent chain
        this.props.getAllCoins();
        this.props.getAllParentChains();
        let obj = JSON.parse(localStorage.getItem("previewAddress"));
        localStorage.setItem(
          "previewAddress",
          JSON.stringify({
            ...obj,
            address: addressObj?.address,
          })
        );
        this.getCoinBasedOnWalletAddress();
      }

      // add netflows
      this.props.getProfitAndLossApi(this, false, false, false);
      // netflow breakdown
      this.props.getAssetProfitLoss(this, false, false, false);

      // insights
      // this.props.getAllInsightsApi(this);

      // transaction history
      this.getTableData();

      // avg cost basis
      this.props.getAvgCostBasis(this);

      // for chain detect
      setTimeout(() => {
        this.props.getDetectedChainsApi(this);
      }, 1000);

      this.props.GetAllPlan();
      this.props.getUser(this);
    } else if (prevState.sort !== this.state.sort) {
      // sort table
      this.getTableData();
    }
  }

  // transaction history table data
  getTableData = () => {
    //console.log("calling table");
    this.setState({ tableLoading: true });
    let arr = this.state.userWalletList;
    let address = arr?.map((wallet) => {
      return wallet.address;
    });
    let condition = [{ key: SEARCH_BY_WALLET_ADDRESS_IN, value: address }];
    let data = new URLSearchParams();
    data.append("start", START_INDEX);
    data.append("conditions", JSON.stringify(condition));
    data.append("limit", this.state.limit);
    data.append("sorts", JSON.stringify(this.state.sort));
    this.props.searchTransactionApi(data, this);
  };

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
    this.props.getAllParentChains();
    this.props.getCoinRate();
  };

  componentWillUnmount() {
    const tempExpiryTime = localStorage.getItem("topHomePageExpiryTime");
    if (tempExpiryTime) {
      this.endPageView();
    }
    // reset all sort average cost
    this.props.ResetAverageCostBasis(this);
  }

  // asset value chart api call
  getGraphData = (groupByValue = GROUP_BY_DATE) => {
    //console.log("calling graph");
    let ActionType = TOP_ASSET_VALUE_GRAPH_DAY;
    this.setState({ graphLoading: true }, () => {
      let addressList = [];
      this.state.userWalletList.map((wallet) =>
        addressList.push(wallet.address)
      );
      let data = new URLSearchParams();
      data.append("wallet_address", JSON.stringify(addressList));
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
    } else if (e.title === "Gain loss") {
      this.sortArray("GainLoss", isDown);
      this.setState({
        sortBy: sort,
      });
    }
  };

  // sort transaction history api
  handleTableSort = (val) => {
    let sort = [...this.state.tableSortOpt];
    let obj = [];
    sort.map((el) => {
      if (el.title === val) {
        if (val === "time") {
          obj = [
            {
              key: SORT_BY_TIMESTAMP,
              value: !el.up,
            },
          ];
        } else if (val === "from") {
          obj = [
            {
              key: SORT_BY_FROM_WALLET,
              value: !el.up,
            },
          ];
        } else if (val === "to") {
          obj = [
            {
              key: SORT_BY_TO_WALLET,
              value: !el.up,
            },
          ];
        } else if (val === "asset") {
          obj = [
            {
              key: SORT_BY_ASSET,
              value: !el.up,
            },
          ];
        } else if (val === "usdValue") {
          // console.log("el.up", el.up)
          obj = [
            {
              key: SORT_BY_USD_VALUE_THEN,
              value: !el.up,
            },
          ];
        } else if (val === "method") {
          obj = [
            {
              key: SORT_BY_METHOD,
              value: !el.up,
            },
          ];
        }
        el.up = !el.up;
      } else {
        el.up = false;
      }
    });

    this.setState({
      sort: obj,
      tableSortOpt: sort,
    });
  };
  setSwitch = () => {
    this.setState({
      isSwitch: !this.state.isSwitch,
    });

    NetflowSwitchTopHome({
      email_address: getCurrentUser().email,
      session_id: getCurrentUser().id,
    });
    this.updateTimer();
    // console.log("switch")
  };
  handleShare = () => {
    const previewAddress = localStorage.getItem("previewAddress")
      ? JSON.parse(localStorage.getItem("previewAddress"))
      : "";
    const encodedAddress = Buffer.from(previewAddress?.address).toString(
      "base64"
    );
    let shareLink = BASE_URL_S3 + `top-account/${encodedAddress}?redirect=home`;
    navigator.clipboard.writeText(shareLink);
    toast.success("Link copied");
    TopHomeShare({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    this.updateTimer();
  };
  copyContent = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Copied");
      })
      .catch(() => {
        console.log("something went wrong");
      });
  };
  render() {
    const { table_home, assetPriceList_home } = this.props.topAccountState;
    const { userWalletList, currency } = this.state;

    // console.log("vvv", this.props.topAccountState.assetValueDay);
    // Transaction history
    let tableData =
      table_home &&
      table_home.map((row) => {
        let walletFromData = null;
        let walletToData = null;

        userWalletList &&
          userWalletList.map((wallet) => {
            if (
              wallet.address?.toLowerCase() ===
                row.from_wallet.address?.toLowerCase() ||
              wallet.displayAddress?.toLowerCase() ===
                row.from_wallet.address?.toLowerCase()
            ) {
              walletFromData = {
                wallet_metaData: wallet.wallet_metadata,
                displayAddress: wallet.displayAddress,
                nickname: wallet?.nickname,
              };
            }
            if (
              wallet.address?.toLowerCase() ==
                row.to_wallet.address?.toLowerCase() ||
              wallet.displayAddress?.toLowerCase() ==
                row.to_wallet.address?.toLowerCase()
            ) {
              walletToData = {
                wallet_metaData: wallet.wallet_metadata,
                displayAddress: wallet.displayAddress,
                nickname: wallet?.nickname,
              };
            }
          });

        return {
          time: row.timestamp,
          from: {
            address: row.from_wallet.address,
            metaData: walletFromData,
            wallet_metaData: {
              symbol: row.from_wallet.wallet_metadata
                ? row.from_wallet.wallet_metadata.symbol
                : null,
              text: row.from_wallet.wallet_metadata
                ? row.from_wallet.wallet_metadata.name
                : null,
            },
          },
          to: {
            address: row.to_wallet.address,
            metaData: walletToData,
            wallet_metaData: {
              symbol: row.to_wallet.wallet_metadata
                ? row.to_wallet.wallet_metadata.symbol
                : null,
              text: row.to_wallet.wallet_metadata
                ? row.to_wallet.wallet_metadata.name
                : null,
            },
          },
          asset: {
            code: row.asset.code,
            symbol: row.asset.symbol,
          },

          usdValueToday: {
            value: row.asset.value,
            id: row.asset.id,
          },
          usdValueThen: {
            value: row.asset.value,
            id: row.asset.id,
            assetPrice: row.asset_price,
          },
        };
      });

    const columnList = [
      {
        labelName: (
          <div
            className="cp history-table-header-col"
            id="time"
            onClick={() => {
              this.handleTableSort("time");
              // TransactionHistoryDate({
              //   session_id: getCurrentUser().id,
              //   email_address: getCurrentUser().email,
              // });
            }}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Date
            </span>
            <Image
              src={sortByIcon}
              className={
                !this.state.tableSortOpt[0].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "time",
        // coumnWidth: 73,
        coumnWidth: 0.3,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "time") {
            return moment(rowData.time).format("MM/DD/YY");
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col"
            id="from"
            onClick={() => {
              this.handleTableSort("from");
              // TransactionHistoryFrom({
              //   session_id: getCurrentUser().id,
              //   email_address: getCurrentUser().email,
              // });
            }}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              From
            </span>
            <Image
              src={sortByIcon}
              className={
                !this.state.tableSortOpt[1].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "from",
        // coumnWidth: 61,
        coumnWidth: 0.3,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "from") {
            // console.log("row", rowData)
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                // text={rowData.from.address}
                text={
                  (rowData.from.metaData?.nickname
                    ? rowData.from.metaData?.nickname + ": "
                    : "") +
                  (rowData.from.wallet_metaData?.text
                    ? rowData.from.wallet_metaData?.text + ": "
                    : "") +
                  (rowData.from.metaData?.displayAddress &&
                  rowData.from.metaData?.displayAddress !== rowData.from.address
                    ? rowData.from.metaData?.displayAddress + ": "
                    : "") +
                  rowData.from.address
                }
              >
                {rowData.from.metaData?.wallet_metaData ? (
                  <span>
                    <Image
                      src={
                        rowData.from.metaData?.wallet_metaData?.symbol ||
                        unrecognizedIcon
                      }
                      className="history-table-icon"
                      onMouseEnter={() => {
                        this.updateTimer();
                      }}
                    />
                    <Image
                      src={CopyClipboardIcon}
                      onClick={() => this.copyContent(rowData.from.address)}
                      className="m-l-10 cp copy-icon"
                      style={{ width: "1rem" }}
                    />
                  </span>
                ) : rowData.from.wallet_metaData.symbol ||
                  rowData.from.wallet_metaData.text ||
                  rowData.from.metaData?.nickname ? (
                  rowData.from.wallet_metaData.symbol ? (
                    <span>
                      <Image
                        src={rowData.from.wallet_metaData.symbol}
                        className="history-table-icon"
                        onMouseEnter={() => {
                          this.updateTimer();
                        }}
                      />
                      <Image
                        src={CopyClipboardIcon}
                        onClick={() => this.copyContent(rowData.from.address)}
                        className="m-l-10 cp copy-icon"
                        style={{ width: "1rem" }}
                      />
                    </span>
                  ) : rowData.from.metaData?.nickname ? (
                    <span
                      onMouseEnter={() => {
                        this.updateTimer();
                      }}
                    >
                      {TruncateText(rowData.from.metaData?.nickname)}
                      <Image
                        src={CopyClipboardIcon}
                        onClick={() => this.copyContent(rowData.from.address)}
                        className="m-l-10 cp copy-icon"
                        style={{ width: "1rem" }}
                      />
                    </span>
                  ) : (
                    <span
                      onMouseEnter={() => {
                        this.updateTimer();
                      }}
                    >
                      {TruncateText(rowData.from.wallet_metaData.text)}
                      <Image
                        src={CopyClipboardIcon}
                        onClick={() => this.copyContent(rowData.from.address)}
                        className="m-l-10 cp copy-icon"
                        style={{ width: "1rem" }}
                      />
                    </span>
                  )
                ) : rowData.from.metaData?.displayAddress ? (
                  <span
                    onMouseEnter={() => {
                      this.updateTimer();
                    }}
                  >
                    {TruncateText(rowData.from.metaData?.displayAddress)}
                    <Image
                      src={CopyClipboardIcon}
                      onClick={() => this.copyContent(rowData.from.address)}
                      className="m-l-10 cp copy-icon"
                      style={{ width: "1rem" }}
                    />
                  </span>
                ) : (
                  <span>
                    <Image
                      src={unrecognizedIcon}
                      className="history-table-icon"
                      onMouseEnter={() => {
                        this.updateTimer();
                      }}
                    />
                    <Image
                      src={CopyClipboardIcon}
                      onClick={() => this.copyContent(rowData.from.address)}
                      className="m-l-10 cp copy-icon"
                      style={{ width: "1rem" }}
                    />
                  </span>
                )}
              </CustomOverlay>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col"
            id="to"
            onClick={() => {
              this.handleTableSort("to");
              // TransactionHistoryTo({
              //   session_id: getCurrentUser().id,
              //   email_address: getCurrentUser().email,
              // });
            }}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              To
            </span>
            <Image
              src={sortByIcon}
              className={
                !this.state.tableSortOpt[2].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "to",
        coumnWidth: 0.3,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "to") {
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={
                  (rowData.to.metaData?.nickname
                    ? rowData.to.metaData?.nickname + ": "
                    : "") +
                  (rowData.to.wallet_metaData?.text
                    ? rowData.to.wallet_metaData?.text + ": "
                    : "") +
                  (rowData.to.metaData?.displayAddress &&
                  rowData.to.metaData?.displayAddress !== rowData.to.address
                    ? rowData.to.metaData?.displayAddress + ": "
                    : "") +
                  rowData.to.address
                }
              >
                {rowData.to.metaData?.wallet_metaData ? (
                  <span>
                    <Image
                      src={
                        rowData.to.metaData?.wallet_metaData?.symbol ||
                        unrecognizedIcon
                      }
                      className="history-table-icon"
                      onMouseEnter={() => {
                        this.updateTimer();
                      }}
                    />
                    <Image
                      src={CopyClipboardIcon}
                      onClick={() => this.copyContent(rowData.to.address)}
                      className="m-l-10 cp copy-icon"
                      style={{ width: "1rem" }}
                    />
                  </span>
                ) : rowData.to.wallet_metaData.symbol ||
                  rowData.to.wallet_metaData.text ||
                  rowData.to.metaData?.nickname ? (
                  rowData.to.wallet_metaData.symbol ? (
                    <span>
                      <Image
                        src={rowData.to.wallet_metaData.symbol}
                        className="history-table-icon"
                        onMouseEnter={() => {
                          this.updateTimer();
                        }}
                      />
                      <Image
                        src={CopyClipboardIcon}
                        onClick={() => this.copyContent(rowData.to.address)}
                        className="m-l-10 cp copy-icon"
                        style={{ width: "1rem" }}
                      />
                    </span>
                  ) : rowData.to.metaData?.nickname ? (
                    <span
                      onMouseEnter={() => {
                        this.updateTimer();
                      }}
                    >
                      {TruncateText(rowData.to.metaData?.nickname)}
                      <Image
                        src={CopyClipboardIcon}
                        onClick={() => this.copyContent(rowData.to.address)}
                        className="m-l-10 cp copy-icon"
                        style={{ width: "1rem" }}
                      />
                    </span>
                  ) : (
                    <span
                      onMouseEnter={() => {
                        this.updateTimer();
                      }}
                    >
                      {TruncateText(rowData.to.wallet_metaData.text)}
                      <Image
                        src={CopyClipboardIcon}
                        onClick={() => this.copyContent(rowData.to.address)}
                        className="m-l-10 cp copy-icon"
                        style={{ width: "1rem" }}
                      />
                    </span>
                  )
                ) : rowData.to.metaData?.displayAddress ? (
                  <span
                    onMouseEnter={() => {
                      this.updateTimer();
                    }}
                  >
                    {TruncateText(rowData.to.metaData?.displayAddress)}
                    <Image
                      src={CopyClipboardIcon}
                      onClick={() => this.copyContent(rowData.to.address)}
                      className="m-l-10 cp copy-icon"
                      style={{ width: "1rem" }}
                    />
                  </span>
                ) : (
                  <span>
                    <Image
                      src={unrecognizedIcon}
                      className="history-table-icon"
                      onMouseEnter={() => {
                        this.updateTimer();
                      }}
                    />
                    <Image
                      src={CopyClipboardIcon}
                      onClick={() => this.copyContent(rowData.to.address)}
                      className="m-l-10 cp copy-icon"
                      style={{ width: "1rem" }}
                    />
                  </span>
                )}
              </CustomOverlay>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col"
            id="asset"
            onClick={() => {
              this.handleTableSort("asset");
              // TransactionHistoryAsset({
              //   session_id: getCurrentUser().id,
              //   email_address: getCurrentUser().email,
              // });
            }}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Asset
            </span>
            <Image
              src={sortByIcon}
              className={
                !this.state.tableSortOpt[3].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "asset",
        coumnWidth: 0.3,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "asset") {
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={rowData.asset.code}
              >
                <Image src={rowData.asset.symbol} className="asset-symbol" />
              </CustomOverlay>
            );
          }
        },
      },
      // {
      //   labelName: (
      //     <div
      //       className="cp history-table-header-col"
      //       id="usdValue"
      //       onClick={() => {
      //         this.handleTableSort("usdValue");
      //         // TransactionHistoryUSD({
      //         //   session_id: getCurrentUser().id,
      //         //   email_address: getCurrentUser().email,
      //         // });
      //       }}
      //     >
      //       <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
      //         {CurrencyType(true)} Value
      //       </span>
      //       <Image
      //         src={sortByIcon}
      //         className={
      //           !this.state.tableSortOpt[4].up ? "rotateDown" : "rotateUp"
      //         }
      //       />
      //     </div>
      //   ),
      //   dataKey: "usdValue",
      //   coumnWidth: 0.25,
      //   isCell: true,
      //   cell: (rowData, dataKey) => {
      //     if (dataKey === "usdValue") {
      //       let chain = Object.entries(assetPriceList_home);
      //       let value;
      //       chain.find((chain) => {
      //         // if (chain[0] === rowData.usdValueToday.id) {
      //         //   value =
      //         //     rowData.usdValueToday.value *
      //         //       chain[1].quote.USD.price *
      //         //       currency?.rate || DEFAULT_PRICE;
      //         //   return;
      //         // }
      //         if (chain[0] === rowData.usdValueThen.id) {
      //           value =
      //             rowData.usdValueThen.value *
      //             rowData.usdValueThen.assetPrice *
      //             (currency?.rate || 1);
      //         }
      //       });
      //       return (
      //         <CustomOverlay
      //           position="top"
      //           isIcon={false}
      //           isInfo={true}
      //           isText={true}
      //           text={Number(value?.toFixed(2)).toLocaleString("en-US")}
      //         >
      //           <div className="inter-display-medium f-s-13 lh-16 grey-313 ellipsis-div">
      //             {Number(value?.toFixed(2)).toLocaleString("en-US")}
      //           </div>
      //         </CustomOverlay>
      //       );
      //     }
      //   },
      // },
      // {
      //   labelName: (
      //     <div
      //       className="cp history-table-header-col"
      //       id="method"
      //       onClick={() => {
      //         this.handleTableSort("method");
      //         TransactionHistoryMethod({
      //           session_id: getCurrentUser().id,
      //           email_address: getCurrentUser().email,
      //         });
      //       }}
      //     >
      //       <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
      //         Method
      //       </span>
      //       <Image
      //         src={sortByIcon}
      //         className={
      //           !this.state.tableSortOpt[5].up ? "rotateDown" : "rotateUp"
      //         }
      //       />
      //     </div>
      //   ),
      //   dataKey: "method",
      //   coumnWidth: 0.22,
      //   isCell: true,
      //   cell: (rowData, dataKey) => {
      //     if (dataKey === "method") {
      //       return (
      //         <div className="inter-display-medium f-s-13 lh-16 black-191 history-table-method transfer">
      //           {rowData.method}
      //         </div>
      //       );
      //     }
      //   },
      // },
    ];
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
        coumnWidth: 0.2,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "Asset") {
            return (
              // <CoinChip
              //   coin_img_src={rowData.Asset}
              //   coin_code={rowData.AssetCode}
              // />
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
                        // HomeCostAssetHover({
                        //   session_id: getCurrentUser().id,
                        //   email_address: getCurrentUser().email,
                        //   asset_hover: rowData.AssetCode,
                        // });
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
            id="Average Cost Price"
            onClick={() => this.handleSort(this.state.sortBy[1])}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Avg cost price
            </span>
            <Image
              src={sortByIcon}
              className={this.state.sortBy[1].down ? "rotateDown" : "rotateUp"}
            />
          </div>
        ),
        dataKey: "AverageCostPrice",
        // coumnWidth: 153,
        coumnWidth: 0.25,
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
                          Number(
                            noExponents(rowData.AverageCostPrice.toFixed(2))
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
              className={this.state.sortBy[2].down ? "rotateDown" : "rotateUp"}
            />
          </div>
        ),
        dataKey: "CurrentPrice",
        // coumnWidth: 128,
        coumnWidth: 0.25,
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
                        Number(
                          noExponents(rowData.CurrentPrice.toFixed(2))
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
        coumnWidth: 0.3,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "GainLoss") {
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={
                  Number(
                    noExponents(rowData.GainLoss.toFixed(2))
                  ).toLocaleString("en-US") + "%"
                }
                colorCode="#000"
              >
                <div className="gainLossContainer">
                  <div
                    className={`gainLoss ${
                      rowData.GainLoss < 0 ? "loss" : "gain"
                    }`}
                  >
                    <Image src={rowData.GainLoss < 0 ? LossIcon : GainIcon} />
                    <span className="inter-display-medium f-s-13 lh-16 grey-313 ml-2">
                      {Number(
                        noExponents(rowData.GainLoss.toFixed(2))
                      ).toLocaleString("en-US") + "%"}
                    </span>
                  </div>
                </div>
              </CustomOverlay>
            );
          }
        },
      },
    ];
    const getTotalAssetValue = () => {
      if (this.props.topAccountState) {
        const tempWallet = this.props.topAccountState.walletTotal
          ? this.props.topAccountState.walletTotal
          : 0;
        const tempCredit = this.props.topAccountState.totalYield
          ? this.props.topAccountState.totalYield
          : 0;
        const tempDebt = this.props.topAccountState.totalDebt
          ? this.props.topAccountState.totalDebt
          : 0;

        return tempWallet + tempCredit - tempDebt;
      }
      return 0;
    };
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
                  assetTotal={getTotalAssetValue()}
                  // assetTotal={
                  //   this.props.topAccountState &&
                  //   this.props.topAccountState.walletTotal
                  //     ? this.props.topAccountState.walletTotal +
                  //       this.props.topAccountState?.totalYield -
                  //       this.props.topAccountState?.totalDebt
                  //     : 0 +
                  //       this.props.topAccountState?.totalYield -
                  //       this.props.topAccountState?.totalDebt
                  // }
                  // history
                  history={this.props.history}
                  // net worth total
                  isLoading={this.state.isLoadingNet}
                  isPreviewing={true}
                />
              </div>
              <div
                style={{
                  marginTop: "10rem",
                }}
              >
                <PageHeader
                  title="Overview"
                  // subTitle="Decipher all your DeFi data from one place"
                  // btnText={"Add wallet"}
                  // handleBtn={this.handleAddModal}
                  // showpath={true}
                  currentPage={"home"}
                  // showData={totalWalletAmt}
                  // isLoading={isLoading}
                  ShareBtn={true}
                  handleShare={this.handleShare}
                  bottomPadding="0"
                  updateTimer={this.updateTimer}
                />
              </div>

              <div
                className="portfolio-section"
                style={{
                  minWidth: "85rem",
                  // marginTop: "9rem",
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
                  assetTotal={getTotalAssetValue()}
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
                  updateTimer={this.updateTimer}
                />
              </div>

              <div className="m-b-22 graph-table-section">
                <Row>
                  <Col md={6}>
                    <div
                      className="m-r-16 section-table"
                      style={{
                        height: "32rem",
                        minHeight: "32rem",
                        marginBottom: 0,
                      }}
                    >
                      <TransactionTable
                        isMiniversion
                        title="Average cost basis"
                        handleClick={() => {
                          if (this.state.lochToken) {
                            this.props.history.push(
                              "/top-accounts/intelligence/costs"
                            );
                          }
                        }}
                        subTitle="Understand your average entry price"
                        tableData={tableDataCostBasis.slice(0, 3)}
                        columnList={CostBasisColumnData}
                        headerHeight={60}
                        isArrow={true}
                        isLoading={this.state.AvgCostLoading}
                        addWatermark
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="profit-chart">
                      <BarGraphSection
                        noSubtitleBottomPadding
                        loaderHeight={15.5}
                        headerTitle="Net Flows"
                        headerSubTitle="Understand your portfolio's profitability"
                        isArrow={true}
                        handleClick={() => {
                          if (this.state.lochToken) {
                            // ProfitLossEV({
                            //   session_id: getCurrentUser().id,
                            //   email_address: getCurrentUser().email,
                            // });
                            this.props.history.push(
                              "/top-accounts/intelligence#netflow"
                            );
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
                        // showPercentage={
                        //   this.props.topAccountState.graphValue &&
                        //   this.props.topAccountState.graphValue[2]
                        // }
                        isLoading={this.state.netFlowLoading}
                        className={"portfolio-profit-and-loss"}
                        isMinichart={true}
                        showSwitch={true}
                        isSwitch={this.state.isSwitch}
                        setSwitch={this.setSwitch}
                        isSmallerToggle
                        ProfitLossAsset={
                          this.props.topAccountState.ProfitLossAsset
                        }
                      />
                    </div>
                  </Col>
                </Row>
              </div>
              <div className="m-b-22 graph-table-section">
                <Row>
                  <Col md={6}>
                    <div
                      className="m-r-16 section-table"
                      style={{
                        height: "32rem",
                        minHeight: "32rem",
                        marginBottom: 0,
                      }}
                    >
                      <TransactionTable
                        isMiniversion
                        title="Transaction History"
                        handleClick={() => {
                          // console.log("wallet", this.state.userWalletList);
                          if (this.state.lochToken) {
                            this.props.history.push(
                              "/top-accounts/intelligence/transaction-history"
                            );
                            // TransactionHistoryEView({
                            //   session_id: getCurrentUser().id,
                            //   email_address: getCurrentUser().email,
                            // });
                          }
                        }}
                        subTitle="Sort, filter, and dissect all your transactions from one place"
                        tableData={tableData.slice(0, 3)}
                        columnList={columnList}
                        headerHeight={60}
                        isArrow={true}
                        isLoading={this.state.tableLoading}
                        addWatermark
                        addWatermarkMoveUp
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <div
                      className="section-table"
                      // style={{ paddingBottom: "1.15rem" }}
                    >
                      <LineChartSlider
                        noSubtitleBottomPadding
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
                              "/top-accounts/intelligence/asset-value"
                            );
                          }
                        }}
                        hideTimeFilter={true}
                        hideChainFilter={true}
                        dataLoaded={
                          this.props.topAccountState.assetValueDataLoaded
                        }
                        updateTimer={this.updateTimer}
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
            updateTimer={this.updateTimer}
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
  detectCoin,

  // avg cost
  getAvgCostBasis,
  // average cost
  ResetAverageCostBasis,
  updateAverageCostBasis,
  getDetectedChainsApi,
  getAssetProfitLoss,
  GetAllPlan,
  getUser,
};
TopPortfolio.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(TopPortfolio);
