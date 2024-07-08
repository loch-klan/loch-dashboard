import React, { Component } from "react";
import { connect } from "react-redux";
import Loading from "../common/Loading";
import { getAllCoins } from "../onboarding/Api.js";
// add wallet
import { Col, Image, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import arrowUp from "../../assets/images/arrow-up.svg";
import Coin3 from "../../assets/images/icons/temp-coin-2.svg";
import Coin2 from "../../assets/images/icons/temp-coin1.svg";
import sortByIcon from "../../assets/images/icons/triangle-down.svg";
import AddWalletModalIcon from "../../assets/images/icons/wallet-icon.svg";
import {
  DefiCredit,
  DefiDebt,
  DefiShare,
  DefiSortByAmount,
  DefiSortByName,
  PageviewDefi,
  TimeSpentDefi,
} from "../../utils/AnalyticsFunctions";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import { AssetType, BASE_URL_S3 } from "../../utils/Constant";
import { getCurrentUser } from "../../utils/ManageToken";
import {
  amountFormat,
  convertNtoNumber,
  CurrencyType,
  mobileCheck,
  numToCurrency,
  scrollToTop,
} from "../../utils/ReusableFunctions";
import { setPageFlagDefault, updateWalletListFlag } from "../common/Api";
import FixAddModal from "../common/FixAddModal";
import PageHeader from "../common/PageHeader";
import UpgradeModal from "../common/upgradeModal";
import { getProtocolBalanceApi } from "../Portfolio/Api";
import WelcomeCard from "../Portfolio/WelcomeCard";
import { getAllWalletListApi } from "../wallet/Api";
import { updateDefiData } from "./Api";
import TopWalletAddressList from "../header/TopWalletAddressList.js";
import MobileLayout from "../layout/MobileLayout.js";
import DefiMobile from "./DefiMobile.js";

class Defi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defiStateLocally: {},
      // store current currency
      currency: JSON.parse(window.localStorage.getItem("currency")),
      sortBy: [
        { title: "Amount", down: false },
        { title: "Name", down: true },
      ],
      start: 0,
      sorts: [],

      // add new wallet
      userWalletList: window.localStorage.getItem("addWallet")
        ? JSON.parse(window.localStorage.getItem("addWallet"))
        : [],
      addModal: false,
      isUpdate: 0,
      apiResponse: false,

      upgradeModal: false,
      userPlan:
        JSON.parse(window.localStorage.getItem("currentPlan")) || "Free",

      // defi

      isYeildToggle: false,
      isDebtToggle: false,
      triggerId: 6,

      // time spent
      startTime: "",
    };
  }
  upgradeModal = () => {
    this.setState(
      {
        upgradeModal: !this.state.upgradeModal,
        userPlan: JSON.parse(window.localStorage.getItem("currentPlan")),
      },
      () => {
        if (!this.state.upgradeModal) {
          this.props.history.push("/home");
        }
      }
    );
  };
  toggleYield = () => {
    if (!this.state.isYeildToggle) {
      DefiCredit({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
      this.updateTimer();
    }
    this.setState({
      isYeildToggle: !this.state.isYeildToggle,
      // isDebtToggle: false,
    });
  };

  toggleDebt = () => {
    if (!this.state.isDebtToggle) {
      DefiDebt({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
      this.updateTimer();
    }
    this.setState({
      isDebtToggle: !this.state.isDebtToggle,
      // isYeildToggle: false,
    });
  };

  startPageView = () => {
    // Inactivity Check
    window.checkDefiTimer = setInterval(() => {
      this.checkForInactivity();
    }, 900000);
    this.setState({ startTime: new Date() * 1 });
    PageviewDefi({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
  };
  componentDidMount() {
    // if (mobileCheck()) {
    //   this.props.history.push("/home");
    // }
    // if (this.state.userPlan?.defi_enabled) {
    //   this.props.getAllCoins();
    //   // getAllProtocol(this);
    //   this.getYieldBalance();
    // } else {
    //   this.handleReset();
    //   this.upgradeModal();
    // }

    this.props.getAllCoins();

    this.startPageView();
    this.updateTimer(true);

    scrollToTop();
    if (this.props.defiState && this.props.commonState.defi) {
      this.setState({
        defiStateLocally: this.props.defiState,
      });
    }
    return () => {
      clearInterval(window.checkDefiTimer);
    };
  }
  updateTimer = (first) => {
    const tempExistingExpiryTime =
      window.localStorage.getItem("defiPageExpiryTime");
    if (!tempExistingExpiryTime && !first) {
      this.startPageView();
    }
    const tempExpiryTime = Date.now() + 1800000;
    window.localStorage.setItem("defiPageExpiryTime", tempExpiryTime);
  };
  endPageView = () => {
    clearInterval(window.checkDefiTimer);
    window.localStorage.removeItem("defiPageExpiryTime");
    if (this.state.startTime) {
      let endTime = new Date() * 1;
      let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds

      TimeSpentDefi({
        time_spent: TimeSpent,
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
    }
  };
  checkForInactivity = () => {
    const tempExpiryTime = window.localStorage.getItem("defiPageExpiryTime");
    if (tempExpiryTime && tempExpiryTime < Date.now()) {
      this.endPageView();
    }
  };
  componentWillUnmount() {
    const tempExpiryTime = window.localStorage.getItem("defiPageExpiryTime");
    if (tempExpiryTime) {
      this.endPageView();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // add wallet
    if (prevProps.defiState !== this.props.defiState) {
      this.setState({
        defiStateLocally: this.props.defiState,
      });
    }
    if (!this.props.commonState.defi) {
      this.props.updateDefiData({
        totalYield: 0,
        totalDebt: 0,
        cardList: [],
        sortedList: [],
        DebtValues: [],
        YieldValues: [],
        BalanceSheetValue: {},
        defiList: "",
      });

      // set defi page to true
      this.props.updateWalletListFlag("defi", true);
      this.setState(
        {
          isYeildToggle: false,
          isDebtToggle: false,
          apiResponse: false,
        },
        () => {
          //  getAllProtocol(this);
          this.getYieldBalance();

          let tempData = new URLSearchParams();
          tempData.append("start", 0);
          tempData.append("conditions", JSON.stringify([]));
          tempData.append("limit", 50);
          tempData.append("sorts", JSON.stringify([]));
          this.props.getAllWalletListApi(tempData, this);
        }
      );
    } else {
      let defi_access = JSON.parse(window.localStorage.getItem("defi_access"));
      if (this.state.userPlan?.name === "Free" && defi_access) {
        setTimeout(() => {
          this.setState(
            {
              isStatic: true,
            },
            () => {
              this.upgradeModal();
              window.localStorage.setItem("defi_access", false);
            }
          );
        }, 10000);
      }
    }
  }
  sortArray = (key, order) => {
    let array = [...this.state.defiStateLocally?.defiList];
    if (array) {
      let sortedList = array.sort((a, b) => {
        let valueA = a[key] ? a[key] : 0;
        let valueB = b[key] ? b[key] : 0;
        if (key === "created_on") {
          valueA = new Date(valueA);
          valueB = new Date(valueB);
        } else if (key === "name") {
          valueA = valueA.toLowerCase();
          valueB = valueB.toLowerCase();
          return order
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        } else if (key === "netBalance") {
          valueA = parseFloat(valueA);
          valueB = parseFloat(valueB);
        }
        if (order) {
          return valueA - valueB;
        } else {
          return valueB - valueA;
        }
      });
      // this.props.updateDefiData({ sortedList });
      this.updateDefiDataLocally(sortedList);
    }
  };
  updateDefiDataLocally = (sortedList) => {
    this.setState({
      defiStateLocally: {
        ...this.state.defiStateLocally,
        defiList: sortedList,
      },
    });
  };
  handleSort = (e) => {
    // down == true means ascending and down == false means descending
    let isDown = true;
    let sort = [...this.state.sortBy];
    sort.map((el) => {
      if (el.title === e.title) {
        el.down = !el.down;
        isDown = el.down;
      } else {
        el.down = true;
      }
    });

    if (e.title === "Amount") {
      this.sortArray("netBalance", isDown);
      this.setState({
        sortBy: sort,
      });
      DefiSortByAmount({
        email_address: getCurrentUser().email,
        session_id: getCurrentUser().id,
      });
      this.updateTimer();
    } else if (e.title === "Date added") {
      this.sortArray("created_on", isDown);
      this.setState({
        sortBy: sort,
      });
      //   WhaleSortByDate({
      //     email_address: getCurrentUser().email,
      //     session_id: getCurrentUser().id,
      //   });
    } else if (e.title === "Name") {
      this.sortArray("name", isDown);
      this.setState({
        sortBy: sort,
      });
      DefiSortByName({
        email_address: getCurrentUser().email,
        session_id: getCurrentUser().id,
      });
      this.updateTimer();
    }
  };

  getYieldBalance = () => {
    let UserWallet = JSON.parse(window.localStorage.getItem("addWallet"));
    if (UserWallet.length !== 0) {
      const allAddresses = [];
      UserWallet?.forEach((e) => {
        allAddresses.push(e.address);
      });
      let data = new URLSearchParams();
      data.append("wallet_address", JSON.stringify(allAddresses));
      this.props.getProtocolBalanceApi(this, data);
    } else {
      this.handleReset();
    }
    if (this.state.userPlan?.name === "Free") {
      setTimeout(() => {
        this.setState(
          {
            isStatic: true,
          },
          () => {
            this.upgradeModal();
            window.localStorage.setItem("defi_access", false);
          }
        );
      }, 10000);
    }
  };
  // for 0 all value
  handleReset = () => {
    let YieldValues = [];
    let DebtValues = [];
    let allAssetType = [20, 30, 40, 50, 60, 70];
    allAssetType.map((e) => {
      if (![30].includes(e)) {
        YieldValues.push({
          id: e,
          name: AssetType.getText(e),
          totalPrice: 0,
        });
      } else {
        [30].map((e) => {
          DebtValues.push({
            id: e,
            name: AssetType.getText(e),
            totalPrice: 0,
          });
        });
      }
    });

    // this.setState({
    //   sortedList: "",
    //   YieldValues,
    //   DebtValues,
    // });
    // update data
    this.props.updateDefiData({
      sortedList: "",
      YieldValues: [
        {
          id: 1,
          name: "Supplied",
          totalPrice: 0,
          type_text: "Yield",
        },
        {
          id: 2,
          name: "Lent",
          totalPrice: 0,
          type_text: "Yield",
        },
        {
          id: 3,
          name: "Reward",
          totalPrice: 0,
          type_text: "Yield",
        },
        {
          id: 4,
          name: "Staked",
          totalPrice: 0,
          type_text: "Yield",
        },
        {
          id: 5,
          name: "Pool",
          totalPrice: 0,
          type_text: "Yield",
        },
      ],
      DebtValues: [
        {
          id: 6,
          name: "Borrowed",
          totalPrice: 0,
        },
      ],
      defiList: "",
    });
  };
  // For add new address
  handleAddModal = () => {
    this.setState({
      addModal: !this.state.addModal,
    });
  };

  handleChangeList = (value) => {
    this.setState({
      // for add wallet
      userWalletList: value,
      isUpdate: this.state.isUpdate === 0 ? 1 : 0,
      // for page
    });
  };
  CheckApiResponse = (value) => {
    this.setState({
      apiResponse: value,
    });

    this.props.setPageFlagDefault();
  };
  handleShare = () => {
    let lochUser = getCurrentUser().id;
    let userWallet = JSON.parse(window.localStorage.getItem("addWallet"));
    let slink =
      userWallet?.length === 1
        ? userWallet[0].displayAddress || userWallet[0].address
        : lochUser;
    let shareLink =
      BASE_URL_S3 + "home/" + slink + "?redirect=decentralized-finance";
    navigator.clipboard.writeText(shareLink);
    toast.success("Link copied");

    DefiShare({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    this.updateTimer();
  };
  render() {
    const chips = [
      {
        chain: {
          symbol: Coin2,
          name: "Avalanche",
          color: "#E84042",
        },
      },
      {
        chain: {
          symbol: Coin3,
          name: "Avalanche",
          color: "#E84042",
        },
      },
    ];
    if (mobileCheck()) {
      return (
        <MobileLayout
          handleShare={this.handleShare}
          isSidebarClosed={this.props.isSidebarClosed}
          history={this.props.history}
        >
          <DefiMobile
            defiStateLocally={this.state.defiStateLocally}
            toggleYield={this.toggleYield}
            isYeildToggle={this.state.isYeildToggle}
            sortBy={this.state.sortBy}
            handleSort={this.handleSort}
            currency={this.state.currency}
            isDebtToggle={this.state.isDebtToggle}
            toggleDebt={this.toggleDebt}
          />
        </MobileLayout>
      );
    }
    return (
      <>
        {/* topbar */}
        <div className="portfolio-page-section">
          <div
            className="portfolio-container page"
            style={{ overflow: "visible" }}
          >
            <div className="portfolio-section">
              {/* welcome card */}
              <WelcomeCard
                openConnectWallet={this.props.openConnectWallet}
                connectedWalletAddress={this.props.connectedWalletAddress}
                connectedWalletevents={this.props.connectedWalletevents}
                disconnectWallet={this.props.disconnectWallet}
                handleShare={this.handleShare}
                isSidebarClosed={this.props.isSidebarClosed}
                apiResponse={(e) => this.CheckApiResponse(e)}
                // history
                history={this.props.history}
                // add wallet address modal
                handleAddModal={this.handleAddModal}
                updateTimer={this.updateTimer}
              />
            </div>
          </div>
        </div>
        <div className="cohort-page-section m-t-80">
          <div className="cohort-section page">
            <TopWalletAddressList
              apiResponse={(e) => this.CheckApiResponse(e)}
              handleShare={this.handleShare}
              showpath
              currentPage={"decentralized-finance"}
            />
            {this.state.addModal && (
              <FixAddModal
                show={this.state.addModal}
                onHide={this.handleAddModal}
                modalIcon={AddWalletModalIcon}
                title="Add wallet address"
                subtitle="Add more wallet address here"
                modalType="addwallet"
                btnStatus={false}
                btnText="Go"
                history={this.props.history}
                changeWalletList={this.handleChangeList}
                apiResponse={(e) => this.CheckApiResponse(e)}
                from="defi"
                updateTimer={this.updateTimer}
              />
            )}
            {this.state.upgradeModal ? (
              <UpgradeModal
                show={this.state.upgradeModal}
                onHide={this.upgradeModal}
                history={this.props.history}
                isShare={window.localStorage.getItem("share_id")}
                // isStatic={true}
                triggerId={this.state.triggerId}
                pname="defi"
                updateTimer={this.updateTimer}
              />
            ) : null}
            <PageHeader
              title="Decentralized finance"
              subTitle="Decipher all of the DeFi positions from one place"
              // btnText={"Add wallet"}
              // handleBtn={this.handleAddModal}
              currentPage={"decentralized-finance"}
              // showData={totalWalletAmt}
              // isLoading={isLoading}
              updateTimer={this.updateTimer}
              ShareBtn={true}
              handleShare={this.handleShare}
            />

            {/* Balance sheet */}
            <h2 className="inter-display-medium f-s-20 lh-24 m-t-40">
              Balance sheet
            </h2>
            <div
              style={{
                minWidth: "85rem",
                maxWidth: "120rem",
                width: "120rem",
              }}
              className="balance-sheet-card"
            >
              <div className="balance-dropdown">
                <div className="balance-list-content">
                  {/* For yeild */}
                  <Row>
                    <Col md={6}>
                      <div
                        className="balance-sheet-title"
                        onClick={this.toggleYield}
                      >
                        <div>
                          <span
                            className={`balance-sheet-title-text inter-display-semi-bold f-s-16 lh-19 ${
                              this.state.isYeildToggle
                                ? "balance-sheet-title-text-selected"
                                : ""
                            }`}
                          >
                            Credit
                          </span>
                          <span
                            className={`balance-sheet-title-amount inter-display-medium f-s-16 lh-19 ${
                              this.state.isYeildToggle
                                ? "balance-sheet-title-text-selected"
                                : ""
                            }`}
                          >
                            {CurrencyType(false)}
                            {this.state.defiStateLocally.totalYield &&
                              numToCurrency(
                                this.state.defiStateLocally.totalYield *
                                  (this.state.currency?.rate || 1)
                              )}
                          </span>
                        </div>
                        <Image
                          className="defiMenu"
                          src={arrowUp}
                          style={
                            this.state.isYeildToggle
                              ? {
                                  filter: "var(--invertColor)",
                                }
                              : { transform: "rotate(180deg)" }
                          }
                        />
                      </div>
                      {this.state.isYeildToggle ? (
                        <div className="balance-sheet-list-container">
                          {this.state.defiStateLocally.YieldValues?.length !==
                            0 &&
                            this.state.defiStateLocally.YieldValues?.map(
                              (item, i) => {
                                return (
                                  <div
                                    className="balance-sheet-list"
                                    style={
                                      i ===
                                      this.state.defiStateLocally.YieldValues
                                        ?.length -
                                        1
                                        ? { paddingBottom: "0.3rem" }
                                        : {}
                                    }
                                    key={`defiYEildValue-${i}`}
                                  >
                                    <span className="inter-display-medium f-s-16 lh-19">
                                      {item.name}
                                    </span>
                                    <CustomOverlay
                                      position="top"
                                      isIcon={false}
                                      isInfo={true}
                                      isText={true}
                                      text={
                                        CurrencyType(false) +
                                        amountFormat(
                                          item.totalPrice.toFixed(2) *
                                            (this.state.currency?.rate || 1),
                                          "en-US",
                                          "USD"
                                        )
                                      }
                                    >
                                      <span className="inter-display-medium f-s-15 lh-19 grey-233 balance-amt">
                                        {CurrencyType(false)}
                                        {numToCurrency(
                                          item.totalPrice.toFixed(2) *
                                            (this.state.currency?.rate || 1),
                                          "en-US",
                                          "USD"
                                        )}
                                      </span>
                                    </CustomOverlay>
                                  </div>
                                );
                              }
                            )}
                        </div>
                      ) : null}
                    </Col>
                    <Col md={6}>
                      <div
                        className="balance-sheet-title"
                        onClick={this.toggleDebt}
                      >
                        <div>
                          <span
                            className={`balance-sheet-title-text inter-display-semi-bold f-s-16 lh-19 ${
                              this.state.isDebtToggle
                                ? "balance-sheet-title-text-selected"
                                : ""
                            }`}
                          >
                            Debt
                          </span>
                          <span
                            className={`balance-sheet-title-amount inter-display-medium f-s-16 lh-19 ${
                              this.state.isDebtToggle
                                ? "balance-sheet-title-text-selected"
                                : ""
                            }`}
                          >
                            {CurrencyType(false)}
                            {this.state.defiStateLocally.totalDebt &&
                              numToCurrency(
                                this.state.defiStateLocally.totalDebt *
                                  (this.state.currency?.rate || 1)
                              )}
                          </span>
                        </div>
                        <Image
                          className="defiMenu"
                          src={arrowUp}
                          style={
                            this.state.isDebtToggle
                              ? {
                                  filter: "var(--invertColor)",
                                }
                              : { transform: "rotate(180deg)" }
                          }
                        />
                      </div>
                      {this.state.isDebtToggle ? (
                        <div className="balance-sheet-list-container">
                          {this.state.defiStateLocally.DebtValues?.length !==
                            0 &&
                            this.state.defiStateLocally.DebtValues?.map(
                              (item, i) => {
                                return (
                                  <div
                                    className="balance-sheet-list"
                                    style={
                                      i ===
                                      this.state.defiStateLocally.DebtValues
                                        ?.length -
                                        1
                                        ? { paddingBottom: "0.3rem" }
                                        : {}
                                    }
                                    key={`defiDebtValue-${i}`}
                                  >
                                    <span className="inter-display-medium f-s-16 lh-19">
                                      {item.name}
                                    </span>
                                    <CustomOverlay
                                      position="top"
                                      isIcon={false}
                                      isInfo={true}
                                      isText={true}
                                      text={
                                        CurrencyType(false) +
                                        amountFormat(
                                          item.totalPrice.toFixed(2) *
                                            (this.state.currency?.rate || 1),
                                          "en-US",
                                          "USD"
                                        )
                                      }
                                    >
                                      <span className="inter-display-medium f-s-15 lh-19 grey-233 balance-amt">
                                        {CurrencyType(false)}
                                        {numToCurrency(
                                          item.totalPrice.toFixed(2) *
                                            (this.state.currency?.rate || 1),
                                          "en-US",
                                          "USD"
                                        )}
                                      </span>
                                    </CustomOverlay>
                                  </div>
                                );
                              }
                            )}
                        </div>
                      ) : null}
                    </Col>
                  </Row>

                  {/* For debt */}
                </div>
              </div>
            </div>

            {/* filter */}
            <div
              style={{
                marginBottom: "1.6rem",
                minWidth: "85rem",
                maxWidth: "120rem",
                width: "120rem",
              }}
              className="sortby-section"
            >
              <div
                style={{
                  marginLeft: "-0.1rem",
                }}
                className="dropdown-section"
              >
                {/* <span className="inter-display-medium f-s-13 lh-16 m-r-12 grey-313 naming">
                  Sort by
                </span> */}
                {this.state.sortBy.map((e, index) => {
                  return (
                    <span
                      className="sort-by-title"
                      onClick={() => this.handleSort(e)}
                      key={`sortBy-${index}`}
                    >
                      <span className="inter-display-medium f-s-13 lh-16 m-r-12 grey-7C7 ">
                        {e.title}
                      </span>{" "}
                      {/* <Image src={sort} style={{ width: "1rem" }} /> */}
                      <Image
                        src={sortByIcon}
                        // style={{ width: "1.6rem" }}
                        className={!e.down ? "rotateDown" : "rotateUp"}
                      />
                    </span>
                  );
                })}
              </div>
            </div>
            {/* End filter */}

            {/* start card */}

            {this.state.defiStateLocally?.defiList &&
            this.state.defiStateLocally.defiList.length !== 0 ? (
              this.state.defiStateLocally?.defiList?.map((card, index) => {
                return (
                  <div
                    key={`sortedList-${index}`}
                    className="defi-card-wrapper"
                    style={{
                      minWidth: "85rem",
                      maxWidth: "120rem",
                      width: "120rem",
                    }}
                  >
                    <div className="top-title-wrapper">
                      <div className="heading-image">
                        <Image src={card?.logoUrl} />
                        <h3 className="inter-display-medium f-s-16 lh-19">
                          {card?.name}
                        </h3>
                      </div>
                      <h3 className="inter-display-medium f-s-16 lh-19">
                        {CurrencyType(false)}
                        {numToCurrency(
                          card?.netBalance * (this.state.currency?.rate || 1)
                        )}{" "}
                        <span className="inter-display-medium f-s-10 lh-19 grey-ADA">
                          {CurrencyType(true)}
                        </span>
                      </h3>
                    </div>

                    {/* Table Content */}
                    {card.items
                      ? card.items.map((groupComp, i) => {
                          return (
                            <>
                              <Row key={`carItem-${i}`} className="table-head">
                                <Col md={4}>
                                  <div className="cp header-col">
                                    <span className="inter-display-medium f-s-13 lh-15 grey-4F4">
                                      {groupComp.type}
                                    </span>
                                  </div>
                                </Col>
                                <Col md={4}>
                                  <div
                                    style={{
                                      justifyContent: "center",
                                    }}
                                    className="cp header-col"
                                  >
                                    <span className="inter-display-medium f-s-13 lh-15 grey-4F4">
                                      Balance
                                    </span>
                                  </div>
                                </Col>
                                <Col md={4}>
                                  <div
                                    style={{
                                      justifyContent: "flex-end",
                                    }}
                                    className="cp header-col"
                                  >
                                    <span className="inter-display-medium f-s-13 lh-15 grey-4F4">
                                      USD Value
                                    </span>
                                  </div>
                                </Col>
                              </Row>
                              {groupComp?.walletItems &&
                              groupComp.walletItems.length > 0
                                ? groupComp.walletItems.map(
                                    (rowData, indexTwo) => {
                                      return (
                                        <Row
                                          key={`defiTableRows-${i}-${index}-${indexTwo}`}
                                          className="table-content-row"
                                        >
                                          <Col md={4}>
                                            <div className="d-flex align-items-center h-100">
                                              <div className="overlap-img">
                                                {rowData.logos?.length > 0
                                                  ? rowData.logos?.map(
                                                      (e, indexThree) => {
                                                        return (
                                                          <Image
                                                            key={`defiTableRowAsset-${i}-${index}-${indexTwo}-${indexThree}`}
                                                            src={e}
                                                            style={{
                                                              zIndex:
                                                                rowData.logos
                                                                  ?.length -
                                                                indexThree,
                                                              marginLeft:
                                                                indexThree === 0
                                                                  ? "0"
                                                                  : "-1rem",
                                                            }}
                                                          />
                                                        );
                                                      }
                                                    )
                                                  : null}
                                              </div>
                                              {rowData.asset ? (
                                                <h3 className="overflowValueContainer inter-display-medium f-s-13 lh-13 ml-2">
                                                  {rowData.asset}
                                                </h3>
                                              ) : null}
                                            </div>
                                          </Col>

                                          <Col md={4}>
                                            <div className="d-flex flex-column align-items-center justify-content-center h-100 ">
                                              {rowData?.balance
                                                ? rowData.balance.map(
                                                    (e, indexFour) => {
                                                      return (
                                                        <CustomOverlay
                                                          position="top"
                                                          isIcon={false}
                                                          isInfo={true}
                                                          isText={true}
                                                          text={
                                                            e
                                                              ? convertNtoNumber(
                                                                  e
                                                                )
                                                              : "0.00"
                                                          }
                                                        >
                                                          <div
                                                            className={`${
                                                              indexFour > 0
                                                                ? "mt-3"
                                                                : ""
                                                            } inter-display-medium f-s-15 lh-15`}
                                                            key={`balance-${i}-${index}-${indexTwo}-${indexFour}`}
                                                          >
                                                            {e
                                                              ? isNaN(e)
                                                                ? e
                                                                : numToCurrency(
                                                                    convertNtoNumber(
                                                                      e
                                                                    ),
                                                                    "en-US",
                                                                    "USD"
                                                                  )
                                                              : "0.00"}
                                                          </div>
                                                        </CustomOverlay>
                                                      );
                                                    }
                                                  )
                                                : null}
                                            </div>
                                          </Col>
                                          <Col md={4}>
                                            {rowData.usdValue ? (
                                              <div className="d-flex align-items-center justify-content-end h-100">
                                                <CustomOverlay
                                                  position="top"
                                                  isIcon={false}
                                                  isInfo={true}
                                                  isText={true}
                                                  text={
                                                    CurrencyType(false) +
                                                    amountFormat(
                                                      rowData.usdValue.toFixed(
                                                        2
                                                      ),
                                                      "en-US",
                                                      "USD"
                                                    )
                                                  }
                                                >
                                                  <div className="overflowValueContainer inter-display-medium f-s-15 lh-15">
                                                    {CurrencyType(false)}
                                                    {numToCurrency(
                                                      rowData.usdValue.toFixed(
                                                        2
                                                      ),
                                                      "en-US",
                                                      "USD"
                                                    )}
                                                  </div>
                                                </CustomOverlay>
                                              </div>
                                            ) : (
                                              <div className="d-flex align-items-center justify-content-end h-100">
                                                <CustomOverlay
                                                  position="top"
                                                  isIcon={false}
                                                  isInfo={true}
                                                  isText={true}
                                                  text={"$0.00"}
                                                >
                                                  <div className="overflowValueContainer inter-display-medium f-s-15 lh-15">
                                                    $0.00
                                                  </div>
                                                </CustomOverlay>
                                              </div>
                                            )}
                                          </Col>
                                        </Row>
                                      );
                                    }
                                  )
                                : null}
                            </>
                          );
                        })
                      : null}
                  </div>
                );
              })
            ) : this.state.defiStateLocally?.defiList &&
              this.state.defiStateLocally.defiList.length === 0 ? (
              // <Col md={12}>

              <div
                className="defi animation-wrapper"
                style={{
                  padding: "3rem",
                  textAlign: "center",
                  minWidth: "85rem",
                  maxWidth: "120rem",
                  width: "120rem",
                }}
              >
                <h3 className="inter-display-medium f-s-16 lh-19 grey-313">
                  No DeFi balances found
                </h3>
              </div>
            ) : (
              // </Col>
              <div
                style={{
                  minWidth: "85rem",
                  maxWidth: "120rem",
                  width: "120rem",
                }}
                className="defi animation-wrapper"
              >
                <Loading />
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  defiState: state.DefiState,
  commonState: state.CommonState,
});
const mapDispatchToProps = {
  // getPosts: fetchPosts
  getAllCoins,
  getProtocolBalanceApi,
  updateDefiData,

  // page flag
  updateWalletListFlag,
  setPageFlagDefault,
  getAllWalletListApi,
};
Defi.propTypes = {
  // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Defi);
