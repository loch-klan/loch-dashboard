import { Component } from "react";

import { connect } from "react-redux";
import ScheduleAcallContent from "./ScheduleAcallContent";

class ScheduleAcallMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="schedule-a-call-page-mobile">
        <ScheduleAcallContent
          history={this.props.history}
          isMobile
          totalSteps={this.props.totalSteps}
          curStep={this.props.curStep}
          curDateStartSelected={this.props.curDateStartSelected}
          curDateEndSelected={this.props.curDateEndSelected}
          expertsList={this.props.expertsList}
          callDurationOptions={this.props.callDurationOptions}
          callOptions={this.props.callOptions}
          selectedCallOption={this.props.selectedCallOption}
          userName={this.props.userName}
          userEmail={this.props.userEmail}
          userContactNumber={this.props.userContactNumber}
          userReferralPromoCode={this.props.userReferralPromoCode}
          isDoneDisabled={this.props.isDoneDisabled}
          selectedCallDuration={this.props.selectedCallDuration}
          // Functions
          setTheCallDuration={this.props.setTheCallDuration}
          goBack={this.props.goBack}
          goToFirstStep={this.props.goToFirstStep}
          goToSecondStep={this.props.goToSecondStep}
          goToThirdStep={this.props.goToThirdStep}
          onUserReferralPromoCodeChange={
            this.props.onUserReferralPromoCodeChange
          }
          onUserNameChange={this.props.onUserNameChange}
          onUserEmailChange={this.props.onUserEmailChange}
          onUserContactNumberChange={this.props.onUserContactNumberChange}
          changeSelectedCallOption={this.props.changeSelectedCallOption}
        />
      </div>
    );
  }
}
const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScheduleAcallMobile);
