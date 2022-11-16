import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import Sidebar from '../common/Sidebar';
import IntelWelcomeCard from './IntelWelcomeCard';
import PageHeader from '../common/PageHeader';
import TransactionHistoryPage  from './TransactionHistoryPage';
import eyeIcon from '../../assets/images/icons/eyeIcon.svg'
import BarGraphSection from '../common/BarGraphSection';
import { getAllCoins } from '../onboarding/Api.js'
import arrowUpRight from '../../assets/images/icons/arrowUpRight.svg'
import arrowDownRight from '../../assets/images/icons/arrow-down-right.svg'
import ExportIconWhite from '../../assets/images/apiModalFrame.svg'
import { Image } from 'react-bootstrap';
import { TimeSpentIntelligence } from '../../utils/AnalyticsFunctions';
import { getCurrentUser } from '../../utils/ManageToken';

class Intelligence extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPercentage: {
        icon: arrowUpRight,
        percent: "25",
        status: "Increase",
      },
      startTime: "",
    };
  }

    componentDidMount() {
       this.state.startTime = new Date() * 1;
        console.log("page Enter", this.state.startTime);

    this.props.getAllCoins();
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
                        title="Portfolio Performance"
                        showImg={eyeIcon}
                    />
                    <div style={{position: "relative"}}>
                    <div className='coming-soon-div'>
                                          <Image src={ExportIconWhite} className="coming-soon-img" />
                                          <p className='inter-display-regular f-s-13 lh-16 black-191'>This feature is coming soon.</p>
                                          </div>
                    <BarGraphSection
                        isScrollVisible={false}
                        data={data}
                        options={options}
                        coinsList={this.props.OnboardingState.coinsList}
                        marginBottom='m-b-32'
                        showFooter={true}
                        showBadges={true}
                        showPercentage = {this.state.showPercentage}
                        footerLabels = {["Max" , "5 Years","1 Year","6 Months","1 Month","1 Week"]}
                        comingSoon={true}
                    />
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