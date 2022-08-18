import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import { BaseReactComponent, CustomRadio, CustomTextControl, Form, FormElement, FormValidator, SelectControl } from '../../utils/form';
import { ComponentHeader } from '../common';
import ReactDOM from 'react-dom';
import { getAllRolesApi, addUserApi, editUserApi } from './Api';
import { getUserAccountType } from '../../utils/ManageToken';
import { AccountType } from "../../utils/Constant";
import { getAllFranchiseLocationApi } from '../franchise/Api';

class AddEditUser extends BaseReactComponent {
  constructor(props) {
    super(props);
    const editData = props.location.state ? props.location.state.data : null;
    //console.log(editData, "as");
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    this.state = {
      userId: editData ? editData.id : "",
      firstName: editData ? editData.first_name : "",
      lastName: editData ? editData.last_name : "",
      email: editData ? editData.email : "",
      rolesOption: [],
      roleList: editData ? editData.user_account_roles[0].role_ids : [],
      isAllLocation: editData ? editData.user_account_roles[0].franchise_location_scope == "1" ? "true" : "false" : "true",
      isAllCity: "true",
      franchiseLocationOption: [],
      franchiseLocation: editData ? editData.user_account_roles[0].franchise_location_scope != "1" ? editData.user_account_roles[0].franchise_location_scope : [] : [],
      userDetails
    }
  }
  componentDidMount() {
    this.props.getAllRolesApi(this);
    if (this.state.userDetails.user_account_type !== AccountType.COMPANY) {
      this.props.getAllFranchiseLocationApi(this, 0, true);
    } else {
      //console.log(getUserAccountType() === AccountType.FRANCHISE)
    }
  }

  //   componentDidUpdate( prevProps, prevState ){
  // console.log("Hey", prevState, this.state)
  //   }

  handleSave = () => {
    const data = new URLSearchParams();
    data.append("first_name", this.state.firstName);
    data.append("last_name", this.state.lastName);
    data.append("role_ids", JSON.stringify(this.state.roleList));
    data.append("franchise_location_scope_all", this.state.isAllLocation);
    data.append("city_scope_all", true);
    data.append("franchise_location_scope", JSON.stringify(this.state.franchiseLocation))
    if (this.state.userId) {
      data.append("user_id", this.state.userId);
      editUserApi(data, () => this.props.history.goBack());
    } else {
      data.append("email", this.state.email);
      addUserApi(data, () => this.props.history.goBack());
    }
  }
  // do you want to give access to all location - yes / no
  //  if no show franchise location dropdown

  onNextClick = () => {
    ReactDOM.findDOMNode(this.form).dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
  }

  render() {
    return (
      <>
        <ComponentHeader
          backArrowBtn={true}
          history={this.props.history}
          title={this.state.userId ? "Edit User" : "Add User"}
          secondaryBtnText={"Cancel"}
          isSecondaryBtn={() => this.props.history.goBack()}
          isPrimaryBtn={this.onNextClick}
          primaryBtnText={"Save User"}
        />
        <div className="add-edit-customer-wrapper">
          {/* <Container> */}
          <div className="content">
            <Form onValidSubmit={this.handleSave} ref={el => this.form = el}>
              <Row>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "firstName")}
                    label="First Name"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "First name cannot be empty"
                      },
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter First Name",
                      }
                    }}
                  />
                </Col>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "lastName")}
                    label="Last Name"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Last Name cannot be empty"
                      },
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Last Name",
                      }
                    }}
                  />
                </Col>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "email")}
                    label="Email"
                    disabled={this.state.userId ? true : false}
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
                    valueLink={this.linkState(this, "roleList")}
                    label="Role"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Role cannot be empty"
                      },
                    ]}
                    control={{
                      type: SelectControl,
                      settings: {
                        placeholder: "Select Roles",
                        options: this.state.rolesOption,
                        multiple: true,
                        searchable: true,
                        onChangeCallback: (onBlur) => {
                          onBlur(this.state.roleList);
                        }
                      }
                    }}
                  />
                </Col>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "isAllLocation")}
                    label="Do you want to give access to all locations"
                    required
                    disabled={getUserAccountType() === AccountType.FRANCHISE ? false : true}
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Field cannot be empty"
                      }
                    ]}
                    control={{
                      type: CustomRadio,
                      settings: {
                        radioId: "allLocations",
                        radioName: "allLocations",
                        options: [
                          {
                            key: "true",
                            label: "Yes"
                          },
                          {
                            key: "false",
                            label: "No"
                          }
                        ],
                        isInline: true,
                      }
                    }}
                  />
                </Col>
                {
                  (getUserAccountType() === AccountType.FRANCHISE && this.state.isAllLocation === "false") &&
                  <Col md={4}>
                    <FormElement
                      valueLink={this.linkState(this, "franchiseLocation")}
                      label="Franchise Location List"
                      required
                      validations={[
                        {
                          validate: FormValidator.isRequired,
                          message: "Franchise location list cannot be empty"
                        },
                      ]}
                      control={{
                        type: SelectControl,
                        settings: {
                          placeholder: "Select Franchise Location",
                          options: this.state.franchiseLocationOption,
                          multiple: true,
                          searchable: true,
                          onChangeCallback: (onBlur) => {
                            onBlur(this.state.franchiseLocation);
                          }
                        }
                      }}
                    />
                  </Col>
                }
                {
                  getUserAccountType() === AccountType.COMPANY &&
                  <Col md={4}>
                    <FormElement
                      valueLink={this.linkState(this, "isAllCity")}
                      label="Do you want to give access to all cities"
                      required
                      disabled
                      validations={[
                        {
                          validate: FormValidator.isRequired,
                          message: "Field cannot be empty"
                        }
                      ]}
                      control={{
                        type: CustomRadio,
                        settings: {
                          radioId: "allCity",
                          radioName: "allCity",
                          options: [
                            {
                              key: "true",
                              label: "Yes"
                            },
                            {
                              key: "false",
                              label: "No"
                            }
                          ],
                          isInline: true,
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
  userManagementState: state.UserManagementState
});
const mapDispatchToProps = {
  getAllRolesApi,
  getAllFranchiseLocationApi
}
export default connect(mapStateToProps, mapDispatchToProps)(AddEditUser);