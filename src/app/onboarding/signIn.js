import React from 'react';
import { connect } from "react-redux";
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import ReactDOM from 'react-dom';
import CustomButton from "../../utils/form/CustomButton";
import CustomTextControl from "../../utils/form/CustomTextControl";
import Form from "../../utils/form/Form";
import FormElement from "../../utils/form/FormElement";
import { Col, Container, Row } from 'react-bootstrap';
import {signIn,verifyUser }from './Api.js'
import FormValidator from '../../utils/form/FormValidator';
class SignIn extends BaseReactComponent {
    constructor(props) {
        super(props);
        this.state = {
            showModal: true,
            signIn: false,
            email: "",
            isVerificationRequired: props.isVerificationRequired,
            text:"",
            isVallidSignIn:false,
            activemodal : props.activemodal,
            signinReq:props.signinReq
        }
    }

    componentDidMount() { }

    setValue = (value) => {
        this.setState({ value });
        ReactDOM.findDOMNode(this.form).dispatchEvent(new Event("submit"));
    };

    onValidSubmit = (done, event) => {
      console.log(event.target)
      console.log("verificationReq",this.state.isVerificationRequired)
        console.log("Value submitted" + this.state.email);
        const data = new URLSearchParams()
        if(this.state.email && !this.state.isVerificationRequired|| this.props.activemodal==="signIn"){
            
            data.append("email",this.state.email)
            signIn(this,data)
        } else if (this.state.text && this.state.isVerificationRequired){
            data.append("email",this.state.email)
            data.append("otp_token",this.state.text)
            verifyUser(this,data)
        }
      };

    render() {

        return (
            <Form onValidSubmit={this.onValidSubmit} ref={el => this.form = el}>
              <div className='ob-modal-body-wrapper'>
                <div
                  className={`ob-modal-body-1 sign-in ${this.state.isVerificationRequired && this.props.activemodal ==="verifyCode"? "verification-code" : ""}`}
                >
                    {console.log("ACTVIVEMODAL",this.props.activemodal)}
                  {
                    !this.state.isVerificationRequired || this.props.activemodal === "signIn"
                      ?
                      <FormElement
                        className={`inter-display-regular f-s-16 lh-20 ob-modal-signin-text`}
                        valueLink={this.linkState(this, "email")}
                        required
                        validations={[
                          {
                            validate: FormValidator.isRequired,
                            message: "Field cannot be empty"
                          },
                          {
                            validate: FormValidator.isEmail,
                            message: "Please enter valid email id"
                          }
                        ]}
                        control={{
                          type: CustomTextControl,
                          settings: {
                            placeholder: "Your email"
                          }
                        }}
                      />
                            :
                              <FormElement
                                className={`inter-display-regular f-s-16 lh-20 ob-modal-signin-text`}
                                valueLink={this.linkState(this, "text")}
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
                                        placeholder: "Verification code"
                                    }
                                }}
                            />
                          }
                          </div>
                          </div>
                            <CustomButton className={`primary-btn send-verification ${(this.state.email || this.state.text) ? "" : "inactive-state"}`} type={"submit"} buttonText={!this.state.isVerificationRequired || this.props.activemodal ==="signIn"  ? "Send verification" :"Enter code"} />
            </Form>

        )
    }
}

const mapStateToProps = state => ({
});
const mapDispatchToProps = {
}
SignIn.propTypes = {
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);