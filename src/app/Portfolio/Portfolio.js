import React from "react";
import { connect } from "react-redux";
import SignInIcon from "../../assets/images/icons/ActiveProfileIcon.svg";
import nextIcon from "../../assets/images/icons/next-arrow.svg";
import prevIcon from "../../assets/images/icons/prev-arrow.svg";
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import LineChartSlider from "./LineCharSlider";
import WelcomeCard from "./WelcomeCard";

import { Col, Image, Row } from "react-bootstrap";
import AddWalletModalIcon from "../../assets/images/icons/wallet-icon.svg";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import FixAddModal from "../common/FixAddModal";
import {
  getAllInsightsApi,
  getAssetProfitLoss,
  getProfitAndLossApi,
  searchTransactionApi,
} from "../intelligence/Api.js";
import TransactionTable from "../intelligence/TransactionTable";
import { getAllCoins, getAllParentChains } from "../onboarding/Api.js";
import { getAllWalletListApi } from "../wallet/Api";
import BarGraphSection from "./../common/BarGraphSection";
import {
  getCoinRate,
  getDetailsByLinkApi,
  getExchangeBalances,
  getExternalEventsApi,
  getProtocolBalanceApi,
  getUserWallet,
  getYesterdaysBalanceApi,
  settingDefaultValues,
} from "./Api";

import moment from "moment";
import sortByIcon from "../../assets/images/icons/triangle-down.svg";
import {
  API_LIMIT,
  BASE_URL_S3,
  GROUP_BY_DATE,
  SEARCH_BY_WALLET_ADDRESS_IN,
  SORT_BY_APY,
  SORT_BY_ASSET,
  SORT_BY_FROM_WALLET,
  SORT_BY_METHOD,
  SORT_BY_POOL,
  SORT_BY_PROJECT,
  SORT_BY_TIMESTAMP,
  SORT_BY_TO_WALLET,
  SORT_BY_TVL,
  SORT_BY_USD_VALUE_THEN,
  SORT_BY_VALUE,
  START_INDEX,
} from "../../utils/Constant";
import {
  getDetectedChainsApi,
  setPageFlagDefault,
  updateWalletListFlag,
} from "../common/Api";

import {
  AddMoreAddres,
  AssetValueExpandview,
  AverageCostBasisEView,
  CostGainHover,
  GasFeesEV,
  HomeCostSortByAsset,
  HomePage,
  HomeShare,
  HomeSortByCostBasis,
  HomeSortByCurrentValue,
  HomeSortByGainLoss,
  ManageWallets,
  NetflowSwitchHome,
  PriceGaugeEV,
  ProfitLossEV,
  TimeSpentHome,
  TransactionHistoryAddress,
  TransactionHistoryAsset,
  TransactionHistoryDate,
  TransactionHistoryEView,
  TransactionHistoryFrom,
  TransactionHistoryTo,
  TransactionHistoryWalletClicked,
  VolumeTradeByCP,
  YieldOpportunitiesSortAPY,
  YieldOpportunitiesSortAsset,
  YieldOpportunitiesSortPool,
  YieldOpportunitiesSortProject,
  YieldOpportunitiesSortTVL,
  YieldOpportunitiesSortUSDvalue,
  YieldOppurtunitiesExpandediew,
} from "../../utils/AnalyticsFunctions.js";
import { deleteToken, getCurrentUser } from "../../utils/ManageToken";
import {
  CurrencyType,
  TruncateText,
  UpgradeTriggered,
  amountFormat,
  mobileCheck,
  noExponents,
  numToCurrency,
} from "../../utils/ReusableFunctions";
import { GetAllPlan, getUser } from "../common/Api";
import Loading from "../common/Loading";
import UpgradeModal from "../common/upgradeModal";
import {
  ResetAverageCostBasis,
  getAllCounterFeeApi,
  getAllFeeApi,
  getAvgCostBasis,
  updateAverageCostBasis,
} from "../cost/Api";
import { ASSET_VALUE_GRAPH_DAY } from "./ActionTypes";
import { getAssetGraphDataApi } from "./Api";

import { toast } from "react-toastify";
import CopyClipboardIcon from "../../assets/images/CopyClipboardIcon.svg";
import Footer from "../common/footer";
import PortfolioMobile from "./PortfolioMobile";
import "./_mobilePortfolio.scss";

import { addAddressToWatchList } from "../watchlist/redux/WatchListApi.js";
import { getYieldOpportunities } from "../yieldOpportunities/Api.js";
import FollowAuthModal from "./FollowModals/FollowAuthModal.js";
import FollowExitOverlay from "./FollowModals/FollowExitOverlay.js";
import PortfolioHomeInsightsBlock from "./PortfolioHomeInsightsBlock.js";

import {
  ArrowDownLeftSmallIcon,
  ArrowUpRightSmallIcon,
} from "../../assets/images/icons/index.js";
import InflowOutflowPortfolioHome from "../intelligence/InflowOutflowPortfolioHome.js";
import { addUserCredits } from "../profile/Api.js";
import CoinChip from "../wallet/CoinChip.js";
import PortfolioHomeDefiBlock from "./PortfolioHomeDefiBlock.js";
import PortfolioHomeNetworksBlock from "./PortfolioHomeNetworksBlock.js";

class Portfolio extends BaseReactComponent {
  constructor(props) {
    super(props);

    if (props.location.state) {
      // window.sessionStorage.setItem(
      //   "addWallet",
      //   JSON.stringify(props.location.state?.addWallet)
      // );
    }

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
      // Should call block one
      shouldCallTransactionTableApi: true,
      shouldCallAssetsAvgCostBasisApi: true,
      // Should call block one

      // Should call block two
      shouldCallProfitAndLossApi: true,
      shouldCallGraphFeesApi: true,
      shouldCallCounterPartyVolumeApi: true,
      // Should call block two

      // Should call block three
      shouldCallHistoricPerformanceApi: true,
      shouldCallPriceGaugeApi: true,
      // Should call block three

      // Should call block four
      shouldCallYieldOppApi: true,
      shouldCallInsightsApi: true,
      // Should call block four

      callChildPriceGaugeApi: 0,
      insightsBlockLoading: false,
      homeGraphFeesData: undefined,
      homeCounterpartyVolumeData: undefined,
      gasFeesGraphLoading: false,
      counterGraphLoading: false,
      yieldOpportunitiesList: [],
      yieldOpportunitiesTotalCount: 0,
      yieldOpportunitiesTableLoading: false,
      blockOneSelectedItem: 1,
      blockTwoSelectedItem: 1,
      blockThreeSelectedItem: 1,
      blockFourSelectedItem: 1,
      isAddressFollowedCount: 0,
      followSignInModalAnimation: true,
      followSigninModal: false,
      followSignupModal: false,
      followedAddress: "",
      isShowingAge: true,
      isMobileDevice: false,
      settings,
      id: props.match.params?.id,
      userWalletList: window.sessionStorage.getItem("addWallet")
        ? JSON.parse(window.sessionStorage.getItem("addWallet"))
        : [],

      // page loader
      loader: false,
      // fix wallet address modal
      fixModal: false,

      // add wallet address modal
      addModal: false,

      // networth total loader
      isLoading: false,
      isLoadingNet: false,

      // transaction history table
      tableLoading: false,

      // asset value laoder
      graphLoading: false,

      // not used any where but update on api
      barGraphLoading: false,

      // not used any where
      toggleAddWallet: true,

      // sort
      sort: [{ key: SORT_BY_TIMESTAMP, value: false }],
      yieldOppSort: [{ key: SORT_BY_TVL, value: false }],

      // transaction history table row limit
      limit: 6,

      // yield opp sort
      yieldOppTableSortOpt: [
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
      // transaction history sort
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
          title: "usdValue",
          up: false,
        },
        {
          title: "method",
          up: false,
        },
      ],

      // page start time to calc page spent
      startTime: "",

      // get netflow api response
      GraphData: [],

      // netflow graph data
      graphValue: null,

      // external events data it set after asset value chart api response get
      externalEvents: [],

      // netflow loader
      netFlowLoading: true,

      // when go btn clicked run all api
      isUpdate: 0,

      // yesterday balance
      yesterdayBalance: 0,

      // current page name
      currentPage: "Home",

      // get currency
      currency: JSON.parse(window.sessionStorage.getItem("currency")),

      // not used any where on this page
      counterGraphDigit: 3,

      // Used in transaction history and piechart as props
      assetPrice: null,

      // asset value chart re load time
      isTimeOut: true,

      // undetected btn
      showBtn: false,

      // when we get response from api then its true
      apiResponse: false,

      // upgrade plan
      userPlan:
        JSON.parse(window.sessionStorage.getItem("currentPlan")) || "Free",
      upgradeModal: false,
      isStatic: false,
      triggerId: 0,

      // get lock token
      lochToken: JSON.parse(window.sessionStorage.getItem("stopClick")),

      // insight
      updatedInsightList: [],
      isLoadingInsight: false,

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
        { title: "Current value", down: false },
        { title: "Gain loss", down: true },
      ],
      AvgCostLoading: true,

      chainLoader: false,
      totalChainDetechted: 0,

      // netflow switch
      isSwitch: true,
      waitForMixpannelCall: false,
    };
  }
  changeBlockOneItem = (itemNum) => {
    this.setState({
      blockOneSelectedItem: itemNum,
    });
  };
  changeBlockTwoItem = (itemNum) => {
    this.setState({
      blockTwoSelectedItem: itemNum,
    });
  };
  changeBlockThreeItem = (itemNum) => {
    this.setState({
      blockThreeSelectedItem: itemNum,
    });
  };
  changeBlockFourItem = (itemNum) => {
    this.setState({
      blockFourSelectedItem: itemNum,
    });
  };
  onCloseModal = () => {
    this.setState({
      followSignInModalAnimation: true,
      followSigninModal: false,
      followSignupModal: false,
    });
  };
  openSignUpModal = () => {
    this.setState({
      followSignInModalAnimation: false,
      followSigninModal: false,
      followSignupModal: true,
    });
  };
  openSigninModal = () => {
    this.setState({
      followSigninModal: true,
      followSignupModal: false,
    });
  };
  afterAddressFollowed = (passedAddress) => {
    if (!getCurrentUser().email) {
      this.setState(
        {
          followedAddress: passedAddress,
          isAddressFollowedCount: this.state.isAddressFollowedCount + 1,
        },
        () => {
          this.openSigninModal();
        }
      );
    }
  };
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
  toggleAgeTimestamp = () => {
    this.setState({
      isShowingAge: !this.state.isShowingAge,
    });
  };
  // get token
  getToken = () => {
    let token = window.sessionStorage.getItem("lochToken");
    if (!this.state.lochToken) {
      this.setState({
        lochToken: JSON.parse(window.sessionStorage.getItem("stopClick")),
      });
      setTimeout(() => {
        this.getToken();
      }, 1000);
    }

    if (token !== "jsk") {
      window.sessionStorage.setItem("stopClick", true);
      let obj = UpgradeTriggered();
      const onceAddCredit = window.sessionStorage.getItem(
        "addAddressCreditOnce"
      );
      if (onceAddCredit) {
        window.sessionStorage.removeItem("addAddressCreditOnce");
        const addressCreditScore = new URLSearchParams();
        addressCreditScore.append("credits", "address_added");
        this.props.addUserCredits(addressCreditScore);
      }
      const multipleAddCredit = window.sessionStorage.getItem(
        "addMultipleAddressCreditOnce"
      );
      if (multipleAddCredit) {
        window.sessionStorage.removeItem("addMultipleAddressCreditOnce");
        const multipleAddressCreditScore = new URLSearchParams();
        multipleAddressCreditScore.append("credits", "multiple_address_added");
        this.props.addUserCredits(multipleAddressCreditScore);
      }
      const ensCredit = window.sessionStorage.getItem("addEnsCreditOnce");
      if (ensCredit) {
        window.sessionStorage.removeItem("addEnsCreditOnce");
        const ensCreditScore = new URLSearchParams();
        ensCreditScore.append("credits", "ens_added");
        this.props.addUserCredits(ensCreditScore);
      }

      const walletCredit = window.sessionStorage.getItem(
        "connectWalletCreditOnce"
      );
      if (walletCredit) {
        window.sessionStorage.removeItem("connectWalletCreditOnce");
        const walletCreditScore = new URLSearchParams();
        walletCreditScore.append("credits", "wallet_connected");
        this.props.addUserCredits(walletCreditScore);
      }
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
        isLoading: true,
        isLoadingNet: true,

        chainLoader: true,
      });
    }
  };

  // upgrade modal
  upgradeModal = () => {
    this.setState({
      upgradeModal: !this.state.upgradeModal,
      userPlan: JSON.parse(window.sessionStorage.getItem("currentPlan")),
    });
  };

  // toggle wallet btn
  handleToggleAddWallet = () => {
    this.setState({
      toggleAddWallet: true,
    });
  };

  // when press go this function run
  handleChangeList = (value) => {
    this.setState({
      userWalletList: value,
      isUpdate: this.state.isUpdate == 0 ? 1 : 0,
      isLoadingInsight: true,

      isLoading: true,
      isLoadingNet: true,

      chainLoader: true,
    });
  };

  // undetected modal
  handleFixModal = () => {
    this.setState({
      fixModal: !this.state.fixModal,
      // isUpdate: this.state.isUpdate == 0 && this.state.fixModal ? 1 : 0,
    });
  };

  // add wallet modal
  handleShare = () => {
    let lochUser = getCurrentUser().id;
    let userWallet = JSON.parse(window.sessionStorage.getItem("addWallet"));
    let shareLink = "";

    if (userWallet?.length === 1) {
      let slink = userWallet[0].displayAddress || userWallet[0].address;
      shareLink = BASE_URL_S3 + "home/" + slink;
    } else {
      let slink = lochUser;
      shareLink = BASE_URL_S3 + "wallet/" + slink;
    }

    navigator.clipboard.writeText(shareLink);
    toast.success("Link copied");

    HomeShare({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
  };
  handleAddModal = () => {
    this.setState({
      addModal: !this.state.addModal,
      toggleAddWallet: false,
    });
  };
  startPageView = () => {
    this.setState({ startTime: new Date() * 1 });
    HomePage({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    // Inactivity Check
    window.checkPortfolioTimer = setInterval(() => {
      this.checkForInactivity();
    }, 900000);
  };
  showAddressesAdded = (passedAddress, passedNameTag, openModal) => {
    window.sessionStorage.setItem("isFollowingAddress", true);
    if (openModal) {
      this.afterAddressFollowed(passedAddress);
    }
  };
  callPriceGaugeApi = () => {
    this.setState({
      callChildPriceGaugeApi: this.state.callChildPriceGaugeApi + 1,
    });
  };
  callNetworksApi = () => {
    // Resetting the user wallet list, total and chain wallet
    this.props.settingDefaultValues(this);

    // Loops on coins to fetch details of each coin which exist in wallet
    let isFound = false;
    const tempUserWalletList = window.sessionStorage.getItem("addWallet")
      ? JSON.parse(window.sessionStorage.getItem("addWallet"))
      : this.state.userWalletList;
    tempUserWalletList?.forEach((wallet, i) => {
      if (wallet.coinFound) {
        isFound = true;
        wallet.coins.forEach((coin) => {
          if (coin.chain_detected) {
            let userCoinWallet = {
              address: wallet.address,
              coinCode: coin.coinCode,
            };
            this.props.getUserWallet(userCoinWallet, this, false, i);
          }
        });
      }

      if (i === tempUserWalletList?.length - 1) {
        // run this api if itws value 0
        this.props.getYesterdaysBalanceApi(this);

        this.setState({
          // overview loader and net worth loader
          // isLoading: false,
          // isLoadingNet: false,
        });
      }
    });

    // connect exchange api
    // this.props.getExchangeBalance("binance", this);
    // this.props.getExchangeBalance("coinbase", this);
    this.props.getExchangeBalances(this, false);

    if (!isFound) {
      this.setState({
        // overview loader and net worth loader
        // isLoading: false,
        // isLoadingNet: false,
      });
    }
  };
  callYieldOppApi = () => {
    let addressList = [];
    const tempUserWalletList = window.sessionStorage.getItem("addWallet")
      ? JSON.parse(window.sessionStorage.getItem("addWallet"))
      : this.state.userWalletList;
    tempUserWalletList.map((wallet) => addressList.push(wallet.address));

    let listOfAddresses = JSON.stringify(addressList);

    this.setState({ yieldOpportunitiesTableLoading: true });
    let data = new URLSearchParams();
    data.append("start", 0);
    data.append("conditions", JSON.stringify([]));
    data.append("limit", API_LIMIT);
    data.append("sorts", JSON.stringify(this.state.yieldOppSort));
    data.append("wallet_addresses", listOfAddresses);
    if (listOfAddresses) {
      this.props.getYieldOpportunities(data, 0);
    }
  };
  componentDidMount() {
    window.scrollTo(0, 0);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 200);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 300);
    const passedAddress = window.sessionStorage.getItem("followThisAddress");
    const tempPathName = this.props.location?.pathname;
    if (
      this.props.yieldOpportunitiesState &&
      this.props.yieldOpportunitiesState.yield_pools &&
      this.props.yieldOpportunitiesState.total_count &&
      this.props.commonState.yieldOpportunities
    ) {
      this.setState({
        yieldOpportunitiesList: this.props.yieldOpportunitiesState.yield_pools
          ? this.props.yieldOpportunitiesState.yield_pools
          : [],
        yieldOpportunitiesTotalCount:
          this.props.yieldOpportunitiesState.total_count,
        yieldOpportunitiesTableLoading: false,
      });
    }
    if (
      passedAddress &&
      passedAddress !== "alreadyAdded" &&
      passedAddress !== "/home" &&
      getCurrentUser().id &&
      tempPathName === "/home"
    ) {
      // Call api
      const followAddressData = new URLSearchParams();
      followAddressData.append("wallet_address", passedAddress);
      followAddressData.append("type", "self");
      followAddressData.append("name_tag", "");
      setTimeout(() => {
        this.props.addAddressToWatchList(
          followAddressData,
          this,
          passedAddress,
          ""
        );
      }, 3500);
      window.sessionStorage.setItem("followThisAddress", "alreadyAdded");
    }

    if (mobileCheck()) {
      this.setState({
        isMobileDevice: true,
      });
    }
    if (
      this.props.intelligenceState &&
      this.props.intelligenceState.graphfeeValue
    ) {
      this.trimGasFees();
    }
    if (this.props.yieldOpportunitiesState) {
      this.trimCounterpartyVolume();
    }
    if (this.props.intelligenceState?.updatedInsightList) {
      const newTempHolder =
        this.props.intelligenceState.updatedInsightList.filter(
          (resRes) => resRes.insight_type !== 30
        );
      this.setState({
        updatedInsightList: newTempHolder,
        insightsBlockLoading: false,
      });
    }
    if (
      this.props.intelligenceState?.Average_cost_basis &&
      this.props.intelligenceState?.Average_cost_basis.length > 0
    ) {
      if (this.props.commonState.assetsPage) {
        this.setState({
          AvgCostLoading: false,
        });
      } else {
        this.props.updateWalletListFlag("assetsPage", true);
        this.setState({
          shouldCallAssetsAvgCostBasisApi: false,
          AvgCostLoading: true,
        });
        this.props.getAvgCostBasis(this);
      }
    }

    if (
      this.props.intelligenceState?.ProfitLossAsset &&
      this.props.intelligenceState?.ProfitLossAsset?.series &&
      this.props.intelligenceState?.ProfitLossAsset?.series.length > 0
    ) {
      if (this.props.commonState.realizedGainsPage) {
        this.setState({
          netFlowLoading: false,
        });
      } else {
        this.props.updateWalletListFlag("realizedGainsPage", true);
        this.setState({
          netFlowLoading: true,
          shouldCallProfitAndLossApi: false,
        });
        // this.props.getProfitAndLossApi(this, false, false, false);
        // netflow breakdown
        this.props.getAssetProfitLoss(this, false, false, false);
      }
    }
    if (this.props.portfolioState?.assetValueDataLoaded) {
      this.setState({
        assetValueDataLoaded: this.props.portfolioState.assetValueDataLoaded,
      });
    }
    this.setState({
      settings: {
        ...this.state.settings,
        slidesToShow:
          this.props.intelligenceState.updatedInsightList?.length === 1
            ? 1
            : 1.5,
      },
    });
    // reset redirect stop
    window.sessionStorage.setItem("stop_redirect", false);

    // reset discount modal
    window.sessionStorage.setItem("discountEmail", false);

    // if share link store share id to show upgrade modal
    if (this.props.match.params.id) {
      window.sessionStorage.setItem("share_id", this.props.match.params.id);
    }

    if (this.props.location.state?.noLoad) {
    } else {
      // call api if no share link
      this.apiCall();
    }

    if (this.props.location?.state?.isVerified) {
      setTimeout(() => {
        this.simulateButtonClick();
      }, 1000);
    }
    // get token to check if wallet address not loaded
    this.getToken();
    if (!mobileCheck()) {
      this.startPageView();
      this.updateTimer(true);

      return () => {
        clearInterval(window.checkPortfolioTimer);
      };
    }
  }
  updateTimer = (first) => {
    const tempExistingExpiryTime = window.sessionStorage.getItem(
      "portfolioPageExpiryTime"
    );
    if (!tempExistingExpiryTime && !first) {
      this.startPageView();
    }
    const tempExpiryTime = Date.now() + 1800000;
    window.sessionStorage.setItem("portfolioPageExpiryTime", tempExpiryTime);
  };
  endPageView = () => {
    clearInterval(window.checkPortfolioTimer);
    window.sessionStorage.removeItem("portfolioPageExpiryTime");
    if (this.state.startTime) {
      let endTime = new Date() * 1;
      let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
      TimeSpentHome({
        time_spent: TimeSpent,
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
    }
  };
  checkForInactivity = () => {
    const tempExpiryTime = window.sessionStorage.getItem(
      "portfolioPageExpiryTime"
    );
    if (tempExpiryTime && tempExpiryTime < Date.now()) {
      this.endPageView();
    }
  };
  componentWillUnmount() {
    const tempExpiryTime = window.sessionStorage.getItem(
      "portfolioPageExpiryTime"
    );
    if (tempExpiryTime && !mobileCheck()) {
      this.endPageView();
    }
    // reset all sort average cost
    this.props.ResetAverageCostBasis();
  }
  trimGasFees = () => {
    if (
      this.props.intelligenceState &&
      this.props.intelligenceState.graphfeeValue &&
      this.props.intelligenceState.graphfeeValue[0] &&
      this.props.intelligenceState.graphfeeValue[0].labels
    ) {
      const tempHolder = [
        {
          labels:
            this.props.intelligenceState.graphfeeValue[0].labels.length > 3
              ? this.props.intelligenceState.graphfeeValue[0].labels.slice(0, 3)
              : this.props.intelligenceState.graphfeeValue[0].labels,
          datasets: this.props.intelligenceState.graphfeeValue[0].datasets
            ? this.props.intelligenceState.graphfeeValue[0].datasets
            : [],
        },
        { ...this.props.intelligenceState.graphfeeValue[1] },

        { ...this.props.intelligenceState.graphfeeValue[2] },
      ];
      this.setState({
        homeGraphFeesData: tempHolder,
      });
    }
  };
  trimCounterpartyVolume = () => {
    if (
      this.props.intelligenceState &&
      this.props.intelligenceState.counterPartyValue &&
      this.props.intelligenceState.counterPartyValue[0] &&
      this.props.intelligenceState.counterPartyValue[0].labels
    ) {
      const tempHolder = [
        {
          labels:
            this.props.intelligenceState.counterPartyValue[0].labels.length > 3
              ? this.props.intelligenceState.counterPartyValue[0].labels.slice(
                  0,
                  3
                )
              : this.props.intelligenceState.counterPartyValue[0].labels,
          datasets: this.props.intelligenceState.counterPartyValue[0].datasets
            ? this.props.intelligenceState.counterPartyValue[0].datasets
            : [],
        },
        { ...this.props.intelligenceState.counterPartyValue[1] },

        { ...this.props.intelligenceState.counterPartyValue[2] },
      ];
      this.setState({
        homeCounterpartyVolumeData: tempHolder,
      });
    }
  };
  componentDidUpdate(prevProps, prevState) {
    // Block One
    if (prevState.blockOneSelectedItem !== this.state.blockOneSelectedItem) {
      // Asssets avg cost basis

      if (
        this.state.blockOneSelectedItem === 1 &&
        (!this.props.intelligenceState?.Average_cost_basis ||
          !this.props.commonState.assetsPage)
      ) {
        this.props.updateWalletListFlag("assetsPage", true);
        this.setState({
          shouldCallAssetsAvgCostBasisApi: false,
          AvgCostLoading: true,
        });
        this.props.getAvgCostBasis(this);
      }
      // Transaction table

      if (
        this.state.blockOneSelectedItem === 2 &&
        (!(this.state.defiState && this.state.defiState?.defiList) ||
          !this.props.commonState.defi)
      ) {
        this.props.updateWalletListFlag("defi", true);
      }
    }

    // Block Two
    if (prevState.blockTwoSelectedItem !== this.state.blockTwoSelectedItem) {
      // Realized gains api call
      if (
        this.state.blockTwoSelectedItem === 1 &&
        (!(
          this.props.intelligenceState?.ProfitLossAsset?.series &&
          this.props.intelligenceState?.ProfitLossAsset?.series.length > 0
        ) ||
          !this.props.commonState.realizedGainsPage)
      ) {
        this.props.updateWalletListFlag("realizedGainsPage", true);
        this.setState({
          netFlowLoading: true,
          shouldCallProfitAndLossApi: false,
        });
        // this.props.getProfitAndLossApi(this, false, false, false);
        // netflow breakdown
        this.props.getAssetProfitLoss(this, false, false, false);
      }
      // Gas fees api call
      else if (
        this.state.blockTwoSelectedItem === 2 &&
        (!(this.state.homeGraphFeesData && this.state.homeGraphFeesData[0]) ||
          !this.props.commonState.gasFeesPage)
      ) {
        this.setState({
          gasFeesGraphLoading: true,
          shouldCallGraphFeesApi: false,
        });
        this.props.updateWalletListFlag("gasFeesPage", true);
        this.props.getAllFeeApi(this, false, false);
      }
      // Counterparty volume api call
      else if (
        this.state.blockTwoSelectedItem === 3 &&
        (!(
          this.state.homeCounterpartyVolumeData &&
          this.state.homeCounterpartyVolumeData[0]
        ) ||
          !this.props.commonState.counterpartyVolumePage)
      ) {
        this.setState({
          counterGraphLoading: true,
          shouldCallCounterPartyVolumeApi: false,
        });
        this.props.updateWalletListFlag("counterpartyVolumePage", true);
        this.props.getAllCounterFeeApi(this, false, false);
      }
    }
    // Block Three
    if (
      prevState.blockThreeSelectedItem !== this.state.blockThreeSelectedItem
    ) {
      if (
        this.state.blockThreeSelectedItem === 1 &&
        this.state.shouldCallPriceGaugeApi
      ) {
        this.setState({
          shouldCallPriceGaugeApi: false,
        });
        this.callPriceGaugeApi();
      }

      if (
        this.state.blockThreeSelectedItem === 2 &&
        (!this.props.portfolioState?.assetValueDay ||
          !this.props.commonState.asset_value)
      ) {
        this.props.updateWalletListFlag("asset_value", true);
        this.setState({
          shouldCallHistoricPerformanceApi: false,
        });
        this.getGraphData();
      } else {
        this.setState({
          graphLoading: false,
        });
      }
    }
    // Block Four
    if (prevState.blockFourSelectedItem !== this.state.blockFourSelectedItem) {
      if (
        this.state.blockFourSelectedItem === 1 &&
        (!this.props.intelligenceState.table ||
          !this.props.commonState.transactionHistory)
      ) {
        this.props.updateWalletListFlag("transactionHistory", true);
        this.setState({
          shouldCallTransactionTableApi: false,
        });
        this.getTableData();
      }
      if (
        this.state.blockFourSelectedItem === 2 &&
        (!this.state.yieldOpportunitiesList ||
          !this.props.commonState.yieldOpportunities)
      ) {
        this.props.updateWalletListFlag("yieldOpportunities", true);
        this.setState({
          shouldCallYieldOppApi: false,
        });
        this.callYieldOppApi();
      }
      if (
        this.state.blockFourSelectedItem === 3 &&
        (!this.state.updatedInsightList || !this.props.commonState.insight)
      ) {
        this.props.updateWalletListFlag("insight", true);
        this.setState({
          insightsBlockLoading: true,
          shouldCallInsightsApi: false,
        });
        this.props.getAllInsightsApi(this);
      }
    }

    if (
      prevProps.portfolioState?.assetValueDataLoaded !==
      this.props.portfolioState?.assetValueDataLoaded
    ) {
      this.setState({
        dataLoaded: this.props.portfolioState.assetValueDataLoaded,
      });
    }

    if (
      this.props.intelligenceState &&
      this.props.intelligenceState.graphfeeValue &&
      this.props.intelligenceState.graphfeeValue !==
        prevProps.intelligenceState.graphfeeValue
    ) {
      this.trimGasFees();
    }
    if (prevState.yieldOppSort !== this.state.yieldOppSort) {
      this.callYieldOppApi();
    }
    if (
      prevProps.intelligenceState.updatedInsightList !==
      this.props.intelligenceState.updatedInsightList
    ) {
      // insight_type: 30
      const newTempHolder =
        this.props.intelligenceState.updatedInsightList.filter(
          (resRes) => resRes.insight_type !== 30
        );
      this.setState({
        updatedInsightList: newTempHolder,
        insightsBlockLoading: false,
      });
    }
    if (
      prevProps.yieldOpportunitiesState !== this.props.yieldOpportunitiesState
    ) {
      this.setState({
        yieldOpportunitiesList: this.props.yieldOpportunitiesState.yield_pools
          ? this.props.yieldOpportunitiesState.yield_pools
          : [],
        yieldOpportunitiesTotalCount:
          this.props.yieldOpportunitiesState.total_count,
        yieldOpportunitiesTableLoading: false,
      });
    }
    if (
      this.props.intelligenceState &&
      this.props.intelligenceState.counterPartyValue &&
      this.props.intelligenceState.counterPartyValue !==
        prevProps.intelligenceState.counterPartyValue
    ) {
      this.trimCounterpartyVolume();
    }
    // Wallet update response when press go
    // if (this.state.apiResponse) {
    //   if (this.props.location.state?.noLoad === undefined) {
    //     this.props.getCoinRate();
    //     this.setState({
    //       apiResponse: false,
    //     });
    //   }
    // }

    // Typical usage (don't forget to compare props):
    // Check if the coin rate api values are changed
    if (!this.props.commonState.home && this.state.lochToken) {
      this.props.updateWalletListFlag("home", true);
      this.setState({
        isLoading: true,
        isLoadingNet: true,

        chainLoader: true,
        // Handeling changes
        shouldCallProfitAndLossApi: true,
        shouldCallGraphFeesApi: true,
        shouldCallCounterPartyVolumeApi: true,
        shouldCallAssetsAvgCostBasisApi: true,
        shouldCallTransactionTableApi: true,
        shouldCallYieldOppApi: true,
        shouldCallInsightsApi: true,
        shouldCallHistoricPerformanceApi: true,
        shouldCallPriceGaugeApi: true,
      });

      // if wallet address change
      const tempAddWall = window.sessionStorage.getItem("addWallet");
      if (
        tempAddWall &&
        JSON.parse(tempAddWall) &&
        JSON.parse(tempAddWall)?.length > 0
      ) {
        this.callNetworksApi();
      } else {
        // Resetting the user wallet list, total and chain wallet
        this.props.settingDefaultValues(this);

        // when wallet address not present run connect exchnage api
        // this.props.getExchangeBalance("binance", this);
        // this.props.getExchangeBalance("coinbase", this);
        this.props.getExchangeBalances(this, false);

        // run this api if itws value 0
        this.props.getYesterdaysBalanceApi(this);
        // net worth total loader
        // this.setState({
        //   isLoading: false,
        //   isLoadingNet: false,
        // });
      }

      // run this when table value is [] - remove table
      // this.getTableData();

      // asset value run when its value null
      // if (!this.props.portfolioState.assetValueDay) {
      //    this.getGraphData();
      // } else {
      //   this.setState({
      //     graphLoading:false,
      //   })
      // }

      // - remove form home
      // getAllCounterFeeApi(this, false, false);

      // run when graphValue == null and  GraphData: [],

      // BLOCK ONE
      // Assets average cost basis api call

      if (
        this.state.blockOneSelectedItem === 1 &&
        (!(
          this.props.intelligenceState?.Average_cost_basis &&
          this.props.intelligenceState?.Average_cost_basis.length > 0
        ) ||
          !this.props.commonState.assetsPage)
      ) {
        this.props.updateWalletListFlag("assetsPage", true);
        this.setState({
          shouldCallAssetsAvgCostBasisApi: false,
          AvgCostLoading: true,
        });
        this.props.getAvgCostBasis(this);
      }

      if (
        this.state.blockOneSelectedItem === 1 &&
        (!(this.state.defiState && this.state.defiState?.defiList) ||
          !this.props.commonState.defi)
      ) {
        let UserWallet = JSON.parse(window.sessionStorage.getItem("addWallet"));
        const allAddresses = [];
        UserWallet?.forEach((e) => {
          allAddresses.push(e.address);
        });
        let data = new URLSearchParams();
        data.append("wallet_address", JSON.stringify(allAddresses));

        this.props.getProtocolBalanceApi(this, data);
        this.props.updateWalletListFlag("defi", true);
      }

      if (
        this.state.blockFourSelectedItem === 1 &&
        (!(
          this.props.intelligenceState?.table &&
          this.props.intelligenceState?.table.length > 0
        ) ||
          !this.props.commonState.transactionHistory)
      ) {
        this.props.updateWalletListFlag("transactionHistory", true);
        this.setState({
          shouldCallTransactionTableApi: false,
        });
        this.getTableData();
      }

      // BLOCK TWO
      // Realized gains api call
      if (
        this.state.blockTwoSelectedItem === 1 &&
        (!this.props.commonState.realizedGainsPage ||
          !(
            this.props.intelligenceState?.ProfitLossAsset?.series &&
            this.props.intelligenceState?.ProfitLossAsset?.series.length > 0
          ))
      ) {
        this.props.updateWalletListFlag("realizedGainsPage", true);
        this.setState({
          netFlowLoading: true,
          shouldCallProfitAndLossApi: false,
        });
        // this.props.getProfitAndLossApi(this, false, false, false);
        // netflow breakdown
        this.props.getAssetProfitLoss(this, false, false, false);
      }

      // Gas fees api call
      if (
        this.state.blockTwoSelectedItem === 2 &&
        (!this.props.commonState.gasFeesPage ||
          !(
            this.props.intelligenceState.graphfeeValue &&
            this.props.intelligenceState.graphfeeValue[0]
          ))
      ) {
        this.setState({
          gasFeesGraphLoading: true,
          shouldCallGraphFeesApi: false,
        });
        this.props.updateWalletListFlag("gasFeesPage", true);
        this.props.getAllFeeApi(this, false, false);
      }

      // Counterparty volume api call
      if (
        this.state.blockTwoSelectedItem === 3 &&
        (!this.props.commonState.counterpartyVolumePage ||
          !(
            this.props.intelligenceState.counterPartyValue &&
            this.props.intelligenceState.counterPartyValue[0]
          ))
      ) {
        this.setState({
          counterGraphLoading: true,
          shouldCallCounterPartyVolumeApi: false,
        });
        this.props.updateWalletListFlag("counterpartyVolumePage", true);
        this.props.getAllCounterFeeApi(this, false, false);
      }

      // BLOCK Three
      if (this.state.blockThreeSelectedItem === 1) {
        this.setState({
          shouldCallPriceGaugeApi: false,
        });
        this.callPriceGaugeApi();
      }
      if (
        this.state.blockThreeSelectedItem === 2 &&
        (!this.props.portfolioState?.assetValueDay ||
          !this.props.commonState.asset_value)
      ) {
        this.props.updateWalletListFlag("asset_value", true);
        this.setState({
          shouldCallHistoricPerformanceApi: false,
        });
        this.getGraphData();
      }

      // BLOCK FOUR

      if (
        this.state.blockFourSelectedItem === 2 &&
        (!this.props.yieldOpportunitiesState.yield_pools ||
          !this.props.commonState.yieldOpportunities)
      ) {
        this.props.updateWalletListFlag("yieldOpportunities", true);
        this.setState({
          shouldCallYieldOppApi: false,
        });
        this.callYieldOppApi();
      }
      if (
        this.state.blockFourSelectedItem === 3 &&
        (!this.props.intelligenceState?.updatedInsightList ||
          !this.props.commonState.insight)
      ) {
        this.props.updateWalletListFlag("insight", true);
        this.setState({
          insightsBlockLoading: false,
        });
        this.props.getAllInsightsApi(this);
      }

      // for chain detect
      setTimeout(() => {
        this.props.getAllCoins();
        this.props.getAllParentChains();
        this.props.getDetectedChainsApi(this);

        let tempData = new URLSearchParams();
        tempData.append("start", 0);
        tempData.append("conditions", JSON.stringify([]));
        tempData.append("limit", 50);
        tempData.append("sorts", JSON.stringify([]));
        this.props.getAllWalletListApi(tempData, this);
      }, 1000);

      this.props.GetAllPlan();
      this.props.getUser(this);

      // if (prevProps.userWalletList !== this.state.userWalletList) {
      //   this.state.userWalletList?.length > 0 &&
      //     this.setState({
      //       netFlowLoading: true,
      //       isLoadingInsight: true,
      //     });
      // }
    } else if (prevState.sort !== this.state.sort) {
      // sort table
      this.getTableData();
    } else if (
      prevProps.location.state?.noLoad !== this.props.location.state?.noLoad
    ) {
      // if share link
      if (this.props.location.state?.addWallet != undefined) {
        window.sessionStorage.setItem(
          "addWallet",
          JSON.stringify(this.props.location.state?.addWallet)
        );
        this.setState({ userWalletList: this.props.location.state?.addWallet });
        this.apiCall();
      }
    }
  }

  // get refresh btn
  setLoader = (value) => {
    this.setState({
      isLoading: value,
      isLoadingNet: value,
    });
  };

  apiCall = () => {
    this.props.getAllCoins();

    if (this.props.match.params.id) {
      // if share link call this app
      // if (this.state.portfolioLink) {
      //       this.props.match.params.id), Object.values(this.state?.userWalletList[0]),
      //       this.props.match.params.id)
      //   if (
      //     !Object.values(this.state?.userWalletList[0]).includes(
      //       this.props.match.params.id
      //     )
      //   ) {
      //     // if not found address or id
      //     // eg: vitalik.eth, 0x02w92w.. and user id not found in userWalletlist so we will delete token even if there is not token their (now browser)
      //     deleteToken();
      //     this.props.history.push({
      //       pathname: "/",
      //       state: {
      //         from: { pathname: this.props.match.url },
      //         params: {
      //           id: this.props.match.params.id,
      //         },
      //       },
      //     });
      //   } else {
      //     // not found eg: vitalik.eth, 0x02w92w..
      //     //  GetDefaultPlan();
      //     this.props.getDetailsByLinkApi(this.props.match.params.id, this);
      //     this.setState({
      //       portfolioLink: false,
      //     });
      //   }
      // }
      // if its true means we ahve store share data and remove token else remove token and call share api
      let gotShareProtfolio = JSON.parse(
        window.sessionStorage.getItem("gotShareProtfolio")
      );
      // window.sessionStorage.setItem(
      //   "addWallet",
      //   JSON.stringify(this.props.location.state?.addWallet)
      // );
      if (!gotShareProtfolio) {
        deleteToken();

        const searchParams = new URLSearchParams(this.props.location.search);
        const redirectPath = searchParams.get("redirect");
        window.sessionStorage.setItem("gotShareProtfolio", true);

        let redirect = JSON.parse(
          window.sessionStorage.getItem("ShareRedirect")
        );
        if (!redirect) {
          if (redirectPath) {
            window.sessionStorage.setItem(
              "ShareRedirect",
              JSON.stringify({
                path: redirectPath,
                hash: this.props?.location?.hash,
              })
            );
          } else {
            window.sessionStorage.setItem(
              "ShareRedirect",
              JSON.stringify({
                path: "home",
                hash: this.props?.location?.hash,
              })
            );
          }
        }
        this.props.history.push({
          pathname: "/",
          state: {
            from: {
              pathname: this.props.match.url,
            },
            params: {
              id: this.props.match.params.id,
              redirectPath: redirectPath,
              hash: this.props?.location?.hash,
            },
          },
        });
      } else {
        window.sessionStorage.setItem("gotShareProtfolio", false);
        // remove redirect urls
        window.sessionStorage.removeItem("ShareRedirect");

        if (
          this.props.location?.state?.hash &&
          this.props?.location?.state?.redirectPath
        ) {
          this.props.history.push(
            "/" +
              this.props?.location?.state?.redirectPath +
              this.props.location?.state?.hash
          );
        } else {
          if (this.props?.location?.state?.redirectPath) {
            this.props.history.push(
              "/" + this.props?.location?.state?.redirectPath
            );
          }
        }
      }
    } else {
      // run all api

      // update wallet
      this.props.getCoinRate();

      // // transaction history

      // // asset value chart
      // this.getGraphData();

      // // counter free chart api - remove form home
      // // getAllCounterFeeApi(this, false, false);

      // // netflow api
      // this.props.getProfitAndLossApi(this, false, false, false);

      // // Insight api
      // this.props.getAllInsightsApi(this);

      // // get all upgrade plans
      // GetAllPlan();

      // // get users current plan
      // getUser(this);
    }
  };

  // asset value chart api call
  getGraphData = (groupByValue = GROUP_BY_DATE) => {
    let ActionType = ASSET_VALUE_GRAPH_DAY;
    this.setState({ graphLoading: true }, () => {
      let addressList = [];
      const tempUserWalletList = window.sessionStorage.getItem("addWallet")
        ? JSON.parse(window.sessionStorage.getItem("addWallet"))
        : this.state.userWalletList;
      tempUserWalletList.map((wallet) => addressList.push(wallet.address));
      let data = new URLSearchParams();
      data.append("wallet_addresses", JSON.stringify(addressList));
      data.append("group_criteria", groupByValue);
      this.props.getAssetGraphDataApi(data, this, ActionType);
      //  if (this.state.assetValueDataLoaded) {
      //    setTimeout(() => {
      //      this.props.getAssetGraphDataApi(data, this, ActionType);
      //    }, 10000);
      //  }
    });
  };

  // filter asset value chart
  handleGroupBy = (value) => {};

  // transaction history table data
  getTableData = () => {
    this.setState({ tableLoading: true });
    const arr = window.sessionStorage.getItem("addWallet")
      ? JSON.parse(window.sessionStorage.getItem("addWallet"))
      : this.state.userWalletList;
    let address = arr?.map((wallet) => {
      return wallet.address;
    });
    let condition = [{ key: SEARCH_BY_WALLET_ADDRESS_IN, value: address }];
    let data = new URLSearchParams();
    data.append("start", START_INDEX);
    data.append("conditions", JSON.stringify(condition));
    data.append("limit", 10);
    data.append("sorts", JSON.stringify(this.state.sort));
    this.props.searchTransactionApi(data, this);
  };

  // cost basis

  // when api return response then this function run
  CheckApiResponse = (value) => {
    if (this.props.location.state?.noLoad === undefined) {
      this.setState({
        apiResponse: value,
      });
    }

    // wallet updated set all falg to default
    // this.props.updateWalletListFlag("home", false);
    this.props.setPageFlagDefault();
  };

  handleYieldOppTableSort = (val) => {
    let sort = [...this.state.yieldOppTableSortOpt];
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
      yieldOppSort: obj,
      yieldOppTableSortOpt: sort,
    });
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
    if (obj && obj.length > 0) {
      obj = [{ key: obj[0].key, value: !obj[0].value }];
    }
    this.setState({
      sort: obj,
      tableSortOpt: sort,
    });
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

    AddMoreAddres({
      email_address: getCurrentUser().email,
      session_id: getCurrentUser().id,
    });
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
      HomeCostSortByAsset({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
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
      HomeSortByCostBasis({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
    } else if (e.title === "Current value") {
      this.sortArray("CurrentValue", isDown);
      this.setState({
        sortBy: sort,
      });
      HomeSortByCurrentValue({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
    } else if (e.title === "Gain loss") {
      this.sortArray("GainLoss", isDown);
      this.setState({
        sortBy: sort,
      });
      HomeSortByGainLoss({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
    }
  };
  setSwitch = () => {
    this.setState({
      isSwitch: !this.state.isSwitch,
    });

    NetflowSwitchHome({
      email_address: getCurrentUser().email,
      session_id: getCurrentUser().id,
    });
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
  goToRealizedGainsPage = () => {
    this.props.history.push("/realized-profit-and-loss");
    ProfitLossEV({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
  };
  goToGasFeesSpentPage = () => {
    this.props.history.push("/gas-fees");
    GasFeesEV({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
  };
  goToCounterPartyVolumePage = () => {
    this.props.history.push("/counterparty-volume");
    VolumeTradeByCP({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
  };
  goToHistoricPerformancePage = () => {
    this.props.history.push("/intelligence/asset-value");
    AssetValueExpandview({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
  };
  goToPriceGaugePage = () => {
    this.props.history.push("/price-gauge");
    PriceGaugeEV({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
  };
  render() {
    const { table, assetPriceList_home, totalCount } =
      this.props.intelligenceState;
    const { userWalletList, currency } = this.state;
    //   "asset price state",
    //  this.state?.assetPrice? Object.keys(this.state?.assetPrice)?.length:""
    // );
    //    "asset price redux",
    //    this.props.portfolioState?.assetPrice ?Object.keys(
    //      this.props.portfolioState?.assetPrice
    //    )?.length :""
    //  );

    // transaction history calculations
    let tableData =
      table &&
      table.map((row) => {
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
              TransactionHistoryDate({
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
                this.state.isShowingAge
                  ? "Click to view Timestamp"
                  : "Click to view Age"
              }
            >
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
            </CustomOverlay>
            <Image
              onClick={() => {
                this.handleTableSort("time");
              }}
              src={sortByIcon}
              className={
                this.state.tableSortOpt[0].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "time",
        coumnWidth: 0.4,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (rowData === "EMPTY") {
            return null;
          }
          if (dataKey === "time") {
            let tempVal = "-";
            let tempOpp = "-";
            if (this.state.isShowingAge && rowData.age) {
              tempVal = rowData.age;
              tempOpp = moment(rowData.time).format("MM/DD/YY hh:mm");
            } else if (!this.state.isShowingAge && rowData.time) {
              tempVal = moment(rowData.time).format("MM/DD/YY hh:mm");
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
            onClick={() => {
              this.handleTableSort("from");
              TransactionHistoryFrom({
                session_id: getCurrentUser().id,
                email_address: getCurrentUser().email,
              });
            }}
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
        coumnWidth: 0.2,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (rowData === "EMPTY") {
            return null;
          }
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
                      onClick={() => this.copyContent(rowData.from.address)}
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
                      <span
                        onClick={goToAddress}
                        className="top-account-address"
                      >
                        {TruncateText(rowData.from.metaData?.nickname)}
                      </span>
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
                      <span
                        onClick={goToAddress}
                        className="top-account-address"
                      >
                        {TruncateText(rowData.from.wallet_metaData.text)}
                      </span>
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
                    <span onClick={goToAddress} className="top-account-address">
                      {TruncateText(rowData.from.metaData?.displayAddress)}
                    </span>
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
                    <span onClick={goToAddress} className="top-account-address">
                      {showThis}
                    </span>
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
              TransactionHistoryTo({
                session_id: getCurrentUser().id,
                email_address: getCurrentUser().email,
              });
            }}
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
        coumnWidth: 0.2,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (rowData === "EMPTY") {
            return null;
          }
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
                      onClick={() => this.copyContent(rowData.to.address)}
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
                      <span
                        onClick={goToAddress}
                        className="top-account-address"
                      >
                        {TruncateText(rowData.to.metaData?.nickname)}
                      </span>
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
                      <span
                        onClick={goToAddress}
                        className="top-account-address"
                      >
                        {TruncateText(rowData.to.wallet_metaData.text)}
                      </span>
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
                    <span onClick={goToAddress} className="top-account-address">
                      {TruncateText(rowData.to.metaData?.displayAddress)}
                    </span>
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
                    <span onClick={goToAddress} className="top-account-address">
                      {showThis}
                    </span>
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
              TransactionHistoryAsset({
                session_id: getCurrentUser().id,
                email_address: getCurrentUser().email,
              });
            }}
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
        coumnWidth: 0.2,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (rowData === "EMPTY") {
            return null;
          }
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
      //           this.state.tableSortOpt[5].up ? "rotateDown" : "rotateUp"
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
    let tableDataCostBasis = this.props.intelligenceState.Average_cost_basis;
    if (tableDataCostBasis.length < 6) {
      const tempTableDataCostBasis = [...tableDataCostBasis];
      for (let i = tableDataCostBasis.length; i < 6; i++) {
        tempTableDataCostBasis.push("EMPTY");
      }
      tableDataCostBasis = tempTableDataCostBasis;
    }
    if (tableData.length < 6) {
      const temptableData = [...tableData];
      for (let i = tableData.length; i < 6; i++) {
        temptableData.push("EMPTY");
      }
      tableData = temptableData;
    }

    let yieldOpportunitiesListTemp = this.state.yieldOpportunitiesList;
    if (yieldOpportunitiesListTemp.length < 6) {
      const tempyieldOpportunitiesListTemp = [...yieldOpportunitiesListTemp];
      for (let i = yieldOpportunitiesListTemp.length; i < 6; i++) {
        tempyieldOpportunitiesListTemp.push("EMPTY");
      }
      yieldOpportunitiesListTemp = tempyieldOpportunitiesListTemp;
    }

    const YieldOppColumnData = [
      {
        labelName: (
          <div
            className="cp history-table-header-col"
            id="asset"
            onClick={() => this.handleYieldOppTableSort("asset")}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Asset
            </span>
            <Image
              src={sortByIcon}
              className={
                this.state.yieldOppTableSortOpt[0].up
                  ? "rotateDown"
                  : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "asset",
        coumnWidth: 0.25,
        isCell: true,
        className: "",
        headerClassName: "",
        cell: (rowData, dataKey) => {
          if (rowData === "EMPTY") {
            return null;
          }
          if (dataKey === "asset") {
            if (rowData.asset && rowData.asset.code) {
              return (
                <CustomOverlay
                  position="top"
                  isIcon={false}
                  isInfo={true}
                  isText={true}
                  text={rowData.asset.code ? rowData.asset.code : ""}
                >
                  <div className="dotDotText">
                    {rowData.asset.code ? rowData.asset.code : ""}
                  </div>
                </CustomOverlay>
              );
            }
            return null;
          }
        },
      },

      {
        labelName: (
          <div
            className="cp history-table-header-col"
            id="project"
            onClick={() => this.handleYieldOppTableSort("project")}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Project
            </span>
            <Image
              src={sortByIcon}
              className={
                this.state.yieldOppTableSortOpt[3].up
                  ? "rotateDown"
                  : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "project",
        coumnWidth: 0.25,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (rowData === "EMPTY") {
            return null;
          }
          if (dataKey === "project") {
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={rowData.project ? rowData.project : "-"}
              >
                <div className="inter-display-medium f-s-13 lh-16 grey-313 ellipsis-div">
                  {rowData.project ? rowData.project : "-"}
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
            id="tvl"
            onClick={() => this.handleYieldOppTableSort("tvl")}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              TVL
            </span>
            <Image
              src={sortByIcon}
              className={
                this.state.yieldOppTableSortOpt[5].up
                  ? "rotateDown"
                  : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "tvl",
        className: "usd-value",
        coumnWidth: 0.25,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (rowData === "EMPTY") {
            return null;
          }
          if (dataKey === "tvl") {
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={
                  this.state.currency?.rate
                    ? CurrencyType(false) +
                      amountFormat(
                        rowData.tvlUsd * this.state.currency?.rate,
                        "en-US",
                        "USD"
                      )
                    : CurrencyType(false) +
                      amountFormat(rowData.tvlUsd, "en-US", "USD")
                }
              >
                <div className="cost-common-container">
                  <div className="cost-common">
                    <span className="inter-display-medium f-s-13 lh-16 grey-313">
                      {this.state.currency?.rate
                        ? CurrencyType(false) +
                          numToCurrency(
                            rowData.tvlUsd * this.state.currency?.rate
                          )
                        : CurrencyType(false) + numToCurrency(rowData.tvlUsd)}
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
            onClick={() => this.handleYieldOppTableSort("apy")}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              APY
            </span>
            <Image
              src={sortByIcon}
              className={
                this.state.tableSortOpt[5].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "apy",
        className: "usd-value",
        coumnWidth: 0.25,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (rowData === "EMPTY") {
            return null;
          }
          if (dataKey === "apy") {
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={rowData.apy ? rowData.apy + "%" : "-"}
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
              className={!this.state.sortBy[0].down ? "rotateDown" : "rotateUp"}
            />
          </div>
        ),
        dataKey: "Asset",
        // coumnWidth: 118,
        coumnWidth: 0.25,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "Asset") {
            if (rowData === "EMPTY") {
              return null;
            }
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
                <div>
                  <CoinChip
                    hideText={true}
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
      // {
      //   labelName: (
      //     <div
      //       className="cp history-table-header-col"
      //       id="Cost Basis"
      //       onClick={() => this.handleSort(this.state.sortBy[4])}
      //     >
      //       <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
      //         Cost basis
      //       </span>
      //       <Image
      //         src={sortByIcon}
      //         className={!this.state.sortBy[4].down ? "rotateDown" : "rotateUp"}
      //       />
      //     </div>
      //   ),
      //   dataKey: "CostBasis",
      //   // coumnWidth: 100,
      //   coumnWidth: 0.2,
      //   isCell: true,
      //   cell: (rowData, dataKey) => {
      //     if (dataKey === "CostBasis") {
      //       if (rowData === "EMPTY") {
      //         return null;
      //       }
      //       return (
      //         <div className="cost-common-container">
      //           <CustomOverlay
      //             position="top"
      //             isIcon={false}
      //             isInfo={true}
      //             isText={true}
      //             text={
      //               !rowData.CostBasis || rowData.CostBasis === 0
      //                 ? "N/A"
      //                 : CurrencyType(false) +
      //                   Number(
      //                     noExponents(rowData.CostBasis.toFixed(2))
      //                   ).toLocaleString("en-US")
      //             }
      //           >
      //             <div className="cost-common">
      //               <span>
      //                 {!rowData.CostBasis || rowData.CostBasis === 0
      //                   ? "N/A"
      //                   : CurrencyType(false) +
      //                     numToCurrency(
      //                       rowData.CostBasis.toFixed(2)
      //                     ).toLocaleString("en-US")}
      //               </span>
      //             </div>
      //           </CustomOverlay>
      //         </div>
      //       );
      //     }
      //   },
      // },
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
        coumnWidth: 0.25,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (rowData === "EMPTY") {
            return null;
          }
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
                    <span>
                      {rowData.CurrentValue
                        ? CurrencyType(false) +
                          numToCurrency(
                            rowData.CurrentValue.toFixed(2)
                          ).toLocaleString("en-US")
                        : CurrencyType(false) + "0.00"}
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

        coumnWidth: 0.25,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (rowData === "EMPTY") {
            return null;
          }
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
            id="PortfolioPer"
            // onClick={() => this.handleSort(this.state.sortBy[6])}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Portfolio (%)
            </span>
            {/* <Image
              src={sortByIcon}
              className={!this.state.sortBy[6].down ? "rotateDown" : "rotateUp"}
            /> */}
          </div>
        ),
        dataKey: "PortfolioPercentage",
        // coumnWidth: 128,
        coumnWidth: 0.25,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "PortfolioPercentage") {
            if (rowData === "EMPTY") {
              return null;
            }
            return (
              <div className="gainLossContainer">
                <CustomOverlay
                  position="top"
                  isIcon={false}
                  isInfo={true}
                  isText={true}
                  text={
                    rowData.weight
                      ? Math.abs(
                          Number(noExponents(rowData.weight.toFixed(2)))
                        ).toLocaleString("en-US") + "%"
                      : "0.00%"
                  }
                  colorCode="#000"
                >
                  <div className={`gainLoss`}>
                    <span className="inter-display-medium f-s-13 lh-16 grey-313">
                      {rowData.weight
                        ? Math.abs(
                            Number(noExponents(rowData.weight.toFixed(2)))
                          ).toLocaleString("en-US") + "%"
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
    const getTotalAssetValue = () => {
      if (this.props.portfolioState) {
        const tempWallet = this.props.portfolioState.walletTotal
          ? this.props.portfolioState.walletTotal
          : 0;
        const tempCredit = this.props.defiState.totalYield
          ? this.props.defiState.totalYield
          : 0;
        const tempDebt = this.props.defiState.totalDebt
          ? this.props.defiState.totalDebt
          : 0;

        return tempWallet + tempCredit - tempDebt;
      }
      return 0;
    };
    if (this.state.isMobileDevice) {
      return (
        <PortfolioMobile
          chainLoader={this.state.chainLoader}
          loader={this.state.loader}
          totalChainDetechted={this.state.totalChainDetechted}
          setLoader={this.setLoader}
          getTotalAssetValue={getTotalAssetValue}
          isLoading={this.state.isLoading}
          isUpdate={this.state.isUpdate}
          getProtocolTotal={this.getProtocolTotal}
          updateTimer={this.updateTimer}
          undetectedWallet={this.undetectedWallet}
          userWalletList={this.state.userWalletList}
          handleChangeList={this.handleChangeList}
          CheckApiResponse={this.CheckApiResponse}
          handleAddModal={this.handleAddModal}
          isLoadingNet={this.state.isLoadingNet}
          history={this.props.history}
          tableDataCostBasis={tableDataCostBasis}
          AvgCostLoading={this.state.AvgCostLoading}
          location={this.props.location}
        />
      );
    }
    return (
      <div>
        {this.state.loader ? (
          <Loading />
        ) : (
          <div className="portfolio-page-section">
            {this.state.followSigninModal ? (
              <FollowAuthModal
                followedAddress={this.state.followedAddress}
                hideOnblur
                showHiddenError
                modalAnimation={this.state.followSignInModalAnimation}
                show={this.state.followSigninModal}
                onHide={this.onCloseModal}
                history={this.props.history}
                modalType={"create_account"}
                iconImage={SignInIcon}
                hideSkip={true}
                title="You’re now following this wallet"
                description="Sign in so you’ll be the first to see what they buy and sell"
                stopUpdate={true}
                tracking="Follow sign in popup"
                goToSignUp={this.openSignUpModal}
              />
            ) : null}
            {this.state.followSignupModal ? (
              <FollowExitOverlay
                followedAddress={this.state.followedAddress}
                hideOnblur
                showHiddenError
                modalAnimation={false}
                show={this.state.followSignupModal}
                onHide={this.onCloseModal}
                history={this.props.history}
                modalType={"exitOverlay"}
                handleRedirection={() => {
                  // resetUser();
                  // setTimeout(function () {
                  //   if (this.props.history) {
                  //     this.props.history.push("/welcome");
                  //   }
                  // }, 3000);
                }}
                signup={true}
                goToSignIn={this.openSigninModal}
              />
            ) : null}
            <div
              className="portfolio-container page"
              style={{ overflow: "visible", padding: "0 5rem" }}
            >
              <div className="portfolio-section">
                {/* welcome card */}
                <WelcomeCard
                  afterAddressFollowed={this.afterAddressFollowed}
                  isAddressFollowedCount={this.state.isAddressFollowedCount}
                  handleShare={this.handleShare}
                  isSidebarClosed={this.props.isSidebarClosed}
                  changeWalletList={this.handleChangeList}
                  apiResponse={(e) => this.CheckApiResponse(e)}
                  // showNetworth={true}
                  // yesterday balance
                  yesterdayBalance={this.props.portfolioState.yesterdayBalance}
                  // toggleAddWallet={this.state.toggleAddWallet}
                  // handleToggleAddWallet={this.handleToggleAddWallet}

                  // decrement={true}

                  // total network and percentage calculate
                  assetTotal={getTotalAssetValue()}
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
                  handleAddModal={this.handleAddModal}
                  // net worth total
                  isLoading={this.state.isLoadingNet}
                  // walletTotal={
                  //   this.props.portfolioState.walletTotal +
                  //   this.state.totalYield -
                  //   this.state.totalDebt
                  // }

                  // manage wallet
                  handleManage={() => {
                    this.props.history.push("/wallets");
                    ManageWallets({
                      session_id: getCurrentUser().id,
                      email_address: getCurrentUser().email,
                    });
                  }}
                />
              </div>

              <div
                className="portfolio-section"
                style={{
                  minWidth: "85rem",
                  marginTop: "11rem",
                }}
              ></div>

              <div className="m-b-22 graph-table-section">
                <Row>
                  <Col md={6}>
                    <div
                      className="m-r-16 section-table"
                      style={{
                        height: "43rem",
                        display: "flex",
                        flexDirection: "column",
                        minHeight: "43rem",
                        marginBottom: 0,
                      }}
                    >
                      <div className="section-table-toggle-container">
                        <div className="section-table-toggle">
                          <div
                            className={`inter-display-medium section-table-toggle-element mr-1 ${
                              this.state.blockOneSelectedItem === 1
                                ? "section-table-toggle-element-selected"
                                : ""
                            }`}
                            onClick={() => {
                              this.changeBlockOneItem(1);
                            }}
                          >
                            Assets
                          </div>
                          <div
                            className={`inter-display-medium section-table-toggle-element ml-1 mr-1 ${
                              this.state.blockOneSelectedItem === 2
                                ? "section-table-toggle-element-selected"
                                : ""
                            }`}
                            onClick={() => {
                              this.changeBlockOneItem(2);
                            }}
                          >
                            Defi
                          </div>
                        </div>
                      </div>
                      {this.state.blockOneSelectedItem === 1 ? (
                        <TransactionTable
                          noSubtitleBottomPadding
                          disableOnLoading
                          isMiniversion
                          // title="Unrealized profit and loss"
                          handleClick={() => {
                            if (this.state.lochToken) {
                              this.props.history.push("/assets");
                              AverageCostBasisEView({
                                session_id: getCurrentUser().id,
                                email_address: getCurrentUser().email,
                              });
                            }
                          }}
                          // subTitle="Understand your unrealized profit and loss per token"
                          tableData={tableDataCostBasis.slice(0, 5)}
                          moreData={
                            this.props.intelligenceState?.Average_cost_basis &&
                            this.props.intelligenceState.Average_cost_basis
                              .length > 5
                              ? `Click here to see ${numToCurrency(
                                  this.props.intelligenceState
                                    .Average_cost_basis.length - 5,
                                  true
                                ).toLocaleString("en-US")}+ asset${
                                  this.props.intelligenceState
                                    .Average_cost_basis.length -
                                    5 >
                                  1
                                    ? "s"
                                    : ""
                                }`
                              : "Click here to see more"
                          }
                          showDataAtBottom
                          columnList={CostBasisColumnData}
                          headerHeight={60}
                          isArrow={true}
                          isLoading={this.state.AvgCostLoading}
                          isAnalytics="average cost basis"
                          addWatermark
                        />
                      ) : this.state.blockOneSelectedItem === 2 ? (
                        <PortfolioHomeDefiBlock
                          lochToken={this.state.lochToken}
                          history={this.props.history}
                          userWalletList={this.state.userWalletList}
                        />
                      ) : null}
                    </div>
                  </Col>
                  <Col md={6}>
                    <div
                      className="m-r-16 section-table"
                      style={{
                        height: "43rem",
                        display: "flex",
                        flexDirection: "column",
                        minHeight: "43rem",
                        marginBottom: 0,
                      }}
                    >
                      <div className="section-table-toggle-container">
                        <div className="section-table-toggle">
                          <div
                            className={`inter-display-medium section-table-toggle-element mr-1 ${
                              this.state.blockTwoSelectedItem === 1
                                ? "section-table-toggle-element-selected"
                                : ""
                            }`}
                            onClick={() => {
                              this.changeBlockTwoItem(1);
                            }}
                          >
                            Realized Gains
                          </div>
                          <div
                            className={`inter-display-medium section-table-toggle-element ml-1 mr-1 ${
                              this.state.blockTwoSelectedItem === 2
                                ? "section-table-toggle-element-selected"
                                : ""
                            }`}
                            onClick={() => {
                              this.changeBlockTwoItem(2);
                            }}
                          >
                            Gas fees
                          </div>
                          <div
                            className={`inter-display-medium section-table-toggle-element ml-1 ${
                              this.state.blockTwoSelectedItem === 3
                                ? "section-table-toggle-element-selected"
                                : ""
                            }`}
                            onClick={() => {
                              this.changeBlockTwoItem(3);
                            }}
                          >
                            Counterparties
                          </div>
                        </div>
                      </div>
                      <div className="profit-chart">
                        {this.state.blockTwoSelectedItem === 1 ? (
                          <BarGraphSection
                            openChartPage={this.goToRealizedGainsPage}
                            newHomeSetup
                            disableOnLoading
                            noSubtitleBottomPadding
                            noSubtitleTopPadding
                            loaderHeight={15.5}
                            // headerTitle="Realized profit and loss"
                            // headerSubTitle="Understand your portfolio's net flows"
                            isArrow={true}
                            handleClick={() => {
                              if (this.state.lochToken) {
                                ProfitLossEV({
                                  session_id: getCurrentUser().id,
                                  email_address: getCurrentUser().email,
                                });
                                this.props.history.push(
                                  "/intelligence#netflow"
                                );
                              }
                            }}
                            isScrollVisible={false}
                            data={
                              this.props.intelligenceState?.graphValue &&
                              this.props.intelligenceState?.graphValue[0]
                            }
                            options={
                              this.props.intelligenceState?.graphValue &&
                              this.props.intelligenceState?.graphValue[1]
                            }
                            coinsList={this.props.OnboardingState.coinsList}
                            marginBottom="m-b-32"
                            showFooter={false}
                            showBadges={false}
                            // showPercentage={
                            //   this.props.intelligenceState.graphValue &&
                            //   this.props.intelligenceState.graphValue[2]
                            // }
                            showSwitch={false}
                            isLoading={this.state.netFlowLoading}
                            className={"portfolio-profit-and-loss"}
                            isMinichart={true}
                            ProfitLossAsset={
                              this.props.intelligenceState.ProfitLossAsset
                            }
                            isSwitch={this.state.isSwitch}
                            setSwitch={this.setSwitch}
                            isSmallerToggle
                          />
                        ) : this.state.blockTwoSelectedItem === 2 ? (
                          <div
                            style={{
                              position: "relative",
                            }}
                          >
                            <div
                              style={{
                                position: "absolute",
                                opacity: 0,
                              }}
                            >
                              Loch
                            </div>
                            <BarGraphSection
                              openChartPage={this.goToGasFeesSpentPage}
                              data={
                                this.state.homeGraphFeesData &&
                                this.state.homeGraphFeesData[0]
                              }
                              options={
                                this.state.homeGraphFeesData &&
                                this.state.homeGraphFeesData[1]
                              }
                              options2={
                                this.state.homeGraphFeesData &&
                                this.state.homeGraphFeesData[2]
                              }
                              isScrollVisible={false}
                              isScroll={true}
                              isLoading={this.state.gasFeesGraphLoading}
                              oldBar
                              noSubtitleBottomPadding
                              newHomeSetup
                              noSubtitleTopPadding
                            />
                          </div>
                        ) : this.state.blockTwoSelectedItem === 3 ? (
                          <div
                            style={{
                              position: "relative",
                            }}
                          >
                            <div
                              style={{
                                position: "absolute",
                                opacity: 0,
                                left: "5rem",
                                top: "5rem",
                              }}
                            >
                              <div>Loch</div>
                            </div>
                            <div
                              style={{
                                position: "absolute",
                                opacity: 0,
                                left: "5rem",
                              }}
                            >
                              <div>Loch</div>
                            </div>
                            <BarGraphSection
                              openChartPage={this.goToCounterPartyVolumePage}
                              data={
                                this.state.homeCounterpartyVolumeData &&
                                this.state.homeCounterpartyVolumeData[0]
                              }
                              options={
                                this.state.homeCounterpartyVolumeData &&
                                this.state.homeCounterpartyVolumeData[1]
                              }
                              options2={
                                this.state.homeCounterpartyVolumeData &&
                                this.state.homeCounterpartyVolumeData[2]
                              }
                              isScrollVisible={false}
                              isScroll={false}
                              isLoading={this.state.counterGraphLoading}
                              oldBar
                              noSubtitleBottomPadding
                              newHomeSetup
                              noSubtitleTopPadding
                            />
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
              <div
                style={{
                  marginBottom: "-0.8rem",
                }}
                className="graph-table-section"
              >
                <Row>
                  <Col md={6}>
                    <div
                      className="m-r-16 section-table"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        minHeight: "43rem",
                        marginBottom: 0,
                      }}
                    >
                      <div className="section-table-toggle-container homepage-table-charts">
                        <div className="section-table-toggle">
                          <div
                            className={`inter-display-medium section-table-toggle-element mr-1 ${
                              this.state.blockThreeSelectedItem === 1
                                ? "section-table-toggle-element-selected"
                                : ""
                            }`}
                            onClick={() => {
                              this.changeBlockThreeItem(1);
                            }}
                          >
                            Price gauge
                          </div>
                          <div
                            className={`inter-display-medium section-table-toggle-element ml-1 ${
                              this.state.blockThreeSelectedItem === 2
                                ? "section-table-toggle-element-selected"
                                : ""
                            }`}
                            onClick={() => {
                              this.changeBlockThreeItem(2);
                            }}
                          >
                            Networks
                          </div>
                        </div>
                      </div>
                      {this.state.blockThreeSelectedItem === 1 ? (
                        <InflowOutflowPortfolioHome
                          openChartPage={this.goToPriceGaugePage}
                          // isHomepage
                          showEth
                          userWalletList={this.state.userWalletList}
                          lochToken={this.state.lochToken}
                          callChildPriceGaugeApi={
                            this.state.callChildPriceGaugeApi
                          }
                        />
                      ) : (
                        <PortfolioHomeNetworksBlock
                          history={this.props.history}
                          updatedInsightList={this.state.updatedInsightList}
                          insightsBlockLoading={this.state.insightsBlockLoading}
                          chainLoader={this.state.chainLoader}
                        />
                      )}
                    </div>
                  </Col>
                  <Col md={6}>
                    <div
                      className="m-r-16 section-table"
                      style={{
                        height: "43rem",
                        display: "flex",
                        flexDirection: "column",
                        minHeight: "43rem",
                        marginBottom: 0,
                      }}
                    >
                      <div className="section-table-toggle-container">
                        <div className="section-table-toggle">
                          <div
                            className={`inter-display-medium section-table-toggle-element mr-1 ${
                              this.state.blockFourSelectedItem === 1
                                ? "section-table-toggle-element-selected"
                                : ""
                            }`}
                            onClick={() => {
                              this.changeBlockFourItem(1);
                            }}
                          >
                            Transactions
                          </div>
                          <div
                            className={`inter-display-medium section-table-toggle-element ml-1 mr-1 ${
                              this.state.blockFourSelectedItem === 2
                                ? "section-table-toggle-element-selected"
                                : ""
                            }`}
                            onClick={() => {
                              this.changeBlockFourItem(2);
                            }}
                          >
                            Yield opportunities
                          </div>
                          <div
                            className={`inter-display-medium section-table-toggle-element ml-1 ${
                              this.state.blockFourSelectedItem === 3
                                ? "section-table-toggle-element-selected"
                                : ""
                            }`}
                            onClick={() => {
                              this.changeBlockFourItem(3);
                            }}
                          >
                            Insights
                          </div>
                        </div>
                        {this.state.blockFourSelectedItem === 1 ? (
                          <TransactionTable
                            moreData={
                              totalCount && totalCount > 5
                                ? `Click here to see ${numToCurrency(
                                    totalCount - 5,
                                    true
                                  ).toLocaleString("en-US")}+ transaction${
                                    totalCount - 5 > 1 ? "s" : ""
                                  }`
                                : "Click here to see more"
                            }
                            showDataAtBottom
                            noSubtitleBottomPadding
                            disableOnLoading
                            isMiniversion
                            // title="Transactions"
                            handleClick={() => {
                              if (this.state.lochToken) {
                                this.props.history.push(
                                  "/intelligence/transaction-history"
                                );
                                TransactionHistoryEView({
                                  session_id: getCurrentUser().id,
                                  email_address: getCurrentUser().email,
                                });
                              }
                            }}
                            // subTitle="Sort, filter, and dissect all your transactions from one place"
                            tableData={tableData.slice(0, 5)}
                            columnList={columnList}
                            headerHeight={60}
                            isArrow={true}
                            isLoading={this.state.tableLoading}
                            addWatermark
                          />
                        ) : this.state.blockFourSelectedItem === 2 ? (
                          <TransactionTable
                            noSubtitleBottomPadding
                            disableOnLoading
                            isMiniversion
                            // title="Unrealized profit and loss"
                            handleClick={() => {
                              if (this.state.lochToken) {
                                this.props.history.push("/yield-opportunities");
                                YieldOppurtunitiesExpandediew({
                                  session_id: getCurrentUser().id,
                                  email_address: getCurrentUser().email,
                                });
                              }
                            }}
                            // subTitle="Understand your unrealized profit and loss per token"
                            tableData={yieldOpportunitiesListTemp.slice(0, 5)}
                            moreData={
                              this.state.yieldOpportunitiesTotalCount &&
                              this.state.yieldOpportunitiesTotalCount > 5
                                ? `Click here to see ${numToCurrency(
                                    this.state.yieldOpportunitiesTotalCount - 5,
                                    true
                                  ).toLocaleString("en-US")}+ yield ${
                                    this.state.yieldOpportunitiesTotalCount -
                                      5 >
                                    1
                                      ? "opportunities"
                                      : "opportunity"
                                  }`
                                : "Click here to see more"
                            }
                            showDataAtBottom
                            columnList={YieldOppColumnData}
                            headerHeight={60}
                            isArrow={true}
                            isLoading={
                              this.state.yieldOpportunitiesTableLoading
                            }
                            addWatermark
                          />
                        ) : this.state.blockFourSelectedItem === 3 ? (
                          <PortfolioHomeInsightsBlock
                            history={this.props.history}
                            updatedInsightList={this.state.updatedInsightList}
                            insightsBlockLoading={
                              this.state.insightsBlockLoading
                            }
                          />
                        ) : null}
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* footer  */}
              <Footer />
            </div>
          </div>
        )}
        {this.state.fixModal && (
          <FixAddModal
            show={this.state.fixModal}
            onHide={this.handleFixModal}
            //  modalIcon={AddWalletModalIcon}
            title="Fix your wallet address"
            subtitle="Add your wallet address to get started"
            // fixWalletAddress={fixWalletAddress}
            btnText="Done"
            btnStatus={true}
            history={this.props.history}
            modalType="fixwallet"
            changeWalletList={this.handleChangeList}
            apiResponse={(e) => this.CheckApiResponse(e)}
            from="home"
            updateTimer={this.updateTimer}
          />
        )}
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
            from="home"
            updateTimer={this.updateTimer}
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
  yieldOpportunitiesState: state.YieldOpportunitiesState,
  walletState: state.walletState,
  inflowsOutflowsList: state.inflowsOutflowsList,
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
  addAddressToWatchList,
  getAllCounterFeeApi,
  getAllFeeApi,
  getYieldOpportunities,
  addUserCredits,
  getProtocolBalanceApi,
};
Portfolio.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);
