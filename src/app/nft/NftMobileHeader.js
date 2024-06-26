import React, { useState } from "react";
import { Image } from "react-bootstrap";
import logo from "./../../image/Loch.svg";
const NftMobileHeader = () => {
  const [isLogoLoaded, setIsLogoLoaded] = useState(false);
  const logoLoadingComplete = () => {
    setIsLogoLoaded(true);
  };
  return (
    <div className="smartMoneyMobileHeaderContainer">
      <div className="smheader">
        <Image
          style={{
            opacity: isLogoLoaded ? 1 : 0,
          }}
          onLoad={logoLoadingComplete}
          className="smheaderLogo"
          src={logo}
        />
        <div className="smheaderText">
          <div className="smheaderTextHeading inter-display-medium">
            NFT Collection
          </div>
          <div
            style={{
              marginTop: "0.1rem",
            }}
            className="smheaderTextSubHeading inter-display-medium"
          >
            Browse the NFTs held by this portfolio
          </div>
        </div>
      </div>
    </div>
  );
};

export default NftMobileHeader;
