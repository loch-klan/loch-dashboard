import React, { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import Calendar from "react-calendar";
import OutsideClickHandler from "react-outside-click-handler";
import { FilterIcon } from "../../assets/images/icons";
import { mobileCheck } from "../../utils/ReusableFunctions";

const TableCalendarFilter = (props) => {
  const [todayDate] = useState(new Date());
  const [isCalendar, setIsCalendar] = useState(false);
  const [fromDate, setFromDate] = useState(props.fromDate);
  const [toDate, setToDate] = useState(props.toDate);
  const [isMobile] = useState(mobileCheck());

  useEffect(() => {
    if (props.fromDate && props.toDate) {
      setFromDate(props.fromDate);
      setToDate(props.toDate);
    }
  }, [props.fromDate, props.toDate]);

  const onDateSelect = (date) => {
    if (date && date.length > 0 && props.setFromToFilterDate) {
      setFromDate(date[0]);
      setToDate(date[1]);
    }
  };
  const onApplyClick = () => {
    if (props.setFromToFilterDate) {
      props.setFromToFilterDate("SEARCH_BY_TIMESTAMP_IN", {
        start_date: fromDate,
        end_date: toDate,
      });
      setIsCalendar(false);
    }
  };
  const onClearDate = () => {
    setFromDate(null);
    setToDate(null);
  };
  const hideCalendar = () => {
    setIsCalendar(false);
  };
  const toggleCalendar = () => {
    setIsCalendar(!isCalendar);
  };
  return (
    <OutsideClickHandler onOutsideClick={hideCalendar}>
      <div
        className="filter-image-container"
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          marginRight: "1rem",
        }}
        onClick={toggleCalendar}
      >
        <Image className="filter-image" src={FilterIcon} />
      </div>
      {isCalendar ? (
        <div
          style={{
            transform: isMobile
              ? "translateY(6rem) translateX(-2rem)"
              : "translateY(8rem) translateX(-2rem)",
          }}
          className="intelligenceCalendar"
        >
          <Calendar
            // date={["2024-07-03T18:30:00.000Z", "2024-07-06T18:29:59.999Z"]}
            value={[fromDate, toDate]}
            className={`calendar-select ${
              isMobile ? "mobile-calendar-select" : ""
            } inter-display-medium f-s-13 lh-16`}
            onChange={onDateSelect}
            maxDate={todayDate}
            selectRange
          />
          <div className="intelligenceCalendarConfirmDeny">
            <div
              onClick={onClearDate}
              className="intelligenceCalendarConfirmDenyBtn"
            >
              Clear
            </div>
            <div
              onClick={onApplyClick}
              className="intelligenceCalendarConfirmDenyBtn intelligenceCalendarConfirmDenyBtnApply"
            >
              Apply
            </div>
          </div>
        </div>
      ) : null}
    </OutsideClickHandler>
  );
};
export default TableCalendarFilter;
