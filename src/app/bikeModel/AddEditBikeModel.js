import React from "react";
import { Col, Row } from "react-bootstrap";
import { connect } from "react-redux";
import {
  BaseReactComponent,
  CustomTextControl,
  FileUploadControl,
  Form,
  FormElement,
  FormValidator,
} from "../../utils/form";
import { ComponentHeader } from "../common";
import ReactDOM from "react-dom";
import { addUpdateBikeModelApi } from "./Api";
import { API_URL, MEDIA_URL } from "../../utils/Constant";

class AddEditBikeModel extends BaseReactComponent {
  constructor(props) {
    super(props);
    const editData = props.location.state ? props.location.state.editData : {};
    console.log('editData',editData);
    this.state = {
      editId: editData.id || "",
      modelName: editData.modelName || "",
      manufacturerName: editData.modelCompany || "",
      noOfBatteries: editData.noOfBatteries || "",
      tax: editData.taxPercentage || "",
      taxCode: editData.taxCode || "",

      cancellationTaxCode: editData && editData.cancellationTaxCode || "",
      cancellationTaxPercentage: editData && editData.cancellationTaxPercentage || "",
      damageTaxCode: editData && editData.damageTaxCode || "",
      damageTaxPercentage: editData && editData.damageTaxPercentage || "",

      minSpeed: editData.vehicleInformation && editData.vehicleInformation.optimalSpeed?.min || "",
      maxSpeed: editData.vehicleInformation && editData.vehicleInformation.optimalSpeed?.max || "",
      minRange: editData.vehicleInformation && editData.vehicleInformation.vehicleRange?.min || "",
      maxRange: editData.vehicleInformation && editData.vehicleInformation.vehicleRange?.max || "",
      minAcceleration: editData.vehicleInformation && editData.vehicleInformation.optimalAcceleration?.min || "",
      maxAcceleration: editData.vehicleInformation && editData.vehicleInformation.optimalAcceleration?.max || "",
      minPower: editData.vehicleInformation && editData.vehicleInformation.continuousPower?.min || "",
      maxPower: editData.vehicleInformation && editData.vehicleInformation.continuousPower?.max || "",
      minTorque: editData.vehicleInformation && editData.vehicleInformation.torque?.min || "",
      maxTorque: editData.vehicleInformation && editData.vehicleInformation.torque?.max || "",
      minCharging: editData.vehicleInformation && editData.vehicleInformation.chargingTime?.min || "",
      maxCharging: editData.vehicleInformation && editData.vehicleInformation.chargingTime?.max || "",
      vehicleImage: editData && editData.images ? {
        imageId: editData.images[0].id,
        name: editData.images[0].name,
        path: MEDIA_URL + editData.images[0].path,
      } : "",
    };
  }
  componentDidMount() { }
  handleSave = () => {
    ReactDOM.findDOMNode(this.form).dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true })
    );
  };

  onValidSubmit = () => {
    const data = new URLSearchParams();
    data.append("model_name", this.state.modelName);
    data.append("model_company", this.state.manufacturerName);
    data.append("no_of_batteries", this.state.noOfBatteries);
    data.append("tax_percentage", this.state.tax);
    data.append("tax_code", this.state.taxCode);

    data.append("cancellation_tax_percentage", this.state.cancellationTaxPercentage);
    data.append("cancellation_tax_code", this.state.cancellationTaxCode);
    data.append("damages_tax_percentage", this.state.damageTaxPercentage);
    data.append("damages_tax_code", this.state.damageTaxCode);

    data.append("optimal_speed", JSON.stringify({min: parseFloat(this.state.minSpeed), max: parseFloat(this.state.maxSpeed)}));
    data.append("vehicle_range", JSON.stringify({min: parseFloat(this.state.minRange), max: parseFloat(this.state.maxRange)}));
    data.append("optimal_acceleration", JSON.stringify({min: parseFloat(this.state.minAcceleration), max: parseFloat(this.state.maxAcceleration)}));
    data.append("continuous_power", JSON.stringify({min: parseFloat(this.state.minPower), max: parseFloat(this.state.maxPower)}));
    data.append("torque", JSON.stringify({min: parseFloat(this.state.minTorque), max: parseFloat(this.state.maxTorque)}));
    data.append("charging_time", JSON.stringify({min: parseFloat(this.state.minCharging), max: parseFloat(this.state.maxCharging)}));
    data.append("images", JSON.stringify([this.state.vehicleImage.imageId]));

    if (this.state.editId) {
      data.append("model_id", this.state.editId);
    }
    addUpdateBikeModelApi(data, () => {
      this.props.history.push("/master/bike-models");
    });
  };

  render() {
    return (
      <>
        <ComponentHeader
          backArrowBtn={true}
          history={this.props.history}
          title={`${this.state.editId ? "Edit" : "Add"} Bike Model`}
          secondaryBtnText={"Cancel"}
          isSecondaryBtn={() => this.props.history.goBack()}
          isPrimaryBtn={this.handleSave}
          primaryBtnText={"Save Bike Model"}
        />
        <div className="add-edit-customer-wrapper">
          {/* <Container> */}
          <div className="content">
            <Form
              onValidSubmit={this.onValidSubmit}
              ref={(el) => (this.form = el)}
            >
              <Row>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "modelName")}
                    label="Model Name"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Model name cannot be empty",
                      },
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Model Name",
                      },
                    }}
                  />
                </Col>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "manufacturerName")}
                    label="Manufacturer Name"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Manufacturer name cannot be empty",
                      },
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Manufacturer Name",
                      },
                    }}
                  />
                </Col>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "noOfBatteries")}
                    label="No of Batteries"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Count cannot be empty",
                      },
                      {
                        validate: FormValidator.isNum,
                        message: "Please enter a valid number",
                      },
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter no. of batteries",
                      },
                    }}
                  />
                </Col>
                <Col md={3}>
                  <FormElement
                    valueLink={this.linkState(this, "cancellationTaxPercentage")}
                    label="Cancellation Tax Percentage"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Cancellation tax percentage cannot be empty",
                      },
                      {
                        validate: FormValidator.isPositiveInt,
                        message: "Please enter a valid x number",
                      },
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Cancellation Tax Percentage",
                      },
                    }}
                  />
                </Col>
                <Col md={3}>
                  <FormElement
                    valueLink={this.linkState(this, "cancellationTaxCode")}
                    label="Cancellation Tax Code"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Cancellation tax code cannot be empty",
                      },
                      {
                        validate: FormValidator.isPositiveInt,
                        message: "Please enter a valid x number",
                      },
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Cancellation Tax Code",
                      },
                    }}
                  />
                </Col>
                <Col md={3}>
                  <FormElement
                    valueLink={this.linkState(this, "damageTaxPercentage")}
                    label="Damage Tax Percentage"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Damage tax percentage cannot be empty",
                      },
                      {
                        validate: FormValidator.isPositiveInt,
                        message: "Please enter a valid x number",
                      },
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Damage Tax Percentage",
                      },
                    }}
                  />
                </Col>
                <Col md={3}>
                  <FormElement
                    valueLink={this.linkState(this, "damageTaxCode")}
                    label="Damage Tax Code"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Damage tax code cannot be empty",
                      },
                      {
                        validate: FormValidator.isPositiveInt,
                        message: "Please enter a valid x number",
                      },
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Damage Tax Code",
                      },
                    }}
                  />
                </Col>

                <Col md={3}>
                  <FormElement
                    valueLink={this.linkState(this, "tax")}
                    label="Tax (in percentage)"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Tax cannot be empty"
                      },
                      {
                        validate: FormValidator.isPositiveInt,
                        message: "Tax cannot be negative"
                      }
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Value",
                      }
                    }}
                  />
                </Col>
                <Col md={3}>
                  <FormElement
                    valueLink={this.linkState(this, "taxCode")}
                    label="Tax Code (Hsn Code)"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Tax Code cannot be empty",
                      },
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Tax Code",
                      },
                    }}
                  />
                </Col>
                <Col md={6}>
                  <div className='min-max-element'>
                    <FormElement
                      valueLink={this.linkState(this, "minSpeed")}
                      label="Optimal Speed"
                      required
                      validations={[
                        {
                          validate: FormValidator.isRequired,
                          message: "Minimum speed cannot be empty"
                        },
                        {
                          validate: FormValidator.isNum,
                          message: "Please enter numeric value"
                        },
                        {
                          validate: FormValidator.isInt,
                          message: "Please enter numeric value"
                        }
                      ]}
                      control={{
                        type: CustomTextControl,
                        settings: {
                          placeholder: "Enter Minimum Speed",
                        }
                      }}
                    />
                    <FormElement
                      valueLink={this.linkState(this, "maxSpeed")}
                      label=""
                      required
                      validations={[
                        {
                          validate: FormValidator.isRequired,
                          message: "Maximum speed cannot be empty"
                        },
                        {
                          validate: FormValidator.isNum,
                          message: "Please enter numeric value"
                        },
                        {
                          validate: FormValidator.isInt,
                          message: "Please enter numeric value"
                        }
                      ]}
                      control={{
                        type: CustomTextControl,
                        settings: {
                          placeholder: "Enter Maximum Speed",
                        }
                      }}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <div className='min-max-element'>
                    <FormElement
                      valueLink={this.linkState(this, "minRange")}
                      label="Vehicle Range"
                      required
                      validations={[
                        {
                          validate: FormValidator.isRequired,
                          message: "Minimum range cannot be empty"
                        },
                        {
                          validate: FormValidator.isNum,
                          message: "Please enter numeric value"
                        },
                        {
                          validate: FormValidator.isInt,
                          message: "Please enter numeric value"
                        }
                      ]}
                      control={{
                        type: CustomTextControl,
                        settings: {
                          placeholder: "Enter Minimum Range",
                        }
                      }}
                    />
                    <FormElement
                      valueLink={this.linkState(this, "maxRange")}
                      label=""
                      required
                      validations={[
                        {
                          validate: FormValidator.isRequired,
                          message: "Maximum range cannot be empty"
                        },
                        {
                          validate: FormValidator.isNum,
                          message: "Please enter numeric value"
                        },
                        {
                          validate: FormValidator.isInt,
                          message: "Please enter numeric value"
                        }
                      ]}
                      control={{
                        type: CustomTextControl,
                        settings: {
                          placeholder: "Enter Maximum Range",
                        }
                      }}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className='min-max-element'>
                    <FormElement
                      valueLink={this.linkState(this, "minCharging")}
                      label="Vehicle Charging"
                      required
                      validations={[
                        {
                          validate: FormValidator.isRequired,
                          message: "Minimum charging cannot be empty"
                        },
                        {
                          validate: FormValidator.isNum,
                          message: "Please enter numeric value"
                        },
                        {
                          validate: FormValidator.isInt,
                          message: "Please enter numeric value"
                        }
                      ]}
                      control={{
                        type: CustomTextControl,
                        settings: {
                          placeholder: "Enter Minimum Charging",
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
                          message: "Maximum charging cannot be empty"
                        },
                        {
                          validate: FormValidator.isNum,
                          message: "Please enter numeric value"
                        },
                        {
                          validate: FormValidator.isInt,
                          message: "Please enter numeric value"
                        }
                      ]}
                      control={{
                        type: CustomTextControl,
                        settings: {
                          placeholder: "Enter Maximum Charging",
                        }
                      }}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className='min-max-element'>
                    <FormElement
                      valueLink={this.linkState(this, "minAcceleration")}
                      label="Optimal Acceleration"
                      control={{
                        type: CustomTextControl,
                        settings: {
                          placeholder: "Enter Minimum Acceleration",
                        }
                      }}
                    />
                    <FormElement
                      valueLink={this.linkState(this, "maxAcceleration")}
                      label=""
                      control={{
                        type: CustomTextControl,
                        settings: {
                          placeholder: "Enter Maximum Acceleration",
                        }
                      }}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className='min-max-element'>
                    <FormElement
                      valueLink={this.linkState(this, "minPower")}
                      label="Continuous Power"
                      control={{
                        type: CustomTextControl,
                        settings: {
                          placeholder: "Enter Minimum Power",
                        }
                      }}
                    />
                    <FormElement
                      valueLink={this.linkState(this, "maxPower")}
                      label=""
                      control={{
                        type: CustomTextControl,
                        settings: {
                          placeholder: "Enter Maximum Power",
                        }
                      }}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className='min-max-element'>
                    <FormElement
                      valueLink={this.linkState(this, "minTorque")}
                      label="Torque"
                      control={{
                        type: CustomTextControl,
                        settings: {
                          placeholder: "Enter Minimum Torque",
                        }
                      }}
                    />
                    <FormElement
                      valueLink={this.linkState(this, "maxTorque")}
                      label=""
                      control={{
                        type: CustomTextControl,
                        settings: {
                          placeholder: "Enter Maximum Torque",
                        }
                      }}
                    />
                  </div>
                </Col>
              {/* </Row>
              <Row> */}
                <Col md={6}>
                <FormElement
                        valueLink={this.linkState(this, 'vehicleImage')}
                        label="Upload file"
                        required
                        validations={[
                          {
                            validate: FormValidator.isRequired,
                            message: "File is required",
                          },
                        ]}
                        control={{
                          type: FileUploadControl,
                          settings: {
                            moduleName: "offering",
                            subModule: "vehicle",
                            fileType: "IMAGE",
                            extensions: ["image/*"],
                            maxFiles: 1,
                            maxFileSize: 100000000,
                            onSelect: (file, callback) => {
                              // You will need to generate signedURL by calling API and then call callback
                              const fileInfo = {
                                id: file.lastModified,
                                name: file.name,
                                size: file.size,
                                mimeType: file.type,
                                path: "single.jpg",
                              };
                              callback(fileInfo,API_URL);
                            },
                          },
                        }}
                      />
                </Col>
              </Row>
            </Form>
          </div>
          {/* </Container> */}
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  ...state,
});
const mapDispatchToProps = {
  // getPosts: fetchPosts
};
export default connect(mapStateToProps, mapDispatchToProps)(AddEditBikeModel);
