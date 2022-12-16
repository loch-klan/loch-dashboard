import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import IntelWelcomeCard from './IntelWelcomeCard';
import PageHeader from '../common/PageHeader';
import eyeIcon from '../../assets/images/icons/eyeIcon.svg'
import insight from '../../assets/images/icons/insight.svg'
import BarGraphSection from '../common/BarGraphSection';
import { getAllCoins } from '../onboarding/Api.js'
import { Image } from 'react-bootstrap';
import { InsightsViewMore, TimeSpentIntelligence } from '../../utils/AnalyticsFunctions';
import { getCurrentUser } from '../../utils/ManageToken';
import moment from "moment/moment";
import { getProfitAndLossApi} from "./Api";
import Loading from '../common/Loading';
import reduceCost from '../../assets/images/icons/reduce-cost.svg'
import reduceRisk from '../../assets/images/icons/reduce-risk.svg'
import increaseYield from '../../assets/images/icons/increase-yield.svg'
import { getAllInsightsApi } from "./Api";
import { InsightType } from "../../utils/Constant";
import FeedbackForm from '../common/FeedbackForm';

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
      updatedInsightList: "",
      isLoading: true,
    };
  }

    componentDidMount() {
       this.state.startTime = new Date() * 1;
        console.log("page Enter", this.state.startTime);
        window.scrollTo(0, 0);
    this.props.getAllCoins();
    this.timeFilter(0);
    getAllInsightsApi(this);
  }
  componentWillUnmount() {
    let endTime = new Date() * 1;
    let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
    console.log("page Leave", endTime);
    console.log("Time Spent", TimeSpent);
    TimeSpentIntelligence({
      time_spent: TimeSpent,
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
            <div className="intelligence-section page">
              <PageHeader
                title="Intelligence"
                subTitle="Automated and personalized financial intelligence"
              />
              <IntelWelcomeCard history={this.props.history} />
              <div className="insights-image m-b-40">
                <PageHeader
                  title="Insights"
                  showImg={insight}
                  viewMore={true}
                  viewMoreRedirect={"/intelligence/insights"}
                  handleClick={()=>{InsightsViewMore({ session_id: getCurrentUser().id, email_address: getCurrentUser().email });}}
                />
                <div style={{ position: "relative" }}>
                  <div className="insights-wrapper">
                    {/* <h2 className="inter-display-medium f-s-25 lh-30 black-191">This week</h2> */}
                    {this.state.isLoading ? (
                      <Loading />
                    ) : this.state.updatedInsightList &&
                      this.state.updatedInsightList.length > 0 ? (
                      this.state.updatedInsightList
                        .slice(0, 2)
                        .map((insight, key) => {
                          return (
                            <div className="insights-card" key={key}>
                              <Image
                                src={
                                  insight.insight_type ===
                                  InsightType.COST_REDUCTION
                                    ? reduceCost
                                    : insight.insight_type ===
                                      InsightType.RISK_REDUCTION
                                    ? reduceRisk
                                    : increaseYield
                                }
                                className="insight-icon"
                              />
                              <div className="insights-content">
                                <h5 className="inter-display-bold f-s-10 lh-12 title-chip">
                                  {InsightType.getText(insight.insight_type)}
                                </h5>
                                <p
                                  className="inter-display-medium f-s-13 lh-16 grey-969"
                                  dangerouslySetInnerHTML={{
                                    __html: insight.sub_title,
                                  }}
                                ></p>
                                <h4
                                  className="inter-display-medium f-s-16 lh-19 grey-313"
                                  dangerouslySetInnerHTML={{
                                    __html: insight.title,
                                  }}
                                ></h4>
                              </div>
                            </div>
                          );
                        })
                    ) : (
                      <h5 className="inter-display-medium f-s-16 lh-19 grey-313 m-b-8 text-center">
                        {
                          "This wallet is not active enough for us to generate any useful insights here :)."
                        }
                      </h5>
                    )}
                  </div>
                </div>
              </div>
              <div className="portfolio-bar-graph">
                <PageHeader title="Net Flows" showImg={eyeIcon} />
                <div style={{ position: "relative" }}>
                  {/* <div className='coming-soon-div'>
                                          <Image src={ExportIconWhite} className="coming-soon-img" />
                                          <p className='inter-display-regular f-s-13 lh-16 black-191'>This feature is coming soon.</p>
                                          </div> */}
                  {this.state.graphValue ? (
                    <BarGraphSection
                      isScrollVisible={false}
                      data={this.state.graphValue[0]}
                      options={this.state.graphValue[1]}
                      coinsList={this.props.OnboardingState.coinsList}
                      timeFunction={(e, activeBadgeList) =>
                        this.timeFilter(e, activeBadgeList)
                      }
                      marginBottom="m-b-32"
                      showFooter={true}
                      showBadges={true}
                      showPercentage={this.state.graphValue[2]}
                      footerLabels={[
                        "Max",
                        "5 Years",
                        "1 Year",
                        "6 Months",
                        "1 Month",
                        "1 Week",
                        "1 Day",
                      ]}
                      handleBadge={(activeBadgeList, activeFooter) =>
                        this.handleBadge(activeBadgeList, activeFooter)
                      }
                      // comingSoon={true}
                    />
                  ) : (
                    <div className="loading-wrapper">
                      <Loading />
                      <br />
                      <br />
                    </div>
                  )}
                </div>
                  <FeedbackForm />
              </div>
            </div>
          </div>
        );
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