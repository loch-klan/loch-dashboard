import React from 'react';
import { Image, Modal } from "react-bootstrap";
import closeIcon from '../../assets/images/icons/close-icon.svg';

const CustomModal = ({ show, onHide, title, children, modalClass = null }) => {
  return (
    <Modal show={show} onHide={onHide} dialogClassName={`custom-modal ${modalClass}`}>
      {
        title &&
        <Modal.Header>
          <Modal.Title className='red-hat-display-bold f-s-20'>{title}</Modal.Title>
          <Image src={closeIcon} className='close-icon' onClick={onHide} />
        </Modal.Header>
      }
      <Modal.Body>
        {children}
      </Modal.Body>
    </Modal>
  );
};
export default CustomModal;