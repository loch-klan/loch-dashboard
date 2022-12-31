import React, { Component } from "react";
import { connect } from "react-redux";

import BarGraphSection from "../common/BarGraphSection";
import PageHeader from "../common/PageHeader";

import { info } from "../cost/dummyData";
import { Image } from "react-bootstrap";
import ExportIconWhite from "../../assets/images/apiModalFrame.svg";
import graphImage from "../../assets/images/volume-traded-graph.png";
import LineChartSlider from "../Portfolio/LineCharSlider";
import { GroupByOptions, GROUP_BY_MONTH, GROUP_BY_YEAR } from "../../utils/Constant";
import { getAssetGraphDataApi, getCoinRate } from "../Portfolio/Api";
import { getAllCoins } from "../onboarding/Api";
import FeedbackForm from "../common/FeedbackForm";
import { AssetValuePage } from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";


class AssetValueGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graphLoading: true,
      isUpdate: 0,
      externalEvents: [],
      userWalletList: JSON.parse(localStorage.getItem("addWallet")),
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
    this.getGraphData();

  }

  getGraphData = (groupByValue = GROUP_BY_MONTH) => {
    this.setState({ graphLoading: true });
    let addressList = [];
    this.state.userWalletList.map((wallet) => addressList.push(wallet.address));
    // console.log('addressList',addressList);
    let data = new URLSearchParams();
    data.append("wallet_addresses", JSON.stringify(addressList));
    data.append("group_criteria", groupByValue);
    getAssetGraphDataApi(data, this);
  };

  handleGroupBy = (value) => {
    let groupByValue = GroupByOptions.getGroupBy(value);
    this.getGraphData(groupByValue);
  };

  render() {
    return (
      <div className="volume-traded-section">
        <div className="page volume-traded-page">
          <PageHeader
            title={"Asset Value"}
            subTitle={"Updated 3mins ago"}
            showpath={true}
            currentPage={"asset-value"}
            history={this.props.history}
          />
          <div className="graph-container">
            <LineChartSlider
              assetValueData={
                this.state.assetValueData && this.state.assetValueData
              }
              externalEvents={
                this.state.externalEvents && this.state.externalEvents
              }
              coinLists={this.props.OnboardingState.coinsLists}
              isScrollVisible={false}
              handleGroupBy={(value) => this.handleGroupBy(value)}
              graphLoading={this.state.graphLoading}
                        isUpdate={this.state.isUpdate}
                        isPage={true}
            />
          </div>
          <FeedbackForm page={"Asset Value Graph Page"} />
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
    OnboardingState: state.OnboardingState,

});

const mapDispatchToProps = {
  getAllCoins,
  getAssetGraphDataApi,
};

export default connect(mapStateToProps, mapDispatchToProps)(AssetValueGraph);
