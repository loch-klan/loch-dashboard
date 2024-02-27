import React from "react";
import { connect } from "react-redux";
import BaseReactComponent from "../../utils/form/BaseReactComponent";

import { updateWalletListFlag } from "../common/Api";
import { updateDefiData } from "../defi/Api";
import {
  getExchangeBalances,
  getProtocolBalanceApi,
  getUserWallet,
  isFollowedByUser,
} from "./Api";

import { Image } from "react-bootstrap";
import arrowUp from "../../assets/images/arrow-up.svg";
import LinkIcon from "../../assets/images/link.svg";
import {
  Mobile_Home_Open_Defi_Credit_Balance,
  Mobile_Home_Open_Defi_Debt_Balance,
  Mobile_Home_Open_Network_Balance,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import {
  amountFormat,
  lightenDarkenColor,
  loadingAnimation,
  numToCurrency,
} from "../../utils/ReusableFunctions";
import {
  addAddressToWatchList,
  removeAddressFromWatchList,
} from "../watchlist/redux/WatchListApi";
import { ChartSeeMoreArrowIcon } from "../../assets/images/icons";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";

class PieChart2Mobile extends BaseReactComponent {
  constructor(props) {
    super(props);

    this.state = {
      showArrowIcon: false,
      isChainToggle: false,
      isDebtToggle: false,
      isYeildToggle: false,
      assetData: [],
    };
  }
  arrowIconLoaded = () => {
    this.setState({
      showArrowIcon: true,
    });
  };
  toggleChain = () => {
    if (!this.props.chainLoader) {
      if (!this.state.isChainToggle) {
        Mobile_Home_Open_Network_Balance({
          session_id: getCurrentUser().id,
          email_address: getCurrentUser().email,
        });
      }
      this.setState({
        isChainToggle: !this.state.isChainToggle,
      });

      // NetworkTab({
      //   session_id: getCurrentUser().id,
      //   email_address: getCurrentUser().email,
      // });
    }
  };
  toggleYield = () => {
    if (!this.props.defiLoader) {
      if (!this.state.isYeildToggle) {
        Mobile_Home_Open_Defi_Credit_Balance({
          session_id: getCurrentUser().id,
          email_address: getCurrentUser().email,
        });
      }
      this.setState({
        isYeildToggle: !this.state.isYeildToggle,
        isDebtToggle: false,
      });
      // HomeDefiDebt({
      //   session_id: getCurrentUser().id,
      //   email_address: getCurrentUser().email,
      // });
    }
  };

  toggleDebt = () => {
    if (!this.props.defiLoader) {
      if (!this.state.isDebtToggle) {
        Mobile_Home_Open_Defi_Debt_Balance({
          session_id: getCurrentUser().id,
          email_address: getCurrentUser().email,
        });
      }
      this.setState({
        isDebtToggle: !this.state.isDebtToggle,
        isYeildToggle: false,
      });

      // HomeDefiYield({
      //   session_id: getCurrentUser().id,
      //   email_address: getCurrentUser().email,
      // });
    }
  };

  componentDidMount() {
    if (this.props.assetData) {
      let totalAmount = 0;
      this.props.assetData.forEach((resRes) => {
        let tempAssetVal = resRes.assetValue ? resRes.assetValue : 0;
        totalAmount = totalAmount + tempAssetVal;
      });
      const tempAssetData = this.props.assetData.map((resRes) => {
        let tempAssetVal = resRes.assetValue ? resRes.assetValue : 0;
        let tempCount = resRes.count ? resRes.count : 0;
        let percentageVal = 0;
        let singlePriceVal = 0;
        if (tempAssetVal) {
          percentageVal = (tempAssetVal / totalAmount) * 100;
          if (tempCount) {
            singlePriceVal = tempAssetVal / tempCount;
          }
        }
        return {
          ...resRes,
          percentageOfPortfolio: percentageVal,
          singleAssetPrice: singlePriceVal,
        };
      });
      this.setState({
        assetData: tempAssetData,
      });
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.assetData !== this.props.assetData) {
      let totalAmount = 0;
      this.props.assetData.forEach((resRes) => {
        let tempAssetVal = resRes.assetValue ? resRes.assetValue : 0;
        totalAmount = totalAmount + tempAssetVal;
      });
      const tempAssetData = this.props.assetData.map((resRes) => {
        let tempAssetVal = resRes.assetValue ? resRes.assetValue : 0;
        let tempCount = resRes.count ? resRes.count : 0;
        let percentageVal = 0;
        let singlePriceVal = 0;
        if (tempAssetVal) {
          percentageVal = (tempAssetVal / totalAmount) * 100;
          if (tempCount) {
            singlePriceVal = tempAssetVal / tempCount;
          }
        }
        return {
          ...resRes,
          percentageOfPortfolio: percentageVal,
          singleAssetPrice: singlePriceVal,
        };
      });
      this.setState({
        assetData: tempAssetData,
      });
    }
  }
  render() {
    const CostBasisColumnData = [
      {
        labelName: (
          <div className="cp history-table-header-col no-hover" id="Asset">
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Asset
            </span>
          </div>
        ),
        dataKey: "Asset",
        // coumnWidth: 118,
        coumnWidth: 0.2,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "Asset" && rowData.assetSymbol) {
            return (
              <Image
                src={rowData.assetSymbol}
                style={{
                  height: "2.5rem",
                }}
              />
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col no-hover"
            id="Average Cost Price"
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Price
            </span>
          </div>
        ),
        dataKey: "Price",
        // coumnWidth: 153,
        coumnWidth: 0.25,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "Price") {
            let usdVal = 0;
            if (rowData.singleAssetPrice) {
              usdVal = rowData.singleAssetPrice;
            }
            return (
              <span className="inter-display-medium f-s-13 lh-16 grey-313">
                {usdVal === 0 ? "N/A" : "$" + numToCurrency(usdVal)}
              </span>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col no-hover"
            id="Current Price"
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Value
            </span>
          </div>
        ),
        dataKey: "Value",
        // coumnWidth: 128,
        coumnWidth: 0.25,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "Value") {
            if (rowData === "EMPTY") {
              return null;
            }
            const assetVal = rowData.assetValue ? rowData.assetValue : 0;
            return (
              <span className="inter-display-medium f-s-13 lh-16 grey-313">
                {assetVal === 0 ? "N/A" : "$" + numToCurrency(assetVal)}
              </span>
            );
          }
        },
      },

      {
        labelName: (
          <div className="cp history-table-header-col no-hover" id="Gain loss">
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              % Portfolio
            </span>
          </div>
        ),
        dataKey: "PortfolioPercentage",
        // coumnWidth: 128,
        coumnWidth: 0.3,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "PortfolioPercentage") {
            if (rowData === "EMPTY") {
              return null;
            }
            let percentageVal = 0;
            if (rowData.percentageOfPortfolio) {
              percentageVal = rowData.percentageOfPortfolio;
            }
            return (
              <div className="cost-common-container">
                <div className="cost-common">
                  <span className="inter-display-medium f-s-13 lh-16 grey-313">
                    {amountFormat(percentageVal.toFixed(2), "en-US", "USD")}%
                  </span>
                </div>
              </div>
            );
          }
        },
      },
    ];
    return (
      <div>
        <h2 className="inter-display-semi-bold f-s-17 lh-19 grey-313">
          Balance by network
        </h2>
        <div
          className={`chain-card ${
            this.props.chainLoader ? "chain-card-loading" : ""
          } ${this.state.isChainToggle ? "chain-card-active" : ""}`}
          style={{
            marginBottom: this.state.isChainToggle ? "30.5rem" : "",
          }}
        >
          <div className="chain-card-child" onClick={this.toggleChain}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              {this.props.chainList &&
                this.props.chainList.slice(0, 3).map((item, i) => {
                  return (
                    <Image
                      src={item.symbol}
                      style={{
                        position: "relative",
                        marginLeft: `${i === 0 ? "0" : "-10"}px`,
                        width: "2.6rem",
                        height: "2.6rem",
                        borderRadius: "6px",
                        zIndex: `${i === 0 ? "3" : i === 1 ? "2" : "1"}`,
                        objectFit: "cover",
                        border: `1px solid ${lightenDarkenColor(
                          item.color,
                          -0.15
                        )}`,
                      }}
                      key={`chainList-${i}`}
                    />
                  );
                })}

              <span
                className="inter-display-medium f-s-16 lh-19 portfolioNetworksText"
                style={{
                  marginLeft: this.props.chainList?.length === 0 ? 0 : "1.2rem",
                }}
              >
                {this.props.chainList && this.props.chainList?.length <= 1
                  ? this.props.chainList?.length + 1 + " Network"
                  : this.props.chainList?.length + 1 + " Networks"}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                whiteSpace: "nowrap",
              }}
            >
              <Image
                onLoad={this.arrowIconLoaded}
                className="defiMenu"
                src={arrowUp}
                style={
                  this.state.isChainToggle
                    ? {
                        filter: "var(--invertColor)",
                        height: "1.25rem",
                        width: "1.25rem",
                        opacity: this.state.showArrowIcon ? 1 : 0,
                      }
                    : {
                        transform: "rotate(180deg)",
                        height: "1.25rem",
                        width: "1.25rem",
                        opacity: this.state.showArrowIcon ? 1 : 0,
                      }
                }
              />
              {this.props.chainLoader && (
                <div style={{ marginTop: "-6px", marginRight: "1rem" }}>
                  {loadingAnimation()}
                </div>
              )}
            </div>
          </div>
          <div
            className="chain-list"
            style={{
              display: `${this.state.isChainToggle ? "block" : "none"}`,
            }}
          >
            <div className="chain-content">
              {this.props.chainList &&
                this.props.chainList?.map((chain, i) => {
                  return (
                    <div
                      className="chain-list-item"
                      key={`chainContentChainList-${i}`}
                      style={{
                        paddingBottom: "1rem",
                      }}
                    >
                      <span className="inter-display-medium f-s-16 lh-19">
                        <Image
                          src={chain?.symbol}
                          style={{
                            width: "2.6rem",
                            height: "2.6rem",
                            borderRadius: "6px",
                            objectFit: "cover",
                            border: `1px solid ${lightenDarkenColor(
                              chain?.color,
                              -0.15
                            )}`,
                          }}
                        />
                        {chain?.name}
                      </span>
                      <CustomOverlay
                        position="top"
                        isIcon={false}
                        isInfo={true}
                        isText={true}
                        text={
                          "$" +
                          amountFormat(chain?.total.toFixed(2), "en-US", "USD")
                        }
                      >
                        <span
                          className="inter-display-medium f-s-15 lh-19 grey-233 chain-list-amt dotDotText"
                          style={{
                            maxWidth: "50%",
                          }}
                        >
                          $
                          {amountFormat(
                            chain?.total.toFixed(2),
                            "en-US",
                            "USD"
                          )}
                        </span>
                      </CustomOverlay>
                    </div>
                  );
                })}
              <div
                className="chain-list-item"
                // key={this.props.chainList.length + 1}
                style={{
                  paddingBottom: "0rem",
                }}
              >
                <span className="inter-display-medium f-s-16 lh-19">
                  <Image
                    src={LinkIcon}
                    style={{
                      width: "2.6rem",
                      height: "2.6rem",
                      padding: "0.55rem",
                      borderRadius: "6px",
                      objectFit: "cover",
                      border: `1px solid ${lightenDarkenColor(
                        "#000000",
                        -0.15
                      )}`,
                    }}
                  />
                  Centralized Exchanges
                </span>
                <span className="inter-display-medium f-s-15 lh-19 grey-233 chain-list-amt">
                  $
                  {amountFormat(
                    this.props.portfolioState?.centralizedExchanges.toFixed(2),
                    "en-US",
                    "USD"
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: "3rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h2 className="inter-display-semi-bold f-s-17 lh-19 grey-313">
            DeFi Balance Sheet
          </h2>
          <p
            onClick={this.props.openDefiPage}
            className="inter-display-medium f-s-10 lh-12 grey-7C7  custom-label"
          >
            <div className="mobileSeeMoreBtn">
              <div className="mobileSeeMoreBtnTxt seeMoreBtn">See more</div>
              <Image
                src={ChartSeeMoreArrowIcon}
                className="mobileSeeMoreBtnIcon"
              />
            </div>
          </p>
        </div>
        <div
          style={{
            marginBottom: this.state.isYeildToggle
              ? "19.5rem"
              : this.state.isDebtToggle
              ? "9.2rem"
              : "1.8rem",
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
                this.props.defiLoader ? "balance-sheet-card-credit-loading" : ""
              }`}
              style={{ whiteSpace: "nowrap" }}
            >
              <div>
                <span
                  className={`balance-sheet-card-credit-title inter-display-semi-bold f-s-16 lh-19
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
                  className={`balance-sheet-card-credit-amount inter-display-regular f-s-16 lh-19
                            ${
                              this.state.isYeildToggle
                                ? "balance-sheet-card-credit-amount-selected"
                                : ""
                            }
                            `}
                >
                  $
                  {this.props.defiState.YieldValues &&
                    numToCurrency(this.props.defiState.totalYield)}
                </span>

                <Image
                  className="defiMenu"
                  src={arrowUp}
                  style={
                    this.state.isYeildToggle
                      ? {
                          ffilter: "var(--invertColor)",
                          opacity: this.state.showArrowIcon ? 1 : 0,
                        }
                      : {
                          transform: "rotate(180deg)",
                          opacity: this.state.showArrowIcon ? 1 : 0,
                        }
                  }
                />
              </div>
            </div>

            <div
              onClick={this.toggleDebt}
              style={{ whiteSpace: "nowrap" }}
              className={`balance-sheet-card-debt ${
                this.props.defiLoader ? "balance-sheet-card-debt-loading" : ""
              }`}
            >
              <div>
                <span
                  className={`balance-sheet-card-credit-title inter-display-semi-bold f-s-16 lh-19
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
                  className={`balance-sheet-card-credit-amount inter-display-regular f-s-16 lh-19
                            ${
                              this.state.isDebtToggle
                                ? "balance-sheet-card-credit-amount-selected"
                                : ""
                            }
                            `}
                >
                  $
                  {this.props.defiState.DebtValues &&
                    numToCurrency(this.props.defiState.totalDebt)}
                </span>

                <Image
                  className="defiMenu"
                  src={arrowUp}
                  style={
                    this.state.isDebtToggle
                      ? {
                          filter: "var(--invertColor)",
                          opacity: this.state.showArrowIcon ? 1 : 0,
                        }
                      : {
                          transform: "rotate(180deg)",
                          opacity: this.state.showArrowIcon ? 1 : 0,
                        }
                  }
                />
              </div>
              {this.props.defiLoader && (
                <div style={{ marginTop: "-6px" }}>{loadingAnimation()}</div>
              )}
            </div>
          </div>
          {(this.state.isYeildToggle || this.state.isDebtToggle) && (
            <div className="balance-dropdown">
              <div className="balance-dropdown-top-fake">
                <div
                  onClick={this.toggleYield}
                  className="balance-dropdown-top-fake-left"
                />
                <div
                  onClick={this.toggleDebt}
                  className="balance-dropdown-top-fake-right"
                />
              </div>
              <div className="balance-list-content-parent">
                <div className="balance-list-content">
                  {/* For yeild */}
                  {this.state.isYeildToggle && (
                    <div>
                      {this.props.defiState.YieldValues &&
                        this.props.defiState.YieldValues.map((item, i) => {
                          return (
                            <div
                              key={`defiState-${i}`}
                              className="balance-sheet-list"
                              style={
                                i ===
                                this.props.defiState.YieldValues.length - 1
                                  ? { paddingBottom: "0.3rem" }
                                  : {}
                              }
                            >
                              <span className="inter-display-medium f-s-16 lh-19">
                                {item.name}
                              </span>

                              <span className="inter-display-medium f-s-15 lh-19 grey-233 balance-amt">
                                $
                                {numToCurrency(
                                  item.totalPrice.toFixed(2),
                                  "en-US",
                                  "USD"
                                )}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  )}

                  {/* For debt */}
                  {this.state.isDebtToggle && (
                    <div>
                      {this.props.defiState.DebtValues &&
                        this.props.defiState.DebtValues.map((item, i) => {
                          return (
                            <div
                              key={`debtDefiState-${i}`}
                              className="balance-sheet-list"
                              style={
                                i === this.props.defiState.DebtValues.length - 1
                                  ? { paddingBottom: "0.3rem" }
                                  : {}
                              }
                            >
                              <span className="inter-display-medium f-s-16 lh-19">
                                {item.name}
                              </span>

                              <span className="inter-display-medium f-s-15 lh-19 grey-233 balance-amt">
                                $
                                {numToCurrency(
                                  item.totalPrice.toFixed(2),
                                  "en-US",
                                  "USD"
                                )}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        {/* <h2
          style={{
            marginTop: "3rem",
          }}
          className="inter-display-semi-bold f-s-16 lh-19 grey-313"
        >
          Assets
        </h2>
        <div className="section-table section-table-mobile-scroll">
          <div className="section-table-mobile-scroll-top-cover" />
          <TransactionTable
            noSubtitleBottomPadding
            disableOnLoading
            isMiniversion
            title=""
            handleClick={() => {}}
            subTitle=""
            message=" "
            tableData={this.state.assetData}
            columnList={CostBasisColumnData}
            headerHeight={60}
            isArrow={true}
            isLoading={this.state.AvgCostLoading}
            isAnalytics="average cost basis"
            yAxisScrollable
          />
        </div>
      */}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  portfolioState: state.PortfolioState,
  defiState: state.DefiState,
  commonState: state.CommonState,
  AddLocalAddWalletState: state.AddLocalAddWalletState,
  HeaderState: state.HeaderState,
  walletState: state.walletState,
});

const mapDispatchToProps = {
  getUserWallet,
  // page flag
  updateWalletListFlag,
  updateDefiData,
  getProtocolBalanceApi,
  addAddressToWatchList,
  getExchangeBalances,
  isFollowedByUser,
  removeAddressFromWatchList,
};
PieChart2Mobile.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(PieChart2Mobile);
