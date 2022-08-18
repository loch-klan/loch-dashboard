import React from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import {
  BaseReactComponent,
  Form,
  FormElement,
  FormSubmitButton,
  FormValidator,
  CustomTextControl,
  SelectControl
} from "../../../utils/form"
import { ComponentHeader, CustomModal } from "../../common"
import { Col, Row } from "react-bootstrap"
import ReactDOM from "react-dom"
import {
  LocationType,
  PricingLevelOptions,
  PricingTypeOptions,
  YesNoOptions,
  PricingType,
  PricingLevel
} from "../../../utils/Constant"
import { getAllLocationApi } from "../../common/Api"
import { addUpdateVehiclePricingApi, getAllVehiclePricingApi } from "../Api"

class AddEditVehiclePricing extends BaseReactComponent {
  constructor(props) {
    super(props)
    // console.log('ctx',props);
    const { state } = props.location
    const data = state ? state.data : null
    // console.log('pricingData',data);
    this.state = {
      modelId: state ? state.state.modelId : "",
      id: data ? data.id : "",
      minBookingTime: data ? data.minimum_time_booking : "",
      price: data ? data.price : "",
      pricingLevel: data
        ? data.pricing_level
        : parseInt(state.state.selectedTab) === PricingLevel.CITY
        ? PricingLevel.CITY
        : parseInt(state.state.selectedTab) === PricingLevel.AREA
        ? PricingLevel.AREA
        : null,
      pricingType: PricingType.HOURLY,
      pricePerKm: data ? data.per_km_price : "",
      penaltyPrice: data ? data.penalty_price_per_hour : "",
      rentalTime: data ? data.rental_time : "",
      allowedKms: data ? data.allowed_kms : "",
      deposit: data ? data.deposit : "",
      cityList: [],
      areaList: [],
      selectedLocations: data ? data.location_ids : [],
      isDefault:
        state && state.state.selectedTab === "default" ? "true" : "false",
      vehicleData: "",
      stateId: "",
      selectedTab: state ? parseInt(state.state.selectedTab) : ""
    }
  }
  componentDidMount() {
    if (this.state.id) {
      this.props.getAllLocationApi(this, parseInt(this.state.pricingLevel))
    }
    if ([30, 40].includes(this.state.selectedTab)) {
      this.props.getAllLocationApi(this, parseInt(this.state.pricingLevel))
    }
  }

  componentWillUnmount() {}

  onNextClick = () => {
    ReactDOM.findDOMNode(this.form).dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true })
    )
  }

  onSubmit = () => {
    const data = new URLSearchParams()
    data.append("model_id", this.state.modelId)
    data.append("pricing_type", this.state.pricingType)
    data.append("minimum_time_booking", this.state.minBookingTime)
    data.append("price", this.state.price)
    data.append("rental_time", this.state.rentalTime)
    if (this.state.isDefault === "false") {
      data.append("pricing_level", this.state.pricingLevel)
      data.append("location_ids", JSON.stringify(this.state.selectedLocations))
    }
    data.append("is_default", this.state.isDefault)
    data.append("per_km_price", this.state.pricePerKm)
    data.append("penalty_price_per_hour", this.state.penaltyPrice)
    data.append("allowed_kms", this.state.allowedKms)
    data.append("deposit", this.state.deposit)
    if (this.state.id) {
      data.append("model_pricing_id", this.state.id)
    }

    const data2 = new URLSearchParams()
    data2.append("model_id", this.state.modelId)
    data2.append("conditions", JSON.stringify(this.state.conditions))

    this.props.addUpdateVehiclePricingApi(data, this, data2)
  }

  render() {
    // const { cityList, areaList } = this.state;
    return (
      // <CustomModal
      //   show={this.props.show}
      //   onHide={this.props.handleClose}
      //   title={"Add Vehicle Pricing "}
      // >
      <>
        <ComponentHeader
          backArrowBtn={true}
          history={this.props.history}
          title={this.state.id ? "Edit Vehicle Pricing" : "Add Vehicle Pricing"}
          secondaryBtnText={"Cancel"}
          isSecondaryBtn={() => this.props.history.goBack()}
          isPrimaryBtn={this.onNextClick}
          primaryBtnText={"Save"}
        />
        <div className="add-edit-customer-wrapper">
          {/* <Container> */}
          <div className="content">
            <Form onValidSubmit={this.onSubmit} ref={(el) => (this.form = el)}>
              {/* <div
            className="modal-wrapper"
            style={{ padding: "3.9rem 3rem 2.9rem" }}
          > */}
              <Row>
                <Col sm={4}>
                  <FormElement
                    valueLink={this.linkState(this, "pricingType")}
                    label="Select Pricing Type"
                    required
                    disabled
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Pricing type cannot be empty"
                      }
                    ]}
                    control={{
                      type: SelectControl,
                      settings: {
                        placeholder: "Select Pricing Type",
                        options: PricingTypeOptions,
                        multiple: false,
                        searchable: true,
                        onChangeCallback: (onBlur) => {
                          onBlur(this.state.pricingType)
                          console.log("Hello world!")
                        }
                      }
                    }}
                  />
                </Col>
                <Col sm={4}>
                  <FormElement
                    valueLink={this.linkState(this, "rentalTime")}
                    label="Rental Time (hr/hrs)"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Rental time cannot be empty"
                      }
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Rental Time"
                      }
                    }}
                  />
                </Col>
                <Col sm={4}>
                  <FormElement
                    valueLink={this.linkState(this, "minBookingTime")}
                    label={`Minimum Booking Time ( ${PricingType.getFormatedText(
                      this.state.pricingType
                    )} )`}
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Minimum booking time cannot be empty"
                      },
                      {
                        validate: FormValidator.isPositiveInt,
                        message: "Please enter numeric value"
                      }
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Minimum Booking Time"
                      }
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <FormElement
                    valueLink={this.linkState(this, "price")}
                    label="Price (₹)"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Price cannot be empty"
                      },
                      {
                        validate: FormValidator.isPositiveInt,
                        message: "Please enter numeric value"
                      }
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Price"
                      }
                    }}
                  />
                </Col>
                {this.state.isDefault === "false" && (
                  <Col sm={4}>
                    <FormElement
                      valueLink={this.linkState(this, "pricingLevel")}
                      label="Select Pricing Level"
                      required
                      disabled={
                        [30, 40].includes(this.state.selectedTab) ? true : false
                      }
                      validations={[
                        {
                          validate: FormValidator.isRequired,
                          message: "Pricing level cannot be empty"
                        }
                      ]}
                      control={{
                        type: SelectControl,
                        settings: {
                          placeholder: "Select Pricing Level",
                          options: PricingLevelOptions,
                          multiple: false,
                          searchable: true,
                          onChangeCallback: (onBlur) => {
                            onBlur(this.state.pricingLevel)
                            console.log("Hello world!")
                            this.setState(
                              {
                                selectedLocations: [],
                                areaList: [],
                                cityList: []
                              },
                              () => {
                                this.props.getAllLocationApi(
                                  this,
                                  parseInt(this.state.pricingLevel)
                                )
                              }
                            )
                          }
                        }
                      }}
                    />
                  </Col>
                )}

                {this.state.isDefault === "false" && (
                  <Col sm={4}>
                    <FormElement
                      valueLink={this.linkState(this, "selectedLocations")}
                      label="Select Locations"
                      required
                      validations={[
                        {
                          validate: FormValidator.isRequired,
                          message: "Locations cannot be empty"
                        }
                      ]}
                      control={{
                        type: SelectControl,
                        settings: {
                          placeholder: "Select Locations",
                          options:
                            parseInt(this.state.pricingLevel) ===
                            LocationType.CITY
                              ? this.state.cityList
                              : this.state.areaList,
                          multiple: true,
                          searchable: true,
                          onChangeCallback: (onBlur) => {
                            onBlur(this.state.selectedLocations)
                            console.log("Hello world!")
                          }
                        }
                      }}
                    />
                  </Col>
                )}

                {/* </Row>
              <Row> */}
                <Col sm={4}>
                  <FormElement
                    valueLink={this.linkState(this, "pricePerKm")}
                    label="Price Per Km (₹)"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Price cannot be empty"
                      },
                      {
                        validate: FormValidator.isPositiveInt,
                        message: "Please enter numeric value"
                      }
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Price Per Km"
                      }
                    }}
                  />
                </Col>
                <Col sm={4}>
                  <FormElement
                    valueLink={this.linkState(this, "penaltyPrice")}
                    label="Penalty Price Per Km (₹)"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Penalty price per km cannot be empty"
                      },
                      {
                        validate: FormValidator.isPositiveInt,
                        message: "Please enter numeric value"
                      }
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Penalty Price Per Km"
                      }
                    }}
                  />
                </Col>
                <Col sm={4}>
                  <FormElement
                    valueLink={this.linkState(this, "isDefault")}
                    label="Is default?"
                    required
                    disabled
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Please select any one option"
                      }
                    ]}
                    control={{
                      type: SelectControl,
                      settings: {
                        placeholder: "Select Default",
                        options: YesNoOptions,
                        multiple: false,
                        searchable: true,
                        onChangeCallback: (onBlur) => {
                          onBlur(this.state.isDefault)
                          console.log("Hello world!")
                        }
                      }
                    }}
                  />
                </Col>
                {/* </Row>
              <Row> */}
                <Col sm={4}>
                  <FormElement
                    valueLink={this.linkState(this, "allowedKms")}
                    label="Allowed Kms"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Allowed kms cannot be empty"
                      },
                      {
                        validate: FormValidator.isPositiveInt,
                        message: "Please enter numeric value"
                      }
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Price Kms"
                      }
                    }}
                  />
                </Col>
                <Col sm={4}>
                  <FormElement
                    valueLink={this.linkState(this, "deposit")}
                    label="Deposit (₹)"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Deposit cannot be empty"
                      },
                      {
                        validate: FormValidator.isPositiveInt,
                        message: "Please enter numeric value"
                      }
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Deposit"
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

AddEditVehiclePricing.propTypes = {
  // show: PropTypes.bool.isRequired,
  // handleClose: PropTypes.func.isRequired,
}
const mapStateToProps = (state) => ({
  // ...state,
  bikeModelState: state.BikeModelState
})

const mapDispatchToProps = {
  getAllLocationApi,
  addUpdateVehiclePricingApi,
  getAllVehiclePricingApi
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddEditVehiclePricing)
