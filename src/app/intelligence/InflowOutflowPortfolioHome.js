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
import Loading from "../common/Loading";
class InflowOutflowPortfolioHome extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      shouldGraphLoading: true,
      graphLoading: true,
      timeTab: props.priceGuageExpandedMobile ? "1 Month" : "Max",
      selectedAsset: "",
      selectedAssetName: "",
      inflowsOutflowsList: [],
      assetList: [],
      isDust: 1,
      callApi: false,
    };
  }
  componentDidMount() {
    let addressList = [];
    const userWalletList = JSON.parse(window.localStorage.getItem("addWallet"));
    userWalletList?.map((wallet) => addressList.push(wallet.address));
    const tempAdd = JSON.stringify(addressList);
    let data = new URLSearchParams();
    data.append("wallet_addresses", tempAdd);
    if (this.props.lochToken) {
      this.setState({ graphLoading: true, selectedAsset: "" }, () => {
        this.props.setSelectedInflowOutflowsAssetBlank();
        this.props.getInflowsAndOutflowsAssetsApi(data, this);
        this.setState({
          callApi: true,
        });
      });
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedAsset !== this.state.selectedAsset) {
      let tempAssetName = this.state.selectedAssetName;
      this.state.assetList.forEach((asset) => {
        if (asset._id && asset._id === this.state.selectedAsset) {
          if (asset?.asset?.name) {
            tempAssetName = asset.asset.name;
          }
        }
      });
      this.setState({
        selectedAssetName: tempAssetName,
      });
    }
    if (
      prevProps.callChildPriceGaugeApi !== this.props.callChildPriceGaugeApi &&
      this.props.lochToken
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
      prevProps.switchPriceGaugeLoader !== this.props.switchPriceGaugeLoader
    ) {
      this.setState({
        graphLoading: this.state.shouldGraphLoading
          ? false
          : this.state.graphLoading,
      });
    }
    if (
      prevProps.InflowOutflowChartState !== this.props.InflowOutflowChartState
    ) {
      const shouldRecallApis = window.localStorage.getItem("shouldRecallApis");
      if (!shouldRecallApis || shouldRecallApis === "false") {
        this.setState({
          graphLoading: false,
        });
      } else {
        this.setState({
          shouldGraphLoading: true,
        });
      }
      this.setState({
        inflowsOutflowsList: this.props.InflowOutflowChartState,
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
      (prevProps.userWalletList !== this.props.userWalletList ||
        prevProps.AddLocalAddWalletState !==
          this.props.AddLocalAddWalletState) &&
      this.props.lochToken
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
    if (prevProps.apiResponse !== this.props.apiResponse) {
      this.makeApiCall();
    }
  }

  makeApiCall = () => {
    this.setState({ graphLoading: true });

    const timeFilter = TimeFilterInflowOutflowType.getText(this.state.timeTab);
    const assetFilter = this.state.selectedAsset;

    let data = new URLSearchParams();

    if (timeFilter && this.props.priceGuageExpandedMobile) {
      data.append("days", timeFilter);
    } else {
      data.append("days", 30);
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
    // this.props.setInflowsAndOutflowsTimeTab(value);
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
    if (this.state.graphLoading && this.props.priceGuageExpandedMobile) {
      return (
        <div
          style={{
            height: "70vh",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "10px",
            backgroundColor: "var(--cardBackgroud)",
          }}
        >
          <Loading />
        </div>
      );
    }
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
            showSelectedItem={this.state.selectedAssetName}
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
            showDropdown={this.props.showDropdown}
            isMobileGraph={this.props.isMobileGraph}
            priceGuageExpandedMobile={this.props.priceGuageExpandedMobile}
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
