import React from "react";
import { connect } from "react-redux";
import { BaseReactComponent } from "../../utils/form";
import { Image } from "react-bootstrap";
import {
  ExpertCallFininsedFilledStarBlackIcon,
  ExpertCallFininsedFilledStartIcon,
  ExpertCallFininsedStartIcon,
} from "../../assets/images/icons";

class ExpertCallLogsRatingStars extends BaseReactComponent {
  constructor(props) {
    super(props);

    this.state = {
      starRating: 5,
      selectedStarsHoverRating: 0,
      selectedStarsRating: props.rating ? props.rating : 0,
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
      <div
        onMouseLeave={this.removeHoverRating}
        className="expertCallLogs-star-container"
      >
        {[...Array(this.state.starRating)].map((item, index) => {
          return (
            <div key={index} onMouseEnter={() => this.hoverStartRating(index)}>
              <Image
                onClick={() => this.setStartRating(index)}
                className="expertCallLogs-star"
                src={
                  this.state.selectedStarsHoverRating === 0
                    ? index < this.state.selectedStarsRating
                      ? ExpertCallFininsedFilledStarBlackIcon
                      : ExpertCallFininsedStartIcon
                    : index < this.state.selectedStarsHoverRating
                    ? ExpertCallFininsedFilledStarBlackIcon
                    : ExpertCallFininsedStartIcon
                }
              />
            </div>
          );
        })}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

ExpertCallLogsRatingStars.propTypes = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExpertCallLogsRatingStars);
