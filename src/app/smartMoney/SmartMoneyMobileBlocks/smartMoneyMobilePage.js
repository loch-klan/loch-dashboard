import React from "react";
import { connect } from "react-redux";
import { searchTransactionApi, getFilters } from "../../intelligence/Api.js";
import { BaseReactComponent } from "../../../utils/form/index.js";
import { getAllCoins, getAllParentChains } from "../../onboarding/Api.js";
import {
  GetAllPlan,
  setPageFlagDefault,
  TopsetPageFlagDefault,
} from "../../common/Api.js";
import { getSmartMoney } from "../Api.js";

import {
  removeFromWatchList,
  updateAddToWatchList,
} from "../../watchlist/redux/WatchListApi.js";

import { Button, Image } from "react-bootstrap";
import { getCurrentUser } from "../../../utils/ManageToken.js";
import {
  SmartMoneyFAQClicked,
  SmartMoneyHowItWorksClicked,
  SmartMoneyShare,
} from "../../../utils/AnalyticsFunctions.js";
import SmartMoneyMobileHeader from "../smartMoneyMobileHeader.js";
import Loading from "../../common/Loading.js";
import SmartMoneyPagination from "../../../utils/commonComponent/SmartMoneyPagination.js";
import {
  BlackManIcon,
  ContributeTrophyIcon,
  GreyManIcon,
  InfoCircleSmartMoneyIcon,
  MacIcon,
  PlusCircleSmartMoneyIcon,
  QuestionmarkCircleSmartMoneyIcon,
  ShareProfileIcon,
} from "../../../assets/images/icons/index.js";
import SmartMoneyMobileModalContainer from "./smartMoneyMobileModalContainer.js";
import SmartMoneyMobileSignInUp from "./smartMoneyMobileSignInUp.js";
import SmartMoneyMobileAddAddressModal from "./smartMoneyMobileAddAddressModal.js";
import SmartMoneyMobileHowItWorksModal from "./smartMoneyMobileHowItWorksModal.js";
import SmartMoneyMobileFAQModal from "./smartMoneyMobileFAQModal.js";
import SmartMoneyMobileBlock from "./smartMoneyMobileBlock.js";
import SmartMoneyMobileSignOutModal from "./smartMoneyMobileSignOutModal.js";
import { BASE_URL_S3 } from "../../../utils/Constant.js";
import { toast } from "react-toastify";

class SmartMoneyMobilePage extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      signInModal: false,
      addAddressModal: false,
      howItWorksModal: false,
      faqModal: false,
      localLochUser: JSON.parse(window.localStorage.getItem("lochUser")),
      signOutModal: false,
      BlackManIconLoaded: false,
      QuestionmarkCircleSmartMoneyIconLoaded: false,
      InfoCircleSmartMoneyIconLoaded: false,
      PlusCircleSmartMoneyIconLoaded: false,
      GreyManIconLoaded: false,
      ShareProfileIconLoaded: false,

      ContributeTrophyIconLoaded: false,
      showClickSignInText: false,
    };
  }
  componentDidMount() {}
  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.signInModal !== this.state.signInModal &&
      !this.state.signInModal
    ) {
      this.setState({
        showClickSignInText: false,
      });
    }
    if (prevProps.blurTable !== this.props.blurTable) {
      if (!this.props.blurTable) {
        this.setState({
          localLochUser: JSON.parse(window.localStorage.getItem("lochUser")),
        });
      } else {
        this.setState({
          localLochUser: undefined,
        });
      }
    }
  }
  openSignInOnclickModal = () => {
    this.setState(
      {
        showClickSignInText: true,
      },
      () => {
        this.showSignInModal();
      }
    );
  };
  handleShare = () => {
    SmartMoneyShare({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      isMobile: true,
    });
    let shareLink = BASE_URL_S3 + "leaderboard";
    this.copyTextToClipboard(shareLink);
  };
  async copyTextToClipboard(text) {
    if ("clipboard" in navigator) {
      toast.success("Link copied");
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  }
  showFaqModal = () => {
    if (this.props.mobilePopupModal) {
      this.props.hideThePopupModal();
    }
    SmartMoneyFAQClicked({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      isMobile: true,
    });
    this.setState({
      faqModal: true,
    });
    document.body.style.overflow = "hidden";
  };
  showHowItWorksModal = () => {
    if (this.props.mobilePopupModal) {
      this.props.hideThePopupModal();
    }
    SmartMoneyHowItWorksClicked({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      isMobile: true,
    });
    this.setState({
      howItWorksModal: true,
    });
    document.body.style.overflow = "hidden";
  };
  showSignInModal = () => {
    if (this.props.mobilePopupModal) {
      this.props.hideThePopupModal();
    }
    this.setState({
      signInModal: true,
    });
    document.body.style.overflow = "hidden";
  };
  showAddAddressModal = () => {
    if (this.props.mobilePopupModal) {
      this.props.hideThePopupModal();
    }
    this.setState({
      addAddressModal: true,
    });
    document.body.style.overflow = "hidden";
  };
  showSignOutModal = () => {
    if (this.props.mobilePopupModal) {
      this.props.hideThePopupModal();
    }
    this.setState({
      signOutModal: true,
    });

    document.body.style.overflow = "hidden";
  };
  hideAllModals = () => {
    if (this.props.mobilePopupModal) {
      this.props.hideThePopupModal();
    }
    this.setState({
      signInModal: false,
      addAddressModal: false,
      howItWorksModal: false,
      faqModal: false,
      signOutModal: false,
    });
    document.body.style.overflow = "unset";
  };

  render() {
    return (
      <div className="mobileSmartMoneyPage">
        {this.state.signInModal ? (
          <SmartMoneyMobileModalContainer onHide={this.hideAllModals}>
            <SmartMoneyMobileSignInUp
              showClickSignInText={this.state.showClickSignInText}
              onHide={this.hideAllModals}
            />
          </SmartMoneyMobileModalContainer>
        ) : null}
        {this.state.addAddressModal ? (
          <SmartMoneyMobileModalContainer onHide={this.hideAllModals}>
            <SmartMoneyMobileAddAddressModal onHide={this.hideAllModals} />
          </SmartMoneyMobileModalContainer>
        ) : null}
        {this.state.howItWorksModal ? (
          <SmartMoneyMobileModalContainer onHide={this.hideAllModals}>
            <SmartMoneyMobileHowItWorksModal onHide={this.hideAllModals} />
          </SmartMoneyMobileModalContainer>
        ) : null}
        {this.state.faqModal ? (
          <SmartMoneyMobileModalContainer onHide={this.hideAllModals}>
            <SmartMoneyMobileFAQModal onHide={this.hideAllModals} />
          </SmartMoneyMobileModalContainer>
        ) : null}
        {this.state.signOutModal ? (
          <SmartMoneyMobileSignOutModal
            onSignOut={this.props.signOutFun}
            onHide={this.hideAllModals}
          />
        ) : null}

        <SmartMoneyMobileHeader />
        {this.props.isLoading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
              paddingTop: "9rem",
            }}
          >
            <Loading />
          </div>
        ) : (
          <>
            <div className="mobileSmartMoneyBtnsContainer">
              {this.state.localLochUser &&
              (this.state.localLochUser.email ||
                this.state.localLochUser.first_name ||
                this.state.localLochUser.last_name) ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "stretch",
                    }}
                  >
                    <div
                      onClick={this.showSignOutModal}
                      style={{
                        flex: 1,
                      }}
                      className="mobileSmartMoneyBtnSignInContainer inter-display-medium f-s-14 lh-19 navbar-button"
                    >
                      <div className="mobileSmartMoneyBtnSignInIconContainer">
                        <Image
                          className="mobileSmartMoneyBtnSignInIcon"
                          src={BlackManIcon}
                          onLoad={() => {
                            this.setState({
                              BlackManIconLoaded: true,
                            });
                          }}
                          style={{
                            opacity: this.state.BlackManIconLoaded ? 1 : 0,
                          }}
                        />
                      </div>
                      <div className="mobileSmartMoneyBtnSignInDataName">
                        {this.state.localLochUser.first_name ||
                        this.state.localLochUser.last_name
                          ? `${this.state.localLochUser.first_name} ${
                              this.state.localLochUser.last_name
                                ? this.state.localLochUser.last_name.slice(
                                    0,
                                    1
                                  ) + "."
                                : ""
                            }`
                          : "Signed in"}
                      </div>
                    </div>
                    <div
                      onClick={this.handleShare}
                      className="mobileSmartMoneyBtnSignInContainer mobileSmartMoneyBtnShareContainer inter-display-medium f-s-13 lh-19 navbar-button"
                      style={{
                        marginLeft: "0.5rem",
                      }}
                    >
                      <div className="mobileSmartMoneyBtnSignInIconContainer mobileSmartMoneyBtnSignInIconNoColor">
                        <Image
                          className="mobileSmartMoneyBtnSignInIcon"
                          src={ShareProfileIcon}
                          onLoad={() => {
                            this.setState({
                              ShareProfileIconLoaded: true,
                            });
                          }}
                          style={{
                            opacity: this.state.ShareProfileIconLoaded ? 1 : 0,
                          }}
                        />
                      </div>
                      <div className="mobileSmartMoneyBtnSignInJustText">
                        Share
                      </div>
                    </div>
                  </div>
                  <div className="mobileSmartMoneyBtnSignInBottomBtns">
                    <div
                      onClick={this.showFaqModal}
                      className="mobileSmartMoneyBtnSignInContainer mobileSmartMoneyBtnFaqContainer inter-display-medium f-s-13 lh-19 navbar-button"
                    >
                      <div className="mobileSmartMoneyBtnSignInIconContainer mobileSmartMoneyBtnSignInIconNoColor">
                        <Image
                          className="mobileSmartMoneyBtnSignInIcon"
                          src={QuestionmarkCircleSmartMoneyIcon}
                          onLoad={() => {
                            this.setState({
                              QuestionmarkCircleSmartMoneyIconLoaded: true,
                            });
                          }}
                          style={{
                            opacity: this.state
                              .QuestionmarkCircleSmartMoneyIconLoaded
                              ? 1
                              : 0,
                          }}
                        />
                      </div>
                      <div className="mobileSmartMoneyBtnSignInJustText">
                        FAQ
                      </div>
                    </div>
                    <div
                      onClick={this.showHowItWorksModal}
                      className="mobileSmartMoneyBtnSignInContainer mobileSmartMoneyBtnFaqContainer inter-display-medium f-s-13 lh-19 navbar-button"
                      style={{
                        margin: "0rem 1rem",
                      }}
                    >
                      <div className="mobileSmartMoneyBtnSignInIconContainer mobileSmartMoneyBtnSignInIconNoColor">
                        <Image
                          className="mobileSmartMoneyBtnSignInIcon"
                          src={InfoCircleSmartMoneyIcon}
                          onLoad={() => {
                            this.setState({
                              InfoCircleSmartMoneyIconLoaded: true,
                            });
                          }}
                          style={{
                            opacity: this.state.InfoCircleSmartMoneyIconLoaded
                              ? 1
                              : 0,
                          }}
                        />
                      </div>
                      <div className="mobileSmartMoneyBtnSignInJustText">
                        How it works
                      </div>
                    </div>
                    <div
                      onClick={this.showAddAddressModal}
                      className="mobileSmartMoneyBtnSignInContainer mobileSmartMoneyBtnFaqContainer inter-display-medium f-s-13 lh-19 navbar-button"
                    >
                      <div className="mobileSmartMoneyBtnSignInIconContainer mobileSmartMoneyBtnSignInIconNoColor">
                        <Image
                          className="mobileSmartMoneyBtnSignInIcon"
                          src={PlusCircleSmartMoneyIcon}
                          onLoad={() => {
                            this.setState({
                              PlusCircleSmartMoneyIconLoaded: true,
                            });
                          }}
                          style={{
                            opacity: this.state.PlusCircleSmartMoneyIconLoaded
                              ? 1
                              : 0,
                          }}
                        />
                      </div>
                      <div className="mobileSmartMoneyBtnSignInJustText">
                        Add address
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "stretch",
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                      }}
                      onClick={this.showSignInModal}
                      className="mobileSmartMoneyBtnSignInContainer inter-display-medium f-s-14 lh-19 navbar-button"
                    >
                      <div className="mobileSmartMoneyBtnSignInIconContainer">
                        <Image
                          className="mobileSmartMoneyBtnSignInIcon"
                          src={GreyManIcon}
                          onLoad={() => {
                            this.setState({
                              GreyManIconIconLoaded: true,
                            });
                          }}
                          style={{
                            opacity: this.state.GreyManIconIconLoaded ? 1 : 0,
                          }}
                        />
                      </div>
                      <div className="mobileSmartMoneyBtnSignInDataName">
                        Sign in / up now
                      </div>
                    </div>
                    <div
                      onClick={this.handleShare}
                      className="mobileSmartMoneyBtnSignInContainer mobileSmartMoneyBtnShareContainer inter-display-medium f-s-13 lh-19 navbar-button"
                      style={{
                        marginLeft: "0.5rem",
                      }}
                    >
                      <div className="mobileSmartMoneyBtnSignInIconContainer mobileSmartMoneyBtnSignInIconNoColor">
                        <Image
                          className="mobileSmartMoneyBtnSignInIcon"
                          src={ShareProfileIcon}
                          onLoad={() => {
                            this.setState({
                              ShareProfileIconLoaded: true,
                            });
                          }}
                          style={{
                            opacity: this.state.ShareProfileIconLoaded ? 1 : 0,
                          }}
                        />
                      </div>
                      <div className="mobileSmartMoneyBtnSignInJustText">
                        Share
                      </div>
                    </div>
                  </div>
                  <div className="mobileSmartMoneyBtnSignInBottomBtns">
                    <div
                      onClick={this.showFaqModal}
                      className="mobileSmartMoneyBtnSignInContainer mobileSmartMoneyBtnFaqContainer inter-display-medium f-s-13 lh-19 navbar-button"
                      style={{
                        marginRight: "0.5rem",
                      }}
                    >
                      <div className="mobileSmartMoneyBtnSignInIconContainer mobileSmartMoneyBtnSignInIconNoColor">
                        <Image
                          className="mobileSmartMoneyBtnSignInIcon"
                          src={QuestionmarkCircleSmartMoneyIcon}
                          onLoad={() => {
                            this.setState({
                              QuestionmarkCircleSmartMoneyIconLoaded: true,
                            });
                          }}
                          style={{
                            opacity: this.state
                              .QuestionmarkCircleSmartMoneyIconLoaded
                              ? 1
                              : 0,
                          }}
                        />
                      </div>
                      <div className="mobileSmartMoneyBtnSignInJustText">
                        FAQ
                      </div>
                    </div>
                    <div
                      onClick={this.showHowItWorksModal}
                      className="mobileSmartMoneyBtnSignInContainer mobileSmartMoneyBtnFaqContainer inter-display-medium f-s-13 lh-19 navbar-button"
                      style={{
                        marginLeft: "0.5rem",
                      }}
                    >
                      <div className="mobileSmartMoneyBtnSignInIconContainer mobileSmartMoneyBtnSignInIconNoColor">
                        <Image
                          className="mobileSmartMoneyBtnSignInIcon"
                          src={InfoCircleSmartMoneyIcon}
                          onLoad={() => {
                            this.setState({
                              InfoCircleSmartMoneyIconLoaded: true,
                            });
                          }}
                          style={{
                            opacity: this.state.InfoCircleSmartMoneyIconLoaded
                              ? 1
                              : 0,
                          }}
                        />
                      </div>
                      <div className="mobileSmartMoneyBtnSignInJustText">
                        How it works
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            {this.props.accountList && this.props.accountList.length > 0 ? (
              <div className="mobileSmartMoneyListContainer">
                {this.props.accountList.map((mapData) => {
                  let tempCurrencyRate = this.props.currency?.rate
                    ? this.props.currency.rate
                    : 0;

                  let tempNetWorth = mapData.networth ? mapData.networth : 0;
                  let tempNetflows = mapData.netflows ? mapData.netflows : 0;
                  let tempProfits = mapData.profits ? mapData.profits : 0;
                  let tempReturns = mapData.returns ? mapData.returns : 0;

                  let netWorth = tempNetWorth * tempCurrencyRate;
                  let netFlows = tempNetflows * tempCurrencyRate;
                  let profits = tempProfits * tempCurrencyRate;
                  let returns = tempReturns * tempCurrencyRate;
                  return (
                    <SmartMoneyMobileBlock
                      netWorth={netWorth}
                      netFlows={netFlows}
                      profits={profits}
                      returns={returns}
                      mapData={mapData}
                      handleFollowUnfollow={this.props.handleFollowUnfollow}
                      openSignInOnclickModal={this.openSignInOnclickModal}
                      smartMoneyBlur={this.props.blurTable}
                    />
                  );
                })}
              </div>
            ) : null}
            {this.props.accountList && this.props.accountList.length > 0 ? (
              <SmartMoneyPagination
                history={this.props.history}
                location={this.props.location}
                page={this.props.currentPage + 1}
                pageCount={this.props.totalPage}
                pageLimit={this.props.pageLimit}
                changePageLimit={this.props.changePageLimit}
                onPageChange={this.props.onPageChange}
                openSignInOnclickModal={this.openSignInOnclickModal}
                smartMoneyBlur={this.props.blurTable}
                isMobile
              />
            ) : null}
          </>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  // portfolioState: state.PortfolioState,
  intelligenceState: state.IntelligenceState,
  OnboardingState: state.OnboardingState,
  TopAccountsInWatchListState: state.TopAccountsInWatchListState,
});
const mapDispatchToProps = {
  searchTransactionApi,
  getSmartMoney,

  getAllCoins,
  getFilters,
  setPageFlagDefault,
  TopsetPageFlagDefault,
  getAllParentChains,

  removeFromWatchList,
  updateAddToWatchList,

  GetAllPlan,
};

SmartMoneyMobilePage.propTypes = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SmartMoneyMobilePage);
