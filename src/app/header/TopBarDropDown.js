import React, { useRef, useState } from "react";
import { Dropdown, Image } from "react-bootstrap";
import OutsideClickHandler from "react-outside-click-handler";
import { toast } from "react-toastify";
import { CopyClipboardIcon } from "../../assets/images";
import { EyeIcon, RoundedGreyArrowDownIcon } from "../../assets/images/icons";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import TopBarDropDownListComp from "./TopBarDropDownListComp";
export default function TopBarDropDown(props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const topbarDropdownToggle = useRef();

  const toggleDropdown = (event) => {
    event.stopPropagation();
    setShowDropdown(!showDropdown);
  };
  const closeDropdown = (event) => {
    if (showDropdown) {
      event.stopPropagation();
      setShowDropdown(false);
    }
  };
  const copyContent = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Copied");
      })
      .catch(() => {
        console.log("something went wrong");
      });
  };
  console.log("fullWalletList ", props.fullWalletList);
  return (
    <div style={props?.relative ? { position: "relative" } : {}}>
      <Dropdown show={showDropdown} className={props.class ? props.class : ""}>
        <Dropdown.Toggle
          id="dropdown-custom-components"
          ref={topbarDropdownToggle}
          className="w-100"
        >
          <div
            ref={props.buttonRef}
            style={{
              paddingLeft: "0rem",
              paddingRight: "1rem",
            }}
            className="topbar-btn topbar-btn-transparent w-100"
            id="address-button"
          >
            <div className="topBarWalletChainEyeAmountContainer">
              <Image
                className={`topBarWalletChain ${
                  props.totalWallets && props.totalWallets === 1
                    ? "topBarWalletChainSingle"
                    : ""
                }`}
                src={EyeIcon}
              />
              {props.fullWalletList && props.fullWalletList.length > 1 ? (
                <span className="topBarWalletTotalWallets">
                  {props.fullWalletList ? props.fullWalletList.length : 0}
                </span>
              ) : null}
            </div>
            <CustomOverlay
              position="bottom"
              isIcon={false}
              isInfo={true}
              isText={true}
              text={
                props.fullWalletList &&
                props.fullWalletList.length > 0 &&
                props.fullWalletList[0][0]
                  ? props.fullWalletList[0][0]
                  : ""
              }
              className={"fix-width tool-tip-container-bottom-arrow "}
            >
              <div className="hideText topBarWalletAddressNameTagAndAddress">
                {props.fullWalletList && props.fullWalletList.length > 0 ? (
                  <>
                    {props.fullWalletList[0][0] &&
                    !/\.eth$/.test(props.fullWalletList[0][0]) ? (
                      <span
                        style={{
                          fontWeight: "600",
                        }}
                        className="topBarWalletAddressAddress mr-2"
                      >
                        {/\.eth$/.test(props.fullWalletList[0][0])
                          ? props.fullWalletList[0][0]
                          : props.fullWalletList[0][0].slice(0, 4)}
                      </span>
                    ) : null}
                    <span className="topBarWalletAddressNameTag">
                      {props.fullWalletList[0][2]
                        ? props.fullWalletList[0][2]
                        : /\.eth$/.test(props.fullWalletList[0][1])
                        ? props.fullWalletList[0][1]
                        : null}
                    </span>
                  </>
                ) : null}
              </div>
            </CustomOverlay>
            {!(props.fullWalletList && props.fullWalletList.length > 1) ? (
              <div className="copy-icon-top-bar-new pl-2">
                <Image
                  src={CopyClipboardIcon}
                  onClick={() =>
                    copyContent(
                      props.firstFullWallet ? props.firstFullWallet : ""
                    )
                  }
                  style={{ height: "1.2rem" }}
                />
              </div>
            ) : null}

            {props.fullWalletList && props.fullWalletList.length > 1 ? (
              <OutsideClickHandler onOutsideClick={closeDropdown}>
                <div
                  onClick={toggleDropdown}
                  className="topBarWalletArrowContainer pl-3 h-100 pr-1"
                >
                  <Image
                    className={`topBarWalletArrow ${
                      showDropdown ? "topBarWalletArrowRotate" : ""
                    }`}
                    src={RoundedGreyArrowDownIcon}
                  />
                </div>
              </OutsideClickHandler>
            ) : null}
          </div>
        </Dropdown.Toggle>
        {props.fullWalletList && props.fullWalletList.length > 0 ? (
          <Dropdown.Menu>
            <div className="dropdown-menu-list-container">
              {props.fullWalletList.map((li, index) => (
                <TopBarDropDownListComp li={li} index={index} {...props} />
              ))}
            </div>
          </Dropdown.Menu>
        ) : null}
      </Dropdown>
    </div>
  );
}
