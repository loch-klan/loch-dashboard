import React, { useEffect, useState } from "react";
import { Image, Modal } from "react-bootstrap";
import "./_newAuth.scss";
import logo from "./../../../image/Loch.svg";
import { validateEmail } from "../../../utils/validators";
import {
  CheckIcon,
  CloseIconBlack,
  CrossSmartMoneyIcon,
  NewWelcomeLoginCrossIcon,
} from "../../../assets/images/icons";
import { mobileCheck } from "../../../utils/ReusableFunctions";

const Redirect = ({ show, toggleModal }) => {
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
        <div className="new-auth" style={{ padding: "116px 0px" }}>
          <div className="new-auth-content">
            <img
              className="new-auth-content-logo "
              style={{ width: "40px" }}
              src={CheckIcon}
              alt=""
            />
            <div className="new-auth-content-title-holder">
              <h4 className="new-auth-content-title">Success!</h4>
              <p
                className="new-auth-content-subtitle"
                style={{ textAlign: "center" }}
              >
                You’ll receive a verification link in your mailbox.
                <br />
                You can now close this tab.
              </p>
            </div>
            {/* <div className="new-auth-content-input-holder ">
              <button
                ref={submitRef}
                style={{ width: "140px" }}
                className={`new-auth-content-button new-auth-content-button--hover`}
              >
                Ok
              </button>
            </div> */}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Redirect;
