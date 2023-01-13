import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";

class Cohort extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() { }

    render() {
        return (
            <div>Cohort Component {this.props.cohortState}</div>
        )
    }
}

const mapStateToProps = state => ({
    cohortState: state.CohortState
});
const mapDispatchToProps = {
    // getPosts: fetchPosts
}
Cohort.propTypes = {
    // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Cohort);