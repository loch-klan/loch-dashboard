import { useEffect, useState } from "react";
import { Image, Tooltip } from "react-bootstrap";
import "./commonCoponentsStyles/_customOverlay.scss";
import { mobileCheck } from "../ReusableFunctions";

function RenderToolTip({
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
  copyTrade,
  passedProps,
}) {
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
      className={`tool-tip-container ${
        isInfo ? "question-hover" : "hover-chip"
      } ${className ? className : ""}`}
      id="button-tooltip"
      {...passedProps}
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
                  <h3 className="inter-display-medium f-s-12 lh-15 black-191">
                    Inflows
                  </h3>
                </div>
                <div style={{ width: "65%" }}>
                  <p className="inter-display-medium f-s-12 lh-15 grey-969">
                    Sum of all assets received by this portfolio
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
                  <h3 className="inter-display-medium f-s-12 lh-15 black-191">
                    Outflows
                  </h3>
                </div>
                <div style={{ width: "65%" }}>
                  <p className="inter-display-medium f-s-12 lh-15 grey-969">
                    Sum of all assets and fees sent out by this portfolio
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
                  <h3 className="inter-display-medium f-s-12 lh-15 black-191">
                    Net
                  </h3>
                </div>
                <div style={{ width: "65%" }}>
                  <p className="inter-display-medium f-s-12 lh-15 grey-969">
                    Outflows - Inflows
                  </p>
                </div>
              </div>
            </div>
          ) : copyTrade ? (
            <div
              className={`${isText ? "text-tooltip" : "button-tooltip"} ${
                isLeftText ? "text-left" : ""
              }`}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div
                className={`w-100 inter-display-semi-bold f-s-12 lh-16 black-191 ${
                  isCaptialised ? "text-capitalize" : ""
                }`}
              >
                <div>Loch’s copy trader will email you when</div>
                <div>the underlying wallet makes a swap.</div>
                <div>We’ll calculate the equivalent swap amount</div>
                <div>relative to your portfolio. Use your own</div>
                <div>judgment to decide if you want to</div>
                <div>execute the copy trade or not.</div>
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
                className={`w-100 inter-display-semi-bold f-s-12 lh-16 mb-4 black-191 ${
                  isCaptialised ? "text-capitalize" : ""
                }`}
              >
                {heading}
              </div>
              <div
                className={`w-100 text-tooltip-subheading f-s-12 lh-16 inter-display-medium  ${
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
                  className={`inter-display-medium f-s-12 lh-16 m-r-8`}
                  style={{ color: colorCode ? colorCode : "#19191A" }}
                >
                  {isName}
                </span>
              ) : (
                ""
              )}
              <span
                className={`inter-display-medium f-s-12 lh-16 ${
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
              <li
                style={{
                  border: "none !important",
                }}
                key={i}
              >
                <Image
                  src={e.coinSymbol}
                  style={
                    {
                      // border: `1px solid ${lightenDarkenColor(
                      //   e.coinColor,
                      //   -0.15
                      // )} `,
                    }
                  }
                />
                <span
                  className="inter-display-medium f-s-12 grey-313 lh-16"
                  style={{
                    width: "100%",
                    backgroundColor: "var(--primaryFilter)",
                    border: "none",
                  }}
                >
                  {e.coinName}
                </span>
              </li>
            ) : null
          )}
        </ul>
      )}
    </Tooltip>
  );
}

export default RenderToolTip;
