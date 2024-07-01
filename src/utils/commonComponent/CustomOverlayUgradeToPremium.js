import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import CustomOverlayUgradeToPremiumTooltip from "./CustomOverlayUgradeToPremiumTooltip";
import "./commonCoponentsStyles/_customOverlay.scss";

function CustomOverlayUgradeToPremium(props) {
  return (
    <OverlayTrigger
      placement={props.position}
      overlay={(passedProps) => {
        return (
          <CustomOverlayUgradeToPremiumTooltip
            {...props}
            passedProps={passedProps}
          />
        );
      }}
      className="overlay-tool-tip-container"
    >
      {props.children}
    </OverlayTrigger>
  );
}

export default CustomOverlayUgradeToPremium;
