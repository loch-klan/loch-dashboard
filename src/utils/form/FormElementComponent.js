import React from "react";
import PropTypes from "prop-types";
import { Form, FormGroup, Image } from "react-bootstrap";
import BaseReactComponent from "./BaseReactComponent";
import cancelIcon from "../../assets/images/icons/EmailNotFoundCross.svg";

class FormElementComponent extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      failedValidation: null,
      isInvalidState: null,
      isValidState: null,
    };
  }

  /* componentWillMount() {
    this.props.formContext.registerElement(this);
  } */

  componentDidMount() {
    this.props.formContext?.registerElement(this);
  }

  componentWillUnmount() {
    this.props.formContext?.unRegisterElement(this);
  }

  validate = (stateValue = null) => {
    const { valueLink, validations } = this.props;
    let failedValidation = null;
    let isValidState = null;
    let isInvalidState = null;

    if (validations) {
      failedValidation = validations.find((validation) => {
        return validation.validate(valueLink.value || stateValue) === false;
      });
      failedValidation =
        failedValidation !== undefined ? failedValidation : null;
      // console.log('failedValidation', failedValidation);
      isInvalidState =
        failedValidation && failedValidation.message ? true : false;
      isValidState =
        failedValidation && failedValidation.message ? false : true;
    }

    // console.log('isInvalidState', isInvalidState);
    // THE STATE VALUE IS PASSED FROM COMPONENT CALLBACK METHOD IN CASE OF REACT SELECT.
    if (Array.isArray(stateValue) && stateValue.length > 0) {
      failedValidation = false;
      isInvalidState = false;
      isValidState = true;
    }

    this.setState({ failedValidation, isInvalidState, isValidState });
    return failedValidation === null;
  };

  hideOnblur = () => {
    // console.log("hide")
    this.setState({
      failedValidation: null,
      isInvalid: null,
      isValid: null,
      isInvalidState: null,
      // isValidState:null,
    });
  };

  render() {
    const {
      classes,
      valueLink,
      label,
      required,
      disabled,
      helpText,
      toolTipText,
      isValid,
      isInvalid,
      isCancel = false,
      hideOnblur = this.props.hideOnblur ? true : false,
      onBlurPassed,
      control: { type, settings },
    } = this.props;
    // console.log('this.props', this.props);
    const { failedValidation, isInvalidState, isValidState } = this.state;
    const FormElementControl = type;

    const requiredStyle = {
      color: "red",
    };
    // console.log('valueLink', valueLink);
    return (
      <FormGroup
        controlId={
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15)
        }
        // validationState={failedValidation ? "error" : ""}
        // validated={failedValidation}
        className={classes.formGroup}
      >
        {label &&
          (required ? (
            // <ControlLabel className={classes.label}>{label} <span style={requiredStyle}>*</span></ControlLabel>
            <Form.Label className={classes.label}>
              {label} <span style={requiredStyle}>*</span>
            </Form.Label>
          ) : (
            // <ControlLabel className={classes.label} > {label}</ControlLabel>
            <Form.Label className={classes.label}>{label}</Form.Label>
          ))}
        <FormElementControl
          valueLink={valueLink}
          onBlur={
            hideOnblur
              ? this.hideOnblur
              : onBlurPassed
              ? onBlurPassed
              : this.validate
          }
          failedValidation={this.state.failedValidation}
          classes={classes}
          disabled={disabled}
          isValid={isValid || isValidState}
          isInvalid={isInvalid || isInvalidState}
          {...settings}
        />
        {/* (isValid && failedValidation) || (failedValidation && toolTipText) */}
        {/* (isInvalid && failedValidation) || (failedValidation && toolTipText) */}
        {(failedValidation && failedValidation.message) || helpText ? (
          <Form.Text
            className={`${
              failedValidation ? "has-error" : ""
            } custom-form-error`}
            onClick={() => {
              if (!isCancel) {
                this.setState({
                  failedValidation: null,
                  isInvalid: null,
                  isValid: null,
                  isInvalidState: null,
                });
              }
            }}
          >
            {isCancel && (
              <Image
                src={cancelIcon}
                onClick={() => {
                  this.setState({
                    failedValidation: null,
                    isInvalid: null,
                    isValid: null,
                    isInvalidState: null,
                  });
                }}
                className="cancel-icon"
              />
            )}
            {failedValidation ? failedValidation.message : helpText + "ab"}
          </Form.Text>
        ) : this.props.showHiddenError ? (
          <Form.Text
            className="has-error custom-form-error"
            style={{ opacity: 0 }}
          >
            {isCancel && <Image src={cancelIcon} className="cancel-icon" />}
            Please enter valid email id
          </Form.Text>
        ) : null}
        {toolTipText && (
          <Form.Control.Feedback
            tooltip
            type={`${failedValidation ? "invalid" : "valid"}`}
          >
            {failedValidation ? failedValidation.message : toolTipText}
          </Form.Control.Feedback>
        )}
      </FormGroup>
    );
  }
}

FormElementComponent.propTypes = {
  classes: PropTypes.object,
  formContext: PropTypes.object.isRequired,
  valueLink: PropTypes.object.isRequired,
  label: PropTypes.string,
  required: PropTypes.bool,
  helpText: PropTypes.string,
  toolTipText: PropTypes.string,
  validations: PropTypes.array,
  control: PropTypes.object.isRequired,
  isValid: PropTypes.bool,
  isInvalid: PropTypes.bool,
};

FormElementComponent.defaultProps = {
  label: null,
  required: false,
  helpText: "",
  toolTipText: "",
  validations: [],
  classes: {},
};

export default FormElementComponent;
