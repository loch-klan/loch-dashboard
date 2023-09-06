import React, { Component } from "react";
import { connect } from "react-redux";
import PageHeader from "../common/PageHeader";
import LineChartSlider from "../Portfolio/LineCharSlider";
import {
  GroupByOptions,
  GROUP_BY_DATE,
  GROUP_BY_MONTH,
  GROUP_BY_YEAR,
  BASE_URL_S3,
} from "../../utils/Constant";
import { getAssetGraphDataApi, getExternalEventsApi } from "../Portfolio/Api";
import { getAllCoins } from "../onboarding/Api";
import {
  PageviewTopAssetValue,
  TimeSpentTopAssetValue,
  TopAssetValueShare,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import AddWalletModalIcon from "../../assets/images/icons/wallet-icon.svg";
import FixAddModal from "../common/FixAddModal";
import { GetAllPlan, getUser } from "../common/Api";
import { setPageFlagDefault, updateWalletListFlag } from "../common/Api";
import { toast } from "react-toastify";
import WelcomeCard from "../Portfolio/WelcomeCard";
import {
  TOP_ASSET_VALUE_GRAPH_DAY,
  TOP_ASSET_VALUE_GRAPH_MONTH,
  TOP_ASSET_VALUE_GRAPH_YEAR,
} from "./ActionTypes";
import { Buffer } from "buffer";

class TopAssetValueGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graphLoading: false,
      // externalEvents: [],
      userWalletList: localStorage.getItem("previewAddress")
        ? [JSON.parse(localStorage.getItem("previewAddress"))]
        : [],
      // add new wallet

      addModal: false,
      isUpdate: 0,
      apiResponse: false,

      // asset value data for all filters
      assetValueData: null,

      // asset value loader
      assetValueDataLoaded: false,
      tab: "day",

      // this is used in api to check api call fromt op acount page or not
      isTopAccountPage: true,
      // time spent
      startTime: "",
    };
  }
  startPageView = () => {
    this.setState({ startTime: new Date() * 1 });
    PageviewTopAssetValue({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    // Inactivity Check
    window.checkTopAssetValueTimer = setInterval(() => {
      this.checkForInactivity();
    }, 900000);
  };
  componentDidMount() {
    this.props.getAllCoins();
    this.props.GetAllPlan();
    this.props.getUser();
    this.startPageView();
    this.updateTimer(true);
    this.setState({
      tab: "day",
    });
  }
  updateTimer = (first) => {
    const tempExistingExpiryTime = localStorage.getItem(
      "topAssetValuePageExpiryTime"
    );
    if (!tempExistingExpiryTime && !first) {
      this.startPageView();
    }
    const tempExpiryTime = Date.now() + 1800000;
    localStorage.setItem("topAssetValuePageExpiryTime", tempExpiryTime);
  };
  endPageView = () => {
    clearInterval(window.checkTopAssetValueTimer);
    localStorage.removeItem("topAssetValuePageExpiryTime");
    if (this.state.startTime) {
      let endTime = new Date() * 1;
      let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
      TimeSpentTopAssetValue({
        time_spent: TimeSpent,
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
    }
  };
  checkForInactivity = () => {
    const tempExpiryTime = localStorage.getItem("topAssetValuePageExpiryTime");
    if (tempExpiryTime && tempExpiryTime < Date.now()) {
      this.endPageView();
    }
  };
  componentWillUnmount() {
    const tempExpiryTime = localStorage.getItem("topAssetValuePageExpiryTime");
    if (tempExpiryTime) {
      this.endPageView();
    }
  }
  componentDidUpdate(prevProps, prevState) {
    // add wallet

    if (prevState.apiResponse != this.state.apiResponse) {
      this.setState({
        apiResponse: false,
      });
    }

    if (!this.props.commonState.top_asset_value) {
      this.props.updateWalletListFlag("top_asset_value", true);
      this.props.topAccountState.assetValueMonth = null;
      this.props.topAccountState.assetValueYear = null;
      this.props.topAccountState.assetValueDay = null;
      this.props.getAllCoins();
      if (!this.props.topAccountState.assetValueDay) {
        this.getGraphData();
      }
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
    let ActionType = TOP_ASSET_VALUE_GRAPH_DAY;
    let runApi = false;
    if (groupByValue === GROUP_BY_MONTH) {
      ActionType = TOP_ASSET_VALUE_GRAPH_MONTH;
      if (this.props.topAccountState.assetValueMonth) {
        runApi = false;
        this.setState({
          // assetValueData: this.props.topAccountState.assetValueMonth,
          tab: "month",
        });
      } else {
        runApi = true;
        this.setState({
          // assetValueData: this.props.topAccountState.assetValueMonth,
          tab: "month",
        });
      }
    } else if (groupByValue === GROUP_BY_YEAR) {
      ActionType = TOP_ASSET_VALUE_GRAPH_YEAR;
      if (this.props.topAccountState.assetValueYear) {
        runApi = false;
        this.setState({
          // assetValueData: this.props.topAccountState.assetValueYear,
          tab: "year",
        });
      } else {
        runApi = true;
        this.setState({
          // assetValueData: this.props.topAccountState.assetValueMonth,
          tab: "year",
        });
      }
    } else if (groupByValue === GROUP_BY_DATE) {
      ActionType = TOP_ASSET_VALUE_GRAPH_DAY;
      if (this.props.topAccountState.assetValueDay) {
        runApi = false;
        this.setState({
          // assetValueData: this.props.topAccountState.assetValueDay,
          tab: "day",
        });
      } else {
        runApi = true;
        this.setState({
          // assetValueData: this.props.topAccountState.assetValueDay,
          tab: "day",
        });
      }
    } else {
      runApi = true;
    }

    if (runApi) {
      this.setState({ graphLoading: true });
      let addressList = [];
      this.state.userWalletList?.map((wallet) =>
        addressList.push(wallet.address)
      );
      let data = new URLSearchParams();
      data.append("wallet_address", JSON.stringify(addressList));
      data.append("group_criteria", groupByValue);
      this.props.getAssetGraphDataApi(data, this, ActionType);

      // if (this.state.assetValueDataLoaded) {
      //   setTimeout(() => {
      //     this.props.getAssetGraphDataApi(data, this, ActionType);
      //   }, 10000);
      // }
    }
  };

  handleGroupBy = (value) => {
    let groupByValue = GroupByOptions.getGroupBy(value);
    this.getGraphData(groupByValue);
  };

  handleShare = () => {
    const previewAddress = localStorage.getItem("previewAddress")
      ? JSON.parse(localStorage.getItem("previewAddress"))
      : "";
    const encodedAddress = Buffer.from(previewAddress?.address).toString(
      "base64"
    );

    let shareLink =
      BASE_URL_S3 +
      `top-account/${encodedAddress}?redirect=intelligence/asset-value`;
    navigator.clipboard.writeText(shareLink);
    toast.success("Link copied");
    TopAssetValueShare({
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
                // history
                history={this.props.history}
                // add wallet address modal
                handleAddModal={this.handleAddModal}
                isPreviewing={true}
              />
            </div>
          </div>
        </div>
        <div className="volume-traded-section m-t-80">
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
              />
            )}
            <PageHeader
              title={"Asset Value"}
              subTitle={"Analyze your portfolio value over time"}
              showpath={true}
              currentPage={"asset-value"}
              history={this.props.history}
              // btnText={"Add wallet"}
              // handleBtn={this.handleAddModal}
              topaccount={true}
              hoverText={`This chart reflects the largest value for each token on a given day, month, or year.`}
              ShareBtn={true}
              handleShare={this.handleShare}
            />
            <div className="graph-container" style={{ marginBottom: "5rem" }}>
              <LineChartSlider
                assetValueData={
                  this.state.tab === "day"
                    ? this.props.topAccountState.assetValueDay &&
                      this.props.topAccountState.assetValueDay
                    : this.state.tab === "month"
                    ? this.props.topAccountState.assetValueMonth &&
                      this.props.topAccountState.assetValueMonth
                    : this.state.tab === "year"
                    ? this.props.topAccountState.assetValueYear &&
                      this.props.topAccountState.assetValueYear
                    : []
                }
                externalEvents={
                  this.props.topAccountState.externalEvents &&
                  this.props.topAccountState.externalEvents
                }
                coinLists={this.props.OnboardingState.coinsLists}
                isScrollVisible={false}
                handleGroupBy={(value) => this.handleGroupBy(value)}
                graphLoading={this.state.graphLoading}
                isUpdate={this.state.isUpdate}
                isPage={true}
                dataLoaded={this.props.topAccountState.assetValueDataLoaded}
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

  // top account
  topAccountState: state.TopAccountState,
});

const mapDispatchToProps = {
  getAllCoins,
  getAssetGraphDataApi,
  getExternalEventsApi,
  updateWalletListFlag,
  setPageFlagDefault,
  getUser,
  GetAllPlan,
};

export default connect(mapStateToProps, mapDispatchToProps)(TopAssetValueGraph);
