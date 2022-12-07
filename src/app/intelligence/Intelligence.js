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
import Loading from '../common/Loading';


class Intelligence extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // showPercentage: {
      //   icon: arrowUpRight,
      //   percent: "25",
      //   status: "Increase",
      //   GraphData: [],
      //   graphValue: "null",
      // },
      startTime: "",
    };
  }

    componentDidMount() {
       this.state.startTime = new Date() * 1;
        console.log("page Enter", this.state.startTime);

    this.props.getAllCoins();
    this.timeFilter(0);
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

  timeFilter = (option,activeBadgeList = false) => {
    let selectedChains = [];
    if(activeBadgeList){
      this.props.OnboardingState.coinsList.map((item)=>{
        if(activeBadgeList.includes(item.id)){
          selectedChains.push(item.code)
        }
      })
    }
    const today = moment().unix();
    if (option == 0) {
      getProfitAndLossApi(this, false, false, selectedChains);
    } else if (option == 1) {
      const fiveyear = moment().subtract(5, "years").unix();
      getProfitAndLossApi(this, fiveyear, today, selectedChains);
    } else if (option == 2) {
      const year = moment().subtract(1, "years").unix();
      getProfitAndLossApi(this, year, today, selectedChains);
    } else if (option == 3) {
      const sixmonth = moment().subtract(6, "months").unix();
      getProfitAndLossApi(this, sixmonth, today, selectedChains);
    } else if (option == 4) {
      const month = moment().subtract(1, "month").unix();
      getProfitAndLossApi(this, month, today, selectedChains);
    } else if (option == 5) {
      const week = moment().subtract(1, "week").unix();
      getProfitAndLossApi(this, week, today, selectedChains);
    } else if (option == 6) {
      const day = moment().subtract(1, "day").unix();
      getProfitAndLossApi(this, day, today, selectedChains);
    }
  }

  handleBadge = (activeBadgeList, activeFooter) => {
    let startDate = moment().unix();
    let endDate;
    console.log('activeFooter',activeFooter);
    if (activeFooter == 0) {
      startDate = "";
      endDate = "";
    } else if (activeFooter == 1) {
      endDate = moment().subtract(5, "years").unix();
    } else if (activeFooter == 2) {
      endDate = moment().subtract(1, "years").unix();
    } else if (activeFooter == 3) {
      endDate = moment().subtract(6, "months").unix();
    } else if (activeFooter == 4) {
      endDate = moment().subtract(1, "month").unix();
    } else if (activeFooter == 5) {
      endDate = moment().subtract(1, "week").unix();
    } else if (activeFooter == 6) {
      endDate = moment().subtract(1, "day").unix();
    }

    let selectedChains = [];
    this.props.OnboardingState.coinsList.map((item)=>{
      if(activeBadgeList.includes(item.id)){
        selectedChains.push(item.code)
      }
    })

    if(activeFooter = 0){
      getProfitAndLossApi(this, false, false, selectedChains);
    } else {
      getProfitAndLossApi(this, startDate, endDate, selectedChains);
    }
  }

  render() {
    // let showPercentage = this.state.showPercentage;
    // if(this.state.graphValue && this.state.graphValue[2]){
    //   let value = (this.state.graphValue[2].inflows-this.state.graphValue[2].outflows);
    //   showPercentage= {
    //     icon: value > 0 ? arrowUpRight : arrowDownRight,
    //     percent: ((value/this.state.graphValue[2].inflows)*100).toFixed(),
    //     status: value > 0 ? "Increase" : "Decrease",
    //     GraphData: [],
    //     graphValue: "null",
    //   }
    // }
    // console.log('showPercentage',showPercentage);

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
                        {this.state.graphValue?
                            <BarGraphSection
                                isScrollVisible={false}
                                data={this.state.graphValue[0]}
                                options={this.state.graphValue[1]}
                                coinsList={this.props.OnboardingState.coinsList}
                                timeFunction={(e,activeBadgeList) => this.timeFilter(e, activeBadgeList)}
                                marginBottom='m-b-32'
                                showFooter={true}
                                showBadges={true}
                                showPercentage = {this.state.graphValue[2]}
                                footerLabels = {["Max" , "5 Years","1 Year","6 Months","1 Week"]}
                                handleBadge={(activeBadgeList, activeFooter) => this.handleBadge(activeBadgeList, activeFooter)}
                                // comingSoon={true}
                            />
                            :
                            <div className="loading-wrapper">
                              <Loading />
                              <br/><br/>
                            </div>
                        }
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