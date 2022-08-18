import React, { Component } from 'react';
import { connect } from "react-redux";
import { Image } from 'react-bootstrap';
import profileImage from '../../assets/images/profile.png';
import defaultProfilePic from '../../assets/images/profile.svg';
import hamburger from '../../assets/images/icons/hamburger-icon.svg';
import { setCommonReducer } from './CommonAction';
import { getUserAccountType } from '../../utils/ManageToken';
import { AccountType } from '../../utils/Constant';

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() { }

  sidebarHandle = () => {
    this.props.setCommonReducer({
      isSidebarOpen: true,
    });
  }

  render() {
    let userDetails = JSON.parse(localStorage.getItem('userDetails'));
    return (
      <div className='custom-navbar'>
        <Image src={hamburger} className='hamburger' onClick={this.sidebarHandle} />
        <div className='profile-wrapper'>
          <Image src={defaultProfilePic} className='profile-picture' />
          <div className='name-wrapper'>
            <h3 className='red-hat-display-bold f-s-14'>{userDetails.first_name}</h3>
            <h4 className='red-hat-display-regular grey-999'>{AccountType.getText(getUserAccountType())}</h4>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  commonState: state.CommonState
});
const mapDispatchToProps = {
  setCommonReducer
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);