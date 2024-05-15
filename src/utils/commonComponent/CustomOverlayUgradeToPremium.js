import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { Image, Tooltip } from "react-bootstrap";
import "./commonCoponentsStyles/_customOverlay.scss";
import { LochPremiumTooltipImage } from "../../assets/images";
import { useState } from "react";
import { mobileCheck } from "../ReusableFunctions";

function CustomOverlayUgradeToPremium({
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
}) {
  const [isMobile] = useState(mobileCheck());
  const renderTooltip = (props) => (
    // <Tooltip className={isText ? "text-tooltip-container" : "op-100 tool-tip-container"} id="button-tooltip" {...props}></Tooltip>
    <Tooltip
      className={`tool-tip-container tool-tip-fremium-container ${
        isInfo ? "question-hover" : "hover-chip"
      } ${className ? className : ""} ${
        disabled || isMobile ? "tool-tip-container-hidden" : ""
      }`}
      id="button-tooltip"
      {...props}
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

  return (
    <OverlayTrigger
      placement={position}
      overlay={renderTooltip}
      className="overlay-tool-tip-container"
    >
      {children}
    </OverlayTrigger>
  );
}

export default CustomOverlayUgradeToPremium;
