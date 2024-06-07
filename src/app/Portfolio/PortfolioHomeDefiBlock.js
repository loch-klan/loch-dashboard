import { Component } from "react";
import { Col, Image, Row } from "react-bootstrap";
import { connect } from "react-redux";
import arrowUp from "../../assets/images/arrow-up.svg";
import {
  DefiBlockExpandediew,
  HomeDefiDebt,
  HomeDefiYield,
} from "../../utils/AnalyticsFunctions";
import { AssetType } from "../../utils/Constant";
import { getCurrentUser } from "../../utils/ManageToken";
import {
  CurrencyType,
  amountFormat,
  convertNtoNumber,
  loadingAnimation,
  numToCurrency,
} from "../../utils/ReusableFunctions";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import { updateWalletListFlag } from "../common/Api";
import Loading from "../common/Loading";
import { updateDefiData } from "../defi/Api";
import { getProtocolBalanceApi } from "./Api";

class PortfolioHomeDefiBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defiLoader: false,
      isYeildToggle: false,
      isDebtToggle: false,
      upgradeModal: false,
      triggerId: 6,
      totalDefiPositions: 0,
    };
  }
  goToInsightsPage = () => {
    this.props.history.push("/intelligence/insights");
  };
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
    //   YieldValues,
    //   DebtValues,
    // });
    // update data
    this.props.updateDefiData({ sortedList: "", YieldValues, DebtValues });
  };
  getYieldBalance = () => {
    this.setState({
      defiLoader: true,
    });
    let UserWallet = JSON.parse(window.localStorage.getItem("addWallet"));
    if (UserWallet?.length !== 0) {
      const allAddresses = [];
      UserWallet?.forEach((e) => {
        allAddresses.push(e.address);
      });
      let data = new URLSearchParams();
      data.append("wallet_address", JSON.stringify(allAddresses));
      this.props.getProtocolBalanceApi(this, data);
    } else {
      this.handleReset();
      this.setState({
        defiLoader: false,
      });
    }
    // if (!UserWallet) {
    //   //  console.log("null")
    //   this.setState(
    //     {
    //       loadGetYieldBalance: true,
    //     },
    //     () => {
    //       setTimeout(() => {
    //         this.getYieldBalance();
    //       }, 5000);
    //     }
    //   );
    // }
    // console.log("data", this.props.chainPortfolio);
  };
  toggleYield = () => {
    if (!this.state.defiLoader) {
      this.setState({
        isYeildToggle: !this.state.isYeildToggle,
        isDebtToggle: false,
      });
      HomeDefiDebt({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
      if (this.props.updateTimer) {
        this.props.updateTimer();
      }
    }
  };

  toggleDebt = () => {
    if (!this.state.defiLoader) {
      this.setState({
        isDebtToggle: !this.state.isDebtToggle,
        isYeildToggle: false,
      });

      HomeDefiYield({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
      if (this.props.updateTimer) {
        this.props.updateTimer();
      }
    }
  };
  calTotalDefiPositions = () => {
    this.props.updateWalletListFlag("defi", true);
    let tempTotalDefiPositions = 0;
    this.props.defiState.defiList.forEach((resData) => {
      if (resData.items && resData.items[0] && resData.items[0].walletItems) {
        tempTotalDefiPositions =
          tempTotalDefiPositions + resData.items[0].walletItems.length;
      }
    });
    this.setState({
      totalDefiPositions: tempTotalDefiPositions,
    });
  };
  componentDidMount() {
    if (
      !(this.props.defiState && this.props.defiState?.defiList) ||
      !this.props.commonState.defi
    ) {
      this.props.updateWalletListFlag("defi", true);
      this.callHomeDefiAPISPass();
    } else {
      this.setState({
        defiLoader: false,
      });
    }
    if (this.props.defiState.defiList) {
      this.calTotalDefiPositions();
    }
  }
  callHomeDefiAPISPass = () => {
    this.props.updateDefiData({
      totalYield: 0,
      totalDebt: 0,
      cardList: [],
      sortedList: [],
      DebtValues: [],
      YieldValues: [],
      BalanceSheetValue: {},
    });

    this.setState(
      {
        isYeildToggle: false,
        isDebtToggle: false,
        upgradeModal: false,
        triggerId: 6,
        isChainToggle: false,
      },
      () => {
        //  getAllProtocol(this);
        this.getYieldBalance();
      }
    );
  };
  componentDidUpdate(prevProps) {
    if (prevProps.userWalletList !== this.props.userWalletList) {
      this.callHomeDefiAPISPass();
    }
    if (prevProps.defiState.defiList !== this.props.defiState.defiList) {
      this.calTotalDefiPositions();
    }
    if (!this.props.commonState.defi) {
      // if (this.state.userPlan?.defi_enabled) {
      //   this.getYieldBalance();
      // } else {
      //   this.handleReset();
      //   // this.upgradeModal();
      // }
    }
  }
  goToDefiPage = () => {
    if (this.props.lochToken && this.props.history) {
      this.props.history.push("/decentralized-finance");
      DefiBlockExpandediew({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
    }
  };
  curToNumToTwoDec = (e) => {
    let tempHolder = convertNtoNumber(e);
    if (tempHolder && !isNaN(tempHolder)) {
      tempHolder = Number(tempHolder);
      return numToCurrency(tempHolder.toFixed(2), "en-US", "USD");
    }
    return "";
  };
  render() {
    if (this.state.defiLoader || !this.props.defiState?.defiList) {
      return (
        <div
          style={{
            height: "32rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <Loading />
          </div>
        </div>
      );
    }

    return (
      <div className="balance-sheet-card-portfolio-home-container">
        <div className="balance-sheet-card-portfolio-home">
          <div
            style={{
              borderBottomLeftRadius:
                this.state.isYeildToggle || this.state.isDebtToggle
                  ? "0rem"
                  : "",
              borderBottomRightRadius:
                this.state.isYeildToggle || this.state.isDebtToggle
                  ? "0rem"
                  : "",
              marginBottom: "1rem",
              marginTop: "0.5rem",
            }}
            className="balance-sheet-card "
          >
            <div className="balance-card-header cp">
              <div
                onClick={this.toggleYield}
                // style={
                //   this.state.isYeildToggle ? {  } : {}
                // }
                className={`balance-sheet-card-credit ${
                  this.state.defiLoader
                    ? "balance-sheet-card-credit-loading"
                    : ""
                }`}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    className={`balance-sheet-card-credit-title inter-display-semi-bold f-s-13 secondaryDarkText
                            ${
                              this.state.isYeildToggle
                                ? "balance-sheet-card-credit-title-selected"
                                : ""
                            }
                            `}
                  >
                    Credit
                  </span>
                  <span
                    className={`balance-sheet-card-credit-amount inter-display-semi-bold f-s-13 secondaryDarkText
                            ${
                              this.state.isYeildToggle
                                ? "balance-sheet-card-credit-amount-selected"
                                : ""
                            }
                            `}
                  >
                    {CurrencyType(false)}
                    {this.props.defiState?.YieldValues &&
                      numToCurrency(this.props.defiState?.totalYield)}
                  </span>

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
              </div>

              <div
                onClick={this.toggleDebt}
                className={`balance-sheet-card-debt ${
                  this.state.defiLoader ? "balance-sheet-card-debt-loading" : ""
                }`}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    className={`balance-sheet-card-credit-title inter-display-semi-bold f-s-13 secondaryDarkText
                             ${
                               this.state.isDebtToggle
                                 ? "balance-sheet-card-credit-title-selected"
                                 : ""
                             }
                             `}
                  >
                    Debt
                  </span>
                  <span
                    className={`balance-sheet-card-credit-amount inter-display-semi-bold f-s-13 secondaryDarkText
                            ${
                              this.state.isDebtToggle
                                ? "balance-sheet-card-credit-amount-selected"
                                : ""
                            }
                            `}
                  >
                    {CurrencyType(false)}
                    {this.props.defiState?.DebtValues &&
                      numToCurrency(this.props.defiState?.totalDebt)}
                  </span>

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
                {this.state.defiLoader && (
                  <div style={{ marginTop: "-6px" }}>{loadingAnimation()}</div>
                )}
              </div>
            </div>
          </div>
          {(this.state.isYeildToggle || this.state.isDebtToggle) && (
            <div className="balance-dropdown">
              <div className="balance-list-content-parent">
                <div className="balance-list-content">
                  {/* For yeild */}
                  {this.state.isYeildToggle && (
                    <div>
                      {this.props.defiState?.YieldValues &&
                        this.props.defiState?.YieldValues.map((item, i) => {
                          return (
                            <div
                              key={`defiState-${i}`}
                              className={`balance-sheet-list ${
                                i === 0 ? "balance-sheet-list-no-border" : ""
                              }`}
                            >
                              <span className="inter-display-medium f-s-12">
                                {item.name}
                              </span>
                              {/* <CustomOverlay
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
                              > */}
                              <span className="inter-display-medium f-s-12 grey-233 balance-amt">
                                {CurrencyType(false)}
                                {numToCurrency(
                                  item.totalPrice.toFixed(2),
                                  "en-US",
                                  "USD"
                                )}
                              </span>
                              {/* </CustomOverlay> */}
                            </div>
                          );
                        })}
                    </div>
                  )}

                  {/* For debt */}
                  {this.state.isDebtToggle && (
                    <div>
                      {this.props.defiState?.DebtValues &&
                        this.props.defiState?.DebtValues.map((item, i) => {
                          return (
                            <div
                              key={`debtDefiState-${i}`}
                              className={`balance-sheet-list ${
                                i === 0 ? "balance-sheet-list-no-border" : ""
                              }`}
                            >
                              <span className="inter-display-medium f-s-12">
                                {item.name}
                              </span>
                              {/* <CustomOverlay
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
                              > */}
                              <span className="inter-display-medium f-s-12 grey-233 balance-amt">
                                {CurrencyType(false)}
                                {numToCurrency(
                                  item.totalPrice.toFixed(2),
                                  "en-US",
                                  "USD"
                                )}
                              </span>
                              {/* </CustomOverlay> */}
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <div
            style={{
              opacity:
                this.state.isDebtToggle || this.state.isYeildToggle ? 0 : 1,
            }}
            className="portfolioHomeDefiCard"
          >
            {this.props.defiState?.defiList &&
            this.props.defiState.defiList.length !== 0 ? (
              this.props.defiState?.defiList.slice(0, 1).map((card, index) => {
                return (
                  <div
                    style={{
                      marginBottom: "0rem",
                    }}
                    key={`sortedList-${index}`}
                    className="defi-card-wrapper"
                  >
                    <div className="top-title-wrapper">
                      <div className="heading-image">
                        <Image src={card?.logoUrl} />
                        <h3 className="inter-display-medium f-s-15">
                          {card?.name}
                        </h3>
                      </div>
                      <h3 className="inter-display-medium f-s-15">
                        {CurrencyType(false)}
                        {numToCurrency(
                          card?.netBalance * (this.state.currency?.rate || 1)
                        )}{" "}
                        <span className="inter-display-medium f-s-15 lh-19 grey-ADA">
                          {CurrencyType(true)}
                        </span>
                      </h3>
                    </div>

                    {/* Table Content */}
                    {card.items
                      ? card.items.slice(0, 1).map((groupComp, i) => {
                          return (
                            <>
                              <Row key={`carItem-${i}`} className="table-head">
                                <Col md={3}>
                                  <div className="header-col">
                                    <span className="inter-display-medium f-s-12 lh-15 secondaryDarkText secondaryDarkText-nohover">
                                      Token
                                    </span>
                                  </div>
                                </Col>
                                <Col md={3}>
                                  <div className="header-col">
                                    <span className="inter-display-medium f-s-12 lh-15 secondaryDarkText secondaryDarkText-nohover">
                                      Type
                                    </span>
                                  </div>
                                </Col>
                                <Col md={3}>
                                  <div
                                    style={{
                                      justifyContent: "center",
                                    }}
                                    className="header-col"
                                  >
                                    <span className="inter-display-medium f-s-12 lh-15 secondaryDarkText secondaryDarkText-nohover">
                                      Balance
                                    </span>
                                  </div>
                                </Col>
                                <Col md={3}>
                                  <div
                                    style={{
                                      justifyContent: "flex-end",
                                    }}
                                    className="header-col"
                                  >
                                    <span className="inter-display-medium f-s-12 lh-15 secondaryDarkText secondaryDarkText-nohover">
                                      USD Value
                                    </span>
                                  </div>
                                </Col>
                              </Row>
                              {groupComp?.walletItems &&
                              groupComp.walletItems.length > 0
                                ? groupComp.walletItems
                                    .slice(0, 2)
                                    .map((rowData, indexTwo) => {
                                      return (
                                        <Row
                                          key={`defiTableRows-${i}-${index}-${indexTwo}`}
                                          className="table-content-row"
                                        >
                                          <Col md={3}>
                                            <div className="d-flex align-items-center h-100">
                                              <div className="overlap-img">
                                                {rowData.logos?.length > 0
                                                  ? rowData.logos?.map(
                                                      (e, indexThree) => {
                                                        return (
                                                          <Image
                                                            key={`defiTableRowAsset-${i}-${index}-${indexTwo}-${indexThree}`}
                                                            src={e}
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

                                          <Col md={3}>
                                            <div className="d-flex flex-column align-items-center justify-content-center h-100 ">
                                              {/* <CustomOverlay
                                                position="top"
                                                isIcon={false}
                                                isInfo={true}
                                                isText={true}
                                                text={groupComp.type}
                                              > */}
                                              <h3 className="overflowValueContainer inter-display-medium f-s-13 lh-13 ml-2">
                                                {groupComp.type}
                                              </h3>
                                              {/* </CustomOverlay> */}
                                            </div>
                                          </Col>
                                          <Col md={3}>
                                            <div className="d-flex flex-column align-items-center justify-content-center h-100 ">
                                              {rowData?.balance
                                                ? rowData.balance.map(
                                                    (e, indexFour) => {
                                                      return (
                                                        // <CustomOverlay
                                                        //   position="top"
                                                        //   isIcon={false}
                                                        //   isInfo={true}
                                                        //   isText={true}
                                                        //   text={
                                                        //     e
                                                        //       ? convertNtoNumber(
                                                        //           e
                                                        //         )
                                                        //       : "0.00"
                                                        //   }
                                                        // >
                                                        <div
                                                          className={`${
                                                            indexFour > 0
                                                              ? "mt-3"
                                                              : ""
                                                          } inter-display-medium f-s-13 lh-15`}
                                                          key={`balance-${i}-${index}-${indexTwo}-${indexFour}`}
                                                        >
                                                          {e
                                                            ? isNaN(e)
                                                              ? e
                                                              : this.curToNumToTwoDec(
                                                                  e
                                                                )
                                                            : "0.00"}
                                                        </div>
                                                      );
                                                    }
                                                  )
                                                : null}
                                            </div>
                                          </Col>
                                          <Col md={3}>
                                            {rowData.usdValue ? (
                                              <div className="d-flex align-items-center justify-content-end h-100">
                                                {/* <CustomOverlay
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
                                                > */}
                                                <div className="overflowValueContainer inter-display-medium f-s-13 lh-15">
                                                  {CurrencyType(false)}
                                                  {numToCurrency(
                                                    rowData.usdValue.toFixed(2),
                                                    "en-US",
                                                    "USD"
                                                  )}
                                                </div>
                                                {/* </CustomOverlay> */}
                                              </div>
                                            ) : (
                                              <div className="d-flex align-items-center justify-content-end h-100">
                                                {/* <CustomOverlay
                                                  position="top"
                                                  isIcon={false}
                                                  isInfo={true}
                                                  isText={true}
                                                  text={"$0.00"}
                                                > */}
                                                <div className="overflowValueContainer inter-display-medium f-s-13 lh-15">
                                                  $0.00
                                                </div>
                                                {/* </CustomOverlay> */}
                                              </div>
                                            )}
                                          </Col>
                                        </Row>
                                      );
                                    })
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
                style={{
                  textAlign: "center",
                  height: "26rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
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
                  height: "29rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                // className="animation-wrapper"
              >
                <Loading />
              </div>
            )}
          </div>
          {!this.state.isYeildToggle ? (
            <>
              {this.state.totalDefiPositions > 3 ? (
                <div className="inter-display-medium bottomExtraInfo">
                  <div
                    className="bottomExtraInfoText"
                    onClick={this.goToDefiPage}
                  >
                    Click here to see{" "}
                    {numToCurrency(
                      this.state.totalDefiPositions - 3,
                      true
                    ).toLocaleString("en-US")}
                    + DeFi position
                    {this.state.totalDefiPositions - 3 > 1 ? "s" : ""}
                  </div>
                </div>
              ) : (
                <div className="inter-display-medium bottomExtraInfo">
                  <div
                    className="bottomExtraInfoText"
                    onClick={this.goToDefiPage}
                  >
                    Click here to see more
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  defiState: state.DefiState,
  commonState: state.CommonState,
});

const mapDispatchToProps = {
  updateWalletListFlag,
  updateDefiData,
  getProtocolBalanceApi,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PortfolioHomeDefiBlock);
