import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import { AccountType, LocationType } from '../../utils/Constant';
import { BaseReactComponent, CustomTextControl, DatePickerControl, Form, FormElement, FormValidator, SelectControl } from '../../utils/form';
import { getUserAccountType } from '../../utils/ManageToken';
import { ComponentHeader } from '../common';
import { getAllLocationApi } from '../common/Api';
import { getAllAccounts, getAllVehiclesDropdownApi } from '../vehicles/Api';
import ReactDOM from 'react-dom';
import { format } from 'date-fns';
import { addUpdateCustomerApi } from './Api';

class AddEditCustomer extends BaseReactComponent {
  constructor(props) {
    super(props);
    const userAccountType = getUserAccountType();
    const editData = props.location.state ? props.location.state.editData : null;
    // console.log('editData', editData);
    this.state = {
      editId: editData ? editData.id : "",
      name: editData ? editData.name : "",
      email: editData ? editData.billing_email : "",
      phone: editData ? editData.billing_contact : "",
      orderId: "",
      vehicleId: editData ? editData.vehicle_inventory.id : "",
      orderDate: "",
      dealer: "",
      state: editData ? editData.extra_information.state_id : "",
      city: editData ? editData.extra_information.city_id : "",
      stateList: [],
      cityList: [],
      vehicleOptions: [],
      userAccountType,
    }
  }
  componentDidMount() {
    this.props.getAllLocationApi(this, LocationType.STATE);
    if (this.state.editId)
      this.props.getAllLocationApi(this, LocationType.CITY);

    if (this.state.userAccountType < AccountType.DEALER) {
      getAllAccounts(this, AccountType.DEALER, 'dealerOptions');
    }
  }
  handleSave = () => {
    ReactDOM.findDOMNode(this.form).dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
  }

  onValidSubmit = () => {

    const data = new URLSearchParams();

    const {
      name, phone, state, city, orderId,
      vehicleId, orderDate,
      dealer, email,
    } = this.state;

    const orderDateString = format(orderDate, 'dd-MM-yyyy');

    data.append('customer_email', email);
    data.append('customer_name', name);
    data.append('city_id', city);
    data.append('state_id', state);
    data.append('contact_name', name);
    data.append('contact_number', phone);
    // data.append('customer_gender', gender);
    data.append('order_id', orderId);
    data.append('order_date', orderDateString);
    data.append('dealer_account_id', dealer);
    data.append('vehicle_id', vehicleId);

    addUpdateCustomerApi(data, () => {
      this.props.history.push("/customers");
    })

  }

  render() {
    return (
      <>
        <ComponentHeader
          backArrowBtn={true}
          history={this.props.history}
          title={this.state.editId ? "Edit Customer" : "Add Customer"}
          secondaryBtnText={"Cancel"}
          isSecondaryBtn={() => this.props.history.goBack()}
          isPrimaryBtn={this.handleSave}
          primaryBtnText={"Save Customer"}
        />
        <div className="add-edit-customer-wrapper">
          {/* <Container> */}
          <div className="content">
            <Form onValidSubmit={this.onValidSubmit} ref={el => this.form = el}>
              <Row>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "name")}
                    label="Customer Name"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Name cannot be empty"
                      },
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Name",
                      }
                    }}
                  />
                </Col>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "email")}
                    label="Customer Email"
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
                        placeholder: "Enter Email",
                      }
                    }}
                  />
                </Col>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "phone")}
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
                        placeholder: "Enter Number",
                      }
                    }}
                  />
                </Col>
                {/*  </Row>
              <Row> */}
                {/* <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "gender")}
                    label="Select Gender"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Gender cannot be empty"
                      },
                    ]}
                    control={{
                      type: SelectControl,
                      settings: {
                        placeholder: "Select Gender",
                        options: GenderOptions,
                        onChangeCallback: (onBlur) => {
                          onBlur(this.state.gender);
                        }
                      }
                    }}
                  />
                </Col> */}
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "state")}
                    label="State"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "State cannot be empty"
                      },
                    ]}
                    control={{
                      type: SelectControl,
                      settings: {
                        placeholder: "Select State",
                        options: this.state.stateList,
                        onChangeCallback: () => {
                          this.setState({
                            city: "",
                            stateId: this.state.state
                          }, () => {
                            this.props.getAllLocationApi(this, LocationType.CITY);
                          })
                        }
                      }
                    }}
                  />
                </Col>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "city")}
                    label="City"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "City cannot be empty"
                      },
                    ]}
                    control={{
                      type: SelectControl,
                      settings: {
                        placeholder: "Select City",
                        options: this.state.cityList,
                        noOptionCustom: () => ("Please select a state first"),
                        onChangeCallback: (onBlur) => {
                          onBlur(this.state.city);
                        }
                      }
                    }}
                  />
                </Col>
                {/* </Row>
              <Row> */}
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "orderId")}
                    label="Order Reference ID"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Order ID cannot be empty"
                      },
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Order Reference ID",
                      }
                    }}
                  />
                </Col>
                {
                  this.state.userAccountType < AccountType.DEALER &&
                  <Col md={4}>
                    <FormElement
                      valueLink={this.linkState(this, "dealer")}
                      label="Dealer"
                      required
                      validations={[
                        {
                          validate: FormValidator.isRequired,
                          message: "Dealer cannot be empty"
                        },
                      ]}
                      control={{
                        type: SelectControl,
                        settings: {
                          placeholder: "Select Dealer",
                          options: this.state.dealerOptions,
                          onChangeCallback: (onBlur) => {
                            onBlur(this.state.dealer);
                            getAllVehiclesDropdownApi(this);
                          }
                        }
                      }}
                    />
                  </Col>
                }
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "vehicleId")}
                    label="Vehicle Chassis No."
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Chassis number cannot be empty"
                      },
                    ]}
                    control={{
                      type: SelectControl,
                      settings: {
                        placeholder: "Select Vehicle by Chassis No",
                        options: this.state.vehicleOptions,
                        onChangeCallback: (onBlur) => {
                          onBlur(this.state.vehicleId);
                        }
                      }
                    }}
                  />
                </Col>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "orderDate")}
                    label="Order Date"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Order date cannot be empty"
                      },
                    ]}
                    control={{
                      type: DatePickerControl,
                      settings: {
                        placeholder: "Select Order Date",
                      }
                    }}
                  />
                </Col>
                {/* </Row>
              <Row> */}

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
}
export default connect(mapStateToProps, mapDispatchToProps)(AddEditCustomer);