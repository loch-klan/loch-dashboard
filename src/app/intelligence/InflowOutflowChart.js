import { connect } from "react-redux";
import BaseReactComponent from "../../utils/form/BaseReactComponent";

import { TimeFilterInflowOutflowType } from "../../utils/Constant";
import {
  getInflowsAndOutflowsAssetsApi,
  getInflowsAndOutflowsGraphDataApi,
  setInflowsAndOutflowsTimeTab,
  setInflowsAndOutflowsWalletList,
  setSelectedInflowOutflowsAssetBlank,
} from "./Api";
import InflowOutflowChartSliderContainer from "./InflowOutflowChartSliderContainer";
import "./intelligenceScss/_inflowOutflowChart.scss";
class InflowOutflowChart extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      graphLoading: false,
      timeTab: "Max",
      selectedAsset: "",
      inflowsOutflowsList: [],
      assetList: [],
      isDust: 1,
      callApi: false,
    };
  }
  componentDidMount() {
    let addressList = [];
    const userWalletList = JSON.parse(window.localStorage.getItem("addWallet"));
    setTimeout(() => {
      this.makeApiCall();
    }, 200);
    userWalletList?.map((wallet) => addressList.push(wallet.address));
    const tempAdd = JSON.stringify(addressList);
    let data = new URLSearchParams();
    data.append("wallet_addresses", tempAdd);

    if (
      this.props.InflowOutflowSelectedAssetState === null ||
      this.props.InflowOutflowChartState.length === 0 ||
      this.props.InflowOutflowAssetListState.length === 0 ||
      this.props.InflowOutflowWalletState !== tempAdd
    ) {
      this.setState({ graphLoading: true, selectedAsset: "" }, () => {
        this.props.setSelectedInflowOutflowsAssetBlank();
        this.props.getInflowsAndOutflowsAssetsApi(data, this);
        this.setState({
          callApi: true,
        });
      });
    } else {
      this.setState({
        selectedAsset: this.props.InflowOutflowSelectedAssetState,
        inflowsOutflowsList: this.props.InflowOutflowChartState,
        assetList: this.props.InflowOutflowAssetListState,
        timeTab: this.props.InflowOutflowTimeTabState,
        graphLoading: false,
      });
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.InflowOutflowSelectedAssetState !==
      this.props.InflowOutflowSelectedAssetState
    ) {
      this.setState({
        selectedAsset: this.props.InflowOutflowSelectedAssetState,
      });
    }
    if (
      prevProps.InflowOutflowChartState !== this.props.InflowOutflowChartState
    ) {
      this.setState({
        inflowsOutflowsList: this.props.InflowOutflowChartState,
        graphLoading: false,
      });
    }
    if (
      prevProps.InflowOutflowAssetListState !==
      this.props.InflowOutflowAssetListState
    ) {
      let addressList = [];
      const userWalletList = JSON.parse(
        window.localStorage.getItem("addWallet")
      );
      userWalletList?.map((wallet) => addressList.push(wallet.address));
      const tempAdd = JSON.stringify(addressList);
      this.props.setInflowsAndOutflowsWalletList(tempAdd);
      this.setState({
        assetList: this.props.InflowOutflowAssetListState,
      });
    }
    if (
      prevProps.InflowOutflowTimeTabState !==
      this.props.InflowOutflowTimeTabState
    ) {
      this.setState({
        timeTab: this.props.InflowOutflowTimeTabState,
      });
    }
    if (
      prevProps.userWalletList !== this.props.userWalletList ||
      prevProps.AddLocalAddWalletState !== this.props.AddLocalAddWalletState
    ) {
      let addressList = [];
      const userWalletList = JSON.parse(
        window.localStorage.getItem("addWallet")
      );
      userWalletList?.map((wallet) => addressList.push(wallet.address));
      const tempAdd = JSON.stringify(addressList);
      let data = new URLSearchParams();
      data.append("wallet_addresses", tempAdd);
      this.setState({ graphLoading: true, selectedAsset: "" }, () => {
        this.props.setSelectedInflowOutflowsAssetBlank();
        this.props.getInflowsAndOutflowsAssetsApi(data, this);
      });
    }
    if (
      prevState.timeTab !== this.state.timeTab ||
      prevState.selectedAsset !== this.state.selectedAsset ||
      prevState.isDust !== this.state.isDust
    ) {
      if (this.state.callApi) {
        let groupByValue = TimeFilterInflowOutflowType.getText(
          this.state.timeTab
        );
        if (groupByValue) {
          this.makeApiCall();
        } else {
          this.setState({
            graphLoading: false,
          });
        }
      } else {
        this.setState({
          callApi: true,
        });
      }
    }

    if (prevProps.apiResponse !== this.props.apiResponse) {
      this.makeApiCall();
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
    const userWalletList = JSON.parse(window.localStorage.getItem("addWallet"));
    userWalletList?.map((wallet) => addressList.push(wallet.address));
    data.append("wallet_addresses", JSON.stringify(addressList));
    this.props.getInflowsAndOutflowsGraphDataApi(data, this);
  };
  handleGroupBy = (value) => {
    this.props.setInflowsAndOutflowsTimeTab(value);
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
        {/* <PageHeader
          showExplainers
          explainerText="This chart reflects the price for any token held by this wallet ever. Understand if this trader can buy low and sell high."
          title="Price gauge"
          showImg={InflowOutflowIcon}
        /> */}
        <div className="graph-container">
          <InflowOutflowChartSliderContainer
            inflowOutflowData={
              this.state.inflowsOutflowsList
                ? this.state.inflowsOutflowsList
                : []
            }
            isScrollVisible={false}
            isHomepage={this.props.isHomepage}
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
            className="inter-display-medium f-s-15 lh-15 grey-ADA revealDustInflow"
            onClick={this.toggleDust}
            style={{ marginTop: "2.8rem" }}
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
  InflowOutflowSelectedAssetState: state.InflowOutflowSelectedAssetState,
  InflowOutflowAssetListState: state.InflowOutflowAssetListState,
  InflowOutflowChartState: state.InflowOutflowChartState,
  InflowOutflowTimeTabState: state.InflowOutflowTimeTabState,
  AddLocalAddWalletState: state.AddLocalAddWalletState,
  InflowOutflowWalletState: state.InflowOutflowWalletState,
});
const mapDispatchToProps = {
  getInflowsAndOutflowsGraphDataApi,
  getInflowsAndOutflowsAssetsApi,
  setInflowsAndOutflowsTimeTab,
  setInflowsAndOutflowsWalletList,
  setSelectedInflowOutflowsAssetBlank,
};
export default connect(mapStateToProps, mapDispatchToProps)(InflowOutflowChart);
