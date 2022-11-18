import BaseReactComponent from "../../utils/form/BaseReactComponent";
// import PropTypes from 'prop-types';
import { connect } from "react-redux";
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { GraphHeader } from '../common/GraphHeader'
import CoinBadges from './../common/CoinBadges';
import DropDown from "../common/DropDown";
import TrendingUp from '../../assets/images/icons/TrendingUp.svg'
import TrendingDown from '../../assets/images/icons/TrendingDown.svg'
import { GroupByOptions, Months } from "../../utils/Constant";
import { AssetValueFilter } from "../../utils/AnalyticsFunctions.js";
import { getCurrentUser } from "../../utils/ManageToken";
import moment from "moment";
import Loading from "../common/Loading";
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
        AssetValueFilter({session_id: getCurrentUser().id, email_address: getCurrentUser().email, filter_clicked: badge.name});

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
        // seriesData.push({
        //   name: value.assetDetails.name,
        //   id: key,
        //   color: value.assetDetails.color,
        //   data: []
        // })
        let graphData = [];
        timestampList.map((timestamp)=>{
          if(timestamp in value){
            graphData.push(value[timestamp]);
          } else{
            graphData.push(0);
          }
        })
        seriesData.push({
            // linkedTo: key,
              name: value.assetDetails.name,
          id: key,
            type: 'line',
            color: value.assetDetails.color,
            marker: {
              // enabled: false
              symbol:"circle"
            },
            data: graphData,
            lastValue: graphData[graphData.length-1]
        })
      }
      let categories = [];
      timestampList.map((time)=> {
        let dummy = new Date(time)
        let abc;
        if(this.state.title === 'Week' || this.state.title === 'Day'){
          abc = moment(dummy).format("DD/MM/YYYY")
          categories.push(abc)
        }
        if(this.state.title === 'Month'){
          // abc = dummy.getMonth()+1;
          // categories.push(Months.getText(abc))
          abc = moment(dummy).format("MMMM YY")
          categories.push(abc)
        }
        if(this.state.title === 'Year'){
          abc = dummy.getFullYear();
          categories.push(abc);
        }
      })
      console.log('categories',categories);
      console.log('timestamp',timestampList);
      console.log('seriesData',seriesData);

      let yaxis_max=0;
      let max=0;
      let plotdata;
      for (let i = 0; i < seriesData.length; i++) {
        plotdata = seriesData[i].data;
        max = Math.max(...plotdata);
        if(yaxis_max < max){
          yaxis_max=max;
        }
      }
      seriesData = seriesData && seriesData.sort((a,b)=>{return b.lastValue - a.lastValue})
      // console.log('after',seriesData);
      // console.log('categories.length',categories.length);
      seriesData = seriesData.slice(0,7);
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
                categories: categories,
                scrollbar: {
                  enabled: true,
                  height:6,
                  barBackgroundColor: "#E5E5E6",
                  barBorderRadius: 4,
                  barBorderWidth: 0,
                  trackBackgroundColor: 'transparent',
                  trackBorderWidth: 0,
                  trackBorderRadius: 10,
                  trackBorderColor: '#CCC',
                  rifleColor:'#E5E5E6',
              },
              min: 0,
              max: this.state.title === "Year" ? categories.length > 4 ? 4 : categories.length - 1 : 4,
            },

            yAxis: {
                title: {
                    text: null
                },
              // min: 0,
              // max: yaxis_max,
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
                },
                symbolHeight: 15,
                symbolWidth: 8,
                symbolRadius: 6,
            },
          //   plotOptions: {
          //     series: {
          //         events: {
          //             legendItemClick: function() {
          //               return false;
          //             }
          //         }
          //     }
          // },
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
                                    <div class="inter-display-medium f-s-12 lh-16 black-191 ">${this.x + " - " + this.y?.toFixed(2)}</div>
                                </div>
                            </div>
                        </div>

                    `
                }
            },
            series: seriesData
        }
        return (
            <div className="welcome-card-section line">
              {
                this.props.graphLoading
                ?
                <Loading />
                :
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
              }

            </div>
        );
    }
}
const mapStateToProps = state => ({
    OnboardingState: state.OnboardingState,
});
export default connect(mapStateToProps)(LineChart);
// export default LineChart;