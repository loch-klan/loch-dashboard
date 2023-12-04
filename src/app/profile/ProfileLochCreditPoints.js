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

class ProfileLochCreditPoints extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {};
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
  render() {
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
            <div className="inter-display-medium f-s-13">
              <span className="profileCreditPointsHeaderRightGreyText">
                You have
              </span>{" "}
              <span className="profileCreditPointsHeaderRightYellowText">
                10 points
              </span>
            </div>
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
          <ProfileLochCreditPointsBlock
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
          />
        </div>
      </div>
    );
  }
}
const mapStateToProps = () => ({});
const mapDispatchToProps = {};
ProfileLochCreditPoints.propTypes = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileLochCreditPoints);
