import React from "react";
import { Dropdown, Image } from "react-bootstrap";
import { toast } from "react-toastify";
import { CopyClipboardIcon } from "../../assets/images";
export default function TopBarDropDownListComp(props) {
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
  const { li, index } = props;
  return (
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
        <div className="dotDotText topBarWalletAddressNameTagAndAddress">
          <span className="topBarWalletAddressNameTag">
            {li[2] ? li[2] + " " : null}
          </span>
          {li[0] ? (
            <span className="topBarWalletAddressAddress dotDotText">
              {li[0].slice(0, 4)}
            </span>
          ) : null}
        </div>
        <div className="copy-icon-top-bar pl-3">
          <Image
            src={CopyClipboardIcon}
            onClick={copyTheAddress}
            className="cp"
            style={{ height: "1.2rem" }}
          />
        </div>
      </div>
      {/* {props?.showChecked && (
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
      )} */}
    </Dropdown.Item>
  );
}
