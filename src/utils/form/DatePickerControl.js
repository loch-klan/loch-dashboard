import React from "react";
// import { Calendar } from 'react-date-range';
import { Calendar } from "react-calendar";
import { CustomModal } from "../../app/common";
import { format } from "date-fns";
import { Image } from "react-bootstrap";
import dateIcon from "../../assets/images/icons/date-icon.svg";

const DatePickerControl = (props) => {
  const [showModal, setShowModal] = React.useState(false);

  const handleSelect = (date) => {
    props.valueLink.requestChange(date);
    setShowModal(false);
  };

  const {
    valueLink,
    placeholder,
    disabled = false,
    minDate,
    maxDate,
    showDateIcon = true,
    nextLabel,
    next2Label,
    prevLabel,
    prev2Label,
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
        value={valueLink.value ? format(valueLink.value, "MM-dd-yyyy") : ""}
      />
      {showDateIcon && <Image src={dateIcon} className="date-icon" />}
      <CustomModal
        modalClass="date-picker-control-modal modal-dialog-centered"
        show={showModal}
        onHide={() => setShowModal(false)}
        // title={"Select Date"}
      >
        {/* <Calendar
          // date={valueLink.value || null}
          className={"calendar-select inter-display-medium f-s-13 lh-16"}
          onChange={handleSelect}
          minDate={minDate}
          maxDate={maxDate}
          showMonthAndYearPickers={false}
          weekStartsOn={1}
          showYearArrow={true}
          // showYearDropdown ={true}
          // showMonthDropdown ={false}

        /> */}
        <Calendar
          date={valueLink.value || null}
          className={"calendar-select inter-display-medium f-s-13 lh-16"}
          onChange={handleSelect}
          minDate={minDate}
          maxDate={maxDate}
          defaultValue={valueLink.value}
          nextLabel={nextLabel}
          next2Label={next2Label}
          prevLabel={prevLabel}
          prev2Label={prev2Label}
        />
      </CustomModal>
    </>
  );
};
export default DatePickerControl;
