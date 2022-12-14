import { numToCurrency } from "../../utils/ReusableFunctions";
import arrowUpRight from '../../assets/images/icons/arrowUpRight.svg'
import arrowDownRight from '../../assets/images/icons/arrow-down-right.svg'

export const getProfitAndLossData = (arr) => {
    const labels = ["Inflows", "Outflows", arr.inflows < arr.outflows ? "Profit" : "Loss"];
    const profitOrLossData = {
        profit:{
            data:arr.inflows,
            barColor:"#A9F4C4",
            borderColor:"#18C278"
        },
        loss:{
            data:arr.outflows,
            barColor:"#FFE0D9",
            borderColor:"#CF1011"
        }
    };
    const data = {
        labels,
        datasets: [
            {
                data: [arr.inflows, arr.outflows ,Math.abs(arr.outflows-arr.inflows)],
                backgroundColor: [
                    "rgba(100, 190, 205, 0.3)",
                    "rgba(34, 151, 219, 0.3)",
                    (arr.inflows < arr.outflows ? profitOrLossData.profit.barColor : profitOrLossData.loss.barColor),
                ],
                borderColor: [
                    "#64BECD",
                    "#2297DB",
                    (arr.inflows < arr.outflows ? profitOrLossData.profit.borderColor : profitOrLossData.loss.borderColor),
                ],
                borderWidth: 2,
                borderRadius: {
                    topLeft: 6,
                    topRight: 6
                },
                borderSkipped: false,
                barThickness:48,

            }
        ]
    }

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
                let label = ctx.label + ": $" + numToCurrency(ctx.raw);
                return [label];
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
              family: "Inter-Regular",
              weight: 400,
              color: "#B0B1B3",
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
      let value = (arr.outflows-arr.inflows);
      let showPercentage= {
        icon: value > 0 ? arrowUpRight : arrowDownRight,
        percent: ((value/arr.inflows)*100).toFixed(),
        status: value > 0 ? "Increase" : "Decrease",
      }
    return [data,options, showPercentage]
}