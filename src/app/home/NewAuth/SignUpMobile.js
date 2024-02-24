import React, { useEffect } from "react";
import { Image, Modal } from "react-bootstrap";
import "./_newAuth.scss";
import logo from "./../../../image/Loch.svg";
import { validateEmail } from "../../../utils/validators";
import {
  CloseIconBlack,
  CrossSmartMoneyIcon,
  NewWelcomeLoginCrossIcon,
} from "../../../assets/images/icons";

const SignUpMobile = ({
  show,
  toggleModal,
  handleChangeEmail,
  email,
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
        "exit-overlay-modal exit-overlay-modal-new-welcome modal-new-welcome-v-top modal-new-welcome-v-top-mobile welcome-modal-mobile-dialogue"
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
        {/* <div className="new-auth-mobile-wrap"> */}
        <div className="new-homepage-auth-content-close-container new-homepage-auth-content-close--mobile">
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
        <div className="new-auth new-auth-mobile">
          <div className="new-auth-content">
            <img
              className="new-auth-content-logo new-auth-content-logo-mobile"
              src={logo}
              alt=""
            />
            <div className="new-auth-content-title-holder new-auth-content-title-holder-mobile">
              <h4 className="new-auth-content-title">Sign up with Loch</h4>
              <p
                className="new-auth-content-subtitle"
                style={{ textAlign: "center", maxWidth: "280px" }}
              >
                Don’t let your hard work go to waste. Add your email so you can
                analyze your portfolio with superpowers
              </p>
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
                onClick={() => {
                  if (validateEmail(email)) handleSubmitEmail();
                }}
                ref={submitRef}
                className={`new-auth-content-button ${
                  validateEmail(email) ? "new-auth-content-button--hover" : ""
                }`}
              >
                Sign Up
              </button>
            </div>
            <div className="new-auth-content-bottom-cta-holder new-auth-content-bottom-cta-holder-mobile">
              <p
                onClick={() => {
                  toggleModal("login");
                }}
                className="new-auth-content-bottom-cta "
              >
                Already have an account?
              </p>
            </div>
          </div>
        </div>
        {/* </div> */}
      </Modal.Body>
    </Modal>
  );
};

export default SignUpMobile;