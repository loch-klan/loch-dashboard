import React, { useState } from "react";
import { Button, Image, Modal } from "react-bootstrap";
import alertIcon from "../../assets/images/icons/alert-icon.svg";
import successIcon from "../../assets/images/icons/success-icon.svg";
import { mobileCheck } from "../../utils/ReusableFunctions";
// import closeIcon from "../../assets/images/close.png";

const InformationModal = ({
  infoUpdateStatus,
  type,
  text,
  show,
  handleClose,
  handleArchive,
  errorText,
  actionText,
}) => {
  const typeMap = {
    success: 1,
    warning: 2,
  };
  const [isMobile] = useState(mobileCheck());
  return (
    <Modal
      show={show}
      onHide={handleClose}
      dialogClassName={`info-modal`}
      className={`${isMobile ? "" : "zoomedElements"}`}
    >
      <Modal.Body>
        <div className="info-modal-wrap">
          <div className="icon">
            <Image
              src={typeMap[type] === 1 ? successIcon : alertIcon}
              alt="warning"
              responsive
            />
          </div>
          <div className="content">
            {infoUpdateStatus
              ? "You’ve successfully updated"
              : typeMap[type] === 1
              ? "You’ve successfully added "
              : `Are you sure you want to ${actionText}`}
            <br />
            <span className="dark-card-title-l">{text}</span>
            {errorText && <p className="error-text">{errorText}</p>}
          </div>
          {/* <div className="close" onClick={handleClose}>
            <Image src={closeIcon} className="close-icon" />
          </div> */}
        </div>
        <div className="btn-wrap">
          {typeMap[type] === 2 && (
            <Button onClick={handleArchive} className="btn black-btn">
              YES
            </Button>
          )}
          <Button onClick={handleClose} className="btn secondary-btn">
            {typeMap[type] === 1 ? "OK" : "NO"}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default InformationModal;
