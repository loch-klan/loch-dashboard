import React from "react";
import { connect } from "react-redux";
import { BaseReactComponent } from "../../utils/form";
import "./_referralCodesPage.scss";
import { PasswordIcon } from "../../assets/images/icons";
import { Image } from "react-bootstrap";

import { CopyClipboardIcon } from "../../assets/images";
import Loading from "../common/Loading";

class ReferralCodesPage extends BaseReactComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="referral-page referral-page-mobile">
        <div className="rp-body-container rp-body-container-mobile">
          <div className="rpb-data">
            <div className="mobile-header-container">
              <h4>Referral</h4>
              <p>Manage your referral codes here</p>
            </div>
            <div className="rpbd-header">
              <div className="rpbdh-title-container">
                <Image className="rpbdh-title-icon" src={PasswordIcon} />
                <div className="inter-display-medium rpbdh-title">
                  Referral Codes
                </div>
                {this.props.codesLeftToUse !== undefined &&
                this.props.codesLeftToUse !== null ? (
                  <div className="inter-display-medium rpbdh-title-subtext">
                    {this.props.codesLeftToUse} left
                  </div>
                ) : null}
              </div>
              <div
                onClick={this.props.copyAllTheCodes}
                className="inter-display-medium rpbdh-copy-button"
              >
                Copy all
              </div>
            </div>
            {this.props.referralsLoading ? (
              <div className="rpbd-loader">
                <Loading />
              </div>
            ) : (
              <>
                <div
                  onClick={() => {
                    this.props.history.push("/profile/referral-codes");
                  }}
                  className="rpbd-referall"
                >
                  <div className="psrcb-left">
                    <div className="inter-display-medium psrcb-text text-center">
                      Want more referral codes? Reach out to us on{" "}
                      <span
                        onClick={() => {
                          this.props.getMoreReferralCodes("twitter");
                        }}
                        className="psrcb-text-btn"
                      >
                        Twitter
                      </span>
                      <span> or </span>
                      <span
                        onClick={() => {
                          this.props.getMoreReferralCodes("telegram");
                        }}
                        className="psrcb-text-btn"
                      >
                        Telegram
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rpbd-body-container">
                  <div className="rpbd-body">
                    {this.props.referralCodes &&
                    this.props.referralCodes.length > 0 ? (
                      this.props.referralCodes.map(
                        (curReferralCode, curReferralCodeIndex) => (
                          <div
                            style={{
                              paddingTop:
                                curReferralCodeIndex === 0 ? "0px" : "",
                            }}
                            className="rpbdd-referral-block"
                          >
                            <div
                              className={`inter-display-medium rpbddrb-code ${
                                curReferralCode.used ? "rpbddrb-code-used" : ""
                              }`}
                            >
                              {curReferralCode.code}
                            </div>
                            <div className="inter-display-medium rpbddrb-status">
                              {curReferralCode.used ? (
                                <span>Used</span>
                              ) : (
                                <Image
                                  onClick={() => {
                                    this.props.copyTextPass(
                                      curReferralCode.code
                                    );
                                  }}
                                  className="rpbddrbs-icon"
                                  src={CopyClipboardIcon}
                                />
                              )}
                            </div>
                          </div>
                        )
                      )
                    ) : (
                      <div className="inter-display-medium rpbd-no-data">
                        No referral codes
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {};

ReferralCodesPage.propTypes = {};
export default connect(mapStateToProps, mapDispatchToProps)(ReferralCodesPage);
