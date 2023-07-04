import React from "react";
import PropTypes from "prop-types";

const CustomRadio = (props) => {
  const {
    classes,
    radioId,
    radioName,
    valueLink,
    options,
    disabled,
    isInline,
  } = props;
  return (
    <div className={`radio-wrapper ${isInline ? "inline" : ""}`}>
      {options &&
        options.map((option, key) => (
          <div className="radio-control" key={key}>
            <input
              /* style={{
                display: "block",
                // width: "100%",
                // padding: "0.85rem 0",
                // cursor: "pointer",
              }} */
              type="radio"
              key={option.key}
              value={option.key}
              checked={valueLink.value.indexOf(option.key) > -1}
              onChange={(e) => valueLink.requestChange(e.target.value)}
              id={radioId}
              name={radioName}
              className={classes.inputField}
              disabled={disabled}
            />
            <span>{option.label}</span>
          </div>
        ))}
    </div>
  );
};

CustomRadio.propTypes = {
  radioId: PropTypes.string,
  radioName: PropTypes.string,
  valueLink: PropTypes.object.isRequired,
  options: PropTypes.array.isRequired,
  isInline: PropTypes.bool,
};

CustomRadio.defaultProps = {
  isInline: false,
};

export default CustomRadio;
