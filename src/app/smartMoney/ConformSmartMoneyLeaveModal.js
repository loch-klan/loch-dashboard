import React from "react";
import { Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import BaseReactComponent from "../../utils/form/BaseReactComponent";

class ConformSmartMoneyLeaveModal extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      show: props.show,
      handleClose: props.handleClose,
      handleYes: props.handleYes,
    };
  }

  componentDidMount() {
    // set popup active
    window.localStorage.setItem("isPopupActive", true);
  }

  componentWillUnmount() {
    // set popup active
    window.localStorage.setItem("isPopupActive", false);
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
              Are you sure you want to Sign out?
            </p>
            <div className="leave-modal-btn-section">
              <Button
                className="secondary-btn m-r-24"
                onClick={this.state.handleYes}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConformSmartMoneyLeaveModal);
