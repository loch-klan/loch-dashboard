import React, { useEffect } from "react";
import { Image, Modal } from "react-bootstrap";
import "./_newAuth.scss";
import logo from "./../../../image/Loch.svg";
import {
  CrossSmartMoneyIcon,
  NewWelcomeLoginCrossIcon,
} from "../../../assets/images/icons";

const VerifyMobile = ({
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
    size="md"
    className="exit-overlay-form newWelcomePageTranlucentModal welcome-modal-mobile"
    dialogClassName={
      "exit-overlay-modal exit-overlay-modal-new-welcome modal-new-welcome-v-top welcome-modal-mobile-dialogue"
    }
    show={show}
    onHide={toggleModal}
    centered
    aria-labelledby="contained-modal-title-vcenter"
    backdropClassName="exitoverlaymodalNewWelcome"
    >
      <Modal.Body>
        {/* <div className="new-auth-mobile-wrap"> */}
          <div className="new-auth new-auth-mobile verify-otp" style={{paddingBottom:'48px'}}>
            <div className="new-auth-content" style={{ position: "relative" }}>
            <div className="new-homepage-auth-content-close-container new-homepage-auth-content-close--mobile">
              <div
                className="new-homepage-auth-content-close "
                onClick={toggleModal}
              >
                <Image
                  src={NewWelcomeLoginCrossIcon}
                  style={{
                    height: "2rem",
                    width: "2rem",
                  }}
                />
              </div>
            </div>
              <img className="new-auth-content-logo" src={logo} alt="" />
              <div className="new-auth-content-title-holder new-auth-content-title-holder-mobile">
                <h4 className="new-auth-content-title">Enter code</h4>
                <p className="new-auth-content-subtitle">
                  The verification code is sent to your email
                </p>
              </div>
              <div className="new-auth-content-input-holder new-auth-content-input-holder-mobile new-auth-content-input-holder--otp">
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
        {/* </div> */}
      </Modal.Body>
    </Modal>
  );
};

export default VerifyMobile;
