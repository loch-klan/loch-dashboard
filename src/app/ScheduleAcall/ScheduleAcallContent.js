import { Component } from "react";

import moment from "moment";
import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import { BackArrowSmartMoneyIcon } from "../../assets/images/icons";
import {
  CurrencyType,
  TruncateText,
  numToCurrency,
} from "../../utils/ReusableFunctions";
import { getUser } from "../common/Api";
import "./_scheduleAcallPage.scss";

class ScheduleAcallContent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="schedule-a-call-page inter-display-medium">
        <div className="becomne-an-expert-page-block-top-gradient" />
        <div className="becomne-an-expert-page-block">
          <div className="bae-info">
            <div className="bae-info-steps">
              <div className="bae-is-step-visual">
                <div
                  className={`bae-is-step ${
                    this.props.curStep === 1 ? "bae-is-step-active" : ""
                  }`}
                />
                <div
                  className={`bae-is-step ${
                    this.props.curStep === 2 ? "bae-is-step-active" : ""
                  }`}
                />
              </div>
              <div className="bae-is-step-text">
                Step {this.props.curStep} of 2
              </div>
            </div>
            <div className="bae-info-explain">
              <div className="bae-ie-title">Schedule a call </div>
              <div className="bae-ie-desc">
                Choose a time and duration that best
                <br />
                suits you and we’ll make it happen!
              </div>
              <div className="bae-ie-person-title">Your call with</div>
              <div className="bae-ie-person-block-container">
                <div className="bae-ie-person-block">
                  <Image
                    className="bae-ie-person-image"
                    src={this.props.expertsList[0].user_image}
                  />
                  <div className="bae-ie-person-details">
                    <div className="ep-ei-dd-nametag">
                      {this.props.expertsList[0].name_tag}
                    </div>
                    <div className="ep-ei-dd-acccount-amount">
                      <div className="ep-ei-dd-amount">
                        {CurrencyType(false) +
                          numToCurrency(this.props.expertsList[0].net_worth)}
                      </div>
                      <div className="ep-ei-dd-acccount">
                        {TruncateText(this.props.expertsList[0].address)}
                      </div>
                    </div>
                    <div className="ep-ei-dd-desc">
                      #1 CoinM PnL & Story Teller on @binance leaderboard. 9
                      figs challenge with receipts
                    </div>
                  </div>
                </div>
                {this.props.curStep === 2 ? (
                  <div className="bae-db-final">
                    <div className="bae-db-final-left">
                      <div className="bae-db-final-title">
                        {moment(this.props.curDateStartSelected).format(
                          "dddd DD MMM"
                        )}
                      </div>
                      <div className="bae-db-final-time">
                        {`${moment(this.props.curDateStartSelected).format(
                          "h:mm A"
                        )} to ${moment(this.props.curDateEndSelected).format(
                          "h:mm A"
                        )}`}
                        {/* to 5:45PM BST */}
                      </div>
                    </div>
                    <div className="bae-db-final-right">
                      <div className="bae-db-final-title">$300</div>
                      <div className="bae-db-final-desc"> Per session</div>
                    </div>
                  </div>
                ) : null}
              </div>
              {this.props.curStep === 1 ? (
                <>
                  <div className="bae-ie-person-title">Select Duration</div>
                  <div className="bae-ie-duration-block">
                    {this.props.callDurationOptions.map((option, index) => {
                      return (
                        <div
                          className={`bae-ie-duration-item ${
                            index === this.props.selectedCallDuration
                              ? "bae-ie-duration-item-selected"
                              : ""
                          }`}
                          onClick={() => {
                            this.props.setTheCallDuration(index);
                          }}
                        >
                          {option.title}
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : null}
            </div>
          </div>
          <div className="bae-data">
            {this.props.curStep === 1 ? (
              <>
                <div className="bae-data-block">
                  <div className="bae-db-desc">Select date and time</div>
                  <div className="bae-db-time-slot">
                    {this.props.callOptions.map((option, optionIndex) => {
                      return (
                        <div className="bae-db-time-slot-item">
                          <div className="bae-db-tsi-title">
                            {option.date <= new Date()
                              ? "Today "
                              : option.date <=
                                new Date(new Date().getTime() + 86400000)
                              ? "Tomorrow "
                              : ""}
                            {moment(option.date).format("DD MMM")}
                          </div>
                          <div className="bae-db-tsi-time-container">
                            {option.timeSlots.map((timeSlot, timeSlotIndex) => {
                              const changeSelectedCallOptionPass = () => {
                                this.props.changeSelectedCallOption(
                                  optionIndex,
                                  timeSlotIndex
                                );
                              };
                              return (
                                <div
                                  className={`bae-db-tsi-time ${
                                    optionIndex ===
                                      this.props.selectedCallOption[0] &&
                                    timeSlotIndex ===
                                      this.props.selectedCallOption[1]
                                      ? "bae-db-tsi-time-selected"
                                      : ""
                                  }`}
                                  onClick={changeSelectedCallOptionPass}
                                >
                                  {moment(timeSlot).format("h:mm A")}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="bae-db-final">
                    <div className="bae-db-final-left">
                      <div className="bae-db-final-title">
                        {moment(this.props.curDateStartSelected).format(
                          "dddd DD MMM"
                        )}
                      </div>
                      <div className="bae-db-final-time">
                        {`${moment(this.props.curDateStartSelected).format(
                          "h:mm A"
                        )} to ${moment(this.props.curDateEndSelected).format(
                          "h:mm A"
                        )}`}
                        {/* to 5:45PM BST */}
                      </div>
                    </div>
                    <div className="bae-db-final-right">
                      <div className="bae-db-final-title">$300</div>
                      <div className="bae-db-final-desc"> Per session</div>
                    </div>
                  </div>
                </div>
                <div className="bae-data-btns">
                  <button
                    onClick={this.props.goBack}
                    className="bae-db-btn bae-db-backbtn inter-display-medium"
                  >
                    <Image
                      className="bae-db-backbtn-icon"
                      src={BackArrowSmartMoneyIcon}
                    />
                    <div>Go back</div>
                  </button>
                  <button
                    className={`bae-db-btn bae-db-nextbtn inter-display-medium`}
                    onClick={this.props.goToSecondStep}
                  >
                    <span>Next</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="bae-data-block bae-data-block-min-height">
                  <div className="bae-db-title">Your particulars</div>
                  <div className="bae-input-block">
                    <div className="bae-ib-title">Name (optional)</div>
                    <div className="bae-ib-input-container">
                      <input
                        value={this.props.userName}
                        onChange={this.props.onUserNameChange}
                        className="inter-display-medium bae-ib-input"
                        placeholder="Name"
                      />
                    </div>
                  </div>
                  <div className="bae-input-block">
                    <div className="bae-ib-title">Email</div>
                    <div className="bae-ib-input-container">
                      <input
                        value={this.props.userEmail}
                        onChange={this.props.onUserEmailChange}
                        className="inter-display-medium bae-ib-input"
                        placeholder="Enter here"
                      />
                    </div>
                  </div>
                  <div className="bae-input-block">
                    <div className="bae-ib-title">Contact number</div>
                    <div className="bae-ib-input-container">
                      <input
                        value={this.props.userContactNumber}
                        onChange={this.props.onUserContactNumberChange}
                        className="inter-display-medium bae-ib-input"
                        placeholder="Enter here"
                      />
                    </div>
                  </div>
                </div>
                <div className="bae-data-btns">
                  <button
                    onClick={this.props.goToFirstStep}
                    className="bae-db-btn bae-db-backbtn inter-display-medium"
                  >
                    <Image
                      className="bae-db-backbtn-icon"
                      src={BackArrowSmartMoneyIcon}
                    />
                    <div>Go back</div>
                  </button>
                  <button
                    className={`bae-db-btn bae-db-nextbtn inter-display-medium bae-db-donebtn
                   ${this.props.isDoneDisabled ? "bae-db-btn-disabled" : ""}
                    `}
                    onClick={this.props.goToSecondStep}
                  >
                    <span>Done</span>
                  </button>
                </div>
              </>
            )}
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
)(ScheduleAcallContent);
