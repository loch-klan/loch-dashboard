import React from "react";
import DropDown from "./DropDown";
import "./commonScss/_coinBadges.scss";

export default function CoinBadges(props) {
  // const dropList = ["All", "Bitcoin", "Solana", "Ethereum", "Helium", "Fantom", "Near", "Litecoin", "Ripple"]
  // const badgeList = ["All", "Bitcoin", "Solana", "Ethereum", "Helium", "Fantom", "Near", "Litecoin", "Ripple","Avalanche" ,"Unicoin","Maker","Matic","Render","Flow","Cosmos","Luna","Algorand","Aurora","Cardano","Fantom","Polygon","Near","Tron","Optimism","Polkadot","Filecoin","Binance"]
  // console.log(props.chainList)

  let badgeList = [{ name: "All", id: "" }];
  let dropdownList = [];

  props.chainList?.map((chain) => {
    // console.log(chain)
    badgeList.push({ name: chain.name, id: chain.id });
    dropdownList.push({ name: chain.name, id: chain.id });
  });

  const handleFunction = (e) => {
    // console.log("drop",e.split(' '))
    const badgeId = e.split(" ")[3];
    const currentBadge = badgeList.find((e) => e.id === badgeId);
    // console.log(currentBadge)
    props.handleFunction(currentBadge);
  };
  return (
    <div className="coinBadgesBlock">
      <div
        className={`badgeList ${
          props.isScrollVisible === false ? "white-scroll" : ""
        }`}
      >
        {badgeList?.map((badge, index) => {
          const className = props.activeBadge.some((e) => e.name === badge.name)
            ? "interDisplayMediumText f-s-13 lh-16 m-r-16 badgeName badgeActive"
            : "interDisplayMediumText f-s-13 lh-16 m-r-16 badgeName";
          return (
            <div
              id={index}
              key={index}
              className={className}
              onClick={() => props.handleFunction(badge)}
            >
              {badge.name}
            </div>
          );
        })}
      </div>

      <DropDown
        id="dropdown-basic-badge-button"
        title="Others"
        list={dropdownList}
        onSelect={handleFunction}
      />
    </div>
  );
}
