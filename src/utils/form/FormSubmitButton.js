import React from "react";
import PropTypes from "prop-types";
import FormContext from "./FormContext";
import FormSubmitButtonComponent from "./FormSubmitButtonComponent";

const FormSubmitButton = (props) => {
  const { classes, ...elementProps } = props;
  return (
    <FormContext.Consumer>
      {(formContext) => (
        <FormSubmitButtonComponent
          formContext={formContext}
          {...elementProps}
        />
      )}
    </FormContext.Consumer>
  );
};

FormSubmitButton.propTypes = {
  classes: PropTypes.object,
  // progressMessage: PropTypes.string.isRequired,
  // fullWidth: PropTypes.bool
};

FormSubmitButton.defaultProps = {
  // fullWidth: false
};

export default FormSubmitButton;
