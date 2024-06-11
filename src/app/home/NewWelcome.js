// import { ethers } from "ethers";
import React from "react";
import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import {
  ActiveSmartMoneySidebarIcon,
  ArrowDownLeftSmallIcon,
  ArrowUpRightSmallIcon,
  NewWelcomeAddAnotherPlusIcon,
  NewWelcomeCopyIcon,
  NewWelcomeTrashIcon,
  TrendingFireIcon,
  TrendingWalletIcon,
  darkModeIcon,
  lightModeIcon,
} from "../../assets/images/icons";
import ConnectIcons from "../../assets/images/icons/connect-icon-white.svg";
import LinkIcon from "../../assets/images/icons/link.svg";
import LockIcon from "../../assets/images/icons/lock-icon.svg";
import personRounded from "../../assets/images/icons/person-rounded.svg";
import questionRoundedIcons from "../../assets/images/icons/question-rounded.svg";
import logo from "../../assets/images/logo-white.svg";
import {
  API_LIMIT,
  BASE_URL_S3,
  SORT_BY_AMOUNT,
  START_INDEX,
} from "../../utils/Constant";
import {
  deleteAddWallet,
  getCurrentUser,
  getToken,
  setLocalStoraage,
} from "../../utils/ManageToken";
import {
  CurrencyType,
  TruncateText,
  amountFormat,
  mobileCheck,
  noExponents,
  numToCurrency,
  switchToDarkMode,
  switchToLightMode,
  scrollToBottomAfterPageChange,
  scrollToTop,
} from "../../utils/ReusableFunctions";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import { BaseReactComponent } from "../../utils/form";
import CheckboxCustomTable from "../common/customCheckboxTable";
import TransactionTable from "../intelligence/TransactionTable";
import walletIconsWhite from "./../../assets/images/icons/wallet_icon_white.svg";

import OutsideClickHandler from "react-outside-click-handler";
import {
  AddTextbox,
  ClickTrendingAddress,
  ClickedFollowLeaderboard,
  ClickedPageChangeWelcomeLeaderboard,
  ClickedPageLimitWelcomeLeaderboard,
  ConnectWalletButtonClickedWelcome,
  ConnectedWalletWelcome,
  DeleteWalletAddress,
  EmailAddressAdded,
  EmailAddressAddedSignUp,
  LPC_Go,
  LPConnectExchange,
  OnboardingMobilePage,
  OnboardingPage,
  SignInOnClickWelcomeLeaderboard,
  SmartMoneyWalletClicked,
  TimeSpentOnboarding,
  TimeSpentOnboardingMobile,
  ToggleDarkModeAnalytics,
  WelcomeSignUpModalEmailAdded,
  WelcomeSignedUpReferralCode,
  resetUser,
} from "../../utils/AnalyticsFunctions.js";
import {
  GetAllPlan,
  SwitchDarkMode,
  detectNameTag,
  getAllCurrencyRatesApi,
  setPageFlagDefault,
  updateUserWalletApi,
  updateWalletListFlag,
} from "../common/Api";
import ConnectModal from "../common/ConnectModal.js";
import Loading from "../common/Loading.js";
import {
  setHeaderReducer,
  setMetamaskConnectedReducer,
} from "../header/HeaderAction";
import { addExchangeTransaction } from "../home/Api";
import {
  createAnonymousUserApi,
  detectCoin,
  getAllCoins,
  getAllParentChains,
  signIn,
  signUpWelcome,
  verifyUser,
} from "../onboarding/Api";
import { addUserCredits } from "../profile/Api.js";
import {
  removeFromWatchList,
  updateAddToWatchList,
} from "../watchlist/redux/WatchListApi";
import {
  createAnonymousUserSmartMoneyApi,
  getSmartMoney,
} from "./../smartMoney/Api";
import Login from "./NewAuth/Login.js";
import Redirect from "./NewAuth/Redirect.js";
import SignUp from "./NewAuth/SignUp.js";
import Verify from "./NewAuth/Verify.js";
import NewHomeInputBlock from "./NewHomeInputBlock.js";
import NewWelcomeMobile from "./NewWelcomeMobile.js";
import ConfirmLeaveModal from "../common/ConformLeaveModal.js";
import { isNewAddress } from "../Portfolio/Api.js";
import { checkReferallCodeValid } from "../ReferralCodes/ReferralCodesApi.js";
class NewWelcome extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      isPremiumUser: false,
      //Sign up referral
      isReferralCodeStep: false,
      referralCode: "",
      isReferralCodeLoading: false,
      //Sign up referral
      canCallConnectWalletFun: false,
      pageName: "Landing Page",
      areNewAddresses: false,
      isPrevAddressNew: true,
      confirmLeave: false,
      currentMetamaskWallet: {},
      lochUser: JSON.parse(window.localStorage.getItem("lochUser")),
      startTime: "",
      isDarkMode:
        document.querySelector("body").getAttribute("data-theme") &&
        document.querySelector("body").getAttribute("data-theme") === "dark"
          ? true
          : false,
      onboardingWalletAddress: [
        {
          id: `wallet1`,
          address: "",
          coins: [],
          displayAddress: "",
          wallet_metadata: {},
          nickname: "",
          showAddress: true,
          showNickname: true,
          apiAddress: "",
          showNameTag: true,
          nameTag: "",
        },
      ],
      onboardingExchanges: null,
      onboardingConnectExchangeModal: false,
      trendingAddresses: [
        // {
        //   address: "vitalik.eth",
        //   worth: 1628747.784,
        //   trimmedAddress: "vitalik.eth",
        //   fullData: [
        //     {
        //       address: "vitalik.eth",
        //       apiAddress: "vitalik.eth",
        //       coinFound: [
        //         {
        //           chain_detected: true,
        //           coinCode: "ETH",
        //           coinName: "Ethereum",
        //           coinSymbol: "https://media.loch.one/loch-ethereum.svg",
        //           coinColor: "#7B44DA",
        //         },
        //         {
        //           chain_detected: true,
        //           coinCode: "ARB",
        //           coinName: "Arbitrum",
        //           coinSymbol: "https://media.loch.one/loch-arbitrum.svg",
        //           coinColor: "#2C374B",
        //         },
        //         {
        //           chain_detected: true,
        //           coinCode: "AVAX",
        //           coinName: "Avalanche",
        //           coinSymbol: "https://media.loch.one/loch-avalanche.svg",
        //           coinColor: "#E84042",
        //         },
        //         {
        //           chain_detected: true,
        //           coinCode: "BSC",
        //           coinName: "BSC",
        //           coinSymbol: "https://media.loch.one/loch-binance.svg",
        //           coinColor: "#F0B90B",
        //         },
        //         {
        //           chain_detected: true,
        //           coinCode: "CELO",
        //           coinName: "Celo",
        //           coinSymbol: "https://media.loch.one/loch-celo.svg",
        //           coinColor: "#F4CE6F",
        //         },
        //         {
        //           chain_detected: true,
        //           coinCode: "FTM",
        //           coinName: "Fantom",
        //           coinSymbol: "https://media.loch.one/loch-fantom.svg",
        //           coinColor: "#13B5EC",
        //         },
        //         {
        //           chain_detected: true,
        //           coinCode: "OP",
        //           coinName: "Optimism",
        //           coinSymbol: "https://media.loch.one/loch-optimism.svg",
        //           coinColor: "#FF0420",
        //         },
        //         {
        //           chain_detected: true,
        //           coinCode: "POLYGON",
        //           coinName: "Polygon",
        //           coinSymbol: "https://media.loch.one/loch-polygon.svg",
        //           coinColor: "#8247E5",
        //         },
        //         {
        //           chain_detected: false,
        //           coinCode: "LTC",
        //           coinName: "Litecoin",
        //           coinSymbol: "https://media.loch.one/loch-litecoin.svg",
        //           coinColor: "#345D9D",
        //         },
        //         {
        //           chain_detected: false,
        //           coinCode: "XLM",
        //           coinName: "Stellar",
        //           coinSymbol: "https://media.loch.one/loch-stellar.svg",
        //           coinColor: "#19191A",
        //         },
        //         {
        //           chain_detected: false,
        //           coinCode: "BTC",
        //           coinName: "Bitcoin",
        //           coinSymbol: "https://media.loch.one/loch-bitcoin.svg",
        //           coinColor: "#F19938",
        //         },
        //         {
        //           chain_detected: false,
        //           coinCode: "SOL",
        //           coinName: "Solana",
        //           coinSymbol: "https://media.loch.one/loch-solana.svg",
        //           coinColor: "#5ADDA6",
        //         },
        //         {
        //           chain_detected: false,
        //           coinCode: "ADA",
        //           coinName: "Cardano",
        //           coinSymbol: "https://media.loch.one/loch-cardano.svg",
        //           coinColor: "#0033AD",
        //         },
        //         {
        //           chain_detected: false,
        //           coinCode: "ALGO",
        //           coinName: "Algorand",
        //           coinSymbol: "https://media.loch.one/loch-algorand.svg",
        //           coinColor: "#19191A",
        //         },
        //         {
        //           chain_detected: false,
        //           coinCode: "TRX",
        //           coinName: "Tron",
        //           coinSymbol: "https://media.loch.one/loch-tron.svg",
        //           coinColor: "#FF060A",
        //         },
        //       ],
        //       displayAddress: "",
        //       id: "wallet1",
        //       loadingNameTag: false,
        //       nameTag: "",
        //       nickname: "",
        //       showAddress: true,
        //       showNameTag: false,
        //       showNickname: false,
        //       wallet_metadata: {},
        //     },
        //   ],
        // },
        {
          address: "0x26fCbD3AFEbbE28D0A8684F790C48368D21665b5",
          worth: 17723868.951,
          trimmedAddress: "0x26f...5b5",
          fullData: [
            {
              address: "0x26fCbD3AFEbbE28D0A8684F790C48368D21665b5",
              apiAddress: "0x26fCbD3AFEbbE28D0A8684F790C48368D21665b5",
              coinFound: [
                {
                  chain_detected: false,
                  coinCode: "BTC",
                  coinName: "Bitcoin",
                  coinSymbol: "https://media.loch.one/loch-bitcoin.svg",
                  coinColor: "#F19938",
                },
                {
                  chain_detected: true,
                  coinCode: "ETH",
                  coinName: "Ethereum",
                  coinSymbol: "https://media.loch.one/loch-ethereum.svg",
                  coinColor: "#7B44DA",
                },
                {
                  chain_detected: true,
                  coinCode: "ARB",
                  coinName: "Arbitrum",
                  coinSymbol: "https://media.loch.one/loch-arbitrum.svg",
                  coinColor: "#2C374B",
                },
                {
                  chain_detected: true,
                  coinCode: "AVAX",
                  coinName: "Avalanche",
                  coinSymbol: "https://media.loch.one/loch-avalanche.svg",
                  coinColor: "#E84042",
                },
                {
                  chain_detected: true,
                  coinCode: "BSC",
                  coinName: "BSC",
                  coinSymbol: "https://media.loch.one/loch-binance.svg",
                  coinColor: "#F0B90B",
                },
                {
                  chain_detected: true,
                  coinCode: "CELO",
                  coinName: "Celo",
                  coinSymbol: "https://media.loch.one/loch-celo.svg",
                  coinColor: "#F4CE6F",
                },
                {
                  chain_detected: true,
                  coinCode: "FTM",
                  coinName: "Fantom",
                  coinSymbol: "https://media.loch.one/loch-fantom.svg",
                  coinColor: "#13B5EC",
                },
                {
                  chain_detected: true,
                  coinCode: "OP",
                  coinName: "Optimism",
                  coinSymbol: "https://media.loch.one/loch-optimism.svg",
                  coinColor: "#FF0420",
                },
                {
                  chain_detected: true,
                  coinCode: "POLYGON",
                  coinName: "Polygon",
                  coinSymbol: "https://media.loch.one/loch-polygon.svg",
                  coinColor: "#8247E5",
                },
                {
                  chain_detected: false,
                  coinCode: "ALGO",
                  coinName: "Algorand",
                  coinSymbol: "https://media.loch.one/loch-algorand.svg",
                  coinColor: "#19191A",
                },
                {
                  chain_detected: false,
                  coinCode: "LTC",
                  coinName: "Litecoin",
                  coinSymbol: "https://media.loch.one/loch-litecoin.svg",
                  coinColor: "#345D9D",
                },
                {
                  chain_detected: false,
                  coinCode: "SOL",
                  coinName: "Solana",
                  coinSymbol: "https://media.loch.one/loch-solana.svg",
                  coinColor: "#5ADDA6",
                },
                {
                  chain_detected: false,
                  coinCode: "TRX",
                  coinName: "Tron",
                  coinSymbol: "https://media.loch.one/loch-tron.svg",
                  coinColor: "#FF060A",
                },
                {
                  chain_detected: false,
                  coinCode: "ADA",
                  coinName: "Cardano",
                  coinSymbol: "https://media.loch.one/loch-cardano.svg",
                  coinColor: "#0033AD",
                },
                {
                  chain_detected: false,
                  coinCode: "XLM",
                  coinName: "Stellar",
                  coinSymbol: "https://media.loch.one/loch-stellar.svg",
                  coinColor: "#19191A",
                },
              ],
              displayAddress: "",
              id: "wallet1",
              loadingNameTag: false,
              nameTag: "",
              nickname: "",
              showAddress: true,
              showNameTag: false,
              showNickname: false,
              wallet_metadata: {},
            },
          ],
        },
        {
          address: "0xeB2993A4E44291DA4020102F6D2ed8D14b1Cca4c",
          worth: 38993631.363,
          trimmedAddress: "0xeB2...a4c",
          fullData: [
            {
              address: "0xeB2993A4E44291DA4020102F6D2ed8D14b1Cca4c",
              apiAddress: "0xeB2993A4E44291DA4020102F6D2ed8D14b1Cca4c",
              coinFound: [
                {
                  chain_detected: true,
                  coinCode: "ETH",
                  coinName: "Ethereum",
                  coinSymbol: "https://media.loch.one/loch-ethereum.svg",
                  coinColor: "#7B44DA",
                },
                {
                  chain_detected: true,
                  coinCode: "ARB",
                  coinName: "Arbitrum",
                  coinSymbol: "https://media.loch.one/loch-arbitrum.svg",
                  coinColor: "#2C374B",
                },
                {
                  chain_detected: true,
                  coinCode: "AVAX",
                  coinName: "Avalanche",
                  coinSymbol: "https://media.loch.one/loch-avalanche.svg",
                  coinColor: "#E84042",
                },
                {
                  chain_detected: true,
                  coinCode: "BSC",
                  coinName: "BSC",
                  coinSymbol: "https://media.loch.one/loch-binance.svg",
                  coinColor: "#F0B90B",
                },
                {
                  chain_detected: true,
                  coinCode: "CELO",
                  coinName: "Celo",
                  coinSymbol: "https://media.loch.one/loch-celo.svg",
                  coinColor: "#F4CE6F",
                },
                {
                  chain_detected: true,
                  coinCode: "FTM",
                  coinName: "Fantom",
                  coinSymbol: "https://media.loch.one/loch-fantom.svg",
                  coinColor: "#13B5EC",
                },
                {
                  chain_detected: true,
                  coinCode: "OP",
                  coinName: "Optimism",
                  coinSymbol: "https://media.loch.one/loch-optimism.svg",
                  coinColor: "#FF0420",
                },
                {
                  chain_detected: true,
                  coinCode: "POLYGON",
                  coinName: "Polygon",
                  coinSymbol: "https://media.loch.one/loch-polygon.svg",
                  coinColor: "#8247E5",
                },
                {
                  chain_detected: false,
                  coinCode: "BTC",
                  coinName: "Bitcoin",
                  coinSymbol: "https://media.loch.one/loch-bitcoin.svg",
                  coinColor: "#F19938",
                },
                {
                  chain_detected: false,
                  coinCode: "SOL",
                  coinName: "Solana",
                  coinSymbol: "https://media.loch.one/loch-solana.svg",
                  coinColor: "#5ADDA6",
                },
                {
                  chain_detected: false,
                  coinCode: "LTC",
                  coinName: "Litecoin",
                  coinSymbol: "https://media.loch.one/loch-litecoin.svg",
                  coinColor: "#345D9D",
                },
                {
                  chain_detected: false,
                  coinCode: "ALGO",
                  coinName: "Algorand",
                  coinSymbol: "https://media.loch.one/loch-algorand.svg",
                  coinColor: "#19191A",
                },
                {
                  chain_detected: false,
                  coinCode: "ADA",
                  coinName: "Cardano",
                  coinSymbol: "https://media.loch.one/loch-cardano.svg",
                  coinColor: "#0033AD",
                },
                {
                  chain_detected: false,
                  coinCode: "TRX",
                  coinName: "Tron",
                  coinSymbol: "https://media.loch.one/loch-tron.svg",
                  coinColor: "#FF060A",
                },
                {
                  chain_detected: false,
                  coinCode: "XLM",
                  coinName: "Stellar",
                  coinSymbol: "https://media.loch.one/loch-stellar.svg",
                  coinColor: "#19191A",
                },
              ],
              displayAddress: "",
              id: "wallet1",
              loadingNameTag: false,
              nameTag: "",
              nickname: "",
              showAddress: true,
              showNameTag: false,
              showNickname: false,
              wallet_metadata: {},
            },
          ],
        },
        {
          address: "0x36cc7B13029B5DEe4034745FB4F24034f3F2ffc6",
          worth: 111935898.211,
          trimmedAddress: "0x36c...fc6",
          fullData: [
            {
              address: "0x36cc7B13029B5DEe4034745FB4F24034f3F2ffc6",
              apiAddress: "0x36cc7B13029B5DEe4034745FB4F24034f3F2ffc6",
              coinFound: [
                {
                  chain_detected: false,
                  coinCode: "SOL",
                  coinName: "Solana",
                  coinSymbol: "https://media.loch.one/loch-solana.svg",
                  coinColor: "#5ADDA6",
                },
                {
                  chain_detected: false,
                  coinCode: "LTC",
                  coinName: "Litecoin",
                  coinSymbol: "https://media.loch.one/loch-litecoin.svg",
                  coinColor: "#345D9D",
                },
                {
                  chain_detected: false,
                  coinCode: "BTC",
                  coinName: "Bitcoin",
                  coinSymbol: "https://media.loch.one/loch-bitcoin.svg",
                  coinColor: "#F19938",
                },
                {
                  chain_detected: false,
                  coinCode: "ALGO",
                  coinName: "Algorand",
                  coinSymbol: "https://media.loch.one/loch-algorand.svg",
                  coinColor: "#19191A",
                },
                {
                  chain_detected: true,
                  coinCode: "ETH",
                  coinName: "Ethereum",
                  coinSymbol: "https://media.loch.one/loch-ethereum.svg",
                  coinColor: "#7B44DA",
                },
                {
                  chain_detected: true,
                  coinCode: "ARB",
                  coinName: "Arbitrum",
                  coinSymbol: "https://media.loch.one/loch-arbitrum.svg",
                  coinColor: "#2C374B",
                },
                {
                  chain_detected: true,
                  coinCode: "AVAX",
                  coinName: "Avalanche",
                  coinSymbol: "https://media.loch.one/loch-avalanche.svg",
                  coinColor: "#E84042",
                },
                {
                  chain_detected: true,
                  coinCode: "BSC",
                  coinName: "BSC",
                  coinSymbol: "https://media.loch.one/loch-binance.svg",
                  coinColor: "#F0B90B",
                },
                {
                  chain_detected: true,
                  coinCode: "CELO",
                  coinName: "Celo",
                  coinSymbol: "https://media.loch.one/loch-celo.svg",
                  coinColor: "#F4CE6F",
                },
                {
                  chain_detected: true,
                  coinCode: "FTM",
                  coinName: "Fantom",
                  coinSymbol: "https://media.loch.one/loch-fantom.svg",
                  coinColor: "#13B5EC",
                },
                {
                  chain_detected: true,
                  coinCode: "OP",
                  coinName: "Optimism",
                  coinSymbol: "https://media.loch.one/loch-optimism.svg",
                  coinColor: "#FF0420",
                },
                {
                  chain_detected: true,
                  coinCode: "POLYGON",
                  coinName: "Polygon",
                  coinSymbol: "https://media.loch.one/loch-polygon.svg",
                  coinColor: "#8247E5",
                },
                {
                  chain_detected: false,
                  coinCode: "ADA",
                  coinName: "Cardano",
                  coinSymbol: "https://media.loch.one/loch-cardano.svg",
                  coinColor: "#0033AD",
                },
                {
                  chain_detected: false,
                  coinCode: "TRX",
                  coinName: "Tron",
                  coinSymbol: "https://media.loch.one/loch-tron.svg",
                  coinColor: "#FF060A",
                },
                {
                  chain_detected: false,
                  coinCode: "XLM",
                  coinName: "Stellar",
                  coinSymbol: "https://media.loch.one/loch-stellar.svg",
                  coinColor: "#19191A",
                },
              ],
              displayAddress: "",
              id: "wallet1",
              loadingNameTag: false,
              nameTag: "",
              nickname: "",
              showAddress: true,
              showNameTag: false,
              showNickname: false,
              wallet_metadata: {},
            },
          ],
        },
        {
          address: "0x6555e1cc97d3cba6eaddebbcd7ca51d75771e0b8",
          worth: 13063071.304580584,
          trimmedAddress: "0x655...0b8",
          fullData: [
            {
              address: "0x6555e1cc97d3cba6eaddebbcd7ca51d75771e0b8",
              apiAddress: "0x6555e1cc97d3cba6eaddebbcd7ca51d75771e0b8",
              coinFound: [
                {
                  chain: {
                    active: true,
                    code: "ETH",
                    color: "#7B44DA",
                    created_on: "2022-09-27 20:01:48.928000+00:00",
                    default_asset_code: "ETH",
                    default_asset_id: "ethereum",
                    id: "633356acb6afee98bcd4436b",
                    is_evm: true,
                    modified_on: "2022-12-19 12:35:33.439000+00:00",
                    name: "Ethereum",
                    parent: null,
                    platform_code: "ETH",
                    platform_id: "ethereum",
                    symbol: "https://media.loch.one/loch-ethereum.svg",
                  },
                  value: 89730.52363307549,
                },
                {
                  chain: {
                    active: true,
                    code: "OP",
                    color: "#FF0420",
                    created_on: "2022-09-27 20:01:48.937000+00:00",
                    default_asset_code: "OP",
                    default_asset_id: "optimism",
                    id: "633356acb6afee98bcd44375",
                    is_evm: true,
                    modified_on: "2022-12-19 12:35:33.477000+00:00",
                    name: "Optimism",
                    parent: "633356acb6afee98bcd4436b",
                    platform_code: "OPTIMISM",
                    platform_id: "optimistic-ethereum",
                    symbol: "https://media.loch.one/loch-optimism.svg",
                  },
                  value: 5.861565e-7,
                },
                {
                  chain: {
                    active: true,
                    code: "ARB",
                    color: "#2C374B",
                    created_on: "2022-09-27 20:01:48.937000+00:00",
                    default_asset_code: "ETH",
                    default_asset_id: "ethereum",
                    id: "633356acb6afee98bcd44376",
                    is_evm: true,
                    modified_on: "2022-12-19 12:35:33.479000+00:00",
                    name: "Arbitrum",
                    parent: "633356acb6afee98bcd4436b",
                    platform_code: "ARBITRUM",
                    platform_id: "arbitrum-one",
                    symbol: "https://media.loch.one/loch-arbitrum.svg",
                  },
                  value: 0.0005861565,
                },
                {
                  chain: {
                    active: true,
                    code: "CELO",
                    color: "#F4CE6F",
                    created_on: "2022-09-27 20:01:48.934000+00:00",
                    default_asset_code: "CELO",
                    default_asset_id: "celo",
                    id: "633356acb6afee98bcd44372",
                    is_evm: true,
                    modified_on: "2022-12-19 12:35:33.461000+00:00",
                    name: "Celo",
                    parent: "633356acb6afee98bcd4436b",
                    platform_code: "CELO",
                    platform_id: "celo",
                    symbol: "https://media.loch.one/loch-celo.svg",
                  },
                  value: 0,
                },
                {
                  chain: {
                    active: false,
                    code: "AURORA",
                    color: "#78D64B",
                    created_on: "2022-09-27 20:01:48.940000+00:00",
                    default_asset_code: "AUR",
                    default_asset_id: "aurora",
                    id: "633356acb6afee98bcd4437a",
                    is_evm: true,
                    modified_on: "2022-12-19 12:35:33.488000+00:00",
                    name: "Aurora",
                    parent: "633356acb6afee98bcd4436b",
                    platform_code: "AURORA",
                    platform_id: "aurora",
                    symbol: "https://media.loch.one/loch-aurora.svg",
                  },
                  value: 0,
                },
                {
                  chain: {
                    active: true,
                    code: "AVAX",
                    color: "#E84042",
                    created_on: "2022-09-27 20:01:48.932000+00:00",
                    default_asset_code: "AVAX",
                    default_asset_id: "avalanche-2",
                    id: "633356acb6afee98bcd4436f",
                    is_evm: true,
                    modified_on: "2022-12-19 12:35:33.449000+00:00",
                    name: "Avalanche",
                    parent: "633356acb6afee98bcd4436b",
                    platform_code: "AVALANCHE",
                    platform_id: "avalanche",
                    symbol: "https://media.loch.one/loch-avalanche.svg",
                  },
                  value: 0,
                },
                {
                  chain: {
                    active: true,
                    code: "BSC",
                    color: "#F0B90B",
                    created_on: "2022-09-27 20:01:48.932000+00:00",
                    default_asset_code: "BNB",
                    default_asset_id: "binancecoin",
                    id: "633356acb6afee98bcd4436e",
                    is_evm: true,
                    modified_on: "2022-12-19 12:35:33.447000+00:00",
                    name: "BSC",
                    parent: "633356acb6afee98bcd4436b",
                    platform_code: "BSC",
                    platform_id: "binance-smart-chain",
                    symbol: "https://media.loch.one/loch-binance.svg",
                  },
                  value: 0.553348,
                },
                {
                  chain: {
                    active: true,
                    code: "FTM",
                    color: "#13B5EC",
                    created_on: "2022-09-27 20:01:48.933000+00:00",
                    default_asset_code: "FTM",
                    default_asset_id: "fantom",
                    id: "633356acb6afee98bcd44370",
                    is_evm: true,
                    modified_on: "2022-12-19 12:35:33.453000+00:00",
                    name: "Fantom",
                    parent: "633356acb6afee98bcd4436b",
                    platform_code: "FANTOM",
                    platform_id: "fantom",
                    symbol: "https://media.loch.one/loch-fantom.svg",
                  },
                  value: 0.0812094,
                },
                {
                  chain: {
                    active: true,
                    code: "POLYGON",
                    color: "#8247E5",
                    created_on: "2022-09-27 20:01:48.934000+00:00",
                    default_asset_code: "MATIC",
                    default_asset_id: "matic-network",
                    id: "633356acb6afee98bcd44371",
                    is_evm: true,
                    modified_on: "2022-12-19 12:35:33.458000+00:00",
                    name: "Polygon",
                    parent: "633356acb6afee98bcd4436b",
                    platform_code: "POLYGON",
                    platform_id: "polygon-pos",
                    symbol: "https://media.loch.one/loch-polygon.svg",
                  },
                  value: 0,
                },
              ],
              displayAddress: "",
              id: "wallet1",
              loadingNameTag: false,
              nameTag: "",
              nickname: "",
              showAddress: true,
              showNameTag: false,
              showNickname: false,
              wallet_metadata: {},
            },
          ],
        },
      ],
      addButtonVisible: false,
      currency: JSON.parse(window.localStorage.getItem("currency")),
      isTrendingAddresses: false,
      signInModalAnimation: true,
      signInModal: false,
      showClickSignInText: false,
      condition: [],
      sort: [{ key: SORT_BY_AMOUNT, value: false }],
      pageLimit: 1,
      accountList: [],
      totalPage: 0,
      tableLoading: false,
      goToBottom: false,
      initialInput: false,
      isGoButtonsDisabled: false,
      isAddAnotherButtonsDisabled: false,
      authmodal: "",
      leaderboardSignIn: false,
      email: "",
      otp: "",
      emailSignup: "",
      walletInput: [
        {
          id: `wallet1`,
          address: "",
          coins: [],
          displayAddress: "",
          wallet_metadata: {},
          nickname: "",
          showAddress: true,
          showNickname: true,
          apiAddress: "",
          showNameTag: true,
          nameTag: "",
        },
      ],
    };
  }

  toggleAuthModal = (val = "") => {
    if (val !== "signup") {
      this.setState({
        isReferralCodeStep: false,
      });
    }
    this.setState({
      authmodal: val,
    });
  };

  showSignInModal = () => {
    this.setState({
      signInModal: true,
    });
  };
  hideSignInSignUpModal = () => {
    this.setState({
      signInModalAnimation: true,
      signInModal: false,
    });
  };
  openSignUpModal = () => {
    this.setState({
      signInModalAnimation: false,
      signInModal: false,
    });
  };
  handleOnChange = (e) => {
    let { name, value } = e.target;
    if (value === "") {
      this.setState({
        isTrendingAddresses: false,
      });
    }
    let walletCopy = [...this.state.walletInput];
    let foundIndex = walletCopy.findIndex((obj) => obj.id === name);
    if (foundIndex > -1) {
      let prevValue = walletCopy[foundIndex].address;

      walletCopy[foundIndex].address = value;
      if (value === "" || prevValue !== value) {
        walletCopy[foundIndex].coins = [];
      }
      if (value === "") {
        walletCopy[foundIndex].coinFound = false;
        walletCopy[foundIndex].nickname = "";
      }
      // walletCopy[foundIndex].trucatedAddress = value
    }
    this.setState({
      addButtonVisible: this.state.walletInput.some((wallet) =>
        wallet.address ? true : false
      ),
      walletInput: walletCopy,
    });
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    // timeout;
    this.timeout = setTimeout(() => {
      this.getCoinBasedOnWalletAddress(name, value);
    }, 1000);
  };
  // handleDarkMode = () => {
  //   const darkOrLight = document
  //     .querySelector("body")
  //     .getAttribute("data-theme");
  //   if (darkOrLight === "dark") {
  //     // setIsDarkMode(false);
  //     this.setState({
  //       isDarkMode: false,
  //     });
  //     switchToLightMode();
  //     this.props.SwitchDarkMode(false);
  //   } else {
  //     switchToDarkMode();
  //     this.setState({
  //       isDarkMode: true,
  //     });
  //     // setIsDarkMode(true);
  //     this.props.SwitchDarkMode(true);
  //   }
  // };

  handleDarkMode = (status = "light") => {
    const darkOrLight = document
      .querySelector("body")
      .getAttribute("data-theme");
    if (darkOrLight === "dark") {
      this.setState({
        isDarkMode: false,
      });
      switchToLightMode();
      this.props.SwitchDarkMode(false);
      ToggleDarkModeAnalytics({
        toggle_button_location: "Landing Page",
        mode_from: "Dark",
        mode_to: "Light",
        isMobile: mobileCheck(),
      });
    } else {
      switchToDarkMode();
      this.setState({
        isDarkMode: true,
      });
      this.props.SwitchDarkMode(true);
      ToggleDarkModeAnalytics({
        toggle_button_location: "Landing Page",
        mode_from: "Dark",
        mode_to: "Light",
        isMobile: mobileCheck(),
      });
    }
    // if (darkOrLight === "dark") {
    //   setIsDarkMode('light');
    //   switchToLightMode();
    //   props.SwitchDarkMode(false);
    // } else {
    //   switchToDarkMode();
    //   setIsDarkMode(true);
    //   props.SwitchDarkMode(true);
    // }
  };

  isDisabled = () => {
    let isDisableAddFlagCount = 0;
    let isDisableGoFlagCount = 0;

    this.state.walletInput?.forEach((e, eIndex) => {
      if (eIndex === this.state.walletInput.length - 1 && e.address === "") {
        isDisableGoFlagCount++;
      } else {
        let isDisableFlag = false;
        if (e.address) {
          e.coins.forEach((a) => {
            if (a.chain_detected === true) {
              isDisableFlag = true;
              return;
            }
          });
        }
        if (isDisableFlag) {
          isDisableAddFlagCount++;
          isDisableGoFlagCount++;
        }
      }
    });
    if (
      this.state.walletInput.length > 0 &&
      isDisableGoFlagCount === this.state.walletInput.length
    ) {
      this.setState({
        isGoButtonsDisabled: false,
      });
    } else {
      this.setState({
        isGoButtonsDisabled: true,
      });
    }
    if (
      this.state.walletInput.length > 0 &&
      isDisableAddFlagCount === this.state.walletInput.length
    ) {
      this.setState({
        isAddAnotherButtonsDisabled: false,
      });
    } else {
      this.setState({
        isAddAnotherButtonsDisabled: true,
      });
    }
  };
  handleSetCoin = (data) => {
    let coinList = {
      chain_detected: data.chain_detected,
      coinCode: data.coinCode,
      coinName: data.coinName,
      coinSymbol: data.coinSymbol,
      coinColor: data.coinColor,
    };
    let newCoinList = [];
    newCoinList.push(coinList);
    data.subChains &&
      data.subChains?.map((item) =>
        newCoinList.push({
          chain_detected: data.chain_detected,
          coinCode: item.code,
          coinName: item?.name,
          coinSymbol: item.symbol,
          coinColor: item.color,
        })
      );
    let i = this.state.walletInput.findIndex((obj) => obj.id === data.id);
    let newAddress = [...this.state.walletInput];

    //new code
    data.address !== newAddress[i].address
      ? (newAddress[i].coins = [])
      : newAddress[i].coins.push(...newCoinList);

    // if (data.id === newAddress[i].id) {
    //   newAddress[i].address = data.address;
    // }

    newAddress[i].coinFound = newAddress[i].coins.some(
      (e) => e.chain_detected === true
    );

    newAddress[i].apiAddress = data?.apiaddress;

    this.setState({
      walletInput: newAddress,
    });
  };
  handleSetNameTag = (data, nameTag) => {
    let newAddress = [...this.state.walletInput];
    let index = this.state.walletInput.findIndex((obj) => obj.id === data.id);

    if (index < newAddress.length) {
      newAddress[index] = {
        ...this.state.walletInput[index],
        nameTag: nameTag,
      };
    }
    this.setState({
      walletInput: newAddress,
    });
  };

  handleSetNameTagLoadingFalse = (data) => {
    let newAddress = [...this.state.walletInput];
    let index = this.state.walletInput.findIndex((obj) => obj.id === data.id);

    if (index < newAddress.length) {
      newAddress[index] = {
        ...this.state.walletInput[index],
        loadingNameTag: false,
      };
    }
    this.setState({
      walletInput: newAddress,
    });
  };

  addTrendingAddress = (passedIndex, isMobile) => {
    const tempData = this.state.trendingAddresses[passedIndex].fullData;
    ClickTrendingAddress({
      session_id: getCurrentUser().id,
      address: this.state.trendingAddresses[passedIndex].address,
      isMobile: isMobile,
    });

    // New

    let walletAddress = [];
    let addWallet = tempData;
    let addWalletTemp = tempData;
    addWalletTemp?.forEach((w, i) => {
      w.id = `wallet${i + 1}`;
    });
    if (addWalletTemp && addWalletTemp.length > 0) {
      var mySet = new Set();

      const filteredAddWalletTemp = addWalletTemp.filter((filData) => {
        if (filData?.address !== "") {
          if (mySet.has(filData.address.toLowerCase())) {
            return false;
          } else {
            mySet.add(filData.address.toLowerCase());
            return true;
          }
        }
        return false;
      });
      if (filteredAddWalletTemp) {
        setTimeout(() => {
          this.props.setHeaderReducer(filteredAddWalletTemp);
        }, 500);
      }
    }
    let finalArr = [];

    let addressList = [];

    let nicknameArr = {};

    for (let i = 0; i < addWallet.length; i++) {
      let curr = addWallet[i];
      if (
        !walletAddress.includes(curr.apiAddress?.trim()) &&
        curr.address?.trim()
      ) {
        finalArr.push(curr);
        walletAddress.push(curr.address?.trim());
        walletAddress.push(curr.displayAddress?.trim());
        walletAddress.push(curr.apiAddress?.trim());
        let address = curr.address?.trim();
        nicknameArr[address] = curr.nickname;
        addressList.push(curr.address?.trim());
      }
    }

    finalArr = finalArr?.map((item, index) => {
      return {
        ...item,
        id: `wallet${index + 1}`,
      };
    });
    let creditIsAddress = false;
    let creditIsEns = false;
    for (let i = 0; i < addressList.length; i++) {
      const tempItem = addressList[i];
      const endsWithEth = /\.eth$/i.test(tempItem);

      if (endsWithEth) {
        creditIsAddress = true;
        creditIsEns = true;
      } else {
        creditIsAddress = true;
      }
    }
    if (creditIsAddress) {
      window.localStorage.setItem("addAddressCreditOnce", true);
      if (addWallet.length > 1) {
        window.localStorage.setItem("addMultipleAddressCreditOnce", true);
      }
    }
    if (creditIsEns) {
      window.localStorage.setItem("addEnsCreditOnce", true);
    }
    const data = new URLSearchParams();
    data.append("wallet_addresses", JSON.stringify(addressList));
    data.append("wallet_address_nicknames", JSON.stringify(nicknameArr));
    // data.append("link", );
    if (this.state.lochUser && this.state.lochUser.email) {
      const yieldData = new URLSearchParams();
      yieldData.append("wallet_addresses", JSON.stringify(addressList));

      this.props.updateUserWalletApi(data, this, yieldData, false);
    } else {
      this.props.createAnonymousUserApi(data, this, finalArr, null);
    }
  };
  addAdressesGo = () => {
    if (this.state.areNewAddresses) {
      window.localStorage.setItem("shouldRecallApis", true);
    } else {
      window.localStorage.setItem("shouldRecallApis", false);
    }
    let walletAddress = [];
    let addWallet = this.state.walletInput;
    let addWalletTemp = this.state.walletInput;
    addWalletTemp?.forEach((w, i) => {
      w.id = `wallet${i + 1}`;
    });
    if (addWalletTemp && addWalletTemp.length > 0) {
      var mySet = new Set();

      const filteredAddWalletTemp = addWalletTemp.filter((filData) => {
        if (filData?.address !== "") {
          if (mySet.has(filData.address.toLowerCase())) {
            return false;
          } else {
            mySet.add(filData.address.toLowerCase());
            return true;
          }
        }
        return false;
      });
      if (filteredAddWalletTemp) {
        setTimeout(() => {
          this.props.setHeaderReducer(filteredAddWalletTemp);
        }, 500);
      }
    }
    let finalArr = [];

    let addressList = [];

    let nicknameArr = {};

    for (let i = 0; i < addWallet.length; i++) {
      let curr = addWallet[i];
      if (
        !walletAddress.includes(curr.apiAddress?.trim()) &&
        curr.address?.trim()
      ) {
        finalArr.push(curr);
        walletAddress.push(curr.address?.trim());
        walletAddress.push(curr.displayAddress?.trim());
        walletAddress.push(curr.apiAddress?.trim());
        let address = curr.address?.trim();
        nicknameArr[address] = curr.nickname;
        addressList.push(curr.address?.trim());
      }
    }

    finalArr = finalArr?.map((item, index) => {
      return {
        ...item,
        id: `wallet${index + 1}`,
      };
    });
    let creditIsAddress = false;
    let creditIsEns = false;
    for (let i = 0; i < addressList.length; i++) {
      const tempItem = addressList[i];
      const endsWithEth = /\.eth$/i.test(tempItem);

      if (endsWithEth) {
        creditIsAddress = true;
        creditIsEns = true;
      } else {
        creditIsAddress = true;
      }
    }
    if (creditIsAddress) {
      window.localStorage.setItem("addAddressCreditOnce", true);
      if (addWallet.length > 1) {
        window.localStorage.setItem("addMultipleAddressCreditOnce", true);
      }
    }
    if (creditIsEns) {
      window.localStorage.setItem("addEnsCreditOnce", true);
    }
    const data = new URLSearchParams();
    data.append("wallet_addresses", JSON.stringify(addressList));
    data.append("wallet_address_nicknames", JSON.stringify(nicknameArr));
    // data.append("link", );
    if (this.state.lochUser && this.state.lochUser.email) {
      const yieldData = new URLSearchParams();
      yieldData.append("wallet_addresses", JSON.stringify(addressList));

      this.props.updateUserWalletApi(data, this, yieldData, false);
    } else {
      this.props.createAnonymousUserApi(data, this, finalArr, null);
    }

    const address = finalArr?.map((e) => e.address);

    const unrecog_address = finalArr
      .filter((e) => !e.coinFound)
      .map((e) => e.address);

    const blockchainDetected = [];
    const nicknames = [];
    finalArr
      .filter((e) => e.coinFound)
      .map((obj) => {
        let coinName = obj.coins
          .filter((e) => e.chain_detected)
          .map((name) => name.coinName);
        let address = obj.address;
        let nickname = obj.nickname;
        blockchainDetected.push({ address: address, names: coinName });
        nicknames.push({ address: address, nickname: nickname });
      });

    LPC_Go({
      addresses: address,
      ENS: address,
      chains_detected_against_them: blockchainDetected,
      unrecognized_addresses: unrecog_address,
      unrecognized_ENS: unrecog_address,
      nicknames: nicknames,
    });
  };
  getCoinBasedOnWalletAddress = (name, value) => {
    let parentCoinList = this.props.OnboardingState.parentCoinList;
    if (parentCoinList && value) {
      const regex = /\.eth$/;
      if (!regex.test(value)) {
        this.props.detectNameTag(
          {
            id: name,
            address: value,
          },
          this,
          false
        );
      } else {
        this.handleSetNameTagLoadingFalse({
          id: name,
          address: value,
        });
        this.handleSetNameTag(
          {
            id: name,
            address: value,
          },
          ""
        );
      }
      window.localStorage.removeItem("shouldRecallApis");
      const tempWalletAddress = [value];
      const data = new URLSearchParams();
      data.append("wallet_addresses", JSON.stringify(tempWalletAddress));
      this.props.isNewAddress(data, (resFromApi) => {
        if (this.state.walletInput.length === 1) {
          this.setState({
            areNewAddresses: resFromApi,
          });
        } else {
          if (resFromApi && this.state.isPrevAddressNew) {
            this.setState({
              areNewAddresses: true,
            });
          } else {
            this.setState({
              areNewAddresses: false,
              isPrevAddressNew: false,
            });
          }
        }
      });

      for (let i = 0; i < parentCoinList.length; i++) {
        this.props.detectCoin(
          {
            id: name,
            coinCode: parentCoinList[i].code,
            coinSymbol: parentCoinList[i].symbol,
            coinName: parentCoinList[i].name,
            address: value,
            coinColor: parentCoinList[i].color,
            subChains: parentCoinList[i].sub_chains,
          },
          this,
          false,
          0,
          false,
          false
        );
      }
    }
  };
  nicknameOnChain = (e) => {
    let { name, value } = e.target;
    let walletCopy = [...this.state.walletInput];
    let foundIndex = walletCopy.findIndex((obj) => obj.id === name);
    if (foundIndex > -1) {
      // let prevValue = walletCopy[foundIndex].nickname;

      walletCopy[foundIndex].nickname = value;

      // walletCopy[foundIndex].trucatedAddress = value
    }

    this.setState({
      // addButtonVisible: this.state.walletInput.some((wallet) =>
      //   wallet.address ? true : false
      // ),
      walletInput: walletCopy,
    });
  };
  FocusInInput = (e) => {
    let { name } = e.target;
    let walletCopy = [...this.state.walletInput];
    let foundIndex = walletCopy.findIndex((obj) => obj.id === name);
    // if (foundIndex > -1) {
    //   // let prevValue = walletCopy[foundIndex].nickname;

    //   walletCopy[foundIndex].showAddress = true;
    //   walletCopy[foundIndex].showNickname = true;

    //   // walletCopy[foundIndex].trucatedAddress = value
    // }
    walletCopy?.map((address, i) => {
      if (address.id === name) {
        walletCopy[i].showAddress = true;
        walletCopy[i].showNickname = true;
      } else {
        walletCopy[i].showAddress =
          walletCopy[i].nickname === "" ? true : false;
        walletCopy[i].showNickname =
          walletCopy[i].nickname !== "" ? true : false;
      }
    });

    this.setState({
      // addButtonVisible: this.state.walletInput.some((wallet) =>
      //   wallet.address ? true : false
      // ),
      walletInput: walletCopy,
    });
  };
  hideisTrendingAddressesAddress = () => {
    this.setState({ isTrendingAddresses: false });
  };
  showisTrendingAddressesAddress = () => {
    this.setState({ isTrendingAddresses: true });
  };
  showInitialInput = () => {
    this.setState({
      initialInput: true,
    });
  };
  hideInitialInput = () => {
    this.setState({
      initialInput: false,
    });
  };
  addInputField = () => {
    if (this.state.walletInput.length + 1 <= 10) {
      this.state.walletInput.push({
        id: `wallet${this.state.walletInput.length + 1}`,
        address: "",
        coins: [],
        nickname: "",
        showAddress: true,
        showNickname: true,
        showNameTag: true,
        nameTag: "",
      });
      this.setState(
        {
          walletInput: this.state.walletInput,
        },
        () => {
          document
            .getElementById(`newWelcomeWallet-${this.state.walletInput.length}`)
            .focus();
        }
      );
      AddTextbox({
        session_id: getCurrentUser().id,
      });
    }
  };
  deleteInputField = (index, wallet) => {
    this.state.walletInput?.splice(index, 1);
    this.state.walletInput?.map((w, i) => (w.id = `wallet${i + 1}`));
    DeleteWalletAddress({
      address: wallet.address,
    });
    this.setState(
      {
        walletInput: this.state.walletInput,
      },
      () => {
        if (this.state.walletInput.length === 1) {
          this.setState({
            addButtonVisible: this.state.walletInput.some((wallet) =>
              wallet.address ? true : false
            ),
          });
        }
        let chainNotDetected = false;

        this.state.walletInput.forEach((indiWallet) => {
          let anyCoinPresent = false;
          if (
            indiWallet.coins &&
            indiWallet.coinFound &&
            indiWallet.coins.length > 0
          ) {
            indiWallet.coins.forEach((indiCoin) => {
              if (indiCoin?.chain_detected) {
                anyCoinPresent = true;
              }
            });
          }
          if (!anyCoinPresent) {
            chainNotDetected = true;
          }
        });

        if (chainNotDetected) {
          this.setState({
            disableGoBtn: true,
          });
        } else {
          this.setState({
            disableGoBtn: false,
          });
        }
      }
    );
  };
  startPageView = () => {
    this.setState({ startTime: new Date() * 1 });
    if (mobileCheck()) {
      OnboardingMobilePage({});
    } else {
      OnboardingPage({});
    }
    window.checkMobileWelcomeTimer = setInterval(() => {
      this.checkForInactivity();
    }, 900000);
  };
  updateTimer = (first) => {
    const tempExistingExpiryTime = window.localStorage.getItem(
      "mobileWelcomePageExpiryTime"
    );
    if (!tempExistingExpiryTime && !first) {
      this.startPageView();
    }
    const tempExpiryTime = Date.now() + 1800000;
    window.localStorage.setItem("mobileWelcomePageExpiryTime", tempExpiryTime);
  };

  onPageChange = (mobile = true) => {
    ClickedPageChangeWelcomeLeaderboard({
      session_id: getCurrentUser().id,
      isMobile: mobile,
    });
    this.setState({
      goToBottom: true,
    });
  };

  handleFollowUnfollow = (walletAddress, addItem, tagName) => {
    let tempWatchListata = new URLSearchParams();
    ClickedFollowLeaderboard({
      session_id: getCurrentUser().id,
      address: walletAddress,
      isMobile: false,
    });
    if (addItem) {
      this.updateTimer();
      tempWatchListata.append("wallet_address", walletAddress);
      tempWatchListata.append("analysed", false);
      tempWatchListata.append("remarks", "");
      tempWatchListata.append("name_tag", tagName);
      this.props.updateAddToWatchList(tempWatchListata);
      const tempIsModalPopuRemoved = window.localStorage.getItem(
        "smartMoneyMobilePopupModal"
      );
      if (!tempIsModalPopuRemoved) {
        window.localStorage.setItem("smartMoneyMobilePopupModal", "true");
        this.setState({
          mobilePopupModal: true,
        });
      }
    } else {
      // this.updateTimer();
      tempWatchListata.append("address", walletAddress);
      this.props.removeFromWatchList(tempWatchListata);
    }
  };

  callApi = (page = START_INDEX) => {
    this.setState({ tableLoading: true });
    setTimeout(() => {
      let data = new URLSearchParams();
      data.append("start", page * this.state.pageLimit);
      data.append("conditions", JSON.stringify(this.state.condition));
      data.append("limit", this.state.pageLimit);
      data.append("sorts", JSON.stringify(this.state.sort));
      this.props.getSmartMoney(data, this, this.state.pageLimit);
    }, 300);
  };

  opneLoginModalForSmartMoney = () => {
    SignInOnClickWelcomeLeaderboard({
      session_id: getCurrentUser().id,
      isMobile: false,
    });
    this.toggleAuthModal("login");
    this.setState({
      smartMoneyLogin: true,
      leaderboardSignIn: true,
    });
  };
  componentDidMount() {
    this.props.history.push("/copy-trade-welcome");
    // setTimeout(() => {
    //   this.setState({
    //     canCallConnectWalletFun: true,
    //   });
    // }, 1500);
    // if (mobileCheck(true)) {
    //   this.setState({
    //     isMobileDevice: true,
    //   });
    // }
    // scrollToTop();
    // this.props.setHeaderReducer([]);
    // this.setState({ startTime: new Date() * 1 });
    // let currencyRates = JSON.parse(
    //   window.localStorage.getItem("currencyRates")
    // );
    // getAllCurrencyRatesApi();
    // if (getToken()) {
    //   this.props.history.push("/home");
    // }
    // if (getToken()) {
    //   let isStopRedirect =
    //     window.localStorage.getItem("stop_redirect") &&
    //     JSON.parse(window.localStorage.getItem("stop_redirect"));
    //   if (isStopRedirect) {
    //     this.props.setPageFlagDefault();

    //     // if (!mobileCheck()) {
    //     // deleteToken();
    //     // }
    //   } else {
    //     // check if user is signed in or not if yes reidrect them to home page if not delete tokens and redirect them to welcome page
    //     let user = window.localStorage.getItem("lochUser")
    //       ? JSON.parse(window.localStorage.getItem("lochUser"))
    //       : false;
    //     if (user) {
    //       // if (!mobileCheck()) {
    //       // deleteToken();
    //       // } else {
    //       // this.props.history.push("/home");
    //       // }
    //     } else {
    //       this.props.setPageFlagDefault();
    //       // if (!mobileCheck()) {
    //       // deleteToken();
    //       // }
    //       //  window.localStorage.setItem("defi_access", true);
    //       //  window.localStorage.setItem("isPopup", true);
    //       //  // window.localStorage.setItem("whalepodview", true);
    //       //  window.localStorage.setItem(
    //       //    "whalepodview",
    //       //    JSON.stringify({ access: true, id: "" })
    //       //  );
    //       // window.localStorage.setItem(
    //       //   "isSubmenu",
    //       //   JSON.stringify({
    //       //     me: false,
    //       //     discover: false,
    //       //     intelligence: false,
    //       //   })
    //       // );
    //       setLocalStoraage();
    //       let isRefresh = JSON.parse(window.localStorage.getItem("refresh"));
    //       if (!isRefresh) {
    //         window.localStorage.setItem("refresh", true);
    //         window.location.reload(true);
    //       }
    //     }
    //   }
    // } else {
    //   this.props.setPageFlagDefault();
    //   // if (!mobileCheck()) {
    //   // deleteToken();
    //   // }
    //   // window.localStorage.setItem("defi_access", true);
    //   // window.localStorage.setItem("isPopup", true);
    //   // // window.localStorage.setItem("whalepodview", true);
    //   // window.localStorage.setItem(
    //   //   "whalepodview",
    //   //   JSON.stringify({ access: true, id: "" })
    //   // );
    //   // // window.localStorage.setItem("isSubmenu", false);
    //   //  window.localStorage.setItem(
    //   //    "isSubmenu",
    //   //    JSON.stringify({
    //   //      me: false,
    //   //      discover: false,
    //   //      intelligence: false,
    //   //    })
    //   //  );
    //   setLocalStoraage();
    //   let isRefresh = JSON.parse(window.localStorage.getItem("refresh"));
    //   if (!isRefresh) {
    //     window.localStorage.setItem("refresh", true);
    //     window.location.reload(true);
    //   }
    // }
    // // For input
    // this.setState({
    //   addButtonVisible: this.state.walletInput.some((wallet) =>
    //     wallet.address ? true : false
    //   ),
    // });

    // this.props.getAllCoins();
    // this.props.getAllParentChains();
    // this.setState({
    //   userPlan: JSON.parse(window.localStorage.getItem("currentPlan")),
    // });

    // this.props.GetAllPlan();

    // // For smart money

    // let token = window.localStorage.getItem("lochToken");
    // let lochUser = JSON.parse(window.localStorage.getItem("lochUser"));

    // if (token && lochUser && lochUser.email) {
    //   this.setState({
    //     blurTable: false,
    //   });
    // } else {
    //   this.setState({
    //     blurTable: true,
    //   });
    // }

    // if (API_LIMIT) {
    //   if (mobileCheck()) {
    //     this.setState({
    //       pageLimit: 5,
    //     });
    //   } else {
    //     this.setState({
    //       pageLimit: API_LIMIT,
    //     });
    //   }
    // }
    // // window.localStorage.setItem("previewAddress", "");
    // this.props.history.replace({
    //   search: `?p=${this.state.currentPage || START_INDEX}`,
    // });
    // this.callApi(this.state.currentPage || START_INDEX);

    // // this.startPageView();

    // this.startPageView();
    // this.updateTimer(true);
    // return () => {
    //   clearInterval(window.checkMobileWelcomeTimer);
    // };
  }

  checkForInactivity = () => {
    const tempExpiryTime = window.localStorage.getItem(
      "mobileWelcomePageExpiryTime"
    );
    if (tempExpiryTime && tempExpiryTime < Date.now()) {
      this.endPageView();
    }
  };

  endPageView = () => {
    clearInterval(window.checkMobileWelcomeTimer);
    window.localStorage.removeItem("mobileWelcomePageExpiryTime");
    if (this.state.startTime) {
      let endTime = new Date() * 1;
      let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
      if (mobileCheck()) {
        TimeSpentOnboardingMobile({
          time_spent: TimeSpent,
        });
      } else {
        TimeSpentOnboarding({
          time_spent: TimeSpent,
        });
      }
    }
  };

  componentWillUnmount() {
    const tempExpiryTime = window.localStorage.getItem(
      "mobileWelcomePageExpiryTime"
    );
    if (tempExpiryTime) {
      this.endPageView();
    }
  }

  checkUser = () => {
    let token = window.localStorage.getItem("lochToken");
    let lochUser = JSON?.parse(window.localStorage.getItem("lochUser"));
    if (token && lochUser && lochUser?.email) {
      return true;
    } else {
      return false;
    }
  };

  handleSubmitEmail = (val = false) => {
    if (this.state.email) {
      const data = new URLSearchParams();
      data.append(
        "email",
        this.state.email ? this.state.email.toLowerCase() : ""
      );
      EmailAddressAdded({ email_address: this.state.email, session_id: "" });
      signIn(this, data, true, val);
      // this.toggleAuthModal('verify');
    }
  };

  handleSubmitEmailSignup = () => {
    if (this.state.emailSignup) {
      const data = new URLSearchParams();
      data.append(
        "email",
        this.state.email ? this.state.email.toLowerCase() : ""
      );
      data.append("signed_up_from", "welcome");
      data.append("referral_code", this.state.referralCode);
      EmailAddressAddedSignUp({
        email_address: this.state.emailSignup,
        session_id: "",
      });

      this.props.signUpWelcome(
        this,
        data,
        this.toggleAuthModal,
        this.stopReferallButtonLoading
      );
    }
  };

  handleSubmitOTP = () => {
    if (this.state.otp && this.state.otp.length > 5) {
      const data = new URLSearchParams();
      data.append(
        "email",
        this.state.email ? this.state.email.toLowerCase() : ""
      );
      data.append("otp_token", this.state.otp);
      this.props.verifyUser(this, data, true, this.state.smartMoneyLogin);
    }
  };

  changePageLimit = (dropdownResponse) => {
    ClickedPageLimitWelcomeLeaderboard({
      session_id: getCurrentUser().id,
      isMobile: false,
    });
    const tempHolder = dropdownResponse.split(" ");
    if (tempHolder && tempHolder.length > 1) {
      const params = new URLSearchParams(this.props.location.search);
      params.set("p", 0);
      if (this.props.history) {
        this.props.history.push(
          `${this.props.history.location.pathname}?${params}`
        );
      }
      // SmartMoneyChangeLimit({
      //   session_id: getCurrentUser().id,
      //   email_address: getCurrentUser().email,
      //   wallet: tempHolder[1],
      // });
      this.setState({
        pageLimit: tempHolder[1],
      });
    }
  };
  connectWalletEthers = async () => {
    ConnectWalletButtonClickedWelcome({
      session_id: getCurrentUser ? getCurrentUser()?.id : "",
      email_address: getCurrentUser ? getCurrentUser()?.email : "",
    });

    if (this.props.openConnectWallet) {
      this.props.openConnectWallet();
    }
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // try {
    //   const tempRes = await provider.send("eth_requestAccounts", []);
    //   if (tempRes && tempRes.length > 0) {
    //     window.localStorage.setItem("connectWalletCreditOnce", true);
    //     this.addToList(tempRes);
    //   }
    // } catch (error) {
    //   console.log("ethers error ", error);
    // }
  };
  addToList = (addThese) => {
    const curItem = addThese[0];

    if (curItem) {
      this.setState(
        {
          currentMetamaskWallet: {
            address: curItem,
            coinFound: true,
            coins: [],
            displayAddress: curItem,
            nameTag: "",
            nickname: "",
            showAddress: true,
            showNameTag: false,
            showNickname: false,
            wallet_metadata: null,
          },
        },
        () => {
          this.getCoinBasedOnLocalWallet("randomName", curItem);
        }
      );
    }
  };
  getCoinBasedOnLocalWallet = (name, value) => {
    let parentCoinList = this.props.OnboardingState.parentCoinList;
    if (parentCoinList && value) {
      window.localStorage.removeItem("shouldRecallApis");
      const tempWalletAddress = [];
      this.state.walletInput.forEach((e) => {
        if (e.id === name) {
          tempWalletAddress.push(value);
        } else {
          if (e.apiAddress) {
            tempWalletAddress.push(e.apiAddress);
          } else if (e.address) {
            tempWalletAddress.push(e.address);
          }
        }
      });
      const data = new URLSearchParams();
      data.append("wallet_addresses", JSON.stringify(tempWalletAddress));
      this.props.isNewAddress(data);
      for (let i = 0; i < parentCoinList.length; i++) {
        this.props.detectCoin(
          {
            id: name,
            coinCode: parentCoinList[i].code,
            coinSymbol: parentCoinList[i].symbol,
            coinName: parentCoinList[i].name,
            address: value,
            coinColor: parentCoinList[i].color,
            subChains: parentCoinList[i].sub_chains,
          },
          this,
          false,
          0,
          true,
          true
        );
      }
    }
  };
  handleSetCoinByLocalWallet = (data) => {
    let coinList = {
      chain_detected: data.chain_detected,
      coinCode: data.coinCode,
      coinName: data.coinName,
      coinSymbol: data.coinSymbol,
      coinColor: data.coinColor,
    };
    let newCoinList = [];
    newCoinList.push(coinList);
    data.subChains &&
      data.subChains?.map((item) =>
        newCoinList.push({
          chain_detected: data.chain_detected,
          coinCode: item.code,
          coinName: item.name,
          coinSymbol: item.symbol,
          coinColor: item.color,
        })
      );

    let newAddress = this.state.currentMetamaskWallet;
    data.address === newAddress.address &&
      newAddress.coins.push(...newCoinList);
    // new code added
    // if (data.id === newAddress.id) {
    //   newAddress.address = data.address;
    // }

    newAddress.coinFound =
      newAddress.coins &&
      newAddress.coins.some((e) => e.chain_detected === true);
    newAddress.apiAddress = data?.apiaddress;

    this.setState(
      {
        currentMetamaskWallet: newAddress,
      },
      () => {
        if (this.timeout) {
          clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => {
          this.callUpdateApi(this.state.currentMetamaskWallet);
        }, 2000);
      }
    );
  };
  callUpdateApi = (passedItem) => {
    let walletAddress = JSON.parse(window.localStorage.getItem("addWallet"));
    let addressList = [];
    let nicknameArr = {};
    let walletList = [];
    let arr = [];
    if (walletAddress) {
      walletAddress.forEach((curr) => {
        let isIncluded = false;
        const whatIndex = arr.findIndex(
          (resRes) =>
            resRes.address?.trim()?.toLowerCase() ===
              curr?.address?.trim()?.toLowerCase() ||
            resRes.displayAddress?.trim()?.toLowerCase() ===
              curr?.address?.trim()?.toLowerCase() ||
            resRes.displayAddress?.trim()?.toLowerCase() ===
              curr?.displayAddress?.trim()?.toLowerCase() ||
            resRes.address?.trim()?.toLowerCase() ===
              curr?.displayAddress?.trim()?.toLowerCase()
        );
        if (whatIndex !== -1) {
          isIncluded = true;
        }
        if (!isIncluded && curr.address) {
          walletList.push(curr);
          arr.push(curr.address?.trim());
          nicknameArr[curr.address?.trim()] = curr.nickname;
          arr.push(curr.displayAddress?.trim());
          arr.push(curr.address?.trim());
          addressList.push(curr.address?.trim());
        }
      });
    }
    if (passedItem) {
      if (passedItem.address) {
        // TopBarMetamaskWalletConnected({
        //   session_id: getCurrentUser ? getCurrentUser()?.id : "",
        //   email_address: getCurrentUser ? getCurrentUser()?.email : "",
        //   address: passedItem.address,
        // });

        this.props.setMetamaskConnectedReducer(passedItem.address);
        window.localStorage.setItem(
          "setMetamaskConnectedSessionStorage",
          passedItem.address
        );
      }
      if (!arr.includes(passedItem.address?.trim()) && passedItem.address) {
        walletList.push(passedItem);
        arr.push(passedItem.address?.trim());
        nicknameArr[passedItem.address?.trim()] = passedItem.nickname;
        arr.push(passedItem.displayAddress?.trim());
        arr.push(passedItem.address?.trim());
        addressList.push(passedItem.address?.trim());
      }
    }
    let addWallet = walletList.map((w, i) => {
      return {
        ...w,
        id: `wallet${i + 1}`,
      };
    });
    const data = new URLSearchParams();
    data.append("wallet_addresses", JSON.stringify(addressList));
    data.append("wallet_address_nicknames", JSON.stringify(nicknameArr));
    if (this.state.lochUser && this.state.lochUser.email) {
      const yieldData = new URLSearchParams();
      yieldData.append("wallet_addresses", JSON.stringify(addressList));

      this.props.updateUserWalletApi(data, this, yieldData, false);
    } else {
      this.props.createAnonymousUserApi(data, this, addWallet, null);
    }
    // this.props.updateUserWalletApi(data, this, yieldData);
  };
  onboardingShowConnectModal = (
    address = this.state.onboardingWalletAddress
  ) => {
    this.setState(
      {
        onboardingConnectExchangeModal: true,
      },
      () => {
        if (this.state.onboardingConnectExchangeModal) {
          LPConnectExchange();
        }
      }
    );
  };
  hideOnboardingShowPrevModal = () => {
    this.setState({
      onboardingConnectExchangeModal: false,
    });
  };
  onboardingHandleUpdateConnect = (
    exchanges = this.state.onboardingExchanges
  ) => {
    this.setState({
      onboardingExchanges: exchanges,
    });
  };
  componentDidUpdate(prevProps, prevState) {
    if (prevState.isReferralCodeStep !== this.state.isReferralCodeStep) {
      if (this.state.isReferralCodeStep) {
        WelcomeSignUpModalEmailAdded({
          session_id: getCurrentUser().id,
          email_address: this.state?.emailSignup,
        });
      }
    }
    let sMode = document.querySelector("body").getAttribute("data-theme");
    if (
      prevProps.connectedWalletAddress !== this.props.connectedWalletAddress &&
      this.state.canCallConnectWalletFun
    ) {
      if (this.props.connectedWalletAddress) {
        let connectedWalletEvent = "";
        if (this.props.connectedWalletevents) {
          if (this.props.connectedWalletevents.data) {
            if (this.props.connectedWalletevents.data.properties) {
              if (this.props.connectedWalletevents.data.properties.name) {
                connectedWalletEvent =
                  this.props.connectedWalletevents.data.properties.name;
              }
            }
          }
        }
        window.localStorage.setItem("connectWalletCreditOnce", true);
        ConnectedWalletWelcome({
          session_id: getCurrentUser ? getCurrentUser()?.id : "",
          email_address: getCurrentUser ? getCurrentUser()?.email : "",
          wallet_address: this.props.connectedWalletAddress,
          wallet_name: connectedWalletEvent,
        });

        this.addToList([this.props.connectedWalletAddress]);
      }
    }
    if (this.state.isDarkMode !== (sMode === "dark")) {
      this.setState({
        isDarkMode: sMode === "dark",
      });
    }
    if (prevState.signInModal !== this.state.signInModal) {
      if (!this.state.signInModal) {
        this.setState({
          showClickSignInText: false,
        });
      }
    }
    if (prevState.blurTable !== this.state.blurTable) {
      this.callApi(this.state.currentPage || START_INDEX);
    }
    if (this.state.walletInput !== prevState.walletInput) {
      this.isDisabled();
    }
    if (!this.props.commonState.smart_money) {
      let token = window.localStorage.getItem("lochToken");
      this.props.updateWalletListFlag("smart_money", true);
      let lochUser = JSON.parse(window.localStorage.getItem("lochUser"));
      if (token && lochUser && lochUser.email) {
        this.setState({
          blurTable: false,
        });
      } else {
        this.setState({
          blurTable: true,
        });
      }
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
          scrollToBottomAfterPageChange();
        }
      );
    }
    // chain detection
    // if (prevState?.walletInput !== this.state.walletInput) {
    // }
    const prevParams = new URLSearchParams(prevProps.location.search);
    const prevPage = parseInt(prevParams.get("p") || START_INDEX, 10);

    const params = new URLSearchParams(this.props.location.search);
    const page = parseInt(params.get("p") || START_INDEX, 10);
    if (!this.state.currency && window.localStorage.getItem("currency")) {
      this.setState({
        currency: JSON.parse(window.localStorage.getItem("currency")),
      });
    }
    if (
      prevPage !== page ||
      prevState.condition !== this.state.condition ||
      prevState.sort !== this.state.sort ||
      prevState.pageLimit !== this.state.pageLimit
    ) {
      this.callApi(page);
      this.setState({
        currentPage: page,
      });
      if (prevPage !== page) {
        if (prevPage - 1 === page) {
          // SmartMoneyPagePrev({
          //   session_id: getCurrentUser().id,
          //   email_address: getCurrentUser().email,
          //   page: page + 1,
          //   isMobile: mobileCheck(),
          // });
          // this.updateTimer();
        } else if (prevPage + 1 === page) {
          // SmartMoneyPageNext({
          //   session_id: getCurrentUser().id,
          //   email_address: getCurrentUser().email,
          //   page: page + 1,
          //   isMobile: mobileCheck(),
          // });
          // this.updateTimer();
        } else {
          // SmartMoneyPageSearch({
          //   session_id: getCurrentUser().id,
          //   email_address: getCurrentUser().email,
          //   page: page + 1,
          //   isMobile: mobileCheck(),
          // });
          // this.updateTimer();
        }
      }
    }
  }
  openConfirmLeaveModal = () => {
    this.setState({
      confirmLeave: true,
    });
  };
  closeConfirmLeaveModal = () => {
    this.setState({
      confirmLeave: false,
    });
  };
  handleSignOutWelcome = () => {
    resetUser(true);
    this.setState({
      confirmLeave: false,
      lochUser: undefined,
      blurTable: true,
    });
  };
  blurTables = () => {
    this.setState({
      blurTable: true,
    });
  };
  checkReferralCode = () => {
    if (this.state.referralCode) {
      this.setState({
        isReferralCodeLoading: true,
      });
      const referalValHolderData = new URLSearchParams();
      referalValHolderData.append("code", this.state.referralCode);

      this.props.checkReferallCodeValid(
        referalValHolderData,
        this.handleSubmitEmailSignup,
        this.stopReferallButtonLoading
      );
    }
  };
  stopReferallButtonLoading = (isSignedUp) => {
    if (isSignedUp === true) {
      WelcomeSignedUpReferralCode({
        session_id: getCurrentUser().id,
        email_address: this.state.emailSignup,
        referral_code: this.state.referralCode,
      });
    }
    this.setState({
      isReferralCodeLoading: false,
    });
  };
  handleGoToReferral = () => {
    this.setState({
      isReferralCodeStep: true,
      isReferralCodeLoading: false,
    });
  };
  handleGoBackToSignUp = () => {
    this.setState({
      isReferralCodeStep: false,
    });
  };

  render() {
    if (this.state.isMobileDevice) {
      return (
        <NewWelcomeMobile
          tableLoading={this.state.tableLoading}
          openSignInOnclickModal={this.opneLoginModalForSmartMoney}
          accountList={this.state.accountList}
          exchanges={this.state.onboardingExchanges}
          history={this.props.history}
          location={this.props.location}
          trendingAddresses={this.state.trendingAddresses}
          makeTrendingAddressesVisible={this.makeTrendingAddressesVisible}
          addTrendingAddress={this.addTrendingAddress}
          isTrendingAddresses={this.state.isTrendingAddresses}
          currency={this.state.currency}
          currentPage={this.state.currentPage}
          pageLimit={this.state.pageLimit}
          totalPage={this.state.totalPage}
          onPageChange={this.onPageChange}
          changePageLimit={this.changePageLimit}
          blurTables={this.blurTables}
          blurTable={this.state.blurTable}
          isDarkMode={this.state.isDarkMode}
          handleDarkMode={this.handleDarkMode}
        />
      );
    }
    const tableData = this.state.accountList;

    const columnList = [
      {
        labelName: (
          <div
            className="history-table-header-col no-hover"
            id="Accounts"
            // onClick={() => this.handleSort(this.state.tableSortOpt[0].title)}
          >
            <span className="inter-display-medium f-s-13 lh-16 ">Rank</span>
            {/* <Image
          src={sortByIcon}
          className={
            this.state.tableSortOpt[0].up ? "rotateDown" : "rotateUp"
          }
        /> */}
          </div>
        ),
        dataKey: "Numbering",
        coumnWidth: 0.11,
        isCell: true,
        cell: (rowData, dataKey, index) => {
          if (dataKey === "Numbering" && index > -1) {
            let rank = index + 1;
            if (rowData.rank) {
              rank = rowData.rank;
            }
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={Number(noExponents(rank)).toLocaleString("en-US")}
              >
                <span
                  className="inter-display-medium f-s-13 table-data-font"
                  style={{
                    fontWeight: "700",
                  }}
                >
                  {Number(noExponents(rank)).toLocaleString("en-US")}
                </span>
              </CustomOverlay>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="history-table-header-col no-hover"
            id="Accounts"
            // onClick={() => this.handleSort(this.state.tableSortOpt[0].title)}
          >
            <span className="inter-display-medium f-s-13 lh-16 ">Wallet</span>
            {/* <Image
              src={sortByIcon}
              className={
                this.state.tableSortOpt[0].up ? "rotateDown" : "rotateUp"
              }
            /> */}
          </div>
        ),
        dataKey: "account",

        coumnWidth: 0.145,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "account") {
            return (
              <span
                onClick={() => {
                  SmartMoneyWalletClicked({
                    session_id: getCurrentUser().id,
                    email_address: getCurrentUser().email,
                    wallet: rowData.account,

                    isWelcome: true,
                  });
                  if (this.state.lochUser && this.state.lochUser.email) {
                    this.setState(
                      {
                        initialInput: true,
                      },
                      () => {
                        const fakeOnChange = {
                          target: {
                            name: "wallet1",
                            value: rowData.account,
                          },
                        };
                        this.handleOnChange(fakeOnChange);
                      }
                    );
                  } else {
                    let slink = rowData.account;
                    let shareLink = BASE_URL_S3 + "home/" + slink;
                    window.open(shareLink, "_blank", "noreferrer");
                  }
                }}
                className="top-account-address table-data-font"
              >
                {TruncateText(rowData.account)}
              </span>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className=" history-table-header-col no-hover"
            id="tagName"
            // onClick={() => this.handleSort(this.state.tableSortOpt[5].title)}
          >
            <span className="inter-display-medium f-s-13 lh-16 ">Nametag</span>
            {/* <Image
              src={sortByIcon}
              className={
                this.state.tableSortOpt[5].up ? "rotateDown" : "rotateUp"
              }
            /> */}
          </div>
        ),
        dataKey: "tagName",

        coumnWidth: 0.242,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "tagName") {
            return rowData.tagName ? (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={rowData.tagName}
              >
                <span
                  // onMouseEnter={() => {
                  //   SmartMoneyNameTagHover({
                  //     session_id: getCurrentUser().id,
                  //     email_address: getCurrentUser().email,
                  //     hover: rowData.tagName,
                  //   });
                  //   this.updateTimer();
                  // }}
                  className="table-data-font"
                >
                  {rowData.tagName}
                </span>
              </CustomOverlay>
            ) : (
              "-"
            );
          }
        },
      },
      {
        labelName: (
          <div
            className=" history-table-header-col no-hover"
            id="networth"
            // onClick={() => this.handleSort(this.state.tableSortOpt[1].title)}
          >
            <span className="inter-display-medium f-s-13 lh-16 ">
              Net worth
            </span>
            {/* <Image
              src={sortByIcon}
              className={
                this.state.tableSortOpt[1].up ? "rotateDown" : "rotateUp"
              }
            /> */}
          </div>
        ),
        dataKey: "networth",

        coumnWidth: 0.192,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "networth") {
            let tempNetWorth = rowData.networth
              ? rowData.networth.toFixed(2)
              : 0;
            let tempCurrencyRate = this.state.currency?.rate
              ? this.state.currency.rate
              : 0;
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={
                  CurrencyType(false) +
                  amountFormat(tempNetWorth * tempCurrencyRate, "en-US", "USD")
                }
              >
                <div
                  // onMouseEnter={() => {
                  //   SmartMoneyNetWorthHover({
                  //     session_id: getCurrentUser().id,
                  //     email_address: getCurrentUser().email,
                  //     hover:
                  //       CurrencyType(false) +
                  //       numToCurrency(tempNetWorth * tempCurrencyRate),
                  //   });
                  //   this.updateTimer();
                  // }}
                  className="cost-common-container"
                >
                  <span className="inter-display-medium f-s-13 lh-16 table-data-font">
                    {CurrencyType(false) +
                      numToCurrency(tempNetWorth * tempCurrencyRate)}
                  </span>
                </div>
              </CustomOverlay>
            );
          }
        },
      },
      {
        labelName: (
          <div className=" history-table-header-col no-hover" id="netflows">
            <span className="inter-display-medium f-s-13 lh-16 ">
              Net flows (1 year)
            </span>
          </div>
        ),
        dataKey: "netflows",

        coumnWidth: 0.192,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "netflows") {
            let tempNetflows = rowData.netflows
              ? rowData.netflows.toFixed(2)
              : 0;
            let tempCurrencyRate = this.state.currency?.rate
              ? this.state.currency.rate
              : 0;
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={
                  tempNetflows * tempCurrencyRate
                    ? CurrencyType(false) +
                      amountFormat(
                        Math.abs(tempNetflows * tempCurrencyRate),
                        "en-US",
                        "USD"
                      )
                    : CurrencyType(false) + "0.00"
                }
              >
                <div className="gainLossContainer">
                  <div
                    className={`gainLoss `}
                    // onMouseEnter={() => {
                    //   SmartMoneyRealizedPNLHover({
                    //     session_id: getCurrentUser().id,
                    //     email_address: getCurrentUser().email,
                    //     hover:
                    //       tempNetflows * tempCurrencyRate
                    //         ? CurrencyType(false) +
                    //           amountFormat(
                    //             Math.abs(tempNetflows * tempCurrencyRate),
                    //             "en-US",
                    //             "USD"
                    //           )
                    //         : CurrencyType(false) + "0.00",
                    //   });
                    //   this.updateTimer();
                    // }}
                  >
                    {tempNetflows !== 0 ? (
                      <Image
                        style={{
                          height: "1.5rem",
                          width: "1.5rem",
                        }}
                        src={
                          tempNetflows < 0
                            ? ArrowDownLeftSmallIcon
                            : ArrowUpRightSmallIcon
                        }
                        className="mr-2"
                      />
                    ) : null}
                    <span className="inter-display-medium f-s-13 lh-16 table-data-font">
                      {CurrencyType(false) +
                        numToCurrency(tempNetflows * tempCurrencyRate)}
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
            className=" history-table-header-col no-hover"
            id="netflows"
            // onClick={() => this.handleSort(this.state.tableSortOpt[2].title)}
          >
            <span className="inter-display-medium f-s-13 lh-16 ">
              Unrealized PnL
            </span>
            {/* <Image
              src={sortByIcon}
              className={
                this.state.tableSortOpt[2].up ? "rotateDown" : "rotateUp"
              }
            /> */}
          </div>
        ),
        dataKey: "profits",

        coumnWidth: 0.192,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "profits") {
            let tempProfits = rowData.profits ? rowData.profits.toFixed(2) : 0;
            let tempCurrencyRate = this.state.currency?.rate
              ? this.state.currency.rate
              : 0;
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={
                  tempProfits * tempCurrencyRate
                    ? CurrencyType(false) +
                      amountFormat(
                        Math.abs(tempProfits * tempCurrencyRate),
                        "en-US",
                        "USD"
                      )
                    : CurrencyType(false) + "0.00"
                }
              >
                <div className="gainLossContainer">
                  <div
                    className={`gainLoss `}
                    // onMouseEnter={() => {
                    //   SmartMoneyUnrealizedPNLHover({
                    //     session_id: getCurrentUser().id,
                    //     email_address: getCurrentUser().email,
                    //     hover:
                    //       tempProfits * tempCurrencyRate
                    //         ? CurrencyType(false) +
                    //           amountFormat(
                    //             Math.abs(tempProfits * tempCurrencyRate),
                    //             "en-US",
                    //             "USD"
                    //           )
                    //         : CurrencyType(false) + "0.00",
                    //   });
                    //   this.updateTimer();
                    // }}
                  >
                    {tempProfits !== 0 ? (
                      <Image
                        style={{
                          height: "1.5rem",
                          width: "1.5rem",
                        }}
                        src={
                          tempProfits < 0
                            ? ArrowDownLeftSmallIcon
                            : ArrowUpRightSmallIcon
                        }
                        className="mr-2"
                      />
                    ) : null}
                    <span className="inter-display-medium f-s-13 lh-16 table-data-font">
                      {CurrencyType(false) +
                        numToCurrency(tempProfits * tempCurrencyRate)}
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
      <div className="new-homepage">
        {this.state.confirmLeave ? (
          <ConfirmLeaveModal
            show={this.state.confirmLeave}
            history={this.props.history}
            handleClose={this.closeConfirmLeaveModal}
            handleSignOutWelcome={this.handleSignOutWelcome}
            customMessage="Are you sure you want to Sign out?"
          />
        ) : null}
        {this.state.onboardingConnectExchangeModal ? (
          <ConnectModal
            show={this.state.onboardingConnectExchangeModal}
            onHide={this.hideOnboardingShowPrevModal}
            history={this.props.history}
            headerTitle={"Connect exchanges"}
            modalType={"connectModal"}
            iconImage={LinkIcon}
            ishome={true}
            tracking="landing page"
            walletAddress={this.state.onboardingWalletAddress}
            exchanges={this.state.onboardingExchanges}
            onboardingHandleUpdateConnect={this.onboardingHandleUpdateConnect}
            modalAnimation={false}
          />
        ) : null}
        {this.state.authmodal == "login" ? (
          <Login
            smartMoneyLogin={this.state.smartMoneyLogin}
            toggleModal={this.toggleAuthModal}
            leaderboardSignIn={this.leaderboardSignIn}
            email={this.state.email}
            handleChangeEmail={(val) => {
              this.setState({
                email: val,
              });
            }}
            handleSubmitEmail={this.handleSubmitEmail}
            show={this.state.authmodal == "login"}
          />
        ) : this.state.authmodal == "verify" ? (
          <Verify
            toggleModal={this.toggleAuthModal}
            show={this.state.authmodal == "verify"}
            handleSubmitEmail={this.handleSubmitEmail}
            otp={this.state.otp}
            handleChangeOTP={(val) => {
              this.setState({
                otp: val,
              });
            }}
            handleSubmitOTP={this.handleSubmitOTP}
          />
        ) : this.state.authmodal == "signup" ? (
          <SignUp
            toggleModal={this.toggleAuthModal}
            show={this.state.authmodal == "signup"}
            handleSubmitEmail={this.handleSubmitEmailSignup}
            email={this.state.emailSignup}
            handleChangeEmail={(val) => {
              this.setState({
                emailSignup: val,
              });
            }}
            handleChangeReferralCode={(val) => {
              this.setState({
                referralCode: val,
              });
            }}
            isReferralCodeStep={this.state.isReferralCodeStep}
            referralCode={this.state.referralCode}
            isReferralCodeLoading={this.state.isReferralCodeLoading}
            checkReferralCode={this.checkReferralCode}
            handleGoToReferral={this.handleGoToReferral}
            handleGoBackToSignUp={this.handleGoBackToSignUp}
          />
        ) : this.state.authmodal == "redirect" ? (
          <Redirect
            toggleModal={this.toggleAuthModal}
            show={this.state.authmodal == "redirect"}
          />
        ) : null}
        <div className="new-homepage__header">
          <div className="new-homepage__header-container">
            <div className="d-flex justify-content-between">
              <div
                className="d-flex"
                style={{ gap: "12px", alignItems: "center" }}
              >
                <button
                  onClick={this.connectWalletEthers}
                  className="new-homepage-btn new-homepage-btn--blur"
                >
                  <img src={walletIconsWhite} alt="" />
                  Connect Wallet
                </button>
                <button
                  onClick={this.onboardingShowConnectModal}
                  className="new-homepage-btn new-homepage-btn--blur"
                >
                  <img src={ConnectIcons} alt="" />
                  Connect Exchange
                </button>

                {this.state.isDarkMode ? (
                  <button
                    onClick={() => this.handleDarkMode("light")}
                    className="new-homepage-btn new-homepage-btn--blur new-homepage-btn--mode"
                  >
                    <img
                      style={{ height: "14px", width: "14px" }}
                      src={lightModeIcon}
                      alt=""
                    />
                    {/* Light Mode */}
                  </button>
                ) : (
                  <button
                    onClick={() => this.handleDarkMode("dark")}
                    className="new-homepage-btn new-homepage-btn--blur new-homepage-btn--mode"
                  >
                    <img
                      style={{ height: "14px", width: "14px" }}
                      src={darkModeIcon}
                      alt=""
                    />
                    {/*Dark Mode*/}
                  </button>
                )}
                {/* {this.state.isDarkMode == "dark2" ? (
                  <span
                    onClick={() => this.handleDarkMode("light")}
                    style={{
                      zIndex: "9",
                      cursor: "pointer",
                      right: "-25px",
                    }}
                    className="navbar-button-container-mode"
                  >
                    <Image src={lightModeIcon} />
                  </span>
                ) : (
                  <span
                    onClick={() => this.handleDarkMode("dark2")}
                    style={{
                      zIndex: "9",
                      cursor: "pointer",
                      right: "-25px",
                      color: "var(--primaryTextColor)",
                    }}
                    className="navbar-button-container-mode"
                  >
                    <Image src={darkModeIcon} /> 1
                    <span />
                  </span>
                )} */}
              </div>
              {this.state.lochUser &&
              (this.state.lochUser.email ||
                this.state.lochUser.first_name ||
                this.state.lochUser.last_name) ? (
                <button
                  onClick={this.openConfirmLeaveModal}
                  className="new-homepage-btn new-homepage-btn--white"
                  style={{ padding: "8px 12px" }}
                >
                  <div className="new-homepage-btn new-homepage-btn-singin-icon">
                    <img src={personRounded} alt="" />
                  </div>
                  {this.state.lochUser.first_name ||
                  this.state.lochUser.last_name
                    ? `${this.state.lochUser.first_name} ${
                        this.state.lochUser.last_name
                          ? this.state.lochUser.last_name.slice(0, 1) + "."
                          : ""
                      }`
                    : "Signed In"}
                </button>
              ) : (
                <button
                  className="new-homepage-btn new-homepage-btn--white"
                  style={{ padding: "8px 12px" }}
                  onClick={() => {
                    this.toggleAuthModal("login");
                    this.setState({
                      smartMoneyLogin: false,
                      leaderboardSignIn: false,
                    });
                  }}
                >
                  <div className="new-homepage-btn new-homepage-btn-singin-icon">
                    <img src={personRounded} alt="" />
                  </div>
                  Sign in / up
                </button>
              )}
            </div>
            <div className="new-homepage__header-title-wrapper">
              <img src={logo} style={{ width: "140px" }} alt="" />
              <div
                className="d-flex"
                style={{
                  alignItems: "center",
                  opacity: "0.5",
                  fontSize: "13px",
                  gap: "5px",
                  fontWeight: "500",
                }}
              >
                <p>
                  Don't worry. All your information remains private and
                  anonymous.
                </p>
                <CustomOverlay
                  text="Your privacy is protected. No third party will know which wallet addresses(es) you added."
                  position="top"
                  isIcon={true}
                  IconImage={LockIcon}
                  isInfo={true}
                  className={"fix-width"}
                >
                  <img
                    src={questionRoundedIcons}
                    alt=""
                    style={{ cursor: "pointer" }}
                  />
                </CustomOverlay>
              </div>
            </div>
          </div>
        </div>
        <div className="new-homepage__body">
          <div className="new-homepage__body-container">
            <OutsideClickHandler
              onOutsideClick={() => {
                this.setState({
                  isTrendingAddresses: false,
                });
                if (
                  this.state?.walletInput &&
                  this.state.walletInput?.length &&
                  !this.state?.walletInput[this.state.walletInput?.length - 1]
                    ?.address
                ) {
                  this.setState({ initialInput: false });
                }
              }}
            >
              {this.state.initialInput ? (
                <>
                  {this.state.walletInput?.map((c, index) => {
                    if (index !== this.state.walletInput.length - 1) {
                      return null;
                    }
                    return (
                      <div className="new-homepage__body-search_input_body_main_container">
                        <NewHomeInputBlock
                          c={c}
                          index={index}
                          walletInput={this.state.walletInput}
                          nicknameOnChain={this.nicknameOnChain}
                          handleOnChange={this.handleOnChange}
                          showisTrendingAddressesAddress={
                            this.showisTrendingAddressesAddress
                          }
                          FocusInInput={this.FocusInInput}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              if (!this.state.isGoButtonsDisabled) {
                                this.addAdressesGo();
                              }
                            }
                          }}
                          // onSubmit={(e) => {
                          //   console.log("here");
                          //   e.preventDefault();
                          //   if (!this.state.isGoButtonsDisabled) this.addAdressesGo();
                          // }}
                        />
                      </div>
                    );
                  })}
                </>
              ) : (
                <div
                  className="new-homepage__body-search "
                  onClick={this.showInitialInput}
                >
                  <div className="inter-display-medium new-homepage__body-search_preview">
                    <Image
                      src={NewWelcomeCopyIcon}
                      className="new-homepage__body-search-copy-icon"
                    />
                    <div className="new-homepage__body-search-paste-text">
                      Paste any wallet address or ENS to get started
                    </div>
                  </div>
                </div>
              )}
              {this.state.walletInput &&
              !this.state.walletInput[0].address &&
              this.state.walletInput.length === 1 &&
              this.state.isTrendingAddresses ? (
                <div
                  className="new-homepage__body-trending-address"
                  style={{ top: "86px" }}
                >
                  <div
                    className="d-flex"
                    style={{ alignItems: "center", gap: "8px" }}
                  >
                    <img
                      src={TrendingFireIcon}
                      className="new-homepage__body-trending-address-icon"
                      alt=""
                    />
                    <div
                      style={{
                        fontSize: "16px",
                      }}
                      className="inter-display-medium"
                    >
                      Trending addresses
                    </div>
                    <div
                      style={{
                        color: "#B0B1B3",
                        fontSize: "13px",
                      }}
                      className="inter-display-medium"
                    >
                      Most-visited addresses in the last 24 hours
                    </div>
                  </div>
                  <div className="new-homepage__body-trending-address__address-wrapper">
                    {this.state.trendingAddresses.map((item, index) => (
                      <div className="trendingAddressesBlockItemContainer">
                        <div
                          onClick={() => {
                            this.addTrendingAddress(index, false);
                          }}
                          className="trendingAddressesBlockItem"
                        >
                          <div className="trendingAddressesBlockItemWalletContainer">
                            <Image
                              className="trendingAddressesBlockItemWallet"
                              src={TrendingWalletIcon}
                            />
                          </div>
                          <div className="trendingAddressesBlockItemDataContainer">
                            <div className="inter-display-medium f-s-16">
                              {item.trimmedAddress}
                            </div>
                            <div className="inter-display-medium f-s-13 lh-15 trendingAddressesBlockItemDataContainerAmount">
                              $
                              {numToCurrency(
                                item.worth.toFixed(2)
                              ).toLocaleString("en-US")}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </OutsideClickHandler>

            {this.state.walletInput &&
            !this.state.walletInput[0].address &&
            this.state.walletInput.length === 1 ? (
              <div className="new-homepage__body-content">
                <div className="new-homepage__body-content-table-header">
                  <img src={ActiveSmartMoneySidebarIcon} alt="" />
                  Loch’s Leaderboard
                </div>
                <div className="new-homepage__body-content-table-header new-homepage__body-content-table-header_explainer">
                  <img
                    style={{
                      opacity: 0,
                    }}
                    src={ActiveSmartMoneySidebarIcon}
                    alt=""
                  />
                  Sorted by net worth, pnl, and flows
                </div>

                {this.state.tableLoading ? (
                  <div
                    style={{
                      background: "var(--cardBackgroud)",
                      height: "100%",
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "100px 0",
                      borderRadius: "12px",
                    }}
                  >
                    <Loading />
                  </div>
                ) : (
                  <div
                    className="smartMoneyTable"
                    style={{
                      marginBottom: "5rem",
                    }}
                  >
                    <TransactionTable
                      openSignInOnclickModal={this.opneLoginModalForSmartMoney}
                      // blurButtonClick={this.showAddSmartMoneyAddresses}
                      isSmartMoney
                      noSubtitleBottomPadding
                      tableData={tableData}
                      columnList={columnList}
                      message={"No accounts found"}
                      totalPage={this.state.totalPage}
                      history={this.props.history}
                      location={this.props.location}
                      page={this.state.currentPage}
                      tableLoading={this.state.tableLoading}
                      onPageChange={() => {
                        this.onPageChange(false);
                      }}
                      pageLimit={this.state.pageLimit}
                      changePageLimit={this.changePageLimit}
                      addWatermark
                      className={this.state.blurTable ? "noScroll" : ""}
                      onBlurSignInClick={this.showSignInModal}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div
                // style={{
                //   marginTop:
                //     this.state.walletInput &&
                //     this.state.walletInput[this.state.walletInput.length - 1]
                //       .showNickname &&
                //     this.state.walletInput[this.state.walletInput.length - 1]
                //       .coinFound
                //       ? "-25px"
                //       : "-15px",
                // }}
                style={{
                  marginTop: "24px",
                }}
              >
                {this.state.walletInput && this.state.walletInput.length > 1 ? (
                  <div
                    style={{
                      marginBottom:
                        this.state.walletInput &&
                        this.state.walletInput[
                          this.state.walletInput.length - 1
                        ].showNickname &&
                        this.state.walletInput[
                          this.state.walletInput.length - 1
                        ].coinFound
                          ? "32px"
                          : "25px",
                    }}
                    className="newWelcomeAddedAddresses"
                  >
                    {this.state.walletInput?.map((c, index) => {
                      if (index === this.state.walletInput.length - 1) {
                        return null;
                      }
                      return (
                        <div
                          style={{
                            marginTop: index > 0 ? "12px" : "",
                          }}
                          className="newWelcomeAddedAddressesBlockContainer"
                        >
                          <div
                            onClick={() => this.deleteInputField(index, c)}
                            className="newWelcomeAddedAddressesBlockDelContainer"
                          >
                            <Image
                              className="newWelcomeAddedAddressesBlockDel"
                              src={NewWelcomeTrashIcon}
                            />
                          </div>
                          <NewHomeInputBlock
                            c={c}
                            index={index}
                            walletInput={this.state.walletInput}
                            nicknameOnChain={this.nicknameOnChain}
                            handleOnChange={this.handleOnChange}
                            FocusInInput={this.FocusInInput}
                            showisTrendingAddressesAddress={
                              this.showisTrendingAddressesAddress
                            }
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : null}
                <div className="newHomeAddAnotherGoContainer inter-display-regular">
                  {this.state.walletInput.length < 10 &&
                  this.state.isPremiumUser ? (
                    <button
                      onClick={() => {
                        this.addInputField();
                      }}
                      className="newHomeAddAnotherGoBtns newHomeAddAnotherBtn"
                      disabled={this.state.isAddAnotherButtonsDisabled}
                    >
                      <Image
                        className="newHomeAddAnotherGoBtnsPlusIcon"
                        src={NewWelcomeAddAnotherPlusIcon}
                      />
                      Add another
                    </button>
                  ) : null}
                  <button
                    onClick={this.addAdressesGo}
                    disabled={this.state.isGoButtonsDisabled}
                    className="newHomeAddAnotherGoBtns newHomeGoBtn"
                    id="goButton-welcome"
                    type="submit"
                  >
                    Go
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  commonState: state.CommonState,
  OnboardingState: state.OnboardingState,
});

const mapDispatchToProps = {
  getSmartMoney,
  updateAddToWatchList,
  updateWalletListFlag,
  getAllCoins,
  detectCoin,
  detectNameTag,
  createAnonymousUserApi,
  getAllParentChains,
  setHeaderReducer,
  updateUserWalletApi,
  GetAllPlan,
  addExchangeTransaction,
  addUserCredits,
  createAnonymousUserSmartMoneyApi,
  verifyUser,
  setMetamaskConnectedReducer,
  setPageFlagDefault,
  removeFromWatchList,
  SwitchDarkMode,
  signUpWelcome,
  isNewAddress,
  checkReferallCodeValid,
};

export default connect(mapStateToProps, mapDispatchToProps)(NewWelcome);
