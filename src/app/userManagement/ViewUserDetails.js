import React, { Component } from 'react';
import { Col, Row, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { ComponentHeader } from '../common';

class ViewUserDetails extends Component {
    constructor(props) {
        super(props);
        const userData = props.location.state ? props.location.state.data : null;
        this.state = {
            userData: userData,
            showAddCreditsModal: false
        }
    }
    componentDidMount() { }

    handleAddCredits = (userId = null) => {
        this.setState({
            showAddCreditsModal: !this.state.showAddCreditsModal,
            creditUserId: userId
        });
    }

    render() {
        const userData = this.state.userData;
        return (
            <>
                <ComponentHeader
                    backArrowBtn={true}
                    history={this.props.history}
                    title={"View User Details"}
                />
                

                <div className="add-edit-customer-wrapper">
                    <div className="content view-detail-page">
                        <div className="basic-details">
                            <h2>Basic Details</h2>
                            <Row>
                                <Col sm={3} xs={12}>
                                    <div className="detail">
                                        <h4 className="regular">User Name</h4>
                                        <h3 className="regular lg">{userData ?.first_name ?? "-"} {" "}
                                            {userData ?.last_name ?? ""}</h3>
                                    </div>
                                </Col>
                                <Col sm={3} xs={12}>
                                    <div className="detail">
                                        <h4 className="regular">Email</h4>
                                        <h3 className="regular lg">{userData ?.email ?? "-"}</h3>
                                    </div>
                                </Col>
                                <Col sm={3} xs={12}>
                                    <div className="detail">
                                        <h4 className="regular">Mobile</h4>
                                        <h3 className="regular lg">{userData ?.mobile ?? "-"}</h3>
                                    </div>
                                </Col>
                                <Col sm={3} xs={12}>
                                    <div className="detail">
                                        <h4 className="regular">Gender</h4>
                                        <h3 className="regular lg">{userData ?.gender ?? "-"}</h3>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
const mapStateToProps = state => ({
    ...state
});
const mapDispatchToProps = {
    // getPosts: fetchPosts
}
export default connect(mapStateToProps, mapDispatchToProps)(ViewUserDetails);