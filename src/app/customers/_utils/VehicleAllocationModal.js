import React from 'react';
import PropTypes from 'prop-types';
import {
  BaseReactComponent, Form, FormElement, FormSubmitButton, FormValidator, CustomTextControl
} from '../../../utils/form';
import { CustomModal } from "../../common";
import { updateVehicleRegistrationApi } from '../../vehicles/Api';

class VehicleAllocationModal extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      regNo: "",
      vehicleData: "",
      isApiCall: false,
    }
  }
  componentDidMount() {
    localStorage.setItem("vehicleId", this.props.vehicleId);
  }

  componentWillUnmount() {
    localStorage.removeItem('vehicleId');
  }

  onSubmit = () => {
    const data = new URLSearchParams();
    data.append('registration_no', this.state.regNo);
    updateVehicleRegistrationApi(this, data, (vehicleData) => {
      let customerData = this.props.ctx.state.customerData
      customerData.vehicles[0] = vehicleData;
      // console.log('this.props.ctx.state.customerData', this.props.ctx.state.customerData);
      // console.log('vehicleData', vehicleData);
      this.props.ctx.setState({
        customerData
      })
      this.props.handleClose()
    });
  }

  render() {
    return (
      <CustomModal
        show={this.props.show}
        onHide={() => this.props.handleClose()}
        title={"Update Vehicle Registration No. "}
      >
        <Form onValidSubmit={this.onSubmit}>
          <div className='modal-wrapper'>
            <FormElement
              valueLink={this.linkState(this, "regNo")}
              label="Vehicle Registration No."
              required
              validations={[
                {
                  validate: FormValidator.isRequired,
                  message: "Vehicle registration no. cannot be empty"
                },
              ]}
              control={{
                type: CustomTextControl,
                settings: {
                  placeholder: "Enter Vehicle Registration No.",
                }
              }}
            />
          </div>
          <div className="submit-wrapper" style={{ justifyContent: 'right' }}>
            <FormSubmitButton customClass={`btn black-btn ${!this.state.regNo && "inactive-btn"}`}>Done</FormSubmitButton>
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