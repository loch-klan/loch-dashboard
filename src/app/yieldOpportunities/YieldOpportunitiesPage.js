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
  SORT_BY_ASSET,
  BASE_URL_S3,
  SORT_BY_VALUE,
  SEARCH_BY_CHAIN_IN,
  SORT_BY_APY,
  SORT_BY_POOL,
  SORT_BY_PROJECT,
  SORT_BY_TVL,
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
import {
  amountFormat,
  CurrencyType,
  noExponents,
  numToCurrency,
  UpgradeTriggered,
} from "../../utils/ReusableFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import {
  TimeSpentYieldOpportunities,
  YieldOpportunitiesPageBack,
  YieldOpportunitiesPageNext,
  YieldOpportunitiesPageSearch,
  YieldOpportunitiesPageView,
  YieldOpportunitiesSearch,
  YieldOpportunitiesShare,
  YieldOpportunitiesAssetFilter,
  YieldOpportunitiesNetworkFilter,
  YieldOpportunitiesSortAPY,
  YieldOpportunitiesSortAsset,
  YieldOpportunitiesSortPool,
  YieldOpportunitiesSortProject,
  YieldOpportunitiesSortTVL,
  YieldOpportunitiesSortUSDvalue,
} from "../../utils/AnalyticsFunctions";
import Loading from "../common/Loading";
import { toast } from "react-toastify";
import FixAddModal from "../common/FixAddModal";
import AddWalletModalIcon from "../../assets/images/icons/wallet-icon.svg";
import { getAllCoins } from "../onboarding/Api.js";
import { getFilters } from "../intelligence/Api";
import {
  GetAllPlan,
  getUser,
  setPageFlagDefault,
  updateWalletListFlag,
} from "../common/Api";
import UpgradeModal from "../common/upgradeModal";
import WelcomeCard from "../Portfolio/WelcomeCard";
import Footer from "../common/footer";
import CoinChip from "../wallet/CoinChip";
import { getAllWalletListApi } from "../wallet/Api";

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
    const cond = [];
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
      sort: [],
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
      goToBottom: false,
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
    YieldOpportunitiesPageView({
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

    this.props.getFilters();
    this.props.getAllCoins();

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
      TimeSpentYieldOpportunities({
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
    let listOfAddresses = "";
    if (
      this.props.walletState &&
      this.props.walletState.walletList?.length > 0
    ) {
      const walletList = this.props.walletState.walletList;
      const tempWalletList = [];
      if (walletList) {
        walletList.forEach((data) => {
          let tempAddress = "";
          if (data?.displayAddress) {
            tempAddress = data.displayAddress;
          } else if (data?.address) {
            tempAddress = data.address;
          } else if (data?.apiAddress) {
            tempAddress = data.apiAddress;
          }

          tempWalletList.push(tempAddress);
        });
        tempWalletList.sort().reverse();
        listOfAddresses = JSON.stringify(tempWalletList);
      }
    }

    this.setState({ tableLoading: true });
    let data = new URLSearchParams();
    
    data.append("start", page * API_LIMIT);
    data.append("conditions", JSON.stringify(this.state.condition));
    data.append("limit", API_LIMIT);
    data.append("sorts", JSON.stringify(this.state.sort));
    data.append("wallet_addresses", listOfAddresses);
    if (listOfAddresses) {
      this.props.getYieldOpportunities(data, page);
    }
  };
  onPageChange = () => {
    this.setState({
      goToBottom: true,
    });
  };
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.walletState !== this.props.walletState) {
      this.callApi();
    }
    if (prevProps.yieldPoolState !== this.props.yieldPoolState) {
      this.callApi();
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
    if (
      prevProps.yieldOpportunitiesState !== this.props.yieldOpportunitiesState
    ) {
      this.setState({
        yieldOpportunitiesList: this.props.yieldOpportunitiesState.yield_pools
          ? this.props.yieldOpportunitiesState.yield_pools
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
    if (!this.props.commonState.yieldOpportunities) {
      this.props.updateWalletListFlag("yieldOpportunities", true);
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
      this.setState({
        currentPage: page,
      });
      this.callApi(page);
      if (prevPage !== page) {
        if (prevPage - 1 === page) {
          YieldOpportunitiesPageBack({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
            page_no: page + 1,
          });
          this.updateTimer();
        } else if (prevPage + 1 === page) {
          YieldOpportunitiesPageNext({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
            page_no: page + 1,
          });
          this.updateTimer();
        } else {
          YieldOpportunitiesPageSearch({
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
      this.props.getFilters();
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
  };

  onValidSubmit = () => {
    // console.log("Sbmit")
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
  addCondition = (key, value) => {
    if (key === "SEARCH_BY_ASSETS_IN") {
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
        YieldOpportunitiesAssetFilter({
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
      YieldOpportunitiesNetworkFilter({
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
    if (index !== -1 && value !== "allAssets" && value !== "allNetworks") {
      arr[index].value = value;
    } else if (value === "allAssets" || value === "allNetworks") {
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
      YieldOpportunitiesSearch({
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
    sort?.forEach((el) => {
      if (el.title === val) {
        if (val === "asset") {
          obj = [
            {
              key: SORT_BY_ASSET,
              value: !el.up,
            },
          ];
          YieldOpportunitiesSortAsset({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
          });
          this.updateTimer();
        } else if (val === "usdValue") {
          obj = [
            {
              key: SORT_BY_VALUE,
              value: !el.up,
            },
          ];
          YieldOpportunitiesSortUSDvalue({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
          });
          this.updateTimer();
        } else if (val === "project") {
          obj = [
            {
              key: SORT_BY_PROJECT,
              value: !el.up,
            },
          ];
          YieldOpportunitiesSortProject({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
          });
          this.updateTimer();
        } else if (val === "pool") {
          obj = [
            {
              key: SORT_BY_POOL,
              value: !el.up,
            },
          ];
          YieldOpportunitiesSortPool({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
          });
          this.updateTimer();
        } else if (val === "tvl") {
          obj = [
            {
              key: SORT_BY_TVL,
              value: !el.up,
            },
          ];
          YieldOpportunitiesSortTVL({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
          });
          this.updateTimer();
        } else if (val === "apy") {
          obj = [
            {
              key: SORT_BY_APY,
              value: !el.up,
            },
          ];
          YieldOpportunitiesSortAPY({
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

  handleShare = () => {
    let lochUser = getCurrentUser().id;
    // let shareLink = BASE_URL_S3 + "home/" + lochUser.link;
    let userWallet = JSON.parse(localStorage.getItem("addWallet"));
    let slink =
      userWallet?.length === 1
        ? userWallet[0].displayAddress || userWallet[0].address
        : lochUser;
    let shareLink =
      BASE_URL_S3 + "home/" + slink + "?redirect=yield-opportunities?p=0";
    navigator.clipboard.writeText(shareLink);
    toast.success("Link copied");

    YieldOpportunitiesShare({
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
          pool: row.pool,
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
        coumnWidth: 0.16,
        isCell: true,
        className: "yeildOppYourPortfolioContainer",
        headerClassName: "yeildOppYourPortfolioContainer",
        cell: (rowData, dataKey) => {
          if (dataKey === "asset") {
            return (
              <CoinChip
                coin_img_src={rowData.asset.symbol}
                coin_code={rowData.asset.code}
                chain={rowData?.network}
              />
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
        coumnWidth: 0.16,
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
                text={amountFormat(
                  rowData.value * this.state.currency?.rate,
                  "en-US",
                  "USD"
                )}
              >
                <div className="cost-common-container">
                  <div className="cost-common">
                    <span className="inter-display-medium f-s-13 lh-16 grey-313">
                      {CurrencyType(false)}
                      {numToCurrency(rowData.value * this.state.currency?.rate)}
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
        coumnWidth: 0.16,
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
        coumnWidth: 0.16,
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
        coumnWidth: 0.16,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "tvl") {
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={amountFormat(
                  rowData.tvl * this.state.currency?.rate,
                  "en-US",
                  "USD"
                )}
              >
                <div className="cost-common-container">
                  <div className="cost-common">
                    <span className="inter-display-medium f-s-13 lh-16 grey-313">
                      {CurrencyType(false)}
                      {numToCurrency(rowData.tvl * this.state.currency?.rate)}
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
            id="apy"
            onClick={() => this.handleTableSort("apy")}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              APY
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
        coumnWidth: 0.16,
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
                    ? Number(noExponents(rowData.apy)).toLocaleString("en-US") +
                      "%"
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
                      handleClick={this.handleFunction}
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
                    message={"No yield opportunities found"}
                    totalPage={this.state.totalPage}
                    history={this.props.history}
                    location={this.props.location}
                    page={this.state.currentPage}
                    tableLoading={this.state.tableLoading}
                    onPageChange={this.onPageChange}
                    addWatermark
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
  yieldPoolState: state.YieldPoolState,
  OnboardingState: state.OnboardingState,
  HeaderState: state.HeaderState,
  walletState: state.WalletState,
});
const mapDispatchToProps = {
  searchTransactionApi,
  getYieldOpportunities,
  getFilters,
  getAllCoins,
  setPageFlagDefault,
  getAllWalletListApi,
  updateWalletListFlag,
  GetAllPlan,
  getUser,
};

YieldOpportunitiesPage.propTypes = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(YieldOpportunitiesPage);
