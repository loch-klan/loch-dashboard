// TradingViewWidget.jsx
import React, { memo, useState } from "react";
import { Image } from "react-bootstrap";
import "./_dexScreenerAlertBlock.scss";
import {
  DexScreenerAlertCrossIcon,
  DexScreenerAlertPencilIcon,
  DexScreenerAlertRoundArrowIcon,
} from "../../../assets/images/icons";
import moment from "moment";
import { mobileCheck } from "../../../utils/ReusableFunctions";

function DexScreenerAlertBlock(props) {
  const { alertItem, index } = props;
  const [isMobile] = useState(mobileCheck());
  return (
    <div
      key={index}
      className={`ps-not-et-block ${isMobile ? "ps-not-et-block-mobile" : ""}`}
    >
      {props.isFullPage ? (
        <div className="ps-not-et-block-name-time">
          <div className="ps-not-et-block-nt-name">
            <div className="ps-not-et-block-ntn-icon">
              {alertItem.tokenIcon ? (
                <Image
                  className="ps-not-et-block-ntn-icon-image"
                  src={alertItem.tokenIcon}
                />
              ) : null}
            </div>
            <div className="ps-not-et-block-ntn-name">
              {alertItem.tokenName}
            </div>
            <div className="ps-not-et-block-ntn-token">
              {alertItem.tokenSymbol}
            </div>
          </div>
          <div className="ps-not-et-block-nt-time">
            Created on{" "}
            <div className="ps-not-et-block-nt-time-dark">
              {moment(alertItem.dateTimeCreated).format("DD/MM/YY h:mm A")}
            </div>
          </div>
        </div>
      ) : null}
      <div className="ps-not-et-block-data">
        <div className="ps-not-et-bd-price">
          <div className="ps-not-et-bd-price-detail">
            When the price{" "}
            <span className="ps-not-et-bd-price-detail-type">
              {alertItem.alertType}
            </span>
          </div>
          <div className="ps-not-et-bd-price-amount">{alertItem.amount}</div>
        </div>
        <div className="ps-not-et-bd-active-disable">
          <div
            className={`ps-not-et-bd-block ps-not-et-bd-block-left ${
              alertItem.isActive ? "ps-not-et-bd-block-active" : ""
            }`}
          >
            {alertItem.isActive ? (
              <div className="ps-not-et-bd-circle ps-not-et-bd-circle-green" />
            ) : null}
            <div className="ps-not-et-bd-text">Active</div>
          </div>
          <div
            className={`ps-not-et-bd-block ps-not-et-bd-block-right ${
              !alertItem.isActive ? "ps-not-et-bd-block-disabled" : ""
            }`}
          >
            {!alertItem.isActive ? (
              <div className="ps-not-et-bd-circle ps-not-et-bd-circle-red" />
            ) : null}
            <div className="ps-not-et-bd-text">Disable</div>
          </div>
        </div>
      </div>
      <div className="ps-not-et-block-footer-container">
        <div className="ps-not-et-block-footer">
          <Image
            className="ps-not-et-block-footer-icon"
            src={DexScreenerAlertRoundArrowIcon}
          />
          <Image
            className="ps-not-et-block-footer-icon"
            src={DexScreenerAlertPencilIcon}
          />
          <Image
            className="ps-not-et-block-footer-icon"
            src={DexScreenerAlertCrossIcon}
          />
        </div>
        {props.isFullPage ? (
          <div
            className={`ps-not-et-block-footer-last-time ${
              alertItem.dateTimeTriggred
                ? "ps-not-et-block-footer-last-time-active"
                : ""
            }`}
          >
            <div className="ps-not-et-block-flt-title">Last triggered</div>
            <div className="ps-not-et-block-flt-time">
              {alertItem.dateTimeTriggred
                ? moment(alertItem.dateTimeTriggred).format("DD/MM/YY h:mm A")
                : "None"}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default memo(DexScreenerAlertBlock);
