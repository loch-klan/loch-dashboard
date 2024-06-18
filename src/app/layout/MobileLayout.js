import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import {
  MobileNavCopyTraderIcon,
  MobileNavFollow,
  MobileNavLeaderboard,
  MobileNavProfile,
  MobileNavWalletViewer,
  SharePortfolioIconWhite,
  WalletViewerSidebarIcon,
} from "../../assets/images/icons";
import { default as SearchIcon } from "../../assets/images/icons/search-icon.svg";
import {
  EmailAddressAddedSignUp,
  HomeMenu,
  HomeSignedUpReferralCode,
  LeaveEmailAdded,
  LochPointsSignUpPopupEmailAdded,
  MenuCopyTradelist,
  MenuLeaderboard,
  MenuWatchlist,
  Mobile_Home_Share,
  ProfileMenu,
  QuickAddWalletAddress,
  SearchBarAddressAdded,
  SignInModalEmailAdded,
  SignUpModalEmailAdded,
  resetUser,
  signInUser,
} from "../../utils/AnalyticsFunctions";
import { BASE_URL_S3 } from "../../utils/Constant";
import { getCurrentUser, getToken } from "../../utils/ManageToken";
import {
  dontOpenLoginPopup,
  isPremiumUser,
  removeBlurMethods,
  removeOpenModalAfterLogin,
  removeSignUpMethods,
  whichSignUpMethod,
} from "../../utils/ReusableFunctions.js";
import { BaseReactComponent } from "../../utils/form";
import { isNewAddress } from "../Portfolio/Api.js";
import MobileDarkModeWrapper from "../Portfolio/MobileDarkModeWrapper.js";
import WelcomeCard from "../Portfolio/WelcomeCard";
import { checkReferallCodeValid } from "../ReferralCodes/ReferralCodesApi.js";
import {
  SendOtp,
  VerifyEmail,
  fixWalletApi,
  setPageFlagDefault,
  updateUserWalletApi,
  updateWalletListFlag,
} from "../common/Api";
import Breadcrums from "../common/Breadcrums.js";
import PaywallModal from "../common/PaywallModal.js";
import Footer from "../common/footer";
import { setHeaderReducer } from "../header/HeaderAction";
import TopWalletAddressList from "../header/TopWalletAddressList.js";
import LoginMobile from "../home/NewAuth/LoginMobile.js";
import RedirectMobile from "../home/NewAuth/RedirectMobile.js";
import SignUpMobile from "../home/NewAuth/SignUpMobile.js";
import VerifyMobile from "../home/NewAuth/VerifyMobile.js";
import NewHomeInputBlock from "../home/NewHomeInputBlock";
import {
  createAnonymousUserApi,
  detectCoin,
  getAllParentChains,
  signUpWelcome,
} from "../onboarding/Api";
import { addUserCredits, updateUser } from "../profile/Api";
import SmartMoneyMobileSignOutModal from "../smartMoney/SmartMoneyMobileBlocks/smartMoneyMobileSignOutModal.js";
import { getAllWalletListApi } from "../wallet/Api";
import "./_mobileLayout.scss";

class MobileLayout extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      isPremiumUser: false,
      isLochPaymentModal: false,
      authmodal: "",
      email: "",
      otp: "",
      emailSignup: "",
      isReferralCodeStep: false,
      isReferralCodeLoading: false,
      isOptInValid: false,
      lochUserLocal: JSON.parse(window.localStorage.getItem("lochUser")),
      confirmLeave: false,
      activeTab: "/home",
      walletInput: [
        {
          id: `wallet1`,
          address: "",
          coins: [],
          displayAddress: "",
          wallet_metadata: {},
          nickname: "",
          showAddress: true,
          showNickname: false,
          apiAddress: "",
          showNameTag: true,
          nameTag: "",
        },
      ],
      showSearchIcon: false,
      showShareIcon: false,
      disableAddBtn: false,
      navItems: [
        {
          pageIcon: MobileNavCopyTraderIcon,
          text: "Copy",
          path: "/copy-trade",
          loggedOutPath: "/copy-trade-welcome",
        },
        {
          pageIcon: MobileNavWalletViewer,
          text: "Wallet",
          path: "/home",
          loggedOutPath: "/wallet-viewer-add-address",
        },
        {
          pageIcon: MobileNavLeaderboard,
          text: "Leaderboard",
          path: "/home-leaderboard",
        },
        {
          pageIcon: MobileNavFollow,
          text: "Follow",
          path: "/watchlist",
          loggedOutPath: "/following-add-address",
        },
        {
          pageIcon: MobileNavProfile,
          text: "Profile",
          path: "/profile",
          loggedOutPath: "/profile-add-address",
        },
      ],
      userWalletList: [],
      isUpdate: 0,
      isLoadingInsight: true,
      isLoading: true,
      isLoadingNet: true,
      chainLoader: true,
    };
  }

  shareIconLoaded = () => {
    this.setState({ showShareIcon: true });
  };

  searchIconLoaded = () => {
    this.setState({ showSearchIcon: true });
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isReferralCodeStep !== this.state.isReferralCodeStep) {
      if (this.state.isReferralCodeStep) {
        const signUpMethod = whichSignUpMethod();
        SignUpModalEmailAdded({
          session_id: getCurrentUser().id,
          email_address: this.state?.emailSignup,
          signUpMethod: signUpMethod,
        });
      }
    }
    if (prevState.authmodal !== this.state.authmodal) {
      if (
        this.state.authmodal !== "signup" &&
        this.state.authmodal !== "login" &&
        this.state.authmodal !== "verify"
      ) {
        removeSignUpMethods();
      }
    }
    if (!this.props.commonState?.mobileLayout) {
      this.props.updateWalletListFlag("mobileLayout", true);
      this.setState({
        lochUserLocal: JSON.parse(window.localStorage.getItem("lochUser")),
      });
    }
    if (prevState.otp !== this.state.otp) {
      this.setState({
        isOptInValid: false,
      });
    }
  }
  componentDidMount() {
    this.props.getAllParentChains();
    const userDetails = JSON.parse(window.localStorage.getItem("lochUser"));
    if (userDetails && userDetails.email) {
      const shouldOpenNoficationModal = window.localStorage.getItem(
        "openSearchbarPaymentModal"
      );
      if (shouldOpenNoficationModal) {
        setTimeout(() => {
          removeOpenModalAfterLogin();
          this.setState({
            isLochPaymentModal: true,
          });
        }, 1000);
      }
    }
    // for chain detect
    let activeTab = window.location.pathname;
    if (
      activeTab === "/watchlist" ||
      activeTab === "/copy-trade" ||
      activeTab === "/home-leaderboard" ||
      activeTab === "/copy-trade-welcome" ||
      activeTab === "/following-add-address" ||
      activeTab === "/wallet-viewer-add-address" ||
      activeTab === "/profile-add-address"
    ) {
      this.setState({ activeTab: activeTab });
    } else if (
      activeTab === "/profile" ||
      activeTab === "/profile/referral-codes"
    ) {
      this.setState({ activeTab: "/profile" });
    }

    setTimeout(() => {
      window.localStorage.setItem("fifteenSecSignInModal", true);
      const dontOpenLoginPopup =
        window.localStorage.getItem("dontOpenLoginPopup");
      const lochUserLocalAgain = JSON.parse(
        window.localStorage.getItem("lochUser")
      );
      if (
        !dontOpenLoginPopup &&
        !(lochUserLocalAgain && lochUserLocalAgain.email)
      ) {
        window.localStorage.setItem("dontOpenLoginPopup", true);
        this.setState({
          authmodal: "login",
        });
      }
    }, 15000);
  }
  handleShare = () => {
    Mobile_Home_Share({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    let lochUser = getCurrentUser().id;
    let userWallet = JSON.parse(window.localStorage.getItem("addWallet"));
    let slink =
      userWallet?.length === 1
        ? userWallet[0].displayAddress || userWallet[0].address
        : lochUser;
    let shareLink = BASE_URL_S3 + "home/" + slink + "?redirect=home";
    // navigator.clipboard.writeText(shareLink);
    this.copyTextToClipboard(shareLink);

    // HomeShare({
    //   session_id: getCurrentUser().id,
    //   email_address: getCurrentUser().email,
    // });
  };
  goToPayModal = () => {
    if (this.state.isPremiumUser) {
      return null;
    }
    const userDetails = JSON.parse(window.localStorage.getItem("lochUser"));
    if (userDetails && userDetails.email) {
      dontOpenLoginPopup();
      this.setState({
        isLochPaymentModal: true,
      });
    } else {
      removeOpenModalAfterLogin();
      setTimeout(() => {
        window.localStorage.setItem("openSearchbarPaymentModal", true);
      }, 1000);
      if (document.getElementById("sidebar-open-sign-in-btn")) {
        document.getElementById("sidebar-open-sign-in-btn").click();
        dontOpenLoginPopup();
      } else if (document.getElementById("sidebar-closed-sign-in-btn")) {
        document.getElementById("sidebar-closed-sign-in-btn").click();
        dontOpenLoginPopup();
      }
    }
  };
  hidePaymentModal = () => {
    this.setState({
      isLochPaymentModal: false,
    });
  };
  goToHomeAfterReplace = () => {
    if (this.props.shouldGoToHomeAfterReplace) {
      this.props.history.push("/home");
    }
  };
  handleAddWallet = (replaceAddresses) => {
    this.setState({
      welcomeAddBtnLoading: true,
    });
    localStorage.setItem("replacedOrAddedAddress", true);
    if (this.state.goBtnDisabled) {
      return null;
    }
    if (!replaceAddresses && !isPremiumUser()) {
      removeBlurMethods();
      removeSignUpMethods();
      window.localStorage.setItem("blurredAddMultipleAddressSignInModal", true);
      this.goToPayModal();
      return;
    }
    if (this.state.walletInput[0]) {
      SearchBarAddressAdded({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        address: this.state.walletInput[0].address,
        isMobile: true,
      });
    }
    this.setState({
      disableAddBtn: true,
    });
    let addWalletList = [];

    if (!replaceAddresses) {
      addWalletList = JSON.parse(window.localStorage.getItem("addWallet"));
      if (addWalletList && addWalletList?.length > 0) {
        addWalletList = addWalletList?.map((e) => {
          return {
            ...e,
            showAddress: e.nickname === "" ? true : false,
            showNickname: e.nickname === "" ? false : true,
            showNameTag: e.nameTag === "" ? false : true,
            apiAddress: e.address,
          };
        });
      }
      if (addWalletList && addWalletList.length > 0) {
        for (let i = 0; i < addWalletList.length; i++) {
          if (addWalletList[i].id === "wallet1") {
            addWalletList[i].id = "wallet" + (addWalletList.length + 1);
          }
        }
      }
    }
    let tempWalletInput = this.state.walletInput[0];
    addWalletList = [...addWalletList, tempWalletInput];

    let arr = [];
    let addressList = [];
    let nicknameArr = {};
    let isChainDetected = [];
    let total_address = 0;
    let walletList = [];
    for (let i = 0; i < addWalletList.length; i++) {
      let curr = addWalletList[i];

      let isIncluded = false;
      const whatIndex = arr.findIndex(
        (resRes) =>
          resRes?.trim()?.toLowerCase() ===
            curr?.address?.trim()?.toLowerCase() ||
          resRes?.trim()?.toLowerCase() ===
            curr?.displayAddress?.trim()?.toLowerCase() ||
          resRes?.trim()?.toLowerCase() ===
            curr?.apiAddress?.trim()?.toLowerCase()
      );
      if (whatIndex !== -1) {
        isIncluded = true;
      }
      if (!isIncluded && curr.address) {
        walletList.push(curr);
        if (curr.address) {
          arr.push(curr.address?.trim());
        }
        nicknameArr[curr.address?.trim()] = curr.nickname;
        if (curr.displayAddress) {
          arr.push(curr.displayAddress?.trim());
        }
        if (curr.apiAddress) {
          arr.push(curr.apiAddress?.trim());
        }
        addressList.push(curr.address?.trim());
        isChainDetected.push(curr?.coinFound);
        total_address = total_address + 1;
      }
    }

    let addWallet = walletList;

    addWallet?.forEach((w, i) => {
      if (w.id) {
      } else {
        w.id = `wallet${i + 1}`;
      }
    });

    window.localStorage.setItem("addWallet", JSON.stringify(addWallet));
    const data = new URLSearchParams();
    const yieldData = new URLSearchParams();
    // data.append("wallet_addresses", JSON.stringify(arr));
    data.append("wallet_address_nicknames", JSON.stringify(nicknameArr));
    data.append("wallet_addresses", JSON.stringify(addressList));
    yieldData.append("wallet_addresses", JSON.stringify(addressList));
    // data.append("chain_detected", chain_detechted);

    // if its upload then we pass user id
    if (this.state.isChangeFile) {
      data.append("user_id", getCurrentUser().id);
      this.setState({
        isChangeFile: false,
      });
    }
    let creditIsAddress = false;
    let creditIsEns = false;
    for (let i = 0; i < addressList.length; i++) {
      const tempItem = addressList[i];
      const endsWithEth = /\.eth$/i.test(tempItem);

      if (endsWithEth) {
        creditIsAddress = true;
        creditIsEns = true;
      } else {
        creditIsAddress = true;
      }
    }

    if (this.props.isAddNewAddress) {
      if (this.props.isAddNewAddressLoggedIn) {
        const finalArr = [];
        this.props.createAnonymousUserApi(
          data,
          this,
          finalArr,
          null,
          this.props.goToPageAfterLogin,
          this.props.funAfterUserCreate,
          addressList
        );
      } else {
        const yieldData = new URLSearchParams();
        yieldData.append("wallet_addresses", JSON.stringify(addressList));
        this.props.updateUserWalletApi(data, this, yieldData, false);
      }
    } else {
      if (addWallet) {
        this.props.setHeaderReducer(addWallet);
      }
      if (creditIsAddress) {
        // Single address
        const addressCreditScore = new URLSearchParams();
        addressCreditScore.append("credits", "address_added");
        this.props.addUserCredits(addressCreditScore, this.resetCreditPoints);

        // Multiple address
        const multipleAddressCreditScore = new URLSearchParams();
        multipleAddressCreditScore.append("credits", "multiple_address_added");
        this.props.addUserCredits(
          multipleAddressCreditScore,
          this.resetCreditPoints
        );
      }
      if (creditIsEns) {
        const ensCreditScore = new URLSearchParams();
        ensCreditScore.append("credits", "ens_added");
        this.props.addUserCredits(ensCreditScore, this.resetCreditPoints);
      }

      this.props.updateUserWalletApi(data, this, yieldData, true);
    }
    const address = addWalletList?.map((e) => e.address);

    const addressDeleted = this.state.deletedAddress;
    const unrecog_address = addWalletList
      ?.filter((e) => !e.coinFound)
      ?.map((e) => e.address);
    const recog_address = addWalletList
      ?.filter((e) => e.coinFound)
      ?.map((e) => e.address);

    const blockchainDetected = [];
    const nicknames = [];
    addWalletList
      ?.filter((e) => e.coinFound)
      ?.map((obj) => {
        let coinName = obj.coins
          ?.filter((e) => e.chain_detected)
          ?.map((name) => name.coinName);
        let address = obj.address;
        let nickname = obj.nickname;
        blockchainDetected.push({ address: address, names: coinName });
        nicknames.push({ address: address, nickname: nickname });
      });

    QuickAddWalletAddress({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      addresses_added: address,
      ENS_added: address,
      addresses_deleted: addressDeleted,
      ENS_deleted: addressDeleted,
      unrecognized_addresses: unrecog_address,
      recognized_addresses: recog_address,
      blockchains_detected: blockchainDetected,
      nicknames: nicknames,
      isMobile: true,
    });
    if (this.props.updateTimer) {
      this.props.updateTimer();
    }
  };

  CheckApiResponseMobileLayout = (value) => {
    if (this.props.CheckApiResponse) {
      this.props.CheckApiResponse(value);
    } else {
      this.props.setPageFlagDefault();
    }
  };

  hideTheTopBarHistoryItems = () => {
    this.setState({
      walletInput: [
        {
          id: `wallet1`,
          address: "",
          coins: [],
          displayAddress: "",
          wallet_metadata: {},
          nickname: "",
          showAddress: true,
          showNickname: false,
          apiAddress: "",
          showNameTag: true,
          nameTag: "",
        },
      ],
    });
  };

  handleOnChange = (e) => {
    let { name, value } = e.target;

    let walletCopy = [...this.state.walletInput];
    let foundIndex = walletCopy.findIndex((obj) => obj.id === name);
    if (foundIndex > -1) {
      let prevValue = walletCopy[foundIndex].address;

      walletCopy[foundIndex].address = value;
      if (value === "" || prevValue !== value) {
        walletCopy[foundIndex].coins = [];
      }
      if (value === "") {
        walletCopy[foundIndex].coinFound = false;
        walletCopy[foundIndex].nickname = "";
      }
      // walletCopy[foundIndex].trucatedAddress = value
    }
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.setState(
      {
        addButtonVisible: this.state.walletInput.some((wallet) =>
          wallet.address ? true : false
        ),
        walletInput: walletCopy,
      },
      () => {
        this.timeout = setTimeout(() => {
          this.getCoinBasedOnWalletAddress(name, value);
        }, 1000);
      }
    );
    // timeout;
  };

  onKeyPressInput = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (!this.state.disableAddBtn) {
        this.handleAddWallet(true);
      }
    }
  };

  handleSetCoin = (data) => {
    let coinList = {
      chain_detected: data.chain_detected,
      coinCode: data.coinCode,
      coinName: data.coinName,
      coinSymbol: data.coinSymbol,
      coinColor: data.coinColor,
    };
    let newCoinList = [];
    newCoinList.push(coinList);
    data.subChains &&
      data.subChains?.map((item) =>
        newCoinList.push({
          chain_detected: data.chain_detected,
          coinCode: item.code,
          coinName: item?.name,
          coinSymbol: item.symbol,
          coinColor: item.color,
        })
      );
    let i = this.state.walletInput.findIndex((obj) => obj.id === data.id);
    let newAddress = [...this.state.walletInput];

    //new code
    data.address !== newAddress[i].address
      ? (newAddress[i].coins = [])
      : newAddress[i].coins.push(...newCoinList);

    // if (data.id === newAddress[i].id) {
    //   newAddress[i].address = data.address;
    // }

    newAddress[i].coinFound = newAddress[i].coins.some(
      (e) => e.chain_detected === true
    );

    newAddress[i].apiAddress = data?.apiaddress;

    this.setState({
      walletInput: newAddress,
    });
  };

  getCoinBasedOnWalletAddress = (name, value) => {
    let parentCoinList = this.props.OnboardingState.parentCoinList;
    if (parentCoinList && value) {
      window.localStorage.removeItem("shouldRecallApis");
      const tempWalletAddress = [value];
      const data = new URLSearchParams();
      data.append("wallet_addresses", JSON.stringify(tempWalletAddress));
      this.props.isNewAddress(data);
      for (let i = 0; i < parentCoinList.length; i++) {
        this.props.detectCoin(
          {
            id: name,
            coinCode: parentCoinList[i].code,
            coinSymbol: parentCoinList[i].symbol,
            coinName: parentCoinList[i].name,
            address: value,
            coinColor: parentCoinList[i].color,
            subChains: parentCoinList[i].sub_chains,
          },
          this,
          false,
          0,
          false,
          false
        );
      }
    }
  };

  cancelAddingWallet = () => {};
  resetCreditPoints = () => {};

  // when press go this function run
  handleChangeList = (value) => {
    this.setState({
      userWalletList: value,
      isUpdate: this.state.isUpdate == 0 ? 1 : 0,
      isLoadingInsight: true,

      isLoading: true,
      isLoadingNet: true,

      chainLoader: true,
    });
  };

  handleAddModal = () => {
    this.setState({
      addModal: !this.state.addModal,
      toggleAddWallet: false,
    });
  };

  async copyTextToClipboard(text) {
    if ("clipboard" in navigator) {
      toast.success("Link copied");
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  }
  closeConfirmLeaveModal = () => {
    this.setState({
      confirmLeave: false,
    });
  };
  openConfirmLeaveModal = () => {
    this.setState({
      confirmLeave: true,
    });
  };
  signOutFun = () => {
    window.localStorage.setItem("refresh", false);
    resetUser();
    this.props.setPageFlagDefault();
    this.closeConfirmLeaveModal();
    this.props.history.push("/welcome");
  };
  handleGoToReferral = () => {
    this.setState({
      isReferralCodeStep: true,
      isReferralCodeLoading: false,
    });
  };
  handleGoBackToSignUp = () => {
    this.setState({
      isReferralCodeStep: false,
    });
  };
  toggleAuthModal = (val = "") => {
    if (val !== "signup") {
      this.setState({
        isReferralCodeStep: false,
      });
    }
    this.setState({
      authmodal: val,
    });
  };
  checkReferralCode = () => {
    if (this.state.referralCode) {
      this.setState({
        isReferralCodeLoading: true,
      });
      const referalValHolderData = new URLSearchParams();
      referalValHolderData.append("code", this.state.referralCode);

      this.props.checkReferallCodeValid(
        referalValHolderData,
        this.handelSignUpApi,
        this.stopReferallButtonLoading
      );
    }
  };
  handelSignUpApi = () => {
    signInUser({
      email_address: this.state?.emailSignup,
      userId: getCurrentUser().id,
      first_name: "",
      last_name: "",
      track: "leaving",
    });
    if (this.props.tracking === "Loch points profile") {
      LochPointsSignUpPopupEmailAdded({
        session_id: getCurrentUser().id,
        email_address: this.state?.emailSignup,
      });
    }
    if (this.props.updateTimer) {
      this.props.updateTimer();
    }
    let email_arr = [];
    let data = JSON.parse(window.localStorage.getItem("addWallet"));
    if (data) {
      data.forEach((info) => {
        email_arr.push(info.address);
      });
      const url = new URLSearchParams();
      url.append("email", this.state.emailSignup);
      url.append("signed_up_from", "leaving");
      url.append("referral_code", this.state.referralCode);
      // url.append("wallet_addresses", JSON.stringify(email_arr));
      fixWalletApi(this, url, this.stopReferallButtonLoading);
      LeaveEmailAdded({
        session_id: getCurrentUser().id,
        email_address: this.state.emailSignup,
      });
      if (this.props.updateTimer) {
        this.props.updateTimer();
      }
    } else {
      const data = new URLSearchParams();
      console.log("this.state.emailSignup ", this.state.emailSignup);
      data.append(
        "email",
        this.state.emailSignup ? this.state.emailSignup.toLowerCase() : ""
      );
      data.append("signed_up_from", "welcome");
      data.append("referral_code", this.state.referralCode);
      EmailAddressAddedSignUp({
        email_address: this.state.emailSignup,
        session_id: "",
      });

      this.props.signUpWelcome(
        this,
        data,
        this.toggleAuthModal,
        this.stopReferallButtonLoading,
        this.handleRedirection
      );
    }
  };
  stopReferallButtonLoading = (isSignedUp) => {
    this.setState({
      isReferralCodeLoading: false,
    });
  };
  handleRedirection = () => {
    // console.log("this", this.props);
    const signUpMethod = whichSignUpMethod();
    HomeSignedUpReferralCode({
      session_id: getCurrentUser().id,
      email_address: this.state.emailSignup,
      referall_code: this.state.referralCode,
      signUpMethod: signUpMethod,
    });
    this.setState({
      authmodal: "redirect",
    });
  };
  handleSubmitEmail = () => {
    let data = new URLSearchParams();
    data.append(
      "email",
      this.state.email ? this.state.email.toLowerCase() : ""
    );

    const signUpMethod = whichSignUpMethod();
    SignInModalEmailAdded({
      session_id: getCurrentUser().id,
      email_address: this.state.email,
      signUpMethod: signUpMethod,
    });

    SendOtp(data, this, true);
  };
  showSignInOtpPage = () => {
    this.toggleAuthModal("verify");
  };
  handleSubmitOTP = () => {
    let data = new URLSearchParams();
    data.append(
      "email",
      this.state.email ? this.state.email.toLowerCase() : ""
    );
    data.append("otp_token", this.state.otp);
    data.append(
      "signed_up_from",
      this.props?.popupType === "general_popup"
        ? "generic pop up"
        : this.props.tracking
    );
    VerifyEmail(
      data,
      this,
      true,
      this.state.email ? this.state.email.toLowerCase() : ""
    );
  };
  openSignInModal = () => {
    this.setState({
      authmodal: "login",
    });
  };
  onVerifiedOtp = () => {
    this.setState({
      authmodal: "",
    });
  };
  goToPage = (e, item, index) => {
    let tempToken = getToken();
    if (index === 1) {
      const userWalletList = window.localStorage.getItem("addWallet")
        ? JSON.parse(window.localStorage.getItem("addWallet"))
        : [];
      e.preventDefault();
      if (!userWalletList || userWalletList.length === 0) {
        this.props.history.push(item.loggedOutPath);
      } else {
        this.props.history.push(item.path);
      }
    } else {
      if (!tempToken || tempToken === "jsk") {
        if (index === 2) {
          MenuLeaderboard({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
          });
          this.props.history.push(item.path);
        } else {
          e.preventDefault();
          if (item.loggedOutPath) {
            this.props.history.push(item.loggedOutPath);
          }
        }
        return null;
      }

      if (index === 0) {
        MenuCopyTradelist({
          session_id: getCurrentUser().id,
          email_address: getCurrentUser().email,
        });
      } else if (index === 1) {
        MenuWatchlist({
          session_id: getCurrentUser().id,
          email_address: getCurrentUser().email,
        });
      } else if (index === 2) {
        MenuLeaderboard({
          session_id: getCurrentUser().id,
          email_address: getCurrentUser().email,
        });
      } else if (index === 3) {
        HomeMenu({
          session_id: getCurrentUser().id,
          email_address: getCurrentUser().email,
        });
      } else if (index === 4) {
        ProfileMenu({
          session_id: getCurrentUser().id,
          email_address: getCurrentUser().email,
        });
      }

      this.props.history.push(item.path);
    }
  };
  render() {
    let activeTab = window.location.pathname;
    const getTotalAssetValue = () => {
      if (this.props.portfolioState) {
        const tempWallet = this.props.portfolioState.walletTotal
          ? this.props.portfolioState.walletTotal
          : 0;
        const tempCredit = this.props.defiState.totalYield
          ? this.props.defiState.totalYield
          : 0;
        const tempDebt = this.props.defiState.totalDebt
          ? this.props.defiState.totalDebt
          : 0;

        return tempWallet + tempCredit - tempDebt;
      }
      return 0;
    };
    return (
      <div className="portfolio-mobile-layout mobileSmartMoneyPage">
        <div
          onClick={this.openSignInModal}
          id="sidebar-closed-sign-in-btn-loch-points-profile"
        />
        <div onClick={this.openSignInModal} id="sidebar-closed-sign-in-btn" />

        {this.state.confirmLeave ? (
          <SmartMoneyMobileSignOutModal
            onSignOut={this.signOutFun}
            onHide={this.closeConfirmLeaveModal}
          />
        ) : null}
        {this.state.isLochPaymentModal ? (
          <PaywallModal
            show={this.state.isLochPaymentModal}
            onHide={this.hidePaymentModal}
            redirectLink={BASE_URL_S3 + "/"}
            title="Aggregate Wallets with Loch"
            description="Aggregate unlimited wallets"
            hideBackBtn
            isMobile
          />
        ) : null}
        {this.state.authmodal === "login" ? (
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
            show={this.state.authmodal === "login"}
          />
        ) : // </SmartMoneyMobileModalContainer>
        this.state.authmodal === "verify" ? (
          <VerifyMobile
            isMobile
            toggleModal={this.toggleAuthModal}
            show={this.state.authmodal === "verify"}
            handleSubmitEmail={this.handleSubmitEmail}
            otp={this.state.otp}
            handleChangeOTP={(val) => {
              this.setState({
                otp: val,
              });
            }}
            handleSubmitOTP={this.handleSubmitOTP}
            showOtpError={this.state.isOptInValid}
          />
        ) : this.state.authmodal === "signup" ? (
          <SignUpMobile
            isHome
            toggleModal={this.toggleAuthModal}
            isMobile
            email={this.state.emailSignup}
            show={this.state.authmodal === "signup"}
            handleChangeEmail={(val) => {
              this.setState({
                emailSignup: val,
              });
            }}
            handleChangeReferralCode={(val) => {
              this.setState({
                referralCode: val,
              });
            }}
            isReferralCodeStep={this.state.isReferralCodeStep}
            referralCode={this.state.referralCode}
            isReferralCodeLoading={this.state.isReferralCodeLoading}
            checkReferralCode={this.checkReferralCode}
            handleGoToReferral={this.handleGoToReferral}
            handleGoBackToSignUp={this.handleGoBackToSignUp}
          />
        ) : this.state.authmodal === "redirect" ? (
          <RedirectMobile
            toggleModal={this.toggleAuthModal}
            show={this.state.authmodal === "redirect"}
          />
        ) : null}
        {this.props.blurredElement ? (
          <div
            className="blurredElement blurredElementMobile"
            onClick={this.props.goBackToWelcomePage}
          >
            <div className="blurredElementTopShadow" />
          </div>
        ) : null}
        <div className="portfolio-mobile-layout-wrapper">
          {/* Search Bar */}
          <div
            className={`mpcMobileSearch ${
              this.props.showTopSearchBar ? "mpcMobileSearchVisible" : ""
            } input-noshadow-dark`}
          >
            <div className="mpcMobileSearchInput">
              <Image
                style={{
                  opacity: this.state.showSearchIcon ? 1 : 0,
                }}
                onLoad={this.searchIconLoaded}
                className="mpcMobileSearchImage"
                src={SearchIcon}
              />
              {this.state.walletInput?.map((c, index) => (
                <div className="topSearchBarMobileContainer">
                  <NewHomeInputBlock
                    isAddNewAddressLoggedIn={this.props.isAddNewAddressLoggedIn}
                    onGoBtnClick={this.handleAddWallet}
                    hideMore
                    isMobile
                    c={c}
                    index={index}
                    walletInput={this.state.walletInput}
                    handleOnChange={this.handleOnChange}
                    onKeyDown={this.onKeyPressInput}
                    goBtnDisabled={this.state.disableAddBtn}
                    removeFocusOnEnter
                    isAddNewAddress={this.props.isAddNewAddress}
                    goToPageAfterLogin={this.props.goToPageAfterLogin}
                    welcomeAddBtnLoading={this.state.welcomeAddBtnLoading}
                    noAutofocus={this.props.blurredElement ? false : true}
                  />
                </div>
              ))}
            </div>
            {/* {!(this.state.walletInput && this.state.walletInput[0].address) &&
            !this.props.hideAddresses &&
            !this.props.hideShare ? (
              <div className="mpcMobileShare" onClick={this.handleShare}>
                <Image
                  style={{
                    opacity: this.state.showShareIcon ? 1 : 0,
                  }}
                  onLoad={this.shareIconLoaded}
                  className="mpcMobileSearchImage"
                  src={SharePortfolioIconWhite}
                />
              </div>
            ) : null} */}
          </div>

          {/* Children Holder */}
          <div
            id="portfolio-mobile-layout-children-id"
            className={`portfolio-mobile-layout-children ${
              this.props.showTopSearchBar
                ? "portfolio-mobile-layout-children-visible"
                : ""
            }`}
          >
            <div style={{ paddingBottom: "64px" }}>
              <div className="mobilePortfolioContainer">
                <div className="mpcHomeContainer">
                  <div id="mobileLayoutScrollContainer" className="mpcHomePage">
                    <Breadcrums
                      showpath={this.props.showpath}
                      currentPage={this.props.currentPage}
                      noHomeInPath={this.props.noHomeInPath}
                      isMobile
                    />
                    <MobileDarkModeWrapper hideBtn={this.props.hideAddresses}>
                      {this.props.hideAddresses ? null : (
                        <WelcomeCard
                          isAddNewAddressLoggedIn={
                            this.props.isAddNewAddressLoggedIn
                          }
                          openConnectWallet={this.props.openConnectWallet}
                          connectedWalletAddress={
                            this.props.connectedWalletAddress
                          }
                          disconnectWallet={this.props.disconnectWallet}
                          handleShare={this.handleShare} //Done
                          isSidebarClosed={this.props.isSidebarClosed} // done
                          changeWalletList={this.props.handleChangeList} // done
                          apiResponse={(e) =>
                            this.CheckApiResponseMobileLayout(e)
                          } // done
                          showNetworth={true}
                          // yesterday balance
                          yesterdayBalance={
                            this.props?.portfolioState?.yesterdayBalance // done
                          }
                          assetTotal={getTotalAssetValue()} // done
                          history={this.props.history} // done
                          handleAddModal={this.props.handleAddModal} // done
                          isLoading={false}
                          handleManage={() => {}}
                          isMobileRender
                          isAddNewAddress={this.props.isAddNewAddress}
                          goToPageAfterLogin={this.props.goToPageAfterLogin}
                        />
                      )}
                    </MobileDarkModeWrapper>
                    {!this.props.hideShare ? (
                      <TopWalletAddressList
                        history={this.props.history}
                        apiResponse={() => null}
                        handleShare={this.props.handleShare}
                        showpath={false}
                        currentPage={this.props.currentPage}
                        noHomeInPath={false}
                        isMobile
                        showUpdatesJustNowBtn={this.props.showUpdatesJustNowBtn}
                        hideShare={false}
                        hideAddresses={this.props.hideAddresses}
                      />
                    ) : null}
                    {/* <TopWalletAddressList
                      apiResponse={(e) => this.CheckApiResponseMobileLayout(e)}
                      handleShare={this.handleShare}
                      // passedFollowSigninModal={this.state.followSigninModal}
                      showUpdatesJustNowBtn
                      // getCurrentTimeUpdater={this.state.getCurrentTimeUpdater}
                      isMobile
                    /> */}

                    {/* Children */}
                    {this.props.children}

                    {this.props.hideFooter ? null : (
                      <div className="mobileFooterContainer">
                        <div>
                          <Footer isMobile />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Panel */}
          <div className="portfolio-mobile-layout-nav-footer">
            <div className="portfolio-mobile-layout-nav-footer-inner">
              {this.state.navItems.map((item, index) => {
                if (item.text === "Sign Out" && !this.state.lochUserLocal) {
                  return null;
                }
                return (
                  <div
                    key={index}
                    onClick={(e) => {
                      this.goToPage(e, item, index);
                    }}
                    className={`portfolio-mobile-layout-nav-footer-inner-item ${
                      item.path === this.state.activeTab ||
                      item.loggedOutPath === this.state.activeTab
                        ? "portfolio-mobile-layout-nav-footer-inner-item-active"
                        : ""
                    }`}
                  >
                    <Image
                      className={`portfolio-mobile-layout-nav-footer-inner-item-image ${
                        item.path === this.state.activeTab ||
                        item.loggedOutPath === this.state.activeTab
                          ? "portfolio-mobile-layout-nav-footer-inner-item-image-active"
                          : ""
                      }`}
                      style={{
                        filter:
                          item.path === this.state.activeTab ||
                          item.loggedOutPath === this.state.activeTab
                            ? "brightness(0) var(--invertColor)"
                            : "brightness(1) var(--invertColor)",
                      }}
                      src={item.pageIcon}
                    />
                    <span className="portfolio-mobile-layout-nav-footer-inner-item-text">
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  OnboardingState: state.OnboardingState,
  portfolioState: state.portfolioState,
  commonState: state.CommonState,
});

const mapDispatchToProps = {
  detectCoin,
  setHeaderReducer,
  addUserCredits,
  updateUserWalletApi,
  setPageFlagDefault,
  getAllWalletListApi,
  updateWalletListFlag,
  isNewAddress,
  checkReferallCodeValid,
  updateUser,
  createAnonymousUserApi,
  getAllParentChains,
  signUpWelcome,
};

MobileLayout.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(MobileLayout);
