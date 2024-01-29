import React, { useState } from "react";
import { Image } from "react-bootstrap";
import logo from "../../image/Loch.svg";

export default function SmartMoneyMobileHeader(props) {
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
            Loch’s Leaderboard
          </div>
          <div
            style={{
              marginTop: "0.1rem",
            }}
            className="smheaderTextSubHeading inter-display-medium"
          >
            Sorted by net worth, pnl, and flows
          </div>
        </div>
      </div>
    </div>
  );
}
