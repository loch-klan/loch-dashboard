import { useState } from "react";
import { CounterpartyFeesSpecificBar, FeesSpecificBar, HomeCounterPartyHover } from "../../utils/AnalyticsFunctions";
import { DEFAULT_PRICE } from "../../utils/Constant";
import { getCurrentUser } from "../../utils/ManageToken";
import { amountFormat, CurrencyType, noExponents, numToCurrency } from "../../utils/ReusableFunctions";

export const getGraphData = (apidata, parentCtx) => {
  let arr = apidata?.gas_fee_overtime;
  let assetPrices = apidata?.asset_prices;
  console.log(apidata);
  let currency = JSON.parse(localStorage.getItem('currency'));
  // const digit = numToCurrency(
  //   Math.round(Math.max(...arr.map((e) => e.total_fees * currency?.rate)))
  // ).length;
  
  let digit = 3;
  //  console.log("state", parentCtx, arr, assetPrices, apidata);
  const labels = arr ? arr?.map((e) => e.chain.name) : [];

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
      },
      tooltip: {
        displayColors: false,
        backgroundColor: '#ffffff',
        // fontColor: '#000000',
        intersect: false,
        color: '#000000',
        padding: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        // boxPadding: 5,
        bodyFont: {
          family: 'Inter-Medium',
          size: 13,
        },
        bodySpacing: 8,
        callbacks: {
          title: function () { }, //REMOVE TITLE
          label: (ctx) => {
            // console.log('ctx',ctx);
            let label00 = ctx.label;
            let label0 =
              "Fees Today (Then): " +
              CurrencyType(false) +
              amountFormat(
                (
                  ctx.dataset.totalFeesAmount[ctx.dataIndex] *
                  assetPrices[ctx.dataset.defaultAssetCode[ctx.dataIndex]]
                )?.toFixed(2),
                "en-US",
                "USD"
              ) +
              " (" +
              CurrencyType(false) +
              numToCurrency(ctx.raw) +
              ")";
              ;
            let label1 = "Volume: " + CurrencyType(false) + numToCurrency(ctx.dataset.totalVolume[ctx.dataIndex] * currency.rate);
            FeesSpecificBar({
              session_id: getCurrentUser().id,
              email_address: getCurrentUser().email,
              blockchain_selected: [label00, label1, label0],
            });
            return [label00, label1, label0];
          },
          labelColor: function (context) {
            return {
              padding: 10,
            };
          },
          labelTextColor: function (context) {
            return '#19191A';
          }
        },
      },
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
          family: "Helvetica Neue",
          weight: 400,
          color: "#B0B1B3",
          callback: function (value, index, ticks) {
            // console.log('value',value);
            // console.log('index',index);
            // console.log('ticks',ticks);
            let val = Number(noExponents(value).toLocaleString('en-US'))
            if (
              digit <
              CurrencyType(false).length + numToCurrency(val).length
            ) {
              digit =
                CurrencyType(false).length + numToCurrency(val).length;
              parentCtx.setState({
                GraphDigit: digit,
              });
            }


            return CurrencyType(false) + numToCurrency(val);
          }
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

  const options2 = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        bottom: 34.5,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
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
          display: false
        },
        grid: {
          display: false,
          borderWidth: 1,
        },
      },
      y: {
        //   min: min,
        //   max: 22574,
        afterFit: (ctx) => {
          // console.log("digit width", digit);
          ctx.width = `${digit}0`;
        },
        ticks: {
          // stepSize: 1500,
          padding: 8,
          size: 12,
          lineHeight: 20,
          family: "Helvetica Neue",
          weight: 400,
          color: "#B0B1B3",
          callback: function (value, index, ticks) {
            let val = Number(noExponents(value).toLocaleString('en-US'))
            if (
              digit <
              CurrencyType(false).length + numToCurrency(val).length
            ) {
              digit = CurrencyType(false).length + numToCurrency(val).length;
              parentCtx.setState({
                GraphDigit: digit,
              });
            }
            return CurrencyType(false) + numToCurrency(val);
          }
        },
        grid: {
          drawBorder: false,
          display: true,
          borderDash: (ctx) => (ctx.index == 0 ? [0] : [4]),
          drawTicks: false,
        },
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        data: arr ? arr.map((e) => e.total_fees * currency?.rate) : [],
        backgroundColor: arr ? arr?.map((e) => e.chain.color + "4D") : [],
        borderColor: arr ? arr.map((e) => e.chain.color) : [],
        defaultAssetCode: arr ? arr.map((e) => e.chain.default_asset_code) : [],
        borderWidth: 2,
        borderRadius: {
          topLeft: 6,
          topRight: 6,
        },
        borderSkipped: false,
        barThickness: 48,
        totalFeesAmount: arr ? arr.map((e) => e.total_fees_amount * currency?.rate): [],
        // totalAmount: arr.map((e) => e.total_amount * currency?.rate),
        totalVolume: arr ? arr.map((e) => e.total_volume) : [],
      },
    ],
  };

    return [data, options, options2]

}

export const getCounterGraphData = (arr, parentCtx) => {
  let currency= JSON.parse(localStorage.getItem('currency'));
  //  const digit = numToCurrency(
  //    Math.round(Math.max(...arr.map((e) => e.total_fees * currency?.rate)))
  //  ).length;
  let digit = 3;

  const labels = arr.map((e) => e._id);

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
      },
      tooltip: {
        displayColors: false,
        backgroundColor: '#ffffff',
        // fontColor: '#000000',
        intersect: false,
        color: '#000000',
        padding: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        // boxPadding: 5,
        bodyFont: {
          family: 'Inter-Medium',
          size: 13,
        },
        bodySpacing: 8,
        callbacks: {
          title: function() {}, //REMOVE TITLE
          label: (ctx) => {
            // console.log('ctx',ctx);
            let label00 = ctx.label;
              let label0 = "Fees: " + CurrencyType(false) + numToCurrency(ctx.dataset.totalFees[ctx.dataIndex]);
            let label1 = "Volume: " + CurrencyType(false) + numToCurrency(ctx.raw * currency.rate);
            parentCtx.state.currentPage === "Home"
              ? HomeCounterPartyHover({
                  session_id: getCurrentUser().id,
                  email_address: getCurrentUser().email,
                  counterparty_selected: [label00, label1, label0],
                })
              : CounterpartyFeesSpecificBar({
                  session_id: getCurrentUser().id,
                  email_address: getCurrentUser().email,
                  counterparty_selected: [label00, label1, label0],
                });
              return [label00, label1, label0];
          },
          labelColor: function(context) {
            return {
                padding: 10,
            };
        },
          labelTextColor: function(context) {
            return '#19191A';
        }
        },
      },
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
          family: "Inter-Medium",
          weight: 400,
          color: "#B0B1B3",
          callback: function(value, index, ticks) {
            let val = Number(noExponents(value).toLocaleString('en-US'))
               if (
                 digit <
                 CurrencyType(false).length + numToCurrency(val).length
               ) {
                 digit = CurrencyType(false).length + numToCurrency(val).length;
                 parentCtx.setState({
                   counterGraphDigit: digit
                 })
               }


            return CurrencyType(false) + numToCurrency(val);
          }
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
          // Truncate x axis labels to solve overlapping issue
          callback: function(value, index, ticks) {
            return this.getLabelForValue(value)?.substr(0, 15) || "Other";
          }
        },
        grid: {
          display: false,
          borderWidth: 1,
        },
      },
    },
  };

  const options2 = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        bottom: 34.5,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
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
          display: false,
        },
        grid: {
          display: false,
          borderWidth: 1,
        },
      },
      y: {
      //   min: min,
      //   max: 22574,
        afterFit: (ctx) => {
          // console.log("digit width" ,digit )
          ctx.width = `${digit}`+0;
        },
        ticks: {
          // stepSize: 1500,
          padding: 8,
          size: 12,
          lineHeight: 20,
          family: "Inter-Medium",
          weight: 400,
          color: "#B0B1B3",
          callback: function(value, index, ticks) {
            let val = Number(noExponents(value).toLocaleString('en-US'))
              // console.log(
              //   "tick gas",
              //   CurrencyType(false) + numToCurrency(val),
              //   value,
              //   CurrencyType(false).length,
              //   numToCurrency(val).length,
              //   "sum",
              //   CurrencyType(false).length + numToCurrency(val).length
              // );
             if (
               digit <
               CurrencyType(false).length + numToCurrency(val).length
             ) {
               digit = CurrencyType(false).length + numToCurrency(val).length;
               parentCtx.setState({
                 counterGraphDigit: digit,
               });
             }
                return CurrencyType(false) + numToCurrency(val);
          }
        },
        grid: {
          drawBorder: false,
          display: true,
          borderDash: (ctx) => (ctx.index == 0 ? [0] : [4]),
          drawTicks: false,
        },
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        data: arr.map((e) => e.total_volume * currency?.rate),
        backgroundColor: [
          "rgba(100, 190, 205, 0.3)",
          "rgba(34, 151, 219, 0.3)",
          "rgba(114, 87, 211, 0.3)",
          "rgba(141, 141, 141, 0.3)",
          " rgba(84, 84, 191, 0.3)",
          "rgba(178, 210, 145, 0.3)",
          "rgba(141, 141, 141, 0.3)",
          "rgba(178, 210, 145, 0.3)",
        ],
        borderColor: [
          "#64BECD",
          "#2297DB",
          "#7257D3",
          "#8D8D8D",
          "#5454BF",
          "#B2D291",
          "#8D8D8D",
          "#B2D291",
        ],
        borderWidth: 2,
        borderRadius: {
          topLeft: 6,
          topRight: 6,
        },
        borderSkipped: false,
        barThickness: 48,
        totalFees: arr.map((e) => e.total_fees * currency?.rate),
        // totalAmount: arr.map((e) => e.total_amount * currency?.rate),
        totalVolume: arr.map((e) => e.total_volume),
        defaultAssetCode: arr.map((e) => e.chain.default_asset_code),
      },
    ],
  };

  return [data, options, options2];

}

// export default getGraphData;