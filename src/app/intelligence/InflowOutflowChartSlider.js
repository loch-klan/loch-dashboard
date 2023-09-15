import moment from "moment";
import { connect } from "react-redux";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

import {
  IntlAssetValueDay,
  IntlAssetValueYear,
  IntlAssetValueMonth,
} from "../../utils/AnalyticsFunctions.js";
import Loading from "../common/Loading";
import GraphLogo from "../../assets/images/graph-logo.svg";
import handle from "../../assets/images/handle.svg";
import { GraphHeader } from "../common/GraphHeader";
import { getCurrentUser } from "../../utils/ManageToken";
import { BarGraphFooter } from "../common/BarGraphFooter";
import {
  CurrencyType,
  noExponents,
  numToCurrency,
} from "../../utils/ReusableFunctions";
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import {
  AssetChartInflowIcon,
  AssetChartOutflowIcon,
} from "../../assets/images/icons/index.js";

require("highcharts/modules/annotations")(Highcharts);

class InflowOutflowChartSlider extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      currency: JSON.parse(localStorage.getItem("currency")),
      inflowOutflowData: [],
      inflowOutflowLineData: [],
      buySellList: [],
      plotLineHide: 0,
      steps: 1,
      xAxisNames: [],
      title: "week",
    };
  }
  componentDidMount() {
    if (this.props.inflowOutflowData) {
      this.setState({
        inflowOutflowData: this.props.inflowOutflowData,
      });
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.inflowOutflowData !== this.props.inflowOutflowData) {
      this.setState({
        inflowOutflowData: this.props.inflowOutflowData,
      });
    }
    if (prevState.inflowOutflowData !== this.state.inflowOutflowData) {
      const tempAnnotationArr = [];
      this.state.inflowOutflowData.forEach((curPoint, index) => {
        let tempHolder = {
          point: {
            xAxis: 0,
            yAxis: 0,
            x: index,
            y: curPoint.price,
          },
          useHTML: true,
          formatter: function () {
            const receivedVal = curPoint.received_value;
            const sendVal = curPoint.send_value;

            if (receivedVal > 0) {
              return `<div class="inflowOutflowChartAnnotationContainer">
                <img class="inflowOutflowChartAnnotation" src="${AssetChartInflowIcon}" />
                <div class="inflowOutflowChartAnnotationBox top-section py-4" style="background-color:#ffffff; border: 1px solid #E5E5E6; border-radius:10px;box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.04);
                backdrop-filter: blur(15px);">
                  <div class="line-chart-tooltip-section tooltip-section-blue w-100" style="background-color:#ffffff;">
                    <div class="inter-display-medium f-s-12 w-100 text-center px-4" style="color:#96979A; display:flex; justify-content:space-between"><b>13 March 22</b> <b class="inter-display-semi-bold m-l-10" style="color:#16182B;">$200</b></div><div class="w-100 mt-3" style="height: 1px; background-color: #E5E5E680;"></div>
                    <div class="inter-display-medium f-s-13 w-100 pt-3 px-4" style="display:flex; justify-content:space-between" >
                    <div>
                      <img style='width:20px; height: 20px; display: inline-block; margin-right: 0.6rem' src="${AssetChartInflowIcon}" />
                      Inflow
                    </div>
                    <div style="color:#16182B">$5</div>
                    </div>
                  </div>
                </div>`;
            } else if (sendVal > 0) {
              return `<div class="inflowOutflowChartAnnotationContainer">
                <img class="inflowOutflowChartAnnotation" src="${AssetChartOutflowIcon}" />
                <div class="inflowOutflowChartAnnotationBox top-section py-4" style="background-color:#ffffff; border: 1px solid #E5E5E6; border-radius:10px;box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.04);
                backdrop-filter: blur(15px);">
                  <div class="line-chart-tooltip-section tooltip-section-blue w-100" style="background-color:#ffffff;">
                    <div class="inter-display-medium f-s-12 w-100 text-center px-4" style="color:#96979A; display:flex; justify-content:space-between"><b>13 March 22</b> <b class="inter-display-semi-bold m-l-10" style="color:#16182B;">$200</b></div><div class="w-100 mt-3" style="height: 1px; background-color: #E5E5E680;"></div>
                    <div class="inter-display-medium f-s-13 w-100 pt-3 px-4" style="display:flex; justify-content:space-between" >
                    <div>
                      <img style='width:20px; height: 20px; display: inline-block; margin-right: 0.6rem' src="${AssetChartOutflowIcon}" />
                      Inflow
                    </div>
                    <div style="color:#16182B">$5</div>
                    </div>
                  </div>
                </div>`;
            }
            return "";
          },
          backgroundColor: "transparent",
          borderColor: "transparent",
          className: "highcharts-no-tooltip",
          x: 0,
          y: 0,
          padding: 0,
          shape: "rect",
          verticalAlign: "bottom",
        };
        tempAnnotationArr.push(tempHolder);
      });
      this.setState({
        buySellList: tempAnnotationArr,
      });
      const myData = this.state.inflowOutflowData.map(
        (resData) => resData.price
      );
      let myCustomXaxis = [];
      if (this.state.title === "week") {
        myCustomXaxis = this.state.inflowOutflowData.map((resData) =>
          moment(resData.timestamp).format("DD/MM/YY")
        );
      } else if (
        this.state.title === "onemonth" ||
        this.state.title === "sixmonths"
      ) {
        myCustomXaxis = this.state.inflowOutflowData.map((resData) =>
          moment(resData.timestamp).format("MMMM YYYY")
        );
      }
      this.setState({
        xAxisNames: myCustomXaxis,
      });
      this.setState({
        inflowOutflowLineData: myData,
      });
    }
  }

  handleSelect = (opt) => {
    let tempTitle = "week";
    if (opt.target.id === 0 || opt.target.id === "0") {
      tempTitle = "max";
    } else if (opt.target.id === 1 || opt.target.id === "1") {
      tempTitle = "fiveyears";
    } else if (opt.target.id === 2 || opt.target.id === "2") {
      tempTitle = "oneyear";
    } else if (opt.target.id === 3 || opt.target.id === "3") {
      tempTitle = "sixmonths";
    } else if (opt.target.id === 4 || opt.target.id === "4") {
      tempTitle = "onemonth";
    } else {
      tempTitle = "week";
    }
    this.setState({
      title: tempTitle,
      steps: 1,
      rangeSelected: 1,
    });
    this.props.handleGroupBy(tempTitle);
  };
  render() {
    let parent = this;
    let amountOfItems = 0;
    if (this.state.inflowOutflowLineData.length > 0) {
      amountOfItems = this.state.inflowOutflowLineData.length;
    }
    const options = {
      title: {
        text: null,
      },
      chart: {
        type: "area",
        spacingTop: this.props.hideTimeFilter ? 40 : 10,
        events: {
          load: function () {
            // Get the renderer
            const renderer = this.renderer;
            const chartWidth = this.chartWidth;
            const chartHeight = this.chartHeight;
            const imageWidth = 104; // Set the width of the image
            const imageHeight = 39; // Set the height of the image
            const x = (chartWidth - imageWidth) / 2;
            const y = (chartHeight - imageHeight) / 2.5;

            renderer
              .image(GraphLogo, x, y, imageWidth, imageHeight)
              .attr({
                zIndex: 99,
              })
              .add();
          },
        },
        zoomType: "x",
      },
      credits: {
        enabled: false,
      },
      rangeSelector: {
        enabled: false,
        selected: parent.state.rangeSelected,
      },
      scrollbar: {
        enabled: true,
        height: 6,
        barBackgroundColor: "transparent",
        barBorderRadius: 4,
        barBorderWidth: 0,
        trackBackgroundColor: "transparent",
        trackBorderWidth: 0,
        trackBorderRadius: 10,
        trackBorderColor: "transparent",
        rifleColor: "transparent",
        margin: 150,
      },
      xAxis: {
        events: {
          setExtremes(e) {
            let diff = Math.round(e.max - e.min);
            if (parent.props.hideTimeFilter) {
            } else {
              if (diff >= 9 && diff < 11 && parent.state.plotLineHide !== 1) {
                parent.setState({
                  plotLineHide: 1,
                });
              } else {
                if (diff < 9 && parent.state.plotLineHide !== 0) {
                  parent.setState({
                    plotLineHide: 0,
                  });
                }
              }
              if (diff <= 11 && parent.state.steps !== 1) {
                parent.setState({
                  steps: 1,
                });
              } else {
                if (diff > 20 && parent.state.steps !== 3) {
                  parent.setState({
                    steps: 3,
                  });
                }
              }
            }
          },
        },

        // categories: categories,
        type: "category", // Other types are "logarithmic", "datetime" and "category",
        // labels: {
        //   formatter: function () {
        //     // console.log("categories", categories);
        //     // console.log("value", categories[this.pos]);
        //     // console.log("this", this);
        //     return parent.state.title === "Day" &&
        //       categories[this.pos] !== undefined
        //       ? moment(categories[this.pos], "DD/MM/YYYY").format("MM/DD/YY")
        //       : categories[this.pos];
        //   },
        //   autoRotation: false,
        //   step: parent.state.steps,
        //   // autoRotationLimit: 0,
        //   // style: {
        //   //   whiteSpace: "nowrap",
        //   //   textOverflow: "none",
        //   // },
        // },
        crosshair: {
          width: 1,
          color: "#B0B1B3",
          dashStyle: "Dash",
          cursor: "pointer",
        },
        scrollbar: {
          // enabled: this.props.hideTimeFilter ? false : true,
          enabled: true,
          height: 6,
          barBackgroundColor: "#19191A33",
          barBorderRadius: 4,
          barBorderWidth: 0,
          trackBackgroundColor: "transparent",
          trackBorderWidth: 0,
          trackBorderRadius: 10,
          trackBorderColor: "#19191A33",
          rifleColor: "transparent",
          margin: 20,
          minWidth: 0,
        },
        // min: 50,
        // max: 55,
        // plotLines: plotLines,
        // plotLines: updatedPlotLine,
      },
      yAxis: {
        title: {
          text: null,
        },
        showLastLabel: true,
        opposite: false,
        offset: this.props.hideTimeFilter ? 20 : 40,
        gridLineDashStyle: "longdash",
        stackLabels: {
          enabled: false,
        },
        labels: {
          formatter: function () {
            // return Highcharts.numberFormat(this.value, -1, UNDEFINED, ",");
            let val = Number(noExponents(this.value).toLocaleString("en-US"));
            return CurrencyType(false) + numToCurrency(val);
          },
          x: 0,
          y: 4,
          align: "right",
          style: {
            fontSize: 12,
            fontFamily: "Inter-Regular",
            fontWeight: 400,
            color: "#B0B1B3",
          },
        },
      },

      tooltip: {
        shared: true,
        split: false,
        useHTML: true,
        distance: 20,
        borderRadius: 10,
        borderColor: "tranparent",
        backgroundColor: null,
        outside: true,
        borderShadow: 0,
        padding: 0,
        shadow: false,
        hideDelay: 0,

        formatter: function () {
          if (
            parent.state.inflowOutflowData &&
            parent.state.inflowOutflowData.length > 0 &&
            this.x < parent.state.inflowOutflowData.length
          ) {
            const curItem = parent.state.inflowOutflowData[this.x];
            const dateTitle = moment(curItem.timestamp).format("DD MMMM YYYY");
            if (curItem.received_value > 0) {
              return `
              <div class="top-section py-4" style="background-color:#ffffff; border: 1px solid #E5E5E6; border-radius:10px;box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.04);
                backdrop-filter: blur(15px);">
                <div class="line-chart-tooltip-section tooltip-section-blue w-100" style="background-color:#ffffff;">
                    <div class="inter-display-medium f-s-12 w-100 text-center px-4" style="color:#96979A; display:flex; justify-content:space-between"><b>${dateTitle}</b> <b class="inter-display-semi-bold m-l-10" style="color:#16182B;">${CurrencyType(
                false
              )}${numToCurrency(curItem.price)}</b>
                    </div>
                    <div class="w-100 mt-3" style="height: 1px; background-color: #E5E5E680;"></div>
                    <div style="display:flex; align-items:center; justify-content:space-between;" class="inter-display-medium f-s-13 w-100 pt-3 px-4">
                    <div>
                    <div style="display:flex; align-items:center; justify-content:center;" >
                    <img src=${AssetChartInflowIcon} style='width:15px; height: 15px; display: inline-block; margin-right: 0.3rem'> </img>
                    <div>Inflow</div>
                    </div>
                    </div>
                    <div>
                    <span style="color:${"#16182B"}"> ${CurrencyType(
                false
              )}${numToCurrency(curItem.received_value)}</span>
                    </div>
                    </div>
                </div>
              </div>
              `;
            } else if (curItem.send_value > 0) {
              return `
              <div class="top-section py-4" style="background-color:#ffffff; border: 1px solid #E5E5E6; border-radius:10px;box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.04);
                backdrop-filter: blur(15px);">
                <div class="line-chart-tooltip-section tooltip-section-blue w-100" style="background-color:#ffffff;">
                    <div class="inter-display-medium f-s-12 w-100 text-center px-4" style="color:#96979A; display:flex; justify-content:space-between"><b>${dateTitle}</b> <b class="inter-display-semi-bold m-l-10" style="color:#16182B;">${CurrencyType(
                false
              )}${numToCurrency(curItem.price)}</b>
                    </div>
                    <div class="w-100 mt-3" style="height: 1px; background-color: #E5E5E680;"></div>
                    <div style="display:flex; align-items:center; justify-content:space-between;" class="inter-display-medium f-s-13 w-100 pt-3 px-4">
                    <div>
                    <div style="display:flex; align-items:center; justify-content:center;" >
                    <img src=${AssetChartOutflowIcon} style='width:15px; height: 15px; display: inline-block; margin-right: 0.3rem'> </img>
                    <div>Outflow</div>
                    </div>
                    </div>
                    <div>
                    <span style="color:${"#16182B"}"> ${CurrencyType(
                false
              )}${numToCurrency(curItem.send_value)}</span>
                    </div>
                    </div>
                </div>
              </div>
              `;
            }
            return "";
          }

          return "";
        },
      },
      series: [
        {
          name: "Ethereum",
          data: this.state.inflowOutflowLineData,
          type: "area",
          fillOpacity: 0.1,
          color: "#5ABE7E",
        },
      ],
      annotations: [
        {
          draggable: "",
          labels: this.state.buySellList,
        },
      ],
      plotOptions: {
        series: {
          stacking: "normal",
          cursor: "pointer",
          fillOpacity: 0,
          marker: {
            enabled: false,
            states: {
              hover: {
                enabled: false,
              },
            },
          },
        },
      },
      navigator: {
        margin: 1,
        height: 30,
        outlineColor: "#E5E5E6",
        outlineWidth: 0,
        maskFill: "rgba(25, 25, 26, 0.4)",
        stickToMax: false,
        handles: {
          lineWidth: 0,
          width: 7,
          height: 16,
          symbols: [`url(${handle})`, `url(${handle})`],
        },
        xAxis: {
          visible: true,
          labels: {
            enabled: false,
          },
          gridLineWidth: 0,
          plotBands: [
            {
              from: -100,
              to: 10000,
              color: "rgba(229, 229, 230, 0.5)",
            },
          ],
        },
        series: {
          color: "#B0B1B3",
          lineWidth: 2,
          type: "areaspline",
          fillOpacity: 1,
          lineColor: "#B0B1B3",
          dataGrouping: {
            groupPixelWidth: 0,
          },
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
        <>
          <div
            className="line-chart-section"
            style={{
              padding: "0rem 4.8rem",
            }}
          >
            {!this.props.isPage && (
              <GraphHeader
                title="Asset value"
                subtitle="Analyze your portfolio value over time"
                isArrow={true}
                isAnalytics="Asset Value"
                handleClick={this.props.handleClick}
              />
            )}

            {this.props.graphLoading ? (
              <div
                style={{
                  height: "30rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Loading />
              </div>
            ) : (
              <>
                {!this.props.hideTimeFilter && (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "2rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <BarGraphFooter
                          handleFooterClick={this.handleSelect}
                          active={this.state.title}
                          footerLabels={[
                            "Max",
                            "5 Years",
                            "1 Year",
                            "6 Months",
                            "1 Month",
                            "1 Week",
                          ]}
                          lineChart={true}
                        />
                      </div>
                    </div>
                  </>
                )}
                <div
                  className="chart-y-selection"
                  style={
                    this.props.hideTimeFilter
                      ? { width: "100%", marginTop: "0.5rem" }
                      : { width: "100%" }
                  }
                >
                  <span className="inter-display-semi-bold f-s-10 lh-12 grey-7C7 line-chart-dropdown-y-axis">
                    {CurrencyType()}
                  </span>
                </div>

                <HighchartsReact
                  highcharts={Highcharts}
                  options={options}
                  constructorType={"stockChart"}
                />
              </>
            )}
          </div>
        </>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  OnboardingState: state.OnboardingState,
});
export default connect(mapStateToProps)(InflowOutflowChartSlider);
