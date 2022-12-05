import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import IntelWelcomeCard from './IntelWelcomeCard';
import PageHeader from '../common/PageHeader';
import eyeIcon from '../../assets/images/icons/eyeIcon.svg'
import insight from '../../assets/images/icons/insight.svg'
import BarGraphSection from '../common/BarGraphSection';
import { getAllCoins } from '../onboarding/Api.js'
import arrowUpRight from '../../assets/images/icons/arrowUpRight.svg'
import arrowDownRight from '../../assets/images/icons/arrow-down-right.svg'
import ExportIconWhite from '../../assets/images/apiModalFrame.svg'
import { Image } from 'react-bootstrap';
import { TimeSpentIntelligence } from '../../utils/AnalyticsFunctions';
import { getCurrentUser } from '../../utils/ManageToken';
import ThisWeek from "../../assets/images/This-week.svg"
// import Insights1 from "../../assets/images/Insights1.svg"
import Insights2 from "../../assets/images/Insights2.svg"
// import Insights3 from "../../assets/images/Insights3.svg"
import Insights4 from "../../assets/images/Insights4.svg"
import Insights5 from "../../assets/images/Insights5.svg"
import moment from "moment/moment";
import { getProfitAndLossApi} from "./Api";
import { getProfitAndLossData} from "./getProfitAndLossData";


class Intelligence extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPercentage: {
        icon: arrowUpRight,
        percent: "25",
        status: "Increase",
        GraphData: [],
        graphValue: "null",
      },
      startTime: "",
    };
  }

    componentDidMount() {
       this.state.startTime = new Date() * 1;
        console.log("page Enter", this.state.startTime);

    this.props.getAllCoins();
    this.getProfitAndLossData(0);
  }
  componentWillUnmount() {
    let endTime = new Date() * 1;
    let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
    console.log("page Leave", endTime);
    console.log("Time Spent", TimeSpent);
    TimeSpentIntelligence({
      time_spent: TimeSpent + " seconds",
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
  }
  
  getProfitAndLossData(option) {

    const today = moment().unix();

    console.log("headle click");
    if (option == 0) {
      getProfitAndLossApi(this, false, false);
      console.log(option, "All");
    } else if (option == 1) {
      const fiveyear = moment().subtract(5, "years").unix();

      getProfitAndLossApi(this, fiveyear, today);
      console.log(fiveyear, today, "5 years");
    } else if (option == 2) {
      const year = moment().subtract(1, "years").unix();
      getProfitAndLossApi(this, year, today);
      console.log(year, today, "1 year");
    } else if (option == 3) {
      const sixmonth = moment().subtract(6, "months").unix();

      getProfitAndLossApi(this, sixmonth, today);
      console.log(sixmonth, today, "6 months");
    } else if (option == 4) {
      const month = moment().subtract(1, "month").unix();
      getProfitAndLossApi(this, month, today);
      console.log(month, today, "1 month");
    } else if (option == 5) {
      const week = moment().subtract(1, "week").unix();
      getProfitAndLossApi(this, week, today);
      console.log(week, today, "week");
    } else if (option == 6) {
        const day = moment().subtract(1, "day").unix();
        getProfitAndLossApi(this, day, today);
        console.log(day, today, "day");
      }
  }

  handleBadge = (activeBadgeList, type) => {
    const {GraphData} = this.state;
      let graphDataMaster = [];
      if(type === 1){
        GraphData && GraphData.map((tempGraphData)=>{
          if(activeBadgeList.includes(tempGraphData.chain._id) || activeBadgeList.length === 0){
            graphDataMaster.push(tempGraphData);
          }
        })
        this.setState({
          graphValue: getProfitAndLossData(graphDataMaster),
        });
      } 
    //   else{
    //     counterPartyData && counterPartyData.map((tempGraphData)=>{
    //       if(activeBadgeList.includes(tempGraphData.chain._id) || activeBadgeList.length === 0){
    //         counterPartyDataMaster.push(tempGraphData);
    //       }
    //     })
    //     this.setState({
    //       counterPartyValue: getCounterGraphData(counterPartyDataMaster),
    //     });
    //   }
  }

  render() {
    const labels = ["Inflows", "Outflows", "Current Value"];

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
            },
            scales: {
            //     categoryPercentage: 0.8,
            // barPercentage: 1,
                y: {
                    min: 0,
                    max: 400000,
                    ticks: {
                        stepSize: 100000,
                        padding: 8,
                        size: 12,
                        lineHeight: 20,
                        family: "Helvetica Neue",
                        weight: 400,
                        color: "#B0B1B3",
                    },
                    grid: {
                        drawBorder: false,
                        display: true,
                        borderDash: ctx => ctx.index == 0 ? [0] : [4],
                        drawTicks: false
                    }
                },
                x: {

                    ticks: {
                        font: "Inter-SemiBold",
                        size: 10,
                        lineHeight: 12,
                        weight: 600,
                        color: "#86909C",
                    },
                    grid: {
                        display: false,
                        borderWidth: 1,
                    }
                },

            }
        }

        const data = {
            labels,
            datasets: [
                {

                    data: [260000, 323000, 76000],
                    backgroundColor: [
                        "rgba(100, 190, 205, 0.3)",
                        "rgba(34, 151, 219, 0.3)",
                        "rgba(114, 87, 211, 0.3)",
                    ],
                    borderColor: [
                        "#64BECD",
                        "#2297DB",
                        "#7257D3",
                    ],
                    borderWidth: 2,
                    borderRadius: {
                        topLeft: 6,
                        topRight: 6
                    },
                    borderSkipped: false,
                    barThickness:48,

                }
            ]
        }
        return (
            <div className="intelligence-page-section">
                <div className='intelligence-section page'>
                    <PageHeader
                        title="Intelligence"
                        subTitle="Automated and personalized financial intelligence"
                    />
                    <IntelWelcomeCard
                        history={this.props.history}
                    />
                    <div className="portfolio-bar-graph">
                    <PageHeader
                        title="Profit And Loss"
                        showImg={eyeIcon}
                    />
                    <div style={{position: "relative"}}>
                    {/* <div className='coming-soon-div'>
                                          <Image src={ExportIconWhite} className="coming-soon-img" />
                                          <p className='inter-display-regular f-s-13 lh-16 black-191'>This feature is coming soon.</p>
                                          </div> */}
                             
                            <BarGraphSection
                                isScrollVisible={false}
                                data={this.state.graphValue}
                                options={options}
                                coinsList={this.props.OnboardingState.coinsList}
                                timeFunction={(e) => this.getProfitAndLossData(e)}
                                marginBottom='m-b-32'
                                showFooter={true}
                                showBadges={true}
                                showPercentage = {this.state.showPercentage}
                                // footerLabels = {["Max" , "5 Years","1 Year","6 Months","1 Month","1 Week"]}
                                handleBadge={(activeBadgeList) => this.handleBadge(activeBadgeList, 1)}
                                // comingSoon={true}
                            /> 
                    </div>

        <div className="insights-image">
        <PageHeader
                        title="Insights"
                        showImg={insight}
                        viewMore={true}
                        viewMoreRedirect={"/intelligence/insights"}
                    />
                    <div style={{position: "relative"}}>
                    <div className='coming-soon-div'>
                        <Image src={ExportIconWhite} className="coming-soon-img" />
                        <p className='inter-display-regular f-s-13 lh-16 black-191'>This feature is coming soon.</p>
                    </div>
                    <span className="blur-effect">


          <div className="insights-feed">
            <Image
            src={Insights5} />
            <Image
            src={Insights2} />
            <Image
            src={Insights4} />
          </div>
          </span>
        </div>
</div>
                    </div>
                    {/* <TransactionHistoryPage/> */}
                </div>
            </div>

        )
    }
}

const mapStateToProps = state => ({
    intelligenceState: state.IntelligenceState,
    OnboardingState: state.OnboardingState
});
const mapDispatchToProps = {
    // getPosts: fetchPosts
    getAllCoins
}
Intelligence.propTypes = {
    // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Intelligence);