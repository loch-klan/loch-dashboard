import React from "react";
import PropTypes from "prop-types";

const RangeInput = (props) => {
  const { classes, rangeId, rangeName, minValue, maxValue, step, valueLink } =
    props;
  return (
    <input
      style={{
        display: "block",
        width: "100%",
        padding: "0.85rem 0",
        cursor: "pointer",
      }}
      type="range"
      value={valueLink.value}
      onChange={(e) => valueLink.requestChange(e.target.value)}
      id={rangeId}
      name={rangeName}
      min={minValue}
      max={maxValue}
      step={step}
      className={classes.inputField}
    />
  );
};

RangeInput.propTypes = {
  rangeId: PropTypes.string,
  rangeName: PropTypes.string,
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
  valueLink: PropTypes.object.isRequired,
};

RangeInput.defaultProps = {
  step: 1,
};

export default RangeInput;
