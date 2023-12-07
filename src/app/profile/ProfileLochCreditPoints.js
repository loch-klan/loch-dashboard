import React from "react";
import { connect } from "react-redux";
import BaseReactComponent from "../../utils/form/BaseReactComponent.js";
import { Image } from "react-bootstrap";
import {
  UserCreditDiamondIcon,
  UserCreditLinkIcon,
  UserCreditMailIcon,
  UserCreditScrollLeftArrowIcon,
  UserCreditScrollRightArrowIcon,
  UserCreditStarIcon,
  UserCreditTelegramIcon,
  UserCreditTwitterIcon,
  UserCreditWalletIcon,
} from "../../assets/images/icons/index.js";
import ProfileLochCreditPointsBlock from "./ProfileLochCreditPointsBlock.js";
import { getUserCredits } from "./Api.js";
import Loading from "../common/Loading.js";
import { getCurrentUser } from "../../utils/ManageToken.js";
import {
  UserCreditGoClickedMP,
  UserCreditLeftScrollClickedMP,
  UserCreditRightScrollClickedMP,
} from "../../utils/AnalyticsFunctions.js";

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
      ],
    };
  }

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
    if (newPos === (this.state.tasksList.length / 3 - 1) * myElementWidth) {
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
      } else if (
        newPos ===
        (this.state.tasksList.length / 3 - 1) * myElementWidth
      ) {
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
    if (this.props.isUpdate !== prevProps.isUpdate) {
      this.callApi();
    }
  }
  callApi() {
    this.setState({
      loading: true,
    });
    this.props.getUserCredits(this);
  }
  returnWhichBlock = (whichBlock, whichBlockIndex) => {
    const openAddressModal = () => {
      if (document.getElementById("address-button-two")) {
        document.getElementById("address-button-two").click();
      } else if (document.getElementById("address-button-one")) {
        document.getElementById("address-button-one").click();
      }
    };

    const openEmailModal = () => {
      if (document.getElementById("sidebar-open-sign-in-btn")) {
        document.getElementById("sidebar-open-sign-in-btn").click();
      } else if (document.getElementById("sidebar-closed-sign-in-btn")) {
        document.getElementById("sidebar-closed-sign-in-btn").click();
      }
    };
    const openConnectWalletModal = () => {
      if (document.getElementById("topbar-connect-wallet-btn")) {
        document.getElementById("topbar-connect-wallet-btn").click();
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
    const goClickConnectExchange = () => {
      UserCreditGoClickedMP({
        session_id: getCurrentUser ? getCurrentUser()?.id : "",
        email_address: getCurrentUser ? getCurrentUser()?.email : "",
        task: "Connected exchange",
      });
      openConnectExchangeModal();
    };
    if (whichBlock === "address_added") {
      return (
        <ProfileLochCreditPointsBlock
          title="Added one wallet address"
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
          title="Added one ENS"
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
          title="Verified email"
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
          title="Connected wallet"
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
          title="Added two or more wallet addresses"
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
          title="Connected exchange"
          earnPoints={3}
          imageIcon={UserCreditLinkIcon}
          isDone={this.state.tasksDone.includes(whichBlock)}
          lastEle={whichBlockIndex === this.state.tasksList.length - 1}
          onClick={goClickConnectExchange}
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
            <div>
              <span className="profileCreditPointsHeaderLeftGreyText inter-display-medium f-s-13">
                <span className="profileCreditPointsHeaderLeftGreenText">
                  {this.state.tasksDone.length > this.state.tasksList.length
                    ? this.state.tasksList.length
                    : this.state.tasksDone.length}{" "}
                  steps
                </span>
                {this.state.tasksList && this.state.tasksList.length > 0
                  ? ` out of ${this.state.tasksList.length} steps`
                  : ""}
              </span>
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
const mapStateToProps = () => ({});
const mapDispatchToProps = {
  getUserCredits,
};
ProfileLochCreditPoints.propTypes = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileLochCreditPoints);
