import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import moment from "moment";
import {
  BackTestGraphHandleIcon,
  GraphLogoDark,
} from "../../../../assets/images";
import { BaseReactComponent } from "../../../../utils/form";
import {
  amountFormat,
  CurrencyType,
  mobileCheck,
} from "../../../../utils/ReusableFunctions";
import Loading from "../../../common/Loading";
import "./_backTestChart.scss";

require("highcharts/modules/annotations")(Highcharts);

class BackTestChart extends BaseReactComponent {
  constructor(props) {
    super(props);

    this.state = {
      isMobile: mobileCheck(),
      todayDate: new Date(),
    };
  }
  graphContainerSetting = {
    style: { height: "40rem" },
  };
  render() {
    let parent = this;
    return (
      <>
        <div className="btpcb-title btpcb-chart-header">
          <div>Performance Visualization</div>

          {/* <div
            className={`btpcb-chart-dropdown ${
              this.props.performanceVisualizationGraphLoading
                ? "btpcb-chart-dropdown-hidden"
                : ""
            }`}
          >
            <CustomDropdown
              placeholderName="Strategy"
              filtername="Strategies selected"
              options={this.props.strategiesOptions}
              selectedTokens={this.props.selectedStrategiesOptions}
              handleClick={this.props.selectStrategies}
              singleSelectedItemName="Strategy"
              multipleSelectedItemName="Strategies"
            />
          </div> */}
        </div>
        {this.props.performanceVisualizationGraphLoading ? (
          <div className="btpcb-right-chart-container">
            <div className="btpcb-right-chart-container-loader">
              <Loading />
            </div>
          </div>
        ) : (
          <div className="btpcb-right-chart-container">
            {/* <div className="btpcb-chart-dropdown-container">
            <div />
            <div class="btpcb-chart-time-range ">
            <div
              id="0"
              class="inter-display-medium f-s-13 lh-16 time-no-cal-badge time-no-cal-badge-no-left"
            >
              From
            </div>
            <div
              id="1"
              class="inter-display-medium f-s-13 lh-16 time-cal-badge"
            >
              <OutsideClickHandler onOutsideClick={this.props.hideFromCalendar}>
                <div className="btpcb-chart-calendar-Container">
                  <div
                    className="btpcb-chart-calendar-Text"
                    onClick={this.props.showFromCalendar}
                  >
                    {this.props.fromDate
                      ? moment(this.props.fromDate).format("D MMM YYYY")
                      : ""}
                  </div>
                  {this.props.isFromCalendar ? (
                    <div className="intelligenceCalendar">
                      <Calendar
                        date={this.props.fromDate}
                        className={
                          "calendar-select inter-display-medium f-s-13 lh-16"
                        }
                        onChange={this.props.changeFromDate}
                        maxDate={this.props.toDate}
                        defaultValue={this.props.fromDate}
                      />
                    </div>
                  ) : null}
                </div>
              </OutsideClickHandler>
            </div>
            <div
              id="2"
              class="inter-display-medium f-s-13 lh-16 time-no-cal-badge"
            >
              To
            </div>
            <div
              id="3"
              class="inter-display-medium f-s-13 lh-16 time-cal-badge"
            >
              <OutsideClickHandler onOutsideClick={this.props.hideToCalendar}>
                <div className="btpcb-chart-calendar-Container">
                  <div
                    className="btpcb-chart-calendar-Text"
                    onClick={this.props.showToCalendar}
                  >
                    {this.props.toDate
                      ? moment(this.props.toDate).format("D MMM YYYY")
                      : ""}
                  </div>
                  {this.props.isToCalendar ? (
                    <div className="intelligenceCalendar">
                      <Calendar
                        date={this.props.toDate}
                        className={
                          "calendar-select inter-display-medium f-s-13 lh-16"
                        }
                        onChange={this.props.changeToDate}
                        minDate={this.props.fromDate}
                        maxDate={this.state.todayDate}
                        defaultValue={this.props.toDate}
                      />
                    </div>
                  ) : null}
                </div>
              </OutsideClickHandler>
            </div>
            </div>
            <div className="btpcb-chart-dropdown">
              <CustomDropdown
                placeholderName="Strategy"
                filtername="Strategies selected"
                options={this.props.strategiesOptions}
                selectedTokens={this.props.selectedStrategiesOptions}
                handleClick={this.props.selectStrategies}
                singleSelectedItemName="Strategy"
                multipleSelectedItemName="Strategies"
              />
            </div>
          </div> */}

            <div
              style={{
                zoom: this.state.isMobile ? "" : "1.176",
              }}
            >
              <HighchartsReact
                containerProps={this.graphContainerSetting}
                highcharts={Highcharts}
                constructorType={"stockChart"}
                options={{
                  legend: {
                    enabled: true,
                    verticalAlign: "bottom",
                    itemStyle: {
                      color: "var(--primaryTextColor)",
                      textTransform: "uppercase",
                    },
                  },
                  title: {
                    text: null,
                  },
                  tooltip: {
                    // shared: true,
                    split: true,
                    useHTML: true,
                    // distance: 20,
                    borderRadius: 9,
                    // borderColor: "",
                    backgroundColor: "var(--cardBackgroud)",
                    // outside: true,
                    // borderShadow: 0,
                    borderWidth: 1.5,
                    shadow: {
                      opacity: 0.05,
                    },
                    // hideDelay: 0,

                    formatter: function () {
                      const tempHolder = this.points.map(
                        (point, pointIndex) => {
                          let itemTitle = "";
                          let itemColor = "";
                          let itemAmount = "";
                          if (point.series && point.series.userOptions) {
                            itemTitle = point.series.userOptions.name;
                            itemColor = point.series.userOptions.color;

                            if (
                              point.series.userOptions.data &&
                              point.series.userOptions.data[
                                point.point.index
                              ] &&
                              point.series.userOptions.data[
                                point.point.index
                              ][2]
                            ) {
                              itemAmount =
                                point.series.userOptions.data[
                                  point.point.index
                                ][2];
                            }

                            itemTitle = itemTitle.toUpperCase();
                          }
                          return `<div class="back-test-chart-tool-tip">
                              <div>${itemTitle}</div>
                              <div>${point.y}%</div>
                              <div class="back-test-chart-tool-tip-amount">${
                                CurrencyType(false) +
                                amountFormat(itemAmount, "en-US", "USD")
                              }</div>
                            </div>`;
                        }
                      );

                      if (tempHolder) {
                        return [
                          `<div class="back-test-chart-tool-tip">
                              <div>${moment(this.x).format("DD MMM YYYY")}</div>
                            </div>`,
                          ...tempHolder,
                        ];
                      }
                      return "";
                    },
                    style: {
                      zIndex: 100,
                    },
                  },
                  chart: {
                    marginTop: -10,
                    // marginBottom: 0,
                    marginLeft: 5,
                    marginRight: 5,
                    spacingTop: -30,
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
                          .image(GraphLogoDark, x, y, imageWidth, imageHeight)
                          .attr({
                            zIndex: 2,
                            class: "watermark-opacity",
                          })
                          .add();
                        const chart = this;
                        let startIndex = 0;
                        let endIndex = 0;

                        if (
                          parent &&
                          parent.props &&
                          parent.props.performanceVisualizationGraphData &&
                          parent.props.performanceVisualizationGraphData[0] &&
                          parent.props.performanceVisualizationGraphData[0]
                            .data &&
                          parent.props.performanceVisualizationGraphData[0].data
                            .length > 9
                        ) {
                          if (
                            parent.props.performanceVisualizationGraphData[0]
                              .data[0]
                          ) {
                            startIndex =
                              parent.props.performanceVisualizationGraphData[0]
                                .data[0][0];
                          }
                          if (
                            parent.props.performanceVisualizationGraphData[0]
                              .data[9]
                          ) {
                            endIndex =
                              parent.props.performanceVisualizationGraphData[0]
                                .data[9][0];
                          }
                        }
                        chart.xAxis[0].setExtremes(startIndex, endIndex);
                      },
                    },
                    zoomType: "x",
                    style: {
                      fontFamily: "Inter-Medium, Arial, Helvetica, sans-serif",
                      fontSize: "12px",
                    },
                  },
                  credits: {
                    enabled: false,
                  },

                  scrollbar: {
                    enabled: true,
                    height: 0,
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
                  series: this.props.performanceVisualizationGraphData
                    ? this.props.performanceVisualizationGraphData
                    : [],
                  yAxis: {
                    opposite: false,
                    gridLineColor: "#E5E5E6",
                    gridLineWidth: 1,
                    tickAmount: 8,
                    labels: {
                      enabled: false,
                    },
                  },

                  xAxis: {
                    tickAmount: 8,
                    lineWidth: 0,
                    gridLineColor: "#E5E5E6",
                    gridLineWidth: 1,
                    labels: {
                      formatter: function () {
                        return `<div class="back-test-chart-xaxis-lable">${moment(
                          this.value
                        ).format("MMM YY")}</div>`;
                      },
                    },
                  },
                  navigator: {
                    margin: 10,
                    height: 25,
                    outlineColor: "#B3B4B7",
                    outlineWidth: 1,
                    maskFill: "#CACBCC80",
                    stickToMax: false,

                    handles: {
                      lineWidth: 0,
                      width: 7,
                      height: 16,
                      symbols: [
                        `url(${BackTestGraphHandleIcon})`,
                        `url(${BackTestGraphHandleIcon})`,
                      ],
                    },
                    xAxis: {
                      visible: true,
                      labels: {
                        enabled: false,
                      },
                      gridLineWidth: 0,
                      plotBands: [
                        {
                          from: -100000000000,
                          to: 10000000000000000,
                          color: "#E5E5E680",
                        },
                      ],
                    },
                    series: {
                      color: "transparent",
                      lineWidth: 2,
                      type: "areaspline",
                      fillOpacity: 0,
                      lineColor: "#96979A",
                      fillColor: "transparent",
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
                }}
              />
            </div>
          </div>
        )}
      </>
    );
  }
}

export default BackTestChart;
