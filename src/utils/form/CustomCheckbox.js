import React from "react";
import PropTypes from "prop-types";

// import { FormControl, Form } from 'react-bootstrap'

const CustomCheckbox = (props) => {
  const {
    classes,
    checkboxId,
    checkboxName,
    valueLink,
    options,
    disabled,
    isInline,
  } = props;
  return (
    <div className={`checkbox-wrapper ${isInline ? "inline" : ""}`}>
      {options &&
        options.map((option, i) => (
          <div className="checkbox-control" key={i}>
            <input
              type="checkbox"
              key={option.key}
              value={option.key}
              // defaultChecked={option.isDefault}
              checked={option.key}
              onChange={(e) => {
                // console.log(' valueLink.requestChange', valueLink);
                // console.log('e.target.value', e.target.value);
                valueLink.requestCheckboxChange(e.target.value, i);
              }}
              // onChange={() => {
              //   option.isChecked = !option.isChecked
              // }}
              id={checkboxId}
              name={checkboxName}
              className={classes.inputField}
              disabled={disabled}
            />
            <span>{option.label}</span>
          </div>
        ))}
    </div>
  );
};

CustomCheckbox.propTypes = {
  checkboxId: PropTypes.string,
  checkboxName: PropTypes.string,
  // valueLink: PropTypes.object.isRequired,
  options: PropTypes.array.isRequired,
  isInline: PropTypes.bool,
};

CustomCheckbox.defaultProps = {
  isInline: false,
};

export default CustomCheckbox;
