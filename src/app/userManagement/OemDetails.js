import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dealer from './Dealer';
class OemDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  componentDidMount() { }
  render() {
    return (
      <div className="oem-details-wrapper">
        <div className="top">
          <h1 className="red-hat-display-bold f-s-24">Ola - OEM</h1>
          <div className="items-wrapper">
            <div className="item">
              <h5>Name</h5>
              <h6>Amar Sawant</h6>
            </div>
            <div className="item">
              <h5>Email</h5>
              <h6>dharmik@emiail.com</h6>
            </div>
            <div className="item">
              <h5>Contact Number</h5>
              <h6>98989898998</h6>
            </div>
            <div className="item">
              <h5>Location</h5>
              <h6>Mumbai - Maharashtra</h6>
            </div>
          </div>
        </div>
        <Dealer />
      </div>
    )
  }
}
const mapStateToProps = state => ({
  ...state
});
const mapDispatchToProps = {
  // getPosts: fetchPosts
}
export default connect(mapStateToProps, mapDispatchToProps)(OemDetails);