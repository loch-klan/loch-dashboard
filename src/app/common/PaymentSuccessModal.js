import React from "react";
import { Image, Modal } from "react-bootstrap";
import { connect } from "react-redux";

import {
  CloseIcon,
  LochLogoWhiteIcon,
  NewModalBackArrowIcon,
} from "../../assets/images/icons";
import InfoIcon from "../../assets/images/icons/info-icon.svg";
import LockIcon from "../../assets/images/icons/lock-icon.svg";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import { createUserPayment } from "./Api";
import { PaywallSuccessLochLogoImage } from "../../assets/images";

class PaymentSuccessModal extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  hideModal = () => {
    if (this.props.onHide) {
      this.props.onHide();
    }
  };
  render() {
    return (
      <Modal
        show
        className={`exit-overlay-form pay-wall-modal pay-wall-options-modal pay-wall-success-modal ${
          this.props.isMobile ? "pay-wall-modal-mobile" : "zoomedElements"
        }`}
        onHide={this.hideModal}
        size="lg"
        dialogClassName={`exit-overlay-modal ${
          this.props.isMobile ? "bottom-modal" : ""
        }`}
        centered
        aria-labelledby="contained-modal-title-vcenter"
        backdropClassName="exitoverlaymodal"
        animation={false}
      >
        <div
          style={{
            width: this.props.isMobile ? "100%" : "",
          }}
          className="modal-purple-top-gradient"
        />
        <Modal.Header>
          {this.props.isMobile ? (
            <div className="mobile-copy-trader-popup-header">
              <div
                style={{
                  opacity: 0,
                }}
              />
              <div
                style={{
                  zIndex: 1,
                }}
                className="paywall-success-modal-header-icon paywall-success-modal-header-icon-mobile"
              >
                <Image
                  className="paywall-success-modal-header-image"
                  src={PaywallSuccessLochLogoImage}
                />
              </div>
              <div
                onClick={this.hideModal}
                className="mobile-copy-trader-popup-header-close-icon mobile-solid-close-icon"
                style={{
                  zIndex: 2,
                }}
              >
                <Image src={CloseIcon} />
              </div>
            </div>
          ) : (
            <>
              <div className="paywall-success-modal-header-icon">
                <Image
                  className="paywall-success-modal-header-image"
                  src={PaywallSuccessLochLogoImage}
                />
              </div>
              <div className="closebtn" onClick={this.hideModal}>
                <Image src={CloseIcon} />
              </div>
            </>
          )}
        </Modal.Header>
        <Modal.Body>
          <div className="addWatchListWrapperParent addCopyTradeWrapperParent paywall-body">
            <div className="paywall-body-padding">
              <div
                style={{
                  marginBottom: this.props.isMobile ? "2.3rem" : "3.3rem",
                  marginTop: this.props.isMobile ? "1rem" : "",
                  padding: this.props.isMobile ? "0.25rem" : "",
                }}
                className="exit-overlay-body"
              >
                <>
                  <h6
                    className={`text-center inter-display-medium ${
                      this.props.isMobile ? "f-s-20" : "f-s-25"
                    }`}
                  >
                    Congrats, you’re on premium!
                  </h6>
                  <p
                    className={`inter-display-medium ctpb-sub-text text-center ${
                      this.props.isMobile ? "f-s-16" : "f-s-16"
                    }`}
                  >
                    {this.props.subText
                      ? this.props.subText
                      : "Start exploring the platform now"}
                  </p>
                  <div
                    onClick={this.hideModal}
                    className="inter-display-medium paywall-success-modal-body-btn"
                  >
                    Explore
                  </div>
                </>
              </div>
            </div>

            <div
              style={{
                marginTop: "3rem",
                position: this.props.isMobile ? "absolute" : "",
                bottom: "2rem",
              }}
              className="ctpb-user-discalmier"
            >
              {this.props.isMobile ? (
                <p className="inter-display-medium f-s-13 lh-16 grey-ADA">
                  Don't worry.{" "}
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
                      onMouseEnter={this.privacymessage}
                      style={{ cursor: "pointer" }}
                    />
                  </CustomOverlay>
                  <div>All your information remains private and anonymous.</div>
                </p>
              ) : (
                <p className="inter-display-medium f-s-13 lh-16 grey-ADA">
                  Don't worry. All your information remains private and
                  anonymous.
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
                      onMouseEnter={this.privacymessage}
                      style={{ cursor: "pointer" }}
                    />
                  </CustomOverlay>
                </p>
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  OnboardingState: state.OnboardingState,
});
const mapDispatchToProps = { createUserPayment };

PaymentSuccessModal.propTypes = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaymentSuccessModal);
