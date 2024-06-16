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
import BecomeAnExpertContent from "./BecomeAnExpertContent";

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
          hideShare
          hideFooter
          hideAddresses
          history={this.props.history}
          currentPage={"become-an-expert-page"}
          customeHomeClassName="mpcHomePageNoSidePadding"
        >
          <BecomeAnExpertPageMobile
            curStep={this.state.curStep}
            userEmail={this.state.userEmail}
            userName={this.state.userName}
            userSocialAccount={this.state.userSocialAccount}
            isNextDisabled={this.state.isNextDisabled}
            userExpertise={this.state.userExpertise}
            userHourlyRate={this.state.userHourlyRate}
            userExperience={this.state.userExperience}
            isEmailChecked={this.state.isEmailChecked}
            isTelegramChecked={this.state.isTelegramChecked}
            userTelegramHandle={this.state.userTelegramHandle}
            isDoneDisabled={this.state.isDoneDisabled}
            // Function
            goBack={this.goBack}
            onUserEmailChange={this.onUserEmailChange}
            stepOneOnKeyDown={this.stepOneOnKeyDown}
            onUserNameChange={this.onUserNameChange}
            onUserSocialAccountChange={this.onUserSocialAccountChange}
            goToSecondStep={this.goToSecondStep}
            onUserExpertiseChange={this.onUserExpertiseChange}
            onUserHourlyRateChange={this.onUserHourlyRateChange}
            stepTwoOnKeyDown={this.stepTwoOnKeyDown}
            toggleEmailCheckBox={this.toggleEmailCheckBox}
            toggleTelegramCheckBox={this.toggleTelegramCheckBox}
            onUserTelegramHandleChange={this.onUserTelegramHandleChange}
            goToFirstStep={this.goToFirstStep}
            goToBecomeAnExpertCompletePage={this.goToBecomeAnExpertCompletePage}
            onUserExperienceChange={this.onUserExperienceChange}
          />
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
          <BecomeAnExpertContent
            curStep={this.state.curStep}
            userEmail={this.state.userEmail}
            userName={this.state.userName}
            userSocialAccount={this.state.userSocialAccount}
            isNextDisabled={this.state.isNextDisabled}
            userExpertise={this.state.userExpertise}
            userHourlyRate={this.state.userHourlyRate}
            userExperience={this.state.userExperience}
            isEmailChecked={this.state.isEmailChecked}
            isTelegramChecked={this.state.isTelegramChecked}
            userTelegramHandle={this.state.userTelegramHandle}
            isDoneDisabled={this.state.isDoneDisabled}
            // Function
            goBack={this.goBack}
            onUserEmailChange={this.onUserEmailChange}
            stepOneOnKeyDown={this.stepOneOnKeyDown}
            onUserNameChange={this.onUserNameChange}
            onUserSocialAccountChange={this.onUserSocialAccountChange}
            goToSecondStep={this.goToSecondStep}
            onUserExpertiseChange={this.onUserExpertiseChange}
            onUserHourlyRateChange={this.onUserHourlyRateChange}
            stepTwoOnKeyDown={this.stepTwoOnKeyDown}
            toggleEmailCheckBox={this.toggleEmailCheckBox}
            toggleTelegramCheckBox={this.toggleTelegramCheckBox}
            onUserTelegramHandleChange={this.onUserTelegramHandleChange}
            goToFirstStep={this.goToFirstStep}
            goToBecomeAnExpertCompletePage={this.goToBecomeAnExpertCompletePage}
            onUserExperienceChange={this.onUserExperienceChange}
          />
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({});

const mapDispatchToProps = { getUser };

export default connect(mapStateToProps, mapDispatchToProps)(BecomeAnExpertPage);
