import React from "react";
import { Col, Image, Row } from "react-bootstrap";
import { connect } from "react-redux";
import searchIcon from "../../assets/images/icons/search-icon.svg";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import PageHeader from "../common/PageHeader";
import TransactionTable from "./TransactionTable";

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
  SORT_BY_USD_VALUE_THEN,
  START_INDEX,
} from "../../utils/Constant";
import { getAllWalletListApi } from "../wallet/Api";
import { getFilters, searchTransactionApi } from "./Api";
// import { getCoinRate } from "../Portfolio/Api.js";
import moment from "moment";
import { toast } from "react-toastify";
import CopyClipboardIcon from "../../assets/images/CopyClipboardIcon.svg";
import sortByIcon from "../../assets/images/icons/triangle-down.svg";
import {
  TimeSpentTransactionHistory,
  TransactionHistoryAddress,
  TransactionHistoryAddressCopied,
  TransactionHistoryAssetFilter,
  TransactionHistoryExport,
  TransactionHistoryHashCopied,
  TransactionHistoryHashHover,
  TransactionHistoryHideDust,
  TransactionHistoryNetworkFilter,
  TransactionHistoryPageBack,
  TransactionHistoryPageNext,
  TransactionHistoryPageSearch,
  TransactionHistoryPageView,
  TransactionHistorySearch,
  TransactionHistoryShare,
  TransactionHistorySortAmount,
  TransactionHistorySortAsset,
  TransactionHistorySortDate,
  TransactionHistorySortFrom,
  TransactionHistorySortMethod,
  TransactionHistorySortTo,
  TransactionHistorySortUSDAmount,
  TransactionHistoryWalletClicked,
  TransactionHistoryYearFilter,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import {
  CurrencyType,
  TruncateText,
  UpgradeTriggered,
  convertNtoNumber,
  mobileCheck,
  numToCurrency,
} from "../../utils/ReusableFunctions";
import {
  BaseReactComponent,
  CustomTextControl,
  Form,
  FormElement,
} from "../../utils/form";
import CustomDropdown from "../../utils/form/CustomDropdown";
import FixAddModal from "../common/FixAddModal";
import Loading from "../common/Loading";

// add wallet
import { ExportIconWhite } from "../../assets/images/icons";
import AddWalletModalIcon from "../../assets/images/icons/wallet-icon.svg";
import CustomMinMaxDropdown from "../../utils/form/CustomMinMaxDropdown.js";
import WelcomeCard from "../Portfolio/WelcomeCard";
import {
  GetAllPlan,
  getUser,
  setPageFlagDefault,
  updateWalletListFlag,
} from "../common/Api";
import ExitOverlay from "../common/ExitOverlay";
import UpgradeModal from "../common/upgradeModal";
import { getAllCoins } from "../onboarding/Api.js";
import TopWalletAddressList from "../header/TopWalletAddressList.js";

class TransactionHistoryPage extends BaseReactComponent {
  constructor(props) {
    super(props);
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const page = params.get("p");
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
    this.state = {
      minAmount: "1",
      maxAmount: "1000000000",
      isShowingAge: true,
      selectedTimes: [],
      selectedAssets: [],
      selectedMethods: [],
      selectedNetworks: [],
      amountFilter: "Size",
      exportModal: false,
      goToBottom: false,
      currency: JSON.parse(window.sessionStorage.getItem("currency")),
      year: "",
      search: "",
      method: "",
      asset: "",
      methodsDropdown: Method.opt,
      table: [],
      sort: [{ key: SORT_BY_TIMESTAMP, value: false }],
      walletList,
      currentPage: page ? parseInt(page, 10) : START_INDEX,
      // assetFilter: [],
      // yearFilter: [],
      // methodFilter: [],
      delayTimer: 0,
      condition: cond ? cond : [],
      tableLoading: true,
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
          title: "network",
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
      showDust: true,
      // add new wallet
      // userWalletList: window.sessionStorage.getItem("addWallet")
      //   ? JSON.parse(window.sessionStorage.getItem("addWallet"))
      //   : [],
      addModal: false,
      isUpdate: 0,
      apiResponse: false,

      userPlan:
        JSON.parse(window.sessionStorage.getItem("currentPlan")) || "Free",
      upgradeModal: false,
      isStatic: false,
      triggerId: 0,

      // start time for time spent on page
      startTime: "",
      isTimeSearchUsed: false,
      isAssetSearchUsed: false,
      isNetworkSearchUsed: false,
    };
    this.delayTimer = 0;
  }
  toggleAgeTimestamp = () => {
    this.setState({
      isShowingAge: !this.state.isShowingAge,
    });
  };
  history = this.props;
  handleExportModal = () => {
    TransactionHistoryExport({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    this.setState({
      exportModal: !this.state.exportModal,
    });
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
  upgradeModal = () => {
    this.setState({
      upgradeModal: !this.state.upgradeModal,
      userPlan: JSON.parse(window.sessionStorage.getItem("currentPlan")),
    });
  };
  startPageView = () => {
    this.setState({ startTime: new Date() * 1 });
    TransactionHistoryPageView({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    // Inactivity Check
    window.checkTransactionHistoryTimer = setInterval(() => {
      this.checkForInactivity();
    }, 900000);
  };
  componentDidMount() {
    if (mobileCheck()) {
      this.props.history.push("/home");
    }
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 200);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 300);
    const transHistoryPageNumber = window.sessionStorage.getItem(
      "transHistoryPageNumber"
    );
    const transHistoryConditions = window.sessionStorage.getItem(
      "transHistoryConditions"
    );
    const transHistorySorts =
      window.sessionStorage.getItem("transHistorySorts");

    if (transHistoryPageNumber || transHistoryConditions || transHistorySorts) {
      this.setState(
        {
          currentPage: transHistoryPageNumber
            ? Number(transHistoryPageNumber)
            : 0,
          condition: transHistoryConditions
            ? JSON.parse(transHistoryConditions)
            : [],
          sort: transHistorySorts
            ? JSON.parse(transHistorySorts)
            : [{ key: SORT_BY_TIMESTAMP, value: false }],
        },
        () => {
          if (transHistoryPageNumber) {
            window.sessionStorage.removeItem("transHistoryPageNumber");
          }
          if (transHistoryConditions) {
            const tempHolder = JSON.parse(transHistoryConditions);
            for (var key in tempHolder) {
              if (tempHolder.hasOwnProperty(key)) {
                const tempVar = tempHolder[key];
                if (tempVar.key === SEARCH_BY_TIMESTAMP_IN) {
                  this.setState({ selectedTimes: tempVar.value });
                } else if (tempVar.key === SEARCH_BY_ASSETS_IN) {
                  this.setState({ selectedAssets: tempVar.value });
                } else if (tempVar.key === SEARCH_BY_METHOD_IN) {
                  this.setState({ selectedMethods: tempVar.value });
                } else if (tempVar.key === SEARCH_BY_CHAIN_IN) {
                  this.setState({ selectedNetworks: tempVar.value });
                } else if (tempVar.key === SEARCH_BETWEEN_VALUE) {
                  let tempAmount = "Amount";
                  let min = tempVar.value?.min_value
                    ? tempVar.value.min_value
                    : 0;
                  let max = tempVar.value?.max_value
                    ? tempVar.value.max_value
                    : 0;

                  if (min === 0 && max === 10000) {
                    tempAmount = "$10K or less";
                  } else if (min === 10000 && max === 100000) {
                    tempAmount = "$10K - $100K";
                  } else if (min === 100000 && max === 1000000) {
                    tempAmount = "$100K - $1M";
                  } else if (min === 1000000 && max === 10000000) {
                    tempAmount = "$1M - $10M";
                  } else if (min === 10000000 && max === 100000000) {
                    tempAmount = "$10M - $100M";
                  } else if (min === 100000000 && max === 10000000000) {
                    tempAmount = "$100M or more";
                  }

                  this.setState({ amountFilter: tempAmount });
                }
              }
            }
            window.sessionStorage.removeItem("transHistoryConditions");
          }
          if (transHistorySorts) {
            window.sessionStorage.removeItem("transHistorySorts");
          }

          this.props.history.replace({
            search: `?p=${this.state.currentPage}`,
          });
          this.callApi(this.state.currentPage || START_INDEX);
          this.props.getFilters(this);
          this.props.getAllCoins();
          // this.props.getCoinRate();
          this.props.GetAllPlan();
          this.props.getUser();

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
          this.startPageView();
          this.updateTimer(true);

          return () => {
            clearInterval(window.checkTransactionHistoryTimer);
          };
        }
      );
    } else {
      if (
        !this.props.commonState.transactionHistory ||
        !this.props.intelligenceState.table
      ) {
        this.props.updateWalletListFlag("transactionHistory", true);
        this.props.history.replace({
          search: `?p=${this.state.currentPage}`,
        });
        this.callApi(this.state.currentPage || START_INDEX);
        this.props.getFilters(this);
        this.props.getAllCoins();
        // this.props.getCoinRate();
        this.props.GetAllPlan();
        this.props.getUser();

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
        this.startPageView();
        this.updateTimer(true);

        return () => {
          clearInterval(window.checkTransactionHistoryTimer);
        };
      } else {
        this.props.getFilters(this);
        this.props.getAllCoins();
        // this.props.getCoinRate();
        this.props.GetAllPlan();
        this.props.getUser();
        this.updateTimer(true);
        this.setState({ tableLoading: false });
        this.startPageView();
        return () => {
          clearInterval(window.checkTransactionHistoryTimer);
        };
      }
    }
  }
  updateTimer = (first) => {
    const tempExistingExpiryTime = window.sessionStorage.getItem(
      "transactionHistoryPageExpiryTime"
    );
    if (!tempExistingExpiryTime && !first) {
      this.startPageView();
    }
    const tempExpiryTime = Date.now() + 1800000;
    window.sessionStorage.setItem(
      "transactionHistoryPageExpiryTime",
      tempExpiryTime
    );
  };
  endPageView = () => {
    clearInterval(window.checkTransactionHistoryTimer);
    window.sessionStorage.removeItem("transactionHistoryPageExpiryTime");
    if (this.state.startTime) {
      let endTime = new Date() * 1;
      let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
      TimeSpentTransactionHistory({
        time_spent: TimeSpent,
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
    }
  };
  checkForInactivity = () => {
    const tempExpiryTime = window.sessionStorage.getItem(
      "transactionHistoryPageExpiryTime"
    );
    if (tempExpiryTime && tempExpiryTime < Date.now()) {
      this.endPageView();
    }
  };
  componentWillUnmount() {
    const tempExpiryTime = window.sessionStorage.getItem(
      "transactionHistoryPageExpiryTime"
    );
    if (tempExpiryTime) {
      this.endPageView();
    }
  }

  callApi = (page = START_INDEX) => {
    this.setState({ tableLoading: true });
    let data = new URLSearchParams();
    data.append("start", page * API_LIMIT);
    data.append("conditions", JSON.stringify(this.state.condition));
    data.append("limit", API_LIMIT);
    data.append("sorts", JSON.stringify(this.state.sort));
    this.props.searchTransactionApi(data, this, page);
  };
  onPageChange = () => {
    this.setState({
      goToBottom: true,
    });
  };
  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.tableLoading !== this.state.tableLoading &&
      this.state.goToBottom &&
      !this.state.tableLoading
    ) {
      this.setState(
        {
          goToBottom: false,
        },
        () => {
          window.scroll(0, document.body.scrollHeight);
        }
      );
    }
    const prevParams = new URLSearchParams(prevProps.location.search);
    const prevPage = parseInt(prevParams.get("p") || START_INDEX, 10);

    const params = new URLSearchParams(this.props.location.search);
    const page = parseInt(params.get("p") || START_INDEX, 10);

    if (!this.props.commonState.transactionHistory) {
      this.props.updateWalletListFlag("transactionHistory", true);
      let tempData = new URLSearchParams();
      tempData.append("start", 0);
      tempData.append("conditions", JSON.stringify([]));
      tempData.append("limit", 50);
      tempData.append("sorts", JSON.stringify([]));
      this.props.getAllWalletListApi(tempData, this);
    }
    if (
      prevPage !== page ||
      prevState.condition !== this.state.condition ||
      prevState.sort !== this.state.sort
    ) {
      this.callApi(page);
      if (prevPage !== page) {
        if (prevPage - 1 === page) {
          TransactionHistoryPageBack({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
            page_no: page + 1,
          });
          this.updateTimer();
        } else if (prevPage + 1 === page) {
          TransactionHistoryPageNext({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
            page_no: page + 1,
          });
          this.updateTimer();
        } else {
          TransactionHistoryPageSearch({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
            page_search: page + 1,
          });
          this.updateTimer();
        }
      }
    }

    // add wallet
    if (prevState.apiResponse != this.state.apiResponse) {
      const address = this.state.walletList?.map((wallet) => {
        return wallet.address;
      });
      const cond = [
        {
          key: SEARCH_BY_WALLET_ADDRESS_IN,
          value: address,
        },
      ];
      this.props.getAllCoins();
      this.setState({
        condition: cond ? cond : [],
        apiResponse: false,
      });

      this.callApi(this.state.currentPage || START_INDEX);
      this.props.getFilters(this);
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
      walletList: value,
      isUpdate: this.state.isUpdate === 0 ? 1 : 0,
      // for page
      tableLoading: true,
    });
  };

  CheckApiResponse = (value) => {
    this.setState({
      apiResponse: value,
    });

    this.props.setPageFlagDefault();
  };

  onValidSubmit = () => {};
  handleFunction = (badge) => {
    if (badge && badge.length > 0) {
      const tempArr = [];
      if (badge[0]?.name !== "All") {
        badge.forEach((resData) => tempArr.push(resData.id));
      }
      this.addCondition(
        SEARCH_BY_CHAIN_IN,
        tempArr && tempArr.length > 0 ? tempArr : "allNetworks"
      );
    }
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
  addCondition = (key, value) => {
    if (key === "SEARCH_BY_TIMESTAMP_IN") {
      const tempIsTimeUsed = this.state.isTimeSearchUsed;
      TransactionHistoryYearFilter({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        year_filter: value === "allYear" ? "All years" : value,
        isSearchUsed: tempIsTimeUsed,
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
  onChangeMethod = () => {
    clearTimeout(this.delayTimer);
    this.delayTimer = setTimeout(() => {
      this.addCondition(SEARCH_BY_TEXT, this.state.search);
      TransactionHistorySearch({
        session_id: getCurrentUser().id,
        email: getCurrentUser().email,
        searched: this.state.search,
      });
      this.updateTimer();
      // this.callApi(this.state.currentPage || START_INDEX, condition)
    }, 1000);
  };
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

  showDust = () => {
    this.setState(
      {
        showDust: !this.state.showDust,
      },
      () => {
        TransactionHistoryHideDust({
          session_id: getCurrentUser().id,
          email_address: getCurrentUser().email,
        });
        this.updateTimer();
        this.addCondition(SEARCH_BY_NOT_DUST, this.state.showDust);
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
      BASE_URL_S3 +
      "home/" +
      slink +
      "?redirect=intelligence/transaction-history";
    navigator.clipboard.writeText(shareLink);
    toast.success("Link copied");

    TransactionHistoryShare({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    this.updateTimer();
  };
  handleSpecificShare = () => {
    let lochUser = getCurrentUser().id;
    // let shareLink = BASE_URL_S3 + "home/" + lochUser.link;
    let userWallet = JSON.parse(window.sessionStorage.getItem("addWallet"));
    let slink =
      userWallet?.length === 1
        ? userWallet[0].displayAddress || userWallet[0].address
        : lochUser;
    TransactionHistoryShare({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    let shareLink =
      BASE_URL_S3 +
      "home/" +
      slink +
      "?redirect=intelligence/transaction-history";
    const search = this.props.location.search;
    const params = new URLSearchParams(search);
    const page = params.get("p");
    if (page !== undefined || page !== null) {
      shareLink = shareLink + "&transHistoryPageNumber=" + page;
    }
    if (this.state.condition) {
      shareLink =
        shareLink +
        "&transHistoryConditions=" +
        JSON.stringify(this.state.condition);
    }
    if (this.state.sort) {
      shareLink =
        shareLink + "&transHistorySorts=" + JSON.stringify(this.state.sort);
    }
    navigator.clipboard.writeText(shareLink);
    toast.success("Link copied");
    this.updateTimer();
  };

  render() {
    const { table, totalPage, totalCount, currentPage, assetPriceList } =
      this.props.intelligenceState;
    const { walletList, currency } = this.state;
    let tableData =
      table &&
      table?.map((row) => {
        let walletFromData = null;
        let walletToData = null;

        walletList &&
          walletList?.map((wallet) => {
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
          network: row?.chain?.name,
        };
      });

    const columnList = [
      {
        labelName: (
          <div className="cp history-table-header-col " id="time">
            <CustomOverlay
              position="top"
              isIcon={false}
              isInfo={true}
              isText={true}
              text={
                this.state.isShowingAge
                  ? "Click to view Timestamp"
                  : "Click to view Age"
              }
            >
              <span
                onClick={() => {
                  this.toggleAgeTimestamp();
                }}
                className="inter-display-medium f-s-13 lh-16 secondaryDarkText"
                style={{
                  textDecoration: "underline",
                }}
              >
                {this.state.isShowingAge ? "Age" : "Timestamp"}
              </span>
            </CustomOverlay>
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
                <span className="primaryText">{tempVal}</span>
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
            <span className="inter-display-medium f-s-13 lh-16 secondaryDarkText">
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
                // text={rowData.from.address}
                text={
                  // rowData.from.wallet_metaData?.text
                  //   ? rowData.from.wallet_metaData?.text +
                  //     ": " +
                  //     rowData.from.address
                  //   : rowData.from.metaData?.displayAddress &&
                  //     rowData.from.metaData?.displayAddress !==
                  //       rowData.from.address
                  //   ? rowData.from.metaData?.displayAddress +
                  //     ": " +
                  //     rowData.from.address
                  //   : rowData.from.metaData?.nickname
                  //   ? rowData.from.metaData?.nickname +
                  //     ": " +
                  //     (rowData.from.wallet_metaData?.text ?
                  //       (rowData.from.wallet_metaData?.text + ": "):"") +
                  //     ((rowData.from.metaData?.displayAddress &&
                  //       rowData.from.metaData?.displayAddress !==
                  //         rowData.from.address) ? (rowData.from.metaData?.displayAddress + ": ") : "") +
                  //     rowData.from.address
                  //   : rowData.from.address
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
                  <span
                    onMouseEnter={() => {
                      TransactionHistoryAddress({
                        session_id: getCurrentUser().id,
                        email_address: getCurrentUser().email,
                        address_hovered: rowData.from.address,
                        display_name: rowData.from.wallet_metaData?.text
                          ? rowData.from.wallet_metaData?.text
                          : rowData.from.metaData?.displayAddress,
                      });
                      this.updateTimer();
                    }}
                  >
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
                        });
                        this.updateTimer();
                      }}
                      className="m-l-10 cp copy-icon"
                      style={{ width: "1rem" }}
                    />
                  </span>
                ) : rowData.from.wallet_metaData.symbol ||
                  rowData.from.wallet_metaData.text ||
                  rowData.from.metaData?.nickname ? (
                  rowData.from.wallet_metaData.symbol ? (
                    <span
                      onMouseEnter={() => {
                        TransactionHistoryAddress({
                          session_id: getCurrentUser().id,
                          email_address: getCurrentUser().email,
                          address_hovered: rowData.from.address,
                          display_name: rowData.from.wallet_metaData?.text
                            ? rowData.from.wallet_metaData?.text
                            : rowData.from.metaData?.displayAddress,
                        });
                        this.updateTimer();
                      }}
                    >
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
                          });
                          this.updateTimer();
                        }}
                        className="m-l-10 cp copy-icon"
                        style={{ width: "1rem" }}
                      />
                    </span>
                  ) : rowData.from.metaData?.nickname ? (
                    <span
                      onMouseEnter={() => {
                        TransactionHistoryAddress({
                          session_id: getCurrentUser().id,
                          email_address: getCurrentUser().email,
                          address_hovered: rowData.from.address,
                          display_name: rowData.from.wallet_metaData?.text
                            ? rowData.from.wallet_metaData?.text
                            : rowData.from.metaData?.displayAddress,
                        });
                        this.updateTimer();
                      }}
                    >
                      <span
                        onClick={goToAddress}
                        className="top-account-address"
                      >
                        {TruncateText(rowData.from.metaData?.nickname)}
                      </span>
                      <Image
                        src={CopyClipboardIcon}
                        onClick={() => {
                          this.copyContent(rowData.from.address);
                          TransactionHistoryAddressCopied({
                            session_id: getCurrentUser().id,
                            email_address: getCurrentUser().email,
                            address_copied: rowData.from.address,
                          });
                          this.updateTimer();
                        }}
                        className="m-l-10 cp copy-icon"
                        style={{ width: "1rem" }}
                      />
                    </span>
                  ) : (
                    <span
                      onMouseEnter={() => {
                        TransactionHistoryAddress({
                          session_id: getCurrentUser().id,
                          email_address: getCurrentUser().email,
                          address_hovered: rowData.from.address,
                          display_name: rowData.from.wallet_metaData?.text
                            ? rowData.from.wallet_metaData?.text
                            : rowData.from.metaData?.displayAddress,
                        });
                        this.updateTimer();
                      }}
                    >
                      <span
                        onClick={goToAddress}
                        className="top-account-address"
                      >
                        {TruncateText(rowData.from.wallet_metaData.text)}
                      </span>
                      <Image
                        src={CopyClipboardIcon}
                        onClick={() => {
                          this.copyContent(rowData.from.address);
                          TransactionHistoryAddressCopied({
                            session_id: getCurrentUser().id,
                            email_address: getCurrentUser().email,
                            address_copied: rowData.from.address,
                          });
                          this.updateTimer();
                        }}
                        className="m-l-10 cp copy-icon"
                        style={{ width: "1rem" }}
                      />
                    </span>
                  )
                ) : rowData.from.metaData?.displayAddress ? (
                  <span
                    onMouseEnter={() => {
                      TransactionHistoryAddress({
                        session_id: getCurrentUser().id,
                        email_address: getCurrentUser().email,
                        address_hovered: rowData.from.address,
                        display_name: rowData.from.wallet_metaData?.text
                          ? rowData.from.wallet_metaData?.text
                          : rowData.from.metaData?.displayAddress,
                      });
                      this.updateTimer();
                    }}
                  >
                    <span onClick={goToAddress} className="top-account-address">
                      {TruncateText(rowData.from.metaData?.displayAddress)}
                    </span>
                    <Image
                      src={CopyClipboardIcon}
                      onClick={() => {
                        this.copyContent(rowData.from.address);
                        TransactionHistoryAddressCopied({
                          session_id: getCurrentUser().id,
                          email_address: getCurrentUser().email,
                          address_copied: rowData.from.address,
                        });
                        this.updateTimer();
                      }}
                      className="m-l-10 cp copy-icon"
                      style={{ width: "1rem" }}
                    />
                  </span>
                ) : (
                  <span
                    onMouseEnter={() => {
                      TransactionHistoryAddress({
                        session_id: getCurrentUser().id,
                        email_address: getCurrentUser().email,
                        address_hovered: rowData.from.address,
                        display_name: rowData.from.wallet_metaData?.text
                          ? rowData.from.wallet_metaData?.text
                          : rowData.from.metaData?.displayAddress,
                      });
                      this.updateTimer();
                    }}
                  >
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
            <span className="inter-display-medium f-s-13 lh-16 secondaryDarkText">
              To
            </span>
            <Image
              src={sortByIcon}
              className={
                this.state.tableSortOpt[2].up ? "rotateDown" : "rotateUp"
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
            if (rowData.to.metaData?.nickname) {
              showThis = TruncateText(rowData.to?.metaData?.nickname);
            } else if (rowData.to?.wallet_metaData?.text) {
              showThis = TruncateText(rowData.to?.wallet_metaData?.text);
            } else if (rowData.to.metaData?.displayAddress) {
              showThis = TruncateText(rowData.to.metaData?.displayAddress);
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
                  // rowData.to.wallet_metaData?.text
                  //   ? rowData.to.wallet_metaData?.text +
                  //     ": " +
                  //     rowData.to.address
                  //   : rowData.to.metaData?.displayAddress &&
                  //     rowData.to.metaData?.displayAddress !== rowData.to.address
                  //   ? rowData.to.metaData?.displayAddress +
                  //     ": " +
                  //     rowData.to.address
                  //   : rowData.to.metaData?.nickname
                  //   ? (rowData.to.metaData?.nickname ? rowData.to.metaData?.nickname +
                  //     ": " : "") +
                  //     (rowData.to.wallet_metaData?.text
                  //       ? rowData.to.wallet_metaData?.text + ": "
                  //       : "") +
                  //     (rowData.to.metaData?.displayAddress &&
                  //     rowData.to.metaData?.displayAddress !== rowData.to.address
                  //       ? rowData.to.metaData?.displayAddress + ": "
                  //       : "") +
                  //     rowData.to.address
                  //   : rowData.to.address
                }
              >
                {rowData.to.metaData?.wallet_metaData ? (
                  <span
                    onMouseEnter={() => {
                      TransactionHistoryAddress({
                        session_id: getCurrentUser().id,
                        email_address: getCurrentUser().email,
                        address_hovered: rowData.to.address,
                        display_name: rowData.to.wallet_metaData?.text
                          ? rowData.to.wallet_metaData?.text
                          : rowData.to.metaData?.displayAddress,
                      });
                      this.updateTimer();
                    }}
                  >
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
                        });
                        this.updateTimer();
                      }}
                      className="m-l-10 cp copy-icon"
                      style={{ width: "1rem" }}
                    />
                  </span>
                ) : rowData.to.wallet_metaData.symbol ||
                  rowData.to.wallet_metaData.text ||
                  rowData.to.metaData?.nickname ? (
                  rowData.to.wallet_metaData.symbol ? (
                    <span
                      onMouseEnter={() => {
                        TransactionHistoryAddress({
                          session_id: getCurrentUser().id,
                          email_address: getCurrentUser().email,
                          address_hovered: rowData.to.address,
                          display_name: rowData.to.wallet_metaData?.text
                            ? rowData.to.wallet_metaData?.text
                            : rowData.to.metaData?.displayAddress,
                        });
                        this.updateTimer();
                      }}
                    >
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
                          });
                          this.updateTimer();
                        }}
                        className="m-l-10 cp copy-icon"
                        style={{ width: "1rem" }}
                      />
                    </span>
                  ) : rowData.to.metaData?.nickname ? (
                    <span
                      onMouseEnter={() => {
                        TransactionHistoryAddress({
                          session_id: getCurrentUser().id,
                          email_address: getCurrentUser().email,
                          address_hovered: rowData.to.address,
                          display_name: rowData.to.wallet_metaData?.text
                            ? rowData.to.wallet_metaData?.text
                            : rowData.to.metaData?.displayAddress,
                        });
                        this.updateTimer();
                      }}
                    >
                      <span
                        onClick={goToAddress}
                        className="top-account-address"
                      >
                        {TruncateText(rowData.to.metaData?.nickname)}
                      </span>
                      <Image
                        src={CopyClipboardIcon}
                        onClick={() => {
                          this.copyContent(rowData.to.address);
                          TransactionHistoryAddressCopied({
                            session_id: getCurrentUser().id,
                            email_address: getCurrentUser().email,
                            address_copied: rowData.to.address,
                          });
                          this.updateTimer();
                        }}
                        className="m-l-10 cp copy-icon"
                        style={{ width: "1rem" }}
                      />
                    </span>
                  ) : (
                    <span
                      onMouseEnter={() => {
                        TransactionHistoryAddress({
                          session_id: getCurrentUser().id,
                          email_address: getCurrentUser().email,
                          address_hovered: rowData.to.address,
                          display_name: rowData.to.wallet_metaData?.text
                            ? rowData.to.wallet_metaData?.text
                            : rowData.to.metaData?.displayAddress,
                        });
                        this.updateTimer();
                      }}
                    >
                      <span
                        onClick={goToAddress}
                        className="top-account-address"
                      >
                        {TruncateText(rowData.to.wallet_metaData.text)}
                      </span>
                      <Image
                        src={CopyClipboardIcon}
                        onClick={() => {
                          this.copyContent(rowData.to.address);
                          TransactionHistoryAddressCopied({
                            session_id: getCurrentUser().id,
                            email_address: getCurrentUser().email,
                            address_copied: rowData.to.address,
                          });
                          this.updateTimer();
                        }}
                        className="m-l-10 cp copy-icon"
                        style={{ width: "1rem" }}
                      />
                    </span>
                  )
                ) : rowData.to.metaData?.displayAddress ? (
                  <span
                    onMouseEnter={() => {
                      TransactionHistoryAddress({
                        session_id: getCurrentUser().id,
                        email_address: getCurrentUser().email,
                        address_hovered: rowData.to.address,
                        display_name: rowData.to.wallet_metaData?.text
                          ? rowData.to.wallet_metaData?.text
                          : rowData.to.metaData?.displayAddress,
                      });
                      this.updateTimer();
                    }}
                  >
                    <span onClick={goToAddress} className="top-account-address">
                      {TruncateText(rowData.to.metaData?.displayAddress)}
                    </span>
                    <Image
                      src={CopyClipboardIcon}
                      onClick={() => {
                        this.copyContent(rowData.to.address);
                        TransactionHistoryAddressCopied({
                          session_id: getCurrentUser().id,
                          email_address: getCurrentUser().email,
                          address_copied: rowData.to.address,
                        });
                        this.updateTimer();
                      }}
                      className="m-l-10 cp copy-icon"
                      style={{ width: "1rem" }}
                    />
                  </span>
                ) : (
                  <span
                    onMouseEnter={() => {
                      TransactionHistoryAddress({
                        session_id: getCurrentUser().id,
                        email_address: getCurrentUser().email,
                        address_hovered: rowData.to.address,
                        display_name: rowData.to.wallet_metaData?.text
                          ? rowData.to.wallet_metaData?.text
                          : rowData.to.metaData?.displayAddress,
                      });
                      this.updateTimer();
                    }}
                  >
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
            <span className="inter-display-medium f-s-13 lh-16 secondaryDarkText">
              Asset
            </span>
            <Image
              src={sortByIcon}
              className={
                this.state.tableSortOpt[3].up ? "rotateDown" : "rotateUp"
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
                text={rowData?.asset?.code ? rowData.asset.code : ""}
              >
                {rowData.asset?.symbol ? (
                  <Image src={rowData.asset.symbol} className="asset-symbol" />
                ) : rowData.asset?.code ? (
                  <div className="inter-display-medium f-s-13 lh-16 dotDotText">
                    {rowData.asset.code}
                  </div>
                ) : (
                  <div></div>
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
            id="amount"
            onClick={() => this.handleTableSort("amount")}
          >
            <span className="inter-display-medium f-s-13 lh-16 secondaryDarkText">
              Amount
            </span>
            <Image
              src={sortByIcon}
              className={
                this.state.tableSortOpt[4].up ? "rotateDown" : "rotateUp"
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
            const tempAmountVal = convertNtoNumber(rowData.amount.value);
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={tempAmountVal ? tempAmountVal : "0.00"}
              >
                <div className="inter-display-medium f-s-13 lh-16 ellipsis-div">
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
            <span className="inter-display-medium f-s-13 lh-16 secondaryDarkText">{`${CurrencyType(
              true
            )} amount (then)`}</span>
            <Image
              src={sortByIcon}
              className={
                this.state.tableSortOpt[5].up ? "rotateDown" : "rotateUp"
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
                  <div className="inter-display-medium f-s-13 lh-16 ellipsis-div">
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
                  <div className="inter-display-medium f-s-13 lh-16 ellipsis-div">
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
            <span className="inter-display-medium f-s-13 lh-16 secondaryDarkText">
              Method
            </span>
            <Image
              src={sortByIcon}
              className={
                this.state.tableSortOpt[8].up ? "rotateDown" : "rotateUp"
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
                      <span className="text-capitalize inter-display-medium f-s-13 lh-16 interDisplayMediumTextDarkerText">
                        {rowData.method}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-capitalize inter-display-medium f-s-13 lh-16 black-191 history-table-method transfer ellipsis-div interDisplayMediumTextDarkerText">
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
          <div
            className="cp history-table-header-col secondaryDarkText"
            id="network"
          >
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
        coumnWidth: 0.15,
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
                  <div className="inter-display-medium f-s-13 lh-16 ellipsis-div dotDotText">
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
            <span className="inter-display-medium f-s-13 lh-16 secondaryDarkText">
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
                <div
                  onMouseEnter={() => {
                    // console.log('here');
                    TransactionHistoryHashHover({
                      session_id: getCurrentUser().id,
                      email_address: getCurrentUser().email,
                      hash_hovered: rowData.hash,
                    });
                    this.updateTimer();
                  }}
                  className="inter-display-medium f-s-13 lh-16 ellipsis-div"
                >
                  {tempHashVal}
                  <Image
                    src={CopyClipboardIcon}
                    onClick={() => {
                      this.copyContent(rowData.hash);
                      TransactionHistoryHashCopied({
                        session_id: getCurrentUser().id,
                        email_address: getCurrentUser().email,
                        hash_copied: rowData.hash,
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
                updateTimer={this.updateTimer}
                handleAddModal={this.handleAddModal}
              />
            </div>
          </div>
        </div>
        <div className="history-table-section m-t-80">
          <div className="history-table page">
            <TopWalletAddressList
              apiResponse={(e) => this.CheckApiResponse(e)}
              handleShare={this.handleShare}
            />
            {this.state.exportModal ? (
              <ExitOverlay
                show={this.state.exportModal}
                onHide={this.handleExportModal}
                history={this.history}
                headerTitle={"Download all transactions"}
                headerSubTitle={"Export your transaction history from Loch"}
                modalType={"exportModal"}
                iconImage={ExportIconWhite}
                selectExportOption={1}
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
                updateTimer={this.updateTimer}
                from="transaction history"
              />
            )}
            {this.state.upgradeModal && (
              <UpgradeModal
                show={this.state.upgradeModal}
                onHide={this.upgradeModal}
                history={this.props.history}
                isShare={window.sessionStorage.getItem("share_id")}
                isStatic={this.state.isStatic}
                triggerId={this.state.triggerId}
                pname="treansaction history"
                updateTimer={this.updateTimer}
              />
            )}
            <PageHeader
              title={"Transactions"}
              subTitle={
                "Sort, filter, and dissect all your transactions from one place"
              }
              currentPage={"transaction-history"}
              history={this.props.history}
              // btnText={"Add wallet"}
              // handleBtn={this.handleAddModal}
              ShareBtn={true}
              ExportBtn
              exportBtnTxt="Click to export transactions"
              handleExportModal={this.handleExportModal}
              handleShare={this.handleSpecificShare}
              updateTimer={this.updateTimer}
              showHideDust
              showHideDustVal={this.state.showDust}
              showHideDustFun={this.showDust}
            />

            <div className="fillter_tabs_section">
              <Form onValidSubmit={this.onValidSubmit}>
                <Row>
                  <Col className="transactionHistoryCol">
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
                      handleClick={(min, max) => this.handleAmount(min, max)}
                      minAmount={this.state.minAmount}
                      maxAmount={this.state.maxAmount}
                    />
                  </Col>
                  <Col className="transactionHistoryCol">
                    <CustomDropdown
                      filtername="Years"
                      options={this.props.intelligenceState.yearFilter}
                      action={SEARCH_BY_TIMESTAMP_IN}
                      handleClick={(key, value) =>
                        this.addCondition(key, value)
                      }
                      searchIsUsed={this.timeSearchIsUsed}
                      selectedTokens={this.state.selectedTimes}
                      transactionHistorySavedData
                    />
                  </Col>
                  <Col className="transactionHistoryCol">
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
                  </Col>
                  <Col className="transactionHistoryCol">
                    <CustomDropdown
                      filtername="Methods"
                      options={this.props.intelligenceState.methodFilter}
                      action={SEARCH_BY_METHOD_IN}
                      handleClick={(key, value) =>
                        this.addCondition(key, value)
                      }
                      searchIsUsed={this.methodSearchIsUsed}
                      isCaptialised
                      selectedTokens={this.state.selectedMethods}
                      transactionHistorySavedData
                    />
                  </Col>
                  <Col className="transactionHistoryCol">
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
                  </Col>
                  {/* {fillter_tabs} */}
                  <Col className="transactionHistoryCol">
                    <div className="searchBar">
                      <Image src={searchIcon} className="search-icon" />
                      <FormElement
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
                      />
                    </div>
                  </Col>
                </Row>
              </Form>
            </div>
            <div className="transaction-history-table">
              {this.state.tableLoading ? (
                <div className="loadingSizeContainer">
                  <Loading />
                </div>
              ) : (
                <>
                  <TransactionTable
                    noSubtitleBottomPadding
                    tableData={tableData}
                    columnList={columnList}
                    message={"No Transactions Found"}
                    totalPage={totalPage}
                    history={this.props.history}
                    location={this.props.location}
                    page={currentPage}
                    tableLoading={this.state.tableLoading}
                    onPageChange={this.onPageChange}
                    minimalPagination
                    hidePaginationRecords
                    addWatermark
                  />
                  {/* <div className="ShowDust">
                    <p
                      onClick={this.showDust}
                      className="inter-display-medium f-s-16 lh-19 cp grey-ADA"
                    >
                      {this.state.showDust
                        ? "Reveal dust (less than $1)"
                        : "Hide dust (less than $1)"}
                    </p>
                  </div> */}
                </>
              )}
            </div>
            {/* <FeedbackForm page={"Transaction History Page"} /> */}
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  // portfolioState: state.PortfolioState,
  intelligenceState: state.IntelligenceState,
  commonState: state.CommonState,
  OnboardingState: state.OnboardingState,
});
const mapDispatchToProps = {
  searchTransactionApi,
  // getCoinRate,
  getAllCoins,
  getFilters,
  setPageFlagDefault,
  getAllWalletListApi,
  updateWalletListFlag,
  getUser,
  GetAllPlan,
};

TransactionHistoryPage.propTypes = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionHistoryPage);
