import { Component } from "react";

import { connect } from "react-redux";
import ScheduleAcallCompleteContent from "./ScheduleAcallCompleteContent";

class ScheduleAcallCompletePageMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="schedule-a-call-complete-page-mobile">
        <ScheduleAcallCompleteContent
          isMobile
          goToExpertsPage={this.props.goToExpertsPage}
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
)(ScheduleAcallCompletePageMobile);
