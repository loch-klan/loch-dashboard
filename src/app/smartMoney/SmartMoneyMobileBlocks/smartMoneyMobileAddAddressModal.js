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

class SmartMoneyMobileAddAddressModal extends BaseReactComponent {
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
        <div className="msmpModalMainIconWhiteContainer">
          <Image src={TrophyIcon} />
        </div>
        <div className="msmpModalTexts">
          <h6 className="inter-display-medium f-s-20 lh-24 m-b-10">
            {this.state.signInUpTitle}
          </h6>
          <p className="inter-display-medium f-s-16 lh-19 grey-7C7 m-b-24 text-center">
            {this.state.signInUpSubTitle}
          </p>
        </div>
        <div
          className={`msmModalInputWrapper m-b-48 ${
            this.state.showBorder ? "msmModalInputWrapperSelected" : ""
          }`}
        >
          <input
            type="text"
            value={
              this.state.isSignUpPage
                ? this.state.signUpEmail
                : this.state.isSignInOtpPage
                ? this.state.signInOtp
                : this.state.isSignInPage
                ? this.state.signInEmail
                : ""
            }
            placeholder="Paste wallet address or ENS here"
            className={`inter-display-regular f-s-16 lh-20 msmModalInput`}
            onChange={this.handleOnTextChange}
            // id={elem.id}
            onKeyDown={this.handleTabPress}
            onFocus={this.showBorder}
            onBlur={this.hideBorder}
            autocomplete="off"
            onSubmit={this.onValidSubmit}
          />
        </div>
        <div className="msmModalBtnContainer">
          <CustomButton
            className="inter-display-regular f-s-15 lh-20 msmModalBtn"
            type="submit"
            handleClick={this.onValidSubmit}
            isDisabled={this.state.signInUpIsBtnDisabled}
            buttonText={this.state.signInUpBtnText}
          />
        </div>
        {this.state.isSignInPage ? (
          <div className="msmModalBtnContainer m-t-24">
            <CustomButton
              className="inter-display-regular f-s-15 lh-20 msmModalBtn msmTransparentModalBtn"
              type="submit"
              handleClick={this.props.onHide}
              buttonText="Cancel"
            />
          </div>
        ) : null}
        <div onClick={this.showSignUpPage}>
          Don’t have an account yet? Click here to sign up.
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

SmartMoneyMobileAddAddressModal.propTypes = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SmartMoneyMobileAddAddressModal);
