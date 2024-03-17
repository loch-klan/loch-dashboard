import React from "react";
import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import {
  FeedbackCreditIcon,
  UserCreditDiamondIcon,
  UserCreditLinkIcon,
  UserCreditMailIcon,
  UserCreditStarIcon,
  UserCreditTelegramIcon,
  UserCreditWalletIcon,
  XFormallyTwitterLogoIcon,
} from "../../assets/images/icons/index.js";
import {
  LochPointsLoginModalOpen,
  UserCreditGoClickedMP,
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
      loading: false,
      lochScore: "",
      topPercentage: "",
      isLoggedIn: false,
      tasksDone: [],
      tasksList: [
        "email_added",
        "address_added",
        "ens_added",
        "wallet_connected",
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

  componentDidMount() {
    this.callApi();
    if (this.props.lochUser && this.props.lochUser.email) {
      this.setState({
        isLoggedIn: true,
      });
    }
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
    }
    if (this.props.followFlag !== prevProps.followFlag) {
      this.callApi();
    }
    if (prevProps.lochUser !== this.props.lochUser) {
      if (this.props.lochUser && this.props.lochUser.email) {
        this.setState({
          isLoggedIn: true,
        });
      } else {
        this.setState({
          isLoggedIn: false,
        });
      }
    }
  }
  callApi() {
    this.setState({
      loading: true,
    });
    this.props.getUserCredits(this);
  }
  lochPointsLoginBtnClickedLocal = () => {
    window.sessionStorage.setItem("lochPointsProfileLoginClicked", true);
  };
  openLoginBlock = () => {
    LochPointsLoginModalOpen({
      session_id: getCurrentUser ? getCurrentUser()?.id : "",
      email_address: getCurrentUser ? getCurrentUser()?.email : "",
    });
    if (
      document.getElementById("sidebar-open-sign-in-btn-loch-points-profile")
    ) {
      document
        .getElementById("sidebar-open-sign-in-btn-loch-points-profile")
        .click();
      this.lochPointsLoginBtnClickedLocal();
    } else if (
      document.getElementById("sidebar-closed-sign-in-btn-loch-points-profile")
    ) {
      document
        .getElementById("sidebar-closed-sign-in-btn-loch-points-profile")
        .click();
      this.lochPointsLoginBtnClickedLocal();
    }
  };
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
      const userDetails = this.props.lochUser;
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
      if (this.props.lochUser && this.props.lochUser.email) {
        UserCreditGoClickedMP({
          session_id: getCurrentUser ? getCurrentUser()?.id : "",
          email_address: getCurrentUser ? getCurrentUser()?.email : "",
          task: "Added one wallet address",
        });
        openAddressModal();
      } else {
        this.openLoginBlock();
      }
    };
    const goClickAddEns = () => {
      if (this.props.lochUser && this.props.lochUser.email) {
        UserCreditGoClickedMP({
          session_id: getCurrentUser ? getCurrentUser()?.id : "",
          email_address: getCurrentUser ? getCurrentUser()?.email : "",
          task: "Added one ENS",
        });
        openAddressModal();
      } else {
        this.openLoginBlock();
      }
    };
    const goClickAddTwoOrMoreAddresses = () => {
      if (this.props.lochUser && this.props.lochUser.email) {
        UserCreditGoClickedMP({
          session_id: getCurrentUser ? getCurrentUser()?.id : "",
          email_address: getCurrentUser ? getCurrentUser()?.email : "",
          task: "Added two or more wallet addresses",
        });
        openAddressModal();
      } else {
        this.openLoginBlock();
      }
    };
    const goClickAddEmail = () => {
      UserCreditGoClickedMP({
        session_id: getCurrentUser ? getCurrentUser()?.id : "",
        email_address: getCurrentUser ? getCurrentUser()?.email : "",
        task: "Verified email",
      });
      this.openLoginBlock();
    };
    const goClickConnectWallet = () => {
      if (this.props.lochUser && this.props.lochUser.email) {
        UserCreditGoClickedMP({
          session_id: getCurrentUser ? getCurrentUser()?.id : "",
          email_address: getCurrentUser ? getCurrentUser()?.email : "",
          task: "Connected wallet",
        });
        openConnectWalletModal();
      } else {
        this.openLoginBlock();
      }
    };
    const goClickOpenFeedback = () => {
      if (this.props.lochUser && this.props.lochUser.email) {
        UserCreditGoClickedMP({
          session_id: getCurrentUser ? getCurrentUser()?.id : "",
          email_address: getCurrentUser ? getCurrentUser()?.email : "",
          task: "Provided feedback",
        });
        openProvideFeedbackModal();
      } else {
        this.openLoginBlock();
      }
    };
    const goClickConnectExchange = () => {
      if (this.props.lochUser && this.props.lochUser.email) {
        UserCreditGoClickedMP({
          session_id: getCurrentUser ? getCurrentUser()?.id : "",
          email_address: getCurrentUser ? getCurrentUser()?.email : "",
          task: "Connected exchange",
        });
        openConnectExchangeModal();
      } else {
        this.openLoginBlock();
      }
    };
    const goClickFollowAnAddress = () => {
      if (this.props.lochUser && this.props.lochUser.email) {
        UserCreditGoClickedMP({
          session_id: getCurrentUser ? getCurrentUser()?.id : "",
          email_address: getCurrentUser ? getCurrentUser()?.email : "",
          task: "Follow an Address",
        });
        this.props.history.push("/home-leaderboard");
      } else {
        this.openLoginBlock();
      }
    };
    const goClickFollowTwitter = () => {
      if (this.props.lochUser && this.props.lochUser.email) {
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
      } else {
        this.openLoginBlock();
      }
    };
    const goClickJoinTelegram = () => {
      if (this.props.lochUser && this.props.lochUser.email) {
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
      } else {
        this.openLoginBlock();
      }
    };
    const isTheTaskDone = () => {
      if (!this.state.isLoggedIn) {
        return false;
      }
      if (this.state.tasksDone.includes(whichBlock)) {
        return true;
      }
      return false;
    };
    if (whichBlock === "address_added") {
      return (
        <ProfileLochCreditPointsBlock
          title={isTheTaskDone() ? "Added one address" : "Add one address"}
          earnPoints={1}
          imageIcon={UserCreditWalletIcon}
          isDone={isTheTaskDone()}
          lastEle={whichBlockIndex === this.state.tasksList.length - 1}
          onClick={goClickAddAddress}
        />
      );
    } else if (whichBlock === "ens_added") {
      return (
        <ProfileLochCreditPointsBlock
          title={isTheTaskDone() ? "Added one ENS" : "Add one ENS"}
          earnPoints={2}
          imageIcon={UserCreditDiamondIcon}
          isDone={isTheTaskDone()}
          lastEle={whichBlockIndex === this.state.tasksList.length - 1}
          onClick={goClickAddEns}
        />
      );
    } else if (whichBlock === "email_added") {
      return (
        <ProfileLochCreditPointsBlock
          title={isTheTaskDone() ? "Verified email" : "Verify email"}
          earnPoints={3}
          imageIcon={UserCreditMailIcon}
          isDone={isTheTaskDone()}
          lastEle={whichBlockIndex === this.state.tasksList.length - 1}
          onClick={goClickAddEmail}
        />
      );
    } else if (whichBlock === "wallet_connected") {
      return (
        <ProfileLochCreditPointsBlock
          title={isTheTaskDone() ? "Connected wallet" : "Connect wallet"}
          earnPoints={4}
          imageIcon={UserCreditLinkIcon}
          isDone={isTheTaskDone()}
          lastEle={whichBlockIndex === this.state.tasksList.length - 1}
          onClick={goClickConnectWallet}
        />
      );
    } else if (whichBlock === "multiple_address_added") {
      return (
        <ProfileLochCreditPointsBlock
          title={
            isTheTaskDone()
              ? "Added two or more addresses"
              : "Add two or more addresses"
          }
          earnPoints={3}
          imageIcon={UserCreditWalletIcon}
          isDone={isTheTaskDone()}
          lastEle={whichBlockIndex === this.state.tasksList.length - 1}
          onClick={goClickAddTwoOrMoreAddresses}
        />
      );
    } else if (whichBlock === "exchange_connected") {
      return (
        <ProfileLochCreditPointsBlock
          title={isTheTaskDone() ? "Connected exchange" : "Connect exchange"}
          earnPoints={3}
          imageIcon={UserCreditLinkIcon}
          isDone={isTheTaskDone()}
          lastEle={whichBlockIndex === this.state.tasksList.length - 1}
          onClick={goClickConnectExchange}
        />
      );
    } else if (whichBlock === "following") {
      return (
        <ProfileLochCreditPointsBlock
          title={isTheTaskDone() ? "Following an Address" : "Follow an Address"}
          earnPoints={2}
          imageIcon={UserCreditWalletIcon}
          isDone={isTheTaskDone()}
          lastEle={whichBlockIndex === this.state.tasksList.length - 1}
          onClick={goClickFollowAnAddress}
        />
      );
    } else if (whichBlock === "twitter_spaces") {
      return (
        <ProfileLochCreditPointsBlock
          title={
            isTheTaskDone()
              ? "Attended Twitter Spaces"
              : "Attend Twitter Spaces"
          }
          earnPoints={1}
          imageIcon={XFormallyTwitterLogoIcon}
          isDone={isTheTaskDone()}
          lastEle={whichBlockIndex === this.state.tasksList.length - 1}
          // onClick={goClickAddEns}
        />
      );
    } else if (whichBlock === "x_follower") {
      return (
        <ProfileLochCreditPointsBlock
          title={
            isTheTaskDone() ? "Followed @loch_chain" : "Follow @loch_chain"
          }
          earnPoints={2}
          imageIcon={XFormallyTwitterLogoIcon}
          isDone={isTheTaskDone()}
          lastEle={whichBlockIndex === this.state.tasksList.length - 1}
          onClick={goClickFollowTwitter}
        />
      );
    } else if (whichBlock === "joined_telegram") {
      return (
        <ProfileLochCreditPointsBlock
          title={
            isTheTaskDone() ? "Joined Telegram chat" : "Join Telegram chat"
          }
          earnPoints={2}
          imageIcon={UserCreditTelegramIcon}
          isDone={isTheTaskDone()}
          lastEle={whichBlockIndex === this.state.tasksList.length - 1}
          onClick={goClickJoinTelegram}
        />
      );
    } else if (whichBlock === "feedbacks_added") {
      return (
        <ProfileLochCreditPointsBlock
          title={isTheTaskDone() ? "Provided feedback" : "Provide feedback"}
          earnPoints={2}
          imageIcon={FeedbackCreditIcon}
          isDone={isTheTaskDone()}
          lastEle={whichBlockIndex === this.state.tasksList.length - 1}
          onClick={goClickOpenFeedback}
        />
      );
    } else if (whichBlock === "use_referral_code") {
      return (
        <ProfileLochCreditPointsBlock
          title={isTheTaskDone() ? "Referral code used" : "Use referral code"}
          earnPoints={1}
          imageIcon={UserCreditLinkIcon}
          isDone={isTheTaskDone()}
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
            {this.state.lochScore && this.state.isLoggedIn ? (
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
          </div>
        </div>
        <div className="profileCreditPointsDividerContainer">
          <div
            style={{
              width: `${
                this.state.isLoggedIn
                  ? (this.state.tasksDone.length > this.state.tasksList.length
                      ? this.state.tasksList.length
                      : this.state.tasksDone.length /
                        this.state.tasksList.length) * 100
                  : 0
              }%`,
            }}
            className="profileCreditPointsDivider"
          ></div>
        </div>

        <div
          id="profileCreditPointsScrollBody"
          className="profileCreditPointsBody"
        >
          {this.state.tasksList.map((singleTask, singleTaskIndex) => {
            return this.returnWhichBlock(singleTask, singleTaskIndex);
          })}

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
