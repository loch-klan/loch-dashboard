import React from 'react';
import { toast } from 'react-toastify';
import {
  BaseReactComponent, CustomTextControl, Form, FormElement, FormSubmitButton, FormValidator
} from '../../utils/form';
import { resetPasswordApi } from './Api';


class ResetPassword extends BaseReactComponent {
  constructor(props) {
    super(props);
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const token = params.get("token");
    this.state = {
      errorMessage: "",
      inProgress: false,
      token: token ? token : "",
      newPassword: '',
      confirmPassword: '',
    }
  }
  componentDidMount() { }

  onSubmit = () => {
    if (this.state.newPassword !== this.state.confirmPassword) {
      toast.error("New password and Confirm password don't match");
      return;
    }
    const data = new URLSearchParams();
    data.append('password', this.state.newPassword);
    data.append('token', this.state.token);
    resetPasswordApi(this, data);
  }

  render() {
    console.log("props",this.props)
    return (
      <div className="login-wrapper">
        <div className="login-content">
          <h1 className="red-hat-display-bold f-s-24">Set Password</h1>
          <Form onValidSubmit={this.onSubmit}>
            <FormElement
              valueLink={this.linkState(this, "newPassword")}
              label="Password"
              required
              validations={[
                {
                  validate: FormValidator.isRequired,
                  message: "Field cannot be empty"
                }
              ]}
              control={{
                type: CustomTextControl,
                settings: {
                  placeholder: "Enter Password",
                  type: "password",
                }
              }}
            />
            <FormElement
            valueLink={this.linkState(this, "confirmPassword")}
            label="Confirm Password"
            required
            validations={[
              {
                validate: FormValidator.isRequired,
                message: "Field cannot be empty"
              }
            ]}
            control={{
              type: CustomTextControl,
              settings: {
                placeholder: "Enter Password",
                type: "password",
                // suffix: <Image src={this.state.showConfirmPassword ? eyeVisible : eyeIcon} onClick={() => this.handleEye("showConfirmPassword")} className="eye-icon" />
              }
            }}
          />
            <div className="submit-wrapper">
              <FormSubmitButton customClass="btn black-btn">Reset Password</FormSubmitButton>
            </div>
          </Form>
        </div>
      </div>

    )
  }
}

ResetPassword.propTypes = {
};

export default ResetPassword;