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
import {
  SmartMoneyNotifyClick,
  SmartMoneyWalletClicked,
} from "../../../utils/AnalyticsFunctions.js";
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
  handleOnNotifyClick = () => {
    SmartMoneyNotifyClick({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    this.props.openNotifyOnTransactionModal(this.props.mapData.account);
  };
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
      <div className="mobileSmartMoneyBlock">
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
                  if (!this.props.smartMoneyBlur) {
                    if (this.props.welcomePage) {
                      SmartMoneyWalletClicked({
                        session_id: getCurrentUser().id,
                        email_address: getCurrentUser().email,
                        wallet: this.props.mapData.account,
                      });
                      if (this.props.onLeaderboardWalletClick) {
                        this.props.onLeaderboardWalletClick(
                          this.props.mapData.account
                        );
                      }
                    } else {
                      let lochUser = getCurrentUser().id;

                      let slink = this.props.mapData.account;
                      let shareLink =
                        BASE_URL_S3 + "home/" + slink + "?redirect=home";
                      if (lochUser) {
                        const alreadyPassed =
                          window.sessionStorage.getItem("PassedRefrenceId");
                        if (alreadyPassed) {
                          shareLink =
                            shareLink + "&refrenceId=" + alreadyPassed;
                        } else {
                          shareLink = shareLink + "&refrenceId=" + lochUser;
                        }
                      }
                      SmartMoneyWalletClicked({
                        session_id: getCurrentUser().id,
                        email_address: getCurrentUser().email,
                        wallet: slink,
                      });
                      window.open(shareLink, "_blank", "noreferrer");
                    }
                  } else {
                    if (this.props.openSignInOnclickModal) {
                      this.props.openSignInOnclickModal();
                    }
                  }
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
                  dontSelectIt={this.props.smartMoneyBlur}
                />
              </div>
            </div>
          )}
          <div className="msmbBodyItem">
            <div className="inter-display-medium msmbBITitle">Notify</div>
            <div className={`inter-display-medium msmbBIAmount`}>
              <CheckboxCustomTable
                handleOnClick={this.handleOnNotifyClick}
                isChecked={false}
                noMargin
                dontSelectIt
              />
            </div>
          </div>
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
