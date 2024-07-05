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
import { mobileCheck } from "../../../utils/ReusableFunctions";

const Verify = ({
  show,
  toggleModal,
  handleChangeOTP,
  otp,
  handleSubmitOTP,
  handleSubmitEmail,
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
  const [isMobile] = useState(mobileCheck());
  return (
    <Modal
      size="lg"
      className={`exit-overlay-form newWelcomePageTranlucentModal ${
        isMobile ? "" : "zoomedElements"
      }`}
      dialogClassName={
        "exit-overlay-modal exit-overlay-modal-new-welcome modal-new-welcome-v-top"
      }
      show={show}
      onHide={toggleModal}
      centered
      aria-labelledby="contained-modal-title-vcenter"
      backdropClassName="exitoverlaymodalNewWelcome"
      contentClassName="new-welcome-modal-content"
      animation={false}
    >
      <Modal.Body style={{ position: "relative" }}>
        <div className="new-homepage-auth-content-close-container new-homepage-auth-content-close--desktop">
          <div
            className="new-homepage-auth-content-close "
            onClick={toggleModal}
          >
            <Image
              src={CloseIconBlack}
              style={{
                height: "10px",
                width: "10px",
              }}
            />
          </div>
        </div>
        <div className="new-auth verify-otp">
          <div className="new-auth-content input-noshadow-dark input-hover-states">
            <img className="new-auth-content-logo" src={logo} alt="" />
            <div className="new-auth-content-title-holder">
              <h4 className="new-auth-content-title">Enter code</h4>
              <p className="new-auth-content-subtitle">
                The verification code is sent to your email
              </p>
            </div>
            <div className="new-auth-content-input-holder new-auth-content-input-holder--otp">
              {/* <input
                className="new-auth-content-input"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => {
                  handleChangeOTP(e.target.value);
                }}
              /> */}
              <OTPInputs numberOfDigits={6} handleChangeOTP={handleChangeOTP} />
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
            <div className="new-auth-content-bottom-cta-holder">
              <p
                onClick={() => {
                  handleSubmitEmail(true);
                }}
                className="new-auth-content-bottom-cta"
              >
                Send code again
              </p>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Verify;
