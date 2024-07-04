import React, { useState } from "react";
import { Image, Modal } from "react-bootstrap";
import closeIcon from "../../assets/images/icons/close-icon.svg";
import { mobileCheck } from "../../utils/ReusableFunctions";

const CustomModal = ({ show, onHide, title, children, modalClass = null }) => {
  const [isMobile] = useState(mobileCheck());
  return (
    <Modal
      show={show}
      onHide={onHide}
      dialogClassName={`custom-modal ${modalClass} ${
        isMobile ? "" : "zoomedElements"
      }`}
    >
      {title && (
        <Modal.Header>
          <Modal.Title className="inter-display-bold f-s-20">
            {title}
          </Modal.Title>
          <Image src={closeIcon} className="close-icon" onClick={onHide} />
        </Modal.Header>
      )}
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
};
export default CustomModal;
