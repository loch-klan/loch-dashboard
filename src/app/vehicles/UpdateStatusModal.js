import React from "react";
import PropTypes from "prop-types";
import {
  BaseReactComponent,
  Form,
  FormElement,
  FormSubmitButton,
  CustomTextControl,
  FormValidator,
  SelectControl,
} from "../../utils/form";
import { CustomModal } from "../common";
import { Col, Row, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { VehicleStatusOptions } from "../../utils/Constant";
import { updateStatusApi } from "./Api";
// import { addRewardsApi } from "./Api";

class UpdateStatusModal extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      status: props.vehicleInfo.status || "",
    };
  }

  componentDidMount() {}

  onSubmit = () => {
    const data = new URLSearchParams();
    data.append("vehicle_status", this.state.status);
    data.append("vehicle_id", this.props.vehicleInfo.id);
    updateStatusApi(data, this.props.handleUpdate);
  };

  render() {
    return (
      <CustomModal
        show={this.props.show}
        onHide={() => this.props.handleClose()}
        title={"Update Status"}
      >
        <Form onValidSubmit={this.onSubmit}>
          <div className="modal-wrapper">
            <FormElement
              valueLink={this.linkState(this, "status")}
              label="Vehicle Status"
              required
              validations={[
                {
                  validate: FormValidator.isRequired,
                  message: "Vehicle status cannot be empty",
                },
              ]}
              control={{
                type: SelectControl,
                settings: {
                  placeholder: "Select Status",
                  options: VehicleStatusOptions,
                  multiple: false,
                  searchable: true,
                  onChangeCallback: (onBlur) => {
                    onBlur(this.state.status);
                  },
                },
              }}
            />
          </div>
          <div className="submit-wrapper" style={{ justifyContent: "right" }}>
            <FormSubmitButton
              customClass={`btn black-btn ${
                !this.state.status && "inactive-btn"
              }`}
            >
              Done
            </FormSubmitButton>
          </div>
        </Form>
      </CustomModal>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state,
});

const mapDispatchToProps = {
  // getPosts: fetchPosts
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateStatusModal);
