import React from "react";

import { BellOffIcon, BellAssetIcon } from "../../assets/images/icons";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import {
  AssetValueEmailNotifyClicked,
  TopAssetValueEmailNotifyClicked,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";

const SwitchButton = (props) => {
  let obj = JSON.parse(localStorage.getItem("assetValueLoader"));
  let isChecked = props?.isTopAccount ? obj.topaccount : obj.me;
  const handleToggle = () => {
    if (!isChecked) {
      props.handleEmail();
    }
    props?.isTopAccount
      ? TopAssetValueEmailNotifyClicked({
          session_id: getCurrentUser().id,
        })
      : AssetValueEmailNotifyClicked({
          session_id: getCurrentUser().id,
        });
  };

  let text = (
    <>
      Don’t worry, we’re still loading <br />
      all of your data. <br />
      <br />
      <span className="grey-CAC m-t-04">
        {isChecked
          ? "You'll be notified when it's done."
          : "Get notified when it’s done."}
      </span>
    </>
  );

  return (
    <CustomOverlay
      position="top"
      isIcon={false}
      isInfo={true}
      isText={true}
      text={text}
      className={"pod-width"}
    >
      <div className="custom-switch">
        <label className="switch">
          <input type="checkbox" checked={isChecked} onChange={handleToggle} />
          <span className={`slider ${isChecked ? "checked" : ""}`}>
            <img
              src={isChecked ? BellAssetIcon : BellOffIcon}
              alt="SwitchImage"
              className="switch-image"
            />
          </span>
        </label>
      </div>
    </CustomOverlay>
  );
};

export default SwitchButton;
