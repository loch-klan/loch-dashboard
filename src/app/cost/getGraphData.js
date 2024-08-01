import GraphLogo from "../../assets/images/graph-logo.svg";
import {
  CounterpartyFeesSpecificBar,
  FeesSpecificBar,
  HomeCounterPartyHover,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import {
  CurrencyType,
  TruncateText,
  amountFormat,
  noExponents,
  numToCurrency,
} from "../../utils/ReusableFunctions";

export const getGraphData = (apidata, parentCtx, isGasFeesMobile = false) => {
  let arr = apidata?.gas_fee_overtime;
  let assetPrices = apidata?.asset_prices;
  // console.log(apidata);
  let currency = JSON.parse(window.localStorage.getItem("currency"));
  // const digit = numToCurrency(
  //   Math.round(Math.max(...arr.map((e) => e.total_fees * currency?.rate)))
  // ).length;

  let digit = 3;
  //  console.log("state", apidata);
  const labels = arr
    ? arr?.map((e) => (e?.chain ? e?.chain?.name : e?.exchange))
    : [];
  let GraphLogoImage = new Image();
  GraphLogoImage.src = GraphLogo;
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
        backgroundColor: parentCtx?.props?.darkModeState?.flag
          ? "#1A1A1A"
          : "white",
        // fontColor: '#000000',
        intersect: false,
        color: parentCtx?.props?.darkModeState?.flag ? "#7c7d81" : "#19191a",
        padding: 12,
        borderWidth: 1,
        borderColor: parentCtx?.props?.darkModeState?.flag
          ? "#2D2D2D"
          : "#E5E7EB",
        // boxPadding: 5,
        bodyFont: {
          family: "Inter-Medium",
          size: 11,
        },
        bodySpacing: 8,
        callbacks: {
          title: function () {}, //REMOVE TITLE
          label: (ctx) => {
            // console.log('ctx',ctx);
            let label00 = ctx.label;
            let label0 =
              "Fees: " +
              CurrencyType(false) +
              amountFormat(
                (
                  ctx.dataset.totalFeesAmount[ctx.dataIndex] *
                    assetPrices[ctx.dataset.defaultAssetCode[ctx.dataIndex]] ||
                  ctx.raw
                )?.toFixed(2) * currency.rate,
                "en-US",
                "USD"
              );
            let label1 =
              "Volume: " +
              CurrencyType(false) +
              numToCurrency(
                ctx.dataset.totalVolume[ctx.dataIndex] * currency.rate
              );

            if (parentCtx.state.callFeesOverTime) {
              FeesSpecificBar({
                session_id: getCurrentUser().id,
                email_address: getCurrentUser().email,
                blockchain_selected: [label00, label1, label0],
              });
              if (parentCtx.feesOverTimeOff) {
                parentCtx.feesOverTimeOff();
              }
            } else {
              if (parentCtx.feesOverTimeOn) {
                setTimeout(() => {
                  parentCtx.feesOverTimeOn();
                }, 2000);
              }
            }
            return [label00, label1, label0];
          },
          labelColor: function (context) {
            return {
              padding: 10,
            };
          },
          labelTextColor: function (context) {
            return parentCtx?.props?.darkModeState?.flag
              ? "#7c7d81"
              : "#19191a";
          },
        },
      },
    },
    // watermark: {
    //   image: GraphLogoImage,

    //   x: 0,
    //   y: 30,

    //   width: 104,
    //   height: 39,

    //   opacity: 1,

    //   alignX: "middle",
    //   alignY: "middle",

    //   position: "back",
    // },
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
          display:
            isGasFeesMobile && labels.length > 3
              ? false
              : labels.length > 8
              ? false
              : true,
          // display: false,
          // stepSize: 1500,
          padding: 8,
          size: 12,
          lineHeight: 20,
          family: "Helvetica Neue",
          weight: 400,
          color: parentCtx?.props?.darkModeState?.flag ? "#7c7d81" : "#4f4f4f",
          callback: function (value, index, ticks) {
            // console.log('value',value);
            // console.log('index',index);
            // console.log('ticks',ticks);
            let val = Number(noExponents(value).toLocaleString("en-US"));
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
          },
        },
        grid: {
          drawBorder: false,
          display: true,
          borderDash: (ctx) => (ctx.index == 0 ? [0] : [4]),
          drawTicks: false,
          color: parentCtx?.props?.darkModeState?.flag ? "#404040" : "#e5e5e6",
        },
      },
      x: {
        ticks: {
          font: "Inter-SemiBold",
          size: 10,
          lineHeight: 12,
          weight: 600,
          color: parentCtx?.props?.darkModeState?.flag ? "#7c7d81" : "#7c7d81",
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
          color: parentCtx?.props?.darkModeState?.flag ? "#7c7d81" : "#7c7d81",
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
          color: parentCtx?.props?.darkModeState?.flag ? "#7c7d81" : "#b0b1b3",
          callback: function (value, index, ticks) {
            let val = Number(noExponents(value).toLocaleString("en-US"));
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
          },
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
  // == coinbase hai tho #0052FF and == binance tho #F0B90B
  const data = {
    labels,
    datasets: [
      {
        data: arr
          ? arr?.map((e) => {
              if (e.total_fees_amount && e.chain?.default_asset_code) {
                return (
                  e.total_fees_amount *
                  assetPrices[e.chain.default_asset_code] *
                  currency?.rate
                );
              } else if (e.total_fees) {
                return e.total_fees * currency?.rate;
              } else {
                return 0;
              }
            })
          : [],
        backgroundColor: arr
          ? arr?.map((e) =>
              e?.exchange == "coinbase"
                ? "#0052FF4D"
                : e?.exchange == "binance"
                ? "#F0B90B4D"
                : e?.chain?.color + "4D"
            )
          : [],
        borderColor: arr
          ? arr?.map((e) =>
              e?.exchange == "coinbase"
                ? "#0052FF"
                : e?.exchange == "binance"
                ? "#F0B90B"
                : e.chain?.color
            )
          : [],
        defaultAssetCode: arr
          ? arr?.map((e) => e.chain?.default_asset_code)
          : [],
        borderWidth: 2,
        borderRadius: {
          topLeft: 6,
          topRight: 6,
        },
        borderSkipped: false,
        barThickness: 48,
        totalFeesAmount: arr
          ? arr?.map((e) => e.total_fees_amount * currency?.rate)
          : [],
        // totalAmount: arr.map((e) => e.total_amount * currency?.rate),
        totalVolume: arr ? arr?.map((e) => e.total_volume) : [],
      },
    ],
  };

  return [data, options, options2];
};

export const getCounterGraphData = (arr, parentCtx, isHome = false) => {
  let currency = JSON.parse(window.localStorage.getItem("currency"));
  //  const digit = numToCurrency(
  //    Math.round(Math.max(...arr.map((e) => e.total_fees * currency?.rate)))
  //  ).length;
  let digit = 3;

  const labels = arr?.map((e) => e._id);
  let GraphLogoImage = new Image();
  GraphLogoImage.src = GraphLogo;
  const options = {
    responsive: true,
    onHover: function (e) {
      const points = this.getElementsAtEventForMode(
        e,
        "index",
        { axis: "x", intersect: true },
        false
      );

      if (points.length) e.native.target.style.cursor = "pointer";
      else e.native.target.style.cursor = "default";
    },
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
        backgroundColor: parentCtx?.props?.darkModeState?.flag
          ? "#1A1A1A"
          : "white",
        // fontColor: '#000000',
        intersect: false,
        color: parentCtx?.props?.darkModeState?.flag ? "#7c7d81" : "#19191a",
        padding: 12,
        borderWidth: 1,
        borderColor: parentCtx?.props?.darkModeState?.flag
          ? "#2D2D2D"
          : "#E5E7EB",
        // boxPadding: 5,
        bodyFont: {
          family: "Inter-Medium",
          size: 11,
        },
        bodySpacing: 8,
        callbacks: {
          title: function () {}, //REMOVE TITLE
          label: (ctx) => {
            let label00 = ctx.label;
            if (ctx.label) {
              const testCharacter = ctx.label.charAt(0);
              if (
                !isNaN(testCharacter) ||
                testCharacter !== testCharacter.toUpperCase()
              ) {
                label00 = TruncateText(ctx.label);
              }
            }
            let labelClick = "Click to open";
            let label0 =
              "Fees: " +
              CurrencyType(false) +
              numToCurrency(ctx.dataset.totalFees[ctx.dataIndex]);
            let label1 =
              "Volume: " +
              CurrencyType(false) +
              numToCurrency(ctx.raw * currency.rate);
            if (parentCtx.state.callCounterpartyVolumeOverTime) {
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
              if (parentCtx.counterpartyVolumeOverTimeOff) {
                parentCtx.counterpartyVolumeOverTimeOff();
              }
            } else {
              if (parentCtx.feesOverTimeOn) {
                setTimeout(() => {
                  parentCtx.counterpartyVolumeOverTimeOn();
                }, 2000);
              }
            }
            if (
              ctx.dataset.clickAbleAddress &&
              ctx.dataset.clickAbleAddress[ctx.dataIndex] &&
              ctx.raw * currency.rate > 0
            ) {
              return [label00, label1, label0, labelClick];
            }
            return [label00, label1, label0];
          },
          labelColor: function (context) {
            return {
              padding: 10,
            };
          },
          labelTextColor: function (context) {
            return parentCtx?.props?.darkModeState?.flag
              ? "#7c7d81"
              : "#19191a";
          },
        },
      },
    },
    // watermark: {
    //   image: GraphLogoImage,

    //   x: 0,
    //   y: 30,

    //   width: 104,
    //   height: 39,

    //   opacity: 1,

    //   alignX: "middle",
    //   alignY: "middle",

    //   position: "back",
    // },
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
          display: isHome
            ? labels.length > 3
              ? false
              : true
            : labels.length > 8
            ? false
            : true,
          // display: false,
          // stepSize: 1500,
          padding: 8,
          size: 12,
          lineHeight: 20,
          family: "Inter-Medium",
          weight: 400,
          color: parentCtx?.props?.darkModeState?.flag ? "#7c7d81" : "#b0b1b3",
          callback: function (value, index, ticks) {
            let val = Number(noExponents(value).toLocaleString("en-US"));
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
          },
        },
        grid: {
          drawBorder: false,
          display: true,
          borderDash: (ctx) => (ctx.index == 0 ? [0] : [4]),
          drawTicks: false,
          color: parentCtx?.props?.darkModeState?.flag ? "#404040" : "#e5e5e6",
        },
      },
      x: {
        ticks: {
          font: "Inter-SemiBold",
          size: 10,
          lineHeight: 12,
          weight: 600,
          color: parentCtx?.props?.darkModeState?.flag ? "#7c7d81" : "#b0b1b3",
          maxRotation: 0,
          minRotation: 0,
          autoSkip: false,
          // Truncate x axis labels to solve overlapping issue
          callback: function (value, index, ticks) {
            return this.getLabelForValue(value)?.substr(0, 4) || "Other";
          },
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
          color: parentCtx?.props?.darkModeState?.flag ? "#7c7d81" : "#7c7d81",
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
          ctx.width = `${digit}` + 0;
        },
        ticks: {
          // stepSize: 1500,
          padding: 8,
          size: 12,
          lineHeight: 20,
          family: "Inter-Medium",
          weight: 400,
          color: parentCtx?.props?.darkModeState?.flag ? "#7c7d81" : "#b0b1b3",
          callback: function (value, index, ticks) {
            let val = Number(noExponents(value).toLocaleString("en-US"));
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
          },
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
        data: arr?.map((e) => e.total_volume * currency?.rate),
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
        totalFees: arr?.map((e) => e.total_fees * currency?.rate),
        clickAbleAddress: arr?.map((e) => e.clickable_address),
        // totalAmount: arr.map((e) => e.total_amount * currency?.rate),
        totalVolume: arr?.map((e) => e.total_volume),
        defaultAssetCode: arr?.map((e) => e?.chain?.default_asset_code),
      },
    ],
  };

  return [data, options, options2];
};

// export default getGraphData;
