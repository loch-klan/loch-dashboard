import BaseReactComponent from "../../utils/form/BaseReactComponent";
import { connect } from "react-redux";

import { InflowOutflowIcon } from "../../assets/images/icons";

import PageHeader from "../common/PageHeader";
import InflowOutflowChartSlider from "./InflowOutflowChartSlider";
import { TimeFilterInflowOutflowType } from "../../utils/Constant";
import {
  getInflowsAndOutflowsGraphDataApi,
  getInflowsAndOutflowsAssetsApi,
} from "./Api";
import "./intelligenceScss/_inflowOutflowChart.scss";
class InflowOutflowChart extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      graphLoading: false,
      userWalletList: JSON.parse(localStorage.getItem("addWallet")),
      timeTab: "1 Week",
      selectedAsset: "",
      inflowsOutflowsList: [],
      assetList: [],
    };
  }
  componentDidMount() {
    let groupByValue = TimeFilterInflowOutflowType.getText(this.state.timeTab);
    this.getGraphData(groupByValue, this.state.selectedAsset);
    this.props.getInflowsAndOutflowsAssetsApi(this);
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.timeTab !== this.state.timeTab ||
      prevState.selectedAsset !== this.state.selectedAsset
    ) {
      let groupByValue = TimeFilterInflowOutflowType.getText(
        this.state.timeTab
      );
      if (groupByValue) {
        this.getGraphData(groupByValue, this.state.selectedAsset);
      }
    }
  }
  getGraphData = (timeFilter, assetFilter) => {
    this.setState({ graphLoading: true });
    let data = new URLSearchParams();
    if (timeFilter) {
      data.append("days", timeFilter);
    }
    if (assetFilter) {
      data.append("asset", assetFilter);
    }
    this.props.getInflowsAndOutflowsGraphDataApi(data, this);
  };
  handleGroupBy = (value) => {
    this.setState({
      timeTab: value,
    });
  };
  onAssetSelect = (selectedItem) => {
    this.setState({
      selectedAsset: selectedItem,
    });
  };
  render() {
    return (
      <div className="inflowOutflowBlock">
        <PageHeader title="Inflows and Outflows" showImg={InflowOutflowIcon} />
        <div className="graph-container" style={{ marginBottom: "5rem" }}>
          <InflowOutflowChartSlider
            inflowOutflowData={
              this.state.inflowsOutflowsList
                ? this.state.inflowsOutflowsList
                : []
            }
            isScrollVisible={false}
            handleGroupBy={this.handleGroupBy}
            graphLoading={this.state.graphLoading}
            isPage={true}
            dataLoaded={this.state.assetValueDataLoaded}
            updateTimer={this.updateTimer}
            activeTimeTab={this.state.timeTab}
            activeAssetTab={this.state.selectedAsset}
            assetList={this.state.assetList}
            onAssetSelect={this.onAssetSelect}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  OnboardingState: state.OnboardingState,
  portfolioState: state.PortfolioState,
});
const mapDispatchToProps = {
  getInflowsAndOutflowsGraphDataApi,
  getInflowsAndOutflowsAssetsApi,
};
export default connect(mapStateToProps, mapDispatchToProps)(InflowOutflowChart);
