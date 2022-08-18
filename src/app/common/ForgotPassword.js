import React from 'react';
import PropTypes from 'prop-types';
import { BaseReactComponent, CustomTextControl, Form, FormElement, FormSubmitButton, FormValidator } from '../../utils/form';
import { CustomModal } from '../common';
import { forgotPasswordApi } from './Api';

class ForgotPassword extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: "",
      email: "",
      inProgress: false
    }
  }
  componentDidMount() { }

  onSubmit = () => {
    const data = new URLSearchParams();
    data.append('email', this.state.email);
    forgotPasswordApi(data, this.props.handleClose);
  }
  render() {
    return (
      <CustomModal
        show={this.props.show}
        onHide={this.props.handleClose}
        title={"Forgot Password"}
        modalClass={"change-password"}
      >
        <Form onValidSubmit={this.onSubmit}>
          <FormElement
            valueLink={this.linkState(this, "email")}
            label="Email"
            required
            validations={[
              {
                validate: FormValidator.isRequired,
                message: "Please enter email address"
              },
              {
                validate: FormValidator.isEmail,
                message: "Please enter correct email"
              }
            ]}
            control={{
              type: CustomTextControl,
              settings: {
                placeholder: "Enter Registered Email",
              }
            }}
            classes={{
              inputField: "custom-input",
              label: "custom-label"
            }}
          />

          {
            this.state.errorMessage && <p className="error">{this.state.errorMessage}</p>
          }
          <div className="submit-wrapper">
            <FormSubmitButton customClass="btn black-btn">Submit</FormSubmitButton>
          </div>
        </Form>
      </CustomModal>
    )
  }
}

ForgotPassword.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
}
export default ForgotPassword;