// TradingViewWidget.jsx
import React, { memo } from "react";
import { Image } from "react-bootstrap";
import {
  DexScreenerHeaderBellIcon,
  DexScreenerHeaderPlusIcon,
} from "../../assets/images/icons";

function DexScreenerHeaderBtns(props) {
  return (
    <div className="ds-ph-btns-container">
      <div onClick={props.showPriceAlertModal} className="ds-ph-btn">
        <Image src={DexScreenerHeaderBellIcon} className="ds-ph-btn-image" />
        <div className="ds-ph-btn-text">Set alerts</div>
      </div>
      <div className="ds-ph-btn">
        <Image src={DexScreenerHeaderPlusIcon} className="ds-ph-btn-image" />
        <div className="ds-ph-btn-text">Add to Watchlist</div>
      </div>
    </div>
  );
}

export default memo(DexScreenerHeaderBtns);
