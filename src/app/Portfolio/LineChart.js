import BaseReactComponent from "../../utils/form/BaseReactComponent";
// import PropTypes from 'prop-types';
import { connect } from "react-redux";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { GraphHeader } from '../common/GraphHeader'
import CoinBadges from './../common/CoinBadges';
import DropDown from "../common/DropDown";
import TrendingUp from '../../assets/images/icons/TrendingUp.svg'
import TrendingDown from '../../assets/images/icons/TrendingDown.svg'
import { AssetValueFilter } from "../../utils/AnalyticsFunctions.js";
import { getCurrentUser } from "../../utils/ManageToken";
class LineChart extends BaseReactComponent {
    constructor(props) {
        super(props);
        this.state = {
            activeBadge: [{ name: "All", id: "" }],
            title: "Month",
            titleY:"$ USD"
        }

    }
    handleFunction = (badge) => {
        
        let newArr = [...this.state.activeBadge]
        if (this.state.activeBadge.some(e => e.name === badge.name)) {
            let index = newArr.findIndex(x => x.name === badge.name)
            newArr.splice(index, 1)
            if (newArr.length === 0) {
                this.setState({
                    activeBadge: [{ name: "All", id: "" }]
                })
            } else {
                this.setState({
                    activeBadge: newArr
                })
            }
        } else if (badge.name === "All") {
            this.setState({
                activeBadge: [{ name: "All", id: "" }]
            })
        } else {
            let index = newArr.findIndex(x => x.name === "All")
            if (index !== -1) {
                newArr.splice(index, 1)
            }
            newArr.push(badge)
            this.setState({
                activeBadge: newArr
            })
        }
        AssetValueFilter({session_id: getCurrentUser().id, email_address: getCurrentUser().email, filter_clicked: badge.name});
       
    }
    handleSelect = (opt) => {
        // console.log("Selected Option ", opt.split(' '))
        const t = opt.split(' ')[1]
        this.setState({
            title: t
        })
    }
    handleSelectYAxis = (opt) =>{
        // console.log(opt)
        const t = opt.split(' ')[1] + " "+ opt.split(' ')[2]
        console.log(t)
        this.setState({
            titleY: t
        })
    }
    render() {
        var UNDEFINED;
        const options = {
            title: {
                text: null
            },
            chart: {
                type: 'column'
            },
            credits: {
                enabled: false
            },
            xAxis: {
                categories: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                labels: {
                    style: {

                    }
                }
            },
            yAxis: {
                title: {
                    text: null
                },
                gridLineDashStyle: 'longdash',
                labels: {
                    formatter: function () {
                        return Highcharts.numberFormat(this.value, -1, UNDEFINED, ',');
                    }
                }
            },
            legend: {
                align: 'right',
                verticalAlign: 'top',
                itemStyle: {
                    fontFamily: "Inter-SemiBold",
                    fontSize: "10px",
                    color: "#636467",
                    fontWeight: "600",
                    lineHeight: "12px"
                }
            },
            tooltip: {
                useHTML: true,
                borderRadius : 8,
                borderColor : "#E5E7EB",
                backgroundColor : "#FFFFFF",
                // borderShadow: 0,
                borderWidth: 1 ,
                padding: 12,
                shadow:false,
                formatter: function () {
                    return `
                        <div class="line-chart-tooltip">
                            <div class="m-b-12 top-section">
                                <div class="inter-display-semi-bold f-s-10 lh-12 grey-B0B m-b-8 header-title">Potential External Factors</div>
                                <div class="m-b-8 line-chart-tooltip-section tooltip-section-blue">
                                    <img src=${TrendingUp} class="m-r-8"/>
                                    <div class="inter-display-medium f-s-12 lh-16 black-191 ">Increased Interests Rates</div>
                                </div>
                                <div class="line-chart-tooltip-section tooltip-section-yellow">
                                    <img src=${TrendingDown} class="m-r-8"/>
                                    <div class="inter-display-medium f-s-12 lh-16 black-191 ">Terra Collapse</div>
                                </div>
                            </div>
                            <div class="bottom-section">
                                <div class="inter-display-semi-bold f-s-10 lh-12 grey-B0B m-b-8 header-title">Internal Factors</div>
                                <div class="inter-display-semi-bold f-s-10 lh-12 grey-313  tooltip-section-bottom" >0.7 BTC was deposited into a Coinbase Wallet</div>
                            </div>

                        </div>

                    `
                    // return `
                    // <div  class="linechart-tooltip">

                    // <div class="m-b-8">
                    // <span class="inter-display-semi-bold f-s-10 lh-12 grey-B0B w-100 header-title">Potential External Factors</span>
                    // </div>

                    // <div class="m-b-8 top-title-1 top-title">
                    // <img src=${TrendingUp} class="m-r-8" />
                    // <span class="inter-display-medium f-s-12 lh-16 black-191 w-100" >
                    // Increased Interests Rates</span>
                    // </div>

                    // <div class="m-b-12 top-title-2 top-title">
                    // <img src=${TrendingDown} class="m-r-8" />
                    // <span class="inter-display-medium f-s-12 lh-16 black-191  w-100" >
                    // Terra Collapse</span>
                    // </div>

                    // <div class="m-b-8 ">
                    // <span class="inter-display-semi-bold f-s-10 lh-12 grey-B0B w-100 header-title">INTERNAL Factors</span>
                    // </div>

                    // <div class="bottom-title">
                    // <span class="inter-display-semi-bold f-s-10 lh-12 grey-313 span-bottom " >0.7 BTC was deposited into a Coinbase Wallet </span>
                    // </div>

                    // </div>`;
                }
            },

            // series: [
            //     {
            //         name: 'Bitcoin',
            //         color: 'rgba(255, 99, 132, 1)',
            //         marker: {
            //             enabled: false,
            //           },
            //           type:'line',
            //         data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
            //     },
            //     {
            //         name: 'Ethereum',
            //         color: 'rgba(54, 162, 235, 1)',
            //         marker: {
            //             enabled: false,
            //           },
            //           type:'line',
            //         data: [216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5],
            //     },
            //     {
            //         name: 'Bitcoin',
            //         y: 68.1,
            //         usd: "222,798",
            //         borderColor: 'rgba(255, 99, 132, 1)',
            //         borderWidth: 2,
            //         color: 'rgba(255, 99, 132, 0.2)',
            //         originalColor: 'rgba(255, 99, 132, 0.2)'
            //     }
            // ]
            series: [
                {
                    name: 'Bitcoin',
                    id: 'Bitcoin',
                    color: 'rgba(255, 99, 132, 1)',
                    data: []
                }, {
                    linkedTo: 'Bitcoin',
                    type: 'line',
                    color: 'rgba(255, 99, 132, 1)',
                    marker: {
                        enabled: false
                    },
                    data: [40000, 35000, 28000, 22000, 24000, 45000, 39000, 42000]
                }
                , {
                    name: 'Ethereum',
                    id: 'Ethereum',
                    color: 'rgba(54, 162, 235, 1)',
                    data: []
                }, {
                    linkedTo: 'Ethereum',
                    type: 'line',
                    color: 'rgba(54, 162, 235, 1)',
                    marker: {
                        enabled: false
                    },
                    data: [10000, 9000, 11000, 6000, 7000, 12000, 13000, 11500]
                }]
        }
        return (
            <div className="welcome-card-section line">
                <div className='line-chart-section'>

                    <GraphHeader
                        title="Asset Value"
                        subtitle="Updated 3mins ago"
                        isArrow={true}
                    />

                    <CoinBadges
                        activeBadge={this.state.activeBadge}
                        chainList={this.props.OnboardingState.coinsList}
                        handleFunction={this.handleFunction}
                        isScrollVisible={this.props.isScrollVisible}
                    />
                    {/* <div className='chart-x-selection'>
                        <select className='inter-display-semi-bold f-s-10 lh-12 grey-7C7 y-axis-selection-currency' >
                            <option className=''> $ USD</option>
                            <option className=''> ₫ VND</option>
                            <option className=''> ₹ INR</option>
                            <option className=''> Rs PKR</option>
                            <option className=''> ₴ UAH</option>
                            <option className=''> Ksh KES</option>

                        </select>
                    </div> */}
                    <div className="chart-y-selection">
                    {/* <DropDown
                        class="line-chart-dropdown-y-axis"
                        list={["$ USD", "₫ VND", "₹ INR", "Rs PKR", "₴ UAH","Ksh KES"]}
                        onSelect={this.handleSelectYAxis}
                        title={this.state.titleY}
                        activetab={this.state.titleY}
                    /> */}
                    <span className="inter-display-semi-bold f-s-10 lh-12 grey-7C7 line-chart-dropdown-y-axis">$ USD</span>
                    </div>
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={options}
                    />
                    <div className='chart-x-selection'>
                        {/* <select className='inter-display-semi-bold f-s-10 lh-12 grey-7C7 x-axis-selection-date'
                         >
                            <option>Year</option>
                            <option selected="selected">Month</option>
                            <option>Day</option>
                            <option>Week</option>
                            <option>Hour</option>
                        </select> */}
                            <DropDown
                                class="line-chart-dropdown"
                                list={["Year", "Month", "Day", "Week", "Hour"]}
                                onSelect={this.handleSelect}
                                title={this.state.title}
                                activetab={this.state.title}
                            />
                    </div>
                </div>
            </div>
        );
    }
}
const mapStateToProps = state => ({
    OnboardingState: state.OnboardingState,
});
export default connect(mapStateToProps)(LineChart);
// export default LineChart;