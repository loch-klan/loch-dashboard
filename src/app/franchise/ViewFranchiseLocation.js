import React from 'react';
import { connect } from "react-redux";
import { AccountType, PermissionList, START_PAGE } from '../../utils/Constant';
import { getAssignedPermission, replaceHistory } from '../../utils/ReusableFunctions';
import { ComponentHeader } from '../common';
import { Col, Row } from "react-bootstrap";
import { BaseReactComponent,FormElement, FormValidator, SelectControl, Form } from '../../utils/form';
import { removeVehiclesFromFranchiseLocationApi } from '../vehicles/Api';
import { getFranchiseLocationByIdApi } from './Api';
import { Button, Image } from "react-bootstrap";
import VehicleAllocationModal from './_utils/VehicleAllocationModal';
import InformationModal from '../common/InformationModal';
import CustomTable from '../../utils/commonComponent/CustomTable';
import { getUserAccountType } from '../../utils/ManageToken';

class ViewFranchiseLocation extends BaseReactComponent {
    constructor(props) {
        super(props);
        const search = props.location.search;
        // console.log('props',props);
        const params = new URLSearchParams(search);
        const page = params.get("p");
        const locationId = props.match.params.locationId;
        const userDetails = JSON.parse(localStorage.getItem('userDetails'));
        // const data = props.location.state ? props.location.state.data : null;
        this.state = {
          userDetails,
            locationId,
            vehiclesList: [],
            totalPages: "",
            data: "",
            // conditions: [{"key": "SEARCH_BY_FRANCHISE_LOCATION_ID", "value": data.id}],
            page: page ? parseInt(page, 10) : START_PAGE + 1,
            showAllocationModal: false,
      showConfirmationModal: false,
        }
    }

    componentDidMount() {
      // if(this.state.userDetails.user_account_type !== AccountType.COMPANY){
      //   this.props.getAllFranchiseLocationApi(this);
      // } else {
      //   this.props.getAllFranchiseApi(this, -1);
      // }
      getFranchiseLocationByIdApi(this);

        this.props.history.replace({
            search: `?p=${this.state.page}`
        })
    }

    componentDidUpdate(prevProps, prevState) {
        const prevParams = new URLSearchParams(prevProps.location.search);
        const prevPage = parseInt(prevParams.get('p'), 10) || 1;

        const params = new URLSearchParams(this.props.location.search);
        const page = parseInt(params.get('p'), 10) || 1;
        const search = params.get('search') || "";

        if (prevPage !== page) {
            // this.setState({ page })
            if (search) {
                // this.props.getAllFranchiseLocationApi(this);
            } else {
                // this.props.getAllFranchiseLocationApi(this, page - 1);
            }
        }
    }
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
      data.append("vehicle_id", this.state.vehicleData.id);
      data.append("franchise_location_id", this.state.locationId);
      removeVehiclesFromFranchiseLocationApi(data, this.handleConfirmation, this);
    };


    render() {
        const { data, page, totalPage, userDetails, franchiseOptionsList, vehiclesList } = this.state;
        const permissionList = getAssignedPermission();
        return (
            <>
                 <ComponentHeader
          backArrowBtn={true}
          history={this.props.history}
          title={"View Franchise Location"}
        />
         {this.state.showAllocationModal && (
          <VehicleAllocationModal
            show={this.state.showAllocationModal}
            handleClose={this.handleVehicleAllocation}
            franchiseId={this.state.data.franchise_account_id}
            locationId={this.state.data.id}
            isFranchiseLocation={true}
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
        {

          <div className="order-details-wrapper add-edit-customer-wrapper">
          <div className="content view-detail-page">
            <div className="basic-details">
              <h2>Basic Details</h2>
              <Row>
              <Col sm={4} xs={12}>
                    <div className="detail">
                      <h4 className="regular">Franchise Id</h4>
                      <h3 className="regular lg">{data ? data.franchise_account_id : "NA"}</h3>
                    </div>
                  </Col>
                  <Col sm={3} xs={12}>
                    <div className="detail">
                      <h4 className="regular">Area Name</h4>
                      <h3 className="regular lg">{data ? data.area_details.name : "NA"}</h3>
                    </div>
                  </Col>
                  <Col sm={5} xs={12}>
                    <div className="detail">
                      <h4 className="regular">Area Name</h4>
                      <h3 className="regular lg">{data ? data.location_details.formatted_address : "NA"}</h3>
                    </div>
                  </Col>
                  </Row>
              </div>
<hr/>
<div className="basic-details">
<div className="map-vehicle-wrapper">
                  <h2>Assigned Vechicles</h2>
                  {
                    getUserAccountType() === AccountType.FRANCHISE &&
                    <Button
                    className="btn black-btn"
                    onClick={this.handleVehicleAllocation}
                  >
                    Add Vehicle
                  </Button>}
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
                        labelName: "",
                        dataKey: "options",
                        className: "options-column",
                        isCell: true,
                        cell: (rowData, dataKey) => {
                          if (dataKey === "options" &&  permissionList.includes(PermissionList.DELETE_FRANCHISE_LOCATION)) {
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
        }
            </>
        )
    }
}

const mapStateToProps = state => ({
    franchiseState: state.FranchiseState
});
const mapDispatchToProps = {
  getFranchiseLocationByIdApi
}
ViewFranchiseLocation.propTypes = {
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewFranchiseLocation);