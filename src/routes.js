import { Route } from "react-router-dom"
import { Home } from "./app/home"
import Home2 from "./app/home/Home2"
import { Profile } from "./app/profile"
import Sandbox from "./utils/form/Sandbox"
import PrivateRoute from "./utils/PrivateRoute"

const routes = [
  {
    path: "/",
    name: "Home",
    type: Route,
    component: Home
  },
  {
    path: "/home2",
    name: "Home2",
    type: Route,
    component: Home2
  },
  {
    path: "/profile",
    name: "Profile",
    type: Route,
    component: Profile
  },
  {
    path: "/sandbox",
    name: "Sandox",
    type: Route,
    component: Sandbox
  }
]
export default routes
