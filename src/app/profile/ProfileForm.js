import React from "react";
import { Form, FormElement, FormValidator, CustomTextControl, FormSubmitButton } from '../../utils/form'
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import profileInfoIcon from "../../image/ProfileInfoIcon.svg"
import CustomButton from "../../utils/form/CustomButton";
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import ReactDOM from 'react-dom';
import {updateUser} from  './Api.js'
import { connect } from 'react-redux';

class ProfileForm extends BaseReactComponent{

    constructor(props) {
        super(props);
        const userDetails = JSON.parse(localStorage.getItem("lochUser"))
        this.state = {
            firstName:userDetails?.first_name || "",
            lastName:userDetails?.last_name || "",
            email: userDetails?.email || "",
            mobileNumber:userDetails?.mobile || "",
            link: userDetails?.link || localStorage.getItem("lochDummyUser") || "",
        }
        // this.onClose = this.onClose.bind(this);
    }
    componentDidMount() {
    }

    onValidSubmit = () => {
        const data = new URLSearchParams()
        data.append("first_name",this.state.firstName)
        data.append("last_name",this.state.lastName)
        data.append("email",this.state.email)
        data.append("mobile",this.state.mobileNumber)
        updateUser(data , this)
    };
    render(){
        return (
            <div className='profile-form'>

                <div className='form-title'>
                    <Image src={profileInfoIcon} className="m-r-12" />
                    <p className='inter-display-semi-bold f-s-16 lh-19'>Basic Information</p>
                </div>
                <div className='form'>
                    <Form onValidSubmit={this.onValidSubmit} >
                        <div className="m-b-13">
                        <Row>
                            <Col md={4} className="p-r-0">
                                <FormElement
                                    valueLink={this.linkState(this, "firstName")}
                                    label="First Name"
                                    control={{
                                        type: CustomTextControl,
                                        settings: {
                                            placeholder: "John",
                                        }
                                    }}
                                    classes={{
                                        inputField : this.state.firstName !== "" ? "done" : ""
                                    }
                                    }
                                />
                            </Col>
                            <Col md={4}>
                                <FormElement
                                    valueLink={this.linkState(this, "lastName")}
                                    label="Last Name"
                                    control={{
                                        type: CustomTextControl,
                                        settings: {
                                            placeholder: "Loch",
                                        }
                                    }}
                                    classes={{
                                        inputField : this.state.lastName !== "" ? "done" : ""
                                    }
                                    }
                                />
                            </Col>
                        </Row>
                        </div>
                        <div className="m-b-13">
                        <Row>
                            <Col md={8}>
                                <FormElement
                                    valueLink={this.linkState(this, "email")}
                                    label="Email"
                                    control={{
                                        type: CustomTextControl,
                                        settings: {
                                            placeholder: "john@loch.one",
                                        }
                                    }}
                                    classes={{
                                        inputField : this.state.email !== "" ? "done" : ""
                                    }
                                    }
                                />
                            </Col>
                        </Row>
                        </div>
                        <div className="m-b-13">
                        <Row>
                            <Col md={4} className="p-r-0">
                                <FormElement
                                    valueLink={this.linkState(this, "mobileNumber")}
                                    label="Mobile Number"
                                    control={{
                                        type: CustomTextControl,
                                        settings: {
                                            placeholder: "(217) 331 - 1312",
                                        }
                                    }}
                                    classes={{
                                        inputField : this.state.mobileNumber !== "" ? "done" : ""
                                    }
                                    }
                                />
                            </Col>
                        </Row>
                        </div>

                        <Button className="inter-display-semi-bold f-s-14 lh-24 black-191  submit-button" type="submit">
                            Save changes
                        </Button>

                    </Form>
                </div>
            </div>
        )
    }
}
const mapStateToProps = state => ({

});
const mapDispatchToProps = {
    updateUser
}
ProfileForm.propTypes = {

};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileForm);