import React from 'react';
import PropTypes from 'prop-types';
import {
    BaseReactComponent, Form, FormElement, FormSubmitButton, CustomTextControl, FormValidator, SelectControl
} from '../../utils/form';
import { CustomModal } from "../common";
import { Col, Row, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { getVehiclesForOrderApi, reassignVehicleOrder } from './Api';

class AssignBike extends BaseReactComponent {
    constructor(props) {
        super(props);
        this.state = {
            bikeList: [],
            vehicleOptions: []
        }
    }

    componentDidMount() {
        getVehiclesForOrderApi(this.props.bookingId, this)
    }

    onSubmit = () => {
        this.props.reAssignBike(this.state.bikeId);
    }

    render() {
        return (
            <CustomModal
                show={this.props.show}
                onHide={() => this.props.handleClose()}
                title={"Assign Bike"}
                modalClass={"assign-bike"}
            >
                <Form onValidSubmit={this.onSubmit}>
                    <div className='modal-wrapper '>
                        <Col md={12}>
                            <FormElement
                                valueLink={this.linkState(this, "bikeId")}
                                label="Select Bike"
                                required
                                validations={[
                                    {
                                        validate: FormValidator.isRequired,
                                        message: "Bike cannot be empty"
                                    },
                                ]}
                                control={{
                                    type: SelectControl,
                                    settings: {
                                        placeholder: "Select Bike",
                                        options: this.state.vehicleOptions,
                                        multiple: false,
                                        searchable: true,
                                        onChangeCallback: (onBlur) => {
                                            onBlur(this.state.bikeId);
                                        }
                                    }
                                }}
                            />
                        </Col>
                    </div>
                    <div className="submit-wrapper" style={{ justifyContent: 'center' }}>
                        <FormSubmitButton customClass={`btn black-btn ${!this.state.bikeId && "inactive-btn"}`}>Assign</FormSubmitButton>
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
export default connect(mapStateToProps, mapDispatchToProps)(AssignBike);