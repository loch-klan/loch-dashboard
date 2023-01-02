import React from "react";
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import { connect } from "react-redux";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import CustomLoader from "../common/CustomLoader";
import {
  CurrencyType,
  lightenDarkenColor,
  numToCurrency,
} from "../../utils/ReusableFunctions";
import unrecognized from "../../image/unrecognized.svg";
import { DEFAULT_COLOR, DEFAULT_PRICE } from "../../utils/Constant";
import { Col, Image, Row } from "react-bootstrap";
import noDataImage from "../../image/no-data.png";
import Loading from "../common/Loading";
import { PiechartChainName } from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import ManageWallet from "../../assets/images/icons/ManageWallet.svg";
import ManageWalletWhite from "../../assets/images/icons/ManageWalletWhite.svg";
import AddWalletAddress from "../../assets/images/icons/AddWalletAddress.svg";
import AddWalletAddressWhite from "../../assets/images/icons/AddWalletAddressWhite.svg";
import arrowUp from "../../assets/images/arrow-up.svg"
import arrowDown from "../../assets/images/arrow-down.svg";
import Coin1 from "../../assets/images/Coin.svg";
import Coin2 from "../../assets/images/Coin2.svg";
import Coin3 from "../../assets/images/Coin3.svg";

class PieChart2 extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      pieSectionDataEnabled: {},
      selectedSection: {},
      assetTotal: props.assetTotal,
      loader: props.loader,
      walletTotal: props.walletTotal,
      chartData: [],
      assetData: [],
      chartOptions: [],
      valueChanged: false,
      flag: false,
      isLoading: props.isLoading,
      piechartisLoading: true,
      currency: JSON.parse(localStorage.getItem("currency")),
      isChainToggle: false,
      chainList: null
    };
  }

  componentDidMount() {
    if (this.props.userWalletData && this.props.userWalletData.length > 0) {
      let assetData = [];
      if (
        this.props.userWalletData &&
        this.props.userWalletData.length > 0 &&
        this.props.assetTotal > 0
      ) {
        for (let i = 0; i < this.props.userWalletData.length; i++) {
          let z =
            (parseFloat(this.props.userWalletData[i].assetValue) /
              parseFloat(this.props.assetTotal)) *
            100.0;
          assetData.push({
            assetType: this.props.userWalletData[i].assetType,
            assetId: this.props.userWalletData[i].assetId,
            name: this.props.userWalletData[i].assetName,
            y: z,
            usd: numToCurrency(this.props.userWalletData[i].assetValue),
            assetValue: parseFloat(this.props.userWalletData[i].assetValue),
            // borderColor: borderColors[i % 5],
            borderColor: this.props.userWalletData[i].color
              ? this.props.userWalletData[i].color
              : DEFAULT_COLOR,
            borderWidth: 2,
            color: this.props.userWalletData[i].color
              ? lightenDarkenColor(
                  this.props.userWalletData[i].color.slice(1),
                  0.2
                )
              : DEFAULT_COLOR,
            originalColor: this.props.userWalletData[i].color
              ? lightenDarkenColor(
                  this.props.userWalletData[i].color.slice(1),
                  0.2
                )
              : DEFAULT_COLOR,
            // color: colors[i % 5],
            // originalColor: colors[i % 5],
            assetSymbol: this.props.userWalletData[i].assetSymbol,
            assetCode: this.props.userWalletData[i].assetCode.toLocaleString(
              undefined,
              { maximumFractionDigits: 2 }
            ),
            count: this.props.userWalletData[i].totalCount,
          });
        }
      }
      this.setState({
        chartData: this.props.userWalletData,
        assetData:
          assetData && assetData.length > 0
            ? assetData.sort((a, b) => b.assetValue - a.assetValue)
            : [],
        chartOptions: {},
        pieSectionDataEnabled: {},
      });
    } else {
      this.setState({ piechartisLoading: this.props.isLoading });
    }
    // console.log("pie", this.props.chainPortfolio)
  }

  componentDidUpdate(prevProps) {
    if (this.props.assetTotal !== prevProps.assetTotal) {
      this.setState({ assetTotal: this.props.assetTotal });
    }
    if (this.props.userWalletData !== prevProps.userWalletData) {
      // this.props.userWalletData && this.setState({ piechartisLoading: true })
      let assetData = [];
      if (
        this.props.userWalletData &&
        this.props.userWalletData.length > 0 &&
        this.props.assetTotal > 0
      ) {
        for (let i = 0; i < this.props.userWalletData.length; i++) {
          let z =
            (parseFloat(this.props.userWalletData[i].assetValue) /
              parseFloat(this.props.assetTotal)) *
            100.0;
          assetData.push({
            assetType: this.props.userWalletData[i].assetType,
            assetId: this.props.userWalletData[i].assetId,
            name: this.props.userWalletData[i].assetName,
            y: z,
            usd: numToCurrency(this.props.userWalletData[i].assetValue),
            assetValue: parseFloat(this.props.userWalletData[i].assetValue),
            // borderColor: borderColors[i % 5],
            borderColor: this.props.userWalletData[i].color
              ? this.props.userWalletData[i].color
              : DEFAULT_COLOR,
            borderWidth: 2,
            color: this.props.userWalletData[i].color
              ? lightenDarkenColor(
                  this.props.userWalletData[i].color.slice(1),
                  0.2
                )
              : DEFAULT_COLOR,
            originalColor: this.props.userWalletData[i].color
              ? lightenDarkenColor(
                  this.props.userWalletData[i].color.slice(1),
                  0.2
                )
              : DEFAULT_COLOR,
            // color: colors[i % 5],
            // originalColor: colors[i % 5],
            assetSymbol: this.props.userWalletData[i].assetSymbol,
            assetCode: this.props.userWalletData[i].assetCode.toLocaleString(
              undefined,
              { maximumFractionDigits: 2 }
            ),
            count: this.props.userWalletData[i].totalCount,
          });
        }
      }
      this.setState({
        chartData: this.props.userWalletData,
        piechartisLoading: this.props.isLoading === false ? false : true,
        assetData:
          assetData && assetData.length > 0
            ? assetData.sort((a, b) => b.assetValue - a.assetValue)
            : [],
        chartOptions: {},
        pieSectionDataEnabled: {},
      });
    }
    if (this.props.chainPortfolio != prevProps.chainPortfolio) {
      // console.log("pie", this.props.allCoinList);
      let chainList = [];
      this.props.allCoinList && this.props.allCoinList.map((item) => {
        let isfound = false;
        this.props.chainPortfolio &&
          this.props.chainPortfolio.map((chain) => {
            if (item.id === chain.id) {
              isfound = true;
              chainList.push({
                name: chain.name,
                symbol: chain.symbol,
                total: chain.total,
                id: chain.id,
                color: chain.color,
              });
            }
            
          });
        if (!isfound) {
          chainList.push({
            name: item.name,
            symbol: item.symbol,
            total: 0.00,
            id: item.id,
            color: item.color,
          });
        }
      });
      
       chainList =
         chainList &&
         chainList.sort((a, b) => {
           return b.total - a.total;
         });
      this.setState({
        chainList
      })
    }
    // if(!this.props.userWalletData && this.props.walletTotal === 0 && !this.props.isLoading){
    //   this.setState({piechartisLoading : this.props.isLoading === false ? false : true})
    // }
  }
  setHoverData = (e) => {
    this.setState({ pieSectionDataEnabled: e });
  };

  toggleChain = () => {
    this.setState({
      isChainToggle: !this.state.isChainToggle,
    });
  }

   handleAddWalletClick = () =>{
        this.props.handleAddModal();
    }
    handleManageClick = ()=>{
      
        this.props.handleManage();
    }

  render() {
    // console.log("chain walletr", this.props.userWalletData);
    let self = this;
    let chartOptions = {
      chart: {
        styledMode: false,
        type: "pie",
        backgroundColor: null,
        height: 350,
        width: 350,
        events: {
          render: function () {
            var series = this.series[0],
              seriesCenter = series.center,
              x = seriesCenter[0] + this.plotLeft,
              y = seriesCenter[1] + this.plotTop,
              text = `<div class="pie-chart-middle-text-container"><div class="pie-chart-middle-text"><h1 class="space-grotesk-medium f-s-32 lh-38 black-1D2">${CurrencyType(
                false
              )}${numToCurrency(
                self.state.assetTotal
              )}  </h1><p class="inter-display-semi-bold f-s-10 lh-12 grey-7C7 pie-chart-middle-text-currency">${CurrencyType(
                true
              )}</p></div><span class="inter-display-medium f-s-13 lh-16 grey-7C7">Total Assets</span></div>`,
              fontMetrics = this.renderer.fontMetrics(16);
            series.data.map((e, i) => {
              e.dataLabel
                .css({
                  opacity: 0,
                })
                .add();
            });
            if (!this.customTitle) {
              this.customTitle = this.renderer
                .text(text, null, null, true)
                .css({
                  transform: "translate(-50%)",
                  top: "150px",
                })
                .add();
            } else {
              this.customTitle.destroy();
              this.customTitle = this.renderer
                .text(text, null, null, true)
                .css({
                  transform: "translate(-50%)",
                  top: "150px",
                })
                .add();
            }
            this.customTitle.attr({
              x,
              y: y - (fontMetrics.f + 5),
            });
          },
        },
      },
      accessibility: {
        enabled: false,
        point: {
          valueSuffix: "%",
        },
      },
      boost: {
        useGPUTranslations: true,
        usePreAllocated: true,
      },
      title: {
        text: null,
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        enabled: false,
        shared: true,
      },
      plotOptions: {
        pie: {
          size: 1000,
          cursor: "pointer",
          connectorPadding: 2,
          shadow: false,
          allowPointSelect: true,
          dataLabels: {
            outside: true,
            distance: 0,
            connectorWidth: 0,
            tickWidth: 0,
            padding: 12,
            allowOverlap: true,
            formatter: function () {
              return `<span class="f-s-16" style="color:${
                this.point.borderColor
              }; z-index: 10;">\u25CF &nbsp;</span><p class="inter-display-regular f-s-16" style="fill:#5B5B5B">${
                this.point.assetCode
              }&nbsp;</p> <p class="inter-display-regular f-s-16" style="fill:#B0B1B3"> ${CurrencyType(
                false
              )} ${this.point.usd} ${CurrencyType(
                true
              )}&nbsp;</p><p class="inter-display-medium f-s-16" style="fill:#B0B1B3"> ${this.point.y.toFixed(
                2
              )}% &nbsp;&nbsp;</p>`;
            },
            // x: 10,
            // y: -5,
            backgroundColor: "#FFFFFF",
            enabled: true,
            crop: false,
            overflow: "allow",
            color: "#636467",
            borderRadius: 8,
            verticalAlign: "top",
            style: {
              textShadow: false,
              textOverflow: "clip",
              whiteSpace: "nowrap",
              width: "max-content",
            },
          },
        },
        series: {
          animation: false, // for faster loading
          allowPointSelect: true,
          point: {
            events: {
              select: function () {
                var currentData = this;
                this.update({ color: this.options.borderColor });
                self.setState({
                  selectedSection: self.props.userWalletData.filter((data) => {
                    if (data.assetId === currentData.assetId) return data;
                  }),
                  pieSectionDataEnabled:
                    Object.keys(self.state.pieSectionDataEnabled).length > 0
                      ? currentData.colorIndex ===
                        self.state.pieSectionDataEnabled.colorIndex
                        ? {}
                        : currentData
                      : currentData,
                });
                // if (document.getElementById("fixbtn")) {
                //   {
                //     document.getElementById("fixbtn").style.display = "none";
                //   }
                // }
                PiechartChainName({
                  session_id: getCurrentUser().id,
                  email_address: getCurrentUser().email,
                  asset_clicked: currentData.options.name,
                  asset_amount: CurrencyType(false) + currentData.options.usd,
                });
              },
              unselect: function () {
                // console.log("UNSELECT")
                var currentData = this;
                this.update({ color: this.options.originalColor });
                if (
                  currentData.assetCode ===
                  self.state.pieSectionDataEnabled.assetCode
                ) {
                  self.setState({
                    pieSectionDataEnabled: {},
                    selectedSection: {},
                  });
                  //   if (document.getElementById("fixbtn")) {
                  //     {
                  //       document.getElementById("fixbtn").style.display = "flex";
                  //     }
                  //   }
                }
              },
              mouseOver: function () {
                var currentData = this;
                // console.log("move hover", this)
                this.graphic.attr({
                  fill: this.options.borderColor,
                  opacity: 1,
                  zIndex: 10,
                });
                this.series.data.map((data, i) => {
                  if (currentData.assetCode !== data.assetCode) {
                    data.dataLabel
                      .css({
                        opacity: 0,
                        zIndex: 10,
                      })
                      .add();
                  } else {
                    data.dataLabel
                      .css({
                        opacity: 1,
                        zIndex: 10,
                      })
                      .add();
                  }
                });
              },
            },
          },
          events: {
            mouseOut: function () {
              this.points.map((data, i) => {
                if (Object.keys(self.state.pieSectionDataEnabled).length > 0) {
                  if (
                    self.state.pieSectionDataEnabled.colorIndex !=
                    data.colorIndex
                  ) {
                    data.dataLabels[0]
                      .css({
                        opacity: 0,
                      })
                      .add();
                  }
                } else {
                  data.dataLabels[0]
                    .css({
                      opacity: 0,
                    })
                    .add();
                }
              });
            },
          },
        },
      },
      series: [
        {
          name: "Registrations",
          innerSize: "75%",
          colorByPoint: true,
          size: "100%",
          states: {
            hover: {
              halo: {
                size: 0,
              },
            },
          },
          data:
            self.state.assetData && self.state.assetData.length > 0
              ? self.state.assetData
              : [],
        },
      ],
    };
    // console.log("wallet address", JSON.parse(localStorage.getItem("addWallet")))
    let UserWallet = JSON.parse(localStorage.getItem("addWallet"));
    let chainList = [];
    let uniqueAddress = [];
    let uniqueList =
      this.state.selectedSection[0] && this.state.selectedSection[0].chain;
    
    uniqueList && uniqueList.map((chain) => {
      let total = 0;
      uniqueList.map((item) => {
        
        if (chain.address === item.address && !uniqueAddress.includes(chain.address)) {
          total += item.assetCount;
        }
      });
      let displayAddress = "";
      UserWallet && UserWallet.map((e) => {
        if (e.address === chain.address) {
          displayAddress = e.displayAddress;
        }
      });
      !uniqueAddress.includes(chain.address) &&
        chainList.push({
          address: chain.address,
          assetCount: chain.assetCount,
          chainCode: chain.chainCode,
          chainName: chain.chainName,
          chainSymbol: chain.chainSymbol,
          totalAssetCount: total,
          displayAddress: displayAddress,
        });
       !uniqueAddress.includes(chain.address) && uniqueAddress.push(chain.address)

    });
   
    // chainList =
    //   chainList &&
    //   chainList.sort((a, b) => {
    //     return parseFloat(b.assetCount) - parseFloat(a.assetCount);
    //   });
     chainList =
       chainList &&
       chainList.sort((a, b) => {
         return parseFloat(b.totalAssetCount) - parseFloat(a.totalAssetCount);
       });
    let totalCount = 0;
    // chainList &&
    //   chainList.slice(2).map((data) => {
    //     totalCount += data.assetCount;
    //   });
    chainList &&
      chainList.slice(2).map((data) => {
        totalCount += data.totalAssetCount;
      });
    const { pieSectionDataEnabled, currency } = this.state;
    // console.log("chainlist", chainList);
    // console.log("uniquelist", uniqueList);
    return (
      <div
        className={`portfolio-over-container ${
          Object.keys(pieSectionDataEnabled).length > 0 ? "p-b-20" : "p-b-20"
        }`}
        style={{
          overflow: "visible",
        }}
      >
        {/* // <div className={`portfolio-over-container m-b-32`} > */}
        <h1 className="inter-display-medium f-s-25 lh-30 overview-heading">
          Overview
        </h1>
        {Object.keys(this.state.assetData).length > 0 ? (
          <>
            <Row style={{ width: "100%" }}>
              <Col md={7} className="piechart-column" style={{ padding: 0, zIndex:2 }}>
                <div className="chart-section">
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={chartOptions}
                    updateArgs={[true]}
                    oneToOne={true}
                    allowChartUpdate={true}
                    containerProps={{ className: "custom-highchart" }}
                  />
                </div>
                {pieSectionDataEnabled &&
                Object.keys(pieSectionDataEnabled).length > 0 ? (
                  <div className="coin-hover-display">
                    <div className="coin-hover-display-text">
                      <div className="coin-hover-display-text-icon">
                        <Image
                          className="coin-hover-display-icon"
                          src={
                            pieSectionDataEnabled &&
                            Object.keys(pieSectionDataEnabled).length > 0
                              ? pieSectionDataEnabled.assetSymbol ||
                                unrecognized
                              : null
                          }
                        />
                      </div>
                      {pieSectionDataEnabled &&
                        Object.keys(pieSectionDataEnabled).length > 0 && (
                          <div className="coin-hover-display-text1">
                            <div className="coin-hover-display-text1-upper">
                              <span className="inter-display-medium f-s-18 l-h-21 black-000 coin-hover-display-text1-upper-coin">
                                {pieSectionDataEnabled &&
                                Object.keys(pieSectionDataEnabled).length > 0
                                  ? pieSectionDataEnabled.name
                                  : null}
                              </span>
                              <span
                                className="inter-display-medium f-s-18 l-h-21 yellow-F4A coin-hover-display-text1-upper-percent"
                                style={{
                                  color:
                                    pieSectionDataEnabled.borderColor ==
                                    "#ffffff"
                                      ? "#19191A"
                                      : pieSectionDataEnabled.borderColor,
                                }}
                              >
                                {pieSectionDataEnabled &&
                                Object.keys(pieSectionDataEnabled).length > 0
                                  ? pieSectionDataEnabled.y?.toFixed(2)
                                  : 0}
                                %
                              </span>
                              <span className="inter-display-medium f-s-15 l-h-19 black-191 m-l-10">
                                {pieSectionDataEnabled.assetType === 20 &&
                                  "Staked"}
                              </span>
                            </div>
                            <div className="coin-hover-display-text1-lower">
                              <span className="inter-display-medium f-s-15 l-h-19 black-191 coin-hover-display-text1-lower-coincount">
                                {pieSectionDataEnabled &&
                                Object.keys(pieSectionDataEnabled).length > 0
                                  ? numToCurrency(pieSectionDataEnabled.count)
                                  : null}
                              </span>
                              <span className="inter-display-semi-bold f-s-10 l-h-12 grey-ADA coin-hover-display-text1-lower-coincode">
                                {pieSectionDataEnabled &&
                                Object.keys(pieSectionDataEnabled).length > 0
                                  ? pieSectionDataEnabled.assetCode
                                  : null}
                              </span>
                              <span className="inter-display-medium f-s-15 l-h-19 black-191 coin-hover-display-text1-lower-coinrevenue">
                                {CurrencyType(false)}
                                {pieSectionDataEnabled &&
                                Object.keys(pieSectionDataEnabled).length > 0
                                  ? pieSectionDataEnabled.usd
                                  : null}
                              </span>
                              <span className="inter-display-semi-bold f-s-10 l-h-12 grey-ADA coin-hover-display-text1-lower-coincurrency">
                                {CurrencyType(true)}
                              </span>
                            </div>
                          </div>
                        )}
                    </div>
                    {chainList &&
                        chainList.slice(0, 3).map((data, index) => {
                        // console.log(data)
                        let isQuote =
                          this.props.portfolioState.coinRateList[
                            this.state.selectedSection[0].assetId
                          ].quote;
                        if (index < 2) {
                          return (
                            <>
                              <div className="coin-hover-display-text2">
                                <div className="coin-hover-display-text2-upper">
                                  <CustomOverlay
                                    position="top"
                                    className={"coin-hover-tooltip"}
                                    isIcon={false}
                                    isInfo={true}
                                    isText={true}
                                    text={data.displayAddress}
                                  >
                                    <span className="inter-display-regular f-s-15 l-h-19 grey-969 coin-hover-display-text2-upper-coin">
                                      {data.displayAddress}
                                    </span>
                                  </CustomOverlay>
                                  <span className="inter-display-medium f-s-15 l-h-19 grey-ADA coin-hover-display-text2-upper-percent">
                                    {(
                                      (100 * data.totalAssetCount) /
                                      pieSectionDataEnabled.count
                                    ).toFixed(2) + "%"}
                                  </span>
                                </div>
                                <div className="coin-hover-display-text2-lower">
                                  <span className="inter-display-medium f-s-15 l-h-19 black-191 coin-hover-display-text2-upper-coincount">
                                    {numToCurrency(data.totalAssetCount)}
                                  </span>

                                  <span className="inter-display-semi-bold f-s-10 l-h-12 grey-ADA coin-hover-display-text2-upper-coincode">
                                    {pieSectionDataEnabled.assetCode}
                                  </span>

                                  <span className="inter-display-medium f-s-15 l-h-19 black-191 coin-hover-display-text2-upper-coinrevenue">
                                    {isQuote == null
                                      ? DEFAULT_PRICE
                                      : numToCurrency(
                                          data.totalAssetCount *
                                            isQuote?.USD.price *
                                            currency?.rate
                                        )}
                                  </span>

                                  <span className="inter-display-semi-bold f-s-10 l-h-12 grey-ADA coin-hover-display-text2-upper-coincurrency">
                                    {CurrencyType(true)}
                                  </span>
                                </div>
                              </div>
                            </>
                          );
                        } else {
                          return (
                            <>
                              <div className="coin-hover-display-text2">
                                <div className="coin-hover-display-text2-upper">
                                  <CustomOverlay
                                    position="top"
                                    className={"coin-hover-tooltip"}
                                    isIcon={false}
                                    isInfo={true}
                                    isText={true}
                                    text={data.displayAddress}
                                  >
                                    <span className="inter-display-regular f-s-15 l-h-19 grey-969 coin-hover-display-text2-upper-coin">
                                      Other
                                    </span>
                                  </CustomOverlay>
                                  <span className="inter-display-medium f-s-15 l-h-19 grey-ADA coin-hover-display-text2-upper-percent">
                                    {(
                                      (100 * totalCount) /
                                      pieSectionDataEnabled.count
                                    ).toFixed(2) + "%"}
                                  </span>
                                </div>
                                <div className="coin-hover-display-text2-lower">
                                  <span className="inter-display-medium f-s-15 l-h-19 black-191 coin-hover-display-text2-upper-coincount">
                                    {numToCurrency(totalCount)}
                                  </span>

                                  <span className="inter-display-semi-bold f-s-10 l-h-12 grey-ADA coin-hover-display-text2-upper-coincode">
                                    {pieSectionDataEnabled.assetCode}
                                  </span>

                                  <span className="inter-display-medium f-s-15 l-h-19 black-191 coin-hover-display-text2-upper-coinrevenue">
                                    {numToCurrency(
                                      totalCount *
                                        this.props.portfolioState.coinRateList[
                                          this.state.selectedSection[0].assetId
                                        ].quote?.USD.price *
                                        currency?.rate
                                    ) || DEFAULT_PRICE}
                                  </span>
                                  <span className="inter-display-semi-bold f-s-10 l-h-12 grey-ADA coin-hover-display-text2-upper-coincurrency">
                                    {CurrencyType(true)}
                                  </span>
                                </div>
                              </div>
                            </>
                          );
                        }
                      })}
                  </div>
                ) : null}
              </Col>
              <Col md={5} style={{ marginTop: "-2rem", padding: 0, zIndex: 1 }}>
                <div>
                  {/* Chains */}
                  <h2 className="inter-display-semi-bold f-s-16 lh-19 grey-313">
                    Chains
                  </h2>
                  <div className="chain-card">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: "pointer",
                      }}
                      onClick={this.toggleChain}
                    >
                      <div
                        className="inter-display-medium f-s-16 lh-19 grey-233"
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Image
                          src={
                            this.state.chainList &&
                            this.state.chainList[0]?.symbol
                          }
                          style={{
                            position: "relative",
                            zIndex: 3,
                            marginLeft: "0px",
                            width: "2.6rem",
                            height: "2.6rem",
                            borderRadius: "6px",
                            objectFit: "cover",
                            border: `1px solid ${
                              this.state.chainList
                                ? lightenDarkenColor(
                                    this.state.chainList[0]?.color,
                                    -0.15
                                  )
                                : "transparent"
                            }`,
                          }}
                        />
                        <Image
                          src={
                            this.state.chainList &&
                            this.state.chainList[1]?.symbol
                          }
                          style={{
                            position: "relative",
                            marginLeft: "-10px",
                            width: "2.6rem",
                            height: "2.6rem",
                            borderRadius: "6px",
                            zIndex: 2,
                            objectFit: "cover",
                            border: `1px solid ${
                              this.state.chainList
                                ? lightenDarkenColor(
                                    this.state.chainList[1]?.color,
                                    -0.15
                                  )
                                : "transparent"
                            }`,
                          }}
                        />
                        <Image
                          src={
                            this.state.chainList &&
                            this.state.chainList[2]?.symbol
                          }
                          style={{
                            position: "relative",
                            marginLeft: "-10px",
                            zIndex: 1,
                            width: "2.6rem",
                            height: "2.6rem",
                            borderRadius: "6px",
                            marginRight: "1.5rem",
                            objectFit: "cover",
                            border: `1px solid ${
                              this.state.chainList
                                ? lightenDarkenColor(
                                    this.state.chainList[2]?.color,
                                    -0.15
                                  )
                                : "transparent"
                            }`,
                          }}
                        />
                        {this.state.chainList &&
                        this.state.chainList?.length > 10
                          ? "10+"
                          : this.state.chainList?.length}{" "}
                        Chains
                      </div>
                      <Image
                        src={arrowUp}
                        style={{
                          height: "1.25rem",
                          width: "1.25rem",
                          transform: "rotate(180deg)",
                        }}
                      />
                    </div>
                    <div
                      className="chain-list"
                      style={{
                        display: `${
                          this.state.isChainToggle ? "block" : "none"
                        }`,
                      }}
                    >
                      <div className="chain-content">
                        {this.state.chainList &&
                          this.state.chainList.map((chain, i) => {
                            return (
                              <div
                                className="chain-list-item"
                                key={i}
                                style={{
                                  paddingBottom: `${
                                    i === this.state.chainList.length - 1
                                      ? "0rem"
                                      : "1rem"
                                  }`,
                                }}
                              >
                                <span className="inter-display-medium f-s-16 lh-19">
                                  <Image
                                    src={chain.symbol}
                                    style={{
                                      width: "2.6rem",
                                      height: "2.6rem",
                                      borderRadius: "6px",
                                      objectFit: "cover",
                                      border: `1px solid ${lightenDarkenColor(
                                        chain.color,
                                        -0.15
                                      )}`,
                                    }}
                                  />
                                  {chain.name}
                                </span>
                                <span className="inter-display-medium f-s-15 lh-19 grey-233 chain-list-amt">
                                  {CurrencyType(false)}
                                  {chain.total.toFixed(2)}
                                </span>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                  {/* Balance sheet */}
                  {/* <h2 className="inter-display-semi-bold f-s-16 lh-19 grey-313">
                    Balance sheet
                  </h2>
                  <div style={{}} className="balance-sheet-card">
                    <div className="balance-card-header">
                      <div>
                        <span
                          className="inter-display-semi-bold f-s-16 lh-19"
                          style={{ color: "#636467", marginRight: "0.8rem" }}
                        >
                          Yield
                        </span>
                        <span
                          className="inter-display-regular f-s-16 lh-19"
                          style={{ color: "#B0B1B3", marginRight: "0.8rem" }}
                        >
                          $154m
                        </span>

                        <Image src={arrowUp} />
                      </div>
                      <div style={{ opacity: "0.5" }}>
                        <span
                          className="inter-display-semi-bold f-s-16 lh-19"
                          style={{ color: "#636467", marginRight: "0.8rem" }}
                        >
                          Debt
                        </span>
                        <span
                          className="inter-display-regular f-s-16 lh-19"
                          style={{ color: "#B0B1B3", marginRight: "0.8rem" }}
                        >
                          $154m
                        </span>

                        <Image src={arrowDown} />
                      </div>
                    </div>
                    <div className="balance-sheet-list">
                      <span className="inter-display-semi-bold f-s-16 lh-19">
                        Staked
                      </span>
                      <span className="inter-display-medium f-s-15 lh-19 grey-233 balance-amt">
                        $89,733.00
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "1.5rem 0rem",
                        borderTop: "1px solid rgba(229, 229, 230, 0.5)",
                      }}
                    >
                      <span className="inter-display-semi-bold f-s-16 lh-19">
                        Lent
                      </span>
                      <span
                        className="inter-display-medium f-s-15 lh-19 grey-233"
                        style={{
                          backgroundColor: "rgba(229, 229, 230, 0.5)",
                          borderRadius: "4px",
                          padding: "6px",
                        }}
                      >
                        $13,999.00
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "1.5rem 0rem 0rem",
                        borderTop: "1px solid rgba(229, 229, 230, 0.5)",
                      }}
                    >
                      <span className="inter-display-semi-bold f-s-16 lh-19">
                        Liquidity Pool Deposit
                      </span>
                      <span
                        className="inter-display-medium f-s-15 lh-19 grey-233"
                        style={{
                          backgroundColor: "rgba(229, 229, 230, 0.5)",
                          borderRadius: "4px",
                          padding: "6px",
                        }}
                      >
                        $54,769.00
                      </span>
                    </div>
                  </div> */}
                </div>
              </Col>
            </Row>
          </>
        ) : //  this.state.piechartisLoading === true && this.state.assetData === null
        this.props.isLoading ? (
          <Loading />
        ) : this.props.walletTotal === 0 ||
          this.state.assetData.length === 0 ? (
          <div className="no-data-piechart">
            <h3 className="inter-display-medium f-s-16 lh-19 grey-313 m-b-8">
              {CurrencyType(false)} 0.00
            </h3>
            <h3 className="inter-display-medium f-s-16 lh-19 grey-313 m-b-8">
              {CurrencyType(true)}
            </h3>
            <h3 className="inter-display-medium f-s-16 lh-19 grey-313 m-b-8">
              Total Assets
            </h3>
          </div>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  portfolioState: state.PortfolioState,
});
export default connect(mapStateToProps)(PieChart2);
