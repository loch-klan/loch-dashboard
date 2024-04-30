import React, { useState } from "react";
import PropTypes from "prop-types";
import { Image } from "react-bootstrap";

import {
  TransactionHistoryPageBack,
  TransactionHistoryPageNext,
} from "../AnalyticsFunctions";
import { getCurrentUser } from "../ManageToken";
import {
  SmartMoneyPaginationArrowLeftIcon,
  SmartMoneyPaginationArrowRightIcon,
} from "../../assets/images/icons";
import "./_smartMoneyPagination.scss";
import DropDown from "../../app/common/DropDown";
import { mobileCheck } from "../ReusableFunctions";

const SmartMoneyPagination = (props) => {
  React.useEffect(() => {
    var pageNo = document.getElementById("pageNo");
    if (pageNo) {
      pageNo.value = props.page;
    }
  }, [props.page]);

  const [input, setInput] = React.useState(props.page);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onSubumit(props);
    }
  };
  const onSubumit = (props) => {
    if (!props.smartMoneyBlur) {
      if (props.onPageChange) {
        props.onPageChange();
      }
      var pageNo = document.getElementById("pageNo");
      if (input <= 0) {
        const params = new URLSearchParams(props.location.search);
        params.set("p", 0);
        props.history.push(`${props.history.location.pathname}?${params}`);
        pageNo.value = 1;
      } else if (input < props.pageCount) {
        const params = new URLSearchParams(props.location.search);
        params.set("p", input - 1);
        props.history.push(`${props.history.location.pathname}?${params}`);
      } else {
        const params = new URLSearchParams(props.location.search);
        params.set("p", props.pageCount - 1);
        props.history.push(`${props.history.location.pathname}?${params}`);
        pageNo.value = props.pageCount;
      }
    } else {
      if (props.openSignInOnclickModal) {
        props.openSignInOnclickModal();
      }
    }
  };

  const onLeftClick = (props) => {
    if (!props.smartMoneyBlur) {
      if (props.onPageChange) {
        props.onPageChange();
      }
      var pageNo = document.getElementById("pageNo");
      //  TransactionHistoryPageBack({
      //    session_id: getCurrentUser().id,
      //    email_address: getCurrentUser().email,
      //    page_no: pageNo,
      //  });
      // console.log("back", pageNo)
      if (props.noUrl) {
        props.loadData(props.page - 1);
      } else {
        if (props.page > 1) {
          const params = new URLSearchParams(props.location.search);
          params.set("p", props.page - 2);
          props.history.push(`${props.history.location.pathname}?${params}`);
          // props.loadData(props.page - 1);
          pageNo.value = props.page - 1;
        }
      }
    } else {
      if (props.openSignInOnclickModal) {
        props.openSignInOnclickModal();
      }
    }
  };

  const onNextClick = (props) => {
    if (!props.smartMoneyBlur) {
      if (props.onPageChange) {
        props.onPageChange();
      }
      var pageNo = document.getElementById("pageNo");
      // TransactionHistoryPageNext({
      //   session_id: getCurrentUser().id,
      //   email_address: getCurrentUser().email,
      //   page_no: pageNo,
      // });
      // console.log("next", pageNo);
      if (props.noUrl) {
        props.loadData(props.page + 1);
      } else {
        if (props.page < props.pageCount) {
          const params = new URLSearchParams(props.location.search);
          params.set("p", props.page);
          props.history.push(`${props.history.location.pathname}?${params}`);
          // props.loadData(props.page + 1);
          pageNo.value = props.page + 1;
        }
      }
    } else {
      if (props.openSignInOnclickModal) {
        props.openSignInOnclickModal();
      }
    }
  };
  const [isLeftLogoLoaded, setIsLeftLogoLoaded] = useState(false);
  const [isRightLogoLoaded, setIsRightLogoLoaded] = useState(false);
  const leftLogoLoadingComplete = () => {
    setIsLeftLogoLoaded(true);
  };
  const rightLogoLoadingComplete = () => {
    setIsRightLogoLoaded(true);
  };
  if (mobileCheck()) {
    return (
      <div
        className="mobileSmartMoneyPagingation input-noshadow-dark"
        style={props.style}
      >
        <div className="smartMoneyPaginationContainer ">
          <div
            className={`smartMoneyPaginationArrowContainer ${
              props.page === 1
                ? "smartMoneyPaginationArrowContainerDisabled"
                : ""
            }`}
            onClick={() => onLeftClick(props)}
          >
            <Image
              src={SmartMoneyPaginationArrowLeftIcon}
              className={"smartMoneyPaginationArrow"}
              style={{
                opacity: isLeftLogoLoaded ? 1 : 0,
              }}
              onLoad={leftLogoLoadingComplete}
            />
          </div>
          <div className="inter-display-medium f-s-14 input-noshadow-dark input-hover-states">
            <input
              className="smartMoneyPaginationContainerInput"
              type="number"
              name="pagenumber"
              id="pageNo"
              defaultValue={props.page}
              onChange={(event) => {
                setInput(event.target.value);
              }}
              onKeyDown={handleKeyDown}
            />
            <span className="smartMoneyPaginationOfTxt">of</span>
            {props.pageCount}
          </div>
          <div
            className={`smartMoneyPaginationArrowContainer ${
              props.page === props.pageCount
                ? "smartMoneyPaginationArrowContainerDisabled"
                : ""
            }`}
            onClick={() => onNextClick(props)}
          >
            <Image
              src={SmartMoneyPaginationArrowRightIcon}
              className={"smartMoneyPaginationArrow"}
              style={{
                opacity: isRightLogoLoaded ? 1 : 0,
              }}
              onLoad={rightLogoLoadingComplete}
            />
          </div>
        </div>
      </div>
    );
  }
  const changePageLimitPass = (res) => {
    if (!props.smartMoneyBlur) {
      if (props.changePageLimit) {
        props.changePageLimit(res);
      }
    } else {
      if (props.openSignInOnclickModal) {
        props.openSignInOnclickModal();
      }
    }
  };
  return (
    <div className="smartMoneyPaginationAndLimitSelectorContainer">
      <div className="smartMoneyPaginationAndLimitSelectorChild">
        {/* {props.smartMoneyBlur ? (
          <div className="smartMoneyPaginationAndLimitSelectorChildCover" />
        ) : null} */}
        {!props.isMobile ? (
          <div className="inter-display-medium f-s-14 smartMoneyLimitSelectorContainer">
            {!props.hidePaginationRecords ? (
              <>
                <div className="smartMoneyLimitSelectorTxts">Show:</div>

                <DropDown
                  class="smartMoneyLimitSelectorInput"
                  list={[10, 50, 100]}
                  onSelect={changePageLimitPass}
                  title={props.pageLimit}
                  activetab={props.pageLimit}
                />

                <div className="smartMoneyLimitSelectorTxts">Records</div>
              </>
            ) : null}
          </div>
        ) : null}
        <div className="smartMoneyPaginationContainer">
          <div
            className={`smartMoneyPaginationArrowContainer ${
              props.page === 1
                ? "smartMoneyPaginationArrowContainerDisabled"
                : ""
            }`}
            onClick={() => onLeftClick(props)}
          >
            <Image
              src={SmartMoneyPaginationArrowLeftIcon}
              className={"smartMoneyPaginationArrow"}
            />
          </div>
          <div className="inter-display-medium f-s-14 input-noshadow-dark input-hover-states">
            <input
              type="number"
              name="pagenumber"
              id="pageNo"
              defaultValue={props.page}
              onChange={(event) => {
                setInput(event.target.value);
              }}
              onKeyDown={handleKeyDown}
            />
            <span className="smartMoneyPaginationOfTxt">of</span>
            {props.pageCount}
          </div>
          <div
            className={`smartMoneyPaginationArrowContainer ${
              props.page === props.pageCount
                ? "smartMoneyPaginationArrowContainerDisabled"
                : ""
            }`}
            onClick={() => onNextClick(props)}
          >
            <Image
              src={SmartMoneyPaginationArrowRightIcon}
              className={"smartMoneyPaginationArrow"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

SmartMoneyPagination.propTypes = {
  page: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
  loadData: PropTypes.func,
};
export default SmartMoneyPagination;
