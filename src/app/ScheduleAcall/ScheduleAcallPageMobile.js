import { Component } from "react";

import { connect } from "react-redux";
import PaymentSuccessModal from "../common/PaymentSuccessModal";

class ScheduleAcallMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="insightsPageContainer">
        <div className="portfolio-page-section ">
          <PaymentSuccessModal onHide={this.props.onHide} isMobile />
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
)(ScheduleAcallMobile);
