import BaseReactComponent from "../../utils/form/BaseReactComponent";
// import PropTypes from 'prop-types';
import { connect } from "react-redux";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { GraphHeader } from "../common/GraphHeader";
import CoinBadges from "./../common/CoinBadges";
import DropDown from "../common/DropDown";
import TrendingUp from "../../assets/images/icons/TrendingUp.svg";
import TrendingDown from "../../assets/images/icons/TrendingDown.svg";
import { GroupByOptions, Months } from "../../utils/Constant";
import {
  AssetValueFilter,
  AssetValueHover,
  AssetValueInternalEvent,
  IntlAssetValueFilter,
  IntlAssetValueHover,
  IntlAssetValueInternalEvent,
  TitleAssetValueHover,
} from "../../utils/AnalyticsFunctions.js";
import { getCurrentUser } from "../../utils/ManageToken";
import moment from "moment";
import Loading from "../common/Loading";
import { CurrencyType, numToCurrency } from "../../utils/ReusableFunctions";
import { Image } from "react-bootstrap";
import CalenderIcon from "../../assets/images/calendar.svg";
import DoubleArrow from "../../assets/images/double-arrow.svg";
import handle from "../../assets/images/handle.svg";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import CustomDropdown from "../../utils/form/CustomDropdown";
class LineChartSlider extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      assetValueData: props.assetValueData,
      activeBadge: [{ name: "All", id: "" }],
      activeBadgeList: [],
      title: "Year",
      titleY: CurrencyType(),
      selectedEvents: [],
      selectedValue: null,
      legends: [],
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isUpdate !== this.props.isUpdate) {
      console.log("Something update");
      this.setState({
        title: "Year",
        selectedEvents: [],
      });
    }
  }

  handleFunction = (badge) => {

    let newArr = [...this.state.activeBadge];
    if (this.state.activeBadge.some((e) => e.name === badge.name)) {
      let index = newArr.findIndex((x) => x.name === badge.name);
      newArr.splice(index, 1);
      if (newArr.length === 0) {
        this.setState({
          activeBadge: [{ name: "All", id: "" }],
          activeBadgeList: [],
          selectedEvents: [],
          legends: [],
        });
      } else {
        this.setState({
          activeBadge: newArr,
          activeBadgeList: newArr.map((item) => item.id),
        });
      }
    } else if (badge.name === "All") {
      this.setState({
        activeBadge: [{ name: "All", id: "" }],
        activeBadgeList: [],
        selectedEvents: [],
        legends: [],
      });
    } else {
      let index = newArr.findIndex((x) => x.name === "All");
      if (index !== -1) {
        newArr.splice(index, 1);
      }
      newArr.push(badge);
      this.setState({
        activeBadge: newArr,
        activeBadgeList: newArr.map((item) => item.id),
        selectedEvents: [],
        legends: [],
      });
    }
    this.props.isPage
      ? IntlAssetValueFilter({
          session_id: getCurrentUser().id,
          email_address: getCurrentUser().email,
          filter_clicked: badge.name,
        })
      : AssetValueFilter({
          session_id: getCurrentUser().id,
          email_address: getCurrentUser().email,
          filter_clicked: badge.name,
        });
  };
  handleSelect = (opt) => {

    const t = opt.split(" ")[1];
    this.setState({
      title: t,
      selectedEvents: [],
    });
    this.props.handleGroupBy(t);
  };

  DropdownData = (arr) => {
    // console.log("dropdown arr", arr);
    this.setState({legends: arr})
  };

  render() {
    const { assetValueData, externalEvents } = this.props;
    const parent = this;
    let series = {};
    let timestampList = [];
    let assetMaster = {};
    let internalEvents = [];

    assetValueData &&
      assetValueData.map((assetData) => {
        if (
          this.state.activeBadgeList.includes(assetData.chain._id) ||
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
            // series[assetData.timestamp] = {};
          }

          assetData.assets.map((data) => {
            if (data.asset.id in assetMaster) {
              if (assetData.timestamp in assetMaster[data.asset.id]) {
                assetMaster[data.asset.id][assetData.timestamp] =
                  new Number(data.count) * data.asset_price +
                  assetMaster[data.asset.id][assetData.timestamp];
              } else {
                assetMaster[data.asset.id][assetData.timestamp] =
                  new Number(data.count) * data.asset_price;
              }
            } else {
              assetMaster[data.asset.id] = {
                assetDetails: data.asset,
                assetPrice: data.asset_price ? data.asset_price : 0,
                count: new Number(data.count) * data.asset_price,
              };
              assetMaster[data.asset.id][assetData.timestamp] =
                new Number(data.count) * data.asset_price;
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
      // console.log("year update", endYear);
      for (let year = startYear; year < endYear; year++) {
        years.push(moment(year, "YYYY").valueOf());
      }

      timestampList = [...years, ...timestampList];
      // console.log("year update", years);
      // console.log("l", timestampList);
    }

    // console.log("lastyear", endYear, "year list", years);
    for (const [key, value] of Object.entries(assetMaster)) {
      // seriesData.push({
      //   name: value.assetDetails.name,
      //   id: key,
      //   color: value.assetDetails.color,
      //   data: []
      // })
      let graphData = [];
      timestampList.map((timestamp) => {
        if (timestamp in value) {
          graphData.push(value[timestamp]);
        } else {
          graphData.push(0);
        }
      });

      seriesData.push({
        // linkedTo: key,
        name: value.assetDetails.name,
        id: key,
        type: "area",
        color: value.assetDetails.color,
        marker: {
          // enabled: true,
          symbol: "circle",
        },
        showInLegend: true,
        data: graphData,
        lastValue: graphData[graphData.length - 1],
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
    let UniqueEvents = [];
    const generatePlotLines = (abc) => {
      let y_value = 0;
      // console.log("yvalue", y_value);
      externalEvents &&
        externalEvents.map((event, index) => {
          let e_time = moment(event.timestamp).format("DD/MM/YYYY");
          let value = eval(categories.indexOf(abc));
          if (this.state.title == "Month") {
            e_time = moment(event.timestamp).format("MMMM YY");
            value += eval(
              (Number(moment(event.timestamp).format("DD")) / 30).toFixed(3)
            );
          }

          if (this.state.title == "Year") {
            e_time = moment(event.timestamp).format("YYYY");
          }

          // if (e_time == abc && !UniqueEvents.includes(abc) && event.is_highlighted) {

          if (
            e_time == abc &&
            event.is_highlighted &&
            this.state.title === "Year"
          ) {
            UniqueEvents.push(abc);
            y_value = Math.floor(Math.random() * (22 - 7 + 1) + 7) * 10;

            plotLines.push({
              color: "#E5E5E680",
              dashStyle: "solid",
              value: value,
              width: 0,
              label: {
                useHTML: true,

                formatter: function () {
                  return `<div style="border-left: 1px solid rgba(229, 229, 230, 0.5); height: ${y_value}px;"><div style="border-left: 2px solid #CACBCC; padding-left: 5px; z-index:2 !important;">${event.title.replace(
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
                  // "z-index": 100,
                },
              },
              zIndex: 4,
            });
          } else {
            if (e_time == abc && this.state.title !== "Year") {
              UniqueEvents.push(abc);
              y_value = Math.floor(Math.random() * (22 - 7 + 1) + 7) * 10;

              plotLines.push({
                color: "#E5E5E680",
                dashStyle: "solid",
                value: value,
                width: 0,
                label: {
                  useHTML: true,

                  formatter: function () {
                    return `<div style="border-left: 1px solid rgba(229, 229, 230, 0.5); height: ${y_value}px;"><div style="border-left: 2px solid #CACBCC; padding-left: 5px; z-index:2 !important;">${event.title.replace(
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
                    // "z-index": 100,
                  },
                },
                zIndex: 4,
              });
            }
          }
        });
    };

    let selectedEvents = [];
    let noOfInternalEvent;
    const getIevent = (value) => {
      selectedEvents = [];
      internalEvents &&
        internalEvents.map((item) => {
          let current = moment(item.timestamp).format("DD/MM/YYYY");
          // console.log("current", current, value);
          if (current === value) {
            // console.log("item", item);
            // console.log("item", item);
            // selectedEvents.push(item);
            item.event.map((a) => {
              let e_usd = a.asset.value * a.asset_price;
              let e_text = "";
              let e_assetValue = a.asset.value;
              let e_assetCode = a.asset.code;
              let e_tooltipData = "";
              let e_full_address = "";
              if (a.from || a.from_address) {
                if (a.from && a.from !== a.from_address) {
                  e_tooltipData = a.from + ": " + a.from_address;
                } else {
                  e_tooltipData = a.from_address;
                }
              } else {
                if (a.to && a.to !== a.to_address) {
                  e_tooltipData = a.to + ": " + a.to_address;
                } else {
                  e_tooltipData = a.to_address;
                }
              }

              let e_address = "";
              if (a.from || a.from_address) {
                e_address = a.from ? a.from : a.from_address;
                e_text = "from";
              } else {
                e_address = a.to ? a.to : a.to_address;
                e_text = "to";
              }
              e_full_address = e_address;
              if (e_address.length > 16) {
                e_address =
                  '"' +
                  e_address.substr(0, e_text === "from" ? 7 : 9) +
                  "..." +
                  e_address.substr(e_address.length - 7, e_address.length) +
                  '"';
              }
              // console.log("internal", a);
              selectedEvents.push({
                usd: e_usd,
                assetValue: e_assetValue,
                assetCode: e_assetCode,
                tooltip: e_tooltipData,
                text: e_text,
                address: e_address,
                fulladdress: e_full_address,
              });
            });
          }
        });

      selectedEvents =
        selectedEvents &&
        selectedEvents.sort((a, b) => {
          return b.usd - a.usd;
        });
      noOfInternalEvent = selectedEvents.length;
      selectedEvents = selectedEvents && selectedEvents.slice(0, 4);
      // console.log("No of internal event", noOfInternalEvent);
    };
    timestampList.map((time) => {
      let dummy = new Date(time);
      // console.log("time", time, "dummy", dummy);
      let abc;
      if (this.state.title === "Week" || this.state.title === "Day") {
        abc = moment(dummy).format("DD/MM/YYYY");
        // console.log("week and day", abc);
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

    // console.log("cat", categories);

    let SelectedSeriesData = [];
    seriesData =
      seriesData &&
      seriesData.sort((a, b) => {
        return b.lastValue - a.lastValue;
      });
    // console.log("All data", seriesData);

    let AllLegends = [{ label: "All", value: "All" }];
    seriesData &&
      seriesData.map((e) => {
        AllLegends.push({ label: e.name, value: e.name });
      });
    let topLegends = this.state.legends;
    // console.log("All Legends", AllLegends);
    SelectedSeriesData =
      topLegends.length === 0
        ? seriesData.slice(0, 4)
        : seriesData.filter((e) => topLegends.includes(e.name));
    // console.log("new", SelectedSeriesData);
    // console.log("categories", categories);
    let selectedValue = null;
    //  seriesData = seriesData;
    var UNDEFINED;
    const options = {
      title: {
        text: null,
      },
      chart: {
        type: "column",
        events: {
          click: function (event) {
            // console.log("event click", parent.state.selectedValue);
            if (parent.state.title == "Week" || parent.state.title == "Day") {
              console.log("event inside");
              if (parent.state.selectedValue !== selectedValue) {
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
                // console.log("inside event click");
                parent.setState({
                  selectedEvents: selectedEvents,
                  selectedValue: selectedValue,
                });
              } else {
                console.log("reset");
                parent.setState({
                  selectedEvents: [],
                  selectedValue: null,
                });
              }
            }
          },
        },
        zoomType: "x",
      },
      credits: {
        enabled: false,
      },
      rangeSelector: {
        enabled: false,
        selected: 1,
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
        categories: categories,
        type: "category", // Other types are "logarithmic", "datetime" and "category",
        labels: {
          formatter: function () {
            // console.log("categories", categories);
            // console.log("value", categories[this.pos]);
            // console.log("this", this);
            return parent.state.title === "Day" &&
              categories[this.pos] !== undefined
              ? moment(categories[this.pos], "DD/MM/YYYY").format("DD/MM/YY")
              : categories[this.pos];
          },
          autoRotation: false,
          // step: 2,
          // autoRotationLimit: 0,
          // style: {
          //   whiteSpace: "nowrap",
          //   textOverflow: "none",
          // },
        },
        crosshair: {
          width: 1,
          color: "#B0B1B3",
          dashStyle: "Dash",
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
        plotLines: plotLines,
      },

      yAxis: {
        title: {
          text: null,
        },
        opposite: false,
        offset: 70,
        gridLineDashStyle: "longdash",
        labels: {
          formatter: function () {
            // // console.log(
            // //   "yaxis",
            // //   this.value,
            // //   Highcharts.numberFormat(this.value, -1, UNDEFINED, ",")
            // );
            return Highcharts.numberFormat(this.value, -1, UNDEFINED, ",");
          },
          x: 0,
          y: 4,
          align: "left",
        },
      },
      legend: {
        enabled: true,
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
        // borderWidth: 1,
        padding: 0,
        shadow: false,
        hideDelay: 0,

        formatter: function () {
          let walletAddress = JSON.parse(localStorage.getItem("addWallet")).map(
            (e) => e.address
          );

          let tooltipData = [];

          const x_value =
            categories[this.x] == undefined ? this.x : categories[this.x];

          getIevent(x_value);
          selectedValue = x_value;
          // console.log("value", x_value, "walter address", walletAddress);
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
          this.points.map((item) => {
            // console.log(
            //   "Item: ",
            //   item);
            tooltipData.push({
              name: item.series.userOptions.name,
              x: item.x,
              y: item.y,
              color: item.series.userOptions.color,
            });
          });
          tooltipData.sort((a, b) => parseFloat(b.y) - parseFloat(a.y));
          // console.log("sorted", tooltipData);

          const tooltip_title =
            parent.state.title === "Week" || parent.state.title === "Day"
              ? moment(x_value, "DD/MM/YYYY").format("DD MMMM YY")
              : x_value;
          //  console.log("checking date", x_value, this.x, tooltip_title);
          return `<div class="top-section py-4" style="background-color:#ffffff; border: 1px solid #E5E5E6; border-radius:10px;">
                                <div class="line-chart-tooltip-section tooltip-section-blue w-100" style="background-color:#ffffff;">
                                <div class="inter-display-medium f-s-12 w-100 text-center" style="color:#96979A;"><b>${tooltip_title}</b></div><div class="w-100 mt-3" style="height: 1px; background-color: #E5E5E680;"></div>
                                ${tooltipData
                                  .map((item) => {
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
                                    }"> ${CurrencyType(false)} ${numToCurrency(item.y)}</span>
                                    </div>`;
                                  })
                                  .join(" ")}
                            </div>
                        </div>`;
        },
      },
      series: SelectedSeriesData,
      plotOptions: {
        series: {
          fillOpacity: 0,
          // events: {
          //    legendItemClick: function () {
          //       // console.log(this);
          //       //  console.log("this");
          //       // parent.setState({
          //       //   selectedEvents: [],
          //       // });
          //     }
          // },
          point: {
            events: {
              click: function () {
                if (
                  parent.state.title == "Week" ||
                  parent.state.title == "Day"
                ) {
                  if (parent.state.selectedValue !== selectedValue) {
                    AssetValueInternalEvent({
                      session_id: getCurrentUser().id,
                      email_address: getCurrentUser().email,
                      no_of_events: noOfInternalEvent,
                    });
                    console.log("inside event click");
                    parent.setState({
                      selectedEvents: selectedEvents,
                      selectedValue: selectedValue,
                    });
                  } else {
                    console.log("reset");
                    parent.setState({
                      selectedEvents: [],
                      selectedValue: null,
                    });
                  }
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
    return (
      <div className="welcome-card-section lineChartSlider">
        {this.props.graphLoading ? (
          <Loading />
        ) : (
          <>
            <div
              className="line-chart-section"
              style={{ padding: "0rem 4.8rem" }}
              // onMouseLeave={() => {
              //   this.resetEvent();
              // }}
            >
              {!this.props.isPage && (
                <GraphHeader
                  title="Asset Value"
                  subtitle="Updated 3mins ago"
                  isArrow={true}
                  isAnalytics="Asset Value"
                  handleClick={this.props.handleClick}
                />
              )}
              <CoinBadges
                activeBadge={this.state.activeBadge}
                chainList={this.props.OnboardingState.coinsList}
                handleFunction={this.handleFunction}
                isScrollVisible={this.props.isScrollVisible}
              />
              <div className="chart-y-selection" style={{ width: "100%" }}>
                <span className="inter-display-semi-bold f-s-10 lh-12 grey-7C7 line-chart-dropdown-y-axis">
                  {CurrencyType()}
                </span>
                <span
                  style={{
                    width: "15%",
                    position: "absolute",
                    right: "0px",
                    zIndex: "1",
                  }}
                >
                  <CustomDropdown
                    filtername="Tokens"
                    options={AllLegends}
                    action={null}
                    selectedTokens={this.state.legends}
                    handleClick={(arr) => this.DropdownData(arr)}
                    isLineChart={true}
                  />
                </span>
              </div>
              <HighchartsReact
                highcharts={Highcharts}
                options={options}
                constructorType={"stockChart"}
                // allowChartUpdate={true}
                // updateArgs={[true]}
              />
              <div className="chart-x-selection">
                <DropDown
                  class="line-chart-dropdown"
                  list={["Year", "Month", "Day"]}
                  // list={GroupByOptions}
                  onSelect={this.handleSelect}
                  title={this.state.title}
                  activetab={this.state.title}
                />
              </div>
            </div>
            {this.state.selectedEvents.length > 0 && (
              <>
                <div className="ChartDivider"></div>
                <div className="SliderChartBottom">
                  <h4 className="inter-display-semi-bold f-s-16 lh-19 grey-313">
                    <Image src={CalenderIcon} />
                    Largest Internal Events
                    {this.state.selectedValue &&
                      ": " +
                        moment(this.state.selectedValue, "DD/MM/YYYY").format(
                          "MMM DD, YYYY"
                        )}
                  </h4>

                  <div className="InternalEventWrapper">
                    {this.state.selectedEvents.length > 0 &&
                      this.state.selectedEvents.map((event, i) => {
                        // console.log("first event", event);

                        let count =
                          Math.trunc(event.assetValue).toString().length > 6
                            ? 0
                            : 6 -
                              Math.trunc(event.assetValue).toString().length;
                        return (
                          <>
                            <div
                              className="GreyChip"
                              key={i}
                              style={{
                                width: `${
                                  this.state.selectedEvents.length === 1
                                    ? "100%"
                                    : ""
                                }`,
                              }}
                            >
                              <h5 className="inter-display-bold f-s-13 lh-16 black-191">
                                <Image src={DoubleArrow} />
                                Transfer
                              </h5>

                              <p className="inter-display-medium f-s-13 lh-16 grey-B4D">
                                <span>
                                  {event.assetValue.toFixed(count)}{" "}
                                  {event.assetCode}
                                  {` or ${CurrencyType(false)}`}
                                  {numToCurrency(event.usd)}
                                  {event.text === "from"
                                    ? " received from "
                                    : " transferred to "}{" "}
                                </span>
                                <CustomOverlay
                                  position="top"
                                  // className={"coin-hover-tooltip"}
                                  isIcon={false}
                                  isInfo={true}
                                  isText={true}
                                  text={event.tooltip}
                                >
                                  <span style={{ cursor: "pointer" }}>
                                    {this.state.selectedEvents.length === 1
                                      ? event.fulladdress
                                      : event.address}
                                  </span>
                                </CustomOverlay>
                              </p>
                            </div>
                          </>
                        );
                      })}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  OnboardingState: state.OnboardingState,
});
export default connect(mapStateToProps)(LineChartSlider);
// export default LineChartSlider;
