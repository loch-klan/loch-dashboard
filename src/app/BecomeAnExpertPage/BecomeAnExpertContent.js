import { Component } from "react";

import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import {
  BackArrowSmartMoneyIcon,
  BecomeAnExpertEmailIcon,
  BecomeAnExpertTelegramIcon,
  BecomingAnExpertSunglassesIcon,
  BecomingAnExpertUploadIcon,
  BecomingAnExpertWalletIcon,
} from "../../assets/images/icons";
import { getUser } from "../common/Api";
import CheckboxCustomTable from "../common/customCheckboxTable";
import "./_becomeAnExpertPage.scss";
import TopWalletAddressList from "../header/TopWalletAddressList";
import { mobileCheck } from "../../utils/ReusableFunctions";

class BecomeAnExpertContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: mobileCheck(),
    };
  }

  render() {
    return (
      <div className="becomne-an-expert-page inter-display-medium">
        <div className="becomne-an-expert-page-block-top-gradient" />
        <div
          className={`go-back-btn-container-page ${
            this.state.isMobile ? "go-back-btn-container-page-mobile" : ""
          }`}
        >
          <TopWalletAddressList
            history={this.props.history}
            showBackBtn
            apiResponse={(e) => () => {}}
            showpath
            currentPage={"schedule-a-call"}
            hideShare
            noHomeInPath
          />
        </div>
        <div className="becomne-an-expert-page-block">
          <div className="bae-info">
            <div className="bae-info-steps">
              <div className="bae-is-step-visual">
                <div
                  className={`bae-is-step ${
                    this.props.curStep === 1 ? "bae-is-step-active" : ""
                  }`}
                />
                <div
                  className={`bae-is-step ${
                    this.props.curStep === 2 ? "bae-is-step-active" : ""
                  }`}
                />
              </div>
              <div className="bae-is-step-text">
                Step {this.props.curStep} of 2
              </div>
            </div>
            <div className="bae-info-explain">
              <Image
                className="bae-ie-icon"
                src={BecomingAnExpertSunglassesIcon}
              />
              <div className="bae-ie-title">Becoming an Expert</div>
              <div className="bae-ie-desc">
                Tell us a little about yourself. We'll use
                {this.props.isMobile ? " " : <br />}
                this to review your application
              </div>
            </div>
          </div>
          <div className="bae-data">
            {this.props.curStep === 1 ? (
              <>
                <div className="bae-data-block">
                  <div className="bae-db-title">The Basics</div>
                  <div className="bae-db-desc">Connect wallets</div>
                  <div className="bae-db-wallet-btn">
                    <Image
                      className="bae-db-wallet-icon"
                      src={BecomingAnExpertWalletIcon}
                    />
                    <span>Connect wallet</span>
                  </div>
                  <div className="bae-input-block">
                    <div className="bae-ib-title">Email</div>
                    <div className="bae-ib-input-container">
                      <input
                        value={this.props.userEmail}
                        onChange={this.props.onUserEmailChange}
                        onKeyDown={this.props.stepOneOnKeyDown}
                        className="inter-display-medium bae-ib-input"
                        placeholder="Enter here"
                      />
                    </div>
                  </div>
                  <div className="bae-input-block">
                    <div className="bae-ib-title">Name (optional)</div>
                    <div className="bae-ib-input-container">
                      <input
                        value={this.props.userName}
                        onChange={this.props.onUserNameChange}
                        onKeyDown={this.props.stepOneOnKeyDown}
                        className="inter-display-medium bae-ib-input"
                        placeholder="Name"
                      />
                    </div>
                  </div>
                  <div className="bae-input-block">
                    <div className="bae-ib-title">
                      Social account (optional)
                    </div>
                    <div className="bae-ib-input-container">
                      <input
                        value={this.props.userSocialAccount}
                        onChange={this.props.onUserSocialAccountChange}
                        onKeyDown={this.props.stepOneOnKeyDown}
                        className="inter-display-medium bae-ib-input"
                        placeholder="Twitter, youtube, twitch, Linked In"
                      />
                    </div>
                  </div>
                  <div className="bae-input-block">
                    <div className="bae-ib-title">Profile Image (optional)</div>
                    <div className="bae-ib-btn-container">
                      <Image
                        className="bae-ib-btn"
                        src={BecomingAnExpertUploadIcon}
                      />
                    </div>
                  </div>
                </div>
                <div className="bae-data-btns">
                  <button
                    onClick={this.props.goBack}
                    className="bae-db-btn bae-db-backbtn inter-display-medium"
                  >
                    <Image
                      className="bae-db-backbtn-icon"
                      src={BackArrowSmartMoneyIcon}
                    />
                    <div>Go back</div>
                  </button>
                  <button
                    className={`bae-db-btn bae-db-nextbtn inter-display-medium ${
                      this.props.isNextDisabled ? "bae-db-btn-disabled" : ""
                    }`}
                    onClick={this.props.goToSecondStep}
                  >
                    <span>Next</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="bae-data-block">
                  <div className="bae-db-title">More about you</div>
                  <div className="bae-input-block">
                    <div className="bae-ib-title">
                      Describe your expertise (optional)
                    </div>
                    <div className="bae-ib-input-container">
                      <textarea
                        value={this.props.userExpertise}
                        onChange={this.props.onUserExpertiseChange}
                        className="inter-display-medium bae-ib-input bae-ib-text-area"
                        placeholder="Twitter, youtube, twitch, Linked In"
                      />
                    </div>
                  </div>
                  <div className="bae-input-block">
                    <div className="bae-ib-title">What’s your hourly rate?</div>
                    <div className="bae-ib-input-container">
                      <input
                        value={this.props.userHourlyRate}
                        onChange={this.props.onUserHourlyRateChange}
                        onKeyDown={this.props.stepTwoOnKeyDown}
                        className="inter-display-medium bae-ib-input"
                        placeholder="$100"
                      />
                    </div>
                  </div>
                  <div className="bae-input-block">
                    <div className="bae-ib-title">
                      What’s your experience? Why do people want to talk to you?
                    </div>
                    <div className="bae-ib-input-container">
                      <textarea
                        value={this.props.userExperience}
                        onChange={this.props.onUserExperienceChange}
                        className="inter-display-medium bae-ib-input bae-ib-text-area"
                        placeholder="Twitter, youtube, twitch, Linked In"
                      />
                    </div>
                  </div>
                  <div className="bae-input-block">
                    <div className="bae-ib-title">
                      How should we contact you if someone is interested?
                    </div>
                    <div
                      style={{
                        marginTop: "2rem",
                      }}
                      className="bae-ib-check-container"
                    >
                      <div className="bae-ib-check">
                        <CheckboxCustomTable
                          handleOnClick={this.props.toggleEmailCheckBox}
                          isChecked={this.props.isEmailChecked}
                          passedClass="bae-ib-check-box"
                          passedClassChecked="bae-ib-check-box-checked"
                        />
                        <Image
                          className="bae-ib-check-image"
                          src={BecomeAnExpertEmailIcon}
                        />
                        <div className="bae-ib-check-text">Email</div>
                      </div>
                    </div>
                    <div className="bae-ib-check-container">
                      <div className="bae-ib-check">
                        <CheckboxCustomTable
                          handleOnClick={this.props.toggleTelegramCheckBox}
                          isChecked={this.props.isTelegramChecked}
                          passedClass="bae-ib-check-box"
                          passedClassChecked="bae-ib-check-box-checked"
                        />
                        <Image
                          className="bae-ib-check-image"
                          src={BecomeAnExpertTelegramIcon}
                        />
                        <div className="bae-ib-check-text">Telegram</div>
                      </div>
                      <div
                        className={`bae-ib-check-input-container ${
                          this.props.isTelegramChecked
                            ? ""
                            : "bae-ib-check-input-container-disable"
                        }`}
                      >
                        <input
                          value={this.props.userTelegramHandle}
                          onChange={this.props.onUserTelegramHandleChange}
                          onKeyDown={this.props.stepTwoOnKeyDown}
                          className="inter-display-medium bae-ib-input"
                          placeholder="Enter your handle here"
                          disabled={!this.props.isTelegramChecked}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bae-data-btns">
                  <button
                    onClick={this.props.goToFirstStep}
                    className="bae-db-btn bae-db-backbtn inter-display-medium"
                  >
                    <Image
                      className="bae-db-backbtn-icon"
                      src={BackArrowSmartMoneyIcon}
                    />
                    <div>Go back</div>
                  </button>
                  <button
                    className={`bae-db-btn bae-db-nextbtn inter-display-medium 
                   ${this.props.isDoneDisabled ? "bae-db-btn-disabled" : ""}
                    `}
                    onClick={this.props.goToBecomeAnExpertCompletePage}
                  >
                    <span>Done</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({});

const mapDispatchToProps = { getUser };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BecomeAnExpertContent);
