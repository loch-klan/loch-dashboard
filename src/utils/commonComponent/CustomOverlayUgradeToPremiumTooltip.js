import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { Image, Tooltip } from "react-bootstrap";
import "./commonCoponentsStyles/_customOverlay.scss";
import { LochPremiumTooltipImage } from "../../assets/images";
import { useEffect, useState } from "react";
import { mobileCheck } from "../ReusableFunctions";

function CustomOverlayUgradeToPremiumTooltip({
  text,
  position,
  isIcon,
  children,
  IconImage,
  isInfo = null,
  isText,
  isName = null,
  colorCode = "",
  className,
  isCaptialised,
  isLeftText,
  heading,
  subHeading,
  showNetflowExplainers,
  disabled,
  passedProps,
}) {
  const [isMobile] = useState(mobileCheck());
  const [curPos, setCurPos] = useState([0, 0]);
  useEffect(() => {
    document.addEventListener("mousemove", setInitialMousePos, false);
    setTimeout(() => {}, 500);
    function setInitialMousePos(event) {
      setCurPos([event.clientX, event.clientY]);
      // document.removeEventListener("mousemove", setInitialMousePos, false);
    }
  }, []);
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", () => {}, false);
    };
  }, []);

  if (curPos[0] !== 0 && curPos[1] !== 0 && !mobileCheck()) {
    if (position === "bottom") {
      passedProps.style = {
        ...passedProps.style,
        transform: `translate(calc(${curPos[0]}px - 50%), calc(${curPos[1]}px + 1rem))`,
        top: 0,
        left: 0,
        height: "fit-content",
      };
    } else if (position === "top") {
      passedProps.style = {
        ...passedProps.style,
        transform: `translate(calc(${curPos[0]}px - 50%), calc(${curPos[1]}px - 100% - 0.5rem))`,
        top: 0,
        left: 0,
        height: "fit-content",
      };
    } else if (position === "right") {
      passedProps.style = {
        ...passedProps.style,
        transform: `translate(calc(${curPos[0]}px + 1rem), calc(${curPos[1]}px - 1rem))`,
        top: 0,
        left: 0,
        height: "fit-content",
      };
    }
  }
  return (
    <Tooltip
      className={`tool-tip-container tool-tip-fremium-container ${
        isInfo ? "question-hover" : "hover-chip"
      } ${className ? className : ""} ${
        disabled || isMobile ? "tool-tip-container-hidden" : ""
      }`}
      id="button-tooltip"
      {...passedProps}
    >
      <div className="inter-display-medium freemium-tooltip-header">
        Upgrade to Loch Premium
      </div>

      <div className="inter-display-medium freemium-tooltip-desc">
        and unlock the full possibilities of Loch
      </div>
      <Image className="freemium-tooltip-image" />
    </Tooltip>
  );
}

export default CustomOverlayUgradeToPremiumTooltip;
