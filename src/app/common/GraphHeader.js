import React, { useState } from "react";
import { Button, Image } from "react-bootstrap";
import ArrowRight from "../../assets/images/icons/ArrowRight.svg";
import {
  TitleAssetValueHover,
  TransactionHistoryHover,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import LinkIcon from "../../assets/images/icons/link.svg";
import arrowUpRight from "../../assets/images/icons/arrowUpRight.svg";
import arrowDownRight from "../../assets/images/icons/arrow-down-right.svg";
export const GraphHeader = (props) => {
  const [showDust, setDust] = useState(false);

  const toggleDust = () => {
    setDust(!showDust);

    setTimeout(() => {
      props.handleDust(showDust);
    }, 200);
  };
  return (
    <div className="graph-header">
      <div className="header">
        <div>
          <h4
            className={`inter-display-semi-bold f-s-16 lh-19 m-b-4 ${
              props.handleClick ? "active-pointer" : ""
            }`}
            onClick={props.handleClick}
            onMouseEnter={() => {
              if (props.isAnalytics === "Asset Value") {
                TitleAssetValueHover({
                  session_id: getCurrentUser().id,
                  email_address: getCurrentUser().email,
                });
              }

              if (props.isAnalytics === "Transaction Table") {
                TransactionHistoryHover({
                  session_id: getCurrentUser().id,
                  email_address: getCurrentUser().email,
                });
              }
            }}
          >
            {props.title} {props.isArrow ? <Image src={ArrowRight} /> : ""}
          </h4>
          <p className="inter-display-medium f-s-13 lh-16 m-b-26 grey-ADA ">
            {props.subtitle}
          </p>
        </div>

        {/* {props.loader && (
          <h5
            className="inter-display-medium f-s-10 lh-12"
          
          >
            Don't worry we're still loading all your data
          </h5>
        )} */}
        <div className="show-percentage-cost-basis">
          {props.ishideDust && (
            <div
              className="inter-display-medium f-s-15 lh-15 cp grey-ADA dust-style m-r-12"
              onClick={toggleDust}
            >
              {showDust
                ? "Reveal dust (less than $1)"
                : "Hide dust (less than $1)"}
            </div>
          )}
          {props.isGainLoss && (
            <div
              className={`inter-display-medium f-s-15 lh-15 grey-313 content ${
                props.totalPercentage >= 0 ? "inc" : "dec"
              }`}
            >
              <Image
                src={props.totalPercentage >= 0 ? arrowUpRight : arrowDownRight}
                className="m-r-5"
                style={{ position: "relative", top: "-2px" }}
              />
              {props.totalPercentage + "%"}{" "}
              {props.totalPercentage == 0.0
                ? "No Change"
                : props.totalPercentage > 0
                ? "Increase"
                : "Decrease"}
            </div>
          )}
        </div>

        {props.isConnect && (
          <Button className="grey-btn" onClick={props.handleExchange}>
            <Image src={LinkIcon} /> Connect exchanges
          </Button>
        )}
      </div>
    </div>
  );
};
