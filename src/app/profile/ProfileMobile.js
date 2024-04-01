import React, { Component } from "react";
import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import {
  PasswordIcon,
  PasswordPurpleIcon,
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

          <div
            onClick={this.props.goToMyReferralCodes}
            className="profile-section-referall-code-btn"
          >
            <div className="psrcb-left">
              <Image className="psrcb-icon" src={PasswordPurpleIcon} />
              <div className="inter-display-medium psrcb-text">
                Referral codes
              </div>
            </div>
            <div className="psrcb-right">
              {this.props.codesLeftToUse ? (
                <div className="inter-display-medium psrcb-small-text">
                  {this.props.codesLeftToUse} left
                </div>
              ) : null}
              <Image
                className="psrcb-arrow-icon"
                src={UserCreditScrollRightArrowIcon}
              />
            </div>
          </div>
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
