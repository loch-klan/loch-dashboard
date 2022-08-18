import { Route } from "react-router-dom"
import { Home } from "./app/home"
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
    path: "/sandbox",
    name: "Sandox",
    type: Route,
    component: Sandbox
  }
]
export default routes
