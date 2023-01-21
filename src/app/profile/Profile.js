import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from "react-redux";
// import Sidebar from '../common/Sidebar';
import ProfileForm from './ProfileForm';
import PageHeader from './../common/PageHeader';
import FeedbackForm from '../common/FeedbackForm';
import { ProfilePage } from '../../utils/AnalyticsFunctions';
import { getCurrentUser } from '../../utils/ManageToken';

// add wallet
import AddWalletModalIcon from "../../assets/images/icons/wallet-icon.svg";
import FixAddModal from '../common/FixAddModal';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // add new wallet
      userWalletList: localStorage.getItem("addWallet")
        ? JSON.parse(localStorage.getItem("addWallet"))
        : [],
      addModal: false,
      isUpdate: 0,
    };
  }

  componentDidMount() {
    ProfilePage({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
  }

  // For add new address
  handleAddModal = () => {
    this.setState({
      addModal: !this.state.addModal,
    });
  };

  handleChangeList = (value) => {
    this.setState({
      // for add wallet
      userWalletList: value,
      isUpdate: this.state.isUpdate === 0 ? 1 : 0,
      
    });
  };

  render() {
    return (
      <div className="profile-page-section">
        <div className="profile-section page">
          {this.state.addModal && (
            <FixAddModal
              show={this.state.addModal}
              onHide={this.handleAddModal}
              modalIcon={AddWalletModalIcon}
              title="Add wallet address"
              subtitle="Add more wallet address here"
              modalType="addwallet"
              btnStatus={false}
              btnText="Go"
              history={this.props.history}
              changeWalletList={this.handleChangeList}
            />
          )}
          <PageHeader
            title="Profile"
            subTitle="Manage your profile here"
            btnText={"Add wallet"}
            handleBtn={this.handleAddModal}
          />
          <div className="profile-form-section">
            <ProfileForm />
          </div>
          <FeedbackForm page={"Profile Page"} />
        </div>
      </div>
    );
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