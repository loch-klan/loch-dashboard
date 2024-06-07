import React from "react";
import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import CustomOverlay from "../../../utils/commonComponent/CustomOverlay";
import PageHeader from "../../common/PageHeader";

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
} from "../../../utils/Constant";
import { getFilters, searchTransactionApi } from "../../intelligence/Api";
import { getAllWalletListApi } from "../../wallet/Api";
// import { getCoinRate } from "../../Portfolio/Api.js";
import moment from "moment";
import { toast } from "react-toastify";
import CopyClipboardIcon from "../../../assets/images/CopyClipboardIcon.svg";
import sortByIcon from "../../../assets/images/icons/triangle-down.svg";
import {
  CopyTradeTimeSpentTransactionHistory,
  CopyTradeTransactionHistoryAddressCopied,
  CopyTradeTransactionHistoryAssetFilter,
  CopyTradeTransactionHistoryHashCopied,
  CopyTradeTransactionHistoryNetworkFilter,
  CopyTradeTransactionHistoryPageBack,
  CopyTradeTransactionHistoryPageNext,
  CopyTradeTransactionHistoryPageSearch,
  CopyTradeTransactionHistoryPageView,
  CopyTradeTransactionHistorySearch,
  CopyTradeTransactionHistorySortAmount,
  CopyTradeTransactionHistorySortAsset,
  CopyTradeTransactionHistorySortDate,
  CopyTradeTransactionHistorySortFrom,
  CopyTradeTransactionHistorySortMethod,
  CopyTradeTransactionHistorySortTo,
  CopyTradeTransactionHistorySortUSDAmount,
  CopyTradeTransactionHistoryWalletClicked,
  CopyTradeTransactionHistoryYearFilter,
} from "../../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../../utils/ManageToken";
import {
  CurrencyType,
  TruncateText,
  UpgradeTriggered,
  amountFormat,
  compareTwoArrayOfObjects,
  convertNtoNumber,
  mobileCheck,
  numToCurrency,
  openAddressInSameTab,
  scrollToBottomAfterPageChange,
  scrollToTop,
} from "../../../utils/ReusableFunctions";
import { BaseReactComponent } from "../../../utils/form";
import FixAddModal from "../../common/FixAddModal";
import Loading from "../../common/Loading";

// add wallet
import AddWalletModalIcon from "../../../assets/images/icons/wallet-icon.svg";
import WelcomeCard from "../../Portfolio/WelcomeCard";
import {
  GetAllPlan,
  getUser,
  setPageFlagDefault,
  updateWalletListFlag,
} from "../../common/Api";
import UpgradeModal from "../../common/upgradeModal";
import TopWalletAddressList from "../../header/TopWalletAddressList.js";
import MobileLayout from "../../layout/MobileLayout.js";
import { getAllCoins } from "../../onboarding/Api.js";

import TransactionTable from "../../intelligence/TransactionTable.js";
import EmulationTransactionsPageMobile from "./EmulationTransactionsPageMobile.js";
import {
  CheckCopyTradeTransactionsIcon,
  CrossCopyTradeTransactionsIcon,
} from "../../../assets/images/icons/index.js";

class EmulationTransactionsPage extends BaseReactComponent {
  constructor(props) {
    super(props);
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const page = params.get("p");
    const walletList = JSON.parse(window.localStorage.getItem("addWallet"));
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
      passedAddress: "",
      isMobileDevice: false,
      intelligenceStateLocal: {},
      minAmount: "1",
      maxAmount: "1000000000",
      isShowingAge: true,
      selectedTimes: [],
      selectedAssets: [],
      selectedMethods: [],
      selectedNetworks: [],
      amountFilter: "Size",
      goToBottom: false,
      currency: JSON.parse(window.localStorage.getItem("currency")),
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
      // add new wallet
      // userWalletList: window.localStorage.getItem("addWallet")
      //   ? JSON.parse(window.localStorage.getItem("addWallet"))
      //   : [],
      addModal: false,
      isUpdate: 0,
      apiResponse: false,

      userPlan:
        JSON.parse(window.localStorage.getItem("currentPlan")) || "Free",
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
      userPlan: JSON.parse(window.localStorage.getItem("currentPlan")),
    });
  };
  startPageView = () => {
    this.setState({ startTime: new Date() * 1 });
    CopyTradeTransactionHistoryPageView({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    // Inactivity Check
    window.checkCopyTraderTransactionHistoryTimer = setInterval(() => {
      this.checkForInactivity();
    }, 900000);
  };
  componentDidMount() {
    if (this.props.history?.location?.state?.passedAddress) {
      let tempPassedAddress = this.props.history.location.state.passedAddress;
      this.setState({
        passedAddress: tempPassedAddress,
      });
      window.localStorage.setItem("copyTradePassedAddress", tempPassedAddress);
    } else {
      const storedCopyTradePassedAddress = window.localStorage.getItem(
        "copyTradePassedAddress"
      );
      if (storedCopyTradePassedAddress) {
        this.setState({
          passedAddress: storedCopyTradePassedAddress,
        });
      }
    }
    if (mobileCheck()) {
      this.setState({
        isMobileDevice: true,
      });
    }
    scrollToTop();
    const transHistoryPageNumber = window.localStorage.getItem(
      "transHistoryPageNumber"
    );
    const transHistoryConditions = window.localStorage.getItem(
      "transHistoryConditions"
    );
    const transHistorySorts = window.localStorage.getItem("transHistorySorts");

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
            window.localStorage.removeItem("transHistoryPageNumber");
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
            window.localStorage.removeItem("transHistoryConditions");
          }
          if (transHistorySorts) {
            window.localStorage.removeItem("transHistorySorts");
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
            clearInterval(window.checkCopyTraderTransactionHistoryTimer);
          };
        }
      );
    } else {
      if (
        !this.props.commonState.transactionHistory ||
        !this.props.intelligenceState.table
      ) {
        this.props.updateWalletListFlag("transactionHistory", true);
        let tempData = new URLSearchParams();
        tempData.append("start", 0);
        tempData.append("conditions", JSON.stringify([]));
        tempData.append("limit", 50);
        tempData.append("sorts", JSON.stringify([]));
        this.props.getAllWalletListApi(tempData, this);
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
          clearInterval(window.checkCopyTraderTransactionHistoryTimer);
        };
      } else {
        this.props.getFilters(this);
        this.props.getAllCoins();
        // this.props.getCoinRate();
        this.props.GetAllPlan();
        this.props.getUser();
        this.updateTimer(true);
        this.setState({ tableLoading: false });
        if (this.props.intelligenceState) {
          this.setState({
            intelligenceStateLocal: this.props.intelligenceState,
          });
        }
        this.startPageView();
        return () => {
          clearInterval(window.checkCopyTraderTransactionHistoryTimer);
        };
      }
    }
  }
  updateTimer = (first) => {
    const tempExistingExpiryTime = window.localStorage.getItem(
      "copyTraderTransactionHistoryPageExpiryTime"
    );
    if (!tempExistingExpiryTime && !first) {
      this.startPageView();
    }
    const tempExpiryTime = Date.now() + 1800000;
    window.localStorage.setItem(
      "copyTraderTransactionHistoryPageExpiryTime",
      tempExpiryTime
    );
  };
  endPageView = () => {
    clearInterval(window.checkCopyTraderTransactionHistoryTimer);
    window.localStorage.removeItem(
      "copyTraderTransactionHistoryPageExpiryTime"
    );
    if (this.state.startTime) {
      let endTime = new Date() * 1;
      let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
      CopyTradeTimeSpentTransactionHistory({
        time_spent: TimeSpent,
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
    }
  };
  checkForInactivity = () => {
    const tempExpiryTime = window.localStorage.getItem(
      "copyTraderTransactionHistoryPageExpiryTime"
    );
    if (tempExpiryTime && tempExpiryTime < Date.now()) {
      this.endPageView();
    }
  };
  componentWillUnmount() {
    const tempExpiryTime = window.localStorage.getItem(
      "copyTraderTransactionHistoryPageExpiryTime"
    );
    if (tempExpiryTime) {
      this.endPageView();
    }
  }

  callApi = (page = START_INDEX) => {
    let tempCond = [];
    this.state.condition.forEach((tempEle) => {
      if (tempEle.key !== SEARCH_BY_WALLET_ADDRESS_IN) {
        tempCond.push(tempEle);
      }
    });
    const arr = window.localStorage.getItem("addWallet")
      ? JSON.parse(window.localStorage.getItem("addWallet"))
      : [];
    this.setState({
      walletList: JSON.parse(window.localStorage.getItem("addWallet")),
    });
    let address = arr?.map((wallet) => {
      return wallet.address;
    });
    let tempCondTest = [...tempCond];
    tempCond = [
      ...tempCond,
      {
        key: SEARCH_BY_WALLET_ADDRESS_IN,
        value: address,
      },
    ];

    let isDefault = true;

    let originalCondition = [{ key: SEARCH_BY_NOT_DUST, value: true }];
    let originalSort = [{ key: SORT_BY_TIMESTAMP, value: false }];
    if (!compareTwoArrayOfObjects(originalCondition, tempCondTest)) {
      isDefault = false;
    }
    if (!compareTwoArrayOfObjects(this.state.sort, originalSort)) {
      isDefault = false;
    }
    this.setState({ tableLoading: true });
    let data = new URLSearchParams();
    data.append("start", page * API_LIMIT);
    data.append("conditions", JSON.stringify(tempCond));
    data.append("limit", API_LIMIT);
    data.append("sorts", JSON.stringify(this.state.sort));
    this.props.searchTransactionApi(data, this, page, isDefault);
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
          scrollToBottomAfterPageChange();
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
          CopyTradeTransactionHistoryPageBack({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
            page_no: page + 1,
          });
          this.updateTimer();
        } else if (prevPage + 1 === page) {
          CopyTradeTransactionHistoryPageNext({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
            page_no: page + 1,
          });
          this.updateTimer();
        } else {
          CopyTradeTransactionHistoryPageSearch({
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
        { key: SEARCH_BY_NOT_DUST, value: true },
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
      CopyTradeTransactionHistoryYearFilter({
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
        // CopyTradeTransactionHistoryAssetFilter({
        //   session_id: getCurrentUser().id,
        //   email_address: getCurrentUser().email,
        //   asset_filter: value === "allAssets" ? "All assets" : assets,
        //   isSearchUsed: tempIsAssetUsed,
        // });
        this.updateTimer();
        this.setState({ isAssetSearchUsed: false, selectedAssets: value });
      });
    } else if (key === "SEARCH_BY_METHOD_IN") {
      this.setState({ selectedMethods: value });
    } else if (key === "SEARCH_BY_CHAIN_IN") {
      const tempIsNetworkUsed = this.state.isNetworkSearchUsed;
      // CopyTradeTransactionHistoryNetworkFilter({
      //   session_id: getCurrentUser().id,
      //   email_address: getCurrentUser().email,
      //   network_filter: value === "allNetworks" ? "All networks" : value,
      //   isSearchUsed: tempIsNetworkUsed,
      // });
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
      CopyTradeTransactionHistorySearch({
        session_id: getCurrentUser().id,
        email: getCurrentUser().email,
        searched: this.state.search,
      });
      this.updateTimer();
      // this.callApi(this.state.currentPage || START_INDEX, condition)
    }, 1000);
  };
  // handleTableSort = (val) => {
  //   let sort = [...this.state.tableSortOpt];
  //   let obj = [];
  //   sort?.map((el) => {
  //     if (el.title === val) {
  //       if (val === "time") {
  //         obj = [
  //           {
  //             key: SORT_BY_TIMESTAMP,
  //             value: !el.up,
  //           },
  //         ];

  //         CopyTradeTransactionHistorySortDate({
  //           session_id: getCurrentUser().id,
  //           email_address: getCurrentUser().email,
  //         });
  //         this.updateTimer();
  //       } else if (val === "from") {
  //         obj = [
  //           {
  //             key: SORT_BY_FROM_WALLET,
  //             value: !el.up,
  //           },
  //         ];
  //         CopyTradeTransactionHistorySortFrom({
  //           session_id: getCurrentUser().id,
  //           email_address: getCurrentUser().email,
  //         });
  //         this.updateTimer();
  //       } else if (val === "to") {
  //         obj = [
  //           {
  //             key: SORT_BY_TO_WALLET,
  //             value: !el.up,
  //           },
  //         ];
  //         CopyTradeTransactionHistorySortTo({
  //           session_id: getCurrentUser().id,
  //           email_address: getCurrentUser().email,
  //         });
  //         this.updateTimer();
  //       } else if (val === "asset") {
  //         obj = [
  //           {
  //             key: SORT_BY_ASSET,
  //             value: !el.up,
  //           },
  //         ];
  //         CopyTradeTransactionHistorySortAsset({
  //           session_id: getCurrentUser().id,
  //           email_address: getCurrentUser().email,
  //         });
  //         this.updateTimer();
  //       } else if (val === "amount") {
  //         obj = [
  //           {
  //             key: SORT_BY_AMOUNT,
  //             value: !el.up,
  //           },
  //         ];
  //         CopyTradeTransactionHistorySortAmount({
  //           session_id: getCurrentUser().id,
  //           email_address: getCurrentUser().email,
  //         });
  //         this.updateTimer();
  //       } else if (val === "usdThen") {
  //         obj = [
  //           {
  //             key: SORT_BY_USD_VALUE_THEN,
  //             value: !el.up,
  //           },
  //         ];
  //         CopyTradeTransactionHistorySortUSDAmount({
  //           session_id: getCurrentUser().id,
  //           email_address: getCurrentUser().email,
  //         });
  //         this.updateTimer();
  //       } else if (val === "method") {
  //         obj = [
  //           {
  //             key: SORT_BY_METHOD,
  //             value: !el.up,
  //           },
  //         ];
  //         CopyTradeTransactionHistorySortMethod({
  //           session_id: getCurrentUser().id,
  //           email_address: getCurrentUser().email,
  //         });
  //         this.updateTimer();
  //       }
  //       el.up = !el.up;
  //     } else {
  //       el.up = false;
  //     }
  //   });
  //   if (obj && obj.length > 0) {
  //     obj = [{ key: obj[0].key, value: !obj[0].value }];
  //   }
  //   this.setState({
  //     sort: obj,
  //     tableSortOpt: sort,
  //   });
  // };

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

  getAllTransactionHistoryLocal = (apiRes, apiPage) => {
    const tempDataHolder = {
      table: apiRes.results,
      assetPriceList: apiRes.objects.asset_prices,
      totalCount: apiRes.total_count,
      totalPage: Math.ceil(apiRes.total_count / API_LIMIT),
      currentPage: apiPage,
    };

    this.setState({
      intelligenceStateLocal: {
        ...tempDataHolder,
        currentPage: apiPage,
      },
    });
  };
  render() {
    const { table, totalPage, totalCount, currentPage, assetPriceList } =
      this.state.intelligenceStateLocal;
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
          <div className="cp history-table-header-col" id="time">
            {this.state.isMobileDevice ? (
              <span
                onClick={() => {
                  this.toggleAgeTimestamp();
                }}
                className="inter-display-medium f-s-13 lh-16 table-header-font"
                style={{
                  textDecoration: "underline",
                }}
              >
                {this.state.isShowingAge ? "Age" : "Timestamp"}
              </span>
            ) : (
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
                  className="inter-display-medium f-s-13 lh-16 table-header-font"
                  style={{
                    textDecoration: "underline",
                  }}
                >
                  {this.state.isShowingAge ? "Age" : "Timestamp"}
                </span>
              </CustomOverlay>
            )}
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

        coumnWidth: this.state.isShowingAge ? 0.12 : 0.16,
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
                <span className="table-data-font">{tempVal}</span>
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
            <span className="inter-display-medium f-s-13 lh-16 table-header-font">
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

        coumnWidth: this.state.isShowingAge ? 0.08 : 0.075,
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

                CopyTradeTransactionHistoryWalletClicked({
                  session_id: getCurrentUser().id,
                  email_address: getCurrentUser().email,
                  wallet: slink,
                });
                // window.open(shareLink, "_blank", "noreferrer");
                openAddressInSameTab(slink, this.props.setPageFlagDefault);
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
                      this.updateTimer();
                    }}
                  >
                    <span
                      onClick={goToAddress}
                      className="top-account-address table-data-font"
                    >
                      {showThis}
                    </span>

                    <Image
                      src={CopyClipboardIcon}
                      onClick={() => {
                        this.copyContent(rowData.from.address);
                        CopyTradeTransactionHistoryAddressCopied({
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
                        this.updateTimer();
                      }}
                    >
                      <span
                        onClick={goToAddress}
                        className="top-account-address table-data-font"
                      >
                        {showThis}
                      </span>

                      <Image
                        src={CopyClipboardIcon}
                        onClick={() => {
                          this.copyContent(rowData.from.address);
                          CopyTradeTransactionHistoryAddressCopied({
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
                        this.updateTimer();
                      }}
                    >
                      <span
                        onClick={goToAddress}
                        className="top-account-address table-data-font"
                      >
                        {TruncateText(rowData.from.metaData?.nickname)}
                      </span>
                      <Image
                        src={CopyClipboardIcon}
                        onClick={() => {
                          this.copyContent(rowData.from.address);
                          CopyTradeTransactionHistoryAddressCopied({
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
                        this.updateTimer();
                      }}
                    >
                      <span
                        onClick={goToAddress}
                        className="top-account-address table-data-font"
                      >
                        {TruncateText(rowData.from.wallet_metaData.text)}
                      </span>
                      <Image
                        src={CopyClipboardIcon}
                        onClick={() => {
                          this.copyContent(rowData.from.address);
                          CopyTradeTransactionHistoryAddressCopied({
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
                      this.updateTimer();
                    }}
                  >
                    <span
                      onClick={goToAddress}
                      className="top-account-address table-data-font"
                    >
                      {TruncateText(rowData.from.metaData?.displayAddress)}
                    </span>
                    <Image
                      src={CopyClipboardIcon}
                      onClick={() => {
                        this.copyContent(rowData.from.address);
                        CopyTradeTransactionHistoryAddressCopied({
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
                      this.updateTimer();
                    }}
                  >
                    <span
                      onClick={goToAddress}
                      className="top-account-address table-data-font"
                    >
                      {showThis}
                    </span>

                    <Image
                      src={CopyClipboardIcon}
                      onClick={() => {
                        this.copyContent(rowData.from.address);
                        CopyTradeTransactionHistoryAddressCopied({
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
            <span className="inter-display-medium f-s-13 lh-16 table-header-font">
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

        coumnWidth: this.state.isShowingAge ? 0.08 : 0.075,
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

                CopyTradeTransactionHistoryWalletClicked({
                  session_id: getCurrentUser().id,
                  email_address: getCurrentUser().email,
                  wallet: slink,
                });
                // window.open(shareLink, "_blank", "noreferrer");
                openAddressInSameTab(slink, this.props.setPageFlagDefault);
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
                }
              >
                {rowData.to.metaData?.wallet_metaData ? (
                  <span
                    onMouseEnter={() => {
                      this.updateTimer();
                    }}
                  >
                    <span
                      onClick={goToAddress}
                      className="top-account-address table-data-font"
                    >
                      {showThis}
                    </span>
                    <Image
                      src={CopyClipboardIcon}
                      onClick={() => {
                        this.copyContent(rowData.to.address);
                        CopyTradeTransactionHistoryAddressCopied({
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
                        this.updateTimer();
                      }}
                    >
                      <span
                        onClick={goToAddress}
                        className="top-account-address table-data-font"
                      >
                        {showThis}
                      </span>
                      <Image
                        src={CopyClipboardIcon}
                        onClick={() => {
                          this.copyContent(rowData.to.address);
                          CopyTradeTransactionHistoryAddressCopied({
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
                        this.updateTimer();
                      }}
                    >
                      <span
                        onClick={goToAddress}
                        className="top-account-address table-data-font"
                      >
                        {TruncateText(rowData.to.metaData?.nickname)}
                      </span>
                      <Image
                        src={CopyClipboardIcon}
                        onClick={() => {
                          this.copyContent(rowData.to.address);
                          CopyTradeTransactionHistoryAddressCopied({
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
                        this.updateTimer();
                      }}
                    >
                      <span
                        onClick={goToAddress}
                        className="top-account-address table-data-font"
                      >
                        {TruncateText(rowData.to.wallet_metaData.text)}
                      </span>
                      <Image
                        src={CopyClipboardIcon}
                        onClick={() => {
                          this.copyContent(rowData.to.address);
                          CopyTradeTransactionHistoryAddressCopied({
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
                      this.updateTimer();
                    }}
                  >
                    <span
                      onClick={goToAddress}
                      className="top-account-address table-data-font"
                    >
                      {TruncateText(rowData.to.metaData?.displayAddress)}
                    </span>
                    <Image
                      src={CopyClipboardIcon}
                      onClick={() => {
                        this.copyContent(rowData.to.address);
                        CopyTradeTransactionHistoryAddressCopied({
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
                      this.updateTimer();
                    }}
                  >
                    <span
                      onClick={goToAddress}
                      className="top-account-address table-data-font"
                    >
                      {showThis}
                    </span>
                    <Image
                      src={CopyClipboardIcon}
                      onClick={() => {
                        this.copyContent(rowData.to.address);
                        CopyTradeTransactionHistoryAddressCopied({
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
            <span className="inter-display-medium f-s-13 lh-16 table-header-font">
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

        coumnWidth: 0.07,

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
                  <div className="inter-display-medium f-s-13 lh-16 dotDotText table-data-font">
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
            <span className="inter-display-medium f-s-13 lh-16 table-header-font">
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

        coumnWidth: this.state.isShowingAge ? 0.08 : 0.075,
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
                <div className="inter-display-medium f-s-13 lh-16 ellipsis-div table-data-font">
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
            <span className="inter-display-medium f-s-13 lh-16 table-header-font">{`${CurrencyType(
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

        coumnWidth: this.state.isShowingAge ? 0.15 : 0.145,
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
                    tempValueToday
                      ? CurrencyType(false) +
                        amountFormat(tempValueToday, "en-US", "USD")
                      : CurrencyType(false) + "0.00"
                  }
                >
                  <div className="inter-display-medium f-s-13 lh-16 ellipsis-div table-data-font">
                    {CurrencyType(false) +
                      numToCurrency(tempValueToday).toLocaleString("en-US")}
                  </div>
                </CustomOverlay>
                <span style={{ padding: "2px" }}></span>
                <span className="table-data-font">(</span>
                <CustomOverlay
                  position="top"
                  isIcon={false}
                  isInfo={true}
                  isText={true}
                  text={
                    tempValueThen
                      ? CurrencyType(false) +
                        amountFormat(tempValueThen, "en-US", "USD")
                      : CurrencyType(false) + "0.00"
                  }
                >
                  <div className="inter-display-medium f-s-13 lh-16 ellipsis-div table-data-font">
                    {tempValueThen
                      ? CurrencyType(false) +
                        numToCurrency(tempValueThen).toLocaleString("en-US")
                      : CurrencyType(false) + "0.00"}
                  </div>
                </CustomOverlay>
                <span className="table-data-font">)</span>
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
            <span className="inter-display-medium f-s-13 lh-16 table-header-font">
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

        coumnWidth: this.state.isShowingAge ? 0.11 : 0.105,
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
                      <span className="text-capitalize inter-display-medium f-s-13 lh-16 interDisplayMediumTextDarkerText table-data-font">
                        {rowData.method}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-capitalize inter-display-medium f-s-13 lh-16 history-table-method transfer ellipsis-div interDisplayMediumTextDarkerText table-data-font">
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
            className="history-table-header-col table-header-font"
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
        coumnWidth: this.state.isShowingAge ? 0.11 : 0.105,
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
                  <div className="inter-display-medium f-s-13 lh-16 ellipsis-div dotDotText table-data-font">
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
            className="history-table-header-col"
            id="hash"
            // onClick={() => this.handleTableSort("hash")}
          >
            <span className="inter-display-medium f-s-13 lh-16 table-header-font">
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

        coumnWidth: this.state.isShowingAge ? 0.08 : 0.075,
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
                    this.updateTimer();
                  }}
                  className="inter-display-medium f-s-13 lh-16 ellipsis-div table-data-font"
                >
                  {tempHashVal}
                  <Image
                    src={CopyClipboardIcon}
                    onClick={() => {
                      this.copyContent(rowData.hash);
                      CopyTradeTransactionHistoryHashCopied({
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
      {
        labelName: (
          <div className="history-table-header-col" id="status">
            <span className="inter-display-medium f-s-13 lh-16 table-header-font">
              Status
            </span>
          </div>
        ),
        dataKey: "status",

        coumnWidth: this.state.isShowingAge ? 0.12 : 0.115,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "status") {
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
                      <span>
                        <Image
                          src={
                            rowData.method.toLowerCase() === "send"
                              ? CrossCopyTradeTransactionsIcon
                              : CheckCopyTradeTransactionsIcon
                          }
                          style={{
                            height: "12px",
                            width:
                              rowData.method.toLowerCase() === "send"
                                ? ""
                                : "10px",
                            marginRight: "0.5rem",
                          }}
                        />
                      </span>
                      <span className="text-capitalize inter-display-medium f-s-13 lh-16 interDisplayMediumTextDarkerText table-data-font">
                        {rowData.method.toLowerCase() === "send"
                          ? "Rejected"
                          : "Copied"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="text-capitalize inter-display-medium f-s-13 lh-16 ellipsis-div interDisplayMediumTextDarkerText table-data-font">
                    -
                  </span>
                )}
              </>
            );
          }
        },
      },
    ];
    if (mobileCheck()) {
      return (
        <MobileLayout
          handleShare={this.handleShare}
          isSidebarClosed={this.props.isSidebarClosed}
          history={this.props.history}
          CheckApiResponse={this.CheckApiResponse}
        >
          <EmulationTransactionsPageMobile
            passedAddress={this.state.passedAddress}
            tableLoading={this.state.tableLoading}
            tableData={tableData}
            columnData={columnList}
            tableSortOpt={this.state.tableSortOpt}
            handleSort={this.handleTableSort}
            totalPage={totalPage}
            history={this.props.history}
            location={this.props.location}
            currentPage={currentPage}
            onPageChange={this.onPageChange}
            page={currentPage}
            onValidSubmit={this.onValidSubmit}
            intelligenceState={this.props.intelligenceState}
            OnboardingState={this.props.OnboardingState}
            handleAmount={this.handleAmount}
            minAmount={this.state.minAmount}
            maxAmount={this.state.maxAmount}
            addCondition={this.addCondition}
            timeSearchIsUsed={this.timeSearchIsUsed}
            selectedTimes={this.state.selectedTimes}
            assetSearchIsUsed={this.assetSearchIsUsed}
            selectedAssets={this.state.selectedAssets}
            handleFunction={this.handleFunction}
            networkSearchIsUsed={this.networkSearchIsUsed}
            selectedNetworks={this.state.selectedNetworks}
          />
        </MobileLayout>
      );
    }

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
                isShare={window.localStorage.getItem("share_id")}
                isStatic={this.state.isStatic}
                triggerId={this.state.triggerId}
                pname="treansaction history"
                updateTimer={this.updateTimer}
              />
            )}
            <PageHeader
              showpath
              title={
                this.state.passedAddress
                  ? `Transactions for ${this.state.passedAddress}`
                  : "Transactions"
              }
              subTitle={
                this.state.passedAddress
                  ? "Showing all transactions copied from " +
                    this.state.passedAddress
                  : ""
              }
              currentPage={"transactions"}
              history={this.props.history}
              // btnText={"Add wallet"}
              // handleBtn={this.handleAddModal}

              updateTimer={this.updateTimer}
            />

            {/* <div className="fillter_tabs_section">
              <Form onValidSubmit={this.onValidSubmit}>
                <Row>
                  <Col className="transactionHistoryCol">
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
            </div> */}
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
                </>
              )}
            </div>
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

EmulationTransactionsPage.propTypes = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmulationTransactionsPage);
