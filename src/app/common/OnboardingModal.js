import React from 'react';
import { Image, Modal, Button } from "react-bootstrap";
import closeIcon from '../../assets/images/icons/close-icon.svg';
import bgimg from "../../image/Frame.png";
import "../../assets/scss/onboarding/_onboarding.scss";
import walleticon from "../../image/Vector-wallet.svg";
import infoicon from "../../image/Vector-info.svg";
import { InfoBox } from '@react-google-maps/api';
import deleteicon from "../../image/Vector-delete.svg";
import plusicon from "../../image/Vector-plus.svg";

const OnboardingModal = ({ show, onHide, title, showImage, children, modalClass = null }) => {
    return (
        <Modal show={show} onHide={onHide} dialogClassName={`${modalClass}`} keyboard={false} size='lg' backdrop="static" centered
            aria-labelledby="contained-modal-title-vcenter" >
            {
                title &&
                <Modal.Header>
                    {/* <Modal.Title>{title}</Modal.Title> */
                    <Modal.Title>
                        <img className='ob-modal-title-icon' src={walleticon}/>
                        <h4 className='ob-modal-title-h4 inter-display-medium'>Welcome to Loch</h4>
                        <p className='ob-modal-title-p inter-display-medium'>Add wallet address(es) to get started</p>
                        </Modal.Title>}
                        
                    {/* {showImage && <Image src={bgimg} />} */}
                    {/* <div className="modal-header-title">
                            <img className='ob-modal-title-icon' src={walleticon}/>
                            <h1 className='ob-modal-title-h1'>Welcome to Loch</h1>
                            <h4 className='ob-modal-title-p'>Add wallet address(es) to get started</h4>
                        </div> */}
                </Modal.Header>
            }
            <Modal.Body>
                {/* {children} */}
                <div className='ob-modal-body-1'>
                    <img className='ob-modal-body-del' src={deleteicon}/>
                    <input className='ob-modal-body-text inter-display-regular' placeholder='Paste your wallet address here'/>
                </div>
                <div className='ob-modal-body-2'>
                    <Button className="ob-modal-body-add-btn inter-display-medium">
                            <img src={plusicon}/> Add another
                    </Button>
                </div>
                
                <div className='ob-modal-body-btn'>
                    <Button className="ob-modal-body-secondary-btn inter-display-semi-bold">
                        Preview demo instead
                    </Button>
                    <Button className="ob-modal-body-black-btn black-btn inter-display-semi-bold" >
                        Go
                    </Button>
                </div>
                <div className="ob-modal-body-info">
                    <h4>Already have an account? <a href=''>Sign in</a></h4>

                    <p className='inter-display-medium'>Don't worry. All your information remains private and anonymous. <img src={infoicon} title="We do not link wallet addresses back to you unless you explicitly give us your email or phone number. "/> </p>

                </div>
                
                    
                
                
            </Modal.Body>
        </Modal>
    );
};
export default OnboardingModal;