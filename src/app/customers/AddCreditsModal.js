import React from 'react';
import PropTypes from 'prop-types';
import {
    BaseReactComponent, Form, FormElement, FormSubmitButton, CustomTextControl, FormValidator, SelectControl
} from '../../utils/form';
import { CustomModal } from "../common";
import { Col, Row, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { addRewardsApi } from './Api';

class AddCreditsModal extends BaseReactComponent {
    constructor(props) {
        super(props);
        this.state = {
            credits: ""
        }
    }

    componentDidMount() { }

    onSubmit = () => {
        const data = new URLSearchParams();
        data.append("customer_id", this.props.creditUserId);
        data.append("reward_amount", this.state.credits);
        data.append("reward_message", this.state.creditsMessage);

        addRewardsApi(data, this.props.handleClose);
    }

    render() {
        return (
            <CustomModal
                show={this.props.show}
                onHide={() => this.props.handleClose()}
                title={"Add Rewards"}
            >
                <Form onValidSubmit={this.onSubmit}>
                    <div className='modal-wrapper'>
                        <Col md={12}>
                            <FormElement
                                valueLink={this.linkState(this, "credits")}
                                label="Credits (in rupees)"
                                required
                                validations={[
                                    {
                                        validate: FormValidator.isRequired,
                                        message: "Credits cannot be empty"
                                    },
                                    {
                                        validate: FormValidator.isPositiveInt,
                                        message: "Credits cannot be negative"
                                    },
                                ]}
                                control={{
                                    type: CustomTextControl,
                                    settings: {
                                        placeholder: "Enter Credits",
                                    }
                                }}
                            />
                            <FormElement
                                valueLink={this.linkState(this, "creditsMessage")}
                                label="Message"
                                required
                                validations={[
                                    {
                                        validate: FormValidator.isRequired,
                                        message: "Credits cannot be empty"
                                    },
                                ]}
                                control={{
                                    type: CustomTextControl,
                                    settings: {
                                        placeholder: "Enter Credits",
                                    }
                                }}
                            />
                        </Col>
                    </div>
                    <div className="submit-wrapper" style={{ justifyContent: 'right' }}>
                        <FormSubmitButton customClass={`btn black-btn ${!this.state.credits && "inactive-btn"}`}>Done</FormSubmitButton>
                    </div>
                </Form>
            </CustomModal>
        )
    }
}

const mapStateToProps = state => ({
    ...state
});

const mapDispatchToProps = {
    // getPosts: fetchPosts
}

export default connect(mapStateToProps, mapDispatchToProps)(AddCreditsModal);