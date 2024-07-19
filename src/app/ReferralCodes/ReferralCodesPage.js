import React from "react";
import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import { CopyClipboardIcon } from "../../assets/images";
import { PasswordIcon } from "../../assets/images/icons";
import {
  CopyAllCodesProfileReferralPage,
  CopyCodeProfileGetMoreCodes,
  CopyCodeProfileReferralPage,
  ProfileReferralPage,
  TimeSpentReferralCodes,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import {
  copyText,
  emailPrithvir,
  goToTelegram,
  goToTwitter,
  mobileCheck,
  scrollToTop,
} from "../../utils/ReusableFunctions";
import { BaseReactComponent } from "../../utils/form";
import WelcomeCard from "../Portfolio/WelcomeCard";
import { setPageFlagDefault, updateWalletListFlag } from "../common/Api";
import Loading from "../common/Loading";
import PageHeader from "../common/PageHeader";
import { getAllCoins } from "../onboarding/Api";
import { getAllWalletListApi } from "../wallet/Api";
import "./_referralCodesPage.scss";
import { getReferallCodes } from "./ReferralCodesApi";
import MobileLayout from "../layout/MobileLayout";
import ReferralCodesMobilePage from "./ReferralCodesMobilePage";

class ReferralCodesPage extends BaseReactComponent {
  constructor(props) {
    super(props);

    this.state = {
      startTime: "",
      referralsLoading: true,
      referralCodes: [],
      codesLeftToUse: undefined,
      isMobileDevice: false,
    };
  }
  getOtherData = () => {
    this.props.getAllCoins();

    let tempData = new URLSearchParams();
    tempData.append("start", 0);
    tempData.append("conditions", JSON.stringify([]));
    tempData.append("limit", 50);
    tempData.append("sorts", JSON.stringify([]));

    this.props.getAllWalletListApi(tempData, this);
  };

  startPageView = () => {
    this.setState({
      startTime: new Date() * 1,
    });
    ProfileReferralPage({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    // Inactivity Check
    window.checkReferralCodesTimer = setInterval(() => {
      this.checkForInactivity();
    }, 900000);
  };
  componentDidMount() {
    const isLochUser = JSON.parse(window.localStorage.getItem("lochUser"));
    // if (!(isLochUser && isLochUser.email)) {
    //   this.props.history.push("/profile");
    // }
    scrollToTop();
    if (mobileCheck()) {
      this.setState({
        isMobileDevice: true,
      });
    }
    this.startPageView();
    this.updateTimer(true);
    if (this.props.commonState.profileReferralPage) {
      this.callApi();
    }
    this.getOtherData();
  }
  updateTimer = (first) => {
    const tempExistingExpiryTime = window.localStorage.getItem(
      "referralCodesPageExpiryTime"
    );
    if (!tempExistingExpiryTime && !first) {
      this.startPageView();
    }
    const tempExpiryTime = Date.now() + 1800000;
    window.localStorage.setItem("referralCodesPageExpiryTime", tempExpiryTime);
  };
  endPageView = () => {
    clearInterval(window.checkReferralCodesTimer);
    window.localStorage.removeItem("referralCodesPageExpiryTime");
    if (this.state.startTime) {
      let endTime = new Date() * 1;
      let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
      TimeSpentReferralCodes({
        time_spent: TimeSpent,
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
    }
  };
  checkForInactivity = () => {
    const tempExpiryTime = window.localStorage.getItem(
      "referralCodesPageExpiryTime"
    );
    if (tempExpiryTime && tempExpiryTime < Date.now()) {
      this.endPageView();
    }
  };
  componentWillUnmount() {
    const tempExpiryTime = window.localStorage.getItem(
      "referralCodesPageExpiryTime"
    );
    if (tempExpiryTime) {
      this.endPageView();
    }
  }
  callApi = () => {
    this.props.getReferallCodes(this.stopLoader);
  };
  componentDidUpdate(prevProps, prevState) {
    if (!this.props.commonState.profileReferralPage) {
      this.getOtherData();
      this.callApi();
      this.props.updateWalletListFlag("profileReferralPage", true);
    }

    if (prevProps.referralCodesState !== this.props.referralCodesState) {
      let tempCodesLeft = 0;
      this.props.referralCodesState.forEach((curReferralCode) => {
        if (!curReferralCode.used) {
          tempCodesLeft++;
        }
      });
      this.setState({
        referralCodes: this.props.referralCodesState,
        codesLeftToUse: tempCodesLeft,
      });
      this.stopLoader();
    }
  }
  stopLoader = () => {
    this.setState({
      referralsLoading: false,
    });
  };
  CheckApiResponse = () => {
    this.props.setPageFlagDefault();
  };
  copyAllTheCodes = () => {
    CopyAllCodesProfileReferralPage({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    let allCodes = "";
    this.state.referralCodes.forEach(
      (curReferralCode, curReferralCodeIndex) => {
        if (curReferralCode.used === false) {
          allCodes += curReferralCode.code + "\n";
        }
      }
    );
    if (allCodes) {
      copyText(allCodes);
    }
  };
  copyTextPass = (passedCode) => {
    CopyCodeProfileReferralPage({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      code: passedCode,
    });
    copyText(passedCode);
  };
  getMoreReferralCodes = (contactPoint) => {
    CopyCodeProfileGetMoreCodes({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      contact_point: contactPoint,
    });
    console.log("contactPoint ", contactPoint);
    if (contactPoint === "twitter") {
      goToTwitter();
    } else if (contactPoint === "telegram") {
      goToTelegram();
    } else if (contactPoint === "email") {
      emailPrithvir();
    }
  };
  render() {
    if (this.state.isMobileDevice) {
      return (
        <MobileLayout
          handleShare={() => null}
          showpath
          noHomeInPath
          currentPage={"referral-codes"}
          hideFooter
          hideAddresses
          history={this.props.history}
          updateTimer={this.updateTimer}
        >
          <ReferralCodesMobilePage
            copyAllTheCodes={this.copyAllTheCodes}
            copyTextPass={this.copyTextPass}
            getMoreReferralCodes={this.getMoreReferralCodes}
            referralCodes={this.state.referralCodes}
            codesLeftToUse={this.state.codesLeftToUse}
            referralsLoading={this.state.referralsLoading}
            history={this.props.history}
            // goToMyReferralCodes={this.goToMyReferralCodes}
            // followFlag={this.state.followFlag}
            // isUpdate={this.state.isUpdate}
            // lochUser={this.state.lochUser}
            // codesLeftToUse={this.state.codesLeftToUse}
          />
        </MobileLayout>
      );
    }
    return (
      <div className="referral-page">
        {/* topbar */}
        <div className="portfolio-page-section">
          <div
            className="portfolio-container page"
            style={{ overflow: "visible" }}
          >
            <div className="portfolio-section">
              <WelcomeCard
                openConnectWallet={this.props.openConnectWallet}
                connectedWalletAddress={this.props.connectedWalletAddress}
                connectedWalletevents={this.props.connectedWalletevents}
                disconnectWallet={this.props.disconnectWallet}
                isSidebarClosed={this.props.isSidebarClosed}
                apiResponse={(e) => this.CheckApiResponse(e)}
                history={this.props.history}
                hideButton={false}
                hideShare
              />
            </div>
          </div>
        </div>
        <div className="history-table-section">
          <div className="history-table page-scroll">
            <div className="page-scroll-child">
              <PageHeader
                title={"Referral"}
                currentPage="referral-codes"
                subTitle={"Manage your referral codes here"}
                history={this.props.history}
                ShareBtn={false}
                showpath
                noHomeInPath
              />

              <div className="rp-body-container">
                <div className="rpb-data">
                  <div className="rpbd-header">
                    <div className="rpbdh-title-container">
                      <Image className="rpbdh-title-icon" src={PasswordIcon} />
                      <div className="inter-display-medium rpbdh-title">
                        Referral Codes
                      </div>
                      {this.state.codesLeftToUse !== undefined &&
                      this.state.codesLeftToUse !== null ? (
                        <div className="inter-display-medium rpbdh-title-subtext">
                          {this.state.codesLeftToUse} left
                        </div>
                      ) : null}
                    </div>
                    {this.state.referralsLoading ? null : (
                      <div
                        onClick={this.copyAllTheCodes}
                        className="inter-display-medium rpbdh-copy-button"
                      >
                        Copy all codes
                      </div>
                    )}
                  </div>

                  {this.state.referralsLoading ? (
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
                          <div className="inter-display-medium psrcb-text">
                            Want more referral codes? Reach out to us on{" "}
                            <span
                              onClick={() => {
                                this.getMoreReferralCodes("twitter");
                              }}
                              className="psrcb-text-btn"
                            >
                              Twitter
                            </span>
                            <span> or </span>
                            <span
                              onClick={() => {
                                this.getMoreReferralCodes("telegram");
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
                          {this.state.referralCodes &&
                          this.state.referralCodes.length > 0 ? (
                            this.state.referralCodes.map(
                              (curReferralCode, curReferralCodeIndex) => (
                                <div
                                  style={{
                                    paddingTop:
                                      curReferralCodeIndex === 0 ? "0px" : "",
                                    paddingBottom:
                                      curReferralCodeIndex ===
                                      this.state.referralCodes.length - 1
                                        ? "0px"
                                        : "",
                                    borderBottom:
                                      curReferralCodeIndex ===
                                      this.state.referralCodes.length - 1
                                        ? "none"
                                        : "",
                                  }}
                                  className="rpbdd-referral-block"
                                >
                                  <div
                                    className={`inter-display-medium rpbddrb-code ${
                                      curReferralCode.used
                                        ? "rpbddrb-code-used"
                                        : ""
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
                                          this.copyTextPass(
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
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  commonState: state.CommonState,
  referralCodesState: state.ReferralCodesState,
});
const mapDispatchToProps = {
  getAllWalletListApi,
  getAllCoins,
  setPageFlagDefault,
  updateWalletListFlag,
  getReferallCodes,
};

ReferralCodesPage.propTypes = {};
export default connect(mapStateToProps, mapDispatchToProps)(ReferralCodesPage);
