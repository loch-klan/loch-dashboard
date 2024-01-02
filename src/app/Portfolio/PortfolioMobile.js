import moment from "moment";
import React from "react";
import { Col, Form, Image, Row } from "react-bootstrap";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import {
  ArrowDownLeftSmallIcon,
  ArrowUpRightSmallIcon,
  MacIcon,
  SharePortfolioIconWhite,
} from "../../assets/images/icons";
import SearchIcon from "../../assets/images/icons/search-icon.svg";
import sortByIcon from "../../assets/images/icons/triangle-down.svg";
import { CopyClipboardIcon } from "../../assets/images/index.js";
import searchIcon from "../../assets/images/icons/search-icon.svg";
import {
  CostHideDustMobile,
  MobileHomePageView,
  Mobile_Home_Search_New_Address,
  Mobile_Home_Share,
  TimeSpentMobileHome,
  TransactionHistoryAddressCopied,
  TransactionHistoryAssetFilter,
  TransactionHistoryHashCopied,
  TransactionHistoryHideDust,
  TransactionHistoryNetworkFilter,
  TransactionHistoryPageBack,
  TransactionHistoryPageNext,
  TransactionHistoryPageSearch,
  TransactionHistorySearch,
  TransactionHistorySortAmount,
  TransactionHistorySortAsset,
  TransactionHistorySortDate,
  TransactionHistorySortFrom,
  TransactionHistorySortMethod,
  TransactionHistorySortTo,
  TransactionHistorySortUSDAmount,
  TransactionHistorySortUSDFee,
  TransactionHistoryWalletClicked,
  TransactionHistoryYearFilter,
} from "../../utils/AnalyticsFunctions";
import {
  API_LIMIT,
  BASE_URL_S3,
  DEFAULT_PRICE,
  Method,
  SEARCH_BETWEEN_VALUE,
  SEARCH_BY_ASSETS_IN,
  SEARCH_BY_CHAIN_IN,
  SEARCH_BY_METHOD_IN,
  SEARCH_BY_NOT_DUST,
  SEARCH_BY_TEXT,
  SEARCH_BY_TIMESTAMP_IN,
  SEARCH_BY_WALLET_ADDRESS_IN,
  SORT_BY_AMOUNT,
  SORT_BY_ASSET,
  SORT_BY_FROM_WALLET,
  SORT_BY_METHOD,
  SORT_BY_TIMESTAMP,
  SORT_BY_TO_WALLET,
  SORT_BY_TRANSACTION_FEE,
  SORT_BY_USD_VALUE_THEN,
  START_INDEX,
} from "../../utils/Constant";
import { getCurrentUser } from "../../utils/ManageToken";
import {
  CurrencyType,
  TruncateText,
  convertNtoNumber,
  noExponents,
  numToCurrency,
} from "../../utils/ReusableFunctions.js";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay.js";
import SmartMoneyPagination from "../../utils/commonComponent/SmartMoneyPagination.js";
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import {
  GetAllPlan,
  getAllCurrencyRatesApi,
  getDetectedChainsApi,
  getUser,
  setPageFlagDefault,
  updateWalletListFlag,
} from "../common/Api";
import Loading from "../common/Loading";
import Footer from "../common/footer";
import {
  ResetAverageCostBasis,
  getAvgCostBasis,
  updateAverageCostBasis,
} from "../cost/Api";
import {
  getAllInsightsApi,
  getAssetProfitLoss,
  getProfitAndLossApi,
  searchTransactionApi,
  getFilters
} from "../intelligence/Api.js";
import TransactionTable from "../intelligence/TransactionTable.js";
import { getAllCoins, getAllParentChains } from "../onboarding/Api.js";
import { getAllWalletListApi } from "../wallet/Api";
import CoinChip from "../wallet/CoinChip.js";
import {
  getAssetGraphDataApi,
  getCoinRate,
  getDetailsByLinkApi,
  getExchangeBalances,
  getExternalEventsApi,
  getUserWallet,
  getYesterdaysBalanceApi,
  settingDefaultValues,
} from "./Api";
import PieChart2 from "./PieChart2";
import WelcomeCard from "./WelcomeCard";
import "./_mobilePortfolio.scss";
import CustomMinMaxDropdown from "../../utils/form/CustomMinMaxDropdown.js";
import FormElement from "../../utils/form/FormElement.js";
import CustomDropdown from "../../utils/form/CustomDropdownPrice.js";
import CustomTextControl from "../../utils/form/CustomTextControl.js";

class PortfolioMobile extends BaseReactComponent {
  constructor(props) {
    super(props);

    const search = props.location.search;
    const params = new URLSearchParams(search);
    const page = params.get("p");
    this.state = {
      startTime: "",
      showPopupModal: true,
      tableLoading:false,
      showSearchIcon: false,
      showShareIcon: false,
      combinedCostBasis: 0,
      combinedCurrentValue: 0,
      combinedUnrealizedGains: 0,
      combinedReturn: 0,
      showHideDustVal: true,
      showHideDustValTrans: true,
      isShowingAge: false,
      currentPage: page ? parseInt(page, 10) : START_INDEX,
      walletList: [],
      sort: [{ key: SORT_BY_TIMESTAMP, value: false }],
      condition: [],
      tableSortOpt: [
        {
          title: "time",
          up: true,
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
          title: "amount",
          up: false,
        },
        {
          title: "usdThen",
          up: false,
        },
        {
          title: "usdToday",
          up: false,
        },
        {
          title: "usdTransaction",
          up: false,
        },
        {
          title: "method",
          up: false,
        },
        {
          title: "hash",
          up: false,
        },
      ],
      currency: JSON.parse(window.sessionStorage.getItem("currency")),
      isTimeSearchUsed: false,
      isAssetSearchUsed: false,
      isNetworkSearchUsed: false,
      minAmount: "1",
      maxAmount: "1000000000",
      selectedTimes: [],
      selectedAssets: [],
      selectedMethods: [],
      selectedNetworks: [],
      amountFilter: "Size",
      delayTimer: 0,
      year: "",
      search: "",
      method: "",
      asset: "",
      methodsDropdown: Method.opt,
    };
    this.delayTimer = 0;
  }
  handleTableSort = (val) => {
    let sort = [...this.state.tableSortOpt];
    let obj = [];
    sort?.map((el) => {
      if (el.title === val) {
        if (val === "time") {
          obj = [
            {
              key: SORT_BY_TIMESTAMP,
              value: !el.up,
            },
          ];

          TransactionHistorySortDate({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
            isMobile: true,
          });
          this.updateTimer();
        } else if (val === "from") {
          obj = [
            {
              key: SORT_BY_FROM_WALLET,
              value: !el.up,
            },
          ];
          TransactionHistorySortFrom({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
            isMobile: true,
          });
          this.updateTimer();
        } else if (val === "to") {
          obj = [
            {
              key: SORT_BY_TO_WALLET,
              value: !el.up,
            },
          ];
          TransactionHistorySortTo({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
            isMobile: true,
          });
          this.updateTimer();
        } else if (val === "asset") {
          obj = [
            {
              key: SORT_BY_ASSET,
              value: !el.up,
            },
          ];
          TransactionHistorySortAsset({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
            isMobile: true,
          });
          this.updateTimer();
        } else if (val === "amount") {
          obj = [
            {
              key: SORT_BY_AMOUNT,
              value: !el.up,
            },
          ];
          TransactionHistorySortAmount({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
            isMobile: true,
          });
          this.updateTimer();
        } else if (val === "usdThen") {
          obj = [
            {
              key: SORT_BY_USD_VALUE_THEN,
              value: !el.up,
            },
          ];
          TransactionHistorySortUSDAmount({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
            isMobile: true,
          });
          this.updateTimer();
        } else if (val === "usdTransaction") {
          obj = [
            {
              key: SORT_BY_TRANSACTION_FEE,
              value: !el.up,
            },
          ];
          TransactionHistorySortUSDFee({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
            isMobile: true,
          });
          this.updateTimer();
        } else if (val === "method") {
          obj = [
            {
              key: SORT_BY_METHOD,
              value: !el.up,
            },
          ];
          TransactionHistorySortMethod({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
            isMobile: true,
          });
          this.updateTimer();
        }
        el.up = !el.up;
      } else {
        el.up = false;
      }
    });
    if (obj && obj.length > 0) {
      obj = [{ key: obj[0].key, value: !obj[0].value }];
    }
    this.setState({
      sort: obj,
      tableSortOpt: sort,
    });
  };
  searchIconLoaded = () => {
    this.setState({
      showSearchIcon: true,
    });
  };

  toggleAgeTimestamp = () => {
    this.setState({
      isShowingAge: !this.state.isShowingAge,
    });
  };

  shareIconLoaded = () => {
    this.setState({
      showShareIcon: true,
    });
  };
  hideThePopupModal = () => {
    window.sessionStorage.setItem("mobileHomePagePopupModalHidden", true);
    this.setState({
      showPopupModal: false,
    });
  };
  startPageView = () => {
    this.setState({ startTime: new Date() * 1 });
    MobileHomePageView({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    // Inactivity Check
    window.checkMobileHomeTimer = setInterval(() => {
      this.checkForInactivity();
    }, 900000);
  };
  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.intelligenceState.Average_cost_basis !==
      this.props.intelligenceState.Average_cost_basis
    ) {
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
        tempcombinedUnrealizedGains = this.props.intelligenceState?.total_gain;
      }

      this.setState({
        combinedCostBasis: tempcombinedCostBasis,
        combinedCurrentValue: tempcombinedCurrentValue,
        combinedUnrealizedGains: tempcombinedUnrealizedGains,
        combinedReturn: tempcombinedReturn,
      });
    }

    if (
      prevState.condition !== this.state.condition ||
      prevState.sort !== this.state.sort
    ) {
      this.callApi(this.state.currentPage || START_INDEX);
      this.props.getFilters(this);
    }

    const prevParams = new URLSearchParams(prevProps.location.search);
    const prevPage = parseInt(prevParams.get("p") || START_INDEX, 10);

    const params = new URLSearchParams(this.props.location.search);
    const page = parseInt(params.get("p") || START_INDEX, 10);

    if (
      prevPage !== page ||
      prevState.condition !== this.state.condition ||
      prevState.sort !== this.state.sort ||
      prevState.pageLimit !== this.state.pageLimit
    ) {
      this.callApi(page);
      this.props.getFilters(this);
      this.setState({
        currentPage: page,
      });
      if (prevPage !== page) {
        if (prevPage - 1 === page) {
          TransactionHistoryPageBack({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
            page_no: page + 1,
            isMobile: true,
          });
          this.updateTimer();
        } else if (prevPage + 1 === page) {
          TransactionHistoryPageNext({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
            page_no: page + 1,
            isMobile: true,
          });
          this.updateTimer();
        } else {
          TransactionHistoryPageSearch({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
            page_search: page + 1,
            isMobile: true,
          });
          this.updateTimer();
        }
      }
    }
  }
  componentDidMount() {
    if (this.props.intelligenceState.Average_cost_basis) {
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
        tempcombinedUnrealizedGains = this.props.intelligenceState?.total_gain;
      }

      this.setState({
        combinedCostBasis: tempcombinedCostBasis,
        combinedCurrentValue: tempcombinedCurrentValue,
        combinedUnrealizedGains: tempcombinedUnrealizedGains,
        combinedReturn: tempcombinedReturn,
      });
    }
    getAllCurrencyRatesApi();
    const tempIsModalPopuRemoved = window.sessionStorage.getItem(
      "mobileHomePagePopupModalHidden"
    );
    if (tempIsModalPopuRemoved) {
      this.setState({
        showPopupModal: false,
      });
    }
    // window.scrollTo(0, 0);
    // setTimeout(() => {
    //   window.scrollTo(0, 0);
    // }, 500);

    this.callApi(this.state.currentPage || START_INDEX);
    this.props.getFilters(this);

    this.startPageView();
    this.updateTimer(true);

    setTimeout(() => {
      const walletList = JSON.parse(window.sessionStorage.getItem("addWallet"));
      const address = walletList?.map((wallet) => {
        return wallet.address;
      });
      const cond = [
        {
          key: SEARCH_BY_WALLET_ADDRESS_IN,
          value: address,
        },
        { key: SEARCH_BY_NOT_DUST, value: true },
      ];
      this.setState({
        condition: cond || [],
        walletList: walletList || [],
      });
    }, 1500);
    return () => {
      clearInterval(window.checkMobileHomeTimer);
    };
  }
  updateTimer = (first) => {
    const tempExistingExpiryTime = window.sessionStorage.getItem(
      "mobileHomePageExpiryTime"
    );
    if (!tempExistingExpiryTime && !first) {
      this.startPageView();
    }
    const tempExpiryTime = Date.now() + 1800000;
    window.sessionStorage.setItem("mobileHomePageExpiryTime", tempExpiryTime);
  };
  callApi = (page = START_INDEX) => {
    this.setState({ tableLoading: true });
    let data = new URLSearchParams();
    data.append("start", page * API_LIMIT);
    data.append("conditions", JSON.stringify(this.state.condition));
    data.append("limit", API_LIMIT);
    data.append("sorts", JSON.stringify(this.state.sort));
    if (
      this.state.condition.find((e) => e.key === SEARCH_BY_WALLET_ADDRESS_IN)
        ?.value
    ) {
      this.props.searchTransactionApi(data, this, page);
    }
  };
  handleFunction = (badge) => {
    if (badge && badge.length > 0) {
      const tempArr = [];
      if (badge[0].name !== "All") {
        badge.forEach((resData) => tempArr.push(resData.id));
      }
      this.addCondition(
        SEARCH_BY_CHAIN_IN,
        tempArr && tempArr.length > 0 ? tempArr : "allNetworks"
      );
    }
  };

  endPageView = () => {
    clearInterval(window.checkMobileHomeTimer);
    window.sessionStorage.removeItem("mobileHomePageExpiryTime");
    if (this.state.startTime) {
      let endTime = new Date() * 1;
      let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
      TimeSpentMobileHome({
        time_spent: TimeSpent,
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
    }
  };
  copyContent = (text) => {
    // const text = props.display_address ? props.display_address : props.wallet_account_number
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Copied");
      })
      .catch(() => {
        console.log("something went wrong");
      });
    // toggleCopied(true)
  };
  checkForInactivity = () => {
    const tempExpiryTime = window.sessionStorage.getItem(
      "mobileHomePageExpiryTime"
    );
    if (tempExpiryTime && tempExpiryTime < Date.now()) {
      this.endPageView();
    }
  };
  componentWillUnmount() {
    const tempExpiryTime = window.sessionStorage.getItem(
      "mobileHomePageExpiryTime"
    );
    if (tempExpiryTime) {
      this.endPageView();
    }
  }
  handleDust = () => {
    this.setState({
      showHideDustVal: !this.state.showHideDustVal,
    });
    CostHideDustMobile({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    this.updateTimer();
  };

  handleDustTrans = () => {
    const d = this.state.condition.find(
      (e) => e.key === SEARCH_BY_WALLET_ADDRESS_IN
    );
    const arr = [];
    for (var i of this.state.condition) {
      if(i.key ===SEARCH_BY_NOT_DUST){
        const obj = {
          key: SEARCH_BY_NOT_DUST,
          value: !this.state.showHideDustValTrans,
        }
        arr.push(obj)
      }
      else{
        arr.push(i)
      }

    }
    this.setState({
      showHideDustValTrans: !this.state.showHideDustValTrans,


      condition: arr,
    });

    TransactionHistoryHideDust({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      isMobile: true,
    });
    this.updateTimer();
  };
  handleShare = () => {
    Mobile_Home_Share({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    let lochUser = getCurrentUser().id;
    let userWallet = JSON.parse(window.sessionStorage.getItem("addWallet"));
    let slink =
      userWallet?.length === 1
        ? userWallet[0].displayAddress || userWallet[0].address
        : lochUser;
    let shareLink = BASE_URL_S3 + "home/" + slink + "?redirect=home";
    // navigator.clipboard.writeText(shareLink);
    this.copyTextToClipboard(shareLink);

    // HomeShare({
    //   session_id: getCurrentUser().id,
    //   email_address: getCurrentUser().email,
    // });
  };
  addCondition = (key, value) => {
    if (key === "SEARCH_BY_TIMESTAMP_IN") {
      const tempIsTimeUsed = this.state.isTimeSearchUsed;
      TransactionHistoryYearFilter({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        year_filter: value === "allYear" ? "All years" : value,
        isSearchUsed: tempIsTimeUsed,
        isMobile: true,
      });
      this.updateTimer();
      this.setState({ isTimeSearchUsed: false, selectedTimes: value });
    } else if (key === "SEARCH_BY_ASSETS_IN") {
      let assets = [];

      Promise.all([
        new Promise((resolve) => {
          if (value !== "allAssets") {
            this.props.intelligenceState?.assetFilter?.map((e) => {
              if (value?.includes(e.value)) {
                assets.push(e.label);
              }
            });
          }
          resolve(); // Resolve the promise once the code execution is finished
        }),
      ]).then(() => {
        const tempIsAssetUsed = this.state.isAssetSearchUsed;
        TransactionHistoryAssetFilter({
          session_id: getCurrentUser().id,
          email_address: getCurrentUser().email,
          asset_filter: value === "allAssets" ? "All assets" : assets,
          isSearchUsed: tempIsAssetUsed,
          isMobile: true,
        });
        this.updateTimer();
        this.setState({ isAssetSearchUsed: false, selectedAssets: value });
      });
    } else if (key === "SEARCH_BY_METHOD_IN") {
      this.setState({ selectedMethods: value });
    } else if (key === "SEARCH_BY_CHAIN_IN") {
      const tempIsNetworkUsed = this.state.isNetworkSearchUsed;
      TransactionHistoryNetworkFilter({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        network_filter: value === "allNetworks" ? "All networks" : value,
        isSearchUsed: tempIsNetworkUsed,
        isMobile: true,
      });
      this.updateTimer();
      this.setState({ isNetworkSearchUsed: false, selectedNetworks: value });
    }
    let index = this.state.condition.findIndex((e) => e.key === key);

    let arr = [...this.state.condition];
    let search_index = this.state.condition.findIndex(
      (e) => e.key === SEARCH_BY_TEXT
    );
    if (
      index !== -1 &&
      value !== "allAssets" &&
      value !== "allMethod" &&
      value !== "allYear" &&
      value !== "allNetworks" &&
      value !== "allAmounts"
    ) {
      arr[index].value = value;
    } else if (
      value === "allAssets" ||
      value === "allMethod" ||
      value === "allYear" ||
      value === "allNetworks" ||
      value === "allAmounts"
    ) {
      if (index !== -1) {
        arr.splice(index, 1);
      }
    } else {
      let obj = {};
      obj = {
        key: key,
        value: value,
      };
      arr.push(obj);
    }
    if (search_index !== -1) {
      if (value === "" && key === SEARCH_BY_TEXT) {
        arr.splice(search_index, 1);
      }
    }
    // On Filter start from page 0
    this.props.history.replace({
      search: `?p=${START_INDEX}`,
    });
    this.setState({
      condition: arr,
    });
  };
  handleAmount = (min, max) => {
    if (!isNaN(min) && !isNaN(max)) {
      this.setState(
        {
          minAmount: min,
          maxAmount: max,
        },
        () => {
          const value = { min_value: Number(min), max_value: Number(max) };
          this.addCondition(SEARCH_BETWEEN_VALUE, value);
        }
      );
    }
  };
  timeSearchIsUsed = () => {
    this.setState({ isTimeSearchUsed: true });
  };
  assetSearchIsUsed = () => {
    this.setState({ isAssetSearchUsed: true });
  };
  networkSearchIsUsed = () => {
    this.setState({ isNetworkSearchUsed: true });
  };
  async copyTextToClipboard(text) {
    if ("clipboard" in navigator) {
      toast.success("Link copied");
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  }
  onChangeMethod = () => {
    clearTimeout(this.delayTimer);
    this.delayTimer = setTimeout(() => {
      this.addCondition(SEARCH_BY_TEXT, this.state.search);
      TransactionHistorySearch({
        session_id: getCurrentUser().id,
        email: getCurrentUser().email,
        searched: this.state.search,
        isMobile: true,
      });
      this.updateTimer();
      // this.callApi(this.state.currentPage || START_INDEX, condition)
    }, 1000);
  };
  goToWelcome = () => {
    Mobile_Home_Search_New_Address({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    this.props.history.push("/welcome?FromMobileHome=true");
  };
  render() {
    const { currency } = this.state;
    const { assetPriceList, table, totalPage } = this.props.intelligenceState;

    let tableDataTransaction =
      table &&
      table?.map((row) => {
        let walletFromData = null;
        let walletToData = null;

        this.state.walletList &&
          this.state.walletList?.map((wallet) => {
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
          age: row.age,
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
            // wallet_metaData: row.to_wallet.wallet_metaData,
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
          amount: {
            value: parseFloat(row.asset.value),
            id: row.asset.id,
          },
          usdValueThen: {
            value: row.asset.value,
            id: row.asset.id,
            assetPrice: row.asset_price,
          },
          usdValueToday: {
            value: row.asset.value,
            id: row.asset.id,
          },
          usdTransactionFee: {
            value: row.transaction_fee,
            id: row.asset.id,
          },
          // method: row.transaction_type
          method: row.method,
          hash: row.transaction_id,
          network: row.chain.name,
        };
      });

    const columnListTransaction = [
      {
        labelName: (
          <div className="cp history-table-header-col" id="time">
            <span
              onClick={() => {
                this.toggleAgeTimestamp();
              }}
              className="inter-display-medium f-s-13 lh-16 grey-4F4"
              style={{
                textDecoration: "underline",
              }}
            >
              {this.state.isShowingAge ? "Age" : "Timestamp"}
            </span>
            <Image
              onClick={() => this.handleTableSort("time")}
              src={sortByIcon}
              className={
                this.state.tableSortOpt[0].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "time",

        coumnWidth: 0.225,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "time") {
            let tempVal = "-";
            let tempOpp = "-";
            if (this.state.isShowingAge && rowData.age) {
              tempVal = rowData.age;
              tempOpp = moment(rowData.time).format("MM/DD/YY hh:mm:ss");
            } else if (!this.state.isShowingAge && rowData.time) {
              tempVal = moment(rowData.time).format("MM/DD/YY hh:mm:ss");
              tempOpp = rowData.age;
            }
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={tempOpp ? tempOpp : "-"}
              >
                <span>{tempVal}</span>
              </CustomOverlay>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col"
            id="from"
            onClick={() => this.handleTableSort("from")}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              From
            </span>
            <Image
              src={sortByIcon}
              className={
                this.state.tableSortOpt[1].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "from",

        coumnWidth: 0.125,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "from") {
            let showThis = "";
            if (rowData.from?.metaData?.nickname) {
              showThis = TruncateText(rowData.from?.metaData?.nickname);
            } else if (rowData.from?.wallet_metaData?.text) {
              showThis = TruncateText(rowData.from?.wallet_metaData.text);
            } else if (rowData.from?.metaData?.displayAddress) {
              showThis = TruncateText(rowData.from?.metaData?.displayAddress);
            } else if (rowData.from?.address) {
              showThis = TruncateText(rowData.from?.address);
            }
            const goToAddress = () => {
              let slink = rowData.from?.address;
              if (slink) {
                let shareLink =
                  BASE_URL_S3 + "home/" + slink + "?redirect=home";
                TransactionHistoryWalletClicked({
                  session_id: getCurrentUser().id,
                  email_address: getCurrentUser().email,
                  wallet: slink,
                  isMobile: true,
                });
                window.open(shareLink, "_blank", "noreferrer");
              }
            };
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                // text={rowData.from?.address}
                text={
                  // rowData.from?.wallet_metaData?.text
                  //   ? rowData.from?.wallet_metaData?.text +
                  //     ": " +
                  //     rowData.from?.address
                  //   : rowData.from?.metaData?.displayAddress &&
                  //     rowData.from?.metaData?.displayAddress !==
                  //       rowData.from?.address
                  //   ? rowData.from?.metaData?.displayAddress +
                  //     ": " +
                  //     rowData.from?.address
                  //   : rowData.from?.metaData?.nickname
                  //   ? rowData.from?.metaData?.nickname +
                  //     ": " +
                  //     (rowData.from?.wallet_metaData?.text ?
                  //       (rowData.from?.wallet_metaData?.text + ": "):"") +
                  //     ((rowData.from?.metaData?.displayAddress &&
                  //       rowData.from?.metaData?.displayAddress !==
                  //         rowData.from?.address) ? (rowData.from?.metaData?.displayAddress + ": ") : "") +
                  //     rowData.from?.address
                  //   : rowData.from?.address
                  (rowData.from?.metaData?.nickname
                    ? rowData.from?.metaData?.nickname + ": "
                    : "") +
                  (rowData.from?.wallet_metaData?.text
                    ? rowData.from?.wallet_metaData?.text + ": "
                    : "") +
                  (rowData.from?.metaData?.displayAddress &&
                  rowData.from?.metaData?.displayAddress !==
                    rowData.from?.address
                    ? rowData.from?.metaData?.displayAddress + ": "
                    : "") +
                  rowData.from?.address
                }
              >
                {rowData.from?.metaData?.wallet_metaData ? (
                  <span>
                    <span onClick={goToAddress} className="top-account-address">
                      {showThis}
                    </span>

                    <Image
                      src={CopyClipboardIcon}
                      onClick={() => {
                        this.copyContent(rowData.from.address);
                        TransactionHistoryAddressCopied({
                          session_id: getCurrentUser().id,
                          email_address: getCurrentUser().email,
                          address_copied: rowData.from.address,
                          isMobile: true,
                        });
                        this.updateTimer();
                      }}
                      className="m-l-10 cp copy-icon"
                      style={{ width: "1rem" }}
                    />
                  </span>
                ) : rowData.from?.wallet_metaData.symbol ||
                  rowData.from?.wallet_metaData.text ||
                  rowData.from?.metaData?.nickname ? (
                  rowData.from?.wallet_metaData.symbol ? (
                    <span>
                      <span
                        onClick={goToAddress}
                        className="top-account-address"
                      >
                        {showThis}
                      </span>

                      <Image
                        src={CopyClipboardIcon}
                        onClick={() => {
                          this.copyContent(rowData.from.address);
                          TransactionHistoryAddressCopied({
                            session_id: getCurrentUser().id,
                            email_address: getCurrentUser().email,
                            address_copied: rowData.from.address,
                            isMobile: true,
                          });
                          this.updateTimer();
                        }}
                        className="m-l-10 cp copy-icon"
                        style={{ width: "1rem" }}
                      />
                    </span>
                  ) : rowData.from?.metaData?.nickname ? (
                    <span>
                      <span
                        onClick={goToAddress}
                        className="top-account-address"
                      >
                        {TruncateText(rowData.from?.metaData?.nickname)}
                      </span>
                      <Image
                        src={CopyClipboardIcon}
                        onClick={() => {
                          this.copyContent(rowData.from.address);
                          TransactionHistoryAddressCopied({
                            session_id: getCurrentUser().id,
                            email_address: getCurrentUser().email,
                            address_copied: rowData.from.address,
                            isMobile: true,
                          });
                          this.updateTimer();
                        }}
                        className="m-l-10 cp copy-icon"
                        style={{ width: "1rem" }}
                      />
                    </span>
                  ) : (
                    <span>
                      <span
                        onClick={goToAddress}
                        className="top-account-address"
                      >
                        {TruncateText(rowData.from?.wallet_metaData.text)}
                      </span>
                      <Image
                        src={CopyClipboardIcon}
                        onClick={() => {
                          this.copyContent(rowData.from.address);
                          TransactionHistoryAddressCopied({
                            session_id: getCurrentUser().id,
                            email_address: getCurrentUser().email,
                            address_copied: rowData.from.address,
                            isMobile: true,
                          });
                          this.updateTimer();
                        }}
                        className="m-l-10 cp copy-icon"
                        style={{ width: "1rem" }}
                      />
                    </span>
                  )
                ) : rowData.from?.metaData?.displayAddress ? (
                  <span>
                    <span onClick={goToAddress} className="top-account-address">
                      {TruncateText(rowData.from?.metaData?.displayAddress)}
                    </span>
                    <Image
                      src={CopyClipboardIcon}
                      onClick={() => {
                        this.copyContent(rowData.from.address);
                        TransactionHistoryAddressCopied({
                          session_id: getCurrentUser().id,
                          email_address: getCurrentUser().email,
                          address_copied: rowData.from.address,
                          isMobile: true,
                        });
                        this.updateTimer();
                      }}
                      className="m-l-10 cp copy-icon"
                      style={{ width: "1rem" }}
                    />
                  </span>
                ) : (
                  <span>
                    <span onClick={goToAddress} className="top-account-address">
                      {showThis}
                    </span>

                    <Image
                      src={CopyClipboardIcon}
                      onClick={() => {
                        this.copyContent(rowData.from.address);
                        TransactionHistoryAddressCopied({
                          session_id: getCurrentUser().id,
                          email_address: getCurrentUser().email,
                          address_copied: rowData.from.address,
                          isMobile: true,
                        });
                        this.updateTimer();
                      }}
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
            onClick={() => this.handleTableSort("to")}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              To
            </span>
            <Image
              src={sortByIcon}
              className={
                this.state.tableSortOpt.find((s) => s.title == "to").up
                  ? "rotateDown"
                  : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "to",

        coumnWidth: 0.125,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "to") {
            let showThis = "";
            if (rowData.to?.metaData?.nickname) {
              showThis = TruncateText(rowData.to?.metaData?.nickname);
            } else if (rowData.to?.wallet_metaData?.text) {
              showThis = TruncateText(rowData.to?.wallet_metaData?.text);
            } else if (rowData.to?.metaData?.displayAddress) {
              showThis = TruncateText(rowData.to?.metaData?.displayAddress);
            } else if (rowData.to?.address) {
              showThis = TruncateText(rowData.to?.address);
            }
            const goToAddress = () => {
              let slink = rowData.to?.address;
              if (slink) {
                let shareLink =
                  BASE_URL_S3 + "home/" + slink + "?redirect=home";
                TransactionHistoryWalletClicked({
                  session_id: getCurrentUser().id,
                  email_address: getCurrentUser().email,
                  wallet: slink,
                  isMobile: true,
                });
                window.open(shareLink, "_blank", "noreferrer");
              }
            };
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={
                  (rowData.to?.metaData?.nickname
                    ? rowData.to?.metaData?.nickname + ": "
                    : "") +
                  (rowData.to?.wallet_metaData?.text
                    ? rowData.to?.wallet_metaData?.text + ": "
                    : "") +
                  (rowData.to?.metaData?.displayAddress &&
                  rowData.to?.metaData?.displayAddress !== rowData.to?.address
                    ? rowData.to?.metaData?.displayAddress + ": "
                    : "") +
                  rowData.to?.address
                  // rowData.to?.wallet_metaData?.text
                  //   ? rowData.to?.wallet_metaData?.text +
                  //     ": " +
                  //     rowData.to?.address
                  //   : rowData.to?.metaData?.displayAddress &&
                  //     rowData.to?.metaData?.displayAddress !== rowData.to?.address
                  //   ? rowData.to?.metaData?.displayAddress +
                  //     ": " +
                  //     rowData.to?.address
                  //   : rowData.to?.metaData?.nickname
                  //   ? (rowData.to?.metaData?.nickname ? rowData.to?.metaData?.nickname +
                  //     ": " : "") +
                  //     (rowData.to?.wallet_metaData?.text
                  //       ? rowData.to?.wallet_metaData?.text + ": "
                  //       : "") +
                  //     (rowData.to?.metaData?.displayAddress &&
                  //     rowData.to?.metaData?.displayAddress !== rowData.to?.address
                  //       ? rowData.to?.metaData?.displayAddress + ": "
                  //       : "") +
                  //     rowData.to?.address
                  //   : rowData.to?.address
                }
              >
                {rowData.to?.metaData?.wallet_metaData ? (
                  <span>
                    <span onClick={goToAddress} className="top-account-address">
                      {showThis}
                    </span>
                    <Image
                      src={CopyClipboardIcon}
                      onClick={() => {
                        this.copyContent(rowData.to.address);
                        TransactionHistoryAddressCopied({
                          session_id: getCurrentUser().id,
                          email_address: getCurrentUser().email,
                          address_copied: rowData.to.address,
                          isMobile: true,
                        });
                        this.updateTimer();
                      }}
                      className="m-l-10 cp copy-icon"
                      style={{ width: "1rem" }}
                    />
                  </span>
                ) : rowData.to?.wallet_metaData.symbol ||
                  rowData.to?.wallet_metaData.text ||
                  rowData.to?.metaData?.nickname ? (
                  rowData.to?.wallet_metaData.symbol ? (
                    <span>
                      <span
                        onClick={goToAddress}
                        className="top-account-address"
                      >
                        {showThis}
                      </span>
                      <Image
                        src={CopyClipboardIcon}
                        onClick={() => {
                          this.copyContent(rowData.to.address);
                          TransactionHistoryAddressCopied({
                            session_id: getCurrentUser().id,
                            email_address: getCurrentUser().email,
                            address_copied: rowData.to.address,
                            isMobile: true,
                          });
                          this.updateTimer();
                        }}
                        className="m-l-10 cp copy-icon"
                        style={{ width: "1rem" }}
                      />
                    </span>
                  ) : rowData.to?.metaData?.nickname ? (
                    <span>
                      <span
                        onClick={goToAddress}
                        className="top-account-address"
                      >
                        {TruncateText(rowData.to?.metaData?.nickname)}
                      </span>
                      <Image
                        src={CopyClipboardIcon}
                        onClick={() => {
                          this.copyContent(rowData.to.address);
                          TransactionHistoryAddressCopied({
                            session_id: getCurrentUser().id,
                            email_address: getCurrentUser().email,
                            address_copied: rowData.to.address,
                            isMobile: true,
                          });
                          this.updateTimer();
                        }}
                        className="m-l-10 cp copy-icon"
                        style={{ width: "1rem" }}
                      />
                    </span>
                  ) : (
                    <span>
                      <span
                        onClick={goToAddress}
                        className="top-account-address"
                      >
                        {TruncateText(rowData.to?.wallet_metaData.text)}
                      </span>
                      <Image
                        src={CopyClipboardIcon}
                        onClick={() => {
                          this.copyContent(rowData.to.address);
                          TransactionHistoryAddressCopied({
                            session_id: getCurrentUser().id,
                            email_address: getCurrentUser().email,
                            address_copied: rowData.to.address,
                            isMobile: true,
                          });
                          this.updateTimer();
                        }}
                        className="m-l-10 cp copy-icon"
                        style={{ width: "1rem" }}
                      />
                    </span>
                  )
                ) : rowData.to?.metaData?.displayAddress ? (
                  <span>
                    <span onClick={goToAddress} className="top-account-address">
                      {TruncateText(rowData.to?.metaData?.displayAddress)}
                    </span>
                    <Image
                      src={CopyClipboardIcon}
                      onClick={() => {
                        this.copyContent(rowData.to.address);
                        TransactionHistoryAddressCopied({
                          session_id: getCurrentUser().id,
                          email_address: getCurrentUser().email,
                          address_copied: rowData.to.address,
                          isMobile: true,
                        });
                        this.updateTimer();
                      }}
                      className="m-l-10 cp copy-icon"
                      style={{ width: "1rem" }}
                    />
                  </span>
                ) : (
                  <span>
                    <span onClick={goToAddress} className="top-account-address">
                      {showThis}
                    </span>
                    <Image
                      src={CopyClipboardIcon}
                      onClick={() => {
                        this.copyContent(rowData.to.address);
                        TransactionHistoryAddressCopied({
                          session_id: getCurrentUser().id,
                          email_address: getCurrentUser().email,
                          address_copied: rowData.to.address,
                          isMobile: true,
                        });
                        this.updateTimer();
                      }}
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
            onClick={() => this.handleTableSort("asset")}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Asset
            </span>
            <Image
              src={sortByIcon}
              className={
                this.state.tableSortOpt.find((s) => s.title == "asset").up
                  ? "rotateDown"
                  : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "asset",

        coumnWidth: 0.125,
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
                {/* <CoinChip
                                  coin_img_src={rowData.asset.symbol}
                                  // coin_code={rowData.asset.code}
                              /> */}
                <Image src={rowData.asset.symbol} className="asset-symbol" />
              </CustomOverlay>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col"
            id="amount"
            onClick={() => this.handleTableSort("amount")}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Amount
            </span>
            <Image
              src={sortByIcon}
              className={
                this.state.tableSortOpt.find((s) => s.title == "amount").up
                  ? "rotateDown"
                  : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "amount",

        coumnWidth: 0.125,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "amount") {
            // return rowData.amount.value?.toFixed(2)
            const tempAmountVal = convertNtoNumber(rowData.amount?.value);
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={tempAmountVal ? tempAmountVal : "0.00"}
              >
                <div className="inter-display-medium f-s-13 lh-16 grey-313 ellipsis-div">
                  {numToCurrency(tempAmountVal).toLocaleString("en-US")}
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
            id="usdValueThen"
            onClick={() => this.handleTableSort("usdThen")}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">{`${CurrencyType(
              true
            )} amount (then)`}</span>
            <Image
              src={sortByIcon}
              className={
                this.state.tableSortOpt.find((s) => s.title == "usdThen").up
                  ? "rotateDown"
                  : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "usdValueThen",

        className: "usd-value",
        coumnWidth: 0.225,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "usdValueThen") {
            let chain = Object.entries(assetPriceList);
            let valueThen;
            let valueToday;
            chain.find((chain) => {
              if (chain[0] === rowData.usdValueToday.id) {
                valueToday =
                  rowData.usdValueToday.value *
                    chain[1].quote.USD.price *
                    currency?.rate || DEFAULT_PRICE;
              }
              if (chain[0] === rowData.usdValueThen.id) {
                valueThen =
                  rowData.usdValueThen.value *
                  rowData.usdValueThen.assetPrice *
                  currency?.rate;
              }
            });
            const tempValueToday = convertNtoNumber(valueToday);
            const tempValueThen = convertNtoNumber(valueThen);
            return (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <CustomOverlay
                  position="top"
                  isIcon={false}
                  isInfo={true}
                  isText={true}
                  text={
                    tempValueToday && tempValueToday !== "0"
                      ? CurrencyType(false) + tempValueToday
                      : CurrencyType(false) + "0.00"
                  }
                >
                  <div className="inter-display-medium f-s-13 lh-16 grey-313 ellipsis-div">
                    {CurrencyType(false) +
                      numToCurrency(tempValueToday).toLocaleString("en-US")}
                  </div>
                </CustomOverlay>
                <span style={{ padding: "2px" }}></span>(
                <CustomOverlay
                  position="top"
                  isIcon={false}
                  isInfo={true}
                  isText={true}
                  text={
                    tempValueThen
                      ? CurrencyType(false) + tempValueThen
                      : CurrencyType(false) + "0.00"
                  }
                >
                  <div className="inter-display-medium f-s-13 lh-16 grey-313 ellipsis-div">
                    {tempValueThen
                      ? CurrencyType(false) +
                        numToCurrency(tempValueThen).toLocaleString("en-US")
                      : CurrencyType(false) + "0.00"}
                  </div>
                </CustomOverlay>
                )
              </div>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col"
            id="method"
            onClick={() => this.handleTableSort("method")}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Method
            </span>
            <Image
              src={sortByIcon}
              className={
                this.state.tableSortOpt.find((s) => s.title == "method").up
                  ? "rotateDown"
                  : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "method",

        coumnWidth: 0.15,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "method") {
            return (
              <>
                {rowData.method &&
                (rowData.method.toLowerCase() === "send" ||
                  rowData.method.toLowerCase() === "receive") ? (
                  <div className="gainLossContainer">
                    <div
                      className={`gainLoss ${
                        rowData.method.toLowerCase() === "send"
                          ? "loss"
                          : "gain"
                      }`}
                    >
                      <span className="text-capitalize inter-display-medium f-s-13 lh-16 grey-313">
                        {rowData.method}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-capitalize inter-display-medium f-s-13 lh-16 black-191 history-table-method transfer ellipsis-div">
                    {rowData.method}
                  </div>
                )}
              </>
            );
          }
        },
      },
      {
        labelName: (
          <div className="cp history-table-header-col" id="network">
            Network
            {/* <Image
                src={sortByIcon}
                className={
                  this.state.tableSortOpt[7].up ? "rotateDown" : "rotateUp"
                }
              /> */}
          </div>
        ),
        dataKey: "network",

        className: "usd-value",
        coumnWidth: 0.225,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "network") {
            return (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <CustomOverlay
                  position="top"
                  isIcon={false}
                  isInfo={true}
                  isText={true}
                  text={rowData.network}
                >
                  <div className="inter-display-medium f-s-13 lh-16 grey-313 ellipsis-div dotDotText">
                    {rowData.network}
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
            id="hash"
            // onClick={() => this.handleTableSort("hash")}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Hash
            </span>
            {/* <Image
                src={sortByIcon}
                className={
                  this.state.tableSortOpt.find(s=>s.title=='hash').up ? "rotateDown" : "rotateUp"
                }
              /> */}
          </div>
        ),
        dataKey: "hash",

        coumnWidth: 0.125,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "hash") {
            // return rowData.hash.value?.toFixed(2)
            const tempHashVal = TruncateText(rowData.hash);
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={rowData.hash ? rowData.hash : ""}
              >
                <div className="inter-display-medium f-s-13 lh-16 grey-313 ellipsis-div">
                  {tempHashVal}
                  <Image
                    src={CopyClipboardIcon}
                    onClick={() => {
                      this.copyContent(rowData.hash);
                      TransactionHistoryHashCopied({
                        session_id: getCurrentUser().id,
                        email_address: getCurrentUser().email,
                        hash_copied: rowData.hash,
                        isMobile: true,
                      });
                      this.updateTimer();
                    }}
                    className="m-l-10 cp copy-icon"
                    style={{ width: "1rem" }}
                  />
                </div>
              </CustomOverlay>
            );
          }
        },
      },
    ];

    const columnData = [
      // {
      //   labelName: "",
      //   dataKey: "Numbering",
      //   coumnWidth: 0.05,
      //   isCell: true,
      //   cell: (rowData, dataKey, index) => {
      //     if (dataKey === "Numbering" && index > -1) {
      //       return (
      //         <span className="inter-display-medium f-s-13">
      //           {Number(noExponents(index + 1)).toLocaleString("en-US")}
      //         </span>
      //       );
      //     }
      //   },
      // },
      {
        labelName: (
          <div
            className="cp history-table-header-col"
            id="Asset"
            // onClick={() => this.handleSort(this.state.sortBy[0])}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Asset
            </span>
          </div>
        ),
        dataKey: "Asset",

        coumnWidth: 0.137,
        isCell: true,
        cell: (rowData, dataKey, dataIndex) => {
          if (dataKey === "Asset") {
            if (dataIndex === 0) {
              return <span>Total:</span>;
            }
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={rowData?.AssetCode ? rowData?.AssetCode : ""}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <CoinChip
                    coin_img_src={rowData.Asset}
                    coin_code={rowData.AssetCode}
                    chain={rowData?.chain}
                  />
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
            // onClick={() => this.handleSort(this.state.sortBy[1])}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Avg cost price
            </span>
          </div>
        ),
        dataKey: "AverageCostPrice",

        coumnWidth: 0.137,
        isCell: true,
        cell: (rowData, dataKey, dataIndex) => {
          if (dataKey === "AverageCostPrice") {
            if (dataIndex === 0) {
              return "";
            }
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={
                  !rowData.AverageCostPrice || rowData.AverageCostPrice === 0
                    ? "N/A"
                    : CurrencyType(false) +
                      Number(
                        noExponents(rowData.AverageCostPrice.toFixed(2))
                      ).toLocaleString("en-US")
                }
              >
                <span className="inter-display-medium f-s-13 lh-16 grey-313">
                  {!rowData.AverageCostPrice || rowData.AverageCostPrice === 0
                    ? "N/A"
                    : CurrencyType(false) +
                      numToCurrency(
                        rowData.AverageCostPrice.toFixed(2)
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
            id="Current Price"
            // onClick={() => this.handleSort(this.state.sortBy[2])}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Current price
            </span>
          </div>
        ),
        dataKey: "CurrentPrice",

        coumnWidth: 0.137,
        isCell: true,
        cell: (rowData, dataKey, dataIndex) => {
          if (dataKey === "CurrentPrice") {
            if (dataIndex === 0) {
              return "";
            }
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={
                  rowData.CurrentPrice
                    ? CurrencyType(false) +
                      Number(
                        noExponents(rowData.CurrentPrice.toFixed(2))
                      ).toLocaleString("en-US")
                    : "N/A"
                }
              >
                <span className="inter-display-medium f-s-13 lh-16 grey-313">
                  {rowData.CurrentPrice
                    ? CurrencyType(false) +
                      numToCurrency(
                        rowData.CurrentPrice.toFixed(2)
                      ).toLocaleString("en-US")
                    : "N/A"}
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
            id="Amount"
            // onClick={() => this.handleSort(this.state.sortBy[3])}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Amount
            </span>
          </div>
        ),
        dataKey: "Amount",

        coumnWidth: 0.137,
        isCell: true,
        cell: (rowData, dataKey, dataIndex) => {
          if (dataKey === "Amount") {
            if (dataIndex === 0) {
              return "";
            }
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={
                  rowData.Amount
                    ? Number(noExponents(rowData.Amount)).toLocaleString(
                        "en-US"
                      )
                    : 0.0
                }
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
            // onClick={() => this.handleSort(this.state.sortBy[4])}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Cost basis
            </span>
          </div>
        ),
        dataKey: "CostBasis",

        coumnWidth: 0.13,
        isCell: true,
        cell: (rowData, dataKey, dataIndex) => {
          if (dataKey === "CostBasis") {
            if (dataIndex === 0) {
              return (
                <CustomOverlay
                  position="top"
                  isIcon={false}
                  isInfo={true}
                  isText={true}
                  text={
                    !this.state.combinedCostBasis ||
                    this.state.combinedCostBasis === 0
                      ? "N/A"
                      : CurrencyType(false) +
                        Number(
                          noExponents(this.state.combinedCostBasis.toFixed(2))
                        ).toLocaleString("en-US")
                  }
                >
                  <div className="cost-common-container">
                    <div className="cost-common">
                      <span>
                        {!this.state.combinedCostBasis ||
                        this.state.combinedCostBasis === 0
                          ? "N/A"
                          : CurrencyType(false) +
                            numToCurrency(
                              this.state.combinedCostBasis.toFixed(2)
                            ).toLocaleString("en-US")}
                      </span>
                    </div>
                  </div>
                </CustomOverlay>
              );
            }
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={
                  !rowData.CostBasis || rowData.CostBasis === 0
                    ? "N/A"
                    : CurrencyType(false) +
                      Number(
                        noExponents(rowData.CostBasis.toFixed(2))
                      ).toLocaleString("en-US")
                }
              >
                <div className="cost-common-container">
                  <div className="cost-common">
                    <span>
                      {!rowData.CostBasis || rowData.CostBasis === 0
                        ? "N/A"
                        : CurrencyType(false) +
                          numToCurrency(
                            rowData.CostBasis.toFixed(2)
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
            id="Current Value"
            // onClick={() => this.handleSort(this.state.sortBy[5])}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Current value
            </span>
          </div>
        ),
        dataKey: "CurrentValue",

        coumnWidth: 0.13,
        isCell: true,
        cell: (rowData, dataKey, dataIndex) => {
          if (dataKey === "CurrentValue") {
            if (dataIndex === 0) {
              return (
                <CustomOverlay
                  position="top"
                  isIcon={false}
                  isInfo={true}
                  isText={true}
                  text={
                    this.state.combinedCurrentValue
                      ? CurrencyType(false) +
                        Number(
                          noExponents(
                            this.state.combinedCurrentValue.toFixed(2)
                          )
                        ).toLocaleString("en-US")
                      : "N/A"
                  }
                >
                  <div className="cost-common-container">
                    <div className="cost-common">
                      <span>
                        {this.state.combinedCurrentValue
                          ? CurrencyType(false) +
                            numToCurrency(
                              this.state.combinedCurrentValue.toFixed(2)
                            ).toLocaleString("en-US")
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </CustomOverlay>
              );
            }
            return (
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
                    : "N/A"
                }
              >
                <div className="cost-common-container">
                  <div className="cost-common">
                    <span>
                      {rowData.CurrentValue
                        ? CurrencyType(false) +
                          numToCurrency(
                            rowData.CurrentValue.toFixed(2)
                          ).toLocaleString("en-US")
                        : "N/A"}
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
            id="Gainamount"
            // onClick={() => this.handleSort(this.state.sortBy[6])}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Unrealized gain
            </span>
          </div>
        ),
        dataKey: "GainAmount",

        coumnWidth: 0.13,
        isCell: true,
        cell: (rowData, dataKey, dataIndex) => {
          if (dataKey === "GainAmount") {
            if (dataIndex === 0) {
              const tempDataHolder = numToCurrency(
                this.state.combinedUnrealizedGains
              );
              return (
                <CustomOverlay
                  position="top"
                  isIcon={false}
                  isInfo={true}
                  isText={true}
                  text={
                    this.state.combinedUnrealizedGains
                      ? CurrencyType(false) +
                        Math.abs(
                          Number(
                            noExponents(
                              this.state.combinedUnrealizedGains.toFixed(2)
                            )
                          )
                        ).toLocaleString("en-US")
                      : CurrencyType(false) + "0.00"
                  }
                  colorCode="#000"
                >
                  <div className="gainLossContainer">
                    <div className={`gainLoss`}>
                      {this.state.combinedUnrealizedGains !== 0 ? (
                        <Image
                          className="mr-2"
                          style={{
                            height: "1.5rem",
                            width: "1.5rem",
                          }}
                          src={
                            this.state.combinedUnrealizedGains < 0
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
                  </div>
                </CustomOverlay>
              );
            }
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
            // onClick={() => this.handleSort(this.state.sortBy[7])}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Return
            </span>
          </div>
        ),
        dataKey: "GainLoss",

        coumnWidth: 0.13,
        isCell: true,
        cell: (rowData, dataKey, dataIndex) => {
          if (dataKey === "GainLoss") {
            if (dataIndex === 0) {
              let tempDataHolder = undefined;
              if (this.state.combinedReturn) {
                tempDataHolder = Number(
                  noExponents(this.state.combinedReturn.toFixed(2))
                );
              }
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
                    <div className={`gainLoss`}>
                      {this.state.combinedReturn !== 0 ? (
                        <Image
                          className="mr-2"
                          style={{
                            height: "1.5rem",
                            width: "1.5rem",
                          }}
                          src={
                            this.state.combinedReturn < 0
                              ? ArrowDownLeftSmallIcon
                              : ArrowUpRightSmallIcon
                          }
                        />
                      ) : null}
                      <span className="inter-display-medium f-s-13 lh-16 grey-313">
                        {tempDataHolder
                          ? Math.abs(tempDataHolder).toLocaleString("en-US") +
                            "%"
                          : "0.00%"}
                      </span>
                    </div>
                  </div>
                </CustomOverlay>
              );
            }
            let tempDataHolder = undefined;
            if (rowData.GainLoss) {
              tempDataHolder = Number(noExponents(rowData.GainLoss.toFixed(2)));
            }
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
                </div>
              </CustomOverlay>
            );
          }
        },
      },
    ];
    return (
      <div className="mobilePortfolioContainer">
        {this.props.loader ? (
          <div className="mpLoadingContainer">
            <Loading />
          </div>
        ) : (
          <div className="mpcHomeContainer">
            {this.state.showPopupModal ? (
              <div className="mpcHomeFloatingContainer">
                <div className="mpcHomeFloatingElement">
                  <div className="mpcHFMacIconContainer">
                    <Image src={MacIcon} className="mpcHFMacIcon" />
                  </div>
                  <div className="mpcHFText inter-display-medium f-s-13">
                    Visit app.loch.one from your desktop for all the details
                  </div>
                  <div
                    onClick={this.hideThePopupModal}
                    className="mpcHFGoBtn inter-display-medium f-s-13"
                  >
                    Ok
                  </div>
                </div>
              </div>
            ) : null}
            <div className="mpcMobileSearch">
              <div onClick={this.goToWelcome} className="mpcMobileSearchInput">
                <Image
                  style={{
                    opacity: this.state.showSearchIcon ? 1 : 0,
                  }}
                  onLoad={this.searchIconLoaded}
                  className="mpcMobileSearchImage"
                  src={SearchIcon}
                />
                <div className="mpcMobileSearchPlaceholder inter-display-medium f-s-12">
                  Search for another address / ENS
                </div>
              </div>
              <div className="mpcMobileShare" onClick={this.handleShare}>
                <Image
                  style={{
                    opacity: this.state.showShareIcon ? 1 : 0,
                  }}
                  onLoad={this.shareIconLoaded}
                  className="mpcMobileSearchImage"
                  src={SharePortfolioIconWhite}
                />
              </div>
            </div>
            <div className="mpcHomePage">
              <WelcomeCard
                changeWalletList={this.props.handleChangeList}
                apiResponse={(e) => this.props.CheckApiResponse(e)}
                showNetworth={true}
                // yesterday balance
                yesterdayBalance={this.props.portfolioState.yesterdayBalance}
                // toggleAddWallet={this.state.toggleAddWallet}
                // handleToggleAddWallet={this.handleToggleAddWallet}

                // decrement={true}

                // total network and percentage calculate
                assetTotal={this.props.getTotalAssetValue()}
                // assetTotal={
                //   this.props.portfolioState &&
                //   this.props.portfolioState.walletTotal
                //     ? this.props.portfolioState.walletTotal +
                //       this.props.defiState.totalYield -
                //       this.props.defiState.totalDebt
                //     : 0 +
                //       this.props.defiState.totalYield -
                //       this.props.defiState.totalDebt
                // }
                // history
                history={this.props.history}
                // add wallet address modal
                handleAddModal={this.props.handleAddModal}
                // net worth total
                isLoading={this.props.isLoadingNet}
                // walletTotal={
                //   this.props.portfolioState.walletTotal +
                //   this.state.totalYield -
                //   this.state.totalDebt
                // }

                // manage wallet
                handleManage={() => {}}
                isMobileRender
              />
              <PieChart2
                setLoader={this.props.setLoader}
                chainLoader={this.props.chainLoader}
                totalChainDetechted={this.state.totalChainDetechted}
                userWalletData={
                  this.props.portfolioState &&
                  this.props.portfolioState.chainWallet &&
                  Object.keys(this.props.portfolioState.chainWallet).length > 0
                    ? Object.values(this.props.portfolioState.chainWallet)
                    : null
                }
                chainPortfolio={
                  this.props.portfolioState &&
                  this.props.portfolioState.chainPortfolio &&
                  Object.keys(this.props.portfolioState.chainPortfolio).length >
                    0
                    ? Object.values(this.props.portfolioState.chainPortfolio)
                    : null
                }
                allCoinList={
                  this.props.OnboardingState &&
                  this.props.OnboardingState.coinsList &&
                  Object.keys(this.props.OnboardingState.coinsList).length > 0
                    ? Object.values(this.props.OnboardingState.coinsList)
                    : null
                }
                assetTotal={this.props.getTotalAssetValue()}
                assetPrice={
                  this.props.portfolioState.assetPrice &&
                  Object.keys(this.props.portfolioState.assetPrice).length > 0
                    ? Object.values(this.props.portfolioState.assetPrice)
                    : null
                }
                isLoading={this.props.isLoading}
                isUpdate={this.props.isUpdate}
                walletTotal={this.props.portfolioState.walletTotal}
                // handleAddModal={this.handleAddModal}
                // handleManage={() => {
                //   this.props.history.push("/wallets");
                //   ManageWallets({
                //     session_id: getCurrentUser().id,
                //     email_address: getCurrentUser().email,
                //   });
                // }}
                undetectedWallet={(e) => this.props.undetectedWallet(e)}
                getProtocolTotal={this.props.getProtocolTotal}
                updateTimer={this.props.updateTimer}
              />
              <div
                className="d-flex justify-content-between"
                style={{
                  marginTop: "3rem",
                  alignItems: "start",
                }}
              >
                <div>
                  <h2 className="inter-display-semi-bold f-s-16 lh-19 grey-313 m-b-5">
                    {/* Unrealized profit and loss */}
                    Assets
                  </h2>
                  <p
                    class="inter-display-medium f-s-13 lh-16 grey-ADA"
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Scroll left and right to view more
                  </p>
                </div>
                <div
                  className="d-flex"
                  style={{ alignItems: "center", paddingTop: "2px" }}
                >
                  <div
                    onClick={this.handleDust}
                    className="smaller-toggle inter-display-medium f-s-13 pageHeaderShareBtn"
                  >
                    <Form.Check
                      type="switch"
                      checked={this.state.showHideDustVal}
                      // onChange={(e) => {
                      //   this.setState({
                      //     switchselected: e.target.checked,
                      //   });
                      //   if (this.props.setSwitch) {
                      //     this.props.setSwitch();
                      //   }
                      // }}
                      label={
                        this.state.showHideDustVal
                          ? "Reveal dust (less than $1)"
                          : "Hide dust (less than $1)"
                      }
                    />
                  </div>
                </div>
              </div>
              {/* <div className="section-table section-table-mobile-scroll asset-mobile-table">
                <TransactionTable
                  noSubtitleBottomPadding
                  disableOnLoading
                  isMiniversion
                  title=""
                  handleClick={() => {
                    if (this.state.lochToken) {
                      this.props.history.push("/intelligence/costs");
                      // AverageCostBasisEView({
                      //   session_id: getCurrentUser().id,
                      //   email_address: getCurrentUser().email,
                      // });
                    }
                  }}
                  message=" "
                  subTitle=""
                  tableData={
                    this.props.intelligenceState.Average_cost_basis &&
                    this.props.intelligenceState.Average_cost_basis.length < 1
                      ? []
                      : this.state.showHideDustVal &&
                        this.props.intelligenceState.Average_cost_basis.filter(
                          (item) => {
                            return item.CurrentValue > 1;
                          }
                        ).length > 0
                      ? [
                          {},
                          ...this.props.intelligenceState.Average_cost_basis.filter(
                            (item) => {
                              return item.CurrentValue > 1;
                            }
                          ),
                        ]
                      : this.state.showHideDustVal &&
                        this.props.intelligenceState.Average_cost_basis.filter(
                          (item) => {
                            return item.CurrentValue > 1;
                          }
                        ).length < 1
                      ? []
                      : [{}, ...this.props.intelligenceState.Average_cost_basis]
                  }
                  columnList={columnData}
                  headerHeight={60}
                  isArrow={true}
                  // isLoading={this.props.AvgCostLoading}
                  isAnalytics="average cost basis"
                  addWatermark
                  xAxisScrollable
                  bodyHeight={"1000px"}
                  yAxisScrollable
                />
              </div> */}

              <div
                className="d-flex justify-content-between"
                style={{
                  marginTop: "4.8rem",
                  alignItems: "start",
                }}
              >
                <div>
                  <h2 className="inter-display-semi-bold f-s-16 lh-19 grey-313 m-b-5">
                    {/* Unrealized profit and loss */}
                    Transactions
                  </h2>
                  <p
                    class="inter-display-medium f-s-13 lh-16 grey-ADA"
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Scroll left and right to view more
                  </p>
                </div>
                <div
                  className="d-flex"
                  style={{ alignItems: "center", paddingTop: "2px" }}
                >
                  <div
                    onClick={this.handleDustTrans}
                    className="smaller-toggle inter-display-medium f-s-13 pageHeaderShareBtn"
                  >
                    <Form.Check
                      type="switch"
                      checked={this.state.showHideDustValTrans}
                      // onChange={(e) => {
                      //   this.setState({
                      //     switchselected: e.target.checked,
                      //   });
                      //   if (this.props.setSwitch) {
                      //     this.props.setSwitch();
                      //   }
                      // }}
                      label={
                        this.state.showHideDustValTrans
                          ? "Reveal dust (less than $1)"
                          : "Hide dust (less than $1)"
                      }
                    />
                  </div>
                </div>
              </div>
              <div
                className="fillter_tabs_section"
                style={{ marginTop: "1rem" }}
              >
                <Form onValidSubmit={() => {}}>
                    <div
                      style={{
                        display: "flex",
                        marginTop:'6px',
                        justifyContent: "space-between",
                      }}
                    >
                      <div className="" style={{ width:'48%' }}>
                        {/* <DropDown
                      class="cohort-dropdown"
                      list={[
                        // "All time",
                        "$10K or less",
                        "$10K - $100K",
                        "$100K - $1M",
                        "$1M - $10M",
                        "$10M - $100M",
                        "$100M or more",
                      ]}
                      onSelect={this.handleAmount}
                      title={this.state.amountFilter}
                      activetab={
                        this.state.amountFilter === "Size"
                          ? ""
                          : this.state.amountFilter
                      }
                      showChecked={true}
                      customArrow={true}
                      relative={true}
                      arrowClassName="singleArrowClassName"
                    /> */}
                        <CustomMinMaxDropdown
                          filtername="Size"
                          handleClick={(min, max) =>
                            this.handleAmount(min, max)
                          }
                          minAmount={this.state.minAmount}
                          maxAmount={this.state.maxAmount}
                          style={{marginLeft:'5px !important'}}
                        />
                      </div>
                      <div className="" style={{ width:'48%' }}>
                        <CustomDropdown
                          
                          filtername="Years"
                          style={{ width: "100%", margin:'0px', paddingLeft:'5px '  }}
                          options={this.props.intelligenceState.yearFilter}
                          action={SEARCH_BY_TIMESTAMP_IN}
                          handleClick={(key, value) =>
                            this.addCondition(key, value)
                          }
                          searchIsUsed={this.timeSearchIsUsed}
                          selectedTokens={this.state.selectedTimes}
                          transactionHistorySavedData
                          isMobile
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop:'12px'
                      }}
                    >
                    <div className="col-span-6" style={{ width:'48%' }}>
                      <CustomDropdown
                        filtername="Assets"
                        options={this.props.intelligenceState.assetFilter}
                        action={SEARCH_BY_ASSETS_IN}
                        handleClick={(key, value) =>
                          this.addCondition(key, value)
                        }
                        searchIsUsed={this.assetSearchIsUsed}
                        selectedTokens={this.state.selectedAssets}
                        transactionHistorySavedData
                      />
                    </div>
                    <div className="col-span-6" style={{ width:'48%' }}>
                      <CustomDropdown
                        filtername="Networks"
                        options={this.props.OnboardingState.coinsList}
                        action={SEARCH_BY_CHAIN_IN}
                        handleClick={this.handleFunction}
                        searchIsUsed={this.networkSearchIsUsed}
                        isCaptialised
                        isGreyChain
                        selectedTokens={this.state.selectedNetworks}
                        transactionHistorySavedData
                      />
                    </div>
                    </div>
                    {/* {fillter_tabs} */}
                    <div className="col-span-12" style={{ width: "100%", marginTop:'12px' }}>
                      <div
                        className="transaction-table-mobile-search"
                        style={{ display: "flex", width: "100%" }}
                      >
                        <Image src={searchIcon} className="search-icon" />
                        {/* <FormElement
                        valueLink={this.linkState(
                          this,
                          "search",
                          this.onChangeMethod
                        )}
                        control={{
                          type: CustomTextControl,
                          settings: {
                            placeholder: "Search addresses",
                          },
                        }}
                        classes={{
                          inputField: "search-input",
                          prefix: "search-prefix",
                          suffix: "search-suffix",
                        }}
                      /> */}
                        <input
                          type="text"
                          value={this.state.search}
                          className="search-input"
                          style={{
                            flexGrow: "1",
                          }}
                          placeholder="Search"
                          onChange={(e) => {
                            this.setState({
                              search: e.target.value,
                            });
                            this.onChangeMethod();
                          }}
                        />
                      </div>
                    </div>
                </Form>
              </div>
              {
                this.state.tableLoading
                ?
                <div className="section-table section-table-mobile-scrol" style={{height:'200px', background:'white'}}>
                  <Loading />
                </div>
                :
                <div className="section-table section-table-mobile-scroll">
                {/* <div className="section-table-mobile-scroll-top-cover" /> */}
                <TransactionTable
                  noSubtitleBottomPadding
                  disableOnLoading
                  isMiniversion
                  title=""
                  handleClick={() => {
                    if (this.state.lochToken) {
                      this.props.history.push("/intelligence/costs");
                      // AverageCostBasisEView({
                      //   session_id: getCurrentUser().id,
                      //   email_address: getCurrentUser().email,
                      // });
                    }
                  }}
                  message=" "
                  subTitle=""
                  tableData={tableDataTransaction}
                  columnList={columnListTransaction}
                  headerHeight={60}
                  isArrow={true}
                  isLoading={this.props.tableLoading}
                  isAnalytics="average cost basis"
                  addWatermark
                  xAxisScrollable
                  // yAxisScrollable
                />
              </div>
              }
              
              <div style={{ marginTop: "2rem" }}>
                {totalPage > 1 && (
                  <SmartMoneyPagination
                    history={this.props.history}
                    location={this.props.location}
                    page={this.state.currentPage + 1}
                    pageCount={totalPage}
                    pageLimit={API_LIMIT}
                    onPageChange={(e) => {}}
                    style={{ padding: "0px" }}
                    isMobile
                  />
                )}
              </div>

              <div className="mobileFooterContainer">
                <div>
                  <Footer isMobile />
                </div>
              </div>
            </div>
          </div>
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
});
const mapDispatchToProps = {
  getCoinRate,
  getUserWallet,
  getFilters,
  settingDefaultValues,
  getAllCoins,
  getAllParentChains,
  searchTransactionApi,
  getAssetGraphDataApi,
  getDetailsByLinkApi,
  getProfitAndLossApi,
  // getExchangeBalance,
  getExchangeBalances,
  getYesterdaysBalanceApi,
  getExternalEventsApi,
  getAllInsightsApi,
  updateWalletListFlag,
  setPageFlagDefault,
  getAllWalletListApi,
  // avg cost
  getAvgCostBasis,

  // average cost
  ResetAverageCostBasis,
  updateAverageCostBasis,
  getAssetProfitLoss,
  getDetectedChainsApi,
  GetAllPlan,
  getUser,
};
PortfolioMobile.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(PortfolioMobile);
