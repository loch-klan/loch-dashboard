import React from "react";
import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import {
  FeedbackCreditIcon,
  UserCreditDiamondIcon,
  UserCreditLinkIcon,
  UserCreditMailIcon,
  UserCreditScrollLeftArrowIcon,
  UserCreditScrollRightArrowIcon,
  UserCreditStarIcon,
  UserCreditTelegramIcon,
  UserCreditWalletIcon,
  XFormallyTwitterLogoIcon,
} from "../../assets/images/icons/index.js";
import {
  UserCreditGoClickedMP,
  UserCreditLeftScrollClickedMP,
  UserCreditRightScrollClickedMP,
} from "../../utils/AnalyticsFunctions.js";
import { getCurrentUser } from "../../utils/ManageToken.js";
import BaseReactComponent from "../../utils/form/BaseReactComponent.js";
import { updateWalletListFlag } from "../common/Api.js";
import Loading from "../common/Loading.js";
import { addUserCredits, getUserCredits } from "./Api.js";
import ProfileLochCreditPointsBlock from "./ProfileLochCreditPointsBlock.js";

class ProfileLochCreditPoints extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLeftArrowDisabled: true,
      isRightArrowDisabled: false,
      loading: false,
      lochScore: "",
      topPercentage: "",

      tasksDone: [],
      tasksList: [
        "address_added",
        "ens_added",
        "email_added",
        "wallet_connected",
        "multiple_address_added",
        "exchange_connected",
        "following",
        "x_follower",
        "joined_telegram",
        "feedbacks_added",
        // "twitter_spaces",
        // "provide_feedback",
        // "use_referral_code",
      ],
    };
  }
  newPosBase = () => {
    return 12;
    // return this.state.tasksList.length;
  };
  scrollRight = () => {
    if (this.state.isRightArrowDisabled) {
      return;
    }
    UserCreditRightScrollClickedMP({
      session_id: getCurrentUser ? getCurrentUser()?.id : "",
      email_address: getCurrentUser ? getCurrentUser()?.email : "",
    });
    var myElement = document.getElementById("profileCreditPointsScrollBody");
    var myElementWidth = document.getElementById(
      "profileCreditPointsScrollBody"
    ).clientWidth;
    var myElementCurrentScrollPos = document.getElementById(
      "profileCreditPointsScrollBody"
    ).scrollLeft;

    const newPos = myElementCurrentScrollPos + myElementWidth;
    myElement.scroll({
      left: newPos,
      behavior: "smooth",
    });
    if (newPos === (this.newPosBase() / 3 - 1) * myElementWidth) {
      this.setState({
        isRightArrowDisabled: true,
        isLeftArrowDisabled: false,
      });
    } else {
      this.setState({
        isRightArrowDisabled: false,
        isLeftArrowDisabled: false,
      });
    }
  };
  scrollLeft = () => {
    if (this.state.isLeftArrowDisabled) {
      return;
    }
    UserCreditLeftScrollClickedMP({
      session_id: getCurrentUser ? getCurrentUser()?.id : "",
      email_address: getCurrentUser ? getCurrentUser()?.email : "",
    });
    var myElement = document.getElementById("profileCreditPointsScrollBody");
    var myElementWidth = document.getElementById(
      "profileCreditPointsScrollBody"
    ).clientWidth;
    var myElementCurrentScrollPos = document.getElementById(
      "profileCreditPointsScrollBody"
    ).scrollLeft;
    const newPos = myElementCurrentScrollPos - myElementWidth;

    myElement.scroll({
      left: newPos,
      behavior: "smooth",
    });

    if (newPos <= 0) {
      this.setState({
        isLeftArrowDisabled: true,
        isRightArrowDisabled: false,
      });
    } else {
      this.setState({
        isLeftArrowDisabled: false,
        isRightArrowDisabled: false,
      });
    }
  };
  handleCreditScroll = () => {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      var myElementWidth = document.getElementById(
        "profileCreditPointsScrollBody"
      ).clientWidth;
      var newPos = document.getElementById(
        "profileCreditPointsScrollBody"
      ).scrollLeft;

      if (newPos === 0) {
        this.setState({
          isLeftArrowDisabled: true,
          isRightArrowDisabled: false,
        });
      } else if (newPos === (this.newPosBase() / 3 - 1) * myElementWidth) {
        this.setState({
          isLeftArrowDisabled: false,
          isRightArrowDisabled: true,
        });
      } else {
        this.setState({
          isLeftArrowDisabled: false,
          isRightArrowDisabled: false,
        });
      }
    }, 150);
  };
  componentDidMount() {
    this.callApi();
  }

  componentDidUpdate(prevProps) {
    // if (this.props.isUpdate !== prevProps.isUpdate) {
    //   this.callApi();
    //   this.setState({
    //     isLeftArrowDisabled: true,
    //     isRightArrowDisabled: false,
    //   });
    // }
    if (!this.props.commonState.creditPointsBlock) {
      this.props.updateWalletListFlag("creditPointsBlock", true);
      this.callApi();
      this.setState({
        isLeftArrowDisabled: true,
        isRightArrowDisabled: false,
      });
    }
    if (this.props.followFlag !== prevProps.followFlag) {
      this.callApi();
    }
  }
  callApi() {
    this.setState({
      loading: true,
      isLeftArrowDisabled: true,
      isRightArrowDisabled: false,
    });
    this.props.getUserCredits(this);
  }
  returnWhichBlock = (whichBlock, whichBlockIndex) => {
    const openAddressModal = () => {
      if (
        document.getElementById("topBarContainerInputBlockInputId") &&
        document.getElementById("topBarContainerInputBlockInputId").focus
      ) {
        document.getElementById("topBarContainerInputBlockInputId").focus();
      }
    };

    const openEmailModal = () => {
      const userDetails = JSON.parse(window.sessionStorage.getItem("lochUser"));
      if (
        document.getElementById("sidebar-open-sign-in-btn") &&
        !(userDetails && userDetails.email)
      ) {
        document.getElementById("sidebar-open-sign-in-btn").click();
      } else if (
        document.getElementById("sidebar-closed-sign-in-btn") &&
        !(userDetails && userDetails.email)
      ) {
        document.getElementById("sidebar-closed-sign-in-btn").click();
      }
    };
    const openConnectWalletModal = () => {
      if (document.getElementById("topbar-connect-wallet-btn")) {
        document.getElementById("topbar-connect-wallet-btn").click();
      }
    };
    const openProvideFeedbackModal = () => {
      if (document.getElementById("sidebar-feedback-btn-full")) {
        document.getElementById("sidebar-feedback-btn-full").click();
      } else if (document.getElementById("sidebar-feedback-btn")) {
        document.getElementById("sidebar-feedback-btn").click();
      }
    };
    const openConnectExchangeModal = () => {
      if (document.getElementById("topbar-connect-exchange-btn")) {
        document.getElementById("topbar-connect-exchange-btn").click();
      }
    };

    const goClickAddAddress = () => {
      UserCreditGoClickedMP({
        session_id: getCurrentUser ? getCurrentUser()?.id : "",
        email_address: getCurrentUser ? getCurrentUser()?.email : "",
        task: "Added one wallet address",
      });
      openAddressModal();
    };
    const goClickAddEns = () => {
      UserCreditGoClickedMP({
        session_id: getCurrentUser ? getCurrentUser()?.id : "",
        email_address: getCurrentUser ? getCurrentUser()?.email : "",
        task: "Added one ENS",
      });
      openAddressModal();
    };
    const goClickAddTwoOrMoreAddresses = () => {
      UserCreditGoClickedMP({
        session_id: getCurrentUser ? getCurrentUser()?.id : "",
        email_address: getCurrentUser ? getCurrentUser()?.email : "",
        task: "Added two or more wallet addresses",
      });
      openAddressModal();
    };
    const goClickAddEmail = () => {
      UserCreditGoClickedMP({
        session_id: getCurrentUser ? getCurrentUser()?.id : "",
        email_address: getCurrentUser ? getCurrentUser()?.email : "",
        task: "Verified email",
      });
      openEmailModal();
    };
    const goClickConnectWallet = () => {
      UserCreditGoClickedMP({
        session_id: getCurrentUser ? getCurrentUser()?.id : "",
        email_address: getCurrentUser ? getCurrentUser()?.email : "",
        task: "Connected wallet",
      });
      openConnectWalletModal();
    };
    const goClickOpenFeedback = () => {
      UserCreditGoClickedMP({
        session_id: getCurrentUser ? getCurrentUser()?.id : "",
        email_address: getCurrentUser ? getCurrentUser()?.email : "",
        task: "Provided feedback",
      });
      openProvideFeedbackModal();
    };
    const goClickConnectExchange = () => {
      UserCreditGoClickedMP({
        session_id: getCurrentUser ? getCurrentUser()?.id : "",
        email_address: getCurrentUser ? getCurrentUser()?.email : "",
        task: "Connected exchange",
      });
      openConnectExchangeModal();
    };
    const goClickFollowAnAddress = () => {
      UserCreditGoClickedMP({
        session_id: getCurrentUser ? getCurrentUser()?.id : "",
        email_address: getCurrentUser ? getCurrentUser()?.email : "",
        task: "Follow an Address",
      });
      this.props.history.push("/home-leaderboard");
    };
    const goClickFollowTwitter = () => {
      UserCreditGoClickedMP({
        session_id: getCurrentUser ? getCurrentUser()?.id : "",
        email_address: getCurrentUser ? getCurrentUser()?.email : "",
        task: "Followed @loch_chain",
      });
      window.open("https://twitter.com/loch_chain", "_blank");
      const twitterFollow = new URLSearchParams();
      twitterFollow.append("credits", "x_follower");
      this.props.addUserCredits(twitterFollow, this);
      this.callApi();
    };
    const goClickJoinTelegram = () => {
      UserCreditGoClickedMP({
        session_id: getCurrentUser ? getCurrentUser()?.id : "",
        email_address: getCurrentUser ? getCurrentUser()?.email : "",
        task: "Joined Telegram chat",
      });
      window.open("https://t.me/loch_chain", "_blank");
      const joinTelegram = new URLSearchParams();
      joinTelegram.append("credits", "joined_telegram");
      this.props.addUserCredits(joinTelegram, this);
      this.callApi();
    };
    if (whichBlock === "address_added") {
      return (
        <ProfileLochCreditPointsBlock
          title={
            this.state.tasksDone.includes(whichBlock)
              ? "Added one address"
              : "Add one address"
          }
          earnPoints={1}
          imageIcon={UserCreditWalletIcon}
          isDone={this.state.tasksDone.includes(whichBlock)}
          lastEle={whichBlockIndex === this.state.tasksList.length - 1}
          onClick={goClickAddAddress}
        />
      );
    } else if (whichBlock === "ens_added") {
      return (
        <ProfileLochCreditPointsBlock
          title={
            this.state.tasksDone.includes(whichBlock)
              ? "Added one ENS"
              : "Add one ENS"
          }
          earnPoints={2}
          imageIcon={UserCreditDiamondIcon}
          isDone={this.state.tasksDone.includes(whichBlock)}
          lastEle={whichBlockIndex === this.state.tasksList.length - 1}
          onClick={goClickAddEns}
        />
      );
    } else if (whichBlock === "email_added") {
      return (
        <ProfileLochCreditPointsBlock
          title={
            this.state.tasksDone.includes(whichBlock)
              ? "Verified email"
              : "Verify email"
          }
          earnPoints={3}
          imageIcon={UserCreditMailIcon}
          isDone={this.state.tasksDone.includes(whichBlock)}
          lastEle={whichBlockIndex === this.state.tasksList.length - 1}
          onClick={goClickAddEmail}
        />
      );
    } else if (whichBlock === "wallet_connected") {
      return (
        <ProfileLochCreditPointsBlock
          title={
            this.state.tasksDone.includes(whichBlock)
              ? "Connected wallet"
              : "Connect wallet"
          }
          earnPoints={4}
          imageIcon={UserCreditLinkIcon}
          isDone={this.state.tasksDone.includes(whichBlock)}
          lastEle={whichBlockIndex === this.state.tasksList.length - 1}
          onClick={goClickConnectWallet}
        />
      );
    } else if (whichBlock === "multiple_address_added") {
      return (
        <ProfileLochCreditPointsBlock
          title={
            this.state.tasksDone.includes(whichBlock)
              ? "Added two or more addresses"
              : "Add two or more addresses"
          }
          earnPoints={3}
          imageIcon={UserCreditWalletIcon}
          isDone={this.state.tasksDone.includes(whichBlock)}
          lastEle={whichBlockIndex === this.state.tasksList.length - 1}
          onClick={goClickAddTwoOrMoreAddresses}
        />
      );
    } else if (whichBlock === "exchange_connected") {
      return (
        <ProfileLochCreditPointsBlock
          title={
            this.state.tasksDone.includes(whichBlock)
              ? "Connected exchange"
              : "Connect exchange"
          }
          earnPoints={3}
          imageIcon={UserCreditLinkIcon}
          isDone={this.state.tasksDone.includes(whichBlock)}
          lastEle={whichBlockIndex === this.state.tasksList.length - 1}
          onClick={goClickConnectExchange}
        />
      );
    } else if (whichBlock === "following") {
      return (
        <ProfileLochCreditPointsBlock
          title={
            this.state.tasksDone.includes(whichBlock)
              ? "Following an Address"
              : "Follow an Address"
          }
          earnPoints={2}
          imageIcon={UserCreditWalletIcon}
          isDone={this.state.tasksDone.includes(whichBlock)}
          lastEle={whichBlockIndex === this.state.tasksList.length - 1}
          onClick={goClickFollowAnAddress}
        />
      );
    } else if (whichBlock === "twitter_spaces") {
      return (
        <ProfileLochCreditPointsBlock
          title={
            this.state.tasksDone.includes(whichBlock)
              ? "Attended Twitter Spaces"
              : "Attend Twitter Spaces"
          }
          earnPoints={1}
          imageIcon={XFormallyTwitterLogoIcon}
          isDone={this.state.tasksDone.includes(whichBlock)}
          lastEle={whichBlockIndex === this.state.tasksList.length - 1}
          // onClick={goClickAddEns}
        />
      );
    } else if (whichBlock === "x_follower") {
      return (
        <ProfileLochCreditPointsBlock
          title={
            this.state.tasksDone.includes(whichBlock)
              ? "Followed @loch_chain"
              : "Follow @loch_chain"
          }
          earnPoints={2}
          imageIcon={XFormallyTwitterLogoIcon}
          isDone={this.state.tasksDone.includes(whichBlock)}
          lastEle={whichBlockIndex === this.state.tasksList.length - 1}
          onClick={goClickFollowTwitter}
        />
      );
    } else if (whichBlock === "joined_telegram") {
      return (
        <ProfileLochCreditPointsBlock
          title={
            this.state.tasksDone.includes(whichBlock)
              ? "Joined Telegram chat"
              : "Join Telegram chat"
          }
          earnPoints={2}
          imageIcon={UserCreditTelegramIcon}
          isDone={this.state.tasksDone.includes(whichBlock)}
          lastEle={whichBlockIndex === this.state.tasksList.length - 1}
          onClick={goClickJoinTelegram}
        />
      );
    } else if (whichBlock === "feedbacks_added") {
      return (
        <ProfileLochCreditPointsBlock
          title={
            this.state.tasksDone.includes(whichBlock)
              ? "Provided feedback"
              : "Provide feedback"
          }
          earnPoints={2}
          imageIcon={FeedbackCreditIcon}
          isDone={this.state.tasksDone.includes(whichBlock)}
          lastEle={whichBlockIndex === this.state.tasksList.length - 1}
          onClick={goClickOpenFeedback}
        />
      );
    } else if (whichBlock === "use_referral_code") {
      return (
        <ProfileLochCreditPointsBlock
          title={
            this.state.tasksDone.includes(whichBlock)
              ? "Referral code used"
              : "Use referral code"
          }
          earnPoints={1}
          imageIcon={UserCreditLinkIcon}
          isDone={this.state.tasksDone.includes(whichBlock)}
          lastEle={whichBlockIndex === this.state.tasksList.length - 1}
          // onClick={goClickConnectExchange}
        />
      );
    }
    return null;
  };
  render() {
    if (this.state.loading) {
      return (
        <div className="profileCreditPointsLoadingContainer">
          <div className="animation-wrapper">
            <Loading />
          </div>
        </div>
      );
    }
    return (
      <div className="profileCreditPointsContainer">
        <div className="profileCreditPointsHeader">
          <div className="profileCreditPointsHeaderLeft">
            <Image
              className="profileCreditPointsHeaderLeftStartIcon"
              src={UserCreditStarIcon}
            />
            <div className="inter-display-medium f-s-20">
              Collect Loch points
            </div>
          </div>
          <div className="profileCreditPointsHeaderRight">
            {this.state.lochScore ? (
              <div className="inter-display-medium f-s-13">
                <span className="profileCreditPointsHeaderRightGreyText">
                  <span className="profileCreditPointsHeaderRightYellowText">
                    Your Loch score is {this.state.lochScore}
                  </span>
                  {this.state.topPercentage
                    ? `, which puts you in
                  the top ${this.state.topPercentage}% of users`
                    : ""}
                </span>
                {/* {" "}
              <span className="profileCreditPointsHeaderRightYellowText">
                10 points
              </span> */}
              </div>
            ) : null}
            <Image
              style={{
                marginRight: "3rem",
                marginLeft: "2.5rem",
                opacity: this.state.isLeftArrowDisabled ? 0.5 : 1,
              }}
              onClick={this.scrollLeft}
              className="profileCreditPointsHeaderRightArrowIcon"
              src={UserCreditScrollLeftArrowIcon}
            />
            <Image
              style={{
                opacity: this.state.isRightArrowDisabled ? 0.5 : 1,
              }}
              onClick={this.scrollRight}
              className="profileCreditPointsHeaderRightArrowIcon"
              src={UserCreditScrollRightArrowIcon}
            />
          </div>
        </div>
        <div className="profileCreditPointsDividerContainer">
          <div
            style={{
              width: `${
                (this.state.tasksDone.length > this.state.tasksList.length
                  ? this.state.tasksList.length
                  : this.state.tasksDone.length / this.state.tasksList.length) *
                100
              }%`,
            }}
            className="profileCreditPointsDivider"
          ></div>
        </div>

        <div
          id="profileCreditPointsScrollBody"
          className="profileCreditPointsBody"
          onScroll={this.handleCreditScroll}
        >
          <div className="profileCreditPointsSection">
            {this.state.tasksList
              .slice(0, 3)
              .map((singleTask, singleTaskIndex) => {
                return this.returnWhichBlock(singleTask, singleTaskIndex);
              })}
          </div>
          <div className="profileCreditPointsSection">
            {this.state.tasksList
              .slice(3, 6)
              .map((singleTask, singleTaskIndex) => {
                return this.returnWhichBlock(singleTask, singleTaskIndex);
              })}
          </div>
          <div className="profileCreditPointsSection">
            {this.state.tasksList
              .slice(6, 9)
              .map((singleTask, singleTaskIndex) => {
                return this.returnWhichBlock(singleTask, singleTaskIndex);
              })}
          </div>
          <div
            style={{
              justifyContent: "flex-start",
              paddingLeft: "2rem",
            }}
            className="profileCreditPointsSection"
          >
            {this.state.tasksList
              .slice(9, 10)
              .map((singleTask, singleTaskIndex) => {
                return this.returnWhichBlock(singleTask, singleTaskIndex);
              })}
          </div>
          {/* <div className="profileCreditPointsSection">
            {this.state.tasksList
              .slice(9, 12)
              .map((singleTask, singleTaskIndex) => {
                return this.returnWhichBlock(singleTask, singleTaskIndex);
              })}
          </div> */}
          {/* <ProfileLochCreditPointsBlock
            title="Add a wallet address"
            earnPoints={1}
            imageIcon={UserCreditWalletIcon}
          />
          <ProfileLochCreditPointsBlock
            title="Add one ENS"
            earnPoints={2}
            imageIcon={UserCreditDiamondIcon}
          />
          <ProfileLochCreditPointsBlock
            title="Add email address"
            earnPoints={3}
            imageIcon={UserCreditMailIcon}
          />
          <ProfileLochCreditPointsBlock
            title="Connect a wallet"
            earnPoints={3}
            imageIcon={UserCreditLinkIcon}
          />
          <ProfileLochCreditPointsBlock
            title="Follow @‌loch_chain"
            earnPoints={2}
            imageIcon={UserCreditTwitterIcon}
          />
          <ProfileLochCreditPointsBlock
            title="Join telegram chat"
            earnPoints={2}
            imageIcon={UserCreditTelegramIcon}
          />
          <ProfileLochCreditPointsBlock
            title="Add 3 wallet address"
            earnPoints={3}
            imageIcon={UserCreditWalletIcon}
          />
          <ProfileLochCreditPointsBlock
            title="Add 5 wallet address"
            earnPoints={4}
            imageIcon={UserCreditWalletIcon}
          />
          <ProfileLochCreditPointsBlock
            title="Connect exchange"
            earnPoints={3}
            imageIcon={UserCreditLinkIcon}
            lastEle
          /> */}
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  commonState: state.CommonState,
});
const mapDispatchToProps = {
  getUserCredits,
  updateWalletListFlag,
  addUserCredits,
};
ProfileLochCreditPoints.propTypes = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileLochCreditPoints);
