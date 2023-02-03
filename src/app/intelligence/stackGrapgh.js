import { CurrencyType, numToCurrency } from "../../utils/ReusableFunctions";

const labels = [
  "Inflow",
  "Outflow",
  "Net",
];

const options = {
  chart: {
    type: "column",
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
    min: 0,
    title: {
      text: null,
    },
    stackLabels: {
      enabled: false,
    },
    label: {
      x: 0,
      y: 4,
      align: "right",
      style: {
        fontSize: 12,
        fontFamily: "Inter-Medium",
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
      let tooltipData = [];

      let net_amount = 0;
      [...Array(5)].map((item) => {
        // console.log(
        //   "Item: ",
        //   item);
        tooltipData.push({
          name: "Asset name",
          x: 100,
          y: 150,
          color: "red",
        });
      });

      // console.log("sorted", tooltipData);

      const tooltip_title = "Week";
      //  console.log("checking date", x_value, this.x, tooltip_title);
      return `<div class="inter-display-semi-bold f-s-10 w-100 text-center"  style="color:#96979A; background-color:#ffffff; border: 1px solid #E5E5E6; border-radius:8px; margin-bottom:4px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.04);
backdrop-filter: blur(15px); padding:1rem 2rem;">Asset Breakdown</div><div class="top-section py-4" style="background-color:#ffffff; border: 1px solid #E5E5E6; border-radius:10px;box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.04);
backdrop-filter: blur(15px);">
                                <div class="line-chart-tooltip-section tooltip-section-blue w-100" style="background-color:#ffffff;">
                                <div class="inter-display-medium f-s-12 w-100 text-center px-4" style="color:#96979A; display:flex; justify-content:center"><b>${tooltip_title}</b></div><div class="w-100 mt-3" style="height: 1px; background-color: #E5E5E680;"></div>
    ${tooltipData
      .map((item) => {
        return `<div class="inter-display-medium f-s-13 w-100 pt-3 px-4">
                                    <span style='width:10px; height: 10px; border-radius: 50%; background-color:${
                                      item.color == "#ffffff"
                                        ? "#16182B"
                                        : item.color
                                    }; display: inline-block; margin-right: 0.6rem'> </span>
                                       ${item.name} <span style="color:${
          item.color == "#ffffff" ? "#16182B" : item.color
        }">${item.y}</span>
                                    </div>`;
      })
      .join(" ")}
                            </div>
                        </div>`;
    },
  },
  legend: false,
  plotOptions: {
    series: {
      // stacking: "normal",
       grouping: false,
      // borderRadiusTopLeft: 10,
      //   	borderRadiusTopRight: 10,

      dataLabels: {
        enabled: false,
      },
    },
  },
  series: [
    {
      name: "Asset Name 1",
      data: [
        {
          y: 100,
          color: "rgba(100, 190, 205, 0.3)",
          borderColor: "#64BECD",
          borderWidth: 2,
        },
        {
          y: 100,
          color: "rgba(100, 190, 205, 0.3)",
          borderColor: "#64BECD",
          borderWidth: 2,
        },
        {
          y: 0,
          color: "rgba(100, 190, 205, 0.3)",
          borderColor: "#64BECD",
          borderWidth: 2,
        },
      ],
      maxPointWidth: 50,
      borderRadius: 5,
    },
    {
      name: "Asset Name 2",
      data: [
        {
          y: 200,
          color: "rgba(34, 151, 219, 0.3)",
          borderColor: "#2297DB",
          borderWidth: 2,
        },
        {
          y: 100,
          color: "rgba(34, 151, 219, 0.3)",
          borderColor: "#2297DB",
          borderWidth: 2,
        },
        {
          y: 0,
          color: "rgba(34, 151, 219, 0.3)",
          borderColor: "#2297DB",
          borderWidth: 2,
        },
      ],
      maxPointWidth: 50,
      borderRadius: 5,
    },
    {
      name: "Asset Name 3",
      data: [
        {
          y: 300,
          color: "rgba(114, 87, 211, 0.3)",
          borderColor: "#7257D3",
          borderWidth: 2,
        },
        {
          y: 100,
          color: "rgba(114, 87, 211, 0.3)",
          borderColor: "#7257D3",
          borderWidth: 2,
        },
        {
          y: 500,
          color: "rgba(114, 87, 211, 0.3)",
          borderColor: "#7257D3",
          borderWidth: 2,
        },
      ],
      maxPointWidth: 50,
      borderRadius: 5,
    },
  ],
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

export const info = [options];
