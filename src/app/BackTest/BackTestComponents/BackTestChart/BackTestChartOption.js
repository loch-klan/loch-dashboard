import moment from "moment";
import {
  amountFormat,
  CurrencyType,
} from "../../../../utils/ReusableFunctions";
import {
  BackTestGraphHandleIcon,
  GraphLogoDark,
} from "../../../../assets/images";

export const BackTestChartOption = (
  parent,
  performanceVisualizationGraphData
) => {
  console.log(
    "performanceVisualizationGraphData ",
    performanceVisualizationGraphData
  );

  return {
    legend: {
      enabled: true,
      verticalAlign: "bottom",
      itemStyle: {
        color: "var(--primaryTextColor)",
        textTransform: "uppercase",
        fontWeight: "500",
        textShadow: "0.1px 0 var(--primaryTextColor)",
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
        const tempHolder = this.points.map((point, pointIndex) => {
          let itemTitle = "";
          let itemAmount = "";
          if (point.series && point.series.userOptions) {
            itemTitle = point.series.userOptions.name;

            if (
              point.series.userOptions.data &&
              point.series.userOptions.data[point.point.index] &&
              point.series.userOptions.data[point.point.index][2]
            ) {
              itemAmount = point.series.userOptions.data[point.point.index][2];
            }

            itemTitle = itemTitle.toUpperCase();
          }
          return `<div class="back-test-chart-tool-tip">
                <div>${itemTitle}</div>
                <div>${amountFormat(point.y, "en-US", "USD")}%</div>
                <div class="back-test-chart-tool-tip-amount">${
                  CurrencyType(false) + amountFormat(itemAmount, "en-US", "USD")
                }</div>
              </div>`;
        });

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
          let selectedItem = 0;
          let selectedItemIndex = 0;
          console.log(
            "performanceVisualizationGraphData ? ",
            performanceVisualizationGraphData
          );

          if (
            performanceVisualizationGraphData &&
            performanceVisualizationGraphData.length > 0
          ) {
            performanceVisualizationGraphData.forEach(
              (curItem, curItemIndex) => {
                if (
                  curItem.data &&
                  curItem.data[0] &&
                  curItem.data[0][0] &&
                  curItem.data[0][0] > selectedItem
                ) {
                  selectedItem = curItem.data[0][0];
                  selectedItemIndex = curItemIndex;
                }
              }
            );
          }

          if (
            performanceVisualizationGraphData &&
            performanceVisualizationGraphData[selectedItemIndex] &&
            performanceVisualizationGraphData[selectedItemIndex].data &&
            performanceVisualizationGraphData[selectedItemIndex].data.length > 0
          ) {
            if (performanceVisualizationGraphData[selectedItemIndex].data[0]) {
              startIndex =
                performanceVisualizationGraphData[selectedItemIndex].data[0][0];
            }

            let fullLength =
              performanceVisualizationGraphData[selectedItemIndex].data.length -
              1;

            if (
              performanceVisualizationGraphData[selectedItemIndex].data[
                fullLength
              ]
            ) {
              endIndex =
                performanceVisualizationGraphData[selectedItemIndex].data[
                  fullLength
                ][0];
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
    series: performanceVisualizationGraphData
      ? performanceVisualizationGraphData
      : [],
    yAxis: {
      opposite: false,
      gridLineColor: "var(--strategyBuilderGraphGrid)",
      gridLineWidth: 1,
      tickAmount: 8,
      labels: {
        enabled: false,
      },
    },

    xAxis: {
      tickAmount: 8,
      lineWidth: 0,
      gridLineColor: "var(--strategyBuilderGraphGrid)",
      gridLineWidth: 1,
      events: {
        afterSetExtremes: function (e) {
          let minEle = moment(e.min).format("DD MM YYYY");
          // let maxEle = moment(e.max).format("DD MM YYYY");
          if (this.reDraw) {
            clearTimeout(this.reDraw);
          }
          this.reDraw = setTimeout(() => {
            let chartHandles = document.getElementsByClassName(
              "highcharts-navigator-handle"
            );
            let chartMaskInside = document.getElementsByClassName(
              "highcharts-navigator-mask-inside"
            );

            // setTimeout(() => {
            //   Array.from(chartHandles).forEach((curItem) => {
            //     curItem.classList.remove("no-pointer-event");
            //   });
            //   Array.from(chartMaskInside).forEach((curItem) => {
            //     curItem.classList.remove("no-pointer-event");
            //   });
            // }, 500);
            // highcharts-navigator-mask-inside
            // highcharts-navigator-handle
            // Array.from(chartHandles).forEach((curItem) => {
            //   curItem.classList.add("no-pointer-event");
            // });
            // Array.from(chartMaskInside).forEach((curItem) => {
            //   curItem.classList.add("no-pointer-event");
            // });
            parent.props.calcChartData(minEle, e.min);
            // setTimeout(() => {

            // }, 1000);
          }, 1000);
        },
      },
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
      outlineColor: "var(--strategyBuilderGraphNavigatorOuline)",
      outlineWidth: 1,
      maskFill: "var(--strategyBuilderGraphNavigatorMaskFill)",
      stickToMax: false,

      handles: {
        lineWidth: 0,
        width: 7,
        height: 16,
        // symbols: [
        //   `url(${BackTestGraphHandleIcon})`,
        //   `url(${BackTestGraphHandleIcon})`,
        // ],
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
            color: "var(--strategyBuilderGraphNavigatorMaskBackground)",
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
  };
};
