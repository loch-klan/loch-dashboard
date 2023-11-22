import React from "react";
import { connect } from "react-redux";
import { searchTransactionApi, getFilters } from "../../intelligence/Api.js";
import { BaseReactComponent, CustomButton } from "../../../utils/form/index.js";
import { getAllCoins, getAllParentChains } from "../../onboarding/Api.js";
import backIcon from "../../../assets/images/icons/Icon-back.svg";
import {
  GetAllPlan,
  SendOtp,
  setPageFlagDefault,
  TopsetPageFlagDefault,
} from "../../common/Api.js";
import {
  VerifySmartMoneyEmailOtp,
  getSmartMoney,
  smartMoneySignUpApi,
} from "../Api.js";
import {
  removeFromWatchList,
  updateAddToWatchList,
} from "../../watchlist/redux/WatchListApi.js";
import { Image } from "react-bootstrap";
import SignInIcon from "../../../assets/images/icons/ActiveProfileIcon.svg";
import validator from "validator";
import { toast } from "react-toastify";
import {
  CrossSmartMoneyIcon,
  TrophyIcon,
} from "../../../assets/images/icons/index.js";
import { SmartMoneyAboutMobileImage } from "../../../assets/images/index.js";

class SmartMoneyMobileHowItWorksModal extends BaseReactComponent {
  constructor(props) {
    super(props);

    this.state = {
      isSignUpPage: false,
      isSignInPage: true,
      isSignInOtpPage: false,

      signInUpTitle: "Contribute to the community",
      signInUpSubTitle: "Add an address to the community board",
      signInUpBtnText: "Add",
      signInUpIsBtnDisabled: true,
      signInUpInputPlaceHolder: "Email",

      signInEmail: "",
      signUpEmail: "",
      signInOtp: "",
      showBorder: false,
    };
  }

  componentDidMount() {}
  componentDidUpdate(prevProps, prevState) {}
  handleOnTextChange = (e) => {
    let { value } = e.target;
    const tempIsValidEmail = validator.isEmail(value);
    if (this.state.isSignUpPage) {
      this.setState({
        signUpEmail: value,
        signInUpIsBtnDisabled: !tempIsValidEmail,
      });
    } else if (this.state.isSignInPage) {
      this.setState({
        signInEmail: value,
        signInUpIsBtnDisabled: !tempIsValidEmail,
      });
    } else if (this.state.isSignInOtpPage) {
      this.setState({
        signInOtp: value,
        signInUpIsBtnDisabled: value ? false : true,
      });
    }
  };

  showBorder = () => {
    this.setState({
      showBorder: true,
    });
  };
  hideBorder = () => {
    this.setState({
      showBorder: false,
    });
  };
  handleTabPress = (event) => {
    if (event.key === "Enter" && !this.state.signInUpIsBtnDisabled) {
      event.preventDefault();
      this.onValidSubmit();
    }
  };

  showSignInPage = () => {
    this.setState({
      isSignUpPage: false,
      isSignInPage: true,
      isSignInOtpPage: false,
      signInEmail: "",
      signInUpTitle: "Sign in",
      signInUpSubTitle: "Get right back into your account",
      signInUpBtnText: "Send verification",
      signInUpInputPlaceHolder: "Email",
      signInUpIsBtnDisabled: true,
    });
  };
  showSignInOtpPage = () => {
    this.setState({
      isSignUpPage: false,
      isSignInPage: false,
      isSignInOtpPage: true,
      signInOtp: "",
      signInUpTitle: "Verify email",
      signInUpSubTitle:
        "Enter the verification code sent to your email to sign in your account",
      signInUpBtnText: "Verify",
      signInUpInputPlaceHolder: "Enter Verification Code",
      signInUpIsBtnDisabled: true,
    });
  };
  showSignUpPage = () => {
    this.setState({
      isSignUpPage: true,
      isSignInPage: false,
      isSignInOtpPage: false,
      signUpEmail: "",
      signInUpTitle: "Sign up",
      signInUpSubTitle:
        "Add your email so you can view, analyze, and follow any or all of the smartest actors on-chain.",
      signInUpBtnText: "Save",
      signInUpInputPlaceHolder: "Email",
      signInUpIsBtnDisabled: true,
    });
  };
  handleAccountCreate = () => {
    let data = new URLSearchParams();
    data.append("email", this.state.signInEmail);
    SendOtp(data, this, true);
  };
  handleOtp = () => {
    this.setState({
      isOptInValid: false,
    });
    let data = new URLSearchParams();
    data.append("email", this.state.signInEmail);
    data.append("otp_token", this.state.signInOtp);
    data.append(
      "signed_up_from",
      this.props?.popupType === "general_popup"
        ? "generic pop up"
        : this.props.tracking
    );
    this.props.VerifySmartMoneyEmailOtp(
      data,
      this,
      this.state.signInEmail,
      true
    );
  };
  onValidSubmit = () => {
    if (this.state.isSignInPage) {
      this.handleAccountCreate();
    } else if (this.state.isSignInOtpPage) {
      this.handleOtp();
    } else if (this.state.isSignUpPage) {
      this.handleSignUp();
    }
  };
  handleSignUp = () => {
    // signInUser({
    //   email_address: this.state?.email,
    //   userId: getCurrentUser().id,
    //   first_name: "",
    //   last_name: "",
    //   track: "leaving",
    // });
    if (this.props.updateTimer) {
      this.props.updateTimer();
    }

    const url = new URLSearchParams();
    url.append("email", this.state.signUpEmail);
    url.append("signed_up_from", "leaving");
    url.append("type", "smart-money");
    this.props.smartMoneySignUpApi(this, url, this.state.signUpEmail, true);
  };
  handleSuccesfulSignUp = () => {
    this.props.onHide();
    toast.success(
      <div className="custom-toast-msg">
        <div>Successful</div>
        <div className="inter-display-medium f-s-13 lh-16 grey-737 m-t-04">
          Please check your mailbox for the verification link
        </div>
      </div>
    );
  };
  emailIsVerified = () => {
    toast.success(`Email verified`);
    this.props.onHide();
  };
  render() {
    return (
      <div className="msmpModalBody">
        <div className="msmpModalClosebtnContainer">
          <div
            className="back-icon"
            onClick={this.state.isSignUpPage ? this.showSignInPage : () => null}
            style={{
              opacity: this.state.isSignUpPage ? 1 : 0,
            }}
          >
            <Image className="cp" src={backIcon} />
          </div>
          <div className="msmpModalClosebtn" onClick={this.props.onHide}>
            <Image src={CrossSmartMoneyIcon} />
          </div>
        </div>
        <Image
          src={SmartMoneyAboutMobileImage}
          className="msmpModalHowItWorks"
        />
        <div
          style={{
            marginTop: "22rem",
          }}
          className="msmpModalTexts msmpModalAboutHeading"
        >
          <h6 className="inter-display-medium f-s-20 lh-24 m-b-4">
            About Loch Smart Money
          </h6>
          <p className="inter-display-medium f-s-14 lh-19 m-b-24 text-center  grey-7C7">
            The intelligent way to manage your asset
          </p>
        </div>
        <div className="msmpModalAboutContentContainer">
          <div className="msmpModalAboutContentBlock">
            <div
              style={{
                marginTop: "0rem",
              }}
              className="smartMoneyHowItWorksTextLine  inter-display-medium f-s-15"
            >
              You see a token 2x in price.
            </div>
            <div className="smartMoneyHowItWorksTextLine  inter-display-medium f-s-15">
              You see another token plummet by 4x overnight.
            </div>
            <div className="smartMoneyHowItWorksTextLine  inter-display-medium f-s-15">
              You think to yourself, how is this possible?
            </div>
            <div className="smartMoneyHowItWorksTextLine  inter-display-medium f-s-15">
              Most adjacent tokens are flat.
            </div>

            <div className="smartMoneyHowItWorksTextLine  inter-display-medium f-s-15">
              <span>The answer is always simple -- </span>
              <span
                style={{
                  fontWeight: "bold",
                }}
              >
                Follow the smart money.
              </span>
            </div>

            <div className="smartMoneyHowItWorksTextLine  inter-display-medium f-s-15">
              Loch’s team of sleuth’s and researchers have assiduously put
              together this list of the smartest money on-chain.
            </div>
            <div className="smartMoneyHowItWorksTextLine  inter-display-medium f-s-15">
              This is the lazy analyst’s ultimate guide to alpha.
            </div>
            <div className="smartMoneyHowItWorksTextLine  inter-display-medium f-s-15">
              The list is updated daily. We know it’s not enough to just look at
              net worth. That’s why Loch gives you the realized and unrealized
              PnL for each address.
            </div>
            <div className="smartMoneyHowItWorksTextLine  inter-display-medium f-s-15">
              You can click, analyze, and follow any or all of these addresses.
            </div>
            <div className="smartMoneyHowItWorksTextLine  inter-display-medium f-s-15">
              The best part of using this leaderboard is that you’ll get the
              confidence backed by your own increasingly successful results.
            </div>
            <div className="smartMoneyHowItWorksTextLine  inter-display-medium f-s-15">
              You’ll become more proficient in the most valuable skill in
              crypto, which is finding and analyzing smart money.
            </div>
            <div className="smartMoneyHowItWorksTextLine  inter-display-medium f-s-15">
              Loch’s team has benefited immensely from this leaderboard.
            </div>
            <div className="smartMoneyHowItWorksTextLine  inter-display-medium f-s-15">
              It’s your turn now.
            </div>
          </div>
        </div>
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
  VerifySmartMoneyEmailOtp,
  smartMoneySignUpApi,
};

SmartMoneyMobileHowItWorksModal.propTypes = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SmartMoneyMobileHowItWorksModal);
