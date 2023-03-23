import React from "react";
import { Form, FormElement, CustomTextControl } from "../../utils/form";
import { Row, Col, Image, Button } from "react-bootstrap";
import profileInfoIcon from "../../image/ProfileInfoIcon.svg";
// import CustomButton from "../../utils/form/CustomButton";
import BaseReactComponent from "../../utils/form/BaseReactComponent";
// import ReactDOM from 'react-dom';
import { ManageLink, updateUser } from "./Api.js";
import { connect } from "react-redux";
import {
  EmailAdded,
  FirstNameAdded,
  LastNameAdded,
  MobileNumberAdded,
  ProfileSaved,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import UpgradeModal from "../common/upgradeModal";

class ProfileForm extends BaseReactComponent {
  constructor(props) {
    super(props);
    const userDetails = JSON.parse(localStorage.getItem("lochUser"));
    this.state = {
      firstName: userDetails?.first_name || "",
      lastName: userDetails?.last_name || "",
      email: userDetails?.email || "",
      mobileNumber: userDetails?.mobile || "",
      link: userDetails?.link || localStorage.getItem("lochDummyUser") || "",
      prevfirstName: userDetails?.first_name || "",
      prevlastName: userDetails?.last_name || "",
      prevemail: userDetails?.email || "",
      prevmobileNumber: userDetails?.mobile || "",
      manageUrl: "",
      upgradeModal: false,
    };
    // this.onClose = this.onClose.bind(this);
  }
  componentDidMount() {
    ManageLink(this);
  }

  upgradeModal = () => {
    this.setState({
      upgradeModal: !this.state.upgradeModal,
      userPlan: JSON.parse(localStorage.getItem("currentPlan")),
    });
  };

  onValidSubmit = () => {
    // Analytics
    if (this.state.prevfirstName !== this.state.firstName) {
      FirstNameAdded({
        session_id: getCurrentUser().id,
        email_address: this.state.email,
        first_name: this.firstName,
      });
      //   console.log(
      //     "prev fName",
      //     this.state.prevfirstName,
      //     "New fname",
      //     this.state.firstName
      //   );
    }
    if (this.state.prevlastName !== this.state.lastName) {
      LastNameAdded({
        session_id: getCurrentUser().id,
        email_address: this.state.email,
        last_name: this.state.lastName,
      });
      //   console.log(
      //     "prev lName",
      //     this.state.prevlastName,
      //     "New lname",
      //     this.state.lastName
      //   );
    }
    if (
      this.state.prevemail !== this.state.email ||
      (this.state.prevemail === "" && this.state.email !== "")
    ) {
      EmailAdded({
        session_id: getCurrentUser().id,
        new_email_address: this.state.email,
        prev_email_address: this.state.prevemail,
      });
      //   console.log(
      //     "prev email",
      //     this.state.prevemail,
      //     "New email",
      //     this.state.email
      //   );
    }
    if (this.state.prevmobileNumber !== this.state.mobileNumber) {
      MobileNumberAdded({
        session_id: getCurrentUser().id,
        phone_number: this.state.mobileNumber,
      });
      //   console.log(
      //     "prev number",
      //     this.state.mobileNumber,
      //     "New number",
      //     this.state.mobileNumber
      //   );
    }

    const data = new URLSearchParams();
    data.append("first_name", this.state.firstName);
    data.append("last_name", this.state.lastName);
    data.append("email", this.state.email);
    data.append("mobile", this.state.mobileNumber);
    updateUser(data, this);
  };
  render() {
    return (
      <div className="profile-form">
        <div className="form-title">
          <Image src={profileInfoIcon} className="m-r-12" />
          <p className="inter-display-semi-bold f-s-16 lh-19">
            Basic Information
          </p>
        </div>
        <div className="form">
          <Form onValidSubmit={this.onValidSubmit}>
            <div className="m-b-13">
              <Row>
                <Col md={6} className="p-r-0">
                  <FormElement
                    valueLink={this.linkState(this, "firstName")}
                    label="First Name"
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "John",
                      },
                    }}
                    classes={
                      {
                        // inputField: this.state.firstName !== "" ? "done" : "",
                      }
                    }
                  />
                </Col>
                <Col md={6}>
                  <FormElement
                    valueLink={this.linkState(this, "lastName")}
                    label="Last Name"
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Loch",
                      },
                    }}
                    classes={
                      {
                        // inputField: this.state.lastName !== "" ? "done" : "",
                      }
                    }
                  />
                </Col>
              </Row>
            </div>
            <div className="m-b-13">
              <Row>
                <Col md={12}>
                  <FormElement
                    valueLink={this.linkState(this, "email")}
                    label="Email"
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "john@loch.one",
                      },
                    }}
                    classes={
                      {
                        // inputField: this.state.email !== "" ? "done" : "",
                      }
                    }
                  />
                </Col>
              </Row>
            </div>
            <div className="m-b-13">
              <Row>
                <Col md={8}>
                  <FormElement
                    valueLink={this.linkState(this, "mobileNumber")}
                    label="Mobile Number"
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "(217) 331 - 1312",
                      },
                    }}
                    classes={
                      {
                        // inputField: this.state.mobileNumber !== "" ? "done" : "",
                      }
                    }
                  />
                </Col>
              </Row>
            </div>

            <div>
              <Button
                className="inter-display-semi-bold f-s-14 lh-24 black-191  submit-button"
                type="submit"
                onClick={() =>
                  ProfileSaved({
                    email_address: getCurrentUser().email,
                    session_id: getCurrentUser().id,
                  })
                }
              >
                Save changes
              </Button>

              {/* <Button
                className="secondary-btn m-l-10"
                onClick={() => {
                  if (this.state.manageUrl === "" || this.state.manageUrl === undefined) {
                    this.upgradeModal();
                  } else {
                    window.open(this.state.manageUrl);
                  }
                }}
              >
                Manage subscriptions
              </Button> */}
            </div>
          </Form>
          {this.state.upgradeModal && (
            <UpgradeModal
              show={this.state.upgradeModal}
              onHide={this.upgradeModal}
              history={this.props.history}
              isShare={localStorage.getItem("share_id")}
              isStatic={this.state.isStatic}
              triggerId={0}
            />
          )}
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({});
const mapDispatchToProps = {
  updateUser,
};
ProfileForm.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileForm);
