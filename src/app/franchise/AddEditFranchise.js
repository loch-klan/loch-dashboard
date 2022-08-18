import React from "react"
import { Button, Col, Image, Row } from "react-bootstrap"
import { connect } from "react-redux"
import {
  BaseReactComponent,
  FileUploadControl,
  CustomTextControl,
  Form,
  FormElement,
  FormValidator,
  SelectControl
} from "../../utils/form"
import { ComponentHeader } from "../common"
import ReactDOM from "react-dom"
import { getAllRolesApi } from "../userManagement/Api"
import {
  AccountType,
  API_URL,
  DocType,
  LocationType
} from "../../utils/Constant"
import { getAllLocationApi } from "../common/Api"
import {
  addEditFranchiseApi,
  getFranchiseByIdApi,
  updatetFranchiseApi
} from "./Api"
import deleteIcon from "../../assets/images/delete-icon.svg"

class AddEditFranchise extends BaseReactComponent {
  constructor(props) {
    super(props)
    // const editData = props.location.state ? props.location.state.data : null;
    // console.log("editData", editData);

    let franchiseId = props.match.params.franchiseId
      ? props.match.params.franchiseId
      : ""

    this.state = {
      id: franchiseId,
      accountName: "",
      accountEmail: "",
      accountPhone: "",

      rentalRevenuePercent: "",
      cancellationRevenuePercent: "",
      damageRevenuePercent: "",

      areaList: [],
      cityList: [],
      stateList: [],
      countryList: [],
      role: [],
      roleList: [],
      areaIds: [],
      cityId: "",
      stateId: "",
      countryId: "",
      attachment: [],
      franchiseSet: "",
      billingAddressId: "",
      documentDetails: [
        {
          documentName: "",
          document: ""
        }
      ],
      userAccountType: AccountType.FRANCHISE
    }
  }

  componentDidMount() {
    this.props.getAllRolesApi(this)
    this.props.getAllLocationApi(this, LocationType.COUNTRY)
    this.props.getAllLocationApi(this, LocationType.STATE)
    this.props.getAllLocationApi(this, LocationType.CITY)
    this.props.getAllLocationApi(this, LocationType.AREA)

    // // IN CASE IF EDIT FRANCHISE
    if (this.state.id) {
      this.props.getFranchiseByIdApi(this.state.id, this.setFranchiseData)
    }
  }

  setFranchiseData = (data) => {
    console.log(data, "data")
    let documentDetails = []
    if (data && data.document_details) {
      data.document_details.map((item) =>
        documentDetails.push({
          documentName: item.name,
          document: {
            imageId: item.attachment_info.id,
            name: item.attachment_info.name,
            path: item.attachment_info.url
          }
        })
      )
    }
    this.setState({
      id: data.id,
      accountName: data.legal_name,
      accountEmail: data.billing_email,
      accountPhone: data.billing_contact,
      areaIds: data.extra_information.operational_areas,
      // revenuePercentage: data.extra_information.revenue_percentage,
      rentalRevenuePercent: data.extra_information.rental_revenue_percent,
      cancellationRevenuePercent:
        data.extra_information.cancellation_revenue_percent,
      damageRevenuePercent: data.extra_information.damage_revenue_percent,

      countryId: data.billing_address[0].country_id,
      stateId: data.billing_address[0].state_id,
      cityId: data.billing_address[0].city_id,
      block: data.billing_address[0].block_address,
      taxRegNumber: data.billing_address[0].tax_reg_number,
      billingContact: data.billing_address[0].contact_number,
      billingAddressId: data.billing_address[0].id,
      // attachment: [
      //   {
      //     imageId: data.document_details[0].attachment_info.id,
      //     path: data.document_details[0].attachment_info.url,
      //     name: data.document_details[0].attachment_info.name,
      //   },
      // ],
      documentDetails
    })
  }

  handleSave = () => {
    const data = new URLSearchParams()
    data.append("account_name", this.state.accountName)
    data.append("account_email", this.state.accountEmail)
    data.append("account_contact_number", this.state.accountPhone)

    if (!this.state.id) {
      data.append("poc_name", this.state.pocName)
      data.append("poc_number", this.state.pocNumber)
      data.append("poc_email", this.state.pocEmail)
      data.append("role_ids", JSON.stringify(this.state.role))
    }

    data.append("rental_revenue_percent", this.state.rentalRevenuePercent)
    data.append(
      "cancellation_revenue_percent",
      this.state.cancellationRevenuePercent
    )
    data.append("damage_revenue_percent", this.state.damageRevenuePercent)

    data.append("operational_areas", JSON.stringify(this.state.areaIds))

    data.append(
      "billing_address",
      JSON.stringify({
        id: this.state.billingAddressId,
        country_id: this.state.countryId,
        state_id: this.state.stateId,
        city_id: this.state.cityId,
        block_address: this.state.block,
        tax_reg_number: this.state.taxRegNumber,
        contact_name: "",
        contact_number: this.state.billingContact
      })
    )

    let documentDetails = []
    this.state.documentDetails.map((doc) => {
      return documentDetails.push({
        name: doc.documentName,
        type: DocType.KYC,
        attachment_id: doc.document.imageId
      })
    })
    data.append("document_details", JSON.stringify(documentDetails))
    if (this.state.id) {
      data.append("franchise_id", this.state.id)
      this.props.updatetFranchiseApi(data, () => this.props.history.goBack())
    } else {
      this.props.addEditFranchiseApi(data, () => this.props.history.goBack())
    }
  }

  onNextClick = () => {
    ReactDOM.findDOMNode(this.form).dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true })
    )
  }

  handleAddMore = () => {
    let documentDetails = this.state.documentDetails.map((a) => ({ ...a }))
    documentDetails.push({
      documentName: "",
      document: ""
    })
    this.setState({ documentDetails })
  }

  handleRemove = (i) => {
    let documentDetails = this.state.documentDetails.map((a) => ({ ...a }))
    documentDetails.splice(i, 1)
    this.setState({ documentDetails })
  }

  render() {
    return (
      <>
        <ComponentHeader
          backArrowBtn={true}
          history={this.props.history}
          title={this.state.id ? "Edit Franchise" : "Add Franchise"}
          secondaryBtnText={"Cancel"}
          isSecondaryBtn={() => this.props.history.goBack()}
          isPrimaryBtn={this.onNextClick}
          primaryBtnText={"Save Franchise"}
        />
        <div className="add-edit-customer-wrapper">
          {/* <Container> */}
          <div className="content">
            <Form
              onValidSubmit={this.handleSave}
              ref={(el) => (this.form = el)}
            >
              <Row>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "accountName")}
                    label="Name"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Name cannot be empty"
                      }
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Name"
                      }
                    }}
                  />
                </Col>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "accountPhone")}
                    label="Contact Number"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Number cannot be empty"
                      },
                      {
                        validate: FormValidator.isPhone,
                        message: "Please enter a valid number"
                      }
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Contact Number"
                      }
                    }}
                  />
                </Col>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "accountEmail")}
                    label="Email"
                    disabled={this.state.id ? true : false}
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Email cannot be empty"
                      },
                      {
                        validate: FormValidator.isEmail,
                        message: "Please enter a valid email"
                      }
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Email"
                      }
                    }}
                  />
                </Col>
              </Row>
              {!this.state.id && (
                <Row>
                  <Col md={4}>
                    <FormElement
                      valueLink={this.linkState(this, "pocName")}
                      label="POC Name"
                      required
                      validations={[
                        {
                          validate: FormValidator.isRequired,
                          message: "Name cannot be empty"
                        }
                      ]}
                      control={{
                        type: CustomTextControl,
                        settings: {
                          placeholder: "Enter POC Name"
                        }
                      }}
                    />
                  </Col>
                  <Col md={4}>
                    <FormElement
                      valueLink={this.linkState(this, "pocNumber")}
                      label="POC Contact"
                      required
                      validations={[
                        {
                          validate: FormValidator.isRequired,
                          message: "Number cannot be empty"
                        },
                        {
                          validate: FormValidator.isPhone,
                          message: "Please enter a valid number"
                        }
                      ]}
                      control={{
                        type: CustomTextControl,
                        settings: {
                          placeholder: "Enter POC Contact"
                        }
                      }}
                    />
                  </Col>
                  <Col md={4}>
                    <FormElement
                      valueLink={this.linkState(this, "pocEmail")}
                      label="POC Email"
                      //disabled={this.state.userId ? true : false}
                      required
                      validations={[
                        {
                          validate: FormValidator.isRequired,
                          message: "Email cannot be empty"
                        },
                        {
                          validate: FormValidator.isEmail,
                          message: "Please enter a valid email"
                        }
                      ]}
                      control={{
                        type: CustomTextControl,
                        settings: {
                          placeholder: "Enter POC Email"
                        }
                      }}
                    />
                  </Col>
                </Row>
              )}
              <Row>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "areaIds")}
                    label="Area"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Area cannot be empty"
                      }
                    ]}
                    control={{
                      type: SelectControl,
                      settings: {
                        placeholder: "Select Area",
                        options: this.state.areaList,
                        multiple: true,
                        searchable: true,
                        onChangeCallback: (onBlur) => {
                          onBlur(this.state.areaIds)
                        }
                      }
                    }}
                  />
                </Col>
                {!this.state.id && (
                  <Col md={4}>
                    <FormElement
                      valueLink={this.linkState(this, "role")}
                      label="Role"
                      required
                      validations={[
                        {
                          validate: FormValidator.isRequired,
                          message: "Role cannot be empty"
                        }
                      ]}
                      control={{
                        type: SelectControl,
                        settings: {
                          placeholder: "Select Role",
                          options: this.state.rolesOption,
                          multiple: true,
                          searchable: true,
                          onChangeCallback: (onBlur) => {
                            onBlur(this.state.role)
                          }
                        }
                      }}
                    />
                  </Col>
                )}
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "rentalRevenuePercent")}
                    label="Rental Revenue Percentage"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Rental revenue percentage cannot be empty"
                      },
                      {
                        validate: FormValidator.isPositiveInt,
                        message: "Please enter a valid x number"
                      }
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Rental Revenue Percentage"
                      }
                    }}
                  />
                </Col>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(
                      this,
                      "cancellationRevenuePercent"
                    )}
                    label="Cancellation Revenue Percentage"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message:
                          "Cancellation revenue percentage cannot be empty"
                      },
                      {
                        validate: FormValidator.isPositiveInt,
                        message: "Please enter a valid x number"
                      }
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Cancellation Revenue Percentage"
                      }
                    }}
                  />
                </Col>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "damageRevenuePercent")}
                    label="Damage Revenue Percentage"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Damage revenue percentage cannot be empty"
                      },
                      {
                        validate: FormValidator.isPositiveInt,
                        message: "Please enter a valid x number"
                      }
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Damage Revenue Percentage"
                      }
                    }}
                  />
                </Col>
              </Row>
              <hr />
              <br />
              <h4>Billing address</h4>
              <br />
              <Row>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "countryId")}
                    label="Country"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Country cannot be empty"
                      }
                    ]}
                    control={{
                      type: SelectControl,
                      settings: {
                        placeholder: "Select Country",
                        options: this.state.countryList,
                        multiple: false,
                        searchable: true,
                        onChangeCallback: (onBlur) => {
                          this.setState(
                            {
                              stateId: "",
                              cityId: "",
                              countryId: this.state.countryId
                            },
                            () => {
                              this.props.getAllLocationApi(
                                this,
                                LocationType.STATE
                              )
                            }
                          )
                          // onBlur(this.state.countryId);
                          // this.props.getAllLocationApi(this, LocationType.STATE);
                        }
                      }
                    }}
                  />
                </Col>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "stateId")}
                    label="State"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "State cannot be empty"
                      }
                    ]}
                    control={{
                      type: SelectControl,
                      settings: {
                        placeholder: "Select State",
                        options: this.state.stateList,
                        multiple: false,
                        searchable: true,
                        onChangeCallback: (onBlur) => {
                          this.setState(
                            {
                              cityId: "",
                              stateId: this.state.stateId
                            },
                            () => {
                              this.props.getAllLocationApi(
                                this,
                                LocationType.CITY
                              )
                            }
                          )
                          onBlur(this.state.stateId)
                          //this.props.getAllLocationApi(this, LocationType.CITY);
                        }
                      }
                    }}
                  />
                </Col>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "cityId")}
                    label="City"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "City cannot be empty"
                      }
                    ]}
                    control={{
                      type: SelectControl,
                      settings: {
                        placeholder: "Select City",
                        options: this.state.cityList,
                        multiple: false,
                        searchable: true,
                        onChangeCallback: (onBlur) => {
                          onBlur(this.state.cityId)
                        }
                      }
                    }}
                  />
                </Col>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "block")}
                    label="Block Address"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Name cannot be empty"
                      }
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Block"
                      }
                    }}
                  />
                </Col>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "taxRegNumber")}
                    label="Tax Reg Number"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Name cannot be empty"
                      }
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Tax Rgister Number"
                      }
                    }}
                  />
                </Col>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "billingContact")}
                    label="Contact Number"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Number cannot be empty"
                      },
                      {
                        validate: FormValidator.isPhone,
                        message: "Please enter a valid number"
                      }
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Contact Number"
                      }
                    }}
                  />
                </Col>
              </Row>
              <hr />
              <br />
              <Row>
                <Col sm={12}>
                  <h4>Document Details</h4>
                </Col>
              </Row>
              <br />
              {this.state.documentDetails.map((document, i) => {
                return (
                  <Row>
                    <Col md={4}>
                      <FormElement
                        valueLink={this.linkState(
                          this,
                          `documentDetails.${i}.documentName`
                        )}
                        label="Document Name"
                        required
                        validations={[
                          {
                            validate: FormValidator.isRequired,
                            message: "Document name cannot be empty"
                          }
                        ]}
                        control={{
                          type: CustomTextControl,
                          settings: {
                            placeholder: "Enter Document Name"
                          }
                        }}
                      />
                    </Col>
                    <Col md={4}>
                      <FormElement
                        valueLink={this.linkState(
                          this,
                          `documentDetails.${i}.document`
                        )}
                        label="Upload file"
                        required
                        validations={[
                          {
                            validate: FormValidator.isRequired,
                            message: "File is required"
                          }
                        ]}
                        control={{
                          type: FileUploadControl,
                          settings: {
                            moduleName: "organization",
                            subModule: "account",
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
                                // path: "single.jpg",
                                path:
                                  "multi" +
                                  (this.state.documentDetails.length + 1) +
                                  ".jpg"
                              }
                              callback(fileInfo, API_URL)
                            }
                          }
                        }}
                      />
                    </Col>
                    <Col sm={2}>
                      <Image
                        className="delete-icon"
                        src={deleteIcon}
                        onClick={() => this.handleRemove(i)}
                      />
                    </Col>
                  </Row>
                )
              })}
              <Row>
                <Col sm={12} className="add-more-section">
                  <Button
                    className="btn black-btn"
                    onClick={this.handleAddMore}
                  >
                    + Add More Document
                  </Button>
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
const mapStateToProps = (state) => ({
  userManagementState: state.UserManagementState
})
const mapDispatchToProps = {
  getAllRolesApi,
  getAllLocationApi,
  addEditFranchiseApi,
  getFranchiseByIdApi,
  updatetFranchiseApi
}
export default connect(mapStateToProps, mapDispatchToProps)(AddEditFranchise)
