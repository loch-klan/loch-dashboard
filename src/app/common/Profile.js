import React, { Component, Fragment } from 'react';
import { Col, Grid, Image, Row } from "react-bootstrap";
import { connect } from "react-redux";
import defaultProfilePic from '../../assets/images/profile.svg';
import { AccountType } from '../../utils/Constant';
import { getUserAccountType } from '../../utils/ManageToken';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            changePassword: false,
            editProfile: false
        }
    }

    componentDidMount() {
    }

    render() {
        let userDetails = JSON.parse(localStorage.getItem('userDetails'));
        return (
            <Fragment>
                <div>
                    <section className="profile">
                        <Row>
                            <Col sm={12}>
                                <div className="photo-wrapper">
                                    <div className="p-c-wrapper">
                                        {

                                            <Image src={defaultProfilePic} className="profile-pic" responsive />
                                        }
                                    </div>
                                    <h1>{userDetails.first_name}</h1>
                                    <h6>Role - {AccountType.getText(getUserAccountType())}</h6>
                                </div>
                            </Col>
                        </Row>

                    </section>
                </div>
            </Fragment >
        )
    }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = {
}


export default connect(mapStateToProps, mapDispatchToProps)(Profile);