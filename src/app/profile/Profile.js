import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import Sidebar from '../common/Sidebar';
import WelcomeCard from '../Portfolio/WelcomeCard';
class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() { }

    render() {
        return (
            <div>
                {/* <Sidebar ownerName="Vitalik Buterin’s"/> */}
                {/* <div> */}
                <WelcomeCard />
                {/* </div> */}
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