import React, { Component } from "react"
import { connect } from "react-redux"
import { Image } from "react-bootstrap"
import ebgLogo from "../../assets/images/ebg-logo.svg"
import { NavLink } from "react-router-dom"
import profileIcon from "../../assets/images/icons/profile-icon.svg"
import vehicleIcon from "../../assets/images/icons/vehicle-icon.svg"
import batteryIcon from "../../assets/images/icons/battery-icon.svg"
import iotIcon from "../../assets/images/icons/iot-icon.svg"
import masterIcon from "../../assets/images/icons/master-icon.svg"
import dropdownDownIcon from "../../assets/images/icons/dropdown-down-icon.svg"
import dropdownUpIcon from "../../assets/images/icons/dropdown-up-icon.svg"
import lockIcon from "../../assets/images/icons/lock-icon.svg"
import logoutIcon from "../../assets/images/icons/logout-icon.svg"
import ChangePasswordModal from "./ChangePasswordModal"
import { AccountType, PermissionList } from "../../utils/Constant"
import { getUserAccountType } from "../../utils/ManageToken"
import { getAssignedPermission } from "../../utils/ReusableFunctions"
import closeIcon from "../../assets/images/icons/close-icon.svg"
import { setCommonReducer } from "./CommonAction"

class Sidenav extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeNav: "",
      isOpen: false,
      changePasswordModal: false,
      userManagement: [
        "dealer",
        "add-dealer",
        "oem",
        "add-oem",
        "users",
        "add-user"
      ],
      masterData: [
        "bike-models",
        "iot-models",
        "battery-models",
        "add-battery-model",
        "edit-battery-model",
        "add-iot-model",
        "add-bike-model"
      ],
      locationMaster: ["country", "city", "area"]
    }
  }

  componentDidMount() {
    let pathname = this.props.location.pathname
    pathname = pathname.split("/").pop().split("?")[0]
    if (this.state.userManagement.includes(pathname)) {
      this.handleDropdown("user")
    } else if (this.state.masterData.includes(pathname)) {
      this.handleDropdown("master")
    } else if (this.state.locationMaster.includes(pathname)) {
      this.handleDropdown("location-master")
    }
  }

  handleDropdown = (type) => {
    this.setState({
      activeNav: type,
      isOpen: type === this.state.activeNav ? !this.state.isOpen : true
    })
  }

  openCloseChangePassword = () => {
    this.setState({ changePasswordModal: !this.state.changePasswordModal })
  }

  sidebarHandle = () => {
    this.props.setCommonReducer({
      isSidebarOpen: false
    })
  }

  render() {
    const permissionList = getAssignedPermission()
    return (
      <div
        className={`sidenav-wrapper ${
          this.props.commonState.isSidebarOpen ? "open" : ""
        }`}
      >
        {this.state.changePasswordModal && (
          <ChangePasswordModal
            show={this.state.changePasswordModal}
            handleClose={this.openCloseChangePassword}
            history={this.props.history}
          />
        )}
        <div className="header">
          <Image src={ebgLogo} className="logo" />
          <Image
            src={closeIcon}
            className="close-icon"
            onClick={this.sidebarHandle}
          />
        </div>
        <div className="content">
          {permissionList.includes(PermissionList.VIEW_FRANCHISE) && (
            <NavLink
              to={"/franchise"}
              onClick={this.sidebarHandle}
              className="red-hat-display-medium f-s-14 lh-14 secondary"
              activeClassName="active"
            >
              {" "}
              <Image src={profileIcon} className="sidenav-icons" /> Franchise
            </NavLink>
          )}
          {permissionList.includes(PermissionList.VIEW_FRANCHISE_LOCATION) && (
            <NavLink
              to={"/franchise-location"}
              onClick={this.sidebarHandle}
              className="red-hat-display-medium f-s-14 lh-14 secondary"
              activeClassName="active"
            >
              {" "}
              <Image src={profileIcon} className="sidenav-icons" /> Franchise
              Location
            </NavLink>
          )}
          {permissionList.includes(PermissionList.VIEW_VEHICLE_INVENTORY) && (
            <NavLink
              to={"/vehicles"}
              onClick={this.sidebarHandle}
              className="red-hat-display-medium f-s-14 lh-14 secondary"
              activeClassName="active"
            >
              {" "}
              <Image src={vehicleIcon} className="sidenav-icons" /> Vehicles
            </NavLink>
          )}
          {permissionList.includes(PermissionList.VIEW_COUPON) && (
            <NavLink
              to={"/coupons"}
              onClick={this.sidebarHandle}
              className="red-hat-display-medium f-s-14 lh-14 secondary"
              activeClassName="active"
            >
              {" "}
              <Image src={profileIcon} className="sidenav-icons" /> Coupons
            </NavLink>
          )}
          {permissionList.includes(PermissionList.VIEW_TELEMATICS_INVENTORY) &&
            getUserAccountType() === AccountType.COMPANY && (
              <NavLink
                to={"/iot"}
                onClick={this.sidebarHandle}
                className="red-hat-display-medium f-s-14 lh-14 secondary"
                activeClassName="active"
              >
                {" "}
                <Image src={iotIcon} className="sidenav-icons" /> IOT
              </NavLink>
            )}
          {permissionList.includes(PermissionList.VIEW_BATTERY_INVENTORY) &&
            getUserAccountType() === AccountType.COMPANY && (
              <NavLink
                to={"/battery"}
                onClick={this.sidebarHandle}
                className="red-hat-display-medium f-s-14 lh-14 secondary"
                activeClassName="active"
              >
                {" "}
                <Image src={batteryIcon} className="sidenav-icons" /> Battery
              </NavLink>
            )}
          {permissionList.includes(PermissionList.VIEW_CUSTOMER) && (
            <NavLink
              to={"/customers"}
              onClick={this.sidebarHandle}
              className="red-hat-display-medium f-s-14 lh-14 secondary"
              activeClassName="active"
            >
              {" "}
              <Image src={profileIcon} className="sidenav-icons" /> Customers
            </NavLink>
          )}
          {permissionList.includes(PermissionList.VIEW_ORDER) && (
            <NavLink
              to={"/booking-management"}
              onClick={this.sidebarHandle}
              className="red-hat-display-medium f-s-14 lh-14 secondary"
              activeClassName="active"
            >
              {" "}
              <Image src={profileIcon} className="sidenav-icons" /> Booking
              Management
            </NavLink>
          )}
          {permissionList.includes(PermissionList.VIEW_SETTLEMENT_REPORT) && (
            <NavLink
              to={"/settlement"}
              onClick={this.sidebarHandle}
              className="red-hat-display-medium f-s-14 lh-14 secondary"
              activeClassName="active"
            >
              {" "}
              <Image src={profileIcon} className="sidenav-icons" /> Settlement
            </NavLink>
          )}
          {permissionList.includes(PermissionList.VIEW_REPORTS) && (
            <NavLink
              to={"/report"}
              onClick={this.sidebarHandle}
              className="red-hat-display-medium f-s-14 lh-14 secondary"
              activeClassName="active"
            >
              {" "}
              <Image src={profileIcon} className="sidenav-icons" /> Report
            </NavLink>
          )}
          {permissionList.includes(PermissionList.VIEW_USER) && (
            <>
              <NavLink
                to={"#"}
                onClick={() => this.handleDropdown("user")}
                className="red-hat-display-medium f-s-14 lh-14 secondary"
                activeClassName={
                  this.state.activeNav === "user" ? "active" : ""
                }
              >
                {" "}
                <Image src={profileIcon} className="sidenav-icons" /> User
                Management{" "}
                <Image
                  src={
                    this.state.activeNav === "user" && this.state.isOpen
                      ? dropdownUpIcon
                      : dropdownDownIcon
                  }
                  className="dropdown-icon"
                />{" "}
              </NavLink>
              {this.state.activeNav === "user" && this.state.isOpen && (
                <div className="sub-menu">
                  <NavLink
                    to={"/user-management/users"}
                    onClick={this.sidebarHandle}
                    className="red-hat-display-medium lh-18 grey-AAA"
                    activeClassName="active-m"
                  >
                    {" "}
                    <span
                      className={`dot ${
                        this.props.location.pathname &&
                        this.props.location.pathname.includes("users")
                          ? "active"
                          : ""
                      }`}
                    ></span>{" "}
                    Users
                  </NavLink>
                </div>
              )}
            </>
          )}

          {permissionList.includes(
            PermissionList.VIEW_VEHICLE_MODEL ||
              PermissionList.VIEW_TELEMATICS_MODEL ||
              PermissionList.VIEW_BATTERY_MODEL
          ) &&
            getUserAccountType() === AccountType.COMPANY && (
              <>
                <NavLink
                  to={"#"}
                  onClick={() => this.handleDropdown("master")}
                  className="red-hat-display-medium f-s-14 lh-14 secondary"
                  activeClassName={
                    this.state.activeNav === "master" ? "active" : ""
                  }
                >
                  {" "}
                  <Image src={masterIcon} className="sidenav-icons" /> Master
                  Data{" "}
                  <Image
                    src={
                      this.state.activeNav === "master"
                        ? dropdownUpIcon
                        : dropdownDownIcon
                    }
                    className="dropdown-icon"
                  />{" "}
                </NavLink>
                {this.state.activeNav === "master" && this.state.isOpen && (
                  <div className="sub-menu">
                    {permissionList.includes(
                      PermissionList.VIEW_VEHICLE_MODEL
                    ) && (
                      <NavLink
                        to={"/master/bike-models"}
                        onClick={this.sidebarHandle}
                        className="red-hat-display-medium lh-18 grey-AAA"
                        activeClassName="active-m"
                      >
                        {" "}
                        <span
                          className={`dot ${
                            this.props.location.pathname &&
                            this.props.location.pathname.includes("bike-models")
                              ? "active"
                              : ""
                          }`}
                        ></span>{" "}
                        Bike Model
                      </NavLink>
                    )}
                    {permissionList.includes(
                      PermissionList.VIEW_TELEMATICS_MODEL
                    ) && (
                      <NavLink
                        to={"/master/iot-models"}
                        onClick={this.sidebarHandle}
                        className="red-hat-display-medium lh-18 grey-AAA"
                        activeClassName="active-m"
                      >
                        {" "}
                        <span
                          className={`dot ${
                            this.props.location.pathname &&
                            this.props.location.pathname.includes("iot-models")
                              ? "active"
                              : ""
                          }`}
                        ></span>{" "}
                        Iot Model
                      </NavLink>
                    )}
                    {permissionList.includes(
                      PermissionList.VIEW_BATTERY_MODEL
                    ) && (
                      <NavLink
                        to={"/master/battery-models"}
                        onClick={this.sidebarHandle}
                        className="red-hat-display-medium lh-18 grey-AAA"
                        activeClassName="active-m"
                      >
                        {" "}
                        <span
                          className={`dot ${
                            this.props.location.pathname &&
                            this.props.location.pathname.includes(
                              "battery-models"
                            )
                              ? "active"
                              : ""
                          }`}
                        ></span>{" "}
                        Battery Model
                      </NavLink>
                    )}
                  </div>
                )}
              </>
            )}
          {getUserAccountType() === AccountType.COMPANY && (
            <>
              <NavLink
                to={"#"}
                onClick={() => this.handleDropdown("location-master")}
                className="red-hat-display-medium f-s-14 lh-14 secondary"
                activeClassName={
                  this.state.activeNav === "location-master" ? "active" : ""
                }
              >
                {" "}
                <Image src={masterIcon} className="sidenav-icons" /> Location
                Master{" "}
                <Image
                  src={
                    this.state.activeNav === "location-master"
                      ? dropdownUpIcon
                      : dropdownDownIcon
                  }
                  className="dropdown-icon"
                />{" "}
              </NavLink>
              {this.state.activeNav === "location-master" && this.state.isOpen && (
                <div className="sub-menu">
                  {
                    <NavLink
                      to={"/location-master/country"}
                      className="red-hat-display-medium lh-18 grey-AAA"
                      activeClassName="active-m"
                    >
                      {" "}
                      <span
                        className={`dot ${
                          this.props.location.pathname &&
                          this.props.location.pathname.includes("country")
                            ? "active"
                            : ""
                        }`}
                      ></span>{" "}
                      Country
                    </NavLink>
                  }
                  {
                    <NavLink
                      to={"/location-master/city"}
                      className="red-hat-display-medium lh-18 grey-AAA"
                      activeClassName="active-m"
                    >
                      {" "}
                      <span
                        className={`dot ${
                          this.props.location.pathname &&
                          this.props.location.pathname.includes("city")
                            ? "active"
                            : ""
                        }`}
                      ></span>{" "}
                      City
                    </NavLink>
                  }
                  {
                    <NavLink
                      to={"/location-master/area"}
                      className="red-hat-display-medium lh-18 grey-AAA"
                      activeClassName="active-m"
                    >
                      {" "}
                      <span
                        className={`dot ${
                          this.props.location.pathname &&
                          this.props.location.pathname.includes("area")
                            ? "active"
                            : ""
                        }`}
                      ></span>{" "}
                      Area
                    </NavLink>
                  }
                </div>
              )}
            </>
          )}
          <div className="bottom">
            <NavLink
              to={"/profile"}
              className="red-hat-display-medium f-s-12 lh-12 grey-AAA"
            >
              {" "}
              <Image src={profileIcon} className="sidenav-icons" /> Profile
            </NavLink>
            <NavLink
              to={"#"}
              onClick={() => {
                this.openCloseChangePassword()
                this.sidebarHandle()
              }}
              className="red-hat-display-medium f-s-12 lh-12 grey-AAA"
            >
              {" "}
              <Image src={lockIcon} className="sidenav-icons" /> Change Password
            </NavLink>
            <NavLink
              to={"/login"}
              className="red-hat-display-medium f-s-12 lh-12 grey-AAA"
            >
              {" "}
              <Image src={logoutIcon} className="sidenav-icons" /> Logout
            </NavLink>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  commonState: state.CommonState
})
const mapDispatchToProps = {
  setCommonReducer
}
export default connect(mapStateToProps, mapDispatchToProps)(Sidenav)
