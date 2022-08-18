import { Route } from "react-router-dom"
import { Customers, CustomerDetails, AddEditCustomer } from "./app/customers"
import { AddEditVehicle, Vehicles } from "./app/vehicles"
import Login from "./app/login/Login"
import Sandbox from "./utils/form/Sandbox"
import PrivateRoute from "./utils/PrivateRoute"
import { Iot, AddEditIot } from "./app/iot"
import { Battery, AddEditBattery } from "./app/battery"
import { BatteryModel, AddEditBatteryModel } from "./app/batteryModel"
import { BikeModel, AddEditBikeModel } from "./app/bikeModel"
import {
  Oem,
  Users,
  Dealer,
  AddEditDealer,
  AddEditOem,
  AddEditUser,
  OemDetails,
  ViewUserDetails
} from "./app/userManagement"
import { IotModel, AddEditIotModel } from "./app/iotModel"
import ResetPassword from "./app/common/ResetPassword"
import { Country, City, Area, AddEditArea } from "./app/locationMaster"
import Coupons from "./app/coupons/Coupons"
import AddEditCoupons from "./app/coupons/AddEditCoupons"
import BookingManagement from "./app/bookingManagement/BookingManagement"
import AddEditBookings from "./app/bookingManagement/AddEditBookings"
import {
  Franchise,
  AddEditFranchise,
  ViewFranchise,
  FranchiseLocation,
  AddEditFranchiseLocation
} from "./app/franchise"
import ViewBikeModel from "./app/bikeModel/ViewBikeModel"
import ViewFranchiseLocation from "./app/franchise/ViewFranchiseLocation"
import AddEditVehiclePricing from "./app/bikeModel/_utils/AddEditVehiclePricing"
import Profile from "./app/common/Profile"
import ViewBooking from "./app/bookingManagement/ViewBookingsDetails"
import Settlement from "./app/settlement/Settlement"
import Report from "./app/settlement/Report"
import ViewVehicleLocation from "./app/vehicles/ViewVehicleLocation"

const routes = [
  {
    path: ["/customers"],
    name: "Customers",
    type: PrivateRoute,
    component: Customers
  },
  {
    path: "/login",
    name: "Login",
    type: Route,
    component: Login
  },
  {
    path: "/customer/:customerId",
    name: "Customer Details",
    type: PrivateRoute,
    component: CustomerDetails
  },
  {
    path: ["/add-customer", "/edit-customer"],
    name: "Add Edit Customer",
    type: PrivateRoute,
    component: AddEditCustomer
  },
  {
    path: "/iot",
    name: "IOT",
    type: PrivateRoute,
    component: Iot
  },
  {
    path: ["/add-iot", "/edit-iot/:deviceId"],
    name: "Add Edu=it IOT",
    type: PrivateRoute,
    component: AddEditIot
  },
  {
    path: "/vehicles",
    name: "Vehicles",
    type: PrivateRoute,
    component: Vehicles
  },
  {
    path: ["/add-vehicle", "/edit-vehicle"],
    name: "Add Edit Vehicle",
    type: PrivateRoute,
    component: AddEditVehicle
  },
  {
    path: "/view-vehicle-location/:id",
    name: "View Vehicle Location",
    type: PrivateRoute,
    component: ViewVehicleLocation
  },
  {
    path: "/battery",
    name: "Battery",
    type: PrivateRoute,
    component: Battery
  },
  {
    path: ["/add-battery", "/edit-battery/:batteryId"],
    name: "Add Edit Battery",
    type: PrivateRoute,
    component: AddEditBattery
  },
  {
    path: "/master/battery-models",
    name: "Battery Models",
    type: PrivateRoute,
    component: BatteryModel
  },
  {
    path: [
      "/master/battery-models/add-battery-model",
      "/master/battery-models/edit-battery-model/:id"
    ],
    name: "Add Battery Model",
    type: PrivateRoute,
    component: AddEditBatteryModel
  },
  {
    path: "/master/bike-models",
    name: "Bike Models",
    type: PrivateRoute,
    component: BikeModel
  },
  {
    path: [
      "/master/bike-models/add-bike-model",
      "/master/bike-models/edit-bike-model"
    ],
    name: "Add Edit Bike Models",
    type: PrivateRoute,
    component: AddEditBikeModel
  },
  {
    path: ["/master/bike-models/view-details/:modelId"],
    name: "View Details",
    type: PrivateRoute,
    component: ViewBikeModel
  },
  {
    path: ["/master/bike-models/view-details/:modelId/add-edit-pricing"],
    name: "AddEditVehiclePricing",
    type: PrivateRoute,
    component: AddEditVehiclePricing
  },
  {
    path: "/master/iot-models",
    name: "Iot Models",
    type: PrivateRoute,
    component: IotModel
  },
  {
    path: [
      "/master/iot-models/add-iot-model",
      "/master/iot-models/edit-iot-model"
    ],
    name: "Add Edit Iot Models",
    type: PrivateRoute,
    component: AddEditIotModel
  },
  {
    path: "/user-management/dealer",
    name: "Dealer",
    type: PrivateRoute,
    component: Dealer
  },
  {
    path: "/user-management/dealer/add-dealer",
    name: "Add edit Dealer",
    type: PrivateRoute,
    component: AddEditDealer
  },
  {
    path: "/user-management/oem",
    name: "Oem",
    type: PrivateRoute,
    component: Oem
  },
  {
    path: "/user-management/oem/add-oem",
    name: "Add edit Oem",
    type: PrivateRoute,
    component: AddEditOem
  },
  {
    path: "/user-management/oem/:oemId",
    name: "Oem Details",
    type: PrivateRoute,
    component: OemDetails
  },
  {
    path: "/user-management/users",
    name: "User",
    type: PrivateRoute,
    component: Users
  },
  {
    path: [
      "/user-management/users/add-user",
      "/user-management/users/edit-user/:userId"
    ],
    name: "Add edit User",
    type: PrivateRoute,
    component: AddEditUser
  },
  {
    path: ["/user-management/users/view-user/:userId"],
    name: "Add edit User",
    type: PrivateRoute,
    component: ViewUserDetails
  },
  {
    path: ["/reset-password"],
    name: "Reset Password",
    type: Route,
    component: ResetPassword
  },
  {
    path: "/location-master/country",
    name: "Country",
    type: PrivateRoute,
    component: Country
  },
  {
    path: [
      "/location-master/area/add-area",
      "/location-master/area/edit-area/:areaId"
    ],
    name: "Add Edit Area",
    type: PrivateRoute,
    component: AddEditArea
  },
  {
    path: "/location-master/city",
    name: "City",
    type: PrivateRoute,
    component: City
  },
  {
    path: "/location-master/area",
    name: "Area",
    type: PrivateRoute,
    component: Area
  },
  {
    path: "/coupons",
    name: "Coupons",
    type: PrivateRoute,
    component: Coupons
  },
  {
    path: ["/coupons/add-coupon", "/coupons/edit-coupon/:couponId"],
    name: "Add Coupons",
    type: PrivateRoute,
    component: AddEditCoupons
  },
  {
    path: "/booking-management",
    name: "Bookings",
    type: PrivateRoute,
    component: BookingManagement
  },
  {
    path: "/booking-management/view-booking/:id",
    name: "Bookings",
    type: PrivateRoute,
    component: ViewBooking
  },
  {
    path: "/booking-management/add-booking",
    name: "Add Bookings",
    type: PrivateRoute,
    component: AddEditBookings
  },
  {
    path: ["/", "/franchise"],
    name: "Franchise",
    type: PrivateRoute,
    component: Franchise
  },
  {
    path: "/franchise/view-franchise/:franchiseId",
    name: "View Franchise",
    type: PrivateRoute,
    component: ViewFranchise
  },
  {
    path: [
      "/franchise/add-franchise",
      "/franchise/edit-franchise/:franchiseId"
    ],
    name: "Add edit Franchise",
    type: PrivateRoute,
    component: AddEditFranchise
  },
  {
    path: "/franchise-location",
    name: "FranchiseLocation",
    type: PrivateRoute,
    component: FranchiseLocation
  },
  {
    path: [
      "/franchise-location/add-franchise-location",
      "/franchise-location/edit-franchise-location/:locationId"
    ],
    name: "Add Edit Franchise Location",
    type: PrivateRoute,
    component: AddEditFranchiseLocation
  },
  {
    path: "/franchise-location/view-franchise-location/:locationId",
    name: "ViewFranchiseLocation",
    type: PrivateRoute,
    component: ViewFranchiseLocation
  },
  {
    path: "/settlement",
    name: "Settlement",
    type: PrivateRoute,
    component: Settlement
  },
  {
    path: "/report",
    name: "Report",
    type: PrivateRoute,
    component: Report
  },
  {
    path: "/profile",
    name: "Profile",
    type: PrivateRoute,
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
