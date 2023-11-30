import React from "react";
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import { connect } from "react-redux";
import WelcomeCard from "./WelcomeCard";
import LineChartSlider from "./LineCharSlider";
import prevIcon from "../../assets/images/icons/prev-arrow.svg";
import nextIcon from "../../assets/images/icons/next-arrow.svg";
import LightBulb from "../../assets/images/icons/lightbulb.svg";
import ArrowRight from "../../assets/images/icons/arrow-right.svg";
import GainIcon from "../../assets/images/icons/GainIcon.svg";
import LossIcon from "../../assets/images/icons/LossIcon.svg";
import SignInIcon from "../../assets/images/icons/ActiveProfileIcon.svg";

import {
  getCoinRate,
  getDetailsByLinkApi,
  getUserWallet,
  getYesterdaysBalanceApi,
  settingDefaultValues,
  getExternalEventsApi,
  getExchangeBalances,
} from "./Api";
import { Image, Row, Col } from "react-bootstrap";
import AddWalletModalIcon from "../../assets/images/icons/wallet-icon.svg";
import FixAddModal from "../common/FixAddModal";
import { getAllCoins, getAllParentChains } from "../onboarding/Api.js";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import TransactionTable from "../intelligence/TransactionTable";
import BarGraphSection from "./../common/BarGraphSection";
import { getAllWalletListApi } from "../wallet/Api";
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
  SEARCH_BY_WALLET_ADDRESS_IN,
  START_INDEX,
  SORT_BY_TIMESTAMP,
  SORT_BY_FROM_WALLET,
  SORT_BY_TO_WALLET,
  SORT_BY_ASSET,
  SORT_BY_USD_VALUE_THEN,
  SORT_BY_METHOD,
  GroupByOptions,
  GROUP_BY_DATE,
  InsightType,
  DEFAULT_PRICE,
  BASE_URL_S3,
} from "../../utils/Constant";
import sortByIcon from "../../assets/images/icons/triangle-down.svg";
import moment from "moment";
import unrecognizedIcon from "../../assets/images/icons/unrecognisedicon.svg";
import reduceCost from "../../assets/images/icons/reduce-cost-img.svg";
import reduceRisk from "../../assets/images/icons/reduce-risk-img.svg";
import increaseYield from "../../assets/images/icons/increase-yield-img.svg";
import {
  ManageWallets,
  AverageCostBasisEView,
  TimeSpentHome,
  TransactionHistoryAddress,
  TransactionHistoryDate,
  TransactionHistoryFrom,
  TransactionHistoryTo,
  TransactionHistoryAsset,
  TransactionHistoryUSD,
  ProfitLossEV,
  HomePage,
  HomeInsightsExpand,
  AddMoreAddres,
  AssetValueExpandview,
  HomeCostSortByAsset,
  HomeSortByCostBasis,
  HomeSortByCurrentValue,
  HomeSortByGainLoss,
  HomeCostAssetHover,
  NetflowSwitchHome,
  resetUser,
  CostCostBasisHover,
  CostCurrentValueHover,
  TransactionHistoryWalletClicked,
} from "../../utils/AnalyticsFunctions.js";
import { deleteToken, getCurrentUser, getToken } from "../../utils/ManageToken";
import { getAssetGraphDataApi } from "./Api";
import {
  getAvgCostBasis,
  ResetAverageCostBasis,
  updateAverageCostBasis,
} from "../cost/Api";
import Loading from "../common/Loading";
import {
  amountFormat,
  CurrencyType,
  lightenDarkenColor,
  loadingAnimation,
  mobileCheck,
  noExponents,
  numToCurrency,
  TruncateText,
  UpgradeTriggered,
} from "../../utils/ReusableFunctions";
import PieChart2 from "./PieChart2";
import UpgradeModal from "../common/upgradeModal";
import { GetAllPlan, getUser } from "../common/Api";
import { GraphHeader } from "../common/GraphHeader";
import { ASSET_VALUE_GRAPH_DAY } from "./ActionTypes";
import Slider from "react-slick";

import CopyClipboardIcon from "../../assets/images/CopyClipboardIcon.svg";
import Footer from "../common/footer";
import { toast } from "react-toastify";
import "./_mobilePortfolio.scss";
import arrowUp from "../../assets/images/arrow-up.svg";
import LinkIcon from "../../assets/images/link.svg";
import PortfolioMobile from "./PortfolioMobile";
import {
  ArrowDownLeftSmallIcon,
  ArrowUpRightSmallIcon,
} from "../../assets/images/icons/index.js";
import FollowAuthModal from "./FollowModals/FollowAuthModal.js";
import FollowExitOverlay from "./FollowModals/FollowExitOverlay.js";
import { addAddressToWatchList } from "../watchlist/redux/WatchListApi.js";

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
      isAddressFollowedCount: 0,
      followSignInModalAnimation: true,
      followSigninModal: false,
      followSignupModal: false,
      followedAddress: "",
      isShowingAge: false,
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

      // transaction history table row limit
      limit: 6,

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
      netFlowLoading: false,

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
      updatedInsightList: "",
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
      AvgCostLoading: false,

      chainLoader: false,
      totalChainDetechted: 0,

      // netflow switch
      isSwitch: false,
      waitForMixpannelCall: false,
    };
  }
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
        isLoadingInsight: true,
        netFlowLoading: true,
        isLoading: true,
        isLoadingNet: true,
        graphLoading: true,
        tableLoading: true,
        AvgCostLoading: true,
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
      netFlowLoading: true,
      isLoading: true,
      isLoadingNet: true,
      graphLoading: true,
      tableLoading: true,
      AvgCostLoading: true,
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
  componentDidMount() {
    const passedAddress = window.sessionStorage.getItem("followThisAddress");
    const tempPathName = this.props.location?.pathname;

    if (passedAddress && getCurrentUser().id && tempPathName === "/home") {
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
      window.sessionStorage.removeItem("followThisAddress");
    }

    if (mobileCheck()) {
      this.setState({
        isMobileDevice: true,
      });
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

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.portfolioState?.assetValueDataLoaded !==
      this.props.portfolioState?.assetValueDataLoaded
    ) {
      this.setState({
        dataLoaded: this.props.portfolioState.assetValueDataLoaded,
      });
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
        isLoadingInsight: true,
        netFlowLoading: true,
        isLoading: true,
        isLoadingNet: true,
        graphLoading: true,
        tableLoading: true,
        AvgCostLoading: true,
        chainLoader: true,
      });

      // if wallet address change
      if (
        this.state &&
        this.state.userWalletList &&
        this.state.userWalletList?.length > 0
      ) {
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
      // if (!this.props.portfolioState.assetValueMonth) {
      //    this.getGraphData();
      // } else {
      //   this.setState({
      //     graphLoading:false,
      //   })
      // }

      this.getGraphData();

      // - remove form home
      // getAllCounterFeeApi(this, false, false);

      // run when graphValue == null and  GraphData: [],
      // add loader
      this.props.getProfitAndLossApi(this, false, false, false);

      // netflow breakdown
      this.props.getAssetProfitLoss(this, false, false, false);

      // run when updatedInsightList === ""
      this.props.getAllInsightsApi(this);

      this.props.getAvgCostBasis(this);
      this.getTableData();

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
    this.getGraphData();
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
        if (!redirect && redirectPath) {
          window.sessionStorage.setItem(
            "ShareRedirect",
            JSON.stringify({
              path: redirectPath,
              hash: this.props?.location?.hash,
            })
          );
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
  handleGroupBy = (value) => {
    let groupByValue = GroupByOptions.getGroupBy(value);
    this.getGraphData(groupByValue);
  };

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
    data.append("limit", this.state.limit);
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
  render() {
    const { table_home, assetPriceList_home, table_home_count } =
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
        coumnWidth: 0.2,
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
                <div className="dotDotText">
                  {rowData.AssetCode ? rowData.AssetCode : ""}
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
            id="Cost Basis"
            onClick={() => this.handleSort(this.state.sortBy[4])}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Cost basis
            </span>
            <Image
              src={sortByIcon}
              className={!this.state.sortBy[4].down ? "rotateDown" : "rotateUp"}
            />
          </div>
        ),
        dataKey: "CostBasis",
        // coumnWidth: 100,
        coumnWidth: 0.25,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "CostBasis") {
            if (rowData === "EMPTY") {
              return null;
            }
            return (
              <div className="cost-common-container">
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
      // {
      //   labelName: (
      //     <div
      //       className="cp history-table-header-col"
      //       id="Amount"
      //       onClick={() => this.handleSort(this.state.sortBy[3])}
      //     >
      //       <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
      //         Amount
      //       </span>
      //       <Image
      //         src={sortByIcon}
      //         className={!this.state.sortBy[3].down ? "rotateDown" : "rotateUp"}
      //       />
      //     </div>
      //   ),
      //   dataKey: "Amount",
      //   // coumnWidth: 108,
      //   coumnWidth: 0.16,
      //   isCell: true,
      //   cell: (rowData, dataKey) => {
      //     if (dataKey === "Amount") {
      //       return (
      //         <CustomOverlay
      //           position="top"
      //           isIcon={false}
      //           isInfo={true}
      //           isText={true}
      //           text={Number(noExponents(rowData.Amount)).toLocaleString(
      //             "en-US"
      //           )}
      //         >
      //           <span>
      //             {Number(noExponents(rowData.Amount)).toLocaleString("en-US")}
      //           </span>
      //         </CustomOverlay>
      //       );
      //     }
      //   },
      // },
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
      //   coumnWidth: 0.34,
      //   isCell: true,
      //   cell: (rowData, dataKey) => {
      //     if (dataKey === "CostBasis") {
      //       return (
      //         <CustomOverlay
      //           position="top"
      //           isIcon={false}
      //           isInfo={true}
      //           isText={true}
      //           text={
      //             rowData.CostBasis === 0
      //               ? "N/A"
      //               : CurrencyType(false) +
      //               Number(
      //                 noExponents(rowData.CostBasis.toFixed(2))
      //               ).toLocaleString("en-US")
      //           }
      //         >
      //           <span>
      //             {rowData.CostBasis === 0
      //               ? "N/A"
      //               : CurrencyType(false) +
      //               Number(
      //                 noExponents(rowData.CostBasis.toFixed(2))
      //               ).toLocaleString("en-US")}
      //           </span>
      //         </CustomOverlay>
      //       );
      //     }
      //   },
      // },
      // {
      //   labelName: (
      //     <div
      //       className="cp history-table-header-col"
      //       id="Current Value"
      //       onClick={() => this.handleSort(this.state.sortBy[5])}
      //     >
      //       <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
      //         Current value
      //       </span>
      //       <Image
      //         src={sortByIcon}
      //         className={!this.state.sortBy[5].down ? "rotateDown" : "rotateUp"}
      //       />
      //     </div>
      //   ),
      //   dataKey: "CurrentValue",
      //   // coumnWidth: 140,
      //   coumnWidth: 0.37,
      //   isCell: true,
      //   cell: (rowData, dataKey) => {
      //     if (dataKey === "CurrentValue") {
      //       return (
      //         <CustomOverlay
      //           position="top"
      //           isIcon={false}
      //           isInfo={true}
      //           isText={true}
      //           text={
      //             CurrencyType(false) +
      //             Number(
      //               noExponents(rowData.CurrentValue.toFixed(2))
      //             ).toLocaleString("en-US")
      //           }
      //         >
      //           <span>
      //             {CurrencyType(false) +
      //               Number(
      //                 noExponents(rowData.CurrentValue.toFixed(2))
      //               ).toLocaleString("en-US")}
      //           </span>
      //         </CustomOverlay>
      //       );
      //     }
      //   },
      // },
      {
        labelName: (
          <div
            className="cp history-table-header-col"
            id="Gain loss"
            onClick={() => this.handleSort(this.state.sortBy[6])}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Return
            </span>
            <Image
              src={sortByIcon}
              className={!this.state.sortBy[6].down ? "rotateDown" : "rotateUp"}
            />
          </div>
        ),
        dataKey: "GainLoss",
        // coumnWidth: 128,
        coumnWidth: 0.3,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "GainLoss") {
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
                    rowData.GainLoss
                      ? Math.abs(
                          Number(noExponents(rowData.GainLoss.toFixed(2)))
                        ).toLocaleString("en-US") + "%"
                      : "0.00%"
                  }
                  colorCode="#000"
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
                    <span className="inter-display-medium f-s-13 lh-16 grey-313">
                      {rowData.GainLoss
                        ? Math.abs(
                            Number(noExponents(rowData.GainLoss.toFixed(2)))
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
              style={{ overflow: "visible" }}
            >
              <div className="portfolio-section">
                {/* welcome card */}
                <WelcomeCard
                  changeWalletList={this.handleChangeList}
                  apiResponse={(e) => this.CheckApiResponse(e)}
                  showNetworth={true}
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
              >
                <PieChart2
                  isAddressFollowedCount={this.state.isAddressFollowedCount}
                  afterAddressFollowed={this.afterAddressFollowed}
                  setLoader={this.setLoader}
                  chainLoader={this.state.chainLoader}
                  totalChainDetechted={this.state.totalChainDetechted}
                  userWalletData={
                    this.props.portfolioState &&
                    this.props.portfolioState.chainWallet &&
                    Object.keys(this.props.portfolioState.chainWallet).length >
                      0
                      ? Object.values(this.props.portfolioState.chainWallet)
                      : null
                  }
                  chainPortfolio={
                    this.props.portfolioState &&
                    this.props.portfolioState.chainPortfolio &&
                    Object.keys(this.props.portfolioState.chainPortfolio)
                      .length > 0
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
                  assetTotal={getTotalAssetValue()}
                  assetPrice={
                    this.props.portfolioState.assetPrice &&
                    Object.keys(this.props.portfolioState.assetPrice).length > 0
                      ? Object.values(this.props.portfolioState.assetPrice)
                      : null
                  }
                  isLoading={this.state.isLoading}
                  isUpdate={this.state.isUpdate}
                  walletTotal={this.props.portfolioState.walletTotal}
                  // handleAddModal={this.handleAddModal}
                  // handleManage={() => {
                  //   this.props.history.push("/wallets");
                  //   ManageWallets({
                  //     session_id: getCurrentUser().id,
                  //     email_address: getCurrentUser().email,
                  //   });
                  // }}
                  undetectedWallet={(e) => this.undetectedWallet(e)}
                  getProtocolTotal={this.getProtocolTotal}
                  updateTimer={this.updateTimer}
                  userWalletList={this.state.userWalletList}
                />
                {/* {this.state.userWalletList?.findIndex(
                  (w) => w.coinFound !== true
                ) > -1 && this.state.userWalletList[0]?.address !== "" ? (
                  <div
                    className="fix-div"
                    id="fixbtn"
                    style={this.state.showBtn ? { display: "none" } : {}}
                  >
                    <div className="m-r-8 decribe-div">
                      <div className="inter-display-semi-bold f-s-16 lh-19 m-b-4 black-262">
                        Wallet undetected
                      </div>
                      <div className="inter-display-medium f-s-13 lh-16 grey-737">
                        One or more wallets were not detected{" "}
                      </div>
                    </div>
                    <Button
                      className="secondary-btn"
                      onClick={this.handleFixModal}
                    >
                      Fix
                    </Button>
                  </div>
                ) : (
                  ""
                )} */}
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
                        noSubtitleBottomPadding
                        disableOnLoading
                        isMiniversion
                        title="Unrealized profit and loss"
                        handleClick={() => {
                          if (this.state.lochToken) {
                            this.props.history.push("/intelligence/costs");
                            AverageCostBasisEView({
                              session_id: getCurrentUser().id,
                              email_address: getCurrentUser().email,
                            });
                          }
                        }}
                        subTitle="Understand your unrealized profit and loss per token"
                        tableData={tableDataCostBasis.slice(0, 3)}
                        moreData={
                          this.props.intelligenceState?.Average_cost_basis &&
                          this.props.intelligenceState.Average_cost_basis
                            .length > 3
                            ? `${numToCurrency(
                                this.props.intelligenceState.Average_cost_basis
                                  .length - 3,
                                true
                              ).toLocaleString("en-US")}+ assets`
                            : 0
                        }
                        showDataAtBottom={
                          this.props.intelligenceState?.Average_cost_basis &&
                          this.props.intelligenceState.Average_cost_basis
                            .length > 3
                        }
                        columnList={CostBasisColumnData}
                        headerHeight={60}
                        isArrow={true}
                        isLoading={this.state.AvgCostLoading}
                        isAnalytics="average cost basis"
                        addWatermark
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="profit-chart">
                      <BarGraphSection
                        disableOnLoading
                        noSubtitleBottomPadding
                        loaderHeight={15.5}
                        headerTitle="Realized profit and loss"
                        headerSubTitle="Understand your portfolio's net flows"
                        isArrow={true}
                        handleClick={() => {
                          if (this.state.lochToken) {
                            ProfitLossEV({
                              session_id: getCurrentUser().id,
                              email_address: getCurrentUser().email,
                            });
                            this.props.history.push("/intelligence#netflow");
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
                        showSwitch={true}
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
                        height: "32rem",
                        minHeight: "32rem",
                        marginBottom: 0,
                      }}
                    >
                      <TransactionTable
                        moreData={
                          table_home_count && table_home_count > 3
                            ? `${numToCurrency(
                                table_home_count - 3,
                                true
                              ).toLocaleString("en-US")}+ transactions`
                            : 0
                        }
                        showDataAtBottom={
                          table_home_count && table_home_count > 3
                        }
                        noSubtitleBottomPadding
                        disableOnLoading
                        isMiniversion
                        title="Transactions"
                        handleClick={() => {
                          if (this.state.lochToken) {
                            this.props.history.push(
                              "/intelligence/transaction-history"
                            );
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
                    {/* <div className="m-r-16 profit-chart">
                      <div
                        className={`bar-graph-section m-b-32`}
                        style={{ paddingBottom: "0rem", position: "relative" }}
                      >
                        <GraphHeader
                          title={"Insights"}
                          subtitle={"Valuable insights based on your assets"}
                          isArrow={true}
                          handleClick={() => {
                            if (this.state.lochToken) {
                              HomeInsightsExpand({
                                session_id: getCurrentUser().id,
                                email_address: getCurrentUser().email,
                              });
                              this.props.history.push("/intelligence/insights");
                            }
                          }}
                        />
                        <div className="insights-wrapper">
                          {/* <h2 className="inter-display-medium f-s-25 lh-30 black-191">This week</h2> */}
                    {/* {this.state.isLoadingInsight ? (
                            <div
                              style={{
                                height: "30rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Loading />
                            </div>
                          ) : (
                            <>
                              <div className="insight-slider">
                                {this.props.intelligenceState
                                  .updatedInsightList &&
                                  this.props.intelligenceState
                                    .updatedInsightList.length > 0 && (
                                    <Slider {...this.state.settings}>
                                      {this.props.intelligenceState.updatedInsightList
                                        ?.slice(0, 3)
                                        .map((insight, key) => {
                                          return (
                                            <div key={`sliderKey-${key}`}>
                                              <div className="steps">
                                                <div className="top-section">
                                                  <Image
                                                    src={
                                                      insight.insight_type ===
                                                      InsightType.COST_REDUCTION
                                                        ? reduceCost
                                                        : insight.insight_type ===
                                                          InsightType.RISK_REDUCTION
                                                        ? reduceRisk
                                                        : increaseYield
                                                    }
                                                    className="insight-icon"
                                                  />
                                                  <div className="insight-title">
                                                    <h5 className="inter-display-medium f-s-16 lh-19">
                                                      {InsightType.getSmallText(
                                                        insight.insight_type
                                                      )}
                                                    </h5>
                                                    {insight?.sub_type ? (
                                                      <h6
                                                        className="inter-display-bold f-s-10 lh-12"
                                                        style={{
                                                          color: "#ffffff",
                                                          background: "#19191A",
                                                          borderRadius:
                                                            "0.8rem",
                                                          padding:
                                                            "0.4rem 0.8rem",
                                                          width: "fit-content",
                                                          textTransform:
                                                            "uppercase",
                                                          marginTop: "0.4rem",
                                                        }}
                                                      >
                                                        {InsightType.getRiskType(
                                                          insight.sub_type
                                                        )}
                                                      </h6>
                                                    ) : (
                                                      <h6 className="inter-display-semi-bold f-s-10 lh-12 m-t-04">
                                                        INSIGHT
                                                      </h6>
                                                    )}
                                                  </div>
                                                </div>

                                                <div className="content-section">
                                                  <p
                                                    className="inter-display-medium f-s-13 lh-16 grey-969"
                                                    dangerouslySetInnerHTML={{
                                                      __html: insight.sub_title,
                                                    }}
                                                  ></p>
                                                  <h4
                                                    className="inter-display-medium f-s-16 lh-19 grey-313 m-t-12"
                                                    dangerouslySetInnerHTML={{
                                                      __html: insight.title,
                                                    }}
                                                  ></h4>
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        })}
                                    </Slider>
                                  )}

                                <div className="bottom-msg">
                                  <div className="row-insight op">
                                    <Image src={LightBulb} />
                                    <h5 className="inter-display-medium f-s-13 lh-15 m-l-12">
                                      Add all your wallets and <br />
                                      exchanges to gain more insights
                                    </h5>
                                  </div>
                                  <div
                                    className="row-insight-arrow cp"
                                    onClick={this.simulateButtonClick}
                                  >
                                    <h6 className="inter-display-medium f-s-13 lh-15 m-r-5">
                                      Add more
                                    </h6>
                                    <Image src={ArrowRight} />
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div> */}
                  </Col>
                  <Col md={6}>
                    <div
                      className="section-table"
                      // style={{ paddingBottom: "1.15rem" }}
                    >
                      <LineChartSlider
                        disableOnLoading
                        noSubtitleBottomPadding
                        assetValueData={
                          this.props.portfolioState.assetValueDay &&
                          this.props.portfolioState.assetValueDay
                        }
                        externalEvents={
                          this.props.portfolioState.externalEvents &&
                          this.props.portfolioState.externalEvents
                        }
                        coinLists={this.props.OnboardingState.coinsLists}
                        isScrollVisible={false}
                        handleGroupBy={(value) => this.handleGroupBy(value)}
                        graphLoading={this.state.graphLoading}
                        // graphLoading={true}
                        isUpdate={this.state.isUpdate}
                        handleClick={() => {
                          if (this.state.lochToken) {
                            AssetValueExpandview({
                              session_id: getCurrentUser().id,
                              email_address: getCurrentUser().email,
                            });
                            this.props.history.push(
                              "/intelligence/asset-value"
                            );
                          }
                        }}
                        hideTimeFilter={true}
                        hideChainFilter={true}
                        dataLoaded={this.state.assetValueDataLoaded}
                        updateTimer={this.updateTimer}
                        activeTab="day"
                      />
                    </div>
                  </Col>
                  {/* <Col md={6}>
                    <div className="profit-chart">
                      <BarGraphSection
                        headerTitle="Net Flows"
                        headerSubTitle="Understand your portfolio's net flows"
                        isArrow={true}
                        handleClick={() => {
                          if (this.state.lochToken) {
                            ProfitLossEV({
                              session_id: getCurrentUser().id,
                              email_address: getCurrentUser().email,
                            });
                            this.props.history.push("/intelligence#netflow");
                          }
                        }}
                        isScrollVisible={false}
                        data={
                          this.props.intelligenceState.graphValue &&
                          this.props.intelligenceState.graphValue[0]
                        }
                        options={
                          this.props.intelligenceState.graphValue &&
                          this.props.intelligenceState.graphValue[1]
                        }
                        coinsList={this.props.OnboardingState.coinsList}
                        marginBottom="m-b-32"
                        showFooter={false}
                        showBadges={false}
                        showPercentage={
                          this.props.intelligenceState.graphValue &&
                          this.props.intelligenceState.graphValue[2]
                        }
                        isLoading={this.state.netFlowLoading}
                        className={"portfolio-profit-and-loss"}
                      />
                    </div>
                  </Col> */}
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
};
Portfolio.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);
