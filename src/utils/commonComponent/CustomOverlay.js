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
  isLeftText,
  heading,
  subHeading,
  showNetflowExplainers,
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
        <>
          {showNetflowExplainers ? (
            <div
              style={{
                textAlign: "left",
              }}
            >
              <div
                className="m-b-30 "
                style={{
                  display: "flex",
                  alignItems: "start",
                }}
              >
                <div style={{ width: "22%" }}>
                  <h3 className="inter-display-medium f-s-13 lh-15 black-191">
                    Inflows
                  </h3>
                </div>
                <div style={{ width: "65%" }}>
                  <p className="inter-display-medium f-s-13 lh-15 grey-969">
                    Sum of all assets received by your portfolio
                  </p>
                </div>
              </div>

              <div
                className="m-b-30 "
                style={{
                  display: "flex",
                  alignItems: "start",
                }}
              >
                <div style={{ width: "22%" }}>
                  <h3 className="inter-display-medium f-s-13 lh-15 black-191">
                    Outflows
                  </h3>
                </div>
                <div style={{ width: "65%" }}>
                  <p className="inter-display-medium f-s-13 lh-15 grey-969">
                    Sum of all assets and fees sent out by your portfolio
                  </p>
                </div>
              </div>

              <div
                className=""
                style={{
                  display: "flex",
                  alignItems: "start",
                }}
              >
                <div style={{ width: "22%" }}>
                  <h3 className="inter-display-medium f-s-13 lh-15 black-191">
                    Net
                  </h3>
                </div>
                <div style={{ width: "65%" }}>
                  <p className="inter-display-medium f-s-13 lh-15 grey-969">
                    Outflows - Inflows
                  </p>
                </div>
              </div>
            </div>
          ) : heading ? (
            <div
              className={`${isText ? "text-tooltip" : "button-tooltip"} ${
                isLeftText ? "text-left" : ""
              }`}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div
                className={`w-100 inter-display-semi-bold f-s-13 lh-16 mb-4 ${
                  isCaptialised ? "text-capitalize" : ""
                }`}
              >
                {heading}
              </div>
              <div
                className={`w-100 inter-display-medium text-tooltip-subheading f-s-13 lh-16 ${
                  isCaptialised ? "text-capitalize" : ""
                }`}
              >
                {subHeading}
              </div>
            </div>
          ) : (
            <div
              className={`${isText ? "text-tooltip" : "button-tooltip"} ${
                isLeftText ? "text-left" : ""
              }`}
            >
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
          )}
        </>
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
