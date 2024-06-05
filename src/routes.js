import { Route } from "react-router-dom";
import Portfolio from "./app/Portfolio/Portfolio";
import Login from "./app/common/Login";
import { Profile } from "./app/profile";
import PrivateRoute from "./utils/PrivateRoute";
import Sandbox from "./utils/form/Sandbox";

import VerifyEmail from "./app/common/VerifyEmail";
import InsightsPage from "./app/intelligence/InsightsPage";
import TransactionHistoryPage from "./app/intelligence/TransactionHistoryPage";
import VerifySmartMoneyEmailLink from "./app/smartMoney/VerifySmartMoneyEmailLink";

import WhopLoader from "./app/common/WhopAccount";
import appFeature from "./app/common/appFeature";
import WatchList from "./app/watchlist/watchlistPage";

import AssetsUnrealizedProfitAndLoss from "./app/AssetsUnrealizedProfitAndLoss/AssetsUnrealizedProfitAndLoss";
import CounterPartyVolume from "./app/CounterPartyVolumePage/CounterPartyVolume";
import GasFees from "./app/GasFeesPage/GasFees";
import PriceGauge from "./app/PriceGauge/PriceGauge";
import RealizedProfitAndLoss from "./app/RealizedProfitAndLoss/RealizedProfitAndLoss";
import homeSmartMoneyPage from "./app/smartMoney/homeSmartMoneyPage";
import SmartMoneyPage from "./app/smartMoney/smartMoneyPage";
import YieldOpportunitiesPage from "./app/yieldOpportunities/YieldOpportunitiesPage";

import AutoLogin from "./app/AutoLogin/AutoLogin";
import Emulations from "./app/Emulations/Emulations";
import ReferralCodesPage from "./app/ReferralCodes/ReferralCodesPage";
import StripeErrorPage from "./app/StripeErrorPage/StripeErrorPage";
import StripeSuccessPage from "./app/StripeSuccessPage/StripeSuccessPage";
import VerifyEmailWelcome from "./app/common/VerifyEmailWelcome";
import NewWelcome from "./app/home/NewWelcome";
import Nft from "./app/nft/Nft";
import HomeSmartMoneyPage from "./app/smartMoney/homeSmartMoneyPage";
import PublicRoute from "./utils/PublicRoute";
import CopyTradeWelcome from "./app/CopyTradeWelcome/CopyTradeWelcome";
import ReplaceAddressPage from "./app/ReplaceAddress/ReplaceAddressPage";
import CryptoSuccessPage from "./app/CryptoSuccessPage/CryptoSuccessPage";
import PublicSidebarRoute from "./utils/PublicSidebarRoute";
import AddAddressWalletViewer from "./app/AddAddressWalletViewer/AddAddressWalletViewer";
import AddAddressProfile from "./app/AddAddressProfile/AddAddressProfile";
import AddAddressFollowing from "./app/AddAddressFollowing/AddAddressFollowing";
const routes = [
  {
    path: "/",
    name: "Login",
    type: Route,
    component: Login,
  },
  {
    path: "/auto-login",
    name: "Auto Login",
    type: Route,
    component: AutoLogin,
  },

  {
    path: "/welcome",
    name: "Home",
    type: PublicRoute,
    component: NewWelcome,
  },
  {
    path: "/profile",
    name: "Profile",
    type: PrivateRoute,
    component: Profile,
  },
  {
    path: "/profile/referral-codes",
    name: "Referral Codes",
    type: PrivateRoute,
    component: ReferralCodesPage,
  },
  {
    path: ["/home", "/home/:id", "/wallet/:id"],
    name: "Portfolio",
    type: PrivateRoute,
    component: Portfolio,
  },

  {
    path: "/price-gauge",
    name: "PriceGauge",
    type: PrivateRoute,
    component: PriceGauge,
  },
  {
    path: "/realized-profit-and-loss",
    name: "Realized Profit And Loss",
    type: PrivateRoute,
    component: RealizedProfitAndLoss,
  },
  {
    path: "/gas-fees",
    name: "Gas Fees",
    type: PrivateRoute,
    component: GasFees,
  },
  {
    path: "/counterparty-volume",
    name: "Counterparty Volume",
    type: PrivateRoute,
    component: CounterPartyVolume,
  },
  {
    path: "/assets",
    name: "Assets",
    type: PrivateRoute,
    component: AssetsUnrealizedProfitAndLoss,
  },
  {
    path: "/copy-trade",
    name: "Emulations",
    type: PrivateRoute,
    component: Emulations,
  },
  // {
  //   path: "/copy-trade/transactions",
  //   name: "Emulations Transactions",
  //   type: PrivateRoute,
  //   component: EmulationTransactionsPage,
  // },
  {
    path: "/nft",
    name: "NFT",
    type: PrivateRoute,
    component: Nft,
  },
  {
    path: "/intelligence/transaction-history",
    name: "Transaction History",
    type: PrivateRoute,
    component: TransactionHistoryPage,
  },
  // {
  //   path: "/intelligence/asset-value",
  //   name: "Asset Value",
  //   type: PrivateRoute,
  //   component: AssetValueGraph,
  // },
  {
    path: "/intelligence/insights",
    name: "Insights",
    type: PrivateRoute,
    component: InsightsPage,
  },
  {
    path: "/copy-trade-welcome",
    name: "Copy Trade Welcome",
    type: PublicSidebarRoute,
    component: CopyTradeWelcome,
  },
  {
    path: "/wallet-viewer-add-address",
    name: "Copy Trade Welcome",
    type: PublicSidebarRoute,
    component: AddAddressWalletViewer,
  },
  {
    path: "/profile-add-address",
    name: "Profile Add Address",
    type: PublicSidebarRoute,
    component: AddAddressProfile,
  },
  {
    path: "/following-add-address",
    name: "Following Add Address",
    type: PublicSidebarRoute,
    component: AddAddressFollowing,
  },
  {
    path: "/profile-add-address",
    name: "Copy Trade Welcome",
    type: PublicSidebarRoute,
    component: AddAddressProfile,
  },

  {
    path: "/leaderboard",
    name: "Leaderboard",
    type: PrivateRoute,
    component: SmartMoneyPage,
  },
  {
    path: "/home-leaderboard",
    name: "Home Leaderboard",
    type: PublicSidebarRoute,
    component: HomeSmartMoneyPage,
  },
  {
    path: "/home-smart-money",
    name: "Home Smart Money",
    type: PrivateRoute,
    component: homeSmartMoneyPage,
  },

  {
    path: "/yield-opportunities",
    name: "Yield Opportunities",
    type: PrivateRoute,
    component: YieldOpportunitiesPage,
  },

  {
    path: "/watchlist",
    name: "Watchlist",
    type: PrivateRoute,
    component: WatchList,
  },
  // {
  //   path: "/decentralized-finance",
  //   name: "Decentralized Finance",
  //   type: PrivateRoute,
  //   component: Defi,
  // },
  {
    path: "/verify-email",
    name: "Verify Email",
    type: Route,
    component: VerifyEmail,
  },
  {
    path: "/verify-email-welcome",
    name: "Verify Email Welcome",
    type: Route,
    component: VerifyEmailWelcome,
  },
  {
    path: "/verify-email-smart-money",
    name: "Verify Leaderboard Email",
    type: Route,
    component: VerifySmartMoneyEmailLink,
  },
  {
    path: "/app-feature",
    name: "App Features",
    type: Route,
    component: appFeature,
  },
  {
    path: "/callback/whop",
    name: "Whop loader",
    type: Route,
    component: WhopLoader,
  },

  {
    path: "/sandbox",
    name: "Sandox",
    type: Route,
    component: Sandbox,
  },
  {
    path: "/stripe-success",
    name: "Stripe Success",
    type: PrivateRoute,
    component: StripeSuccessPage,
  },
  {
    path: "/crypto-success",
    name: "Crypto Success",
    type: PrivateRoute,
    component: CryptoSuccessPage,
  },
  {
    path: "/stripe-cancel",
    name: "Stripe Error",
    type: PrivateRoute,
    component: StripeErrorPage,
  },
  {
    path: "/replace-address",
    name: "Stripe Error",
    type: PublicSidebarRoute,
    component: ReplaceAddressPage,
  },
];
export default routes;
