import { Component } from "react";

import { connect } from "react-redux";
import BecomeAnExpertCompleteContent from "./BecomeAnExpertCompleteContent";

class BecomeAnExpertCompletePageMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="schedule-a-call-complete-page-mobile">
        <BecomeAnExpertCompleteContent
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
)(BecomeAnExpertCompletePageMobile);
