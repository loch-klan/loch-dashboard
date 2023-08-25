import React, { useEffect, useState } from "react";
import {
  Image,
  Container,
  Button,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import { NavLink } from "react-router-dom";
// import logo from '../../image/logo.png'
import logo from "../../image/Loch.svg";
import SignInIcon from "../../assets/images/icons/ActiveProfileIcon.svg";
import ActiveHomeIcon from "../../image/HomeIcon.svg";
import InActiveHomeIcon from "../../assets/images/icons/InactiveHomeIcon.svg";
import ActiveIntelligenceIcon from "../../assets/images/icons/ActiveIntelligenceIcon.svg";
import IntelligenceIcon from "../../assets/images/icons/InactiveIntelligenceIcon.svg";
import ProfileIcon from "../../assets/images/icons/InactiveProfileIcon.svg";
import ActiveProfileIcon from "../../assets/images/icons/ActiveProfileIcon.svg";
import { CoinsIcon } from "../../assets/images/icons";
import DefiIcon from "../../assets/images/icons/defi-icon.svg";
import CohortIcon from "../../assets/images/icons/cohort.svg";
import ActiveCohortIcon from "../../assets/images/icons/active-cohort.svg";
import ActiveFeedbackIcon from "../../assets/images/icons/feedback.svg";
import arrowUp from "../../assets/images/arrow-up.svg";
import ExportIcon from "../../assets/images/icons/ExportIcon.svg";
import SharePortfolioIcon from "../../assets/images/icons/SharePortfolioIcon.svg";
import SharePortfolioIconWhite from "../../assets/images/icons/SharePortfolioIconWhite.svg";
import ExportIconWhite from "../../assets/images/icons/ExportBlackIcon.svg";
import StarIcon from "../../assets/images/icons/star-top.svg";
import EyeIcon from "../../assets/images/icons/eye.svg";
import CompassIcon from "../../assets/images/icons/compass.svg";
import LeaveIcon from "../../assets/images/icons/LeaveIcon.svg";
import LeaveBlackIcon from "../../assets/images/icons/LeaveBlackIcon.svg";
import { useHistory } from "react-router-dom";
import ExitOverlay from "./ExitOverlay";
import { BASE_URL_S3 } from "../../utils/Constant";
import { toast } from "react-toastify";
import ApiModalIcon from "../../assets/images/icons/ApiModalIcon.svg";
import LinkIcon from "../../assets/images/icons/link.svg";
import ConfirmLeaveModal from "./ConformLeaveModal";
import { getCurrentUser, resetPreviewAddress } from "../../utils/ManageToken";
import {
  IntelligenceMenu,
  ProfileMenu,
  ExportMenu,
  HomeMenu,
  MenuApi,
  MenuLeave,
  MenuShare,
  MenuWhale,
  resetUser,
  DeFiMenu,
  FeedbackMenu,
  GeneralPopup,
  SigninMenu,
  MenuCurrencyDropdown,
  MenuCurrencyDropdownSelected,
  MenuIntNetflow,
  MenuIntAssetValue,
  MenuIntTransactionHistory,
  MenuIntInsight,
  MenuIntCosts,
  MenuMeTab,
  MenuDiscoverTab,
  MenuTopAccounts,
  MenuTwitterInfluencers,
  MenuWatchlist,
  MenuTopAccountsHome,
  MenuTopAccountsInt,
  MenuTopAccountsDefi,
  MenuTopAccountsCosts,
  MenuTopAccountsTH,
  MenuTopAccountsAssetValue,
  MenuTopAccountsNetflow,
  SignupMenu,
  YieldOpportunitiesMenu,
} from "../../utils/AnalyticsFunctions.js";
import SharePortfolio from "./SharePortfolio";
import { getAllCurrencyApi, getAllCurrencyRatesApi } from "./Api";
import FeedbackModal from "./FeedbackModal";
import UpgradeModal from "./upgradeModal";
import ConnectModal from "./ConnectModal";
import AuthModal from "./AuthModal";
import SignInPopupIcon from "../../assets/images/icons/loch-icon.svg";
import { NewspaperIcon } from "../../assets/images/icons";
import DontLoseDataModal from "./DontLoseDataModal";
import { BlackManIcon, GreyManIcon } from "../../assets/images/icons";
import { useSelector } from "react-redux";
import SidebarModal from "./SidebarModal";

function Sidebar(props) {
  // console.log('props',props);

  let activeTab = window.location.pathname;

  if (window.location.hash) {
    activeTab = activeTab + window.location.hash;
  }

  // console.log("active", activeTab);
  const history = useHistory();
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
  const [cohort, setCohort] = React.useState(false);
  const [showFeedbackModal, setFeedbackModal] = React.useState(false);
  const [signInModalAnimation, setSignInModalAnimation] = useState(true);
  const [selectedCurrency, setCurrency] = React.useState(
    JSON.parse(localStorage.getItem("currency"))
  );
  let lochUser = JSON.parse(localStorage.getItem("lochUser"));
  if (lochUser) {
    // if loch user remove share id to prevent opening upgrade modal
    localStorage.removeItem("share_id");
  }
  const [Upgrade, setUpgradeModal] = React.useState(false);
  const [connectModal, setconnectModal] = React.useState(false);
  const [isWallet, setWallet] = React.useState(
    JSON.parse(localStorage.getItem("addWallet")) ? true : false
  );
  const [signinPopup, setSigninPopup] = React.useState(false);
  let userPlan = JSON.parse(localStorage.getItem("currentPlan")) || "Free";
  let triggerId = 6;
  let defi_access = JSON.parse(localStorage.getItem("defi_access"));
  let isDefi = userPlan?.defi_enabled || defi_access;
  let selectedPlan = {};
  const Plans = JSON.parse(localStorage.getItem("Plans"));
  Plans?.map((plan) => {
    if (plan?.name === userPlan?.name) {
      selectedPlan = {
        // Upgrade plan
        price: plan.prices ? plan.prices[0]?.unit_amount / 100 : 0,
        price_id: plan.prices ? plan.prices[0]?.id : "",
        name: plan.name,
        id: plan.id,
        plan_reference_id: plan.plan_reference_id,
      };
    }
  });

  // submenu

  const [isSubmenu, setSubmenu] = React.useState(
    JSON.parse(localStorage.getItem("isSubmenu"))
  );

  // preview address
  const [previewAddress, setPreviewAddress] = React.useState(
    JSON.parse(localStorage.getItem("previewAddress"))
  );

  const handleIntelligentSubmenu = () => {
    let currentValue = JSON.parse(localStorage.getItem("isSubmenu"));
    let obj = {
      me: true,
      discover: false,
      intelligence: !currentValue?.intelligence,
      topAccount: false,
      topAccountintelligence: false,
    };
    setSubmenu(obj);

    localStorage.setItem("isSubmenu", JSON.stringify(obj));
  };

  const handleTopAccountIntelligentSubmenu = () => {
    let currentValue = JSON.parse(localStorage.getItem("isSubmenu"));
    let obj = {
      me: false,
      discover: true,
      intelligence: false,
      // if not found preview address then false else true
      topAccount: previewAddress?.address ? true : false,
      topAccountintelligence: !currentValue.topAccountintelligence,
    };
    setSubmenu(obj);

    localStorage.setItem("isSubmenu", JSON.stringify(obj));
  };

  const handleTopAccountSubmenu = () => {
    let currentValue = JSON.parse(localStorage.getItem("isSubmenu"));
    let obj = {
      me: false,
      discover: true,
      intelligence: false,
      topAccount: !currentValue.topAccount,
      topAccountintelligence: false,
    };
    setSubmenu(obj);

    localStorage.setItem("isSubmenu", JSON.stringify(obj));
  };

  const handleMeSubmenu = () => {
    let currentValue = JSON.parse(localStorage.getItem("isSubmenu"));
    // console.log("current", currentValue)
    let obj = {
      me: true,
      discover: false,
      intelligence: false,
      topAccount: false,
      topAccountintelligence: false,
    };
    setSubmenu(obj);

    localStorage.setItem("isSubmenu", JSON.stringify(obj));

    MenuMeTab({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
  };

  const handleDiscoverSubmenu = () => {
    let currentValue = JSON.parse(localStorage.getItem("isSubmenu"));
    let obj = {
      me: false,
      discover: true,
      intelligence: false,
      topAccount: false,
      topAccountintelligence: false,
    };
    setSubmenu(obj);

    localStorage.setItem("isSubmenu", JSON.stringify(obj));

    MenuDiscoverTab({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
  };

  React.useEffect(() => {
    // console.log("in use effect");

    // update previewaddress from localstorage
    setPreviewAddress(JSON.parse(localStorage.getItem("previewAddress")));

    // Me section
    if (
      [
        "/home",
        "/profile",
        "/decentralized-finance",
        "/yield-opportunities",
      ].includes(activeTab)
    ) {
      let obj = {
        me: true,
        discover: false,
        intelligence: false,
        topAccount: false,
        topAccountintelligence: false,
      };
      setSubmenu(obj);

      localStorage.setItem("isSubmenu", JSON.stringify(obj));
      resetPreviewAddress();
      setPreviewAddress(JSON.parse(localStorage.getItem("previewAddress")));
    }
    // Me section with intelligence
    else if (
      [
        "/intelligence",
        "/intelligence#netflow",
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
        topAccount: false,
        topAccountintelligence: false,
      };
      setSubmenu(obj);

      localStorage.setItem("isSubmenu", JSON.stringify(obj));
    }
    // Discover section
    else if (
      ["/whale-watch", "/watchlist", "/transaction-feed"].includes(activeTab) ||
      activeTab.includes("/whale-watch")
    ) {
      let obj = {
        me: false,
        discover: true,
        intelligence: false,
        topAccount: false,
        topAccountintelligence: false,
      };
      setSubmenu(obj);

      localStorage.setItem("isSubmenu", JSON.stringify(obj));
    } else if (
      [
        "/top-accounts",
        "/top-accounts/home",
        "/top-accounts/decentralized-finance",
      ].includes(activeTab)
    ) {
      let obj = {
        me: false,
        discover: true,
        intelligence: false,
        topAccount: previewAddress?.address ? true : false,
        topAccountintelligence: false,
      };
      setSubmenu(obj);

      localStorage.setItem("isSubmenu", JSON.stringify(obj));
    } else if (
      [
        "/top-accounts/intelligence/transaction-history",
        "/top-accounts/intelligence#netflow",
        "/top-accounts/intelligence",
        "/top-accounts/intelligence/volume-traded-by-counterparty",
        "/top-accounts/intelligence/insights",
        "/top-accounts/intelligence/costs",
        "/top-accounts/intelligence/asset-value",
      ].includes(activeTab)
    ) {
      let obj = {
        me: false,
        discover: true,
        intelligence: false,
        topAccount: previewAddress?.address ? true : false,
        topAccountintelligence: true,
      };
      setSubmenu(obj);

      localStorage.setItem("isSubmenu", JSON.stringify(obj));
    } else {
      let obj = {
        me: true,
        discover: false,
        intelligence: false,
        topAccount: false,
        topAccountintelligence: true,
      };
      setSubmenu(obj);

      localStorage.setItem("isSubmenu", JSON.stringify(obj));
    }
  }, []);

  React.useEffect(() => {
    getWalletFunction();
  }, []);

  const getWalletFunction = () => {
    let status = JSON.parse(localStorage.getItem("addWallet"));
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
    const isDummy = localStorage.getItem("lochDummyUser");
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
    props.history.push("/profile");
  };

  const handleCohort = () => {
    setCohort(!cohort);
    // console.log("cohort")
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

  const openSigninModal = () => {
    setSignupModal(false);
    setSigninModal(true);

    SigninMenu({
      session_id: getCurrentUser().id,
    });
  };
  const onCloseModal = () => {
    setSignInModalAnimation(true);
    setSigninModal(false);
    setSignupModal(false);
  };

  const openSignUpModal = () => {
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
  const handleShare = () => {
    const user = JSON.parse(localStorage.getItem("lochUser"));
    let userWallet = JSON.parse(localStorage.getItem("addWallet"));
    let slink =
      userWallet?.length === 1
        ? userWallet[0].displayAddress || userWallet[0].address
        : getCurrentUser().id;
    const link = `${BASE_URL_S3}home/${slink}`;
    navigator.clipboard.writeText(link);
    toast.success("Share link has been copied");
  };

  React.useEffect(() => {
    let currency = JSON.parse(localStorage.getItem("currency"));

    if (!currency) {
      localStorage.setItem(
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

      setCurrency(JSON.parse(localStorage.getItem("currency")));
    }

    setTimeout(() => {
      //  console.log("curr", currency);
      let currencyRates = JSON.parse(localStorage.getItem("currencyRates"));
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
    let isPopup = JSON.parse(localStorage.getItem("isPopup"));

    setTimeout(() => {
      // if isPopupActive = true then do not open this popup bcoz any other popup still open
      let isPopupActive = JSON.parse(localStorage.getItem("isPopupActive"));
      lochUser = JSON.parse(localStorage.getItem("lochUser"));
      if (!isPopupActive) {
        // console.log("inactive popup", isPopupActive);
        if (!lochUser) {
          // GeneralPopup({
          //   session_id: getCurrentUser().id,
          //   from: history.location.pathname.substring(1),
          // });
          // isPopup && handleSiginPopup();
          // localStorage.setItem("isPopup", false);
          if (isPopup) {
            handleSiginPopup();
            localStorage.setItem("isPopup", false);
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
    let currencyRates = JSON.parse(localStorage.getItem("currencyRates"));
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
      localStorage.setItem("currency", JSON.stringify(currency));
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
    userPlan = JSON.parse(localStorage.getItem("currentPlan"));
  };

  const handleConnectModal = () => {
    setconnectModal(!connectModal);
  };

  // if user are in these pages means user in ME tab
  let isMeActive = [
    "/intelligence/transaction-history",
    "/intelligence#netflow",
    "/intelligence",
    "/intelligence/volume-traded-by-counterparty",
    "/intelligence/insights",
    "/intelligence/costs",
    "/intelligence/asset-value",
    "/home",
    "/profile",
    "/decentralized-finance",
  ].includes(activeTab);

  let isDiscoverActive = [
    "/whale-watch",
    "/top-accounts",
    "/twitter-influencers",
    "/watchlist",
  ].includes(activeTab);

  let isTopAccountActive = [
    "/top-accounts/home",
    "/top-accounts/intelligence/transaction-history",
    "/top-accounts/intelligence#netflow",
    "/top-accounts/intelligence",
    "/top-accounts/intelligence/volume-traded-by-counterparty",
    "/top-accounts/intelligence/insights",
    "/top-accounts/intelligence/costs",
    "/top-accounts/intelligence/asset-value",
    "/top-accounts/decentralized-finance",
  ].includes(activeTab);

  const [showDiscoverpopup, setDiscoverPopup] = React.useState(true);
  const handleClose = () => {
    setDiscoverPopup(false);
  };
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

  return (
    <>
      <div className="sidebar-section">
        {/* <Container className={`${activeTab === "/home" ? "no-padding" : ""}`}> */}
        <Container className={"no-padding"}>
          <div className="sidebar">
            <div style={{ width: "100%", height: "100%" }}>
              <div
                // className={`logo ${activeTab === "/home" ? "home-topbar" : ""}`}
                className={`logo home-topbar`}
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
              {/* {selectedPlan?.name !== "Free" && (
                  <div className={`sidebar-plan`}> */}
              {/* <Image src={BaronIcon} /> */}
              {/* <h3>
                      Loch <span>{selectedPlan.name}</span>
                    </h3>
                  </div>
                )} */}

              <div
                className={
                  props.ownerName ? "sidebar-body" : "sidebar-body nowallet"
                }
              >
                {/* menu tab */}
                <div
                  style={{
                    padding: "0rem 2.4rem",
                    paddingRight: "2.8rem",
                    position: "relative",
                    marginBottom: "0.5rem",
                  }}
                >
                  <div className="menu-tab-wrapper">
                    <div
                      className={`tab ${isSubmenu.discover ? "active" : ""}`}
                      onClick={handleDiscoverSubmenu}
                    >
                      <Image src={CompassIcon} />
                      <h4 className="inter-display-semi-bold f-s-13 lh-16 grey-7C7">
                        Discover
                      </h4>
                    </div>
                    <div
                      className={`tab ${isSubmenu.me ? "active" : ""}`}
                      onClick={handleMeSubmenu}
                    >
                      <Image src={ProfileIcon} />
                      <h4 className="inter-display-semi-bold f-s-13 lh-16 grey-7C7">
                        Me
                      </h4>
                    </div>
                  </div>
                  {/* hide below tooltip to test tab */}
                  {/* {isSubmenu.me && showDiscoverpopup && (
                    <div className="discover-tooltip">
                      <Image src={DiscoverIcon} />
                      Change here to <br />
                      discover alpha
                      <Image
                        src={Close}
                        className="tooltip-close"
                        onClick={handleClose}
                      />
                    </div>
                  )} */}
                </div>
                <div className="scroll-menu-wrapper">
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
                                // console.log("user",getCurrentUser())
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
                              exact={true}
                              className={`nav-link
                        ${
                          activeTab === "/intelligence/transaction-history"
                            ? "active"
                            : ""
                        }
                        ${
                          activeTab ===
                          "/intelligence/volume-traded-by-counterparty"
                            ? "active"
                            : ""
                        }
                        ${
                          activeTab === "/intelligence/insights" ? "active" : ""
                        } ${
                                activeTab === "/intelligence/asset-value"
                                  ? "active"
                                  : ""
                              } ${
                                activeTab === "/intelligence/costs"
                                  ? "active"
                                  : ""
                              }
                        `}
                              to="/intelligence"
                              activeclassname="active"
                              onClick={(e) => {
                                if (!isWallet) {
                                  e.preventDefault();
                                } else {
                                  IntelligenceMenu({
                                    session_id: getCurrentUser().id,
                                    email_address: getCurrentUser().email,
                                  });
                                }
                              }}
                            >
                              <Image
                                src={
                                  [
                                    "/intelligence/transaction-history",
                                    "/intelligence",
                                    "/intelligence/volume-traded-by-counterparty",
                                    "/intelligence/insights",
                                    "/intelligence/costs",
                                    "/intelligence/asset-value",
                                  ].includes(activeTab)
                                    ? ActiveIntelligenceIcon
                                    : IntelligenceIcon
                                }
                              />
                              Intelligence
                              <Image
                                src={arrowUp}
                                className={`arrow-menu ${
                                  isSubmenu?.intelligence ? "show-submenu" : ""
                                }`}
                                onClick={(e) => {
                                  e.preventDefault();

                                  handleIntelligentSubmenu();
                                }}
                              />
                            </NavLink>
                          </li>

                          {isSubmenu?.intelligence && (
                            <>
                              <li className="sub-menu">
                                <NavLink
                                  exact={true}
                                  onClick={(e) => {
                                    if (!isWallet) {
                                      e.preventDefault();
                                    } else {
                                      MenuIntNetflow({
                                        session_id: getCurrentUser().id,
                                        email_address: getCurrentUser().email,
                                      });
                                    }
                                  }}
                                  className={`nav-link ${
                                    activeTab === "/intelligence" ? "none" : ""
                                  }`}
                                  to="/intelligence#netflow"
                                  activeclassname="active"
                                >
                                  Net flows
                                </NavLink>
                              </li>
                              <li className="sub-menu">
                                <NavLink
                                  exact={true}
                                  onClick={(e) => {
                                    if (!isWallet) {
                                      e.preventDefault();
                                    } else {
                                      MenuIntTransactionHistory({
                                        session_id: getCurrentUser().id,
                                        email_address: getCurrentUser().email,
                                      });
                                    }
                                  }}
                                  className="nav-link"
                                  to="/intelligence/transaction-history"
                                  activeclassname="active"
                                >
                                  Transaction history
                                </NavLink>
                              </li>
                              <li className="sub-menu">
                                <NavLink
                                  exact={true}
                                  onClick={(e) => {
                                    if (!isWallet) {
                                      e.preventDefault();
                                    } else {
                                      MenuIntAssetValue({
                                        session_id: getCurrentUser().id,
                                        email_address: getCurrentUser().email,
                                      });
                                    }
                                  }}
                                  className="nav-link"
                                  to="/intelligence/asset-value"
                                  activeclassname="active"
                                >
                                  Asset value over time
                                </NavLink>
                              </li>
                              <li className="sub-menu">
                                <NavLink
                                  exact={true}
                                  onClick={(e) => {
                                    if (!isWallet) {
                                      e.preventDefault();
                                    } else {
                                      MenuIntInsight({
                                        session_id: getCurrentUser().id,
                                        email_address: getCurrentUser().email,
                                      });
                                    }
                                  }}
                                  className="nav-link"
                                  to="/intelligence/insights"
                                  activeclassname="active"
                                >
                                  Insights
                                </NavLink>
                              </li>
                              <li className="sub-menu">
                                <NavLink
                                  exact={true}
                                  onClick={(e) => {
                                    if (!isWallet) {
                                      e.preventDefault();
                                    } else {
                                      MenuIntCosts({
                                        session_id: getCurrentUser().id,
                                        email_address: getCurrentUser().email,
                                      });
                                    }
                                  }}
                                  className="nav-link"
                                  to="/intelligence/costs"
                                  activeclassname="active"
                                >
                                  Costs
                                </NavLink>
                              </li>
                            </>
                          )}

                          <li>
                            <NavLink
                              className={`nav-link ${!isDefi ? "none" : ""}`}
                              to={`${!isDefi ? "#" : "/decentralized-finance"}`}
                              onClick={(e) => {
                                DeFiMenu({
                                  session_id: getCurrentUser().id,
                                  email_address: getCurrentUser().email,
                                });
                                if (!isDefi) {
                                  upgradeModal();
                                }
                                if (!isWallet) {
                                  e.preventDefault();
                                }
                              }}
                              activeclassname={`${!isDefi ? "none" : "active"}`}
                              // className="nav-link none"
                              // to="#"
                              // activeclassname="none"
                            >
                              <Image
                                src={
                                  activeTab === "/decentralized-finance"
                                    ? DefiIcon
                                    : DefiIcon
                                }
                                style={
                                  activeTab === "/decentralized-finance"
                                    ? {
                                        filter: "brightness(0)",
                                      }
                                    : {}
                                }
                              />
                              DeFi
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              exact={true}
                              onClick={(e) => {
                                if (!isWallet) {
                                  e.preventDefault();
                                } else {
                                  YieldOpportunitiesMenu({
                                    session_id: getCurrentUser().id,
                                    email_address: getCurrentUser().email,
                                  });
                                }
                              }}
                              className="nav-link"
                              to="/yield-opportunities"
                              activeclassname="active"
                            >
                              <Image
                                src={CoinsIcon}
                                style={
                                  activeTab === "/yield-opportunities"
                                    ? {
                                        filter: "brightness(0)",
                                      }
                                    : {}
                                }
                              />
                              Yield Opportunities
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              exact={true}
                              onClick={(e) => {
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
                      {/* <li>
                      <NavLink
                        exact={true}
                        onClick={handleDiscoverSubmenu}
                        className={`nav-link ${isDiscoverActive ? "" : "none"}`}
                        to="#"
                        activeclassname={`${
                          isDiscoverActive ? "active" : "none"
                        }`}
                      >
                        <Image
                          src={isDiscoverActive ? ActiveCohortIcon : CohortIcon}
                        />
                        Dicover
                        <Image
                          src={arrowUp}
                          className={`arrow-menu ${
                            isSubmenu?.discover ? "show-submenu" : ""
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            handleDiscoverSubmenu();
                          }}
                        />
                      </NavLink>
                    </li> */}
                      {isSubmenu.discover && (
                        <>
                          <li>
                            <NavLink
                              className="nav-link"
                              to={"/whale-watch"}
                              onClick={(e) => {
                                if (!isWallet) {
                                  e.preventDefault();
                                } else {
                                  MenuWhale({
                                    email_address: getCurrentUser().email,
                                    session_id: getCurrentUser().id,
                                  });
                                }
                              }}
                              activeclassname="active"
                            >
                              <Image
                                src={
                                  activeTab === "/whale-watch"
                                    ? ActiveCohortIcon
                                    : CohortIcon
                                }
                              />
                              Whale watch
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              className={`nav-link`}
                              to="/top-accounts"
                              onClick={(e) => {
                                if (!isWallet) {
                                  e.preventDefault();
                                } else {
                                  MenuTopAccounts({
                                    session_id: getCurrentUser().id,
                                    email_address: getCurrentUser().email,
                                  });
                                }
                              }}
                              activeclassname="active"
                            >
                              <Image
                                src={StarIcon}
                                style={
                                  activeTab === "/top-accounts"
                                    ? {
                                        filter: "brightness(0)",
                                      }
                                    : {}
                                }
                              />
                              Top accounts
                              {previewAddress?.address && (
                                <Image
                                  src={arrowUp}
                                  className={`arrow-menu ${
                                    isSubmenu?.topAccount ? "show-submenu" : ""
                                  }`}
                                  onClick={(e) => {
                                    e.preventDefault();

                                    handleTopAccountSubmenu();
                                  }}
                                />
                              )}
                            </NavLink>
                          </li>
                          {isSubmenu.topAccount && previewAddress?.address && (
                            <>
                              <li className="sub-menu">
                                <NavLink
                                  exact={true}
                                  className="nav-link"
                                  to={
                                    activeTab === "/top-accounts/home"
                                      ? "#"
                                      : "/top-accounts/home"
                                  }
                                  onClick={(e) => {
                                    // console.log("user",getCurrentUser())
                                    if (!isWallet) {
                                      e.preventDefault();
                                    } else {
                                      MenuTopAccountsHome({
                                        session_id: getCurrentUser().id,
                                        email_address: getCurrentUser().email,
                                      });
                                    }
                                  }}
                                  activeclassname="active"
                                >
                                  <Image
                                    src={
                                      activeTab === "/top-accounts/home"
                                        ? ActiveHomeIcon
                                        : InActiveHomeIcon
                                    }
                                  />
                                  Home
                                </NavLink>
                              </li>
                              <li className="sub-menu">
                                <NavLink
                                  exact={true}
                                  className={`nav-link
                        ${
                          activeTab ===
                          "/top-accounts/intelligence/transaction-history"
                            ? "active"
                            : ""
                        }
                        ${
                          activeTab ===
                          "/top-accounts/intelligence/volume-traded-by-counterparty"
                            ? "active"
                            : ""
                        }
                        ${
                          activeTab === "/top-accounts/intelligence/insights"
                            ? "active"
                            : ""
                        } ${
                                    activeTab ===
                                    "/top-accounts/intelligence/asset-value"
                                      ? "active"
                                      : ""
                                  } ${
                                    activeTab ===
                                    "/top-accounts/intelligence/costs"
                                      ? "active"
                                      : ""
                                  }
                        `}
                                  to="/top-accounts/intelligence"
                                  activeclassname="active"
                                  onClick={(e) => {
                                    if (!isWallet) {
                                      e.preventDefault();
                                    } else {
                                      MenuTopAccountsInt({
                                        session_id: getCurrentUser().id,
                                        email_address: getCurrentUser().email,
                                      });
                                    }
                                  }}
                                >
                                  <Image
                                    src={
                                      [
                                        "/top-accounts/intelligence/transaction-history",
                                        "/top-accounts/intelligence",
                                        "/top-accounts/intelligence/volume-traded-by-counterparty",
                                        "/top-accounts/intelligence/insights",
                                        "/top-accounts/intelligence/costs",
                                        "/top-accounts/intelligence/asset-value",
                                      ].includes(activeTab)
                                        ? ActiveIntelligenceIcon
                                        : IntelligenceIcon
                                    }
                                  />
                                  Intelligence
                                  <Image
                                    src={arrowUp}
                                    className={`arrow-menu ${
                                      isSubmenu?.topAccountintelligence
                                        ? "show-submenu"
                                        : ""
                                    }`}
                                    onClick={(e) => {
                                      e.preventDefault();

                                      handleTopAccountIntelligentSubmenu();
                                    }}
                                  />
                                </NavLink>
                              </li>

                              {isSubmenu?.topAccountintelligence && (
                                <>
                                  <li className="sub-menu-level-tow">
                                    <NavLink
                                      exact={true}
                                      onClick={(e) => {
                                        if (!isWallet) {
                                          e.preventDefault();
                                        } else {
                                          MenuTopAccountsNetflow({
                                            session_id: getCurrentUser().id,
                                            email_address:
                                              getCurrentUser().email,
                                          });
                                        }
                                      }}
                                      className={`nav-link ${
                                        activeTab ===
                                        "/top-accounts/intelligence"
                                          ? "none"
                                          : ""
                                      }`}
                                      to="/top-accounts/intelligence#netflow"
                                      activeclassname="active"
                                    >
                                      Net flows
                                    </NavLink>
                                  </li>
                                  <li className="sub-menu-level-tow">
                                    <NavLink
                                      exact={true}
                                      onClick={(e) => {
                                        if (!isWallet) {
                                          e.preventDefault();
                                        } else {
                                          MenuTopAccountsTH({
                                            session_id: getCurrentUser().id,
                                            email_address:
                                              getCurrentUser().email,
                                          });
                                        }
                                      }}
                                      className="nav-link"
                                      to="/top-accounts/intelligence/transaction-history"
                                      activeclassname="active"
                                    >
                                      Transaction history
                                    </NavLink>
                                  </li>
                                  <li className="sub-menu-level-tow">
                                    <NavLink
                                      exact={true}
                                      onClick={(e) => {
                                        if (!isWallet) {
                                          e.preventDefault();
                                        } else {
                                          MenuTopAccountsAssetValue({
                                            session_id: getCurrentUser().id,
                                            email_address:
                                              getCurrentUser().email,
                                          });
                                        }
                                      }}
                                      className="nav-link"
                                      to="/top-accounts/intelligence/asset-value"
                                      activeclassname="active"
                                    >
                                      Asset value over time
                                    </NavLink>
                                  </li>
                                  {/* <li className="sub-menu-level-tow">
                                    <NavLink
                                      exact={true}
                                      onClick={(e) => {
                                        if (!isWallet) {
                                          e.preventDefault();
                                        } else {
                                          MenuTopAccountsInsight({
                                            session_id: getCurrentUser().id,
                                            email_address:
                                              getCurrentUser().email,
                                          });
                                        }
                                      }}
                                      className="nav-link"
                                      to="/top-accounts/intelligence/insights"
                                      activeclassname="active"
                                    >
                                      Insights
                                    </NavLink>
                                  </li> */}
                                  <li className="sub-menu-level-tow">
                                    <NavLink
                                      exact={true}
                                      onClick={(e) => {
                                        if (!isWallet) {
                                          e.preventDefault();
                                        } else {
                                          MenuTopAccountsCosts({
                                            session_id: getCurrentUser().id,
                                            email_address:
                                              getCurrentUser().email,
                                          });
                                        }
                                      }}
                                      className="nav-link"
                                      to="/top-accounts/intelligence/costs"
                                      activeclassname="active"
                                    >
                                      Costs
                                    </NavLink>
                                  </li>
                                </>
                              )}

                              <li className="sub-menu">
                                <NavLink
                                  className={`nav-link ${
                                    !isDefi ? "none" : ""
                                  }`}
                                  to={`${
                                    !isDefi
                                      ? "#"
                                      : "/top-accounts/decentralized-finance"
                                  }`}
                                  onClick={(e) => {
                                    MenuTopAccountsDefi({
                                      session_id: getCurrentUser().id,
                                      email_address: getCurrentUser().email,
                                    });
                                    if (!isDefi) {
                                      upgradeModal();
                                    }
                                    if (!isWallet) {
                                      e.preventDefault();
                                    }
                                  }}
                                  activeclassname={`${
                                    !isDefi ? "none" : "active"
                                  }`}
                                  // className="nav-link none"
                                  // to="#"
                                  // activeclassname="none"
                                >
                                  <Image
                                    src={
                                      activeTab ===
                                      "/top-accounts/decentralized-finance"
                                        ? DefiIcon
                                        : DefiIcon
                                    }
                                    style={
                                      activeTab ===
                                      "/top-account/decentralized-finance"
                                        ? {
                                            filter: "brightness(0)",
                                          }
                                        : {}
                                    }
                                  />
                                  DeFi
                                </NavLink>
                              </li>
                            </>
                          )}

                          {/* <li>
                          <NavLink
                            className={`nav-link`}
                            to="/twitter-influencers"
                            onClick={(e) => {
                              if (!isWallet) {
                                e.preventDefault();
                              } else {
                                MenuTwitterInfluencers({
                                  session_id: getCurrentUser().id,
                                  email_address: getCurrentUser().email,
                                });
                              }
                            }}
                            activeclassname="active"
                          >
                            <Image
                              src={TwitterIcon}
                              style={
                                activeTab === "/twitter-influencers"
                                  ? {
                                      filter: "brightness(0)",
                                    }
                                  : {}
                              }
                            />
                            Twitter influencers
                          </NavLink>
                        </li>
                        */}
                          <li>
                            <NavLink
                              className={`nav-link`}
                              to="/watchlist"
                              onClick={(e) => {
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
                                src={EyeIcon}
                                style={
                                  activeTab === "/watchlist"
                                    ? {
                                        filter: "brightness(0)",
                                      }
                                    : {}
                                }
                              />
                              Watchlist
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              exact={true}
                              onClick={(e) => {
                                if (!isWallet) {
                                  e.preventDefault();
                                } else {
                                  // ProfileMenu({
                                  //   session_id: getCurrentUser().id,
                                  //   email_address: getCurrentUser().email,
                                  // });
                                }
                              }}
                              className="nav-link"
                              to="/transaction-feed"
                              activeclassname="active"
                            >
                              <Image
                                src={NewspaperIcon}
                                style={
                                  activeTab === "/transaction-feed"
                                    ? {
                                        filter: "brightness(0)",
                                      }
                                    : {}
                                }
                              />
                              Transaction feed
                            </NavLink>
                          </li>
                        </>
                      )}
                      {/* <li>
                        <NavLink
                          exact={true}
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

                      <li>
                        <NavLink
                          exact={true}
                          onClick={handleFeedback}
                          className="nav-link none"
                          to="#"
                          activeclassname="none"
                        >
                          <Image src={ActiveFeedbackIcon} />
                          Feedback
                        </NavLink>
                      </li>
                    </ul>
                  </nav>
                  <div className="sidebar-footer">
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
                              <div className="sideBarFooterSignInIconContainer sideBarFooterSignedInIconContainer">
                                <Image
                                  className="sideBarFooterSignInIcon"
                                  src={BlackManIcon}
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
                          >
                            <div className="sideBarFooterSignInIconContainer">
                              <Image
                                className="sideBarFooterSignInIcon"
                                src={GreyManIcon}
                              />
                            </div>
                            <div>Sign in / up</div>
                          </div>
                        )}
                        <li
                          style={{
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span
                            onMouseOver={(e) =>
                              (e.currentTarget.children[0].src =
                                ExportIconWhite)
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.children[0].src = ExportIcon)
                            }
                            onClick={handleExportModal}
                          >
                            <Image src={ExportIcon} />
                            <Button className="inter-display-medium f-s-13 lh-19 navbar-button">
                              Export
                            </Button>
                          </span>
                          {!(
                            lochUser &&
                            (lochUser.email ||
                              lochUser.first_name ||
                              lochUser.last_name)
                          ) ? (
                            <span
                              onClick={handleLeave}
                              onMouseOver={(e) =>
                                (e.currentTarget.children[0].src =
                                  LeaveBlackIcon)
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.children[0].src = LeaveIcon)
                              }
                            >
                              <Image src={LeaveIcon} />
                              <Button className="inter-display-medium f-s-13 lh-19 navbar-button">
                                Leave
                              </Button>
                            </span>
                          ) : null}

                          {/*                   
                                <span
                              // onMouseOver={(e) =>
                              //   (e.currentTarget.children[0].src = SharePortfolioIcon)
                              // }
                              // onMouseLeave={(e) =>
                              //   (e.currentTarget.children[0].src =
                              //     SharePortfolioIconWhite)
                              // }
                              onClick={handleSigninModal}
                              style={{ marginRight: "1rem" }}
                              className="signin"
                            >
                              <Image src={SignInIcon} />
                              <Button className="inter-display-medium f-s-13 lh-19 navbar-button">
                                Sign in
                              </Button>
                            </span>
                          */}
                        </li>
                        <li>
                          <span
                            onMouseOver={(e) =>
                              (e.currentTarget.children[0].src =
                                SharePortfolioIcon)
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.children[0].src =
                                SharePortfolioIconWhite)
                            }
                            onClick={handleShareModal}
                            style={{ marginRight: "1rem" }}
                          >
                            <Image src={SharePortfolioIconWhite} />
                            <Button className="inter-display-medium f-s-13 lh-19 navbar-button">
                              Share
                            </Button>
                          </span>
                        </li>

                        {/* <li>
                    <span
                      onMouseOver={(e) =>
                        (e.currentTarget.children[0].src = ApiBlackIcon)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.children[0].src = ApiIcon)
                      }
                      onClick={handleApiModal}
                    >
                      <Image src={ApiIcon} />
                      <Button className="inter-display-medium f-s-13 lh-19 navbar-button">
                        API
                      </Button>
                    </span>
                  </li> */}
                        {/* {JSON.parse(localStorage.getItem("lochUser")) && (
                  <li
                    onMouseOver={(e) =>
                      (e.currentTarget.children[0].src = ShareProfileDarkIcon)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.children[0].src = DarkmodeIcon)
                    }
                  >
                    <Image src={DarkmodeIcon} />
                    <Button
                      className="inter-display-medium f-s-15 lh-19 navbar-button"
                      onClick={handleShare}
                    >
                      Share Profile
                    </Button>
                  </li>
                )} */}

                        {/* {!lochUser && activeTab !== "/home" && (
                          <span
                            onMouseOver={(e) =>
                              (e.currentTarget.children[0].src = SharePortfolioIcon)
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.children[0].src =
                                SharePortfolioIconWhite)
                            }
                            onClick={handleShareModal}
                            style={{ marginRight: "1rem" }}
                          >
                            <Image src={SharePortfolioIconWhite} />
                            <Button className="inter-display-medium f-s-13 lh-19 navbar-button">
                              Share
                            </Button>
                          </span>
                        )} */}
                        {/* </li> */}
                      </ul>
                    )}

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
                </div>

                {/* {props.ownerName &&
                        <div className="nav-addwallet">
                            <Image fluid src={bgImg} />
                            <div className='wallet-info-para'>
                                <p>Viewing in Demo Mode</p>
                                <p>Showing sample data based
                                    on <span>{props.ownerName}</span> wallet</p>
                                <Button className='addwallet-btn'>Add wallet</Button>
                            </div>
                        </div> } */}
              </div>
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
          isShare={localStorage.getItem("share_id")}
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
          modalAnimation={false}
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

      {signinPopup ? (
        <SidebarModal
          trackPos={trackPos}
          dragPosition={dragPosition}
          show={signinPopup}
          onHide={handleSiginPopup}
          history={history}
          popupType="general_popup"
          tracking={history.location.pathname.substring(1)}
        />
      ) : null}
    </>
  );
}

export default Sidebar;
