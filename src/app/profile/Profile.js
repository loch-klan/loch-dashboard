import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import Sidebar from '../common/Sidebar';
import ProfileForm from './ProfileForm';
import PageHeader from './../common/PageHeader';
import FeedbackForm from '../common/FeedbackForm';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() { }

    render() {
        return (
            <div className="profile-page-section">
                <div className='profile-section page'>
                <PageHeader
                    title="Profile"
                    subTitle="Manage your profile here"
                />
                <div className='profile-form-section'>
                    <ProfileForm/>
                </div>
                <FeedbackForm />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    profileState: state.ProfileState
});
const mapDispatchToProps = {
    // getPosts: fetchPosts
}
Profile.propTypes = {
    // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);