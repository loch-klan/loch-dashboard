import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    BaseReactComponent, Form, FormElement, FormSubmitButton, CustomTextControl, FormValidator, FileUploadControl, SelectControl
} from '../../utils/form';
import { CustomModal } from "../common";
import { Col, Row, Button, Image } from 'react-bootstrap';
import { API_URL, MEDIA_URL } from "../../utils/Constant";
import settleIcon from '../../assets/images/icons/settlement-icon.svg'
import { settleFranchaiseApi } from './Api';

class SettlePayment extends BaseReactComponent {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() { }

    onSubmit = () => {
        let data = new URLSearchParams();
        data.append('settlement_amount', this.props.paybleAmount);
        data.append('start_date', '01-04-2022');
        data.append('end_date', '30-09-2022');
        data.append('franchise_id', "626b7471ed1ea0b78cf25ea2");
        data.append('attachment_id', this.state.attachment.imageId);
        data.append('reference_id', this.state.transactionId);
        settleFranchaiseApi(data, this.props.handleClose);
    }

    render() {
        return (
            <CustomModal
                show={this.props.show}
                onHide={() => this.props.handleClose()}
                title={"Settle Payment"}
                modalClass={"assign-bike"}
            >
                <Form onValidSubmit={this.onSubmit}>
                    <div className='modal-wrapper'>
                        <div className="settle-amount-modal">
                            <div>
                                <Image src={settleIcon} className="settle-pay-icon" />
                            </div>
                            <div>
                                <h3>Amount</h3>
                                <h4 className="red-hat-display-bold f-s-26">₹ {this.props.paybleAmount}</h4>
                            </div>
                        </div>
                        <Col md={12}>
                            <FormElement
                                valueLink={this.linkState(this, "transactionId")}
                                label="Transaction Reference ID"
                                required
                                validations={[
                                    {
                                        validate: FormValidator.isRequired,
                                        message: "Transaction Id cannot be empty"
                                    },
                                    {
                                        validate: FormValidator.isPositiveInt,
                                        message: " Transaction Id cannot be negative"
                                    },
                                ]}
                                control={{
                                    type: CustomTextControl,
                                    settings: {
                                        placeholder: "Enter Transaction Id",
                                    }
                                }}
                            />
                            <FormElement
                                valueLink={this.linkState(this, 'attachment')}
                                label="Attachment"
                                required
                                validations={[
                                    {
                                        validate: FormValidator.isRequired,
                                        message: "File is required",
                                    },
                                ]}
                                control={{
                                    type: FileUploadControl,
                                    settings: {
                                        moduleName: "commerce",
                                        subModule: "settlement",
                                        fileType: "IMAGE",
                                        extensions: ["image/*"],
                                        maxFiles: 1,
                                        maxFileSize: 100000000,
                                        onSelect: (file, callback) => {
                                            // You will need to generate signedURL by calling API and then call callback
                                            const fileInfo = {
                                                id: file.lastModified,
                                                name: file.name,
                                                size: file.size,
                                                mimeType: file.type,
                                                path: "single.jpg",
                                            };
                                            callback(fileInfo, API_URL);
                                        },
                                    },
                                }}
                            />
                        </Col>
                    </div>
                    <div className="submit-wrapper" style={{ justifyContent: 'center' }}>
                        <FormSubmitButton customClass={`btn black-btn ${!this.state.transactionId && "inactive-btn"}`}>Settle</FormSubmitButton>
                    </div>
                </Form>
            </CustomModal >
        )
    }
}
const mapStateToProps = state => ({
    ...state
});
const mapDispatchToProps = {
    // getPosts: fetchPosts
}
export default connect(mapStateToProps, mapDispatchToProps)(SettlePayment);