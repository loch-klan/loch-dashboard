import moment from "moment";
import { connect } from "react-redux";
import Highcharts from "highcharts/highstock";
import Loading from "../common/Loading";
import { GraphHeader } from "../common/GraphHeader";
import { BarGraphFooter } from "../common/BarGraphFooter";
import { CurrencyType, numToCurrency } from "../../utils/ReusableFunctions";
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import {
  AssetChartInflowIcon,
  AssetChartOutflowIcon,
} from "../../assets/images/icons/index.js";
import { DropDownWithIcons } from "../common/index.js";
import CustomDropdown from "../../utils/form/CustomDropdown";

import InflowOutflowChartSlider from "./InflowOutflowChartSlider";

require("highcharts/modules/annotations")(Highcharts);

class InflowOutflowChartSliderContainer extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      inflowOutflowData: [],
      buySellList: [],
      plotLineHide: 0,
      steps: 1,
      title: "",
      activeAssetTab: "",
      activeAssetTabName: "",
      assetList: [],
      formattedXAxis: [],
      formattedOverallData: {},
      formattedPointList: [],
      currentPriceValue: "",
      currentPriceDate: "",
    };
  }
  componentDidMount() {
    if (this.props.inflowOutflowData) {
      this.setState({
        inflowOutflowData: this.props.inflowOutflowData,
      });
    }
    if (this.props.activeTimeTab) {
      this.setState({
        title: this.props.activeTimeTab,
      });
    }

    if (this.props.activeAssetTab) {
      this.setState({
        activeAssetTab: this.props.activeAssetTab,
      });
    }
    if (this.props.assetList) {
      this.setState({
        assetList: this.props.assetList,
      });
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.activeAssetTab !== this.state.activeAssetTab ||
      prevState.assetList !== this.state.assetList
    ) {
      this.setState({
        currentPriceValue: "",
        currentPriceDate: "",
      });
    }

    if (prevProps.assetList !== this.props.assetList) {
      this.setState({
        assetList: this.props.assetList,
      });
    }
    if (
      (prevProps.activeAssetTab !== this.props.activeAssetTab ||
        prevProps.assetList !== this.props.assetList) &&
      this.props.assetList &&
      this.props.activeAssetTab
    ) {
      const tempIndex = this.props.assetList.findIndex(
        (resData) => resData._id === this.props.activeAssetTab
      );

      if (tempIndex !== -1) {
        if (this.props.assetList[tempIndex]?.asset?.name) {
          this.setState({
            activeAssetTabName: this.props.assetList[tempIndex].asset.name,
          });
        }
      }
      this.setState({
        activeAssetTab: this.props.activeAssetTab,
      });
    }
    if (prevProps.activeTimeTab !== this.props.activeTimeTab) {
      this.setState({
        title: this.props.activeTimeTab,
      });
    }
    if (prevProps.inflowOutflowData !== this.props.inflowOutflowData) {
      this.setState({
        inflowOutflowData: this.props.inflowOutflowData,
      });
    }
    if (prevState.inflowOutflowData !== this.state.inflowOutflowData) {
      const formattedOverallData = {};
      const formattedXAxis = [];
      const timestampList = [];
      let currentTimeFormat = "Year";

      if (this.state.title === "1 Year" || this.state.title === "6 Months") {
        currentTimeFormat = "Month";
      } else if (
        this.state.title === "1 Week" ||
        this.state.title === "1 Month"
      ) {
        currentTimeFormat = "Days";
      }
      this.state.inflowOutflowData.forEach((resData) => {
        let formattedTimeStamp = "";
        if (currentTimeFormat === "Year") {
          formattedTimeStamp = moment(resData.timestamp).format("YYYY");
        } else if (currentTimeFormat === "Month") {
          formattedTimeStamp = moment(resData.timestamp).format("MMM YY");
        } else {
          formattedTimeStamp = moment(resData.timestamp).format("MM/DD/YY");
        }
        if (!timestampList.includes(formattedTimeStamp)) {
          // Add to time stamp list
          timestampList.push(formattedTimeStamp);
          formattedXAxis.push(formattedTimeStamp);

          // Add to overall data
          formattedOverallData[formattedTimeStamp] = resData;
        } else {
          const tempVar = formattedOverallData[formattedTimeStamp];
          formattedOverallData[formattedTimeStamp] = {
            price: resData.price,
            received: resData.received + tempVar.received,
            received_value: resData.received_value + tempVar.received_value,
            send: resData.send + tempVar.send,
            send_value: resData.send_value + tempVar.send_value,
            timestamp: resData.timestamp,
          };
        }
      });

      const formattedPointList = [];
      const tempAnnotationArr = [];
      let index = 0;
      for (let curItem in formattedOverallData) {
        formattedPointList.push(formattedOverallData[curItem].price);
        let tempHolder = {
          point: {
            xAxis: 0,
            yAxis: 0,
            x: index,
            y: formattedOverallData[curItem].price,
          },
          useHTML: true,
          formatter: function () {
            let receivedVal = formattedOverallData[curItem].received_value;
            let sendVal = formattedOverallData[curItem].send_value;

            const finalVal = receivedVal - sendVal;
            if (finalVal > 0) {
              receivedVal = finalVal;
              sendVal = 0;
            } else if (finalVal < 0) {
              receivedVal = 0;
              sendVal = Math.abs(finalVal);
            } else {
              receivedVal = 0;
              sendVal = 0;
            }

            if (receivedVal > 0) {
              return `<div class="inflowOutflowChartAnnotationContainer">
                <img class="inflowOutflowChartAnnotation" src="${AssetChartInflowIcon}" />
                <div class="inflowOutflowChartAnnotationBox top-section py-4" style="background-color:#ffffff; border: 1px solid #E5E5E6; border-radius:10px;box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.04);
                backdrop-filter: blur(15px);">
                  <div class="line-chart-tooltip-section tooltip-section-blue w-100" style="background-color:#ffffff;">
                    <div class="inter-display-medium f-s-12 w-100 text-center px-4" style="color:#96979A; display:flex; justify-content:space-between"><b>13 March 22</b> <b class="inter-display-semi-bold m-l-10" style="color:#16182B;">$200</b></div><div class="w-100 mt-3" style="height: 1px; background-color: #E5E5E680;"></div>
                    <div class="inter-display-medium f-s-13 w-100 pt-3 px-4" style="display:flex; justify-content:space-between" >
                    <div>
                      <img style='width:20px; height: 20px; display: inline-block; margin-right: 0.6rem' src="${AssetChartInflowIcon}" />
                      Inflow
                    </div>
                    <div style="color:#16182B">$5</div>
                    </div>
                  </div>
                </div>`;
            } else if (sendVal > 0) {
              return `<div class="inflowOutflowChartAnnotationContainer">
                <img class="inflowOutflowChartAnnotation" src="${AssetChartOutflowIcon}" />
                <div class="inflowOutflowChartAnnotationBox top-section py-4" style="background-color:#ffffff; border: 1px solid #E5E5E6; border-radius:10px;box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.04);
                backdrop-filter: blur(15px);">
                  <div class="line-chart-tooltip-section tooltip-section-blue w-100" style="background-color:#ffffff;">
                    <div class="inter-display-medium f-s-12 w-100 text-center px-4" style="color:#96979A; display:flex; justify-content:space-between"><b>13 March 22</b> <b class="inter-display-semi-bold m-l-10" style="color:#16182B;">$200</b></div><div class="w-100 mt-3" style="height: 1px; background-color: #E5E5E680;"></div>
                    <div class="inter-display-medium f-s-13 w-100 pt-3 px-4" style="display:flex; justify-content:space-between" >
                    <div>
                      <img style='width:20px; height: 20px; display: inline-block; margin-right: 0.6rem' src="${AssetChartOutflowIcon}" />
                      Inflow
                    </div>
                    <div style="color:#16182B">$5</div>
                    </div>
                  </div>
                </div>`;
            }
            return "";
          },
          backgroundColor: "transparent",
          borderColor: "transparent",
          className: "highchartsAnnotationTooltip",
          x: 0,
          y: 0,
          padding: 0,
          shape: "rect",
          verticalAlign: "bottom",
        };
        tempAnnotationArr.push(tempHolder);
        index++;
      }
      this.setState(
        {
          formattedPointList: formattedPointList,
          formattedXAxis: formattedXAxis,
          formattedOverallData: formattedOverallData,
          buySellList: tempAnnotationArr,
        },
        () => {
          this.changeThePriceTodefault();
        }
      );
    }
    if (
      prevState.formattedXAxis !== this.state.formattedXAxis ||
      prevState.formattedOverallData !== this.state.formattedOverallData
    ) {
      this.changeThePriceTodefault();
    }
  }

  changeThePriceTodefault = () => {
    if (this.state.formattedXAxis.length > 0) {
      const lastItem =
        this.state.formattedXAxis[this.state.formattedXAxis.length - 1];
      if (this.state.formattedOverallData[lastItem]) {
        const mostRecent = this.state.formattedOverallData[lastItem];
        const tempPrice = mostRecent.price ? mostRecent.price.toString() : 0;
        this.setState({
          currentPriceValue: tempPrice,
          currentPriceDate: "",
        });
      }
    }
  };
  changeThePrice = (priceValue, priceDate) => {
    this.setState({
      currentPriceValue: priceValue,
      currentPriceDate: priceDate,
    });
  };
  handleSelect = (opt) => {
    let tempTitle = "1 Week";
    if (opt.target.id === 0 || opt.target.id === "0") {
      tempTitle = "Max";
    } else if (opt.target.id === 1 || opt.target.id === "1") {
      tempTitle = "5 Years";
    } else if (opt.target.id === 2 || opt.target.id === "2") {
      tempTitle = "1 Year";
    } else if (opt.target.id === 3 || opt.target.id === "3") {
      tempTitle = "6 Months";
    } else if (opt.target.id === 4 || opt.target.id === "4") {
      tempTitle = "1 Month";
    }
    this.setState({
      steps: 1,
      rangeSelected: 1,
    });
    this.props.handleGroupBy(tempTitle);
  };
  handleAssetSelect = (opt) => {
    this.props.onAssetSelect(opt);
  };
  render() {
    console.log(
      "this.state.activeAssetTabName is ",
      this.state.activeAssetTabName
    );
    return (
      <div className="welcome-card-section lineChartSlider">
        <>
          <div
            className="line-chart-section"
            style={{
              padding: "0rem 4.8rem",
            }}
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
                  // className="chart-y-selection"

                  className="inflowOutflowChartTopInfo"
                >
                  <div className="inflowOutflowChartTopInfoLeft">
                    <div className="inter-display-semi-bold f-s-10 lh-12 grey-7C7 line-chart-dropdown-y-axis">
                      {CurrencyType()}
                    </div>
                    <div
                      onClick={this.changeThePriceTodefault}
                      className="ioPriceContainer"
                    >
                      <div className="ioPrice inter-display-medium">
                        <span>Price </span>
                        <span>
                          {CurrencyType(false)}
                          {this.state.currentPriceValue
                            ? numToCurrency(this.state.currentPriceValue)
                            : "0.00"}
                        </span>
                      </div>

                      <div
                        style={{ opacity: this.state.currentPriceDate ? 1 : 0 }}
                        className="inter-display-semi-bold f-s-10 lh-12 grey-7C7 line-chart-dropdown-y-axis"
                      >
                        {this.state.currentPriceDate
                          ? this.state.currentPriceDate
                          : 0}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      width: "100%",
                      minWidth: "18rem",
                      maxWidth: "20rem",
                      marginLeft: "1rem",
                      zIndex: 4,
                    }}
                  >
                    <CustomDropdown
                      filtername="All chains selected"
                      options={this.state.assetList}
                      action={null}
                      handleClick={this.handleAssetSelect}
                      isChain={true}
                      selectedTokens={[this.state.activeAssetTab]}
                      selectedTokenName={this.state.activeAssetTabName}
                      singleSelect
                    />
                  </div>
                  {/* <div className="dropdownWithImages">
                    <DropDownWithIcons
                      list={this.state.assetList}
                      onSelect={this.handleAssetSelect}
                      activetab={this.state.activeAssetTab}
                      showChain
                    />
                  </div> */}
                </div>

                <InflowOutflowChartSlider
                  changeThePriceTodefault={this.changeThePriceTodefault}
                  formattedPointList={this.state.formattedPointList}
                  formattedXAxis={this.state.formattedXAxis}
                  formattedOverallData={this.state.formattedOverallData}
                  buySellList={this.state.buySellList}
                  steps={this.state.steps}
                  changeThePrice={this.changeThePrice}
                  activeAssetTab={this.state.activeAssetTab}
                  assetList={this.props.assetList}
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
export default connect(mapStateToProps)(InflowOutflowChartSliderContainer);
