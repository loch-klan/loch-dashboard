import React, { useRef, useState } from "react";
import { RoundedArrowDownIcon } from "../../assets/images/icons";
import { Dropdown, Image } from "react-bootstrap";
import OutsideClickHandler from "react-outside-click-handler";
import AddWalletAddress from "../../assets/images/icons/AddWalletAddress.svg";
export default function TopBarDropDown(props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const list = props.list.map((li, index) => {
    const borderStyle = {
      border: `1px solid ${li.color}`,
      color: li.color,
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
        {li.name ? li.name : li}{" "}
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
    event.stopPropagation();
    setShowDropdown(false);
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
            onClick={props.handleAddWalletClick}
            ref={props.buttonRef}
            className="topbar-btn w-100"
            id="address-button"
          >
            <Image
              className={`topBarWalletChain ${
                props.totalWallets && props.totalWallets === 1
                  ? "topBarWalletChainSingle"
                  : ""
              }`}
              src={AddWalletAddress}
            />
            <div className="hideText">
              {props.totalWallets && props.totalWallets > 1 ? (
                <span className="topBarWalletTotalWallets">
                  {props.totalWallets}
                </span>
              ) : null}
              <span>{props.firstWallet}</span>
            </div>
            {props.totalWallets && props.totalWallets > 1 ? (
              <OutsideClickHandler onOutsideClick={closeDropdown}>
                <div
                  onClick={toggleDropdown}
                  className="topBarWalletArrowContainer pl-3 h-100 pr-1"
                >
                  <Image
                    className="topBarWalletArrow"
                    src={RoundedArrowDownIcon}
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
