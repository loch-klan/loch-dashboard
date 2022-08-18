import React, { Component } from "react";
import { connect } from "react-redux";
import { Col, Row } from "react-bootstrap";
import { getFranchiseByIdApi } from "./Api";
import notFoundDefault from "../../assets/images/empty-table.png";
import { Button, Image } from "react-bootstrap";
import { ComponentHeader } from "../common";
import {
  getAllVehiclesApi,
  removeVehiclesToFranchiseApi,
} from "../vehicles/Api";
import CustomTable from "../../utils/commonComponent/CustomTable";
// import { PermissionList } from "../../utils/Constant";
// import {
//   getAssignedPermission,
//   replaceHistory,
// } from "../../utils/ReusableFunctions";
// import ActionDropdown from "../common/_utils/ActionDropdown";
import VehicleAllocationModal from "./_utils/VehicleAllocationModal";
import InformationModal from "../common/InformationModal";

class ViewFranchise extends Component {
  constructor(props) {
    super(props);
    // console.log("props.location", props.location);
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const page = params.get("p");
    // const searchText = params.get("search");
    let franchiseId = props.match.params.franchiseId
      ? props.match.params.franchiseId
      : "";

    this.state = {
      franchiseId: franchiseId,
      vehiclesList: [],
      page: page ? parseInt(page, 10) : 1,
      totalPages: 1,
      searchText: franchiseId,
      searchKey: "SEARCH_BY_ACCOUNT_ID",
      showAllocationModal: false,
      showConfirmationModal: false,
    };
  }

  componentDidMount() {
    // IN CASE IF VIEW FRANCHISE
    if (this.state.franchiseId) {
      this.props.getFranchiseByIdApi(
        this.state.franchiseId,
        this.setFranchiseData
      );
    }
    getAllVehiclesApi(this);
  }

  setFranchiseData = (data) => {
    this.setState({
      franchiseData: data,
    });
  };

  areaName = (areas) => {
    let areasName = [];
    if (areas.length === 0) {
      areasName = "NA";
    }
    areas.map((item, index) => {
      if (areas.length === index + 1) {
        return areasName.push(item.name);
      } else {
        return areasName.push(item.name + ",");
      }
    });
    return areasName;
  };

  handleVehicleAllocation = () => {
    this.setState({
      showAllocationModal: !this.state.showAllocationModal,
    });
  };

  handleConfirmation = (rowData = "") => {
    this.setState({
      showConfirmationModal: !this.state.showConfirmationModal,
      vehicleData: rowData,
    });
  };

  removeVehicle = () => {
    const data = new URLSearchParams();
    data.append("vehicle_ids", JSON.stringify([this.state.vehicleData.id]));
    data.append("franchise_id", this.state.franchiseId);
    removeVehiclesToFranchiseApi(data, this.handleConfirmation, this);
  };

  render() {
    const franchiseData = this.state.franchiseData && this.state.franchiseData;
    const { vehiclesList } = this.state;
    // const permissionList = getAssignedPermission();
    return (
      <div>
        <ComponentHeader
          backArrowBtn={true}
          history={this.props.history}
          title={"View Franchise"}
        />
        {this.state.showAllocationModal && (
          <VehicleAllocationModal
            show={this.state.showAllocationModal}
            handleClose={(data) => this.handleVehicleAllocation()}
            franchiseId={this.state.franchiseId}
            ctx={this}
          />
        )}
        {this.state.showConfirmationModal && (
          <InformationModal
            show={this.state.showConfirmationModal}
            handleClose={this.handleConfirmation}
            type="warning"
            actionText="remove"
            handleArchive={this.removeVehicle}
            text={
              this.state.vehicleData && this.state.vehicleData.registrationNo
            }
          />
        )}

        {franchiseData && franchiseData.id ? (
          <div className="order-details-wrapper add-edit-customer-wrapper">
            <div className="content view-detail-page">
              <div className="basic-details">
                <h2>Basic Details</h2>
                <Row>
                  <Col sm={3} xs={12}>
                    <div className="detail">
                      <h4 className="regular">Account Name</h4>
                      <h3 className="regular lg">{franchiseData.legal_name}</h3>
                    </div>
                  </Col>
                  <Col sm={3} xs={12}>
                    <div className="detail">
                      <h4 className="regular">Account Email</h4>
                      <h3 className="regular lg">
                        {franchiseData.billing_email}
                      </h3>
                    </div>
                  </Col>
                  <Col sm={3} xs={12}>
                    <div className="detail">
                      <h4 className="regular">Account Name</h4>
                      <h3 className="regular lg">
                        {franchiseData.billing_contact}
                      </h3>
                    </div>
                  </Col>
                  <Col sm={3} xs={12}>
                    <div className="detail">
                      <h4 className="regular">Rental Revenue Percentage</h4>
                      <h3 className="regular lg">
                        {franchiseData.extra_information.rental_revenue_percentage || "NA"}
                      </h3>
                    </div>
                  </Col>

                </Row>
                <Row>
                <Col sm={3} xs={12}>
                    <div className="detail">
                      <h4 className="regular">Cancellation Revenue Percentage</h4>
                      <h3 className="regular lg">
                        {franchiseData.extra_information.cancellation_revenue_percentage || "NA"}
                      </h3>
                    </div>
                  </Col>
                  <Col sm={3} xs={12}>
                    <div className="detail">
                      <h4 className="regular">Damage Revenue Percentage</h4>
                      <h3 className="regular lg">
                        {franchiseData.extra_information.damage_revenue_percentage || "NA"}
                      </h3>
                    </div>
                  </Col>
                  <Col sm={3} xs={12}>
                    <h4 className="regular">Area</h4>
                    <h3 className="regular lg">
                      {this.areaName(franchiseData.areas)}
                    </h3>
                  </Col>
                  <Col sm={3} xs={12}></Col>
                </Row>
              </div>
              <hr />
              <div className="basic-details">
                <h2>Billing address</h2>
                <Row>
                  <Col sm={3} xs={12}>
                    <div className="detail">
                      <h4 className="regular">Country</h4>
                      <h3 className="regular lg">
                        {franchiseData.billing_address[0].country.name}
                      </h3>
                    </div>
                  </Col>
                  <Col sm={3} xs={12}>
                    <div className="detail">
                      <h4 className="regular">State</h4>
                      <h3 className="regular lg">
                        {franchiseData.billing_address[0].state.name}
                      </h3>
                    </div>
                  </Col>
                  <Col sm={3} xs={12}>
                    <div className="detail">
                      <h4 className="regular">City</h4>
                      <h3 className="regular lg">
                        {franchiseData.billing_address[0].city.name}
                      </h3>
                    </div>
                  </Col>
                  <Col sm={3} xs={12}>
                    <div className="detail">
                      <h4 className="regular">Block Address</h4>
                      <h3 className="regular lg">
                        {franchiseData.billing_address[0].block_address}
                      </h3>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col sm={3} xs={12}>
                    <div className="detail">
                      <h4 className="regular">Tax Reg Number</h4>
                      <h3 className="regular lg">
                        {franchiseData.billing_address[0].tax_reg_number}
                      </h3>
                    </div>
                  </Col>
                  <Col sm={3} xs={12}>
                    <div className="detail">
                      <h4 className="regular">Contact Number</h4>
                      <h3 className="regular lg">
                        {franchiseData.billing_address[0].contact_number}
                      </h3>
                    </div>
                  </Col>
                </Row>
              </div>
              <hr />
              <div className="basic-details">
                <div className="map-vehicle-wrapper">
                  <h2>Mapped Vechicles</h2>
                  <Button
                    className="btn black-btn"
                    onClick={this.handleVehicleAllocation}
                  >
                    Add Vechicle
                  </Button>
                </div>
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
                            return rowData.modelInfo
                              ? rowData.modelInfo.modelName
                              : "-";
                          }
                        },
                      },
                      {
                        coumnWidth: 250,
                        labelName: "Chassis Number",
                        dataKey: "chassisNo",
                        className: "",
                        isCell: true,
                        cell: (rowData, dataKey) => {
                          if (dataKey === "chassisNo") {
                            return rowData.chassisNo;
                          }
                        },
                      },
                      {
                        coumnWidth: 250,
                        labelName: "Registration number",
                        dataKey: "registrationNo",
                        className: "",
                        isCell: true,
                        cell: (rowData, dataKey) => {
                          if (dataKey === "registrationNo") {
                            return rowData.registrationNo || "NA";
                          }
                        },
                      },
                      {
                        coumnWidth: 250,
                        labelName: "Battery Status",
                        dataKey: "batteryStatus",
                        className: "",
                        isCell: true,
                        cell: (rowData, dataKey) => {
                          if (dataKey === "batteryStatus") {
                            return (
                              <p className="status">
                                {" "}
                                <span
                                  className={`circle ${
                                    rowData.attachedBatteries.length > 0 && rowData.attachedBatteries[0].active
                                      ? "active"
                                      : "inactive"
                                  }`}
                                ></span>{" "}
                                {rowData.attachedBatteries.length > 0 && rowData.attachedBatteries[0].active
                                  ? "Attached"
                                  : "Inactive"}
                              </p>
                            );
                          }
                        },
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
                                    rowData.attachedTelematics && rowData.attachedTelematics.active
                                      ? "active"
                                      : "inactive"
                                  }`}
                                ></span>{" "}
                                {rowData.attachedTelematics && rowData.attachedTelematics.active
                                  ? "Attached"
                                  : "Inactive"}
                              </p>
                            );
                          }
                        },
                      },
                      {
                        coumnWidth: 250,
                        labelName: "",
                        dataKey: "options",
                        className: "options-column",
                        isCell: true,
                        cell: (rowData, dataKey) => {
                          if (dataKey === "options") {
                            return (
                              <Button
                                className="btn secondary-btn option-btn"
                                onClick={() => this.handleConfirmation(rowData)}
                              >
                                Remove
                              </Button>
                            );
                          }
                        },
                      },
                    ]}
                    // For Pagination
                    history={this.props.history}
                    location={this.props.location}
                    totalPages={this.state.totalPages}
                    currentPage={this.state.page - 1} // because of 0 based indexing
                    message={"Vehicle list is empty"}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="not-found-wrapper">
            <Image src={notFoundDefault} />
            <p className="red-hat-display-medium f-s-16 black-404">
              No Franchise Data{" "}
            </p>
          </div>
        )}
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  ...state,
});
const mapDispatchToProps = {
  getFranchiseByIdApi,
};
export default connect(mapStateToProps, mapDispatchToProps)(ViewFranchise);
