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
import { GroupByOptions, Months } from "../../utils/Constant";
class LineChart extends BaseReactComponent {
    constructor(props) {
        super(props);
        this.state = {
          assetValueData: props.assetValueData,
          activeBadge: [{ name: "All", id: "" }],
          activeBadgeList: [],
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
                    activeBadge: [{ name: "All", id: "" }],
                    activeBadgeList: []
                })
            } else {
                this.setState({
                    activeBadge: newArr,
                    activeBadgeList: newArr.map((item)=>item.id)
                })
            }
        } else if (badge.name === "All") {
            this.setState({
                activeBadge: [{ name: "All", id: "" }],
                activeBadgeList: []
            })
        } else {
            let index = newArr.findIndex(x => x.name === "All")
            if (index !== -1) {
                newArr.splice(index, 1)
            }
            newArr.push(badge)
            this.setState({
                activeBadge: newArr,
                activeBadgeList: newArr.map((item)=>item.id)
            })
        }
    }
    handleSelect = (opt) => {
        const t = opt.split(' ')[1]
        this.setState({
            title: t
        })
        this.props.handleGroupBy(t);
    }
    render() {
      const {assetValueData} = this.props;
      // console.log('assetValueData',assetValueData);
      let series = {};
      let timestampList = [];
      let assetMaster = {};
      assetValueData && assetValueData.map((assetData)=>{
        if(this.state.activeBadgeList.includes(assetData.chain._id) || this.state.activeBadgeList.length === 0){
          if(!timestampList.includes(assetData.timestamp)){
            timestampList.push(assetData.timestamp)
            // series[assetData.timestamp] = {};
          }

          assetData.assets.map((data)=>{
            if(data.asset.id in assetMaster){
              if(assetData.timestamp in assetMaster[data.asset.id]){
                assetMaster[data.asset.id][assetData.timestamp] = (new Number(data.count) * data.asset_price) + assetMaster[data.asset.id][assetData.timestamp]
              } else{
                assetMaster[data.asset.id][assetData.timestamp] = new Number(data.count) * data.asset_price
              }
            } else{
              assetMaster[data.asset.id] = {
                assetDetails: data.asset,
                assetPrice : data.asset_price ? data.asset_price : 0,
                count : new Number(data.count) * data.asset_price
              }
              assetMaster[data.asset.id][assetData.timestamp] = new Number(data.count) * data.asset_price
            }
          })
        }

      })
      let seriesData = [];
      timestampList.sort((a, b) =>{
        return a - b;
      });
      for (const [key, value] of Object.entries(assetMaster)) {
        seriesData.push({
          name: value.assetDetails.name,
          id: key,
          color: value.assetDetails.color,
          data: []
        })
        let graphData = [];
        timestampList.map((timestamp)=>{
          if(timestamp in value){
            graphData.push(value[timestamp]);
          } else{
            graphData.push(0);
          }
        })
        seriesData.push({
            linkedTo: key,
            type: 'line',
            color: value.assetDetails.color,
            marker: {
              enabled: false
            },
            data: graphData
        })
      }
      let categories = [];
      timestampList.map((time)=> {
        let dummy = new Date(time)
        let abc;
        if(this.state.title === 'Week' || this.state.title === 'Day'){
          abc = dummy.getDate()
          categories.push(abc)
        }
        if(this.state.title === 'Month'){
          abc = dummy.getMonth()+1;
          categories.push(Months.getText(abc))
        }
        if(this.state.title === 'Year'){
          abc = dummy.getFullYear();
          categories.push(abc);
        }
      })
      console.log('categories',categories);
      console.log('timestamp',timestampList);
      console.log('seriesData',seriesData);

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
              min: categories.length,
            max:5,
            navigator: { enabled: true },
            scrollbar: { enabled: true },
                categories: categories,
                // labels: {
                //     style: {
                //     }
                // }
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
            plotOptions: {
              series: {
                  events: {
                      legendItemClick: function() {
                        return false;
                      }
                  }
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
                  // console.log('this',this);
                    return `
                        <div class="line-chart-tooltip">
                            <div class="m-b-12 top-section">
                                <div class="m-b-8 line-chart-tooltip-section tooltip-section-blue">
                                    <img src=${TrendingUp} class="m-r-8"/>
                                    <div class="inter-display-medium f-s-12 lh-16 black-191 ">${this.x + " - " + this.y}</div>
                                </div>
                            </div>
                        </div>

                    `
                }
            },
            series: seriesData,
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
                    <div className="chart-y-selection">
                    <span className="inter-display-semi-bold f-s-10 lh-12 grey-7C7 line-chart-dropdown-y-axis">$ USD</span>
                    </div>
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={options}
                    />
                    <div className='chart-x-selection'>
                            <DropDown
                                class="line-chart-dropdown"
                                list={["Year", "Month", "Day", "Week"]}
                                // list={GroupByOptions}
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