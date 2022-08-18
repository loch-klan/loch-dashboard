import React from 'react';
import { Col, Row } from 'react-bootstrap';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { BaseReactComponent, CustomTextControl, Form, FormElement, FormValidator, SelectControl } from '../../utils/form';
import { ComponentHeader } from '../common';
import { AccountType, LocationType } from '../../utils/Constant';
import { getAllLocationApi } from '../common/Api';
import { addUpdateAccountApi, getAllAccountApi } from './Api';

class AddEditDealer extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      accountType: JSON.parse(localStorage.getItem('userDetails')).user_account_type,
      data: [],
      conditions: [{ "key": "SEARCH_BY_TYPE", "value": AccountType.OEM, "context": null }],
      oem: "",
      companyName: "",
      dealerName: "",
      contactNumber: "",
      email: "",
      state: "",
      city: "",
      stateList: [],
      cityList: [],
    }
  }

  componentDidMount() {
    if (this.state.accountType === AccountType.ADMIN) {
      this.props.getAllAccountApi(this)
    }
    this.props.getAllLocationApi(this, LocationType.STATE)
  }

  handleSave = () => {
    const data = new URLSearchParams();
    data.append("account_email", this.state.email);
    data.append("user_account_roles", JSON.stringify([{ "role_ids": JSON.parse(localStorage.getItem('userDetails')).account_permissions[0].role_ids, "account_id": "-1", "vehicle_scope": "1" }]));
    data.append("account_name", this.state.companyName);
    data.append("account_type", AccountType.DEALER);
    data.append("city_id", this.state.city);
    data.append("state_id", this.state.state);
    data.append("contact_name", this.state.dealerName);
    data.append("contact_number", this.state.contactNumber);
    if (this.state.accountType === AccountType.ADMIN) {
      data.append("parent_account_id", this.state.oem);
    }
    addUpdateAccountApi(data, () => this.props.history.goBack());
  }

  onNextClick = () => {
    ReactDOM.findDOMNode(this.form).dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
  }
  render() {
    const { data } = this.state;
    console.log('data', data);
    let oemList = [];
    if (this.state.accountType === AccountType.ADMIN) {
      oemList = data.map((item) => ({
        label: item.name,
        value: item.id
      }))
    }
    return (
      <>
        <ComponentHeader
          backArrowBtn={true}
          history={this.props.history}
          title={"Add Dealer"}
          secondaryBtnText={"Cancel"}
          isSecondaryBtn={() => this.props.history.goBack()}
          isPrimaryBtn={this.onNextClick}
          primaryBtnText={"Save Dealer"}
        />
        <div className="add-edit-customer-wrapper">
          {/* <Container> */}
          <div className="content">
            <Form onValidSubmit={this.handleSave} ref={el => this.form = el}>
              <Row>
                {
                  AccountType.ADMIN === this.state.accountType &&
                  <Col md={4}>
                    <FormElement
                      valueLink={this.linkState(this, "oem")}
                      label="OEM Name"
                      required
                      validations={[
                        {
                          validate: FormValidator.isRequired,
                          message: "OEM name cannot be empty"
                        },
                      ]}
                      control={{
                        type: SelectControl,
                        settings: {
                          placeholder: "Select OEM Name",
                          options: oemList,
                          multiple: false,
                          searchable: true,
                          onChangeCallback: (onBlur) => {
                            onBlur(this.state.oem);
                          }
                        }
                      }}
                    />
                  </Col>
                }

                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "companyName")}
                    label="Company Name"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Company Name cannot be empty"
                      },
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Company Name",
                      }
                    }}
                  />
                </Col>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "dealerName")}
                    label="Dealer Name"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Dealer name cannot be empty"
                      },
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Dealer Name",
                      }
                    }}
                  />
                </Col>
                {/*  </Row>
              <Row> */}
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "contactNumber")}
                    label="Contact Number"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Contact cannot be empty"
                      },
                      {
                        validate: FormValidator.isPhone,
                        message: "Please enter a valid number"
                      }
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Contact Number",
                      }
                    }}
                  />
                </Col>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "email")}
                    label="Email"
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
                        multiple: false,
                        searchable: true,
                        onChangeCallback: (onBlur) => {
                          onBlur(this.state.state);
                          this.setState({ city: "" })
                          this.props.getAllLocationApi(this, LocationType.CITY)
                        }
                      }
                    }}
                  />
                </Col>
                {/* </Row>
              <Row> */}
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
                        multiple: false,
                        searchable: true,
                        onChangeCallback: (onBlur) => {
                          onBlur(this.state.city);
                        }
                      }
                    }}
                  />
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
  userManagementState: state.UserManagementState
});
const mapDispatchToProps = {
  getAllLocationApi,
  getAllAccountApi
}

export default connect(mapStateToProps, mapDispatchToProps)(AddEditDealer);