import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import RenderToolTip from "./RenderToolTip";
import "./commonCoponentsStyles/_customOverlay.scss";

function CustomOverlay(props) {
  return (
    <OverlayTrigger
      placement={props.position}
      delay={{ show: 0, hide: 0 }}
      overlay={(passedProps) => {
        return <RenderToolTip {...props} passedProps={passedProps} />;
      }}
      className="overlay-tool-tip-container"
    >
      {props.children}
    </OverlayTrigger>
  );
}

export default CustomOverlay;
