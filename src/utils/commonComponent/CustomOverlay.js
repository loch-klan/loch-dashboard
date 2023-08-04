import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { Image, Tooltip } from "react-bootstrap";
import { lightenDarkenColor } from "../ReusableFunctions";

function CustomOverlay({
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
}) {
  const renderTooltip = (props) => (
    // <Tooltip className={isText ? "text-tooltip-container" : "op-100 tool-tip-container"} id="button-tooltip" {...props}></Tooltip>
    <Tooltip
      className={`tool-tip-container ${
        isInfo ? "question-hover" : "hover-chip"
      } ${className ? className : ""}`}
      id="button-tooltip"
      {...props}
    >
      {isInfo ? (
        <div className={isText ? "text-tooltip" : "button-tooltip"}>
          {isIcon ? <Image src={IconImage} /> : null}
          {isName ? (
            <span
              className={`inter-display-medium f-s-13 lh-16 m-r-8`}
              style={{ color: colorCode ? colorCode : "#19191A" }}
            >
              {isName}
            </span>
          ) : (
            ""
          )}
          <span
            className={`inter-display-medium f-s-13 lh-16 ${
              isCaptialised ? "text-capitalize" : ""
            }`}
          >
            {text}
          </span>
        </div>
      ) : (
        <ul>
          {text.map((e, i) =>
            i !== 0 ? (
              <li key={i}>
                <Image
                  src={e.coinSymbol}
                  style={{
                    border: `1px solid ${lightenDarkenColor(
                      e.coinColor,
                      -0.15
                    )} `,
                  }}
                />
                <span className="inter-display-medium f-s-13 grey-313 lh-16">
                  {e.coinName}
                </span>
              </li>
            ) : null
          )}
        </ul>
      )}
    </Tooltip>
  );

  return (
    <OverlayTrigger
      placement={position}
      delay={{ show: 250, hide: 100 }}
      overlay={renderTooltip}
    >
      {children}
    </OverlayTrigger>
  );
}

export default CustomOverlay;
