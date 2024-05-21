import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import { CustomTextControl, Form, FormElement } from "../../utils/form";
// import CustomButton from "../../utils/form/CustomButton";
import BaseReactComponent from "../../utils/form/BaseReactComponent";
// import ReactDOM from 'react-dom';
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import {
  EmailAdded,
  FirstNameAdded,
  LastNameAdded,
  MobileNumberAdded,
  ProfileSaved,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import { SigninWallet } from "../common/Api";
import UpgradeModal from "../common/upgradeModal";
import { ManageLink, updateUser } from "./Api.js";

class ProfileForm extends BaseReactComponent {
  constructor(props) {
    super(props);
    const userDetails = JSON.parse(window.localStorage.getItem("lochUser"));
    this.state = {
      firstName: userDetails?.first_name || "",
      lastName: userDetails?.last_name || "",
      email: userDetails?.email || "",
      mobileNumber: userDetails?.mobile || "",
      referred_by: userDetails?.referred_by || "",
      link:
        userDetails?.link || window.localStorage.getItem("lochDummyUser") || "",
      prevfirstName: userDetails?.first_name || "",
      prevlastName: userDetails?.last_name || "",
      prevemail: userDetails?.email || "",
      prevmobileNumber: userDetails?.mobile || "",
      manageUrl: "",
      upgradeModal: false,

      // metamask
      MetamaskExist: false,
      MetaAddress: "",
      balance: 0,
      btnloader: false,
    };
    // this.onClose = this.onClose.bind(this);
  }

  // Signin wit wallet
  SigninWallet = () => {
    // get device id
    const deviceId = window.localStorage.getItem("deviceId") || uuidv4();

    if (!window.localStorage.getItem("deviceId")) {
      // console.log("no device id");
      window.localStorage.setItem("deviceId", deviceId);
    }

    if (!window.localStorage.getItem("connectWalletAddress")) {
      window.localStorage.setItem(
        "connectWalletAddress",
        this.state.MetaAddress
      );
    }

    let data = new URLSearchParams();
    data.append("device_id", deviceId);
    data.append("wallet_address", this.state.MetaAddress);

    SigninWallet(data, this);
  };

  componentDidUpdate(prevProps) {
    if (prevProps.userDetails !== this.props.userDetails) {
      const userDetails = this.props.userDetails;
      this.setState({
        firstName: userDetails?.first_name || "",
        lastName: userDetails?.last_name || "",
        email: userDetails?.email || "",
        mobileNumber: userDetails?.mobile || "",
        referred_by: userDetails?.referred_by || "",
        link:
          userDetails?.link ||
          window.localStorage.getItem("lochDummyUser") ||
          "",
        prevfirstName: userDetails?.first_name || "",
        prevlastName: userDetails?.last_name || "",
        prevemail: userDetails?.email || "",
        prevmobileNumber: userDetails?.mobile || "",
      });
    }
  }
  componentDidMount() {
    ManageLink(this);

    // check metamask already connected or not
    if (window.localStorage.getItem("connectWalletAddress")) {
      this.setState({
        MetaAddress: window.localStorage.getItem("connectWalletAddress"),
      });
    }
  }

  upgradeModal = () => {
    this.setState({
      upgradeModal: !this.state.upgradeModal,
      userPlan: JSON.parse(window.localStorage.getItem("currentPlan")),
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
    data.append(
      "email",
      this.state.email ? this.state.email.toLowerCase() : ""
    );
    data.append("mobile", this.state.mobileNumber);
    data.append("referral_code", this.state.referred_by);
    data.append("signed_up_from", "Profile page");
    this.props.updateUser(data, this);
  };
  render() {
    return (
      <div className="profile-form input-hover-states">
        {/* <div className="form-title">
          <Image src={profileInfoIcon} className="m-r-12" />
          <p className="inter-display-semi-bold f-s-16 lh-19">
            Basic Information
          </p>
        </div> */}
        <div className="form">
          <Form onValidSubmit={this.onValidSubmit}>
            <div>
              <Row>
                <Col md={4} className="p-r-0 input-noshadow-dark">
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
                <Col md={4} className="p-r-0 input-noshadow-dark">
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
                <Col md={4} className="p-r-0 input-noshadow-dark">
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
              <Row>
                <Col md={4} className="input-noshadow-dark p-r-0">
                  <FormElement
                    valueLink={this.linkState(this, "mobileNumber")}
                    label="Mobile Number"
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "(217) 331 - 1312",
                      },
                    }}
                    classes={"input-noshadow-dark"}
                  />
                </Col>
                <Col md={4}></Col>
                <Col md={4}>
                  <div className="formBtnContainer">
                    <Button
                      className="inter-display-semi-bold f-s-14 lh-24  submit-button btn-tirtiarary"
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
                  </div>
                </Col>
              </Row>
            </div>
            {/* <div className="m-b-13">
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
            </div> */}
            {/* <div className="m-b-13">
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
            </div> */}
          </Form>
          {/* {this.state.MetaAddress !== "" ? (
            <p className="inter-display-semi-bold f-s-13 lh-15 m-t-16">
              {this.state.MetaAddress} connected
            </p>
          ) : (
            <Button
              className={`primary-btn m-t-16 ${
                this.state.btnloader ? "disabled" : ""
              }`}
              style={{
                padding: "1.4rem 4rem",
              }}
              onClick={() => {
                if (this.state.btnloader) {
                } else {
                  this.connectMetamask();
                }
              }}
            >
              {this.state.btnloader ? loadingAnimation() : "Connect wallet"}
            </Button>
          )} */}
          {this.state.upgradeModal && (
            <UpgradeModal
              show={this.state.upgradeModal}
              onHide={this.upgradeModal}
              history={this.props.history}
              isShare={window.localStorage.getItem("share_id")}
              isStatic={this.state.isStatic}
              triggerId={0}
              pname="profile form"
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
