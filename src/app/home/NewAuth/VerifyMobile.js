import React, { useEffect, useState } from "react";
import { Image, Modal } from "react-bootstrap";
import "./_newAuth.scss";
import logo from "./../../../image/Loch.svg";
import {
  CloseIconBlack,
  CrossSmartMoneyIcon,
  NewWelcomeLoginCrossIcon,
} from "../../../assets/images/icons";
import OTPInputs from "./OTPInputs";

const VerifyMobile = ({
  show,
  toggleModal,
  handleChangeOTP,
  otp,
  handleSubmitOTP,
  handleSubmitEmail,
  showOtpError,
}) => {
  const submitRef = React.useRef(null);

  useEffect(() => {
    const listener = (event) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        submitRef.current.click();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, []);
  const hideModal = () => {
    toggleModal("");
  };
  return (
    <Modal
      size="md"
      className="exit-overlay-form newWelcomePageTranlucentModal welcome-modal-mobile"
      dialogClassName={
        "exit-overlay-modal exit-overlay-modal-new-welcome modal-new-welcome-v-top modal-new-welcome-v-top-mobile welcome-modal-mobile-dialogue"
      }
      show={show}
      onHide={hideModal}
      centered
      aria-labelledby="contained-modal-title-vcenter"
      backdropClassName="exitoverlaymodalNewWelcome"
    >
      <Modal.Body style={{ position: "relative" }}>
        <div className="new-homepage-auth-content-close-container new-homepage-auth-content-close--mobile">
          <div className="new-homepage-auth-content-close " onClick={hideModal}>
            <Image
              src={CloseIconBlack}
              style={{
                height: "10px",
                width: "10px",
              }}
            />
          </div>
        </div>
        {/* <div className="new-auth-mobile-wrap"> */}
        <div
          className="new-auth new-auth-mobile verify-otp"
          style={{ paddingBottom: "48px" }}
        >
          <div className="new-auth-content input-noshadow-dark input-hover-states">
            <img
              className="new-auth-content-logo new-auth-content-logo-mobile"
              src={logo}
              alt=""
            />
            <div className="new-auth-content-title-holder new-auth-content-title-holder-mobile">
              <h4 className="new-auth-content-title">Enter code</h4>
              <p className="new-auth-content-subtitle">
                The verification code is sent to your email
              </p>
            </div>
            <div
              style={{
                opacity: showOtpError ? 1 : 0,
              }}
              className="has-error-container has-error-container-mobile"
            >
              <div class="has-error custom-form-error form-text">
                Invalid verification code
              </div>
            </div>
            <div className="new-auth-content-input-holder new-auth-content-input-holder-mobile new-auth-content-input-holder--otp">
              {/* <input
                  className="new-auth-content-input"
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => {
                    handleChangeOTP(e.target.value);
                  }}
                /> */}
              <OTPInputs
                numberOfDigits={6}
                handleChangeOTP={handleChangeOTP}
                isMobile
              />
              <button
                style={{
                  opacity: otp?.length > 5 ? 1 : 0.5,
                }}
                onClick={handleSubmitOTP}
                ref={submitRef}
                className={`new-auth-content-button ${
                  otp ? "new-auth-content-button--hover" : ""
                }`}
              >
                Verify
              </button>
            </div>
            <div className="new-auth-content-bottom-cta-holder new-auth-content-bottom-cta-holder-mobile">
              <p
                onClick={() => {
                  handleSubmitEmail(true);
                }}
                className="new-auth-content-bottom-cta new-auth-content-bottom-cta--mobile"
              >
                Send code again
              </p>
            </div>
          </div>
        </div>
        {/* </div> */}
      </Modal.Body>
    </Modal>
  );
};

export default VerifyMobile;
