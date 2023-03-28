import React, { Component } from "react";
import { connect } from "react-redux";

import BarGraphSection from "../common/BarGraphSection";
import PageHeader from "../common/PageHeader";

import { info } from "../cost/dummyData";
import { Image } from "react-bootstrap";
import ExportIconWhite from "../../assets/images/apiModalFrame.svg";
import graphImage from "../../assets/images/volume-traded-graph.png";
import LineChartSlider from "../Portfolio/LineCharSlider";
import { GroupByOptions, GROUP_BY_DATE, GROUP_BY_MONTH, GROUP_BY_YEAR } from "../../utils/Constant";
import {
  getAssetGraphDataApi,
  getCoinRate,
  getExternalEventsApi,
} from "../Portfolio/Api";
import { getAllCoins } from "../onboarding/Api";
import FeedbackForm from "../common/FeedbackForm";
import { AssetValuePage } from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
// add wallet
import AddWalletModalIcon from "../../assets/images/icons/wallet-icon.svg";
import FixAddModal from "../common/FixAddModal";
import { GetAllPlan, getUser } from "../common/Api";


import { setPageFlagDefault, updateWalletListFlag } from "../common/Api";
import { ASSET_VALUE_GRAPH_DAY, ASSET_VALUE_GRAPH_MONTH, ASSET_VALUE_GRAPH_YEAR } from "../Portfolio/ActionTypes";


class AssetValueGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graphLoading: false,
      // externalEvents: [],
      userWalletList: JSON.parse(localStorage.getItem("addWallet")),
      // add new wallet

      addModal: false,
      isUpdate: 0,
      apiResponse: false,

      // asset value data for all filters
      assetValueData: null,

      // asset value loader
      assetValueDataLoaded: false,
    };
  }

  componentDidMount() {
    // this.state.startTime = new Date() * 1;
    AssetValuePage({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    // console.log("page Enter", this.state.startTime / 1000);
    // console.log('this.state',this.state);
    //    this.props.getCoinRate();
    this.props.getAllCoins();
    // this.getGraphData();
    this.setState({});
    GetAllPlan();
    getUser();
    this.setState({
      assetValueData: this.props.portfolioState.assetValueMonth,
    });
  }
  componentDidUpdate(prevProps, prevState) {
    // add wallet

    if (prevState.apiResponse != this.state.apiResponse) {
      // console.log("update");

      this.setState({
        apiResponse: false,
      });
    }

    if (!this.props.commonState.asset_value) {
      //  console.log("up")
      this.props.updateWalletListFlag("asset_value", true);
      this.props.portfolioState.assetValueMonth = null;
      this.props.portfolioState.assetValueYear = null;
      this.props.portfolioState.assetValueDay = null;
      this.props.getAllCoins();
      if (!this.props.portfolioState.assetValueDay) {
        this.getGraphData();
      }
    }
  }

  componentWillUnmount() {
    // reset to month graph on page leave
    // this.getGraphData();
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

    // console.log("updated wallet", value);
  };

  CheckApiResponse = (value) => {
    this.setState({
      apiResponse: value,
    });
    // console.log("api respinse", value)
    this.props.setPageFlagDefault();
  };

  getGraphData = (groupByValue = GROUP_BY_DATE) => {
    // console.log("data a", this.props);

    let ActionType = ASSET_VALUE_GRAPH_DAY;
    let runApi = false;
    if (groupByValue === GROUP_BY_MONTH) {
      ActionType = ASSET_VALUE_GRAPH_MONTH;
      if (this.props.portfolioState.assetValueMonth) {
        runApi = false;
        this.setState({
          assetValueData: this.props.portfolioState.assetValueMonth,
        });
        // console.log("months");
      } else {
        runApi = true;
      }
    } else if (groupByValue === GROUP_BY_YEAR) {
      ActionType = ASSET_VALUE_GRAPH_YEAR;
      if (this.props.portfolioState.assetValueYear) {
        runApi = false;
        this.setState({
          assetValueData: this.props.portfolioState.assetValueYear,
        });
        // console.log("year");
      } else {
        runApi = true;
      }
    } else if (groupByValue === GROUP_BY_DATE) {
      ActionType = ASSET_VALUE_GRAPH_DAY;
      if (this.props.portfolioState.assetValueDay) {
        runApi = false;
        this.setState({
          assetValueData: this.props.portfolioState.assetValueDay,
        });
        //  console.log("data");
      } else {
        runApi = true;
      }
    } else {
      runApi = true;
      // console.log("api");
    }

    if (runApi) {
      //  console.log("api");
      this.setState({ graphLoading: true });
      let addressList = [];
      // console.log("wallet addres", this.state.userWalletList);
      this.state.userWalletList?.map((wallet) =>
        addressList.push(wallet.address)
      );
      // console.log("addressList", this.state.userWalletList);
      let data = new URLSearchParams();
      data.append("wallet_addresses", JSON.stringify(addressList));
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

  render() {
    return (
      <div className="volume-traded-section">
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
            btnText={"Add wallet"}
            handleBtn={this.handleAddModal}
            hoverText={`This chart reflects the largest value for each token on a given day, month, or year.`}
          />
          <div className="graph-container" style={{ marginBottom: "5rem" }}>
            <LineChartSlider
              assetValueData={
                this.state.assetValueData && this.state.assetValueData
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
              dataLoaded={this.props.portfolioState.assetValueDataLoaded}
            />
          </div>
          {/* <FeedbackForm page={"Asset Value Graph Page"} /> */}
        </div>
      </div>
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
};

export default connect(mapStateToProps, mapDispatchToProps)(AssetValueGraph);
