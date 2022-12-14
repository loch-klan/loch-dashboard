import React, { Component } from "react";
import BarGraphSection from "../common/BarGraphSection";
import PageHeader from "../common/PageHeader";
import Sidebar from "../common/Sidebar";
import { info, years5, ethereum } from "./dummyData.js";
import { connect } from "react-redux";
import { getAllCoins } from "../onboarding/Api.js";
import Ethereum from "../../assets/images/icons/ether-coin.svg";
import GainIcon from "../../assets/images/icons/GainIcon.svg";
import LossIcon from "../../assets/images/icons/LossIcon.svg";
import { Image } from "react-bootstrap";
import CoinChip from "../wallet/CoinChip";
import TransactionTable from "../intelligence/TransactionTable";
import {
  TimeSpentCosts,
  FeesTimePeriodFilter,
  CounterpartyFeesTimeFilter,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import ExportIconWhite from "../../assets/images/apiModalFrame.svg";
import {getCounterGraphData, getGraphData} from "./getGraphData";
import { getAllFeeApi, getAllCounterFeeApi } from "./Api";
import Loading from "../common/Loading";
import moment from "moment/moment";
import graphImage from '../../assets/images/gas-fees-graph.png'


class Cost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      durationgraphdata: {
        data: info[0],
        options: info[1],
        options2: info[2],
      },
      startTime: "",
      GraphData: [],
      graphValue: null,
      counterGraphLoading: true,
      counterPartyData: [],
      counterPartyValue: null,
    };
  }

  componentDidMount() {

    if(this.props.location.hash !== ''){
      setTimeout(() => {
      const id = this.props.location.hash.replace('#', '');
      console.log('id',id);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView();
      }
    }, 0);
    } else{
      window.scrollTo(0, 0);
    }
    this.state.startTime = new Date() * 1;
    console.log("page Enter", this.state.startTime / 1000);

    this.props.getAllCoins();
    this.getBlockchainFee(0);
    this.getCounterPartyFee(0);
  }

  getBlockchainFee(option) {

    const today = moment().valueOf();
    let handleSelected = "";
    console.log("headle click");
    if (option == 0) {
      getAllFeeApi(this, false, false);
      // console.log(option, "All");
       handleSelected = "All";
    } else if (option == 1) {
      const fiveyear = moment().subtract(5, "years").valueOf();

      getAllFeeApi(this, fiveyear, today);
      // console.log(fiveyear, today, "5 years");
       handleSelected = "5 Years";
    } else if (option == 2) {
      const year = moment().subtract(1, "years").valueOf();
      getAllFeeApi(this, year, today);
      // console.log(year, today, "1 year");
       handleSelected = "1 Year";
    } else if (option == 3) {
      const sixmonth = moment().subtract(6, "months").valueOf();

      getAllFeeApi(this, sixmonth, today);
      // console.log(sixmonth, today, "6 months");
       handleSelected = "6 Months";
    } else if (option == 4) {
      const month = moment().subtract(1, "month").valueOf();
      getAllFeeApi(this, month, today);
      // console.log(month, today, "1 month");
       handleSelected = "1 Month";
    } else if (option == 5) {
      const week = moment().subtract(1, "week").valueOf();
      getAllFeeApi(this, week, today);
      // console.log(week, today, "week");
       handleSelected = "Week";
    }
    // console.log("handle select", handleSelected);
    FeesTimePeriodFilter({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      time_period_selected: handleSelected
    });
  }

  getCounterPartyFee(option) {

    const today = moment().unix();
    let handleSelected = "";
    // console.log("headle click");
    if (option == 0) {
      getAllCounterFeeApi(this, false, false);
      // console.log(option, "All");
    handleSelected = "All";

    } else if (option == 1) {
      const fiveyear = moment().subtract(5, "years").unix();

      getAllCounterFeeApi(this, fiveyear, today);
      // console.log(fiveyear, today, "5 years");
      handleSelected = "5 Years";
    } else if (option == 2) {
      const year = moment().subtract(1, "years").unix();
      getAllCounterFeeApi(this, year, today);
      // console.log(year, today, "1 year");
      handleSelected = "1 Years";
    } else if (option == 3) {
      const sixmonth = moment().subtract(6, "months").unix();

      getAllCounterFeeApi(this, sixmonth, today);
      // console.log(sixmonth, today, "6 months");
      handleSelected = "6 Months";
    } else if (option == 4) {
      const month = moment().subtract(1, "month").unix();
      getAllCounterFeeApi(this, month, today);
      // console.log(month, today, "1 month");
      handleSelected = "1 Month";
    } else if (option == 5) {
      const week = moment().subtract(1, "week").unix();
      getAllCounterFeeApi(this, week, today);
      // console.log(week, today, "week");
      handleSelected = "Week";
    }

    // console.log("handle select", handleSelected)
    // CounterpartyFeesTimeFilter;
    CounterpartyFeesTimeFilter({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      time_period_selected: handleSelected,
    });
  }

  componentWillUnmount() {
    let endTime = new Date() * 1;
    let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
    console.log("page Leave", endTime / 1000);
    console.log("Time Spent", TimeSpent);
    TimeSpentCosts({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      time_spent: TimeSpent,
    });
  }

  handleBadge = (activeBadgeList, type) => {
    const {GraphData, counterPartyData} = this.state;
      let graphDataMaster = [];
      let counterPartyDataMaster = [];
      if(type === 1){
        GraphData && GraphData.map((tempGraphData)=>{
          if(activeBadgeList.includes(tempGraphData.chain._id) || activeBadgeList.length === 0){
            graphDataMaster.push(tempGraphData);
          }
        })
        this.setState({
          graphValue: getGraphData(graphDataMaster),
        });
      } else{
        counterPartyData && counterPartyData.map((tempGraphData)=>{
          if(activeBadgeList.includes(tempGraphData.chain._id) || activeBadgeList.length === 0){
            counterPartyDataMaster.push(tempGraphData);
          }
        })
        this.setState({
          counterPartyValue: getCounterGraphData(counterPartyDataMaster),
        });
      }
  }

  render() {


    const tableData = [
      {
        Asset: Ethereum,
        AverageCostPrice: "$800.00",
        CurrentPrice: "$1,390.00",
        Amount: 3.97,
        CostBasis: 1.75,
        CurrentValue: "$5,514.00",
        GainLoss: {
          status: "gain",
          symbol: GainIcon,
          // "42.45%",
          value: "42.45%",
        },
      },
      {
        Asset: Ethereum,
        AverageCostPrice: "$25,000.00",
        CurrentPrice: "$21,080.00",
        Amount: 3.97,
        CostBasis: 2.56,
        CurrentValue: "$22,280.50",
        GainLoss: {
          status: "loss",
          symbol: LossIcon,
          // "-18.45%"
          value: "-18.45%",
        },
      },
    ];

    const columnData = [
      {
        labelName: "Asset",
        dataKey: "Asset",
        // coumnWidth: 118,
        coumnWidth: 0.2,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "Asset") {
            return <CoinChip coin_img_src={rowData.Asset} coin_code="ETH" />;
          }
        },
      },
      {
        labelName: "Average Cost Price",
        dataKey: "AverageCostPrice",
        // coumnWidth: 153,
        coumnWidth: 0.2,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "AverageCostPrice") {
            return (
              <div className="inter-display-medium f-s-13 lh-16 grey-313 cost-common">
                {rowData.AverageCostPrice}
              </div>
            );
          }
        },
      },
      {
        labelName: "Current Price",
        dataKey: "CurrentPrice",
        // coumnWidth: 128,
        coumnWidth: 0.2,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "CurrentPrice") {
            return (
              <div className="inter-display-medium f-s-13 lh-16 grey-313 cost-common">
                {rowData.CurrentPrice}
              </div>
            );
          }
        },
      },
      {
        labelName: "Amount",
        dataKey: "Amount",
        // coumnWidth: 108,
        coumnWidth: 0.2,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "Amount") {
            return rowData.Amount;
          }
        },
      },
      {
        labelName: "Cost Basis",
        dataKey: "CostBasis",
        // coumnWidth: 100,
        coumnWidth: 0.2,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "CostBasis") {
            return rowData.CostBasis;
          }
        },
      },
      {
        labelName: "CurrentValue",
        dataKey: "CurrentValue",
        // coumnWidth: 140,
        coumnWidth: 0.2,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "CurrentValue") {
            return rowData.CurrentValue;
          }
        },
      },
      {
        labelName: "% Gain / Loss",
        dataKey: "GainLoss",
        // coumnWidth: 128,
        coumnWidth: 0.25,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "GainLoss") {
            return (
              <div
                className={`gainLoss ${
                  rowData.GainLoss.status === "loss" ? "loss" : "gain"
                }`}
              >
                <Image src={rowData.GainLoss.symbol} />
                <div className="inter-display-medium f-s-13 lh-16 grey-313">
                  {rowData.GainLoss.value}
                </div>
              </div>
            );
          }
        },
      },
    ];

    return (
      <div className="cost-page-section">
        <div className="m-t-5 cost-section page">
          <PageHeader
            title="Costs"
            subTitle="Bring light to your hidden costs"
          />
          <div style={{ position: "relative", minHeight: "80rem" }}>
            {this.state.graphValue ?
              <BarGraphSection
                headerTitle="Blockchain Fees over Time"
                headerSubTitle="Understand your gas costs"
                data={this.state.graphValue[0]}
                options={this.state.graphValue[1]}
                options2={this.state.graphValue[2]}
                coinsList={this.props.OnboardingState.coinsList}
                timeFunction={(e) => {
                  
                  this.getBlockchainFee(e)
                }}
                marginBottom="m-b-32"
                showFooter={true}
                showBadges={true}
                isScrollVisible={false}
                isScroll={true}
                handleBadge={(activeBadgeList) => this.handleBadge(activeBadgeList, 1)}
                // height={420}
                // width={824}
                // comingSoon={false}
              />
              // <></>
             :
             <div className="loading-wrapper">
              <Image src={graphImage} className="graph-image" />
              <Loading />
              <br/><br/>
             </div>

            }
          </div>
          <div id="cp" style={{ position: "relative", minHeight: "80rem" }}>
            {/* <div className="coming-soon-div">
              <Image src={ExportIconWhite} className="coming-soon-img" />
              <p className="inter-display-regular f-s-13 lh-16 black-191">
                This feature is coming soon.
              </p>
            </div> */}
            {
              this.state.counterPartyValue
              ?
              <BarGraphSection
              headerTitle="Counterparty Fees Over Time"
              headerSubTitle="Understand how much your counterparty charges you"
              data={this.state.counterPartyValue[0]}
              options={this.state.counterPartyValue[1]}
              options2={this.state.counterPartyValue[2]}
              coinsList={this.props.OnboardingState.coinsList}
              timeFunction={(e) => this.getCounterPartyFee(e)}
              marginBottom="m-b-32"
              showFooter={true}
              showBadges={true}
              isScrollVisible={false}
              isScroll={true}
              handleBadge={(activeBadgeList) => this.handleBadge(activeBadgeList, 2)}
              // height={"400px"}
              // width={"824px"}
              // comingSoon={true}
            />
            :
            <div className="loading-wrapper">
              <Image src={graphImage} className="graph-image" />
              <Loading />
              <br/><br/>
             </div>
            }

          </div>
          <div className="m-b-40 cost-table-section">
            <div style={{ position: "relative" }}>
              <div className="coming-soon-div">
                <Image src={ExportIconWhite} className="coming-soon-img" />
                <p className="inter-display-regular f-s-13 lh-16 black-191">
                  This feature is coming soon.
                </p>
              </div>
              <TransactionTable
                title="Average Cost Basis"
                subTitle="Understand your average entry price"
                tableData={tableData}
                columnList={columnData}
                headerHeight={64}
                comingSoon={true}
              />
            </div>
          </div>
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
};

export default connect(mapStateToProps, mapDispatchToProps)(Cost);
