import moment from "moment";
import { connect } from "react-redux";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

import GraphLogo from "../../assets/images/graph-logo.svg";
import handle from "../../assets/images/handle.svg";
import {
  CurrencyType,
  noExponents,
  numToCurrency,
} from "../../utils/ReusableFunctions";
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import {
  AssetChartInflowIcon,
  AssetChartOutflowIcon,
} from "../../assets/images/icons/index.js";
import {
  PriceChartHoverInflow,
  PriceChartHoverOutflow,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";

require("highcharts/modules/annotations")(Highcharts);

class InflowOutflowChartSlider extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      buySellList: [],
      plotLineHide: 0,
      steps: 1,
      activeAssetTab: "",
      assetList: [],
      formattedXAxis: [],
      formattedOverallData: {},
      formattedPointList: [],
      startHoverInflow: true,
      startHoverOutflow: true,
    };
  }
  componentDidMount() {
    if (this.props.assetList) {
      this.setState({
        assetList: this.props.assetList,
      });
    }
    if (this.props.activeAssetTab) {
      this.setState({
        activeAssetTab: this.props.activeAssetTab,
      });
    }
    if (this.props.steps) {
      this.setState({
        steps: this.props.steps,
      });
    }
    if (this.props.formattedPointList) {
      this.setState({
        formattedPointList: this.props.formattedPointList,
      });
    }
    if (this.props.formattedXAxis) {
      this.setState({
        formattedXAxis: this.props.formattedXAxis,
      });
    }
    if (this.props.formattedOverallData) {
      this.setState({
        formattedOverallData: this.props.formattedOverallData,
      });
    }
    if (this.props.buySellList) {
      this.setState({
        buySellList: this.props.buySellList,
      });
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.formattedXAxis !== this.state.formattedXAxis) {
      let diff = Math.round(
        this.state.formattedXAxis && this.state.formattedXAxis.length - 0.5
      );
      this.applySteps(diff);
    }
    if (prevProps.assetList !== this.props.assetList) {
      this.setState({
        assetList: this.props.assetList,
      });
    }
    if (prevProps.activeAssetTab !== this.props.activeAssetTab) {
      this.setState({
        activeAssetTab: this.props.activeAssetTab,
      });
    }
    if (prevProps.steps !== this.props.steps) {
      this.setState({
        steps: this.props.steps,
      });
    }
    if (prevProps.formattedPointList !== this.props.formattedPointList) {
      this.setState({
        formattedPointList: this.props.formattedPointList,
      });
    }
    if (prevProps.formattedXAxis !== this.props.formattedXAxis) {
      this.setState({
        formattedXAxis: this.props.formattedXAxis,
      });
    }
    if (prevProps.formattedOverallData !== this.props.formattedOverallData) {
      this.setState({
        formattedOverallData: this.props.formattedOverallData,
      });
    }
    if (prevProps.buySellList !== this.props.buySellList) {
      this.setState({
        buySellList: this.props.buySellList,
      });
    }
  }

  changeThePricePass = (tempPriceValue, tempPriceDate) => {
    const priceValue = tempPriceValue.toString();
    this.props.changeThePrice(priceValue, tempPriceDate);
  };
  applySteps = (diff) => {
    if (diff >= 9 && diff < 11 && this.state.plotLineHide !== 1) {
      this.setState({
        plotLineHide: 1,
      });
    } else {
      if (diff < 9 && this.state.plotLineHide !== 0) {
        this.setState({
          plotLineHide: 0,
        });
      }
    }
    if (diff > 200) {
      if (this.state.steps !== 23) {
        this.setState({
          steps: 23,
        });
      }
    } else if (diff > 190) {
      if (this.state.steps !== 22) {
        this.setState({
          steps: 22,
        });
      }
    } else if (diff > 180) {
      if (this.state.steps !== 21) {
        this.setState({
          steps: 21,
        });
      }
    } else if (diff > 170) {
      if (this.state.steps !== 20) {
        this.setState({
          steps: 20,
        });
      }
    } else if (diff > 160) {
      if (this.state.steps !== 19) {
        this.setState({
          steps: 19,
        });
      }
    } else if (diff > 150) {
      if (this.state.steps !== 18) {
        this.setState({
          steps: 18,
        });
      }
    } else if (diff > 140) {
      if (this.state.steps !== 17) {
        this.setState({
          steps: 17,
        });
      }
    } else if (diff > 130) {
      if (this.state.steps !== 16) {
        this.setState({
          steps: 16,
        });
      }
    } else if (diff > 120) {
      if (this.state.steps !== 15) {
        this.setState({
          steps: 15,
        });
      }
    } else if (diff > 110) {
      if (this.state.steps !== 14) {
        this.setState({
          steps: 14,
        });
      }
    } else if (diff > 100) {
      if (this.state.steps !== 13) {
        this.setState({
          steps: 13,
        });
      }
    } else if (diff > 90) {
      if (this.state.steps !== 12) {
        this.setState({
          steps: 12,
        });
      }
    } else if (diff > 80) {
      if (this.state.steps !== 11) {
        this.setState({
          steps: 11,
        });
      }
    } else if (diff > 70) {
      if (this.state.steps !== 10) {
        this.setState({
          steps: 10,
        });
      }
    } else if (diff > 60) {
      if (this.state.steps !== 9) {
        this.setState({
          steps: 9,
        });
      }
    } else if (diff > 50) {
      if (this.state.steps !== 8) {
        this.setState({
          steps: 8,
        });
      }
    } else if (diff > 40) {
      if (this.state.steps !== 7) {
        this.setState({
          steps: 7,
        });
      }
    } else if (diff > 30) {
      if (this.state.steps !== 6) {
        this.setState({
          steps: 6,
        });
      }
    } else if (diff > 20) {
      if (this.state.steps !== 5) {
        this.setState({
          steps: 5,
        });
      }
    } else if (diff > 15) {
      if (this.state.steps !== 4) {
        this.setState({
          steps: 4,
        });
      }
    } else if (diff > 10) {
      if (this.state.steps !== 3) {
        this.setState({
          steps: 3,
        });
      }
    } else if (diff > 7) {
      if (this.state.steps !== 2) {
        this.setState({
          steps: 2,
        });
      }
    } else if (diff <= 7) {
      if (this.state.steps !== 1) {
        this.setState({
          steps: 1,
        });
      }
    }
  };
  hoverOnInflow = () => {
    if (this.state.startHoverInflow) {
      PriceChartHoverInflow({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
      this.setState(
        {
          startHoverInflow: false,
        },
        () => {
          setTimeout(() => {
            this.setState({
              startHoverInflow: true,
            });
          }, 2000);
        }
      );
    }
  };
  hoverOnOutflow = () => {
    if (this.state.startHoverOutflow) {
      PriceChartHoverOutflow({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
      this.setState(
        {
          startHoverOutflow: false,
        },
        () => {
          setTimeout(() => {
            this.setState({
              startHoverOutflow: true,
            });
          }, 2000);
        }
      );
    }
  };

  render() {
    let parent = this;

    const options = {
      title: {
        text: null,
      },
      chart: {
        type: "area",
        spacingTop: this.props.hideTimeFilter ? 40 : 10,
        events: {
          load: function () {
            // Get the renderer
            const renderer = this.renderer;
            const chartWidth = this.chartWidth;
            const chartHeight = this.chartHeight;
            const imageWidth = 104; // Set the width of the image
            const imageHeight = 39; // Set the height of the image
            const x = (chartWidth - imageWidth) / 2;
            const y = (chartHeight - imageHeight) / 2.5;

            renderer
              .image(GraphLogo, x, y, imageWidth, imageHeight)
              .attr({
                zIndex: 99,
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
            if (!parent.props.hideTimeFilter) {
              parent.applySteps(diff);
            }
          },
        },

        categories: this.state.formattedXAxis ? this.state.formattedXAxis : [],
        type: "category",
        labels: {
          formatter: function () {
            if (
              parent.state.formattedXAxis &&
              this.pos < parent.state.formattedXAxis.length &&
              parent.state.formattedXAxis[this.pos]
            ) {
              return parent.state.formattedXAxis[this.pos];
            }
            return "";
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
        max:
          this.state.formattedXAxis && this.state.formattedXAxis.length - 0.5,
        // plotLines: plotLines,
        // plotLines: updatedPlotLine,
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
            color: "#B0B1B3",
          },
        },
        crosshair: {
          width: 1,
          color: "#B0B1B3",
          dashStyle: "Dash",
          cursor: "pointer",
        },
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
          if (
            parent.state.formattedOverallData &&
            Object.keys(parent.state.formattedOverallData).length > 0
          ) {
            const curItem = parent.state.formattedOverallData[this.x];

            if (curItem) {
              const dateTitle = moment(curItem.timestamp).format(
                "DD MMMM YYYY"
              );
              let priceOfAsset = curItem.price;
              parent.changeThePricePass(priceOfAsset, dateTitle);
              let receivedAmount = curItem.received;
              let sendAmount = curItem.send;

              let receivedVal = curItem.received_value;
              let sendVal = curItem.send_value;

              const tempIndex = parent.state.assetList.findIndex(
                (resData) => resData._id === parent.state.activeAssetTab
              );
              let assetCode = "ETH";
              if (
                tempIndex !== -1 &&
                parent.props.assetList[tempIndex] &&
                parent.props.assetList[tempIndex].asset?.code
              ) {
                assetCode = parent.props.assetList[tempIndex].asset?.code;
              }
              if (receivedVal > 0 || sendVal > 0) {
                if (receivedVal - sendVal >= 0) {
                  parent.hoverOnInflow();
                } else {
                  parent.hoverOnOutflow();
                }
                return `
              <div class="top-section py-4" style="background-color:#ffffff; border: 1px solid #E5E5E6; border-radius:10px;box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.04);
                backdrop-filter: blur(15px);">
                    ${
                      receivedVal > 0
                        ? `<div style="display:flex; align-items:center; justify-content:space-between;" class="inter-display-medium f-s-13 w-100 px-4 ${
                            sendVal > 0 ? "mb-5" : ""
                          }">
                            <div style="display:flex; align-items:center; justify-content:center;" >
                              <img src=${AssetChartInflowIcon} style='width:15px; height: 15px; display: inline-block; margin-right: 0.3rem'> </img>
                              <div>Inflow</div>
                            </div>
                            <div style="width:2rem;height:0.1rem; opacity:0" >
                            </div>
                            <div>
                              <span style="color:${"#16182B"}"> ${CurrencyType(
                            false
                          )}${numToCurrency(receivedVal)} (${numToCurrency(
                            receivedAmount
                          )} ${assetCode}) </span>
                            </div>
                          </div>`
                        : ""
                    }
                    ${
                      sendVal > 0
                        ? `<div style="display:flex; align-items:center; justify-content:space-between;" class="inter-display-medium f-s-13 w-100 px-4">
                            <div style="display:flex; align-items:center; justify-content:center;" >
                              <img src=${AssetChartOutflowIcon} style='width:15px; height: 15px; display: inline-block; margin-right: 0.3rem'> </img>
                              <div>Outflow</div>
                            </div>
                            <div style="width:2rem;height:0.1rem; opacity:0">
                            </div>
                            <div>
                              <span style="color:${"#16182B"}"> ${CurrencyType(
                            false
                          )}${numToCurrency(sendVal)} (${numToCurrency(
                            sendAmount
                          )} ${assetCode})</span>
                            </div>
                          </div>`
                        : ""
                    }
              </div>
              `;
              }
              return "";
            }
            return "";
          }

          return "";
        },
      },
      series: [
        {
          name: "Ethereum",
          data: this.state.formattedPointList,
          type: "area",
          fillOpacity: 0.1,
          color: "#5ABE7E",
        },
      ],
      annotations: [
        {
          draggable: "",
          labels: this.state.buySellList,
        },
      ],
      plotOptions: {
        series: {
          stacking: "normal",
          cursor: "pointer",
          fillOpacity: 0,
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
      <div onMouseLeave={this.props.changeThePriceTodefault}>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          constructorType={"stockChart"}
        />
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  OnboardingState: state.OnboardingState,
});
export default connect(mapStateToProps)(InflowOutflowChartSlider);
