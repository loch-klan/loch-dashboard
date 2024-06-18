import React from "react";
import { connect } from "react-redux";
import SignInIcon from "../../assets/images/icons/ActiveProfileIcon.svg";
import nextIcon from "../../assets/images/icons/next-arrow.svg";
import prevIcon from "../../assets/images/icons/prev-arrow.svg";
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import WelcomeCard from "./WelcomeCard";

import { Col, Image, Row } from "react-bootstrap";
import AddWalletModalIcon from "../../assets/images/icons/wallet-icon.svg";
import InfoIcon from "../../assets/images/icons/info-icon.svg";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import FixAddModal from "../common/FixAddModal";
import {
  getAllInsightsApi,
  getAssetProfitLoss,
  getProfitAndLossApi,
  searchTransactionApi,
  updateAssetProfitLoss,
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
  DEFAULT_PRICE,
  GROUP_BY_DATE,
  SEARCH_BY_NOT_DUST,
  SEARCH_BY_WALLET_ADDRESS_IN,
  SORT_BY_AMOUNT,
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
  CAverageCostBasisSort,
  CostAmountHover,
  CostAssetHover,
  CostAverageCostPriceHover,
  CostCostBasisHover,
  CostCurrentPriceHover,
  CostCurrentValueHover,
  CostGainHover,
  CostGainLossHover,
  CostSortByAmount,
  CostSortByAsset,
  CostSortByCostPrice,
  CostSortByCurrentPrice,
  CostSortByPortfolio,
  DefiBlockExpandediew,
  GasFeesEV,
  HomeCostSortByAsset,
  HomePage,
  HomeShare,
  HomeSortByCostBasis,
  HomeSortByCurrentValue,
  HomeSortByGainLoss,
  InsightsEV,
  ManageWallets,
  NetflowSwitchHome,
  NftExpandediew,
  PriceGaugeEV,
  ProfitLossEV,
  SortByCurrentValue,
  SortByGainAmount,
  SortByGainLoss,
  TimeSpentHome,
  TransactionHistoryAddress,
  TransactionHistoryAddressCopied,
  TransactionHistoryAsset,
  TransactionHistoryDate,
  TransactionHistoryEView,
  TransactionHistoryFrom,
  TransactionHistoryHashCopied,
  TransactionHistoryHashHover,
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
import { deleteToken, getCurrentUser, getToken } from "../../utils/ManageToken";
import {
  CurrencyType,
  TruncateText,
  UpgradeTriggered,
  amountFormat,
  convertNtoNumber,
  dontOpenLoginPopup,
  isPremiumUser,
  mobileCheck,
  noExponents,
  numToCurrency,
  openAddressInSameTab,
  removeBlurMethods,
  removeOpenModalAfterLogin,
  removeSignUpMethods,
  scrollToTop,
} from "../../utils/ReusableFunctions";
import { GetAllPlan, getUser } from "../common/Api";
import Loading from "../common/Loading";
import UpgradeModal from "../common/upgradeModal";
import {
  getAllCounterFeeApi,
  getAllFeeApi,
  getAvgCostBasis,
  updateAverageCostBasis,
  updateCounterParty,
  updateFeeGraph,
} from "../cost/Api";
import { ASSET_VALUE_GRAPH_DAY } from "./ActionTypes";
import { getAssetGraphDataApi } from "./Api";

import { toast } from "react-toastify";
import CopyClipboardIcon from "../../assets/images/CopyClipboardIcon.svg";
import Footer from "../common/footer";
import PortfolioMobile from "./PortfolioMobile";
import "./_mobilePortfolio.scss";

import { getYieldOpportunities } from "../yieldOpportunities/Api.js";
import PortfolioHomeInsightsBlock from "./PortfolioHomeInsightsBlock.js";

import {
  ArrowDownLeftSmallIcon,
  ArrowUpRightSmallIcon,
  DefaultNftTableIconIcon,
  HomeTabArrowIcon,
  InfoIconI,
} from "../../assets/images/icons/index.js";
import InflowOutflowPortfolioHome from "../intelligence/InflowOutflowPortfolioHome.js";
import { addUserCredits } from "../profile/Api.js";
import CoinChip from "../wallet/CoinChip.js";
import PortfolioHomeDefiBlock from "./PortfolioHomeDefiBlock.js";
import PortfolioHomeNetworksBlock from "./PortfolioHomeNetworksBlock.js";
import TopWalletAddressList from "../header/TopWalletAddressList.js";
import { getCounterGraphData, getGraphData } from "../cost/getGraphData.js";
import MobileLayout from "../layout/MobileLayout.js";
import { getNFT } from "../nft/NftApi.js";
import HandleBrokenImages from "../common/HandleBrokenImages.js";
import PaywallModal from "../common/PaywallModal.js";
import CustomOverlayUgradeToPremium from "../../utils/commonComponent/CustomOverlayUgradeToPremium.js";

class Portfolio extends BaseReactComponent {
  constructor(props) {
    super(props);

    if (props.location.state) {
      // window.localStorage.setItem(
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
      isPremiumUser: isPremiumUser() ? true : false,
      isLochPaymentModal: false,
      payModalTitle: "",
      payModalDescription: "",
      localNftData: [],
      nftTableLoading: false,
      shouldAvgCostLoading: false,
      shouldNetFlowLoading: false,
      switchPriceGaugeLoader: false,
      shouldYieldOpportunitiesTableLoading: false,
      counterGraphDigit: 3,
      GraphDigit: 3,
      walletList: JSON.parse(window.localStorage.getItem("addWallet")),
      // Should call block one
      getCurrentTimeUpdater: false,
      shouldCallAssetsAvgCostBasisApi: true,
      // Should call block one

      // Should call block two
      shouldCallProfitAndLossApi: true,
      shouldCallGraphFeesApi: true,
      shouldCallCounterPartyVolumeApi: true,
      // Should call block two

      // Should call block three
      shouldCallHistoricPerformanceApi: true,
      // Should call block three

      // Should call block four

      shouldCallInsightsApi: true,
      // Should call block four

      callChildPriceGaugeApi: 0,
      insightsBlockLoading: false,
      homeGraphFeesData: undefined,
      homeCounterpartyVolumeData: undefined,
      gasFeesGraphLoading: false,
      counterGraphLoading: true,
      yieldOpportunitiesList: [],
      yieldOpportunitiesTotalCount: 0,
      yieldOpportunitiesTableLoading: true,
      blockOneSelectedItem: 1,
      blockTwoSelectedItem: 1,
      blockThreeSelectedItem: mobileCheck() ? 4 : 1,
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
      userWalletList: window.localStorage.getItem("addWallet")
        ? JSON.parse(window.localStorage.getItem("addWallet"))
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
      tableLoading: true,

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
      currency: JSON.parse(window.localStorage.getItem("currency")),

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
        JSON.parse(window.localStorage.getItem("currentPlan")) || "Free",
      upgradeModal: false,
      isStatic: false,
      triggerId: 0,

      // get lock token
      lochToken: JSON.parse(window.localStorage.getItem("stopClick")),

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
        { title: "Gain amount", down: true },
        { title: "Gain percentage", down: true },
        { title: "Portfolio perc", down: true },
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
    let tempToken = getToken();
    if (tempToken && tempToken !== "jsk") {
      this.setState({
        blockOneSelectedItem: itemNum,
      });
    }
  };
  changeBlockTwoItem = (itemNum) => {
    let tempToken = getToken();
    if (tempToken && tempToken !== "jsk") {
      this.setState({
        blockTwoSelectedItem: itemNum,
      });
    }
  };
  changeBlockThreeItem = (itemNum) => {
    let tempToken = getToken();
    if (tempToken && tempToken !== "jsk") {
      this.setState({
        blockThreeSelectedItem: itemNum,
      });
    }
  };
  changeBlockFourItem = (itemNum) => {
    let tempToken = getToken();
    if (tempToken && tempToken !== "jsk") {
      this.setState({
        blockFourSelectedItem: itemNum,
      });
    }
  };
  getCurrentTime = () => {
    this.setState({
      getCurrentTimeUpdater: !this.state.getCurrentTimeUpdater,
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
    let token = window.localStorage.getItem("lochToken");
    if (!this.state.lochToken) {
      this.setState({
        lochToken: JSON.parse(window.localStorage.getItem("stopClick")),
      });
      setTimeout(() => {
        this.getToken();
      }, 1000);
    }

    if (token !== "jsk") {
      window.localStorage.setItem("stopClick", true);
      let obj = UpgradeTriggered();
      const onceAddCredit = window.localStorage.getItem("addAddressCreditOnce");
      if (onceAddCredit) {
        window.localStorage.removeItem("addAddressCreditOnce");
        const addressCreditScore = new URLSearchParams();
        addressCreditScore.append("credits", "address_added");
        this.props.addUserCredits(addressCreditScore);
      }
      const multipleAddCredit = window.localStorage.getItem(
        "addMultipleAddressCreditOnce"
      );
      if (multipleAddCredit) {
        window.localStorage.removeItem("addMultipleAddressCreditOnce");
        const multipleAddressCreditScore = new URLSearchParams();
        multipleAddressCreditScore.append("credits", "multiple_address_added");
        this.props.addUserCredits(multipleAddressCreditScore);
      }
      const ensCredit = window.localStorage.getItem("addEnsCreditOnce");
      if (ensCredit) {
        window.localStorage.removeItem("addEnsCreditOnce");
        const ensCreditScore = new URLSearchParams();
        ensCreditScore.append("credits", "ens_added");
        this.props.addUserCredits(ensCreditScore);
      }

      const walletCredit = window.localStorage.getItem(
        "connectWalletCreditOnce"
      );
      if (walletCredit) {
        window.localStorage.removeItem("connectWalletCreditOnce");
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
      userPlan: JSON.parse(window.localStorage.getItem("currentPlan")),
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
    let userWallet = JSON.parse(window.localStorage.getItem("addWallet"));
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
    window.localStorage.setItem("isFollowingAddress", true);
    if (openModal) {
      this.afterAddressFollowed(passedAddress);
    }
  };
  callPriceGaugeApi = () => {
    this.setState({
      callChildPriceGaugeApi: this.state.callChildPriceGaugeApi + 1,
    });
  };
  callNetworksApi = (isUpdate) => {
    // Resetting the user wallet list, total and chain wallet
    this.props.settingDefaultValues(this);

    // Loops on coins to fetch details of each coin which exist in wallet
    let isFound = false;
    const tempUserWalletList = window.localStorage.getItem("addWallet")
      ? JSON.parse(window.localStorage.getItem("addWallet"))
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
            if (isUpdate) {
              this.props.getUserWallet(userCoinWallet, this, true, i);
            } else {
              this.props.getUserWallet(userCoinWallet, this, false, i);
            }
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
    if (isUpdate) {
      this.props.getExchangeBalances(this, true);
    } else {
      this.props.getExchangeBalances(this, false);
    }
    if (isUpdate) {
      window.localStorage.removeItem("callTheUpdateAPI");
    }
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
    const tempUserWalletList = window.localStorage.getItem("addWallet")
      ? JSON.parse(window.localStorage.getItem("addWallet"))
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
      this.props.updateWalletListFlag("yieldOpportunities", true);
      this.props.getYieldOpportunities(data, 0);
      this.props.getNFT(data, this, true);
    }
  };
  callNFTApi = () => {
    this.props.updateWalletListFlag("nftPage", true);
    this.setState({
      nftTableLoading: true,
    });
    let data = new URLSearchParams();
    data.append("start", 0);
    data.append("conditions", JSON.stringify([]));
    data.append("limit", API_LIMIT);
    data.append("sorts", JSON.stringify([]));
    this.props.getNFT(data, this, true);
  };
  callAllApisTwice = () => {
    setTimeout(() => {
      const shouldRecallApis = window.localStorage.getItem("shouldRecallApis");

      if (shouldRecallApis === "true") {
        let tempToken = getToken();
        if (!(!tempToken || tempToken === "jsk")) {
          window.localStorage.setItem("callTheUpdateAPI", true);

          this.props.portfolioState.walletTotal = 0;
          this.props.portfolioState.chainPortfolio = {};
          this.props.portfolioState.assetPrice = {};
          this.props.portfolioState.chainWallet = [];
          this.props.portfolioState.yesterdayBalance = 0;
          this.props.setPageFlagDefault(true);
        }
      } else if (shouldRecallApis === "false") {
        window.localStorage.removeItem("shouldRecallApis");

        this.setState({
          AvgCostLoading: this.state.shouldAvgCostLoading
            ? false
            : this.state.AvgCostLoading,
          netFlowLoading: this.state.shouldNetFlowLoading
            ? false
            : this.state.netFlowLoading,
          yieldOpportunitiesTableLoading: this.state
            .shouldYieldOpportunitiesTableLoading
            ? false
            : this.state.yieldOpportunitiesTableLoading,
          switchPriceGaugeLoader: !this.state.switchPriceGaugeLoader,
        });
      }
    }, 5000);
  };
  checkPremium = () => {
    // if (isPremiumUser()) {
    //   this.setState({
    //     isPremiumUser: true,
    //   });
    // } else {
    //   this.setState({
    //     isPremiumUser: false,
    //   });
    // }
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
    setTimeout(() => {
      this.setState({
        isPremiumUser: isPremiumUser(),
      });
    }, 1000);
    const isBackFromPayment = window.localStorage.getItem(
      "openPaymentOptionsAgain"
    );
    if (isBackFromPayment === "true") {
      this.setState(
        {
          openLochPaymentModalWithOptions: true,
        },
        () => {
          window.localStorage.removeItem("openPaymentOptionsAgain");
          this.setState({
            isLochPaymentModal: true,
          });
        }
      );
    }
    this.checkPremium();
    // const userDetails = JSON.parse(window.localStorage.getItem("lochUser"));
    // if (userDetails && userDetails.email) {
    //   const shouldOpenNoficationModal = window.localStorage.getItem(
    //     "openHomePaymentModal"
    //   );
    //   const isOpenForSearch = window.localStorage.getItem(
    //     "openSearchbarPaymentModal"
    //   );
    //   if (shouldOpenNoficationModal && !isOpenForSearch) {
    //     setTimeout(() => {
    //       removeOpenModalAfterLogin();
    //       const titleAndDesc = shouldOpenNoficationModal.split(",");
    //       this.setState({
    //         isLochPaymentModal: true,
    //         payModalTitle: titleAndDesc[0],
    //         payModalDescription: titleAndDesc[1],
    //       });
    //     }, 1000);
    //   }
    // }
    this.callAllApisTwice();
    scrollToTop();
    if (
      this.props.intelligenceState &&
      this.props.intelligenceState.GraphfeeData
    ) {
      if (this.props.intelligenceState.GraphfeeData) {
        this.props.updateFeeGraph(
          this.props.intelligenceState.GraphfeeData,
          getGraphData(this.props.intelligenceState.GraphfeeData, this, true),
          this
        );
      }
    }
    if (this.props.NFTState?.nfts && this.props.NFTState?.nfts.length > 0) {
      this.props.updateWalletListFlag("nftPage", true);
      this.setState({
        localNftData: this.props.NFTState?.nfts,
        nftTableLoading: false,
      });
    }
    const passedAddress = window.localStorage.getItem("followThisAddress");
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
    if (
      this.props.intelligenceState &&
      this.props.intelligenceState.counterPartyValue
    ) {
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
      this.props.intelligenceState?.table &&
      this.props.intelligenceState?.table.length > 0
    ) {
      if (this.props.commonState.transactionHistory) {
        this.setState({
          tableLoading: false,
        });
      } else {
        this.setState({
          tableLoading: true,
        });
        this.getTableData();
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
        this.props.updateAssetProfitLoss(
          this.props.intelligenceState?.ProfitLossAssetData,
          this,
          // this.state.isPremiumUser
          this.state.isPremiumUser
        );
      } else {
        this.props.updateWalletListFlag("realizedGainsPage", true);
        this.setState({
          netFlowLoading: true,
          shouldCallProfitAndLossApi: false,
        });
        // this.props.getProfitAndLossApi(this, false, false, false);
        // netflow breakdown
        // this.props.getAssetProfitLoss(
        //   this,
        // null,
        //   null,
        //   false,
        //   false,
        //   true,
        //   this.state.isPremiumUser
        // );

        this.props.getAssetProfitLoss(
          this,
          null,
          null,
          false,
          false,
          true,
          this.state.isPremiumUser
        );
      }
    }
    this.callPriceGaugeApi();
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
    window.localStorage.setItem("stop_redirect", false);

    // reset discount modal
    window.localStorage.setItem("discountEmail", false);

    // if share link store share id to show upgrade modal
    if (this.props.match.params.id) {
      window.localStorage.setItem("share_id", this.props.match.params.id);
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
    const tempExistingExpiryTime = window.localStorage.getItem(
      "portfolioPageExpiryTime"
    );
    if (!tempExistingExpiryTime && !first) {
      this.startPageView();
    }
    const tempExpiryTime = Date.now() + 1800000;
    window.localStorage.setItem("portfolioPageExpiryTime", tempExpiryTime);
  };
  endPageView = () => {
    clearInterval(window.checkPortfolioTimer);
    window.localStorage.removeItem("portfolioPageExpiryTime");
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
    const tempExpiryTime = window.localStorage.getItem(
      "portfolioPageExpiryTime"
    );
    if (tempExpiryTime && tempExpiryTime < Date.now()) {
      this.endPageView();
    }
  };
  componentWillUnmount() {
    const tempExpiryTime = window.localStorage.getItem(
      "portfolioPageExpiryTime"
    );
    if (tempExpiryTime && !mobileCheck()) {
      this.endPageView();
    }
    // reset all sort average cost
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
          labels: this.props.intelligenceState.graphfeeValue[0].labels
            ? this.props.intelligenceState.graphfeeValue[0].labels
            : [],
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
      this.props.intelligenceState.counterPartyValue
    ) {
      const tempHolder = getCounterGraphData(
        this.props.intelligenceState.counterPartyData,
        this,
        true
      );

      this.setState({
        homeCounterpartyVolumeData: tempHolder,
        counterGraphLoading: false,
      });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.intelligenceState?.ProfitLossAsset !==
      this.props.intelligenceState?.ProfitLossAsset
    ) {
      if (
        !prevProps.intelligenceState?.ProfitLossAsset ||
        prevProps.intelligenceState?.ProfitLossAsset.length === 0
      ) {
        this.props.updateAssetProfitLoss(
          this.props.intelligenceState?.ProfitLossAssetData,
          this,
          // this.state.isPremiumUser
          this.state.isPremiumUser
        );
        setTimeout(() => {
          this.props.updateAssetProfitLoss(
            this.props.intelligenceState?.ProfitLossAssetData,
            this,
            // this.state.isPremiumUser
            this.state.isPremiumUser
          );
        }, 1000);
        setTimeout(() => {
          this.props.updateAssetProfitLoss(
            this.props.intelligenceState?.ProfitLossAssetData,
            this,
            // this.state.isPremiumUser
            this.state.isPremiumUser
          );
        }, 1500);
        setTimeout(() => {
          this.props.updateAssetProfitLoss(
            this.props.intelligenceState?.ProfitLossAssetData,
            this,
            // this.state.isPremiumUser
            this.state.isPremiumUser
          );
        }, 2000);
      }
    }
    if (prevProps.userPaymentState !== this.props.userPaymentState) {
      this.setState({
        isPremiumUser: isPremiumUser(),
      });
      this.props.updateAssetProfitLoss(
        this.props.intelligenceState?.ProfitLossAssetData,
        this,
        // this.state.isPremiumUser
        this.state.isPremiumUser
      );
    }
    if (prevState.isPremiumUser !== this.state.isPremiumUser) {
      this.props.updateAssetProfitLoss(
        this.props.intelligenceState?.ProfitLossAssetData,
        this,
        // this.state.isPremiumUser
        this.state.isPremiumUser
      );
    }
    if (
      this.props.NFTState?.nfts &&
      this.props.NFTState?.nfts !== prevProps.NFTState?.nfts
    ) {
      this.setState({
        localNftData: this.props.NFTState?.nfts,
        nftTableLoading: false,
      });
    }
    if (
      prevState.AvgCostLoading !== this.state.AvgCostLoading ||
      prevState.netFlowLoading !== this.state.netFlowLoading ||
      prevState.gasFeesGraphLoading !== this.state.gasFeesGraphLoading ||
      prevState.nftTableLoading !== this.state.nftTableLoading ||
      prevState.counterGraphLoading !== this.state.counterGraphLoading ||
      prevState.chainLoader !== this.state.chainLoader ||
      prevState.insightsBlockLoading !== this.state.insightsBlockLoading ||
      prevState.tableLoading !== this.state.tableLoading ||
      prevState.yieldOpportunitiesTableLoading !==
        this.state.yieldOpportunitiesTableLoading
    ) {
      this.checkPremium();
    }
    // Block One
    if (this.props.commonState !== prevProps.commonState) {
      if (localStorage.getItem("replacedOrAddedAddress")) {
        this.callAllApisTwice();
        localStorage.removeItem("replacedOrAddedAddress");
      }
    }
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

      if (this.state.blockOneSelectedItem === 2) {
        // if (
        //   !(this.state.defiState && this.state.defiState?.defiList) ||
        //   !this.props.commonState.defi
        // ) {
        //   this.props.updateWalletListFlag("defi", true);
        // }
        if (
          !this.props.intelligenceState.table ||
          !this.props.commonState.transactionHistory
        ) {
          this.getTableData();
        } else {
          this.setState({
            graphLoading: false,
          });
        }
      }
    }

    // Block Two
    if (prevState.blockTwoSelectedItem !== this.state.blockTwoSelectedItem) {
      // Realized gains api call
      if (this.state.blockTwoSelectedItem === 1) {
        if (
          !(
            this.props.intelligenceState?.ProfitLossAsset?.series &&
            this.props.intelligenceState?.ProfitLossAsset?.series.length > 0
          ) ||
          !this.props.commonState.realizedGainsPage
        ) {
          this.props.updateWalletListFlag("realizedGainsPage", true);
          this.setState({
            netFlowLoading: true,
            shouldCallProfitAndLossApi: false,
          });
          // this.props.getProfitAndLossApi(this, false, false, false);
          // netflow breakdown
          // this.props.getAssetProfitLoss(
          //   this,
          // null,
          //   null,
          //   false,
          //   false,
          //   true,
          //   this.state.isPremiumUser
          // );
          this.props.getAssetProfitLoss(
            this,
            null,
            null,
            false,
            false,
            true,
            this.state.isPremiumUser
          );
        } else {
          this.props.updateAssetProfitLoss(
            this.props.intelligenceState?.ProfitLossAssetData,
            this,
            // this.state.isPremiumUser
            this.state.isPremiumUser
          );
        }
      }
      // Gas fees api call
      else if (this.state.blockTwoSelectedItem === 2) {
        if (
          !(this.state.homeGraphFeesData && this.state.homeGraphFeesData[0]) ||
          !this.props.commonState.gasFeesPage
        ) {
          this.setState({
            gasFeesGraphLoading: true,
            shouldCallGraphFeesApi: false,
          });
          this.props.updateWalletListFlag("gasFeesPage", true);
          this.props.getAllFeeApi(this, false, false);
        }
      } else if (
        this.state.blockTwoSelectedItem === 3 &&
        ((this.state.localNftData && this.state.localNftData.length === 0) ||
          !this.props.commonState.nftPage)
      ) {
        this.callNFTApi();
      }
    }
    // Block Three
    if (
      prevState.blockThreeSelectedItem !== this.state.blockThreeSelectedItem
    ) {
      if (this.state.blockThreeSelectedItem === 1) {
        if (
          !(
            this.state.homeCounterpartyVolumeData &&
            this.state.homeCounterpartyVolumeData[0]
          ) ||
          !this.props.commonState.counterpartyVolumePage
        ) {
          this.setState({
            counterGraphLoading: true,
            shouldCallCounterPartyVolumeApi: false,
          });
          this.props.updateWalletListFlag("counterpartyVolumePage", true);
          this.props.getAllCounterFeeApi(this, false, false);
        } else {
          this.setState({
            counterGraphLoading: false,
          });
        }
      } else if (this.state.blockThreeSelectedItem === 2) {
        if (
          !this.state.yieldOpportunitiesList ||
          !this.props.commonState.yieldOpportunities
        ) {
          this.callYieldOppApi();
        } else {
          this.setState({
            yieldOpportunitiesTableLoading: false,
          });
        }
      }
      if (this.state.blockThreeSelectedItem === 3) {
        if (
          !this.props.portfolioState?.assetValueDay ||
          !this.props.commonState.asset_value
        ) {
          this.props.updateWalletListFlag("asset_value", true);
        }
      }
    }
    // Block Four
    if (prevState.blockFourSelectedItem !== this.state.blockFourSelectedItem) {
      if (this.state.blockFourSelectedItem === 2) {
        // if (
        //   !this.props.intelligenceState.table ||
        //   !this.props.commonState.transactionHistory
        // ) {
        //   this.getTableData();
        // } else {
        //   this.setState({
        //     graphLoading: false,
        //   });
        // }
        if (!this.state.updatedInsightList || !this.props.commonState.insight) {
          this.props.updateWalletListFlag("insight", true);
          this.setState({
            insightsBlockLoading: true,
            shouldCallInsightsApi: false,
          });
          this.props.getAllInsightsApi(this);
        }
      }

      if (this.state.blockFourSelectedItem === 3) {
        if (!this.state.updatedInsightList || !this.props.commonState.insight) {
          this.props.updateWalletListFlag("insight", true);
          this.setState({
            insightsBlockLoading: true,
            shouldCallInsightsApi: false,
          });
          this.props.getAllInsightsApi(this);
        }
      }
      if (this.state.blockFourSelectedItem === 4) {
        if (
          !this.props.intelligenceState.table ||
          !this.props.commonState.transactionHistory
        ) {
          this.getTableData();
        } else {
          this.setState({
            graphLoading: false,
          });
        }
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
      const shouldRecallApis = window.localStorage.getItem("shouldRecallApis");
      if (!shouldRecallApis || shouldRecallApis === "false") {
        this.setState({
          yieldOpportunitiesTableLoading: false,
        });
      } else {
        this.setState({
          shouldYieldOpportunitiesTableLoading: false,
        });
      }
      this.setState({
        yieldOpportunitiesList: this.props.yieldOpportunitiesState.yield_pools
          ? this.props.yieldOpportunitiesState.yield_pools
          : [],
        yieldOpportunitiesTotalCount:
          this.props.yieldOpportunitiesState.total_count,
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

        shouldCallInsightsApi: true,
        shouldCallHistoricPerformanceApi: true,
      });

      // if wallet address change
      const tempAddWall = window.localStorage.getItem("addWallet");
      if (
        tempAddWall &&
        JSON.parse(tempAddWall) &&
        JSON.parse(tempAddWall)?.length > 0
      ) {
        let getItem = window.localStorage.getItem("callTheUpdateAPI");
        if (getItem === "true") {
          this.callNetworksApi(true);
        } else {
          this.callNetworksApi();
        }
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
        this.state.blockOneSelectedItem === 2 ||
        this.state.blockFourSelectedItem === 4
      ) {
        // if (
        //   !(this.state.defiState && this.state.defiState?.defiList) ||
        //   !this.props.commonState.defi
        // ) {
        //   let UserWallet = JSON.parse(
        //     window.localStorage.getItem("addWallet")
        //   );
        //   const allAddresses = [];
        //   UserWallet?.forEach((e) => {
        //     allAddresses.push(e.address);
        //   });
        //   let data = new URLSearchParams();
        //   data.append("wallet_address", JSON.stringify(allAddresses));

        //   this.props.getProtocolBalanceApi(this, data);
        //   this.props.updateWalletListFlag("defi", true);
        // }
        if (
          !this.props.intelligenceState.table ||
          !this.props.commonState.transactionHistory
        ) {
          this.getTableData();
        } else {
          this.setState({
            graphLoading: false,
          });
        }
      }

      // BLOCK TWO
      // Realized gains api call
      if (this.state.blockTwoSelectedItem === 1) {
        if (
          !this.props.commonState.realizedGainsPage ||
          !(
            this.props.intelligenceState?.ProfitLossAsset?.series &&
            this.props.intelligenceState?.ProfitLossAsset?.series.length > 0
          )
        ) {
          this.props.updateWalletListFlag("realizedGainsPage", true);
          this.setState({
            netFlowLoading: true,
            shouldCallProfitAndLossApi: false,
          });
          // this.props.getProfitAndLossApi(this, false, false, false);
          // netflow breakdown
          // this.props.getAssetProfitLoss(
          //   this,
          //   false,
          //   false,
          //   true,
          //   this.state.isPremiumUser
          // );

          this.props.getAssetProfitLoss(
            this,
            null,
            null,
            false,
            false,
            true,
            this.state.isPremiumUser
          );
        } else {
          this.props.updateAssetProfitLoss(
            this.props.intelligenceState?.ProfitLossAssetData,
            this,
            // this.state.isPremiumUser
            this.state.isPremiumUser
          );
        }
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
      if (
        (this.state.blockTwoSelectedItem === 3 ||
          this.state.blockOneSelectedItem === 5) &&
        (!this.props.commonState.nftPage || !this.props.NFTState?.nfts)
      ) {
        this.callNFTApi();
      }

      // Counterparty volume api call
      if (this.state.blockThreeSelectedItem === 2) {
        if (
          !this.props.yieldOpportunitiesState.yield_pools ||
          !this.props.commonState.yieldOpportunities
        ) {
          this.callYieldOppApi();
        }
      }

      // BLOCK Three
      if (this.state.blockThreeSelectedItem === 1) {
        if (
          !this.props.commonState.counterpartyVolumePage ||
          !(
            this.props.intelligenceState.counterPartyValue &&
            this.props.intelligenceState.counterPartyValue[0]
          )
        ) {
          this.setState({
            counterGraphLoading: true,
            shouldCallCounterPartyVolumeApi: false,
          });
          this.props.updateWalletListFlag("counterpartyVolumePage", true);
          this.props.getAllCounterFeeApi(this, false, false);
        } else {
          this.setState({
            counterGraphLoading: false,
          });
        }
      }
      if (
        this.state.blockThreeSelectedItem === 3 &&
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
      if (this.state.blockFourSelectedItem === 1) {
        this.callPriceGaugeApi();
      }
      if (this.state.blockFourSelectedItem === 2) {
        // if (
        //   !(
        //     this.props.intelligenceState?.table &&
        //     this.props.intelligenceState?.table.length > 0
        //   ) ||
        //   !this.props.commonState.transactionHistory
        // ) {
        //   this.getTableData();
        // }
        if (
          !this.props.intelligenceState?.updatedInsightList ||
          !this.props.commonState.insight
        ) {
          this.props.updateWalletListFlag("insight", true);
          this.setState({
            insightsBlockLoading: true,
          });
          this.props.getAllInsightsApi(this);
        }
      }
      if (this.state.blockFourSelectedItem === 3) {
        if (
          !this.props.intelligenceState?.updatedInsightList ||
          !this.props.commonState.insight
        ) {
          this.props.updateWalletListFlag("insight", true);
          this.setState({
            insightsBlockLoading: true,
          });
          this.props.getAllInsightsApi(this);
        }
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
        window.localStorage.setItem(
          "addWallet",
          JSON.stringify(this.props.location.state?.addWallet)
        );
        this.setState({ userWalletList: this.props.location.state?.addWallet });
        this.apiCall();
      }
    }

    if (this.props.darkModeState?.flag !== prevProps.darkModeState?.flag) {
      this.props.updateFeeGraph(
        this.props.intelligenceState.GraphfeeData,
        getGraphData(this.props.intelligenceState.GraphfeeData, this, true),
        this
      );
      this.trimCounterpartyVolume();
      if (this.props.intelligenceState?.ProfitLossAssetData) {
        this.props.updateAssetProfitLoss(
          this.props.intelligenceState?.ProfitLossAssetData,
          this,
          // this.state.isPremiumUser
          this.state.isPremiumUser
        );
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
        window.localStorage.getItem("gotShareProtfolio")
      );
      // window.localStorage.setItem(
      //   "addWallet",
      //   JSON.stringify(this.props.location.state?.addWallet)
      // );
      if (!gotShareProtfolio) {
        deleteToken();

        const searchParams = new URLSearchParams(this.props.location.search);
        const redirectPath = searchParams.get("redirect");
        window.localStorage.setItem("gotShareProtfolio", true);

        let redirect = JSON.parse(window.localStorage.getItem("ShareRedirect"));
        if (!redirect) {
          if (redirectPath) {
            window.localStorage.setItem(
              "ShareRedirect",
              JSON.stringify({
                path: redirectPath,
                hash: this.props?.location?.hash,
              })
            );
          } else {
            window.localStorage.setItem(
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
        window.localStorage.setItem("gotShareProtfolio", false);
        // remove redirect urls
        window.localStorage.removeItem("ShareRedirect");

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
      const tempUserWalletList = window.localStorage.getItem("addWallet")
        ? JSON.parse(window.localStorage.getItem("addWallet"))
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
    const arr = window.localStorage.getItem("addWallet")
      ? JSON.parse(window.localStorage.getItem("addWallet"))
      : this.state.userWalletList;
    let address = arr?.map((wallet) => {
      return wallet.address;
    });
    let condition = [
      {
        key: SEARCH_BY_WALLET_ADDRESS_IN,
        value: address,
      },
      { key: SEARCH_BY_NOT_DUST, value: true },
    ];
    this.setState({
      walletList: JSON.parse(window.localStorage.getItem("addWallet")),
    });
    let data = new URLSearchParams();
    data.append("start", START_INDEX);
    data.append("conditions", JSON.stringify(condition));
    data.append("limit", 10);
    data.append("sorts", JSON.stringify(this.state.sort));
    this.props.updateWalletListFlag("transactionHistory", true);
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
    sort?.map((el) => {
      if (el.title === val) {
        if (val === "time") {
          obj = [
            {
              key: SORT_BY_TIMESTAMP,
              value: !el.up,
            },
          ];
          this.updateTimer();
        } else if (val === "from") {
          obj = [
            {
              key: SORT_BY_FROM_WALLET,
              value: !el.up,
            },
          ];
          this.updateTimer();
        } else if (val === "to") {
          obj = [
            {
              key: SORT_BY_TO_WALLET,
              value: !el.up,
            },
          ];
          this.updateTimer();
        } else if (val === "asset") {
          obj = [
            {
              key: SORT_BY_ASSET,
              value: !el.up,
            },
          ];
          this.updateTimer();
        } else if (val === "amount") {
          obj = [
            {
              key: SORT_BY_AMOUNT,
              value: !el.up,
            },
          ];
          this.updateTimer();
        } else if (val === "usdThen") {
          obj = [
            {
              key: SORT_BY_USD_VALUE_THEN,
              value: !el.up,
            },
          ];
          this.updateTimer();
        } else if (val === "method") {
          obj = [
            {
              key: SORT_BY_METHOD,
              value: !el.up,
            },
          ];
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
      CostSortByAsset({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
      this.updateTimer();
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
    } else if (e.title === "Portfolio perc") {
      this.sortArray("weight", isDown);
      this.setState({
        sortBy: sort,
      });
      CostSortByPortfolio({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
      this.updateTimer();
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
    if (this.state.lochToken) {
      this.props.history.push("/realized-profit-and-loss");
      ProfitLossEV({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
    }
  };
  goToGasFeesSpentPage = () => {
    if (this.state.lochToken) {
      this.props.history.push("/gas-fees");
      GasFeesEV({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
    }
  };
  goToCounterPartyVolumePage = () => {
    if (this.state.lochToken) {
      this.props.history.push("/counterparty-volume");
      VolumeTradeByCP({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
    }
  };
  goToHistoricPerformancePage = () => {
    if (this.state.lochToken) {
      this.props.history.push("/intelligence/asset-value");
      AssetValueExpandview({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
    }
  };
  goToPriceGaugePage = () => {
    if (this.state.lochToken) {
      this.props.history.push("/price-gauge");
      PriceGaugeEV({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
    }
  };
  goToTransactionHistoryPage = () => {
    if (this.state.lochToken) {
      const isPage = this.props?.intelligenceState?.currentPage;
      if (isPage) {
        this.props.history.push(
          "/intelligence/transaction-history?p=" + isPage
        );
      } else {
        this.props.history.push("/intelligence/transaction-history");
      }
      TransactionHistoryEView({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
    }
  };
  goToDefiPage = () => {
    if (this.state.lochToken && this.props.history) {
      this.props.history.push("/decentralized-finance");
      DefiBlockExpandediew({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
    }
  };
  goToYieldOppPage = () => {
    if (this.state.lochToken) {
      const isPage = this.props?.yieldOpportunitiesState?.currentPage;
      if (isPage) {
        this.props.history.push("/yield-opportunities?p=" + isPage);
      } else {
        this.props.history.push("/yield-opportunities");
      }
      YieldOppurtunitiesExpandediew({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
    }
  };
  goToNftPage = () => {
    if (this.state.lochToken) {
      this.props.history.push("/nft");
      NftExpandediew({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
    }
  };
  goToAssetsPage = () => {
    if (this.state.lochToken) {
      this.props.history.push("/assets");
      AverageCostBasisEView({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
    }
  };
  goToInsightsPage = () => {
    if (this.state.lochToken) {
      this.props.history.push("/intelligence/insights");
      InsightsEV({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
    }
  };

  showBlurredAssetItem = () => {
    if (this.state.isPremiumUser) {
      return null;
    }
    removeBlurMethods();
    removeSignUpMethods();
    window.localStorage.setItem("blurredHomeAssetSignInModal", true);
    const userDetails = JSON.parse(window.localStorage.getItem("lochUser"));
    if (userDetails && userDetails.email) {
      dontOpenLoginPopup();
      this.setState(
        {
          payModalTitle: "Profit and Loss with Loch",
          payModalDescription: "Unlimited wallets PnL",
        },
        () => {
          this.setState({
            isLochPaymentModal: true,
          });
        }
      );
    } else {
      const tempArr = ["Profit and Loss with Loch", "Unlimited wallets PnL"];
      setTimeout(() => {
        window.localStorage.setItem("openHomePaymentModal", tempArr);
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
  showBlurredFlows = () => {
    if (this.state.isPremiumUser) {
      return null;
    }
    removeBlurMethods();
    removeSignUpMethods();
    window.localStorage.setItem("blurredHomeFlowsSignInModal", true);
    const userDetails = JSON.parse(window.localStorage.getItem("lochUser"));
    if (userDetails && userDetails.email) {
      dontOpenLoginPopup();
      this.setState(
        {
          payModalTitle: "Net Flows with Loch",
          payModalDescription: "Unlimited wallets net flows",
        },
        () => {
          this.setState({
            isLochPaymentModal: true,
          });
        }
      );
    } else {
      const tempArr = ["Net Flows with Loch", "Unlimited wallets net flows"];
      removeOpenModalAfterLogin();
      setTimeout(() => {
        window.localStorage.setItem("openHomePaymentModal", tempArr);
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
  showBlurredYieldOpp = () => {
    if (this.state.isPremiumUser) {
      return null;
    }
    removeBlurMethods();
    removeSignUpMethods();
    window.localStorage.setItem("blurredHomeYieldOppSignInModal", true);
    const userDetails = JSON.parse(window.localStorage.getItem("lochUser"));
    if (userDetails && userDetails.email) {
      dontOpenLoginPopup();
      this.setState(
        {
          payModalTitle: "Access Loch's Yield Opportunities",
          payModalDescription: "Unlimited yield opportunities",
        },
        () => {
          this.setState({
            isLochPaymentModal: true,
          });
        }
      );
    } else {
      const tempArr = [
        "Access Loch's Yield Opportunities",
        "Unlimited yield opportunities",
      ];
      removeOpenModalAfterLogin();
      setTimeout(() => {
        window.localStorage.setItem("openHomePaymentModal", tempArr);
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
  showBlurredInsights = () => {
    if (this.state.isPremiumUser) {
      return null;
    }
    removeBlurMethods();
    removeSignUpMethods();
    window.localStorage.setItem("blurredHomeInsightsSignInModal", true);
    const userDetails = JSON.parse(window.localStorage.getItem("lochUser"));
    if (userDetails && userDetails.email) {
      dontOpenLoginPopup();
      this.setState(
        {
          payModalTitle: "Access Risk and Cost Reduction Insights",
          payModalDescription: "Unlimited wallets insights",
        },
        () => {
          this.setState({
            isLochPaymentModal: true,
          });
        }
      );
    } else {
      const tempArr = [
        "Access Risk and Cost Reduction Insights",
        "Unlimited wallets insights",
      ];
      removeOpenModalAfterLogin();
      setTimeout(() => {
        window.localStorage.setItem("openHomePaymentModal", tempArr);
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
  showBlurredGasFees = () => {
    if (this.state.isPremiumUser) {
      return null;
    }
    removeBlurMethods();
    removeSignUpMethods();
    window.localStorage.setItem("blurredHomeGasFeesSignInModal", true);
    const userDetails = JSON.parse(window.localStorage.getItem("lochUser"));
    if (userDetails && userDetails.email) {
      dontOpenLoginPopup();
      this.setState(
        {
          payModalTitle: "Understand Gas Fees with Loch",
          payModalDescription: "Unlimited wallets gas costs",
        },
        () => {
          this.setState({
            isLochPaymentModal: true,
          });
        }
      );
    } else {
      const tempArr = [
        "Understand Gas Fees with Loch",
        "Unlimited wallets gas costs",
      ];
      removeOpenModalAfterLogin();
      setTimeout(() => {
        window.localStorage.setItem("openHomePaymentModal", tempArr);
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
      openLochPaymentModalWithOptions: false,
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
              symbol: row.from_wallet?.wallet_metadata
                ? row.from_wallet?.wallet_metadata?.symbol
                : null,
              text: row.from_wallet?.wallet_metadata
                ? row.from_wallet?.wallet_metadata?.name
                : null,
            },
          },
          to: {
            address: row.to_wallet.address,
            // wallet_metaData: row.to_wallet.wallet_metaData,
            metaData: walletToData,
            wallet_metaData: {
              symbol: row.to_wallet?.wallet_metadata
                ? row.to_wallet?.wallet_metadata?.symbol
                : null,
              text: row.to_wallet?.wallet_metadata
                ? row.to_wallet?.wallet_metadata?.name
                : null,
            },
          },
          asset: {
            code: row.asset?.code,
            symbol: row.asset?.symbol,
          },
          amount: {
            value: parseFloat(row.asset?.value),
            id: row.asset?.id,
          },
          usdValueThen: {
            value: row.asset?.value,
            id: row.asset?.id,
            assetPrice: row.asset_price,
          },
          usdValueToday: {
            value: row.asset?.value,
            id: row.asset?.id,
          },
          usdTransactionFee: {
            value: row.transaction_fee,
            id: row.asset?.id,
          },
          // method: row.transaction_type
          method: row.method,
          hash: row.transaction_id,
          network: row.chain?.name,
        };
      });

    const columnList = [
      {
        labelName: (
          <div
            className="cp history-table-header-col table-header-font"
            id="time"
          >
            {this.state.isMobileDevice ? (
              <span
                onClick={() => {
                  this.toggleAgeTimestamp();
                }}
                className="inter-display-medium f-s-13 lh-16"
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
                  className="inter-display-medium f-s-13 lh-16"
                  style={{
                    textDecoration: "underline",
                    cursor: "pointer",
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

        coumnWidth: this.state.isShowingAge ? 0.16 : 0.225,
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
                <span className="table-data-font">{tempVal}</span>
              </CustomOverlay>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col table-header-font"
            id="from"
          >
            <span className="inter-display-medium f-s-13 lh-16">From</span>
            <Image
              onClick={() => this.handleTableSort("from")}
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
                // window.open(shareLink, "_blank", "noreferrer");
                openAddressInSameTab(slink, this.props.setPageFlagDefault);
              }
            };
            return (
              // <CustomOverlay
              //   position="top"
              //   isIcon={false}
              //   isInfo={true}
              //   isText={true}
              //   // text={rowData.from.address}
              //   text={
              //     (rowData.from.metaData?.nickname
              //       ? rowData.from.metaData?.nickname + ": "
              //       : "") +
              //     (rowData.from.wallet_metaData?.text
              //       ? rowData.from.wallet_metaData?.text + ": "
              //       : "") +
              //     (rowData.from.metaData?.displayAddress &&
              //     rowData.from.metaData?.displayAddress !== rowData.from.address
              //       ? rowData.from.metaData?.displayAddress + ": "
              //       : "") +
              //     rowData.from.address
              //   }
              // >
              <>
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
                ) : rowData.from?.wallet_metaData?.symbol ||
                  rowData.from?.wallet_metaData?.text ||
                  rowData.from?.metaData?.nickname ? (
                  rowData.from?.wallet_metaData?.symbol ? (
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
                        className="top-account-address table-data-font"
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
                        className="top-account-address table-data-font"
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
                        className="top-account-address table-data-font"
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
                      className="top-account-address table-data-font"
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
                )}
              </>
              // </CustomOverlay>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col table-header-font"
            id="to"
          >
            <span className="inter-display-medium f-s-13 lh-16">To</span>
            <Image
              onClick={() => this.handleTableSort("to")}
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
                // window.open(shareLink, "_blank", "noreferrer");
                openAddressInSameTab(slink, this.props.setPageFlagDefault);
              }
            };
            return (
              // <CustomOverlay
              //   position="top"
              //   isIcon={false}
              //   isInfo={true}
              //   isText={true}
              //   text={
              //     (rowData.to.metaData?.nickname
              //       ? rowData.to.metaData?.nickname + ": "
              //       : "") +
              //     (rowData.to.wallet_metaData?.text
              //       ? rowData.to.wallet_metaData?.text + ": "
              //       : "") +
              //     (rowData.to.metaData?.displayAddress &&
              //     rowData.to.metaData?.displayAddress !== rowData.to.address
              //       ? rowData.to.metaData?.displayAddress + ": "
              //       : "") +
              //     rowData.to.address
              //   }
              // >
              <>
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
                ) : rowData.to?.wallet_metaData?.symbol ||
                  rowData.to.wallet_metaData.text ||
                  rowData.to?.metaData?.nickname ? (
                  rowData.to?.wallet_metaData?.symbol ? (
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
                        className="top-account-address table-data-font"
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
                        className="top-account-address table-data-font"
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
                        className="top-account-address table-data-font"
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
                      className="top-account-address table-data-font"
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
                )}
                {/* </CustomOverlay> */}
              </>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col table-header-font"
            id="asset"
          >
            <span className="inter-display-medium f-s-13 lh-16">Token</span>
            <Image
              src={sortByIcon}
              onClick={() => this.handleTableSort("asset")}
              className={
                this.state.tableSortOpt[3].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "asset",

        coumnWidth: this.state.isShowingAge ? 0.135 : 0.125,
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
                text={rowData?.asset?.code ? rowData.asset.code : ""}
              >
                {rowData.asset?.symbol ? (
                  <Image src={rowData.asset.symbol} className="asset-symbol" />
                ) : rowData.asset?.code ? (
                  <div className="inter-display-medium f-s-13 lh-16 table-data-font dotDotText">
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
            className="cp history-table-header-col table-header-font"
            id="amount"
          >
            <span className="inter-display-medium f-s-13 lh-16">Amount</span>
            <Image
              onClick={() => this.handleTableSort("amount")}
              src={sortByIcon}
              className={
                this.state.tableSortOpt[4].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "amount",

        coumnWidth: this.state.isShowingAge ? 0.135 : 0.125,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (rowData === "EMPTY") {
            return null;
          }
          if (dataKey === "amount") {
            // return rowData.amount.value?.toFixed(2)
            const tempAmountVal = convertNtoNumber(rowData.amount.value);
            return (
              // <CustomOverlay
              //   position="top"
              //   isIcon={false}
              //   isInfo={true}
              //   isText={true}
              //   text={tempAmountVal ? tempAmountVal : "0.00"}
              // >
              <div className="inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div">
                {numToCurrency(tempAmountVal).toLocaleString("en-US")}
              </div>
              // </CustomOverlay>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col table-header-font"
            id="usdValueThen"
          >
            <span className="inter-display-medium f-s-13 lh-16">{`${CurrencyType(
              true
            )} amount (then)`}</span>
            <Image
              onClick={() => this.handleTableSort("usdThen")}
              src={sortByIcon}
              className={
                this.state.tableSortOpt[5].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "usdValueThen",

        className: "usd-value",
        coumnWidth: this.state.isShowingAge ? 0.235 : 0.225,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (rowData === "EMPTY") {
            return null;
          }
          if (dataKey === "usdValueThen") {
            let chain = Object.entries(
              this.props.intelligenceState?.assetPriceList
            );
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
                {/* <CustomOverlay
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
                > */}
                <div className="inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div">
                  {CurrencyType(false) +
                    numToCurrency(tempValueToday).toLocaleString("en-US")}
                </div>
                {/* </CustomOverlay> */}
                <span style={{ padding: "2px" }}></span>(
                {/* <CustomOverlay
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
                > */}
                <div className="inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div">
                  {tempValueThen
                    ? CurrencyType(false) +
                      numToCurrency(tempValueThen).toLocaleString("en-US")
                    : CurrencyType(false) + "0.00"}
                </div>
                {/* </CustomOverlay> */})
              </div>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col table-header-font"
            id="method"
          >
            <span className="inter-display-medium f-s-13 lh-16">Method</span>
            <Image
              onClick={() => this.handleTableSort("method")}
              src={sortByIcon}
              className={
                this.state.tableSortOpt[8].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "method",

        coumnWidth: this.state.isShowingAge ? 0.16 : 0.15,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (rowData === "EMPTY") {
            return null;
          }
          if (dataKey === "method") {
            return (
              <div className="gainLossContainer">
                {rowData.method &&
                (rowData.method.toLowerCase() === "send" ||
                  rowData.method.toLowerCase() === "receive") ? (
                  <div
                    className={`gainLoss ${
                      rowData.method.toLowerCase() === "send" ? "loss" : "gain"
                    }`}
                  >
                    <span className="text-capitalize inter-display-medium f-s-13 lh-16 grey-313">
                      {rowData.method}
                    </span>
                  </div>
                ) : (
                  <div className="text-capitalize inter-display-medium f-s-13 lh-16 black-191 history-table-method transfer ellipsis-div">
                    {rowData.method}
                  </div>
                )}
              </div>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col  table-header-font"
            id="network"
          >
            <span className="inter-display-medium f-s-13 lh-16">Network</span>
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
        coumnWidth: this.state.isShowingAge ? 0.16 : 0.15,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (rowData === "EMPTY") {
            return null;
          }
          if (dataKey === "network") {
            return (
              <div style={{ display: "flex", justifyContent: "center" }}>
                {/* <CustomOverlay
                  position="top"
                  isIcon={false}
                  isInfo={true}
                  isText={true}
                  text={rowData.network}
                > */}
                <div className="inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div dotDotText">
                  {rowData.network}
                </div>
                {/* </CustomOverlay> */}
              </div>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col table-header-font"
            id="hash"
            // onClick={() => this.handleTableSort("hash")}
          >
            <span className="inter-display-medium f-s-13 lh-16">Hash</span>
            {/* <Image
              src={sortByIcon}
              className={
                this.state.tableSortOpt.find(s=>s.title=='hash').up ? "rotateDown" : "rotateUp"
              }
            /> */}
          </div>
        ),
        dataKey: "hash",

        coumnWidth: this.state.isShowingAge ? 0.135 : 0.125,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (rowData === "EMPTY") {
            return null;
          }
          if (dataKey === "hash") {
            // return rowData.hash.value?.toFixed(2)
            const tempHashVal = TruncateText(rowData.hash);
            return (
              // <CustomOverlay
              //   position="top"
              //   isIcon={false}
              //   isInfo={true}
              //   isText={true}
              //   text={rowData.hash ? rowData.hash : ""}
              // >
              <div
                onMouseEnter={() => {
                  TransactionHistoryHashHover({
                    session_id: getCurrentUser().id,
                    email_address: getCurrentUser().email,
                    hash_hovered: rowData.hash,
                  });
                  this.updateTimer();
                }}
                className="inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div"
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
              // </CustomOverlay>
            );
          }
        },
      },
    ];

    // Cost basis
    let tableDataCostBasis = this.props.intelligenceState?.Average_cost_basis
      ? this.props.intelligenceState.Average_cost_basis.filter(
          (e) => e.CurrentValue >= 1
        )
      : [];
    if (tableDataCostBasis.length < 6) {
      const tempTableDataCostBasis = [...tableDataCostBasis];
      // for (let i = tableDataCostBasis.length; i < 6; i++) {
      //   tempTableDataCostBasis.push("EMPTY");
      // }
      tableDataCostBasis = tempTableDataCostBasis;
    }
    if (tableData.length < 6) {
      const temptableData = [...tableData];
      // for (let i = tableData.length; i < 6; i++) {
      //   temptableData.push("EMPTY");
      // }
      tableData = temptableData;
    }

    let yieldOpportunitiesListTemp = this.state.yieldOpportunitiesList;
    if (yieldOpportunitiesListTemp.length < 6) {
      const tempyieldOpportunitiesListTemp = [...yieldOpportunitiesListTemp];
      // for (let i = yieldOpportunitiesListTemp.length; i < 6; i++) {
      //   tempyieldOpportunitiesListTemp.push("EMPTY");
      // }
      yieldOpportunitiesListTemp = tempyieldOpportunitiesListTemp;
    }

    const YieldOppColumnData = [
      {
        labelName: (
          <div
            className="cp history-table-header-col  table-header-font"
            id="asset"
          >
            <span className="inter-display-medium f-s-13 lh-16">Token</span>
            <Image
              onClick={() => this.handleYieldOppTableSort("asset")}
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
        coumnWidth: 0.16,
        isCell: true,
        cell: (rowData, dataKey, rowIndex) => {
          if (rowData === "EMPTY") {
            return null;
          }
          if (dataKey === "asset") {
            // if (this.state.isPremiumUser || rowIndex === 0) {
            if (this.state.isPremiumUser || rowIndex === 0) {
              return (
                <CoinChip
                  hideNameWithouthImage
                  coin_img_src={rowData?.asset?.symbol}
                  coin_code={rowData?.asset?.code}
                  chain={rowData?.chain}
                />
              );
            }
            return (
              <CustomOverlayUgradeToPremium
                position="top"
                // disabled={this.state.isPremiumUser}
                disabled={this.state.isPremiumUser}
              >
                <div
                  className={`blurred-elements`}
                  onClick={this.showBlurredYieldOpp}
                >
                  <CoinChip
                    hideNameWithouthImage
                    coin_img_src={rowData?.asset?.symbol}
                    coin_code={rowData?.asset?.code}
                    chain={rowData?.chain}
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
            id="project"
          >
            <span className="inter-display-medium f-s-13 lh-16">Project</span>
            <Image
              onClick={() => this.handleYieldOppTableSort("project")}
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
        coumnWidth: 0.16,
        isCell: true,
        cell: (rowData, dataKey, rowIndex) => {
          if (rowData === "EMPTY") {
            return null;
          }
          if (dataKey === "project") {
            // if (this.state.isPremiumUser || rowIndex === 0) {
            if (this.state.isPremiumUser || rowIndex === 0) {
              return (
                <div className="inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div">
                  {rowData.project ? rowData.project : "-"}
                </div>
              );
            }
            return (
              <CustomOverlayUgradeToPremium
                position="top"
                // disabled={this.state.isPremiumUser}
                disabled={this.state.isPremiumUser}
              >
                <div
                  className="inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div blurred-elements"
                  onClick={this.showBlurredYieldOpp}
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
            className="cp history-table-header-col table-header-font"
            id="tvl"
          >
            <span className="inter-display-medium f-s-13 lh-16">TVL</span>
            <Image
              onClick={() => this.handleYieldOppTableSort("tvl")}
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
        coumnWidth: 0.16,
        isCell: true,
        cell: (rowData, dataKey, rowIndex) => {
          if (rowData === "EMPTY") {
            return null;
          }
          if (dataKey === "tvl") {
            // if (this.state.isPremiumUser || rowIndex === 0) {
            if (this.state.isPremiumUser || rowIndex === 0) {
              return (
                <div className="cost-common-container">
                  <div className="cost-common">
                    <span className="inter-display-medium f-s-13 lh-16 table-data-font">
                      {CurrencyType(false) +
                        numToCurrency(
                          rowData.tvlUsd * this.state.currency?.rate
                        )}
                    </span>
                  </div>
                </div>
              );
            }
            return (
              <CustomOverlayUgradeToPremium
                position="top"
                // disabled={this.state.isPremiumUser}
                disabled={this.state.isPremiumUser}
              >
                <div
                  onClick={this.showBlurredYieldOpp}
                  className="cost-common-container blurred-elements"
                >
                  <div className="cost-common">
                    <span className="inter-display-medium f-s-13 lh-16 table-data-font">
                      {CurrencyType(false) +
                        numToCurrency(
                          rowData.tvlUsd * this.state.currency?.rate
                        )}
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
              onClick={() => this.handleYieldOppTableSort("apy")}
              src={sortByIcon}
              className={
                this.state.yieldOppTableSortOpt[6].up
                  ? "rotateDown"
                  : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "apy",
        className: "usd-value",
        coumnWidth: 0.16,
        isCell: true,
        cell: (rowData, dataKey, rowIndex) => {
          if (rowData === "EMPTY") {
            return null;
          }
          if (dataKey === "apy") {
            // if (this.state.isPremiumUser || rowIndex === 0) {
            if (this.state.isPremiumUser || rowIndex === 0) {
              return (
                <div className="inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div">
                  {rowData.apy
                    ? Number(noExponents(rowData.apy)).toLocaleString("en-US") +
                      "%"
                    : "-"}
                </div>
              );
            }
            return (
              <CustomOverlayUgradeToPremium
                position="top"
                // disabled={this.state.isPremiumUser}
                disabled={this.state.isPremiumUser}
              >
                <div
                  onClick={this.showBlurredYieldOpp}
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
      {
        labelName: (
          <div
            className="cp history-table-header-col  table-header-font"
            id="usdValue"
          >
            <span className="inter-display-medium f-s-13 lh-16">Value</span>
            <Image
              onClick={() => this.handleYieldOppTableSort("usdValue")}
              src={sortByIcon}
              className={
                this.state.yieldOppTableSortOpt[2].up
                  ? "rotateDown"
                  : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "usdValue",
        coumnWidth: 0.16,
        isCell: true,
        cell: (rowData, dataKey, rowIndex) => {
          if (rowData === "EMPTY") {
            return null;
          }
          if (dataKey === "usdValue") {
            // if (this.state.isPremiumUser || rowIndex === 0) {
            if (this.state.isPremiumUser || rowIndex === 0) {
              return (
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
              );
            }
            return (
              <CustomOverlayUgradeToPremium
                position="top"
                // disabled={this.state.isPremiumUser}
                disabled={this.state.isPremiumUser}
              >
                <div
                  onClick={this.showBlurredYieldOpp}
                  className="cost-common-container blurred-elements"
                >
                  <div className="cost-common">
                    <span className="inter-display-medium f-s-13 lh-16 table-data-font">
                      {CurrencyType(false) +
                        numToCurrency(
                          rowData.value * this.state.currency?.rate
                        )}
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
            id="pool"
          >
            <span className="inter-display-medium f-s-13 lh-16">Pool</span>
            <Image
              onClick={() => this.handleYieldOppTableSort("pool")}
              src={sortByIcon}
              className={
                this.state.yieldOppTableSortOpt[4].up
                  ? "rotateDown"
                  : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "pool",
        coumnWidth: 0.16,
        isCell: true,
        cell: (rowData, dataKey, rowIndex) => {
          if (rowData === "EMPTY") {
            return null;
          }
          if (dataKey === "pool") {
            // if (this.state.isPremiumUser || rowIndex === 0) {
            if (this.state.isPremiumUser || rowIndex === 0) {
              return (
                <div className="inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div">
                  {rowData.pool ? rowData.pool : "-"}
                </div>
              );
            }
            return (
              <CustomOverlayUgradeToPremium
                position="top"
                // disabled={this.state.isPremiumUser}
                disabled={this.state.isPremiumUser}
              >
                <div
                  onClick={this.showBlurredYieldOpp}
                  className="inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div blurred-elements"
                >
                  {rowData.pool ? rowData.pool : "-"}
                </div>
              </CustomOverlayUgradeToPremium>
            );
          }
        },
      },
    ];
    const CostBasisColumnData = [
      {
        labelName: (
          <div
            className="cp history-table-header-col table-header-font"
            id="Asset"
          >
            <span className="inter-display-medium f-s-13 lh-16">Token</span>
            <Image
              onClick={() => this.handleSort(this.state.sortBy[0])}
              src={sortByIcon}
              className={!this.state.sortBy[0].down ? "rotateDown" : "rotateUp"}
            />
          </div>
        ),
        dataKey: "Asset",

        coumnWidth: 0.11,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (rowData === "EMPTY") {
            return null;
          }
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
                  text={
                    (rowData.AssetCode ? rowData.AssetCode : "") +
                    " [" +
                    rowData?.chain?.name +
                    "]"
                  }
                >
                  <div>
                    <CoinChip
                      coin_img_src={rowData.Asset}
                      coin_code={rowData.AssetCode}
                      chain={rowData?.chain}
                      hideText={true}
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
            className="cp history-table-header-col table-header-font"
            id="Current Value"
          >
            <span className="inter-display-medium f-s-13 lh-16">
              Current value
            </span>
            <Image
              onClick={() => this.handleSort(this.state.sortBy[5])}
              src={sortByIcon}
              className={!this.state.sortBy[5].down ? "rotateDown" : "rotateUp"}
            />
          </div>
        ),
        dataKey: "CurrentValue",

        coumnWidth: 0.11,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (rowData === "EMPTY") {
            return null;
          }
          if (dataKey === "CurrentValue") {
            return (
              <div className="cost-common-container">
                {/* <CustomOverlay
                  position="top"
                  isIcon={false}
                  isInfo={true}
                  isText={true}
                  text={
                    rowData.CurrentValue
                      ? CurrencyType(false) +
                        amountFormat(rowData.CurrentValue, "en-US", "USD")
                      : CurrencyType(false) + "0.00"
                  }
                > */}
                <div className="cost-common">
                  <span
                    onMouseEnter={() => {
                      CostCurrentValueHover({
                        session_id: getCurrentUser().id,
                        email_address: getCurrentUser().email,
                      });
                    }}
                    className=""
                  >
                    {rowData.CurrentValue
                      ? CurrencyType(false) +
                        numToCurrency(
                          rowData.CurrentValue.toFixed(2)
                        ).toLocaleString("en-US")
                      : CurrencyType(false) + "0.00"}
                  </span>
                </div>
                {/* </CustomOverlay> */}
              </div>
            );
          }
        },
      },

      {
        labelName: (
          <div
            className="cp history-table-header-col table-header-font"
            id="Portfolio perc"
          >
            <span className="inter-display-medium f-s-13 lh-16">
              Portfolio (%)
            </span>
            <Image
              onClick={() => this.handleSort(this.state.sortBy[8])}
              src={sortByIcon}
              className={!this.state.sortBy[8].down ? "rotateDown" : "rotateUp"}
            />
          </div>
        ),
        dataKey: "PortfolioPercentage",

        coumnWidth: 0.11,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (rowData === "EMPTY") {
            return null;
          }
          if (dataKey === "PortfolioPercentage") {
            const tempDataHolder = Number(
              noExponents(rowData.weight?.toFixed(2))
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
                {/* <CustomOverlay
                  position="top"
                  isIcon={false}
                  isInfo={true}
                  isText={true}
                  text={
                    tempDataHolder
                      ? Math.abs(tempDataHolder).toLocaleString("en-US") + "%"
                      : "0.00%"
                  }
                  colorCode="#000"
                > */}
                <div className={`gainLoss`}>
                  <span className="inter-display-medium f-s-13 lh-16 table-data-font">
                    {tempDataHolder
                      ? Math.abs(tempDataHolder).toLocaleString("en-US") + "%"
                      : "0.00%"}
                  </span>
                </div>
                {/* </CustomOverlay> */}
              </div>
            );
          }
        },
      },

      {
        labelName: (
          <div
            className="cp history-table-header-col  table-header-font"
            id="Current Price"
          >
            <span className="inter-display-medium f-s-13 lh-16">
              Current price
            </span>
            <Image
              onClick={() => this.handleSort(this.state.sortBy[2])}
              src={sortByIcon}
              className={!this.state.sortBy[2].down ? "rotateDown" : "rotateUp"}
            />
          </div>
        ),
        dataKey: "CurrentPrice",

        coumnWidth: 0.11,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (rowData === "EMPTY") {
            return null;
          }
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
                {/* <CustomOverlay
                  position="top"
                  isIcon={false}
                  isInfo={true}
                  isText={true}
                  text={
                    rowData.CurrentPrice
                      ? CurrencyType(false) +
                        convertNtoNumber(rowData.CurrentPrice)
                      : CurrencyType(false) + "0.00"
                  }
                > */}
                <span className="inter-display-medium f-s-13 lh-16 table-data-font">
                  {rowData.CurrentPrice
                    ? CurrencyType(false) +
                      numToCurrency(
                        rowData.CurrentPrice.toFixed(2)
                      ).toLocaleString("en-US")
                    : CurrencyType(false) + "0.00"}
                </span>
                {/* </CustomOverlay> */}
              </div>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col table-header-font"
            id="Amount"
          >
            <span className="inter-display-medium f-s-13 lh-16">Amount</span>
            <Image
              onClick={() => this.handleSort(this.state.sortBy[3])}
              src={sortByIcon}
              className={!this.state.sortBy[3].down ? "rotateDown" : "rotateUp"}
            />
          </div>
        ),
        dataKey: "Amount",

        coumnWidth: 0.11,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (rowData === "EMPTY") {
            return null;
          }
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
                {/* <CustomOverlay
                  position="top"
                  isIcon={false}
                  isInfo={true}
                  isText={true}
                  text={
                    rowData.Amount && rowData.Amount !== 0
                      ? convertNtoNumber(rowData.Amount)
                      : "0"
                  }
                > */}
                <span className="table-data-font">
                  {rowData.Amount
                    ? numToCurrency(rowData.Amount).toLocaleString("en-US")
                    : "0"}
                </span>
                {/* </CustomOverlay> */}
              </span>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col  table-header-font"
            id="Average Cost Price"
          >
            <span className="inter-display-medium f-s-13 lh-16">
              Avg cost price
            </span>
            {this.state.isPremiumUser ? (
              <Image
                onClick={() => this.handleSort(this.state.sortBy[1])}
                src={sortByIcon}
                className={
                  !this.state.sortBy[1].down ? "rotateDown" : "rotateUp"
                }
              />
            ) : null}
          </div>
        ),
        dataKey: "AverageCostPrice",

        coumnWidth: 0.11,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (rowData === "EMPTY") {
            return null;
          }
          if (dataKey === "AverageCostPrice") {
            return (
              <div
                onMouseEnter={() => {
                  CostAverageCostPriceHover({
                    session_id: getCurrentUser().id,
                    email_address: getCurrentUser().email,
                  });
                }}
                className={`${
                  this.state.isPremiumUser ? "" : "blurred-elements"
                }`}
                onClick={this.showBlurredAssetItem}
              >
                <CustomOverlayUgradeToPremium
                  position="top"
                  disabled={this.state.isPremiumUser}
                >
                  <span className="inter-display-medium f-s-13 lh-16 table-data-font">
                    {rowData.AverageCostPrice
                      ? CurrencyType(false) +
                        numToCurrency(
                          rowData.AverageCostPrice.toFixed(2)
                        ).toLocaleString("en-US")
                      : CurrencyType(false) + "0.00"}
                  </span>
                </CustomOverlayUgradeToPremium>
              </div>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col  table-header-font"
            id="Cost Basis"
          >
            <span className="inter-display-medium f-s-13 lh-16">
              Cost basis
            </span>
            {this.state.isPremiumUser ? (
              <Image
                onClick={() => this.handleSort(this.state.sortBy[4])}
                src={sortByIcon}
                className={
                  !this.state.sortBy[4].down ? "rotateDown" : "rotateUp"
                }
              />
            ) : null}
          </div>
        ),
        dataKey: "CostBasis",

        coumnWidth: 0.11,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (rowData === "EMPTY") {
            return null;
          }
          if (dataKey === "CostBasis") {
            return (
              <div
                className={`cost-common-container ${
                  this.state.isPremiumUser ? "" : "blurred-elements"
                }`}
                onClick={this.showBlurredAssetItem}
              >
                <CustomOverlayUgradeToPremium
                  position="top"
                  disabled={this.state.isPremiumUser}
                >
                  <div className="cost-common">
                    <span
                      onMouseEnter={() => {
                        CostCostBasisHover({
                          session_id: getCurrentUser().id,
                          email_address: getCurrentUser().email,
                        });
                      }}
                      className="table-data-font"
                    >
                      {rowData.CostBasis
                        ? CurrencyType(false) +
                          numToCurrency(
                            rowData.CostBasis.toFixed(2)
                          ).toLocaleString("en-US")
                        : CurrencyType(false) + "0.00"}
                    </span>
                  </div>
                </CustomOverlayUgradeToPremium>
              </div>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col table-header-font"
            id="Gainamount"
          >
            <span className="inter-display-medium f-s-13 lh-16">
              Unrealized gain
            </span>
            {this.state.isPremiumUser ? (
              <Image
                onClick={() => this.handleSort(this.state.sortBy[6])}
                src={sortByIcon}
                className={
                  !this.state.sortBy[6].down ? "rotateDown" : "rotateUp"
                }
              />
            ) : null}
          </div>
        ),
        dataKey: "GainAmount",

        coumnWidth: 0.11,
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
                onClick={this.showBlurredAssetItem}
                className={`gainLossContainer ${
                  this.state.isPremiumUser ? "" : "blurred-elements"
                }`}
              >
                <CustomOverlayUgradeToPremium
                  position="top"
                  disabled={this.state.isPremiumUser}
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
                    <span className="inter-display-medium f-s-13 lh-16 table-data-font">
                      {rowData.GainAmount
                        ? CurrencyType(false) +
                          tempDataHolder.toLocaleString("en-US")
                        : CurrencyType(false) + "0.00"}
                    </span>
                  </div>
                </CustomOverlayUgradeToPremium>
              </div>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col table-header-font"
            id="Gain loss"
          >
            <span className="inter-display-medium f-s-13 lh-16">Return</span>
            {this.state.isPremiumUser ? (
              <Image
                onClick={() => this.handleSort(this.state.sortBy[7])}
                src={sortByIcon}
                className={
                  !this.state.sortBy[7].down ? "rotateDown" : "rotateUp"
                }
              />
            ) : null}
          </div>
        ),
        dataKey: "GainLoss",

        coumnWidth: 0.11,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (rowData === "EMPTY") {
            return null;
          }
          if (dataKey === "GainLoss") {
            const tempDataHolder = Number(
              noExponents(rowData.GainLoss?.toFixed(2))
            );
            return (
              <div
                onMouseEnter={() => {
                  CostGainLossHover({
                    session_id: getCurrentUser().id,
                    email_address: getCurrentUser().email,
                  });
                }}
                className={`gainLossContainer ${
                  this.state.isPremiumUser ? "" : "blurred-elements"
                }`}
                onClick={this.showBlurredAssetItem}
              >
                <CustomOverlayUgradeToPremium
                  position="top"
                  disabled={this.state.isPremiumUser}
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
                    <span className="inter-display-medium f-s-13 lh-16 table-data-font">
                      {tempDataHolder
                        ? Math.abs(tempDataHolder).toLocaleString("en-US") + "%"
                        : "0.00%"}
                    </span>
                  </div>
                </CustomOverlayUgradeToPremium>
              </div>
            );
          }
        },
      },
    ];
    const NFTColumnData = [
      {
        labelName: (
          <div className="history-table-header-col no-hover" id="time">
            <span className="inter-display-medium f-s-13 lh-16 ">Holdings</span>
            {/* <Image
              onClick={() =>
                this.handleTableSort(this.state.tableSortOpt[0].title)
              }
              src={sortByIcon}
              className={
                this.state.tableSortOpt[0].up ? "rotateDown" : "rotateUp"
              }
            /> */}
          </div>
        ),
        dataKey: "holding",

        coumnWidth: 0.33,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "holding") {
            return (
              <div className="inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div">
                {rowData.holding}
              </div>
            );
          }
        },
      },
      {
        labelName: (
          <div className="history-table-header-col no-hover" id="time">
            <span className="inter-display-medium f-s-13 lh-16 ">
              Collection
            </span>

            {/* <Image
              src={sortByIcon}
              className={
                this.state.tableSortOpt[1].up ? "rotateDown" : "rotateUp"
              }
            /> */}
          </div>
        ),
        dataKey: "collection",

        coumnWidth: 0.33,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "collection") {
            return (
              <div
                className="inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div nowrap-div"
                style={{
                  lineHeight: "120%",
                }}
              >
                {rowData.collection}
              </div>
            );
          }
        },
      },
      {
        labelName: (
          <div className="history-table-header-col no-hover" id="time">
            <span className="inter-display-medium f-s-13 lh-16 ">Image</span>
          </div>
        ),
        dataKey: "imgs",

        coumnWidth: 0.33,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "imgs") {
            return (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  justifyContent: "center",
                }}
              >
                {rowData.imgs && rowData.imgs.length > 0
                  ? rowData.imgs?.slice(0, 4).map((item, index) => {
                      if (item) {
                        return (
                          <HandleBrokenImages
                            src={item}
                            key={index}
                            className="nftImageIcon"
                            imageOnError={DefaultNftTableIconIcon}
                          />
                        );
                      }
                      return null;
                    })
                  : null}
                {rowData.imgs && rowData.imgs.length > 4 ? (
                  <span
                    style={{
                      fontSize: "12px",
                      lineHeight: "120%",
                      color: "#96979A",
                      fontWeight: "500",
                    }}
                    className="table-data-font"
                  >
                    {rowData.imgs.length - 4}+
                  </span>
                ) : null}
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
        <MobileLayout
          showTopSearchBar
          handleShare={this.handleShare}
          isSidebarClosed={this.props.isSidebarClosed}
          history={this.props.history}
          yesterdayBalance={this.props.portfolioState.yesterdayBalance}
          showUpdatesJustNowBtn
        >
          {this.state.isLochPaymentModal ? (
            <PaywallModal
              isMobile
              openWithOptions={this.state.openLochPaymentModalWithOptions}
              show={this.state.isLochPaymentModal}
              onHide={this.hidePaymentModal}
              redirectLink={BASE_URL_S3 + "/"}
              title={this.state.payModalTitle}
              description={this.state.payModalDescription}
              hideBackBtn
            />
          ) : null}
          <PortfolioMobile
            payModalTitle={this.state.payModalTitle}
            payModalDescription={this.state.payModalDescription}
            isLochPaymentModal={this.state.isLochPaymentModal}
            hidePaymentModal={this.hidePaymentModal}
            showBlurredFlows={this.showBlurredFlows}
            showBlurredInsights={this.showBlurredInsights}
            showBlurredGasFees={this.showBlurredGasFees}
            // isPremiumUser={this.state.isPremiumUser}
            isPremiumUser={this.state.isPremiumUser}
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
            location={this.props.location}
            apiResponse={(e) => this.CheckApiResponse(e)}
            CostBasisColumnData={CostBasisColumnData}
            yieldOpportunitiesListTemp={yieldOpportunitiesListTemp}
            YieldOppColumnData={YieldOppColumnData}
            columnList={columnList}
            totalCount={totalCount}
            NFTColumnData={NFTColumnData}
            NFTData={this.state.localNftData}
            nftTableLoading={this.state.nftTableLoading}
            tableData={tableData}
            //States
            yieldOpportunitiesTableLoading={
              this.state.yieldOpportunitiesTableLoading
            }
            lochToken={this.state.lochToken}
            callChildPriceGaugeApi={this.state.callChildPriceGaugeApi}
            yieldOpportunitiesTotalCount={
              this.state.yieldOpportunitiesTotalCount
            }
            gasFeesGraphLoading={this.state.gasFeesGraphLoading}
            counterGraphLoading={this.state.counterGraphLoading}
            homeGraphFeesData={this.state.homeGraphFeesData}
            homeCounterpartyVolumeData={this.state.homeCounterpartyVolumeData}
            GraphDigit={this.state.GraphDigit}
            counterGraphDigit={this.state.counterGraphDigit}
            updatedInsightList={this.state.updatedInsightList}
            insightsBlockLoading={this.state.insightsBlockLoading}
            blockTwoSelectedItem={this.state.blockTwoSelectedItem}
            blockFourSelectedItem={this.state.blockFourSelectedItem}
            blockOneSelectedItem={this.state.blockOneSelectedItem}
            blockThreeSelectedItem={this.state.blockThreeSelectedItem}
            netFlowLoading={this.state.netFlowLoading}
            AvgCostLoading={this.state.AvgCostLoading}
            tableLoading={this.state.tableLoading}
            //Changes states
            changeBlockFourItem={this.changeBlockFourItem}
            changeBlockOneItem={this.changeBlockOneItem}
            changeBlockTwoItem={this.changeBlockTwoItem}
            changeBlockThreeItem={this.changeBlockThreeItem}
            //Go to pages
            goToGasFeesSpentPage={this.goToGasFeesSpentPage}
            goToNftPage={this.goToNftPage}
            goToCounterPartyVolumePage={this.goToCounterPartyVolumePage}
            goToYieldOppPage={this.goToYieldOppPage}
            goToAssetsPage={this.goToAssetsPage}
            goToTransactionHistoryPage={this.goToTransactionHistoryPage}
            goToRealizedGainsPage={this.goToRealizedGainsPage}
            openDefiPage={this.goToDefiPage}
            goToPriceGaugePage={this.goToPriceGaugePage}
            goToInsightsPage={this.goToInsightsPage}
          />
        </MobileLayout>
      );
    }
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
                  history={this.props.history}
                  showTopSearchBar
                  openConnectWallet={this.props.openConnectWallet}
                  connectedWalletAddress={this.props.connectedWalletAddress}
                  connectedWalletevents={this.props.connectedWalletevents}
                  disconnectWallet={this.props.disconnectWallet}
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

              <TopWalletAddressList
                history={this.props.history}
                apiResponse={(e) => this.CheckApiResponse(e)}
                handleShare={this.handleShare}
                passedFollowSigninModal={this.state.followSigninModal}
                showUpdatesJustNowBtn
                getCurrentTimeUpdater={this.state.getCurrentTimeUpdater}
              />
              <div className="m-b-22 graph-table-section">
                <Row>
                  <Col md={6}>
                    <div
                      className="m-r-16 section-table"
                      style={{
                        height: "41rem",
                        display: "flex",
                        flexDirection: "column",
                        minHeight: "41rem",
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
                              if (this.state.blockOneSelectedItem === 1)
                                this.goToAssetsPage();
                              else this.changeBlockOneItem(1);
                            }}
                          >
                            Tokens
                            <CustomOverlay
                              position="top"
                              isIcon={false}
                              isInfo={true}
                              isText={true}
                              className={"fix-width"}
                              text={
                                "Understand your unrealized profit and loss per token"
                              }
                            >
                              {/* <div className="info-icon-i">
                                  i
                                </div> */}
                              <Image
                                src={InfoIconI}
                                className="infoIcon info-icon-home"
                                style={{
                                  cursor: "pointer",
                                  height: "13px",
                                }}
                              />
                            </CustomOverlay>
                            <Image
                              className="homeTabArrowIcon"
                              src={HomeTabArrowIcon}
                            />
                          </div>
                          {/* <div
                            className={`inter-display-medium section-table-toggle-element ml-1 mr-1 ${
                              this.state.blockOneSelectedItem === 2
                                ? "section-table-toggle-element-selected"
                                : ""
                            }`}
                            onClick={() => {
                              if (this.state.blockOneSelectedItem === 2)
                                this.goToDefiPage();
                              else this.changeBlockOneItem(2);
                            }}
                          >
                            DeFi
                            <CustomOverlay
                              position="top"
                              isIcon={false}
                              isInfo={true}
                              isText={true}
                              className={"fix-width"}
                              text={
                                "Decipher all your DeFi positions from one place"
                              }
                            >
                              <Image
                                src={InfoIconI}
                                className="infoIcon info-icon-home"
                                style={{
                                  cursor: "pointer",
                                  height: "13px",
                                }}
                              />
                            </CustomOverlay>
                            <Image
                              className="homeTabArrowIcon"
                              src={HomeTabArrowIcon}
                            />
                          </div> */}
                          <div
                            className={`inter-display-medium section-table-toggle-element ml-1 mr-1 ${
                              this.state.blockOneSelectedItem === 2
                                ? "section-table-toggle-element-selected"
                                : ""
                            }`}
                            onClick={() => {
                              if (this.state.blockOneSelectedItem === 2)
                                this.goToTransactionHistoryPage();
                              else this.changeBlockOneItem(2);
                            }}
                          >
                            Transactions
                            <CustomOverlay
                              position="top"
                              isIcon={false}
                              isInfo={true}
                              isText={true}
                              className={"fix-width"}
                              text={
                                "Sort, filter, and dissect all your transactions from one place"
                              }
                            >
                              {/* <div className="info-icon-i">
                                  i
                                </div> */}
                              <Image
                                src={InfoIconI}
                                className="infoIcon info-icon-home"
                                style={{
                                  cursor: "pointer",
                                  height: "13px",
                                }}
                              />
                            </CustomOverlay>
                            <Image
                              className="homeTabArrowIcon"
                              src={HomeTabArrowIcon}
                            />
                          </div>
                        </div>
                      </div>
                      {this.state.blockOneSelectedItem === 1 ? (
                        <div>
                          <div
                            className={`newHomeTableContainer freezeTheFirstColumn ${
                              this.state.AvgCostLoading ||
                              tableDataCostBasis?.length < 1
                                ? ""
                                : "tableWatermarkOverlay"
                            } ${
                              !this.state.AvgCostLoading
                                ? "newHomeTableContainerLoading"
                                : ""
                            }`}
                          >
                            <TransactionTable
                              noSubtitleBottomPadding
                              message="No tokens found"
                              disableOnLoading
                              isMiniversion
                              xAxisScrollable={
                                !this.state.AvgCostLoading &&
                                tableDataCostBasis?.length > 0
                              }
                              xAxisScrollableColumnWidth={4.4}
                              tableData={
                                tableDataCostBasis
                                  ? tableDataCostBasis.slice(0, 10)
                                  : []
                              }
                              columnList={CostBasisColumnData}
                              headerHeight={60}
                              isArrow={true}
                              isLoading={this.state.AvgCostLoading}
                              isAnalytics="average cost basis"
                              // addWatermark
                              fakeWatermark
                              yAxisScrollable={!this.state.AvgCostLoading}
                            />
                          </div>
                          {!this.state.AvgCostLoading ? (
                            <div className="inter-display-medium bottomExtraInfo">
                              <div
                                onClick={this.goToAssetsPage}
                                className="bottomExtraInfoText"
                              >
                                {this.props.intelligenceState
                                  ?.Average_cost_basis
                                  ? this.props.intelligenceState
                                      .Average_cost_basis.length > 10
                                    ? `Click here to see ${numToCurrency(
                                        this.props.intelligenceState
                                          .Average_cost_basis.length - 10,
                                        true
                                      ).toLocaleString("en-US")}+ asset${
                                        this.props.intelligenceState
                                          .Average_cost_basis.length -
                                          10 >
                                        1
                                          ? "s"
                                          : ""
                                      }`
                                    : "Click here to see more"
                                  : "Click here to see more"}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      ) : this.state.blockOneSelectedItem === 2 ? (
                        // <PortfolioHomeDefiBlock
                        //   lochToken={this.state.lochToken}
                        //   history={this.props.history}
                        //   userWalletList={this.state.userWalletList}
                        // />
                        <div>
                          <div
                            className={`newHomeTableContainer freezeTheFirstColumn ${
                              this.state.tableLoading || tableData?.length < 1
                                ? ""
                                : "tableWatermarkOverlay"
                            } ${
                              this.state.tableLoading
                                ? "newHomeTableContainerLoading"
                                : ""
                            }`}
                          >
                            <TransactionTable
                              xAxisScrollable={
                                !this.state.tableLoading &&
                                tableData?.length > 0
                              }
                              xAxisScrollableColumnWidth={5.1}
                              noSubtitleBottomPadding
                              disableOnLoading
                              isMiniversion
                              tableData={tableData}
                              columnList={columnList}
                              headerHeight={60}
                              isArrow={true}
                              isLoading={this.state.tableLoading}
                              watermarkOnTop
                              // addWatermark
                              fakeWatermark
                              yAxisScrollable={!this.state.tableLoading}
                            />
                          </div>
                          {!this.state.tableLoading ? (
                            <div className="inter-display-medium bottomExtraInfo">
                              <div
                                onClick={this.goToTransactionHistoryPage}
                                className="bottomExtraInfoText"
                              >
                                {totalCount && totalCount > 10
                                  ? `Click here to see ${numToCurrency(
                                      totalCount - 10,
                                      true
                                    ).toLocaleString("en-US")}+ transaction${
                                      totalCount - 10 > 1 ? "s" : ""
                                    }`
                                  : "Click here to see more"}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </Col>
                  <Col md={6}>
                    <div
                      className="section-table"
                      style={{
                        height: "41rem",
                        display: "flex",
                        flexDirection: "column",
                        minHeight: "41rem",
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
                              if (this.state.blockTwoSelectedItem === 1)
                                this.goToRealizedGainsPage();
                              else this.changeBlockTwoItem(1);
                            }}
                          >
                            Flows
                            <CustomOverlay
                              position="top"
                              isIcon={false}
                              isInfo={true}
                              isText={true}
                              className={"fix-width"}
                              text={"Understand your portfolio's net flows"}
                            >
                              {/* <div className="info-icon-i">
                                  i
                                </div> */}
                              <Image
                                src={InfoIconI}
                                className="infoIcon info-icon-home"
                                style={{
                                  cursor: "pointer",
                                  height: "13px",
                                }}
                              />
                            </CustomOverlay>
                            <Image
                              className="homeTabArrowIcon"
                              src={HomeTabArrowIcon}
                            />
                          </div>
                          <div
                            className={`inter-display-medium section-table-toggle-element ml-1 mr-1 ${
                              this.state.blockTwoSelectedItem === 2
                                ? "section-table-toggle-element-selected"
                                : ""
                            }`}
                            onClick={() => {
                              if (this.state.blockTwoSelectedItem === 2)
                                this.goToGasFeesSpentPage();
                              else this.changeBlockTwoItem(2);
                            }}
                          >
                            Gas fees
                            <CustomOverlay
                              position="top"
                              isIcon={false}
                              isInfo={true}
                              isText={true}
                              className={"fix-width"}
                              text={"Understand your gas costs"}
                            >
                              {/* <div className="info-icon-i">
                                  i
                                </div> */}
                              <Image
                                src={InfoIconI}
                                className="infoIcon info-icon-home"
                                style={{
                                  cursor: "pointer",
                                  height: "13px",
                                }}
                              />
                            </CustomOverlay>
                            <Image
                              className="homeTabArrowIcon"
                              src={HomeTabArrowIcon}
                            />
                          </div>
                          <div
                            className={`inter-display-medium section-table-toggle-element mr-1 ${
                              this.state.blockTwoSelectedItem === 3
                                ? "section-table-toggle-element-selected"
                                : ""
                            }`}
                            onClick={() => {
                              if (this.state.blockTwoSelectedItem === 3)
                                this.goToNftPage();
                              else this.changeBlockTwoItem(3);
                            }}
                          >
                            NFTs
                            <CustomOverlay
                              position="top"
                              isIcon={false}
                              isInfo={true}
                              isText={true}
                              className={"fix-width"}
                              text={"Browse the NFTs held by this wallet"}
                            >
                              {/* <div className="info-icon-i">
                                  i
                                </div> */}
                              <Image
                                src={InfoIconI}
                                className="infoIcon info-icon-home"
                                style={{
                                  cursor: "pointer",
                                  height: "13px",
                                }}
                              />
                            </CustomOverlay>
                            <Image
                              className="homeTabArrowIcon"
                              src={HomeTabArrowIcon}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="profit-chart">
                        {this.state.blockTwoSelectedItem === 1 ? (
                          <BarGraphSection
                            // showPremiumHover={!this.state.isPremiumUser}
                            // isPremiumUser={this.state.isPremiumUser}
                            isPremiumUser={this.state.isPremiumUser}
                            showPremiumHover={!this.state.isPremiumUser}
                            goToPayModal={this.showBlurredFlows}
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
                            className="tableWatermarkOverlay"
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
                              // showPremiumHover={!this.state.isPremiumUser}
                              // isPremiumUser={this.state.isPremiumUser}
                              isPremiumUser={this.state.isPremiumUser}
                              showPremiumHover={!this.state.isPremiumUser}
                              goToPayModal={this.showBlurredGasFees}
                              // isBlurred={!this.state.isPremiumUser}
                              isBlurred={!this.state.isPremiumUser}
                              digit={this.state.GraphDigit}
                              isFromHome
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
                              floatingWatermark
                            />
                          </div>
                        ) : this.state.blockTwoSelectedItem === 3 ? (
                          <div>
                            {/* 
                            Things remaining Add Loading conditions */}
                            <div
                              className={`newHomeTableContainer freezeTheFirstColumn ${
                                this.state.localNftData?.length < 1
                                  ? ""
                                  : "tableWatermarkOverlay"
                              } ${
                                this.state.nftTableLoading
                                  ? "newHomeTableContainerLoading"
                                  : ""
                              }`}
                            >
                              <TransactionTable
                                message={"No NFT's found"}
                                // xAxisScrollable
                                // xAxisScrollableColumnWidth={3}
                                noSubtitleBottomPadding
                                disableOnLoading
                                isMiniversion
                                tableData={this.state.localNftData}
                                showDataAtBottom
                                columnList={NFTColumnData}
                                headerHeight={60}
                                isArrow={true}
                                isLoading={this.state.nftTableLoading}
                                fakeWatermark
                                yAxisScrollable={!this.state.nftTableLoading}
                              />
                            </div>
                            {/* Add Loading conditino here and add goto nft page */}
                            {!this.state.nftTableLoading ? (
                              <div className="inter-display-medium bottomExtraInfo">
                                <div
                                  onClick={this.goToNftPage}
                                  className="bottomExtraInfoText"
                                >
                                  {this.state.localNftData
                                    ? this.state.localNftData?.length > 10
                                      ? `Click here to see ${numToCurrency(
                                          this.state.localNftData?.length - 10,
                                          true
                                        ).toLocaleString("en-US")}+ NFT ${
                                          this.state.localNftData?.length - 10 >
                                          1
                                            ? "s"
                                            : ""
                                        }`
                                      : "Click here to see more"
                                    : "Click here to see more"}
                                </div>
                              </div>
                            ) : null}
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
                        minHeight: "41rem",
                        height: "41rem",
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
                              if (this.state.blockThreeSelectedItem === 1)
                                this.goToCounterPartyVolumePage();
                              else this.changeBlockThreeItem(1);
                            }}
                          >
                            Counterparties
                            <CustomOverlay
                              position="top"
                              isIcon={false}
                              isInfo={true}
                              isText={true}
                              className={"fix-width"}
                              text={
                                "Understand where you’ve exchanged the most value"
                              }
                            >
                              <Image
                                src={InfoIconI}
                                className="infoIcon info-icon-home"
                                style={{
                                  cursor: "pointer",
                                  height: "13px",
                                }}
                              />
                            </CustomOverlay>
                            <Image
                              className="homeTabArrowIcon"
                              src={HomeTabArrowIcon}
                            />
                          </div>
                          <div
                            className={`inter-display-medium section-table-toggle-element ml-1 ${
                              this.state.blockThreeSelectedItem === 2
                                ? "section-table-toggle-element-selected"
                                : ""
                            }`}
                            onClick={() => {
                              if (this.state.blockThreeSelectedItem === 2)
                                this.goToYieldOppPage();
                              else this.changeBlockThreeItem(2);
                            }}
                          >
                            Yield opportunities
                            <CustomOverlay
                              position="top"
                              isIcon={false}
                              isInfo={true}
                              isText={true}
                              className={"fix-width"}
                              text={
                                "Yield bearing opportunties personalized for your portfolio"
                              }
                            >
                              {/* <div className="info-icon-i">
                                  i
                                </div> */}
                              <Image
                                src={InfoIconI}
                                className="infoIcon info-icon-home"
                                style={{
                                  cursor: "pointer",
                                  height: "13px",
                                }}
                              />
                            </CustomOverlay>
                            <Image
                              className="homeTabArrowIcon"
                              src={HomeTabArrowIcon}
                            />
                          </div>
                          <div
                            className={`inter-display-medium section-table-toggle-element ml-1 ${
                              this.state.blockThreeSelectedItem === 3
                                ? "section-table-toggle-element-selected section-table-toggle-element-selected-no-hover"
                                : ""
                            }`}
                            onClick={() => {
                              this.changeBlockThreeItem(3);
                            }}
                          >
                            Networks
                            <CustomOverlay
                              position="top"
                              isIcon={false}
                              isInfo={true}
                              isText={true}
                              className={"fix-width"}
                              text={
                                "Understand where you’ve exchanged the most value"
                              }
                            >
                              {/* <div className="info-icon-i">
                                  i
                                </div> */}
                              <Image
                                src={InfoIconI}
                                className="infoIcon info-icon-home"
                                style={{
                                  cursor: "pointer",
                                  height: "13px",
                                }}
                              />
                            </CustomOverlay>
                          </div>
                        </div>
                      </div>
                      {this.state.blockThreeSelectedItem === 1 ? (
                        <div className="profit-chart">
                          <div
                            style={{
                              position: "relative",
                              cursor: "pointer",
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
                              isFromHome
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
                              digit={this.state.counterGraphDigit}
                              isScrollVisible={false}
                              isScroll={true}
                              isLoading={this.state.counterGraphLoading}
                              oldBar
                              noSubtitleBottomPadding
                              newHomeSetup
                              noSubtitleTopPadding
                              floatingWatermark
                            />
                          </div>
                        </div>
                      ) : this.state.blockThreeSelectedItem === 2 ? (
                        <div>
                          <div
                            className={`newHomeTableContainer freezeTheFirstColumn ${
                              this.state.yieldOpportunitiesTableLoading ||
                              yieldOpportunitiesListTemp?.length < 1
                                ? ""
                                : "tableWatermarkOverlay"
                            } ${
                              this.state.yieldOpportunitiesTableLoading
                                ? "newHomeTableContainerLoading"
                                : ""
                            }`}
                          >
                            <TransactionTable
                              message={"No yield opportunities found"}
                              xAxisScrollable={
                                !this.state.yieldOpportunitiesTableLoading &&
                                yieldOpportunitiesListTemp?.length > 0
                              }
                              xAxisScrollableColumnWidth={4.3}
                              noSubtitleBottomPadding
                              disableOnLoading
                              isMiniversion
                              tableData={yieldOpportunitiesListTemp}
                              showDataAtBottom
                              columnList={YieldOppColumnData}
                              headerHeight={60}
                              isArrow={true}
                              isLoading={
                                this.state.yieldOpportunitiesTableLoading
                              }
                              fakeWatermark
                              yAxisScrollable={
                                !this.state.yieldOpportunitiesTableLoading
                              }
                            />
                          </div>
                          {!this.state.yieldOpportunitiesTableLoading ? (
                            <div className="inter-display-medium bottomExtraInfo">
                              <div
                                onClick={this.goToYieldOppPage}
                                className="bottomExtraInfoText"
                              >
                                {this.state.yieldOpportunitiesTotalCount
                                  ? this.state.yieldOpportunitiesTotalCount > 10
                                    ? `Click here to see ${numToCurrency(
                                        this.state
                                          .yieldOpportunitiesTotalCount - 10,
                                        true
                                      ).toLocaleString("en-US")}+ yield ${
                                        this.state
                                          .yieldOpportunitiesTotalCount -
                                          10 >
                                        1
                                          ? "opportunities"
                                          : "opportunity"
                                      }`
                                    : "Click here to see more"
                                  : "Click here to see more"}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      ) : this.state.blockThreeSelectedItem === 3 ? (
                        <PortfolioHomeNetworksBlock
                          history={this.props.history}
                          updatedInsightList={this.state.updatedInsightList}
                          insightsBlockLoading={this.state.insightsBlockLoading}
                          chainLoader={this.state.chainLoader}
                        />
                      ) : null}
                    </div>
                  </Col>
                  <Col md={6}>
                    <div
                      className="section-table"
                      style={{
                        height: "41rem",
                        display: "flex",
                        flexDirection: "column",
                        minHeight: "41rem",
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
                              if (this.state.blockFourSelectedItem === 1)
                                this.goToPriceGaugePage();
                              else this.changeBlockFourItem(1);
                            }}
                          >
                            Price gauge
                            <CustomOverlay
                              position="top"
                              isIcon={false}
                              isInfo={true}
                              isText={true}
                              className={"fix-width"}
                              text={
                                "Understand when this token was bought and sold"
                              }
                            >
                              {/* <div className="info-icon-i">
                                  i
                                </div> */}
                              <Image
                                src={InfoIconI}
                                className="infoIcon info-icon-home"
                                style={{
                                  cursor: "pointer",
                                  height: "13px",
                                }}
                              />
                            </CustomOverlay>
                            <Image
                              className="homeTabArrowIcon"
                              src={HomeTabArrowIcon}
                            />
                          </div>
                          {/* <div
                            className={`inter-display-medium section-table-toggle-element ml-1 mr-1 ${
                              this.state.blockFourSelectedItem === 2
                                ? "section-table-toggle-element-selected"
                                : ""
                            }`}
                            onClick={() => {
                              if (this.state.blockFourSelectedItem === 2)
                                this.goToTransactionHistoryPage();
                              else this.changeBlockFourItem(2);
                            }}
                          >
                            Transactions
                            <CustomOverlay
                              position="top"
                              isIcon={false}
                              isInfo={true}
                              isText={true}
                              className={"fix-width"}
                              text={
                                "Sort, filter, and dissect all your transactions from one place"
                              }
                            >
                              <Image
                                src={InfoIconI}
                                className="infoIcon info-icon-home"
                                style={{
                                  cursor: "pointer",
                                  height: "13px",
                                }}
                              />
                            </CustomOverlay>
                            <Image
                              className="homeTabArrowIcon"
                              src={HomeTabArrowIcon}
                            />
                          </div> */}

                          <div
                            className={`inter-display-medium section-table-toggle-element ml-1 ${
                              this.state.blockFourSelectedItem === 2
                                ? "section-table-toggle-element-selected"
                                : ""
                            }`}
                            onClick={() => {
                              if (this.state.blockFourSelectedItem === 2) {
                                this.goToInsightsPage();
                              } else this.changeBlockFourItem(2);
                            }}
                          >
                            Insights
                            <CustomOverlay
                              position="top"
                              isIcon={false}
                              isInfo={true}
                              isText={true}
                              className={"fix-width"}
                              text={"Valuable insights based on your assets"}
                            >
                              {/* <div className="info-icon-i">
                                  i
                                </div> */}
                              <Image
                                src={InfoIconI}
                                className="infoIcon info-icon-home"
                                style={{
                                  cursor: "pointer",
                                  height: "13px",
                                }}
                              />
                            </CustomOverlay>
                            <Image
                              className="homeTabArrowIcon"
                              src={HomeTabArrowIcon}
                            />
                          </div>
                        </div>
                      </div>

                      {this.state.blockFourSelectedItem === 1 ? (
                        <InflowOutflowPortfolioHome
                          switchPriceGaugeLoader={
                            this.state.switchPriceGaugeLoader
                          }
                          openChartPage={this.goToPriceGaugePage}
                          hideExplainer
                          // isHomepage
                          showEth
                          userWalletList={this.state.userWalletList}
                          lochToken={this.state.lochToken}
                          callChildPriceGaugeApi={
                            this.state.callChildPriceGaugeApi
                          }
                        />
                      ) : // : this.state.blockFourSelectedItem === 2 ? (
                      //   <div>
                      //     <div
                      //       className={`newHomeTableContainer freezeTheFirstColumn ${
                      //         this.state.tableLoading || tableData?.length < 1
                      //           ? ""
                      //           : "tableWatermarkOverlay"
                      //       } ${
                      //         this.state.tableLoading
                      //           ? "newHomeTableContainerLoading"
                      //           : ""
                      //       }`}
                      //     >
                      //       <TransactionTable
                      //         xAxisScrollable={
                      //           !this.state.tableLoading &&
                      //           tableData?.length > 0
                      //         }
                      //         xAxisScrollableColumnWidth={5.1}
                      //         noSubtitleBottomPadding
                      //         disableOnLoading
                      //         isMiniversion
                      //         tableData={tableData}
                      //         columnList={columnList}
                      //         headerHeight={60}
                      //         isArrow={true}
                      //         isLoading={this.state.tableLoading}
                      //         watermarkOnTop
                      //         // addWatermark
                      //         fakeWatermark
                      //         yAxisScrollable={!this.state.tableLoading}
                      //       />
                      //     </div>
                      //     {!this.state.tableLoading ? (
                      //       <div className="inter-display-medium bottomExtraInfo">
                      //         <div
                      //           onClick={this.goToTransactionHistoryPage}
                      //           className="bottomExtraInfoText"
                      //         >
                      //           {totalCount && totalCount > 10
                      //             ? `Click here to see ${numToCurrency(
                      //                 totalCount - 10,
                      //                 true
                      //               ).toLocaleString("en-US")}+ transaction${
                      //                 totalCount - 10 > 1 ? "s" : ""
                      //               }`
                      //             : "Click here to see more"}
                      //         </div>
                      //       </div>
                      //     ) : null}
                      //   </div>
                      // )
                      this.state.blockFourSelectedItem === 2 ? (
                        <PortfolioHomeInsightsBlock
                          showBlurredInsights={this.showBlurredInsights}
                          history={this.props.history}
                          updatedInsightList={this.state.updatedInsightList}
                          insightsBlockLoading={this.state.insightsBlockLoading}
                          // isPremiumUser={this.state.isPremiumUser}
                          isPremiumUser={this.state.isPremiumUser}
                        />
                      ) : null}
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
        {this.state.isLochPaymentModal ? (
          <PaywallModal
            openWithOptions={this.state.openLochPaymentModalWithOptions}
            show={this.state.isLochPaymentModal}
            onHide={this.hidePaymentModal}
            redirectLink={BASE_URL_S3 + "/"}
            title={this.state.payModalTitle}
            description={this.state.payModalDescription}
            hideBackBtn
          />
        ) : null}

        {this.state.upgradeModal && (
          <UpgradeModal
            show={this.state.upgradeModal}
            onHide={this.upgradeModal}
            history={this.props.history}
            isShare={window.localStorage.getItem("share_id")}
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
  darkModeState: state.darkModeState,
  NFTState: state.NFTState,
  userPaymentState: state.UserPaymentState,
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
  updateAverageCostBasis,
  getAssetProfitLoss,
  getDetectedChainsApi,
  GetAllPlan,
  getUser,
  getAllCounterFeeApi,
  getAllFeeApi,
  getYieldOpportunities,
  addUserCredits,
  getProtocolBalanceApi,
  updateFeeGraph,
  updateCounterParty,
  updateAssetProfitLoss,
  getNFT,
};
Portfolio.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);
