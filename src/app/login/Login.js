import React from 'react';
import { connect } from "react-redux";
import { BaseReactComponent, CustomTextControl, Form, FormElement, FormSubmitButton, FormValidator } from '../../utils/form';
import { deleteToken } from '../../utils/ManageToken';
import ForgotPassword from '../common/ForgotPassword';
import { loginApi } from './Api';

class Login extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      forgotPassword: false,
    }
  }

  componentDidMount() {
    // DELETE TOKEN AND OTHER DETAILS ON COMPONENT LOAD.
    deleteToken();
  }

  onValidSubmit = () => {
    const data = new URLSearchParams();
    data.append('email', this.state.email);
    data.append('password', this.state.password);
    loginApi(this, data)
  }

  openCloseForgotPasswordModal = () => {
    this.setState({
      forgotPassword: !this.state.forgotPassword
    });
  };

  render() {
    return (
      <div className="login-wrapper">
        {
          this.state.forgotPassword &&
          <ForgotPassword
            show={this.state.forgotPassword}
            handleClose={this.openCloseForgotPasswordModal}
          />
        }
        <div className="login-content">
          <h1 className="red-hat-display-bold f-s-24">Login</h1>
          <Form onValidSubmit={this.onValidSubmit}>
            <FormElement
              valueLink={this.linkState(this, "email")}
              label="Email Address"
              required
              validations={[
                {
                  validate: FormValidator.isRequired,
                  message: "Field cannot be empty"
                },
                {
                  validate: FormValidator.isEmail,
                  message: "Email is invalid"
                }
              ]}
              control={{
                type: CustomTextControl,
                settings: {
                  placeholder: "Enter Email Address",
                }
              }}
            />
            <FormElement
              valueLink={this.linkState(this, "password")}
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
                  type: "password"
                }
              }}
            />
            <div className="forgot-wrapper">
              {/* <Link to={'/'} className="red-hat-display-medium">forgot password?</Link> */}
              <p className="red-hat-display-medium" style={{ cursor: "pointer" }} onClick={this.openCloseForgotPasswordModal}>
                Forgot Password?
              </p>
            </div>
            <div className="submit-wrapper">
              <FormSubmitButton customClass="btn black-btn">Login</FormSubmitButton>
            </div>
          </Form>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  loginState: state.LoginState
});
const mapDispatchToProps = {
  // getPosts: fetchPosts
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);