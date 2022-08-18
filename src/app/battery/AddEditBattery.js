import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import { GenderOptions, ModelName } from '../../utils/Constant';
import { BaseReactComponent, Form, CustomTextControl, FormElement, FormValidator, SelectControl } from '../../utils/form';
import { ComponentHeader } from '../common';
import ReactDOM from 'react-dom';
import { addUpdateBatteryApi, getBatteryModelApi } from './Api';
import { getIotApi } from '../iot/Api';
class AddEditBattery extends BaseReactComponent {
  constructor(props) {
    super(props);
    const data = props.location.state ? props.location.state.data : null;
    this.state = {
      batteryId: data ? data.id : "",
      batteryModel: data ? data.modelInfo.id : "",
      serialNo: data ? data.serialNo : "",
      iotId: data && data.attachedTelematics ? data.attachedTelematics.id : "",
      purchaseDate: "",
      batteryModalOptions: [],
      iotModalOptions: []
    }
  }
  componentDidMount() {
    this.props.getBatteryModelApi(this);
    this.props.getIotApi(this);
  }

  handleSave = () => {
    const data = new URLSearchParams();
    data.append("model_id", this.state.batteryModel);
    data.append("serial_no", this.state.serialNo);
    data.append("telematics_id", this.state.iotId);

    if (this.state.batteryId)
      data.append("battery_id", this.state.batteryId);

    addUpdateBatteryApi(data, () => this.props.history.goBack());
  }

  onNextClick = () => {
    ReactDOM.findDOMNode(this.form).dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
  }

  render() {
    console.log('this.props', this.props);
    return (
      <>
        <ComponentHeader
          backArrowBtn={true}
          history={this.props.history}
          title={this.state.batteryId ? "Edit Battery" : "Add Battery"}
          secondaryBtnText={"Cancel"}
          isSecondaryBtn={() => this.props.history.goBack()}
          isPrimaryBtn={this.onNextClick}
          primaryBtnText={"Save Battery"}
        />
        <div className="add-edit-customer-wrapper">
          <div className="content">
            <Form onValidSubmit={this.handleSave} ref={el => this.form = el}>
              <Row>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "batteryModel")}
                    label="Battery Model"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Battery model name cannot be empty"
                      },
                    ]}
                    control={{
                      type: SelectControl,
                      settings: {
                        placeholder: "Select Battery Model",
                        options: this.state.batteryModalOptions,
                        multiple: false,
                        searchable: true,
                        onChangeCallback: (onBlur) => {
                          onBlur(this.state.batteryModel);
                        }
                      }
                    }}
                  />
                </Col>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "serialNo")}
                    label="Battery Serial Number"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Battery serial number cannot be empty"
                      },
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Battery Serial Number",
                      }
                    }}
                  />
                </Col>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "iotId")}
                    label="IOT"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Iot cannot be empty"
                      },
                    ]}
                    control={{
                      type: SelectControl,
                      settings: {
                        placeholder: "Select Iot",
                        options: this.state.iotModalOptions,
                        multiple: false,
                        searchable: true,
                        onChangeCallback: (onBlur) => {
                          onBlur(this.state.iotId);
                        }
                      }
                    }}
                  />
                </Col>
                {/* <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "purchaseDate")}
                    label="Purchase Date"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Purchase date cannot be empty"
                      },
                    ]}
                    control={{
                      type: DatePickerControl,
                      settings: {
                        placeholder: "Select Purchase Date",
                      }
                    }}
                  />
                </Col> */}
                {
                  this.state.modelName === ModelName.RUGGEDG2.toString() &&
                  <Col md={4}>
                    <FormElement
                      valueLink={this.linkState(this, "battery2")}
                      label="Battery 2"
                      required
                      validations={[
                        {
                          validate: FormValidator.isRequired,
                          message: "Battery 2 cannot be empty"
                        },
                      ]}
                      control={{
                        type: SelectControl,
                        settings: {
                          placeholder: "Select Battery",
                          options: GenderOptions,
                          multiple: false,
                          searchable: true,
                          onChangeCallback: (onBlur) => {
                            onBlur(this.state.battery2);
                          }
                        }
                      }}
                    />
                  </Col>
                }
                {
                  this.props.isEdit &&
                  <Col md={4}>
                    <FormElement
                      valueLink={this.linkState(this, "regNo")}
                      label="Registration Number"
                      required
                      disabled
                      validations={[
                        {
                          validate: FormValidator.isRequired,
                          message: "Registration number cannot be empty"
                        },
                      ]}
                      control={{
                        type: CustomTextControl,
                        settings: {
                          placeholder: "Enter Registration Number",
                        }
                      }}
                    />
                  </Col>
                }
              </Row>
            </Form>
          </div>
        </div>
      </>
    )
  }
}
const mapStateToProps = state => ({
  batteryState: state.BatteryState
});
const mapDispatchToProps = {
  getBatteryModelApi,
  getIotApi
}
export default connect(mapStateToProps, mapDispatchToProps)(AddEditBattery);