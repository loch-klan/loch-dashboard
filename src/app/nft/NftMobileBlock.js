import React from "react";
import "./_nft.scss";
import HandleBrokenImages from "../common/HandleBrokenImages";
import { DefaultNftTableIconIcon } from "../../assets/images/icons";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import {
  CurrencyType,
  convertNtoNumber,
  numToCurrency,
} from "../../utils/ReusableFunctions";

const NftMobileBlock = ({ data, style }) => {
  return (
    <div className="mobileSmartMoneyBlock" style={style}>
      <div className="msmbHeader" style={{ padding: "16px" }}>
        <div className="msmbHeaderLeft">
          <div
            style={{
              marginRight: "6px",
            }}
            className="inter-display-medium msmbHeaderNickName"
          >
            {data.collection}
          </div>
          {data?.holding ? (
            <div
              className="inter-display-medium msmbHeaderAccount"
              style={{
                textDecoration: "none",
              }}
            >
              {data.holding} {data.holding > 1 ? "Holdings" : "Holding"}
            </div>
          ) : null}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            justifyContent: "center",
          }}
        >
          {data.imgs && data.imgs.length > 0
            ? data.imgs?.slice(0, 3).map((item, index) => {
                return (
                  <HandleBrokenImages
                    src={item}
                    key={index}
                    className="nftImageIcon"
                    imageOnError={DefaultNftTableIconIcon}
                  />
                );
              })
            : null}
          {data.imgs && data.imgs.length > 3 ? (
            <span
              style={{
                fontSize: "12px",
                lineHeight: "120%",
                color: "#96979A",
                fontWeight: "500",
              }}
            >
              {data.imgs.length - 3}+
            </span>
          ) : null}
        </div>
      </div>
      <div className="msmbBody">
        <div className="msmbBodyItem">
          <div className="inter-display-medium msmbBITitle">Floor Price</div>
          <div className={`inter-display-medium msmbBIAmount`}>
            <CustomOverlay
              position="top"
              isIcon={false}
              isInfo={true}
              isText={true}
              text={
                data?.floor_price
                  ? CurrencyType(false) + convertNtoNumber(data?.floor_price)
                  : CurrencyType(false) + "0.00"
              }
            >
              <span className="inter-display-medium f-s-13 lh-16 grey-313">
                {data?.floor_price
                  ? CurrencyType(false) +
                    numToCurrency(data?.floor_price.toFixed(2)).toLocaleString(
                      "en-US"
                    )
                  : CurrencyType(false) + "0.00"}
              </span>
            </CustomOverlay>
          </div>
        </div>
        {/* <div className="msmbBodyItem">
          <div className="inter-display-medium msmbBITitle">
            Total Spent (ETH)
          </div>
          <div className={`inter-display-medium msmbBIAmount`}>
            <span>{data?.total_spent}</span>
          </div>
        </div>
        <div className="msmbBodyItem">
          <div className="inter-display-medium msmbBITitle">
            Max Price (ETH)
          </div>
          <div className={`inter-display-medium msmbBIAmount`}>
            <span>{data?.max_price}</span>
          </div>
        </div>
        <div className="msmbBodyItem">
          <div className="inter-display-medium msmbBITitle">
            Avg Price (ETH)
          </div>
          <div className={`inter-display-medium msmbBIAmount`}>
            <span>{data?.avg_price}</span>
          </div>
        </div>
        <div className="msmbBodyItem">
          <div className="inter-display-medium msmbBITitle">Volume (ETH)</div>
          <div className={`inter-display-medium msmbBIAmount`}>
            <span>{data?.volume}</span>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default NftMobileBlock;
