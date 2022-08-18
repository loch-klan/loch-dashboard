import React from 'react';
import PropTypes from 'prop-types';
import {
  BaseReactComponent, CustomTextControl, Form, FormElement, FormSubmitButton, FormValidator
} from '../../utils/form';
import { CustomModal } from "../common";
import eyeIcon from '../../assets/images/icons/eye-icon.svg';
import eyeVisible from '../../assets/images/icons/eye-visible.svg';
import { Image } from 'react-bootstrap';
import { toast } from "react-toastify";
import { changePasswordApi } from './Api';

class ChangePasswordModal extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: "",
      inProgress: false,
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      showOldPassword: false,
      showPassword: false,
      showConfirmPassword: false,
    }
  }
  componentDidMount() { }

  onSubmit = () => {
    if (this.state.newPassword !== this.state.confirmPassword) {
      toast.error("New password and Confirm password don't match");
      return;
    }
    const data = new URLSearchParams();
    data.append("old_password", this.state.oldPassword);
    data.append("new_password", this.state.newPassword);
    changePasswordApi(this, data);
  }

  handleEye = (type) => {
    this.setState({
      [type]: !this.state[type]
    })
  }

  render() {
    return (
      <CustomModal
        show={this.props.show}
        onHide={this.props.handleClose}
        title={"Change Password"}
        modalClass={"change-password"}
      >
        <Form onValidSubmit={this.onSubmit}>
          <FormElement
            valueLink={this.linkState(this, "oldPassword")}
            label="Current Password"
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
                placeholder: "Enter Current Password",
                type: this.state.showOldPassword ? "text" : "password",
                suffix: <Image src={this.state.showOldPassword ? eyeVisible : eyeIcon} onClick={() => this.handleEye("showOldPassword")} className="eye-icon" />
              }
            }}
          />

          <FormElement
            valueLink={this.linkState(this, "newPassword")}
            label="New Password"
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
                placeholder: "Enter New Password",
                type: this.state.showPassword ? "text" : "password",
                suffix: <Image src={this.state.showPassword ? eyeVisible : eyeIcon} onClick={() => this.handleEye("showPassword")} className="eye-icon" />
              }
            }}
          />

          <FormElement
            valueLink={this.linkState(this, "confirmPassword")}
            label="Re-Enter New Password"
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
                type: this.state.showConfirmPassword ? "text" : "password",
                suffix: <Image src={this.state.showConfirmPassword ? eyeVisible : eyeIcon} onClick={() => this.handleEye("showConfirmPassword")} className="eye-icon" />
              }
            }}
          />
          <div className="submit-wrapper">
            <FormSubmitButton customClass="btn black-btn">Reset Password</FormSubmitButton>
          </div>
        </Form>

      </CustomModal>
    )
  }
}

ChangePasswordModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default ChangePasswordModal;