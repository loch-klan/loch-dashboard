import React, { Component } from "react"
// import PropTypes from 'prop-types';
import { connect } from "react-redux"
import { ComponentHeader } from "../common"
import CustomTable from "../../utils/commonComponent/CustomTable"
import ActionDropdown from "../common/_utils/ActionDropdown"
import BulkUploadModal from "./BulkUploadModal"
import { getAllVehiclesApi } from "./Api"
import {
  getAssignedPermission,
  replaceHistory
} from "../../utils/ReusableFunctions"
import { PermissionList, VehicleStatus } from "../../utils/Constant"
import Switch from "../common/_utils/Switch"
import UpdateStatusModal from "./UpdateStatusModal"

class Vehicles extends Component {
  constructor(props) {
    super(props)
    const search = props.location.search
    const params = new URLSearchParams(search)
    const page = params.get("p")
    const searchText = params.get("search")
    this.state = {
      vehiclesList: [],
      page: page ? parseInt(page, 10) : 1,
      totalPages: 1,
      searchText,
      searchKey: "SEARCH_BY_TEXT",
      showFilter: false,
      showBulkUploadModal: false,
      showUpdateStatus: false
    }
  }

  componentDidMount() {
    getAllVehiclesApi(this)
  }

  componentDidUpdate(prevProps, prevState) {
    const prevParams = new URLSearchParams(prevProps.location.search)
    const prevPage = parseInt(prevParams.get("p"), 10) || 1
    const prevSearchText = prevParams.get("search")

    const params = new URLSearchParams(this.props.location.search)
    const page = parseInt(params.get("p"), 10) || 1
    const searchText = params.get("search")

    if (prevPage !== page || prevSearchText !== searchText) {
      this.setState({ page, searchText }, () => {
        getAllVehiclesApi(this)
      })
    }
  }

  handleFilter = () => {
    this.setState({
      showFilter: !this.state.showFilter
    })
  }

  clearSearch = () => {
    this.onChangeMethod({ search: "" })
  }

  onChangeMethod = (value) => {
    this.setState({ searchText: value.search, page: 1 }, () => {
      replaceHistory(this.props.history, 1, value.search)
    })
  }

  handleEditVehicle = (rowData) => {
    this.props.history.push({
      pathname: `/edit-vehicle/`,
      state: { editData: rowData }
    })
  }

  handleAddVehicle = () => {
    this.props.history.push("/add-vehicle")
  }

  handleUpdateStatus = (rowData = "") => {
    this.setState({
      showUpdateStatus: !this.state.showUpdateStatus,
      vehicleInfo: rowData
    })
  }

  handleUpdate = () => {
    this.setState({
      showUpdateStatus: !this.state.showUpdateStatus,
      vehicleInfo: ""
    })
    getAllVehiclesApi(this)
  }

  handleViewLocation = (rowData) => {
    this.props.history.push({
      pathname: `/view-vehicle-location/${rowData.id}`
    })
  }

  render() {
    const { vehiclesList } = this.state
    const permissionList = getAssignedPermission()
    return (
      <>
        {this.state.showUpdateStatus && (
          <UpdateStatusModal
            show={this.state.showUpdateStatus}
            handleClose={() => this.handleUpdateStatus()}
            handleUpdate={() => this.handleUpdate()}
            vehicleInfo={this.state.vehicleInfo}
          />
        )}
        <ComponentHeader
          backArrowBtn={false}
          breadcrumb={true}
          currentPage={"Vehicles"}
          title={"Vehicles"}
          isFilter={false}
          isPrimaryBtn2={this.handleAddVehicle}
          primaryBtnText2={
            permissionList.includes(PermissionList.ADD_UPDATE_VEHICLE_INVENTORY)
              ? "+ Add Vehicle"
              : null
          }
          isSearch={true}
          placeholder={"Search Vehicle"}
          onChangeMethod={this.onChangeMethod}
          clearSearch={this.clearSearch}
          searchValue={{ search: this.state.searchText }}
        />
        <div className="custom-table-wrapper">
          <CustomTable
            tableData={vehiclesList}
            columnList={[
              {
                coumnWidth: 250,
                labelName: "Model Name",
                dataKey: "modelInfo",
                className: "red-hat-display-bold",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "modelInfo") {
                    return rowData.modelInfo ? rowData.modelInfo.modelName : "-"
                  }
                }
              },
              {
                coumnWidth: 250,
                labelName: "Chassis Number",
                dataKey: "chassisNo",
                className: "",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "chassisNo") {
                    return rowData.chassisNo
                  }
                }
              },
              {
                coumnWidth: 250,
                labelName: "Registration number",
                dataKey: "registrationNo",
                className: "",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "registrationNo") {
                    return rowData.registrationNo || "NA"
                  }
                }
              },
              {
                coumnWidth: 250,
                labelName: "Battery Status",
                dataKey: "batteryStatus",
                className: "",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (
                    dataKey === "batteryStatus" &&
                    rowData.attachedBatteries.length > 0
                  ) {
                    return (
                      <p className="status">
                        {" "}
                        <span
                          className={`circle ${
                            rowData.attachedBatteries[0].active
                              ? "active"
                              : "inactive"
                          }`}
                        ></span>{" "}
                        {rowData.attachedBatteries[0].active
                          ? "Attached"
                          : "Inactive"}
                      </p>
                    )
                  }
                }
              },
              {
                coumnWidth: 250,
                labelName: "Iot Status",
                dataKey: "iotStatus",
                className: "",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "iotStatus") {
                    return (
                      <p className="status">
                        {" "}
                        <span
                          className={`circle ${
                            rowData.attachedTelematics.active
                              ? "active"
                              : "inactive"
                          }`}
                        ></span>{" "}
                        {rowData.attachedTelematics.active
                          ? "Attached"
                          : "Inactive"}
                      </p>
                    )
                  }
                }
              },
              {
                coumnWidth: 200,
                labelName: "Vehicle Status",
                dataKey: "vehicleStatus",
                className: "",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "vehicleStatus") {
                    return VehicleStatus.getText(rowData.status)
                  }
                }
              },
              {
                coumnWidth: 250,
                labelName: "",
                dataKey: "options",
                className: "options-column",
                isCell: true,
                cell: (rowData, dataKey) => {
                  if (dataKey === "options") {
                    const menuItem = []
                    menuItem.push({
                      title: "Edit",
                      type: "event",
                      handleClick: () => this.handleEditVehicle(rowData)
                    })
                    menuItem.push({
                      title: "Update Status",
                      type: "event",
                      handleClick: () => this.handleUpdateStatus(rowData)
                    })
                    menuItem.push({
                      title: "View Location",
                      type: "event",
                      handleClick: () => this.handleViewLocation(rowData)
                    })
                    if (
                      permissionList.includes(
                        PermissionList.ADD_UPDATE_VEHICLE_INVENTORY
                      )
                    ) {
                      return <ActionDropdown menuItem={menuItem} />
                    }
                  }
                }
              }
            ]}
            // For Pagination
            history={this.props.history}
            location={this.props.location}
            totalPages={this.state.totalPages}
            currentPage={this.state.page - 1} // because of 0 based indexing
            message={"Vehicle list is empty"}
          />
        </div>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  vehiclesState: state.VehiclesState
})
const mapDispatchToProps = {
  // getPosts: fetchPosts
}
Vehicles.propTypes = {
  // getPosts: PropTypes.func
}

export default connect(mapStateToProps, mapDispatchToProps)(Vehicles)
