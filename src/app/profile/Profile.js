import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() { }

    render() {
        return (
            <div>Profile Component</div>
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