import React from 'react';
import { Calendar } from 'react-date-range';
import { CustomModal } from '../../app/common';
import { format } from 'date-fns';
import { Image } from "react-bootstrap";
import dateIcon from '../../assets/images/icons/date-icon.svg';

const DatePickerControl = props => {

  const [showModal, setShowModal] = React.useState(false);

  const handleSelect = (date) => {
    props.valueLink.requestChange(date);
    setShowModal(false);
  }

  const {
    valueLink,
    placeholder,
    disabled = false,
    minDate,
    maxDate,
    showDateIcon = true,
  } = props;

  return (
    <>
      <input
        placeholder={placeholder}
        type="text"
        readOnly="readonly"
        disabled={disabled}
        className="form-control date-picker-control"
        onClick={() => setShowModal(true)}
        value={valueLink.value ? format(valueLink.value, 'dd-MM-yyyy') : ""} />
      {showDateIcon && <Image src={dateIcon} className='date-icon' />}
      <CustomModal
        modalClass="date-picker-control-modal"
        show={showModal}
        onHide={() => setShowModal(false)}
        title={"Select Date"}
      >
        <Calendar
          date={valueLink.value || null}
          onChange={handleSelect}
          minDate={minDate}
          maxDate={maxDate}
        />
      </CustomModal>
    </>
  );
};
export default DatePickerControl;