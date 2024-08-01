import React, { useEffect, useState } from "react";
import { Image, Modal } from "react-bootstrap";
import "./_newAuth.scss";
import logo from "./../../../image/Loch.svg";
import { validateEmail } from "../../../utils/validators";
import {
  CloseIconBlack,
  CrossSmartMoneyIcon,
  NewWelcomeLoginCrossIcon,
} from "../../../assets/images/icons";

const LoginMobile = ({
  show,
  toggleModal,
  handleChangeEmail,
  email,
  handleSubmitEmail,
  smartMoneyLogin,
  popupAnimation,
}) => {
  const submitRef = React.useRef(null);
  const [showValidEmailErrorMessage, setShowValidEmailErrorMessage] =
    useState(false);
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
  useEffect(() => {
    setShowValidEmailErrorMessage(false);
  }, [email]);

  const onLoginClick = () => {
    if (validateEmail(email)) {
      handleSubmitEmail();
    } else {
      setShowValidEmailErrorMessage(true);
    }
  };
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
      contentClassName="new-welcome-modal-content"
      animation={popupAnimation}
    >
      <Modal.Body style={{ position: "relative" }}>
        {/* <div className="new-auth-mobile-wrap"> */}
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
        <div className="new-auth new-auth-mobile">
          <div className="new-auth-content input-noshadow-dark input-hover-states">
            <img
              className="new-auth-content-logo new-auth-content-logo-mobile"
              src={logo}
              alt=""
            />
            <div className="new-auth-content-title-holder new-auth-content-title-holder-mobile">
              <h4 className="new-auth-content-title">Sign in</h4>
              <p className="new-auth-content-subtitle">
                {!smartMoneyLogin
                  ? "Get right back into your account"
                  : "Sign in to access Loch’s Leaderboard"}
              </p>
            </div>
            <div
              style={{
                opacity: showValidEmailErrorMessage ? 1 : 0,
              }}
              className="has-error-container has-error-container-mobile"
            >
              <div className="has-error custom-form-error form-text">
                Please enter valid email id
              </div>
            </div>
            <div className="new-auth-content-input-holder new-auth-content-input-holder-mobile">
              <input
                className="new-auth-content-input"
                type="text"
                placeholder="Your email address"
                value={email}
                onChange={(e) => handleChangeEmail(e.target.value)}
              />
              <button
                style={{ opacity: validateEmail(email) ? 1 : 0.5 }}
                onClick={onLoginClick}
                ref={submitRef}
                className={`new-auth-content-button ${
                  validateEmail(email) ? "new-auth-content-button--hover" : ""
                }`}
              >
                Sign in
              </button>
            </div>
            <div className="new-auth-content-bottom-cta-holder new-auth-content-bottom-cta-holder-mobile">
              <p
                onClick={() => {
                  toggleModal("signup");
                }}
                className="new-auth-content-bottom-cta "
              >
                Don’t have an account yet?
              </p>
            </div>
          </div>
        </div>
        {/* </div> */}
      </Modal.Body>
    </Modal>
  );
};

export default LoginMobile;
