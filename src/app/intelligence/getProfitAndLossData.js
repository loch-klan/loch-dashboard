import arrowDownRight from "../../assets/images/icons/arrow-down-right.svg";
import arrowUpRight from "../../assets/images/icons/arrowUpRight.svg";
import {
  CurrencyType,
  noExponents,
  numToCurrency,
} from "../../utils/ReusableFunctions";

import GraphLogo from "../../assets/images/graph-logo.svg";
export const getProfitAndLossData = (arr, parentctx) => {
  // console.log("array", arr);

  let currency = JSON.parse(window.localStorage.getItem("currency"));
  let inflows = Number(noExponents(arr.inflows));
  let outflows = Number(noExponents(arr.outflows));
  let currencyRate = currency?.rate || 1;

  let totalInflow = inflows * currencyRate;
  let totalOutflow = outflows * currencyRate;
  let totalNetflow = outflows * currencyRate - inflows * currencyRate;
  // console.log(
  //   "wothout breadown",
  //   outflows * currency.rate, inflows * currency.rate,
  //   Math.abs(outflows * currency.rate - inflows * currency.rate)
  // );

  let GraphLogoImage = new Image();
  GraphLogoImage.src = GraphLogo;

  const labels = ["Inflow", "Outflow", "Net"];
  const profitOrLossData = {
    profit: {
      data: inflows * currencyRate,
      barColor: "#A9F4C4",
      borderColor: "#18C278",
    },
    loss: {
      data: outflows * currencyRate,
      barColor: "#FFE0D9",
      borderColor: "#CF1011",
    },
  };
  const data = {
    labels,
    datasets: [
      {
        data: [
          inflows * currencyRate,
          outflows * currencyRate,
          Math.abs(outflows * currencyRate - inflows * currencyRate),
        ],
        backgroundColor: [
          "rgba(100, 190, 205, 0.3)",
          "rgba(34, 151, 219, 0.3)",
          inflows * currencyRate < outflows * currencyRate
            ? profitOrLossData.profit.barColor
            : profitOrLossData.loss.barColor,
        ],
        borderColor: [
          "#64BECD",
          "#2297DB",
          inflows * currencyRate < outflows * currencyRate
            ? profitOrLossData.profit.borderColor
            : profitOrLossData.loss.borderColor,
        ],
        borderWidth: 2,
        borderRadius: {
          topLeft: 6,
          topRight: 6,
        },
        borderSkipped: false,
        barThickness: 48,
      },
    ],
  };

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
          color: "#B0B1B3",
        },
      },
      gridLineDashStyle: "longdash",
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
        let net_amount = 0;
        if (this.x === "Inflow") {
          net_amount = Math.abs(totalInflow);
        } else if (this.x === "Outflow") {
          net_amount = Math.abs(totalOutflow);
        } else if (this.x === "Net") {
          net_amount = Math.abs(totalNetflow);
        }

        let netColor = "#16182B";
        if (this.x === "Net") {
          if (totalNetflow > 0) {
            netColor = "#18C278";
          } else if (totalNetflow < 0) {
            netColor = "#CF1011";
          }
        }

        return `<div class="top-section py-4" style="background-color:#ffffff; border: 1px solid #E5E5E6; border-radius:10px;box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.04);
        backdrop-filter: blur(15px);">
                                <div class="line-chart-tooltip-section tooltip-section-blue w-100" style="background-color:#ffffff;">
                                <div class="inter-display-medium f-s-12 w-100 text-center px-4" style="color:#96979A; display:flex; justify-content:space-between"><b>${
                                  this.x
                                }</b> <b class="inter-display-semi-bold m-l-10" style="color:${
          this.x === "Net" ? netColor : "#16182B"
        };">${CurrencyType(false)}${numToCurrency(net_amount)}</b></div></div>`;
      },
    },
    legend: false,
    plotOptions: {
      series: {
        stacking: "normal",
        // grouping: false,
        showInLegend: false,
        dataLabels: {
          enabled: false,
        },
      },
    },
    series: [
      {
        name: "All",
        data: [
          {
            y: Math.abs(totalInflow),
            color: "rgba(100, 190, 205, 0.3)",
            borderColor: "#64BECD",
            borderWidth: 2,
            name: "Inflow",
            borderRadius: 0,
          },
          {
            y: Math.abs(totalOutflow),
            color: "rgba(34, 151, 219, 0.3)",
            borderColor: "#2297DB",
            borderWidth: 2,
            name: "Outflow",
            borderRadius: 0,
          },
          {
            y: Math.abs(totalNetflow),
            color: totalNetflow < 0 ? "#FFE0D9" : "#A9F4C4",
            borderColor: totalNetflow < 0 ? "#CF1011" : "#18C278",
            borderWidth: 2,
            name: "Net",
          },
        ],
        maxPointWidth: 50,
        borderRadiusTopLeft: 6,
        borderRadiusTopRight: 6,
        // borderRadius: 5,
      },
    ],
  };
  let value = outflows * currencyRate - inflows * currencyRate;
  let showPercentage = {
    icon: value >= 0 ? arrowUpRight : arrowDownRight,
    percent: inflows ? ((value / (inflows * currencyRate)) * 100).toFixed() : 0,
    status: value > 0 ? "Increase" : value < 0 ? "Decrease" : "No Change",
  };
  return [data, options, showPercentage];
};
