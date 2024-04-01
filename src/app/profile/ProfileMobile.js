import React, { Component } from "react";
import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import {
  PasswordIcon,
  UserCreditScrollRightArrowIcon,
  UserProfileMobileIcon,
} from "../../assets/images/icons";
import Wallet from "../wallet/Wallet";
import ProfileForm from "./ProfileForm";
import ProfileLochCreditPoints from "./ProfileLochCreditPoints";

class ProfileMobile extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="profile-page-section profile-page-mobile">
        <div
          style={{
            marginTop: "0rem",
          }}
          className="profile-section"
        >
          <div className="mobile-header-container">
            <h4>Profile</h4>
            <p>Manage your profile here</p>
          </div>
          <ProfileLochCreditPoints
            followFlag={this.props.followFlag}
            isUpdate={this.props.isUpdate}
            history={this.props.history}
            lochUser={this.props.lochUser}
          />
          {this.props.lochUser && this.props.lochUser.email ? (
            <div
              onClick={this.props.goToMyReferralCodes}
              className="profile-section-referall-code-btn"
            >
              <div className="psrcb-left">
                <Image className="psrcb-icon" src={PasswordIcon} />
                <div className="inter-display-medium psrcb-text">
                  My Referral Codes
                </div>
              </div>
              <Image
                className="psrcb-arrow-icon"
                src={UserCreditScrollRightArrowIcon}
              />
            </div>
          ) : null}
          <Wallet
            isMobileDevice
            hidePageHeader={true}
            isUpdate={this.props.isUpdate}
            updateTimer={this.props.updateTimer}
          />
          <div className="profile-form-section">
            <div className="mobile-header-container-with-image">
              <Image
                className="mobile-header-container-image"
                src={UserProfileMobileIcon}
              />
              <div className="mobile-header-container">
                <h4>Your details</h4>
              </div>
            </div>
            <ProfileForm />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = () => ({});
const mapDispatchToProps = {};
ProfileMobile.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileMobile);
