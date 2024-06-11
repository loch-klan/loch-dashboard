import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import React, { Component, createRef } from "react";
import { Form, Image } from "react-bootstrap";
import { Bar, getElementAtEvent } from "react-chartjs-2";
import { connect } from "react-redux";
import { BarGraphFooter } from "./BarGraphFooter";
import { GraphHeader } from "./GraphHeader";

import ChartjsPluginWatermark from "chartjs-plugin-watermark";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HC_rounded from "highcharts-rounded-corners";
import moment from "moment";
import Calendar from "react-calendar";
import OutsideClickHandler from "react-outside-click-handler";
import {
  ChartSeeMoreArrowIcon,
  ThickCheckMarkIcon,
} from "../../assets/images/icons";
import InfoIcon from "../../assets/images/icons/info-icon.svg";
import {
  CurrencyType,
  openAddressInSameTab,
} from "../../utils/ReusableFunctions";
import { CustomOverlayUgradeToPremium } from "../../utils/commonComponent";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import CustomDropdown from "../../utils/form/CustomDropdown";
import DropDown from "./DropDown";
import Loading from "./Loading";

HC_rounded(Highcharts);

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartjsPluginWatermark
);

class BarGraphSection extends Component {
  constructor(props) {
    super(props);
    this.chartRef = createRef();
    this.state = {
      headerTitle: props.headerTitle,
      headerSubTitle: props.headerSubTitle,
      options: props.options ? props.options : [],
      options2: props.options2 ? props.options2 : [],
      data: props.data ? props.data : null,
      activeFooter: props.activeTitle ? props.activeTitle : 0,
      activeBadge: [{ name: "All", id: "" }],
      activeBadgeList: [],
      showFromAndTo: props.showFromAndTo,
      showFooter: props.showFooter,
      showBadges: props.showBadges,
      isArrow: props.isArrow,
      showPercentage: props.showPercentage,
      footerLabels: props.footerLabels,
      isScrollVisible: props.isScrollVisible,
      isScroll: props.isScroll,
      digit: props.digit ? props.digit : 3,
      showFooterDropdown: props.showFooterDropdown,
      footerDropdownLabels: props.footerDropdownLabels,
      // activeDropdown: props.activeDropdown,
      handleSelect: props.handleSelect,
      switchselected: props.isSwitch,
      isSmallerToggle: props.isSmallerToggle,
      // stackedgraphdata: {
      //   options: info[0],
      // },
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.options != this.props.options) {
      this.setState({
        options: this.props.options,
        options2: this.props.options2,
        data: this.props.data,
        showPercentage: this.props.showPercentage,
      });
      // console.log("active badge", this.state.activeBadge)
      // console.log("active badgeList", this.state.activeBadgeList);
      // this.state.activeBadge && this.state.activeBadge.map((e, i) => {
      //   this.handleFunction(e);
      //   console.log("index", i)
      // });
    }

    if (prevProps.digit != this.props.digit) {
      this.setState({
        digit: this.props.digit,
      });
    }
  }

  handleFooter = (event) => {
    if (this.props.isBlurred) {
      this.goToPayModalPass();
      return null;
    }
    this.setState({
      activeFooter: event.target.id,
      activeBadge: [{ name: "All", id: "" }],
      activeBadgeList: [],
    });
    // console.log("handle footer", event.target.id);
    this.props.timeFunction(event.target.id, this.state.activeBadgeList);
  };
  handleFunction = (badge) => {
    let activeFooter = this.props.showFooterDropdown
      ? this.props.activeDropdown
      : this.state.activeFooter;
    if (this.props.isBlurred) {
      this.props.goToPayModal();
      return null;
    }

    if (badge?.[0].name === "All") {
      this.setState(
        {
          activeBadge: [{ name: "All", id: "" }],
          activeBadgeList: [],
        },
        () => {
          this.props.handleBadge(this.state.activeBadgeList, activeFooter);
        }
      );
    } else {
      this.setState(
        {
          activeBadge: badge,
          activeBadgeList: badge?.map((item) => item.id),
        },
        () => {
          this.props.handleBadge(this.state.activeBadgeList, activeFooter);
        }
      );
    }
    // let newArr = [...this.state.activeBadge];
    // let activeFooter = this.props.showFooterDropdown ? this.props.activeDropdown : this.state.activeFooter;
    // if (this.state.activeBadge.some((e) => e.name === badge.name)) {
    //   let index = newArr.findIndex((x) => x.name === badge.name);
    //   newArr.splice(index, 1);
    //   if (newArr.length === 0) {
    //     this.setState(
    //       {
    //         activeBadge: [{ name: "All", id: "" }],
    //         activeBadgeList: [],
    //       },
    //       () => {
    //         this.props.handleBadge(this.state.activeBadgeList, activeFooter);
    //       }
    //     );
    //   } else {
    //     this.setState(
    //       {
    //         activeBadge: newArr,
    //         activeBadgeList: newArr?.map((item) => item.id),
    //       },
    //       () => {
    //         this.props.handleBadge(this.state.activeBadgeList, activeFooter);
    //       }
    //     );
    //   }
    // } else if (badge.name === "All") {
    //   this.setState(
    //     {
    //       activeBadge: [{ name: "All", id: "" }],
    //       activeBadgeList: [],
    //     },
    //     () => {
    //       this.props.handleBadge(this.state.activeBadgeList, activeFooter);
    //     }
    //   );
    // } else {
    //   let index = newArr.findIndex((x) => x.name === "All");
    //   if (index !== -1) {
    //     newArr.splice(index, 1);
    //   }
    //   newArr.push(badge);
    //   this.setState(
    //     {
    //       activeBadge: newArr,
    //       activeBadgeList: newArr?.map((item) => item.id),
    //     },
    //     () => {
    //       this.props.handleBadge(this.state.activeBadgeList, activeFooter);
    //     }
    //   );
    // }

    // if (this.props.headerTitle === "Blockchain Fees over Time")
    //   BlockchainFeesFilter({
    //     session_id: getCurrentUser().id,
    //     email_address: getCurrentUser().email,
    //     asset_selected: badge.name,
    //   });

    // if (this.props.headerTitle === "Counterparty Fees Over Time")
    //   CounterpartyFeesFilter({
    //     session_id: getCurrentUser().id,
    //     email_address: getCurrentUser().email,
    //     asset_selected: badge.name,
    //   });
  };
  toggleBreakdownSelected = () => {
    this.setState({
      switchselected: !this.state.switchselected,
    });
  };
  goToPayModalPass = () => {
    if (this.props.isPremiumUser) {
      return null;
    }
    if (this.props.goToPayModal) {
      this.props.goToPayModal();
    }
  };
  render() {
    const {
      data,
      options,
      options2,
      headerTitle,
      headerSubTitle,
      isArrow,
      showPercentage,
      showBadges,
      activeBadge,
      isScrollVisible,
      isScroll,
      showFooter,
      footerLabels,
      digit,
      showFooterDropdown,
      footerDropdownLabels,
      handleSelect,
      showFromAndTo,
    } = this.state;
    const {
      marginBottom,
      comingSoon,
      coinsList,
      activeFooter,
      className = "",
      handleClick,
      isLoading,
      showSwitch,
      showToken,
      isMinichart,
      isMobile,
    } = this.props;
    //  console.log("bar gr state digit", digit);
    // const digit =
    //   data && ("" + Math.round(Math.max(...data.datasets[0].data))).length;
    // console.log("bar digit", digit, Math.max(...data.datasets[0].data));

    const ScrollStyle = {
      width: `${100}%`,
      minWidth: `${100}rem`,
      height: this.props.customGraphHeight
        ? this.props.customGraphHeight
        : this.props.isMobileGraph
        ? "40rem"
        : "",
      minHeight: this.props.customGraphHeight
        ? this.props.customGraphHeight
        : this.props.isMobileGraph
        ? "40rem"
        : "",
    };
    const NormalStyle = {
      width: "100%",
      minWidth: "100%",
      height: this.props.customGraphHeight
        ? this.props.customGraphHeight
        : this.props.isMobileGraph
        ? "40rem"
        : "",
      minHeight: this.props.customGraphHeight
        ? this.props.customGraphHeight
        : this.props.isMobileGraph
        ? "40rem"
        : "",
    };
    // console.log("options ", options);
    // console.log("data ", data);
    return (
      <div
        className={`bar-graph-section ${
          this.props.isBlurred ? "bar-graph-section-blurred " : ""
        } ${
          this.props.floatingWatermark && !this.props.isLoading && data
            ? this.props.isCounterPartyGasFeesPage
              ? "tableWatermarkOverlayCounterParty"
              : "tableWatermarkOverlay"
            : ""
        } ${marginBottom ? marginBottom : ""}`}
        style={
          this.props.isCounterPartyMini
            ? {
                paddingBottom: "0rem",
                display: "flex",
                flexDirection: "column",
              }
            : this.props.newHomeSetup
            ? {
                display: "flex",
                flexDirection: "column",
                paddingTop: "0rem",
                paddingBottom: "0rem",
              }
            : {
                display: "flex",
                flexDirection: "column",
              }
        }
      >
        {headerTitle || headerSubTitle ? (
          <GraphHeader
            ExportBtn={this.props.ExportBtn}
            exportBtnTxt={this.props.exportBtnTxt}
            handleExportModal={this.props.handleExportModal}
            isLoading={this.props.isLoading}
            disableOnLoading={this.props.disableOnLoading}
            title={headerTitle}
            subtitle={headerSubTitle}
            isArrow={isArrow}
            handleClick={handleClick}
            noSubtitleBottomPadding={this.props.noSubtitleBottomPadding}
          />
        ) : (
          ""
        )}

        {!isLoading ? (
          (data && options) || this.props.ProfitLossAsset?.series ? (
            <span
              style={{
                flex: 1,
                paddingTop:
                  this.props.noSubtitleBottomPadding &&
                  !this.props.noSubtitleTopPadding
                    ? "2rem"
                    : 0,
                overflow: this.props.noSubtitleBottomPadding ? "hidden" : "",
                marginTop: this.props.newHomeSetup ? "1.4rem" : "",
              }}
              className={`${comingSoon ? "blur-effect" : ""}`}
            >
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    flexDirection: isMobile ? "column" : "row",
                  }}
                >
                  {showFooter && (
                    <div
                      style={{
                        width: this.props.showBadges ? "75%" : "100%",
                      }}
                    >
                      <BarGraphFooter
                        handleFooterClick={this.handleFooter}
                        active={this.state.activeFooter}
                        footerLabels={footerLabels}
                        isMobileGraph={this.props.isMobileGraph}
                      />
                    </div>
                  )}
                  {showFromAndTo && (
                    <div
                      style={{
                        marginBottom: isMobile ? "1rem" : "",
                      }}
                      className="intelligenceRealisedLeftContainer"
                    >
                      <div class="bar-graph-footer ">
                        {isMobile ? (
                          <div class="timeCalendarBadgeWrapper timeCalendarBadgeWrapperMobile ">
                            <div
                              id="1"
                              class="inter-display-medium f-s-13 lh-16 timeCalBadge"
                            >
                              <OutsideClickHandler
                                onOutsideClick={this.props.hideFromCalendar}
                              >
                                <div className="timeBadgeCalendarContainer timeBadgeCalendarContainer-left">
                                  <div
                                    className="timeBadgeCalendarText"
                                    onClick={this.props.showFromCalendar}
                                  >
                                    {"From "}
                                    {this.props.fromDate
                                      ? moment(this.props.fromDate).format(
                                          "D MMM YYYY"
                                        )
                                      : ""}
                                  </div>
                                  {this.props.isFromCalendar ? (
                                    <div className="intelligenceCalendar">
                                      <Calendar
                                        date={this.props.fromDate}
                                        className={
                                          "calendar-select inter-display-medium f-s-13 lh-16"
                                        }
                                        onChange={this.props.changeFromDate}
                                        maxDate={this.props.maxDate}
                                        minDate={this.props.minDate}
                                        defaultValue={this.props.fromDate}
                                      />
                                    </div>
                                  ) : null}
                                </div>
                              </OutsideClickHandler>
                            </div>

                            <div
                              id="3"
                              class="inter-display-medium f-s-13 lh-16 timeCalBadge"
                            >
                              <OutsideClickHandler
                                onOutsideClick={this.props.hideToCalendar}
                              >
                                <div className="timeBadgeCalendarContainer timeBadgeCalendarContainer-right">
                                  <div
                                    className="timeBadgeCalendarText"
                                    onClick={this.props.showToCalendar}
                                  >
                                    {"To "}
                                    {this.props.toDate
                                      ? moment(this.props.toDate).format(
                                          "D MMM YYYY"
                                        )
                                      : ""}
                                  </div>
                                  {this.props.isToCalendar ? (
                                    <div className="intelligenceCalendar">
                                      <Calendar
                                        date={this.props.toDate}
                                        className={
                                          "calendar-select inter-display-medium f-s-13 lh-16"
                                        }
                                        onChange={this.props.changeToDate}
                                        maxDate={this.props.maxDate}
                                        minDate={this.props.minDate}
                                        defaultValue={this.props.toDate}
                                      />
                                    </div>
                                  ) : null}
                                </div>
                              </OutsideClickHandler>
                            </div>
                          </div>
                        ) : (
                          <div class="timeCalendarBadgeWrapper ">
                            <div
                              id="0"
                              class="inter-display-medium f-s-13 lh-16 timeNoCalBadge timeNoCalBadgeNoLeft"
                            >
                              From
                            </div>
                            <div
                              id="1"
                              class="inter-display-medium f-s-13 lh-16 timeCalBadge"
                            >
                              <OutsideClickHandler
                                onOutsideClick={this.props.hideFromCalendar}
                              >
                                <div className="timeBadgeCalendarContainer">
                                  <div
                                    className="timeBadgeCalendarText"
                                    onClick={this.props.showFromCalendar}
                                  >
                                    {this.props.fromDate
                                      ? moment(this.props.fromDate).format(
                                          "D MMM YYYY"
                                        )
                                      : ""}
                                  </div>
                                  {this.props.isFromCalendar ? (
                                    <div className="intelligenceCalendar">
                                      <Calendar
                                        date={this.props.fromDate}
                                        className={
                                          "calendar-select inter-display-medium f-s-13 lh-16"
                                        }
                                        onChange={this.props.changeFromDate}
                                        maxDate={this.props.maxDate}
                                        minDate={this.props.minDate}
                                        defaultValue={this.props.fromDate}
                                      />
                                    </div>
                                  ) : null}
                                </div>
                              </OutsideClickHandler>
                            </div>
                            <div
                              id="2"
                              class="inter-display-medium f-s-13 lh-16 timeNoCalBadge"
                            >
                              To
                            </div>
                            <div
                              id="3"
                              class="inter-display-medium f-s-13 lh-16 timeCalBadge"
                            >
                              <OutsideClickHandler
                                onOutsideClick={this.props.hideToCalendar}
                              >
                                <div className="timeBadgeCalendarContainer">
                                  <div
                                    className="timeBadgeCalendarText"
                                    onClick={this.props.showToCalendar}
                                  >
                                    {this.props.toDate
                                      ? moment(this.props.toDate).format(
                                          "D MMM YYYY"
                                        )
                                      : ""}
                                  </div>
                                  {this.props.isToCalendar ? (
                                    <div className="intelligenceCalendar">
                                      <Calendar
                                        date={this.props.toDate}
                                        className={
                                          "calendar-select inter-display-medium f-s-13 lh-16"
                                        }
                                        onChange={this.props.changeToDate}
                                        maxDate={this.props.maxDate}
                                        minDate={this.props.minDate}
                                        defaultValue={this.props.toDate}
                                      />
                                    </div>
                                  ) : null}
                                </div>
                              </OutsideClickHandler>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* <BarGraphFooter
                      handleFooterClick={this.handleFooter}
                      active={this.state.activeFooter}
                      footerLabels={footerLabels}
                    /> */}
                    </div>
                  )}
                  {showFromAndTo ? (
                    isMobile ? (
                      <div className="intelligenceRealisedRightContainer intelligenceRealisedRightContainerMobile">
                        <div className="intelligenceRealisedRightItems intelligenceRealisedRightItemsMobile">
                          <CustomDropdown
                            filtername="All chains"
                            options={coinsList}
                            selectedTokens={this.props.selectedActiveBadge}
                            action={null}
                            handleClick={this.handleFunction}
                            isChain={true}
                            searchIsUsed={this.props.chainSearchIsUsed}
                          />
                        </div>
                        <div className="intelligenceRealisedRightItems intelligenceRealisedRightItemsMobile">
                          <CustomDropdown
                            filtername="All tokens"
                            options={this.props.assetList}
                            selectedTokens={this.props.selectedAssets}
                            action={null}
                            handleClick={this.props.handleAssetSelected}
                            // isChain={true}
                            LightTheme={true}
                            placeholderName={"asset"}
                            getObj={this.props?.getObj}
                            searchIsUsed={this.props.assetSearchIsUsed}

                            // selectedTokens={this.state.activeBadge}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="intelligenceRealisedRightContainer">
                        <div
                          className="intelligenceRealisedRightItems"
                          // style={{
                          //   width: "100%",
                          //   minWidth: "18rem",
                          //   maxWidth: "20rem",
                          //   marginLeft: "1rem",
                          //   zIndex: 4,
                          // }}
                        >
                          <CustomDropdown
                            filtername="All chains"
                            options={coinsList}
                            selectedTokens={this.props.selectedActiveBadge}
                            action={null}
                            handleClick={this.handleFunction}
                            isChain={true}
                            searchIsUsed={this.props.chainSearchIsUsed}
                          />
                        </div>
                        <div
                          className="intelligenceRealisedRightItems intelligenceRealisedRightMiddleItem"
                          // style={{
                          //   width: "100%",
                          //   minWidth: "15rem",
                          //   maxWidth: "18rem",
                          //   zIndex: "2",
                          // }}
                        >
                          <CustomDropdown
                            filtername="All tokens"
                            options={this.props.assetList}
                            selectedTokens={this.props.selectedAssets}
                            action={null}
                            handleClick={this.props.handleAssetSelected}
                            // isChain={true}
                            LightTheme={true}
                            placeholderName={"asset"}
                            getObj={this.props?.getObj}
                            searchIsUsed={this.props.assetSearchIsUsed}

                            // selectedTokens={this.state.activeBadge}
                          />
                        </div>
                        {this.props.showSwitch ? (
                          <div
                            className="intelligenceRealisedRightItems"
                            // style={{
                            //   width: "100%",
                            //   minWidth: "15rem",
                            //   maxWidth: "18rem",
                            //   zIndex: "2",
                            // }}
                          >
                            <div
                              onClick={this.toggleBreakdownSelected}
                              className={`inter-display-medium f-s-13 lh-16 IRRIbreakdownContainer ${
                                this.state.switchselected
                                  ? "IRRIbreakdownContainerSelected"
                                  : ""
                              }`}
                            >
                              <div>Breakdown</div>
                              <div className="IRRIbreakdownImageContainer">
                                <Image
                                  className="IRRIbreakdownImage"
                                  src={ThickCheckMarkIcon}
                                />
                              </div>
                            </div>
                          </div>
                        ) : null}
                        {isMobile ? null : (
                          <div className="intelligenceRealisedInfoIcon">
                            <CustomOverlay
                              position="bottom"
                              isIcon={false}
                              isInfo={true}
                              isText={true}
                              heading="Inflows and Outflows might appear inflated if the same funds went in and out of a single wallet multiple times."
                              subHeading="This chart is most accurate when all your wallet addresses are added to Loch. This way we don't double count funds."
                              className={
                                "fix-width tool-tip-container-bottom-arrow"
                              }
                              isLeftText
                            >
                              <Image src={InfoIcon} className="infoIcon" />
                            </CustomOverlay>
                          </div>
                        )}
                      </div>
                    )
                  ) : null}
                  {showBadges && (
                    <div
                      style={{
                        width: "100%",
                        minWidth: this.props?.isGasFeesMobileExpanded
                          ? ""
                          : "18rem",
                        maxWidth: this.props?.isGasFeesMobileExpanded
                          ? ""
                          : "20rem",
                        marginLeft: this.props?.isGasFeesMobileExpanded
                          ? ""
                          : "1rem",
                        zIndex: 4,
                      }}
                      className={
                        this.props.isGasFeesMobileExpanded
                          ? "mobileGasFeesExpandedViewDropdownContainer"
                          : ""
                      }
                    >
                      <CustomDropdown
                        filtername="All chains selected"
                        selectedTokens={this.props.selectedActiveBadge}
                        options={coinsList}
                        action={null}
                        handleClick={this.handleFunction}
                        isChain={true}
                        searchIsUsed={this.props.chainSearchIsUsed}
                        // selectedTokens={this.state.activeBadge}
                      />
                    </div>
                  )}
                </div>
              </>

              {!this.props.dontShowAssets ? (
                this.props.newHomeSetup ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: showToken || isMinichart ? "1rem" : "0rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      {/* <p className="inter-display-semi-bold f-s-10 lh-12 grey-7C7  custom-label">
                      {CurrencyType()}
                    </p> */}

                      <div
                        style={{
                          opacity: showSwitch ? 1 : 0,
                        }}
                        className="showBreakdownContainer"
                      >
                        <div
                          className={`inter-display-medium portFolioHomeToggle f-s-13 lh-16 hideShowBreakdownToggle ${
                            showSwitch ? "" : "noCp"
                          } ${
                            this.state.isSmallerToggle
                              ? "smaller-toggle grey-ADA"
                              : "primary-color"
                          }`}
                          style={{
                            marginLeft: "3rem",
                          }}
                        >
                          <Form.Check
                            type="switch"
                            id="custom-switch"
                            label={
                              this.state.switchselected
                                ? "Hide breakdown"
                                : "Show breakdown"
                            }
                            checked={this.state.switchselected}
                            onChange={(e) => {
                              if (showSwitch) {
                                this.setState({
                                  switchselected: e.target.checked,
                                });
                                if (this.props.setSwitch) {
                                  this.props.setSwitch();
                                }
                              }
                            }}
                          />
                        </div>
                      </div>

                      {this.props.openChartPage ? (
                        <p
                          onClick={this.props.openChartPage}
                          className="inter-display-medium f-s-10 lh-12 grey-7C7  custom-label"
                        >
                          <div
                            style={{
                              marginLeft: "0rem",
                            }}
                            className="seeMoreBtn cp"
                          >
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
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: showToken || isMinichart ? "1rem" : "0rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <p className="inter-display-semi-bold f-s-10 lh-12 grey-7C7 p-t-10 p-b-20 custom-label">
                        {CurrencyType()}
                      </p>
                    </div>

                    {showToken && (
                      <div
                        style={{
                          width: "100%",
                          minWidth: "15rem",
                          maxWidth: "18rem",
                          zIndex: "2",
                        }}
                      >
                        <CustomDropdown
                          filtername="All tokens selected"
                          options={this.props.assetList}
                          action={null}
                          handleClick={this.props.handleAssetSelected}
                          // isChain={true}
                          LightTheme={true}
                          placeholderName={"asset"}
                          getObj={this.props?.getObj}
                          searchIsUsed={this.props.assetSearchIsUsed}
                          // selectedTokens={this.state.activeBadge}
                        />
                      </div>
                    )}
                  </div>
                )
              ) : null}
              {showPercentage || showSwitch ? (
                <div
                  className="show-percentage-div"
                  style={
                    showSwitch && !showPercentage
                      ? {
                          marginBottom: "1rem",
                          marginTop: "-2.5rem",
                          justifyContent: "end",
                        }
                      : showSwitch
                      ? { marginBottom: "2rem" }
                      : {
                          justifyContent: "flex-end",
                          visibility: "hidden",
                          display: "none",
                        }
                  }
                >
                  {showPercentage && (
                    <div
                      className={`inter-display-medium f-s-16 lh-19 grey-313 content ${
                        showPercentage?.status === "Increase"
                          ? "inc"
                          : showPercentage?.status === "No Change"
                          ? "inc"
                          : "dec"
                      }`}
                    >
                      <Image src={showPercentage?.icon} className="m-r-4" />
                      {showPercentage?.percent}% {showPercentage?.status}
                    </div>
                  )}
                </div>
              ) : (
                ""
              )}
              {/* Graph Section */}
              <CustomOverlayUgradeToPremium
                position="top"
                disabled={
                  this.props.isPremiumUser || !this.props.showPremiumHover
                }
              >
                <div className={className} style={{ display: "flex" }}>
                  {options2 != undefined &&
                  isScroll &&
                  (this.props.isFromHome
                    ? data.labels.length > 3
                    : data.labels.length > 8) ? (
                    <div
                      className={this.props.isBlurred ? "blurred-elements" : ""}
                      style={{ width: `${digit}rem` }}
                      onClick={this.goToPayModalPass}
                    >
                      <Bar options={options2} data={data} />
                    </div>
                  ) : (
                    ""
                  )}

                  <div
                    className={
                      options2 != undefined &&
                      isScroll &&
                      (this.props.isFromHome
                        ? data.labels.length > 3
                        : data.labels.length > 8)
                        ? "ScrollArea"
                        : "ChartAreaWrapper"
                    }
                    style={{
                      width: `${
                        options2 != undefined &&
                        isScroll &&
                        (this.props.isFromHome
                          ? data.labels.length > 3
                          : data.labels.length > 8)
                          ? "calc(100 % - " + digit + "rem)"
                          : "100%"
                      }`,
                    }}
                    onClick={this.goToPayModalPass}
                  >
                    {this.props.isGraphLoading ? (
                      <div
                        style={{
                          height: this?.props?.loaderHeight
                            ? this?.props?.loaderHeight + "rem"
                            : "30rem",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Loading />
                      </div>
                    ) : this.props.oldBar ? (
                      <div
                        className={`chartArea ${
                          this.props.newHomeSetup ? "chartAreaOldBar" : ""
                        }`}
                        style={
                          (this.props.isFromHome
                            ? data.labels.length > 3
                            : data.labels.length > 8) && isScroll
                            ? ScrollStyle
                            : NormalStyle
                        }
                      >
                        <Bar
                          onClick={(event) => {
                            let curIndex = getElementAtEvent(
                              this.chartRef.current,
                              event
                            );
                            let passedData = this.props.data;
                            if (
                              passedData &&
                              passedData.datasets &&
                              passedData.datasets.length > 0 &&
                              passedData.datasets[0].clickAbleAddress
                            ) {
                              passedData =
                                passedData.datasets[0].clickAbleAddress;
                            }
                            if (curIndex && curIndex.length > 0 && passedData) {
                              curIndex = curIndex[0].index;
                              const wallet = passedData[curIndex];
                              if (wallet) {
                                openAddressInSameTab(wallet);
                              }
                            }
                          }}
                          options={options}
                          data={data}
                          ref={this.chartRef}
                        />
                      </div>
                    ) : (
                      <>
                        {!this.state.switchselected ? (
                          <div
                            className="chartArea"
                            style={
                              showSwitch && !showPercentage
                                ? {
                                    maxHeight: "35.55rem",
                                    overflow: "hidden",
                                  }
                                : {
                                    overflow: "hidden",
                                  }
                            }
                          >
                            <div
                              style={{
                                position: "absolute",
                                opacity: 0,
                              }}
                            >
                              Loch
                            </div>
                            <HighchartsReact
                              highcharts={Highcharts}
                              options={options}
                              // constructorType={"stockChart"}
                              // allowChartUpdate={true}
                              // updateArgs={[true]}
                              containerProps={{
                                style: {
                                  height: this.props.noSubtitleBottomPadding
                                    ? "110%"
                                    : "",
                                },
                              }}
                            />
                          </div>
                        ) : (
                          <div
                            className="chartArea"
                            style={
                              showSwitch && !showPercentage
                                ? {
                                    maxHeight: "35.55rem",
                                    overflow: "hidden",
                                    cursor: "pointer",
                                  }
                                : {
                                    overflow: "hidden",
                                    cursor: "pointer",
                                  }
                            }
                            onClick={this.goToPayModalPass}
                          >
                            <div
                              style={{
                                position: "absolute",
                                opacity: 0,
                              }}
                            >
                              Loch
                            </div>
                            <div
                              style={{
                                position: "absolute",
                                opacity: 0,
                              }}
                            >
                              Loch
                            </div>
                            <div
                              style={{
                                position: "absolute",
                                opacity: 0,
                              }}
                            >
                              Loch
                            </div>
                            <div
                              style={{
                                position: "absolute",
                                opacity: 0,
                              }}
                            >
                              Loch
                            </div>
                            <div
                              style={{
                                position: "absolute",
                                opacity: 0,
                              }}
                            >
                              Loch
                            </div>
                            <HighchartsReact
                              highcharts={Highcharts}
                              options={this.props?.ProfitLossAsset}
                              // constructorType={"stockChart"}
                              // allowChartUpdate={true}
                              // updateArgs={[true]}
                              containerProps={{
                                style: {
                                  height: this.props.noSubtitleBottomPadding
                                    ? "110%"
                                    : "",
                                },
                              }}
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </CustomOverlayUgradeToPremium>
              {/* Grapgh Section End */}

              {showFooterDropdown ? (
                <div className="chart-x-selection">
                  <DropDown
                    class="line-chart-dropdown"
                    list={footerDropdownLabels}
                    onSelect={(opt) => {
                      this.setState({
                        activeBadge: [{ name: "All", id: "" }],
                        activeBadgeList: [],
                      });
                      handleSelect(opt);
                    }}
                    title={this.props.activeDropdown}
                    activetab={this.props.activeDropdown}
                  />
                </div>
              ) : (
                ""
              )}
            </span>
          ) : null
        ) : (
          <div
            style={
              this.props.newHomeSetup
                ? {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: this.props.customGraphLoadingHeight
                      ? this.props.customGraphLoadingHeight
                      : this.props.isMobileGraph
                      ? "44rem"
                      : "35rem",
                  }
                : {
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }
            }
          >
            <Loading />
          </div>
        )}
      </div>
    );
  }
}

BarGraphSection.defaultProps = {
  isScroll: false,
};

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(BarGraphSection);
