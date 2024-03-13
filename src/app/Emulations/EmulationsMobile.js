import { Component } from "react";
import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import {
  EmultionSidebarIcon,
  UserCreditScrollLeftArrowIcon,
  UserCreditScrollRightArrowIcon,
} from "../../assets/images/icons";
import { TruncateText, numToCurrency } from "../../utils/ReusableFunctions";
import { SendOtp, VerifyEmail } from "../common/Api";
import LoginMobile from "../home/NewAuth/LoginMobile";
import RedirectMobile from "../home/NewAuth/RedirectMobile";
import SignUpMobile from "../home/NewAuth/SignUpMobile";
import VerifyMobile from "../home/NewAuth/VerifyMobile";
import TransactionTable from "../intelligence/TransactionTable";
import { signUpWelcome, verifyUser } from "../onboarding/Api";
import AddEmulationsAddressModal from "./AddEmulationsAddressModal";
import EmulationsTradeModal from "./EmulationsTradeModal";

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
    const userDetails = JSON.parse(window.sessionStorage.getItem("lochUser"));
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
            <p>All the wallet addresses you have copied</p>
          </div>
          <div
            onClick={this.openCopyTradeModal}
            className="mobile-add-copy-trade-button"
          >
            Add
          </div>
        </div>

        {this.props.isAddCopyTradeAddress ? (
          <AddEmulationsAddressModal
            show={this.props.isAddCopyTradeAddress}
            onHide={this.props.hideAddCopyTradeAddress}
            emulationsUpdated={this.props.emulationsUpdated}
            isMobile
          />
        ) : null}
        {this.props.userDetailsState &&
        this.props.userDetailsState.email &&
        this.props.availableCopyTrades &&
        this.props.availableCopyTrades.length > 0 ? (
          <div className="available-copy-trades-container available-copy-trades-container-mobile">
            <div
              id="availableCopyTradeScrollBody"
              className="availableCopyTradeScrollBodyClass"
              onScroll={this.props.handleAvailableTradeScroll}
            >
              {this.props.availableCopyTrades.map((curTradeData, index) => {
                return (
                  <div
                    className="available-copy-trades"
                    style={{
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: "2rem",
                    }}
                  >
                    <div className="available-copy-trades-content-container available-copy-trades-content-container-mobile">
                      <div className="available-copy-trades-content-child">
                        <Image
                          src={EmultionSidebarIcon}
                          className="available-copy-trades-icon"
                        />
                        <div className="inter-display-medium f-s-16">
                          Available Copy Trade
                        </div>
                      </div>
                      <div className="inter-display-medium f-s-16 available-copy-trades-address">
                        {TruncateText(curTradeData.wallet)}
                      </div>
                    </div>
                    <div className="inter-display-medium f-s-16 available-copy-trades-transaction-container available-copy-trades-transaction-container-mobile">
                      Swap {numToCurrency(curTradeData.valueFrom)}{" "}
                      {curTradeData.assetFrom} for{" "}
                      {numToCurrency(curTradeData.valueTo)}{" "}
                      {curTradeData.assetTo}
                      ? 
                    </div>
                    <div className="available-copy-trades-button-container available-copy-trades-button-container--mobile">
                      <div className={`topbar-btn`} id="address-button-two">
                        <span className="dotDotText">Reject</span>
                      </div>
                      <div
                        className={`topbar-btn ml-2 topbar-btn-dark`}
                        id="address-button-two"
                        onClick={this.props.showExecuteCopyTrade}
                      >
                        <span className="dotDotText">Confirm</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {this.props.availableCopyTrades.length > 1 ? (
              <div className="available-copy-trades-navigator">
                <div className="available-copy-trades-navigator-circles-container">
                  {this.props.availableCopyTrades.map(
                    (resCircle, resCircleIndex) => {
                      return (
                        <div
                          style={{
                            opacity:
                              resCircleIndex ===
                              this.props.currentCirclePosition
                                ? 1
                                : 0.2,
                            marginLeft: resCircleIndex === 0 ? 0 : "0.5rem",
                          }}
                          onClick={() => {
                            this.props.goToScrollPosition(resCircleIndex);
                          }}
                          className="available-copy-trades-navigator-circle"
                        />
                      );
                    }
                  )}
                </div>
                <div className="available-copy-trades-navigator-arrows">
                  <Image
                    style={{
                      marginRight: "1rem",
                      opacity: this.props.isLeftArrowDisabled ? 0.5 : 1,
                    }}
                    onClick={this.props.scrollLeft}
                    className="availableCopyTradesArrowIcon"
                    src={UserCreditScrollLeftArrowIcon}
                  />
                  <Image
                    style={{
                      opacity: this.props.isRightArrowDisabled ? 0.5 : 1,
                    }}
                    onClick={this.props.scrollRight}
                    className="availableCopyTradesArrowIcon"
                    src={UserCreditScrollRightArrowIcon}
                  />
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
        <div
          style={{
            backgroundColor: "var(--cardBackgroud)",
            borderRadius: "1.2rem",
            padding: "0rem",
            paddingBottom: "0.5rem",
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
              message="No copy trades found"
              tableData={this.props.tableData}
              columnList={this.props.columnData}
              headerHeight={60}
              isArrow={true}
              isLoading={this.props.emulationsLoading}
              isAnalytics="average cost basis"
              fakeWatermark
              xAxisScrollable
              yAxisScrollable
              xAxisScrollableColumnWidth={3}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {
  signUpWelcome,
  verifyUser,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AssetUnrealizedProfitAndLossMobile);
