import React, { useEffect, useState } from "react";
import { Image, Modal } from "react-bootstrap";
import "./_newAuth.scss";
import logo from "./../../../image/Loch.svg";
import { validateEmail } from "../../../utils/validators";
import {
  BackBlackIcon,
  CloseIconBlack,
  CrossSmartMoneyIcon,
  NewWelcomeLoginCrossIcon,
  UserCreditTelegramThickWelcomeIcon,
} from "../../../assets/images/icons";
import {
  goToTelegram,
  loadingAnimation,
  mobileCheck,
  whichSignUpMethod,
} from "../../../utils/ReusableFunctions";
import {
  HomeSignUpGetReferralCode,
  SignUpModalReferralCodeTabClosed,
  WelcomeSignUpGetReferralCode,
  WelcomeSignUpReferralModalClosed,
} from "../../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../../utils/ManageToken";

const SignUpMobile = ({
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
  isHome,
}) => {
  const submitRef = React.useRef(null);
  const [isMobileState, setIsMobileState] = useState(false);
  const [showEmailError, setShowEmailError] = useState(false);
  useEffect(() => {
    if (showEmailError) {
      setShowEmailError(false);
    }
  }, [email]);
  useEffect(() => {
    if (mobileCheck()) {
      setIsMobileState(true);
    } else {
      setIsMobileState(false);
    }
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
    if (isHome) {
      const signUpMethod = whichSignUpMethod();
      SignUpModalReferralCodeTabClosed({
        session_id: getCurrentUser().id,
        email_address: email,
        signUpMethod: signUpMethod,
      });
    } else {
      WelcomeSignUpReferralModalClosed({
        session_id: getCurrentUser().id,
        email_address: email,
      });
    }
    handleGoBackToSignUp();
  };
  const handleClosePassThrough = () => {
    toggleModal("");
    if (isReferralCodeStep) {
      if (isHome) {
        const signUpMethod = whichSignUpMethod();
        SignUpModalReferralCodeTabClosed({
          session_id: getCurrentUser().id,
          email_address: email,
          signUpMethod: signUpMethod,
        });
      } else {
        WelcomeSignUpReferralModalClosed({
          session_id: getCurrentUser().id,
          email_address: email,
        });
      }
    }
  };
  const goToTelegramPassThrough = () => {
    if (isHome) {
      const signUpMethod = whichSignUpMethod();
      HomeSignUpGetReferralCode({
        session_id: getCurrentUser().id,
        email_address: email,
        signUpMethod: signUpMethod,
      });
    } else {
      WelcomeSignUpGetReferralCode({
        session_id: getCurrentUser().id,
        email_address: email,
      });
    }
    goToTelegram();
  };
  const handleGoToReferralPassThrough = () => {
    if (validateEmail(email)) {
      handleGoToReferral();
    } else {
      setShowEmailError(true);
    }
  };
  return (
    <Modal
      size="md"
      className="exit-overlay-form newWelcomePageTranlucentModal welcome-modal-mobile"
      dialogClassName={
        "exit-overlay-modal exit-overlay-modal-new-welcome modal-new-welcome-v-top modal-new-welcome-v-top-mobile welcome-modal-mobile-dialogue"
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
        {/* <div className="new-auth-mobile-wrap"> */}
        {isReferralCodeStep ? (
          <div className="new-homepage-auth-content-close-container new-homepage-auth-content-back--mobile">
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
        <div className="new-homepage-auth-content-close-container new-homepage-auth-content-close--mobile">
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
        <div className="new-auth new-auth-mobile">
          <div className="new-auth-content input-noshadow-dark input-hover-states">
            <img
              className="new-auth-content-logo new-auth-content-logo-mobile"
              src={logo}
              alt=""
            />
            <div className="new-auth-content-title-holder new-auth-content-title-holder-mobile">
              <h4 className="new-auth-content-title">
                {isReferralCodeStep ? "Referral code" : "Sign up with Loch"}
              </h4>
              {isReferralCodeStep ? (
                <p
                  className="new-auth-content-subtitle"
                  style={{ textAlign: "center", maxWidth: "280px" }}
                >
                  Add your referral code here to create an account
                </p>
              ) : (
                <p
                  className="new-auth-content-subtitle"
                  style={{ textAlign: "center", maxWidth: "280px" }}
                >
                  Don’t let your hard work go to waste. Add your email so you
                  can analyze this portfolio with superpowers
                </p>
              )}
            </div>
            {isReferralCodeStep ? (
              <>
                <div className="new-auth-content-input-holder new-auth-content-input-holder-mobile">
                  <input
                    className="new-auth-content-input"
                    type="text"
                    placeholder="t1v33sshyg91opyhe2yd"
                    value={referralCode}
                    onChange={(e) => handleChangeReferralCode(e.target.value)}
                  />
                  <button
                    style={{
                      opacity: referralCode ? 1 : 0.5,
                      cursor: isReferralCodeLoading ? "default" : "",
                    }}
                    onClick={checkReferralCode}
                    ref={submitRef}
                    className={`new-auth-content-button ${
                      referralCode && !isReferralCodeLoading && !isMobileState
                        ? "new-auth-content-button--hover"
                        : ""
                    }`}
                  >
                    {isReferralCodeLoading ? loadingAnimation() : "Save"}
                  </button>
                </div>
                <div className="new-auth-content-bottom-cta-holder new-auth-content-bottom-cta-holder-mobile">
                  <p
                    onClick={goToTelegramPassThrough}
                    className="new-auth-content-bottom-cta new-auth-content-bottom-cta--mobile text-center ml-2 mr-2"
                  >
                    Don’t have a referral code? Request for one on Telegram
                    <Image
                      style={{
                        height: "12px",
                      }}
                      className="new-auth-content-bottom-cta-icon"
                      src={UserCreditTelegramThickWelcomeIcon}
                    />
                  </p>
                </div>
              </>
            ) : (
              <>
                <div
                  style={{
                    opacity: showEmailError ? 1 : 0,
                  }}
                  className="has-error-container has-error-container-mobile"
                >
                  <div class="has-error custom-form-error form-text">
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
                    onClick={handleGoToReferralPassThrough}
                    ref={submitRef}
                    className={`new-auth-content-button ${
                      validateEmail(email) && !isMobileState
                        ? "new-auth-content-button--hover"
                        : ""
                    }`}
                  >
                    Sign up
                  </button>
                </div>
                <div className="new-auth-content-bottom-cta-holder new-auth-content-bottom-cta-holder-mobile">
                  <p
                    onClick={() => {
                      toggleModal("login");
                    }}
                    className="new-auth-content-bottom-cta new-auth-content-bottom-cta--mobile  text-center ml-2 mr-2"
                  >
                    Already have an account?
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
        {/* </div> */}
      </Modal.Body>
    </Modal>
  );
};

export default SignUpMobile;
