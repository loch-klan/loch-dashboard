import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import { BaseReactComponent, CustomTextControl, Form, FormElement, FormValidator, SelectControl } from '../../utils/form';
import { ComponentHeader } from '../common';
import ReactDOM from 'react-dom';
import { AccountType, LocationType } from '../../utils/Constant';
import { getAllLocationApi } from '../common/Api';
import { addUpdateAccountApi } from './Api';
;


class AddEditOem extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      oemName: "",
      contactName: "",
      contactNumber: "",
      email: "",
      state: "",
      city: "",
      stateList: [],
      cityList: [],
    }
  }
  componentDidMount() {
    this.props.getAllLocationApi(this, LocationType.STATE)
  }

  handleSave = () => {
    const data = new URLSearchParams();
    data.append("account_email", this.state.email);
    data.append("user_account_roles", JSON.stringify([{ "role_ids": JSON.parse(localStorage.getItem('userDetails')).account_permissions[0].role_ids, "account_id": "-1", "vehicle_scope": "1" }]));
    data.append("account_name", this.state.oemName);
    data.append("account_type", AccountType.OEM);
    data.append("city_id", this.state.city);
    data.append("state_id", this.state.state);
    data.append("contact_name", this.state.contactName);
    data.append("contact_number", this.state.contactNumber);
    addUpdateAccountApi(data, () => this.props.history.goBack());
  }

  onNextClick = () => {
    ReactDOM.findDOMNode(this.form).dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
  }

  render() {
    return (
      <>
        <ComponentHeader
          backArrowBtn={true}
          history={this.props.history}
          title={"Add OEM"}
          secondaryBtnText={"Cancel"}
          isSecondaryBtn={() => this.props.history.goBack()}
          isPrimaryBtn={this.onNextClick}
          primaryBtnText={"Save OEM"}
        />
        <div className="add-edit-customer-wrapper">
          {/* <Container> */}
          <div className="content">
            <Form onValidSubmit={this.handleSave} ref={el => this.form = el}>
              <Row>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "oemName")}
                    label="OEM Name"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "OEM name cannot be empty"
                      },
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter OEM Name",
                      }
                    }}
                  />
                </Col>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "contactName")}
                    label="Contact Name"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Contact Name cannot be empty"
                      },
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Contact Name",
                      }
                    }}
                  />
                </Col>
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
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Contact Number",
                      }
                    }}
                  />
                </Col>
              </Row>
              <Row>
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
  getAllLocationApi
}
export default connect(mapStateToProps, mapDispatchToProps)(AddEditOem);