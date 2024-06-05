import { Component } from "react";

import moment from "moment";
import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import { BackArrowSmartMoneyIcon } from "../../assets/images/icons";
import {
  CurrencyType,
  TruncateText,
  mobileCheck,
  numToCurrency,
} from "../../utils/ReusableFunctions";
import WelcomeCard from "../Portfolio/WelcomeCard";
import { getUser } from "../common/Api";
import MobileLayout from "../layout/MobileLayout";
import ScheduleAcallPageMobile from "./ScheduleAcallPageMobile";
import "./_scheduleAcallPage.scss";

class ScheduleAcallPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expertsList: [
        {
          address: "0xeB2993A4E44291DA4020102F6D2ed8D14b1Cca4c",
          name_tag: "@smartestmoney_",
          user_image: "https://picsum.photos/200",
          net_worth: 36567693.050387464,
        },
      ],
      callDurationOptions: [
        { title: "Quick - 15 Min", time: 15 },
        { title: "Regular - 30 Min", time: 30 },
        { title: "Extra - 45 Min", time: 45 },
        { title: "All Access - 60 Min", time: 60 },
      ],
      callOptions: [],
      selectedCallOption: [0, 0],
      selectedCallDuration: 0,
      curDateStartSelected: "",
      curDateEndSelected: "",

      //Step 2
      userName: "",
      userEmail: "",
      userContactNumber: "",

      //OLD
      isMobile: mobileCheck(),
      curStep: 1,
      isDoneDisabled: true,
    };
  }

  changeSelectedCallOption = (optionIndex, timeSlotIndex) => {
    this.setState({
      selectedCallOption: [optionIndex, timeSlotIndex],
    });
  };

  onHide = () => {
    this.props.getUser();
    this.props.history.push("/home");
  };
  componentDidMount() {
    window.scrollTo(0, 0);
    const dateTwo = new Date(new Date().getTime() + 86400000);
    const dateThree = new Date(new Date().getTime() + 86400000 * 2);
    const tempHolder = [
      {
        date: new Date(),
        timeSlots: [
          new Date().setHours(13, 0, 0),
          new Date().setHours(14, 0, 0),
          new Date().setHours(15, 0, 0),
          new Date().setHours(16, 0, 0),
          new Date().setHours(17, 0, 0),
          new Date().setHours(18, 0, 0),
        ],
      },
      {
        date: dateTwo,
        timeSlots: [
          dateTwo.setHours(13, 0, 0),
          dateTwo.setHours(14, 0, 0),
          dateTwo.setHours(15, 0, 0),
          dateTwo.setHours(16, 0, 0),
          dateTwo.setHours(17, 0, 0),
          dateTwo.setHours(18, 0, 0),
        ],
      },
      {
        date: dateThree,
        timeSlots: [
          dateThree.setHours(13, 0, 0),
          dateThree.setHours(14, 0, 0),
          dateThree.setHours(15, 0, 0),
          dateThree.setHours(16, 0, 0),
          dateThree.setHours(17, 0, 0),
          dateThree.setHours(18, 0, 0),
        ],
      },
    ];

    this.setState({
      callOptions: tempHolder,
      curDateStartSelected: tempHolder[0].timeSlots[0],
    });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedCallOption !== this.state.selectedCallOption) {
      this.setState({
        curDateStartSelected:
          this.state.callOptions[this.state.selectedCallOption[0]].timeSlots[
            this.state.selectedCallOption[1]
          ],
      });
    }
    if (
      prevState.curDateStartSelected !== this.state.curDateStartSelected ||
      prevState.selectedCallDuration !== this.state.selectedCallDuration
    ) {
      this.setState({
        curDateEndSelected: new Date(
          this.state.curDateStartSelected +
            this.state.callDurationOptions[this.state.selectedCallDuration]
              .time *
              60000
        ),
      });
    }
    if (
      prevState.userName !== this.state.userName ||
      prevState.userEmail !== this.state.userEmail ||
      prevState.userContactNumber !== this.state.userContactNumber
    ) {
      if (
        this.state.userName &&
        this.state.userEmail &&
        this.state.userContactNumber
      ) {
        this.setState({
          isDoneDisabled: false,
        });
      } else {
        this.setState({
          isDoneDisabled: true,
        });
      }
    }
  }
  goBack = () => {
    this.props.history.goBack();
  };
  goToSecondStep = () => {
    this.setState({
      curStep: 2,
    });
  };
  goToFirstStep = () => {
    this.setState({
      curStep: 1,
    });
  };

  // Step Two
  onUserNameChange = (event) => {
    this.setState({
      userName: event.target.value,
    });
  };
  onUserEmailChange = (event) => {
    this.setState({
      userEmail: event.target.value,
    });
  };
  onUserContactNumberChange = (event) => {
    this.setState({
      userContactNumber: event.target.value,
    });
  };
  render() {
    if (this.state.isMobile) {
      return (
        <MobileLayout
          handleShare={() => null}
          isSidebarClosed={this.props.isSidebarClosed}
          history={this.props.history}
          currentPage={"stripe-success-page"}
          hideFooter
          hideAddresses
        >
          <ScheduleAcallPageMobile onHide={this.onHide} />
        </MobileLayout>
      );
    }
    return (
      <div className="insightsPageContainer">
        {/* topbar */}
        <div className="portfolio-page-section ">
          <div
            className="portfolio-container page"
            style={{ overflow: "visible" }}
          >
            <div className="portfolio-section">
              {/* welcome card */}
              <WelcomeCard
                openConnectWallet={this.props.openConnectWallet}
                connectedWalletAddress={this.props.connectedWalletAddress}
                connectedWalletevents={this.props.connectedWalletevents}
                disconnectWallet={this.props.disconnectWallet}
                isSidebarClosed={this.props.isSidebarClosed}
                history={this.props.history}
              />
            </div>
          </div>
          <div className="schedule-a-call-page-page inter-display-medium">
            <div className="becomne-an-expert-page-block-top-gradient" />
            <div className="becomne-an-expert-page-block">
              <div className="bae-info">
                <div className="bae-info-steps">
                  <div className="bae-is-step-visual">
                    <div
                      className={`bae-is-step ${
                        this.state.curStep === 1 ? "bae-is-step-active" : ""
                      }`}
                    />
                    <div
                      className={`bae-is-step ${
                        this.state.curStep === 2 ? "bae-is-step-active" : ""
                      }`}
                    />
                  </div>
                  <div className="bae-is-step-text">
                    Step {this.state.curStep} of 2
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
                        src={this.state.expertsList[0].user_image}
                      />
                      <div className="bae-ie-person-details">
                        <div className="ep-ei-dd-nametag">
                          {this.state.expertsList[0].name_tag}
                        </div>
                        <div className="ep-ei-dd-acccount-amount">
                          <div className="ep-ei-dd-amount">
                            {CurrencyType(false) +
                              numToCurrency(
                                this.state.expertsList[0].net_worth
                              )}
                          </div>
                          <div className="ep-ei-dd-acccount">
                            {TruncateText(this.state.expertsList[0].address)}
                          </div>
                        </div>
                        <div className="ep-ei-dd-desc">
                          #1 CoinM PnL & Story Teller on @binance leaderboard. 9
                          figs challenge with receipts
                        </div>
                      </div>
                    </div>
                    {this.state.curStep === 2 ? (
                      <div className="bae-db-final">
                        <div className="bae-db-final-left">
                          <div className="bae-db-final-title">
                            {moment(this.state.curDateStartSelected).format(
                              "dddd DD MMM"
                            )}
                          </div>
                          <div className="bae-db-final-time">
                            {`${moment(this.state.curDateStartSelected).format(
                              "h:mm A"
                            )} to ${moment(
                              this.state.curDateEndSelected
                            ).format("h:mm A")}`}
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
                  {this.state.curStep === 1 ? (
                    <>
                      <div className="bae-ie-person-title">Select Duration</div>
                      <div className="bae-ie-duration-block">
                        {this.state.callDurationOptions.map((option, index) => {
                          return (
                            <div
                              className={`bae-ie-duration-item ${
                                index === this.state.selectedCallDuration
                                  ? "bae-ie-duration-item-selected"
                                  : ""
                              }`}
                              onClick={() => {
                                this.setState({
                                  selectedCallDuration: index,
                                });
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
                {this.state.curStep === 1 ? (
                  <>
                    <div className="bae-data-block">
                      <div className="bae-db-desc">Select date and time</div>
                      <div className="bae-db-time-slot">
                        {this.state.callOptions.map((option, optionIndex) => {
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
                                {option.timeSlots.map(
                                  (timeSlot, timeSlotIndex) => {
                                    const changeSelectedCallOptionPass = () => {
                                      this.changeSelectedCallOption(
                                        optionIndex,
                                        timeSlotIndex
                                      );
                                    };
                                    return (
                                      <div
                                        className={`bae-db-tsi-time ${
                                          optionIndex ===
                                            this.state.selectedCallOption[0] &&
                                          timeSlotIndex ===
                                            this.state.selectedCallOption[1]
                                            ? "bae-db-tsi-time-selected"
                                            : ""
                                        }`}
                                        onClick={changeSelectedCallOptionPass}
                                      >
                                        {moment(timeSlot).format("h:mm A")}
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="bae-db-final">
                        <div className="bae-db-final-left">
                          <div className="bae-db-final-title">
                            {moment(this.state.curDateStartSelected).format(
                              "dddd DD MMM"
                            )}
                          </div>
                          <div className="bae-db-final-time">
                            {`${moment(this.state.curDateStartSelected).format(
                              "h:mm A"
                            )} to ${moment(
                              this.state.curDateEndSelected
                            ).format("h:mm A")}`}
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
                        onClick={this.goBack}
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
                        onClick={this.goToSecondStep}
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
                            value={this.state.userName}
                            onChange={this.onUserNameChange}
                            className="inter-display-medium bae-ib-input"
                            placeholder="Name"
                          />
                        </div>
                      </div>
                      <div className="bae-input-block">
                        <div className="bae-ib-title">Email</div>
                        <div className="bae-ib-input-container">
                          <input
                            value={this.state.userEmail}
                            onChange={this.onUserEmailChange}
                            className="inter-display-medium bae-ib-input"
                            placeholder="Enter here"
                          />
                        </div>
                      </div>
                      <div className="bae-input-block">
                        <div className="bae-ib-title">Contact number</div>
                        <div className="bae-ib-input-container">
                          <input
                            value={this.state.userContactNumber}
                            onChange={this.onUserContactNumberChange}
                            className="inter-display-medium bae-ib-input"
                            placeholder="Enter here"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="bae-data-btns">
                      <button
                        onClick={this.goToFirstStep}
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
                         ${
                           this.state.isDoneDisabled
                             ? "bae-db-btn-disabled"
                             : ""
                         }
                          `}
                        onClick={this.goToSecondStep}
                      >
                        <span>Done</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({});

const mapDispatchToProps = { getUser };

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleAcallPage);
