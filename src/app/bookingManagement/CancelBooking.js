import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Image, Button, Modal } from 'react-bootstrap';
// import { cancelBookingApi } from '../Api';
import { CustomModal } from "../common";

const CancelBooking = props => {
    const [reason, setReason] = useState("");

    const onChangeValue = (event) => {
        setReason(event.target.value);
    }

    const handleCancelOrder = () => {
        props.cancelOrder(reason);
    }

    return (
        <CustomModal
            show={props.show}
            onHide={props.handleClose}
            title={"Please select reason for cancellation"}
            modalClass={"change-password"}
        >
            <div className=''>
                <div onChange={(e) => onChangeValue(e)}>
                    <div className='radio-input'>
                        <input type="radio" name="reason" value="Changed my plan" /> <span className='red-hat-display-regular f-s-16 lh-24'>Changed Customer plan</span>
                    </div>
                    <div className='radio-input'>
                        <input type="radio" name="reason" value="Franchisee charging extra" /> <span className='red-hat-display-regular f-s-16 lh-24'>Bike damaged</span>
                    </div>
                    <div className='radio-input'>
                        <input type="radio" name="reason" value="Bike not available at location" /> <span className='red-hat-display-regular f-s-16 lh-24'>Bike not available at location</span>
                    </div>
                </div>

                <div className="submit-wrapper">
                    <Button className={`btn black-btn`} onClick={() => reason && handleCancelOrder()}>
                        Yes, Cancel Booking
                    </Button>
                </div>
                <div className="text-btn">
                    <Button variant="light" onClick={props.handleClose}>Don't Cancel</Button>
                </div>
            </div>
        </CustomModal>
    );
};

CancelBooking.propTypes = {
    // getPosts: PropTypes.func
};

export default CancelBooking;