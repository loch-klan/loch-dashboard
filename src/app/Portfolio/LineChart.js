import BaseReactComponent from "../../utils/form/BaseReactComponent";
// import PropTypes from 'prop-types';
import { connect } from "react-redux";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { GraphHeader } from '../common/GraphHeader'
import CoinBadges from './../common/CoinBadges';
import DropDown from "../common/DropDown";
class LineChart extends BaseReactComponent {
    constructor(props) {
        super(props);
        this.state = {
            activeBadge : [{ name: "All", id: "" }],
            title:"Month"
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
    }
    handleSelect = (opt)=>{
        // console.log("Selected Option ", opt.split(' '))
        const t = opt.split(' ')[1]
        this.setState({
            title:t
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
                itemStyle : {
                    fontFamily:"Inter-SemiBold",
                    fontSize:"10px",
                    color:"#636467",
                    fontWeight:"600" ,
                    lineHeight:"12px"
                }
            },
            tooltip: {
                useHTML: true,
                borderRadius: 8,
                borderColor: "#fffff",
                borderShadow: 0,
                formatter: function () {
                    return `<div style="display: flex;flex-direction:column;">
                    <p style="padding-bottom:1.25rem"><span class="inter-display-semi-bold f-s-10 lh-12 grey-B0B w-100" style="">Potential External Factors</span></p>
                    <p style="padding-bottom:1.25rem"><span class="inter-display-medium f-s-12 lh-16 black-191 w-100" style="background-color: #C6E4FF;padding:4px 8px 4px 8px; border-radius: 4px;">Increased Interests Rates</span><p>
                    <p style="padding-bottom:1.25rem"><span class="inter-display-medium f-s-12 lh-16 black-191 lh-16 w-100" style="background-color: #F5E889;padding:4px 8px 4px 8px; border-radius: 4px;">Terra Collapse</span></p>
                    <p style="padding-bottom:1.25rem"><span class="inter-display-semi-bold f-s-10 lh-12 grey-B0B w-100">INTERNAL Factors</span></p>
                    <p style="padding-bottom:1.25rem"><span class="inter-display-medium f-s-12 lh-16 black-191 w-100" style="background-color: #F5E889;padding:4px 8px 4px 8px; border-radius: 4px;">0.7 BTC was deposited into a Coinbase Wallet </span></p>
                    </div>`;
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
            <div className="welcome-card-section">
                <div className='line-chart-section'>

                    <GraphHeader
                        title="Asset Value"
                        subtitle="Updated 3mins ago"
                    />

                    <CoinBadges
                        activeBadge={this.state.activeBadge}
                        chainList={this.props.OnboardingState.coinsList}
                        handleFunction={this.handleFunction}
                        
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
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={options}
                    />
                    <div className='chart-x-selection'>
                        {/* <select className='inter-display-semi-bold f-s-10 lh-12 grey-7C7 x-axis-selection-date' >
                            <option>Year</option>
                            <option selected="selected">Month</option>
                            <option>Day</option>
                            <option>Week</option>
                            <option>Hour</option>
                        </select> */}

                        <DropDown 
                            class="line-chart-dropdown"  
                            list={["Year","Month","Day","Week","Hour"]}
                            onSelect={this.handleSelect}
                            title={this.state.title}
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