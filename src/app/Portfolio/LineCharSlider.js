import BaseReactComponent from "../../utils/form/BaseReactComponent";
// import PropTypes from 'prop-types';
import { connect } from "react-redux";
// import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import { GraphHeader } from "../common/GraphHeader";

import moment from "moment";
import { Image } from "react-bootstrap";
import { toast } from "react-toastify";
import CopyClipboardIcon from "../../assets/images/CopyClipboardIcon.svg";
import CalenderIcon from "../../assets/images/calendar.svg";
import DoubleArrow from "../../assets/images/double-arrow.svg";
import GraphLogo from "../../assets/images/graph-logo.svg";
import handle from "../../assets/images/handle.svg";
import { ChartSeeMoreArrowIcon, LoaderIcon } from "../../assets/images/icons";
import {
  AssetValueChartWalletOpen,
  AssetValueFilter,
  AssetValueHover,
  AssetValueInternalEvent,
  HomeAssetValueNavigator,
  IntlAssetValueAssetFilter,
  IntlAssetValueDay,
  IntlAssetValueFilter,
  IntlAssetValueHover,
  IntlAssetValueInternalEvent,
  IntlAssetValueMonth,
  IntlAssetValueNavigator,
  IntlAssetValueYear,
} from "../../utils/AnalyticsFunctions.js";
import { BASE_URL_S3 } from "../../utils/Constant.js";
import { getCurrentUser } from "../../utils/ManageToken";
import {
  CurrencyType,
  noExponents,
  numToCurrency,
  openAddressInSameTab,
} from "../../utils/ReusableFunctions";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import CustomDropdown from "../../utils/form/CustomDropdown";
import Loading from "../common/Loading";
import AssetValueEmailModal from "./AssetValueEmailModal";
import SwitchButton from "./SwitchButton";

class LineChartSlider extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      currency: JSON.parse(window.localStorage.getItem("currency")),
      userWallet: JSON.parse(window.localStorage.getItem("addWallet")),
      assetValueData: props.assetValueData,
      activeBadge: [{ name: "All", id: "" }],
      activeBadgeList: [],
      title: "Day",
      titleY: CurrencyType(),
      selectedEvents: [],
      selectedValue: null,
      legends: [],
      steps: this.props.hideTimeFilter ? 6 : 1,
      plotLineHide: 0,
      rangeSelected: 1,
      isTokenSearchUsed: false,
      isChainSearchUsed: false,
      emailLoader: false,
    };
  }
  chainSearchIsUsed = () => {
    this.setState({ isChainSearchUsed: true });
  };
  tokenSearchIsUsed = () => {
    this.setState({ isTokenSearchUsed: true });
  };
  componentDidMount() {
    this.setState({
      emailLoader: !this.props.dataLoaded,
    });
  }
  componentDidUpdate(prevProps) {
    if (prevProps.isUpdate !== this.props.isUpdate) {
      // console.log("Something update");
      this.setState({
        title: "Day",
        selectedEvents: [],
        steps: this.props.hideTimeFilter ? 6 : 1,
        rangeSelected: 1,
      });
    }
    if (prevProps.dataLoaded !== this.props.dataLoaded) {
      this.setState({
        emailLoader: !this.props.dataLoaded,
      });
    }
  }

  handleFunction = (badge) => {
    if (badge?.[0].name === "All") {
      this.setState({
        activeBadge: [{ name: "All", id: "" }],
        activeBadgeList: [],
        selectedEvents: [],
        legends: [],
      });
    } else {
      this.setState({
        activeBadge: badge,
        activeBadgeList: badge?.map((item) => item.id),
        legends: [],
        selectedEvents: [],
      });
    }
    const tempIsSearchUsed = this.state.isChainSearchUsed;
    if (this.props.updateTimer) {
      this.props.updateTimer();
    }
    this.props.isPage
      ? IntlAssetValueFilter({
          session_id: getCurrentUser().id,
          email_address: getCurrentUser().email,
          filter_clicked: badge?.map((item) => item?.name),
          isSearchUsed: tempIsSearchUsed,
        })
      : AssetValueFilter({
          session_id: getCurrentUser().id,
          email_address: getCurrentUser().email,
          filter_clicked: badge?.map((item) => item?.name),
          isSearchUsed: tempIsSearchUsed,
        });

    this.setState({ isChainSearchUsed: false });
  };
  handleSelect = (opt) => {
    // console.log("opt", opt.target.id);
    //  let t = opt.split(" ")[1];
    let t = "Day";
    if (opt.target.id == 0) {
      t = "Year";
      IntlAssetValueYear({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
      if (this.props.updateTimer) {
        this.props.updateTimer();
      }
    } else if (opt.target.id == 1) {
      t = "Month";
      IntlAssetValueMonth({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
      if (this.props.updateTimer) {
        this.props.updateTimer();
      }
    } else if (opt.target.id == 2) {
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
      selectedEvents: [],
      steps: this.props.hideTimeFilter ? 6 : 1,
      rangeSelected: 1,
    });
    this.props.handleGroupBy(t);
  };

  DropdownData = (arr) => {
    // console.log("dropdown arr", arr);
    this.setState(
      {
        legends: arr[0]?.name === "All" ? [] : arr?.map((e) => e?.id),
        selectedEvents: [],
      },
      () => {
        const tempIsSearchUsed = this.state.isTokenSearchUsed;
        IntlAssetValueAssetFilter({
          session_id: getCurrentUser().id,
          email_address: getCurrentUser().email,
          filter_clicked:
            arr[0]?.name === "All" ? [] : arr?.map((e) => e?.name),
          isSearchUsed: tempIsSearchUsed,
        });
        if (this.props.updateTimer) {
          this.props.updateTimer();
        }
        this.setState({ isTokenSearchUsed: false });
      }
    );
  };

  copyContent = (text) => {
    // const text = props.display_address ? props.display_address : props.wallet_account_number
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Copied");
        // console.log("successfully copied");
      })
      .catch(() => {
        // console.log("something went wrong");
      });
    // toggleCopied(true)
  };
  handleAskEmail = () => {
    this.setState({
      EmailModal: !this.state.EmailModal,
    });
  };
  getSteps = (catLength) => {
    let diff = Math.round(catLength);
    if (diff <= 7) {
      return 1 + (this.props.hideTimeFilter ? 1 : 0);
    } else {
      if (diff > 200) {
        return 23 + (this.props.hideTimeFilter ? 23 : 0);
      } else if (diff > 190) {
        return 22 + (this.props.hideTimeFilter ? 22 : 0);
      } else if (diff > 180) {
        return 21 + (this.props.hideTimeFilter ? 21 : 0);
      } else if (diff > 170) {
        return 20 + (this.props.hideTimeFilter ? 20 : 0);
      } else if (diff > 160) {
        return 19 + (this.props.hideTimeFilter ? 19 : 0);
      } else if (diff > 150) {
        return 18 + (this.props.hideTimeFilter ? 18 : 0);
      } else if (diff > 140) {
        return 17 + (this.props.hideTimeFilter ? 17 : 0);
      } else if (diff > 130) {
        return 16 + (this.props.hideTimeFilter ? 16 : 0);
      } else if (diff > 120) {
        return 15 + (this.props.hideTimeFilter ? 15 : 0);
      } else if (diff > 110) {
        return 14 + (this.props.hideTimeFilter ? 14 : 0);
      } else if (diff > 100) {
        return 13 + (this.props.hideTimeFilter ? 13 : 0);
      } else if (diff > 90) {
        return 12 + (this.props.hideTimeFilter ? 12 : 0);
      } else if (diff > 80) {
        return 11 + (this.props.hideTimeFilter ? 11 : 0);
      } else if (diff > 70) {
        return 10 + (this.props.hideTimeFilter ? 10 : 0);
      } else if (diff > 60) {
        return 9 + (this.props.hideTimeFilter ? 9 : 0);
      } else if (diff > 50) {
        return 8 + (this.props.hideTimeFilter ? 8 : 0);
      } else if (diff > 40) {
        return 7 + (this.props.hideTimeFilter ? 7 : 0);
      } else if (diff > 30) {
        return 6 + (this.props.hideTimeFilter ? 6 : 0);
      } else if (diff > 20) {
        return 5 + (this.props.hideTimeFilter ? 5 : 0);
      } else if (diff > 15) {
        return 4 + (this.props.hideTimeFilter ? 4 : 0);
      } else if (diff > 10) {
        return 3 + (this.props.hideTimeFilter ? 3 : 0);
      } else if (diff > 7) {
        return 2 + (this.props.hideTimeFilter ? 2 : 0);
      }
    }
  };
  render() {
    const { assetValueData, externalEvents } = this.props;
    // console.log("test")
    const parent = this;
    let series = {};
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
      assetValueData?.map((assetData) => {
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
            // series[assetData.timestamp] = {};
          }

          assetData.assets?.map((data) => {
            let dataCount =
              this.state.title === "Year" &&
              moment(assetData.timestamp).format("YYYY") === currentDate
                ? data.count
                : this.state.title === "Month" &&
                  moment(assetData.timestamp).format("MMMM YYYY") ===
                    currentDate
                ? data.count
                : data.count;

            //     if (
            //       (this.state.title === "Year" &&
            //         moment(assetData.timestamp).format("YYYY") === currentDate) ||
            //       (this.state.title === "Month" &&
            //         moment(assetData.timestamp).format("MMMM YYYY") ===
            //           currentDate) ||
            //       (this.state.title === "Day" &&
            //         moment(assetData.timestamp).format("DD/MM/YYYY") ===
            //           currentDate)
            //     ) {
            //       console.log(
            //         "data count api",
            //         data.count,
            //         "data max count",
            //         data.max_count,
            //         "data count",
            //         dataCount,
            //         "current date",
            //         currentDate,
            //         "date",
            //         this.state.title === "Year"
            //           ? moment(assetData.timestamp).format("YYYY")
            //           :this.state.title === "Month"
            // ? moment().format("MMMM YYYY")
            // : moment().format("DD/MM/YYYY")
            //       );
            //     }

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

    // console.log("before", timestampList);
    if (this.state.title === "Year" && timestampList.length != 0) {
      // const startYear = 1992;
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
    }
    // else if (this.state.title === "Day" && timestampList.length != 0) {
    //   let dates = [];
    //   const endDay = 30 - timestampList.length;
    //   const currentDay = moment(timestampList[0]);
    //   // console.log("tets",endDay);
    //   for (let day = 0; day < endDay; day++) {
    //     const date = currentDay.subtract(1, "days").valueOf();
    //     dates.push(date);
    //   }
    //   // dates = dates.reverse;
    //   timestampList = [...dates.reverse(), ...timestampList];
    //   // console.log("dates update", dates);
    //   // console.log("l", timestampList);
    // }

    // console.log("assetmaster", assetMaster);

    for (const [key, value] of Object.entries(assetMaster)) {
      // seriesData.push({
      //   name: value.assetDetails.name,
      //   id: key,
      //   color: value.assetDetails.color,
      //   data: []
      // })
      let graphData = [];
      timestampList?.map((timestamp) => {
        if (timestamp in value) {
          graphData.push(value[timestamp]);
        } else {
          graphData.push(0);
        }
      });

      seriesData.push({
        // linkedTo: key,
        name: value.assetDetails.code,
        code: value.assetDetails.name,
        id: key,
        type: "area",
        // type: "areaspline",
        fillOpacity: 0.1,
        color: value.assetDetails.color,
        marker: {
          // enabled: true,
          symbol: "circle",
        },
        showInLegend: true,
        data: graphData,
        lastValue: graphData[graphData.length - 1],
        assetName: value.assetDetails.name,
        // lastValue: Math.max(...graphData),
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
    let mySteps = 1;
    let plotLines = [];
    let UniqueEvents = 0;
    let isLast = false;
    const generatePlotLines = (abc) => {
      let y_value = 0;
      // console.log("yvalue", y_value);
      externalEvents &&
        externalEvents?.map((event, index) => {
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
            isLast =
              eval(categories.indexOf(abc)) === timestampList.length - 1
                ? true
                : false;

            // y_value = Math.floor(Math.random() * (22 - 7 + 1) + 7) * 10;
            y_value = UniqueEvents === 0 ? 120 : 220;
            UniqueEvents = UniqueEvents === 1 ? 0 : 1;
            // console.log("unE", UniqueEvents)
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
                  // "z-index": 100,
                },
              },
              zIndex: 4,
            });
          } else {
            if (e_time == abc && this.state.title !== "Year") {
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
        internalEvents?.map((item) => {
          // console.log("item", item)
          let current = "";
          if (this.state.title === "Year") {
            current = moment(item.timestamp).format("YYYY");
            //  console.log("current", current, value);
          } else if (this.state.title === "Month") {
            current = moment(item.timestamp).format("MMM YY");
            //  console.log("current", current, value);
          } else {
            current = moment(item.timestamp).format("DD/MM/YYYY");
          }

          if (current == value) {
            // selectedEvents.push(item);
            item.event?.map((a, index) => {
              let e_usd =
                a.asset.value *
                (a.asset_price * (this.state.currency?.rate || 1));
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
                e_full_address = a.from_address;
                e_text = "from";
              } else {
                e_address = a.to ? a.to : a.to_address;
                e_full_address = a.to_address;
                e_text = "to";
              }
              // if (e_address.length > 16) {
              //   e_address =
              //     '"' +
              //     e_address.substr(0, e_text === "from" ? 7 : 9) +
              //     "..." +
              //     e_address.substr(e_address.length - 7, e_address.length) +
              //     '"';
              // }
              let temp_e_address = e_address.toString();
              if (e_address.toString().length > 4) {
                temp_e_address = e_address.toString().slice(0, 5);
              }
              // console.log("internal", a);
              selectedEvents.push({
                usd: e_usd,
                assetValue: e_assetValue,
                assetCode: e_assetCode,
                tooltip: e_tooltipData,
                text: e_text,
                // address: e_address,
                address: temp_e_address,
                fulladdress: e_full_address,
              });
            });
          }
        });
      // console.log("all eve", selectedEvents)
      selectedEvents =
        selectedEvents &&
        selectedEvents.sort((a, b) => {
          return b.usd - a.usd;
        });
      noOfInternalEvent = selectedEvents.length;
      selectedEvents =
        selectedEvents &&
        selectedEvents.slice(0, this.props.hideTimeFilter ? 4 : 10);
    };
    timestampList?.map((time) => {
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
        abc = moment(dummy).format("MMM YY");

        categories.push(abc);
        generatePlotLines(abc);
      }
      if (this.state.title === "Year") {
        abc = dummy.getFullYear();

        categories.push(abc);
        generatePlotLines(abc);
      }
    });
    mySteps = this.getSteps(categories.length);
    // console.log("category", categories);
    let updatedPlotLine = [];
    let count = 0;
    if (this.state.plotLineHide === 1 && isLast) {
      // console.log("1st");
      count = plotLines.length - this.state.plotLineHide;
      updatedPlotLine = plotLines.slice(0, count);
    } else if (this.state.plotLineHide == 2 && plotLines.length > 10) {
      // console.log("all 10");
      updatedPlotLine = plotLines.slice(0, 10);
    } else {
      // console.log("default");
      updatedPlotLine = plotLines;
    }

    let SelectedSeriesData = [];
    seriesData =
      seriesData &&
      seriesData.sort((a, b) => {
        return b.lastValue - a.lastValue;
      });

    let AllLegends = [{ label: "All", value: "All" }];
    seriesData &&
      seriesData?.forEach((e) => {
        AllLegends.push({ label: e.name, value: e.id, code: e.code });
      });

    let topLegends =
      this.state.legends.length === 0
        ? AllLegends.slice(1, 5).map((e) => e.value)
        : this.state.legends;
    // console.log("top", topLegends);

    SelectedSeriesData =
      topLegends.length === 0
        ? seriesData.slice(0, 4)
        : seriesData.filter((e) => topLegends.includes(e.id));

    let totalData = [];
    let otherData = [];

    seriesData?.map((e) => {
      // calculate total
      e?.data.map((value, i) => {
        totalData[i] = totalData[i] ? totalData[i] + value : value;
      });

      // calculate others
      if (!topLegends.includes(e.id)) {
        e?.data.map((value, i) => {
          otherData[i] = otherData[i] ? otherData[i] + value : value;
        });
      }
    });

    if (otherData.length !== 0) {
      SelectedSeriesData = [
        ...SelectedSeriesData,
        {
          // linkedTo: key,
          name: "Other",
          id: 1,
          type: "area",
          // type: "areaspline",
          fillOpacity: 0.1,
          color: "#16182B",
          marker: {
            // enabled: true,
            symbol: "circle",
          },
          showInLegend: true,
          data: otherData,
          lastValue: otherData[otherData.length - 1],
          assetName: "Other",
          // lastValue: Math.max(...graphData),
        },
      ];
    }

    // total plot
    // {
    //    // linkedTo: key,
    //    name: "Total",
    //    id: 2,
    //    type: "area",
    //    // type: "areaspline",
    //    fillOpacity: 0.1,
    //    color: "#CF1011",
    //    marker: {
    //      // enabled: true,
    //      symbol: "circle",
    //    },
    //    showInLegend: true,
    //    data: totalData,
    //    lastValue: totalData[totalData.length - 1],
    //    assetName: "Total",
    //    // lastValue: Math.max(...graphData),
    //  },

    SelectedSeriesData = SelectedSeriesData.sort((a, b) => {
      return b.lastValue - a.lastValue;
    });
    // console.log(seriesData)

    // AllLegends = [{ label: "All", value: "All" }, ...AllLegends.sort((a, b) => (a.label > b.label ? 1 : -1))];

    // console.log("all legend", SelectedSeriesData);
    let selectedValue = null;

    var UNDEFINED;
    const options = {
      title: {
        text: null,
      },
      chart: {
        // type: "column",
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
                selectedEvents: selectedEvents,
                selectedValue: selectedValue,
              });
            } else {
              parent.setState({
                selectedEvents: [],
                selectedValue: null,
              });
            }
          },
          load: function () {
            // Get the renderer
            const renderer = this.renderer;

            const chartWidth = this.chartWidth;
            const chartHeight = this.chartHeight;
            const imageWidth = 104; // Set the width of the image
            const imageHeight = 39; // Set the height of the image
            const x = (chartWidth - imageWidth) / 2;
            const y = (chartHeight - imageHeight) / 2.5;

            // Add a text element for the watermark
            renderer
              .image(GraphLogo, x, y, imageWidth, imageHeight)
              .attr({
                zIndex: 99, // Set the zIndex so it appears above the chart
                class: "watermark-opacity",
              })
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
            }
          },
        },

        categories: categories,
        type: "category", // Other types are "logarithmic", "datetime" and "category",
        labels: {
          formatter: function () {
            // console.log("categories", categories);
            // console.log("value", categories[this.pos]);
            // console.log("this", this);
            return parent.state.title === "Day" &&
              categories[this.pos] !== undefined
              ? moment(categories[this.pos], "DD/MM/YYYY").format("MM/DD/YY")
              : categories[this.pos];
          },
          autoRotation: false,
          step: mySteps,
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
          cursor: "pointer",
        },
        scrollbar: {
          // enabled: this.props.hideTimeFilter ? false : true,
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
        min: 0,
        max: categories.length - 0.5,
        // plotLines: plotLines,
        plotLines: updatedPlotLine,
        lineColor: this?.props?.darkModeState?.flag ? "#303030" : "#e5e5e6",
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
            color: parent?.props?.darkModeState?.flag ? "#cacbcc" : "#4f4f4f",
          },
        },
      },
      legend: {
        enabled: this.props.hideTimeFilter ? false : true,
        x: -330,
        // y:20,
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
          let walletAddress = JSON.parse(
            window.localStorage.getItem("addWallet")
          )?.map((e) => e.address);

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

          if (parent.props.updateTimer) {
            parent.props.updateTimer();
          }
          let net_amount = 0;
          this.points?.map((item) => {
            // console.log(
            //   "Item: ",
            //   item);
            tooltipData.push({
              name: item.series.userOptions.assetName,
              x: item.x,
              y: item.y,
              color: item.series.userOptions.color,
            });
            net_amount += item.y;
            //  if(item.series.userOptions.assetName === "Total"){ net_amount = item.y;}
          });
          tooltipData.sort((a, b) => parseFloat(b.y) - parseFloat(a.y));
          // console.log("sorted", tooltipData);

          const tooltip_title =
            parent.state.title === "Week" || parent.state.title === "Day"
              ? moment(x_value, "DD/MM/YYYY").format("MMMM DD, YYYY")
              : x_value;
          //  console.log("checking date", x_value, this.x, tooltip_title);
          return `${
            selectedEvents.length > 0
              ? `<div class="inter-display-semi-bold f-s-10 w-100 text-center"  style="color:#96979A; background-color:#ffffff; border: 1px solid #E5E5E6; border-radius:8px; margin-bottom:4px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.04);
backdrop-filter: blur(15px); padding:1rem 2rem;">Click to show Transactions</div>`
              : ""
          }<div class="top-section py-4" style="background-color:#ffffff; border: 1px solid #E5E5E6; border-radius:10px;box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.04);
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
        },
      },
      series: SelectedSeriesData,
      plotOptions: {
        series: {
          stacking: "normal",
          // grouping: false,
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
                  //  console.log("inside event click");
                  parent.setState({
                    selectedEvents: selectedEvents,
                    selectedValue: selectedValue,
                  });
                } else {
                  //  console.log("reset");
                  parent.setState({
                    selectedEvents: [],
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
          // events: {
          //   setExtremes: function (e) {
          //     console.log("Mix and max", e.min, e.max);
          //     console.log("e", e);
          //   },

          // },
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

    const minVersion = {
      padding: "2.4rem 3.2rem 0rem 3.2rem",
      height: "32rem",
      width: "100%",
      paddingTop: "2.3rem",
    };
    const minGraphVersion = {
      style: { height: "100%" },
    };
    const minVersionSection = {
      minHeight: "32rem",
      marginBottom: 0,
      width: "100%",
      minWidth: "100%",
      padding: 0,
      boxShadow: "none",
    };
    // console.log("selected event",this.state.selectedEvents)
    return (
      <div
        className="welcome-card-section lineChartSlider"
        style={
          this.props.hideTimeFilter
            ? minVersionSection
            : {
                padding: "2rem 0rem",
                paddingBottom: "1.8rem",
              }
        }
      >
        <>
          <div
            className="line-chart-section"
            style={
              !this.props.hideTimeFilter
                ? {
                    padding: "0rem 3.2rem",
                  }
                : { ...minVersion, display: "flex", flexDirection: "column" }
            }
            // onMouseLeave={() => {
            //   this.resetEvent();
            // }}
          >
            {!this.props.isPage && !this.props.noSubtitleBottomPadding ? (
              <GraphHeader
                isLoading={this.props.graphLoading}
                disableOnLoading={this.props.disableOnLoading}
                title="Historic performance"
                subtitle="Analyze your portfolio value over time"
                isArrow={true}
                isAnalytics="Asset Value"
                handleClick={this.props.handleClick}
                noSubtitleBottomPadding={this.props.noSubtitleBottomPadding}
                // loader={true}
                // loaderText="Don't worry we're still loading all your data"
              />
            ) : null}

            {this.props.graphLoading ? (
              <div
                className={
                  this.props.hideTimeFilter
                    ? "portfolioHomepricegaugeloader"
                    : ""
                }
                style={{
                  height: this.props.hideTimeFilter ? "38.2rem" : "35rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
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
                        marginBottom:
                          this.state.emailLoader && this.props.activeTab
                            ? "5rem"
                            : "2rem",
                      }}
                    >
                      {/* <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "66%",
                        }}
                      >
                        <h4 className="inter-display-medium f-s-13 lh-15 grey-7C7 m-r-12">
                          Timeframe
                        </h4>
                        <BarGraphFooter
                          handleFooterClick={this.handleSelect}
                          active={this.state.title}
                          footerLabels={["Year", "Month", "Day"]}
                          lineChart={true}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "start",
                          alignItems: "center",
                          // width: "35%",
                        }}
                      >
                        <h4 className="inter-display-medium f-s-13 lh-15 grey-7C7 m-r-12">
                          Chains
                        </h4>
                        <div style={{ width: "20rem" }}>
                          <CustomDropdown
                            filtername="All chains selected"
                            options={this.props.OnboardingState.coinsList}
                            action={null}
                            handleClick={this.handleFunction}
                            isChain={true}
                            // selectedTokens={this.state.activeBadge}
                            searchIsUsed={this.chainSearchIsUsed}
                          />
                        </div>
                      </div> */}
                    </div>
                  </>
                )}
                <div
                  className="chart-y-selection"
                  style={
                    this.props.hideTimeFilter
                      ? {
                          width: "100%",
                          marginTop: "0.5rem",
                          paddingTop: this.props.noSubtitleBottomPadding
                            ? "0rem"
                            : "",
                        }
                      : {
                          width: "100%",
                        }
                  }
                >
                  {this.props.openChartPage ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                      className="line-chart-dropdown-y-axis"
                    >
                      {/* <div className="inter-display-semi-bold f-s-10 lh-12 grey-7C7 ">
                        {CurrencyType()}
                      </div> */}
                      {this.state.emailLoader &&
                      this.props.activeTab === "day" ? (
                        <div
                          style={{
                            zIndex: 1,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <SwitchButton
                            handleEmail={this.handleAskEmail}
                            isTopAccount={this.props?.isTopAccountPage}
                          />
                          <Image src={LoaderIcon} className="rotate-loader" />
                        </div>
                      ) : (
                        <div></div>
                      )}
                      <p
                        onClick={this.props.openChartPage}
                        className="inter-display-medium f-s-10 lh-12 grey-7C7 p-b-20 custom-label"
                      >
                        <div className="seeMoreBtn cp">
                          <div>Click here to see more</div>
                          <Image
                            src={ChartSeeMoreArrowIcon}
                            className="seeMoreBtnIcon"
                          />
                        </div>
                      </p>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      className="line-chart-dropdown-y-axis"
                    >
                      <div className="inter-display-semi-bold f-s-10 lh-12 grey-7C7 ">
                        {CurrencyType()}
                      </div>
                    </div>
                  )}
                  {!this.props.hideTimeFilter &&
                  this.state.emailLoader &&
                  this.props.activeTab === "day" ? (
                    <div
                      style={{
                        position: "absolute",
                        right: "0px",
                        top: !this.props.hideTimeFilter ? "-38px" : "-5px",
                        zIndex: 1,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <SwitchButton
                        handleEmail={this.handleAskEmail}
                        isTopAccount={this.props?.isTopAccountPage}
                      />
                      <Image src={LoaderIcon} className="rotate-loader" />
                    </div>
                  ) : null}
                  {!this.props.hideTimeFilter && (
                    <>
                      <span
                        style={{
                          width: "33rem",
                          position: "absolute",
                          right: "0px",
                          zIndex: "1",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ width: "20rem", marginRight: "1rem" }}>
                          <CustomDropdown
                            filtername="All chains selected"
                            options={this.props.OnboardingState.coinsList}
                            action={null}
                            handleClick={this.handleFunction}
                            isChain={true}
                            // selectedTokens={this.state.activeBadge}
                            searchIsUsed={this.chainSearchIsUsed}
                          />
                        </div>
                        <div style={{ width: "12rem" }}>
                          <CustomDropdown
                            filtername="Tokens"
                            options={AllLegends}
                            action={null}
                            selectedTokens={
                              this.state.legends.length === 0
                                ? topLegends
                                : this.state.legends
                            }
                            handleClick={(arr) => this.DropdownData(arr)}
                            isLineChart={true}
                            getObj={true}
                            searchIsUsed={this.tokenSearchIsUsed}
                          />
                        </div>
                      </span>
                    </>
                  )}
                </div>

                <HighchartsReact
                  highcharts={Highcharts}
                  options={options}
                  // options={options2}
                  constructorType={"stockChart"}
                  containerProps={
                    this.props.hideTimeFilter ? minGraphVersion : null
                  }
                  // allowChartUpdate={true}
                  // updateArgs={[true]}
                />
                {/* {!this.props.hideChainFilter && (
                  <CoinBadges
                    activeBadge={this.state.activeBadge}
                    chainList={this.props.OnboardingState.coinsList}
                    handleFunction={this.handleFunction}
                    isScrollVisible={this.props.isScrollVisible}
                  />
                )} */}

                {/* <div className="chart-x-selection">
                <DropDown
                  class="line-chart-dropdown"
                  list={["Year", "Month", "Day"]}
                  // list={GroupByOptions}
                  onSelect={this.handleSelect}
                  title={this.state.title}
                  activetab={this.state.title}
                />
              </div> */}
              </>
            )}
          </div>
          {this.state.selectedEvents.length > 0 && (
            <>
              <div
                className="ChartDivider"
                style={this.props.hideTimeFilter ? { marginTop: "1rem" } : {}}
              ></div>
              <div
                className="SliderChartBottom"
                style={
                  this.props.hideTimeFilter
                    ? { padding: "0rem 3rem", margin: "2.5rem 0 1.5rem" }
                    : {}
                }
              >
                <h4 className="inter-display-semi-bold f-s-16 lh-19 grey-313">
                  <Image src={CalenderIcon} />
                  Largest Transactions
                  {this.state.selectedValue &&
                    ": " +
                      (this.state.title == "Year"
                        ? this.state.selectedValue
                        : this.state.title == "Month"
                        ? moment(this.state.selectedValue, "MMMM YY").format(
                            "MMMM, YYYY"
                          )
                        : moment(this.state.selectedValue, "DD/MM/YYYY").format(
                            "MMM DD, YYYY"
                          ))}
                </h4>

                <div className="InternalEventWrapper">
                  <div
                    className="EventColumn"
                    style={this.props.hideTimeFilter ? { width: "100%" } : {}}
                  >
                    {this.state.selectedEvents?.length > 0 &&
                    this.state.selectedEvents?.filter((e) => e.text === "from")
                      .length > 0 ? (
                      <h5 className="inter-display-bold f-s-13 lh-16 black-191 m-b-10">
                        <Image
                          style={{ marginRight: "0.5rem" }}
                          src={DoubleArrow}
                        />
                        <span>Received</span>
                      </h5>
                    ) : null}
                    {this.state.selectedEvents?.length > 0 &&
                      this.state.selectedEvents
                        ?.filter((e) => e.text === "from")
                        .map((event, i) => {
                          // console.log("first event", event);
                          const goToAddress = () => {
                            let slink = event.fulladdress;
                            if (slink) {
                              let shareLink =
                                BASE_URL_S3 +
                                "home/" +
                                slink +
                                "?redirect=home";

                              AssetValueChartWalletOpen({
                                session_id: getCurrentUser().id,
                                email_address: getCurrentUser().email,
                                wallet: slink,
                              });
                              // window.open(shareLink, "_blank", "noreferrer");
                              openAddressInSameTab(
                                slink,
                                this.props.setPageFlagDefault
                              );
                            }
                          };
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
                                // style={{
                                //   width: `${
                                //     this.state.selectedEvents.length === 1 ||
                                //     this.props.hideTimeFilter
                                //       ? "100%"
                                //       : ""
                                //   }`,
                                // }}
                              >
                                <p className="inter-display-medium f-s-13 lh-16 grey-B4D">
                                  <span>
                                    <span className="inter-display-semi-bold">
                                      {CurrencyType(false)}
                                      {numToCurrency(event.usd)}
                                    </span>
                                    <span>
                                      {" ("}
                                      {event.assetValue.toFixed(count)}{" "}
                                      {event.assetCode}
                                      {")"}
                                    </span>
                                    {event.text === "from" ? " from " : " to "}
                                  </span>
                                  <CustomOverlay
                                    position="top"
                                    // className={"coin-hover-tooltip"}
                                    isIcon={false}
                                    isInfo={true}
                                    isText={true}
                                    text={event.tooltip}
                                  >
                                    <span>
                                      {/* {this.state.selectedEvents.length === 1 &&
                                      !this.props.hideTimeFilter
                                        ? event.fulladdress
                                        : event.address} */}
                                      <span
                                        onClick={goToAddress}
                                        className="top-account-address"
                                      >
                                        {event.address}
                                      </span>
                                      <Image
                                        src={CopyClipboardIcon}
                                        onClick={() =>
                                          this.copyContent(event.fulladdress)
                                        }
                                        className="m-l-10 m-r-12 cp copy-icon"
                                      />
                                    </span>
                                  </CustomOverlay>
                                </p>
                              </div>
                            </>
                          );
                        })}
                  </div>
                  <div
                    className="EventColumn"
                    style={this.props.hideTimeFilter ? { width: "100%" } : {}}
                  >
                    {this.state.selectedEvents?.length > 0 &&
                    this.state.selectedEvents?.filter((e) => e.text === "to")
                      .length > 0 ? (
                      <h5 className="inter-display-bold f-s-13 lh-16 black-191 m-b-10">
                        <Image
                          style={{ marginRight: "0.5rem" }}
                          src={DoubleArrow}
                        />
                        <span>Sent</span>
                      </h5>
                    ) : null}
                    {this.state.selectedEvents?.length > 0 &&
                      this.state.selectedEvents
                        ?.filter((e) => e.text === "to")
                        .map((event, i) => {
                          // console.log("first event", event);

                          let count =
                            Math.trunc(event.assetValue).toString().length > 6
                              ? 0
                              : 6 -
                                Math.trunc(event.assetValue).toString().length;

                          const goToAddress = () => {
                            let slink = event.fulladdress;
                            if (slink) {
                              let shareLink =
                                BASE_URL_S3 +
                                "home/" +
                                slink +
                                "?redirect=home";

                              AssetValueChartWalletOpen({
                                session_id: getCurrentUser().id,
                                email_address: getCurrentUser().email,
                                wallet: slink,
                              });
                              // window.open(shareLink, "_blank", "noreferrer");
                              openAddressInSameTab(
                                slink,
                                this.props.setPageFlagDefault
                              );
                            }
                          };
                          return (
                            <>
                              <div
                                className="GreyChip"
                                key={i}
                                // style={{
                                //   width: `${
                                //     this.state.selectedEvents.length === 1 ||
                                //     this.props.hideTimeFilter
                                //       ? "100%"
                                //       : ""
                                //   }`,
                                // }}
                              >
                                <p className="inter-display-medium f-s-13 lh-16 grey-B4D">
                                  <span>
                                    <span className="inter-display-semi-bold">
                                      {CurrencyType(false)}
                                      {numToCurrency(event.usd)}
                                    </span>
                                    <span>
                                      {" ("}
                                      {event.assetValue.toFixed(count)}{" "}
                                      {event.assetCode}
                                      {")"}
                                    </span>
                                    {event.text === "from" ? " from " : " to "}
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
                                      {/* {this.state.selectedEvents.length === 1 &&
                                      !this.props.hideTimeFilter
                                        ? event.fulladdress
                                        : event.address} */}
                                      <span
                                        onClick={goToAddress}
                                        className="top-account-address"
                                      >
                                        {event.address}
                                      </span>
                                      <Image
                                        src={CopyClipboardIcon}
                                        onClick={() =>
                                          this.copyContent(event.fulladdress)
                                        }
                                        className="m-l-10 m-r-12 cp copy-icon"
                                      />
                                    </span>
                                  </CustomOverlay>
                                </p>
                              </div>
                            </>
                          );
                        })}
                  </div>
                </div>
              </div>
            </>
          )}
        </>
        {this.state.EmailModal && (
          <AssetValueEmailModal
            show={this.state.EmailModal}
            onHide={this.handleAskEmail}
            history={this.props.history}
            from={this.props?.isTopAccountPage ? "topaccount" : "me"}
          />
        )}
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  OnboardingState: state.OnboardingState,
  darkModeState: state.darkMode,
});
export default connect(mapStateToProps)(LineChartSlider);
// export default LineChartSlider;
