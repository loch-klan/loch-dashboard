import BaseReactComponent from "../../utils/form/BaseReactComponent";
import { connect } from "react-redux";

import { InflowOutflowIcon } from "../../assets/images/icons";

import PageHeader from "../common/PageHeader";
import InflowOutflowChartSlider from "./InflowOutflowChartSlider";
import { GROUP_BY_YEAR, GroupByOptions } from "../../utils/Constant";
import { ASSET_VALUE_GRAPH_YEAR } from "../Portfolio/ActionTypes";
import { getAssetGraphDataApi } from "../Portfolio/Api";

class InflowOutflowChart extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      graphLoading: false,
      userWalletList: JSON.parse(localStorage.getItem("addWallet")),
      tab: "day",
    };
  }
  getGraphData = () => {
    // console.log("data a", this.props);

    let ActionType = ASSET_VALUE_GRAPH_YEAR;
    this.setState({
      tab: "year",
    });
    this.setState({ graphLoading: true });
    let addressList = [];
    this.state.userWalletList?.map((wallet) =>
      addressList.push(wallet.address)
    );
    // console.log("addressList", this.state.userWalletList);
    let data = new URLSearchParams();
    data.append("wallet_addresses", JSON.stringify(addressList));
    data.append("group_criteria", GROUP_BY_YEAR);
    this.props.getAssetGraphDataApi(data, this, ActionType);
  };
  handleGroupBy = (value) => {
    let groupByValue = GroupByOptions.getGroupBy(value);
    this.getGraphData(groupByValue);
  };
  render() {
    return (
      <>
        <PageHeader title="Inflows and Outflows" showImg={InflowOutflowIcon} />
        <div className="graph-container" style={{ marginBottom: "5rem" }}>
          <InflowOutflowChartSlider
            assetValueData={
              this.state.tab === "day"
                ? this.props.portfolioState.assetValueDay &&
                  this.props.portfolioState.assetValueDay
                : this.state.tab === "month"
                ? this.props.portfolioState.assetValueMonth &&
                  this.props.portfolioState.assetValueMonth
                : this.state.tab === "year"
                ? this.props.portfolioState.assetValueYear &&
                  this.props.portfolioState.assetValueYear
                : []
            }
            externalEvents={
              this.props.portfolioState.externalEvents &&
              this.props.portfolioState.externalEvents
            }
            coinLists={this.props.OnboardingState.coinsLists}
            isScrollVisible={false}
            handleGroupBy={this.handleGroupBy}
            graphLoading={this.state.graphLoading}
            isUpdate={this.state.isUpdate}
            isPage={true}
            dataLoaded={this.state.assetValueDataLoaded}
            updateTimer={this.updateTimer}
            activeTab={this.state.tab}
          />
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  OnboardingState: state.OnboardingState,
  portfolioState: state.PortfolioState,
});
const mapDispatchToProps = {
  getAssetGraphDataApi,
};
export default connect(mapStateToProps, mapDispatchToProps)(InflowOutflowChart);
