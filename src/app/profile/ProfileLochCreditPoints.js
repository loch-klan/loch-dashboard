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

class ProfileLochCreditPoints extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      lochScore: "",
      topPercentage: "",

      tasksDone: [],
      tasksList: [
        "address_added",
        "ens_added",
        "email_added",
        "wallet_connected",
        "exchange_connected",
        "multiple_address_added",
      ],
    };
  }
  scrollRight = () => {
    var myElement = document.getElementById("profileCreditPointsScrollBody");
    var myElementWidth = document.getElementById(
      "profileCreditPointsScrollBody"
    ).clientWidth;
    var myElementCurrentScrollPos = document.getElementById(
      "profileCreditPointsScrollBody"
    ).scrollLeft;
    myElement.scroll({
      left: myElementCurrentScrollPos + myElementWidth,
      behavior: "smooth",
    });
  };
  scrollLeft = () => {
    var myElement = document.getElementById("profileCreditPointsScrollBody");
    var myElementWidth = document.getElementById(
      "profileCreditPointsScrollBody"
    ).clientWidth;
    var myElementCurrentScrollPos = document.getElementById(
      "profileCreditPointsScrollBody"
    ).scrollLeft;
    myElement.scroll({
      left: myElementCurrentScrollPos - myElementWidth,
      behavior: "smooth",
    });
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
    if (whichBlock === "address_added") {
      return (
        <ProfileLochCreditPointsBlock
          title="Add a wallet address"
          earnPoints={1}
          imageIcon={UserCreditWalletIcon}
          isDone={this.state.tasksDone.includes(whichBlock)}
          lastEle={whichBlockIndex === this.state.tasksList.length - 1}
          onClick={openAddressModal}
        />
      );
    } else if (whichBlock === "ens_added") {
      return (
        <ProfileLochCreditPointsBlock
          title="Add one ENS"
          earnPoints={2}
          imageIcon={UserCreditDiamondIcon}
          isDone={this.state.tasksDone.includes(whichBlock)}
          lastEle={whichBlockIndex === this.state.tasksList.length - 1}
          onClick={openAddressModal}
        />
      );
    } else if (whichBlock === "email_added") {
      return (
        <ProfileLochCreditPointsBlock
          title="Add email address"
          earnPoints={3}
          imageIcon={UserCreditMailIcon}
          isDone={this.state.tasksDone.includes(whichBlock)}
          lastEle={whichBlockIndex === this.state.tasksList.length - 1}
          onClick={openEmailModal}
        />
      );
    } else if (whichBlock === "wallet_connected") {
      return (
        <ProfileLochCreditPointsBlock
          title="Connect a wallet"
          earnPoints={3}
          imageIcon={UserCreditLinkIcon}
          isDone={this.state.tasksDone.includes(whichBlock)}
          lastEle={whichBlockIndex === this.state.tasksList.length - 1}
          onClick={openConnectWalletModal}
        />
      );
    } else if (whichBlock === "exchange_connected") {
      return (
        <ProfileLochCreditPointsBlock
          title="Connect exchange"
          earnPoints={3}
          imageIcon={UserCreditLinkIcon}
          isDone={this.state.tasksDone.includes(whichBlock)}
          lastEle={whichBlockIndex === this.state.tasksList.length - 1}
          onClick={openConnectExchangeModal}
        />
      );
    } else if (whichBlock === "multiple_address_added") {
      return (
        <ProfileLochCreditPointsBlock
          title="Add multiple wallet address"
          earnPoints={3}
          imageIcon={UserCreditWalletIcon}
          isDone={this.state.tasksDone.includes(whichBlock)}
          lastEle={whichBlockIndex === this.state.tasksList.length - 1}
          onClick={openAddressModal}
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
                  Your Loch score is {this.state.lochScore}
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
              }}
              onClick={this.scrollLeft}
              className="profileCreditPointsHeaderRightArrowIcon"
              src={UserCreditScrollLeftArrowIcon}
            />
            <Image
              onClick={this.scrollRight}
              className="profileCreditPointsHeaderRightArrowIcon"
              src={UserCreditScrollRightArrowIcon}
            />
          </div>
        </div>
        <div className="profileCreditPointsDivider" />

        <div
          id="profileCreditPointsScrollBody"
          className="profileCreditPointsBody"
        >
          {this.state.tasksList.map((singleTask, singleTaskIndex) => {
            return this.returnWhichBlock(singleTask, singleTaskIndex);
          })}
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
