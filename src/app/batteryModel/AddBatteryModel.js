import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import { BaseReactComponent, CustomTextControl, Form, FormElement, FormValidator } from '../../utils/form';
import { ComponentHeader } from '../common';
import ReactDOM from 'react-dom';
import { addUpdateBatteryModelApi } from './Api';

class AddEditBatteryModel extends BaseReactComponent {
  constructor(props) {
    super(props);
    const editData = props.location.state ? props.location.state.editData : null;
    this.state = {
      editId: editData ? editData.id : "",
      modelName: editData ? editData.modelName : "",
      modelCompany: editData ? editData.modelCompany : "",
      batteryType: editData ? editData.batteryInformation.type : "",
      minVoltage: editData ? editData.batteryInformation.optimalVoltageRange.min : "",
      maxVoltage: editData ? editData.batteryInformation.optimalVoltageRange.max : "",
      minCharging: editData ? editData.batteryInformation.chargingTime.min : "",
      maxCharging: editData ? editData.batteryInformation.chargingTime.max : "",
      minPeak: editData ? editData.batteryInformation.peakPower.min : "",
      maxPeak: editData ? editData.batteryInformation.peakPower.max : "",
    }
  }
  componentDidMount() { }
  handleSave = () => {
    ReactDOM.findDOMNode(this.form).dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
  }

  onValidSubmit = () => {
    const data = new URLSearchParams();
    data.append("model_name", this.state.modelName);
    data.append("model_company", this.state.modelCompany);
    data.append("battery_type", this.state.batteryType);
    data.append("optimal_voltage_range", JSON.stringify({ "min": parseInt(this.state.minVoltage), "max": parseInt(this.state.maxVoltage) }));
    data.append("charging_time", JSON.stringify({ "min": parseInt(this.state.minCharging), "max": parseInt(this.state.maxCharging) }));
    data.append("peak_power", JSON.stringify({ "min": parseInt(this.state.minPeak), "max": parseInt(this.state.maxPeak) }));
    if (this.state.editId) {
      data.append("model_id", this.state.editId);
    }
    addUpdateBatteryModelApi(data, () => {
      this.props.history.push('/master/battery-models');
    })
  }

  render() {
    return (
      <>
        <ComponentHeader
          backArrowBtn={true}
          history={this.props.history}
          title={`${this.state.editId ? "Edit" : "Add"} Battery Model`}
          secondaryBtnText={"Cancel"}
          isSecondaryBtn={() => this.props.history.goBack()}
          isPrimaryBtn={this.handleSave}
          primaryBtnText={"Save Battery Model"}
        />
        <div className="add-edit-customer-wrapper">
          {/* <Container> */}
          <div className="content">
            <Form onValidSubmit={this.onValidSubmit} ref={el => this.form = el}>
              <Row>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "modelName")}
                    label="Model Name"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Model name cannot be empty"
                      },
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Model Name",
                      }
                    }}
                  />
                </Col>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "modelCompany")}
                    label="Model Company"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Model company cannot be empty"
                      },
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Model Company",
                      }
                    }}
                  />
                </Col>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "batteryType")}
                    label="Battery Type"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Battery type cannot be empty"
                      },
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Battery Type",
                      }
                    }}
                  />
                </Col>
                <Col md={6}>
                  <div className='min-max-element'>
                    <FormElement
                      valueLink={this.linkState(this, "minVoltage")}
                      label="Optimal Voltage Range"
                      required
                      validations={[
                        {
                          validate: FormValidator.isRequired,
                          message: "Minimum voltage cannot be empty"
                        },
                        {
                          validate: FormValidator.isNum,
                          message: "Please enter numeric value"
                        },
                        {
                          validate: FormValidator.isInt,
                          message: "Please enter numeric value"
                        },
                      ]}
                      control={{
                        type: CustomTextControl,
                        settings: {
                          placeholder: "Enter Minimum Voltage",
                        }
                      }}
                    />
                    <FormElement
                      valueLink={this.linkState(this, "maxVoltage")}
                      label=""
                      required
                      validations={[
                        {
                          validate: FormValidator.isRequired,
                          message: "Maximum voltage cannot be empty"
                        },
                        {
                          validate: FormValidator.isNum,
                          message: "Please enter numeric value"
                        },
                        {
                          validate: FormValidator.isInt,
                          message: "Please enter numeric value"
                        },
                      ]}
                      control={{
                        type: CustomTextControl,
                        settings: {
                          placeholder: "Enter Maximum Voltage",
                        }
                      }}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className='min-max-element'>
                    <FormElement
                      valueLink={this.linkState(this, "minCharging")}
                      label="Charging Time"
                      required
                      validations={[
                        {
                          validate: FormValidator.isRequired,
                          message: "Minimum charging time cannot be empty"
                        },
                        {
                          validate: FormValidator.isNum,
                          message: "Please enter numeric value"
                        },
                        {
                          validate: FormValidator.isInt,
                          message: "Please enter numeric value"
                        },
                      ]}
                      control={{
                        type: CustomTextControl,
                        settings: {
                          placeholder: "Enter Minimum Charging Time",
                        }
                      }}
                    />
                    <FormElement
                      valueLink={this.linkState(this, "maxCharging")}
                      label=""
                      required
                      validations={[
                        {
                          validate: FormValidator.isRequired,
                          message: "Maximum charging time cannot be empty"
                        },
                        {
                          validate: FormValidator.isNum,
                          message: "Please enter numeric value"
                        },
                        {
                          validate: FormValidator.isInt,
                          message: "Please enter numeric value"
                        },
                      ]}
                      control={{
                        type: CustomTextControl,
                        settings: {
                          placeholder: "Enter Maximum Charging Time",
                        }
                      }}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className='min-max-element'>
                    <FormElement
                      valueLink={this.linkState(this, "minPeak")}
                      label="Peak Power"
                      required
                      validations={[
                        {
                          validate: FormValidator.isRequired,
                          message: "Minimum peak power cannot be empty"
                        },
                        {
                          validate: FormValidator.isNum,
                          message: "Please enter numeric value"
                        },
                        {
                          validate: FormValidator.isInt,
                          message: "Please enter numeric value"
                        },
                      ]}
                      control={{
                        type: CustomTextControl,
                        settings: {
                          placeholder: "Enter Minimum Peak Power",
                        }
                      }}
                    />
                    <FormElement
                      valueLink={this.linkState(this, "maxPeak")}
                      label=""
                      required
                      validations={[
                        {
                          validate: FormValidator.isRequired,
                          message: "Maximum peak power cannot be empty"
                        },
                        {
                          validate: FormValidator.isNum,
                          message: "Please enter numeric value"
                        },
                        {
                          validate: FormValidator.isInt,
                          message: "Please enter numeric value"
                        },
                      ]}
                      control={{
                        type: CustomTextControl,
                        settings: {
                          placeholder: "Enter Maximum Peak Power",
                        }
                      }}
                    />
                  </div>
                </Col>
              </Row>
            </Form>
          </div>
          {/* </Container> */}
        </div>
      </>
    )
  }
}
const mapStateToProps = state => ({
  ...state
});
const mapDispatchToProps = {
  // getPosts: fetchPosts
}
export default connect(mapStateToProps, mapDispatchToProps)(AddEditBatteryModel);