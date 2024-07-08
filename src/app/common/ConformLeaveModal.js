import React from "react";
import { Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { resetUser } from "../../utils/AnalyticsFunctions";
import BaseReactComponent from "./../../utils/form/BaseReactComponent";
import { mobileCheck } from "../../utils/ReusableFunctions";
import { reserWalletList } from "../wallet/Api";

class ConfirmLeaveModal extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: mobileCheck(),
      show: props.show,
      handleClose: props.handleClose,
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
        className={`confirm-leave-modal ${
          this.state.isMobile ? "" : "zoomedElements"
        }`}
        // backdrop="static"
        onHide={this.state.handleClose}
        centered
        backdropClassName="confirmLeaveModal"
      >
        <Modal.Body>
          <div className="leave-modal-body">
            <p className="inter-display-medium f-s-20 lh-24 m-b-30 invertTextColor">
              {this.props.customMessage
                ? this.props.customMessage
                : "Are you sure you want to leave ?"}
            </p>
            <div className="leave-modal-btn-section">
              <Button
                className="secondary-btn m-r-24 main-button btn-bg-white-outline-black"
                onClick={() => {
                  if (this.props.handleSignOutWelcome) {
                    this.props.reserWalletList();
                    resetUser(true);
                    this.props.handleSignOutWelcome();
                  } else {
                    this.props.reserWalletList();
                    resetUser();
                    window.localStorage.setItem("refresh", false);
                    this.props.history.push("/welcome");
                  }
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
const mapDispatchToProps = { reserWalletList };

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmLeaveModal);
