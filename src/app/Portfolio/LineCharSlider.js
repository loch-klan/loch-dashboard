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
import { Image } from "react-bootstrap";
import CalenderIcon from "../../assets/images/calendar.svg";
import DoubleArrow from "../../assets/images/double-arrow.svg";
class LineChartSlider extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      assetValueData: props.assetValueData,
      activeBadge: [{ name: "All", id: "" }],
      activeBadgeList: [],
      title: "Year",
      titleY: "$ USD",
      selectedEvents: null,
      internalEvents: null,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.assetValueData != this.props.assetValueData) {
      let internalEvents = [];
      this.props.assetValueData &&
        this.props.assetValueData.map((assetData) => {
          //  console.log("asset data",assetData);
          if (assetData.events && assetData.events.length > 0) {
            internalEvents.push({
              timestamp: assetData.timestamp,
              event: assetData.events,
            });
          }
        });
      console.log("internal events update", internalEvents);
      this.setState({
        internalEvents,
      });
    
    }
    
  }

  handleFunction = (badge) => {
    let newArr = [...this.state.activeBadge];
    if (this.state.activeBadge.some((e) => e.name === badge.name)) {
      let index = newArr.findIndex((x) => x.name === badge.name);
      newArr.splice(index, 1);
      if (newArr.length === 0) {
        this.setState({
          activeBadge: [{ name: "All", id: "" }],
          activeBadgeList: [],
        });
      } else {
        this.setState({
          activeBadge: newArr,
          activeBadgeList: newArr.map((item) => item.id),
        });
      }
    } else if (badge.name === "All") {
      this.setState({
        activeBadge: [{ name: "All", id: "" }],
        activeBadgeList: [],
      });
    } else {
      let index = newArr.findIndex((x) => x.name === "All");
      if (index !== -1) {
        newArr.splice(index, 1);
      }
      newArr.push(badge);
      this.setState({
        activeBadge: newArr,
        activeBadgeList: newArr.map((item) => item.id),
      });
    }
    AssetValueFilter({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      filter_clicked: badge.name,
    });
  };
  handleSelect = (opt) => {
    const t = opt.split(" ")[1];
    this.setState({
      title: t,
    });
    this.props.handleGroupBy(t);
  };


  InternalEvent = (ctx) => {
    console.log("ctx", ctx);
    console.log("internal events in method", this.state.internalEvents)
   
    let selectedEvents = [];
      this.state.internalEvents &&
        this.state.internalEvents.map((item) => {
          let current = moment(item.timestamp).format("DD/MM/YYYY");
          // console.log("current", current, value);

          if (current === ctx.target.category) {
            selectedEvents.push(item);
          }
        });
    console.log("selected Event", selectedEvents);

    this.setState({
        selectedEvents,
      });
  };
  resetEvent = () => {
    console.log("Event Reset");
    this.setState({
      selectedEvents: null,
    });
  };
  render() {
    const { assetValueData, externalEvents } = this.props;

    const getEvent = this.internalEvent;
    // console.log("externalEvents", externalEvents);
    let series = {};
    let timestampList = [];
    let assetMaster = {};
    // let internalEvents = [];

    assetValueData &&
      assetValueData.map((assetData) => {
        //  console.log("asset data",assetData);
        // if (assetData.events && assetData.events.length > 0) {
        //   internalEvents.push({
        //     timestamp: assetData.timestamp,
        //     event: assetData.events,
        //   });
        // }

        if (
          this.state.activeBadgeList.includes(assetData.chain._id) ||
          this.state.activeBadgeList.length === 0
        ) {
          if (!timestampList.includes(assetData.timestamp)) {
            timestampList.push(assetData.timestamp);
            // series[assetData.timestamp] = {};
          }

          assetData.assets.map((data) => {
            if (data.asset.id in assetMaster) {
              if (assetData.timestamp in assetMaster[data.asset.id]) {
                assetMaster[data.asset.id][assetData.timestamp] =
                  new Number(data.count) * data.asset_price +
                  assetMaster[data.asset.id][assetData.timestamp];
              } else {
                assetMaster[data.asset.id][assetData.timestamp] =
                  new Number(data.count) * data.asset_price;
              }
            } else {
              assetMaster[data.asset.id] = {
                assetDetails: data.asset,
                assetPrice: data.asset_price ? data.asset_price : 0,
                count: new Number(data.count) * data.asset_price,
              };
              assetMaster[data.asset.id][assetData.timestamp] =
                new Number(data.count) * data.asset_price;
            }
          });
        }
      });


    let seriesData = [];
    timestampList.sort((a, b) => {
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
      timestampList.map((timestamp) => {
        if (timestamp in value) {
          graphData.push(value[timestamp]);
        } else {
          graphData.push(0);
        }
      });
      seriesData.push({
        // linkedTo: key,
        name: value.assetDetails.name,
        id: key,
        type: "line",
        color: value.assetDetails.color,
        marker: {
          enabled: true,
          symbol: "circle",
        },
        showInLegend: true,
        data: graphData,
        lastValue: graphData[graphData.length - 1],
      });
    }

    let yaxis_max = 0;
    let max = 0;
    let plotdata;
    for (let i = 0; i < seriesData.length; i++) {
      plotdata = seriesData[i].data;
      max = Math.max(...plotdata);
      if (yaxis_max < max) {
        yaxis_max = max;
      }
    }

    let categories = [];
    let plotLines = [];
    let UniqueEvents = [];
    const generatePlotLines = (abc) => {
      let y_value = 0;
      // console.log("yvalue", y_value);
      externalEvents &&
        externalEvents.map((event, index) => {
          let e_time = moment(event.timestamp).format("DD/MM/YYYY");
          let value = eval(categories.indexOf(abc));
          if (this.state.title == "Month") {
            e_time = moment(event.timestamp).format("MMMM YY");
            value += eval(
              (Number(moment(event.timestamp).format("DD")) / 30).toFixed(3)
            );
          }

          if (this.state.title == "Year") {
            e_time = moment(event.timestamp).format("YYYY");
          }

          if (e_time == abc && !UniqueEvents.includes(abc)) {
            UniqueEvents.push(abc);
            y_value = Math.floor(Math.random() * (23 - 0 + 1) + 0) * 10;

            //add <br> tag every 3 word
            let title = event.title
              .split(" ")
              .map((v, i) => `${i && i % 3 == 0 ? "<br>" : " "}${v}`)
              .join("")
              .trim();

            plotLines.push({
              color: "#E5E5E680",
              dashStyle: "solid",
              value: value,
              width: 2,
              label: {
                useHTML: true,
                formatter: function () {
                  return `<div style="border-left: 2px solid #CACBCC; padding-left: 5px;">${title}</div>`;
                },
                align: "left",
                y: y_value,
                x: 0,
                rotation: 0,
                style: {
                  fontFamily: "Inter-Medium",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#CACBCC",
                },
              },
              zIndex: 1,
            });
          }
        });
    };
    timestampList.map((time) => {
      let dummy = new Date(time);
      // console.log("time", time, "dummy", dummy);
      let abc;
      if (this.state.title === "Week" || this.state.title === "Day") {
        abc = moment(dummy).format("DD/MM/YYYY");
        // console.log("week and day", abc);
        categories.push(abc);
        generatePlotLines(abc);
      }
      if (this.state.title === "Month") {
        // abc = dummy.getMonth()+1;
        // categories.push(Months.getText(abc))

        abc = moment(dummy).format("MMMM YY");
        // console.log("month", abc);
        categories.push(abc);
        generatePlotLines(abc);
      }
      if (this.state.title === "Year") {
        abc = dummy.getFullYear();
        // console.log("year", abc);
        categories.push(abc);
        generatePlotLines(abc);
      }
    });
    // console.log('categories',categories);
    // console.log('timestamp',timestampList);
    // console.log('seriesData',seriesData);
    // console.log('PlotLine',plotLines);

    seriesData =
      seriesData &&
      seriesData.sort((a, b) => {
        return b.lastValue - a.lastValue;
      });
    // console.log('after',seriesData);
    // console.log('categories.length',categories.length);
    seriesData = seriesData.slice(0, 7);
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
        selected: 1,
      },
      scrollbar: {
        enabled: true,
        height: 0,
      },
      xAxis: {
        categories: categories,
        type: "category", // Other types are "logarithmic", "datetime" and "category",
        labels: {
          formatter: function () {
            // console.log("categories", categories);
            // console.log("value", categories[this.pos]);
            // console.log("this", this);
            return categories[this.pos];
          },
        },
        crosshairs: {
          color: "#B0B1B3",
          dashStyle: "solid",
          borderWidth: 1,
        },
        scrollbar: {
          enabled: false,
        },
        min: categories.length > 4 ? categories.length - 5 : 0,
        max: categories.length - 1,
        plotLines: plotLines,
      },

      yAxis: {
        title: {
          text: null,
        },
        opposite: false,
        offset: 70,
        gridLineDashStyle: "longdash",
        labels: {
          formatter: function () {
            return Highcharts.numberFormat(this.value, -1, UNDEFINED, ",");
          },
          x: 0,
          y: 4,
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
        symbolWidth: 8,
        symbolRadius: 6,
      },

      tooltip: {
        shared: true,

        split: false,
        useHTML: true,
        distance: 0,
        borderRadius: 20,
        borderColor: "#E5E5E6",
        backgroundColor: "#FFFFFF",
        borderShadow: 0,
        borderWidth: 1.5,
        padding: 0,
        shadow: false,
        zIndex: 0,

        formatter: function () {
          // console.log("this", this);
          // this.internalEvent(
          //   categories[this.x] == undefined ? this.x : categories[this.x]
          // );
          // getEvent(
          //   categories[this.x] == undefined ? this.x : categories[this.x],
          //   internalEvents
          // );
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

          return `<div class="top-section py-4">
                                <div class="line-chart-tooltip-section tooltip-section-blue w-100" style="background-color:#ffffff; border-left: 1px solid #E5E5E6"; border-right: 1px solid #E5E5E6"; border-radius:40px;">
                                <div class="inter-display-medium f-s-12 w-100 text-center" style="color:#96979A;"><b>${
                                  categories[this.x] == undefined
                                    ? this.x
                                    : categories[this.x]
                                }</b></div><div class="w-100 mt-3" style="height: 1px; background-color: #E5E5E680;"></div> 
                                ${tooltipData
                                  .map((item) => {
                                    return `<div class="inter-display-medium f-s-12 w-100 pt-3 px-4">
                                    <span style='width:8px; height: 8px; border-radius: 50%; background-color:${
                                      item.color == "#ffffff"
                                        ? "#16182B"
                                        : item.color
                                    }; display: inline-block; margin-right: 0.6rem'> </span>
                                       ${item.name} <span style="color:${
                                      item.color == "#ffffff"
                                        ? "#16182B"
                                        : item.color
                                    }"> $${numToCurrency(item.y)}</span>
                                    </div>`;
                                  })
                                  .join(" ")}
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
      plotOptions: {
        series: {
          point: {
            events: {
              mouseOver: this.InternalEvent.bind(this),
            },
          },
        },
      },
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
        xAxis: {
          visible: false,
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
      <div className="welcome-card-section lineChartSlider">
        {this.props.graphLoading ? (
          <Loading />
        ) : (
          <>
            <div
              className="line-chart-section"
              style={{ padding: "0rem 4.8rem" }}
              onMouseLeave={() => {
                this.resetEvent();
              }}
            >
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
                allowChartUpdate={true}
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
            {this.state.selectedEvents && (
              <>
                <div className="ChartDivider"></div>
                <div className="SliderChartBottom">
                  <h4 className="inter-display-semi-bold f-s-16 lh-19 grey-313">
                    <Image src={CalenderIcon} />
                    Internal Events
                  </h4>

                    <div className="InternalEventWrapper">
                      {this.state.selectedEvents && this.state.selectedEvents.map((event) => {
                        console.log("first event", event);
                        event.event.map((eve) => {
                          console.log("second event", eve);
                           <div className="GreyChip">
                             <h5 className="inter-display-bold f-s-13 lh-16 black-191">
                               <Image src={DoubleArrow} />
                               Tranfer
                             </h5>

                             <p className="inter-display-medium f-s-13 lh-16 grey-B4D">
                               {/* 0.01069 ETH or 13.86 USD from “abcd…980” */}
                               {eve.asset.value.toFixed(5)} {eve.asset.code} or
                               {numToCurrency(
                                 eve.asset.value * eve.asset_price
                               )}
                               {eve.from
                                 ? "from " + eve.from || eve.from_address
                                 : "to " + eve.to || eve.to_address}
                               
                               {/* {eve.asset.value.toFixed(5)}+ " " +
                               {eve.asset.code} + " or " +
                               {numToCurrency(
                                 eve.asset.value * eve.asset_price
                               )}{" "}
                               + " USD " +
                               {eve.from
                                 ? "from " + eve.from || eve.from_address
                                 : "to " + eve.to || eve.to_address}
                               ` */}
                             </p>
                           </div>;
                        })
                       
                      } )
                      }
                  </div>
                </div>
              </>
            )}
          </>
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