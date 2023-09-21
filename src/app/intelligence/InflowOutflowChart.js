import BaseReactComponent from "../../utils/form/BaseReactComponent";
import { connect } from "react-redux";

import { InflowOutflowIcon } from "../../assets/images/icons";

import PageHeader from "../common/PageHeader";
import { TimeFilterInflowOutflowType } from "../../utils/Constant";
import {
  getInflowsAndOutflowsGraphDataApi,
  getInflowsAndOutflowsAssetsApi,
} from "./Api";
import "./intelligenceScss/_inflowOutflowChart.scss";
import InflowOutflowChartSliderContainer from "./InflowOutflowChartSliderContainer";
class InflowOutflowChart extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      graphLoading: false,
      timeTab: "1 Week",
      selectedAsset: "",
      inflowsOutflowsList: [],
      assetList: [],
      isDust: 1,
    };
  }
  componentDidMount() {
    let addressList = [];
    const userWalletList = JSON.parse(localStorage.getItem("addWallet"));
    userWalletList?.map((wallet) => addressList.push(wallet.address));
    let data = new URLSearchParams();
    data.append("wallet_addresses", JSON.stringify(addressList));
    this.setState({ graphLoading: true });
    this.props.getInflowsAndOutflowsAssetsApi(data, this);
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.userWalletList !== this.props.userWalletList) {
      let addressList = [];
      const userWalletList = JSON.parse(localStorage.getItem("addWallet"));
      userWalletList?.map((wallet) => addressList.push(wallet.address));
      let data = new URLSearchParams();
      data.append("wallet_addresses", JSON.stringify(addressList));
      this.setState({ graphLoading: true });
      this.props.getInflowsAndOutflowsAssetsApi(data, this);
    }
    if (
      prevState.timeTab !== this.state.timeTab ||
      prevState.selectedAsset !== this.state.selectedAsset ||
      prevState.isDust !== this.state.isDust
    ) {
      let groupByValue = TimeFilterInflowOutflowType.getText(
        this.state.timeTab
      );
      if (groupByValue) {
        this.makeApiCall();
      }
    }
  }

  makeApiCall = () => {
    this.setState({ graphLoading: true });

    const timeFilter = TimeFilterInflowOutflowType.getText(this.state.timeTab);
    const assetFilter = this.state.selectedAsset;

    let data = new URLSearchParams();
    if (timeFilter) {
      data.append("days", timeFilter);
    }
    if (assetFilter) {
      data.append("asset", assetFilter);
    }
    data.append("dust_value", this.state.isDust);

    let addressList = [];
    const userWalletList = JSON.parse(localStorage.getItem("addWallet"));
    userWalletList?.map((wallet) => addressList.push(wallet.address));
    data.append("wallet_addresses", JSON.stringify(addressList));
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
  toggleDust = () => {
    if (this.state.isDust === 0) {
      this.setState({
        isDust: 1,
      });
    }
    if (this.state.isDust === 1) {
      this.setState({
        isDust: 0,
      });
    }
  };
  render() {
    return (
      <div className="inflowOutflowBlock">
        <PageHeader
          showExplainers
          explainerText="This chart reflects prices at the end of the day, month, or year."
          title="Price"
          showImg={InflowOutflowIcon}
        />
        <div className="graph-container" style={{ marginBottom: "5rem" }}>
          <InflowOutflowChartSliderContainer
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
          <div
            className="inter-display-medium f-s-15 lh-15 grey-ADA revealDustInflow mt-5"
            onClick={this.toggleDust}
          >
            {this.state.isDust === 0
              ? "Hide dust (less than $1)"
              : "Reveal dust (less than $1)"}
          </div>
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
