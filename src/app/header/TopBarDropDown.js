import React, { useRef, useState } from "react";
import { Dropdown, Image } from "react-bootstrap";
import OutsideClickHandler from "react-outside-click-handler";
import { toast } from "react-toastify";
import { CopyClipboardIcon } from "../../assets/images";
import { EyeIcon, RoundedGreyArrowDownIcon } from "../../assets/images/icons";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
export default function TopBarDropDown(props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const list = props.list.map((li, index) => {
    const borderStyle = {
      border: `1px solid ${li.color}`,
      color: li.color,
    };
    const copyTheAddress = () => {
      if (
        props.fullWalletList &&
        props.fullWalletList.length === props.list.length
      ) {
        if (props.fullWalletList[index] && props.fullWalletList[index][0]) {
          copyContent(props.fullWalletList[index][0]);
        }
      }
    };
    return props.showChain ? (
      <Dropdown.Item
        eventKey={`${props.id} ${li} ${li.id}`}
        key={index}
        className="m-b-12 chain-dropdown"
        style={borderStyle}
      >
        <Image src={li.symbol} /> {li.name}
      </Dropdown.Item>
    ) : (
      <Dropdown.Item
        eventKey={`${props.id} ${li} ${li.id}`}
        key={index}
        className={props.activetab === li ? "active" : ""}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {li.name ? li.name : li}{" "}
          <div className="copy-icon-top-bar pl-3">
            <Image
              src={CopyClipboardIcon}
              onClick={copyTheAddress}
              className="cp"
              style={{ height: "1.2rem" }}
            />
          </div>
        </div>
        {props?.showChecked && (
          <svg
            style={
              props.activetab !== li
                ? { display: "none" }
                : {
                    position: "absolute",
                    right: "5px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "2rem",
                    height: "2rem",
                  }
            }
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polyline
              fill="none"
              stroke="#cccccc"
              strokeWidth="2"
              points="6 13 10.2 16.6 18 7"
            />
          </svg>
        )}
      </Dropdown.Item>
    );
  });
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
              {props.totalWallets && props.totalWallets > 1 ? (
                <span className="topBarWalletTotalWallets">
                  {props.totalWallets}
                </span>
              ) : null}
            </div>
            <CustomOverlay
              position="bottom"
              isIcon={false}
              isInfo={true}
              isText={true}
              text={
                props.firstFullWallet
                  ? props.firstFullWallet
                  : props.firstWallet
              }
              className={"fix-width tool-tip-container-bottom-arrow"}
            >
              <div className="hideText">
                <span>{props.firstWallet}</span>
              </div>
            </CustomOverlay>
            {!(props.totalWallets && props.totalWallets > 1) ? (
              <div className="copy-icon-top-bar pl-2">
                <Image
                  src={CopyClipboardIcon}
                  onClick={() =>
                    copyContent(
                      props.firstFullWallet ? props.firstFullWallet : ""
                    )
                  }
                  className="cp"
                  style={{ height: "1.2rem" }}
                />
              </div>
            ) : null}

            {props.totalWallets && props.totalWallets > 1 ? (
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
        <Dropdown.Menu>
          <div className="dropdown-menu-list-container">{list}</div>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
