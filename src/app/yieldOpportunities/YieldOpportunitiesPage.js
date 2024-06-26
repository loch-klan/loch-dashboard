import React from "react";
import { Col, Image, Row } from "react-bootstrap";
import { connect } from "react-redux";
import searchIcon from "../../assets/images/icons/search-icon.svg";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import PageHeader from "../common/PageHeader";
import TransactionTable from "../intelligence/TransactionTable";
import "./_yieldOpportunities.scss";

import {
  API_LIMIT,
  BASE_URL_S3,
  Method,
  SEARCH_BY_ASSETS_IN,
  SEARCH_BY_CHAIN_IN,
  SEARCH_BY_TEXT,
  SORT_BY_APY,
  SORT_BY_ASSET,
  SORT_BY_POOL,
  SORT_BY_PROJECT,
  SORT_BY_TVL,
  SORT_BY_VALUE,
  START_INDEX,
} from "../../utils/Constant";
import { getYieldOpportunities } from "./Api";
// import { getCoinRate } from "../Portfolio/Api.js";
import { toast } from "react-toastify";
import sortByIcon from "../../assets/images/icons/triangle-down.svg";
import AddWalletModalIcon from "../../assets/images/icons/wallet-icon.svg";
import {
  TimeSpentYieldOpportunities,
  YieldOpportunitiesAssetFilter,
  YieldOpportunitiesNetworkFilter,
  YieldOpportunitiesPageBack,
  YieldOpportunitiesPageNext,
  YieldOpportunitiesPageSearch,
  YieldOpportunitiesPageView,
  YieldOpportunitiesSearch,
  YieldOpportunitiesShare,
  YieldOpportunitiesSortAPY,
  YieldOpportunitiesSortAsset,
  YieldOpportunitiesSortPool,
  YieldOpportunitiesSortProject,
  YieldOpportunitiesSortTVL,
  YieldOpportunitiesSortUSDvalue,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import {
  CurrencyType,
  UpgradeTriggered,
  amountFormat,
  compareTwoArrayOfObjects,
  dontOpenLoginPopup,
  isPremiumUser,
  mobileCheck,
  noExponents,
  numToCurrency,
  removeBlurMethods,
  removeOpenModalAfterLogin,
  removeSignUpMethods,
  scrollToBottomAfterPageChange,
  scrollToTop,
} from "../../utils/ReusableFunctions";
import {
  BaseReactComponent,
  CustomTextControl,
  Form,
  FormElement,
} from "../../utils/form";
import CustomDropdown from "../../utils/form/CustomDropdown";
import WelcomeCard from "../Portfolio/WelcomeCard";
import {
  GetAllPlan,
  getUser,
  setPageFlagDefault,
  updateWalletListFlag,
} from "../common/Api";
import FixAddModal from "../common/FixAddModal";
import Loading from "../common/Loading";
import Footer from "../common/footer";
import UpgradeModal from "../common/upgradeModal";
import { getFilters } from "../intelligence/Api";
import { getAllCoins } from "../onboarding/Api.js";
import { getAllWalletListApi } from "../wallet/Api";
import CoinChip from "../wallet/CoinChip";
import TopWalletAddressList from "../header/TopWalletAddressList.js";
import MobileLayout from "../layout/MobileLayout.js";
import YieldOpportunitiesMobilePage from "./YieldOpportunitiesMobilePage.js";
import PaywallModal from "../common/PaywallModal.js";
import CustomOverlayUgradeToPremium from "../../utils/commonComponent/CustomOverlayUgradeToPremium.js";

class YieldOpportunitiesPage extends BaseReactComponent {
  constructor(props) {
    super(props);
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const page = params.get("p");
    const walletList = JSON.parse(window.localStorage.getItem("addWallet"));
    const address = walletList?.map((wallet) => {
      return wallet.address;
    });
    const cond = [];
    this.state = {
      isPremiumUser: false,
      isLochPaymentModal: false,
      isMobileDevice: false,
      //YO
      yieldOpportunitiesList: [],
      totalPage: 0,
      //YO

      currency: JSON.parse(window.localStorage.getItem("currency")),
      year: "",
      search: "",
      method: "",
      asset: "",
      methodsDropdown: Method.opt,
      table: [],
      sort: [{ key: SORT_BY_TVL, value: false }],
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
          up: true,
        },
        {
          title: "apy",
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
      userPlan: JSON.parse(window.localStorage.getItem("currentPlan")),
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
  checkPremium = () => {
    if (isPremiumUser()) {
      this.setState({
        isPremiumUser: true,
      });
    } else {
      this.setState({
        isPremiumUser: false,
      });
    }
  };
  componentDidMount() {
    this.checkPremium();
    if (mobileCheck()) {
      this.setState({
        isMobileDevice: true,
      });
    }
    // const userDetails = JSON.parse(window.localStorage.getItem("lochUser"));
    // if (userDetails && userDetails.email) {
    //   const shouldOpenNoficationModal = window.localStorage.getItem(
    //     "openYieldOppPaymentModal"
    //   );
    //   const isOpenForSearch = window.localStorage.getItem(
    //     "openSearchbarPaymentModal"
    //   );
    //   if (shouldOpenNoficationModal && !isOpenForSearch) {
    //     setTimeout(() => {
    //       removeOpenModalAfterLogin();
    //       this.setState({
    //         isLochPaymentModal: true,
    //       });
    //     }, 1000);
    //   }
    // }
    scrollToTop();
    this.props.history.replace({
      search: `?p=${this.state.currentPage}`,
    });
    if (
      !this.props.yieldOpportunitiesState.yield_pools ||
      !this.props.commonState.yieldOpportunities
    ) {
      this.callApi(this.state.currentPage || START_INDEX);
    } else {
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
    const tempExistingExpiryTime = window.localStorage.getItem(
      "transactionHistoryPageExpiryTime"
    );
    if (!tempExistingExpiryTime && !first) {
      this.startPageView();
    }
    const tempExpiryTime = Date.now() + 1800000;
    window.localStorage.setItem(
      "transactionHistoryPageExpiryTime",
      tempExpiryTime
    );
  };
  endPageView = () => {
    clearInterval(window.checkTransactionHistoryTimer);
    window.localStorage.removeItem("transactionHistoryPageExpiryTime");
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
    const tempExpiryTime = window.localStorage.getItem(
      "transactionHistoryPageExpiryTime"
    );
    if (tempExpiryTime && tempExpiryTime < Date.now()) {
      this.endPageView();
    }
  };
  componentWillUnmount() {
    const tempExpiryTime = window.localStorage.getItem(
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
      console.log("walletList ", walletList);
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
    let isDefault = true;
    let originalCondition = [];
    let originalSort = [{ key: SORT_BY_TVL, value: false }];
    if (!compareTwoArrayOfObjects(originalCondition, this.state.condition)) {
      isDefault = false;
    }
    if (!compareTwoArrayOfObjects(this.state.sort, originalSort)) {
      isDefault = false;
    }
    this.setState({ tableLoading: true });
    let data = new URLSearchParams();
    data.append("start", page * API_LIMIT);
    data.append("conditions", JSON.stringify(this.state.condition));
    data.append("limit", API_LIMIT);
    data.append("sorts", JSON.stringify(this.state.sort));
    data.append("wallet_addresses", listOfAddresses);
    if (listOfAddresses) {
      this.props.updateWalletListFlag("yieldOpportunities", true);
      this.props.getYieldOpportunities(data, page, this, isDefault);
    }
  };
  getAllYieldOppLocal = (apiResponseLocal) => {
    this.setState({
      yieldOpportunitiesList: apiResponseLocal.yield_pools
        ? apiResponseLocal.yield_pools
        : [],
      totalPage: apiResponseLocal.total_count
        ? Math.ceil(apiResponseLocal.total_count / API_LIMIT)
        : 0,
      tableLoading: false,
      currentPage: apiResponseLocal.currentPage,
    });
  };
  onPageChange = () => {
    this.setState({
      goToBottom: true,
    });
  };
  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.walletState?.walletList !== this.props.walletState?.walletList
    ) {
      this.callApi();
    }
    // if (prevProps.yieldPoolState !== this.props.yieldPoolState) {
    //   this.callApi();
    // }
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
    if (
      prevProps.yieldOpportunitiesState !== this.props.yieldOpportunitiesState
    ) {
      this.checkPremium();
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
    // if (prevState.apiResponse != this.state.apiResponse) {
    //   const address = this.state.walletList?.map((wallet) => {
    //     return wallet.address;
    //   });
    //   const cond = [
    //     {
    //       key: SEARCH_BY_WALLET_ADDRESS_IN,
    //       value: address,
    //     },
    //   ];
    //   this.props.getFilters();
    //   this.props.getAllCoins();
    //   this.setState({
    //     condition: cond ? cond : [],
    //     apiResponse: false,
    //   });

    //   this.callApi(this.state.currentPage || START_INDEX);
    // }
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
    if (!this.state.isPremiumUser) {
      this.goToPayModal();
      return null;
    }
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
          asset_filter: value === "allAssets" ? "All tokens" : assets,
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
            homePage: true,
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
            homePage: true,
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
            homePage: true,
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
            homePage: true,
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
            homePage: true,
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
            homePage: true,
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
    let userWallet = JSON.parse(window.localStorage.getItem("addWallet"));
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
  goToPayModal = () => {
    if (this.state.isPremiumUser) {
      return null;
    }
    removeBlurMethods();
    removeSignUpMethods();
    window.localStorage.setItem("blurredYieldOppSignInModal", true);
    const userDetails = JSON.parse(window.localStorage.getItem("lochUser"));
    if (userDetails && userDetails.email) {
      dontOpenLoginPopup();
      this.setState({
        isLochPaymentModal: true,
      });
    } else {
      removeOpenModalAfterLogin();
      setTimeout(() => {
        window.localStorage.setItem("openYieldOppPaymentModal", true);
      }, 1000);
      if (document.getElementById("sidebar-open-sign-in-btn")) {
        document.getElementById("sidebar-open-sign-in-btn").click();
        dontOpenLoginPopup();
      } else if (document.getElementById("sidebar-closed-sign-in-btn")) {
        document.getElementById("sidebar-closed-sign-in-btn").click();
        dontOpenLoginPopup();
      }
    }
  };
  hidePaymentModal = () => {
    this.setState({
      isLochPaymentModal: false,
    });
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
            className="cp history-table-header-col table-header-font"
            id="asset"
          >
            <span className="inter-display-medium f-s-13 lh-16">Token</span>
            <Image
              onClick={() => this.handleTableSort("asset")}
              src={sortByIcon}
              className={
                this.state.tableSortOpt[0].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "asset",
        coumnWidth: 0.16,
        isCell: true,
        className: this.state.isMobileDevice
          ? ""
          : "yeildOppYourPortfolioContainer",
        headerClassName: this.state.isMobileDevice
          ? ""
          : "yeildOppYourPortfolioContainer top-l-r-3",
        cell: (rowData, dataKey, rowIndex) => {
          if (dataKey === "asset") {
            if (this.state.isPremiumUser || rowIndex === 0) {
              return (
                <div>
                  <CoinChip
                    hideNameWithouthImage
                    coin_img_src={rowData.asset.symbol}
                    coin_code={rowData.asset.code}
                    chain={rowData?.network}
                  />
                </div>
              );
            }
            return (
              <CustomOverlayUgradeToPremium
                position="top"
                disabled={this.state.isPremiumUser}
              >
                <div className={`blurred-elements`} onClick={this.goToPayModal}>
                  <CoinChip
                    hideNameWithouthImage
                    coin_img_src={rowData.asset.symbol}
                    coin_code={rowData.asset.code}
                    chain={rowData?.network}
                  />
                </div>
              </CustomOverlayUgradeToPremium>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col table-header-font"
            id="usdValue"
          >
            <span className="inter-display-medium f-s-13 lh-16 ">Value</span>
            <Image
              onClick={() => this.handleTableSort("usdValue")}
              src={sortByIcon}
              className={
                this.state.tableSortOpt[2].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "usdValue",
        coumnWidth: 0.16,
        isCell: true,
        className: this.state.isMobileDevice
          ? ""
          : "yeildOppYourPortfolioContainer",
        headerClassName: this.state.isMobileDevice
          ? ""
          : "yeildOppYourPortfolioContainer",
        cell: (rowData, dataKey, rowIndex) => {
          if (dataKey === "usdValue") {
            if (this.state.isPremiumUser || rowIndex === 0) {
              return (
                <CustomOverlay
                  position="top"
                  isIcon={false}
                  isInfo={true}
                  isText={true}
                  text={
                    CurrencyType(false) +
                    amountFormat(
                      rowData.value * this.state.currency?.rate,
                      "en-US",
                      "USD"
                    )
                  }
                >
                  <div className="cost-common-container">
                    <div className="cost-common">
                      <span className="inter-display-medium f-s-13 lh-16 table-data-font">
                        {CurrencyType(false) +
                          numToCurrency(
                            rowData.value * this.state.currency?.rate
                          )}
                      </span>
                    </div>
                  </div>
                </CustomOverlay>
              );
            }
          }
          return (
            <CustomOverlayUgradeToPremium
              position="top"
              disabled={this.state.isPremiumUser}
            >
              <div
                onClick={this.goToPayModal}
                className={`cost-common-container blurred-elements`}
              >
                <div className="cost-common">
                  <span className="inter-display-medium f-s-13 lh-16 table-data-font">
                    {CurrencyType(false) +
                      numToCurrency(rowData.value * this.state.currency?.rate)}
                  </span>
                </div>
              </div>
            </CustomOverlayUgradeToPremium>
          );
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col table-header-font"
            id="project"
          >
            <span className="inter-display-medium f-s-13 lh-16 ">Project</span>
            <Image
              src={sortByIcon}
              onClick={() => this.handleTableSort("project")}
              className={
                this.state.tableSortOpt[3].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "project",
        coumnWidth: 0.16,
        isCell: true,
        cell: (rowData, dataKey, rowIndex) => {
          if (dataKey === "project") {
            if (this.state.isPremiumUser || rowIndex === 0) {
              return (
                <div
                  className={`inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div`}
                >
                  {rowData.project ? rowData.project : "-"}
                </div>
              );
            }
            return (
              <CustomOverlayUgradeToPremium
                position="top"
                disabled={this.state.isPremiumUser}
              >
                <div
                  onClick={this.goToPayModal}
                  className={`inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div blurred-elements`}
                >
                  {rowData.project ? rowData.project : "-"}
                </div>
              </CustomOverlayUgradeToPremium>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col  table-header-font"
            id="pool"
          >
            <span className="inter-display-medium f-s-13 lh-16">Pool</span>
            <Image
              onClick={() => this.handleTableSort("pool")}
              src={sortByIcon}
              className={
                this.state.tableSortOpt[4].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "pool",
        coumnWidth: 0.16,
        isCell: true,
        cell: (rowData, dataKey, rowIndex) => {
          if (dataKey === "pool") {
            if (this.state.isPremiumUser || rowIndex === 0) {
              return (
                <div
                  className={`inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div`}
                >
                  {rowData.pool ? rowData.pool : "-"}
                </div>
              );
            }
            return (
              <CustomOverlayUgradeToPremium
                position="top"
                disabled={this.state.isPremiumUser}
              >
                <div
                  onClick={this.goToPayModal}
                  className={`inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div blurred-elements`}
                >
                  {rowData.pool ? rowData.pool : "-"}
                </div>
              </CustomOverlayUgradeToPremium>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col  table-header-font"
            id="tvl"
          >
            <span className="inter-display-medium f-s-13 lh-16">TVL</span>
            <Image
              src={sortByIcon}
              onClick={() => this.handleTableSort("tvl")}
              className={
                this.state.tableSortOpt[5].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "tvl",
        className: "usd-value",
        coumnWidth: 0.16,
        isCell: true,
        cell: (rowData, dataKey, rowIndex) => {
          if (dataKey === "tvl") {
            if (this.state.isPremiumUser || rowIndex === 0) {
              return (
                <CustomOverlay
                  position="top"
                  isIcon={false}
                  isInfo={true}
                  isText={true}
                  text={
                    CurrencyType(false) +
                    amountFormat(
                      rowData.tvl * this.state.currency?.rate,
                      "en-US",
                      "USD"
                    )
                  }
                >
                  <div className="cost-common-container">
                    <div className="cost-common">
                      <span className="inter-display-medium f-s-13 lh-16 table-data-font">
                        {CurrencyType(false) +
                          numToCurrency(
                            rowData.tvl * this.state.currency?.rate
                          )}
                      </span>
                    </div>
                  </div>
                </CustomOverlay>
              );
            }
            return (
              <CustomOverlayUgradeToPremium
                position="top"
                disabled={this.state.isPremiumUser}
              >
                <div
                  onClick={this.goToPayModal}
                  className="cost-common-container blurred-elements"
                >
                  <div className="cost-common">
                    <span className="inter-display-medium f-s-13 lh-16 table-data-font">
                      {CurrencyType(false) +
                        numToCurrency(rowData.tvl * this.state.currency?.rate)}
                    </span>
                  </div>
                </div>
              </CustomOverlayUgradeToPremium>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col  table-header-font"
            id="apy"
          >
            <span className="inter-display-medium f-s-13 lh-16">APY</span>
            <Image
              onClick={() => this.handleTableSort("apy")}
              src={sortByIcon}
              className={
                this.state.tableSortOpt[6].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "apy",
        className: "usd-value",
        coumnWidth: 0.16,
        isCell: true,
        cell: (rowData, dataKey, rowIndex) => {
          if (dataKey === "apy") {
            if (this.state.isPremiumUser || rowIndex === 0) {
              return (
                <CustomOverlay
                  position="top"
                  isIcon={false}
                  isInfo={true}
                  isText={true}
                  text={rowData.apy ? rowData.apy + "%" : "-"}
                >
                  <div className="inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div">
                    {rowData.apy
                      ? Number(noExponents(rowData.apy)).toLocaleString(
                          "en-US"
                        ) + "%"
                      : "-"}
                  </div>
                </CustomOverlay>
              );
            }
            return (
              <CustomOverlayUgradeToPremium
                position="top"
                disabled={this.state.isPremiumUser}
              >
                <div
                  onClick={this.goToPayModal}
                  className="inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div blurred-elements"
                >
                  {rowData.apy
                    ? Number(noExponents(rowData.apy)).toLocaleString("en-US") +
                      "%"
                    : "0%"}
                </div>
              </CustomOverlayUgradeToPremium>
            );
          }
        },
      },
    ];

    if (this.state.isMobileDevice) {
      return (
        <MobileLayout
          showTopSearchBar
          handleShare={this.handleShare}
          showpath
          currentPage={"yield-opportunities"}
          history={this.props.history}
        >
          {this.state.isLochPaymentModal ? (
            <PaywallModal
              show={this.state.isLochPaymentModal}
              onHide={this.hidePaymentModal}
              redirectLink={BASE_URL_S3 + "/yield-opportunities"}
              title="Access Loch's Yield Opportunities"
              description="Unlimited yield opportunities"
              hideBackBtn
              isMobile
            />
          ) : null}
          <YieldOpportunitiesMobilePage
            tableData={tableData}
            columnList={columnList}
            totalPage={this.state.totalPage}
            currentPage={this.state.currentPage ? this.state.currentPage : 0}
            isLoading={this.state.tableLoading}
            onPageChange={this.onPageChange}
            history={this.props.history}
            location={this.props.location}
            handleFunction={this.handleFunction}
            OnboardingState={this.props.OnboardingState}
            networkSearchIsUsed={this.networkSearchIsUsed}
            intelligenceState={this.props.intelligenceState}
            addCondition={this.addCondition}
            assetSearchIsUsed={this.assetSearchIsUsed}
            onChangeMethod={this.onChangeMethod}
            parentCtx={this}
            onValidSubmit={this.onValidSubmit}
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
                showTopSearchBar
                openConnectWallet={this.props.openConnectWallet}
                connectedWalletAddress={this.props.connectedWalletAddress}
                connectedWalletevents={this.props.connectedWalletevents}
                disconnectWallet={this.props.disconnectWallet}
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
              showpath
              currentPage={"yield-opportunities"}
            />
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
            {this.state.isLochPaymentModal ? (
              <PaywallModal
                show={this.state.isLochPaymentModal}
                onHide={this.hidePaymentModal}
                redirectLink={BASE_URL_S3 + "/yield-opportunities"}
                title="Access Loch's Yield Opportunities"
                description="Unlimited yield opportunities"
                hideBackBtn
              />
            ) : null}
            <PageHeader
              title={"Yield opportunities"}
              subTitle={
                "Yield bearing opportunities personalized for this portfolio"
              }
              currentPage={"yield-opportunities"}
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
                      filtername="All tokens"
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
                    <div className="searchBar input-noshadow-dark">
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
            <div className="yeildOppTitleContainer inter-display-medium f-s-13 lh-16 secondaryDarkTextColor">
              <div className="yeildOppTitleItems yeildOppTitleLeft">
                Current portfolio
              </div>
              <div className="yeildOppTitleItems yeildOppTitleRight">
                Yield opportunities
              </div>
            </div>
            <div className="transaction-history-table transaction-history-table-yield-opportunity">
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
                    message={"No yield opportunities found"}
                    totalPage={this.state.totalPage}
                    history={this.props.history}
                    location={this.props.location}
                    page={this.state.currentPage ? this.state.currentPage : 0}
                    tableLoading={this.state.tableLoading}
                    onPageChange={this.onPageChange}
                    addWatermark
                    minimalPagination
                    hidePaginationRecords
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
