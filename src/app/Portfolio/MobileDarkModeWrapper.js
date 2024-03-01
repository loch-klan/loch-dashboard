import React, { useEffect, useState } from "react";
import {
  switchToDarkMode,
  switchToLightMode,
} from "../../utils/ReusableFunctions";
import { connect } from "react-redux";
import { SwitchDarkMode } from "../common/Api";
import { Image } from "react-bootstrap";
import { mobileDarkIcon, mobileLightIcon } from "../../assets/images/icons";

const MobileDarkModeIconWrapper = (props) => {
  // Dark mode
  const [isDarkMode, setIsDarkMode] = useState(
    document.querySelector("body").getAttribute("data-theme") == "dark"
      ? true
      : false
  );

  useEffect(() => {
    setIsDarkMode(
      document.querySelector("body").getAttribute("data-theme") == "dark"
        ? true
        : false
    );
  }, [document.querySelector("body").getAttribute("data-theme") == "dark"]);

  const handleDarkMode = () => {
    const darkOrLight = document
      .querySelector("body")
      .getAttribute("data-theme");
    if (darkOrLight === "dark") {
      setIsDarkMode(false);
      switchToLightMode();
      props.SwitchDarkMode(false);
    } else {
      switchToDarkMode();
      setIsDarkMode(true);
      props.SwitchDarkMode(true);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
      }}
    >
      <div
        style={{
          flex: "1",
        }}
      >
        {props.children}
      </div>
      <div className="mobile-dark-mode-toggle-button" onClick={handleDarkMode}>
        <Image src={isDarkMode ? mobileLightIcon : mobileDarkIcon} />
      </div>
    </div>
  );
};

const mapDispatchToProps = {
  SwitchDarkMode,
};
const mapStateToProps = (state) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MobileDarkModeIconWrapper);
