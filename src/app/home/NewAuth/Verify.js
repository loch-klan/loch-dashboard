import React, { useEffect } from "react";
import { Image, Modal } from "react-bootstrap";
import { CrossSmartMoneyIcon } from "../../../assets/images/icons";
import logo from "./../../../image/Loch.svg";
import "./_newAuth.scss";

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

  return (
    <Modal
      size="lg"
      className="exit-overlay-form"
      dialogClassName={
        "exit-overlay-modal exit-overlay-modal-new-welcome modal-new-welcome-v-top"
      }
      show={show}
      onHide={toggleModal}
      centered
      aria-labelledby="contained-modal-title-vcenter"
      backdropClassName="exitoverlaymodalNewWelcome"
    >
      <Modal.Body style={{ position: "relative" }}>
        <div
          className="new-homepage-auth-content-close new-homepage-auth-content-close--desktop"
          onClick={toggleModal}
        >
          <Image
            src={CrossSmartMoneyIcon}
            style={{
              height: "2rem",
              width: "2rem",
            }}
          />
        </div>
        <div className="new-auth verify-otp">
          <div className="new-auth-content">
            <img className="new-auth-content-logo" src={logo} alt="" />
            <div className="new-auth-content-title-holder">
              <h4 className="new-auth-content-title">Enter code</h4>
              <p className="new-auth-content-subtitle">
                The verification code is sent to your email
              </p>
            </div>
            <div className="new-auth-content-input-holder new-auth-content-input-holder--otp">
              <input
                className="new-auth-content-input"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => {
                  handleChangeOTP(e.target.value);
                }}
              />
              <button
                style={{
                  opacity: otp ? 1 : 0.5,
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
