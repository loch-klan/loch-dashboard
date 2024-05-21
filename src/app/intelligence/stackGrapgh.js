import GraphLogo from "../../assets/images/graph-logo.svg";
import {
  CurrencyType,
  noExponents,
  numToCurrency,
} from "../../utils/ReusableFunctions";

const labels = ["Inflow", "Outflow", "Net"];

export const getProfitLossAsset = (arr, parentCtx, isPremiumUser) => {
  // console.log(arr);
  //   Find total inflows by calculating inflows.totalvolume
  // Find total outflows by calculating outflows.totalvolume
  // Find total fees by calculating fees.totalfees
  // Net would be total outflows+ totalfees-totalinflows

  let currency = JSON.parse(window.localStorage.getItem("currency"));
  let fees = arr?.fees;

  let totalFees = 0;
  fees?.map((e) => (totalFees = totalFees + e.total_fees));

  let inFlows = [];
  if (arr?.inflows && arr?.inflows.length > 0) {
    inFlows = arr?.inflows?.sort((a, b) => b.total_volume - a.total_volume);
  }

  // push()

  let outFlows = arr?.outflows;
  if (outFlows) {
    outFlows.push({
      asset: {
        name: "Fees",
        color: "#2297DB",
      },
      total_volume: totalFees,
    });
  }
  if (arr?.outflows && arr?.outflows.length > 0) {
    outFlows = arr?.outflows?.sort((a, b) => b.total_volume - a.total_volume);
  }

  let totalInflow = 0;
  inFlows?.map((e) => (totalInflow = totalInflow + e.total_volume));
  let totalOutflow = 0;
  outFlows?.map((e) => (totalOutflow = totalOutflow + e.total_volume));

  let totalNetflow = totalOutflow - totalInflow;

  let topInflow = inFlows?.slice(0, 4);
  let topInFlowTotal = 0;
  topInflow?.map((e) => (topInFlowTotal = topInFlowTotal + e.total_volume));
  let otherInflow = totalInflow - topInFlowTotal;

  // outflow
  let topOutflow = outFlows?.slice(0, 4);
  let topOutFlowTotal = 0;
  topOutflow?.map((e) => (topOutFlowTotal = topOutFlowTotal + e.total_volume));
  let otherOutflow = totalOutflow - topOutFlowTotal;

  // console.log(
  //   "in breadown",
  //   totalOutflow * currency?.rate,
  //   totalInflow * currency?.rate,
  //   totalNetflow * currency?.rate,
  //   totalFees * currency?.rate
  // );

  const options = {
    chart: {
      type: "column",
      spacingBottom: 35,
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

          // Add a text element for the watermark
          renderer
            .image(GraphLogo, x, y, imageWidth, imageHeight)
            .attr({
              zIndex: 1, // Set the zIndex so it appears above the chart
              // opacity: parentCtx?.props?.darkModeState?.flag ? 0.1 : 1,
              class: "watermark-opacity",
            })
            .add();
        },
      },
    },

    credits: {
      enabled: false,
    },
    title: {
      text: null,
    },
    xAxis: {
      categories: labels,
      lineColor: parentCtx?.props?.darkModeState?.flag ? "#303030" : "#e5e5e6",
      labels: {
        style: {
          color: parentCtx?.props?.darkModeState?.flag ? "#7c7d81" : "#4f4f4f",
        },
      },
    },
    yAxis: {
      showLastLabel: true,
      // min: 0,
      title: {
        text: null,
      },
      stackLabels: {
        enabled: false,
      },
      offset: 10,
      labels: {
        formatter: function () {
          // console.log("y value", this.value, this);
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
          color: parentCtx?.props?.darkModeState?.flag ? "#7c7d81" : "#4f4f4f",
        },
      },
      gridLineDashStyle: "longdash",
      gridLineColor: parentCtx?.props?.darkModeState?.flag
        ? "#404040"
        : "#e5e5e6",
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
      // borderWidth: 1,
      padding: 0,
      shadow: false,
      hideDelay: 0,

      formatter: function () {
        // console.log("ctx", this);
        let tooltipData = [];

        let net_amount =
          this.x === "Inflow"
            ? totalInflow
            : this.x === "Outflow"
            ? totalOutflow
            : this.x === "Net"
            ? totalNetflow
            : 0;
        this.points.map((item) => {
          // console.log(
          //   "Item: ",
          //   item);
          if (
            (item.key === "Other" && item.y > 0) ||
            item.key === this.x ||
            (item.key === "Fees" && item.y > 0)
          ) {
            tooltipData.push({
              name: item.key,
              x: item.x,
              y: item.y,
              color: item?.point?.borderColor,
            });
          } else if (
            item.key !== "Other" &&
            item.key !== "Net" &&
            item.key !== "Fees"
          ) {
            tooltipData.push({
              name: item.key,
              x: item.x,
              y: item.y,
              color: item?.point?.borderColor,
            });
          }
        });

        let netColor = "#16182B";
        let modeCOlor = parentCtx?.props?.darkModeState?.flag
          ? "#000000"
          : "#ffffff";
        let invertModeColor = parentCtx?.props?.darkModeState?.flag
          ? "#ffffff"
          : "#000000";
        if (this.x === "Net") {
          let newtooltipData = [];
          if (tooltipData && tooltipData.length > 0) {
            newtooltipData = tooltipData.slice(4, 5);
          }
          netColor = newtooltipData.length > 0 ? newtooltipData[0]?.color : "";
          tooltipData = [];
        }
        // console.log("sorted", tooltipData);

        // const tooltip_title = "Week";
        //  console.log("checking date", x_value, this.x, tooltip_title);
        return `<div class="top-section py-4" style="background-color:var(--cardBackgroud); border: 1px solid var(--cardBorder); border-radius:10px;box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.04);
backdrop-filter: blur(15px);">
                                <div class="line-chart-tooltip-section tooltip-section-blue w-100" style="background-color:#ffffff;">
                                <div class="inter-display-medium f-s-12 w-100 text-center px-4" style="color:#7c7d81; display:flex; justify-content:space-between"><b>${
                                  this.x
                                }</b> <b class="inter-display-semi-bold m-l-10" style="color:${
          this.x === "Net" ? netColor : "#ffffff"
        };"><span class="${
          isPremiumUser ? "" : "blurred-elements"
        }" >${CurrencyType(false)}${numToCurrency(
          net_amount * currency?.rate
        )}</span></b></div>${
          tooltipData.length !== 0
            ? `<div class="w-100 mt-3" style="height: 1px; background-color: #E5E5E680;"></div>`
            : ""
        }
    ${
      tooltipData.length !== 0
        ? tooltipData
            .map((item) => {
              return `<div class="${
                isPremiumUser ? "" : "blurred-elements"
              } inter-display-medium f-s-13 w-100 pt-3 px-4">
                                    <span style='width:10px; height: 10px; border-radius: 50%; background-color:${
                                      item.color == modeCOlor ||
                                      ((item.color == "#16182B" ||
                                        item.color == "#101010") &&
                                        parentCtx?.props?.darkModeState?.flag)
                                        ? invertModeColor
                                        : item.color
                                    }; display: inline-block; margin-right: 0.6rem'> </span>
                                       ${item.name} <span style="color:${
                item.color == modeCOlor ||
                ((item.color == "#16182B" || item.color == "#101010") &&
                  parentCtx?.props?.darkModeState?.flag)
                  ? invertModeColor
                  : item.color
              }">${CurrencyType(false)}${numToCurrency(item.y)}</span>
                                    </div>`;
            })
            .join(" ")
        : ""
    }
                            </div>
                        </div>`;
      },
    },
    legend: false,
    plotOptions: {
      series: {
        stacking: "normal",
        // grouping: false,

        dataLabels: {
          enabled: false,
        },
      },
    },
    series: [
      {
        name: "One",
        data: [
          {
            y:
              topInflow && topInflow.length > 0
                ? topInflow[0]?.total_volume * currency?.rate
                : 0,
            color:
              topInflow && topInflow.length > 0
                ? topInflow[0]?.asset?.color + "4D"
                : "",
            borderColor:
              topInflow && topInflow.length > 0
                ? topInflow[0]?.asset?.color
                : "",
            borderWidth: 2,
            name:
              topInflow && topInflow.length > 0
                ? topInflow[0]?.asset?.name
                : "",
          },
          {
            y:
              topOutflow && topOutflow.length > 0
                ? topOutflow[0]?.total_volume * currency?.rate
                : 0,
            color:
              topOutflow && topOutflow.length > 0
                ? topOutflow[0]?.asset?.color + "4D"
                : "",
            borderColor:
              topOutflow && topOutflow.length > 0
                ? topOutflow[0]?.asset?.color
                : "",
            borderWidth: 2,
            name:
              topOutflow && topOutflow.length > 0
                ? topOutflow[0]?.asset?.name
                : "",
          },
          {
            y: 0,
            color: "transparent",
            borderColor: "transparent",
            borderWidth: 0,
          },
        ],
        maxPointWidth: 50,
        borderRadiusTopLeft: 6,
        borderRadiusTopRight: 6,
        // borderRadius: 5,
      },
      {
        name: "Two",
        data: [
          {
            y:
              topInflow && topInflow.length > 0
                ? topInflow[1]?.total_volume * currency?.rate
                : 0,
            color:
              topInflow && topInflow.length > 0
                ? topInflow[1]?.asset?.color + "4D"
                : "",
            borderColor:
              topInflow && topInflow.length > 0
                ? topInflow[1]?.asset?.color
                : "",
            borderWidth: 2,
            name:
              topInflow && topInflow.length > 0
                ? topInflow[1]?.asset?.name
                : "",
          },
          {
            y:
              topOutflow && topOutflow.length > 0
                ? topOutflow[1]?.total_volume * currency?.rate
                : 0,
            color:
              topOutflow && topOutflow.length > 0
                ? topOutflow[1]?.asset?.color + "4D"
                : "",
            borderColor:
              topOutflow && topOutflow.length > 0
                ? topOutflow[1]?.asset?.color
                : "",
            borderWidth: 2,
            name:
              topOutflow && topOutflow.length > 0
                ? topOutflow[1]?.asset?.name
                : "",
          },
          {
            y: 0,
            color: "transparent",
            borderColor: "transparent",
            borderWidth: 0,
          },
        ],
        maxPointWidth: 50,
        // borderRadius: 5,
      },
      {
        name: "Three",
        data: [
          {
            y:
              topInflow && topInflow.length > 0
                ? topInflow[2]?.total_volume * currency?.rate
                : 0,
            color:
              topInflow && topInflow.length > 0
                ? topInflow[2]?.asset?.color + "4D"
                : "",
            borderColor:
              topInflow && topInflow.length > 0
                ? topInflow[2]?.asset?.color
                : "",
            borderWidth: 2,
            name:
              topInflow && topInflow.length > 0
                ? topInflow[2]?.asset?.name
                : "",
          },
          {
            y:
              topOutflow && topOutflow.length > 0
                ? topOutflow[2]?.total_volume * currency?.rate
                : 0,
            color:
              topOutflow && topOutflow.length > 0
                ? topOutflow[2]?.asset?.color + "4D"
                : "",
            borderColor:
              topOutflow && topOutflow.length > 0
                ? topOutflow[2]?.asset?.color
                : "",
            borderWidth: 2,
            name:
              topOutflow && topOutflow.length > 0
                ? topOutflow[2]?.asset?.name
                : "",
          },
          {
            y: 0,
            color: "transparent",
            borderColor: "transparent",
            borderWidth: 0,
          },
        ],
        maxPointWidth: 50,
        // borderRadius: 5,
      },
      {
        name: "Four",
        data: [
          {
            y:
              topInflow && topInflow.length > 0
                ? topInflow[3]?.total_volume * currency?.rate
                : 0,
            color:
              topInflow && topInflow.length > 0
                ? topInflow[3]?.asset?.color + "4D"
                : "",
            borderColor:
              topInflow && topInflow.length > 0
                ? topInflow[3]?.asset?.color
                : "",
            borderWidth: 2,
            name:
              topInflow && topInflow.length > 0
                ? topInflow[3]?.asset?.name
                : "",
          },
          {
            y:
              topOutflow && topOutflow.length > 0
                ? topOutflow[3]?.total_volume * currency?.rate
                : 0,
            color:
              topOutflow && topOutflow.length > 0
                ? topOutflow[3]?.asset?.color + "4D"
                : "",
            borderColor:
              topOutflow && topOutflow.length > 0
                ? topOutflow[3]?.asset?.color
                : "",
            borderWidth: 2,
            name:
              topOutflow && topOutflow.length > 0
                ? topOutflow[3]?.asset?.name
                : "",
          },
          {
            y: 0,
            color: "transparent",
            borderColor: "transparent",
            borderWidth: 0,
          },
        ],
        maxPointWidth: 50,
        // borderRadius: 5,
      },

      {
        name: "Other",
        data: [
          {
            y: otherInflow ? otherInflow * currency?.rate : 0,
            color: parentCtx?.props?.darkModeState?.flag
              ? "#CACBCC4D"
              : "#16182B4D",
            borderColor: parentCtx?.props?.darkModeState?.flag
              ? "#CACBCC99"
              : "#16182B",
            borderWidth: 2,
            name: "Other",
          },
          {
            y: otherOutflow ? otherOutflow * currency?.rate : 0,
            color: parentCtx?.props?.darkModeState?.flag
              ? "#CACBCC4D"
              : "#16182B4D",
            borderColor: parentCtx?.props?.darkModeState?.flag
              ? "#CACBCC99"
              : "#16182B",
            borderWidth: 2,
            name: "Other",
          },
          {
            y: 0,
            color: "transparent",
            borderColor: "transparent",
            borderWidth: 0,
            name: "Other",
          },
        ],
        maxPointWidth: 50,
        // borderRadiusTopLeft: 6,
        // borderRadiusTopRight: 6,
        // borderRadius: 5,
      },
      {
        name: "Net",
        data: [
          {
            y: 0,
            color: "transparent",
            borderColor: "transparent",
            borderWidth: 2,
            name: "Net",
            borderRadius: 0,
          },
          {
            y: 0,
            color: "transparent",
            borderColor: "transparent",
            borderWidth: 2,
            name: "Net",
            borderRadius: 0,
          },
          {
            y: Math.abs(totalNetflow * currency?.rate),
            color: totalNetflow * currency?.rate < 0 ? "#FFE0D9" : "#A9F4C4",
            borderColor:
              totalNetflow * currency?.rate < 0 ? "#CF1011" : "#18C278",
            borderWidth: 2,
          },
        ],
        maxPointWidth: 50,
        borderRadiusTopLeft: 6,
        borderRadiusTopRight: 6,
        // borderRadius: 5,
      },
    ],
  };

  return options;
};
