import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import Sidebar from '../common/Sidebar';
import ProfileForm from './ProfileForm';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() { }

    render() {
        return (
            <div className="profile-page-section">
                {/* <Sidebar ownerName="" /> */}
                <div className='profile-form-section'>
                    <h4 className='inter-display-medium title f-s-31' >Profile</h4>
                    <p className='f-s-16 inter-display-medium'>Manage your profile here</p>
                    <ProfileForm/>
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