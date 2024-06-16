import React, { Component } from "react";
import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import {
  PasswordIcon,
  PasswordPurpleIcon,
  PremiumBannerCheckCircleIcon,
  PremiumBannerDiamondIcon,
  UserCreditScrollRightArrowIcon,
  UserProfileMobileIcon,
} from "../../assets/images/icons";
import Wallet from "../wallet/Wallet";
import ProfileForm from "./ProfileForm";
import ProfileLochCreditPoints from "./ProfileLochCreditPoints";
import LeaveBlackIcon from "../../assets/images/icons/LeaveBlackIcon.svg";
import { resetUser } from "../../utils/AnalyticsFunctions";
import SmartMoneyMobileSignOutModal from "../smartMoney/SmartMoneyMobileBlocks/smartMoneyMobileSignOutModal";

class ProfileMobile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmLeave: false,
    };
  }
  openConfirmLeaveModal = () => {
    this.setState({
      confirmLeave: true,
    });
  };
  closeConfirmLeaveModal = () => {
    this.setState({
      confirmLeave: false,
    });
  };
  handleSignOutWelcome = () => {
    resetUser(true);
    setTimeout(() => {
      this.props.history.push("/welcome");
    }, 500);
  };
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
          />
          <div className="profile-section-loch-premium-banner profile-section-loch-premium-banner-mobile">
            <div className="pslpl-heading">
              <Image className="pslpl-icon" src={PremiumBannerDiamondIcon} />
              <div className="inter-display-medium pslpl-text">
                Loch Premium
              </div>
            </div>
            {this.props.isPremium ? (
              <div
                style={{
                  marginTop: "3rem",
                }}
                className="profile-section-loch-premium"
              >
                <div className="pslp-left">
                  <div className="pslpl-banner">
                    <div className="inter-display-medium pslpl-banner-des">
                      Exclusive benefits
                    </div>
                    <div className="pslpl-banner-heading">
                      <Image
                        src={PremiumBannerCheckCircleIcon}
                        className="pslpl-banner-heading-image"
                      />
                      <div className="inter-display-medium pslpl-banner-heading-text">
                        Activated
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pslp-right">
                  <div className="pslpl-conent">
                    {this.props.premiumBannerItems.map((itemBlock, index) => (
                      <div>
                        <div key={index} className="pslpl-item-block">
                          <Image
                            className="pslpl-item-block-icon"
                            src={itemBlock.icon}
                          />
                          <div className="inter-display-medium pslpl-item-block-text">
                            {itemBlock.text}
                          </div>
                        </div>
                        {itemBlock.text === "Platinum telegram channel" ? (
                          <>
                            <div
                              style={{
                                marginTop: "0.5rem",
                              }}
                              className="pslpl-item-block"
                            >
                              <Image
                                className="pslpl-item-block-icon"
                                src={itemBlock.icon}
                                style={{
                                  opacity: "0",
                                }}
                              />
                              <div className="pslpl-item-block-bullet-item" />
                              <div className="inter-display-medium pslpl-item-block-text">
                                <span>Over $400m liquid onchain AUM</span>
                              </div>
                            </div>
                            <div
                              style={{
                                marginTop: "0.5rem",
                              }}
                              className="pslpl-item-block"
                            >
                              <Image
                                className="pslpl-item-block-icon"
                                src={itemBlock.icon}
                                style={{
                                  opacity: "0",
                                }}
                              />
                              <div className="pslpl-item-block-bullet-item" />
                              <div className="inter-display-medium pslpl-item-block-text">
                                <span>Over 500k twitter followers</span>
                              </div>
                            </div>
                            <div
                              style={{
                                marginTop: "0.5rem",
                              }}
                              className="pslpl-item-block"
                            >
                              <Image
                                className="pslpl-item-block-icon"
                                src={itemBlock.icon}
                                style={{
                                  opacity: "0",
                                }}
                              />
                              <div className="pslpl-item-block-bullet-item" />
                              <div className="inter-display-medium pslpl-item-block-text">
                                <span>Daily trade ideas</span>
                              </div>
                            </div>
                          </>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="profile-section-loch-premium">
                <div className="pslp-left">
                  <div className="pslpl-conent">
                    {this.props.premiumBannerItems.map((itemBlock, index) => (
                      <div>
                        <div key={index} className="pslpl-item-block">
                          <Image
                            className="pslpl-item-block-icon"
                            src={itemBlock.icon}
                          />
                          <div className="inter-display-medium pslpl-item-block-text">
                            {itemBlock.text}
                          </div>
                        </div>
                        {itemBlock.text === "Platinum telegram channel" ? (
                          <>
                            <div
                              style={{
                                marginTop: "0.5rem",
                              }}
                              className="pslpl-item-block"
                            >
                              <Image
                                className="pslpl-item-block-icon"
                                src={itemBlock.icon}
                                style={{
                                  opacity: "0",
                                }}
                              />
                              <div className="pslpl-item-block-bullet-item" />
                              <div className="inter-display-medium pslpl-item-block-text">
                                <span>Over $400m liquid onchain AUM</span>
                              </div>
                            </div>
                            <div
                              style={{
                                marginTop: "0.5rem",
                              }}
                              className="pslpl-item-block"
                            >
                              <Image
                                className="pslpl-item-block-icon"
                                src={itemBlock.icon}
                                style={{
                                  opacity: "0",
                                }}
                              />
                              <div className="pslpl-item-block-bullet-item" />
                              <div className="inter-display-medium pslpl-item-block-text">
                                <span>Over 500k twitter followers</span>
                              </div>
                            </div>
                            <div
                              style={{
                                marginTop: "0.5rem",
                              }}
                              className="pslpl-item-block"
                            >
                              <Image
                                className="pslpl-item-block-icon"
                                src={itemBlock.icon}
                                style={{
                                  opacity: "0",
                                }}
                              />
                              <div className="pslpl-item-block-bullet-item" />
                              <div className="inter-display-medium pslpl-item-block-text">
                                <span>Daily trade ideas</span>
                              </div>
                            </div>
                          </>
                        ) : null}
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
            )}
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
            <ProfileForm userDetails={this.props.lochUser} />
          </div>
          {this.state.confirmLeave ? (
            <SmartMoneyMobileSignOutModal
              onSignOut={this.handleSignOutWelcome}
              onHide={this.closeConfirmLeaveModal}
              notSignedIn={!(this.props.lochUser && this.props.lochUser.email)}
            />
          ) : null}
          <div
            onClick={this.openConfirmLeaveModal}
            className="profile-section-referall-code-btn"
            style={{
              marginTop: "-1.5rem",
            }}
          >
            <div className="psrcb-left">
              <div className="inter-display-medium psrcb-text">
                {this.props.lochUser && this.props.lochUser.email
                  ? "Sign out"
                  : "Leave"}
              </div>
            </div>
            <div className="psrcb-right">
              <Image className="psrcb-arrow-icon" src={LeaveBlackIcon} />
            </div>
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
