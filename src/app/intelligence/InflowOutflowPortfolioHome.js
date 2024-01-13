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
class InflowOutflowPortfolioHome extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      graphLoading: true,
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
    const userWalletList = JSON.parse(
      window.sessionStorage.getItem("addWallet")
    );
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
      if (this.props.lochToken) {
        this.setState({ graphLoading: true, selectedAsset: "" }, () => {
          this.props.setSelectedInflowOutflowsAssetBlank();
          this.props.getInflowsAndOutflowsAssetsApi(data, this);
          this.setState({
            callApi: true,
          });
        });
      }
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
      prevProps.callChildPriceGaugeApi !== this.props.callChildPriceGaugeApi &&
      this.props.lochToken
    ) {
      let addressList = [];
      const userWalletList = JSON.parse(
        window.sessionStorage.getItem("addWallet")
      );
      userWalletList?.map((wallet) => addressList.push(wallet.address));
      const tempAdd = JSON.stringify(addressList);
      let data = new URLSearchParams();
      data.append("wallet_addresses", tempAdd);
      this.setState({ graphLoading: true, selectedAsset: "" }, () => {
        this.props.setSelectedInflowOutflowsAssetBlank();
        this.props.getInflowsAndOutflowsAssetsApi(data, this);
        this.setState({
          callApi: true,
        });
      });
    }
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
        window.sessionStorage.getItem("addWallet")
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
      (prevProps.userWalletList !== this.props.userWalletList ||
        prevProps.AddLocalAddWalletState !==
          this.props.AddLocalAddWalletState) &&
      this.props.lochToken
    ) {
      let addressList = [];
      const userWalletList = JSON.parse(
        window.sessionStorage.getItem("addWallet")
      );
      userWalletList?.map((wallet) => addressList.push(wallet.address));
      const tempAdd = JSON.stringify(addressList);
      let data = new URLSearchParams();
      data.append("wallet_addresses", tempAdd);
      this.setState({ graphLoading: true, selectedAsset: "" }, () => {
        this.props.setSelectedInflowOutflowsAssetBlank();
        this.props.getInflowsAndOutflowsAssetsApi(data, this);
        this.setState({
          callApi: true,
        });
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
  }
  




  makeApiCall = () => {
    this.setState({ graphLoading: true });

    // const timeFilter = TimeFilterInflowOutflowType.getText(this.state.timeTab);
    const assetFilter = this.state.selectedAsset;

    let data = new URLSearchParams();

    data.append("days", 30);

    if (assetFilter) {
      data.append("asset", assetFilter);
    }
    data.append("dust_value", this.state.isDust);

    let addressList = [];
    const userWalletList = JSON.parse(
      window.sessionStorage.getItem("addWallet")
    );
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
      <div
        style={{
          width: "100%",
        }}
        className="inflowOutflowBlock"
      >
        <div className="graph-container">
          <InflowOutflowChartSliderContainer
          isHomepage={this.props.isHomepage}
          hideExplainer={this.props.hideExplainer}
          showEth={this.props.showEth}
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
            hideTimeFilter
            openChartPage={this.props.openChartPage}
            // showDropdown
          />
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
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InflowOutflowPortfolioHome);
