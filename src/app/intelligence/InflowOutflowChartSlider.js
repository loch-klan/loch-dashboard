import BaseReactComponent from "../../utils/form/BaseReactComponent";
import { connect } from "react-redux";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { GraphHeader } from "../common/GraphHeader";

import GraphLogo from "../../assets/images/graph-logo.svg";
import {
  AssetValueHover,
  AssetValueInternalEvent,
  HomeAssetValueNavigator,
  IntlAssetValueDay,
  IntlAssetValueHover,
  IntlAssetValueInternalEvent,
  IntlAssetValueMonth,
  IntlAssetValueNavigator,
  IntlAssetValueYear,
} from "../../utils/AnalyticsFunctions.js";
import { getCurrentUser } from "../../utils/ManageToken";
import moment from "moment";
import Loading from "../common/Loading";
import {
  CurrencyType,
  noExponents,
  numToCurrency,
} from "../../utils/ReusableFunctions";
import handle from "../../assets/images/handle.svg";
import { BarGraphFooter } from "../common/BarGraphFooter";
import {
  AssetChartInflowIcon,
  AssetChartOutflowIcon,
} from "../../assets/images/icons";
require("highcharts/modules/annotations")(Highcharts);

class InflowOutflowChartSlider extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      currency: JSON.parse(localStorage.getItem("currency")),
      userWallet: JSON.parse(localStorage.getItem("addWallet")),
      assetValueData: props.assetValueData,
      activeBadge: [{ name: "All", id: "" }],
      activeBadgeList: [],
      title: "Day",
      titleY: CurrencyType(),
      selectedValue: null,
      legends: [],
      steps: this.props.hideTimeFilter ? 6 : 1,
      plotLineHide: 0,
      rangeSelected: 1,
      isTokenSearchUsed: false,
      isChainSearchUsed: false,
    };
  }
  chainSearchIsUsed = () => {
    this.setState({ isChainSearchUsed: true });
  };
  tokenSearchIsUsed = () => {
    this.setState({ isTokenSearchUsed: true });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.isUpdate !== this.props.isUpdate) {
      this.setState({
        title: "Day",

        steps: this.props.hideTimeFilter ? 6 : 1,
        rangeSelected: 1,
      });
    }
  }

  handleSelect = (opt) => {
    let t = "Day";
    if (opt.target.id === 0) {
      t = "Year";
      IntlAssetValueYear({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
      if (this.props.updateTimer) {
        this.props.updateTimer();
      }
    } else if (opt.target.id === 1) {
      t = "Month";
      IntlAssetValueMonth({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
      if (this.props.updateTimer) {
        this.props.updateTimer();
      }
    } else if (opt.target.id === 2) {
      t = "Day";
      IntlAssetValueDay({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
      if (this.props.updateTimer) {
        this.props.updateTimer();
      }
    } else {
      t = "Day";
    }
    this.setState({
      title: t,

      steps: this.props.hideTimeFilter ? 6 : 1,
      rangeSelected: 1,
    });
    this.props.handleGroupBy(t);
  };

  render() {
    const { assetValueData, externalEvents } = this.props;

    const parent = this;
    let timestampList = [];
    let assetMaster = {};
    let internalEvents = [];

    let currentDate =
      this.state.title === "Year"
        ? moment().format("YYYY")
        : this.state.title === "Month"
        ? moment().format("MMMM YYYY")
        : moment().format("DD/MM/YYYY");

    assetValueData &&
      assetValueData?.forEach((assetData) => {
        if (
          this.state.activeBadgeList.includes(assetData?.chain?._id) ||
          this.state.activeBadgeList.length === 0
        ) {
          if (assetData.events && assetData.events.length > 0) {
            internalEvents.push({
              timestamp: assetData.timestamp,
              event: assetData.events,
            });
          }

          if (!timestampList.includes(assetData.timestamp)) {
            timestampList.push(assetData.timestamp);
          }

          assetData.assets?.forEach((data) => {
            let dataCount =
              this.state.title === "Year" &&
              moment(assetData.timestamp).format("YYYY") === currentDate
                ? data.count
                : this.state.title === "Month" &&
                  moment(assetData.timestamp).format("MMMM YYYY") ===
                    currentDate
                ? data.count
                : data.max_count;

            if (data.asset.id in assetMaster) {
              if (assetData.timestamp in assetMaster[data.asset.id]) {
                assetMaster[data.asset.id][assetData.timestamp] =
                  new Number(dataCount) *
                    (data.asset_price * (this.state.currency?.rate || 1)) +
                  assetMaster[data.asset.id][assetData.timestamp];
              } else {
                assetMaster[data.asset.id][assetData.timestamp] =
                  new Number(dataCount) *
                  (data.asset_price * (this.state.currency?.rate || 1));
              }
            } else {
              assetMaster[data.asset.id] = {
                assetDetails: data.asset,
                assetPrice: data.asset_price
                  ? data.asset_price * (this.state.currency?.rate || 1)
                  : 0,
                count:
                  new Number(dataCount) *
                  (data.asset_price * (this.state.currency?.rate || 1)),
              };
              assetMaster[data.asset.id][assetData.timestamp] =
                new Number(dataCount) *
                (data.asset_price * (this.state.currency?.rate || 1));
            }
          });
        }
      });

    let seriesData = [];
    timestampList.sort((a, b) => {
      return a - b;
    });

    if (this.state.title === "Year" && timestampList.length != 0) {
      const startYear = 2009;
      const endYear = moment(timestampList[0]).format("YYYY");
      const years = [];

      for (let year = startYear; year < endYear; year++) {
        years.push(moment(year, "YYYY").valueOf());
      }

      timestampList = [...years, ...timestampList];
    } else if (this.state.title === "Month" && timestampList.length != 0) {
      const endMonth = 12 - timestampList.length;

      const currentMonth = moment(timestampList[0]);
      let months = [];

      for (let month = 0; month < endMonth; month++) {
        const month_value = currentMonth
          .subtract(1, "months")
          .format("MMMM YYYY");
        months.push(month_value);
      }

      timestampList = [...months.reverse(), ...timestampList];
    } else if (this.state.title === "Day" && timestampList.length != 0) {
      let dates = [];
      const endDay = 30 - timestampList.length;
      const currentDay = moment(timestampList[0]);

      for (let day = 0; day < endDay; day++) {
        const date = currentDay.subtract(1, "days").valueOf();
        dates.push(date);
      }

      timestampList = [...dates.reverse(), ...timestampList];
    }

    for (const [key, value] of Object.entries(assetMaster)) {
      let graphData = [];
      timestampList?.forEach((timestamp) => {
        if (timestamp in value) {
          graphData.push(value[timestamp]);
        } else {
          graphData.push(0);
        }
      });

      seriesData.push({
        name: value.assetDetails.code,
        id: key,
        type: "area",

        fillOpacity: 0.1,
        // color: value.assetDetails.color,
        color: "#5ABE7E",
        marker: {
          symbol: "circle",
        },
        showInLegend: true,
        data: graphData,
        lastValue: graphData[graphData.length - 1],
        assetName: value.assetDetails.name,
      });
    }

    let yaxis_max = 0;
    let max = 0;
    let plotdata;
    for (let i = 0; i < seriesData.length; i++) {
      plotdata = seriesData[i].data;
      max = Math.max(...plotdata);
      if (yaxis_max < max) {
        yaxis_max = max;
      }
    }

    let categories = [];
    let plotLines = [];
    let UniqueEvents = 0;
    let isLast = false;
    const generatePlotLines = (abc) => {
      let y_value = 0;

      externalEvents &&
        externalEvents?.forEach((event, index) => {
          let e_time = moment(event.timestamp).format("DD/MM/YYYY");
          let value = eval(categories.indexOf(abc));

          if (this.state.title === "Month") {
            e_time = moment(event.timestamp).format("MMMM YY");
            value += eval(
              (Number(moment(event.timestamp).format("DD")) / 30).toFixed(3)
            );
          }

          if (this.state.title === "Year") {
            e_time = moment(event.timestamp).format("YYYY");
          }

          if (
            e_time === abc &&
            event.is_highlighted &&
            this.state.title === "Year"
          ) {
            isLast =
              eval(categories.indexOf(abc)) === timestampList.length - 1
                ? true
                : false;

            y_value = UniqueEvents === 0 ? 120 : 220;
            UniqueEvents = UniqueEvents === 1 ? 0 : 1;

            plotLines.push({
              color: "#E5E5E680",
              dashStyle: "solid",
              value: value,
              width: 0,
              showLastLabel: true,
              label: {
                useHTML: true,

                formatter: function () {
                  return `<div style="border-left: 1px solid rgba(229, 229, 230, 0.5); height: ${y_value}px;"><div style="border-left: 2px solid #CACBCC; padding-left: 5px; z-index:2 !important; display:flex; width:90px; overflow-wrap: anywhere; white-space: normal;">${event.title.replace(
                    /([^ ]+) ([^ ]+)/g,
                    "$1 $2<br>"
                  )}</div></div>`;
                },

                align: "left",
                y: -(y_value - 13),
                x: 0,
                rotation: 0,
                verticalAlign: "bottom",
                style: {
                  fontFamily: "Inter-Medium",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#CACBCC",
                },
              },
              zIndex: 4,
            });
          } else {
            if (e_time === abc && this.state.title !== "Year") {
              isLast =
                eval(categories.indexOf(abc)) === timestampList.length - 1
                  ? true
                  : false;

              y_value = UniqueEvents === 0 ? 120 : 220;
              UniqueEvents = UniqueEvents === 1 ? 0 : 1;

              plotLines.push({
                color: "#E5E5E680",
                dashStyle: "solid",
                value: value,
                width: 0,
                label: {
                  useHTML: true,

                  formatter: function () {
                    return `<div style="border-left: 1px solid rgba(229, 229, 230, 0.5); height: ${y_value}px;"><div style="border-left: 2px solid #CACBCC; padding-left: 5px; z-index:2 !important; display:flex; width:90px; overflow-wrap: anywhere; white-space: normal;">${event.title.replace(
                      /([^ ]+) ([^ ]+)/g,
                      "$1 $2<br>"
                    )}</div></div>`;
                  },

                  align: "left",
                  y: -(y_value - 13),
                  x: 0,
                  rotation: 0,
                  verticalAlign: "bottom",
                  style: {
                    fontFamily: "Inter-Medium",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#CACBCC",
                  },
                },
                zIndex: 4,
              });
            }
          }
        });
    };

    let noOfInternalEvent;

    timestampList?.forEach((time) => {
      let dummy = new Date(time);

      let abc;
      if (this.state.title === "Week" || this.state.title === "Day") {
        abc = moment(dummy).format("DD/MM/YYYY");

        categories.push(abc);
        generatePlotLines(abc);
      }
      if (this.state.title === "Month") {
        abc = moment(dummy).format("MMMM YY");

        categories.push(abc);
        generatePlotLines(abc);
      }
      if (this.state.title === "Year") {
        abc = dummy.getFullYear();

        categories.push(abc);
        generatePlotLines(abc);
      }
    });

    let updatedPlotLine = [];
    let count = 0;
    if (this.state.plotLineHide === 1 && isLast) {
      count = plotLines.length - this.state.plotLineHide;
      updatedPlotLine = plotLines.slice(0, count);
    } else if (this.state.plotLineHide === 2 && plotLines.length > 10) {
      updatedPlotLine = plotLines.slice(0, 10);
    } else {
      updatedPlotLine = plotLines;
    }

    let SelectedSeriesData = [];
    let SelectedAnnotationsData = [];
    seriesData =
      seriesData &&
      seriesData.sort((a, b) => {
        return b.lastValue - a.lastValue;
      });

    let AllLegends = [{ label: "All", value: "All" }];
    seriesData &&
      seriesData?.forEach((e) => {
        AllLegends.push({ label: e.name, value: e.id });
      });

    let topLegends =
      this.state.legends.length === 0
        ? AllLegends.slice(1, 5).map((e) => e.value)
        : this.state.legends;

    SelectedSeriesData =
      topLegends.length === 0
        ? seriesData.slice(0, 4)
        : seriesData.filter((e) => topLegends.includes(e.id));

    let totalData = [];
    let otherData = [];

    seriesData?.forEach((e) => {
      e?.data.forEach((value, i) => {
        totalData[i] = totalData[i] ? totalData[i] + value : value;
      });

      if (!topLegends.includes(e.id)) {
        e?.data.forEach((value, i) => {
          otherData[i] = otherData[i] ? otherData[i] + value : value;
        });
      }
    });

    if (otherData.length !== 0) {
      SelectedSeriesData = [
        ...SelectedSeriesData,
        {
          name: "Other",
          id: 1,
          type: "area",

          fillOpacity: 0.1,
          color: "#16182B",
          marker: {
            symbol: "circle",
          },
          showInLegend: true,
          data: otherData,
          lastValue: otherData[otherData.length - 1],
          assetName: "Other",
        },
      ];
    }

    SelectedSeriesData = SelectedSeriesData.sort((a, b) => {
      return b.lastValue - a.lastValue;
    });
    if (SelectedSeriesData && SelectedSeriesData.length > 0) {
      SelectedSeriesData = [SelectedSeriesData[0]];
      const tempAnnotationArr = [];
      SelectedSeriesData[0].data.forEach((curPoint, index) => {
        let tempHolder = {
          point: {
            xAxis: 0,
            yAxis: 0,
            x: index,
            y: curPoint,
          },
          useHTML: true,
          formatter: function () {
            return `<div class="inflowOutflowChartAnnotationContainer">
                <img class="inflowOutflowChartAnnotation" src="${
                  index % 2 === 0 ? AssetChartInflowIcon : AssetChartOutflowIcon
                }" />
                <div class="inflowOutflowChartAnnotationBox top-section py-4" style="background-color:#ffffff; border: 1px solid #E5E5E6; border-radius:10px;box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.04);
                backdrop-filter: blur(15px);">
                  <div class="line-chart-tooltip-section tooltip-section-blue w-100" style="background-color:#ffffff;">
                    <div class="inter-display-medium f-s-12 w-100 text-center px-4" style="color:#96979A; display:flex; justify-content:space-between"><b>13 March 22</b> <b class="inter-display-semi-bold m-l-10" style="color:#16182B;">$200</b></div><div class="w-100 mt-3" style="height: 1px; background-color: #E5E5E680;"></div>
                    <div class="inter-display-medium f-s-13 w-100 pt-3 px-4" style="display:flex; justify-content:space-between" >
                    <div>
                      <img style='width:20px; height: 20px; display: inline-block; margin-right: 0.6rem' src="${
                        index % 2 === 0
                          ? AssetChartInflowIcon
                          : AssetChartOutflowIcon
                      }" />
                      Inflow
                    </div>
                    <div style="color:#16182B">$5</div>
                    </div>
                  </div>
                </div>`;
          },
          backgroundColor: "transparent",
          borderColor: "transparent",
          className: "highcharts-no-tooltip",
          x: 0,
          y: 0,
          padding: 0,
          shape: "rect",
          verticalAlign: "bottom",
        };
        tempAnnotationArr.push(tempHolder);
      });
      console.log("SelectedSeriesData ", SelectedSeriesData);
      SelectedAnnotationsData = {
        draggable: "",
        labels: tempAnnotationArr,
      };
      console.log("SelectedAnnotationsData ", SelectedAnnotationsData);
    }
    let selectedValue = null;
    const options = {
      title: {
        text: null,
      },
      chart: {
        type: "area",
        spacingTop: this.props.hideTimeFilter ? 40 : 10,
        events: {
          click: function (event) {
            if (parent.state.selectedValue !== selectedValue) {
              if (parent.props.updateTimer) {
                parent.props.updateTimer();
              }
              parent.props.isPage
                ? IntlAssetValueInternalEvent({
                    session_id: getCurrentUser().id,
                    email_address: getCurrentUser().email,
                    no_of_events: noOfInternalEvent,
                  })
                : AssetValueInternalEvent({
                    session_id: getCurrentUser().id,
                    email_address: getCurrentUser().email,
                    no_of_events: noOfInternalEvent,
                  });

              parent.setState({
                selectedValue: selectedValue,
              });
            } else {
              parent.setState({
                selectedValue: null,
              });
            }
          },
          load: function () {
            const renderer = this.renderer;
            const imageWidth = 104;
            const imageHeight = 39;
            const chartWidth = this.chartWidth;
            const chartHeight = this.chartHeight;

            const x = (chartWidth - imageWidth) / 2;
            const y = (chartHeight - imageHeight) / 2.5;

            renderer
              .image(GraphLogo, x, y, imageWidth, imageHeight)
              .attr({})
              .add();
          },
        },

        zoomType: "x",
      },
      credits: {
        enabled: false,
      },
      rangeSelector: {
        enabled: false,
        selected: parent.state.rangeSelected,
      },
      scrollbar: {
        enabled: true,
        height: 6,
        barBackgroundColor: "transparent",
        barBorderRadius: 4,
        barBorderWidth: 0,
        trackBackgroundColor: "transparent",
        trackBorderWidth: 0,
        trackBorderRadius: 10,
        trackBorderColor: "transparent",
        rifleColor: "transparent",
        margin: 150,
      },
      xAxis: {
        events: {
          setExtremes(e) {
            let diff = Math.round(e.max - e.min);

            if (parent.props.hideTimeFilter) {
              HomeAssetValueNavigator({
                session_id: getCurrentUser().id,
                email_address: getCurrentUser().email,
              });
              if (parent.props.updateTimer) {
                parent.props.updateTimer();
              }
            } else {
              if (diff >= 9 && diff < 11 && parent.state.plotLineHide !== 1) {
                parent.setState({
                  plotLineHide: 1,
                });

                IntlAssetValueNavigator({
                  session_id: getCurrentUser().id,
                  email_address: getCurrentUser().email,
                });
                if (parent.props.updateTimer) {
                  parent.props.updateTimer();
                }
              } else {
                if (diff < 9 && parent.state.plotLineHide !== 0) {
                  parent.setState({
                    plotLineHide: 0,
                  });
                  IntlAssetValueNavigator({
                    session_id: getCurrentUser().id,
                    email_address: getCurrentUser().email,
                  });
                  if (parent.props.updateTimer) {
                    parent.props.updateTimer();
                  }
                }
              }

              if (diff <= 11 && parent.state.steps !== 1) {
                parent.setState({
                  steps: 1,
                });
                IntlAssetValueNavigator({
                  session_id: getCurrentUser().id,
                  email_address: getCurrentUser().email,
                });
                if (parent.props.updateTimer) {
                  parent.props.updateTimer();
                }
              } else {
                if (diff > 20 && parent.state.steps !== 3) {
                  parent.setState({
                    steps: 3,
                  });
                  IntlAssetValueNavigator({
                    session_id: getCurrentUser().id,
                    email_address: getCurrentUser().email,
                  });
                  if (parent.props.updateTimer) {
                    parent.props.updateTimer();
                  }
                }
              }
            }
          },
        },

        categories: categories,

        labels: {
          formatter: function () {
            return parent.state.title === "Day" &&
              categories[this.pos] !== undefined
              ? moment(categories[this.pos], "DD/MM/YYYY").format("MM/DD/YY")
              : categories[this.pos];
          },
          autoRotation: false,
          step: parent.state.steps,
        },
        crosshair: {
          width: 1,
          color: "#B0B1B3",
          dashStyle: "Dash",
          cursor: "pointer",
        },
        scrollbar: {
          enabled: true,
          height: 6,
          barBackgroundColor: "#19191A33",
          barBorderRadius: 4,
          barBorderWidth: 0,
          trackBackgroundColor: "transparent",
          trackBorderWidth: 0,
          trackBorderRadius: 10,
          trackBorderColor: "#19191A33",
          rifleColor: "transparent",
          margin: 20,
          minWidth: 0,
        },
        min: categories.length > 4 ? categories.length - 5 : 0,
        max: categories.length - 0.5,

        plotLines: updatedPlotLine,
      },

      yAxis: {
        title: {
          text: null,
        },
        showLastLabel: true,
        opposite: false,
        offset: this.props.hideTimeFilter ? 20 : 40,
        gridLineDashStyle: "longdash",
        stackLabels: {
          enabled: false,
        },
        labels: {
          formatter: function () {
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
      },
      legend: {
        enabled: this.props.hideTimeFilter ? false : true,
        x: -120,

        align: "right",
        verticalAlign: "top",
        itemStyle: {
          fontFamily: "Inter-SemiBold",
          fontSize: "10px",
          color: "#636467",
          fontWeight: "600",
          lineHeight: "12px",
        },
        symbolHeight: 10,
        symbolWidth: 10,
        symbolRadius: 6,
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

        padding: 0,
        shadow: false,
        hideDelay: 0,

        formatter: function () {
          let walletAddress = JSON.parse(
            localStorage.getItem("addWallet")
          )?.map((e) => e.address);

          let tooltipData = [];

          const x_value =
            categories[this.x] === undefined ? this.x : categories[this.x];

          selectedValue = x_value;

          parent.props.isPage
            ? IntlAssetValueHover({
                session_id: getCurrentUser().id,
                email_address: getCurrentUser().email,
                value: x_value,
                address: walletAddress,
              })
            : AssetValueHover({
                session_id: getCurrentUser().id,
                email_address: getCurrentUser().email,
                value: x_value,
                address: walletAddress,
              });

          if (parent.props.updateTimer) {
            parent.props.updateTimer();
          }
          let net_amount = 0;
          this.points?.forEach((item) => {
            tooltipData.push({
              name: item.series.userOptions.assetName,
              x: item.x,
              y: item.y,
              color: item.series.userOptions.color,
            });
            net_amount += item.y;
          });
          tooltipData.sort((a, b) => parseFloat(b.y) - parseFloat(a.y));

          const tooltip_title =
            parent.state.title === "Week" || parent.state.title === "Day"
              ? moment(x_value, "DD/MM/YYYY").format("MMMM DD, YYYY")
              : x_value;

          return `<div class="top-section py-4" style="background-color:#ffffff; border: 1px solid #E5E5E6; border-radius:10px;box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.04);
                                backdrop-filter: blur(15px);">
                                <div class="line-chart-tooltip-section tooltip-section-blue w-100" style="background-color:#ffffff;">
                                <div class="inter-display-medium f-s-12 w-100 text-center px-4" style="color:#96979A; display:flex; justify-content:space-between"><b>${tooltip_title}</b> <b class="inter-display-semi-bold m-l-10" style="color:#16182B;">${CurrencyType(
            false
          )}${numToCurrency(
            net_amount
          )}</b></div><div class="w-100 mt-3" style="height: 1px; background-color: #E5E5E680;"></div>
                                ${tooltipData
                                  ?.map((item) => {
                                    return `<div class="inter-display-medium f-s-13 w-100 pt-3 px-4">
                                    <span style='width:10px; height: 10px; border-radius: 50%; background-color:${
                                      item.color === "#ffffff"
                                        ? "#16182B"
                                        : item.color
                                    }; display: inline-block; margin-right: 0.6rem'> </span>
                                       ${item.name} <span style="color:${
                                      item.color === "#ffffff"
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
        },
      },
      series: SelectedSeriesData,
      annotations: [SelectedAnnotationsData],
      plotOptions: {
        series: {
          stacking: "normal",

          cursor: "pointer",
          fillOpacity: 0,
          point: {
            events: {
              click: function () {
                if (parent.state.selectedValue !== selectedValue) {
                  AssetValueInternalEvent({
                    session_id: getCurrentUser().id,
                    email_address: getCurrentUser().email,
                    no_of_events: noOfInternalEvent,
                  });

                  parent.setState({
                    selectedValue: selectedValue,
                  });
                } else {
                  parent.setState({
                    selectedValue: null,
                  });
                }
              },
            },
          },

          marker: {
            enabled: false,
            states: {
              hover: {
                enabled: false,
              },
            },
          },
        },
      },
      navigator: {
        margin: 1,
        height: 30,
        outlineColor: "#E5E5E6",
        outlineWidth: 0,
        maskFill: "rgba(25, 25, 26, 0.4)",
        stickToMax: false,
        handles: {
          lineWidth: 0,
          width: 7,
          height: 16,
          symbols: [`url(${handle})`, `url(${handle})`],
        },
        xAxis: {
          visible: true,
          labels: {
            enabled: false,
          },
          gridLineWidth: 0,
          plotBands: [
            {
              from: -100,
              to: 10000,
              color: "rgba(229, 229, 230, 0.5)",
            },
          ],
        },
        series: {
          color: "#B0B1B3",
          lineWidth: 2,
          type: "areaspline",
          fillOpacity: 1,
          lineColor: "#B0B1B3",
          dataGrouping: {
            groupPixelWidth: 0,
          },
          lineWidth: 0,
          marker: {
            enabled: false,
          },
          dataLabels: {
            enabled: false,
          },
        },
      },
    };

    const minVersion = { padding: "3.2rem 3.2rem 0rem 3.2rem" };
    const minVersionSection = {
      minHeight: "51rem",
      marginBottom: 0,
      width: "100%",
      minWidth: "100%",
      padding: 0,
      boxShadow: "none",
    };
    return (
      <div
        className="welcome-card-section lineChartSlider"
        style={this.props.hideTimeFilter ? minVersionSection : {}}
      >
        <>
          <div
            className="line-chart-section"
            style={
              !this.props.hideTimeFilter
                ? {
                    padding: "0rem 4.8rem",
                  }
                : minVersion
            }
          >
            {!this.props.isPage && (
              <GraphHeader
                title="Asset value"
                subtitle="Analyze your portfolio value over time"
                isArrow={true}
                isAnalytics="Asset Value"
                handleClick={this.props.handleClick}
              />
            )}

            {this.props.graphLoading ? (
              <div
                style={{
                  height: "30rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Loading />
              </div>
            ) : (
              <>
                {!this.props.hideTimeFilter && (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "2rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <BarGraphFooter
                          handleFooterClick={this.handleSelect}
                          active={this.state.title}
                          footerLabels={[
                            "Max",
                            "5 Years",
                            "1 Year",
                            "6 Months",
                            "1 Month",
                            "1 Week",
                          ]}
                          lineChart={true}
                        />
                      </div>
                    </div>
                  </>
                )}
                <div
                  className="chart-y-selection"
                  style={
                    this.props.hideTimeFilter
                      ? { width: "100%", marginTop: "0.5rem" }
                      : { width: "100%" }
                  }
                >
                  <span className="inter-display-semi-bold f-s-10 lh-12 grey-7C7 line-chart-dropdown-y-axis">
                    {CurrencyType()}
                  </span>
                </div>

                <HighchartsReact
                  highcharts={Highcharts}
                  options={options}
                  constructorType={"stockChart"}
                />
              </>
            )}
          </div>
        </>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  OnboardingState: state.OnboardingState,
});
export default connect(mapStateToProps)(InflowOutflowChartSlider);
