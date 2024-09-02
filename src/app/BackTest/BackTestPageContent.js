// Performance Visualization -> Backtest Performance
// Strategy Performance -> Performance Visualization
// Performance Preview -> Performance Metrics

import React from "react";

import { connect } from "react-redux";
import { BaseReactComponent } from "../../utils/form";
import { mobileCheck } from "../../utils/ReusableFunctions";
import TransactionTable from "../intelligence/TransactionTable";
import BackTestChart from "./BackTestComponents/BackTestChart/BackTestChart";
import BackTestBuilder from "./BackTestComponents/BackTestBuilder/BackTestBuilder";
import { Button } from "react-bootstrap";
import OutsideClickHandler from "react-outside-click-handler";
import moment from "moment";
import Calendar from "react-calendar";
import CustomDropdown from "../../utils/form/CustomDropdownPrice";
import { StrategyBuilderBackgroundDotIcon } from "../../assets/images/icons";

class BackTestPageContent extends BaseReactComponent {
  constructor(props) {
    super(props);

    this.state = {
      isMobile: mobileCheck(),
    };
  }

  render() {
    return (
      <div className="back-test-page-content">
        <div className="back-test-page-content-block back-test-page-content-block-left">
          <div className="btpcb-title btpcb-chart-header">
            <div>Strategy Builder</div>
          </div>
          <div
            style={{
              backgroundImage: `url(${StrategyBuilderBackgroundDotIcon})`,
            }}
            className="btpcb-left-block"
          >
            <BackTestBuilder
              saveStrategyCheck={this.props.saveStrategyCheck}
              showSaveStrategy={this.props.showSaveStrategy}
              hideSaveStrategy={this.props.hideSaveStrategy}
            />
            {/* <Image
              className="btpcb-left-block-items"
              src={FakeStrategy6Image}
            />
            <Image
              className="btpcb-left-block-background"
              src={FakeStrategyBackground2Image}
            /> */}
          </div>
        </div>
        <div className="back-test-page-content-block">
          <BackTestChart
            performanceVisualizationGraphLoading={
              this.props.performanceVisualizationGraphLoading
            }
            strategiesOptions={this.props.strategiesOptions}
            selectedStrategiesOptions={this.props.selectedStrategiesOptions}
            selectStrategies={this.props.selectStrategies}
            performanceVisualizationGraphData={
              this.props.performanceVisualizationGraphData
            }
            hideToCalendar={this.props.hideToCalendar}
            hideFromCalendar={this.props.hideFromCalendar}
            showFromCalendar={this.props.showFromCalendar}
            showToCalendar={this.props.showToCalendar}
            isFromCalendar={this.props.isFromCalendar}
            isToCalendar={this.props.isToCalendar}
            changeFromDate={this.props.changeFromDate}
            changeToDate={this.props.changeToDate}
            fromDate={this.props.fromDate}
            toDate={this.props.toDate}
          />
          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: "10px",
            }}
            className="btpcb-title"
          >
            <div>Performance Metrics</div>

            <div
              class={`btpcb-chart-time-range-table ${
                this.props.performanceMetricTableLoading
                  ? "btpcb-chart-time-range-table-hidden"
                  : ""
              }`}
            >
              <div>(</div>
              <div
                id="1"
                class="inter-display-medium f-s-13 lh-16 time-cal-badge"
              >
                <OutsideClickHandler
                  onOutsideClick={this.props.hideFromCalendar}
                >
                  <div className="btpcb-chart-calendar-Container">
                    <div
                      className="btpcb-chart-calendar-Text"
                      onClick={this.props.showFromCalendar}
                    >
                      {this.props.fromDate
                        ? moment(this.props.fromDate).format("D MMM YYYY")
                        : ""}
                    </div>
                    {this.props.isFromCalendar ? (
                      <div className="intelligenceCalendar">
                        <Calendar
                          date={this.props.fromDate}
                          className={
                            "calendar-select inter-display-medium f-s-13 lh-16"
                          }
                          onChange={this.props.changeFromDate}
                          maxDate={this.props.toDate}
                          defaultValue={this.props.fromDate}
                        />
                      </div>
                    ) : null}
                  </div>
                </OutsideClickHandler>
              </div>
              <div
                id="2"
                class="inter-display-medium f-s-13 lh-16 time-no-cal-badge"
              >
                To
              </div>
              <div
                id="3"
                class="inter-display-medium f-s-13 lh-16 time-cal-badge"
              >
                <OutsideClickHandler onOutsideClick={this.props.hideToCalendar}>
                  <div className="btpcb-chart-calendar-Container">
                    <div
                      className="btpcb-chart-calendar-Text"
                      onClick={this.props.showToCalendar}
                    >
                      {this.props.toDate
                        ? moment(this.props.toDate).format("D MMM YYYY")
                        : ""}
                    </div>
                    {this.props.isToCalendar ? (
                      <div className="intelligenceCalendar">
                        <Calendar
                          date={this.props.toDate}
                          className={
                            "calendar-select inter-display-medium f-s-13 lh-16"
                          }
                          onChange={this.props.changeToDate}
                          minDate={this.props.fromDate}
                          maxDate={this.state.todayDate}
                          defaultValue={this.props.toDate}
                        />
                      </div>
                    ) : null}
                  </div>
                </OutsideClickHandler>
              </div>
              <div>)</div>
            </div>
          </div>

          <div className="btpcb-right-table-container">
            <div
              style={{
                overflowX: this.state.isMobile ? "scroll" : "",
              }}
              className={`${
                this.state.isMobile
                  ? "freezeTheFirstColumn newHomeTableContainer hide-scrollbar"
                  : "cost-table-section"
              }`}
            >
              <TransactionTable
                message="No performance metric found"
                tableData={this.props.performanceMetricTableData}
                columnList={this.props.performanceMetricColumnList}
                isLoading={this.props.performanceMetricTableLoading}
                yAxisScrollable
                addWatermark={!this.state.isMobile}
                fakeWatermark={this.state.isMobile}
                xAxisScrollable={this.state.isMobile}
                xAxisScrollableColumnWidth={4.5}
                isMiniversion={this.state.isMobile}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {};

BackTestPageContent.propTypes = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BackTestPageContent);
