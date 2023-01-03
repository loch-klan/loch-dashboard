import React from 'react'
import { Image } from 'react-bootstrap'
import ArrowRight from '../../assets/images/icons/ArrowRight.svg'
import { TitleAssetValueHover, TransactionHistoryHover } from '../../utils/AnalyticsFunctions';
import { getCurrentUser } from '../../utils/ManageToken';
export const GraphHeader = (props) => {
  return (
    <div className="graph-header">
      <div className="header">
        <h4
          className={`inter-display-semi-bold f-s-16 lh-19 m-b-4 ${props.handleClick ? "active-pointer" : ""}`}
          onClick={props.handleClick}
          onMouseEnter={() =>
          {
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
}
          }
        >
          {props.title} {props.isArrow ? <Image src={ArrowRight} /> : ""}
        </h4>
        <p className="inter-display-medium f-s-13 lh-16 m-b-26 grey-ADA ">
          {props.subtitle}
        </p>
      </div>
    </div>
  );
}
