import { CurrencyType, noExponents, numToCurrency } from "../../utils/ReusableFunctions";

const labels = [
  "Inflow",
  "Outflow",
  "Net",
];

const options = {
  chart: {
    type: "column",
    spacingBottom: 35,
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
    min: 0,
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
          // inflow
          y: 100000000,
          color: "rgba(100, 190, 205, 0.3)",
          borderColor: "#64BECD",
          borderWidth: 2,
        },
        {
          //  outfloe
          y: 50000000,
          color: "rgba(100, 190, 205, 0.3)",
          borderColor: "#64BECD",
          borderWidth: 2,
        },
        {
          // net
          y: 0,
          color: "rgba(100, 190, 205, 0.3)",
          borderColor: "#64BECD",
          borderWidth: 0,
        },
      ],
      maxPointWidth: 50,
      borderRadius: 5,
    },
    {
      name: "Asset Name 1",
      data: [
        {
          // inflow
          y: 100000000,
          color: "rgba(100, 190, 205, 0.3)",
          borderColor: "#64BECD",
          borderWidth: 2,
        },
        {
          //  outfloe
          y: 50000000,
          color: "rgba(100, 190, 205, 0.3)",
          borderColor: "#64BECD",
          borderWidth: 2,
        },
        {
          // net
          y: 0,
          color: "rgba(100, 190, 205, 0.3)",
          borderColor: "#64BECD",
          borderWidth: 0,
        },
      ],
      maxPointWidth: 50,
      borderRadius: 5,
    },
    {
      name: "Asset Name 1",
      data: [
        {
          // inflow
          y: 100000000,
          color: "rgba(100, 190, 205, 0.3)",
          borderColor: "#64BECD",
          borderWidth: 2,
        },
        {
          //  outfloe
          y: 50000000,
          color: "rgba(100, 190, 205, 0.3)",
          borderColor: "#64BECD",
          borderWidth: 2,
        },
        {
          // net
          y: 0,
          color: "rgba(100, 190, 205, 0.3)",
          borderColor: "#64BECD",
          borderWidth: 0,
        },
      ],
      maxPointWidth: 50,
      borderRadius: 5,
    },
    {
      name: "Asset Name 1",
      data: [
        {
          // inflow
          y: 100000000,
          color: "rgba(100, 190, 205, 0.3)",
          borderColor: "#64BECD",
          borderWidth: 2,
        },
        {
          //  outfloe
          y: 50000000,
          color: "rgba(100, 190, 205, 0.3)",
          borderColor: "#64BECD",
          borderWidth: 2,
        },
        {
          // net
          y: 0,
          color: "rgba(100, 190, 205, 0.3)",
          borderColor: "#64BECD",
          borderWidth: 0,
        },
      ],
      maxPointWidth: 50,
      borderRadius: 5,
    },
    {
      name: "Asset Name 1",
      data: [
        {
          // inflow
          y: 100000000,
          color: "rgba(100, 190, 205, 0.3)",
          borderColor: "#64BECD",
          borderWidth: 2,
        },
        {
          //  outfloe
          y: 50000000,
          color: "rgba(100, 190, 205, 0.3)",
          borderColor: "#64BECD",
          borderWidth: 2,
        },
        {
          // net
          y: 0,
          color: "rgba(100, 190, 205, 0.3)",
          borderColor: "#64BECD",
          borderWidth: 0,
        },
      ],
      maxPointWidth: 50,
      borderRadius: 5,
    },
  ],
};

export const info = [options];


export const getProfitLossAsset = (arr) => {
  // console.log(arr);
//   Find total inflows by calculating inflows.totalvolume
// Find total outflows by calculating outflows.totalvolume
// Find total fees by calculating fees.totalfees
// Net would be total outflows+ totalfees-totalinflows
  let fees = arr?.fees;
    
  let totalFees = 0;
  fees?.map((e) => (totalFees = totalFees + e.total_fees));

 
  let inFlows = arr?.inflows?.sort((a, b) => b.total_volume - a.total_volume);
  
  // push()
  
  let outFlows = arr?.outflows;
  outFlows.push({
    asset: {
      name: "Fees",
      color: "#000000",
    },
    total_volume: totalFees,
  });
    outFlows = arr?.outflows?.sort(
    (a, b) => b.total_volume - a.total_volume
  );

  let totalInflow = 0;
    inFlows?.map((e) => (totalInflow = totalInflow + e.total_volume));
  let totalOutflow = 0;
  outFlows?.map((e) => (totalOutflow = totalOutflow + e.total_volume));

  

  let totalNetflow = (totalOutflow + totalFees) - totalInflow;

  let topInflow = inFlows?.slice(0, 4);
  let topInFlowTotal = 0;
  topInflow?.map((e) => (topInFlowTotal = topInFlowTotal + e.total_volume));
   let otherInflow = totalInflow - topInFlowTotal;

// outflow
  let topOutflow = outFlows?.slice(0, 4);
  let topOutFlowTotal = 0;
  topOutflow?.map((e) => (topOutFlowTotal = topOutFlowTotal + e.total_volume));
  let otherOutflow = totalOutflow - topOutFlowTotal;

  console.log(
   
    "outflow",
    outFlows,
   
  );


const options = {
  chart: {
    type: "column",
    spacingBottom: 35,
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
    min: 0,
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
      // console.log("ctx", this);
      let tooltipData = [];

      let net_amount = this.x === "Inflow" ? totalInflow : this.x === "Outflow" ? totalOutflow : this.x === "Net" ? totalNetflow : 0;
      this.points.map((item) => {
        // console.log(
        //   "Item: ",
        //   item);
        if (item.key === "Other" && item.y > 0) {
          tooltipData.push({
            name: item.key,
            x: item.x,
            y: item.y,
            color: item?.point?.borderColor,
          });
        }
        else if (item.key !== "Other") {
          tooltipData.push({
            name: item.key,
            x: item.x,
            y: item.y,
            color: item?.point?.borderColor,
          });
        }
        
      });

      if (this.x === "Net") {
        tooltipData = tooltipData.slice(4, 5);
      }
        // console.log("sorted", tooltipData);

        // const tooltip_title = "Week";
        //  console.log("checking date", x_value, this.x, tooltip_title);
        return `<div class="top-section py-4" style="background-color:#ffffff; border: 1px solid #E5E5E6; border-radius:10px;box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.04);
backdrop-filter: blur(15px);">
                                <div class="line-chart-tooltip-section tooltip-section-blue w-100" style="background-color:#ffffff;">
                                <div class="inter-display-medium f-s-12 w-100 text-center px-4" style="color:#96979A; display:flex; justify-content:space-between"><b>${
                                  this.x
                                }</b> <b class="inter-display-semi-bold m-l-10" style="color:${
          this.x === "Net" ? tooltipData[0]?.color : "#16182B"
        };">${CurrencyType(false)}${numToCurrency(net_amount)}</b></div>${
          this.x !==
          "Net" ? `<div class="w-100 mt-3" style="height: 1px; background-color: #E5E5E680;"></div>`:""
        }
    ${
      this.x !== "Net"
        ? tooltipData
            .map((item) => {
              return `<div class="inter-display-medium f-s-13 w-100 pt-3 px-4">
                                    <span style='width:10px; height: 10px; border-radius: 50%; background-color:${
                                      item.color == "#ffffff"
                                        ? "#16182B"
                                        : item.color
                                    }; display: inline-block; margin-right: 0.6rem'> </span>
                                       ${item.name} <span style="color:${
                item.color == "#ffffff" ? "#16182B" : item.color
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
      // borderRadiusTopLeft: 10,
      //   	borderRadiusTopRight: 10,

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
          y: topInflow[0]?.total_volume,
          color: topInflow[0]?.asset?.color + "4D",
          borderColor: topInflow[0]?.asset?.color,
          borderWidth: 2,
          name: topInflow[0]?.asset?.name,
        },
        {
          y: topOutflow[0]?.total_volume,
          color: topOutflow[0]?.asset?.color + "4D",
          borderColor: topOutflow[0]?.asset?.color,
          borderWidth: 2,
          name: topOutflow[0]?.asset?.name,
        },
        {
          y: 0,
          color: "rgba(100, 190, 205, 0.3)",
          borderColor: "#64BECD",
          borderWidth: 0,
        },
      ],
      maxPointWidth: 50,
      borderRadius: 5,
    },
    {
      name: "Two",
      data: [
        {
          y: topInflow[1]?.total_volume,
          color: topInflow[1]?.asset?.color + "4D",
          borderColor: topInflow[1]?.asset?.color,
          borderWidth: 2,
          name: topInflow[1]?.asset?.name,
        },
        {
          y: topOutflow[1]?.total_volume,
          color: topOutflow[1]?.asset?.color + "4D",
          borderColor: topOutflow[1]?.asset?.color,
          borderWidth: 2,
          name: topOutflow[1]?.asset?.name,
        },
        {
          y: 0,
          color: "rgba(100, 190, 205, 0.3)",
          borderColor: "#64BECD",
          borderWidth: 0,
        },
      ],
      maxPointWidth: 50,
      borderRadius: 5,
    },
    {
      name: "Three",
      data: [
        {
          y: topInflow[2]?.total_volume,
          color: topInflow[2]?.asset?.color + "4D",
          borderColor: topInflow[2]?.asset?.color,
          borderWidth: 2,
          name: topInflow[2]?.asset?.name,
        },
        {
          y: topOutflow[2]?.total_volume,
          color: topOutflow[2]?.asset?.color + "4D",
          borderColor: topOutflow[2]?.asset?.color,
          borderWidth: 2,
          name: topOutflow[2]?.asset?.name,
        },
        {
          y: 0,
          color: "rgba(100, 190, 205, 0.3)",
          borderColor: "#64BECD",
          borderWidth: 0,
        },
      ],
      maxPointWidth: 50,
      borderRadius: 5,
    },
    {
      name: "Four",
      data: [
        {
          y: topInflow[3]?.total_volume,
          color: topInflow[3]?.asset?.color + "4D",
          borderColor: topInflow[3]?.asset?.color,
          borderWidth: 2,
          name: topInflow[3]?.asset?.name,
        },
        {
          y: topOutflow[3]?.total_volume,
          color: topOutflow[3]?.asset?.color + "4D",
          borderColor: topOutflow[3]?.asset?.color,
          borderWidth: 2,
          name: topOutflow[3]?.asset?.name,
        },
        {
          y: 0,
          color: "rgba(100, 190, 205, 0.3)",
          borderColor: "#64BECD",
          borderWidth: 0,
        },
      ],
      maxPointWidth: 50,
      borderRadius: 5,
    },

    {
      name: "Other",
      data: [
        {
          y: otherInflow,
          color: "#D6D8DE",
          borderColor: "#16182B",
          borderWidth: 2,
          name: "Other",
        },
        {
          y: otherOutflow,
          color: "#D6D8DE",
          borderColor: "#16182B",
          borderWidth: 2,
          name: "Other",
        },
        {
          y: Math.abs(totalNetflow),
          color: totalNetflow < 0 ? "#FFE0D9" : "#A9F4C4",
          borderColor: totalNetflow < 0 ? "#CF1011" : "#18C278",
          borderWidth: 2,
        },
      ],
      maxPointWidth: 50,
      borderRadius: 5,
    },
  ],
};

  return options;
  
}