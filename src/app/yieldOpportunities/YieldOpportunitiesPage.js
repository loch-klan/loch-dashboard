import React from "react";
import { Image, Row, Col } from "react-bootstrap";
import PageHeader from "../common/PageHeader";
import searchIcon from "../../assets/images/icons/search-icon.svg";
import TransactionTable from "../intelligence/TransactionTable";
import { connect } from "react-redux";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import "./_yieldOpportunities.scss";

import {
  SEARCH_BY_WALLET_ADDRESS_IN,
  Method,
  API_LIMIT,
  START_INDEX,
  SEARCH_BY_ASSETS_IN,
  SEARCH_BY_TEXT,
  SORT_BY_TIMESTAMP,
  SORT_BY_FROM_WALLET,
  SORT_BY_TO_WALLET,
  SORT_BY_ASSET,
  SORT_BY_AMOUNT,
  SORT_BY_USD_VALUE_THEN,
  SORT_BY_TRANSACTION_FEE,
  SORT_BY_METHOD,
  BASE_URL_S3,
  SORT_BY_VALUE,
  SEARCH_BY_CHAIN_IN,
} from "../../utils/Constant";
import { searchTransactionApi } from "../intelligence/Api";
import { getYieldOpportunities } from "./Api";
// import { getCoinRate } from "../Portfolio/Api.js";
import {
  FormElement,
  Form,
  CustomTextControl,
  BaseReactComponent,
} from "../../utils/form";
import sortByIcon from "../../assets/images/icons/triangle-down.svg";
import CustomDropdown from "../../utils/form/CustomDropdown";
import { noExponents, UpgradeTriggered } from "../../utils/ReusableFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import {
  TimeSpentTransactionHistory,
  TransactionHistoryAssetFilter,
  TransactionHistoryMethodFilter,
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
import { toast } from "react-toastify";
import FixAddModal from "../common/FixAddModal";
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
import Footer from "../common/footer";

class YieldOpportunitiesPage extends BaseReactComponent {
  constructor(props) {
    super(props);
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const page = params.get("p");
    const walletList = JSON.parse(localStorage.getItem("addWallet"));
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
      //YO
      yieldOpportunitiesList: [],
      totalPage: 0,
      //YO

      currency: JSON.parse(localStorage.getItem("currency")),
      year: "",
      search: "",
      method: "",
      asset: "",
      methodsDropdown: Method.opt,
      table: [],
      sort: [{ key: SORT_BY_VALUE, value: false }],
      walletList,
      currentPage: page ? parseInt(page, 10) : START_INDEX,
      // assetFilter: [],
      // yearFilter: [],
      // methodFilter: [],
      delayTimer: 0,
      condition: cond ? cond : [],
      tableLoading: false,
      tableSortOpt: [
        {
          title: "asset",
          up: false,
        },
        {
          title: "amount",
          up: false,
        },
        {
          title: "usdValue",
          up: false,
        },

        {
          title: "project",
          up: false,
        },
        {
          title: "pool",
          up: false,
        },
        {
          title: "tvl",
          up: false,
        },
        {
          title: "apy",
          up: false,
        },
      ],
      // add new wallet
      // userWalletList: localStorage.getItem("addWallet")
      //   ? JSON.parse(localStorage.getItem("addWallet"))
      //   : [],
      addModal: false,
      isUpdate: 0,
      apiResponse: false,

      userPlan: JSON.parse(localStorage.getItem("currentPlan")) || "Free",
      upgradeModal: false,
      isStatic: false,
      triggerId: 0,

      // start time for time spent on page
      startTime: "",
      isTimeSearchUsed: false,
      isAssetSearchUsed: false,
      isMethodSearchUsed: false,
    };
    this.delayTimer = 0;
  }
  timeSearchIsUsed = () => {
    this.setState({ isTimeSearchUsed: true });
  };
  assetSearchIsUsed = () => {
    this.setState({ isAssetSearchUsed: true });
  };
  methodSearchIsUsed = () => {
    this.setState({ isMethodSearchUsed: true });
  };
  upgradeModal = () => {
    this.setState({
      upgradeModal: !this.state.upgradeModal,
      userPlan: JSON.parse(localStorage.getItem("currentPlan")),
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

    this.props.getAllCoins();

    GetAllPlan();
    getUser();

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
    const tempExistingExpiryTime = localStorage.getItem(
      "transactionHistoryPageExpiryTime"
    );
    if (!tempExistingExpiryTime && !first) {
      this.startPageView();
    }
    const tempExpiryTime = Date.now() + 1800000;
    localStorage.setItem("transactionHistoryPageExpiryTime", tempExpiryTime);
  };
  endPageView = () => {
    clearInterval(window.checkTransactionHistoryTimer);
    localStorage.removeItem("transactionHistoryPageExpiryTime");
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
    const tempExpiryTime = localStorage.getItem(
      "transactionHistoryPageExpiryTime"
    );
    if (tempExpiryTime && tempExpiryTime < Date.now()) {
      this.endPageView();
    }
  };
  componentWillUnmount() {
    const tempExpiryTime = localStorage.getItem(
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
    this.props.getYieldOpportunities(data, page);
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.yieldOpportunitiesState !== this.props.yieldOpportunitiesState
    ) {
      this.setState({
        yieldOpportunitiesList: this.props.yieldOpportunitiesState.data
          ? this.props.yieldOpportunitiesState.data
          : [],
        totalPage: this.props.yieldOpportunitiesState.total_count
          ? Math.ceil(
              this.props.yieldOpportunitiesState.total_count / API_LIMIT
            )
          : 0,
        tableLoading: false,
      });
    }

    const prevParams = new URLSearchParams(prevProps.location.search);
    const prevPage = parseInt(prevParams.get("p") || START_INDEX, 10);

    const params = new URLSearchParams(this.props.location.search);
    const page = parseInt(params.get("p") || START_INDEX, 10);

    if (
      prevPage !== page ||
      prevState.condition !== this.state.condition ||
      prevState.sort !== this.state.sort
    ) {
      // console.log("prev", prevPage, "cur", page);
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
      // console.log("update");
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
    // console.log("api respinse", value);
  };

  onValidSubmit = () => {
    // console.log("Sbmit")
  };

  addCondition = (key, value) => {
    //   // console.log("key, value", key, value);
    //   if (key === "SEARCH_BY_TIMESTAMP_IN") {
    //     const tempIsTimeUsed = this.state.isTimeSearchUsed;
    //     TransactionHistoryYearFilter({
    //       session_id: getCurrentUser().id,
    //       email_address: getCurrentUser().email,
    //       year_filter: value === "allYear" ? "All years" : value,
    //       isSearchUsed: tempIsTimeUsed,
    //     });
    //     this.updateTimer();
    //     this.setState({ isTimeSearchUsed: false });
    //   } else if (key === "SEARCH_BY_ASSETS_IN") {
    //     let assets = [];
    //     Promise.all([
    //       new Promise((resolve) => {
    //         // console.log("abc");
    //         if (value !== "allAssets") {
    //           console.log("test");
    //           this.props.intelligenceState?.assetFilter?.map((e) => {
    //             if (value?.includes(e.value)) {
    //               assets.push(e.label);
    //             }
    //           });
    //         }
    //         resolve(); // Resolve the promise once the code execution is finished
    //       }),
    //     ]).then(() => {
    //       // console.log("asset arr", assets, value);
    //       const tempIsAssetUsed = this.state.isAssetSearchUsed;
    //       TransactionHistoryAssetFilter({
    //         session_id: getCurrentUser().id,
    //         email_address: getCurrentUser().email,
    //         asset_filter: value === "allAssets" ? "All assets" : assets,
    //         isSearchUsed: tempIsAssetUsed,
    //       });
    //       this.updateTimer();
    //       this.setState({ isAssetSearchUsed: false });
    //     });
    //   } else if (key === "SEARCH_BY_METHOD_IN") {
    //     const tempIsMethodUsed = this.state.isMethodSearchUsed;
    //     TransactionHistoryMethodFilter({
    //       session_id: getCurrentUser().id,
    //       email_address: getCurrentUser().email,
    //       method_filter: value === "allMethod" ? "All method" : value,
    //       isSearchUsed: tempIsMethodUsed,
    //     });
    //     this.updateTimer();
    //     this.setState({ isMethodSearchUsed: false });
    //   }
    //   let index = this.state.condition.findIndex((e) => e.key === key);
    //   // console.log("index", index);
    //   let arr = [...this.state.condition];
    //   let search_index = this.state.condition.findIndex(
    //     (e) => e.key === SEARCH_BY_TEXT
    //   );
    //   if (
    //     index !== -1 &&
    //     value !== "allAssets" &&
    //     value !== "allMethod" &&
    //     value !== "allYear"
    //   ) {
    //     // console.log("first if", index);
    //     arr[index].value = value;
    //   } else if (
    //     value === "allAssets" ||
    //     value === "allMethod" ||
    //     value === "allYear"
    //   ) {
    //     // console.log("second if", index);
    //     if (index !== -1) {
    //       arr.splice(index, 1);
    //     }
    //   } else {
    //     // console.log("else", index);
    //     let obj = {};
    //     obj = {
    //       key: key,
    //       value: value,
    //     };
    //     arr.push(obj);
    //   }
    //   if (search_index !== -1) {
    //     if (value === "" && key === SEARCH_BY_TEXT) {
    //       arr.splice(search_index, 1);
    //     }
    //   }
    //   // On Filter start from page 0
    //   this.props.history.replace({
    //     search: `?p=${START_INDEX}`,
    //   });
    //   this.setState({
    //     condition: arr,
    //   });
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
    // let sort = [...this.state.tableSortOpt];
    // let obj = [];
    // sort?.map((el) => {
    //   if (el.title === val) {
    //     if (val === "time") {
    //       obj = [
    //         {
    //           key: SORT_BY_TIMESTAMP,
    //           value: !el.up,
    //         },
    //       ];
    //       TransactionHistorySortDate({
    //         session_id: getCurrentUser().id,
    //         email_address: getCurrentUser().email,
    //       });
    //       this.updateTimer();
    //     } else if (val === "from") {
    //       obj = [
    //         {
    //           key: SORT_BY_FROM_WALLET,
    //           value: !el.up,
    //         },
    //       ];
    //       TransactionHistorySortFrom({
    //         session_id: getCurrentUser().id,
    //         email_address: getCurrentUser().email,
    //       });
    //       this.updateTimer();
    //     } else if (val === "to") {
    //       obj = [
    //         {
    //           key: SORT_BY_TO_WALLET,
    //           value: !el.up,
    //         },
    //       ];
    //       TransactionHistorySortTo({
    //         session_id: getCurrentUser().id,
    //         email_address: getCurrentUser().email,
    //       });
    //       this.updateTimer();
    //     } else if (val === "asset") {
    //       obj = [
    //         {
    //           key: SORT_BY_ASSET,
    //           value: !el.up,
    //         },
    //       ];
    //       TransactionHistorySortAsset({
    //         session_id: getCurrentUser().id,
    //         email_address: getCurrentUser().email,
    //       });
    //       this.updateTimer();
    //     } else if (val === "amount") {
    //       obj = [
    //         {
    //           key: SORT_BY_AMOUNT,
    //           value: !el.up,
    //         },
    //       ];
    //       TransactionHistorySortAmount({
    //         session_id: getCurrentUser().id,
    //         email_address: getCurrentUser().email,
    //       });
    //       this.updateTimer();
    //     } else if (val === "usdThen") {
    //       obj = [
    //         {
    //           key: SORT_BY_USD_VALUE_THEN,
    //           value: !el.up,
    //         },
    //       ];
    //       TransactionHistorySortUSDAmount({
    //         session_id: getCurrentUser().id,
    //         email_address: getCurrentUser().email,
    //       });
    //       this.updateTimer();
    //     } else if (val === "usdTransaction") {
    //       obj = [
    //         {
    //           key: SORT_BY_TRANSACTION_FEE,
    //           value: !el.up,
    //         },
    //       ];
    //       TransactionHistorySortUSDFee({
    //         session_id: getCurrentUser().id,
    //         email_address: getCurrentUser().email,
    //       });
    //       this.updateTimer();
    //     } else if (val === "method") {
    //       obj = [
    //         {
    //           key: SORT_BY_METHOD,
    //           value: !el.up,
    //         },
    //       ];
    //       TransactionHistorySortMethod({
    //         session_id: getCurrentUser().id,
    //         email_address: getCurrentUser().email,
    //       });
    //       this.updateTimer();
    //     }
    //     el.up = !el.up;
    //   } else {
    //     el.up = false;
    //   }
    // });
    // this.setState({
    //   sort: obj,
    //   tableSortOpt: sort,
    // });
  };

  handleShare = () => {
    let lochUser = getCurrentUser().id;
    // let shareLink = BASE_URL_S3 + "home/" + lochUser.link;
    let userWallet = JSON.parse(localStorage.getItem("addWallet"));
    let slink =
      userWallet?.length === 1
        ? userWallet[0].displayAddress || userWallet[0].address
        : lochUser;
    let shareLink =
      BASE_URL_S3 +
      "home/" +
      slink +
      "?redirect=decentralized-finance/yield-opportunities?p=0";
    navigator.clipboard.writeText(shareLink);
    toast.success("Link copied");

    TransactionHistoryShare({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    this.updateTimer();
  };

  render() {
    const { yieldOpportunitiesList } = this.state;
    let tableData =
      yieldOpportunitiesList &&
      yieldOpportunitiesList.length > 0 &&
      yieldOpportunitiesList?.map((row) => {
        return {
          asset: row.asset,
          amount: row.amount,
          value: row.value,
          network: row.chain,
          project: row.project,
          pool: row.symbol,
          tvl: row.tvlUsd,
          apy: row.apy,
        };
      });
    const columnList = [
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
                !this.state.tableSortOpt[0].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "asset",
        coumnWidth: 0.14,
        isCell: true,
        className: "yeildOppYourPortfolioContainer",
        headerClassName: "yeildOppYourPortfolioContainer",
        cell: (rowData, dataKey) => {
          if (dataKey === "asset") {
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={rowData.asset ? rowData.asset[0] : ""}
              >
                <Image src={rowData.asset[1]} className="asset-symbol" />
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
                !this.state.tableSortOpt[1].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "amount",
        coumnWidth: 0.14,
        isCell: true,
        className: "yeildOppYourPortfolioContainer",
        headerClassName: "yeildOppYourPortfolioContainer",
        cell: (rowData, dataKey) => {
          if (dataKey === "amount") {
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={rowData.amount ? rowData.amount : "-"}
              >
                <span>
                  {rowData.amount
                    ? Number(noExponents(rowData.amount)).toLocaleString(
                        "en-US"
                      )
                    : "-"}
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
            id="usdValue"
            onClick={() => this.handleTableSort("usdValue")}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Value (USD)
            </span>
            <Image
              src={sortByIcon}
              className={
                !this.state.tableSortOpt[2].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "usdValue",
        coumnWidth: 0.14,
        isCell: true,
        className: "yeildOppYourPortfolioContainer",
        headerClassName: "yeildOppYourPortfolioContainer",
        cell: (rowData, dataKey) => {
          if (dataKey === "usdValue") {
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={rowData.value ? rowData.value : "-"}
              >
                <div className="inter-display-medium f-s-13 lh-16 grey-313 ellipsis-div">
                  {rowData.value
                    ? Number(rowData.value?.toFixed(2)).toLocaleString("en-US")
                    : "-"}
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
            id="project"
            onClick={() => this.handleTableSort("project")}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Project
            </span>
            <Image
              src={sortByIcon}
              className={
                !this.state.tableSortOpt[3].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "project",
        coumnWidth: 0.14,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "project") {
            return (
              <div className="inter-display-medium f-s-13 lh-16 grey-313 ellipsis-div">
                {rowData.project ? rowData.project : "-"}
              </div>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col"
            id="pool"
            onClick={() => this.handleTableSort("pool")}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Pool
            </span>
            <Image
              src={sortByIcon}
              className={
                !this.state.tableSortOpt[4].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "pool",
        coumnWidth: 0.14,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "pool") {
            return (
              <div className="inter-display-medium f-s-13 lh-16 grey-313 ellipsis-div">
                {rowData.pool ? rowData.pool : "-"}
              </div>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col"
            id="tvl"
            onClick={() => this.handleTableSort("tvl")}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              TVL
            </span>
            <Image
              src={sortByIcon}
              className={
                !this.state.tableSortOpt[5].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "tvl",
        className: "usd-value",
        coumnWidth: 0.14,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "tvl") {
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={rowData.tvl}
              >
                <div className="inter-display-medium f-s-13 lh-16 grey-313 ellipsis-div">
                  {rowData.tvl ? rowData.tvl : "-"}
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
            id="apy"
            onClick={() => this.handleTableSort("apy")}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              APY (%)
            </span>
            <Image
              src={sortByIcon}
              className={
                !this.state.tableSortOpt[6].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "apy",
        className: "usd-value",
        coumnWidth: 0.14,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "apy") {
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={rowData.apy ? rowData.apy : "-"}
              >
                <div className="inter-display-medium f-s-13 lh-16 grey-313 ellipsis-div">
                  {rowData.apy
                    ? Number(noExponents(rowData.apy)).toLocaleString("en-US")
                    : "-"}
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
                isShare={localStorage.getItem("share_id")}
                isStatic={this.state.isStatic}
                triggerId={this.state.triggerId}
                pname="treansaction history"
                updateTimer={this.updateTimer}
              />
            )}
            <PageHeader
              title={"Yield Opportunities"}
              subTitle={
                "Yield bearing opportunties personalized for your portfolio"
              }
              currentPage={"transaction-history"}
              history={this.props.history}
              ShareBtn={true}
              handleShare={this.handleShare}
              updateTimer={this.updateTimer}
            />

            <div className="fillter_tabs_section">
              <Form onValidSubmit={this.onValidSubmit}>
                <Row>
                  <Col md={4}>
                    <CustomDropdown
                      filtername="All networks"
                      options={this.props.OnboardingState.coinsList}
                      action={SEARCH_BY_CHAIN_IN}
                      handleClick={(key, value) =>
                        this.addCondition(key, value)
                      }
                      searchIsUsed={this.networkSearchIsUsed}
                      isCaptialised
                      isGreyChain
                    />
                  </Col>

                  <Col md={4}>
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

                  {/* {fillter_tabs} */}
                  <Col md={4}>
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
            <div className="yeildOppTitleContainer inter-display-medium f-s-13 lh-16 grey-4F4">
              <div className="yeildOppTitleItems yeildOppTitleLeft">
                Your Portfolio
              </div>
              <div className="yeildOppTitleItems yeildOppTitleRight">
                Yield Opportunities
              </div>
            </div>
            <div className="transaction-history-table">
              {this.state.tableLoading ? (
                <div className="loadingSizeContainer">
                  <Loading />
                </div>
              ) : (
                <>
                  <TransactionTable
                    tableData={tableData}
                    columnList={columnList}
                    message={"No Yield Opportunities Found"}
                    totalPage={this.state.totalPage}
                    history={this.props.history}
                    location={this.props.location}
                    page={this.state.currentPage}
                    tableLoading={this.state.tableLoading}
                  />
                  <Footer />
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
  intelligenceState: state.IntelligenceState,
  commonState: state.CommonState,
  yieldOpportunitiesState: state.YieldOpportunitiesState,
  OnboardingState: state.OnboardingState,
});
const mapDispatchToProps = {
  searchTransactionApi,
  getYieldOpportunities,
  getAllCoins,
  setPageFlagDefault,
  updateWalletListFlag,
};

YieldOpportunitiesPage.propTypes = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(YieldOpportunitiesPage);
