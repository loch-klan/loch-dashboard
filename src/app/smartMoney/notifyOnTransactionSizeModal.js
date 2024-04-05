import React from "react";

import { connect } from "react-redux";
import {
  BackArrowSmartMoneyIcon,
  CrossSmartMoneyIcon,
  RingingBellIcon,
  SmartMoneyFaqModalIcon,
} from "../../assets/images/icons";
import { BaseReactComponent, CustomButton } from "../../utils/form";
import { Modal, Image, Button } from "react-bootstrap";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Tooltip from "rc-tooltip";
import HandleTooltip from "../common/HandleSliderTooltop";
import { TruncateText } from "../../utils/ReusableFunctions";

class NotifyOnTransactionSizeModal extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      show: props.show,
      onHide: props.onHide,
      sliderVal: 1,
    };
  }

  render() {
    return (
      <Modal
        show={this.state.show}
        className="exit-overlay-form"
        onHide={this.state.onHide}
        size="lg"
        dialogClassName={"exit-overlay-modal"}
        centered
        aria-labelledby="contained-modal-title-vcenter"
        backdropClassName="exitoverlaymodal"
      >
        <Modal.Header>
          {this.state.selectedQuestion > -1 &&
          this.state.selectedQuestion < this.state.questionAnswers.length ? (
            <div onClick={this.goToQuestions} className="backiconmodal">
              <Image src={BackArrowSmartMoneyIcon} />
            </div>
          ) : null}
          <div className="api-modal-header popup-main-icon-with-border">
            <Image src={RingingBellIcon} />
          </div>
          <div className="closebtn" onClick={this.state.onHide}>
            <Image src={CrossSmartMoneyIcon} />
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="sliderModalBody">
            <div
              className="exit-overlay-body"
              style={{ padding: "0rem 10.5rem" }}
            >
              <h6 className="inter-display-medium text-center f-s-25">
                Notify on transaction size
              </h6>
              <p className="inter-display-medium f-s-16 grey-969 m-b-24 text-center">
                Notify me when{" "}
                <span
                  style={{
                    textDecoration: "underline",
                  }}
                >
                  {TruncateText(this.props.selectedAddress)}
                </span>{" "}
                makes a<br />
                transaction worth more than
              </p>
            </div>
            <div className="smbSliderContainer">
              <Slider
                min={0}
                max={1000000000}
                step={1000}
                handleRender={(node, props) => {
                  return (
                    <HandleTooltip value={props.value} visible={props.dragging}>
                      {node}
                    </HandleTooltip>
                  );
                }}
              />

              <div className="smbSlidervalueContainer inter-display-medium">
                <div className="smbSlidervalues">$0K</div>
                <div className="smbSlidervalues">$100K</div>
                <div className="smbSlidervalues">$1b</div>
              </div>
            </div>
            <div className="smbButtonContainer">
              <Button
                className="secondary-btn white-bg btn-bg-white-outline-black hover-bg-black"
                onClick={this.state.onHide}
              >
                Cancel
              </Button>
              <CustomButton
                className="primary-btn go-btn main-button-invert"
                type="submit"
                buttonText="Confirm"
                handleClick={this.addAddressToWatchListFun}
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {};

NotifyOnTransactionSizeModal.propTypes = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotifyOnTransactionSizeModal);
