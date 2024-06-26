import { Component } from "react";
import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import {
  AvailableCopyTradeCheckIcon,
  AvailableCopyTradeCrossIcon,
  EmultionSidebarIcon,
  FollowingSidebarIcon,
  LeaderboardSidebarIcon,
  NoCopyTradeTableIcon,
  PersonRoundedSigninIcon,
  TrendingFireIcon,
  UserCreditScrollLeftArrowIcon,
  UserCreditScrollRightArrowIcon,
  UserCreditScrollTopArrowIcon,
} from "../../assets/images/icons";
import { CopyTradePopularAccountWalletClicked } from "../../utils/AnalyticsFunctions";
import InfoIcon from "../../assets/images/icons/info-icon.svg";
import { BASE_URL_S3 } from "../../utils/Constant";
import { getCurrentUser } from "../../utils/ManageToken";
import {
  CurrencyType,
  TruncateText,
  numToCurrency,
} from "../../utils/ReusableFunctions";
import { SendOtp, VerifyEmail } from "../common/Api";
import Loading from "../common/Loading";
import LoginMobile from "../home/NewAuth/LoginMobile";
import RedirectMobile from "../home/NewAuth/RedirectMobile";
import SignUpMobile from "../home/NewAuth/SignUpMobile";
import VerifyMobile from "../home/NewAuth/VerifyMobile";
import TransactionTable from "../intelligence/TransactionTable";
import { signUpWelcome, verifyUser } from "../onboarding/Api";
import AddEmulationsAddressModal from "./AddEmulationsAddressModal";
import EmulationsTradeModal from "./EmulationsTradeModal";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import HomeSmartMoneyPage from "../smartMoney/homeSmartMoneyPage";

class AssetUnrealizedProfitAndLossMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authmodal: "",
      email: "",
      emailSignup: "",
      otp: "",
    };
  }
  openCopyTradeModal = () => {
    const userDetails = JSON.parse(window.localStorage.getItem("lochUser"));
    if (userDetails && userDetails.email) {
      this.props.showAddCopyTradeAddress();
    } else {
      if (this.props.addCopyTradeBtnClickedLocal) {
        this.props.addCopyTradeBtnClickedLocal();
      }
      this.setState({
        authmodal: "login",
      });
    }
  };
  addPrefillCopyAddressLocal = (passedAddress) => {
    const userDetails = JSON.parse(window.localStorage.getItem("lochUser"));
    if (userDetails && userDetails.email) {
      this.props.addPrefillCopyAddress(passedAddress, true);
    } else {
      this.props.addPrefillCopyAddress(passedAddress, false);
      this.setState({
        authmodal: "login",
      });
    }
  };
  toggleAuthModal = (val = "") => {
    this.setState({
      authmodal: val,
    });
  };
  handleChangeEmail = (val) => {
    this.setState({
      email: val,
    });
  };

  handleSubmitEmail = (val = false) => {
    if (this.state.email) {
      const data = new URLSearchParams();
      data.append(
        "email",
        this.state.email ? this.state.email.toLowerCase() : ""
      );
      // EmailAddressAdded({ email_address: this.state.email, session_id: "" });
      SendOtp(data, this, false, true);
      // this.toggleAuthModal('verify');
    }
  };
  handleSubmitOTP = () => {
    if (this.state.otp && this.state.otp.length > 5) {
      const data = new URLSearchParams();
      data.append(
        "email",
        this.state.email ? this.state.email.toLowerCase() : ""
      );
      data.append("otp_token", this.state.otp);
      data.append("signed_up_from", "Copy trade");
      VerifyEmail(data, this, true);
    }
  };
  onHide = () => {
    this.setState({
      authmodal: "",
    });
  };
  handleSubmitEmailSignup = (val = false) => {
    if (this.state.emailSignup) {
      const data = new URLSearchParams();
      data.append(
        "email",
        this.state.emailSignup ? this.state.emailSignup.toLowerCase() : ""
      );
      data.append("signed_up_from", "Copy trade");
      // EmailAddressAddedSignUp({
      //   email_address: this.state.emailSignup,
      //   session_id: "",
      //   isMobile: true,
      // });
      this.props.signUpWelcome(this, data, this.toggleAuthModal);
    }
  };

  render() {
    return (
      <div
        style={{
          paddingBottom: "2rem",
        }}
        className="assets-expanded-mobile copyTradeExpandedMobile"
      >
        {this.props.isExecuteCopyTrade ? (
          <EmulationsTradeModal
            show={this.props.isExecuteCopyTrade}
            onHide={this.props.hideExecuteCopyTrade}
            history={this.props.history}
            modalType={"connectModal"}
            updateTimer={this.props.updateTimer}
            isMobile
            confirmOrRejectCopyTrade={this.props.confirmOrRejectCopyTrade}
            executeCopyTrade={this.props.executeCopyTrade}
          />
        ) : null}

        {this.state.authmodal == "login" ? (
          // <SmartMoneyMobileModalContainer
          // onHide={this.toggleAuthModal}
          // >
          <LoginMobile
            toggleModal={this.toggleAuthModal}
            isMobile
            email={this.state.email}
            handleChangeEmail={(val) => {
              this.setState({
                email: val,
              });
            }}
            handleSubmitEmail={this.handleSubmitEmail}
            show={this.state.authmodal == "login"}
          />
        ) : // </SmartMoneyMobileModalContainer>
        this.state.authmodal == "verify" ? (
          <VerifyMobile
            isMobile
            toggleModal={this.toggleAuthModal}
            show={this.state.authmodal == "verify"}
            handleSubmitEmail={this.handleSubmitEmail}
            otp={this.state.otp}
            handleChangeOTP={(val) => {
              this.setState({
                otp: val,
              });
            }}
            handleSubmitOTP={this.handleSubmitOTP}
          />
        ) : this.state.authmodal == "signup" ? (
          <SignUpMobile
            toggleModal={this.toggleAuthModal}
            isMobile
            email={this.state.emailSignup}
            handleChangeEmail={(val) => {
              this.setState({
                emailSignup: val,
              });
            }}
            handleSubmitEmail={this.handleSubmitEmailSignup}
            show={this.state.authmodal == "signup"}
          />
        ) : this.state.authmodal == "redirect" ? (
          <RedirectMobile
            toggleModal={this.toggleAuthModal}
            show={this.state.authmodal == "redirect"}
          />
        ) : null}
        <div className="mobile-header-container-parent">
          <div className="mobile-header-container">
            <h4>Copy Trade</h4>

            <p>
              {this.props.subTitle}{" "}
              <span>
                <CustomOverlay
                  position="bottom"
                  isIcon={false}
                  isInfo={true}
                  isText={true}
                  text={this.props.hoverText}
                  className={"fix-width tool-tip-container-bottom-arrow"}
                  copyTrade
                >
                  <Image
                    src={InfoIcon}
                    className="info-icon"
                    style={{
                      width: "1.6rem",
                      marginTop: "-3px",
                      cursor: "pointer",
                    }}
                  />
                </CustomOverlay>
              </span>
            </p>
          </div>
          <div
            onClick={this.props.showAddCopyTradeAddress}
            className="mobile-add-copy-trade-button"
          >
            Add
          </div>
        </div>

        {this.props.isAddCopyTradeAddress ? (
          <AddEmulationsAddressModal
            hiddenModal={
              this.props.isPayModalOpen || this.props.isPayModalOptionsOpen
            }
            show={this.props.isAddCopyTradeAddress}
            onHide={this.props.hideAddCopyTradeAddress}
            emulationsUpdated={this.props.emulationsUpdated}
            paymentStatusLocal={this.props.paymentStatusLocal}
            openPayModal={this.props.openPayModal}
            prefillCopyAddress={this.props.prefillCopyAddress}
            isMobile
          />
        ) : null}

        {this.props.emulationsLoading ? (
          <div
            style={{
              background: "var(--cardBackgroud)",
              height: "65vh",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "100px 0",
              borderRadius: "10px",
            }}
          >
            <Loading />
          </div>
        ) : (
          <>
            <div
              className={`available-copy-trades-popular-accounts-container available-copy-trades-popular-accounts-container-mobile ${
                this.props.isPopularAccountsBlockOpen &&
                this.props.isAvailableCopyTradeBlockOpen
                  ? "available-copy-trades-popular-accounts-container-both-open"
                  : ""
              }`}
            >
              <div className="available-copy-trades-popular-accounts">
                <div
                  className={`actpacc-header ${
                    this.props.isPopularAccountsBlockOpen
                      ? "actpacc-header-open"
                      : ""
                  }`}
                  onClick={this.props.togglePopularAccountsBlockOpen}
                >
                  <div className="actpacc-header-title">
                    <Image
                      src={TrendingFireIcon}
                      className="actpacc-header-icon actpacc-header-icon-more-margin"
                    />
                    <div className="inter-display-medium f-s-16">
                      Top 20 Popular Accounts to Copy
                    </div>
                  </div>
                  <Image
                    src={UserCreditScrollTopArrowIcon}
                    className={`actpacc-arrow-icon ${
                      this.props.isPopularAccountsBlockOpen
                        ? ""
                        : "actpacc-arrow-icon-reversed"
                    }`}
                  />
                </div>
                {this.props.isPopularAccountsBlockOpen ? (
                  <>
                    <div
                      id="popularCopyTradeScrollBody"
                      className="actpacc-scroll-body"
                      onScroll={this.props.handlePopularTradeScroll}
                    >
                      {this.props.popularAccountsList &&
                      this.props.popularAccountsList.length > 0
                        ? this.props.popularAccountsList.map(
                            (curCopyTradeData, index) => {
                              return (
                                <div className="popular-copy-trades">
                                  <div className="popular-copy-trades-data">
                                    <div className="popular-copy-trades-data-person-container">
                                      <Image
                                        className="popular-copy-trades-data-person"
                                        src={PersonRoundedSigninIcon}
                                      />
                                    </div>
                                    <div
                                      style={{
                                        margin: "0rem 1rem",
                                      }}
                                      className="inter-display-medium f-s-13 popular-copy-trades-data-address"
                                      onClick={() => {
                                        if (curCopyTradeData.address) {
                                          let slink = curCopyTradeData.address;
                                          let shareLink =
                                            BASE_URL_S3 +
                                            "home/" +
                                            slink +
                                            "?noPopup=true";

                                          CopyTradePopularAccountWalletClicked({
                                            session_id: getCurrentUser().id,
                                            email_address:
                                              getCurrentUser().email,
                                            wallet: slink,
                                          });
                                          window.open(
                                            shareLink,
                                            "_blank",
                                            "noreferrer"
                                          );
                                        }
                                      }}
                                    >
                                      {TruncateText(curCopyTradeData.address)}
                                    </div>
                                    <div className="inter-display-medium f-s-13 popular-copy-trades-data-nametag dotDotText">
                                      {curCopyTradeData.nameTag}
                                    </div>
                                    <div
                                      style={{
                                        marginLeft: "1rem",
                                        whiteSpace: "nowrap",
                                      }}
                                      className="inter-display-medium f-s-13 "
                                    >
                                      {CurrencyType(false) +
                                        numToCurrency(
                                          curCopyTradeData.netWorth
                                        )}
                                    </div>
                                  </div>
                                  <div
                                    onClick={() => {
                                      this.props.copyPopularAddress(
                                        curCopyTradeData.address
                                      );
                                    }}
                                    className="inter-display-medium f-s-13 popular-copy-trades-button"
                                  >
                                    Copy
                                  </div>
                                </div>
                              );
                            }
                          )
                        : null}
                    </div>

                    <div className="available-copy-trades-navigator">
                      <div />
                      <div className="available-copy-trades-navigator-arrows">
                        <Image
                          style={{
                            opacity: this.props.isPopularLeftArrowDisabled
                              ? 0.5
                              : 1,
                            cursor: this.props.isPopularLeftArrowDisabled
                              ? "default"
                              : "pointer",
                          }}
                          onClick={this.props.scrollLeftPopular}
                          className="availableCopyTradesArrowIcon availableCopyTradesArrowIconLeft"
                          src={UserCreditScrollLeftArrowIcon}
                        />
                        <Image
                          style={{
                            opacity: this.props.isPopularRightArrowDisabled
                              ? 0.5
                              : 1,
                            cursor: this.props.isPopularRightArrowDisabled
                              ? "default"
                              : "pointer",
                          }}
                          onClick={this.props.scrollRightPopular}
                          className="availableCopyTradesArrowIcon"
                          src={UserCreditScrollRightArrowIcon}
                        />
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
              <div
                className={`available-copy-trades-popular-accounts-container available-copy-trades-popular-accounts-container-mobile ${
                  this.props.tableData && this.props.tableData.length > 0
                    ? "available-copy-trades-popular-accounts-container-reversed"
                    : ""
                }`}
              >
                {/* Loch Leaderboard */}
                <div className="available-copy-trades-popular-accounts">
                  <div
                    className={`actpacc-header ${
                      this.props.isLochLeaderBoardBlockOpen
                        ? "actpacc-header-open"
                        : ""
                    }`}
                    onClick={this.props.toggleLochLeaderBoardBlockOpen}
                  >
                    <div className="actpacc-header-title">
                      <Image
                        src={LeaderboardSidebarIcon}
                        className="actpacc-header-icon"
                      />
                      <div className="inter-display-medium f-s-16">
                        Loch’s Leaderboard
                      </div>
                    </div>
                    <Image
                      src={UserCreditScrollTopArrowIcon}
                      className={`actpacc-arrow-icon ${
                        this.props.isLochLeaderBoardBlockOpen
                          ? ""
                          : "actpacc-arrow-icon-reversed"
                      }`}
                    />
                  </div>
                  {this.props.isLochLeaderBoardBlockOpen ? (
                    <>
                      <div
                        id="copyTradeLeaderboardScrollBody"
                        className="actpacc-no-scroll-body"
                        onScroll={this.handleAvailableTradeScroll}
                        style={{
                          padding: "2rem ",
                          paddingBottom: "0rem",
                        }}
                      >
                        <HomeSmartMoneyPage
                          justShowTable
                          history={this.props.history}
                          location={this.props.location}
                        />
                      </div>
                    </>
                  ) : null}
                </div>
                {/* Loch Leaderboard */}
                <div
                  className={`available-copy-trades-popular-accounts-container available-copy-trades-popular-accounts-container-mobile`}
                >
                  <div className="available-copy-trades-popular-accounts">
                    <div
                      className={`actpacc-header ${
                        this.props.isMyCopiedWalletBlockOpen
                          ? "actpacc-header-open"
                          : ""
                      }`}
                      onClick={this.props.toggleMyCopiedWalletBlockOpen}
                    >
                      <div className="actpacc-header-title">
                        <Image
                          src={FollowingSidebarIcon}
                          className="actpacc-header-icon"
                        />
                        <div className="inter-display-medium f-s-16">
                          My Copied Wallets
                        </div>
                      </div>
                      <Image
                        src={UserCreditScrollTopArrowIcon}
                        className={`actpacc-arrow-icon ${
                          this.props.isMyCopiedWalletBlockOpen
                            ? ""
                            : "actpacc-arrow-icon-reversed"
                        }`}
                      />
                    </div>
                    {this.props.isMyCopiedWalletBlockOpen ? (
                      <>
                        <div
                          id="copyTradeLeaderboardScrollBody"
                          className="actpacc-no-scroll-body"
                          onScroll={this.handleAvailableTradeScroll}
                          style={{
                            // padding: "2rem ",
                            paddingBottom: "0rem",
                          }}
                        >
                          <div
                            style={{
                              overflowX: "scroll",
                              padding: "0rem 0.5rem",
                              paddingTop: "0.5rem",
                            }}
                            className={`freezeTheFirstColumn newHomeTableContainer  ${
                              this.props.emulationsLoading ||
                              this.props.tableData < 1
                                ? ""
                                : "tableWatermarkOverlay"
                            }`}
                          >
                            <TransactionTable
                              noSubtitleBottomPadding
                              disableOnLoading
                              isMiniversion
                              showHeaderOnEmpty
                              message="Select a wallet above to copy trade to get started"
                              noDataImage={NoCopyTradeTableIcon}
                              tableData={this.props.tableData}
                              columnList={this.props.columnData}
                              headerHeight={60}
                              isArrow={true}
                              isLoading={this.props.emulationsLoading}
                              isAnalytics="average cost basis"
                              fakeWatermark
                              xAxisScrollable
                              yAxisScrollable
                              xAxisScrollableColumnWidth={3.5}
                            />
                          </div>
                        </div>
                      </>
                    ) : null}
                  </div>
                  {/* <div
                    style={{
                      backgroundColor: "var(--cardBackgroud)",
                      borderRadius: "1.2rem",
                      padding: "0rem",
                      paddingBottom: "0.5rem",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        overflowX: "scroll",
                        padding: "0rem 0.5rem",
                        paddingTop: "0.5rem",
                      }}
                      className={`freezeTheFirstColumn newHomeTableContainer  ${
                        this.props.emulationsLoading || this.props.tableData < 1
                          ? ""
                          : "tableWatermarkOverlay"
                      }`}
                    >
                      <TransactionTable
                        noSubtitleBottomPadding
                        disableOnLoading
                        isMiniversion
                        showHeaderOnEmpty
                        message="Select a wallet above to copy trade to get started"
                        noDataImage={NoCopyTradeTableIcon}
                        tableData={this.props.tableData}
                        columnList={this.props.columnData}
                        headerHeight={60}
                        isArrow={true}
                        isLoading={this.props.emulationsLoading}
                        isAnalytics="average cost basis"
                        fakeWatermark
                        xAxisScrollable
                        yAxisScrollable
                        xAxisScrollableColumnWidth={3.5}
                      />
                    </div>
                  </div> */}
                  <div className="available-copy-trades-popular-accounts available-copy-trades-popular-accounts-second">
                    <div
                      className={`actpacc-header ${
                        this.props.isAvailableCopyTradeBlockOpen
                          ? "actpacc-header-open"
                          : ""
                      }`}
                      onClick={this.props.toggleAvailableCopyTradeBlockOpen}
                    >
                      <div className="actpacc-header-title">
                        <Image
                          src={EmultionSidebarIcon}
                          className="actpacc-header-icon"
                        />
                        <div className="inter-display-medium f-s-16">
                          Available Copy Trades
                        </div>
                      </div>
                      <Image
                        src={UserCreditScrollTopArrowIcon}
                        className={`actpacc-arrow-icon ${
                          this.props.isAvailableCopyTradeBlockOpen
                            ? ""
                            : "actpacc-arrow-icon-reversed"
                        }`}
                      />
                    </div>
                    {this.props.isAvailableCopyTradeBlockOpen ? (
                      <>
                        <div
                          id="availableCopyTradeScrollBody"
                          className="actpacc-scroll-body"
                          onScroll={this.props.handleAvailableTradeScroll}
                        >
                          {this.props.copyTradesAvailableLocal &&
                          this.props.copyTradesAvailableLocal.length > 0 ? (
                            this.props.copyTradesAvailableLocal.map(
                              (curTradeData, index) => {
                                return (
                                  <div className="available-copy-trades">
                                    <div className="available-copy-trades-mobile-data-container">
                                      <div className="available-copy-trades-content-container">
                                        <div
                                          onClick={() => {
                                            this.props.goToNewAddress(
                                              curTradeData.copyAddress
                                            );
                                          }}
                                          className="inter-display-medium f-s-16 available-copy-trades-address"
                                        >
                                          {TruncateText(
                                            curTradeData.copyAddress
                                          )}
                                        </div>
                                      </div>
                                      <div className="inter-display-medium f-s-16 available-copy-trades-transaction-container ">
                                        Swap{" "}
                                        {numToCurrency(curTradeData.valueFrom)}{" "}
                                        {curTradeData.assetFrom} for{" "}
                                        {numToCurrency(curTradeData.valueTo)}{" "}
                                        {curTradeData.assetTo}
                                        ? 
                                      </div>
                                    </div>
                                    <div className="available-copy-trades-button-container">
                                      <div
                                        className="available-copy-trades-button"
                                        onClick={() => {
                                          this.props.showExecuteCopyTrade(
                                            curTradeData
                                          );
                                        }}
                                      >
                                        <Image
                                          className="available-copy-trades-button-icons"
                                          src={AvailableCopyTradeCheckIcon}
                                        />
                                      </div>
                                      <div
                                        className="available-copy-trades-button"
                                        onClick={() => {
                                          this.props.openRejectModal(
                                            curTradeData
                                          );
                                        }}
                                        style={{
                                          marginLeft: "1rem",
                                        }}
                                      >
                                        <Image
                                          className="available-copy-trades-button-icons"
                                          src={AvailableCopyTradeCrossIcon}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                            )
                          ) : (
                            <div className="actpacc-scroll-body-no-data inter-display-medium f-s-14 lh-19 ">
                              Select a wallet above to copy trade to get started
                            </div>
                          )}
                        </div>

                        <div className="available-copy-trades-navigator">
                          <div />
                          <div className="available-copy-trades-navigator-arrows">
                            <Image
                              style={{
                                opacity: this.props.isLeftArrowDisabled
                                  ? 0.5
                                  : 1,
                                cursor: this.props.isLeftArrowDisabled
                                  ? "default"
                                  : "pointer",
                              }}
                              onClick={this.props.scrollLeft}
                              className="availableCopyTradesArrowIcon availableCopyTradesArrowIconLeft"
                              src={UserCreditScrollLeftArrowIcon}
                            />
                            <Image
                              style={{
                                opacity: this.props.isRightArrowDisabled
                                  ? 0.5
                                  : 1,
                                cursor: this.props.isRightArrowDisabled
                                  ? "default"
                                  : "pointer",
                              }}
                              onClick={this.props.scrollRight}
                              className="availableCopyTradesArrowIcon"
                              src={UserCreditScrollRightArrowIcon}
                            />
                          </div>
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  OnboardingState: state.OnboardingState,
  intelligenceState: state.IntelligenceState,
  commonState: state.CommonState,
  emulationsState: state.EmulationsState,
});
const mapDispatchToProps = {
  signUpWelcome,
  verifyUser,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AssetUnrealizedProfitAndLossMobile);
