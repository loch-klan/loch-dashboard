import moment from "moment";
import { connect } from "react-redux";
import Highcharts from "highcharts/highstock";
import Loading from "../common/Loading";
import { GraphHeader } from "../common/GraphHeader";
import { BarGraphFooter } from "../common/BarGraphFooter";
import { CurrencyType, numToCurrency } from "../../utils/ReusableFunctions";
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import InfoIcon from "../../assets/images/icons/info-icon.svg";
import {
  AssetChartInflowIcon,
  AssetChartOutflowIcon,
  ChartSeeMoreArrowIcon,
} from "../../assets/images/icons/index.js";
import { DropDownWithIcons } from "../common/index.js";
import CustomDropdown from "../../utils/form/CustomDropdown";

import InflowOutflowChartSlider from "./InflowOutflowChartSlider";
import {
  PriceChartFilter,
  PriceChartMax,
  PriceChartMonth,
  PriceChartWeek,
  PriceChartYear,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import { CustomDropdownPrice } from "../../utils/form";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay.js";
import { Image } from "react-bootstrap";

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
      isChainSearchUsed: false,
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
      let currentTimeFormat = "Month";
      if (this.state.title === "1 Week" || this.state.title === "1 Month") {
        currentTimeFormat = "Days";
      }
      this.state.inflowOutflowData.forEach((resData) => {
        let formattedTimeStamp = "";
        if (currentTimeFormat === "Year") {
          formattedTimeStamp = moment(resData.timestamp).format("YYYY");
        } else if (currentTimeFormat === "Month") {
          formattedTimeStamp = moment(resData.timestamp).format("MM/DD/YY");
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
          allowOverlap: true,
          formatter: function () {
            let initialReceivedVal =
              formattedOverallData[curItem].received_value;
            let initialSendVal = formattedOverallData[curItem].send_value;
            let receivedVal = initialReceivedVal;
            let sendVal = initialSendVal;

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
                </div>`;
            } else if (sendVal > 0) {
              return `<div class="inflowOutflowChartAnnotationContainer">
                <img class="inflowOutflowChartAnnotation" src="${AssetChartOutflowIcon}" />
                </div>`;
            } else if (initialReceivedVal > 0 || initialSendVal > 0) {
              return `<div class="inflowOutflowChartAnnotationContainer">
                <img class="inflowOutflowChartAnnotation" src="${AssetChartInflowIcon}" />
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
      PriceChartMax({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
    } else if (opt.target.id === 1 || opt.target.id === "1") {
      tempTitle = "1 Year";
      PriceChartYear({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
    } else if (opt.target.id === 2 || opt.target.id === "2") {
      tempTitle = "1 Month";
      PriceChartMonth({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
    } else {
      PriceChartWeek({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
      });
    }
    this.setState({
      steps: 1,
      rangeSelected: 1,
    });
    this.props.handleGroupBy(tempTitle);
  };
  handleAssetSelect = (opt) => {
    const tempIsSearchUsed = this.state.isChainSearchUsed;
    let tempName = "";
    const tempIndex = this.state.assetList.findIndex(
      (resRes) => resRes._id === opt
    );
    if (tempIndex !== -1) {
      tempName = this.state.assetList[tempIndex].asset?.name;
    }
    PriceChartFilter({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      filter_clicked: tempName,
      isSearchUsed: tempIsSearchUsed,
    });
    this.props.onAssetSelect(opt);
    this.setState({ isChainSearchUsed: false });
  };
  chainSearchIsUsed = () => {
    this.setState({ isChainSearchUsed: true });
  };
  render() {
    return (
      <div
        className="welcome-card-section lineChartSlider"
        style={{
          boxShadow: this.props.hideTimeFilter ? "none" : "",
          paddingTop: this.props.hideTimeFilter ? "1rem" : "",
          margin: this.props.hideTimeFilter ? "0rem" : "",
          padding: this.props.hideTimeFilter ? "0rem" : "",
          minWidth: this.props.hideTimeFilter ? "100%" : "",
          // height: "30rem",
        }}
      >
        <>
          <div
            className="line-chart-section"
            style={{
              padding: `0rem ${
                this.props.hideTimeFilter ? "3.2rem" : "4.8rem"
              }`,
              width: this.props.hideTimeFilter ? "100%" : "",
              paddingTop: `${this.props.hideTimeFilter ? "2.8rem" : ""}`,
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
                className={
                  this.props.hideTimeFilter
                    ? "portfolioHomepricegaugeloader"
                    : ""
                }
                style={{
                  height: this.props.hideTimeFilter ? "35.2rem" : "50rem",
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
                          footerLabels={["Max", "1 Year", "1 Month", "1 Week"]}
                          lineChart={true}
                        />
                      </div>
                    </div>
                  </>
                )}
                <div
                  // className="chart-y-selection"

                  className="inflowOutflowChartTopInfo"
                  style={{
                    padding: this.props.hideTimeFilter ? "0rem" : "",
                  }}
                >
                  <div
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      alignItems: this.props.hideTimeFilter
                        ? "flex-start"
                        : "centre",
                      justifyContent: this.props.hideTimeFilter
                        ? "space-between"
                        : "",
                      width: "100%",
                    }}
                    className="inflowOutflowChartTopInfoLeft"
                  >
                    <div
                      style={{
                        display: "flex",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        alignItems: this.props.hideTimeFilter
                          ? "flex-start"
                          : "centre",
                      }}
                    >
                      {/* <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                        className="inter-display-semi-bold f-s-10 grey-7C7 line-chart-dropdown-y-axis"
                      >
                        <div>{CurrencyType()}</div>
                      </div> */}
                      <div
                        onClick={this.changeThePriceTodefault}
                        className="ioPriceContainer"
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          paddingLeft: this.props.hideTimeFilter
                            ? "1.5rem"
                            : "",
                        }}
                      >
                        <div
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            fontSize: this.props.hideTimeFilter ? "14px" : "",
                            fontWeight: this.props.hideTimeFilter ? "500" : "",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                          }}
                          className="ioPrice inter-display-medium"
                        >
                          <div
                            style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {this.props.hideTimeFilter &&
                            this.state.activeAssetTabName
                              ? `${this.state.activeAssetTabName} `
                              : ""}
                            Price
                          </div>
                          <div
                            style={{
                              marginLeft: "0.5rem",
                              marginRight: "0.5rem",
                            }}
                          >
                            {CurrencyType(false)}
                            {this.state.currentPriceValue
                              ? numToCurrency(this.state.currentPriceValue)
                              : "0.00"}
                          </div>
                          <div
                            style={{
                              display: "flex",
                            }}
                          >
                            <CustomOverlay
                              position="top"
                              isIcon={false}
                              isInfo={true}
                              isText={true}
                              className={"fix-width"}
                              text={
                                "This chart reflects the price for any token held by this wallet ever. Understand if this trader can buy low and sell high."
                              }
                            >
                              <Image
                                src={InfoIcon}
                                className="infoIcon"
                                style={{
                                  cursor: "pointer",
                                  height: "14px",
                                }}
                              />
                            </CustomOverlay>
                          </div>
                        </div>

                        <div
                          style={{
                            opacity: this.state.currentPriceDate ? 1 : 0,
                          }}
                          className="inter-display-semi-bold f-s-10 lh-12 grey-7C7 line-chart-dropdown-y-axis"
                        >
                          {this.state.currentPriceDate
                            ? this.state.currentPriceDate
                            : 0}
                        </div>
                      </div>
                    </div>
                    {this.props.openChartPage ? (
                      <p
                        onClick={this.props.openChartPage}
                        class="inter-display-medium f-s-10 lh-12 grey-7C7  custom-label"
                      >
                        <div className="seeMoreBtn cp f-s-10 grey-7C7">
                          <div>See more</div>

                          <Image
                            src={ChartSeeMoreArrowIcon}
                            className="seeMoreBtnIcon"
                          />
                        </div>
                      </p>
                    ) : null}
                  </div>

                  {!this.props.hideTimeFilter ? (
                    <div
                      style={{
                        zIndex: 4,
                      }}
                    >
                      <CustomDropdownPrice
                        filtername="All chains selected"
                        options={this.state.assetList}
                        action={null}
                        handleClick={this.handleAssetSelect}
                        isChain={true}
                        selectedTokens={[this.state.activeAssetTab]}
                        selectedTokenName={this.state.activeAssetTabName}
                        singleSelect
                        searchIsUsed={this.chainSearchIsUsed}
                      />
                    </div>
                  ) : null}
                  {!this.props.hideTimeFilter ? (
                    <CustomOverlay
                      position="bottom"
                      isIcon={false}
                      isInfo={true}
                      isText={true}
                      isLeftText
                      className={"fix-width tool-tip-container-bottom-arrow"}
                      heading="These are all the tokens ever owned by this wallet."
                      subHeading="Red coordinates represent outflows / sells and and green coordinates represent inflows / sells."
                    >
                      <Image
                        src={InfoIcon}
                        className="infoIcon"
                        style={{
                          cursor: "pointer",
                          height: "1.6rem",
                          marginLeft: "1rem",
                        }}
                      />
                    </CustomOverlay>
                  ) : null}
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
                  hideTimeFilter={this.props.hideTimeFilter}
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
