import React, { useEffect, useState } from "react";
import { Image, Modal } from "react-bootstrap";
import {
  BackBlackIcon,
  CloseIconBlack,
  UserCreditTelegramThickWelcomeIcon,
} from "../../../assets/images/icons";
import { validateEmail } from "../../../utils/validators";
import logo from "./../../../image/Loch.svg";
import "./_newAuth.scss";
import {
  goToTelegram,
  loadingAnimation,
  mobileCheck,
} from "../../../utils/ReusableFunctions";
import {
  WelcomeSignUpGetReferralCode,
  WelcomeSignUpReferralModalClosed,
} from "../../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../../utils/ManageToken";

const SignUp = ({
  show,
  toggleModal,
  handleChangeEmail,
  email,
  handleSubmitEmail,
  handleChangeReferralCode,
  handleGoToReferral,
  handleGoBackToSignUp,
  isReferralCodeStep,
  referralCode,
  checkReferralCode,
  isReferralCodeLoading,
}) => {
  const submitRef = React.useRef(null);
  const [showEmailError, setShowEmailError] = useState(false);
  useEffect(() => {
    if (showEmailError) {
      setShowEmailError(false);
    }
  }, [email]);

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
  const handleGoBackToSignUpPassThrough = () => {
    WelcomeSignUpReferralModalClosed({
      session_id: getCurrentUser().id,
      email_address: email,
    });
    handleGoBackToSignUp();
  };
  const handleClosePassThrough = () => {
    toggleModal();
    if (isReferralCodeStep) {
      WelcomeSignUpReferralModalClosed({
        session_id: getCurrentUser().id,
        email_address: email,
      });
    }
  };
  const goToTelegramPassThrough = () => {
    WelcomeSignUpGetReferralCode({
      session_id: getCurrentUser().id,
      email_address: email,
    });
    goToTelegram();
  };
  const handleGoToReferralPassThrough = () => {
    if (validateEmail(email)) {
      handleGoToReferral();
    } else {
      setShowEmailError(true);
    }
  };
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
      onHide={handleClosePassThrough}
      centered
      aria-labelledby="contained-modal-title-vcenter"
      backdropClassName="exitoverlaymodalNewWelcome"
      contentClassName="new-welcome-modal-content"
      animation={false}
    >
      <Modal.Body style={{ position: "relative" }}>
        {isReferralCodeStep ? (
          <div className="new-homepage-auth-content-close-container new-homepage-auth-content-back--desktop">
            <div
              className="new-homepage-auth-content-close "
              onClick={handleGoBackToSignUpPassThrough}
            >
              <Image
                src={BackBlackIcon}
                style={{
                  height: "10px",
                  width: "10px",
                }}
              />
            </div>
          </div>
        ) : null}
        <div className="new-homepage-auth-content-close-container new-homepage-auth-content-close--desktop">
          <div
            className="new-homepage-auth-content-close "
            onClick={handleClosePassThrough}
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
        <div className="new-auth">
          <div className="new-auth-content input-noshadow-dark input-hover-states">
            <img className="new-auth-content-logo " src={logo} alt="" />
            <div className="new-auth-content-title-holder">
              <h4 className="new-auth-content-title">
                {isReferralCodeStep ? "Referral code" : "Sign up with Loch"}
              </h4>
              {isReferralCodeStep ? (
                <p
                  className="new-auth-content-subtitle"
                  style={{ textAlign: "center" }}
                >
                  Add your referral code here to create an account
                </p>
              ) : (
                <p
                  className="new-auth-content-subtitle"
                  style={{ textAlign: "center" }}
                >
                  Don’t let your hard work go to waste. Add your email so <br />{" "}
                  you can analyze this portfolio with superpowers
                </p>
              )}
            </div>

            {isReferralCodeStep ? (
              <>
                <div className="new-auth-content-input-holder ">
                  <input
                    className="new-auth-content-input"
                    type="text"
                    placeholder="t1v33sshyg91opyhe2yd"
                    value={referralCode}
                    onChange={(e) => handleChangeReferralCode(e.target.value)}
                    disabled={isReferralCodeLoading}
                  />
                  <button
                    style={{
                      opacity: referralCode ? 1 : 0.5,

                      cursor: isReferralCodeLoading ? "default" : "",
                    }}
                    onClick={checkReferralCode}
                    ref={submitRef}
                    className={`new-auth-content-button ${
                      referralCode && !isReferralCodeLoading
                        ? "new-auth-content-button--hover"
                        : ""
                    }`}
                  >
                    {isReferralCodeLoading ? loadingAnimation() : "Save"}
                  </button>
                </div>
                <div className="new-auth-content-bottom-cta-holder">
                  <p
                    onClick={goToTelegramPassThrough}
                    className="new-auth-content-bottom-cta"
                  >
                    Don’t have a referral code? Request for one on Telegram
                    <Image
                      className="new-auth-content-bottom-cta-icon"
                      src={UserCreditTelegramThickWelcomeIcon}
                    />
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="new-auth-content-input-holder ">
                  <input
                    className="new-auth-content-input"
                    type="text"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => handleChangeEmail(e.target.value)}
                  />

                  <button
                    style={{ opacity: validateEmail(email) ? 1 : 0.5 }}
                    onClick={handleGoToReferralPassThrough}
                    ref={submitRef}
                    className={`new-auth-content-button ${
                      validateEmail(email)
                        ? "new-auth-content-button--hover"
                        : ""
                    }`}
                  >
                    Sign up
                  </button>
                </div>
                <div
                  style={{
                    opacity: showEmailError ? 1 : 0,
                  }}
                  className="has-error-container"
                >
                  <div class="has-error custom-form-error form-text">
                    Please enter valid email id
                  </div>
                </div>
                <div className="new-auth-content-bottom-cta-holder">
                  <p
                    onClick={() => {
                      toggleModal("login");
                    }}
                    className="new-auth-content-bottom-cta"
                  >
                    Already have an account?
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default SignUp;
