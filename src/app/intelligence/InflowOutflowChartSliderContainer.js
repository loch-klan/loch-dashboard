import Highcharts from "highcharts/highstock";
import moment from "moment";
import { connect } from "react-redux";
import {
  AssetChartInflowIcon,
  AssetChartOutflowIcon,
  ChartSeeMoreArrowIcon,
} from "../../assets/images/icons/index.js";
import InfoIcon from "../../assets/images/icons/info-icon.svg";
import { CurrencyType, numToCurrency } from "../../utils/ReusableFunctions";
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import { BarGraphFooter } from "../common/BarGraphFooter";
import { GraphHeader } from "../common/GraphHeader";
import Loading from "../common/Loading";

import { Image } from "react-bootstrap";
import {
  HomePriceChartFilter,
  PriceChartFilter,
  PriceChartMax,
  PriceChartMonth,
  PriceChartWeek,
  PriceChartYear,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay.js";
import { CustomDropdownPrice } from "../../utils/form";
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
    if (this.props.assetList && this.props.activeAssetTab) {
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
    if (this.props.isFromHomePage) {
      HomePriceChartFilter({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        filter_clicked: tempName,
        isSearchUsed: tempIsSearchUsed,
      });
    } else {
      PriceChartFilter({
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        filter_clicked: tempName,
        isSearchUsed: tempIsSearchUsed,
      });
    }
    this.props.onAssetSelect(opt);
    this.setState({ isChainSearchUsed: false });
  };
  chainSearchIsUsed = () => {
    this.setState({ isChainSearchUsed: true });
  };
  render() {
    return (
      <div
        className={`welcome-card-section ${
          this.props.isHome ? "welcome-card-section-home" : ""
        } lineChartSlider`}
        style={{
          boxShadow: this.props.hideTimeFilter ? "none" : "",
          paddingTop: this.props.hideTimeFilter ? "1rem" : "",
          margin: this.props.hideTimeFilter ? "0rem" : "",
          padding: this.props.priceGuageExpandedMobile
            ? "1.5rem"
            : this.props.hideTimeFilter
            ? "0rem"
            : "",
          minWidth: this.props.hideTimeFilter ? "100%" : "",
          // height: "30rem",
        }}
      >
        <>
          <div
            className="line-chart-section"
            style={{
              padding: `0rem ${
                this.props.hideTimeFilter
                  ? this.props.isMobileGraph
                    ? ""
                    : "3.2rem"
                  : "4.8rem"
              }`,
              width: this.props.hideTimeFilter ? "100%" : "",
              paddingTop: `${
                this.props.priceGuageExpandedMobile
                  ? "0rem"
                  : this.props.hideTimeFilter
                  ? "2.8rem"
                  : ""
              }`,
            }}
          >
            {!this.props.isPage && (
              <GraphHeader
                title="Token value"
                subtitle="Analyze the portfolio value over time"
                isArrow={true}
                isAnalytics="Asset Value"
                handleClick={this.props.handleClick}
              />
            )}

            {this.props.graphLoading ? (
              <div
                className={
                  this.props.hideTimeFilter && !this.props.isMobileGraph
                    ? "portfolioHomepricegaugeloader"
                    : ""
                }
                style={{
                  height: this.props.hideTimeFilter
                    ? this.props.isMobileGraph
                      ? "38rem"
                      : "31.5rem"
                    : "50rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Loading />
              </div>
            ) : (
              <>
                {(!this.props.hideTimeFilter ||
                  this.props.priceGuageExpandedMobile) && (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: this.props.priceGuageExpandedMobile
                          ? "1rem"
                          : "2rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%",
                          padding: this.props.priceGuageExpandedMobile
                            ? "0rem"
                            : "",
                        }}
                      >
                        <BarGraphFooter
                          handleFooterClick={this.handleSelect}
                          active={this.state.title}
                          footerLabels={["Max", "1 Year", "1 Month", "1 Week"]}
                          lineChart={true}
                          divideInTwo={this.props.priceGuageExpandedMobile}
                          priceGuageExpandedMobile={
                            this.props.priceGuageExpandedMobile
                          }
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
                    alignItems: this.props.isMobileGraph ? "flex-start" : "",
                  }}
                >
                  <div
                    style={{
                      whiteSpace: "nowrap",
                      overflow:
                        this.props.isHomepage ||
                        this.props.priceGuageExpandedMobile
                          ? "visible"
                          : "hidden",
                      textOverflow: "ellipsis",
                      alignItems: this.props.isMobileGraph
                        ? "flex-start"
                        : "center",
                      justifyContent: this.props.hideTimeFilter
                        ? "space-between"
                        : "",
                      width: "100%",
                    }}
                    className="inflowOutflowChartTopInfoLeft"
                  >
                    {this.props.priceGuageExpandedMobile ? (
                      <div className="priceGaugeMobileExpandedPriceDropdownContainer">
                        <CustomDropdownPrice
                          isHomepage={this.props.isHomepage}
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
                        <div
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            fontSize: "18px",
                            fontWeight: this.props.hideTimeFilter ? "500" : "",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            marginTop: "2rem",
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
                            {this.props.showSelectedItem
                              ? this.props.showSelectedItem + " "
                              : this.props.showEth
                              ? "Ethereum "
                              : null}
                            {this.props.hideTimeFilter &&
                            this.state.activeAssetTabName
                              ? ``
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
                        </div>
                        <div
                          style={{
                            opacity: this.state.currentPriceDate ? 1 : 0,
                          }}
                          className="inter-display-semi-bold f-s-10 grey-7C7 line-chart-dropdown-y-axis"
                        >
                          {this.state.currentPriceDate
                            ? this.state.currentPriceDate
                            : 0}
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          whiteSpace: "nowrap",
                          overflow:
                            this.props.isHomepage ||
                            this.props.priceGuageExpandedMobile
                              ? "visible"
                              : "hidden",
                          textOverflow: "ellipsis",
                          justifyContent: "space-between",
                          width: "100%",
                          alignItems:
                            this.props.hideTimeFilter && this.props.showDropdown
                              ? "center"
                              : this.props.hideTimeFilter
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
                              fontWeight: this.props.hideTimeFilter
                                ? "500"
                                : "",
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
                              {/* {this.props.showSelectedItem
                                ? this.props.showSelectedItem + " "
                                : this.props.showEth
                                ? "Ethereum "
                                : null}
                              {this.props.hideTimeFilter &&
                              this.state.activeAssetTabName
                                ? ``
                                : ""} */}
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
                            {!this.props.hideTimeFilter ||
                            this.props.hideExplainer ? null : (
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
                                    "This chart reflects the price for any token held by this portfolio ever. Understand if this trader can buy low and sell high."
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
                            )}
                          </div>

                          <div
                            style={{
                              opacity: this.state.currentPriceDate ? 1 : 0,
                            }}
                            className="inter-display-semi-bold f-s-10 grey-7C7 line-chart-dropdown-y-axis"
                          >
                            {this.state.currentPriceDate
                              ? this.state.currentPriceDate
                              : 0}
                          </div>
                        </div>
                        {this.props.showDropdown ? (
                          <div
                            style={{
                              zIndex: 4,
                              paddingRight: "15px",
                            }}
                          >
                            <CustomDropdownPrice
                              isHomepage={this.props.isHomepage}
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
                      </div>
                    )}
                    {/* {this.props.openChartPage && this.props.isMobileGraph ? (
                      <div
                        className="d-flex"
                        style={{
                          alignItems: "center",
                          gap: "8px",
                          marginTop: this.props.isMobileGraph ? "2px" : "",
                        }}
                      >
                        <p
                          onClick={this.props.openChartPage}
                          class="inter-display-medium f-s-10 grey-7C7  custom-label"
                        >
                          <div className="seeMoreBtn cp f-s-10 grey-7C7">
                            {this.props.isMobileGraph ? (
                              <div>See more</div>
                            ) : (
                              <div>Click here to see more</div>
                            )}

                            <Image
                              src={ChartSeeMoreArrowIcon}
                              className="seeMoreBtnIcon"
                            />
                          </div>
                        </p>
                      </div>
                    ) : null} */}
                  </div>

                  {/* {this.props.isFromHomePage ? ( */}
                  <div
                    style={{
                      zIndex: 4,
                      display: "flex",
                      alignItems: "center",
                    }}
                    className="mobilePortfolioContainerNew"
                  >
                    {this.props.hidePriceDropDown ? null : (
                      <CustomDropdownPrice
                        isFromHomePage={this.props.isFromHomePage}
                        isHomepage={this.props.isHomepage}
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
                    )}
                    {this.props.isFromHomePage ? (
                      <div
                        className="d-flex"
                        style={{
                          alignItems: "center",
                          gap: "8px",
                          marginTop: "",
                        }}
                      >
                        <p
                          onClick={this.props.openChartPage}
                          class="inter-display-medium f-s-10 grey-7C7  custom-label"
                        >
                          <div className="seeMoreBtn cp f-s-10 grey-7C7">
                            {this.props.isMobileGraph ? (
                              <div
                                style={{
                                  lineHeight: "",
                                }}
                              >
                                See more
                              </div>
                            ) : (
                              <div
                                style={{
                                  lineHeight: "",
                                }}
                              >
                                Click here to see more
                              </div>
                            )}

                            <Image
                              src={ChartSeeMoreArrowIcon}
                              className="seeMoreBtnIcon"
                            />
                          </div>
                        </p>
                      </div>
                    ) : null}
                  </div>
                  {/* ) : null} */}
                  {!this.props.hideTimeFilter ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CustomOverlay
                        position="bottom"
                        isIcon={false}
                        isInfo={true}
                        isText={true}
                        isLeftText
                        className={"fix-width tool-tip-container-bottom-arrow"}
                        heading="These are all the tokens ever owned by this portfolio."
                        subHeading="Red coordinates represent outflows / sells and green coordinates represent inflows / buys."
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
                    </div>
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
                {/* {this.props.isMobileGraph &&
                this.props.showMobilePriceDropDownHome ? (
                  <div
                    style={{
                      marginTop: "1rem",
                    }}
                    className="priceGaugeMobileExpandedPriceDropdownContainer"
                  >
                    <CustomDropdownPrice
                      isHomepage={this.props.isHomepage}
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
                ) : null} */}

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
                  showDropdown={this.props.showDropdown}
                  isMobileGraph={this.props.isMobileGraph}
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
