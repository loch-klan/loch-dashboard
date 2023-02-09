import React from 'react'
import {Image} from'react-bootstrap'
import { lightenDarkenColor } from '../../utils/ReusableFunctions'

export default function CoinChip(props) {

  return (
    <div className="coin-chip">
      <Image
        src={props.coin_img_src}
        style={{
          border: `1px solid ${lightenDarkenColor(props.colorCode, -0.15)} `,
          margin: `${props.type === "cohort" ? "-1px" : "0"}`,
          
        }}
      />
      <div className="inter-display-medium f-s-13 lh-14 coin-percent">
        {props.coin_percent
          ? props.coin_percent
          : props.coin_code
          ? props.coin_code
          : ""}{" "}
      </div>
    </div>
  );
}
