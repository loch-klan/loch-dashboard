import { Component } from "react";

import moment from "moment";
import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import {
  BackArrowSmartMoneyIcon,
  CreditCardPaywallIcon,
  CryptoWalletPaywallIcon,
} from "../../assets/images/icons";
import {
  CurrencyType,
  TruncateText,
  loadingAnimation,
  numToCurrency,
} from "../../utils/ReusableFunctions";
import { getUser } from "../common/Api";
import "./_scheduleAcallPage.scss";

class ScheduleAcallContent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  isTimeSelected = (optionIndex, timeSlotIndex) => {
    for (let i = 0; i < this.props.selectedCallOption.length; i++) {
      if (
        this.props.selectedCallOption[i][0] === optionIndex &&
        this.props.selectedCallOption[i][1] === timeSlotIndex
      ) {
        return true;
      }
    }
    return false;
  };
  render() {
    return (
      <div className="schedule-a-call-page inter-display-medium">
        <div className="becomne-an-expert-page-block-top-gradient" />
        <div className="becomne-an-expert-page-block">
          <div className="bae-info">
            <div className="bae-info-steps">
              <div
                className={`bae-is-step-visual ${
                  this.props.isMobile ? "bae-is-step-visual-mobile" : ""
                }`}
              >
                {[...Array(this.props.totalSteps)].map((_, index) => {
                  return (
                    <div
                      className={`bae-is-step ${
                        this.props.curStep === index + 1
                          ? "bae-is-step-active"
                          : ""
                      }`}
                    />
                  );
                })}
              </div>
              <div className="bae-is-step-text">
                Step {this.props.curStep} of {this.props.totalSteps}
              </div>
            </div>
            <div className="bae-info-explain">
              {this.props.curStep === 1 ? (
                <div className="bae-ie-title">Schedule a call </div>
              ) : this.props.curStep === 2 ? (
                <div className="bae-ie-title">Here’s your call details </div>
              ) : this.props.curStep === 3 ? (
                <div className="bae-ie-title">Pay for your booking </div>
              ) : null}
              {this.props.curStep === 1 ? (
                <>
                  <div className="bae-ie-desc">
                    Choose a time and duration that best
                    <br />
                    suits you and we’ll make it happen!
                  </div>
                  <div className="bae-ie-person-title">Your call with</div>
                </>
              ) : (
                <div
                  style={{
                    marginBottom: "2rem",
                  }}
                />
              )}
              {this.props.curStep === 3 && this.props.isMobile ? (
                <div
                  style={{
                    marginTop: "-2.5rem",
                  }}
                />
              ) : (
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
                      <div />
                      {/* <div className="bae-db-final-left">
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
                        </div>
                      </div> */}
                      <div className="bae-db-final-right">
                        <div className="bae-db-final-title">$300</div>
                        <div className="bae-db-final-desc"> Per session</div>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
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
                                    this.isTimeSelected(
                                      optionIndex,
                                      timeSlotIndex
                                    )
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
                  <div
                    style={{
                      marginTop: "2rem",
                    }}
                    className="bae-db-final"
                  >
                    {/* <div className="bae-db-final-left">
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

                      </div>
                    </div> */}
                    <div />
                    <div className="bae-db-final-right">
                      <div className="bae-db-final-title">$300</div>
                      <div className="bae-db-final-desc"> Per session</div>
                    </div>
                  </div>
                </div>
                <div className="bae-data-btns">
                  <button
                    onClick={this.props.goBack}
                    className={`bae-db-btn bae-db-backbtn inter-display-medium ${
                      this.props.isMobile ? "bae-db-backbtn-mobile" : ""
                    }`}
                  >
                    <Image
                      className="bae-db-backbtn-icon"
                      src={BackArrowSmartMoneyIcon}
                    />
                    <div>Go back</div>
                  </button>
                  <button
                    className={`bae-db-btn bae-db-nextbtn inter-display-medium ${
                      this.props.isMobile ? "bae-db-nextbtn-mobile" : ""
                    } ${
                      this.props.selectedCallOption.length === 0
                        ? "bae-db-btn-disabled"
                        : ""
                    }`}
                    onClick={this.props.goToSecondStep}
                    disabled={this.props.selectedCallOption.length === 0}
                  >
                    <span>Next</span>
                  </button>
                </div>
              </>
            ) : this.props.curStep === 2 ? (
              <>
                <div
                  className={`bae-data-block ${
                    this.props.isMobile ? "" : "bae-data-block-min-height"
                  }`}
                >
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
                    className={`bae-db-btn bae-db-backbtn inter-display-medium ${
                      this.props.isMobile ? "bae-db-backbtn-mobile" : ""
                    }`}
                  >
                    <Image
                      className="bae-db-backbtn-icon"
                      src={BackArrowSmartMoneyIcon}
                    />
                    <div>Go back</div>
                  </button>
                  <button
                    className={`bae-db-btn bae-db-nextbtn inter-display-medium bae-db-donebtn
                   ${this.props.isDoneDisabled ? "bae-db-btn-disabled" : ""} ${
                      this.props.isMobile ? "bae-db-nextbtn-mobile" : ""
                    }
                    `}
                    onClick={this.props.goToThirdStep}
                  >
                    <span>Book a call</span>
                  </button>
                </div>
              </>
            ) : this.props.curStep === 3 ? (
              <>
                <div
                  className={`bae-data-block ${
                    this.props.isMobile ? "" : "bae-data-block-min-height"
                  }`}
                >
                  <div className="bae-data-block-center">
                    <div className="bae-db-center-desc">Cost of booking</div>
                    <div className="bae-db-center-title">$300 USD</div>
                    <div className="bae-db-payment">
                      <div className="bae-db-payment-title">
                        Choose your payment method
                      </div>
                      <div
                        // onClick={this.props.payWithStripe}
                        className={`inter-display-medium f-s-16 ctpb-plan-payment-button ${
                          this.props.isCryptoBtnLoading
                            ? "ctpb-plan-payment-button-disabled"
                            : this.props.isCreditBtnLoading
                            ? "ctpb-plan-payment-button-loading"
                            : ""
                        }`}
                      >
                        {this.props.isCreditBtnLoading ? (
                          loadingAnimation()
                        ) : (
                          <>
                            <Image
                              className="ctpb-plan-payment-button-icons"
                              src={CreditCardPaywallIcon}
                            />
                            <span>Credit Card</span>
                          </>
                        )}
                      </div>
                      <div
                        // onClick={this.props.payWithStripe}
                        className={`inter-display-medium f-s-16 ctpb-plan-payment-button ${
                          this.props.isCryptoBtnLoading
                            ? "ctpb-plan-payment-button-disabled"
                            : this.props.isCreditBtnLoading
                            ? "ctpb-plan-payment-button-loading"
                            : ""
                        }`}
                      >
                        {this.props.isCreditBtnLoading ? (
                          loadingAnimation()
                        ) : (
                          <>
                            <Image
                              className="ctpb-plan-payment-button-icons"
                              src={CryptoWalletPaywallIcon}
                            />
                            <span>Crypto</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bae-input-block bae-input-block-horizontal">
                    <div className="bae-ib-input-container">
                      <input
                        value={this.props.userReferralPromoCode}
                        onChange={this.props.onUserReferralPromoCodeChange}
                        className="inter-display-medium bae-ib-input"
                        placeholder="Referral / Promo code"
                      />
                    </div>
                    <div className="bae-data-btns">
                      <button
                        className={`bae-db-btn bae-db-nextbtn inter-display-medium bae-db-donebtn
                        ${
                          !this.props.userReferralPromoCode
                            ? "bae-db-btn-disabled"
                            : ""
                        } ${this.props.isMobile ? "bae-db-nextbtn-mobile" : ""}
                    `}
                        onClick={this.props.goToThirdStep}
                      >
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="bae-data-btns">
                  <button
                    onClick={this.props.goToSecondStep}
                    className={`bae-db-btn bae-db-backbtn inter-display-medium ${
                      this.props.isMobile
                        ? "bae-db-btn-full bae-db-backbtn-mobile"
                        : ""
                    }`}
                  >
                    <Image
                      className="bae-db-backbtn-icon"
                      src={BackArrowSmartMoneyIcon}
                    />
                    <div>Go back</div>
                  </button>
                </div>
              </>
            ) : null}
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
