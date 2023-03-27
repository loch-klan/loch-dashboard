import React from "react";
import { connect } from "react-redux";
import { Modal, Image, Button, Row, Col, Container } from "react-bootstrap";
import {
  Form,
  FormElement,
  FormValidator,
  BaseReactComponent,
  CustomTextControl,
} from "../../utils/form";
import CloseIcon from "../../assets/images/icons/dummyX.svg";
import backIcon from "../../assets/images/icons/back-icon.svg";
import ExitOverlayIcon from "../../assets/images/icons/ExitOverlayWalletIcon.svg";
import LockIcon from "../../assets/images/icons/lock-icon.svg";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import InfoIcon from "../../assets/images/icons/info-icon.svg";
import { WhaleCreateAccountPrivacyHover } from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";

import LochIcon from "../../assets/images/icons/loch-icon.svg";
import { updateUser } from "../profile/Api";

class AskEmailModal extends BaseReactComponent {
  constructor(props) {
    super(props);
    const dummyUser = localStorage.getItem("lochDummyUser");
    const userDetails = JSON.parse(localStorage.getItem("lochUser"));
    this.state = {
      firstName: userDetails?.first_name || "",
      lastName: userDetails?.last_name || "",
      email: userDetails?.email || "",
      mobileNumber: userDetails?.mobile || "",
      link: userDetails?.link || localStorage.getItem("lochDummyUser") || "",
      show: props.show,
      onHide: props.onHide,
      modalType: "Email",
    };
  }

  componentDidMount() {
    // set popup active
    localStorage.setItem("isPopupActive", true);
  }

  componentWillUnmount() {
    // set popup active
    localStorage.setItem("isPopupActive", false);
  }
    componentDidUpdate() { }
    
    handleUpdateEmail = () => {
         const data = new URLSearchParams();
        
         data.append("email", this.state.email);
         
         updateUser(data, this);
    };

  render() {
    return (
      <Modal
        show={this.state.show}
        className="exit-overlay-form"
        // backdrop="static"
        onHide={this.state.onHide}
        size="lg"
        dialogClassName={"exit-overlay-modal"}
        centered
        aria-labelledby="contained-modal-title-vcenter"
        backdropClassName="exitoverlaymodal"
      >
        <Modal.Header>
          {this.props.iconImage ? (
            <div className="api-modal-header">
              <Image src={this.props.iconImage} />
            </div>
          ) : (
            <div className="exitOverlayIcon">
              <Image src={LochIcon} />
            </div>
          )}
          <div
            className="closebtn"
            onClick={() => {
              this.state.onHide(true);
            }}
          >
            <Image src={CloseIcon} />
          </div>
        </Modal.Header>
        <Modal.Body>
          <div
            className="exit-overlay-body"
            style={{ padding: "0rem 10.5rem" }}
          >
            <h6 className="inter-display-medium f-s-20 lh-24 ">
              {this.state.modalTitle
                ? this.state.modalTitle
                : "Update your email"}
            </h6>
            <p className="inter-display-medium f-s-16 lh-19 grey-7C7 m-b-24 text-center">
              {this.state.modalDescription ? this.state.modalDescription : ""}
            </p>

            <div className="email-section auth-modal">
              {/* For Signin or Signup */}
              <Form onValidSubmit={this.handleUpdateEmail}>
                <FormElement
                  valueLink={this.linkState(this, "email")}
                  // label="Email Info"
                  required
                  validations={[
                    {
                      validate: FormValidator.isRequired,
                      message: "",
                    },
                    {
                      validate: FormValidator.isEmail,
                      message: "Please enter valid email id",
                    },
                  ]}
                  control={{
                    type: CustomTextControl,
                    settings: {
                      placeholder: "Email",
                    },
                  }}
                />
                <div className="save-btn-section">
                  <Button
                    className={`inter-display-semi-bold f-s-16 lh-19 white save-btn ${
                      this.state.email ? "active" : ""
                    }`}
                    type="submit"
                    style={{ padding: "1.7rem 3.1rem" }}
                  >
                    Save
                  </Button>
                </div>
              </Form>
            </div>
            <div></div>

            <div className="m-b-36 footer">
              <p className="inter-display-medium f-s-13 lh-16 grey-ADA m-r-5">
                At Loch, we care intensely about your privacy and pseudonymity.
              </p>
              <CustomOverlay
                text="Your privacy is protected. No third party will know which wallet addresses(es) you added."
                position="top"
                isIcon={true}
                IconImage={LockIcon}
                isInfo={true}
                className={"fix-width"}
              >
                <Image
                  src={InfoIcon}
                  className="info-icon"
                  onMouseEnter={() => {
                    // WhaleCreateAccountPrivacyHover({
                    //   session_id: getCurrentUser().id,
                    //   email_address: this.state.email,
                    // });
                  }}
                />
              </CustomOverlay>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {

};
AskEmailModal.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(AskEmailModal);
