import React from "react";
import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import { UserCreditRightArrowIcon } from "../../assets/images/icons/index.js";
import BaseReactComponent from "../../utils/form/BaseReactComponent.js";

class ProfileLochCreditPointsBlock extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div
        onClick={!this.props.isDone ? this.props.onClick : null}
        className={`profileLochCreditPointsBlock ${
          this.props.isDone ? "profileLochCreditPointsBlockCompleted" : ""
        }`}
      >
        <div className="profileLochCreditPointsBlockIconContainer">
          <Image
            src={this.props.imageIcon}
            className="profileLochCreditPointsBlockIcon"
          />
        </div>
        <div className="profileLochCreditPointsBlockInfoBlock">
          <div className="inter-display-medium f-s-16">{this.props.title}</div>
          <div className="profileLochCreditPointsBlockInfoBlockDescContainer">
            <div className="inter-display-medium f-s-13 profileLochCreditPointsBlockInfoBlockDesc">
              {`Earn${this.props.isDone ? "ed" : ""}`}
              <span
                className={`profileLochCreditPointsBlockInfoBlockDescPoints ${
                  this.props.isDone
                    ? "profileLochCreditPointsBlockInfoBlockDescPointsDone"
                    : "profileLochCreditPointsBlockInfoBlockDescPointsToDo"
                }`}
              >
                {this.props.earnPoints} point
                {this.props.earnPoints === 1 ? "" : "s"}
              </span>
            </div>
            {!this.props.isDone ? (
              <div className="profileLochCreditPointsBlockInfoBlockDescGoContainer">
                <div className="profileLochCreditPointsBlockInfoBlockDescGo inter-display-medium f-s-13">
                  Go
                </div>
                <Image
                  className="profileLochCreditPointsBlockInfoBlockDescGoIcon"
                  src={UserCreditRightArrowIcon}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = () => ({});
const mapDispatchToProps = {};
ProfileLochCreditPointsBlock.propTypes = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileLochCreditPointsBlock);
