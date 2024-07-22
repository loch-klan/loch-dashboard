import React from "react";
import { Image, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import BaseReactComponent from "../../../utils/form/BaseReactComponent.js";
// import CloseIcon from '../../assets/images/icons/close-icon.svg'
import CloseIcon from "../../../assets/images/icons/dummyX.svg";

import backIcon from "../../../assets/images/icons/Icon-back.svg";
import { ModalBellIcon } from "../../../assets/images/icons/index.js";
import DexScreenerPriceAlertModalPopularTokens from "./DexScreenerPriceAlertModalPopularTokens.js";
import "./_dexScreenerPriceAlertModal.scss";
import DexScreenerPriceAlertModalAllAlerts from "./DexScreenerPriceAlertModalAllAlerts.js";

class DexScreenerPriceAlertModal extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      show: props.show,
      onHide: props.onHide,
      curTitle: "You haven’t set any alerts yet",
      curDesc:
        "To set price alerts for a pair, click add alert on the token page to do so.",
      curStep: 1,
      showBackBtn: true,
      popularTokens: [
        {
          name: "Token name",
          platform: "SOLANA",
          imageIcon: "",
        },
        {
          name: "Token name",
          platform: "SOLANA",
          imageIcon: "",
        },
        {
          name: "Token name",
          platform: "SOLANA",
          imageIcon: "",
        },
        {
          name: "Token name",
          platform: "SOLANA",
          imageIcon: "",
        },
        {
          name: "Token name",
          platform: "SOLANA",
          imageIcon: "",
        },
        {
          name: "Token name",
          platform: "SOLANA",
          imageIcon: "",
        },
      ],
      curAlerts: [
        {
          alertType: "goes over",
          amount: "$0.00592",
          isActive: true,
        },
        {
          alertType: "goes under",
          amount: "$0.00592",
          isActive: false,
        },
        {
          alertType: "is equal to",
          amount: "$0.00592",
          isActive: true,
        },
        {
          alertType: "goes over",
          amount: "$0.00592",
          isActive: false,
        },
        {
          alertType: "is equal to",
          amount: "$0.00592",
          isActive: true,
        },
        {
          alertType: "goes over",
          amount: "$0.00592",
          isActive: false,
        },
        {
          alertType: "is equal to",
          amount: "$0.00592",
          isActive: true,
        },
        {
          alertType: "goes over",
          amount: "$0.00592",
          isActive: false,
        },
        {
          alertType: "is equal to",
          amount: "$0.00592",
          isActive: true,
        },
        {
          alertType: "goes over",
          amount: "$0.00592",
          isActive: false,
        },
        {
          alertType: "is equal to",
          amount: "$0.00592",
          isActive: true,
        },
        {
          alertType: "goes over",
          amount: "$0.00592",
          isActive: false,
        },
      ],
    };
  }
  componentDidMount() {
    if (this.props.curToken) {
      this.setState({
        curStep: 2,
        curTitle: "Manage Price alerts",
        curDesc: "Set up an alert for",
        showBackBtn: false,
      });
    }
  }
  goBackBtn = () => {
    this.setState({
      curStep: this.state.curStep - 1,
    });
  };
  goToSetAlert = () => {
    this.setState({
      curStep: 2,
    });
  };
  componentDidUpdate(prevProps, prevState) {
    if (prevState.curStep !== this.state.curStep) {
      if (this.state.curStep === 1) {
        this.setState({
          curTitle: "You haven’t set any alerts yet",
          curDesc:
            "To set price alerts for a pair, click add alert on the token page to do so",
        });
      } else if (this.state.curStep === 2) {
        this.setState({
          curTitle: "Manage Price alerts",
          curDesc: "Set up an alert for",
        });
      }
    }
  }

  render() {
    return (
      <Modal
        show={this.state.show}
        className={`exit-overlay-form ${
          this.state.isMobile ? "" : "zoomedElements"
        }`}
        onHide={this.state.onHide}
        size="lg"
        dialogClassName={"exit-overlay-modal"}
        centered
        aria-labelledby="contained-modal-title-vcenter"
        backdropClassName="exitoverlaymodal"
        animation={false}
      >
        <Modal.Header>
          {this.state.curStep > 1 && this.state.showBackBtn ? (
            <div className="signin-header back-icon " onClick={this.goBackBtn}>
              <Image className="cp" src={backIcon} />
            </div>
          ) : null}

          <div className="api-modal-header popup-main-icon-with-border">
            <Image src={ModalBellIcon} />
          </div>

          <div
            className="closebtn"
            onClick={() => {
              this.state.onHide();
            }}
          >
            <Image src={CloseIcon} />
          </div>
        </Modal.Header>
        <Modal.Body>
          <div
            className="exit-overlay-body"
            style={{ padding: "0rem", margin: "0rem" }}
          >
            <h6 className="inter-display-medium f-s-20 lh-24 ">
              {this.state.curTitle}
            </h6>
            <div className="price-alerts-header-subheading-container m-b-24">
              <p
                style={{
                  margin: "0",
                }}
                className="inter-display-medium f-s-16 lh-19 grey-7C7  text-center"
              >
                {this.state.curDesc}{" "}
              </p>
              {this.state.curStep === 2 ? (
                <div className="price-alerts-header-subheading-extra">
                  Scooby
                </div>
              ) : null}
            </div>
            <div className="price-alerts-body">
              {this.state.curStep === 1 ? (
                <DexScreenerPriceAlertModalPopularTokens
                  onClick={this.goToSetAlert}
                  alertBlock
                  popularTokens={this.state.popularTokens}
                />
              ) : this.state.curStep === 2 ? (
                <DexScreenerPriceAlertModalAllAlerts
                  curAlerts={this.state.curAlerts}
                />
              ) : null}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {};

DexScreenerPriceAlertModal.propTypes = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DexScreenerPriceAlertModal);
