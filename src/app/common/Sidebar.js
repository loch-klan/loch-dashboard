import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Dropdown,
  DropdownButton,
  Image,
} from "react-bootstrap";
import { NavLink } from "react-router-dom";
// import logo from '../../image/logo.png'
import { connect, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  ActiveSmartMoneySidebarIcon,
  EmultionSidebarIcon,
  FollowingSidebarIcon,
  WalletViewerSidebarIcon,
  InactiveSmartMoneySidebarIcon,
  LeaderboardSidebarIcon,
  LochLogoWhiteIcon,
  PersonRoundedSigninIcon,
  ProfileSidebarIcon,
  ShareCopyTraderImage,
  SidebarLeftArrowIcon,
  XFormallyTwitterLogoIcon,
  darkModeIcon,
  lightModeIcon,
  CopyTradeSwapSidebarIcon,
  XFormallyTwitterLogoLightIcon,
} from "../../assets/images/icons";
import { default as SignInIcon } from "../../assets/images/icons/ActiveProfileIcon.svg";
import ApiModalIcon from "../../assets/images/icons/ApiModalIcon.svg";
import ExportIconWhite from "../../assets/images/icons/ExportBlackIcon.svg";
import LeaveBlackIcon from "../../assets/images/icons/LeaveBlackIcon.svg";
import LeaveIcon from "../../assets/images/icons/LeaveIcon.svg";
import SharePortfolioIcon from "../../assets/images/icons/SharePortfolioIcon.svg";
import LinkIcon from "../../assets/images/icons/link.svg";
import NFTIcon from "../../assets/images/icons/sidebar-nft.svg";
import logo from "../../image/Loch.svg";
import {
  MenuCopyTradelist,
  ExportMenu,
  FeedbackMenu,
  FeedbackSidebar,
  FeedbackSubmitted,
  GeneralPopup,
  HomeMenu,
  MenuApi,
  MenuCurrencyDropdown,
  MenuCurrencyDropdownSelected,
  MenuLeave,
  MenuShare,
  MenuWatchlist,
  ProfileMenu,
  SigninMenu,
  SignupMenu,
  ToggleDarkModeAnalytics,
  resetUser,
  MenuLeaderboard,
} from "../../utils/AnalyticsFunctions.js";
import {
  getCurrentUser,
  getToken,
  resetPreviewAddress,
} from "../../utils/ManageToken";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay.js";
import { addUserCredits } from "../profile/Api.js";
import feedbackIcon from "./../../assets/images/icons/feedbackIcons.svg";
import {
  SwitchDarkMode,
  getAllCurrencyApi,
  getAllCurrencyRatesApi,
  sendUserFeedbackApi,
  updateWalletListFlag,
} from "./Api";
import AuthModal from "./AuthModal";
import ConfirmLeaveModal from "./ConformLeaveModal";
import FeedbackModal from "./FeedbackModal";
import SharePortfolio from "./SharePortfolio";
import UserFeedbackModal from "./UserFeedbackModal.js";
import UpgradeModal from "./upgradeModal";

import { toast } from "react-toastify";
import { BASE_URL_S3 } from "../../utils/Constant.js";
import {
  CurrencyType,
  amountFormat,
  hasUserAddedAddressesFun,
  isPremiumUser,
  numToCurrency,
  removeSignUpMethods,
  switchToDarkMode,
  switchToLightMode,
} from "../../utils/ReusableFunctions.js";
import ConnectModal from "./ConnectModal.js";
import ExitOverlay from "./ExitOverlay";

function Sidebar(props) {
  // console.log('props',props);
  let activeTab = window.location.pathname;

  if (window.location.hash) {
    activeTab = activeTab + window.location.hash;
  }

  // console.log("active", activeTab);
  const history = useHistory();
  const [lochUserState, setLochUserState] = useState(
    window.localStorage.getItem("lochToken")
  );
  const [showAmountsAtTop, setShowAmountsAtTop] = useState(false);
  const [dragPosition, setDragPosition] = React.useState({
    x: 0,
    y: -(window.innerHeight / 2 - 90),
  });
  const [isCurPremiumUser, setIsCurPremiumUser] = useState(isPremiumUser());
  const [leave, setLeave] = React.useState(false);
  const [apiModal, setApiModal] = React.useState(false);
  const [exportModal, setExportModal] = React.useState(false);
  const [shareModal, setShareModal] = React.useState(false);
  const [isCopyTraderPopUpModal, setIsCopyTraderPopUpModal] =
    React.useState(false);
  const [isLochPointsProfilePopUpModal, setIsLochPointsProfilePopUpModal] =
    React.useState(false);
  const [isAutoPopUpModal, setIsAutoPopUpModal] = React.useState(false);
  const [signinModal, setSigninModal] = React.useState(false);
  const [signupModal, setSignupModal] = React.useState(false);
  const [confirmLeave, setConfirmLeave] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [currencyList, setAllCurrencyList] = React.useState([]);
  const [showFeedbackModal, setFeedbackModal] = React.useState(false);
  const [signInModalAnimation, setSignInModalAnimation] = useState(true);
  const [signUpModalAnimation, setSignUpModalAnimation] = useState(true);
  const [userFeedbackModal, setUserFeedbackModal] = useState(false);
  const [comingDirectly, setComingDirectly] = useState(true);
  const [selectedCurrency, setCurrency] = React.useState(
    JSON.parse(window.localStorage.getItem("currency"))
  );
  const [haveUserAddedAddress, setHaveUserAddedAddress] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setIsCurPremiumUser(isPremiumUser());
    }, 1000);
  }, []);
  useEffect(() => {
    if (hasUserAddedAddressesFun()) {
      setHaveUserAddedAddress(true);
    } else {
      setHaveUserAddedAddress(false);
    }
  }, []);

  useEffect(() => {
    setIsCurPremiumUser(isPremiumUser());
    setLochUserState(window.localStorage.getItem("lochToken"));
  }, [props.userPaymentState]);

  let lochUser = JSON.parse(window.localStorage.getItem("lochUser"));
  if (lochUser) {
    // if loch user remove share id to prevent opening upgrade modal
    window.localStorage.removeItem("share_id");
  }
  const [Upgrade, setUpgradeModal] = React.useState(false);
  const [connectModal, setconnectModal] = React.useState(false);
  const [isWallet, setWallet] = React.useState(
    JSON.parse(window.localStorage.getItem("addWallet")) ? true : false
  );
  const [signinPopup, setSigninPopup] = React.useState(false);
  let triggerId = 6;

  // submenu

  const [isSubmenu, setSubmenu] = React.useState(
    window.localStorage.getItem("isSubmenu")
      ? JSON.parse(window.localStorage.getItem("isSubmenu"))
      : {
          me: true,
          discover: false,
          intelligence: false,
          defi: true,
          topAccount: false,
          topAccountintelligence: false,
        }
  );

  // preview address
  const [previewAddress, setPreviewAddress] = React.useState(
    JSON.parse(window.localStorage.getItem("previewAddress"))
  );

  // Dark mode
  const [isDarkMode, setIsDarkMode] = useState(
    document.querySelector("body").getAttribute("data-theme") == "dark"
      ? true
      : false
  );

  useEffect(() => {
    setIsDarkMode(
      document.querySelector("body").getAttribute("data-theme") == "dark"
        ? true
        : false
    );
    let isDarkTheme = localStorage.getItem("isDarkTheme");
    if (isDarkTheme && isDarkTheme === "true") {
      document.documentElement.style.backgroundColor = "#141414";
    } else {
      document.documentElement.style.backgroundColor = "#f2f2f2";
    }
  }, [document.querySelector("body").getAttribute("data-theme") == "dark"]);
  React.useEffect(() => {
    // console.log("in use effect");

    // update previewaddress from localstorage
    setPreviewAddress(
      JSON.parse(window.localStorage.getItem("previewAddress"))
    );

    // Me section
    if (
      [
        "/home",
        "/profile",
        // "/decentralized-finance",
        // "/yield-opportunities",
      ].includes(activeTab)
    ) {
      let obj = {
        me: true,
        discover: false,
        intelligence: false,
        defi: false,
        topAccount: false,
        topAccountintelligence: false,
      };
      setSubmenu(obj);

      window.localStorage.setItem("isSubmenu", JSON.stringify(obj));
      resetPreviewAddress();
      setPreviewAddress(
        JSON.parse(window.localStorage.getItem("previewAddress"))
      );
    }
    // Me section with intelligence
    else if (
      ["/decentralized-finance", "/yield-opportunities"].includes(activeTab)
    ) {
      let obj = {
        me: true,
        discover: false,
        intelligence: false,
        defi: true,
        topAccount: false,
        topAccountintelligence: false,
      };
      setSubmenu(obj);

      window.localStorage.setItem("isSubmenu", JSON.stringify(obj));
    } else if (
      [
        "/intelligence",
        "/intelligence#netflow",
        "/intelligence#price",
        "/intelligence/transaction-history",
        "/intelligence/asset-value",
        "/intelligence/insights",
        "/intelligence/costs",
      ].includes(activeTab)
    ) {
      let obj = {
        me: true,
        discover: false,
        intelligence: true,
        defi: false,
        topAccount: false,
        topAccountintelligence: false,
      };
      setSubmenu(obj);

      window.localStorage.setItem("isSubmenu", JSON.stringify(obj));
    }
    // Discover section
    else if (
      ["/whale-watch", "/watchlist"].includes(activeTab) ||
      activeTab.includes("/whale-watch")
    ) {
      let obj = {
        me: true,
        discover: false,
        intelligence: false,
        defi: false,
        topAccount: false,
        topAccountintelligence: false,
      };
      setSubmenu(obj);

      window.localStorage.setItem("isSubmenu", JSON.stringify(obj));
    } else if (
      [
        "/top-accounts",
        "/top-accounts/home",
        "/top-accounts/decentralized-finance",
      ].includes(activeTab)
    ) {
      let obj = {
        me: true,
        discover: false,
        intelligence: false,
        defi: false,
        topAccount: previewAddress?.address ? true : false,
        topAccountintelligence: false,
      };
      setSubmenu(obj);

      window.localStorage.setItem("isSubmenu", JSON.stringify(obj));
    } else if (
      [
        "/top-accounts/intelligence/transaction-history",
        "/top-accounts/intelligence#netflow",
        "/top-accounts/intelligence#price",
        "/top-accounts/intelligence",
        "/top-accounts/intelligence/volume-traded-by-counterparty",
        "/top-accounts/intelligence/insights",
        "/top-accounts/intelligence/costs",
        "/top-accounts/intelligence/asset-value",
      ].includes(activeTab)
    ) {
      let obj = {
        me: true,
        discover: false,
        intelligence: false,
        defi: false,
        topAccount: previewAddress?.address ? true : false,
        topAccountintelligence: true,
      };
      setSubmenu(obj);

      window.localStorage.setItem("isSubmenu", JSON.stringify(obj));
    } else {
      let obj = {
        me: true,
        discover: false,
        intelligence: false,
        defi: false,
        topAccount: false,
        topAccountintelligence: true,
      };
      setSubmenu(obj);

      window.localStorage.setItem("isSubmenu", JSON.stringify(obj));
    }
  }, []);

  React.useEffect(() => {
    getWalletFunction();
    // Add here
    if (window.location.pathname === "/home") {
      setShowAmountsAtTop(true);
    } else {
      setShowAmountsAtTop(false);
    }
  }, []);

  const getWalletFunction = () => {
    let status = JSON.parse(window.localStorage.getItem("addWallet"));
    if (status) {
      setWallet(true);
      // console.log("wallet", isWallet);
    } else {
      setTimeout(() => {
        getWalletFunction();
      }, 2000);
    }
  };

  const handleLeaveChild = (e) => {
    e.stopPropagation();
    handleLeave();
  };
  const handleLeave = () => {
    MenuLeave({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    setConfirmLeave(!confirmLeave);
  };
  const handleGoToProfile = (e) => {
    let tempToken = getToken();
    if (!tempToken || tempToken === "jsk") {
      e.preventDefault();
      props.history.push("/profile-add-address");
      return null;
    } else {
      ProfileMenu({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
      props.history.push("/profile");
    }
  };
  const handleApiModal = () => {
    setApiModal(!apiModal);
    MenuApi({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
  };
  const handleConfirmLeaveModal = () => {
    setConfirmLeave(!confirmLeave);
  };
  const handleExportModal = () => {
    setExportModal(!exportModal);
    ExportMenu({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
  };
  const handleFeedback = () => {
    setFeedbackModal(!showFeedbackModal);
    // console.log("clicked modal")
    FeedbackMenu({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
  };
  const handleShareModal = () => {
    setShareModal(!shareModal);
    // ExportMenu({ session_id: getCurrentUser().id, email_address: getCurrentUser().email });
    MenuShare({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
  };
  useSelector((state) => state.LochUserState);

  const openSignupModalDirect = () => {
    setComingDirectly(true);
    setSignUpModalAnimation(true);
    setSignInModalAnimation(false);
    setSignupModal(true);
    setSigninModal(false);
    setSigninPopup(false);
  };
  const openLochTwitter = () => {
    window.open("https://twitter.com/loch_chain", "_blank", "noreferrer");
  };
  useEffect(() => {
    if (!signupModal && !signinModal) {
      removeSignUpMethods();
    }
  }, [signupModal, signinModal]);
  const openSigninModal = (fromWhichPage) => {
    if (fromWhichPage === "copyTrade") {
      setIsCopyTraderPopUpModal(true);
    }
    if (fromWhichPage === "lochPointsProfile") {
      setIsLochPointsProfilePopUpModal(true);
    }

    // let tempToken = getToken();
    // if (!tempToken || tempToken === "jsk") {
    //   return null;
    // }
    setComingDirectly(false);
    setSignUpModalAnimation(false);
    setSignupModal(false);
    setSigninModal(true);

    SigninMenu({
      session_id: getCurrentUser().id,
    });
  };
  const onCloseModal = () => {
    setIsCopyTraderPopUpModal(false);
    setIsLochPointsProfilePopUpModal(false);
    setIsAutoPopUpModal(false);
    setComingDirectly(true);
    setSignUpModalAnimation(true);
    setSignInModalAnimation(true);
    setSigninModal(false);
    setSignupModal(false);
    const isLochPointsTabOpen = window.localStorage.getItem(
      "lochPointsProfileLoginClicked"
    );
    if (isLochPointsTabOpen) {
      window.localStorage.removeItem("lochPointsProfileLoginClicked");
    }
  };

  const openSignUpModal = () => {
    setComingDirectly(false);
    setSignUpModalAnimation(false);
    setSignInModalAnimation(false);
    setSigninModal(false);
    setSignupModal(true);
    SignupMenu({
      session_id: getCurrentUser().id,
    });
  };
  const handleSiginPopup = () => {
    setIsAutoPopUpModal(true);
    setSigninModal(!signinModal);
  };
  const handleUserFeedbackModal = () => {
    let tempToken = getToken();
    if (!tempToken || tempToken === "jsk") {
      return null;
    }
    FeedbackSidebar({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    setUserFeedbackModal(!userFeedbackModal);
  };
  const hideUserFeedbackModal = (passedAddress) => {
    setUserFeedbackModal(false);
    if (passedAddress && passedAddress.length > 0 && passedAddress[0].value) {
      let tempAnsHolder = [];
      passedAddress.forEach((res) => {
        if (res.value) {
          tempAnsHolder.push(res.value);
        } else {
          tempAnsHolder.push("");
        }
      });
      const passFedbackData = new URLSearchParams();
      passFedbackData.append("feedback", JSON.stringify(tempAnsHolder));
      FeedbackSubmitted({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
      props.sendUserFeedbackApi(passFedbackData, addFeedbackPoints);
    }
  };
  const addFeedbackPoints = () => {
    const exchangeCreditScore = new URLSearchParams();
    exchangeCreditScore.append("credits", "feedbacks_added");
    props.addUserCredits(exchangeCreditScore, null, resetCreditPoints);
  };
  const resetCreditPoints = () => {
    props.updateWalletListFlag("creditPointsBlock", false);
  };
  const handleShare = () => {
    const user = JSON.parse(window.localStorage.getItem("lochUser"));
    let userWallet = JSON.parse(window.localStorage.getItem("addWallet"));
    let slink =
      userWallet?.length === 1
        ? userWallet[0].displayAddress || userWallet[0].address
        : getCurrentUser().id;
    const link = `${BASE_URL_S3}home/${slink}`;
    navigator.clipboard.writeText(link);
    toast.success("Share link has been copied");
  };

  const handleDarkMode = () => {
    const darkOrLight = document
      .querySelector("body")
      .getAttribute("data-theme");
    if (darkOrLight === "dark") {
      setIsDarkMode(false);
      switchToLightMode();
      props.SwitchDarkMode(false);
      ToggleDarkModeAnalytics({
        toggle_button_location: "Main",
        mode_from: "Dark",
        mode_to: "Light",
        isMobile: false,
      });
    } else {
      switchToDarkMode();
      setIsDarkMode(true);
      props.SwitchDarkMode(true);
      ToggleDarkModeAnalytics({
        toggle_button_location: "Main",
        mode_from: "Light",
        mode_to: "Dark",
        isMobile: false,
      });
    }
  };
  React.useEffect(() => {
    let currency = JSON.parse(window.localStorage.getItem("currency"));

    if (!currency) {
      window.localStorage.setItem(
        "currency",
        JSON.stringify({
          active: true,
          code: "USD",
          id: "6399a2d35a10114b677299fe",
          name: "United States Dollar",
          symbol: "$",
          rate: 1,
        })
      );

      setCurrency(JSON.parse(window.localStorage.getItem("currency")));
    }

    setTimeout(() => {
      //  console.log("curr", currency);
      let currencyRates = JSON.parse(
        window.localStorage.getItem("currencyRates")
      );
      // console.log("currency", currencyRates);
      getAllCurrencyApi(setAllCurrencyList);
      !currencyRates && getAllCurrencyRatesApi();
    }, 1000);
  }, []); // <-- Have to pass in [] here!

  // Timer for Sigin popup
  React.useEffect(() => {
    SiginModal();
  }, []);

  // function to call popup timer
  const SiginModal = () => {
    let isPopup = JSON.parse(window.localStorage.getItem("isPopup"));

    setTimeout(() => {
      const isCopyTradeModalOpen =
        window.localStorage.getItem("copyTradeModalOpen");
      const lochPointsProfileModalOpen = window.localStorage.getItem(
        "lochPointsProfileLoginClicked"
      );
      const dontOpenLoginPopup =
        window.localStorage.getItem("dontOpenLoginPopup");
      if (
        !isCopyTradeModalOpen &&
        !lochPointsProfileModalOpen &&
        !dontOpenLoginPopup
      ) {
        window.localStorage.setItem("fifteenSecSignInModal", true);
        // if isPopupActive = true then do not open this popup bcoz any other popup still open
        let isPopupActive = JSON.parse(
          window.localStorage.getItem("isPopupActive")
        );
        lochUser = JSON.parse(window.localStorage.getItem("lochUser"));
        if (!isPopupActive) {
          // console.log("inactive popup", isPopupActive);
          if (!lochUser) {
            // GeneralPopup({
            //   session_id: getCurrentUser().id,
            //   from: history.location.pathname.substring(1),
            // });
            // isPopup && handleSiginPopup();
            // window.localStorage.setItem("isPopup", false);
            if (isPopup) {
              handleSiginPopup();
              window.localStorage.setItem("isPopup", false);
              GeneralPopup({
                session_id: getCurrentUser().id,
                from: history.location.pathname.substring(1),
              });
            }
          }
        } else {
          //  if popup active then run same function
          // console.log("active popup");
          SiginModal();
        }
      }
    }, 15000);
  };

  const handleFunction = (currency) => {
    let currencyRates = JSON.parse(
      window.localStorage.getItem("currencyRates")
    );
    for (const [key, value] of Object.entries(currencyRates.rates)) {
      // console.log(`${key}: ${value}`);
      if (key === currency.code) {
        currency = {
          ...currency,
          rate: value,
        };
      }
    }
    MenuCurrencyDropdownSelected({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      prev_currency: selectedCurrency.symbol + " " + selectedCurrency.code,
      currency: currency.symbol + " " + currency.code,
    });
    setTimeout(() => {
      setCurrency(currency);
      window.localStorage.setItem("currency", JSON.stringify(currency));
      window.location.reload();
    }, 200);
  };
  const quotes = [
    "Sic Parvis Magna | Thus, great things from small things come.",
    "The discipline of desire is the background of character.",
    "No man's knowledge here can go beyond his experience.",
    "The only fence against the world is a thorough knowledge of it.",
    "I have always thought the actions of men the best interpreters of their thoughts",
    "Wherever Law ends, Tyranny begins.",
  ];
  const authors = [
    "Sir Francis Drake",
    "John Locke",
    "John Locke",
    "John Locke",
    "John Locke",
    "John Locke",
  ];
  React.useEffect(() => {
    if (currentIndex === quotes.length - 1) {
      // console.log("loop complete");
      setCurrentIndex(0);
      return;
    }
    const interval = setInterval(() => {
      const updatedIndex = currentIndex + 1;
      setCurrentIndex(updatedIndex);
    }, 15000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const upgradeModal = () => {
    setUpgradeModal(!Upgrade);
  };

  const handleConnectModal = () => {
    setconnectModal(!connectModal);
  };

  // if user are in these pages means user in ME tab

  const trackPos = (data) => {
    if (data) {
      setDragPosition({ x: data.x, y: data.y });

      // window.localStorage.setItem(
      //   "floatingModalPosition",
      //   JSON.stringify({ x: data.x, y: data.y })
      // );
    }
  };
  // useEffect(() => {
  //   let floatingModalPosition = window.localStorage.getItem(
  //     "floatingModalPosition"
  //   );
  //   if (floatingModalPosition) {
  //     setDragPosition(JSON.parse(floatingModalPosition));
  //   }
  // }, []);
  const getTotalAssetValue = () => {
    if (props.portfolioState) {
      const tempWallet = props.portfolioState.walletTotal
        ? props.portfolioState.walletTotal
        : 0;
      const tempCredit = props.defiState.totalYield
        ? props.defiState.totalYield
        : 0;
      const tempDebt = props.defiState.totalDebt
        ? props.defiState.totalDebt
        : 0;

      let tempAns = tempWallet + tempCredit - tempDebt;
      if (tempAns) {
        tempAns = tempAns.toFixed(2);
      } else {
        tempAns = 0;
      }
      return tempAns;
    }
    return 0;
  };
  return (
    <>
      <div
        style={
          {
            // position: "relative",
          }
        }
        className={`sidebar-section hide-scrollbar ${
          props.isSidebarClosed ? "sidebar-section-closed" : ""
        }`}
      >
        {/* {isDarkMode ? (
          <span
            onClick={handleDarkMode}
            style={{
              zIndex: "9",
              right: "10px",
            }}
            className="navbar-button-container-mode"
          >
            <Image src={lightModeIcon} />
           
          </span>
        ) : (
          <span
            onClick={handleDarkMode}
            style={{
              zIndex: "9",
              right: "10px",
            }}
            className="navbar-button-container-mode"
          >
            <Image src={darkModeIcon} />
            <span />
           
          </span>
        )} */}
        {/* {isDarkMode == "dark2" ? (
          <span
            onClick={() => handleDarkMode("light")}
            style={{
              zIndex: "9",
              right: "-25px",
            }}
            className="navbar-button-container-mode"
          >
            <Image src={lightModeIcon} />
          </span>
        ) : (
          <span
            onClick={() => handleDarkMode("dark2")}
            style={{
              zIndex: "9",
              right: "-25px",
              color: "var(--primaryTextColor)",
            }}
            className="navbar-button-container-mode"
          >
            <Image src={darkModeIcon} /> 1
            <span />
            
          </span>
        )} */}
        {/* <Container className={`${activeTab === "/home" ? "no-padding" : ""}`}> */}
        <Container className={"no-padding"}>
          <div className="sidebar">
            <div
              // className={`logo ${activeTab === "/home" ? "home-topbar" : ""}`}
              className={`logo home-topbar`}
              style={{
                marginBottom: "0",
                width: "100%",
              }}
            >
              <div
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  let tempToken = getToken();
                  if (!tempToken || tempToken === "jsk") {
                    return null;
                  }
                  if (!isWallet) {
                    e.preventDefault();
                  } else {
                    HomeMenu({
                      session_id: getCurrentUser().id,
                      email_address: getCurrentUser().email,
                    });
                  }
                  props.history.push("/home");
                }}
              >
                <Image src={logo} />
                <span className="loch-text">Loch</span>
              </div>
              {/* <div className="currency-wrapper">
                <DropdownButton
                  id="currency-dropdown"
                  title={
                    selectedCurrency &&
                    selectedCurrency.symbol + " " + selectedCurrency.code
                  }
                  onClick={() => {
                    MenuCurrencyDropdown({
                      session_id: getCurrentUser().id,
                      email_address: getCurrentUser().email,
                      currency:
                        selectedCurrency.symbol + " " + selectedCurrency.code,
                    });
                  }}
                >
                  {currencyList?.map((currency, key) => {
                    return (
                      <Dropdown.Item
                        key={key}
                        onClick={() => handleFunction(currency)}
                      >
                        {" "}
                        <span>{currency.symbol}</span>{" "}
                        <span>{currency.code}</span>
                      </Dropdown.Item>
                    );
                  })}
                </DropdownButton>
              </div> */}
            </div>

            <div
              className={`${
                props.ownerName ? "sidebar-body" : "sidebar-body nowallet"
              } ${props.isSidebarClosed ? "sidebar-body-closed" : ""}`}
            >
              {props.isSidebarClosed ? (
                <div className="scroll-menu-wrapper-closed-container">
                  <div className="scroll-menu-wrapper-closed">
                    <nav>
                      <ul>
                        {haveUserAddedAddress ? (
                          <>
                            <li>
                              <CustomOverlay
                                className="tool-tip-container-right-arrow"
                                position="right"
                                isIcon={false}
                                isInfo={true}
                                isText={true}
                                text={"Wallet Viewer"}
                              >
                                <NavLink
                                  exact={true}
                                  className="nav-link nav-link-closed"
                                  to={
                                    !lochUserState || lochUserState === "jsk"
                                      ? "/wallet-viewer-add-address"
                                      : activeTab === "/home"
                                      ? "#"
                                      : "/home"
                                  }
                                  onClick={(e) => {
                                    let tempToken = getToken();
                                    const userWalletList =
                                      window.localStorage.getItem("addWallet")
                                        ? JSON.parse(
                                            window.localStorage.getItem(
                                              "addWallet"
                                            )
                                          )
                                        : [];

                                    if (
                                      !tempToken ||
                                      tempToken === "jsk" ||
                                      !userWalletList ||
                                      userWalletList.length === 0
                                    ) {
                                      e.preventDefault();

                                      props.history.push(
                                        "/wallet-viewer-add-address"
                                      );

                                      return null;
                                    } else {
                                      HomeMenu({
                                        session_id: getCurrentUser().id,
                                        email_address: getCurrentUser().email,
                                      });
                                    }
                                  }}
                                  activeclassname="active"
                                >
                                  <Image
                                    src={WalletViewerSidebarIcon}
                                    style={
                                      activeTab === "/home" ||
                                      activeTab === "/wallet-viewer-add-address"
                                        ? {
                                            filter: "var(--sidebarActiveIcon)",
                                          }
                                        : {}
                                    }
                                  />
                                </NavLink>
                              </CustomOverlay>
                            </li>
                            <li>
                              <CustomOverlay
                                className="tool-tip-container-right-arrow"
                                position="right"
                                isIcon={false}
                                isInfo={true}
                                isText={true}
                                text={"Copy Trade"}
                              >
                                <NavLink
                                  className={`nav-link nav-link-closed`}
                                  to={
                                    !lochUserState || lochUserState === "jsk"
                                      ? "/copy-trade-welcome"
                                      : "/copy-trade"
                                  }
                                  onClick={(e) => {
                                    let tempToken = getToken();
                                    if (!tempToken || tempToken === "jsk") {
                                      e.preventDefault();

                                      props.history.push("/copy-trade-welcome");

                                      return null;
                                    }

                                    MenuCopyTradelist({
                                      session_id: getCurrentUser().id,
                                      email_address: getCurrentUser().email,
                                    });
                                  }}
                                  activeclassname="active"
                                >
                                  <Image
                                    src={EmultionSidebarIcon}
                                    style={
                                      activeTab === "/copy-trade" ||
                                      activeTab === "/copy-trade-welcome"
                                        ? {
                                            filter: "brightness(0)",
                                          }
                                        : {}
                                    }
                                    className="followingImg"
                                  />
                                </NavLink>
                              </CustomOverlay>
                            </li>
                          </>
                        ) : (
                          <>
                            <li>
                              <CustomOverlay
                                className="tool-tip-container-right-arrow"
                                position="right"
                                isIcon={false}
                                isInfo={true}
                                isText={true}
                                text={"Copy Trade"}
                              >
                                <NavLink
                                  className={`nav-link nav-link-closed`}
                                  to={
                                    !lochUserState || lochUserState === "jsk"
                                      ? "/copy-trade-welcome"
                                      : "/copy-trade"
                                  }
                                  onClick={(e) => {
                                    let tempToken = getToken();
                                    if (!tempToken || tempToken === "jsk") {
                                      e.preventDefault();

                                      props.history.push("/copy-trade-welcome");

                                      return null;
                                    }

                                    MenuCopyTradelist({
                                      session_id: getCurrentUser().id,
                                      email_address: getCurrentUser().email,
                                    });
                                  }}
                                  activeclassname="active"
                                >
                                  <Image
                                    src={EmultionSidebarIcon}
                                    style={
                                      activeTab === "/copy-trade" ||
                                      activeTab === "/copy-trade-welcome"
                                        ? {
                                            filter: "brightness(0)",
                                          }
                                        : {}
                                    }
                                    className="followingImg"
                                  />
                                </NavLink>
                              </CustomOverlay>
                            </li>
                            <li>
                              <CustomOverlay
                                className="tool-tip-container-right-arrow"
                                position="right"
                                isIcon={false}
                                isInfo={true}
                                isText={true}
                                text={"Wallet Viewer"}
                              >
                                <NavLink
                                  exact={true}
                                  className="nav-link nav-link-closed"
                                  to={
                                    !lochUserState || lochUserState === "jsk"
                                      ? "/wallet-viewer-add-address"
                                      : activeTab === "/home"
                                      ? "#"
                                      : "/home"
                                  }
                                  onClick={(e) => {
                                    let tempToken = getToken();
                                    const userWalletList =
                                      window.localStorage.getItem("addWallet")
                                        ? JSON.parse(
                                            window.localStorage.getItem(
                                              "addWallet"
                                            )
                                          )
                                        : [];

                                    if (
                                      !tempToken ||
                                      tempToken === "jsk" ||
                                      !userWalletList ||
                                      userWalletList.length === 0
                                    ) {
                                      e.preventDefault();

                                      props.history.push(
                                        "/wallet-viewer-add-address"
                                      );

                                      return null;
                                    } else {
                                      HomeMenu({
                                        session_id: getCurrentUser().id,
                                        email_address: getCurrentUser().email,
                                      });
                                    }
                                  }}
                                  activeclassname="active"
                                >
                                  <Image
                                    src={WalletViewerSidebarIcon}
                                    style={
                                      activeTab === "/home" ||
                                      activeTab === "/wallet-viewer-add-address"
                                        ? {
                                            filter: "var(--sidebarActiveIcon)",
                                          }
                                        : {}
                                    }
                                  />
                                </NavLink>
                              </CustomOverlay>
                            </li>
                          </>
                        )}
                        <li>
                          <CustomOverlay
                            className="tool-tip-container-right-arrow"
                            position="right"
                            isIcon={false}
                            isInfo={true}
                            isText={true}
                            text={"Following"}
                          >
                            <NavLink
                              className={`nav-link nav-link-closed`}
                              to={
                                !lochUserState || lochUserState === "jsk"
                                  ? "/following-add-address"
                                  : "/watchlist"
                              }
                              onClick={(e) => {
                                let tempToken = getToken();
                                if (!tempToken || tempToken === "jsk") {
                                  e.preventDefault();

                                  props.history.push("/following-add-address");

                                  return null;
                                } else {
                                  MenuWatchlist({
                                    session_id: getCurrentUser().id,
                                    email_address: getCurrentUser().email,
                                  });
                                }
                              }}
                              activeclassname="active"
                            >
                              <Image
                                src={FollowingSidebarIcon}
                                style={
                                  activeTab === "/watchlist" ||
                                  activeTab === "/following-add-address"
                                    ? {
                                        filter: "var(--sidebarActiveIcon)",
                                      }
                                    : {}
                                }
                                className="followingImg"
                              />
                            </NavLink>
                          </CustomOverlay>
                        </li>

                        <li>
                          <CustomOverlay
                            className="tool-tip-container-right-arrow"
                            position="right"
                            isIcon={false}
                            isInfo={true}
                            isText={true}
                            text={"Leaderboard"}
                          >
                            <NavLink
                              className={`nav-link nav-link-closed`}
                              to="/home-leaderboard"
                              onClick={(e) => {
                                // let tempToken = getToken();
                                // if (!tempToken || tempToken === "jsk") {
                                //   e.preventDefault();
                                //   return null;
                                // } else {
                                MenuLeaderboard({
                                  session_id: getCurrentUser().id,
                                  email_address: getCurrentUser().email,
                                });
                                // }
                              }}
                              activeclassname="active"
                            >
                              <Image src={InactiveSmartMoneySidebarIcon} />
                            </NavLink>
                          </CustomOverlay>
                        </li>

                        <li>
                          <CustomOverlay
                            className="tool-tip-container-right-arrow"
                            position="right"
                            isIcon={false}
                            isInfo={true}
                            isText={true}
                            text={"Profile"}
                          >
                            <NavLink
                              className={`nav-link nav-link-closed`}
                              to={
                                !lochUserState || lochUserState === "jsk"
                                  ? "/profile-add-address"
                                  : "/profile"
                              }
                              onClick={handleGoToProfile}
                              activeclassname="active"
                            >
                              <Image
                                src={ProfileSidebarIcon}
                                className="followingImg"
                              />
                            </NavLink>
                          </CustomOverlay>
                        </li>

                        {!lochUserState || lochUserState === "jsk" ? null : (
                          <li>
                            <CustomOverlay
                              className="tool-tip-container-right-arrow"
                              position="right"
                              isIcon={false}
                              isInfo={true}
                              isText={true}
                              text={"Feedback"}
                            >
                              <div
                                className={`nav-link nav-link-closed`}
                                style={{ backround: "transparent" }}
                                id="sidebar-feedback-btn"
                                onClick={handleUserFeedbackModal}
                                // activeclassname="active"
                              >
                                <Image
                                  src={feedbackIcon}
                                  // className="followingImg"
                                />
                              </div>
                            </CustomOverlay>
                          </li>
                        )}
                      </ul>
                    </nav>
                  </div>
                </div>
              ) : (
                <div className="scroll-menu-wrapper">
                  {showAmountsAtTop ? (
                    <div className="sideBarAmountsContainer">
                      <div className="sideBarAmountsNetworth">
                        {/* <CustomOverlay
                        className="tool-tip-container-right-arrow"
                          position="bottom"
                          isIcon={false}
                          isInfo={true}
                          isText={true}
                          text={
                            CurrencyType(false) +
                            (window.localStorage.getItem(
                              "shouldRecallApis"
                            ) === "true"
                              ? "0.00"
                              : amountFormat(
                                  getTotalAssetValue(),
                                  "en-US",
                                  "USD"
                                ) + " ") +
                            CurrencyType(true)
                          }
                          className="tool-tip-container-bottom-arrow"
                        > */}
                        <h3
                          style={{ whiteSpace: "nowrap" }}
                          className="space-grotesk-medium wallet-amount"
                        >
                          {CurrencyType(false)}
                          {/* {props.assetTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })} */}
                          {window.localStorage.getItem("shouldRecallApis") ===
                          "true"
                            ? "0.00"
                            : numToCurrency(getTotalAssetValue())}
                        </h3>
                        {/* </CustomOverlay> */}
                      </div>
                    </div>
                  ) : null}
                  <nav>
                    <ul>
                      {isSubmenu && isSubmenu.me && (
                        <>
                          {haveUserAddedAddress ? (
                            <>
                              <li>
                                <NavLink
                                  exact={true}
                                  className="nav-link"
                                  to={
                                    !lochUserState || lochUserState === "jsk"
                                      ? "/wallet-viewer-add-address"
                                      : activeTab === "/home"
                                      ? "#"
                                      : "/home"
                                  }
                                  onClick={(e) => {
                                    let tempToken = getToken();
                                    const userWalletList =
                                      window.localStorage.getItem("addWallet")
                                        ? JSON.parse(
                                            window.localStorage.getItem(
                                              "addWallet"
                                            )
                                          )
                                        : [];

                                    if (
                                      !tempToken ||
                                      tempToken === "jsk" ||
                                      !userWalletList ||
                                      userWalletList.length === 0
                                    ) {
                                      e.preventDefault();

                                      props.history.push(
                                        "/wallet-viewer-add-address"
                                      );

                                      return null;
                                    } else {
                                      HomeMenu({
                                        session_id: getCurrentUser().id,
                                        email_address: getCurrentUser().email,
                                      });
                                    }
                                  }}
                                  activeclassname="active"
                                >
                                  <Image
                                    src={WalletViewerSidebarIcon}
                                    style={
                                      activeTab === "/home" ||
                                      activeTab === "/wallet-viewer-add-address"
                                        ? {
                                            filter: "var(--sidebarActiveIcon)",
                                          }
                                        : {}
                                    }
                                  />
                                  Wallet Viewer
                                </NavLink>
                              </li>
                              <li>
                                <NavLink
                                  exact={true}
                                  onClick={(e) => {
                                    let tempToken = getToken();
                                    if (!tempToken || tempToken === "jsk") {
                                      e.preventDefault();

                                      props.history.push("/copy-trade-welcome");

                                      return null;
                                    }
                                    MenuCopyTradelist({
                                      session_id: getCurrentUser().id,
                                      email_address: getCurrentUser().email,
                                    });
                                  }}
                                  className="nav-link"
                                  to={
                                    !lochUserState || lochUserState === "jsk"
                                      ? "/copy-trade-welcome"
                                      : "/copy-trade"
                                  }
                                  activeclassname="active"
                                >
                                  <Image
                                    src={EmultionSidebarIcon}
                                    style={
                                      activeTab === "/copy-trade" ||
                                      activeTab === "/copy-trade-welcome"
                                        ? {
                                            filter: "brightness(0)",
                                          }
                                        : {}
                                    }
                                    className="followingImg"
                                  />
                                  Copy Trade
                                </NavLink>
                              </li>
                            </>
                          ) : (
                            <>
                              <li>
                                <NavLink
                                  exact={true}
                                  onClick={(e) => {
                                    let tempToken = getToken();
                                    if (!tempToken || tempToken === "jsk") {
                                      e.preventDefault();

                                      props.history.push("/copy-trade-welcome");

                                      return null;
                                    }
                                    MenuCopyTradelist({
                                      session_id: getCurrentUser().id,
                                      email_address: getCurrentUser().email,
                                    });
                                  }}
                                  className="nav-link"
                                  to={
                                    !lochUserState || lochUserState === "jsk"
                                      ? "/copy-trade-welcome"
                                      : "/copy-trade"
                                  }
                                  activeclassname="active"
                                >
                                  <Image
                                    src={EmultionSidebarIcon}
                                    style={
                                      activeTab === "/copy-trade" ||
                                      activeTab === "/copy-trade-welcome"
                                        ? {
                                            filter: "brightness(0)",
                                          }
                                        : {}
                                    }
                                    className="followingImg"
                                  />
                                  Copy Trade
                                </NavLink>
                              </li>
                              <li>
                                <NavLink
                                  exact={true}
                                  className="nav-link"
                                  to={
                                    !lochUserState || lochUserState === "jsk"
                                      ? "/wallet-viewer-add-address"
                                      : activeTab === "/home"
                                      ? "#"
                                      : "/home"
                                  }
                                  onClick={(e) => {
                                    let tempToken = getToken();
                                    const userWalletList =
                                      window.localStorage.getItem("addWallet")
                                        ? JSON.parse(
                                            window.localStorage.getItem(
                                              "addWallet"
                                            )
                                          )
                                        : [];

                                    if (
                                      !tempToken ||
                                      tempToken === "jsk" ||
                                      !userWalletList ||
                                      userWalletList.length === 0
                                    ) {
                                      e.preventDefault();

                                      props.history.push(
                                        "/wallet-viewer-add-address"
                                      );

                                      return null;
                                    } else {
                                      HomeMenu({
                                        session_id: getCurrentUser().id,
                                        email_address: getCurrentUser().email,
                                      });
                                    }
                                  }}
                                  activeclassname="active"
                                >
                                  <Image
                                    src={WalletViewerSidebarIcon}
                                    style={
                                      activeTab === "/home" ||
                                      activeTab === "/wallet-viewer-add-address"
                                        ? {
                                            filter: "var(--sidebarActiveIcon)",
                                          }
                                        : {}
                                    }
                                  />
                                  Wallet Viewer
                                </NavLink>
                              </li>
                            </>
                          )}
                          <li>
                            <NavLink
                              className={`nav-link`}
                              to={
                                !lochUserState || lochUserState === "jsk"
                                  ? "/following-add-address"
                                  : "/watchlist"
                              }
                              onClick={(e) => {
                                let tempToken = getToken();
                                if (!tempToken || tempToken === "jsk") {
                                  e.preventDefault();

                                  props.history.push("/following-add-address");

                                  return null;
                                } else {
                                  MenuWatchlist({
                                    session_id: getCurrentUser().id,
                                    email_address: getCurrentUser().email,
                                  });
                                }
                              }}
                              activeclassname="active"
                            >
                              <Image
                                src={FollowingSidebarIcon}
                                style={
                                  activeTab === "/watchlist" ||
                                  activeTab === "/following-add-address"
                                    ? {
                                        filter: "var(--sidebarActiveIcon)",
                                      }
                                    : {}
                                }
                                className="followingImg"
                              />
                              Following
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              exact={true}
                              onClick={(e) => {
                                // let tempToken = getToken();
                                // if (!tempToken || tempToken === "jsk") {
                                //   e.preventDefault();
                                //   return null;
                                // } else {
                                MenuLeaderboard({
                                  session_id: getCurrentUser().id,
                                  email_address: getCurrentUser().email,
                                });
                                // }
                              }}
                              className="nav-link"
                              to="/home-leaderboard"
                              activeclassname="active"
                            >
                              <Image
                                src={LeaderboardSidebarIcon}
                                style={
                                  activeTab === "/home-leaderboard"
                                    ? {
                                        filter: "var(--sidebarActiveIcon)",
                                      }
                                    : {}
                                }
                              />
                              Leaderboard
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              onClick={handleGoToProfile}
                              className="nav-link"
                              to={
                                !lochUserState || lochUserState === "jsk"
                                  ? "/profile-add-address"
                                  : "/profile"
                              }
                              activeclassname="active"
                            >
                              <Image
                                src={ProfileSidebarIcon}
                                style={
                                  activeTab === "/profile" ||
                                  activeTab === "/profile-add-address"
                                    ? {
                                        filter: "var(--sidebarActiveIcon)",
                                      }
                                    : {}
                                }
                                className="followingImg"
                              />
                              Profile
                            </NavLink>
                          </li>
                        </>
                      )}
                      {!lochUserState || lochUserState === "jsk" ? null : (
                        <li>
                          <NavLink
                            exact={true}
                            onClick={handleUserFeedbackModal}
                            className="nav-link none"
                            to="#"
                            activeclassname="none"
                            id="sidebar-feedback-btn-full"
                          >
                            <Image
                              src={feedbackIcon}
                              // style={{ filter: "opacity(0.6)" }}
                            />
                            Feedback
                          </NavLink>
                        </li>
                      )}
                      {/* <li>
                        <NavLink
                          exact={true}s
                          onClick={handleConnectModal}
                          className="nav-link none"
                          to="#"
                          activeclassname="none"
                        >
                          <Image
                            src={LinkIcon}
                            style={{ filter: "opacity(0.6)" }}
                          />
                          Connect Exchanges
                        </NavLink>
                      </li> */}
                    </ul>
                  </nav>
                </div>
              )}
            </div>

            <div
              className={`sidebar-footer ${
                props.isSidebarClosed ? "sidebar-footer-closed" : ""
              }`}
            >
              {props.isSidebarClosed ? (
                <div className="sidebar-footer-closed-container">
                  <div className="sidebar-footer-toggle-container">
                    <div
                      onClick={props.toggleSideBar}
                      className="sidebar-footer-toggle"
                    >
                      <Image
                        className={`sidebar-footer-toggle-image ${
                          props.isSidebarClosed
                            ? "sidebar-footer-toggle-image-reversed"
                            : ""
                        } `}
                        src={SidebarLeftArrowIcon}
                      />
                    </div>
                  </div>
                  <div className="sidebar-footer-content-closed">
                    {isSubmenu && !isSubmenu.discover && (
                      <ul>
                        {lochUser && lochUser.email ? (
                          <CustomOverlay
                            className="tool-tip-container-right-arrow"
                            position="right"
                            isIcon={false}
                            isInfo={true}
                            isText={true}
                            text={"Profile"}
                          >
                            <div
                              onClick={handleGoToProfile}
                              className={`sideBarFooterSignInIconContainerClosed ${
                                isCurPremiumUser
                                  ? "sideBarFooterSignInIconContainerClosedPremium"
                                  : ""
                              } inter-display-medium f-s-13 lh-19`}
                            >
                              <Image
                                className="sideBarFooterSignInIcon"
                                src={PersonRoundedSigninIcon}
                              />
                            </div>
                          </CustomOverlay>
                        ) : (
                          <>
                            <div
                              onClick={() => {
                                openSigninModal("copyTrade");
                              }}
                              id="sidebar-closed-sign-in-btn-copy-trader"
                              style={{
                                display: "none",
                              }}
                            />
                            <div
                              onClick={() => {
                                openSigninModal("lochPointsProfile");
                              }}
                              id="sidebar-closed-sign-in-btn-loch-points-profile"
                              style={{
                                display: "none",
                              }}
                            />
                            <CustomOverlay
                              className="tool-tip-container-right-arrow"
                              position="right"
                              isIcon={false}
                              isInfo={true}
                              isText={true}
                              text={"Sign in / up"}
                            >
                              <div
                                onClick={openSigninModal}
                                className="sideBarFooterSignInIconContainerClosed inter-display-medium f-s-13 lh-19 "
                                id="sidebar-closed-sign-in-btn"
                              >
                                <Image
                                  className="sideBarFooterSignInIcon"
                                  src={PersonRoundedSigninIcon}
                                />
                              </div>
                            </CustomOverlay>
                          </>
                        )}
                      </ul>
                    )}
                  </div>
                  <div
                    style={{
                      paddingBottom: "1rem",
                    }}
                    className="sidebar-footer-content-closed sidebar-footer-content-closed-for-twitter"
                  >
                    <CustomOverlay
                      className="tool-tip-container-right-arrow"
                      position="right"
                      isIcon={false}
                      isInfo={true}
                      isText={true}
                      text={isDarkMode ? "Light mode" : "Dark mode"}
                    >
                      <div
                        onClick={handleDarkMode}
                        className="sideBarFooterSignInIconContainerClosed sideBarFooterSignInIconContainerClosedForTwitter inter-display-medium f-s-13 lh-19 "
                      >
                        <Image
                          className="sideBarFooterSignInIcon sideBarFooterSignInIconForTwitter"
                          src={isDarkMode ? lightModeIcon : darkModeIcon}
                        />
                      </div>
                    </CustomOverlay>
                  </div>
                  <div className="sidebar-footer-content-closed sidebar-footer-content-closed-for-twitter">
                    <CustomOverlay
                      className="tool-tip-container-right-arrow"
                      position="right"
                      isIcon={false}
                      isInfo={true}
                      isText={true}
                      text={"Follow us"}
                    >
                      <div
                        onClick={openLochTwitter}
                        className="sideBarFooterSignInIconContainerClosed sideBarFooterSignInIconContainerClosedForTwitter inter-display-medium f-s-13 lh-19 "
                      >
                        <Image
                          className="sideBarFooterSignInIcon sideBarFooterSignInIconForTwitter"
                          src={XFormallyTwitterLogoLightIcon}
                        />
                      </div>
                    </CustomOverlay>
                  </div>
                </div>
              ) : (
                <>
                  <div className="sidebar-footer-toggle-container">
                    <div
                      onClick={props.toggleSideBar}
                      className="sidebar-footer-toggle"
                    >
                      <Image
                        className={`sidebar-footer-toggle-image ${
                          props.isSidebarClosed
                            ? "sidebar-footer-toggle-image-reversed"
                            : ""
                        } `}
                        src={SidebarLeftArrowIcon}
                      />
                    </div>
                  </div>
                  <div className="sidebar-footer-content">
                    {isSubmenu && !isSubmenu.discover && (
                      <ul>
                        {lochUser && lochUser.email ? (
                          <div
                            onClick={handleGoToProfile}
                            className="sideBarFooterSignInContainer sideBarFooterSignedInContainer inter-display-medium f-s-13 lh-19"
                          >
                            <div className="sideBarFooterSignInData">
                              <div className="sideBarFooterSignInIconContainer sideBarFooterSignInIconContainerClosed">
                                <Image
                                  style={{
                                    height: "12px",
                                    width: "12px",
                                  }}
                                  className="sideBarFooterSignInIcon"
                                  src={PersonRoundedSigninIcon}
                                />
                              </div>
                              <div className="dotDotText">
                                {lochUser.first_name || lochUser.last_name
                                  ? `${lochUser.first_name} ${
                                      lochUser.last_name
                                        ? lochUser.last_name.slice(0, 1) + "."
                                        : ""
                                    }`
                                  : "Signed In"}
                              </div>
                              {isCurPremiumUser ? (
                                <div className="sideabr-premium-banner">
                                  Premium
                                </div>
                              ) : null}
                            </div>

                            <span
                              onClick={handleLeaveChild}
                              onMouseOver={(e) =>
                                (e.currentTarget.children[0].src =
                                  LeaveBlackIcon)
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.children[0].src = LeaveIcon)
                              }
                              className="sideBarFooterSignedInLeaveContainer inter-display-medium f-s-13"
                            >
                              <Image src={LeaveIcon} />
                            </span>
                          </div>
                        ) : (
                          <>
                            <div
                              onClick={() => {
                                openSigninModal("copyTrade");
                              }}
                              id="sidebar-open-sign-in-btn-copy-trader"
                              style={{
                                display: "none",
                              }}
                            />
                            <div
                              onClick={() => {
                                openSigninModal("lochPointsProfile");
                              }}
                              id="sidebar-open-sign-in-btn-loch-points-profile"
                              style={{
                                display: "none",
                              }}
                            />

                            <div
                              onClick={openSigninModal}
                              className="sideBarFooterSignInContainer inter-display-medium f-s-13 lh-19 navbar-button"
                              id="sidebar-open-sign-in-btn"
                            >
                              <div className="sideBarFooterSignInIconContainer sideBarFooterSignInIconContainerClosed">
                                <Image
                                  style={{
                                    height: "12px",
                                    width: "12px",
                                  }}
                                  className="sideBarFooterSignInIcon"
                                  src={PersonRoundedSigninIcon}
                                />
                              </div>
                              <div>Sign in / up</div>
                            </div>
                          </>
                        )}
                      </ul>
                    )}
                    <div
                      onClick={handleDarkMode}
                      className="sideBarFooterSignInContainer sideBarFooterSignInContainerForTwitter inter-display-medium f-s-13 lh-19 navbar-button"
                    >
                      <div className="sideBarFooterSignInIconContainer sideBarFooterSignInIconContainerForTwitter">
                        <Image
                          className="sideBarFooterSignInIcon sideBarFooterSignInIconForTwitter sideBarFooterSignInIconForDarkLightMode"
                          src={isDarkMode ? lightModeIcon : darkModeIcon}
                        />
                      </div>
                      <div>{isDarkMode ? "Light mode" : "Dark mode"}</div>
                    </div>
                    <div
                      onClick={openLochTwitter}
                      className="sideBarFooterSignInContainer sideBarFooterSignInContainerForTwitter inter-display-medium f-s-13 lh-19 navbar-button"
                    >
                      <div className="sideBarFooterSignInIconContainer sideBarFooterSignInIconContainerForTwitter">
                        <Image
                          className="sideBarFooterSignInIcon sideBarFooterSignInIconForTwitter"
                          src={XFormallyTwitterLogoLightIcon}
                        />
                      </div>
                      <div>Follow us</div>
                    </div>
                    {/* <div className="sidebar-footer-button-holder">
                      {isDarkMode ? (
                        <span
                          onClick={handleDarkMode}
                          className="navbar-button-container"
                        >
                          <Image src={lightModeIcon} />
                          <Button className="interDisplayMediumText f-s-13 lh-19 navbar-button">
                            Light Mode
                          </Button>
                        </span>
                      ) : (
                        <span
                          onClick={handleDarkMode}
                          className="navbar-button-container"
                        >
                          <Image src={darkModeIcon} />
                          <span />
                          <Button className="interDisplayMediumText f-s-13 lh-19 navbar-button">
                            Dark Mode
                          </Button>
                        </span>
                      )}
                    </div> */}

                    <div
                      className="m-b-12 footer-divOne"
                      style={{ fontStyle: "italic" }}
                    >
                      {/* <p className='inter-display-medium f-s-15 grey-CAC lh-19' style={{ fontStyle: "italic" }}>"Sic Parvis Magna</p>
                            <p className='inter-display-medium f-s-15 grey-CAC lh-19'>Thus, great things from </p>
                            <p className='inter-display-medium f-s-15 grey-CAC lh-19'>small things come."</p> */}
                      <p className="inter-display-medium f-s-15 grey-CAC lh-19">
                        {quotes[currentIndex]}
                      </p>
                    </div>
                    <div className="inter-display-semi-bold f-s-15 grey-B0B lh-19 footer-divTwo">
                      {authors[currentIndex]}
                    </div>

                    {/* <p className='inter-display-medium f-s-15 grey-CAC lh-19' style={{fontStyle: "italic"}}>Sic Parvis Magna <span style={{fontStyle: "normal"}}>|</span>  </p>
                        <p className='inter-display-medium f-s-15 grey-CAC lh-19'>Thus, great things from small things come.</p>
                        <p className='inter-display-semi-bold f-s-15 grey-B0B lh-19'>Sir Francis Drake</p> */}
                  </div>
                </>
              )}
            </div>
          </div>
        </Container>
      </div>

      {connectModal ? (
        <ConnectModal
          show={connectModal}
          onHide={handleConnectModal}
          history={history}
          headerTitle={"Connect exchanges"}
          modalType={"connectModal"}
          iconImage={LinkIcon}
        />
      ) : (
        ""
      )}

      {leave ? (
        <ExitOverlay
          show={leave}
          // link="http://loch.one/a2y1jh2jsja"
          onHide={handleLeave}
          history={history}
          modalType={"exitOverlay"}
          handleRedirection={() => {
            resetUser();
            setTimeout(function () {
              props.history.push("/welcome");
            }, 3000);
          }}
        />
      ) : (
        ""
      )}
      {/* {cohort ? (
            <ExitOverlay
              show={cohort}
              // link="http://loch.one/a2y1jh2jsja"
              onHide={handleCohort}
              history={history}
              modalType={"cohort"}
              headerTitle={"Create a Wallet cohort"}
              handleRedirection={() => {
                setTimeout(function () {
                  props.history.push("/cohort");
                }, 3000);
              }}
            />
          ) : (
            ""
          )} */}

      {apiModal ? (
        <ExitOverlay
          show={apiModal}
          onHide={handleApiModal}
          history={history}
          headerTitle={"API"}
          modalType={"apiModal"}
          iconImage={ApiModalIcon}
        />
      ) : (
        ""
      )}

      {Upgrade ? (
        <UpgradeModal
          show={Upgrade}
          onHide={upgradeModal}
          history={history}
          isShare={window.localStorage.getItem("share_id")}
          // isStatic={isStatic}
          triggerId={triggerId}
          pname="sidebar"
        />
      ) : (
        ""
      )}

      {exportModal ? (
        <ExitOverlay
          show={exportModal}
          onHide={handleExportModal}
          history={history}
          headerTitle={"Download all the data"}
          modalType={"exportModal"}
          iconImage={ExportIconWhite}
        />
      ) : (
        ""
      )}
      {shareModal ? (
        <SharePortfolio
          show={shareModal}
          onHide={handleShareModal}
          history={history}
          headerTitle={"Share this portfolio"}
          modalType={"shareModal"}
          iconImage={SharePortfolioIcon}
        />
      ) : (
        ""
      )}
      {confirmLeave ? (
        <ConfirmLeaveModal
          show={confirmLeave}
          history={history}
          handleClose={handleConfirmLeaveModal}
        />
      ) : (
        ""
      )}

      {showFeedbackModal && (
        <FeedbackModal show={showFeedbackModal} onHide={handleFeedback} />
      )}

      {signinModal ? (
        <AuthModal
          hideOnblur
          showHiddenError
          modalAnimation={signInModalAnimation}
          show={signinModal}
          onHide={onCloseModal}
          history={history}
          modalType={"create_account"}
          iconImage={SignInIcon}
          hideSkip={true}
          title={isAutoPopUpModal ? "Sign in now" : "Sign in"}
          description={
            isCopyTraderPopUpModal
              ? "Easily copy trade with other address"
              : isLochPointsProfilePopUpModal
              ? "Earn loch points and get rewarded"
              : isAutoPopUpModal
              ? "Don’t let your hard work go to waste. Add your email so you can analyze this portfolio with superpowers"
              : "Get right back into your account"
          }
          stopUpdate={true}
          tracking={
            isCopyTraderPopUpModal
              ? "Copy trade"
              : isLochPointsProfilePopUpModal
              ? "Loch points profile"
              : "Sign in button"
          }
          goToSignUp={openSignUpModal}
        />
      ) : (
        ""
      )}
      {signupModal ? (
        <ExitOverlay
          customDesc={
            isCopyTraderPopUpModal
              ? "Easily copy trade with other address"
              : isLochPointsProfilePopUpModal
              ? "Earn loch points and get rewarded"
              : ""
          }
          tracking={
            isCopyTraderPopUpModal
              ? "Copy trade"
              : isLochPointsProfilePopUpModal
              ? "Loch points profile"
              : ""
          }
          iconImage={SignInIcon}
          comingDirectly={comingDirectly}
          hideOnblur
          showHiddenError
          modalAnimation={signUpModalAnimation}
          show={signupModal}
          onHide={onCloseModal}
          history={history}
          modalType={"exitOverlay"}
          handleRedirection={() => {
            // resetUser();
            // setTimeout(function () {
            //   props.history.push("/welcome");
            // }, 3000);
          }}
          signup={true}
          goToSignIn={openSigninModal}
        />
      ) : (
        ""
      )}

      {/* after 15 sec open this */}
      {userFeedbackModal ? (
        <UserFeedbackModal
          trackPos={trackPos}
          dragPosition={dragPosition}
          onHide={hideUserFeedbackModal}
          history={history}
          popupType="general_popup"
          tracking={history.location.pathname.substring(1)}
        />
      ) : null}
    </>
  );
}
const mapDispatchToProps = {
  sendUserFeedbackApi,
  addUserCredits,
  updateWalletListFlag,
  SwitchDarkMode,
};
const mapStateToProps = (state) => ({
  portfolioState: state.PortfolioState,
  defiState: state.DefiState,
  userPaymentState: state.UserPaymentState,
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
