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
import { mobileCheck } from "../../utils/ReusableFunctions";
import WelcomeCard from "../Portfolio/WelcomeCard";
import { getUser } from "../common/Api";
import CheckboxCustomTable from "../common/customCheckboxTable";
import MobileLayout from "../layout/MobileLayout";
import BecomeAnExpertPageMobile from "./BecomeAnExpertPageMobile";
import "./_becomeAnExpertPage.scss";

class BecomeAnExpertPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: mobileCheck(),
      curStep: 1,
      isNextDisabled: true,
      isDoneDisabled: true,
      //Step One
      userEmail: "",
      userName: "",
      userSocialAccount: "",
      //Step Two
      userExpertise: "",
      userHourlyRate: "",
      userExperience: "",
      userTelegramHandle: "",
      isEmailChecked: false,
      isTelegramChecked: false,
    };
  }
  // Step One
  stepOneOnKeyDown = (event) => {
    if (event.key === "Enter") {
      this.goToSecondStep();
    }
  };
  onUserEmailChange = (event) => {
    this.setState({
      userEmail: event.target.value,
    });
  };
  onUserNameChange = (event) => {
    this.setState({
      userName: event.target.value,
    });
  };
  onUserSocialAccountChange = (event) => {
    this.setState({
      userSocialAccount: event.target.value,
    });
  };
  // Step Two
  stepTwoOnKeyDown = (event) => {
    if (event.key === "Enter") {
      this.goToBecomeAnExpertCompletePage();
    }
  };
  onUserExpertiseChange = (event) => {
    this.setState({
      userExpertise: event.target.value,
    });
  };
  onUserHourlyRateChange = (event) => {
    this.setState({
      userHourlyRate: event.target.value,
    });
  };

  onUserExperienceChange = (event) => {
    this.setState({
      userExperience: event.target.value,
    });
  };
  onUserTelegramHandleChange = (event) => {
    this.setState({
      userTelegramHandle: event.target.value,
    });
  };
  toggleEmailCheckBox = () => {
    this.setState({
      isEmailChecked: !this.state.isEmailChecked,
    });
  };
  toggleTelegramCheckBox = () => {
    this.setState({
      isTelegramChecked: !this.state.isTelegramChecked,
    });
  };
  onHide = () => {
    this.props.getUser();
    this.props.history.push("/home");
  };
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.userEmail !== this.state.userEmail ||
      prevState.userName !== this.state.userName ||
      prevState.userSocialAccount !== this.state.userSocialAccount
    ) {
      if (
        this.state.userEmail &&
        this.state.userName &&
        this.state.userSocialAccount
      ) {
        this.setState({
          isNextDisabled: false,
        });
      } else {
        this.setState({
          isNextDisabled: true,
        });
      }
    }
    if (
      prevState.userExpertise !== this.state.userExpertise ||
      prevState.userHourlyRate !== this.state.userHourlyRate ||
      prevState.userExperience !== this.state.userExperience ||
      prevState.userTelegramHandle !== this.state.userTelegramHandle ||
      prevState.isTelegramChecked !== this.state.isTelegramChecked
    ) {
      if (
        this.state.userExpertise &&
        this.state.userHourlyRate &&
        this.state.userExperience
        // &&this.state.userTelegramHandle
      ) {
        if (this.state.isTelegramChecked) {
          if (this.state.userTelegramHandle) {
            this.setState({
              isDoneDisabled: false,
            });
          } else {
            this.setState({
              isDoneDisabled: true,
            });
          }
        } else {
          this.setState({
            isDoneDisabled: false,
          });
        }
      } else {
        this.setState({
          isDoneDisabled: true,
        });
      }
    }
  }
  goToSecondStep = () => {
    if (!this.state.isNextDisabled) {
      this.setState({
        curStep: 2,
      });
    }
  };
  goToFirstStep = () => {
    this.setState({
      curStep: 1,
    });
  };
  goBack = () => {
    this.props.history.goBack();
  };
  goToBecomeAnExpertCompletePage = () => {
    if (!this.state.isDoneDisabled) {
      this.props.history.replace("/become-an-expert-complete");
    }
  };
  render() {
    if (this.state.isMobile) {
      return (
        <MobileLayout
          handleShare={() => null}
          isSidebarClosed={this.props.isSidebarClosed}
          history={this.props.history}
          currentPage={"stripe-success-page"}
          hideFooter
          hideAddresses
        >
          <BecomeAnExpertPageMobile onHide={this.onHide} />
        </MobileLayout>
      );
    }
    return (
      <div className="insightsPageContainer">
        {/* topbar */}
        <div className="portfolio-page-section ">
          <div
            className="portfolio-container page"
            style={{ overflow: "visible" }}
          >
            <div className="portfolio-section">
              {/* welcome card */}
              <WelcomeCard
                openConnectWallet={this.props.openConnectWallet}
                connectedWalletAddress={this.props.connectedWalletAddress}
                connectedWalletevents={this.props.connectedWalletevents}
                disconnectWallet={this.props.disconnectWallet}
                isSidebarClosed={this.props.isSidebarClosed}
                history={this.props.history}
              />
            </div>
          </div>
          <div className="becomne-an-expert-page inter-display-medium">
            <div className="becomne-an-expert-page-block-top-gradient" />
            <div className="becomne-an-expert-page-block">
              <div className="bae-info">
                <div className="bae-info-steps">
                  <div className="bae-is-step-visual">
                    <div
                      className={`bae-is-step ${
                        this.state.curStep === 1 ? "bae-is-step-active" : ""
                      }`}
                    />
                    <div
                      className={`bae-is-step ${
                        this.state.curStep === 2 ? "bae-is-step-active" : ""
                      }`}
                    />
                  </div>
                  <div className="bae-is-step-text">
                    Step {this.state.curStep} of 2
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
                    <br />
                    this to review your application
                  </div>
                </div>
              </div>
              <div className="bae-data">
                {this.state.curStep === 1 ? (
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
                            value={this.state.userEmail}
                            onChange={this.onUserEmailChange}
                            onKeyDown={this.stepOneOnKeyDown}
                            className="inter-display-medium bae-ib-input"
                            placeholder="Enter here"
                          />
                        </div>
                      </div>
                      <div className="bae-input-block">
                        <div className="bae-ib-title">Name (optional)</div>
                        <div className="bae-ib-input-container">
                          <input
                            value={this.state.userName}
                            onChange={this.onUserNameChange}
                            onKeyDown={this.stepOneOnKeyDown}
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
                            value={this.state.userSocialAccount}
                            onChange={this.onUserSocialAccountChange}
                            onKeyDown={this.stepOneOnKeyDown}
                            className="inter-display-medium bae-ib-input"
                            placeholder="Twitter, youtube, twitch, Linked In"
                          />
                        </div>
                      </div>
                      <div className="bae-input-block">
                        <div className="bae-ib-title">
                          Profile Image (optional)
                        </div>
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
                        onClick={this.goBack}
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
                          this.state.isNextDisabled ? "bae-db-btn-disabled" : ""
                        }`}
                        onClick={this.goToSecondStep}
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
                            value={this.state.userExpertise}
                            onChange={this.onUserExpertiseChange}
                            className="inter-display-medium bae-ib-input bae-ib-text-area"
                            placeholder="Twitter, youtube, twitch, Linked In"
                          />
                        </div>
                      </div>
                      <div className="bae-input-block">
                        <div className="bae-ib-title">
                          What’s your hourly rate?
                        </div>
                        <div className="bae-ib-input-container">
                          <input
                            value={this.state.userHourlyRate}
                            onChange={this.onUserHourlyRateChange}
                            onKeyDown={this.stepTwoOnKeyDown}
                            className="inter-display-medium bae-ib-input"
                            placeholder="$100"
                          />
                        </div>
                      </div>
                      <div className="bae-input-block">
                        <div className="bae-ib-title">
                          What’s your experience? Why do people want to talk to
                          you?
                        </div>
                        <div className="bae-ib-input-container">
                          <textarea
                            value={this.state.userExperience}
                            onChange={this.onUserExperienceChange}
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
                              handleOnClick={this.toggleEmailCheckBox}
                              isChecked={this.state.isEmailChecked}
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
                              handleOnClick={this.toggleTelegramCheckBox}
                              isChecked={this.state.isTelegramChecked}
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
                              this.state.isTelegramChecked
                                ? ""
                                : "bae-ib-check-input-container-disable"
                            }`}
                          >
                            <input
                              value={this.state.userTelegramHandle}
                              onChange={this.onUserTelegramHandleChange}
                              onKeyDown={this.stepTwoOnKeyDown}
                              className="inter-display-medium bae-ib-input"
                              placeholder="Enter your handle here"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bae-data-btns">
                      <button
                        onClick={this.goToFirstStep}
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
                         ${
                           this.state.isDoneDisabled
                             ? "bae-db-btn-disabled"
                             : ""
                         }
                          `}
                        onClick={this.goToBecomeAnExpertCompletePage}
                      >
                        <span>Done</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({});

const mapDispatchToProps = { getUser };

export default connect(mapStateToProps, mapDispatchToProps)(BecomeAnExpertPage);
