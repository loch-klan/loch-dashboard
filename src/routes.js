import { Route } from "react-router-dom"
import Login from "./app/common/Login"
import { Home } from "./app/home"
import { Profile } from "./app/profile"
import Sandbox from "./utils/form/Sandbox"
import PrivateRoute from "./utils/PrivateRoute"
import Portfolio from "./app/Portfolio/Portfolio"
import Intelligence from "./app/intelligence/Intelligence"
import Wallet from "./app/wallet/Wallet"
import { Cost } from "./app/cost/Cost"
const routes = [
  {
    path: "/",
    name: "Login",
    type: Route,
    component: Login
  },
  {
    path: "/home",
    name: "Home",
    type: PrivateRoute,
    component: Home
  },
  // {
  //   path: "/profile",
  //   name: "Profile",
  //   type: PrivateRoute,
  //   component: Profile
  // },
  {
    path: "/portfolio",
    name: "Portfolio",
    type: PrivateRoute,
    component: Portfolio
  },
  {
    path: "/intelligence",
    name: "Intelligence",
    type: Route,
    component: Intelligence
  },
  {
    path: "/wallets",
    name: "Wallet",
    type: PrivateRoute,
    component: Wallet
  },
  // {
  //   path: "/costs",
  //   name: "Costs",
  //   type: Route,
  //   component: Cost
  // },
  {
    path: "/sandbox",
    name: "Sandox",
    type: Route,
    component: Sandbox
  }
]
export default routes
