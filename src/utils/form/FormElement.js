import React from "react";
import PropTypes from "prop-types";
import FormContext from "./FormContext";
import FormElementComponent from "./FormElementComponent";

const FormElement = (props) => {
  const { classes, ...elementProps } = props;

  return (
    <FormContext.Consumer>
      {(formContext) => (
        <FormElementComponent
          formContext={formContext}
          {...elementProps}
          classes={classes}
        />
      )}
    </FormContext.Consumer>
  );
};

FormElement.propTypes = {
  classes: PropTypes.object,
  onBlurPassed: PropTypes.object,
  valueLink: PropTypes.object.isRequired,
  label: PropTypes.string,
  required: PropTypes.bool,
  hint: PropTypes.object,
  helpText: PropTypes.string,
  toolTipText: PropTypes.string,
  validations: PropTypes.array,
  control: PropTypes.object.isRequired,
};

FormElement.defaultProps = {
  label: null,
  required: false,
  hint: null,
  helpText: "",
  toolTipText: "",
  validations: [],
};

export default FormElement;
