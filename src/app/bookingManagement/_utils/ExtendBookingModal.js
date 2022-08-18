import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Image, Button, FormGroup } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import noBike from '../../../assets/images/no-bike.png';
import { CustomModal } from '../../common';
import { extendOrderApi, getExtendBookingPricingApi } from '../Api';
import moment from 'moment';
import {PaymentType} from '../../../utils/Constant';

const ExtendBookingModal = props => {
  const [extendDate, setExtendDate] = useState(new Date(props.bookingDetails.endDate));
  const [status, toggleStatus] = useState(false);
  const [extendInfo, handleExtend] = useState(null);

  const handleExtendBooking = () => {
    getExtendBookingPricingApi(extendDate, props, toggleStatus, handleExtend);
  }

  const handleExtendPayment = (paymentMode) =>{
    const data = new URLSearchParams();
    data.append('order_id', props.orderId);
    data.append('end_datetime', moment(extendDate).format("DD-MM-YYYY hh:mm"));
    data.append('payment_mode', paymentMode);
    extendOrderApi(data,props);
  }

  return (
    <CustomModal
        show={props.show}
        onHide={props.handleClose}
        title={extendInfo ? "" : "Extend Booking"}
        modalClass={"change-password extend"}
      >
        <div className='extend-booking-modal'>
          {
            status
            ?
            <div className='no-bike-wrapper'>
              <Image src={noBike} className='' />
              <h3 className='red-hat-display-bold f-s-24 lh-30'>Opps!</h3>
              <p className='red-hat-display-medium f-s-14 h-22 op-6'>Vechicle not availble for extention</p>
              <Button className={`btn black-btn`} onClick={props.handleClose}>Okay</Button>
            </div>
            :
            extendInfo
            ?
            <div className='extend-booking-payment'>
              <p className='red-hat-display-regular f-s-18 lh-27'>Time extended</p>
              <h3 className='red-hat-display-black f-s-30 lh-38'>{extendInfo.booking_time} hrs</h3>
              <p className='red-hat-display-regular f-s-18 lh-27 op-6'>Customer will get an extra {extendInfo.allowed_kms} kms for {extendInfo.booking_time} hrs</p>
              <div className='extend-info'>
                <div>
                  <h6 className='red-hat-display-medium f-s-16 lh-24 blue-407'>Previous return time</h6>
                  <p className='red-hat-display-regular f-s-14 lh-21 op-6'>{moment(props.bookingDetails.endDate).format("Do MMMM YYYY, h:mm a")}</p>
                </div>
                <span></span>
                <div>
                  <h6 className='red-hat-display-medium f-s-16 lh-24 green-40B'>Updated return time</h6>
                  <p className='red-hat-display-semibold f-s-14 lh-21 '>{moment(extendInfo.extendDate).format("Do MMMM YYYY, h:mm a")}</p>
                </div>
              </div>
              <div className='pricing'>
                    <h6 className='red-hat-display-medium f-s-16 lh-24'>Base fare</h6>
                    <p className='red-hat-display-regular f-s-14 lh-21 op-6'>₹{extendInfo.booking_amount}</p>
                  </div>
                  <div className='pricing'>
                    <h6 className='red-hat-display-medium f-s-16 lh-24'>GST</h6>
                    <p className='red-hat-display-regular f-s-14 lh-21 op-6'>₹{extendInfo.total_tax_amount}</p>
                  </div>
                  <hr/>
                  <div className='pricing'>
                    <h6 className='red-hat-display-medium f-s-16 lh-24'>Total fare</h6>
                    <p className='red-hat-display-regular f-s-14 lh-21 op-6'>₹{extendInfo.total_amount}</p>
                  </div>
                  <Button className={`btn secondary-btn`} onClick={()=>handleExtendPayment(PaymentType.OFFLINE)}>Confirm & Take Offline Payment</Button>
                  <Button className={`btn black-btn`} onClick={()=>handleExtendPayment(PaymentType.PAYMENTLINK)}>Confirm & Send Payment Link</Button>
            </div>
            :
            <>
          <div className=''>
            <FormGroup
              controlId="scheduleDate"
              className="date-group"
            >
              <DatePicker
                minDate={new Date(props.bookingDetails.endDate)}
                selected={extendDate}
                onChange={(date) => setExtendDate(date)}
                showTimeSelect
                timeFormat="HH:mm aa"
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="MMMM d, yyyy h:mm aa"
                inline
              />
            </FormGroup>
          </div>
          <Button className={`btn black-btn`} onClick={() => handleExtendBooking()}>Confirm</Button>
          </>
        }
        </div>
    </CustomModal>
  );
};
ExtendBookingModal.propTypes = {
  // getPosts: PropTypes.func
};
export default ExtendBookingModal;