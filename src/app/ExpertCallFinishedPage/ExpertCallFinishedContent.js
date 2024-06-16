import { Component } from "react";

import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import {
  ExpertCallFininsedFilledStartIcon,
  ExpertCallFininsedStartIcon,
  ScheduleCallCheckIcon,
} from "../../assets/images/icons";
import { mobileCheck } from "../../utils/ReusableFunctions";
import { getUser } from "../common/Api";
import moment from "moment";

class ExpertCallFinishedContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: mobileCheck(),
      selectedDate: new Date(),
      starRating: 5,
      selectedStarsHoverRating: 0,
      selectedStarsRating: 0,
    };
  }
  hoverStartRating = (passedIndex) => {
    this.setState({ selectedStarsHoverRating: passedIndex + 1 });
  };
  removeHoverRating = () => {
    this.setState({ selectedStarsHoverRating: 0 });
  };
  setStartRating = (passedIndex) => {
    if (passedIndex + 1 === this.state.selectedStarsRating) {
      this.setState({ selectedStarsRating: 0 });
    } else {
      this.setState({ selectedStarsRating: passedIndex + 1 });
    }
  };

  render() {
    return (
      <div className="exper-call-finished-complete-page inter-display-medium">
        <div className="exper-call-finished-page-block-top-gradient" />
        <div className="exper-call-finished-page-block">
          <Image src={ScheduleCallCheckIcon} className="bae-pb-image" />
          <div className="bae-pb-title">You just finished your call!</div>
          <div className="bae-pb-desc">Let us know how it went</div>
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

            <data className="bae-pb-eb-rate-title inter-display-medium">
              Rate your call out of 5
            </data>
            <div
              onMouseLeave={this.removeHoverRating}
              className="bae-pb-eb-star-container"
            >
              {[...Array(this.state.starRating)].map((item, index) => {
                return (
                  <div
                    key={index}
                    onMouseEnter={() => this.hoverStartRating(index)}
                  >
                    <Image
                      onClick={() => this.setStartRating(index)}
                      className="bae-pb-eb-star"
                      src={
                        this.state.selectedStarsHoverRating === 0
                          ? index < this.state.selectedStarsRating
                            ? ExpertCallFininsedFilledStartIcon
                            : ExpertCallFininsedStartIcon
                          : index < this.state.selectedStarsHoverRating
                          ? ExpertCallFininsedFilledStartIcon
                          : ExpertCallFininsedStartIcon
                      }
                    />
                  </div>
                );
              })}
            </div>
            <div className="bae-pb-eb-container">
              <textarea
                // value={this.props.userExperience}
                // onChange={this.props.onUserExperienceChange}
                className="inter-display-medium bae-pb-eb-text-area"
                placeholder="Review your experience here..."
              />
            </div>
            <button
              onClick={this.props.goToExpertsPage}
              className="bae-pb-eb-btn"
            >
              <div className="bae-pb-eb-btn-text inter-display-medium">
                Book another one
              </div>
            </button>
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
)(ExpertCallFinishedContent);
