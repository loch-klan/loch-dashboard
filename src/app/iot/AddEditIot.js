import React from "react"
import { Col, Row } from "react-bootstrap"
import { connect } from "react-redux"
import {
  BaseReactComponent,
  CustomTextControl,
  Form,
  FormElement,
  FormValidator,
  SelectControl
} from "../../utils/form"
import { ComponentHeader } from "../common"
import ReactDOM from "react-dom"
import { addUpdateIotApi, getIotModelApi } from "./Api"

class AddEditIot extends BaseReactComponent {
  constructor(props) {
    super(props)
    const data = props.location.state ? props.location.state.data : null
    this.state = {
      telematicsId: data ? data.id : "",
      isEdit: data && data ? true : false,
      modelId: data ? data.modelInfo.id : "",
      serialNo: data ? data.serialNo : "",
      iotModalOptions: [],
      simNumber: data ? data.simCardInfo.simcardId : "",
      imeiNo: data ? data.imei : ""
    }
  }
  componentDidMount() {
    this.props.getIotModelApi(this)
  }

  onSubmit = () => {
    const data = new URLSearchParams()
    data.append("model_id", this.state.modelId)
    data.append("serial_no", this.state.serialNo)
    data.append("sim_number", this.state.simNumber)
    data.append("imei_number", this.state.imeiNo)
    if (this.state.telematicsId) {
      data.append("telematics_id", this.state.telematicsId)
    }
    addUpdateIotApi(data, () => this.props.history.goBack())
  }

  onNextClick = () => {
    ReactDOM.findDOMNode(this.form).dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true })
    )
  }

  render() {
    return (
      <>
        <ComponentHeader
          backArrowBtn={true}
          history={this.props.history}
          title={this.state.telematicsId ? "Edit Iot" : "Add Iot"}
          secondaryBtnText={"Cancel"}
          isSecondaryBtn={() => this.props.history.goBack()}
          isPrimaryBtn={this.onNextClick}
          primaryBtnText={"Save Iot"}
        />
        <div className="add-edit-customer-wrapper">
          <div className="content">
            <Form onValidSubmit={this.onSubmit} ref={(el) => (this.form = el)}>
              <Row>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "modelId")}
                    label="IOT Model"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "IOT model cannot be empty"
                      }
                    ]}
                    control={{
                      type: SelectControl,
                      settings: {
                        placeholder: "Select Model",
                        options: this.state.iotModalOptions,
                        multiple: false,
                        searchable: true,
                        onChangeCallback: (onBlur) => {
                          onBlur(this.state.modelId)
                        }
                      }
                    }}
                  />
                </Col>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "serialNo")}
                    label="IOT Serial Number"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "IOT serial number cannot be empty"
                      }
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter IOT Serial Number"
                      }
                    }}
                  />
                </Col>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "simNumber")}
                    label="Sim Number"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Sim number cannot be empty"
                      },
                      {
                        validate: FormValidator.isWithinLength(20, 20),
                        message: "Please enter a valid 20 digit SIM number"
                      }
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Sim Number"
                      }
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "imeiNo")}
                    label="IMEI Number"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "IMEI cannot be empty"
                      },
                      {
                        validate: FormValidator.isWithinLength(15, 15),
                        message: "Please enter a valid 15 digit IMEI number"
                      }
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter IMEI"
                      }
                    }}
                  />
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </>
    )
  }
}
const mapStateToProps = (state) => ({
  iotState: state.IotState
})
const mapDispatchToProps = {
  getIotModelApi
}
export default connect(mapStateToProps, mapDispatchToProps)(AddEditIot)
