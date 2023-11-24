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

class smartMoneyMobileBlock extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

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
                  let lochUser = getCurrentUser().id;

                  let slink = this.props.mapData.account;
                  let shareLink =
                    BASE_URL_S3 + "home/" + slink + "?redirect=home";
                  if (lochUser) {
                    const alreadyPassed =
                      window.sessionStorage.getItem("PassedRefrenceId");
                    if (alreadyPassed) {
                      shareLink = shareLink + "&refrenceId=" + alreadyPassed;
                    } else {
                      shareLink = shareLink + "&refrenceId=" + lochUser;
                    }
                  }
                  SmartMoneyWalletClicked({
                    session_id: getCurrentUser().id,
                    email_address: getCurrentUser().email,
                    wallet: slink,
                    isMobile: true,
                  });
                  window.open(shareLink, "_blank", "noreferrer");
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
              Realized PnL (1yr)
            </div>
            <div
              className={`inter-display-medium msmbBIAmount ${
                this.props.netFlows >= 0
                  ? "msmbBIAmountGain"
                  : "msmbBIAmountLoss"
              }`}
            >
              {this.props.netFlows !== 0 ? (
                <Image
                  src={this.props.netFlows < 0 ? LossIcon : GainIcon}
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
            <div
              className={`inter-display-medium msmbBIAmount ${
                this.props.profits >= 0
                  ? "msmbBIAmountGain"
                  : "msmbBIAmountLoss"
              }`}
            >
              {this.props.profits !== 0 ? (
                <Image
                  src={this.props.profits < 0 ? LossIcon : GainIcon}
                  className="mr-2"
                />
              ) : null}

              <span>
                {CurrencyType(false) + numToCurrency(this.props.profits)}
              </span>
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
