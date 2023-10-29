import React from "react";
import BaseReactComponent from "./../../utils/form/BaseReactComponent";
import { connect } from "react-redux";
import { Modal, Image, Button } from "react-bootstrap";
import { resetUser } from "../../utils/AnalyticsFunctions";

class ConfirmLeaveModal extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      show: props.show,
      handleClose: props.handleClose,
    };
  }

  componentDidMount() {
    // set popup active
    window.sessionStorage.setItem("isPopupActive", true);
  }

  componentWillUnmount() {
    // set popup active
    window.sessionStorage.setItem("isPopupActive", false);
  }

  render() {
    return (
      <Modal
        show={this.state.show}
        className="confirm-leave-modal"
        // backdrop="static"
        onHide={this.state.handleClose}
        centered
        backdropClassName="confirmLeaveModal"
      >
        <Modal.Body>
          <div className="leave-modal-body">
            <p className="inter-display-medium f-s-20 lh-24 m-b-30 black-000">
              Are you sure you want to leave ?{" "}
            </p>
            <div className="leave-modal-btn-section">
              <Button
                className="secondary-btn m-r-24"
                onClick={() => {
                  resetUser();
                  window.sessionStorage.setItem("refresh", false);
                  this.props.history.push("/welcome");
                }}
              >
                Yes
              </Button>
              <Button className="primary-btn" onClick={this.state.handleClose}>
                No
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmLeaveModal);
