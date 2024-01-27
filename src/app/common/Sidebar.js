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
  BlackManIcon,
  GreyManIcon,
  InactiveSmartMoneySidebarIcon,
  PersonRoundedSigninIcon,
  SidebarLeftArrowIcon,
  StreakFireIcon,
  TwoPeopleIcon,
  XFormallyTwitterLogoIcon,
} from "../../assets/images/icons";
import {
  default as ActiveProfileIcon,
  default as SignInIcon,
} from "../../assets/images/icons/ActiveProfileIcon.svg";
import ApiModalIcon from "../../assets/images/icons/ApiModalIcon.svg";
import ExportIconWhite from "../../assets/images/icons/ExportBlackIcon.svg";
import InActiveHomeIcon from "../../assets/images/icons/InactiveHomeIcon.svg";
import ProfileIcon from "../../assets/images/icons/InactiveProfileIcon.svg";
import LeaveBlackIcon from "../../assets/images/icons/LeaveBlackIcon.svg";
import LeaveIcon from "../../assets/images/icons/LeaveIcon.svg";
import SharePortfolioIcon from "../../assets/images/icons/SharePortfolioIcon.svg";
import LinkIcon from "../../assets/images/icons/link.svg";
import ActiveHomeIcon from "../../image/HomeIcon.svg";
import logo from "../../image/Loch.svg";
import {
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
  resetUser,
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
  getAllCurrencyApi,
  getAllCurrencyRatesApi,
  sendUserFeedbackApi,
  updateWalletListFlag,
} from "./Api";
import AuthModal from "./AuthModal";
import ConfirmLeaveModal from "./ConformLeaveModal";
import FeedbackModal from "./FeedbackModal";
import SharePortfolio from "./SharePortfolio";
import SidebarModal from "./SidebarModal";
import UserFeedbackModal from "./UserFeedbackModal.js";
import UpgradeModal from "./upgradeModal";

import {
  CurrencyType,
  amountFormat,
  numToCurrency,
} from "../../utils/ReusableFunctions.js";
import ExitOverlay from "./ExitOverlay";
import ConnectModal from "./ConnectModal.js";
import { BASE_URL_S3 } from "../../utils/Constant.js";
import { toast } from "react-toastify";

function Sidebar(props) {
  // console.log('props',props);
  let activeTab = window.location.pathname;

  if (window.location.hash) {
    activeTab = activeTab + window.location.hash;
  }

  // console.log("active", activeTab);
  const history = useHistory();
  const [showAmountsAtTop, setShowAmountsAtTop] = useState(false);
  const [dragPosition, setDragPosition] = React.useState({ x: 0, y: 0 });
  const [leave, setLeave] = React.useState(false);
  const [apiModal, setApiModal] = React.useState(false);
  const [exportModal, setExportModal] = React.useState(false);
  const [shareModal, setShareModal] = React.useState(false);
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
    JSON.parse(window.sessionStorage.getItem("currency"))
  );
  let lochUser = JSON.parse(window.sessionStorage.getItem("lochUser"));
  if (lochUser) {
    // if loch user remove share id to prevent opening upgrade modal
    window.sessionStorage.removeItem("share_id");
  }
  const [Upgrade, setUpgradeModal] = React.useState(false);
  const [connectModal, setconnectModal] = React.useState(false);
  const [isWallet, setWallet] = React.useState(
    JSON.parse(window.sessionStorage.getItem("addWallet")) ? true : false
  );
  const [signinPopup, setSigninPopup] = React.useState(false);
  let triggerId = 6;

  // submenu

  const [isSubmenu, setSubmenu] = React.useState(
    JSON.parse(window.sessionStorage.getItem("isSubmenu"))
  );

  // preview address
  const [previewAddress, setPreviewAddress] = React.useState(
    JSON.parse(window.sessionStorage.getItem("previewAddress"))
  );

  React.useEffect(() => {
    // console.log("in use effect");

    // update previewaddress from localstorage
    setPreviewAddress(
      JSON.parse(window.sessionStorage.getItem("previewAddress"))
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

      window.sessionStorage.setItem("isSubmenu", JSON.stringify(obj));
      resetPreviewAddress();
      setPreviewAddress(
        JSON.parse(window.sessionStorage.getItem("previewAddress"))
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

      window.sessionStorage.setItem("isSubmenu", JSON.stringify(obj));
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

      window.sessionStorage.setItem("isSubmenu", JSON.stringify(obj));
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

      window.sessionStorage.setItem("isSubmenu", JSON.stringify(obj));
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

      window.sessionStorage.setItem("isSubmenu", JSON.stringify(obj));
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

      window.sessionStorage.setItem("isSubmenu", JSON.stringify(obj));
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

      window.sessionStorage.setItem("isSubmenu", JSON.stringify(obj));
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
    let status = JSON.parse(window.sessionStorage.getItem("addWallet"));
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
    const isDummy = window.sessionStorage.getItem("lochDummyUser");
    // console.log("isDummy user", isDummy)
    MenuLeave({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    if (isDummy) {
      setLeave(!leave);
    } else {
      setConfirmLeave(!confirmLeave);
      // props.history.push('/welcome');
    }
  };
  const handleGoToProfile = () => {
    let tempToken = getToken();
    if (!tempToken || tempToken === "jsk") {
      return null;
    }
    props.history.push("/profile");
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
  const openSigninModal = () => {
    let tempToken = getToken();
    if (!tempToken || tempToken === "jsk") {
      return null;
    }
    setComingDirectly(false);
    setSignUpModalAnimation(false);
    setSignupModal(false);
    setSigninModal(true);

    SigninMenu({
      session_id: getCurrentUser().id,
    });
  };
  const onCloseModal = () => {
    setComingDirectly(true);
    setSignUpModalAnimation(true);
    setSignInModalAnimation(true);
    setSigninModal(false);
    setSignupModal(false);
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
    setSigninPopup(!signinPopup);
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
    const user = JSON.parse(window.sessionStorage.getItem("lochUser"));
    let userWallet = JSON.parse(window.sessionStorage.getItem("addWallet"));
    let slink =
      userWallet?.length === 1
        ? userWallet[0].displayAddress || userWallet[0].address
        : getCurrentUser().id;
    const link = `${BASE_URL_S3}home/${slink}`;
    navigator.clipboard.writeText(link);
    toast.success("Share link has been copied");
  };

  React.useEffect(() => {
    let currency = JSON.parse(window.sessionStorage.getItem("currency"));

    if (!currency) {
      window.sessionStorage.setItem(
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

      setCurrency(JSON.parse(window.sessionStorage.getItem("currency")));
    }

    setTimeout(() => {
      //  console.log("curr", currency);
      let currencyRates = JSON.parse(
        window.sessionStorage.getItem("currencyRates")
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
    let isPopup = JSON.parse(window.sessionStorage.getItem("isPopup"));

    setTimeout(() => {
      // if isPopupActive = true then do not open this popup bcoz any other popup still open
      let isPopupActive = JSON.parse(
        window.sessionStorage.getItem("isPopupActive")
      );
      lochUser = JSON.parse(window.sessionStorage.getItem("lochUser"));
      if (!isPopupActive) {
        // console.log("inactive popup", isPopupActive);
        if (!lochUser) {
          // GeneralPopup({
          //   session_id: getCurrentUser().id,
          //   from: history.location.pathname.substring(1),
          // });
          // isPopup && handleSiginPopup();
          // window.sessionStorage.setItem("isPopup", false);
          if (isPopup) {
            handleSiginPopup();
            window.sessionStorage.setItem("isPopup", false);
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
    }, 15000);
  };

  const handleFunction = (currency) => {
    let currencyRates = JSON.parse(
      window.sessionStorage.getItem("currencyRates")
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
      window.sessionStorage.setItem("currency", JSON.stringify(currency));
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

      window.sessionStorage.setItem(
        "floatingModalPosition",
        JSON.stringify({ x: data.x, y: data.y })
      );
    }
  };
  useEffect(() => {
    let floatingModalPosition = window.sessionStorage.getItem(
      "floatingModalPosition"
    );
    if (floatingModalPosition) {
      setDragPosition(JSON.parse(floatingModalPosition));
    }
  }, []);
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
        style={{
          zIndex: "99",
        }}
        className="sidebar-section"
      >
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
              <div>
                <Image src={logo} />
                <span className="loch-text">Loch</span>
              </div>
              <div className="currency-wrapper">
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
              </div>
            </div>

            <div
              className={
                props.ownerName ? "sidebar-body" : "sidebar-body nowallet"
              }
            >
              {props.isSidebarClosed ? (
                <div className="scroll-menu-wrapper-closed-container">
                  <div className="scroll-menu-wrapper-closed">
                    <nav>
                      <ul>
                        <li>
                          <CustomOverlay
                            position="top"
                            isIcon={false}
                            isInfo={true}
                            isText={true}
                            text={"Home"}
                          >
                            <NavLink
                              exact={true}
                              className="nav-link nav-link-closed"
                              to={activeTab === "/home" ? "#" : "/home"}
                              onClick={(e) => {
                                let tempToken = getToken();
                                if (!tempToken || tempToken === "jsk") {
                                  e.preventDefault();
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
                              }}
                              activeclassname="active"
                            >
                              <Image
                                src={
                                  activeTab === "/home"
                                    ? ActiveHomeIcon
                                    : InActiveHomeIcon
                                }
                              />
                            </NavLink>
                          </CustomOverlay>
                        </li>

                        <li>
                          <CustomOverlay
                            position="top"
                            isIcon={false}
                            isInfo={true}
                            isText={true}
                            text={"Following"}
                          >
                            <NavLink
                              className={`nav-link nav-link-closed`}
                              to="/watchlist"
                              onClick={(e) => {
                                let tempToken = getToken();
                                if (!tempToken || tempToken === "jsk") {
                                  e.preventDefault();
                                  return null;
                                }
                                if (!isWallet) {
                                  e.preventDefault();
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
                                src={TwoPeopleIcon}
                                style={
                                  activeTab === "/watchlist"
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
                            position="top"
                            isIcon={false}
                            isInfo={true}
                            isText={true}
                            text={"Leaderboard"}
                          >
                            <NavLink
                              className={`nav-link nav-link-closed`}
                              to="/home-leaderboard"
                              onClick={(e) => {
                                let tempToken = getToken();
                                if (!tempToken || tempToken === "jsk") {
                                  e.preventDefault();
                                  return null;
                                }
                                if (!isWallet) {
                                  e.preventDefault();
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
                                src={
                                  activeTab === "/home-leaderboard"
                                    ? ActiveSmartMoneySidebarIcon
                                    : InactiveSmartMoneySidebarIcon
                                }
                              />
                            </NavLink>
                          </CustomOverlay>
                        </li>
                        <li>
                          <CustomOverlay
                            position="top"
                            isIcon={false}
                            isInfo={true}
                            isText={true}
                            text={"Profile"}
                          >
                            <NavLink
                              className={`nav-link nav-link-closed`}
                              to="/profile"
                              onClick={(e) => {
                                let tempToken = getToken();
                                if (!tempToken || tempToken === "jsk") {
                                  e.preventDefault();
                                  return null;
                                }
                                if (!isWallet) {
                                  e.preventDefault();
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
                                src={ProfileIcon}
                                style={
                                  activeTab === "/profile"
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
                            position="top"
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
                      </ul>
                    </nav>
                  </div>
                </div>
              ) : (
                <div className="scroll-menu-wrapper">
                  {showAmountsAtTop ? (
                    <div className="sideBarAmountsContainer">
                      <div className="sideBarAmountsNetworth">
                        <CustomOverlay
                          position="bottom"
                          isIcon={false}
                          isInfo={true}
                          isText={true}
                          text={
                            CurrencyType(false) +
                            amountFormat(getTotalAssetValue(), "en-US", "USD") +
                            " " +
                            CurrencyType(true)
                          }
                          className="tool-tip-container-bottom-arrow"
                        >
                          <h3
                            style={{ whiteSpace: "nowrap", cursor: "pointer" }}
                            className="space-grotesk-medium wallet-amount"
                          >
                            {CurrencyType(false)}
                            {/* {props.assetTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })} */}
                            {numToCurrency(getTotalAssetValue())}{" "}
                          </h3>
                        </CustomOverlay>
                      </div>
                    </div>
                  ) : null}
                  <nav>
                    <ul>
                      {isSubmenu.me && (
                        <>
                          <li>
                            <NavLink
                              exact={true}
                              className="nav-link"
                              to={activeTab === "/home" ? "#" : "/home"}
                              onClick={(e) => {
                                let tempToken = getToken();
                                if (!tempToken || tempToken === "jsk") {
                                  e.preventDefault();
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
                              }}
                              activeclassname="active"
                            >
                              <Image
                                src={
                                  activeTab === "/home"
                                    ? ActiveHomeIcon
                                    : InActiveHomeIcon
                                }
                              />
                              Home
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              className={`nav-link`}
                              to="/watchlist"
                              onClick={(e) => {
                                let tempToken = getToken();
                                if (!tempToken || tempToken === "jsk") {
                                  e.preventDefault();
                                  return null;
                                }
                                if (!isWallet) {
                                  e.preventDefault();
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
                                src={TwoPeopleIcon}
                                style={
                                  activeTab === "/watchlist"
                                    ? {
                                        filter: "brightness(0)",
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
                                let tempToken = getToken();
                                if (!tempToken || tempToken === "jsk") {
                                  e.preventDefault();
                                  return null;
                                }
                                if (!isWallet) {
                                  e.preventDefault();
                                } else {
                                  ProfileMenu({
                                    session_id: getCurrentUser().id,
                                    email_address: getCurrentUser().email,
                                  });
                                }
                              }}
                              className="nav-link"
                              to="/home-leaderboard"
                              activeclassname="active"
                            >
                              <Image
                                src={
                                  activeTab === "/home-leaderboard"
                                    ? ActiveSmartMoneySidebarIcon
                                    : InactiveSmartMoneySidebarIcon
                                }
                              />
                              Leaderboard
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              exact={true}
                              onClick={(e) => {
                                let tempToken = getToken();
                                if (!tempToken || tempToken === "jsk") {
                                  e.preventDefault();
                                  return null;
                                }
                                if (!isWallet) {
                                  e.preventDefault();
                                } else {
                                  ProfileMenu({
                                    session_id: getCurrentUser().id,
                                    email_address: getCurrentUser().email,
                                  });
                                }
                              }}
                              className="nav-link"
                              to="/profile"
                              activeclassname="active"
                            >
                              <Image
                                src={
                                  activeTab === "/profile"
                                    ? ActiveProfileIcon
                                    : ProfileIcon
                                }
                              />
                              Profile
                            </NavLink>
                          </li>
                        </>
                      )}
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
                      <li>
                        <div
                          className="nav-link nav-link-streak none"
                          activeclassname="none"
                          id="sidebar-streaks-btn-full"
                        >
                          <Image
                            src={StreakFireIcon}
                            // style={{ filter: "opacity(0.6)" }}
                          />
                          <span
                            style={{
                              color: "#5F33FF",
                            }}
                          >
                            3
                          </span>
                          <span
                            style={{
                              color: "#5F33FF",
                              marginLeft: "0.3rem",
                              marginRight: "0.3rem",
                            }}
                          >
                            day
                          </span>

                          <span>streak</span>
                        </div>
                      </li>
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
                    {!isSubmenu.discover && (
                      <ul>
                        {lochUser &&
                        (lochUser.email ||
                          lochUser.first_name ||
                          lochUser.last_name) ? (
                          <CustomOverlay
                            position="top"
                            isIcon={false}
                            isInfo={true}
                            isText={true}
                            text={"Profile"}
                          >
                            <div
                              onClick={handleGoToProfile}
                              className=" sideBarFooterSignInIconContainerClosed inter-display-medium f-s-13 lh-19 "
                            >
                              <Image
                                className="sideBarFooterSignInIcon"
                                src={PersonRoundedSigninIcon}
                              />
                            </div>
                          </CustomOverlay>
                        ) : (
                          <CustomOverlay
                            position="top"
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
                        )}
                      </ul>
                    )}
                  </div>
                  <div className="sidebar-footer-content-closed sidebar-footer-content-closed-for-twitter">
                    <CustomOverlay
                      position="top"
                      isIcon={false}
                      isInfo={true}
                      isText={true}
                      text={"Follow us"}
                    >
                      <div
                        onClick={openLochTwitter}
                        className="sideBarFooterSignInIconContainerClosed sideBarFooterSignInIconContainerClosedForTwitter inter-display-medium f-s-13 lh-19 "
                        id="sidebar-closed-sign-in-btn"
                      >
                        <Image
                          className="sideBarFooterSignInIcon sideBarFooterSignInIconForTwitter"
                          src={XFormallyTwitterLogoIcon}
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
                    {!isSubmenu.discover && (
                      <ul>
                        {lochUser &&
                        (lochUser.email ||
                          lochUser.first_name ||
                          lochUser.last_name) ? (
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
                              <Button className="inter-display-medium f-s-13 lh-19 navbar-button">
                                Leave
                              </Button>
                            </span>
                          </div>
                        ) : (
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
                        )}
                      </ul>
                    )}
                    <div
                      onClick={openLochTwitter}
                      className="sideBarFooterSignInContainer sideBarFooterSignInContainerForTwitter inter-display-medium f-s-13 lh-19 navbar-button"
                      id="sidebar-open-sign-in-btn"
                    >
                      <div className="sideBarFooterSignInIconContainer sideBarFooterSignInIconContainerForTwitter">
                        <Image
                          className="sideBarFooterSignInIcon sideBarFooterSignInIconForTwitter"
                          src={XFormallyTwitterLogoIcon}
                        />
                      </div>
                      <div>Follow us</div>
                    </div>

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
          isShare={window.sessionStorage.getItem("share_id")}
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
          headerTitle={"Download all your data"}
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
          title="Sign in"
          description="Get right back into your account"
          stopUpdate={true}
          tracking="Sign in button"
          goToSignUp={openSignUpModal}
        />
      ) : (
        ""
      )}
      {signupModal ? (
        <ExitOverlay
          comingDirectly={comingDirectly}
          hideOnblur
          showHiddenError
          modalAnimation={signUpModalAnimation}
          show={signupModal}
          onHide={onCloseModal}
          history={history}
          modalType={"exitOverlay"}
          handleRedirection={() => {
            resetUser();
            setTimeout(function () {
              props.history.push("/welcome");
            }, 3000);
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

      {signinPopup ? (
        <SidebarModal
          trackPos={trackPos}
          dragPosition={dragPosition}
          show={signinPopup}
          onHide={handleSiginPopup}
          history={history}
          popupType="general_popup"
          tracking={history.location.pathname.substring(1)}
          openSignupModalDirect={openSignupModalDirect}
        />
      ) : null}
    </>
  );
}
const mapDispatchToProps = {
  sendUserFeedbackApi,
  addUserCredits,
  updateWalletListFlag,
};
const mapStateToProps = (state) => ({
  portfolioState: state.PortfolioState,
  defiState: state.DefiState,
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
