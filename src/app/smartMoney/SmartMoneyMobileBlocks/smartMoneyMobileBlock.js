import React from "react";
import GainIcon from "../../../assets/images/icons/GainIcon.svg";
import LossIcon from "../../../assets/images/icons/LossIcon.svg";
import { connect } from "react-redux";
import { BaseReactComponent } from "../../../utils/form/index.js";
import {
  CurrencyType,
  TruncateText,
  numToCurrency,
} from "../../../utils/ReusableFunctions.js";
import { Image } from "react-bootstrap";
import { getCurrentUser } from "../../../utils/ManageToken.js";
import { BASE_URL_S3 } from "../../../utils/Constant.js";
import { SmartMoneyWalletClicked } from "../../../utils/AnalyticsFunctions.js";
import {
  ArrowDownLeftSmallIcon,
  ArrowUpRightSmallIcon,
} from "../../../assets/images/icons/index.js";
import CheckboxCustomTable from "../../common/customCheckboxTable.js";

class smartMoneyMobileBlock extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleOnClick = (addItem) => {
    if (!this.props.smartMoneyBlur && this.props.handleFollowUnfollow) {
      this.props.handleFollowUnfollow(
        this.props.mapData.account,
        addItem,
        this.props.mapData.tagName
      );
    } else {
      if (this.props.openSignInOnclickModal) {
        this.props.openSignInOnclickModal();
      }
    }
  };
  render() {
    return (
      <div
        className={`mobileSmartMoneyBlock ${
          this.props.justShowTable ? "mobileSmartMoneyBlockCopyTrade" : ""
        }`}
      >
        <div className="msmbHeader">
          <div className="msmbHeaderLeft">
            {this.props.mapData.rank ? (
              <div className="inter-display-medium msmbHeaderRank">
                {this.props.mapData.rank}.
              </div>
            ) : null}
            {this.props.mapData.tagName ? (
              <div className="inter-display-medium msmbHeaderNickName">
                {this.props.mapData.tagName}
              </div>
            ) : null}
            {this.props.mapData.account ? (
              <div
                onClick={() => {
                  this.props.goToAddress(this.props.mapData.account);
                }}
                className="inter-display-medium msmbHeaderAccount"
              >
                {TruncateText(this.props.mapData.account)}
              </div>
            ) : null}
          </div>
          <div className="msmbHeaderRight">
            <div className="inter-display-medium msmbHeaderNetWorth">
              {CurrencyType(false) + numToCurrency(this.props.netWorth)}
            </div>
          </div>
        </div>
        <div className="msmbBody">
          <div className="msmbBodyItem">
            <div className="inter-display-medium msmbBITitle">
              Net flows (1 year)
            </div>
            <div className={`inter-display-medium msmbBIAmount`}>
              {this.props.netFlows !== 0 ? (
                <Image
                  style={{
                    height: "1.3rem",
                    width: "1.3rem",
                  }}
                  src={
                    this.props.netFlows < 0
                      ? ArrowDownLeftSmallIcon
                      : ArrowUpRightSmallIcon
                  }
                  className="mr-2"
                />
              ) : null}
              <span>
                {CurrencyType(false) + numToCurrency(this.props.netFlows)}
              </span>
            </div>
          </div>
          <div className="msmbBodyItem">
            <div className="inter-display-medium msmbBITitle">
              Unrealized PnL
            </div>
            <div className={`inter-display-medium msmbBIAmount`}>
              {this.props.profits !== 0 ? (
                <Image
                  style={{
                    height: "1.3rem",
                    width: "1.3rem",
                  }}
                  src={
                    this.props.profits < 0
                      ? ArrowDownLeftSmallIcon
                      : ArrowUpRightSmallIcon
                  }
                  className="mr-2"
                />
              ) : null}

              <span>
                {CurrencyType(false) + numToCurrency(this.props.profits)}
              </span>
            </div>
          </div>
          {this.props.hideFollow ? null : (
            <div className="msmbBodyItem">
              <div className="inter-display-medium msmbBITitle">Follow</div>
              <div className={`inter-display-medium msmbBIAmount`}>
                <CheckboxCustomTable
                  handleOnClick={this.handleOnClick}
                  isChecked={
                    this.props.mapData.following && !this.props.smartMoneyBlur
                  }
                  noMargin
                  dontSelectIt={
                    this.props.smartMoneyBlur || this.props.isNoUser
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {};

smartMoneyMobileBlock.propTypes = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(smartMoneyMobileBlock);
