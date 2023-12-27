import React, { useState } from "react";
import { Image } from "react-bootstrap";
import lochClean from "../../assets/images/LochClean.gif";

function Loading(props) {
  const [isLogoLoaded, setIsLogoLoaded] = useState(false);

  const logoLoadingComplete = () => {
    setIsLogoLoaded(true);
  };

  return (
    <div className="loading-animation">
      <Image
        style={{
          opacity: isLogoLoaded ? 1 : 0,
        }}
        onLoad={logoLoadingComplete}
        src={lochClean}
        className="no-data"
      />
    </div>
  );
}

export default Loading;
