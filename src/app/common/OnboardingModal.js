import React from 'react';
import { Image, Modal } from "react-bootstrap";
import closeIcon from '../../assets/images/icons/close-icon.svg';
import bgimg from "../../image/Frame.png";
import "../../assets/scss/onboarding/_onboarding.scss";
import walleticon from "../../image/Wallet-Icon.png";

const OnboardingModal = ({ show, onHide, title, showImage, children, modalClass = null }) => {
    return (
        <Modal show={show} onHide={onHide} dialogClassName={`custom-modal ${modalClass}`} keyboard={false} size='lg' backdrop="static" centered
            aria-labelledby="contained-modal-title-vcenter" >
            {
                title &&
                <Modal.Header>
                    {/* <Modal.Title>{title}</Modal.Title> */
                    <Modal.Title>
                        
                        </Modal.Title>}
                        
                    {showImage && <Image src={bgimg} />}
                    <div className="modal-header-title">
                            <img className='ob-modal-title-icon' src={walleticon}/>
                            <h1 className='ob-modal-title-h1'>Welcome to Loch</h1>
                            <h4 className='ob-modal-title-p'>Add wallet address(es) to get started</h4>
                        </div>
                </Modal.Header>
            }
            <Modal.Body>
                {/* {children} */}
                <div className="modal-header-body-text">
                    <input type="text" placeholder='Paste your wallet address here'/>
                </div>
                
            </Modal.Body>
        </Modal>
    );
};
export default OnboardingModal;