import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import { CouponTypeOptions, LocationType, LocationTypeOptions, CouponTypes } from '../../utils/Constant';
import { BaseReactComponent, CustomTextControl, DatePickerControl, Form, FormElement, FormValidator, SelectControl } from '../../utils/form';
import { getUserAccountType } from '../../utils/ManageToken';
import { ComponentHeader } from '../common';
import ReactDOM from 'react-dom';
import { format } from 'date-fns';
import { getAllLocationApi } from "../common/Api";
import { getAllFranchiseApi } from "../franchise/Api";
import { addEditCouponsApi } from "./Api";
import { formatDate } from '../../utils/ReusableFunctions';

class AddEditCustomer extends BaseReactComponent {
  constructor(props) {
    super(props);
    const userAccountType = getUserAccountType();
    const editData = props.location.state ? props.location.state.data : null;
    this.state = {
      couponId: editData ? editData.id : "",
      title: editData ? editData.coupon_code : "",
      type: editData ? editData.type : "",
      value: editData ? editData.value : "",
      maxDiscountLimit: editData ? editData.max_discount : "",
      maxNumberOfUsages: editData ? editData.max_coupon_usage_count : "",
      maxUsagePerCustomer: editData ? editData.same_user_coupon_usage : "",
      fromDate: editData ? new Date(editData.valid_from) : "",
      toDate: editData ? new Date(editData.valid_till) : "",
      newUserOnly: editData ? editData.only_new_users ? 10 : 20 : "",
      applicableLevel: editData ? editData.applicable_on_level : "",
      applicableLocation: editData ? editData.location_ids : "",
      applicableFranchise: editData ? editData.is_franchise_specific ? 10 : 20 : "",
      franchiseId: editData ? editData.franchise_ids : "",
      franchiseShare: editData ? editData.franchise_share : "",
    }
  }

  componentDidMount() {
    this.props.getAllFranchiseApi(this, -1);
    if (this.state.applicableLevel)
      this.props.getAllLocationApi(this, this.state.applicableLevel);
  }

  handleFromDate = () => {
    this.setState({ toDate: "" })
  }

  handleSave = () => {
    ReactDOM.findDOMNode(this.form).dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
  }

  onValidSubmit = () => {
    const data = new URLSearchParams();
    console.log(this.state.fromDate);

    data.append('coupon_code', this.state.title);
    data.append('type', this.state.type);
    data.append('value', this.state.value);
    data.append('max_discount', this.state.maxDiscountLimit);
    data.append('max_coupon_usage_count', this.state.maxNumberOfUsages);
    data.append('same_user_coupon_usage', this.state.maxUsagePerCustomer);
    data.append('valid_from', format(this.state.fromDate, 'dd-MM-yyyy'));
    data.append('valid_till', format(this.state.toDate, 'dd-MM-yyyy'));
    data.append('only_new_users', this.state.newUserOnly);
    data.append('applicable_on_level', this.state.applicableLevel);
    data.append('location_ids', JSON.stringify(this.state.applicableLocation));
    data.append('franchise_share', this.state.franchiseShare)
    data.append('is_franchise_specific', this.state.applicableFranchise === 10 ? true : false);
    if (this.state.applicableFranchise)
      data.append('franchise_ids', JSON.stringify(this.state.franchiseId));

    if (this.state.couponId)
      data.append('coupon_id', this.state.couponId)

    this.props.addEditCouponsApi(data, () => this.props.history.goBack());
  }

  render() {
    return (
      <>
        <ComponentHeader
          backArrowBtn={true}
          history={this.props.history}
          title={this.state.couponId ? "Edit Coupon" : "Add Coupon"}
          secondaryBtnText={"Cancel"}
          isSecondaryBtn={() => this.props.history.goBack()}
          isPrimaryBtn={this.handleSave}
          primaryBtnText={"Save Coupon"}
        />
        <div className="add-edit-customer-wrapper">
          {/* <Container> */}
          <div className="content">
            <Form onValidSubmit={this.onValidSubmit} ref={el => this.form = el}>
              <Row>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "title")}
                    label="Coupon Title / Code"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Title cannot be empty"
                      },
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter title",
                      }
                    }}
                  />
                </Col>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "type")}
                    label="Coupon Type"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Coupon type cannot be empty"
                      },
                    ]}
                    control={{
                      type: SelectControl,
                      settings: {
                        placeholder: "Select Coupon Type",
                        options: CouponTypeOptions,
                      }
                    }}
                  />
                </Col>
                {
                  this.state.type == CouponTypes.PERCENTAGE ?
                    <Col md={4}>
                      <FormElement
                        valueLink={this.linkState(this, "value")}
                        label="Coupon Value (in percentage)"
                        required
                        validations={[
                          {
                            validate: FormValidator.isRequired,
                            message: "Value cannot be empty"
                          },
                          {
                            validate: FormValidator.isPositiveInt,
                            message: "Value cannot be negative"
                          },
                          {
                            validate: FormValidator.isWithinInt(0, 100),
                            message: "Max limit cannot be greater than 100"
                          },
                        ]}
                        control={{
                          type: CustomTextControl,
                          settings: {
                            placeholder: "Enter Value",
                          }
                        }}
                      />
                    </Col>
                    :
                    <Col md={4}>
                      <FormElement
                        valueLink={this.linkState(this, "value")}
                        label="Coupon Value (Rs.)"
                        required
                        validations={[
                          {
                            validate: FormValidator.isRequired,
                            message: "Value cannot be empty"
                          },
                          {
                            validate: FormValidator.isPositiveInt,
                            message: "Value cannot be negative"
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
                }
              </Row>
              <Row>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "fromDate", this.handleFromDate)}
                    label="Valid From"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "From date cannot be empty"
                      },
                    ]}
                    control={{
                      type: DatePickerControl,
                      settings: {
                        placeholder: "Select Valid from Date",
                        minDate: new Date(),
                      }
                    }}
                  />
                </Col>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "toDate")}
                    label="Valid To"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "To date cannot be empty"
                      },
                    ]}
                    control={{
                      type: DatePickerControl,
                      settings: {
                        placeholder: "Select Valid to Date",
                        minDate: this.state.fromDate || new Date(),
                      }
                    }}
                  />
                </Col>
                {
                  this.state.type == CouponTypes.PERCENTAGE &&
                  <Col md={4}>
                    <FormElement
                      valueLink={this.linkState(this, "maxDiscountLimit")}
                      label="Max Discount Limit"
                      required
                      validations={[
                        {
                          validate: FormValidator.isRequired,
                          message: "Max limit cannot be empty"
                        },
                        {
                          validate: FormValidator.isPositiveInt,
                          message: "Max limit cannot be negative"
                        }
                      ]}
                      control={{
                        type: CustomTextControl,
                        settings: {
                          placeholder: "Enter Max Discount Limit",
                        }
                      }}
                    />
                  </Col>
                }

                {/* <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "minimumBookingAmount")}
                    label="Minimum Booking Amount"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Amount cannot be empty"
                      },
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Minimum Booking Amount",
                      }
                    }}
                  />
                </Col> */}
              </Row>
              <Row>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "newUserOnly")}
                    label="New Users Only"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Field cannot be empty"
                      },
                    ]}
                    control={{
                      type: SelectControl,
                      settings: {
                        placeholder: "Select Field",
                        options: [
                          { label: "Yes", value: 10 },
                          { label: "No", value: 20 }
                        ],
                      }
                    }}
                  />
                </Col>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "maxNumberOfUsages")}
                    label="Max Number of Usages"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Max usage cannot be empty"
                      },
                      {
                        validate: FormValidator.isPositiveInt,
                        message: "Max limit cannot be negative"
                      }
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Max Number of Usages",
                      }
                    }}
                  />
                </Col>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "maxUsagePerCustomer")}
                    label="Max Usage per Customer"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Max usage cannot be empty"
                      },
                      {
                        validate: FormValidator.isPositiveInt,
                        message: "Max limit cannot be negative"
                      }
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Max usage per Customer",
                      }
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "applicableLevel")}
                    label="Applicable Level"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Field cannot be empty"
                      },
                    ]}
                    control={{
                      type: SelectControl,
                      settings: {
                        placeholder: "Select a Applicable Level",
                        options: [
                          { label: "Country", value: 10 },
                          { label: "City", value: 30 }
                        ],
                        onChangeCallback: (onBlur) => {
                          this.setState(
                            {
                              applicableLocation: "",
                              applicableLevel: this.state.applicableLevel,
                            },
                            () => {
                              this.props.getAllLocationApi(
                                this,
                                this.state.applicableLevel
                              );
                            }
                          );
                        },
                      }
                    }}
                  />
                </Col>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "applicableLocation")}
                    label="Applicable Location"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Field cannot be empty"
                      },
                    ]}
                    control={{
                      type: SelectControl,
                      settings: {
                        placeholder: "Select a Applicable Location",
                        options: this.state.applicableLevel === LocationType.COUNTRY ? this.state.countryList : this.state.cityList,
                        multiple: true,
                      }
                    }}
                  />
                </Col>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "franchiseShare")}
                    label="Franchise Settlement Distribution (in percentage)"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Field cannot be empty"
                      },
                      {
                        validate: FormValidator.isPositiveInt,
                        message: "Franchise share cannot be negative"
                      },
                      {
                        validate: FormValidator.isWithinInt(0, 100),
                        message: "Max limit cannot be greater than 100"
                      },

                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter a Number",
                        onChangeCallback: () => {
                        }
                      }
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "applicableFranchise")}
                    label="Applicable Franchise"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Field cannot be empty"
                      },
                    ]}
                    control={{
                      type: SelectControl,
                      settings: {
                        placeholder: "Select a Franchise",
                        options: [
                          { label: "Yes", value: 10 },
                          { label: "No", value: 20 }
                        ],
                      }
                    }}
                  />
                </Col>
                {
                  this.state.applicableFranchise === 10 &&
                  <Col md={4}>
                    <FormElement
                      valueLink={this.linkState(this, "franchiseId")}
                      label="Franchise"
                      required
                      validations={[
                        {
                          validate: FormValidator.isRequired,
                          message: "Field cannot be empty"
                        },
                      ]}
                      control={{
                        type: SelectControl,
                        settings: {
                          placeholder: "Select a Franchise",
                          options: this.state.franchiseOptionsList,
                          multiple: true,
                        }
                      }}
                    />
                  </Col>
                }

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
  customersState: state.CustomersState
});

const mapDispatchToProps = {
  getAllLocationApi,
  getAllFranchiseApi,
  addEditCouponsApi
}

export default connect(mapStateToProps, mapDispatchToProps)(AddEditCustomer);