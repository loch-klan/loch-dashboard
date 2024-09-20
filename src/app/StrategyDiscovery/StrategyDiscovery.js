import React from "react";

import { connect } from "react-redux";
import { BaseReactComponent } from "../../utils/form";

import moment from "moment";
import {
  mobileCheck,
  numToCurrency,
  strategyByilderChartLineColorByIndex,
} from "../../utils/ReusableFunctions";
import MobileLayout from "../layout/MobileLayout";
import WelcomeCard from "../Portfolio/WelcomeCard";
import "./_strategyDiscovery.scss";
import { getStrategyDiscoveryTable } from "./Api/StrategyDiscoveryApi";
import StrategyDiscoveryContent from "./StrategyDiscoveryContent";
// import BackTestPageMobile from "./BackTestPageMobile";
import { Image } from "react-bootstrap";
import {
  StrategyDiscoveryDownGreenArrowIcon,
  StrategyDiscoveryDownRedArrowIcon,
} from "../../assets/images/icons";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";

class StrategyDiscovery extends BaseReactComponent {
  constructor(props) {
    super(props);

    this.state = {
      toDate: new Date(),
      fromDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      strategiesOptions: [
        {
          label: "BTC",
          value: "btc",
          color: "gold",
        },
        { label: "ETH", value: "eth", color: "blue" },
      ],
      performanceMetricTableData: [],
      performanceMetricTableLoading: false,
      performanceMetricColumnList: [
        {
          labelName: (
            <div
              className="history-table-header-col no-hover history-table-header-col-curve-left"
              id="time"
            >
              <span className="inter-display-medium f-s-12 ">Title</span>
            </div>
          ),
          dataKey: "strategy",

          coumnWidth: 0.14285714,
          isCell: true,
          cell: (rowData, dataKey, rowIndex) => {
            if (dataKey === "strategy") {
              return (
                <div
                  onClick={() => {
                    this.goToStrategyBuilderPage(rowData);
                  }}
                  className="full-table-row-col-width"
                >
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
                      <div className="strategy-builder-table-strategy-name strategy-builder-table-strategy-name-title dotDotText inter-display-medium text-uppercase">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="strategy-builder-table-strategy-name-circle"
                        >
                          <rect
                            x="5.65686"
                            y="0.343262"
                            width="8"
                            height="8"
                            transform="rotate(45 5.65686 0.343262)"
                            fill={strategyByilderChartLineColorByIndex(
                              rowIndex
                            )}
                          />
                          <rect
                            x="5.65686"
                            y="1.05037"
                            width="7"
                            height="7"
                            transform="rotate(45 5.65686 1.05037)"
                            stroke="black"
                            stroke-opacity="0.1"
                          />
                        </svg>

                        <div className="strategy-builder-table-strategy-name-text dotDotText">
                          {rowData.strategy_name}
                        </div>
                      </div>
                    </CustomOverlay>
                  </div>
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
          cell: (rowData, dataKey, rowIndex) => {
            if (dataKey === "cumret") {
              return (
                <div
                  onClick={() => {
                    this.goToStrategyBuilderPage(rowData);
                  }}
                  className="full-table-row-col-width"
                >
                  <div className="inter-display-medium f-s-12">
                    {rowData.cumulative_return ? (
                      <span>
                        {rowData.cumulative_return < 0 ? "-" : ""}
                        {numToCurrency(
                          rowData.cumulative_return
                        ).toLocaleString("en-US")}
                        %
                      </span>
                    ) : (
                      "0.00%"
                    )}
                  </div>
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
          cell: (rowData, dataKey, rowIndex) => {
            if (dataKey === "anuret") {
              return (
                <div
                  onClick={() => {
                    this.goToStrategyBuilderPage(rowData);
                  }}
                  className="full-table-row-col-width"
                >
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
                </div>
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
          cell: (rowData, dataKey, rowIndex) => {
            if (dataKey === "max1ddd") {
              return (
                <div
                  onClick={() => {
                    this.goToStrategyBuilderPage(rowData);
                  }}
                  className="full-table-row-col-width"
                >
                  {rowData.max_1d_drawdown < 0 ? (
                    <Image
                      className="full-table-row-col-width-arrow"
                      src={StrategyDiscoveryDownRedArrowIcon}
                    />
                  ) : (
                    <Image
                      className="full-table-row-col-width-arrow full-table-row-col-width-arrow-reverse"
                      src={StrategyDiscoveryDownGreenArrowIcon}
                    />
                  )}
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
                </div>
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
          cell: (rowData, dataKey, rowIndex) => {
            if (dataKey === "max1wdd") {
              return (
                <div
                  onClick={() => {
                    this.goToStrategyBuilderPage(rowData);
                  }}
                  className="full-table-row-col-width"
                >
                  {rowData.max_1d_drawdown < 0 ? (
                    <Image
                      className="full-table-row-col-width-arrow"
                      src={StrategyDiscoveryDownRedArrowIcon}
                    />
                  ) : (
                    <Image
                      className="full-table-row-col-width-arrow full-table-row-col-width-arrow-reverse"
                      src={StrategyDiscoveryDownGreenArrowIcon}
                    />
                  )}
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
                </div>
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
          cell: (rowData, dataKey, rowIndex) => {
            if (dataKey === "max1mdd") {
              return (
                <div
                  onClick={() => {
                    this.goToStrategyBuilderPage(rowData);
                  }}
                  className="full-table-row-col-width"
                >
                  {rowData.max_1d_drawdown < 0 ? (
                    <Image
                      className="full-table-row-col-width-arrow"
                      src={StrategyDiscoveryDownRedArrowIcon}
                    />
                  ) : (
                    <Image
                      className="full-table-row-col-width-arrow full-table-row-col-width-arrow-reverse"
                      src={StrategyDiscoveryDownGreenArrowIcon}
                    />
                  )}
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
                </div>
              );
            }
          },
        },
        {
          labelName: (
            <div className="history-table-header-col no-hover" id="time">
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
          cell: (rowData, dataKey, rowIndex) => {
            if (dataKey === "sharpeRatio") {
              return (
                <div
                  onClick={() => {
                    this.goToStrategyBuilderPage(rowData);
                  }}
                  className="full-table-row-col-width"
                >
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
                </div>
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
                Visualization
              </span>
            </div>
          ),
          dataKey: "visualization",

          coumnWidth: 0.14285714,
          isCell: true,
          cell: (rowData, dataKey, rowIndex) => {
            if (dataKey === "visualization") {
              const curColor = strategyByilderChartLineColorByIndex(rowIndex);

              return (
                <div className="full-table-row-col-width">
                  <svg
                    width="108"
                    height="29"
                    viewBox="0 0 108 29"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      opacity="0.3"
                      d="M104.914 3.40986C106.457 3.40986 106.457 1.1665 108 1.1665V28.9998H0V15.5079C1.67142 15.5079 1.54285 16.3332 3.08572 16.3332C4.62857 16.3332 4.62857 13.9897 6.17142 13.9897C7.71429 13.9897 7.45714 14.7107 9.25714 14.7107C11.0571 14.7107 10.5429 16.0608 12.3429 16.0608C14.1429 16.0608 13.7571 15.548 15.4286 15.548C17.1 15.548 16.7786 13.1043 18.5143 13.1043C20.25 13.1043 19.8 13.9015 21.6 13.9015C23.4 13.9015 23.0786 14.9992 24.6857 14.9992C26.2929 14.9992 26.0357 11.3537 27.7714 11.3537C29.5071 11.3537 29.3143 12.6156 30.8571 12.6156C32.4 12.6156 32.1429 10.849 33.9429 10.849C35.7429 10.849 35.3571 11.9787 37.0286 11.9787C38.7 11.9787 38.4429 7.35976 40.1143 7.35976C41.7857 7.35976 41.4643 8.64568 43.2 8.64568C44.9357 8.64568 44.4857 9.49495 46.2857 9.49495C48.0857 9.49495 47.6357 7.29166 49.3714 7.29166C51.1071 7.29166 50.6571 8.37327 52.4571 8.37327C54.2571 8.37327 53.9357 6.59061 55.5429 6.59061C57.15 6.59061 56.9571 3.61016 58.6286 3.61016C60.3 3.61016 60.0429 8.59761 61.7143 8.59761C63.3857 8.59761 63.1929 5.10439 64.8 5.10439C66.4071 5.10439 66.0857 6.63468 67.8857 6.63468C69.6857 6.63468 69.3 8.00873 70.9714 8.00873C72.6429 8.00873 72.45 5.73333 74.0571 5.73333C75.6643 5.73333 75.5357 7.89656 77.1429 7.89656C78.75 7.89656 78.5571 6.93513 80.2286 6.93513C81.9 6.93513 81.6429 4.95216 83.3143 4.95216C84.9857 4.95216 84.7286 5.74535 86.4 5.74535C88.0714 5.74535 87.9429 2.84902 89.4857 2.84902C91.0286 2.84902 90.7714 6.81895 92.5714 6.81895C94.3714 6.81895 93.9214 4.12292 95.6571 4.12292C97.3929 4.12292 97.1357 5.23258 98.7429 5.23258C100.35 5.23258 100.221 2.46845 101.829 2.46845C103.436 2.46845 103.371 3.40986 104.914 3.40986Z"
                      fill={`url(#paint0_linear_12493_5029${rowIndex})`}
                    />
                    <path
                      d="M108 1.1665C106.457 1.1665 106.457 3.40986 104.914 3.40986C103.371 3.40986 103.436 2.46845 101.829 2.46845C100.221 2.46845 100.35 5.23258 98.7429 5.23258C97.1357 5.23258 97.3929 4.12292 95.6571 4.12292C93.9214 4.12292 94.3714 6.81895 92.5714 6.81895C90.7714 6.81895 91.0286 2.84902 89.4857 2.84902C87.9429 2.84902 88.0714 5.74535 86.4 5.74535C84.7286 5.74535 84.9857 4.95216 83.3143 4.95216C81.6429 4.95216 81.9 6.93513 80.2286 6.93513C78.5571 6.93513 78.75 7.89656 77.1429 7.89656C75.5357 7.89656 75.6643 5.73333 74.0571 5.73333C72.45 5.73333 72.6429 8.00873 70.9714 8.00873C69.3 8.00873 69.6857 6.63468 67.8857 6.63468C66.0857 6.63468 66.4071 5.10439 64.8 5.10439C63.1929 5.10439 63.3857 8.59761 61.7143 8.59761C60.0429 8.59761 60.3 3.61016 58.6286 3.61016C56.9571 3.61016 57.15 6.59061 55.5429 6.59061C53.9357 6.59061 54.2571 8.37327 52.4571 8.37327C50.6571 8.37327 51.1071 7.29166 49.3714 7.29166C47.6357 7.29166 48.0857 9.49495 46.2857 9.49495C44.4857 9.49495 44.9357 8.64568 43.2 8.64568C41.4643 8.64568 41.7857 7.35976 40.1143 7.35976C38.4429 7.35976 38.7 11.9787 37.0286 11.9787C35.3571 11.9787 35.7429 10.849 33.9429 10.849C32.1429 10.849 32.4 12.6156 30.8571 12.6156C29.3143 12.6156 29.5071 11.3537 27.7714 11.3537C26.0357 11.3537 26.2929 14.9992 24.6857 14.9992C23.0786 14.9992 23.4 13.9015 21.6 13.9015C19.8 13.9015 20.25 13.1043 18.5143 13.1043C16.7786 13.1043 17.1 15.548 15.4286 15.548C13.7571 15.548 14.1429 16.0608 12.3429 16.0608C10.5429 16.0608 11.0571 14.7107 9.25714 14.7107C7.45714 14.7107 7.71429 13.9897 6.17143 13.9897C4.62857 13.9897 4.62857 16.3332 3.08571 16.3332C1.54286 16.3332 1.67143 15.5079 -3.54648e-06 15.5079"
                      stroke={curColor}
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <defs>
                      <linearGradient
                        id={`paint0_linear_12493_5029${rowIndex}`}
                        x1="54"
                        y1="1.1665"
                        x2="54"
                        y2="27.7607"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop offset="0.32" stop-color={curColor} />
                        <stop
                          offset="0.82"
                          stop-color={curColor}
                          stop-opacity="0"
                        />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              );
            }
          },
        },
      ],
    };
  }

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
    tempApiData.append(
      "strategy_list",
      JSON.stringify(["66e40b1e47827c71acd12a24", "66e40a6231b8c07e390e07ef"])
    );
    tempApiData.append("current_portfolio_balance", 20000);

    tempApiData.append("token_list", JSON.stringify(tempTokenList));
    tempApiData.append(
      "start_datetime",
      moment(this.state.fromDate).format("X")
    );
    tempApiData.append("end_datetime", moment(this.state.toDate).format("X"));
    this.props.getStrategyDiscoveryTable(tempApiData, this);
  };

  getAssetData = (passedSelectedAssets) => {
    const allItemArr = [];

    passedSelectedAssets.forEach((item) => {
      if (item.value !== "all") {
        allItemArr.push(item.value);
      }
    });
    this.setState({
      performanceMetricTableData: [],
      performanceMetricTableLoading: true,
    });
    this.getDataForTable(allItemArr);
  };

  componentDidMount() {
    this.getAssetData(this.state.strategiesOptions);
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.StrategyDiscoveryTableState !==
      this.props.StrategyDiscoveryTableState
    ) {
      let tempBtTableData = this.props.StrategyDiscoveryTableState;

      if (tempBtTableData) {
        this.setState({
          performanceMetricTableLoading: false,
        });
        let tempArr = [];
        tempBtTableData.forEach((curItem) => {
          for (var key in curItem) {
            if (key !== "btc" && key !== "eth" && curItem.hasOwnProperty(key)) {
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
                  strategy_id: itemFound.strategy_id,
                  user_id: itemFound.created_by,
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
  }

  goToStrategyBuilderPage = (passedItem) => {
    if (passedItem.strategy_id) {
      this.props.history.push({
        pathname: "/strategy-builder",
        state: {
          passedStrategyId: passedItem.strategy_id,
          passedUserId: passedItem.user_id,
        },
      });
    } else {
      this.props.history.push("/strategy-builder");
    }
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
          {/* <BackTestPageMobile
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
            fromDate={this.state.fromDate}
            toDate={this.state.toDate}
          /> */}
        </MobileLayout>
      );
    }
    return (
      <div className="strategy-discovery-page">
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
            <div className="page-scroll-child">
              <StrategyDiscoveryContent
                performanceMetricTableLoading={
                  this.state.performanceMetricTableLoading
                }
                performanceMetricColumnList={
                  this.state.performanceMetricColumnList
                }
                performanceMetricTableData={
                  this.state.performanceMetricTableData
                }
                goToStrategyBuilderPage={this.goToStrategyBuilderPage}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  StrategyDiscoveryTableState: state.StrategyDiscoveryTableState,
});
const mapDispatchToProps = {
  getStrategyDiscoveryTable,
};

StrategyDiscovery.propTypes = {};
export default connect(mapStateToProps, mapDispatchToProps)(StrategyDiscovery);
