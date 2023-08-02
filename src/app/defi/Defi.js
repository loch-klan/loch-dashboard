import React, { Component } from "react";
import { connect } from "react-redux";
import Loading from "../common/Loading";
import { getAllCoins } from "../onboarding/Api.js";
// add wallet
import AddWalletModalIcon from "../../assets/images/icons/wallet-icon.svg";
import PageHeader from "../common/PageHeader";
import FixAddModal from "../common/FixAddModal";
import arrowUp from "../../assets/images/arrow-up.svg";
import { getProtocolBalanceApi } from "../Portfolio/Api";
import { updateDefiData } from "./Api";
import {
  amountFormat,
  CurrencyType,
  numToCurrency,
} from "../../utils/ReusableFunctions";
import { getAllWalletListApi } from "../wallet/Api";
import { Col, Image, Row } from "react-bootstrap";
import sortByIcon from "../../assets/images/icons/triangle-down.svg";
import Coin2 from "../../assets/images/icons/temp-coin1.svg";
import Coin3 from "../../assets/images/icons/temp-coin-2.svg";
import { AssetType } from "../../utils/Constant";
import UpgradeModal from "../common/upgradeModal";
import { setPageFlagDefault, updateWalletListFlag } from "../common/Api";
import WelcomeCard from "../Portfolio/WelcomeCard";
import {
  DefiCredit,
  DefiDebt,
  DefiSortByAmount,
  DefiSortByName,
  PageviewDefi,
  TimeSpentDefi,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";

class Defi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // store current currency
      currency: JSON.parse(localStorage.getItem("currency")),
      sortBy: [
        { title: "Amount", down: true },
        { title: "Name", down: true },
      ],
      start: 0,
      sorts: [],

      // add new wallet
      userWalletList: localStorage.getItem("addWallet")
        ? JSON.parse(localStorage.getItem("addWallet"))
        : [],
      addModal: false,
      isUpdate: 0,
      apiResponse: false,

      upgradeModal: false,
      userPlan: JSON.parse(localStorage.getItem("currentPlan")) || "Free",

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
        userPlan: JSON.parse(localStorage.getItem("currentPlan")),
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

    return () => {
      clearInterval(window.checkDefiTimer);
    };
  }
  updateTimer = (first) => {
    const tempExistingExpiryTime = localStorage.getItem("defiPageExpiryTime");
    if (!tempExistingExpiryTime && !first) {
      this.startPageView();
    }
    const tempExpiryTime = Date.now() + 1800000;
    localStorage.setItem("defiPageExpiryTime", tempExpiryTime);
  };
  endPageView = () => {
    clearInterval(window.checkDefiTimer);
    localStorage.removeItem("defiPageExpiryTime");
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
    const tempExpiryTime = localStorage.getItem("defiPageExpiryTime");
    if (tempExpiryTime && tempExpiryTime < Date.now()) {
      this.endPageView();
    }
  };
  componentWillUnmount() {
    const tempExpiryTime = localStorage.getItem("defiPageExpiryTime");
    if (tempExpiryTime) {
      this.endPageView();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // add wallet

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
      let defi_access = JSON.parse(localStorage.getItem("defi_access"));
      if (this.state.userPlan?.name === "Free" && defi_access) {
        setTimeout(() => {
          this.setState(
            {
              isStatic: true,
            },
            () => {
              this.upgradeModal();
              localStorage.setItem("defi_access", false);
            }
          );
        }, 10000);
      }
    }
  }
  sortArray = (key, order) => {
    let array = this.props.defiState?.defiList;
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
      this.props.updateDefiData({ sortedList });
    }
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
    let UserWallet = JSON.parse(localStorage.getItem("addWallet"));
    if (UserWallet.length !== 0) {
      UserWallet?.map((e) => {
        let data = new URLSearchParams();
        data.append("wallet_address", e.address);
        this.props.getProtocolBalanceApi(this, data);
      });
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
            localStorage.setItem("defi_access", false);
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
                isShare={localStorage.getItem("share_id")}
                // isStatic={true}
                triggerId={this.state.triggerId}
                pname="defi"
                updateTimer={this.updateTimer}
              />
            ) : null}
            <PageHeader
              title="Decentralized Finance"
              subTitle="Decipher all your DeFi positions from one place"
              // btnText={"Add wallet"}
              // handleBtn={this.handleAddModal}
              // showpath={true}
              currentPage={"decentralized-finance"}
              // showData={totalWalletAmt}
              // isLoading={isLoading}
              updateTimer={this.updateTimer}
            />

            {/* Balance sheet */}
            <h2 className="inter-display-medium f-s-20 lh-24 m-t-40">
              Balance sheet
            </h2>
            <div style={{}} className="balance-sheet-card">
              <div className="balance-dropdown">
                <div className="balance-list-content">
                  {/* For yeild */}
                  <Row>
                    <Col md={6}>
                      <div
                        className="balance-sheet-title"
                        onClick={this.toggleYield}
                        style={
                          !this.state.isYeildToggle || !this.state.isDebtToggle
                            ? { marginBottom: "0.5rem" }
                            : { marginBottom: "1rem" }
                        }
                      >
                        <div>
                          <span
                            className="inter-display-semi-bold f-s-16 lh-19"
                            style={{ color: "#636467", marginRight: "0.8rem" }}
                          >
                            Credit
                          </span>
                          <span
                            className="inter-display-medium f-s-16 lh-19"
                            style={{ marginRight: "0.8rem" }}
                          >
                            {CurrencyType(false)}
                            {this.props.defiState.totalYield &&
                              numToCurrency(
                                this.props.defiState.totalYield *
                                  (this.state.currency?.rate || 1)
                              )}
                          </span>
                        </div>
                        <Image
                          src={arrowUp}
                          style={
                            this.state.isYeildToggle
                              ? { transform: "rotate(180deg)" }
                              : {}
                          }
                        />
                      </div>
                      {this.props.defiState.YieldValues?.length !== 0 &&
                        this.state.isYeildToggle &&
                        this.props.defiState.YieldValues?.map((item, i) => {
                          return (
                            <div
                              className="balance-sheet-list"
                              style={
                                i ===
                                this.props.defiState.YieldValues?.length - 1
                                  ? { paddingBottom: "0.3rem" }
                                  : {}
                              }
                              key={`defiYEildValue-${i}`}
                            >
                              <span className="inter-display-medium f-s-16 lh-19">
                                {item.name}
                              </span>
                              <span className="inter-display-medium f-s-15 lh-19 grey-233 balance-amt">
                                {CurrencyType(false)}
                                {amountFormat(
                                  item.totalPrice.toFixed(2) *
                                    (this.state.currency?.rate || 1),
                                  "en-US",
                                  "USD"
                                )}
                              </span>
                            </div>
                          );
                        })}
                    </Col>
                    <Col md={6}>
                      <div
                        className="balance-sheet-title"
                        onClick={this.toggleDebt}
                        style={
                          !this.state.isYeildToggle || !this.state.isDebtToggle
                            ? { marginBottom: "0.5rem" }
                            : {}
                        }
                      >
                        <div>
                          <span
                            className="inter-display-semi-bold f-s-16 lh-19"
                            style={{ color: "#636467", marginRight: "0.8rem" }}
                          >
                            Debt
                          </span>
                          <span
                            className="inter-display-medium f-s-16 lh-19"
                            style={{ marginRight: "0.8rem" }}
                          >
                            {CurrencyType(false)}
                            {this.props.defiState.totalDebt &&
                              numToCurrency(
                                this.props.defiState.totalDebt *
                                  (this.state.currency?.rate || 1)
                              )}
                          </span>
                        </div>
                        <Image
                          src={arrowUp}
                          style={
                            this.state.isDebtToggle
                              ? { transform: "rotate(180deg)" }
                              : {}
                          }
                        />
                      </div>

                      {this.props.defiState.DebtValues?.length !== 0 &&
                        this.state.isDebtToggle &&
                        this.props.defiState.DebtValues?.map((item, i) => {
                          return (
                            <div
                              className="balance-sheet-list"
                              style={
                                i ===
                                this.props.defiState.DebtValues?.length - 1
                                  ? { paddingBottom: "0.3rem" }
                                  : {}
                              }
                              key={`defiDebtValue-${i}`}
                            >
                              <span className="inter-display-medium f-s-16 lh-19">
                                {item.name}
                              </span>
                              <span className="inter-display-medium f-s-15 lh-19 grey-233 balance-amt">
                                {CurrencyType(false)}
                                {amountFormat(
                                  item.totalPrice.toFixed(2) *
                                    (this.state.currency?.rate || 1),
                                  "en-US",
                                  "USD"
                                )}
                              </span>
                            </div>
                          );
                        })}
                    </Col>
                  </Row>

                  {/* For debt */}
                </div>
              </div>
            </div>

            {/* filter */}
            <div className="m-b-16 sortby-section">
              <div className="dropdown-section">
                <span className="inter-display-medium f-s-13 lh-16 m-r-12 grey-313 naming">
                  Sort by
                </span>
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
                        className={e.down ? "rotateDown" : "rotateUp"}
                      />
                    </span>
                  );
                })}
              </div>
            </div>
            {/* End filter */}

            {/* start card */}

            {this.props.defiState?.defiList &&
            this.props.defiState.defiList.length !== 0 ? (
              this.props.defiState?.defiList?.map((card, index) => {
                return (
                  <div
                    key={`sortedList-${index}`}
                    className="defi-card-wrapper"
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
                                                        <div
                                                          className={`${
                                                            indexFour > 0
                                                              ? "mt-3"
                                                              : ""
                                                          } gray-chip inter-display-medium f-s-15 lh-15`}
                                                          key={`balance-${i}-${index}-${indexTwo}-${indexFour}`}
                                                        >
                                                          {e}
                                                        </div>
                                                      );
                                                    }
                                                  )
                                                : null}
                                            </div>
                                          </Col>
                                          <Col md={4}>
                                            {rowData.usdValue ? (
                                              <div className="d-flex align-items-center justify-content-end h-100">
                                                <div className="overflowValueContainer gray-chip inter-display-medium f-s-15 lh-15">
                                                  {CurrencyType(false)}
                                                  {amountFormat(
                                                    rowData.usdValue.toFixed(2),
                                                    "en-US",
                                                    "USD"
                                                  )}
                                                </div>
                                              </div>
                                            ) : null}
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
            ) : this.props.defiState?.defiList &&
              this.props.defiState.defiList.length === 0 ? (
              // <Col md={12}>

              <div
                className="defi animation-wrapper"
                style={{ padding: "3rem", textAlign: "center" }}
              >
                <h3 className="inter-display-medium f-s-16 lh-19 grey-313">
                  No data found
                </h3>
              </div>
            ) : (
              // </Col>
              <div className="defi animation-wrapper">
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
