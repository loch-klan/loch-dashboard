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
import ScheduleAcallContent from "./ScheduleAcallContent";

class ScheduleAcallPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalSteps: 3,
      curStep: 1,
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

      //Step 3
      userReferralPromoCode: "",
      //OLD
      isMobile: mobileCheck(),

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
    if (prevState.curStep !== this.state.curStep) {
      window.scrollTo(0, 0);
    }
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
  goToThirdStep = () => {
    this.setState({
      curStep: 3,
    });
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
  onUserReferralPromoCodeChange = (event) => {
    this.setState({
      userReferralPromoCode: event.target.value,
    });
  };
  setTheCallDuration = (passedIndex) => {
    this.setState({
      selectedCallDuration: passedIndex,
    });
  };
  render() {
    if (this.state.isMobile) {
      return (
        <MobileLayout
          hideShare
          hideFooter
          hideAddresses
          history={this.props.history}
          currentPage={"schedule-a-call"}
          customeHomeClassName="mpcHomePageNoSidePadding"
        >
          <ScheduleAcallPageMobile
            onHide={this.onHide}
            totalSteps={this.state.totalSteps}
            curStep={this.state.curStep}
            curDateStartSelected={this.state.curDateStartSelected}
            curDateEndSelected={this.state.curDateEndSelected}
            expertsList={this.state.expertsList}
            callDurationOptions={this.state.callDurationOptions}
            callOptions={this.state.callOptions}
            selectedCallOption={this.state.selectedCallOption}
            userName={this.state.userName}
            userEmail={this.state.userEmail}
            userContactNumber={this.state.userContactNumber}
            userReferralPromoCode={this.state.userReferralPromoCode}
            isDoneDisabled={this.state.isDoneDisabled}
            selectedCallDuration={this.state.selectedCallDuration}
            // Functions
            setTheCallDuration={this.setTheCallDuration}
            goBack={this.goBack}
            goToFirstStep={this.goToFirstStep}
            goToSecondStep={this.goToSecondStep}
            goToThirdStep={this.goToThirdStep}
            onUserNameChange={this.onUserNameChange}
            onUserEmailChange={this.onUserEmailChange}
            onUserContactNumberChange={this.onUserContactNumberChange}
            onUserReferralPromoCodeChange={this.onUserReferralPromoCodeChange}
            changeSelectedCallOption={this.changeSelectedCallOption}
          />
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
          <ScheduleAcallContent
            totalSteps={this.state.totalSteps}
            curStep={this.state.curStep}
            curDateStartSelected={this.state.curDateStartSelected}
            curDateEndSelected={this.state.curDateEndSelected}
            expertsList={this.state.expertsList}
            callDurationOptions={this.state.callDurationOptions}
            callOptions={this.state.callOptions}
            selectedCallOption={this.state.selectedCallOption}
            userName={this.state.userName}
            userEmail={this.state.userEmail}
            userContactNumber={this.state.userContactNumber}
            userReferralPromoCode={this.state.userReferralPromoCode}
            isDoneDisabled={this.state.isDoneDisabled}
            selectedCallDuration={this.state.selectedCallDuration}
            // Functions
            setTheCallDuration={this.setTheCallDuration}
            goBack={this.goBack}
            goToFirstStep={this.goToFirstStep}
            goToSecondStep={this.goToSecondStep}
            goToThirdStep={this.goToThirdStep}
            onUserNameChange={this.onUserNameChange}
            onUserEmailChange={this.onUserEmailChange}
            onUserContactNumberChange={this.onUserContactNumberChange}
            onUserReferralPromoCodeChange={this.onUserReferralPromoCodeChange}
            changeSelectedCallOption={this.changeSelectedCallOption}
          />
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({});

const mapDispatchToProps = { getUser };

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleAcallPage);
