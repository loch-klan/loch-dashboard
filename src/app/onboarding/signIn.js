import React from 'react';
import { connect } from "react-redux";
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import ReactDOM from 'react-dom';
import CustomButton from "../../utils/form/CustomButton";
import CustomTextControl from "../../utils/form/CustomTextControl";
import Form from "../../utils/form/Form";
import FormElement from "../../utils/form/FormElement";
import FormValidator from "../../utils/form/FormValidator";
import { Col, Container, Row } from 'react-bootstrap';

class SignIn extends BaseReactComponent {
    constructor(props) {
        super(props);
        this.state = {
            showModal: true,
            signIn: false,
            email: "",
            isVerificationRequired: props.isVerificationRequired
        }
    }

    componentDidMount() { }

    setValue = (value) => {
        this.setState({ value });
        ReactDOM.findDOMNode(this.form).dispatchEvent(new Event("submit"));
    };

    onValidSubmit = (done, event) => {
        console.log("Value submitted" + this.state.email);
    };

    render() {

        return (
            <Form onValidSubmit={this.onValidSubmit} ref={el => this.form = el}>
                <Container>
                    <Row className="show-grid">
                        <Col md={12} className="sign-in-container">
                            <FormElement
                                className="inter-display-regular f-s-16 lh-20 ob-modal-signin-text"
                                valueLink={this.linkState(this, this.state.isVerificationRequired ? "text" : "email")}
                                // required
                                // validations={[
                                //     {
                                //         validate: FormValidator.isRequired,
                                //         message: "Field cannot be empty"
                                //     },
                                //     !this.state.isVerificationRequired ? {
                                //         validate: FormValidator.isEmail,
                                //         message: "Please enter valid email id"
                                //     } : null
                                // ]}

                                control={{
                                    type: CustomTextControl,
                                    settings: {
                                        placeholder: !this.state.isVerificationRequired ? "Your Email" : "Verification code"
                                    }
                                }}
                            />
                        </Col>
                        <Col className='ob-modal-verification' md={12}>
                            <CustomButton className="primary-btn" type={"submit"} variant="success" buttonText={!this.state.isVerificationRequired ? "Send Verification" : "Enter Code"} />
                        </Col>
                    </Row>
                </Container>
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