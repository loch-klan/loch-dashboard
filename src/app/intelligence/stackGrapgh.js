import { CurrencyType, numToCurrency } from "../../utils/ReusableFunctions";

const labels = [
  "Inflow",
  "Outflow",
  "Net",
];

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
      intersect: true,
      enabled: false,
      external: (ctx) => {
        console.log(ctx)

        return `<div style="color:red;">title</div>`
      },
    },
  },

  scales: {
    y: {
      //   min: 0,
      //   max: 500,
      stacked: false,
      // stacked: true,
      ticks: {
        display: true,
        // stepSize: 125,
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
      stacked: true,
      offset: "none",
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
      max: 1,
      ticks: {
        //   font: "Inter-SemiBold",
        //   size: 10,
        //   lineHeight: 12,
        //   weight: 600,
        //   color: "#86909C",
        //   maxRotation: 0,
        //   minRotation: 0,
        //   autoSkip: false,
        display: false,
      },
      grid: {
        display: false,
        //   borderWidth: 1,
      },
    },
    y: {
      min: 0,
      max: 500,
      afterFit: (ctx) => {
        ctx.width = 30;
      },
      ticks: {
        stepSize: 125,
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
      label: "first",
      data: [100, 150,null],
      backgroundColor: [
        "rgba(100, 190, 205, 0.3)",
        "rgba(34, 151, 219, 0.3)",
       
      ],
      borderColor: ["red", "red","red"],
      borderWidth: 2,
      borderRadius: {
        topLeft: 6,
        topRight: 6,
      },
      borderSkipped: false,
      barThickness: 48,
    },
    {
      label: "second",
      data: [150, 100, null],
      backgroundColor: [
        "rgba(100, 190, 205, 0.3)",
        "rgba(34, 151, 219, 0.3)",
      ],
      borderColor: ["green", "green","green"],
      borderWidth: 2,
      borderRadius: {
        topLeft: 6,
        topRight: 6,
      },
      borderSkipped: false,
      barThickness: 48,
    },
    {
      data: [null,null,50],
      backgroundColor: ["rgba(100, 10, 205, 0.3)"],
      borderColor: ["#64BECD"],
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

export const info = [data, options, options2];
