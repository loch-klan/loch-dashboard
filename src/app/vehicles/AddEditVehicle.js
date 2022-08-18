import React from "react";
import { Col, Row } from "react-bootstrap";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { AccountType } from "../../utils/Constant";
import {
  BaseReactComponent,
  Form,
  CustomTextControl,
  FormElement,
  FormValidator,
  SelectControl,
} from "../../utils/form";
import { getUserAccountType } from "../../utils/ManageToken";
import { ComponentHeader } from "../common";
import {
  addUpdateVehicleApi,
  // getAllAccounts,
  getAllBatteriesDropdownApi,
  getAllBikeModelsDropdownApi,
  getAllIotDropdownApi,
} from "./Api";
class AddEditVehicle extends BaseReactComponent {
  constructor(props) {
    super(props);
    const userAccountType = getUserAccountType();
    const editData = props.location.state ? props.location.state.editData : {};
    console.log("editData", editData)
    this.state = {
      editId: editData.id || "",
      bikeModelOptions: [],
      iotOptions: [],
      batteryOptions: [],
      regNo: editData.registrationNo || "",
      vehicleName: editData.name || "",
      motorNumber: editData.motorNo || "",
      modelId: editData.modelInfo ? editData.modelInfo.id : "",
      chassisNumber: editData.chassisNo || "",
      iot: editData.attachedTelematics ? editData.attachedTelematics.id : "",
      battery1: editData.attachedBatteries
        ? editData.attachedBatteries[0].id
        : "",
      battery2:
        editData.attachedBatteries && editData.attachedBatteries[1]
          ? editData.attachedBatteries[1].id
          : "",
      showBattery2:
        editData.attachedBatteries && editData.attachedBatteries[1]
          ? true
          : false,
      isOem: userAccountType === AccountType.OEM,
    };
  }
  componentDidMount() {
    getAllBikeModelsDropdownApi(this);
    getAllBatteriesDropdownApi(this);
    getAllIotDropdownApi(this);
  }
  handleSave = () => {
    ReactDOM.findDOMNode(this.form).dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true })
    );
  };
  onValidSubmit = () => {
    let batteryIds = [];
    if (this.state.battery1) {
      batteryIds.push(this.state.battery1);
    }
    if (this.state.battery2) {
      batteryIds.push(this.state.battery2);
    }
    const data = new URLSearchParams();
    data.append("model_id", this.state.modelId);
    data.append("chassis_no", this.state.chassisNumber);
    data.append("motor_no", this.state.motorNumber);
    data.append("registration_no", this.state.regNo);
    data.append("name", this.state.vehicleName);
    if (this.state.iot) {
      data.append("telematics_id", this.state.iot);
    }
    data.append("battery_ids", JSON.stringify(batteryIds));
    if (this.state.editId) {
      data.append("vehicle_id", this.state.editId);
    }

    addUpdateVehicleApi(data, () => {
      this.props.history.push("/vehicles");
    });
  };
  render() {
    return (
      <>
        <ComponentHeader
          backArrowBtn={true}
          history={this.props.history}
          title={`${this.state.editId ? "Edit" : "Add"} Vehicle`}
          secondaryBtnText={"Cancel"}
          isSecondaryBtn={() => this.props.history.goBack()}
          isPrimaryBtn={this.handleSave}
          primaryBtnText={"Save Vehicle"}
        />
        <div className="add-edit-customer-wrapper">
          <div className="content">
            <Form
              onValidSubmit={this.onValidSubmit}
              ref={(el) => (this.form = el)}
            >
              <Row>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "vehicleName")}
                    label="Vehicle Name"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Vehicle name cannot be empty",
                      },
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Vehicle Name",
                      },
                    }}
                  />
                </Col>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "regNo")}
                    label="Registration Number"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Registration number cannot be empty",
                      },
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Registration Number",
                      },
                    }}
                  />
                </Col>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "motorNumber")}
                    label="Motor Number"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Motor number cannot be empty",
                      },
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Motor Number",
                      },
                    }}
                  />
                </Col>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "chassisNumber")}
                    label="Chassis Number"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Chassis number cannot be empty",
                      },
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Chassis Number",
                      },
                    }}
                  />
                </Col>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "modelId")}
                    label="Model Name"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Model name cannot be empty",
                      },
                    ]}
                    control={{
                      type: SelectControl,
                      settings: {
                        placeholder: "Select Model Name",
                        options: this.state.bikeModelOptions,
                        multiple: false,
                        searchable: true,
                        onChangeCallback: () => {
                          const selectedModel =
                            this.state.bikeModelOptions.find(
                              (item) => item.value === this.state.modelId
                            );
                          this.setState({
                            showBattery2: selectedModel.noOfBatteries === 2,
                          });
                        },
                      },
                    }}
                  />
                </Col>

                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "iot")}
                    label="IOT"
                    control={{
                      type: SelectControl,
                      settings: {
                        placeholder: "Select Iot",
                        options: this.state.iotOptions,
                        multiple: false,
                        searchable: true,
                      },
                    }}
                  />
                </Col>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "battery1")}
                    label="Battery 1"
                    control={{
                      type: SelectControl,
                      settings: {
                        placeholder: "Select Battery",
                        options: this.state.batteryOptions,
                        multiple: false,
                        searchable: true,
                        onChangeCallback: (onBlur) => {
                          onBlur(this.state.battery1);
                        },
                      },
                    }}
                  />
                </Col>
                {this.state.showBattery2 && (
                  <Col md={4}>
                    <FormElement
                      valueLink={this.linkState(this, "battery2")}
                      label="Battery 2"
                      control={{
                        type: SelectControl,
                        settings: {
                          placeholder: "Select Battery",
                          options: this.state.batteryOptions,
                          multiple: false,
                          searchable: true,
                        },
                      }}
                    />
                  </Col>
                )}
                {/* {this.props.isEdit && (
                  <Col md={4}>
                    <FormElement
                      valueLink={this.linkState(this, "regNo")}
                      label="Registration Number"
                      required
                      disabled
                      validations={[
                        {
                          validate: FormValidator.isRequired,
                          message: "Registration number cannot be empty",
                        },
                      ]}
                      control={{
                        type: CustomTextControl,
                        settings: {
                          placeholder: "Enter Registration Number",
                        },
                      }}
                    />
                  </Col>
                )} */}
              </Row>
            </Form>
          </div>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  vehiclesState: state.VehiclesState,
});
const mapDispatchToProps = {
  // getPosts: fetchPosts
};
export default connect(mapStateToProps, mapDispatchToProps)(AddEditVehicle);
