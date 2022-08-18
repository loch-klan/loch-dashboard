import React, { Component } from "react";
import { connect } from "react-redux";
import { Col, Row, Tab, Tabs } from "react-bootstrap";
import notFoundDefault from "../../assets/images/empty-table.png";
import { Button, Image } from "react-bootstrap";
import { ComponentHeader } from "../common";
import { getBikeModelByIdApi, getAllVehiclePricingApi } from "./Api";
import CustomTable from "../../utils/commonComponent/CustomTable";
import {
  MEDIA_URL,
  PricingLevel,
  PricingType,
} from "../../utils/Constant";
// import {
//   getAssignedPermission,
// } from "../../utils/ReusableFunctions";
// import ActionDropdown from "../common/_utils/ActionDropdown";
// import VehicleAllocationModal from "./_utils/VehicleAllocationModal";
// import InformationModal from "../common/InformationModal";
import AddEditVehiclePricing from "./_utils/AddEditVehiclePricing";

class ViewBikeModel extends Component {
  constructor(props) {
    super(props);
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const page = params.get("p");
    let modelId = props.match.params.modelId ? props.match.params.modelId : "";

    this.state = {
      modelId,
      bikeModelData: "",
      pricingData: "",
      vehiclesList: [],
      showAddEditVehiclePricing: false,
      page: page ? parseInt(page, 10) : 1,
      totalPages: 1,
      searchKey: "SEARCH_BY_ACCOUNT_ID",
      selectedTab: "default",
      conditions: [{ key: "SEARCH_BY_IS_DEFAULT", value: true }]
    };
  }

  componentDidMount() {
    const data = new URLSearchParams();
    data.append("model_id", this.state.modelId);
    getBikeModelByIdApi(data, this);
    const data2 = new URLSearchParams();
    data2.append("model_id", this.state.modelId);
    data2.append("conditions", JSON.stringify(this.state.conditions));
    this.props.getAllVehiclePricingApi(data2);
    this.props.history.replace({
      search: `?tab=${this.state.selectedTab}&p=${this.state.page}`
    })
  }

  handlePricing = (data = "") => {
    // this.setState({
    //   showAddEditVehiclePricing: !this.state.showAddEditVehiclePricing,
    //   data,
    // });
    this.props.history.push({
      pathname: `/master/bike-models/view-details/${this.state.modelId}/add-edit-pricing`,
      state: { data, state: this.state }
    })
  };

  setKey = (k) => {
    this.setState({
      selectedTab: k,
      page: 1,
      conditions: [{ key: k === "default" ? "SEARCH_BY_IS_DEFAULT" : "SEARCH_BY_PRICING_LEVEL", value: k === "default" ? true : parseInt(k) }]
    }, () => {
      const data2 = new URLSearchParams();
      data2.append("model_id", this.state.modelId);
      data2.append("conditions", JSON.stringify(this.state.conditions));
      this.props.getAllVehiclePricingApi(data2);
    })
    this.props.history.replace({
      search: `?tab=${k}&p=1`
    })
  }

  showTable = (pricingData) => {
    return (
      <div className="custom-table-wrapper">
        <CustomTable
          tableData={pricingData}
          columnList={[
            {
              coumnWidth: 80,
              labelName: "Price",
              dataKey: "price",
              className: "red-hat-display-bold",
              isCell: true,
              cell: (rowData, dataKey) => {
                if (dataKey === "price") {
                  return rowData.price ? rowData.price : "-";
                }
              },
            },
            {
              coumnWidth: 150,
              labelName: "Pricing Level",
              dataKey: "pricing_level",
              className: "",
              isCell: true,
              cell: (rowData, dataKey) => {
                if (dataKey === "pricing_level") {
                  return PricingLevel.getText(rowData.pricing_level);
                }
              },
            },
            {
              coumnWidth: 150,
              labelName: "Pricing Type",
              dataKey: "pricing_type",
              className: "",
              isCell: true,
              cell: (rowData, dataKey) => {
                if (dataKey === "pricing_type") {
                  return PricingType.getText(rowData.pricing_type);
                }
              },
            },
            // {
            //   coumnWidth: 140,
            //   labelName: "Rental Time",
            //   dataKey: "rental_time",
            //   className: "",
            //   isCell: true,
            //   cell: (rowData, dataKey) => {
            //     if (dataKey === "rental_time") {
            //       return rowData.rental_time || "NA";
            //     }
            //   },
            // },
            // {
            //   coumnWidth: 160,
            //   labelName: "Price per km",
            //   dataKey: "per_km_price",
            //   className: "",
            //   isCell: true,
            //   cell: (rowData, dataKey) => {
            //     if (dataKey === "per_km_price") {
            //       return rowData.per_km_price || "NA";
            //     }
            //   },
            // },
            // {
            //   coumnWidth: 200,
            //   labelName: "Penalty price per km",
            //   dataKey: "penalty_price_per_hour",
            //   className: "",
            //   isCell: true,
            //   cell: (rowData, dataKey) => {
            //     if (dataKey === "penalty_price_per_hour") {
            //       return rowData.penalty_price_per_hour || "NA";
            //     }
            //   },
            // },
            {
              coumnWidth: 150,
              labelName: "Minimum Time Booking",
              dataKey: "minimum_time_booking",
              className: "",
              isCell: true,
              cell: (rowData, dataKey) => {
                if (dataKey === "minimum_time_booking") {
                  return rowData.minimum_time_booking || "NA";
                }
              },
            },
            {
              coumnWidth: 100,
              labelName: "Default",
              dataKey: "is_default",
              className: "",
              isCell: true,
              cell: (rowData, dataKey) => {
                if (dataKey === "is_default") {
                  return rowData.is_default ? "Yes" : "No";
                }
              },
            },
            {
              coumnWidth: 100,
              labelName: "",
              dataKey: "options",
              className: "options-column",
              isCell: true,
              cell: (rowData, dataKey) => {
                if (dataKey === "options") {
                  return (
                    <Button
                      className="btn secondary-btn option-btn"
                      onClick={() => this.handlePricing(rowData)}
                    >
                      Edit
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
          message={"Pricing list is empty"}
        />
      </div>
    )
  }

  render() {
    const { bikeModelData } = this.state;
    const { pricingData } = this.props.bikeModelState;
    // const permissionList = getAssignedPermission();
    console.log('bikeModelData', bikeModelData);
    return (
      <div>
        <ComponentHeader
          backArrowBtn={true}
          history={this.props.history}
          title={"View Bike Model"}
        />
        {this.state.showAddEditVehiclePricing && (
          <AddEditVehiclePricing
            show={this.state.showAddEditVehiclePricing}
            handleClose={() => this.handlePricing()}
            modelId={bikeModelData.id}
            ctx={this}
          />
        )}
        {bikeModelData && bikeModelData.id ? (
          <div className="order-details-wrapper add-edit-customer-wrapper">
            <div className="content view-detail-page">
              <div className="basic-details">
                <h2>Basic Details</h2>
                <Row>
                  <Col sm={3} xs={12}>
                    <div className="detail">
                      <h4 className="regular">Model Name</h4>
                      <h3 className="regular lg">{bikeModelData.modelName}</h3>
                    </div>
                  </Col>
                  <Col sm={3} xs={12}>
                    <div className="detail">
                      <h4 className="regular">Model Company</h4>
                      <h3 className="regular lg">
                        {bikeModelData.modelCompany}
                      </h3>
                    </div>
                  </Col>
                  <Col sm={3} xs={12}>
                    <div className="detail">
                      <h4 className="regular">No. of batteries</h4>
                      <h3 className="regular lg">
                        {bikeModelData.noOfBatteries}
                      </h3>
                    </div>
                  </Col>
                  <Col sm={3} xs={12}>
                    <div className="detail">
                      <h4 className="regular">Tax Percentage</h4>
                      <h3 className="regular lg">
                        {bikeModelData.taxPercentage}
                      </h3>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col sm={3} xs={12}>
                    <div className="detail">
                      <h4 className="regular">Tax Code</h4>
                      <h3 className="regular lg">
                        {bikeModelData.taxCode}
                      </h3>
                    </div>
                  </Col>
                  <Col sm={3} xs={12}>
                    <div className="detail">
                      <h4 className="regular">Optimal Speed</h4>
                      <h3 className="regular lg">
                        Min: {bikeModelData.vehicleInformation.optimalSpeed ? bikeModelData.vehicleInformation.optimalSpeed.min : 0}, Max: {bikeModelData.vehicleInformation.optimalSpeed ? bikeModelData.vehicleInformation.optimalSpeed.max : 0}
                      </h3>
                    </div>
                  </Col>
                  <Col sm={3} xs={12}>
                    <div className="detail">
                      <h4 className="regular">Charging Time</h4>
                      <h3 className="regular lg">
                        Min: {bikeModelData.vehicleInformation.chargingTime ? bikeModelData.vehicleInformation.chargingTime.min : "0"}, Max: {bikeModelData.vehicleInformation.chargingTime ? bikeModelData.vehicleInformation.chargingTime.max : "0"}
                      </h3>
                    </div>
                  </Col>
                  <Col sm={3} xs={12}>
                    <div className="detail">
                      <h4 className="regular">Power</h4>
                      <h3 className="regular lg">
                        Min: {bikeModelData.vehicleInformation.continuousPower ? bikeModelData.vehicleInformation.continuousPower.min : "0"}, Max: {bikeModelData.vehicleInformation.continuousPower ? bikeModelData.vehicleInformation.continuousPower.max : "0"}
                      </h3>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col sm={3} xs={12}>
                    <div className="detail">
                      <h4 className="regular">Torque</h4>
                      <h3 className="regular lg">
                        Min: {bikeModelData.vehicleInformation.torque ? bikeModelData.vehicleInformation.torque.min : "0"}, Max: {bikeModelData.vehicleInformation.torque ? bikeModelData.vehicleInformation.torque.max : "0"}
                      </h3>
                    </div>
                  </Col>
                  <Col sm={3} xs={12}>
                    <div className="detail">
                      <h4 className="regular">Range</h4>
                      <h3 className="regular lg">
                        Min: {bikeModelData.vehicleInformation.vehicleRange ? bikeModelData.vehicleInformation.vehicleRange.min : "0"}, Max: {bikeModelData.vehicleInformation.vehicleRange ? bikeModelData.vehicleInformation.vehicleRange.max : "0"}
                      </h3>
                    </div>
                  </Col>
                  <Col sm={3} xs={12}>
                    <div className="detail">
                      <h4 className="regular">Optimal Acceleration</h4>
                      <h3 className="regular lg">
                        Min: {bikeModelData.vehicleInformation.optimalAcceleration ? bikeModelData.vehicleInformation.optimalAcceleration.min : "0"}, Max: {bikeModelData.vehicleInformation.optimalAcceleration ? bikeModelData.vehicleInformation.optimalAcceleration.max : "0"}
                      </h3>
                    </div>
                  </Col>
                  <Col sm={3} xs={12}>
                    <div className="detail">
                      <h4 className="regular">Vehicle Image</h4>
                      <h3 className="regular lg">
                        {bikeModelData.images ? <Image src={MEDIA_URL + bikeModelData.images[0] ?.path} style={{ height: "8rem", objectFit: "contain" }} /> : "NA"}
                      </h3>
                    </div>
                  </Col>
                </Row>
              </div>
              <hr />

              <div className="basic-details">
                <div className="map-vehicle-wrapper">
                  <h2>Bike Model Pricing</h2>
                  <Button
                    className="btn black-btn"
                    onClick={() => this.handlePricing()}
                  >
                    Add Pricing
                  </Button>
                </div>
                <Tabs
                  id="controlled-tab-example"
                  activeKey={this.state.selectedTab}
                  onSelect={(k) => this.setKey(k)}
                  className="pricing-tabs"
                >
                  <Tab eventKey="default" title="Default">
                    {this.showTable(pricingData)}
                  </Tab>
                  <Tab eventKey="30" title="City">
                    {this.showTable(pricingData)}
                  </Tab>
                  <Tab eventKey="40" title="Area">
                    {this.showTable(pricingData)}
                  </Tab>
                </Tabs>

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
  // ...state,
  bikeModelState: state.BikeModelState,
});
const mapDispatchToProps = {
  getBikeModelByIdApi,
  getAllVehiclePricingApi,
};
export default connect(mapStateToProps, mapDispatchToProps)(ViewBikeModel);
