import { Route } from "react-router-dom"
import Login from "./app/common/Login"
import { Home } from "./app/home"
import { Profile } from "./app/profile"
import Sandbox from "./utils/form/Sandbox"
import PrivateRoute from "./utils/PrivateRoute"
import Portfolio from "./app/Portfolio/Portfolio"
import Intelligence from "./app/intelligence/Intelligence"
import Wallet from "./app/wallet/Wallet"
import Cost  from "./app/cost/Cost"
import TransactionHistoryPage from "./app/intelligence/TransactionHistoryPage"
import VerifyEmail from "./app/common/VerifyEmail"
import VolumeTradedByCounterparty from "./app/intelligence/VolumeTradedByCounterparty"
import InsightsPage from "./app/intelligence/InsightsPage"
import AssetValueGraph from "./app/intelligence/AssetValueGraph";
import Cohort from "./app/cohort/Cohort"
import CohortPage from "./app/cohort/cohort-individual"
const routes = [
  {
    path: "/",
    name: "Login",
    type: Route,
    component: Login,
  },
  {
    path: "/welcome",
    name: "Home",
    type: PrivateRoute,
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
    path: "/wallets",
    name: "Wallet",
    type: PrivateRoute,
    component: Wallet,
  },
  {
    path: "/costs",
    name: "Costs",
    type: PrivateRoute,
    component: Cost,
  },
  {
    path: "/cohort",
    name: "Cohort",
    type: PrivateRoute,
    component: Cohort,
  },
  {
    path: "/cohort/cohort-page",
    name: "Cohort Page",
    type: PrivateRoute,
    component: CohortPage,
  },

  {
    path: "/verify-email",
    name: "Verify Email",
    type: Route,
    component: VerifyEmail,
  },
  {
    path: "/sandbox",
    name: "Sandox",
    type: Route,
    component: Sandbox,
  },
];
export default routes
