import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from "react-redux";

class LocationMaster extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() { }

  render() {
    return (
      <div>LocationMaster Component {this.props.locationMasterState}</div>
    )
  }
}

const mapStateToProps = state => ({
  locationMasterState: state.LocationMasterState
});
const mapDispatchToProps = {
  // getPosts: fetchPosts
}
LocationMaster.propTypes = {
  // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(LocationMaster);