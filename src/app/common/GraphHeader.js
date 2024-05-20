import React from "react";
import { Button, Form, Image } from "react-bootstrap";
import {
  ArrowDownLeftSmallIcon,
  ArrowUpRightSmallIcon,
  ExportIcon,
} from "../../assets/images/icons";
import ArrowRight from "../../assets/images/icons/ArrowRight.svg";
import LinkIcon from "../../assets/images/icons/link.svg";
import {
  TitleAssetValueHover,
  TransactionHistoryHover,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import { openSignInModalFromAnywhere } from "../../utils/ReusableFunctions";
export const GraphHeader = (props) => {
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
  const exprotPassThrough = () => {
    const isLochUser = JSON.parse(window.localStorage.getItem("lochUser"));
    if (isLochUser && isLochUser.email) {
      if (props.handleExportModal) {
        props.handleExportModal();
      }
    } else {
      openSignInModalFromAnywhere();
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
                onClick={exprotPassThrough}
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
              onClick={props.handleDust}
              className="pageHeaderShareContainer"
              style={{ marginRight: props.ShareBtn ? "0.4rem" : "" }}
            >
              <div className="smaller-toggle inter-display-medium f-s-13 pageHeaderShareBtn">
                <Form.Check
                  type="switch"
                  checked={props.showDust}
                  // onChange={(e) => {
                  //   this.setState({
                  //     switchselected: e.target.checked,
                  //   });
                  //   if (this.props.setSwitch) {
                  //     this.props.setSwitch();
                  //   }
                  // }}
                  label={
                    props.showDust
                      ? "Reveal dust (less than $1)"
                      : "Hide dust (less than $1)"
                  }
                />
              </div>
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
