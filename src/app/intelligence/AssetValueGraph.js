import React, { Component } from "react";
import { connect } from "react-redux";

import PageHeader from "../common/PageHeader";

import {
  AssetValuePage,
  AssetValueShare,
  TimeSpentAssetValue,
} from "../../utils/AnalyticsFunctions";
import {
  BASE_URL_S3,
  GROUP_BY_DATE,
  GROUP_BY_MONTH,
  GROUP_BY_YEAR,
  GroupByOptions,
} from "../../utils/Constant";
import { getCurrentUser } from "../../utils/ManageToken";
import { getAssetGraphDataApi, getExternalEventsApi } from "../Portfolio/Api";
import LineChartSlider from "../Portfolio/LineCharSlider";
import { getAllCoins } from "../onboarding/Api";
// add wallet
import AddWalletModalIcon from "../../assets/images/icons/wallet-icon.svg";
import { GetAllPlan, getUser } from "../common/Api";
import FixAddModal from "../common/FixAddModal";
import { getAllWalletListApi } from "../wallet/Api";

import { toast } from "react-toastify";
import { mobileCheck, scrollToTop } from "../../utils/ReusableFunctions";
import {
  ASSET_VALUE_GRAPH_DAY,
  ASSET_VALUE_GRAPH_MONTH,
  ASSET_VALUE_GRAPH_YEAR,
} from "../Portfolio/ActionTypes";
import WelcomeCard from "../Portfolio/WelcomeCard";
import { setPageFlagDefault, updateWalletListFlag } from "../common/Api";

class AssetValueGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graphLoading: false,
      // externalEvents: [],
      userWalletList: JSON.parse(window.localStorage.getItem("addWallet")),
      // add new wallet

      addModal: false,
      isUpdate: 0,
      apiResponse: false,

      // asset value data for all filters
      assetValueData: null,

      // asset value loader
      assetValueDataLoaded: false,
      tab: "day",

      // start time for time spent on page
      startTime: "",
    };
  }
  startPageView = () => {
    this.setState({
      startTime: new Date() * 1,
    });
    AssetValuePage({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    // Inactivity Check
    window.checkAssetValueTimer = setInterval(() => {
      this.checkForInactivity();
    }, 900000);
  };
  callDateGraph = () => {
    let addressList = [];
    this.state.userWalletList?.map((wallet) =>
      addressList.push(wallet.address)
    );
    let data = new URLSearchParams();
    data.append("wallet_addresses", JSON.stringify(addressList));
    data.append("group_criteria", GROUP_BY_DATE);
    this.props.getAssetGraphDataApi(data, this, ASSET_VALUE_GRAPH_DAY);
  };
  componentDidMount() {
    if (mobileCheck()) {
      this.props.history.push("/home");
    }
    scrollToTop();
    if (this.props.portfolioState?.assetValueDataLoaded) {
      this.setState({
        assetValueDataLoaded: this.props.portfolioState.assetValueDataLoaded,
      });
    }
    if (
      !(
        this.props.portfolioState.assetValueMonth &&
        this.props.portfolioState.assetValueMonth
      ) ||
      !this.props.commonState.asset_value
    ) {
      this.callDateGraph();
    }
    // this.setState({
    //   tab: "day",
    // });

    //    this.props.getCoinRate();
    this.props.getAllCoins();
    // this.getGraphData();
    this.setState({});
    this.props.GetAllPlan();
    this.props.getUser();

    const search = this.props.location.search;
    const params = new URLSearchParams(search);
    const addAddress = params.get("add-address");
    if (addAddress) {
      this.handleAddModal();
      this.props.history.replace("/intelligence/asset-value");
    }
    this.startPageView();
    this.updateTimer(true);

    return () => {
      clearInterval(window.checkAssetValueTimer);
    };
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.portfolioState?.assetValueDataLoaded !==
      this.props.portfolioState?.assetValueDataLoaded
    ) {
      this.setState({
        dataLoaded: this.props.portfolioState.assetValueDataLoaded,
      });
    }
    // add wallet

    if (prevState.apiResponse !== this.state.apiResponse) {
      this.setState({
        apiResponse: false,
      });
    }

    if (!this.props.commonState.asset_value) {
      this.props.updateWalletListFlag("asset_value", true);

      this.props.getAllCoins();
      if (!this.props.portfolioState.assetValueDay) {
        this.getGraphData();
      }
      let tempData = new URLSearchParams();
      tempData.append("start", 0);
      tempData.append("conditions", JSON.stringify([]));
      tempData.append("limit", 50);
      tempData.append("sorts", JSON.stringify([]));
      this.props.getAllWalletListApi(tempData, this);
    }
  }

  updateTimer = (first) => {
    const tempExistingExpiryTime = window.localStorage.getItem(
      "assetValuePageExpiryTime"
    );
    if (!tempExistingExpiryTime && !first) {
      this.startPageView();
    }
    const tempExpiryTime = Date.now() + 1800000;
    window.localStorage.setItem("assetValuePageExpiryTime", tempExpiryTime);
  };
  endPageView = () => {
    clearInterval(window.checkAssetValueTimer);
    window.localStorage.removeItem("assetValuePageExpiryTime");
    if (this.state.startTime) {
      let endTime = new Date() * 1;
      let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
      TimeSpentAssetValue({
        time_spent: TimeSpent,
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
    }
  };
  checkForInactivity = () => {
    const tempExpiryTime = window.localStorage.getItem(
      "assetValuePageExpiryTime"
    );
    if (tempExpiryTime && tempExpiryTime < Date.now()) {
      this.endPageView();
    }
  };
  componentWillUnmount() {
    const tempExpiryTime = window.localStorage.getItem(
      "assetValuePageExpiryTime"
    );
    if (tempExpiryTime) {
      this.endPageView();
    }
  }

  // For add new address
  handleAddModal = () => {
    this.setState({
      addModal: !this.state.addModal,
    });
  };

  handleChangeList = (value) => {
    this.setState({
      // for add wallet
      userWalletList: value,
      isUpdate: this.state.isUpdate === 0 ? 1 : 0,
      // for page
      // graphLoading: true,
    });
  };

  CheckApiResponse = (value) => {
    this.setState({
      apiResponse: value,
    });

    this.props.setPageFlagDefault();
  };

  getGraphData = (groupByValue = GROUP_BY_DATE) => {
    let ActionType = ASSET_VALUE_GRAPH_DAY;

    if (groupByValue === GROUP_BY_MONTH) {
      ActionType = ASSET_VALUE_GRAPH_MONTH;
      this.setState({
        tab: "month",
      });
    } else if (groupByValue === GROUP_BY_YEAR) {
      ActionType = ASSET_VALUE_GRAPH_YEAR;
      this.setState({
        tab: "year",
      });
    } else if (groupByValue === GROUP_BY_DATE) {
      ActionType = ASSET_VALUE_GRAPH_DAY;
      this.setState({
        tab: "day",
      });
    }

    this.setState({ graphLoading: true });
    let addressList = [];

    this.state.userWalletList?.map((wallet) =>
      addressList.push(wallet.address)
    );

    let data = new URLSearchParams();
    data.append("wallet_addresses", JSON.stringify(addressList));
    data.append("group_criteria", groupByValue);
    this.props.getAssetGraphDataApi(data, this, ActionType);
  };

  handleGroupBy = (value) => {
    let groupByValue = GroupByOptions.getGroupBy(value);
    this.getGraphData(groupByValue);
  };

  handleShare = () => {
    let lochUser = getCurrentUser().id;
    // let shareLink = BASE_URL_S3 + "home/" + lochUser.link;
    let userWallet = JSON.parse(window.localStorage.getItem("addWallet"));
    let slink =
      userWallet?.length === 1
        ? userWallet[0].displayAddress || userWallet[0].address
        : lochUser;
    let shareLink =
      BASE_URL_S3 + "home/" + slink + "?redirect=intelligence/asset-value";
    navigator.clipboard.writeText(shareLink);
    toast.success("Link copied");

    AssetValueShare({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    this.updateTimer();
  };

  render() {
    return (
      <>
        {/* topbar */}
        <div className="portfolio-page-section">
          <div
            className="portfolio-container page"
            style={{ overflow: "visible" }}
          >
            <div className="portfolio-section">
              {/* welcome card */}
              <WelcomeCard
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
                updateTimer={this.updateTimer}
              />
            </div>
          </div>
        </div>
        <div
          style={{ paddingBottom: "4rem" }}
          className="volume-traded-section m-t-80"
        >
          <div className="page volume-traded-page">
            {this.state.addModal && (
              <FixAddModal
                show={this.state.addModal}
                onHide={this.handleAddModal}
                modalIcon={AddWalletModalIcon}
                title="Add wallet address"
                subtitle="Add more wallet address here"
                modalType="addwallet"
                btnStatus={false}
                btnText="Go"
                history={this.props.history}
                changeWalletList={this.handleChangeList}
                apiResponse={(e) => this.CheckApiResponse(e)}
                from="asset value"
                updateTimer={this.updateTimer}
              />
            )}
            <PageHeader
              title={"Historic performance"}
              subTitle={"Analyze your portfolio value over time"}
              currentPage={"asset-value"}
              history={this.props.history}
              // btnText={"Add wallet"}
              // handleBtn={this.handleAddModal}
              hoverText={`This chart reflects the final balance on last day, month, or year. It includes spot positions only, not DeFi positions.`}
              ShareBtn={true}
              handleShare={this.handleShare}
              updateTimer={this.updateTimer}
            />
            <div className="graph-container" style={{ marginBottom: "5rem" }}>
              <LineChartSlider
                assetValueData={
                  this.props.portfolioState?.assetValueDay
                    ? this.props.portfolioState.assetValueDay
                    : []
                }
                externalEvents={
                  this.props.portfolioState.externalEvents &&
                  this.props.portfolioState.externalEvents
                }
                coinLists={this.props.OnboardingState.coinsLists}
                isScrollVisible={false}
                handleGroupBy={(value) => this.handleGroupBy(value)}
                graphLoading={this.state.graphLoading}
                isUpdate={this.state.isUpdate}
                isPage={true}
                dataLoaded={this.state.assetValueDataLoaded}
                updateTimer={this.updateTimer}
                activeTab={this.state.tab}
              />
            </div>
            {/* <FeedbackForm page={"Asset Value Graph Page"} /> */}
          </div>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  OnboardingState: state.OnboardingState,
  portfolioState: state.PortfolioState,
  commonState: state.CommonState,
});

const mapDispatchToProps = {
  getAllCoins,
  getAssetGraphDataApi,
  getExternalEventsApi,
  updateWalletListFlag,
  setPageFlagDefault,
  getAllWalletListApi,
  getUser,
  GetAllPlan,
};

export default connect(mapStateToProps, mapDispatchToProps)(AssetValueGraph);
