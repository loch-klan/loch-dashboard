import React from "react";
import { Image, Row, Col } from "react-bootstrap";
import PageHeader from "../common/PageHeader";
import searchIcon from "../../assets/images/icons/search-icon.svg";
import TransactionTable from "./TransactionTable";
import { connect } from "react-redux";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";

import {
  SEARCH_BY_WALLET_ADDRESS_IN,
  Method,
  API_LIMIT,
  START_INDEX,
  SEARCH_BY_ASSETS_IN,
  SEARCH_BY_TEXT,
  SEARCH_BY_TIMESTAMP_IN,
  SEARCH_BY_METHOD_IN,
  SORT_BY_TIMESTAMP,
  SORT_BY_FROM_WALLET,
  SORT_BY_TO_WALLET,
  SORT_BY_ASSET,
  SORT_BY_AMOUNT,
  SORT_BY_USD_VALUE_THEN,
  SORT_BY_TRANSACTION_FEE,
  SORT_BY_METHOD,
  DEFAULT_PRICE,
  SEARCH_BY_NOT_DUST,
  BASE_URL_S3,
  SEARCH_BY_CHAIN_IN,
} from "../../utils/Constant";
import { getAllWalletListApi } from "../wallet/Api";
import { searchTransactionApi, getFilters } from "./Api";
// import { getCoinRate } from "../Portfolio/Api.js";
import moment from "moment";
import {
  FormElement,
  Form,
  CustomTextControl,
  BaseReactComponent,
} from "../../utils/form";
import unrecognizedIcon from "../../assets/images/icons/unrecognisedicon.svg";
import sortByIcon from "../../assets/images/icons/triangle-down.svg";
import CustomDropdown from "../../utils/form/CustomDropdown";
import {
  CurrencyType,
  noExponents,
  numToCurrency,
  TruncateText,
  UpgradeTriggered,
} from "../../utils/ReusableFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import {
  TimeSpentTransactionHistory,
  TransactionHistoryAddress,
  TransactionHistoryAssetFilter,
  TransactionHistoryExport,
  TransactionHistoryHideDust,
  TransactionHistoryMethodFilter,
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
  TransactionHistorySortUSDFee,
  TransactionHistoryYearFilter,
} from "../../utils/AnalyticsFunctions";
import Loading from "../common/Loading";
import FeedbackForm from "../common/FeedbackForm";
import CopyClipboardIcon from "../../assets/images/CopyClipboardIcon.svg";
import { toast } from "react-toastify";
import FixAddModal from "../common/FixAddModal";

// add wallet
import AddWalletModalIcon from "../../assets/images/icons/wallet-icon.svg";
import { getAllCoins } from "../onboarding/Api.js";
import {
  GetAllPlan,
  getUser,
  setPageFlagDefault,
  updateWalletListFlag,
} from "../common/Api";
import UpgradeModal from "../common/upgradeModal";
import WelcomeCard from "../Portfolio/WelcomeCard";
import ExitOverlay from "../common/ExitOverlay";
import { ExportIconWhite } from "../../assets/images/icons";

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
    ];
    this.state = {
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
      addressList: address,
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
      ],
      showDust: false,
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
      possibleMethods: ["receive", "send", "approve", "transfer"],
    };
    this.delayTimer = 0;
  }
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
    if (prevState.walletList !== this.state.walletList) {
      const allWalletAddresses = this.state.walletList.map((mapData) =>
        mapData.address ? mapData.address : ""
      );

      this.setState({
        addressList: allWalletAddresses,
      });
    }
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
      if (badge[0].name !== "All") {
        badge.forEach((resData) => tempArr.push(resData.id));
      }
      this.addCondition(
        SEARCH_BY_CHAIN_IN,
        tempArr && tempArr.length > 0 ? tempArr : "allNetworks"
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
      this.setState({ isTimeSearchUsed: false });
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
        this.setState({ isAssetSearchUsed: false });
      });
    } else if (key === "SEARCH_BY_CHAIN_IN") {
      const tempIsNetworkUsed = this.state.isNetworkSearchUsed;
      TransactionHistoryNetworkFilter({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        network_filter: value === "allNetworks" ? "All networks" : value,
        isSearchUsed: tempIsNetworkUsed,
      });
      this.updateTimer();
      this.setState({ isNetworkSearchUsed: false });
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
      value !== "allNetworks"
    ) {
      arr[index].value = value;
    } else if (
      value === "allAssets" ||
      value === "allMethod" ||
      value === "allYear" ||
      value === "allNetworks"
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
    console.log("tableSortOpt are ", this.state.tableSortOpt);
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
        };
      });

    const columnList = [
      {
        labelName: (
          <div
            className="cp history-table-header-col"
            id="time"
            onClick={() => this.handleTableSort("time")}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Date
            </span>
            <Image
              src={sortByIcon}
              className={
                this.state.tableSortOpt[0].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "time",
        // coumnWidth: 90,
        coumnWidth: 0.16,
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
        // coumnWidth: 90,
        coumnWidth: 0.15,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "from") {
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
                  <span>
                    <Image
                      src={
                        rowData.from.metaData?.wallet_metaData?.symbol ||
                        unrecognizedIcon
                      }
                      className="history-table-icon"
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
            onClick={() => this.handleTableSort("to")}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
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
        // coumnWidth: 90,
        coumnWidth: 0.15,
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
                  <span>
                    <Image
                      src={
                        rowData.to.metaData?.wallet_metaData?.symbol ||
                        unrecognizedIcon
                      }
                      className="history-table-icon"
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
            onClick={() => this.handleTableSort("asset")}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
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
        // coumnWidth: 130,
        coumnWidth: 0.2,
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
                this.state.tableSortOpt[4].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "amount",
        // coumnWidth: 100,
        coumnWidth: 0.15,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "amount") {
            // return rowData.amount.value?.toFixed(2)
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={Number(noExponents(rowData.amount.value)).toLocaleString(
                  "en-US"
                )}
              >
                <div className="inter-display-medium f-s-13 lh-16 grey-313 ellipsis-div">
                  {numToCurrency(rowData.amount.value).toLocaleString("en-US")}
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
                this.state.tableSortOpt[5].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "usdValueThen",
        // coumnWidth: 100,
        className: "usd-value",
        coumnWidth: 0.25,
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

            return (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <CustomOverlay
                  position="top"
                  isIcon={false}
                  isInfo={true}
                  isText={true}
                  text={
                    CurrencyType(false) +
                    Number(valueToday?.toFixed(2)).toLocaleString("en-US")
                  }
                >
                  <div className="inter-display-medium f-s-13 lh-16 grey-313 ellipsis-div">
                    {CurrencyType(false) +
                      numToCurrency(valueToday).toLocaleString("en-US")}
                  </div>
                </CustomOverlay>
                <span style={{ padding: "2px" }}></span>(
                <CustomOverlay
                  position="top"
                  isIcon={false}
                  isInfo={true}
                  isText={true}
                  text={
                    CurrencyType(false) +
                    Number(valueThen?.toFixed(2)).toLocaleString("en-US")
                  }
                >
                  <div className="inter-display-medium f-s-13 lh-16 grey-313 ellipsis-div">
                    {valueThen
                      ? CurrencyType(false) +
                        numToCurrency(valueThen).toLocaleString("en-US")
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
            id="usdTransactionFee"
            onClick={() => this.handleTableSort("usdTransaction")}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">{`${CurrencyType(
              true
            )} fee (then)`}</span>
            <Image
              src={sortByIcon}
              className={
                this.state.tableSortOpt[7].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "usdTransactionFee",
        // coumnWidth: 100,
        className: "usd-value",
        coumnWidth: 0.25,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "usdTransactionFee") {
            let chain = Object.entries(assetPriceList);
            let valueToday;
            let valueThen;
            chain.find((chain) => {
              if (chain[0] === rowData.usdTransactionFee.id) {
                valueToday =
                  rowData.usdTransactionFee.value *
                    chain[1].quote.USD.price *
                    currency?.rate || DEFAULT_PRICE;
                valueThen =
                  rowData.usdTransactionFee.value *
                  rowData.usdValueThen.assetPrice *
                  currency?.rate;
              }
            });
            return (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <CustomOverlay
                  position="top"
                  isIcon={false}
                  isInfo={true}
                  isText={true}
                  text={
                    CurrencyType(false) +
                    Number(valueToday?.toFixed(2)).toLocaleString("en-US")
                  }
                >
                  <div className="inter-display-medium f-s-13 lh-16 grey-313 ellipsis-div">
                    {valueToday
                      ? CurrencyType(false) +
                        numToCurrency(valueToday).toLocaleString("en-US")
                      : CurrencyType(false) + "0.00"}
                  </div>
                </CustomOverlay>
                <span style={{ padding: "2px" }}></span>(
                <CustomOverlay
                  position="top"
                  isIcon={false}
                  isInfo={true}
                  isText={true}
                  text={
                    CurrencyType(false) +
                    Number(valueThen?.toFixed(2)).toLocaleString("en-US")
                  }
                >
                  <div className="inter-display-medium f-s-13 lh-16 grey-313 ellipsis-div">
                    {valueThen
                      ? CurrencyType(false) +
                        numToCurrency(valueThen).toLocaleString("en-US")
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
                this.state.tableSortOpt[8].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "method",
        // coumnWidth: 100,
        coumnWidth: 0.2,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "method") {
            let actualMethod = "";
            if (rowData.method) {
              actualMethod = rowData.method.toLowerCase();
            }
            if (!this.state.possibleMethods.includes(actualMethod)) {
              let currentFromWalletAdd = "";
              let currentToWalletAdd = "";
              if (rowData.from.address) {
                currentFromWalletAdd = rowData.from.address;
              }
              if (rowData.to.address) {
                currentToWalletAdd = rowData.to.address;
              }
              if (this.state.addressList.includes(currentToWalletAdd)) {
                actualMethod = "receive";
              } else if (
                this.state.addressList.includes(currentFromWalletAdd)
              ) {
                actualMethod = "send";
              }
            }
            return (
              <>
                {actualMethod &&
                (actualMethod === "send" || actualMethod === "receive") ? (
                  <div className="gainLossContainer">
                    <div
                      className={`gainLoss ${
                        actualMethod === "send" ? "loss" : "gain"
                      }`}
                    >
                      <span className="text-capitalize inter-display-medium f-s-13 lh-16 grey-313">
                        {actualMethod}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-capitalize inter-display-medium f-s-13 lh-16 black-191 history-table-method transfer ellipsis-div">
                    {actualMethod}
                  </div>
                )}
              </>
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
                updateTimer={this.updateTimer}
                handleAddModal={this.handleAddModal}
              />
            </div>
          </div>
        </div>
        <div className="history-table-section m-t-80">
          <div className="history-table page">
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
              showpath={true}
              currentPage={"transaction-history"}
              history={this.props.history}
              // btnText={"Add wallet"}
              // handleBtn={this.handleAddModal}
              ShareBtn={true}
              ExportBtn
              exportBtnTxt="Click to export transactions"
              handleExportModal={this.handleExportModal}
              handleShare={this.handleShare}
              updateTimer={this.updateTimer}
              showHideDust
              showHideDustVal={this.state.showDust}
              showHideDustFun={this.showDust}
            />

            <div className="fillter_tabs_section">
              <Form onValidSubmit={this.onValidSubmit}>
                <Row>
                  <Col className="transactionHistoryCol">
                    <CustomDropdown
                      filtername="All years"
                      options={this.props.intelligenceState.yearFilter}
                      action={SEARCH_BY_TIMESTAMP_IN}
                      handleClick={(key, value) =>
                        this.addCondition(key, value)
                      }
                      searchIsUsed={this.timeSearchIsUsed}
                    />
                  </Col>
                  <Col className="transactionHistoryCol">
                    <CustomDropdown
                      filtername="All assets"
                      options={this.props.intelligenceState.assetFilter}
                      action={SEARCH_BY_ASSETS_IN}
                      handleClick={(key, value) =>
                        this.addCondition(key, value)
                      }
                      searchIsUsed={this.assetSearchIsUsed}
                    />
                  </Col>
                  <Col className="transactionHistoryCol">
                    <CustomDropdown
                      filtername="All methods"
                      options={this.props.intelligenceState.methodFilter}
                      action={SEARCH_BY_METHOD_IN}
                      handleClick={(key, value) =>
                        this.addCondition(key, value)
                      }
                      searchIsUsed={this.methodSearchIsUsed}
                      isCaptialised
                    />
                  </Col>
                  <Col className="transactionHistoryCol">
                    <CustomDropdown
                      filtername="All networks"
                      options={this.props.OnboardingState.coinsList}
                      action={SEARCH_BY_CHAIN_IN}
                      handleClick={this.handleFunction}
                      searchIsUsed={this.networkSearchIsUsed}
                      isCaptialised
                      isGreyChain
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
                            placeholder: "Search",
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
