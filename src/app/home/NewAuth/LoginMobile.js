import React, { useEffect } from "react";
import { Image, Modal } from "react-bootstrap";
import "./_newAuth.scss";
import logo from "./../../../image/Loch.svg";
import { validateEmail } from "../../../utils/validators";
import {
  CrossSmartMoneyIcon,
  NewWelcomeLoginCrossIcon,
} from "../../../assets/images/icons";

const LoginMobile = ({
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
      size="lg"
      className="exit-overlay-form newWelcomePageTranlucentModal"
      style={{
        paddingTop: "100px",
        backdropFilter: "blur(10px)",
        overflow: "hidden",
      }}
      dialogClassName={"exit-overlay-modal exit-overlay-modal-new-welcome"}
      show={show}
      onHide={toggleModal}
      centered
      aria-labelledby="contained-modal-title-vcenter"
      backdropClassName="exitoverlaymodalNewWelcome"
    >
      <Modal.Body>
        <div className="new-auth-mobile-wrap">
          <div className="new-auth " style={{ paddingBottom: "80px" }}>
            <div className="new-auth-content" style={{ position: "relative" }}>
              <div
                className="new-homepage-auth-content-close"
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
              <img className="new-auth-content-logo" src={logo} alt="" />
              <div className="new-auth-content-title-holder">
                <h4 className="new-auth-content-title">Sign in</h4>
                <p className="new-auth-content-subtitle">
                  Get right back into your account
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
                  Sign in
                </button>
              </div>
              {/* <div className='new-auth-content-bottom-cta-holder'>
                          <p className='new-auth-content-bottom-cta'>
                          Don’t have an account yet?
                          </p>
                      </div> */}
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default LoginMobile;
