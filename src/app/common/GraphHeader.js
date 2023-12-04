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
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import {
  ArrowDownLeftSmallIcon,
  ArrowUpRightSmallIcon,
  ExportIcon,
} from "../../assets/images/icons";
export const GraphHeader = (props) => {
  const [showDust, setDust] = useState(true);

  const toggleDust = () => {
    setDust(!showDust);

    setTimeout(() => {
      props.handleDust(showDust);
    }, 200);
  };
  const handleClickPass = () => {
    if (props.disableOnLoading) {
      if (!props.isLoading && props.handleClick) {
        props.handleClick();
      }
    } else {
      if (props.handleClick) {
        props.handleClick();
      }
    }
  };
  return (
    <div className="graph-header">
      <div
        style={{
          overflow: "hidden",
        }}
        className="header"
      >
        <div
          style={{
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            className={`${props.noSubtitleBottomPadding ? "" : "m-b-26"}`}
          >
            <div
              style={{
                overflow: "hidden",
              }}
            >
              <h4
                className={`inter-display-semi-bold f-s-16 lh-19 m-b-4 ${
                  props.handleClick &&
                  !(props.disableOnLoading && props.isLoading)
                    ? "active-pointer"
                    : ""
                }`}
                style={{
                  opacity: props.disableOnLoading && props.isLoading ? 0.5 : 1,
                  cursor:
                    props.disableOnLoading && props.isLoading
                      ? "default"
                      : "pointer",
                }}
                onClick={handleClickPass}
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
              <p
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                className={`inter-display-medium f-s-13 lh-16 grey-ADA`}
              >
                {props.subtitle}
              </p>
            </div>
            {props.ExportBtn ? (
              <div
                onClick={props.handleExportModal}
                className="pageHeaderShareContainer"
                style={{
                  marginRight: props.ShareBtn ? "0.5rem" : "",
                }}
              >
                <Image className="pageHeaderShareImg" src={ExportIcon} />
                <div className="inter-display-medium f-s-13 lh-19 pageHeaderShareBtn">
                  Export
                </div>
              </div>
            ) : null}
          </div>
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
              className={`inter-display-medium f-s-15 lh-15 grey-313 content`}
            >
              <Image
                className="mr-2"
                style={{
                  height: "1.5rem",
                  width: "1.5rem",
                }}
                src={
                  props.totalPercentage < 0
                    ? ArrowDownLeftSmallIcon
                    : ArrowUpRightSmallIcon
                }
              />
              {Math.abs(props.totalPercentage) + "%"}{" "}
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
