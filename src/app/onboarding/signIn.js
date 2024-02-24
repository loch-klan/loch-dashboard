import React from "react";
import { connect } from "react-redux";
import {
  BaseReactComponent,
  CustomButton,
  CustomTextControl,
  Form,
  FormElement,
  FormValidator,
} from "../../utils/form";
import ReactDOM from "react-dom";
import { signIn, verifyUser } from "./Api.js";
import {
  EmailAddressAdded,
  InvalidEmail,
} from "../../utils/AnalyticsFunctions.js";
import { Image } from "react-bootstrap";
import EmailNotFoundCross from "../../assets/images/icons/EmailNotFoundCross.svg";
// import { getCurrentUser } from '../../utils/ManageToken';
class SignIn extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      showModal: true,
      signIn: false,
      email: "",
      isVerificationRequired: props.isVerificationRequired,
      text: "",
      isVallidSignIn: false,
      activemodal: props.activemodal,
      signinReq: props.signinReq,
      emailError: false,
      prevEmail: "",
    };
  }

  componentDidMount() {}

  setValue = (value) => {
    this.setState({ value });
    ReactDOM.findDOMNode(this.form).dispatchEvent(new Event("submit"));
  };

  onValidSubmit = (done, event) => {
    const data = new URLSearchParams();
    if (
      (this.state.email && !this.state.isVerificationRequired) ||
      this.props.activemodal === "signIn"
    ) {
      data.append(
        "email",
        this.state.email ? this.state.email.toLowerCase() : ""
      );
      EmailAddressAdded({ email_address: this.state.email, session_id: "" });
      signIn(this, data);
    } else if (this.state.text && this.state.isVerificationRequired) {
      data.append(
        "email",
        this.state.email ? this.state.email.toLowerCase() : ""
      );
      data.append("otp_token", this.state.text);

      this.props.verifyUser(this, data);
    }
  };

  render() {
    return (
      <div className="sign-in-modal">
        <Form onValidSubmit={this.onValidSubmit} ref={(el) => (this.form = el)}>
          <div className="ob-modal-body-wrapper">
            <div
              className={`ob-modal-body-1 sign-in ${
                this.state.isVerificationRequired &&
                this.props.activemodal === "verifyCode"
                  ? "verification-code"
                  : ""
              }`}
            >
              {/* {console.log("ACTVIVEMODAL",this.props.activemodal)} */}
              {!this.state.isVerificationRequired ||
              this.props.activemodal === "signIn" ? (
                <>
                  <FormElement
                    className={`inter-display-regular f-s-16 lh-20 ob-modal-signin-text`}
                    valueLink={this.linkState(this, "email")}
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Please enter a valid email id",
                      },
                      // {
                      //   validate: FormValidator.isEmail,
                      //   message: "Please enter valid email id",
                      // },
                      {
                        validate: () => {
                          let isvalid = FormValidator.isEmail(this.state.email);

                          if (
                            !isvalid &&
                            this.state.prevEmail !== this.state.email
                          ) {
                            InvalidEmail({
                              email_address: this.state.email,
                            });
                            this.setState({ prevEmail: this.state.email });
                          }
                          return isvalid;
                        },
                        message: "Please enter a valid email id",
                      },
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Your email",
                      },
                    }}
                    classes={{
                      inputField: `${this.state.emailError && `email-error`}`,
                    }}
                    isCancel={true}
                  />
                  {this.state.emailError ? (
                    <span className="email-not-found">
                      <Image
                        src={EmailNotFoundCross}
                        onClick={() => this.setState({ emailError: false })}
                        style={{ cursor: "pointer" }}
                      />
                      <p className="inter-display-medium f-s-16 lh-19">
                        Email not found
                      </p>
                    </span>
                  ) : (
                    ""
                  )}
                </>
              ) : (
                <FormElement
                  className={`inter-display-regular f-s-16 lh-20 ob-modal-signin-text`}
                  valueLink={this.linkState(this, "text")}
                  required
                  validations={[
                    {
                      validate: FormValidator.isRequired,
                      message: "Field cannot be empty",
                    },
                  ]}
                  control={{
                    type: CustomTextControl,
                    settings: {
                      placeholder: "Verification code",
                    },
                  }}
                  hideOnblur={true}
                />
              )}
            </div>
          </div>
          <CustomButton
            className={`primary-btn send-verification ${
              this.state.email || this.state.text ? "" : "inactive-state"
            }`}
            type={"submit"}
            buttonText={
              !this.state.isVerificationRequired ||
              this.props.activemodal === "signIn"
                ? "Send verification"
                : "Enter code"
            }
            isDisabled={!this.state.email}
          />
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  OnboardingState: state.OnboardingState,
});
const mapDispatchToProps = {
  verifyUser,
};
SignIn.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
