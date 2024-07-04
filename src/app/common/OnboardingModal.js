import React, { useState } from "react";
import { Image, Modal } from "react-bootstrap";
import backIcon from "../../image/back-icon.svg";
import { mobileCheck } from "../../utils/ReusableFunctions";

const OnboardingModal = ({
  show,
  onHide,
  title,
  icon,
  subTitle,
  isSignInActive,
  handleBack,
  children,
  modalClass = null,
  modalAnimation,
}) => {
  const [isMobile] = useState(mobileCheck());
  return (
    <Modal
      show={show}
      onHide={onHide}
      dialogClassName={"onboarding-modal"}
      keyboard={false}
      size="lg"
      backdrop="static"
      centered
      aria-labelledby="contained-modal-title-vcenter"
      animation={modalAnimation !== undefined ? modalAnimation : true}
      className={`${isMobile ? "" : "zoomedElements"}`}
    >
      {title && (
        <Modal.Header>
          <Modal.Title>
            {isSignInActive ? (
              <div className="signin-header" onClick={handleBack}>
                <Image className="back-icon cp" src={backIcon} />
              </div>
            ) : null}
            {isSignInActive ? (
              <div className="ob-sign-modal">
                <div className="signin-icon">
                  <Image src={icon} />
                </div>
              </div>
            ) : (
              <Image className="ob-modal-title-icon" src={icon} />
            )}
            <h1 className="inter-display-medium f-s-25 lh-31 white">{title}</h1>
            <p className="inter-display-medium f-s-13 lh-16 white op-8">
              {subTitle}
            </p>
          </Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
};
export default OnboardingModal;
