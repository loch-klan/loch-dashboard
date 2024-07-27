import React from "react";
import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import {
  DexScreenerExpIcon,
  DexScreenerHoldersIcon,
  DexScreenerLiquidityProvidersIcon,
  DexScreenerTopTradersIcon,
  DexScreenerTransactionTableIcon,
  DexScreenerTxnIcon,
} from "../../assets/images/icons";
import { BaseReactComponent } from "../../utils/form";
import {
  GetAllPlan,
  getUser,
  setPageFlagDefault,
  updateWalletListFlag,
} from "../common/Api";
import { getAvgCostBasis } from "../cost/Api";
import TransactionTable from "../intelligence/TransactionTable";
import { getAllCoins } from "../onboarding/Api";
import { getAllWalletListApi } from "../wallet/Api";
import { mobileCheck } from "../../utils/ReusableFunctions";

class DexScreenerFourTables extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      goToBottom: false,
      apiResponse: false,
      sort: [],
      isMobile: mobileCheck(),
      isLoading: false,
      selectedTable: 1,

      // Table Data
      transactionsColumnList: [
        {
          labelName: (
            <div className="history-table-header-col no-hover" id="time">
              <span className="inter-display-medium lh-16 ">Date</span>
            </div>
          ),
          dataKey: "date",

          coumnWidth: 0.125,
          isCell: true,
          cell: (rowData, dataKey) => {
            if (dataKey === "date") {
              return (
                <div className="ds-table-row ds-right-border ds-bottom-border inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div dex-screener-light-font">
                  {rowData.date}
                </div>
              );
            }
          },
        },
        {
          labelName: (
            <div className="history-table-header-col no-hover" id="time">
              <span className="inter-display-medium lh-16 ">Type</span>
            </div>
          ),
          dataKey: "type",

          coumnWidth: 0.12,
          isCell: true,
          cell: (rowData, dataKey) => {
            if (dataKey === "type") {
              return (
                <div className="ds-table-row ds-right-border ds-bottom-border  inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div">
                  {rowData.type}
                </div>
              );
            }
          },
        },
        {
          labelName: (
            <div className="history-table-header-col no-hover" id="time">
              <span className="inter-display-medium lh-16 ">USD</span>
            </div>
          ),
          dataKey: "USD",

          coumnWidth: 0.13,
          isCell: true,
          cell: (rowData, dataKey) => {
            if (dataKey === "USD") {
              return (
                <div className="ds-table-row ds-right-border ds-bottom-border  inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div">
                  {rowData.usd}
                </div>
              );
            }
          },
        },
        {
          labelName: (
            <div className="history-table-header-col no-hover" id="time">
              <span className="inter-display-medium lh-16 ">SCOOBY</span>
            </div>
          ),
          dataKey: "SCOOBY",

          coumnWidth: 0.13,
          isCell: true,
          cell: (rowData, dataKey) => {
            if (dataKey === "SCOOBY") {
              return (
                <div className="ds-table-row ds-right-border ds-bottom-border  inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div">
                  {rowData.scooby}
                </div>
              );
            }
          },
        },
        {
          labelName: (
            <div className="history-table-header-col no-hover" id="time">
              <span className="inter-display-medium lh-16 ">SOL</span>
            </div>
          ),
          dataKey: "SOL",

          coumnWidth: 0.13,
          isCell: true,
          cell: (rowData, dataKey) => {
            if (dataKey === "SOL") {
              return (
                <div className="ds-table-row ds-right-border ds-bottom-border  inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div">
                  {rowData.sol}
                </div>
              );
            }
          },
        },
        {
          labelName: (
            <div className="history-table-header-col no-hover" id="time">
              <span className="inter-display-medium lh-16 ">Price</span>
            </div>
          ),
          dataKey: "Price",

          coumnWidth: 0.13,
          isCell: true,
          cell: (rowData, dataKey) => {
            if (dataKey === "Price") {
              return (
                <div className="ds-table-row ds-right-border ds-bottom-border  inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div">
                  {rowData.price}
                </div>
              );
            }
          },
        },
        {
          labelName: (
            <div className="history-table-header-col no-hover" id="time">
              <span className="inter-display-medium lh-16 ">Maker</span>
            </div>
          ),
          dataKey: "Maker",

          coumnWidth: 0.13,
          isCell: true,
          cell: (rowData, dataKey) => {
            if (dataKey === "Maker") {
              return (
                <div className="ds-table-row ds-right-border ds-bottom-border  inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div">
                  {rowData.maker}
                </div>
              );
            }
          },
        },
        {
          labelName: (
            <div className="history-table-header-col no-hover" id="time">
              <span className="inter-display-medium lh-16 ">TXN</span>
            </div>
          ),
          dataKey: "TXN",

          coumnWidth: 0.1,
          isCell: true,
          cell: (rowData, dataKey) => {
            if (dataKey === "TXN") {
              return (
                <div className="ds-table-row ds-bottom-border ">
                  <Image
                    src={DexScreenerTxnIcon}
                    style={{
                      height: "15px",
                      filter: "var(--invertColor)",
                    }}
                  />
                </div>
              );
            }
          },
        },
      ],
      topTradersColumnList: [
        {
          labelName: (
            <div className="history-table-header-col no-hover" id="time">
              <span className="inter-display-medium lh-16 ">No.</span>
            </div>
          ),
          dataKey: "No.",

          coumnWidth: 0.06,
          isCell: true,
          cell: (rowData, dataKey) => {
            if (dataKey === "No.") {
              return (
                <div className="ds-table-row ds-right-border ds-bottom-border inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div dex-screener-light-font">
                  {rowData.date}
                </div>
              );
            }
          },
        },
        {
          labelName: (
            <div className="history-table-header-col no-hover" id="time">
              <span className="inter-display-medium lh-16 ">MAKER</span>
            </div>
          ),
          dataKey: "MAKER",

          coumnWidth: 0.2,
          isCell: true,
          cell: (rowData, dataKey) => {
            if (dataKey === "MAKER") {
              return (
                <div className="ds-table-row ds-right-border ds-bottom-border ds-image-text  inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div">
                  <Image
                    src={rowData.makerImage}
                    className="ds-image-text-image"
                  />
                  <div className="ds-image-text-text">{rowData.maker}</div>
                </div>
              );
            }
          },
        },
        {
          labelName: (
            <div className="history-table-header-col no-hover" id="time">
              <span className="inter-display-medium lh-16 ">BOUGHT</span>
            </div>
          ),
          dataKey: "BOUGHT",

          coumnWidth: 0.18,
          isCell: true,
          cell: (rowData, dataKey) => {
            if (dataKey === "BOUGHT") {
              return (
                <div className="ds-table-row ds-right-border ds-bottom-border  inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div ds-main-sub">
                  <div className="ds-main-sub-main-text ds-main-sub-main-text-red">
                    {rowData.boughtAmount}
                  </div>
                  <div className="ds-main-sub-sub-text">
                    {rowData.boughtDesc}
                  </div>
                </div>
              );
            }
          },
        },
        {
          labelName: (
            <div className="history-table-header-col no-hover" id="time">
              <span className="inter-display-medium lh-16 ">SOLD</span>
            </div>
          ),
          dataKey: "SOLD",

          coumnWidth: 0.18,
          isCell: true,
          cell: (rowData, dataKey) => {
            if (dataKey === "SOLD") {
              return (
                <div className="ds-table-row ds-right-border ds-bottom-border  inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div ds-main-sub">
                  <div className="ds-main-sub-main-text ds-main-sub-main-text-green">
                    {rowData.soldAmount}
                  </div>
                  <div className="ds-main-sub-sub-text">{rowData.soldDesc}</div>
                </div>
              );
            }
          },
        },
        {
          labelName: (
            <div className="history-table-header-col no-hover" id="time">
              <span className="inter-display-medium lh-16 ">PNL</span>
            </div>
          ),
          dataKey: "PNL",

          coumnWidth: 0.18,
          isCell: true,
          cell: (rowData, dataKey) => {
            if (dataKey === "PNL") {
              return (
                <div className="ds-table-row ds-right-border ds-bottom-border  inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div ds-main-sub">
                  <div className="ds-main-sub-main-text ds-main-sub-main-text-green">
                    {rowData.pnl}
                  </div>
                </div>
              );
            }
          },
        },
        {
          labelName: (
            <div className="history-table-header-col no-hover" id="time">
              <span className="inter-display-medium lh-16 ">UNREALIZED</span>
            </div>
          ),
          dataKey: "UNREALIZED",

          coumnWidth: 0.145,
          isCell: true,
          cell: (rowData, dataKey) => {
            if (dataKey === "UNREALIZED") {
              return (
                <div className="ds-table-row ds-right-border ds-bottom-border  inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div">
                  {rowData.unrealized}
                </div>
              );
            }
          },
        },
        {
          labelName: (
            <div className="history-table-header-col no-hover" id="time">
              <span className="inter-display-medium lh-16 ">BALANCE</span>
            </div>
          ),
          dataKey: "BALANCE",

          coumnWidth: 0.145,
          isCell: true,
          cell: (rowData, dataKey) => {
            if (dataKey === "BALANCE") {
              return (
                <div className="ds-table-row ds-right-border ds-bottom-border  inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div ds-multi-line">
                  {rowData.balance}
                </div>
              );
            }
          },
        },
        {
          labelName: (
            <div className="history-table-header-col no-hover" id="time">
              <span className="inter-display-medium lh-16 ">TXNS</span>
            </div>
          ),
          dataKey: "TXNS",

          coumnWidth: 0.06,
          isCell: true,
          cell: (rowData, dataKey) => {
            if (dataKey === "TXNS") {
              return (
                <div className="ds-table-row ds-bottom-border ds-right-border">
                  <Image
                    src={DexScreenerTxnIcon}
                    style={{
                      height: "15px",
                      filter: "var(--invertColor)",
                    }}
                  />
                </div>
              );
            }
          },
        },
        {
          labelName: (
            <div className="history-table-header-col no-hover" id="time">
              <span className="inter-display-medium lh-16 ">EXP</span>
            </div>
          ),
          dataKey: "EXP",

          coumnWidth: 0.06,
          isCell: true,
          cell: (rowData, dataKey) => {
            if (dataKey === "EXP") {
              return (
                <div className="ds-table-row ds-bottom-border ">
                  <Image
                    src={DexScreenerExpIcon}
                    style={{
                      height: "15px",
                      filter: "var(--invertColor)",
                    }}
                  />
                </div>
              );
            }
          },
        },
      ],
      holdersColumnList: [
        {
          labelName: (
            <div className="history-table-header-col no-hover" id="time">
              <span className="inter-display-medium lh-16 ">address</span>
            </div>
          ),
          dataKey: "address",

          coumnWidth: 0.23,
          isCell: true,
          cell: (rowData, dataKey) => {
            if (dataKey === "address") {
              return (
                <div className="ds-table-row ds-right-border ds-bottom-border ds-image-text  inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div">
                  <Image
                    src={rowData.addressImage}
                    className="ds-image-text-image"
                  />
                  <div className="ds-image-text-text">{rowData.address}</div>
                </div>
              );
            }
          },
        },
        {
          labelName: (
            <div className="history-table-header-col no-hover" id="time">
              <span className="inter-display-medium lh-16 ">%</span>
            </div>
          ),
          dataKey: "%",

          coumnWidth: 0.198,
          isCell: true,
          cell: (rowData, dataKey) => {
            if (dataKey === "%") {
              return (
                <div className="ds-table-row ds-right-border ds-bottom-border  inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div">
                  {rowData.percentage}
                </div>
              );
            }
          },
        },
        {
          labelName: (
            <div className="history-table-header-col no-hover" id="time">
              <span className="inter-display-medium lh-16 ">amount</span>
            </div>
          ),
          dataKey: "amount",

          coumnWidth: 0.198,
          isCell: true,
          cell: (rowData, dataKey) => {
            if (dataKey === "amount") {
              return (
                <div className="ds-table-row ds-right-border ds-bottom-border  inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div ds-main-sub">
                  <div className="ds-main-sub-main-text ">
                    {rowData.amountAmount}
                  </div>
                  <div className="ds-main-sub-sub-text">
                    {rowData.amountDesc}
                  </div>
                </div>
              );
            }
          },
        },
        {
          labelName: (
            <div className="history-table-header-col no-hover" id="time">
              <span className="inter-display-medium lh-16 ">value</span>
            </div>
          ),
          dataKey: "value",

          coumnWidth: 0.198,
          isCell: true,
          cell: (rowData, dataKey) => {
            if (dataKey === "value") {
              return (
                <div className="ds-table-row ds-right-border ds-bottom-border  inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div">
                  {rowData.value}
                </div>
              );
            }
          },
        },

        {
          labelName: (
            <div className="history-table-header-col no-hover" id="time">
              <span className="inter-display-medium lh-16 ">TXNS</span>
            </div>
          ),
          dataKey: "TXNS",

          coumnWidth: 0.1,
          isCell: true,
          cell: (rowData, dataKey) => {
            if (dataKey === "TXNS") {
              return (
                <div className="ds-table-row ds-bottom-border ds-right-border">
                  <Image
                    src={DexScreenerTxnIcon}
                    style={{
                      height: "15px",
                      filter: "var(--invertColor)",
                    }}
                  />
                </div>
              );
            }
          },
        },
        {
          labelName: (
            <div className="history-table-header-col no-hover" id="time">
              <span className="inter-display-medium lh-16 ">EXP</span>
            </div>
          ),
          dataKey: "EXP",

          coumnWidth: 0.1,
          isCell: true,
          cell: (rowData, dataKey) => {
            if (dataKey === "EXP") {
              return (
                <div className="ds-table-row ds-bottom-border ">
                  <Image
                    src={DexScreenerExpIcon}
                    style={{
                      height: "15px",
                      filter: "var(--invertColor)",
                    }}
                  />
                </div>
              );
            }
          },
        },
      ],
      liquidityPeovidersColumnList: [
        {
          labelName: (
            <div className="history-table-header-col no-hover" id="time">
              <span className="inter-display-medium lh-16 ">address</span>
            </div>
          ),
          dataKey: "address",

          coumnWidth: 0.25,
          isCell: true,
          cell: (rowData, dataKey) => {
            if (dataKey === "address") {
              return (
                <div className="ds-table-row ds-right-border ds-bottom-border inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div">
                  {rowData.address}
                </div>
              );
            }
          },
        },
        {
          labelName: (
            <div className="history-table-header-col no-hover" id="time">
              <span className="inter-display-medium lh-16 ">%</span>
            </div>
          ),
          dataKey: "%",

          coumnWidth: 0.25,
          isCell: true,
          cell: (rowData, dataKey) => {
            if (dataKey === "%") {
              return (
                <div className="ds-table-row ds-right-border ds-bottom-border  inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div">
                  {rowData.percentage}
                </div>
              );
            }
          },
        },
        {
          labelName: (
            <div className="history-table-header-col no-hover" id="time">
              <span className="inter-display-medium lh-16 ">amount</span>
            </div>
          ),
          dataKey: "amount",

          coumnWidth: 0.28,
          isCell: true,
          cell: (rowData, dataKey) => {
            if (dataKey === "amount") {
              return (
                <div className="ds-table-row ds-right-border ds-bottom-border  inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div ds-main-sub">
                  <div className="ds-main-sub-main-text ">
                    {rowData.amountAmount}
                  </div>
                  <div className="ds-main-sub-sub-text">
                    {rowData.amountDesc}
                  </div>
                </div>
              );
            }
          },
        },

        {
          labelName: (
            <div className="history-table-header-col no-hover" id="time">
              <span className="inter-display-medium lh-16 ">TXNS</span>
            </div>
          ),
          dataKey: "TXNS",

          coumnWidth: 0.11,
          isCell: true,
          cell: (rowData, dataKey) => {
            if (dataKey === "TXNS") {
              return (
                <div className="ds-table-row ds-bottom-border ds-right-border">
                  <Image
                    src={DexScreenerTxnIcon}
                    style={{
                      height: "15px",
                      filter: "var(--invertColor)",
                    }}
                  />
                </div>
              );
            }
          },
        },
        {
          labelName: (
            <div className="history-table-header-col no-hover" id="time">
              <span className="inter-display-medium lh-16 ">EXP</span>
            </div>
          ),
          dataKey: "EXP",

          coumnWidth: 0.11,
          isCell: true,
          cell: (rowData, dataKey) => {
            if (dataKey === "EXP") {
              return (
                <div className="ds-table-row ds-bottom-border ">
                  <Image
                    src={DexScreenerExpIcon}
                    style={{
                      height: "15px",
                      filter: "var(--invertColor)",
                    }}
                  />
                </div>
              );
            }
          },
        },
      ],
      // Table Data
    };
  }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {}

  selectTableOne = () => {
    this.setState({ selectedTable: 1 });
  };
  selectTableTwo = () => {
    this.setState({ selectedTable: 2 });
  };
  selectTableThree = () => {
    this.setState({ selectedTable: 3 });
  };
  selectTableFour = () => {
    this.setState({ selectedTable: 4 });
  };
  render() {
    return (
      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          minWidth: "unset",
        }}
        className="transaction-history-table overflow-table-header-visible"
      >
        <div className="dex-screener-table-toggle-block">
          <div className="dex-screener-table-toggle">
            <div
              onClick={this.selectTableOne}
              className={`dex-screener-table-toggle-elements dex-screener-table-toggle-elements-left-radius  ${
                this.state.selectedTable === 1
                  ? "dex-screener-table-toggle-elements-selected"
                  : ""
              }`}
            >
              <Image
                src={DexScreenerTransactionTableIcon}
                className="dex-screener-table-toggle-elements-image"
              />
              <div className="dex-screener-table-toggle-elements-text">
                Transactions
              </div>
            </div>
            <div
              onClick={this.selectTableTwo}
              className={`dex-screener-table-toggle-elements  ${
                this.state.selectedTable === 2
                  ? "dex-screener-table-toggle-elements-selected"
                  : ""
              }`}
            >
              <Image
                src={DexScreenerTopTradersIcon}
                className="dex-screener-table-toggle-elements-image"
              />
              <div className="dex-screener-table-toggle-elements-text">
                Top Traders
              </div>
            </div>
            <div
              onClick={this.selectTableThree}
              className={`dex-screener-table-toggle-elements  ${
                this.state.selectedTable === 3
                  ? "dex-screener-table-toggle-elements-selected"
                  : ""
              }`}
            >
              <Image
                src={DexScreenerHoldersIcon}
                className="dex-screener-table-toggle-elements-image"
              />
              <div className="dex-screener-table-toggle-elements-text">
                Holders
              </div>
            </div>
            <div
              onClick={this.selectTableFour}
              className={`dex-screener-table-toggle-elements dex-screener-table-toggle-elements-right-radius  ${
                this.state.selectedTable === 4
                  ? "dex-screener-table-toggle-elements-selected"
                  : ""
              }`}
            >
              <Image
                src={DexScreenerLiquidityProvidersIcon}
                className="dex-screener-table-toggle-elements-image"
              />
              <div className="dex-screener-table-toggle-elements-text">
                Liquidity Providers
              </div>
            </div>
          </div>

          {this.state.selectedTable === 1 ? (
            <div
              style={{
                overflowX: this.state.isMobile ? "scroll" : "",
              }}
              className={`${
                this.state.isMobile
                  ? "freezeTheFirstColumn newHomeTableContainer hide-scrollbar"
                  : ""
              }`}
            >
              <TransactionTable
                noSubtitleBottomPadding
                tableData={this.props.transactionsTableData}
                columnList={this.state.transactionsColumnList}
                message={"No transactions found"}
                isLoading={false}
                pageLimit={10}
                hidePaginationRecords
                yAxisScrollable
                addWatermark={!this.state.isMobile}
                fakeWatermark={this.state.isMobile}
                xAxisScrollable={this.state.isMobile}
                xAxisScrollableColumnWidth={3.5}
                isMiniversion={this.state.isMobile}
              />
            </div>
          ) : this.state.selectedTable === 2 ? (
            <div
              style={{
                overflowX: this.state.isMobile ? "scroll" : "",
              }}
              className={`${
                this.state.isMobile
                  ? "freezeTheFirstColumn newHomeTableContainer hide-scrollbar"
                  : ""
              }`}
            >
              <TransactionTable
                noSubtitleBottomPadding
                tableData={this.props.topTradersTableData}
                columnList={this.state.topTradersColumnList}
                message={"No transactions found"}
                isLoading={false}
                pageLimit={10}
                paginationNew
                hidePaginationRecords
                yAxisScrollable
                addWatermark={!this.state.isMobile}
                fakeWatermark={this.state.isMobile}
                xAxisScrollable={this.state.isMobile}
                xAxisScrollableColumnWidth={3.5}
                isMiniversion={this.state.isMobile}
              />
            </div>
          ) : this.state.selectedTable === 3 ? (
            <div
              style={{
                overflowX: this.state.isMobile ? "scroll" : "",
              }}
              className={`${
                this.state.isMobile
                  ? "freezeTheFirstColumn newHomeTableContainer hide-scrollbar"
                  : ""
              }`}
            >
              <TransactionTable
                noSubtitleBottomPadding
                tableData={this.props.holdersTableData}
                columnList={this.state.holdersColumnList}
                message={"No transactions found"}
                isLoading={false}
                pageLimit={10}
                paginationNew
                hidePaginationRecords
                yAxisScrollable
                addWatermark={!this.state.isMobile}
                fakeWatermark={this.state.isMobile}
                xAxisScrollable={this.state.isMobile}
                xAxisScrollableColumnWidth={3.5}
                isMiniversion={this.state.isMobile}
              />
            </div>
          ) : this.state.selectedTable === 4 ? (
            <div
              style={{
                overflowX: this.state.isMobile ? "scroll" : "",
              }}
              className={`${
                this.state.isMobile
                  ? "freezeTheFirstColumn newHomeTableContainer hide-scrollbar"
                  : ""
              }`}
            >
              <TransactionTable
                noSubtitleBottomPadding
                tableData={this.props.liquidityProvidersTableData}
                columnList={this.state.liquidityPeovidersColumnList}
                message={"No transactions found"}
                isLoading={false}
                pageLimit={10}
                paginationNew
                hidePaginationRecords
                yAxisScrollable
                addWatermark={!this.state.isMobile}
                fakeWatermark={this.state.isMobile}
                xAxisScrollable={this.state.isMobile}
                xAxisScrollableColumnWidth={3.5}
                isMiniversion={this.state.isMobile}
              />
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  NFTState: state.NFTState,
  commonState: state.CommonState,
});

const mapDispatchToProps = {
  updateWalletListFlag,
  getAllCoins,
  getAvgCostBasis,
  GetAllPlan,
  getUser,
  getAllWalletListApi,
  setPageFlagDefault,
};

DexScreenerFourTables.propTypes = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DexScreenerFourTables);
