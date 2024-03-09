import { Component } from "react";
import { connect } from "react-redux";
import { SendOtp, VerifyEmail } from "../common/Api";
import LoginMobile from "../home/NewAuth/LoginMobile";
import RedirectMobile from "../home/NewAuth/RedirectMobile";
import SignUpMobile from "../home/NewAuth/SignUpMobile";
import VerifyMobile from "../home/NewAuth/VerifyMobile";
import TransactionTable from "../intelligence/TransactionTable";
import { signUpWelcome, verifyUser } from "../onboarding/Api";
import AddEmulationsAddressModal from "./AddEmulationsAddressModal";

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
      <div className="assets-expanded-mobile copyTradeExpandedMobile">
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
        <div
          style={{
            backgroundColor: "var(--cardBackgroud",
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
