import { Component } from "react";
import { connect } from "react-redux";
import BackTestPageContent from "./BackTestPageContent";

class AssetUnrealizedProfitAndLossMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div
        style={{
          paddingBottom: "2rem",
        }}
        className="back-test-page back-test-page-mobile"
      >
        <BackTestPageContent
          saveStrategyName={this.props.saveStrategyName}
          calcChartData={this.props.calcChartData}
          saveStrategyCheck={this.props.saveStrategyCheck}
          showSaveStrategy={this.props.showSaveStrategy}
          hideSaveStrategy={this.props.hideSaveStrategy}
          fromAndToDate={this.props.fromAndToDate}
          performanceVisualizationGraphLoading={
            this.props.performanceVisualizationGraphLoading
          }
          performanceMetricTableLoading={
            this.props.performanceMetricTableLoading
          }
          selectStrategies={this.props.selectStrategies}
          strategiesOptions={this.props.strategiesOptions}
          selectedStrategiesOptions={this.props.selectedStrategiesOptions}
          performanceMetricColumnList={this.props.performanceMetricColumnList}
          performanceMetricTableData={this.props.performanceMetricTableData}
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
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AssetUnrealizedProfitAndLossMobile);
