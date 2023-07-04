import {
  CurrencyType,
  noExponents,
  numToCurrency,
} from "../../utils/ReusableFunctions";
import arrowUpRight from "../../assets/images/icons/arrowUpRight.svg";
import arrowDownRight from "../../assets/images/icons/arrow-down-right.svg";
import {
  netflowInflowHover,
  netflowNetHover,
  netflowOutflowHover,
  ProfitLossHover,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import { useHistory } from "react-router-dom";
import GraphLogo from "../../assets/images/graph-logo.svg";
export const getProfitAndLossData = (arr, parentctx) => {
  // console.log("array", arr);

  let currency = JSON.parse(localStorage.getItem("currency"));
  let inflows = Number(noExponents(arr.inflows));
  let outflows = Number(noExponents(arr.outflows));
  let currencyRate = currency?.rate || 1;
  // console.log(
  //   "wothout breadown",
  //   outflows * currency.rate, inflows * currency.rate,
  //   Math.abs(outflows * currency.rate - inflows * currency.rate)
  // );

  let GraphLogoImage = new Image();
  GraphLogoImage.src = GraphLogo;

  const labels = ["Inflows", "Outflows", "Net"];
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
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 15,
      },
    },
    plugins: {
      legend: {
        display: false,
        labels: {
          // This more specific font property overrides the global property
          font: {
            family: "Inter-Regular",
          },
        },
      },
      tooltip: {
        displayColors: false,
        backgroundColor: "#ffffff",
        // fontColor: '#000000',
        intersect: false,
        color: "#000000",
        padding: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        // boxPadding: 5,
        bodyFont: {
          family: "Inter-Medium",
          size: 13,
        },
        bodySpacing: 8,
        callbacks: {
          title: function () {}, //REMOVE TITLE
          label: (ctx) => {
            let label =
              ctx.label + ": " + CurrencyType(false) + numToCurrency(ctx.raw);

            // console.log(
            //   "net",
            //   ctx.label,
            //   parentctx.props.history.location.pathname.substring(1)
            // );
            if (
              parentctx.props.history.location.pathname.substring(1) === "home"
            ) {
              ProfitLossHover({
                session_id: getCurrentUser().id,
                email_address: getCurrentUser().email,
                hover_value: CurrencyType(false) + numToCurrency(ctx.raw),
              });
            } else {
              if (ctx.label === "Net") {
                netflowNetHover({
                  session_id: getCurrentUser().id,
                  email_address: getCurrentUser().email,
                  hovered: CurrencyType(false) + numToCurrency(ctx.raw),
                });
              } else if (ctx.label === "Outflows") {
                netflowOutflowHover({
                  session_id: getCurrentUser().id,
                  email_address: getCurrentUser().email,
                  hovered: CurrencyType(false) + numToCurrency(ctx.raw),
                });
              } else if (ctx.label === "Inflows") {
                netflowInflowHover({
                  session_id: getCurrentUser().id,
                  email_address: getCurrentUser().email,
                  hovered: CurrencyType(false) + numToCurrency(ctx.raw),
                });
              }
            }

            return [label];
          },
          labelColor: function (context) {
            return {
              padding: 10,
            };
          },
          labelTextColor: function (context) {
            return "#19191A";
          },
        },
      },
    },
    watermark: {
      image: GraphLogoImage,

      x: 0,
      y:
        parentctx.props.history.location.pathname.substring(1) === "home"
          ? 41
          : 22,

      width: 104,
      height: 39,

      opacity: 1,

      alignX: "middle",
      alignY: "middle",

      position: "back",
    },
    scales: {
      y: {
        //   min: min,
        //   max: 22574,
        // beginAtZero: true,
        // title: {
        //   display: true,
        //   text: "$ USD",
        //   position: 'bottom',
        // },
        ticks: {
          display: labels.length > 8 ? false : true,
          // display: false,
          // stepSize: 1500,
          padding: 8,
          size: 12,
          lineHeight: 20,
          fontFamily: "'Inter-Regular'",
          weight: 400,
          color: "#B0B1B3",
          callback: function (value, index, ticks) {
            let val = Number(noExponents(value));
            return CurrencyType(false) + numToCurrency(val);
          },
        },
        grid: {
          drawBorder: false,
          display: true,
          borderDash: (ctx) => (ctx.index == 0 ? [0] : [4]),
          drawTicks: false,
        },
      },
      x: {
        ticks: {
          font: "Inter-SemiBold",
          size: 10,
          lineHeight: 12,
          weight: 600,
          color: "#86909C",
          maxRotation: 0,
          minRotation: 0,
          autoSkip: false,
        },
        grid: {
          display: false,
          borderWidth: 1,
        },
      },
    },
  };
  let value = outflows * currencyRate - inflows * currencyRate;
  let showPercentage = {
    icon: value >= 0 ? arrowUpRight : arrowDownRight,
    percent: inflows ? ((value / (inflows * currencyRate)) * 100).toFixed() : 0,
    status: value > 0 ? "Increase" : value < 0 ? "Decrease" : "No Change",
  };
  return [data, options, showPercentage];
};
