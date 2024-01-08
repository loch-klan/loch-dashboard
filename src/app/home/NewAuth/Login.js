import React, { useEffect } from "react";
import { Image, Modal } from "react-bootstrap";
import "./_newAuth.scss";
import logo from "./../../../image/Loch.svg";
import { validateEmail } from "../../../utils/validators";
import { CrossSmartMoneyIcon } from "../../../assets/images/icons";

const Login = ({
  show,
  toggleModal,
  handleChangeEmail,
  email,
  handleSubmitEmail,
  smartMoneyLogin
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
      dialogClassName={"exit-overlay-modal exit-overlay-modal-new-welcome modal-new-welcome-v-top"}
      show={show}
      onHide={toggleModal}
      centered
      aria-labelledby="contained-modal-title-vcenter"
      backdropClassName="exitoverlaymodalNewWelcome"
    >
      <Modal.Body style={{position:"relative"}}>
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
        <div className="new-auth" style={{ paddingBottom: "80px" }}>
          <div className="new-auth-content">
            <img className="new-auth-content-logo" src={logo} alt="" />
            <div className="new-auth-content-title-holder">
              <h4 className="new-auth-content-title">Sign in</h4>
              <p className="new-auth-content-subtitle">
                {!smartMoneyLogin?"Get right back into your account":"Sign in to access Loch’s Leaderboard"}
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
      </Modal.Body>
    </Modal>
  );
};

export default Login;
