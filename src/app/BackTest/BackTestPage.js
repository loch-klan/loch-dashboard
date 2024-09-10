import React from "react";

import { connect } from "react-redux";
import { BaseReactComponent } from "../../utils/form";

import moment from "moment";
import {
  mobileCheck,
  numToCurrency,
  strategyByilderChartLineColorByIndex,
  strategyByilderChartLineColorByIndexLowOpacity,
} from "../../utils/ReusableFunctions";
import MobileLayout from "../layout/MobileLayout";
import WelcomeCard from "../Portfolio/WelcomeCard";
import "./_backTest.scss";
import { getBackTestChart, getBackTestTable } from "./Api/BackTestApi";
import BackTestPageContent from "./BackTestPageContent";
import BackTestPageMobile from "./BackTestPageMobile";

class BackTestPage extends BaseReactComponent {
  constructor(props) {
    super(props);

    this.state = {
      isFromCalendar: false,
      isToCalendar: false,
      toDate: new Date(),
      fromDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      fromAndToDate: "",
      isSaveInvestStrategy: true,
      saveStrategyCheck: false,
      loadingSaveInvestStrategyBtn: false,
      strategiesOptions: [
        {
          label: "All",
          value: "all",
        },
        {
          label: "BTC",
          value: "btc",
          color: "gold",
        },
        { label: "ETH", value: "eth", color: "blue" },
      ],
      selectedStrategiesOptions: [],

      performanceVisualizationGraphData: [],

      performanceMetricTableData: [],
      performanceVisualizationGraphLoading: false,
      performanceMetricTableLoading: false,
      performanceMetricColumnList: [
        {
          labelName: (
            <div
              className="history-table-header-col no-hover history-table-header-col-curve-left"
              id="time"
            >
              <span className="inter-display-medium f-s-11 zeroOpacity">
                Strategy
                <br />
                name
              </span>
            </div>
          ),
          dataKey: "strategy",

          coumnWidth: 0.14285714,
          isCell: true,
          cell: (rowData, dataKey, dataIndex) => {
            if (dataKey === "strategy") {
              return (
                // <CustomOverlay
                //   position="top"
                //   isIcon={false}
                //   isInfo={true}
                //   isText={true}
                //   text={
                //     rowData.strategy_name
                //       ? rowData.strategy_name.toUpperCase()
                //       : ""
                //   }
                // >
                <div className="strategy-builder-table-strategy-name-container">
                  <div
                    style={{
                      backgroundColor:
                        strategyByilderChartLineColorByIndexLowOpacity(
                          dataIndex
                        ),
                    }}
                    className="strategy-builder-table-strategy-name dotDotText inter-display-medium text-uppercase f-s-12"
                  >
                    <svg
                      width="5"
                      height="6"
                      viewBox="0 0 5 6"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="strategy-builder-table-strategy-name-circle"
                    >
                      <circle
                        cx="2.5"
                        cy="3"
                        r="2.5"
                        fill={strategyByilderChartLineColorByIndex(dataIndex)}
                      />
                    </svg>

                    <div className="strategy-builder-table-strategy-name-text">
                      {rowData.strategy_name}
                    </div>
                  </div>
                </div>
                //  </CustomOverlay>
              );
            }
          },
        },
        {
          labelName: (
            <div className="history-table-header-col no-hover" id="time">
              <span className="inter-display-medium f-s-11 ">
                Cumulative
                <br />
                return
              </span>
            </div>
          ),
          dataKey: "cumret",

          coumnWidth: 0.14285714,
          isCell: true,
          cell: (rowData, dataKey) => {
            if (dataKey === "cumret") {
              return (
                // <CustomOverlay
                //   position="top"
                //   isIcon={false}
                //   isInfo={true}
                //   isText={true}
                //   text={
                //     rowData.cumulative_return
                //       ? rowData.cumulative_return + "%"
                //       : "0.00%"
                //   }
                // >
                <div className="inter-display-medium f-s-12">
                  {rowData.cumulative_return ? (
                    <span>
                      {numToCurrency(rowData.cumulative_return).toLocaleString(
                        "en-US"
                      )}
                      %
                    </span>
                  ) : (
                    "0.00%"
                  )}
                </div>
                //  </CustomOverlay>
              );
            }
          },
        },
        {
          labelName: (
            <div className="history-table-header-col no-hover" id="time">
              <span className="inter-display-medium f-s-11 ">
                Annual
                <br />
                return
              </span>
            </div>
          ),
          dataKey: "anuret",

          coumnWidth: 0.14285714,
          isCell: true,
          cell: (rowData, dataKey) => {
            if (dataKey === "anuret") {
              return (
                // <CustomOverlay
                //   position="top"
                //   isIcon={false}
                //   isInfo={true}
                //   isText={true}
                //   text={
                //     rowData.annual_return
                //       ? rowData.annual_return + "%"
                //       : "0.00%"
                //   }
                // >
                <div className="inter-display-medium f-s-12">
                  {rowData.annual_return ? (
                    <span>
                      {numToCurrency(rowData.annual_return).toLocaleString(
                        "en-US"
                      )}
                      %
                    </span>
                  ) : (
                    "0.00%"
                  )}
                </div>
                //  </CustomOverlay>
              );
            }
          },
        },
        {
          labelName: (
            <div className="history-table-header-col no-hover" id="time">
              <span className="inter-display-medium f-s-11 ">
                Max 1d
                <br />
                drawdown
              </span>
            </div>
          ),
          dataKey: "max1ddd",

          coumnWidth: 0.14285714,
          isCell: true,
          cell: (rowData, dataKey) => {
            if (dataKey === "max1ddd") {
              return (
                // <CustomOverlay
                //   position="top"
                //   isIcon={false}
                //   isInfo={true}
                //   isText={true}
                //   text={
                //     rowData.max_1d_drawdown
                //       ? rowData.max_1d_drawdown + "%"
                //       : "0.00%"
                //   }
                // >
                <div className="inter-display-medium f-s-12">
                  {rowData.max_1d_drawdown ? (
                    <span>
                      -
                      {numToCurrency(rowData.max_1d_drawdown).toLocaleString(
                        "en-US"
                      )}
                      %
                    </span>
                  ) : (
                    "0.00%"
                  )}
                </div>
                //  </CustomOverlay>
              );
            }
          },
        },
        {
          labelName: (
            <div className="history-table-header-col no-hover" id="time">
              <span className="inter-display-medium f-s-11 ">
                Max 1w
                <br />
                drawdown
              </span>
            </div>
          ),
          dataKey: "max1wdd",

          coumnWidth: 0.14285714,
          isCell: true,
          cell: (rowData, dataKey) => {
            if (dataKey === "max1wdd") {
              return (
                // <CustomOverlay
                //   position="top"
                //   isIcon={false}
                //   isInfo={true}
                //   isText={true}
                //   text={
                //     rowData.max_1w_drawdown
                //       ? rowData.max_1w_drawdown + "%"
                //       : "0.00%"
                //   }
                // >
                <div className="inter-display-medium f-s-12">
                  {rowData.max_1w_drawdown ? (
                    <span>
                      -
                      {numToCurrency(rowData.max_1w_drawdown).toLocaleString(
                        "en-US"
                      )}
                      %
                    </span>
                  ) : (
                    "0.00%"
                  )}
                </div>
                //  </CustomOverlay>
              );
            }
          },
        },
        {
          labelName: (
            <div className="history-table-header-col no-hover" id="time">
              <span className="inter-display-medium f-s-11 ">
                Max 1m
                <br />
                drawdown
              </span>
            </div>
          ),
          dataKey: "max1mdd",

          coumnWidth: 0.14285714,
          isCell: true,
          cell: (rowData, dataKey) => {
            if (dataKey === "max1mdd") {
              return (
                // <CustomOverlay
                //   position="top"
                //   isIcon={false}
                //   isInfo={true}
                //   isText={true}
                //   text={
                //     rowData.max_1m_drawdown
                //       ? rowData.max_1m_drawdown + "%"
                //       : "0.00%"
                //   }
                // >
                <div className="inter-display-medium f-s-12">
                  {rowData.max_1m_drawdown ? (
                    <span>
                      -
                      {numToCurrency(rowData.max_1m_drawdown).toLocaleString(
                        "en-US"
                      )}
                      %
                    </span>
                  ) : (
                    "0.00%"
                  )}
                </div>
                //  </CustomOverlay>
              );
            }
          },
        },
        {
          labelName: (
            <div
              className="history-table-header-col no-hover history-table-header-col-curve-right"
              id="time"
            >
              <span className="inter-display-medium f-s-11 ">
                Sharpe
                <br />
                ratio
              </span>
            </div>
          ),
          dataKey: "sharpeRatio",

          coumnWidth: 0.14285714,
          isCell: true,
          cell: (rowData, dataKey) => {
            if (dataKey === "sharpeRatio") {
              return (
                // <CustomOverlay
                //   position="top"
                //   isIcon={false}
                //   isInfo={true}
                //   isText={true}
                //   text={
                //     rowData.sharpe_ratio ? rowData.sharpe_ratio + "%" : "0.00%"
                //   }
                // >
                <div className="inter-display-medium f-s-12">
                  {rowData.sharpe_ratio ? (
                    <span>
                      {numToCurrency(rowData.sharpe_ratio).toLocaleString(
                        "en-US"
                      )}
                      %
                    </span>
                  ) : (
                    "0.00%"
                  )}
                </div>
                //  </CustomOverlay>
              );
            }
          },
        },
      ],
    };
  }
  saveStrategyClicked = () => {
    this.setState({
      saveStrategyCheck: !this.state.saveStrategyCheck,
      loadingSaveInvestStrategyBtn: true,
    });
  };

  showSaveStrategy = () => {
    this.setState({
      isSaveInvestStrategy: true,
      loadingSaveInvestStrategyBtn: false,
    });
  };
  hideSaveStrategy = () => {
    if (this.state.isSaveInvestStrategy) {
      this.setState({
        isSaveInvestStrategy: false,
      });
    }
  };
  addCurrentQuery = (passedQueryId) => {};
  hideToCalendar = () => {
    this.setState({
      isToCalendar: false,
    });
  };
  hideFromCalendar = () => {
    this.setState({
      isFromCalendar: false,
    });
  };
  showFromCalendar = () => {
    this.setState({
      isFromCalendar: true,
    });
  };
  showToCalendar = () => {
    this.setState({
      isToCalendar: true,
    });
  };
  getDataForTable = async (passedAssets) => {
    let tempApiData = new URLSearchParams();
    let tempTokenList = [];
    passedAssets.forEach((item) => {
      if (item === "eth" || item === "btc") {
        tempTokenList.push(item);
      } else {
        tempApiData.append("strategy_id", item);
        tempApiData.append("current_portfolio_balance", 20000);
      }
    });
    tempApiData.append("token_list", JSON.stringify(tempTokenList));
    tempApiData.append(
      "start_datetime",
      moment(this.state.fromDate).format("X")
    );
    tempApiData.append("end_datetime", moment(this.state.toDate).format("X"));
    this.props.getBackTestTable(tempApiData, this);
  };
  getDataForGraph = async (passedAssets, passedColor) => {
    let tempToDate = new Date();
    let tempFromDate = new Date(
      new Date().setFullYear(new Date().getFullYear() - 10)
    );
    let tempApiData = new URLSearchParams();
    let tempTokenList = [];

    passedAssets.forEach((item) => {
      if (item === "eth" || item === "btc") {
        tempTokenList.push(item);
      } else {
        tempApiData.append("strategy_id", item);
        tempApiData.append("current_portfolio_balance", 20000);
      }
    });
    tempApiData.append("token_list", JSON.stringify(tempTokenList));
    tempApiData.append("start_datetime", moment(tempFromDate).format("X"));
    tempApiData.append("end_datetime", moment(tempToDate).format("X"));
    this.props.getBackTestChart(tempApiData, this);
  };
  selectStrategies = (passedData) => {
    if (passedData === "all") {
      this.setState({
        selectedStrategiesOptions: [],
      });
    } else {
      this.setState({
        selectedStrategiesOptions: passedData,
      });
    }
  };

  getAssetData = (passedSelectedAssets, notForChart = false) => {
    const allItemArr = [];

    passedSelectedAssets.forEach((item) => {
      if (item.value !== "all") {
        allItemArr.push(item.value);
      }
    });
    if (notForChart) {
      this.setState({
        performanceMetricTableData: [],
        performanceMetricTableLoading: true,
      });
      this.getDataForTable(allItemArr);
    } else {
      this.setState({
        performanceVisualizationGraphData: [],
        performanceMetricTableData: [],
        performanceVisualizationGraphLoading: true,
        performanceMetricTableLoading: true,
      });
      this.getDataForGraph(allItemArr);
      this.getDataForTable(allItemArr);
    }
  };

  componentDidMount() {
    const lastStrategy = window.localStorage.getItem("lastStrategyId");
    if (lastStrategy) {
      let tempStrategiesOption = {
        label: "Strategy",
        value: lastStrategy,
      };

      this.setState(
        {
          strategiesOptions: [
            {
              label: "All",
              value: "all",
            },
            {
              label: "BTC",
              value: "btc",
              color: "gold",
            },
            { label: "ETH", value: "eth", color: "blue" },
            tempStrategiesOption,
          ],
        },
        () => {
          this.getAssetData(this.state.strategiesOptions);
        }
      );
    } else {
      this.getAssetData(this.state.strategiesOptions);
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.BackTestQueryState !== this.props.BackTestQueryState) {
      let currentQueryItem = 0;
      if (this.props.BackTestQueryState.length > 0) {
        currentQueryItem =
          this.props.BackTestQueryState[
            this.props.BackTestQueryState.length - 1
          ].id;
        let tempStrategiesOption = {
          label: "Strategy",
          value: currentQueryItem,
        };
        const previousLastStrategyId = window.localStorage.getItem(
          "lastStrategyId",
          currentQueryItem
        );
        if (previousLastStrategyId !== currentQueryItem) {
          window.localStorage.setItem("lastStrategyId", currentQueryItem);

          this.setState(
            {
              strategiesOptions: [
                {
                  label: "All",
                  value: "all",
                },
                {
                  label: "BTC",
                  value: "btc",
                  color: "gold",
                },
                { label: "ETH", value: "eth", color: "blue" },
                tempStrategiesOption,
              ],
              selectedStrategiesOptions: [],
            },
            () => {
              this.getAssetData(this.state.strategiesOptions);
            }
          );
        }
      }
    }
    if (prevProps.BackTestTableState !== this.props.BackTestTableState) {
      let tempBtTableData = this.props.BackTestTableState;

      if (tempBtTableData) {
        this.setState({
          performanceMetricTableLoading: false,
        });
        let tempArr = [];
        tempBtTableData.forEach((curItem) => {
          for (var key in curItem) {
            if (curItem.hasOwnProperty(key)) {
              let itemFound = curItem[key];
              if (itemFound) {
                let tempHolder = {
                  annual_return: itemFound.annual_return,
                  calmar_ratio: itemFound.calmar_ratio,
                  cumulative_return: itemFound.cumulative_return,
                  max_1d_drawdown: itemFound.max_1d_drawdown,
                  max_1w_drawdown: itemFound.max_1w_drawdown,
                  max_1m_drawdown: itemFound.max_1m_drawdown,
                  sharpe_ratio: itemFound.sharpe_ratio,
                  strategy_name: key,
                };
                tempArr.push(tempHolder);
              }
            }
          }
        });

        this.setState({
          performanceMetricTableData: tempArr,
        });
      }
    }
    if (prevProps.BackTestChartState !== this.props.BackTestChartState) {
      this.calcChartData();
    }
    if (
      prevState.selectedStrategiesOptions !==
      this.state.selectedStrategiesOptions
    ) {
      if (this.state.selectedStrategiesOptions.length === 0) {
        this.getAssetData(this.state.strategiesOptions);
      } else {
        let filteredAssets = [];
        this.state.strategiesOptions.forEach((item) => {
          if (
            this.state.selectedStrategiesOptions.includes(item.label) ||
            this.state.selectedStrategiesOptions.includes(item.value)
          ) {
            filteredAssets.push(item);
          }
        });
        this.getAssetData(filteredAssets);
      }
    }
  }
  calcChartData = (minRange = 0, maxRange) => {
    let tempBtChartData = this.props.BackTestChartState;

    if (tempBtChartData && tempBtChartData.length > 0) {
      let tempRangeDateHolder = "";
      this.setState({
        performanceVisualizationGraphLoading: false,
      });

      let allGraphListItems = [];
      tempBtChartData.forEach((curItem, curIndex) => {
        for (var key in curItem) {
          let tempRangeDate = "";
          if (curItem.hasOwnProperty(key)) {
            let itemFound = curItem[key];
            if (itemFound && itemFound.constructor === Array) {
              let tempInitialValueHolder = itemFound[0][1];

              let chartDataPointHolder = itemFound.map((item, mapIndex) => {
                if (mapIndex === 0 && curIndex === 0) {
                  tempRangeDate =
                    tempRangeDate +
                    moment(item[0]).format("MMM DD YYYY") +
                    " to ";
                }
                if (mapIndex === tempBtChartData.length - 1 && curIndex === 0) {
                  tempRangeDate =
                    tempRangeDate + moment(item[0]).format("MMM DD YYYY");
                }

                const dateObj = new Date(item[0]);
                const timestamp = dateObj.getTime();

                const convertedDate = moment(dateObj).format("DD MM YYYY");
                if (convertedDate === minRange) {
                  tempInitialValueHolder = itemFound[mapIndex][1];
                }

                let tempValueHolder = 0;
                if (mapIndex > 0 && item[1] && tempInitialValueHolder) {
                  tempValueHolder = parseFloat(
                    (
                      ((item[1] - tempInitialValueHolder) /
                        tempInitialValueHolder) *
                      100
                    ).toFixed(2)
                  );
                }
                let tempHolder = [
                  timestamp,
                  tempValueHolder,
                  parseFloat(item[1]).toFixed(2),
                ];
                return tempHolder;
              });

              const tempGraphOptions = {
                name: key,
                data: chartDataPointHolder,
                type: "line",
                fillOpacity: 0,
                // fillColor:
                //   curIndex === 0
                //     ? {
                //         linearGradient: [0, 0, 0, 200],

                //         stops: [
                //           [0, "rgba(128, 67, 243,0.5)"],
                //           [1, "transparent"],
                //         ],
                //       }
                //     : curIndex === 1
                //     ? {
                //         linearGradient: [0, 0, 0, 200],
                //         stops: [
                //           [0, "rgba(86, 185, 182,0.5)"],
                //           [1, "transparent"],
                //         ],
                //       }
                //     : {
                //         linearGradient: [0, 0, 0, 200],
                //         stops: [
                //           [0, "rgba(43, 127, 255,0.5)"],
                //           [1, "transparent"],
                //         ],
                //       },
                color: strategyByilderChartLineColorByIndex(curIndex),
              };
              allGraphListItems.push(tempGraphOptions);
              tempRangeDateHolder = tempRangeDate;
            }
          }
        }
      });

      this.setState({
        performanceVisualizationGraphData: allGraphListItems,
        fromAndToDate: tempRangeDateHolder,
      });
    }
  };
  changeToDate = (date) => {
    this.hideToCalendar();
    this.setState(
      {
        toDate: date,
      },
      () => {
        if (this.state.selectedStrategiesOptions.length === 0) {
          this.getAssetData(this.state.strategiesOptions, true);
        } else {
          let filteredAssets = [];
          this.state.strategiesOptions.forEach((item) => {
            if (
              this.state.selectedStrategiesOptions.includes(item.label) ||
              this.state.selectedStrategiesOptions.includes(item.value)
            ) {
              filteredAssets.push(item);
            }
          });
          this.getAssetData(filteredAssets, true);
        }
      }
    );
  };
  changeFromDate = (date) => {
    this.hideFromCalendar();
    this.setState(
      {
        fromDate: date,
      },
      () => {
        if (this.state.selectedStrategiesOptions.length === 0) {
          this.getAssetData(this.state.strategiesOptions, true);
        } else {
          let filteredAssets = [];
          this.state.strategiesOptions.forEach((item) => {
            if (
              this.state.selectedStrategiesOptions.includes(item.label) ||
              this.state.selectedStrategiesOptions.includes(item.value)
            ) {
              filteredAssets.push(item);
            }
          });
          this.getAssetData(filteredAssets, true);
        }
      }
    );
  };
  render() {
    if (mobileCheck()) {
      return (
        <MobileLayout
          handleShare={this.handleShare}
          isSidebarClosed={this.props.isSidebarClosed}
          history={this.props.history}
          hideFooter
          hideAddresses
          hideShare
        >
          <BackTestPageMobile
            saveStrategyCheck={this.state.saveStrategyCheck}
            showSaveStrategy={this.showSaveStrategy}
            hideSaveStrategy={this.hideSaveStrategy}
            fromAndToDate={this.state.fromAndToDate}
            performanceVisualizationGraphLoading={
              this.state.performanceVisualizationGraphLoading
            }
            performanceMetricTableLoading={
              this.state.performanceMetricTableLoading
            }
            selectStrategies={this.selectStrategies}
            strategiesOptions={this.state.strategiesOptions}
            selectedStrategiesOptions={this.state.selectedStrategiesOptions}
            performanceMetricColumnList={this.state.performanceMetricColumnList}
            performanceMetricTableData={this.state.performanceMetricTableData}
            performanceVisualizationGraphData={
              this.state.performanceVisualizationGraphData
            }
            hideToCalendar={this.hideToCalendar}
            hideFromCalendar={this.hideFromCalendar}
            showFromCalendar={this.showFromCalendar}
            showToCalendar={this.showToCalendar}
            isFromCalendar={this.state.isFromCalendar}
            isToCalendar={this.state.isToCalendar}
            changeFromDate={this.changeFromDate}
            changeToDate={this.changeToDate}
            fromDate={this.state.fromDate}
            toDate={this.state.toDate}
          />
        </MobileLayout>
      );
    }
    return (
      <div className="back-test-page">
        {/* topbar */}
        <div className="portfolio-page-section">
          <div
            className="portfolio-container page"
            style={{ overflow: "visible" }}
          >
            <div className="portfolio-section">
              {/* welcome card */}
              <WelcomeCard
                loadingSaveInvestStrategyBtn={
                  this.state.loadingSaveInvestStrategyBtn
                }
                saveStrategyClicked={this.saveStrategyClicked}
                isSaveInvestStrategy={this.state.isSaveInvestStrategy}
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
                hideButton={false}
                updateOnFollow={this.callApi}
                hideShare
              />
            </div>
          </div>
        </div>
        <div className="page">
          <div className=" page-scroll">
            <div className="page-scroll-child page-scroll-child-full-width">
              <BackTestPageContent
                saveStrategyCheck={this.state.saveStrategyCheck}
                showSaveStrategy={this.showSaveStrategy}
                hideSaveStrategy={this.hideSaveStrategy}
                fromAndToDate={this.state.fromAndToDate}
                performanceVisualizationGraphLoading={
                  this.state.performanceVisualizationGraphLoading
                }
                performanceMetricTableLoading={
                  this.state.performanceMetricTableLoading
                }
                selectStrategies={this.selectStrategies}
                strategiesOptions={this.state.strategiesOptions}
                selectedStrategiesOptions={this.state.selectedStrategiesOptions}
                performanceMetricColumnList={
                  this.state.performanceMetricColumnList
                }
                performanceMetricTableData={
                  this.state.performanceMetricTableData
                }
                performanceVisualizationGraphData={
                  this.state.performanceVisualizationGraphData
                }
                hideToCalendar={this.hideToCalendar}
                hideFromCalendar={this.hideFromCalendar}
                showFromCalendar={this.showFromCalendar}
                showToCalendar={this.showToCalendar}
                isFromCalendar={this.state.isFromCalendar}
                isToCalendar={this.state.isToCalendar}
                changeFromDate={this.changeFromDate}
                changeToDate={this.changeToDate}
                calcChartData={this.calcChartData}
                fromDate={this.state.fromDate}
                toDate={this.state.toDate}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  BackTestChartState: state.BackTestChartState,
  BackTestTableState: state.BackTestTableState,
  BackTestQueryState: state.BackTestQueryState,
});
const mapDispatchToProps = {
  getBackTestChart,
  getBackTestTable,
};

BackTestPage.propTypes = {};
export default connect(mapStateToProps, mapDispatchToProps)(BackTestPage);
