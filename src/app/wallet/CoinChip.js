import React from "react";
import { Image } from "react-bootstrap";
import { lightenDarkenColor } from "../../utils/ReusableFunctions";

export default function CoinChip(props) {
  return (
    <div
      className="coin-chip"
      style={props?.chain ? { position: "relative" } : {}}
    >
      <Image
        src={props.coin_img_src}
        style={
          props?.chain
            ? {
                border: `1px solid ${lightenDarkenColor(
                  props.colorCode,
                  -0.15
                )} `,
                margin: `${props.type === "cohort" ? "-1px" : "0"}`,
                borderRadius: "50%",
                width: "2rem",
                height: "2rem",
              }
            : {
                border: `1px solid ${lightenDarkenColor(
                  props.colorCode,
                  -0.15
                )} `,
                margin: `${props.type === "cohort" ? "-1px" : "0"}`,
              }
        }
      />
      {!props?.chain || props?.hideChainImage ? null : (
        <Image
          src={props?.chain?.symbol}
          style={{
            border: `1px solid ${lightenDarkenColor(
              props?.chain?.color,
              -0.15
            )} `,
            margin: `${props.type === "cohort" ? "-1px" : "0"}`,
            borderRadius: "50%",
            width: "1.3rem",
            height: "1.3rem",
            position: "absolute",
            top: "0rem",
            left: "1.3rem",
          }}
          className="chain-img"
        />
      )}
      {
        props.hideText
        ?
        null
        :
        props?.showNetwork
        ?
        <div className="inter-display-medium f-s-13 lh-14 coin-percent">
          {props?.chain?.code}
        </div>
        :
          <div className="inter-display-medium f-s-13 lh-14 coin-percent">
          {props.coin_percent
            ? props.coin_percent
            : props.coin_code
            ? props.coin_code
            : ""}{" "}
        </div>
        }
    </div>
  );
}
