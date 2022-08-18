import React from 'react';
import PropTypes from 'prop-types';
import {
  BaseReactComponent, Form, FormElement, FormSubmitButton, FormValidator, SelectControl
} from '../../../utils/form';
import { CustomModal } from "../../common";
// import { updateVehicleRegistrationApi } from '../../vehicles/Api';
import { getAllVehiclesApi, assignVehiclesToFranchiseApi, assignVehiclesToFranchiseLocationApi } from '../../vehicles/Api';

class VehicleAllocationModal extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      regNo: "",
      vehicleData: "",
      isApiCall: false,
      bikeOptions: [],
      vehicleIds: "",
      page: 1,
      totalPages: 1,
      // searchText: "",
      // searchKey: 'SEARCH_BY_ACCOUNT_ID',
      conditions: props.isFranchiseLocation
                  ?
                  [
                    {"key": "SEARCH_BY_ACCOUNT_ID", "value": props.franchiseId},
                    {"key": "SEARCH_BY_FRANCHISE_LOCATION_ID", "value": null},
                  ]
                  :
                  [{"key": "SEARCH_BY_ACCOUNT_ID", "value": []}],
    }
  }
  componentDidMount() {
    getAllVehiclesApi(this, true);
  }

  onSubmit = () => {
    const data = new URLSearchParams();
    data.append('vehicle_ids', JSON.stringify(this.state.vehicleIds));

    if(this.props.isFranchiseLocation){
      data.append('franchise_location_id', this.props.locationId);
      assignVehiclesToFranchiseLocationApi(data, this.props.handleClose, this.props.ctx)
    } else {
      data.append('franchise_id', this.props.franchiseId)
      assignVehiclesToFranchiseApi(data, this.props.handleClose, this.props.ctx)
    }

  }

  render() {
    return (
      <CustomModal
        show={this.props.show}
        onHide={() => this.props.handleClose()}
        title={"Allocate Vehicle"}
      >
        <Form onValidSubmit={this.onSubmit}>
          <div className='modal-wrapper'>
            <FormElement
              valueLink={this.linkState(this, "vehicleIds")}
              label="Vechicle"
              required
              validations={[
                {
                  validate: FormValidator.isRequired,
                  message: "Vechicle name cannot be empty",
                },
              ]}
              control={{
                type: SelectControl,
                settings: {
                  placeholder: "Select Vehicle",
                  options: this.state.bikeOptions,
                  multiple: true,
                  searchable: true,
                  onChangeCallback: () => {
                  },
                },
              }}
            />
          </div>
          <div className="submit-wrapper" style={{ justifyContent: 'right' }}>
            <FormSubmitButton customClass={`btn black-btn ${!this.state.vehicleIds && "inactive-btn"}`}>Done</FormSubmitButton>
          </div>
        </Form>

      </CustomModal>
    )
  }
}

VehicleAllocationModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default VehicleAllocationModal;