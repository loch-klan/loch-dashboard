import React from "react";
import GainIcon from "../../../assets/images/icons/GainIcon.svg";
import LossIcon from "../../../assets/images/icons/LossIcon.svg";
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
import {
  CurrencyType,
  TruncateText,
  numToCurrency,
} from "../../../utils/ReusableFunctions.js";
import { Image } from "react-bootstrap";
import { getCurrentUser } from "../../../utils/ManageToken.js";
import { BASE_URL_S3 } from "../../../utils/Constant.js";
import { SmartMoneyWalletClicked } from "../../../utils/AnalyticsFunctions.js";
import SmartMoneyMobileHeader from "../smartMoneyMobileHeader.js";
import Loading from "../../common/Loading.js";
import SmartMoneyPagination from "../../../utils/commonComponent/SmartMoneyPagination.js";
import {
  BlackManIcon,
  CrossSmartMoneyIcon,
  GreyManIcon,
  InfoCircleSmartMoneyIcon,
  PlusCircleSmartMoneyIcon,
  QuestionmarkCircleSmartMoneyIcon,
} from "../../../assets/images/icons/index.js";
import SmartMoneyMobileModalContainer from "./smartMoneyMobileModalContainer.js";
import SmartMoneyMobileSignInUp from "./smartMoneyMobileSignInUp.js";
import SmartMoneyMobileAddAddressModal from "./smartMoneyMobileAddAddressModal.js";
import SmartMoneyMobileHowItWorksModal from "./smartMoneyMobileHowItWorksModal.js";
import SmartMoneyMobileFAQModal from "./smartMoneyMobileFAQModal.js";

class SmartMoneyMobilePage extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      signInModal: false,
      addAddressModal: false,
      howItWorksModal: false,
      faqModal: false,
      localLochUser: JSON.parse(window.sessionStorage.getItem("lochUser")),
    };
  }
  componentDidMount() {}
  componentDidUpdate(prevProps, prevStates) {
    if (prevProps.blurTable !== this.props.blurTable) {
      if (!this.props.blurTable) {
        this.setState({
          localLochUser: JSON.parse(window.sessionStorage.getItem("lochUser")),
        });
      } else {
        this.setState({
          localLochUser: undefined,
        });
      }
    }
  }

  showFaqModal = () => {
    this.setState({
      faqModal: true,
    });
    document.body.style.overflow = "hidden";
  };
  showHowItWorksModal = () => {
    this.setState({
      howItWorksModal: true,
    });
    document.body.style.overflow = "hidden";
  };
  showSignInModal = () => {
    this.setState({
      signInModal: true,
    });
    document.body.style.overflow = "hidden";
  };
  hideAllModals = () => {
    this.setState({
      signInModal: false,
      addAddressModal: false,
      howItWorksModal: false,
      faqModal: false,
    });
    document.body.style.overflow = "unset";
  };

  render() {
    return (
      <div className="mobileSmartMoneyPage">
        {this.state.signInModal ? (
          <SmartMoneyMobileModalContainer onHide={this.hideAllModals}>
            <SmartMoneyMobileSignInUp onHide={this.hideAllModals} />
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
                    onClick={this.props.signOutFun}
                    className="mobileSmartMoneyBtnSignInContainer inter-display-medium f-s-14 lh-19 navbar-button"
                  >
                    <div className="mobileSmartMoneyBtnSignInIconContainer">
                      <Image
                        className="mobileSmartMoneyBtnSignInIcon"
                        src={BlackManIcon}
                      />
                    </div>
                    <div className="mobileSmartMoneyBtnSignInDataName">
                      {this.state.localLochUser.first_name ||
                      this.state.localLochUser.last_name
                        ? `${this.state.localLochUser.first_name} ${
                            this.state.localLochUser.last_name
                              ? this.state.localLochUser.last_name.slice(0, 1) +
                                "."
                              : ""
                          }`
                        : "Signed in"}
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
                        />
                      </div>
                      <div className="mobileSmartMoneyBtnSignInJustText">
                        How it works
                      </div>
                    </div>
                    <div
                      // onClick={props.openAddAddressModal}
                      className="mobileSmartMoneyBtnSignInContainer mobileSmartMoneyBtnFaqContainer inter-display-medium f-s-13 lh-19 navbar-button"
                    >
                      <div className="mobileSmartMoneyBtnSignInIconContainer mobileSmartMoneyBtnSignInIconNoColor">
                        <Image
                          className="mobileSmartMoneyBtnSignInIcon"
                          src={PlusCircleSmartMoneyIcon}
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
                    onClick={this.showSignInModal}
                    className="mobileSmartMoneyBtnSignInContainer inter-display-medium f-s-14 lh-19 navbar-button"
                  >
                    <div className="mobileSmartMoneyBtnSignInIconContainer">
                      <Image
                        className="mobileSmartMoneyBtnSignInIcon"
                        src={GreyManIcon}
                      />
                    </div>
                    <div className="mobileSmartMoneyBtnSignInDataName">
                      Sign in / up now
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
                  <div className="mobileSmartMoneyBlock">
                    <div className="msmbHeader">
                      <div className="msmbHeaderLeft">
                        {mapData.rank ? (
                          <div className="inter-display-medium msmbHeaderRank">
                            {mapData.rank}.
                          </div>
                        ) : null}
                        {mapData.tagName ? (
                          <div className="inter-display-medium msmbHeaderNickName">
                            {mapData.tagName}
                          </div>
                        ) : null}
                        {mapData.account ? (
                          <div
                            onClick={() => {
                              let lochUser = getCurrentUser().id;

                              let slink = mapData.account;
                              let shareLink =
                                BASE_URL_S3 +
                                "home/" +
                                slink +
                                "?redirect=home";
                              if (lochUser) {
                                const alreadyPassed =
                                  window.sessionStorage.getItem(
                                    "PassedRefrenceId"
                                  );
                                if (alreadyPassed) {
                                  shareLink =
                                    shareLink + "&refrenceId=" + alreadyPassed;
                                } else {
                                  shareLink =
                                    shareLink + "&refrenceId=" + lochUser;
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
                            {TruncateText(mapData.account)}
                          </div>
                        ) : null}
                      </div>
                      <div className="msmbHeaderRight">
                        <div className="inter-display-medium msmbHeaderNetWorth">
                          {CurrencyType(false) + numToCurrency(netWorth)}
                        </div>
                      </div>
                    </div>
                    <div className="msmbBody">
                      <div className="msmbBodyItem">
                        <div className="inter-display-medium msmbBITitle">
                          Net flows
                        </div>
                        <div
                          className={`inter-display-medium msmbBIAmount ${
                            netFlows >= 0
                              ? "msmbBIAmountGain"
                              : "msmbBIAmountLoss"
                          }`}
                        >
                          {netFlows !== 0 ? (
                            <Image
                              src={netFlows < 0 ? LossIcon : GainIcon}
                              className="mr-2"
                            />
                          ) : null}
                          <span>
                            {CurrencyType(false) + numToCurrency(netFlows)}
                          </span>
                        </div>
                      </div>
                      <div className="msmbBodyItem">
                        <div className="inter-display-medium msmbBITitle">
                          Realized PnL
                        </div>
                        <div
                          className={`inter-display-medium msmbBIAmount ${
                            profits >= 0
                              ? "msmbBIAmountGain"
                              : "msmbBIAmountLoss"
                          }`}
                        >
                          {profits !== 0 ? (
                            <Image
                              src={profits < 0 ? LossIcon : GainIcon}
                              className="mr-2"
                            />
                          ) : null}

                          <span>
                            {CurrencyType(false) + numToCurrency(profits)}
                          </span>
                        </div>
                      </div>
                      <div className="msmbBodyItem">
                        <div className="inter-display-medium msmbBITitle">
                          Unrealized
                        </div>
                        <div
                          className={`inter-display-medium msmbBIAmount ${
                            returns >= 0
                              ? "msmbBIAmountGain"
                              : "msmbBIAmountLoss"
                          }`}
                        >
                          {returns !== 0 ? (
                            <Image
                              src={returns < 0 ? LossIcon : GainIcon}
                              className="mr-2"
                            />
                          ) : null}
                          <span>{numToCurrency(returns) + "%"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <SmartMoneyPagination
              history={this.props.history}
              location={this.props.location}
              page={this.props.currentPage + 1}
              pageCount={this.props.totalPage}
              pageLimit={this.props.pageLimit}
              changePageLimit={this.props.changePageLimit}
              onPageChange={this.props.onPageChange}
            />
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
