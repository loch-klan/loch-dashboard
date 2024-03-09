import { Route } from "react-router-dom";
import Portfolio from "./app/Portfolio/Portfolio";
import Login from "./app/common/Login";
import { Home } from "./app/home";
import { Profile } from "./app/profile";
import PrivateRoute from "./utils/PrivateRoute";
import Sandbox from "./utils/form/Sandbox";

import VerifyEmail from "./app/common/VerifyEmail";
import Defi from "./app/defi/Defi";
import AssetValueGraph from "./app/intelligence/AssetValueGraph";
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

import HomeSmartMoneyPage from "./app/smartMoney/homeSmartMoneyPage";
import Nft from "./app/nft/Nft";
import NewWelcome from "./app/home/NewWelcome";
import VerifyEmailWelcome from "./app/common/VerifyEmailWelcome";
import Emulations from "./app/Emulations/Emulations";
import EmulationTransactionsPage from "./app/Emulations/EmulationTransactions/EmulationTransactionsPage";
import AutoLogin from "./app/AutoLogin/AutoLogin";
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
    type: Route,
    component: NewWelcome,
  },
  {
    path: "/profile",
    name: "Profile",
    type: PrivateRoute,
    component: Profile,
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
  {
    path: "/copy-trade/transactions",
    name: "Emulations",
    type: PrivateRoute,
    component: EmulationTransactionsPage,
  },
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
    path: "/leaderboard",
    name: "Leaderboard",
    type: PrivateRoute,
    component: SmartMoneyPage,
  },
  {
    path: "/home-leaderboard",
    name: "Home Leaderboard",
    type: PrivateRoute,
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
  {
    path: "/decentralized-finance",
    name: "Decentralized Finance",
    type: PrivateRoute,
    component: Defi,
  },
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
];
export default routes;
