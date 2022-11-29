import { numToCurrency } from "../../utils/ReusableFunctions";

const getGraphData = (arr) => {
    // console.log(arr, "array");

    const digit = (""+Math.round(Math.max(...arr.map((e) => e.total_fees)))).length;
    // console.log(digit, "indise digit")
    const labels = arr.map((e) => e.chain.name);

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
          callbacks: {
            label: (ctx) => {
              // console.log(ctx.raw);
              return "$" + numToCurrency(ctx.raw);
            },
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
          data: arr.map((e) => e.total_fees),
          backgroundColor: arr.map((e) => e.chain.color + "4D"),
          borderColor: arr.map((e) => e.chain.color),
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

    return [data, options, options2]

}

export default getGraphData;