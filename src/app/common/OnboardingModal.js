import React from 'react';
import { Image, Modal } from "react-bootstrap";

const OnboardingModal = ({ show, onHide, title, icon, subTitle, children, modalClass = null }) => {
    return (
        <Modal
            show={show}
            onHide={onHide}
            dialogClassName={"onboarding-modal"}
            keyboard={false}
            size='lg'
            backdrop="static"
            centered
            aria-labelledby="contained-modal-title-vcenter"
        >
            {
                title &&
                <Modal.Header>
                    <Modal.Title>
                        <Image className='ob-modal-title-icon' src={icon} />
                        <h1 className='inter-display-medium f-s-31 lh-37 white'>{title}</h1>
                        <p className='inter-display-medium f-s-13 lh-16 white op-.8'>{subTitle}</p>
                    </Modal.Title>
                </Modal.Header>
            }
            <Modal.Body>
                {children}
            </Modal.Body>
        </Modal>
    );
};
export default OnboardingModal;