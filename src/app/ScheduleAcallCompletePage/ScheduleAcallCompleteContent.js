import { Component } from "react";

import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import { ScheduleCallCheckIcon } from "../../assets/images/icons";
import { mobileCheck } from "../../utils/ReusableFunctions";
import { getUser } from "../common/Api";
import moment from "moment";

class ScheduleAcallCompleteContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: mobileCheck(),
      selectedDate: new Date(),
    };
  }

  render() {
    return (
      <div className="schedule-a-call-complete-page inter-display-medium">
        <div className="schedule-a-call-page-block-top-gradient" />
        <div className="schedule-a-call-page-block">
          <Image src={ScheduleCallCheckIcon} className="bae-pb-image" />
          <div className="bae-pb-title">
            Congrats,
            <br />
            your call is booked!
          </div>
          <div className="bae-pb-desc">Take note of your details!</div>
          <div className="bae-pb-expert-block">
            <Image
              src="https://picsum.photos/200"
              className="bae-pb-eb-image"
            />
            <div className="bae-pb-eb-name inter-display-medium">
              @smartestmoney_
            </div>
            <div className="bae-pb-eb-date inter-display-medium">
              {moment(this.state.selectedDate).format("dddd DD MMM")}
            </div>
            <div className="bae-pb-eb-time inter-display-medium">
              {moment(this.state.selectedDate).format("h:mm A")} to{" "}
              {moment(this.state.selectedDate).format("h:mm A")}
            </div>
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
)(ScheduleAcallCompleteContent);
