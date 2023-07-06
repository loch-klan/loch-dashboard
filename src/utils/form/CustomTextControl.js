import React from "react";
import PropTypes from "prop-types";
import { FormControl, InputGroup } from "react-bootstrap";

const getFormControlData = (props) => {
  const {
    type,
    disabled,
    readOnly,
    placeholder,
    as,
    classes,
    rows,
    onBlur,
    valueLink,
    maxLength,
    // multiline,
    isInvalid,
    isValid,
  } = props;
  return (
    <FormControl
      type={type}
      disabled={disabled}
      readOnly={readOnly}
      placeholder={placeholder}
      as={as}
      rows={rows}
      className={classes.inputField}
      onBlur={() => onBlur(valueLink.value)}
      value={valueLink.value}
      maxLength={maxLength}
      // multiline={multiline}
      onChange={(event) => valueLink.requestChange(event.target.value)}
      isValid={isValid}
      isInvalid={isInvalid}
    />
  );
};
const CustomTextControl = (props) => {
  return (
    <div>
      {props.prefix || props.suffix ? (
        <InputGroup>
          {props.prefix && (
            <InputGroup.Prepend className={props.classes.prefix}>
              {props.prefix}
            </InputGroup.Prepend>
          )}
          {getFormControlData(props)}
          {props.suffix && (
            <InputGroup.Prepend className={props.classes.suffix}>
              {props.suffix}
            </InputGroup.Prepend>
          )}
        </InputGroup>
      ) : (
        getFormControlData(props)
      )}
    </div>
  );
};

CustomTextControl.propTypes = {
  type: PropTypes.oneOf(["text", "password"]),
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  placeholder: PropTypes.string,
  as: PropTypes.oneOf(["input", "textarea"]),
  rows: PropTypes.number,
  classes: PropTypes.object,
  onBlur: PropTypes.func.isRequired,
  valueLink: PropTypes.object.isRequired,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  maxLength: PropTypes.number,
  isValid: PropTypes.bool,
  isInvalid: PropTypes.bool,
  // multiline: PropTypes.bool,
};

CustomTextControl.defaultProps = {
  type: "text",
  as: "input",
  prefix: null,
  suffix: null,
  maxLength: 250,
  placeholder: "",
  // multiline: false,
  disabled: false,
  readOnly: false,
  classes: {},
  isValid: false,
  isInvalid: false,
};

export default CustomTextControl;
