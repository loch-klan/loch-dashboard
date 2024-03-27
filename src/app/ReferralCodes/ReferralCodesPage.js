import React from "react";
import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import { PasswordIcon } from "../../assets/images/icons";
import {
  ProfileReferralPage,
  TimeSpentReferralCodes,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import { copyText, scrollToTop } from "../../utils/ReusableFunctions";
import { BaseReactComponent } from "../../utils/form";
import WelcomeCard from "../Portfolio/WelcomeCard";
import Loading from "../common/Loading";
import PageHeader from "../common/PageHeader";
import "./_referralCodesPage.scss";
import { getAllCoins } from "../onboarding/Api";
import { getAllWalletListApi } from "../wallet/Api";
import { setPageFlagDefault, updateWalletListFlag } from "../common/Api";
import { CopyClipboardIcon } from "../../assets/images";

class ReferralCodesPage extends BaseReactComponent {
  constructor(props) {
    super(props);

    this.state = {
      startTime: "",
      referralsLoading: true,
      referralCodes: [
        {
          code: "546697",
          isUsed: false,
        },
        {
          code: "026485",
          isUsed: false,
        },
        {
          code: "273657",
          isUsed: false,
        },
        {
          code: "098765",
          isUsed: false,
        },
        {
          code: "209384",
          isUsed: false,
        },
        {
          code: "675849",
          isUsed: false,
        },
        {
          code: "129845",
          isUsed: false,
        },
        {
          code: "002266",
          isUsed: false,
        },
        {
          code: "457645",
          isUsed: true,
        },
        {
          code: "566556",
          isUsed: true,
        },
      ],
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
    scrollToTop();
    this.getOtherData();
    setTimeout(() => {
      this.setState({
        referralsLoading: false,
      });
    }, 1500);
  }
  updateTimer = (first) => {
    const tempExistingExpiryTime = window.sessionStorage.getItem(
      "referralCodesPageExpiryTime"
    );
    if (!tempExistingExpiryTime && !first) {
      this.startPageView();
    }
    const tempExpiryTime = Date.now() + 1800000;
    window.sessionStorage.setItem(
      "referralCodesPageExpiryTime",
      tempExpiryTime
    );
  };
  endPageView = () => {
    clearInterval(window.checkReferralCodesTimer);
    window.sessionStorage.removeItem("referralCodesPageExpiryTime");
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
    const tempExpiryTime = window.sessionStorage.getItem(
      "referralCodesPageExpiryTime"
    );
    if (tempExpiryTime && tempExpiryTime < Date.now()) {
      this.endPageView();
    }
  };
  componentWillUnmount() {
    const tempExpiryTime = window.sessionStorage.getItem(
      "referralCodesPageExpiryTime"
    );
    if (tempExpiryTime) {
      this.endPageView();
    }
  }

  componentDidUpdate() {
    if (!this.props.commonState.profileReferralPage) {
      this.getOtherData();
      // this.callApi();

      this.props.updateWalletListFlag("profileReferralPage", true);
    }
  }
  CheckApiResponse = () => {
    this.props.setPageFlagDefault();
  };
  copyAllTheCodes = () => {
    let allCodes = "";
    this.state.referralCodes.forEach(
      (curReferralCode, curReferralCodeIndex) => {
        if (curReferralCode.isUsed === false) {
          allCodes += curReferralCode.code + "\n";
        }
      }
    );
    copyText(allCodes);
  };
  render() {
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
                isSidebarClosed={this.props.isSidebarClosed}
                apiResponse={(e) => this.CheckApiResponse(e)}
                history={this.props.history}
                hideButton={false}
                hideShare
              />
            </div>
          </div>
        </div>
        <div className="history-table-section m-t-80">
          <div className="history-table page">
            <PageHeader
              title={"Referral"}
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
                    <div className="inter-display-medium rpbdh-title-subtext">
                      8 left
                    </div>
                  </div>
                  <div
                    onClick={this.copyAllTheCodes}
                    className="inter-display-medium rpbdh-copy-button"
                  >
                    Copy all code
                  </div>
                </div>
                {this.state.referralsLoading ? (
                  <div className="rpbd-loader">
                    <Loading />
                  </div>
                ) : (
                  <div className="rpbd-body-container">
                    <div className="rpbd-body">
                      {this.state.referralCodes.map(
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
                                curReferralCode.isUsed
                                  ? "rpbddrb-code-used"
                                  : ""
                              }`}
                            >
                              {curReferralCode.code}
                            </div>
                            <div className="inter-display-medium rpbddrb-status">
                              {curReferralCode.isUsed ? (
                                <span>Used</span>
                              ) : (
                                <Image
                                  onClick={() => {
                                    copyText(curReferralCode.code);
                                  }}
                                  className="rpbddrbs-icon"
                                  src={CopyClipboardIcon}
                                />
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({ commonState: state.CommonState });
const mapDispatchToProps = {
  getAllWalletListApi,
  getAllCoins,
  setPageFlagDefault,
  updateWalletListFlag,
};

ReferralCodesPage.propTypes = {};
export default connect(mapStateToProps, mapDispatchToProps)(ReferralCodesPage);
