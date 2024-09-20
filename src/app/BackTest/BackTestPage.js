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
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";

class BackTestPage extends BaseReactComponent {
  constructor(props) {
    super(props);

    this.state = {
      passedStrategyList: [],
      passedUserList: [],
      isFromCalendar: false,
      isToCalendar: false,
      toDate: new Date(new Date().setDate(new Date().getDate() - 1)),
      fromDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      fromAndToDate: "",
      isSaveInvestStrategy: false,
      saveStrategyCheck: false,
      loadingSaveInvestStrategyBtn: false,
      saveStrategyName: "",
      strategiesOptions: [
        {
          label: "BTC",
          value: "btc",
          color: "gold",
        },
        { label: "ETH", value: "eth", color: "blue" },
      ],
      selectedStrategiesOptions: [],

      performanceVisualizationGraphData: [],
      performanceVisualizationGraphDataOriginal: {},

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
              <span className="inter-display-medium f-s-12 zeroOpacity">
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
                <div className="strategy-builder-table-strategy-name-container">
                  <CustomOverlay
                    position="top"
                    isIcon={false}
                    isInfo={true}
                    isText={true}
                    text={
                      rowData.strategy_name
                        ? rowData.strategy_name.toUpperCase()
                        : ""
                    }
                  >
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

                      <div className="strategy-builder-table-strategy-name-text dotDotText">
                        {rowData.strategy_name}
                      </div>
                    </div>
                  </CustomOverlay>
                </div>
              );
            }
          },
        },
        {
          labelName: (
            <div className="history-table-header-col no-hover" id="time">
              <span className="inter-display-medium f-s-12 ">
                Cumulative
                <br />
                Return
              </span>
            </div>
          ),
          dataKey: "cumret",

          coumnWidth: 0.14285714,
          isCell: true,
          cell: (rowData, dataKey) => {
            if (dataKey === "cumret") {
              return (
                <div className="inter-display-medium f-s-12">
                  {rowData.cumulative_return ? (
                    <span>
                      {rowData.cumulative_return < 0 ? "-" : ""}
                      {numToCurrency(rowData.cumulative_return).toLocaleString(
                        "en-US"
                      )}
                      %
                    </span>
                  ) : (
                    "0.00%"
                  )}
                </div>
              );
            }
          },
        },
        {
          labelName: (
            <div className="history-table-header-col no-hover" id="time">
              <span className="inter-display-medium f-s-12 ">
                Annual
                <br />
                Return
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
                      {rowData.annual_return < 0 ? "-" : ""}
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
              <span className="inter-display-medium f-s-12 ">
                Max 1d
                <br />
                Drawdown
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
                      {rowData.max_1d_drawdown < 0 ? "-" : ""}
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
              <span className="inter-display-medium f-s-12 ">
                Max 1w
                <br />
                Drawdown
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
                      {rowData.max_1w_drawdown < 0 ? "-" : ""}
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
              <span className="inter-display-medium f-s-12 ">
                Max 1m
                <br />
                Drawdown
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
                      {rowData.max_1m_drawdown < 0 ? "-" : ""}
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
              <span className="inter-display-medium f-s-12 ">
                Sharpe
                <br />
                Ratio
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
                      {rowData.sharpe_ratio < 0 ? "-" : ""}
                      {numToCurrency(rowData.sharpe_ratio).toLocaleString(
                        "en-US"
                      )}
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
  saveStrategyClicked = (passedName) => {
    this.setState(
      {
        saveStrategyName: passedName,
      },
      this.setState({
        saveStrategyCheck: !this.state.saveStrategyCheck,

        loadingSaveInvestStrategyBtn: true,
      })
    );
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
        tempApiData.append("strategy_list", JSON.stringify([item]));
        tempApiData.append("current_portfolio_balance", 20000);
      }
    });
    // if (this.state.passedStrategyList.length > 0) {
    //   tempApiData.append(
    //     "strategy_list",
    //     JSON.stringify(this.state.passedStrategyList)
    //   );
    // }
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
        performanceVisualizationGraphDataOriginal: {},
        performanceMetricTableData: [],
        performanceVisualizationGraphLoading: true,
        performanceMetricTableLoading: true,
      });
      this.getDataForGraph(allItemArr);
      this.getDataForTable(allItemArr);
    }
  };

  componentDidMount() {
    const { state } = this.props.location;
    if (state && state.passedStrategyId) {
      this.setState(
        {
          passedStrategyList: [state.passedStrategyId],
          passedUserList: [state.passedUserId],
        },
        () => {
          const tempItem = [
            ...this.state.strategiesOptions,
            { label: "strategy", value: state.passedStrategyId },
          ];
          this.getAssetData(tempItem);
        }
      );
    } else {
      this.getAssetData(this.state.strategiesOptions);
    }

    // const lastStrategy = window.localStorage.getItem("lastStrategyId");
    // if (lastStrategy) {
    //   let tempStrategiesOption = {
    //     label: "Strategy",
    //     value: lastStrategy,
    //   };

    //   this.setState(
    //     {
    //       strategiesOptions: [
    //         {
    //           label: "All",
    //           value: "all",
    //         },
    //         {
    //           label: "BTC",
    //           value: "btc",
    //           color: "gold",
    //         },
    //         { label: "ETH", value: "eth", color: "blue" },
    //         tempStrategiesOption,
    //       ],
    //     },
    //     () => {
    //       this.getAssetData(this.state.strategiesOptions);
    //     }
    //   );
    // } else {
    // }
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.BackTestLatestStrategyState !==
      this.props.BackTestLatestStrategyState
    ) {
      let tempStrategiesOption = {
        label: "Strategy",
        value: this.props.BackTestLatestStrategyState,
      };
      this.setState(
        {
          strategiesOptions: [
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
    // if (prevProps.BackTestQueryState !== this.props.BackTestQueryState) {
    //   let currentQueryItem = 0;
    //   if (this.props.BackTestQueryState.length > 0) {
    //     currentQueryItem =
    //       this.props.BackTestQueryState[
    //         this.props.BackTestQueryState.length - 1
    //       ].id;
    //     let tempStrategiesOption = {
    //       label: "Strategy",
    //       value: currentQueryItem,
    //     };
    //     const previousLastStrategyId = window.localStorage.getItem(
    //       "lastStrategyId",
    //       currentQueryItem
    //     );
    //     if (previousLastStrategyId !== currentQueryItem) {
    //       window.localStorage.setItem("lastStrategyId", currentQueryItem);

    //       this.setState(
    //         {
    //           strategiesOptions: [
    //             {
    //               label: "All",
    //               value: "all",
    //             },
    //             {
    //               label: "BTC",
    //               value: "btc",
    //               color: "gold",
    //             },
    //             { label: "ETH", value: "eth", color: "blue" },
    //             tempStrategiesOption,
    //           ],
    //           selectedStrategiesOptions: [],
    //         },
    //         () => {
    //           this.getAssetData(this.state.strategiesOptions);
    //         }
    //       );
    //     }
    //   }
    // }
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
                  annual_return: itemFound.data.annual_return,
                  calmar_ratio: itemFound.data.calmar_ratio,
                  cumulative_return: itemFound.data.cumulative_return,
                  max_1d_drawdown: itemFound.data.max_1d_drawdown,
                  max_1w_drawdown: itemFound.data.max_1w_drawdown,
                  max_1m_drawdown: itemFound.data.max_1m_drawdown,
                  sharpe_ratio: itemFound.data.sharpe_ratio,
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
    // if (
    //   prevState.selectedStrategiesOptions !==
    //   this.state.selectedStrategiesOptions
    // ) {
    //   if (this.state.selectedStrategiesOptions.length === 0) {
    //     this.getAssetData(this.state.strategiesOptions);
    //   } else {
    //     let filteredAssets = [];
    //     this.state.strategiesOptions.forEach((item) => {
    //       if (
    //         this.state.selectedStrategiesOptions.includes(item.label) ||
    //         this.state.selectedStrategiesOptions.includes(item.value)
    //       ) {
    //         filteredAssets.push(item);
    //       }
    //     });
    //     this.getAssetData(filteredAssets);
    //   }
    // }
  }
  calcChartData = (minRange = 0, minTimeFormat = 0) => {
    let tempBtChartData = this.props.BackTestChartState.chartData;
    let tempBtChartDataOriginal = this.props.BackTestChartState
      .chartDataOriginal
      ? this.props.BackTestChartState.chartDataOriginal
      : [];
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
              let tempInitialValueHolder = 0;

              let chartDataPointHolder = [];
              itemFound.forEach((item, mapIndex) => {
                const dateObj = new Date(item[0]);
                const timestamp = dateObj.getTime();
                const tempDateHolder = moment(dateObj);
                if (tempDateHolder.isSame(moment(), "day")) {
                  return;
                }
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
                const convertedDate = moment(dateObj).format("DD MM YYYY");
                if (convertedDate === minRange) {
                  tempInitialValueHolder = itemFound[mapIndex][1];
                }
                if (mapIndex === 0 && moment(minTimeFormat).isBefore(item[0])) {
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
                chartDataPointHolder.push(tempHolder);
                // return tempHolder;
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
        performanceVisualizationGraphDataOriginal: tempBtChartDataOriginal,
        fromAndToDate: tempRangeDateHolder,
      });
    }
  };
  afterChangeDate = () => {
    if (this.state.strategiesOptions.length > 2) {
      let filteredAssets = [];
      this.state.strategiesOptions.forEach((item) => {
        filteredAssets.push(item);
      });
      this.getAssetData(filteredAssets, true);
    } else {
      const { state } = this.props.location;
      if (state && state.passedStrategyId) {
        const tempItem = [
          ...this.state.strategiesOptions,
          { label: "strategy", value: state.passedStrategyId },
        ];
        this.getAssetData(tempItem, true);
      } else {
        this.getAssetData(this.state.strategiesOptions, true);
      }
    }
  };
  changeToDate = (date) => {
    this.hideToCalendar();
    this.setState(
      {
        toDate: date,
      },
      () => {
        this.afterChangeDate();
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
        this.afterChangeDate();
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
          // showTopSearchBar
          // Save Invest
          loadingSaveInvestStrategyBtn={this.state.loadingSaveInvestStrategyBtn}
          saveStrategyClicked={this.saveStrategyClicked}
          isSaveInvestStrategy={this.state.isSaveInvestStrategy}
          // Save Invest
        >
          <BackTestPageMobile
            saveStrategyName={this.state.saveStrategyName}
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
            performanceVisualizationGraphDataOriginal={
              this.state.performanceVisualizationGraphDataOriginal
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
                passedStrategyList={this.state.passedStrategyList}
                passedUserList={this.state.passedUserList}
                saveStrategyName={this.state.saveStrategyName}
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
                performanceVisualizationGraphDataOriginal={
                  this.state.performanceVisualizationGraphDataOriginal
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
  BackTestLatestStrategyState: state.BackTestLatestStrategyState,
});
const mapDispatchToProps = {
  getBackTestChart,
  getBackTestTable,
};

BackTestPage.propTypes = {};
export default connect(mapStateToProps, mapDispatchToProps)(BackTestPage);
