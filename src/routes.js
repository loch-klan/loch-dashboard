import { Route } from "react-router-dom";
import Login from "./app/common/Login";
import { Home } from "./app/home";
import { Profile } from "./app/profile";
import Sandbox from "./utils/form/Sandbox";
import PrivateRoute from "./utils/PrivateRoute";
import Portfolio from "./app/Portfolio/Portfolio";
import Intelligence from "./app/intelligence/Intelligence";
import Wallet from "./app/wallet/Wallet";
import Cost from "./app/cost/Cost";
import TransactionHistoryPage from "./app/intelligence/TransactionHistoryPage";
import VerifyEmail from "./app/common/VerifyEmail";
import VolumeTradedByCounterparty from "./app/intelligence/VolumeTradedByCounterparty";
import InsightsPage from "./app/intelligence/InsightsPage";
import AssetValueGraph from "./app/intelligence/AssetValueGraph";
import Cohort from "./app/cohort/Cohort";
import CohortPage from "./app/cohort/cohort-individual";
import CohortSharePage from "./app/cohort/cohortShare";
import Defi from "./app/defi/Defi";
import LPWhale from "./app/home/landing-page-whale";
import LPIntelligence from "./app/home/landing-page-intelligence";
import LPPeace from "./app/home/landing-page-peace";
import WhopLoader from "./app/common/WhopAccount"
import TopAccount from "./app/discover/topAccount";
import twitterInfluencer from "./app/discover/twitterInfluencer";
const routes = [
  {
    path: "/",
    name: "Login",
    type: Route,
    component: Login,
  },
  // {
  //   path: "/",
  //   name: "Home",
  //   type: Route,
  //   component: Home,
  // },
  {
    path: "/welcome",
    name: "Home",
    type: Route,
    component: Home,
  },
  {
    path: "/profile",
    name: "Profile",
    type: PrivateRoute,
    component: Profile,
  },
  {
    path: ["/home", "/home/:id"],
    name: "Portfolio",
    type: PrivateRoute,
    component: Portfolio,
  },
  {
    path: "/intelligence",
    name: "Intelligence",
    type: PrivateRoute,
    component: Intelligence,
  },
  {
    path: "/intelligence/transaction-history",
    name: "Transaction History",
    type: PrivateRoute,
    component: TransactionHistoryPage,
  },
  {
    path: "/intelligence/volume-traded-by-counterparty",
    name: "Volume Traded By Counterparty",
    type: PrivateRoute,
    component: VolumeTradedByCounterparty,
  },
  {
    path: "/intelligence/asset-value",
    name: "Asset Value",
    type: PrivateRoute,
    component: AssetValueGraph,
  },
  {
    path: "/intelligence/insights",
    name: "Insights",
    type: PrivateRoute,
    component: InsightsPage,
  },
  {
    path: "/intelligence/costs",
    name: "Costs",
    type: PrivateRoute,
    component: Cost,
  },
  {
    path: "/wallets",
    name: "Wallet",
    type: PrivateRoute,
    component: Wallet,
  },
  {
    path: "/whale-watch",
    name: "Whale Watch",
    type: PrivateRoute,
    component: Cohort,
  },
  {
    path: "/whale-watch/:cohortName",
    name: "Whale Watching Page",
    type: PrivateRoute,
    component: CohortPage,
  },
  {
    path: "/whale-watch/:userId/:podName",
    name: "Whale Watching Share",
    type: PrivateRoute,
    component: CohortSharePage,
  },
  {
    path: "/top-accounts",
    name: "Top accounts",
    type: PrivateRoute,
    component: TopAccount,
  },
  {
    path: "/twitter-influencers",
    name: "Twitter Influencers",
    type: PrivateRoute,
    component: twitterInfluencer,
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
    path: "/callback/whop",
    name: "Whop loader",
    type: Route,
    component: WhopLoader,
  },
  {
    path: "/landing-page-whale",
    name: "Landing Page 1",
    type: Route,
    component: LPWhale,
  },
  {
    path: "/landing-page-peace-of-mind",
    name: "Landing Page 2",
    type: Route,
    component: LPPeace,
  },
  {
    path: "/landing-page-intelligence",
    name: "Landing Page 3",
    type: Route,
    component: LPIntelligence,
  },
  {
    path: "/sandbox",
    name: "Sandox",
    type: Route,
    component: Sandbox,
  },
];
export default routes;
