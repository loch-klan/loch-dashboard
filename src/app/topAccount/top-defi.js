import React, { Component } from "react";
import { connect } from "react-redux";
import Loading from "../common/Loading";
import { getAllCoins } from "../onboarding/Api.js";
import AddWalletModalIcon from "../../assets/images/icons/wallet-icon.svg";
import PageHeader from "../common/PageHeader";
import FixAddModal from "../common/FixAddModal";
import arrowUp from "../../assets/images/arrow-up.svg";
import { getProtocolBalanceApi } from "../Portfolio/Api";
import { updateDefiData } from "../defi/Api";
import {
  amountFormat,
  CurrencyType,
  numToCurrency,
} from "../../utils/ReusableFunctions";
import { Col, Image, Row } from "react-bootstrap";
import sortByIcon from "../../assets/images/icons/triangle-down.svg";
import { AssetType, BASE_URL_S3 } from "../../utils/Constant";
import UpgradeModal from "../common/upgradeModal";
import { setPageFlagDefault, updateWalletListFlag } from "../common/Api";
import WelcomeCard from "../Portfolio/WelcomeCard";
import {
  PageviewTopDefi,
  TimeSpentTopDefi,
  TopDefiShare,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import { toast } from "react-toastify";
import { Buffer } from "buffer";

class TopDefi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // store current currency
      currency: JSON.parse(localStorage.getItem("currency")),
      sortBy: [
        { title: "Amount", down: false },
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
      triggerId: 0,

      isYeildToggle: false,
      isDebtToggle: false,
      upgradeModal: false,
      triggerId: 6,

      // this is used in api to check api call fromt op acount page or not
      isTopAccountPage: true,

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
    this.setState({
      isYeildToggle: !this.state.isYeildToggle,
      // isDebtToggle: false,
    });
  };

  toggleDebt = () => {
    this.setState({
      isDebtToggle: !this.state.isDebtToggle,
      // isYeildToggle: false,
    });
  };

  startPageView = () => {
    this.setState({ startTime: new Date() * 1 });
    PageviewTopDefi({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    // Inactivity Check
    window.checkTopDefiTimer = setInterval(() => {
      this.checkForInactivity();
    }, 900000);
  };
  componentDidMount() {
    this.startPageView();
    this.updateTimer(true);
    this.props.getAllCoins();
  }
  updateTimer = (first) => {
    const tempExistingExpiryTime = localStorage.getItem(
      "topDefiPageExpiryTime"
    );
    if (!tempExistingExpiryTime && !first) {
      this.startPageView();
    }
    const tempExpiryTime = Date.now() + 1800000;
    localStorage.setItem("topDefiPageExpiryTime", tempExpiryTime);
  };
  endPageView = () => {
    clearInterval(window.checkTopDefiTimer);
    localStorage.removeItem("topDefiPageExpiryTime");
    if (this.state.startTime) {
      let endTime = new Date() * 1;
      let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
      TimeSpentTopDefi({
        time_spent: TimeSpent,
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
    }
  };
  checkForInactivity = () => {
    const tempExpiryTime = localStorage.getItem("topDefiPageExpiryTime");
    if (tempExpiryTime && tempExpiryTime < Date.now()) {
      this.endPageView();
    }
  };
  componentWillUnmount() {
    const tempExpiryTime = localStorage.getItem("topDefiPageExpiryTime");
    if (tempExpiryTime) {
      this.endPageView();
    }
  }
  componentDidUpdate(prevProps, prevState) {
    // add wallet
    if (!this.props.commonState.top_defi) {
      this.props.updateDefiData(
        {
          totalYield: 0,
          totalDebt: 0,
          cardList: [],
          sortedList: [],
          DebtValues: [],
          YieldValues: [],
          BalanceSheetValue: {},
          defiList: "",
        },
        this
      );

      // set defi page to true
      this.props.updateWalletListFlag("top_defi", true);
      this.setState(
        {
          isYeildToggle: false,
          isDebtToggle: false,
          apiResponse: false,
        },
        () => {
          //  getAllProtocol(this);
          this.getYieldBalance();
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
    let array = this.props.topAccountState?.defiList;
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

      // this.setState({
      //   sortedList,
      // });
      // update fun
      this.props.updateDefiData({ sortedList }, this);
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
      //   WhaleSortByAmt({
      //     email_address: getCurrentUser().email,
      //     session_id: getCurrentUser().id,
      //   });
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
      //   WhaleSortByName({
      //     email_address: getCurrentUser().email,
      //     session_id: getCurrentUser().id,
      //   });
    }
  };

  getYieldBalance = () => {
    let UserWallet = localStorage.getItem("previewAddress")
      ? [JSON.parse(localStorage.getItem("previewAddress"))]
      : [];
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
  handleShare = () => {
    const previewAddress = localStorage.getItem("previewAddress")
      ? JSON.parse(localStorage.getItem("previewAddress"))
      : "";
    const encodedAddress = Buffer.from(previewAddress?.address).toString(
      "base64"
    );

    let shareLink =
      BASE_URL_S3 +
      `top-account/${encodedAddress}?redirect=decentralized-finance`;
    navigator.clipboard.writeText(shareLink);
    toast.success("Link copied");
    TopDefiShare({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    this.updateTimer();
  };
  render() {
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
                apiResponse={(e) => this.CheckApiResponse(e)}
                // history
                history={this.props.history}
                // add wallet address modal
                handleAddModal={this.handleAddModal}
                isPreviewing={true}
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
              />
            )}
            {this.state.upgradeModal && (
              <UpgradeModal
                show={this.state.upgradeModal}
                onHide={this.upgradeModal}
                history={this.props.history}
                isShare={localStorage.getItem("share_id")}
                // isStatic={true}
                triggerId={this.state.triggerId}
                pname="defi"
              />
            )}
            <PageHeader
              title="Decentralized finance"
              subTitle="Decipher all your DeFi positions from one place"
              // btnText={"Add wallet"}
              // handleBtn={this.handleAddModal}
              showpath={true}
              currentPage={"decentralized-finance"}
              // showData={totalWalletAmt}
              // isLoading={isLoading}
              ShareBtn={true}
              handleShare={this.handleShare}
            />

            {/* Balance sheet */}
            <h2
              onClick={() => {
                this.updateTimer();
              }}
              className="inter-display-medium f-s-20 lh-24 m-t-40"
            >
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
                            {this.props.topAccountState.totalYield &&
                              numToCurrency(
                                this.props.topAccountState.totalYield *
                                  (this.state.currency?.rate || 1)
                              )}
                          </span>
                        </div>
                        <Image
                          src={arrowUp}
                          className="defiMenu"
                          style={
                            this.state.isYeildToggle
                              ? {
                                  transform: "rotate(180deg)",
                                  filter: "opacity(1)",
                                }
                              : {}
                          }
                        />
                      </div>
                      {this.state.isYeildToggle ? (
                        <div className="balance-sheet-list-container">
                          {this.props.topAccountState.YieldValues?.length !==
                            0 &&
                            this.props.topAccountState.YieldValues?.map(
                              (item, i) => {
                                return (
                                  <div
                                    className="balance-sheet-list"
                                    style={
                                      i ===
                                      this.props.topAccountState.YieldValues
                                        ?.length -
                                        1
                                        ? { paddingBottom: "0.3rem" }
                                        : {}
                                    }
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
                            {this.props.topAccountState.totalDebt &&
                              numToCurrency(
                                this.props.topAccountState.totalDebt *
                                  (this.state.currency?.rate || 1)
                              )}
                          </span>
                        </div>
                        <Image
                          src={arrowUp}
                          className="defiMenu"
                          style={
                            this.state.isDebtToggle
                              ? {
                                  transform: "rotate(180deg)",
                                  filter: "opacity(1)",
                                }
                              : {}
                          }
                        />
                      </div>
                      {this.state.isDebtToggle ? (
                        <div className="balance-sheet-list-container">
                          {this.props.topAccountState.DebtValues?.length !==
                            0 &&
                            this.props.topAccountState.DebtValues?.map(
                              (item, i) => {
                                return (
                                  <div
                                    className="balance-sheet-list"
                                    style={
                                      i ===
                                      this.props.topAccountState.DebtValues
                                        ?.length -
                                        1
                                        ? { paddingBottom: "0.3rem" }
                                        : {}
                                    }
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
                      key={`sortBy-${index}`}
                      onClick={() => this.handleSort(e)}
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

            {this.props.topAccountState?.defiList?.length !== 0 &&
            this.props.topAccountState?.defiList !== "" ? (
              this.props.topAccountState?.defiList?.map((card, index) => {
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
                                                          } inter-display-medium f-s-15 lh-15`}
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
                                                <div className="overflowValueContainer inter-display-medium f-s-15 lh-15">
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
            ) : this.props.topAccountState?.defiList &&
              this.props.topAccountState.defiList.length === 0 ? (
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

  // top account
  topAccountState: state.TopAccountState,
});
const mapDispatchToProps = {
  // getPosts: fetchPosts
  getAllCoins,
  getProtocolBalanceApi,
  updateDefiData,

  // page flag
  updateWalletListFlag,
  setPageFlagDefault,
};
TopDefi.propTypes = {
  // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(TopDefi);
