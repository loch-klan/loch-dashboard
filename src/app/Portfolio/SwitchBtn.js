import React, { useState } from "react";
import BellOffIcon from "../../assets/images/icons/bell-off.svg"
import BellIcon from "../../assets/images/icons/bell-asset.svg";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import { AssetValueEmailNotifyClicked, TopAssetValueEmailNotifyClicked } from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";


const SwitchButton = (props) => {
  // const [isChecked, setIsChecked] = useState(false);
  let obj= JSON.parse(localStorage.getItem("assetValueLoader"));
  let isChecked = props?.isTopAccount ? obj.topaccount:obj.me; 
  const handleToggle = () => {
    // setIsChecked(!isChecked);
    if(!isChecked){
      props.handleEmail()
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
      <span className="grey-CAC m-t-04">Get notified when it’s done.</span>
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
              src={isChecked ? BellIcon : BellOffIcon}
              alt="Switch Image"
              className="switch-image"
            />
          </span>
        </label>
      </div>
    </CustomOverlay>
  );
};

export default SwitchButton;
