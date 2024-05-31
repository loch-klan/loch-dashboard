import React from "react";
import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import {
  CopyTradeSwapIcon,
  FeedbackCreditIcon,
  LochLogoBlackThickIcon,
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
import {
  dontOpenLoginPopup,
  goToTelegram,
  isPremiumUser,
  mobileCheck,
  removeBlurMethods,
  removeOpenModalAfterLogin,
  removeSignUpMethods,
} from "../../utils/ReusableFunctions.js";
import PaywallModal from "../common/PaywallModal.js";
import { BASE_URL_S3 } from "../../utils/Constant.js";

class ProfileLochCreditPoints extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLochPaymentModal: false,
      lochPremiumCredits: 10,
      lochPremiumCreditMonths: 1,
      isMobile: false,
      greenLinePercentage: 0,
      loading: false,
      lochScore: "",
      topPercentage: "",
      isLoggedIn: false,
      tasksDone: [],
      tasksList: [
        "email_added",
        "wallet_connected",
        "exchange_connected",
        "ens_added",
        "following",
        "x_follower",
        "joined_telegram",
        "feedbacks_added",
        "address_added",
        "loch_premium",
        "copy_trade",
        // "twitter_spaces",
        // "provide_feedback",
        // "use_referral_code",
      ],
    };
  }
  hidePaymentModal = () => {
    this.setState({
      isLochPaymentModal: false,
    });
  };
  showPaymentModal = () => {
    if (isPremiumUser()) {
      return null;
    }
    removeBlurMethods();
    removeSignUpMethods();
    window.localStorage.setItem("blurredSubscribeToPremiumLochPoint", true);
    const userDetails = JSON.parse(window.localStorage.getItem("lochUser"));
    if (userDetails && userDetails.email) {
      dontOpenLoginPopup();
      this.setState({
        isLochPaymentModal: true,
      });
    } else {
      removeOpenModalAfterLogin();
      setTimeout(() => {
        window.localStorage.setItem("openInsightsPaymentModal", true);
      }, 1000);
      if (document.getElementById("sidebar-open-sign-in-btn")) {
        document.getElementById("sidebar-open-sign-in-btn").click();
        dontOpenLoginPopup();
      } else if (document.getElementById("sidebar-closed-sign-in-btn")) {
        document.getElementById("sidebar-closed-sign-in-btn").click();
        dontOpenLoginPopup();
      }
    }
  };
  newPosBase = () => {
    return 12;
    // return this.state.tasksList.length;
  };

  componentDidMount() {
    if (!this.props.dontCallApis) {
      if (mobileCheck()) {
        this.setState({
          isMobile: true,
        });
      }
      if (this.props.commonState.creditPointsBlock) {
        this.callApi();
      }
      if (this.props.lochUser && this.props.lochUser.email) {
        this.setState({
          isLoggedIn: true,
        });
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // if (this.props.isUpdate !== prevProps.isUpdate) {
    //   this.callApi();
    //   this.setState({
    //     isLeftArrowDisabled: true,
    //     isRightArrowDisabled: false,
    //   });
    // }
    if (prevState.tasksDone !== this.state.tasksDone) {
      if (this.state.tasksDone.length > 0) {
        let curCredits = 0;
        for (let i = 0; i < this.state.tasksDone.length; i++) {
          if (this.state.tasksDone[i] === "loch_premium") {
            curCredits = curCredits + 10;
          }
        }
        if (curCredits >= 10) {
          this.setState({
            lochPremiumCredits: curCredits,
            lochPremiumCreditMonths: curCredits / 10,
          });
        }
      }
      if (this.state.tasksDone.length >= this.state.tasksList.length) {
        this.setState({
          greenLinePercentage: 100,
        });
      } else {
        let doneTask = 0;
        let totalTask = 0;
        if (this.state.tasksDone) {
          doneTask = this.state.tasksDone.length;
        }
        if (this.state.tasksList) {
          totalTask = this.state.tasksList.length;
        }
        let tempGreenLineHolder = (doneTask / totalTask) * 100;
        if (this.state.isLoggedIn) {
          this.setState({
            greenLinePercentage: tempGreenLineHolder,
          });
        } else {
          if (tempGreenLineHolder >= 20) {
            this.setState({
              greenLinePercentage: 20,
            });
          } else {
            this.setState({
              greenLinePercentage: tempGreenLineHolder,
            });
          }
        }
      }
    }
    if (!this.props.commonState.creditPointsBlock && !this.props.dontCallApis) {
      this.props.updateWalletListFlag("creditPointsBlock", true);
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
    const isLochUser = JSON.parse(window.localStorage.getItem("lochUser"));
    this.props.getUserCredits(this, isLochUser);
  }
  lochPointsLoginBtnClickedLocal = () => {
    window.localStorage.setItem("lochPointsProfileLoginClicked", true);
  };
  openLoginBlock = () => {
    LochPointsLoginModalOpen({
      session_id: getCurrentUser ? getCurrentUser()?.id : "",
      email_address: getCurrentUser ? getCurrentUser()?.email : "",
    });

    window.localStorage.setItem("lochPointsSignInModal", true);
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
      if (this.props.isMobile) {
        if (
          document.getElementById("topBarContainerInputBlockInputId") &&
          document.getElementById("topBarContainerInputBlockInputId").focus
        ) {
          document.getElementById("topBarContainerInputBlockInputId").focus();
        }
        if (this.state.isMobile) {
          if (
            document.getElementById("newWelcomeWallet-1") &&
            document.getElementById("newWelcomeWallet-1").focus
          ) {
            document.getElementById("newWelcomeWallet-1").focus();
          }
        }
      } else {
        this.props.showFocusedInput();
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

    const goClickGoToCopyTrade = () => {
      if (this.props.lochUser && this.props.lochUser.email) {
        UserCreditGoClickedMP({
          session_id: getCurrentUser ? getCurrentUser()?.id : "",
          email_address: getCurrentUser ? getCurrentUser()?.email : "",
          task: "Added one copy trade",
        });
        this.props.history.push("/copy-trade");
      } else {
        this.openLoginBlock();
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
    const goClickSubscribPremium = () => {
      UserCreditGoClickedMP({
        session_id: getCurrentUser ? getCurrentUser()?.id : "",
        email_address: getCurrentUser ? getCurrentUser()?.email : "",
        task: "Subscribe to loch premium",
      });
      this.showPaymentModal();
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
        goToTelegram();
        const joinTelegram = new URLSearchParams();
        joinTelegram.append("credits", "joined_telegram");
        this.props.addUserCredits(joinTelegram, this);
        this.callApi();
      } else {
        this.openLoginBlock();
      }
    };
    const isTheTaskDone = (skipLogin = false) => {
      if (!this.state.isLoggedIn && !skipLogin) {
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
          title={isTheTaskDone(true) ? "Added one address" : "Add one address"}
          earnPoints={1}
          imageIcon={UserCreditWalletIcon}
          isDone={isTheTaskDone(true)}
          lastEle={whichBlockIndex === this.state.tasksList.length - 1}
          onClick={goClickAddAddress}
        />
      );
    } else if (whichBlock === "copy_trade") {
      return (
        <ProfileLochCreditPointsBlock
          title={
            isTheTaskDone(true) ? "Added one copy trade" : "Add one copy trade"
          }
          earnPoints={5}
          imageIcon={CopyTradeSwapIcon}
          isDone={isTheTaskDone(true)}
          lastEle={whichBlockIndex === this.state.tasksList.length - 1}
          onClick={goClickGoToCopyTrade}
        />
      );
    } else if (whichBlock === "ens_added") {
      return (
        <ProfileLochCreditPointsBlock
          title={isTheTaskDone(true) ? "Added one ENS" : "Add one ENS"}
          earnPoints={2}
          imageIcon={UserCreditDiamondIcon}
          isDone={isTheTaskDone(true)}
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
    } else if (whichBlock === "loch_premium") {
      return (
        <ProfileLochCreditPointsBlock
          title={
            isTheTaskDone()
              ? `Premium: ${this.state.lochPremiumCreditMonths} month${
                  this.state.lochPremiumCreditMonths > 1 ? "s" : ""
                }`
              : `Premium: 1 month`
          }
          earnPoints={this.state.lochPremiumCredits}
          imageIcon={LochLogoBlackThickIcon}
          isDone={isTheTaskDone()}
          lastEle={whichBlockIndex === this.state.tasksList.length - 1}
          onClick={goClickSubscribPremium}
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
        {this.state.isLochPaymentModal ? (
          <PaywallModal
            show={this.state.isLochPaymentModal}
            onHide={this.hidePaymentModal}
            redirectLink={BASE_URL_S3 + "/intelligence/insights"}
            hideBackBtn
            isMobile={this.state.isMobile}
          />
        ) : null}
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
                    Your Loch score is{" "}
                    {this.state.isLoggedIn
                      ? this.state.lochScore
                      : this.state.lochScore > 3
                      ? 3
                      : this.state.lochScore}
                  </span>
                  {this.state.topPercentage
                    ? `${this.state.isMobile ? "" : ", "}which puts you in
                  the top ${
                    this.state.isLoggedIn
                      ? this.state.topPercentage
                      : this.state.topPercentage < 71
                      ? 71
                      : this.state.topPercentage
                  }% of users`
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
              width: `${this.state.greenLinePercentage}%`,
            }}
            className="profileCreditPointsDivider"
          ></div>
        </div>

        <div
          id="profileCreditPointsScrollBody"
          className="profileCreditPointsBody"
        >
          {this.state.tasksList.map((singleTask, singleTaskIndex) => {
            if (!this.state.tasksDone.includes(singleTask)) {
              return this.returnWhichBlock(singleTask, singleTaskIndex);
            }
            return null;
          })}
          {this.state.tasksDone.map((singleTask, singleTaskIndex) => {
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
