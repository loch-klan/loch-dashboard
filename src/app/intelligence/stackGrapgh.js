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
            title: function (ctx) {
                //   console.log("title", ctx);
            }, //REMOVE TITLE
            label: (ctx) => {
                let label = ctx.label;
                console.log("ctx", ctx);
                let tooltip_title = "title";
                let tooltipData = [];
            
                [...Array(4)].map(e => {
                    tooltipData.push({
                        name: "Name",
                        x: 12,
                        y: 123,
                        color: "#2967E3",
                    });
                })
               return `<div class="inter-display-semi-bold f-s-10 w-100 text-center"  style="color:#96979A; background-color:#ffffff; border: 1px solid #E5E5E6; border-radius:8px; margin-bottom:4px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.04);
backdrop-filter: blur(15px); padding:1rem 2rem;">Asset Breakdown</div>
                  <div class="top-section py-4" style="background-color:#ffffff; border: 1px solid #E5E5E6; border-radius:10px;box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.04);
backdrop-filter: blur(15px);">
                                <div class="tooltip-section-blue w-100" style="background-color:#ffffff; display:flex;
                    flex-direction: column;
                    justify-content: left;
                    padding: 0.4rem 0.8rem;
                    border-radius: 0.4rem;">
                                <div class="inter-display-medium f-s-12 w-100 text-center px-4" style="color:#96979A;><b>${tooltip_title}</b></div><div class="w-100 mt-3" style="height: 1px; background-color: #E5E5E680;"></div>
                                ${tooltipData
                                  ?.map((item) => {
                                    return `<div class="inter-display-medium f-s-13 w-100 pt-3 px-4">
                                    <span style='width:10px; height: 10px; border-radius: 50%; background-color:${
                                      item.color == "#ffffff"
                                        ? "#16182B"
                                        : item.color
                                    }; display: inline-block; margin-right: 0.6rem'> </span>
                                       ${item.name} <span style="color:${
                                      item.color == "#ffffff"
                                        ? "#16182B"
                                        : item.color
                                    }"> ${CurrencyType(false)}${numToCurrency(
                                      item.y
                                    )}</span>
                                    </div>`;
                                  })
                                  .join(" ")}
                            </div>
                        </div>`;
         
                               
        }
        
      },
    },
  },

  scales: {
    y: {
      //   min: 0,
      //   max: 500,
      stacked: false,
      //   stacked: true,
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
