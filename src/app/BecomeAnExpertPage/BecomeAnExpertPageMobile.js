import { Component } from "react";

import { connect } from "react-redux";
import BecomeAnExpertContent from "./BecomeAnExpertContent";

class ExpertsPageMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="becomne-an-expert-page-mobile">
        <BecomeAnExpertContent
          isMobile
          curStep={this.props.curStep}
          userEmail={this.props.userEmail}
          userName={this.props.userName}
          userSocialAccount={this.props.userSocialAccount}
          isNextDisabled={this.props.isNextDisabled}
          userExpertise={this.props.userExpertise}
          userHourlyRate={this.props.userHourlyRate}
          userExperience={this.props.userExperience}
          isEmailChecked={this.props.isEmailChecked}
          isTelegramChecked={this.props.isTelegramChecked}
          userTelegramHandle={this.props.userTelegramHandle}
          isDoneDisabled={this.props.isDoneDisabled}
          // Function
          goBack={this.props.goBack}
          onUserEmailChange={this.props.onUserEmailChange}
          stepOneOnKeyDown={this.props.stepOneOnKeyDown}
          onUserNameChange={this.props.onUserNameChange}
          onUserSocialAccountChange={this.props.onUserSocialAccountChange}
          goToSecondStep={this.props.goToSecondStep}
          onUserExpertiseChange={this.props.onUserExpertiseChange}
          onUserHourlyRateChange={this.props.onUserHourlyRateChange}
          stepTwoOnKeyDown={this.props.stepTwoOnKeyDown}
          toggleEmailCheckBox={this.props.toggleEmailCheckBox}
          toggleTelegramCheckBox={this.props.toggleTelegramCheckBox}
          onUserTelegramHandleChange={this.props.onUserTelegramHandleChange}
          goToFirstStep={this.props.goToFirstStep}
          goToBecomeAnExpertCompletePage={
            this.props.goToBecomeAnExpertCompletePage
          }
          onUserExperienceChange={this.props.onUserExperienceChange}
        />
      </div>
    );
  }
}
const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ExpertsPageMobile);
