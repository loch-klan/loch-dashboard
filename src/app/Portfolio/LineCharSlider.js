import BaseReactComponent from "../../utils/form/BaseReactComponent";
// import PropTypes from 'prop-types';
import { connect } from "react-redux";
import Highcharts from "highcharts/highstock";
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
import { numToCurrency } from "../../utils/ReusableFunctions";
class LineChartSlider extends BaseReactComponent {
    constructor(props) {
        super(props);
        this.state = {
          assetValueData: props.assetValueData,
          activeBadge: [{ name: "All", id: "" }],
          activeBadgeList: [],
          title: "Year",
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
              enabled: true,
              // symbol: "circle"
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
      // console.log('timestamp',timestampList);
      // console.log('seriesData',seriesData);

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
        //  seriesData = seriesData;
        var UNDEFINED;
        const options = {
          title: {
            text: null,
          },
          chart: {
            type: "column",
          },
          credits: {
            enabled: false,
          },
          rangeSelector: {
            enabled: false,
            selected: 3,
          },
          scrollbar: {
            enabled: true,
            height: 0,
          },
          xAxis: {
            categories: categories,
            type: "category",// Other types are "logarithmic", "datetime" and "category",
            labels: {
              formatter: function () {
                console.log("categories", categories);
                console.log("value", this.value);
                console.log("this", this);
                return this.value;
              },
            },
            scrollbar: {
              enabled: false,
            },
            min: categories.length > 4 ? categories.length - 5 : 0,
            max: categories.length - 1,
          },

          yAxis: {
            title: {
              text: null,
            },
            opposite: false,

            gridLineDashStyle: "longdash",
            labels: {
              formatter: function () {
                return Highcharts.numberFormat(this.value, -1, UNDEFINED, ",");
              },
              x: 0,
              // y: -2,
              align: "left",
            },
          },
          legend: {
            enabled: true,
            align: "right",
            verticalAlign: "top",
            itemStyle: {
              fontFamily: "Inter-SemiBold",
              fontSize: "10px",
              color: "#636467",
              fontWeight: "600",
              lineHeight: "12px",
            },
            symbolHeight: 15,
            symbolWidth: 15,
            symbolRadius: 8,
          },

          tooltip: {
            shared: true,
            split: false,
            // useHTML: true,
            distance: 0,
            borderRadius: 15,
            borderColor: "#E5E5E6",
            backgroundColor: "#FFFFFF",
            // borderShadow: 0,
            borderWidth: 1,
            paddingTop: 12,
            paddingBottom: 12,
            paddingLeft: 8,
            paddingRight: 8,

            shadow: false,
            formatter: function () {
              let tooltipData = [];
              this.points.map((item) => {
                // console.log(
                //   "Name: ",
                //   item.series.userOptions.name,
                //   "Color: ",
                //   item.series.userOptions.color,
                //   "value y: ",
                //   numToCurrency(item.y),
                //   "value x: ",
                //   item.x
                // );
                tooltipData.push({
                  name: item.series.userOptions.name,
                  x: item.x,
                  y: item.y,
                  color: item.series.userOptions.color,
                });
              });

              return `<div class="line-chart-tooltip">
                            <div class="top-section">
                                <div class="m-b-8 line-chart-tooltip-section tooltip-section-blue">
                                <div class="inter-display-medium f-s-12 lh-16 black-191 "><b>${
                                  // this.x
                                  Highcharts.dateFormat("%A %B %e %Y", this.x)
                                }</b></div>
                                ${tooltipData
                                  .map((item) => {
                                    return `<div class="inter-display-medium f-s-12 lh-16 black-191 ">
                                    <span style='width:5px, height: 5px, border-radius: 50%; background-color:${
                                      item.color == "#ffffff"
                                        ? "black"
                                        : item.color
                                    }'> 1</span> ${
                                      item.name + " $" + numToCurrency(item.y)
                                    }</div></br>`;
                                  })
                                  .join(" ")}
                            </div>
                        </div>
                      </div>`;
            },
            // formatter: function () {
            //   console.log(
            //     "Name: ",
            //     this.point.series.name,
            //     "Color: ",
            //     this.color,
            //     "value: ",
            //     numToCurrency(this.y)
            //   );
            // return
            // `
            //    <div class="line-chart-tooltip">
            //       <div class="top-section">
            //           <div class="line-chart-tooltip-section">
            //               <div class="inter-display-medium f-s-12 lh-16 black-191 ">${
            //                 this.point.series.name
            //               }  <span style="color:${this.color == "#ffffff" ? "" : this.color}"> $${numToCurrency(this.y)}</span>
            //               </div>
            //           </div>
            //       </div>
            //   </div>
            //   `
            // }
            // );
            // },
          },
          series: seriesData,
          navigator: {
            backgroundColor: "rgba(229, 229, 230, 0.5)",
            height: 30,
            outlineColor: "#E5E5E6",
            outlineWidth: 1,
            maskFill: "rgba(25, 25, 26, 0.4)",
            stickToMax: false,
            handles: {
              backgroundColor: "#FFFFFF",
              borderColor: "#B0B1B3",
              lineWidth: 0.5,
              width: 6,
              height: 16,
            },
            series: {
              color: "#E5E5E6",
              lineWidth: 2,
              type: "areaspline",
              fillOpacity: 1,
              lineColor: "#E5E5E6",
              dataGrouping: {
                groupPixelWidth: 0,
              },
              lineWidth: 0,
              marker: {
                enabled: false,
              },
              dataLabels: {
                enabled: false,
              },
            },
          },
        };
        return (
          <div className="welcome-card-section line">
            {this.props.graphLoading ? (
              <Loading />
            ) : (
              <div className="line-chart-section">
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
                  <span className="inter-display-semi-bold f-s-10 lh-12 grey-7C7 line-chart-dropdown-y-axis">
                    $ USD
                  </span>
                </div>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={options}
                  constructorType={"stockChart"}
                />
                <div className="chart-x-selection">
                  <DropDown
                    class="line-chart-dropdown"
                    list={["Year", "Month", "Week", "Day"]}
                    // list={GroupByOptions}
                    onSelect={this.handleSelect}
                    title={this.state.title}
                    activetab={this.state.title}
                  />
                </div>
              </div>
            )}
          </div>
        );
    }
}
const mapStateToProps = state => ({
    OnboardingState: state.OnboardingState,
});
export default connect(mapStateToProps)(LineChartSlider);
// export default LineChartSlider;