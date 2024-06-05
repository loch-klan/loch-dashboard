import React, { Component } from "react";
import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import {
  PasswordPurpleIcon,
  PremiumBannerCheckCircleIcon,
  PremiumBannerDiamondIcon,
  UserCreditScrollRightArrowIcon,
} from "../../assets/images/icons/index.js";
import ProfileLochCreditPoints from "../profile/ProfileLochCreditPoints.js";

class AddAddressProfileMobile extends Component {
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
            isMobile
            dontCallApis
          />
          <div className="profile-section-loch-premium-banner profile-section-loch-premium-banner-mobile">
            <div className="pslpl-heading">
              <Image className="pslpl-icon" src={PremiumBannerDiamondIcon} />
              <div className="inter-display-medium pslpl-text">
                Loch Premium
              </div>
            </div>

            <div className="profile-section-loch-premium">
              <div className="pslp-left">
                <div className="pslpl-conent">
                  {this.props.premiumBannerItems.map((itemBlock, index) => (
                    <div key={index} className="pslpl-item-block">
                      <Image
                        className="pslpl-item-block-icon"
                        src={itemBlock.icon}
                      />
                      <div className="inter-display-medium pslpl-item-block-text">
                        {itemBlock.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pslp-right">
                <div className="pslpr-desc">Not a member yet</div>
                <div className="pslpr-heading">
                  Join Loch Premium and enjoy
                  <br />
                  exclusive benefits
                </div>
                <button
                  onClick={this.props.upgradeNowBtnClick}
                  className="pslpr-btn"
                >
                  Upgrade now
                </button>
              </div>
            </div>
          </div>
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
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddAddressProfileMobile);
