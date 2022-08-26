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
            email: ""
        }
        // this.onClose = this.onClose.bind(this);   
    }

    componentDidMount() { }

    setValue = (value) => {
        this.setState({ value });
        ReactDOM.findDOMNode(this.form).dispatchEvent(new Event("submit"));
    };

    onValidSubmit = (done, event) => {
        // console.log('hey', event);
        console.log("Value submitted" + this.state.value);
        console.log("Form Submitted" + this.state.name);
    };

    render() {

        return (
            <Form onValidSubmit={this.onValidSubmit} ref={el => this.form = el}>
                <Container>
                    <Row className="show-grid">
                        <Col md={12}>
                            <FormElement
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
                                        placeholder: "Your Email"
                                    }
                                }}
                            />
                        </Col>
                        <Col className='ob-modal-verification' md={12}>
                            <CustomButton className="inter-display-semi-bold black-btn ob-modal-verification-btn" type={"submit"} handleClick={() => { this.setValue("now") }} variant="success" buttonText="Send Verification" />
                            {/* <CustomButton handleClick={() => { this.setValue("later") }} buttonText="Later" /> */}
                        </Col>
                    </Row>
                </Container>
            </Form>

        )
    }
}

const mapStateToProps = state => ({
    // homeState: state.HomeState
});
const mapDispatchToProps = {
    // getPosts: fetchPosts
}
SignIn.propTypes = {
    // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);