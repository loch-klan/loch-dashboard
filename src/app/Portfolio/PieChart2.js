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
    console.log("pie", this.props.chainPortfolio)
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
      console.log("pie", this.props.chainPortfolio);
      let chainList = [];
      this.props.chainPortfolio && this.props.chainPortfolio.map((chain) => {
        chainList.push({
          name: chain.name,
          symbol: chain.symbol,
          total: chain.total,
          id: chain.id,
          color:chain.color
          })
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
    console.log("chain list", this.state.chainList);
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
            distance: 0,
            connectorWidth: 0,
            tickWidth: 0,
            padding: 12,
            allowOverlap: false,
            formatter: function () {
              return `<span class="f-s-16" style="color:${
                this.point.borderColor
              };">\u25CF &nbsp;</span><p class="inter-display-regular f-s-16" style="fill:#5B5B5B">${
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
                });
                this.series.data.map((data, i) => {
                  if (currentData.assetCode !== data.assetCode) {
                    data.dataLabel
                      .css({
                        opacity: 0,
                      })
                      .add();
                  } else {
                    data.dataLabel
                      .css({
                        opacity: 1,
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
    let chainList =
      this.state.selectedSection[0] && this.state.selectedSection[0].chain;
    chainList =
      chainList &&
      chainList.sort((a, b) => {
        return parseFloat(b.assetCount) - parseFloat(a.assetCount);
      });
    let totalCount = 0;
    chainList &&
      chainList.slice(2).map((data) => {
        totalCount += data.assetCount;
      });
    const { pieSectionDataEnabled, currency } = this.state;
    // console.log('pieSectionDataEnabled',pieSectionDataEnabled);
    return (
      <div
        className={`portfolio-over-container ${
          Object.keys(pieSectionDataEnabled).length > 0 ? "p-b-20" : "p-b-20"
        }`}
      >
        {/* // <div className={`portfolio-over-container m-b-32`} > */}
        <h1 className="inter-display-medium f-s-25 lh-30 overview-heading">
          Overview
        </h1>
        {Object.keys(this.state.assetData).length > 0 ? (
          <>
            <Row style={{ width: "100%" }}>
              <Col md={6} className="piechart-column">
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
                    <div style={{ marginRight: "4rem" }}>
                      <span
                        class="f-s-16 point-circle"
                        style={{
                          backgroundColor: pieSectionDataEnabled.borderColor,
                        }}
                      ></span>
                      <p
                        class="inter-display-regular f-s-16"
                        style={{
                          color: "#636467",
                          marginRight: "1.2rem",
                          display: "inline-block",
                        }}
                      >
                        {pieSectionDataEnabled.assetCode}
                      </p>
                      <p
                        class="inter-display-regular f-s-16"
                        style={{ color: "#B0B1B3", display: "inline-block" }}
                      >
                        {CurrencyType(false)}
                        {pieSectionDataEnabled.usd}
                        {" " + CurrencyType(true)}
                      </p>
                    </div>

                    <p
                      class="inter-display-medium f-s-16"
                      style={{ color: pieSectionDataEnabled.borderColor }}
                    >
                      {pieSectionDataEnabled.y.toFixed(2)}%
                    </p>
                  </div>
                ) : null}
              </Col>
              <Col md={6} style={{ marginTop: "-2rem" }}>
                <div>
                  {/* Manage wallet */}
                  <h2 className="inter-display-semi-bold f-s-16 lh-19 grey-313">
                    Manage Wallet(s)
                  </h2>
                  <div className="manage-wallet-card">
                    <div
                      className="inter-display-semi-bold f-s-16 lh-19 grey-233 wallet-btn cp"
                      onClick={this.handleManageClick}
                    >
                      <span className="wallet-icon-bg">
                        <Image src={ManageWallet} />
                      </span>
                      Manage wallet(s)
                    </div>
                    <div
                      className="inter-display-semi-bold f-s-16 lh-19 grey-233 wallet-btn cp"
                      onClick={this.handleAddWalletClick}
                    >
                      <span className="wallet-icon-bg">
                        <Image src={AddWalletAddress} />
                      </span>
                      Add wallet(s)
                    </div>
                  </div>

                  {/* Chains */}
                  <h2 className="inter-display-semi-bold f-s-16 lh-19 grey-313">
                    Chains
                  </h2>
                  <div className="chain-card" onClick={this.toggleChain}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
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
                          }}
                        />
                        {this.state.chainList && this.state.chainList.length}{" "}
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
                          this.state.chainList.map((chain) => {
                            return (
                              <div className="chain-list-item">
                                <span className="inter-display-semi-bold f-s-16 lh-19">
                                  <Image
                                    src={chain.symbol}
                                    style={{
                                      width: "2.6rem",
                                      height: "2.6rem",
                                      borderRadius: "6px",
                                      border: `1px solid ${chain.color}`,
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
                  <h2 className="inter-display-semi-bold f-s-16 lh-19 grey-313">
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
                  </div>
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
