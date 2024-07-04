import React from "react";
import { Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import BaseReactComponent from "./../../utils/form/BaseReactComponent";

class ConfirmLeaveModal extends BaseReactComponent {
  render() {
    return (
      <Modal
        show={this.props.show}
        className={`confirm-leave-modal ${
          this.props.isMobile ? "basicConfirmModalMobile" : "zoomedElements"
        }`}
        // backdrop="static"
        onHide={this.props.handleClose}
        centered
        backdropClassName="confirmLeaveModal"
      >
        <Modal.Body>
          <div className="leave-modal-body">
            <p className="inter-display-medium f-s-20 lh-24 m-b-30 invertTextColor">
              {this.props.title}
            </p>
            <div className="leave-modal-btn-section">
              <Button
                className="secondary-btn m-r-24 main-button btn-bg-white-outline-black"
                onClick={this.props.handleYes}
              >
                Yes
              </Button>
              <Button className="primary-btn" onClick={this.props.handleClose}>
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
