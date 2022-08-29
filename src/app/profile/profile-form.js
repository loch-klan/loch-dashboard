import React from "react";
import { Form, FormElement, FormValidator, CustomTextControl, FormSubmitButton } from '../../utils/form'
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import profileInfoIcon from "../../image/ProfileInfoIcon.png"
import CustomButton from "../../utils/form/CustomButton";
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import ReactDOM from 'react-dom';

class ProfileForm extends BaseReactComponent{

    constructor(props) {
        super(props);
        this.state = {
            name:"",
            lastname:"",
            email: "",
            mobilenumber:""
        }
        // this.onClose = this.onClose.bind(this);   
    }
    componentDidMount() { }

    setValue = (value) => {
        console.log(this.state)
        console.log(value)
        this.setState({ value });
        this.setState({
            name:"",
            lastname:"",
            email: "",
            mobilenumber:""
        })
    };

    onValidSubmit = (done, event) => {
        console.log("Value submitted" + this.state.value);
        console.log("Form Submitted" + this.state.name);
    };
    render(){
        return (
            <div className='profile-form'>

                <div className='form-title'>
                    <Image src={profileInfoIcon} />
                    <p className='inter-display-semi-bold '>Basic Information</p>
                </div>
                <div className='form'>
                    <Form onValidSubmit={this.onValidSubmit} >
                        <Row>
                            <Col md={4}>
                                <FormElement
                                    valueLink={this.linkState(this, "name")}
                                    label="First Name"
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
                                            placeholder: "John",
                                        }
                                    }}


                                />
                            </Col>
                            <Col md={4}>
                                <FormElement
                                    valueLink={this.linkState(this, "lastname")}
                                    label="Last Name"
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
                                            placeholder: "Doe",
                                        }
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={8}>
                                <FormElement
                                    valueLink={this.linkState(this, "email")}
                                    label="Email"
                                    required
                                    validations={[
                                        {
                                            validate: FormValidator.isRequired,
                                            message: "Field cannot be empty"
                                        },
                                        {
                                            validate: FormValidator.isEmail,
                                            message: "Please enter a valid email"
                                        },
                                    ]}
                                    control={{
                                        type: CustomTextControl,
                                        settings: {
                                            placeholder: "john@loch.one",
                                        }
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={4}>
                                <FormElement
                                    valueLink={this.linkState(this, "mobilenumber")}
                                    label="Mobile Number"
                                    required
                                    validations={[
                                        {
                                            validate: FormValidator.isRequired,
                                            message: "Field cannot be empty"
                                        },
                                        {
                                            validate: FormValidator.isPhone,
                                            message: "Please enter a valid mobile number"
                                        },
                                    ]}
                                    control={{
                                        type: CustomTextControl,
                                        settings: {
                                            placeholder: "(217) 331 - 1312",
                                        }
                                    }}
                                />
                            </Col>
                        </Row>

                        <Button className="grey-btn submit-button" onClick={()=>{
                            this.setValue(this.state)
                        }}>
                            Save changes
                        </Button>

                    </Form>
                </div>
            </div>
        )
    }
}

export default ProfileForm;