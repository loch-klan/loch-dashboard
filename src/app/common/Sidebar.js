import React from 'react'
import { Image, Container, Button, DropdownButton, Dropdown } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
// import logo from '../../image/logo.png'
import logo from '../../image/Loch.svg'
import SignInIcon from "../../assets/images/icons/ActiveProfileIcon.svg";
import ActiveHomeIcon from '../../image/HomeIcon.svg'
import InActiveHomeIcon from '../../assets/images/icons/InactiveHomeIcon.svg'
import ActiveIntelligenceIcon from '../../assets/images/icons/ActiveIntelligenceIcon.svg';
import IntelligenceIcon from '../../assets/images/icons/InactiveIntelligenceIcon.svg';
import NavWalletIcon from '../../assets/images/icons/InactiveWalletIcon.svg'
import ActiveWalletIcon from '../../assets/images/icons/ActiveWalletIcon.svg'
import ProfileIcon from '../../assets/images/icons/InactiveProfileIcon.svg'
import ActiveProfileIcon from '../../assets/images/icons/ActiveProfileIcon.svg'
import DollarIcon from '../../assets/images/icons/InactiveCostIcon.svg'
import DefiIcon from "../../assets/images/icons/defi-icon.svg";
import ActiveDollarIcon from '../../assets/images/icons/ActiveCostIcon.svg'
import CohortIcon from "../../assets/images/icons/cohort.svg";
import ActiveCohortIcon from "../../assets/images/icons/active-cohort.svg";
import ActiveFeedbackIcon from "../../assets/images/icons/feedback.svg";

import ExportIcon from '../../assets/images/icons/ExportIcon.svg'
import SharePortfolioIcon from '../../assets/images/icons/SharePortfolioIcon.svg'
import SharePortfolioIconWhite from '../../assets/images/icons/SharePortfolioIconWhite.svg'
import ExportIconWhite from '../../assets/images/icons/ExportBlackIcon.svg'
import ApiIcon from '../../assets/images/icons/ApiIcon.svg'
import ApiBlackIcon from '../../assets/images/icons/ApiBlackIcon.svg'
import LeaveIcon from '../../assets/images/icons/LeaveIcon.svg'
import LeaveBlackIcon from '../../assets/images/icons/LeaveBlackIcon.svg'
import DarkmodeIcon from '../../assets/images/icons/DarkmodeIcon.svg'
import ShareProfileDarkIcon from '../../assets/images/icons/ShareProfileDarkIcon.svg'
import bgImg from '../../image/Notice.png'
import {useHistory} from 'react-router-dom'
import ExitOverlay from './ExitOverlay'
import { BASE_URL_S3 } from '../../utils/Constant'
import { toast } from 'react-toastify'
import ApiModalIcon from '../../assets/images/icons/ApiModalIcon.svg';
import ConnectModalIcon from '../../assets/images/icons/connectIcon.svg';
import LinkIcon from "../../assets/images/icons/link.svg";
import BaronIcon from "../../assets/images/icons/baron-logo.svg";

import ConfirmLeaveModal from './ConformLeaveModal';
import { getCurrentUser } from "../../utils/ManageToken";
import {
    IntelligenceMenu,
    WalletsMenu,
    CostsMenu,
    ProfileMenu,
    ExportMenu,
  HomeMenu,
  MenuApi,
  MenuDarkMode,
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
} from "../../utils/AnalyticsFunctions.js";
import SharePortfolio from './SharePortfolio'
import DropDown from './DropDown'
import { getAllCurrencyApi, getAllCurrencyRatesApi, PopupState, setCurrencyApi } from './Api'
import { setCurrencyReducer } from './CommonAction'
import FeedbackModal from './FeedbackModal'
import UpgradeModal from './upgradeModal'
import ConnectModal from './ConnectModal'
import AuthModal from './AuthModal';
import SignInPopupIcon from "../../assets/images/icons/loch-icon.svg"


function Sidebar(props) {
// console.log('props',props);

  const activeTab = window.location.pathname;
  // console.log("active", activeTab)
    const history = useHistory();
    const [leave, setLeave] = React.useState(false);
    const [apiModal,setApiModal] = React.useState(false);
    const [exportModal,setExportModal] = React.useState(false)
  const [shareModal, setShareModal] = React.useState(false);
      const [signinModal, setSigninModal] = React.useState(false);
    const [confirmLeave,setConfirmLeave] = React.useState(false)
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [currencyList, setAllCurrencyList] = React.useState([]);
     const [cohort, setCohort] = React.useState(false);
  const [showFeedbackModal, setFeedbackModal] = React.useState(false);
    const [selectedCurrency, setCurrency] = React.useState(JSON.parse(localStorage.getItem('currency')));
  let lochUser = JSON.parse(localStorage.getItem('lochUser'));
  const [Upgrade, setUpgradeModal] = React.useState(false);
  const [connectModal, setconnectModal] = React.useState(false);
  const [isWallet, setWallet] = React.useState(JSON.parse(localStorage.getItem("addWallet")) ? true:false);
  const [signinPopup, setSigninPopup] = React.useState(false);
  let userPlan = JSON.parse(localStorage.getItem("currentPlan")) || "Free";
  let triggerId = 6;
  let defi_access = JSON.parse(localStorage.getItem("defi_access"));
  let isDefi = (userPlan?.defi_enabled || defi_access);
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
 
  
  
   React.useEffect(() => {
     getWalletFunction();
   }, []);
  
  const getWalletFunction = () => {
    
    let status = JSON.parse(localStorage.getItem("addWallet"));
    if (status) {
      setWallet(true)
  // console.log("wallet", isWallet);
    } else {
      setTimeout(() => {
        getWalletFunction();
      }, 2000);
    }

  };

  
  
    const handleLeave = () => {
      const isDummy = localStorage.getItem("lochDummyUser");
      // console.log("isDummy user", isDummy)
        MenuLeave({
          session_id: getCurrentUser().id,
          email_address: getCurrentUser().email,
        });
      if(isDummy){
        setLeave(!leave)
      } else{
        setConfirmLeave(!confirmLeave)
        // props.history.push('/welcome');
      }
    }
  
  const handleCohort = () => {
    setCohort(!cohort);
    // console.log("cohort")
  }

    const handleApiModal = ()=>{
        setApiModal(!apiModal);
        MenuApi({
          session_id: getCurrentUser().id,
          email_address: getCurrentUser().email,
        });
    }
    const handleConfirmLeaveModal = () =>{
      setConfirmLeave(!confirmLeave)
       
    }
    const handleExportModal = ()=>{
        setExportModal(!exportModal);
        ExportMenu({ session_id: getCurrentUser().id, email_address: getCurrentUser().email });
    }
  const handleFeedback = () => {
    setFeedbackModal(!showFeedbackModal);
    // console.log("clicked modal")
    FeedbackMenu({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
  };
    const handleShareModal = ()=>{
        setShareModal(!shareModal);
        // ExportMenu({ session_id: getCurrentUser().id, email_address: getCurrentUser().email });
      MenuShare({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
    }
  
   const handleSigninModal = () => {
     setSigninModal(!signinModal);
     // ExportMenu({ session_id: getCurrentUser().id, email_address: getCurrentUser().email });
    //  MenuShare({
    //    session_id: getCurrentUser().id,
    //    email_address: getCurrentUser().email,
    //  });
     SigninMenu({
       session_id: getCurrentUser().id,
     });
   };
  const handleSiginPopup = () => {
    setSigninPopup(!signinPopup);
  }
    const handleShare=()=>{
      const user = JSON.parse(localStorage.getItem('lochUser'));
        let userWallet = JSON.parse(localStorage.getItem("addWallet"));
        let slink =
          userWallet?.length === 1
            ? userWallet[0].displayAddress || userWallet[0].address
            : user.link;
      const link = `${BASE_URL_S3}home/${slink}`;
      navigator.clipboard.writeText(link);
      toast.success("Share link has been copied");
    }

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
          };
          
        }
      } else {
        //  if popup active then run same function
        // console.log("active popup");
        SiginModal();
      }
     
    }, 15000);
  }

    const handleFunction=(currency)=>{
      let currencyRates = JSON.parse(localStorage.getItem('currencyRates'))
      for (const [key, value] of Object.entries(currencyRates.rates)) {
        // console.log(`${key}: ${value}`);
        if(key === currency.code){
          currency = {
            ...currency,
            rate: value
          }
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
     
    }
    const quotes = [
        "Sic Parvis Magna | Thus, great things from small things come.",
        "The discipline of desire is the background of character.",
        "No man's knowledge here can go beyond his experience.",
        "The only fence against the world is a thorough knowledge of it.",
        "I have always thought the actions of men the best interpreters of their thoughts",
        "Wherever Law ends, Tyranny begins."
    ];
    const authors = [
        "Sir Francis Drake",
        "John Locke",
        "John Locke",
        "John Locke",
        "John Locke",
        "John Locke"
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

        return()=>clearInterval(interval);
    }, [currentIndex]);
  
  const upgradeModal = () => {
    setUpgradeModal(!Upgrade);
    userPlan = JSON.parse(localStorage.getItem("currentPlan"));
  };
  
  const handleConnectModal = () => {
      setconnectModal(!connectModal);
  };
    
      return (
        <div className="sidebar-section">
          <Container className={`${
                    activeTab === "/home" ? "no-padding" : ""
                  }`}>
            <div className="sidebar">
              <div style={{ width: "100%" }}>
                <div
                  className={`logo ${
                    activeTab === "/home" ? "home-topbar" : ""
                  }`}
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
                            selectedCurrency.symbol +
                            " " +
                            selectedCurrency.code,
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
                  <nav>
                    <ul>
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
                            activeTab === "/intelligence/costs" ? "active" : ""
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
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          exact={true}
                          onClick={(e) => {
                            if (!isWallet) {
                              e.preventDefault();
                            } else {
                              WalletsMenu({
                                session_id: getCurrentUser().id,
                                email_address: getCurrentUser().email,
                              });
                            }
                          }}
                          className="nav-link"
                          to="/wallets"
                          activeclassname="active"
                        >
                          <Image
                            src={
                              activeTab === "/wallets"
                                ? ActiveWalletIcon
                                : NavWalletIcon
                            }
                          />
                          Wallets
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
                      <li>
                        <NavLink
                          className="nav-link"
                          to={"/whale-watching"}
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
                              activeTab === "/whale-watching"
                                ? ActiveCohortIcon
                                : CohortIcon
                            }
                          />
                          Whale Watching
                        </NavLink>
                      </li>

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
              <div className="sidebar-footer">
                <ul>
                  <li style={{ justifyContent: "space-between" }}>
                    <span
                      onMouseOver={(e) =>
                        (e.currentTarget.children[0].src = ExportIconWhite)
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
                    {lochUser ? (
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
                    ) : (
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
                    )}
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

                  <li style={{ justifyContent: "space-between" }}>
                    <span
                      onClick={handleLeave}
                      onMouseOver={(e) =>
                        (e.currentTarget.children[0].src = LeaveBlackIcon)
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
                    {!lochUser && (
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
                    )}
                  </li>
                </ul>

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
                <div className="inter-display-semi-bold f-s-15 grey-B0B lh-19 footer-divTwo m-b-40">
                  {authors[currentIndex]}
                </div>

                {/* <p className='inter-display-medium f-s-15 grey-CAC lh-19' style={{fontStyle: "italic"}}>Sic Parvis Magna <span style={{fontStyle: "normal"}}>|</span>  </p>
                        <p className='inter-display-medium f-s-15 grey-CAC lh-19'>Thus, great things from small things come.</p>
                        <p className='inter-display-semi-bold f-s-15 grey-B0B lh-19'>Sir Francis Drake</p> */}
              </div>
            </div>
          </Container>

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
              show={signinModal}
              onHide={handleSigninModal}
              history={history}
              modalType={"create_account"}
              iconImage={SignInIcon}
              hideSkip={true}
              title="Sign in"
              description="Get right back into your account"
              stopUpdate={true}
              tracking="Sign in button"
            />
          ) : (
            ""
          )}

          {/* after 15 sec open this */}
          {signinPopup ? (
            <AuthModal
              show={signinPopup}
              onHide={handleSiginPopup}
              history={history}
              modalType={"create_account"}
              iconImage={SignInPopupIcon}
              hideSkip={true}
              title="Don’t lose your data"
              description="Don’t let your hard work go to waste. Add your email so you can analyze your portfolio with superpowers"
              stopUpdate={true}
              popupType="general_popup"
              tracking={history.location.pathname.substring(1)}
            />
          ) : (
            ""
          )}
        </div>
      );
}

export default Sidebar
