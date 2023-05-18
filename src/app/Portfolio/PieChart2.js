import React from "react";
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import { connect } from "react-redux";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import CustomLoader from "../common/CustomLoader";
import LinkIcon from "../../assets/images/link.svg";
import {
  amountFormat,
  CurrencyType,
  lightenDarkenColor,
  loadingAnimation,
  numToCurrency,
} from "../../utils/ReusableFunctions";
import unrecognized from "../../image/unrecognized.svg";
import { AssetType, DEFAULT_COLOR, DEFAULT_PRICE } from "../../utils/Constant";
import { Col, Image, Row } from "react-bootstrap";
import noDataImage from "../../image/no-data.png";
import Loading from "../common/Loading";
import {
  HomeDefiDebt,
  HomeDefiYield,
  HomeRefreshButton,
  PiechartChainName,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import ManageWallet from "../../assets/images/icons/ManageWallet.svg";
import ManageWalletWhite from "../../assets/images/icons/ManageWalletWhite.svg";
import AddWalletAddress from "../../assets/images/icons/AddWalletAddress.svg";
import AddWalletAddressWhite from "../../assets/images/icons/AddWalletAddressWhite.svg";
import arrowUp from "../../assets/images/arrow-up.svg";
import arrowDown from "../../assets/images/arrow-down.svg";
import Coin1 from "../../assets/images/Coin.svg";
import Coin2 from "../../assets/images/Coin2.svg";
import Coin3 from "../../assets/images/Coin3.svg";
import {
  getAllProtocol,
  getYieldBalanceApi,
  getUserWallet,
  getProtocolBalanceApi,
  getExchangeBalances,
} from "./Api";
import refreshIcon from "../../assets/images/icons/refresh-ccw.svg";
import { updateWalletListFlag } from "../common/Api";
import { updateDefiData } from "../defi/Api";

class PieChart2 extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      pieSectionDataEnabled: {},
      selectedSection: {},
      assetTotal: props.assetTotal,
      walletTotal: props.walletTotal,
      chartData: [],
      assetData: [],
      chartOptions: [],
      valueChanged: false,
      flag: false,
      isLoading: props.isLoading,

      currency: JSON.parse(localStorage.getItem("currency")),
      isChainToggle: false,
      chainList: null,
      assetPrice: null,

      // allProtocols: null,
      // totalYield: 0,
      // totalDebt: 0,
      // cardList: [],
      // sortedList: [],
      // DebtValues: [],
      // YieldValues: [],
      // BalanceSheetValue: {},

      isYeildToggle: false,
      isDebtToggle: false,
      upgradeModal: false,
      triggerId: 6,
      timeNumber: null,
      timeUnit: "",
      userPlan: JSON.parse(localStorage.getItem("currentPlan")) || "Free",
      defiLoader: false,

      // refresh
      userWalletList: JSON.parse(localStorage.getItem("addWallet")),
      isStopLoading: false,

      chainLoader: false,
      chartUpdate:true
    };
  }

  componentDidMount() {
    // for temp
   
    this.getCurrentTime();
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
      // this.setState({

      // })
    }
    // console.log("assetData mount", this.state.assetData)

    // console.log("pie", this.props.allCoinList);
    this.setState({
      chainLoader: true,
    });
    let chainList = [];

    let UserWallet = JSON.parse(localStorage.getItem("addWallet"));
    let uniquechains = [];
    // console.log("user wallet",UserWallet)
    UserWallet &&
      UserWallet?.map((item) => {
        item.coins &&
          item.coins?.map((coin, i) => {
            let isfound = false;
            this.props.chainPortfolio &&
              this.props.chainPortfolio?.map((chain) => {
                if (
                  coin?.coinName === chain?.name &&
                  !uniquechains.includes(chain?.name)
                ) {
                  isfound = true;
                  uniquechains.push(coin?.coinName);
                  chainList.push({
                    name: chain?.name,
                    symbol: chain?.symbol,
                    total: chain?.total,
                    id: chain?.id,
                    color: chain?.color,
                  });
                }
              });
            if (
              !isfound &&
              coin?.chain_detected &&
              !uniquechains.includes(coin?.coinName)
            ) {
              chainList.push({
                name: coin?.coinName,
                symbol: coin?.coinSymbol,
                total: 0.0,
                id: i,
                color: coin?.coinColor,
              });
            }
          });
      });
    // console.log("coinlist", chainList)
    // this.props.chainPortfolio &&
    //   this.props.chainPortfolio.map((chain) => {
    //     chainList.push({
    //       name: chain.name,
    //       symbol: chain.symbol,
    //       total: chain.total,
    //       id: chain.id,
    //       color: chain.color,
    //     });
    //   });

    chainList =
      chainList &&
      chainList.sort((a, b) => {
        return b.total - a.total;
      });
    this.setState({
      chainList,
      
    }, () => {
      setTimeout(() => {
        this.setState({
          chainLoader: false,
        });
      }, 500);
    });

    // console.log("props asset price", this.props.assetPrice);
    let assetPrice =
      this.props?.assetPrice &&
      this.props?.assetPrice?.reduce((obj, element) => {
        obj[element.id] = element;
        return obj;
      }, {});
    this.setState({
      assetPrice,
      isLoading: false,
    });

    // before logic
    // if (this.state.userPlan?.defi_enabled) {
    //   this.getYieldBalance();
    // } else {
    //   this.handleReset();
    //   // this.upgradeModal();
    // }
    // console.log("mount")
    // this.getYieldBalance();
  }
  getYieldBalance = () => {
    this.setState({
      defiLoader: true,
    });
    let UserWallet = JSON.parse(localStorage.getItem("addWallet"));
    //  console.log("wallet_address", UserWallet);

    if (UserWallet?.length !== 0) {
      // console.log("wallet_addres3s");
      UserWallet?.map((e) => {
        let data = new URLSearchParams();
        data.append("wallet_address", e.address);
        this.props.getProtocolBalanceApi(this, data);
      });
    } else {
      this.handleReset();
        this.setState({
          defiLoader: false,
        });
    }
    if (!UserWallet) {
      //  console.log("null")
      this.setState(
        {
          loadGetYieldBalance: true,
        },
        () => {
          setTimeout(() => {
            this.getYieldBalance();
          }, 1000);
        }
      );
    }
    // console.log("data", this.props.chainPortfolio);
  };
  componentDidUpdate(prevProps) {
    if (this.props.assetTotal !== prevProps.assetTotal) {
      this.setState({ assetTotal: this.props.assetTotal });
    // }
    // if (this.props.userWalletData !== prevProps.userWalletData) {
      // this.props.userWalletData && this.setState({ piechartisLoading: true })
      // if (this.props.userWalletData?.assetCode == "BTC") {
       
      // }
      // console.log("did update")
      // let btc = this.props?.userWalletData?.filter((e) => e.assetCode === "BTC");
          
      let assetData = [];
 
      if (
        this.props.userWalletData &&
        this.props.userWalletData.length > 0 &&
        this.props.assetTotal > 0
      ) {
        // for temp
        // console.log("asset", btc[0]?.assetValue);
     
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

          // console.log("assetData didupdate", this.state.assetData);

        //  console.log("updae");

        // balance load
      }
      this.setState({
        chartData: this.props.userWalletData,

        assetData:
          assetData && assetData?.length > 0
            ? assetData?.sort((a, b) => b.assetValue - a.assetValue)
            : [],
        chartOptions: {},
        pieSectionDataEnabled: {},
        chartUpdate: true,
      });
    }

      
// console.log("inside", this.props.chainPortfolio, prevProps.chainPortfolio);
    if (
      this.props.chainPortfolio !== prevProps.chainPortfolio ||
      this.props.chainPortfolio?.length !== prevProps.chainPortfolio?.length 
    ) {
      // console.log(
      //   "inside",
      //   this.props.chainPortfolio,
      //   prevProps.chainPortfolio
      // );

      let chainList = [];
      // this.props.allCoinList && this.props.allCoinList.map((item) => {
      //   let isfound = false;
      //   this.props.chainPortfolio &&
      //     this.props.chainPortfolio.map((chain) => {
      //       if (item.id === chain.id) {
      //         isfound = true;
      //         chainList.push({
      //           name: chain.name,
      //           symbol: chain.symbol,
      //           total: chain.total,
      //           id: chain.id,
      //           color: chain.color,
      //         });
      //       }

      //     });
      //   if (!isfound) {
      //     chainList.push({
      //       name: item.name,
      //       symbol: item.symbol,
      //       total: 0.00,
      //       id: item.id,
      //       color: item.color,
      //     });
      //   }
      // });
      let UserWallet = JSON.parse(localStorage.getItem("addWallet"));
      let uniquechains = [];

      UserWallet &&
        UserWallet?.map((item) => {
          item.coins &&
            item.coins?.map((coin, i) => {
              let isfound = false;
              this.props.chainPortfolio &&
                this.props.chainPortfolio?.map((chain) => {
                  if (
                    coin?.coinName === chain?.name &&
                    !uniquechains.includes(chain?.name)
                  ) {
                    isfound = true;
                    uniquechains.push(coin?.coinName);
                    chainList.push({
                      name: chain?.name,
                      symbol: chain?.symbol,
                      total: chain?.total,
                      id: chain?.id,
                      color: chain?.color,
                    });
                  }
                });
              if (
                !isfound &&
                coin?.chain_detected &&
                !uniquechains.includes(coin?.coinName)
              ) {
                uniquechains.push(coin?.coinName);
                chainList.push({
                  name: coin?.coinName,
                  symbol: coin?.coinSymbol,
                  total: 0.0,
                  id: i,
                  color: coin?.coinColor,
                });
              }
            });
        });
      // console.log("coinlist", chainList, uniquechains)
      // this.props.chainPortfolio &&
      //   this.props.chainPortfolio.map((chain) => {
      //     chainList.push({
      //       name: chain.name,
      //       symbol: chain.symbol,
      //       total: chain.total,
      //       id: chain.id,
      //       color: chain.color,
      //     });
      //   });

      chainList =
        chainList &&
        chainList.sort((a, b) => {
          return b.total - a.total;
        });
      this.setState(
        {
          chainList,
        },
        () => {
          setTimeout(() => {
            this.setState({
              chainLoader: false,
            });
          }, 1000);
          // console.log("state chianlist", this.state.chainList)
        }
      );
    }
    if (this.props.assetPrice != prevProps.assetPrice) {
      // console.log("props asset price", this.props.assetPrice);
      let assetPrice = this.props.assetPrice?.reduce((obj, element) => {
        obj[element.id] = element;
        return obj;
      }, {});

      this.setState({
        assetPrice,
      });
    }

    if (!this.props.commonState.defi) {
      this.props.updateDefiData({
        totalYield: 0,
        totalDebt: 0,
        cardList: [],
        sortedList: [],
        DebtValues: [],
        YieldValues: [],
        BalanceSheetValue: {},
      });

      // set defi page to true
      this.props.updateWalletListFlag("defi", true);
      this.setState(
        {
          isYeildToggle: false,
          isDebtToggle: false,
          upgradeModal: false,
          triggerId: 6,
          isChainToggle: false,
        },
        () => {
          //  getAllProtocol(this);
          this.getYieldBalance();
        }
      );

      // if (this.state.userPlan?.defi_enabled) {
      //   this.getYieldBalance();
      // } else {
      //   this.handleReset();
      //   // this.upgradeModal();
      // }
    }

    // if(!this.props.userWalletData && this.props.walletTotal === 0 && !this.props.isLoading){
    //   this.setState({piechartisLoading : this.props.isLoading === false ? false : true})
    // }

    // stop loader after refresh btn clicked
    if (this.state.isStopLoading) {
      
      this.props.setLoader(false);

      this.setState({
       isStopLoading:false
      })
    }
  }

  // for 0 all value
  handleReset = () => {
    let YieldValues = [];
    let DebtValues = [];
    let allAssetType = [20, 30, 40, 50, 60, 70];
    allAssetType.map((e) => {
      if (![30, 50].includes(e)) {
        YieldValues.push({
          id: e,
          name: AssetType.getText(e),
          totalPrice: 0,
        });
      } else {
         [30, 50].map((e) => {
           DebtValues.push({
             id: e,
             name: AssetType.getText(e),
             totalPrice: 0,
           });
         });
      }
    });

    // this.setState({
    //   YieldValues,
    //   DebtValues,
    // });
    // update data
    this.props.updateDefiData({ sortedList: "", YieldValues, DebtValues });
  };
  setHoverData = (e) => {
    this.setState({ pieSectionDataEnabled: e });
  };

  toggleChain = () => {
    this.setState({
      isChainToggle: !this.state.isChainToggle,
    });
    this.props.undetectedWallet(!this.state.isChainToggle);
  };

  toggleYield = () => {
    this.setState({
      isYeildToggle: !this.state.isYeildToggle,
      isDebtToggle: false,
    });
     HomeDefiDebt({
       session_id: getCurrentUser().id,
       email_address: getCurrentUser().email,
     });
  };

  toggleDebt = () => {
    this.setState({
      isDebtToggle: !this.state.isDebtToggle,
      isYeildToggle: false,
    });

    HomeDefiYield({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
  };
  handleAddWalletClick = () => {
    this.props.handleAddModal();
  };
  handleManageClick = () => {
    this.props.handleManage();
  };

  getCurrentTime = () => {
    let currentTime = new Date().getTime();

    let prevTime = JSON.parse(localStorage.getItem("refreshApiTime"));
    // calculate the time difference since the last click
    let timeDiff = prevTime ? currentTime - prevTime : currentTime;
    // console.log(
    //   "time deff",
    //   timeDiff,
    //   "prev time",
    //   prevTime,
    //   "current time",
    //   currentTime
    // );
    // format the time difference as a string
    let timeDiffString;

    // calculate the time difference in seconds, minutes, and hours
    let diffInSeconds = timeDiff / 1000;
    let diffInMinutes = diffInSeconds / 60;
    let diffInHours = diffInMinutes / 60;

    let unit = "";

    // format the time difference as a string
    if (diffInSeconds < 60) {
      // timeDiffString = Math.floor(diffInSeconds);
      timeDiffString = 0;

      unit = " just now";
    } else if (diffInMinutes < 60) {
      timeDiffString = Math.floor(diffInMinutes);
      unit = diffInMinutes < 2 ? " minute ago" : " minutes ago";
    } else {
      timeDiffString = Math.floor(diffInHours);
      unit = diffInHours < 2 ? " hour ago" : " hours ago";
    }

    // console.log("timediff str", timeDiffString);
    this.setState(
      {
        timeNumber: prevTime ? timeDiffString : "3",
        timeUnit: unit,
      },
      () => {
        setTimeout(() => {
          this.getCurrentTime();
        }, 300000);
      }
    );
  };

  RefreshButton = () => {
    HomeRefreshButton({
      email_address: getCurrentUser().email,
      session_id: getCurrentUser().id,
    });
    // get the current time
  this.props.setLoader(true);
    let currentTime = new Date().getTime();

    // console.log("state", this)
    // reset all data
    this.props.portfolioState.walletTotal = 0;
    this.props.portfolioState.chainPortfolio = {};
    this.props.portfolioState.assetPrice = {};
    this.props.portfolioState.chainWallet = [];
    this.props.portfolioState.yesterdayBalance = 0;

    // console.log("Refresh clicked");
    // localStorage.setItem("refreshApiTime", currentTime);
    let userWalletList = JSON.parse(localStorage.getItem("addWallet"));
  
         userWalletList?.map((wallet, i) => {
      if (wallet.coinFound) {
        wallet.coins?.map((coin) => {
          if (coin.chain_detected) {
            let userCoinWallet = {
              address: wallet.address,
              coinCode: coin.coinCode,
            };
            this.props.getUserWallet(userCoinWallet, this, true,i);
          }
        });
      }
         })
    
      this.props.getExchangeBalances(this, true);
    
 

    //  this.getCurrentTime();

    // getUserWallet(this);
  };

  render() {
 
    //  console.log("asset price props", this.props.assetPrice);
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
              )}</p></div><span class="inter-display-medium f-s-13 lh-16 grey-7C7">Total wallet assets</span></div>`,
              fontMetrics = this.renderer.fontMetrics(16);
            series.data?.map((e, i) => {
              e.dataLabel
                .css({
                  // opacity: 0,
                  display: "none",
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
            borderColor: "#F2F2F2",
            borderWidth: 1,
            // shadow: {
            //   color: "#000000",
            //   offsetY: 4,
            //   offsetX: 0,
            //   width:-4,
            //   opacity: 0.15,
            // },
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
                  isChainToggle: false,
                });
                if (document.getElementById("fixbtn")) {
                  {
                    document.getElementById("fixbtn").style.display = "none";
                  }
                }
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
                  if (document.getElementById("fixbtn")) {
                    {
                      document.getElementById("fixbtn").style.display = "flex";
                    }
                  }
                }
              },
              mouseOver: function () {
                var currentData = this;
                
                self.setState({
                  chartUpdate:false,
                });
                this.graphic.attr({
                  fill: this.options.borderColor,
                  // opacity: 1,
                  display: "block",
                  zIndex: 10,
                });
                this.series.data?.map((data, i) => {
                  
                  if (currentData.assetCode !== data.assetCode) {
                    
                    data.dataLabel
                      .css({
                        // opacity: 0,
                        display: "none",
                        zIndex: 10,
                      })
                      .add();
                  } else {
                    // console.log("mouse hover else", data)
                    data.dataLabel
                      .css({
                        // opacity: 1,
                        display: "block",
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
              this.points?.map((data, i) => {
                if (Object.keys(self.state.pieSectionDataEnabled).length > 0) {
                  if (
                    self.state.pieSectionDataEnabled.colorIndex !=
                    data.colorIndex
                  ) {
                    data.dataLabels[0]
                      .css({
                        // opacity: 0,
                        display: "none",
                      })
                      .add();
                  }
                } else {
                  data.dataLabels[0]
                    .css({
                      // opacity: 0,
                      display: "none",
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
            self.state?.assetData && self.state?.assetData?.length > 0
              ? self?.state?.assetData
              : [],
        },
      ],
    };
    
    // console.log("wallet address", JSON.parse(localStorage.getItem("addWallet")))
    let UserWallet = JSON.parse(localStorage.getItem("addWallet"));
    let chainList = [];
    let uniqueAddress = [];
    let uniqueList =
      this.state.selectedSection[0] && this.state.selectedSection[0]?.chain;
  
    uniqueList &&
      uniqueList?.map((chain) => {
        // console.log("chain",chain)
        let total = 0;
        let protocalName = chain?.protocalName;
        uniqueList?.map((item) => {
          // console.log("item", item.address, item.protocalName)
          if (
            chain?.address === item.address &&
            !uniqueAddress.includes(chain?.address) && !chain?.protocalName
          ) {
            total += item.assetCount;
          } else {
            if (
              chain?.protocalName &&
              chain?.protocalName === item.protocalName &&
              !uniqueAddress.includes(chain?.protocalName)
            ) {
              total += item.assetCount;
            }
          }
        });
        let displayAddress = "";
        let nickname = "";

        UserWallet &&
          UserWallet?.map((e) => {
            if (e.address === chain?.address) {
              displayAddress = e?.displayAddress;
              nickname = e?.nickname;
            }
          });
        !uniqueAddress.includes(chain?.address) && !chain?.protocalName &&
          chainList.push({
            address: chain?.address,
            assetCount: chain.assetCount,
            chainCode: chain?.chainCode,
            chainName: chain?.chainName,
            chainSymbol: chain?.chainSymbol,
            totalAssetCount: total,
            displayAddress: displayAddress,
            nickname: nickname,
            protocalName: protocalName,
          });
        
        !uniqueAddress.includes(chain?.protocalName) &&
          chain?.protocalName &&
          chainList.push({
            address: chain?.address,
            assetCount: chain.assetCount,
            chainCode: chain?.chainCode,
            chainName: chain?.chainName,
            chainSymbol: chain?.chainSymbol,
            totalAssetCount: total,
            displayAddress: displayAddress,
            nickname: nickname,
            protocalName: protocalName,
          });
        !uniqueAddress.includes(chain?.address) &&
          uniqueAddress.push(chain?.address);
        
        !uniqueAddress.includes(protocalName) &&
          uniqueAddress.push(protocalName);
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
        <>
          <Row style={{ width: "100%" }}>
            <Col
              md={7}
              className="piechart-column"
              style={{
                padding: 0,
                zIndex: 2,
                alignItems: this.props.isLoading ? "center" : "inherit",
              }}
            >
              {this.state?.assetData.length !== 0 && !this.props.isLoading ? (
                <div className="chart-section">
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={chartOptions}
                    updateArgs={[this.state.chartUpdate]}
                    oneToOne={true}
                    allowChartUpdate={this.state.chartUpdate}
                    containerProps={{ className: "custom-highchart" }}
                    immutable={true}
                  />
                </div> //  this.state.piechartisLoading === true && this.state.assetData === null
              ) : this.props.isLoading ? (
                <div style={{ marginTop: "-8rem" }}>
                  <Loading />
                </div>
              ) : (
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
              )}
            </Col>
            <Col md={5} style={{ marginTop: "-2rem", padding: 0, zIndex: 1 }}>
              <div>
                {/* Chains */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "end",
                  }}
                >
                  <h2
                    className="inter-display-regular f-s-13 lh-15 grey-969 cp refresh-btn"
                    onClick={this.RefreshButton}
                  >
                    <Image src={refreshIcon} />
                    Updated{" "}
                    <span
                      style={{ margin: "0px 3px" }}
                      className="inter-display-bold f-s-13 lh-15 grey-969"
                    >
                      {this.state.timeNumber === null
                        ? "3"
                        : this.state.timeNumber === 0
                        ? " just now"
                        : this.state.timeNumber}
                    </span>{" "}
                    {" " + this.state.timeUnit !== "" &&
                    this.state.timeNumber !== 0
                      ? this.state.timeUnit
                      : this.state.timeNumber == 0
                      ? ""
                      : "hours ago"}
                  </h2>
                </div>
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
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {this.state.chainList &&
                        this.state.chainList.slice(0, 3).map((item, i) => {
                          return (
                            <Image
                              src={item.symbol}
                              style={{
                                position: "relative",
                                marginLeft: `${i === 0 ? "0" : "-10"}px`,
                                width: "2.6rem",
                                height: "2.6rem",
                                borderRadius: "6px",
                                zIndex: `${
                                  i === 0 ? "3" : i === 1 ? "2" : "1"
                                }`,
                                objectFit: "cover",
                                border: `1px solid ${lightenDarkenColor(
                                  item.color,
                                  -0.15
                                )}`,
                              }}
                            />
                          );
                        })}

                      <span
                        className="inter-display-medium f-s-16 lh-19 grey-233"
                        style={{
                          marginLeft:
                            this.state.chainList?.length === 0 ? 0 : "1.2rem",
                        }}
                      >
                        {this.state.chainList &&
                        this.state.chainList?.length <= 1
                          ? (this.state.chainList?.length + 1) + " Network"
                          : (this.state.chainList?.length + 1) + " Networks"}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Image
                        src={arrowUp}
                        style={{
                          height: "1.25rem",
                          width: "1.25rem",
                          transform: "rotate(180deg)",
                        }}
                      />
                      {this.props.chainLoader && (
                        <div style={{ marginTop: "-6px", marginRight: "1rem" }}>
                          {loadingAnimation()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    className="chain-list"
                    style={{
                      display: `${this.state.isChainToggle ? "block" : "none"}`,
                    }}
                  >
                    <div className="chain-content">
                      {this.state.chainList &&
                        this.state.chainList?.map((chain, i) => {
                          return (
                            <div
                              className="chain-list-item"
                              key={i}
                              style={{
                                paddingBottom: "1rem",
                              }}
                            >
                              <span className="inter-display-medium f-s-16 lh-19">
                                <Image
                                  src={chain?.symbol}
                                  style={{
                                    width: "2.6rem",
                                    height: "2.6rem",
                                    borderRadius: "6px",
                                    objectFit: "cover",
                                    border: `1px solid ${lightenDarkenColor(
                                      chain?.color,
                                      -0.15
                                    )}`,
                                  }}
                                />
                                {chain?.name}
                              </span>
                              <span className="inter-display-medium f-s-15 lh-19 grey-233 chain-list-amt">
                                {CurrencyType(false)}
                                {amountFormat(
                                  chain?.total.toFixed(2),
                                  "en-US",
                                  "USD"
                                )}
                              </span>
                            </div>
                          );
                        })}
                      <div
                        className="chain-list-item"
                        // key={this.state.chainList.length + 1}
                        style={{
                          paddingBottom: "0rem",
                        }}
                      >
                        <span className="inter-display-medium f-s-16 lh-19">
                          <Image
                            src={LinkIcon}
                            style={{
                              width: "2.6rem",
                              height: "2.6rem",
                              padding:"0.55rem",
                              borderRadius: "6px",
                              objectFit: "cover",
                              border: `1px solid ${lightenDarkenColor(
                                "#000000",
                                -0.15
                              )}`,
                            }}
                          />
                          Centralized Exchanges
                        </span>
                        <span className="inter-display-medium f-s-15 lh-19 grey-233 chain-list-amt">
                          {CurrencyType(false)}
                          {amountFormat(
                            this.props.portfolioState?.centralizedExchanges.toFixed(
                              2
                            ),
                            "en-US",
                            "USD"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Balance sheet */}
                {/* {this.state.userPlan?.defi_enabled && (
                   
                  )} */}
                <>
                  <h2 className="inter-display-semi-bold f-s-16 lh-19 grey-313">
                    DeFi balance sheet
                  </h2>
                  <div style={{}} className="balance-sheet-card">
                    <div className="balance-card-header cp">
                      <div
                        onClick={this.toggleYield}
                        // style={
                        //   this.state.isYeildToggle ? {  } : {}
                        // }
                      >
                        <span
                          className="inter-display-semi-bold f-s-16 lh-19"
                          style={
                            this.state.isYeildToggle
                              ? { color: "#000000", marginRight: "0.8rem" }
                              : { color: "#636467", marginRight: "0.8rem" }
                          }
                        >
                          Credit
                        </span>
                        <span
                          className="inter-display-regular f-s-16 lh-19"
                          style={
                            this.state.isYeildToggle
                              ? { color: "#000000", marginRight: "0.8rem" }
                              : { color: "#B0B1B3", marginRight: "0.8rem" }
                          }
                        >
                          {CurrencyType(false)}
                          {this.props.defiState.YieldValues &&
                            numToCurrency(this.props.defiState.totalYield)}
                        </span>

                        <Image
                          src={arrowUp}
                          style={
                            this.state.isYeildToggle
                              ? { transform: "rotate(180deg)" }
                              : {}
                          }
                        />
                      </div>

                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div onClick={this.toggleDebt}>
                          <span
                            className="inter-display-semi-bold f-s-16 lh-19"
                            style={
                              this.state.isDebtToggle
                                ? { color: "#000000", marginRight: "0.8rem" }
                                : { color: "#636467", marginRight: "0.8rem" }
                            }
                          >
                            Debt
                          </span>
                          <span
                            className="inter-display-regular f-s-16 lh-19"
                            style={
                              this.state.isDebtToggle
                                ? { color: "#000000", marginRight: "0.8rem" }
                                : { color: "#B0B1B3", marginRight: "0.8rem" }
                            }
                          >
                            {CurrencyType(false)}
                            {this.props.defiState.DebtValues &&
                              numToCurrency(this.props.defiState.totalDebt)}
                          </span>

                          <Image
                            src={arrowUp}
                            style={
                              this.state.isDebtToggle
                                ? { transform: "rotate(180deg)" }
                                : {}
                            }
                          />
                        </div>
                        {this.state.defiLoader && (
                          <div style={{ marginTop: "-6px" }}>
                            {loadingAnimation()}
                          </div>
                        )}
                      </div>
                    </div>
                    {(this.state.isYeildToggle || this.state.isDebtToggle) && (
                      <div className="balance-dropdown">
                        <div className="balance-list-content">
                          {/* For yeild */}
                          {this.state.isYeildToggle && (
                            <div>
                              {this.props.defiState.YieldValues &&
                                this.props.defiState.YieldValues.map(
                                  (item, i) => {
                                    return (
                                      <div
                                        className="balance-sheet-list"
                                        style={
                                          i ===
                                          this.props.defiState.YieldValues
                                            .length -
                                            1
                                            ? { paddingBottom: "0.3rem" }
                                            : {}
                                        }
                                      >
                                        <span className="inter-display-medium f-s-16 lh-19">
                                          {item.name}
                                        </span>
                                        <span className="inter-display-medium f-s-15 lh-19 grey-233 balance-amt">
                                          {CurrencyType(false)}
                                          {amountFormat(
                                            item.totalPrice.toFixed(2),
                                            "en-US",
                                            "USD"
                                          )}
                                        </span>
                                      </div>
                                    );
                                  }
                                )}
                            </div>
                          )}

                          {/* For debt */}
                          {this.state.isDebtToggle && (
                            <div>
                              {this.props.defiState.DebtValues &&
                                this.props.defiState.DebtValues.map(
                                  (item, i) => {
                                    return (
                                      <div
                                        className="balance-sheet-list"
                                        style={
                                          i ===
                                          this.props.defiState.DebtValues
                                            .length -
                                            1
                                            ? { paddingBottom: "0.3rem" }
                                            : {}
                                        }
                                      >
                                        <span className="inter-display-medium f-s-16 lh-19">
                                          {item.name}
                                        </span>
                                        <span className="inter-display-medium f-s-15 lh-19 grey-233 balance-amt">
                                          {CurrencyType(false)}
                                          {amountFormat(
                                            item.totalPrice.toFixed(2),
                                            "en-US",
                                            "USD"
                                          )}
                                        </span>
                                      </div>
                                    );
                                  }
                                )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              </div>
            </Col>
            <Col
              md={chainList.length > 1 ? 12 : 7}
              style={
                chainList.length > 1
                  ? { padding: 0 }
                  : {
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                      padding: 0,
                      flexWrap: "wrap",
                    }
              }
            >
              {pieSectionDataEnabled &&
              Object.keys(pieSectionDataEnabled).length > 0 ? (
                <div
                  className="coin-hover-display"
                  style={chainList.length > 1 ? { width: "100%" } : {}}
                >
                  <div
                    className="coin-hover-display-text"
                    style={
                      {
                        // marginRight: "5.5rem",
                      }
                    }
                  >
                    <div className="coin-hover-display-text-icon">
                      <Image
                        className="coin-hover-display-icon"
                        src={
                          pieSectionDataEnabled &&
                          Object.keys(pieSectionDataEnabled).length > 0
                            ? pieSectionDataEnabled.assetSymbol || unrecognized
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
                                  pieSectionDataEnabled.borderColor == "#ffffff"
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

                            {pieSectionDataEnabled.assetType === 20 && (
                              <span className="inter-display-medium f-s-15 l-h-19 black-191 m-l-10">
                                "Staked"
                              </span>
                            )}
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
                  <div
                    style={
                      chainList.length > 1
                        ? {
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-evenly",
                            alignItem: "center",
                          }
                        : {
                            display: "flex",
                            justifyContent: "space-evenly",
                            alignItem: "center",
                          }
                    }
                  >
                    {chainList &&
                      chainList.slice(0, 3).map((data, index) => {
                        // console.log(data);
                        let isQuote =
                          this.state.assetPrice &&
                          this.state.assetPrice[
                            this.state.selectedSection[0].assetId
                          ].quote;
                        if (index < 2) {
                          return (
                            <>
                              <div
                                style={{
                                  width: "1px",
                                  height: "6.8rem",
                                  backgroundColor: "#E5E5E6",
                                }}
                              ></div>
                              <div className="coin-hover-display-text2">
                                <div className="coin-hover-display-text2-upper">
                                  <CustomOverlay
                                    position="top"
                                    className={"coin-hover-tooltip"}
                                    isIcon={false}
                                    isInfo={true}
                                    isText={true}
                                    text={data?.displayAddress || data?.address}
                                  >
                                    <span className="inter-display-regular f-s-15 l-h-19 grey-969 coin-hover-display-text2-upper-coin">
                                      {data?.protocalName ||
                                        data?.nickname ||
                                        data?.displayAddress ||
                                        data?.address}
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
                              <div
                                style={{
                                  width: "1px",
                                  height: "6.8rem",
                                  backgroundColor: "#E5E5E6",
                                }}
                              ></div>
                              <div className="coin-hover-display-text2">
                                <div className="coin-hover-display-text2-upper">
                                  <CustomOverlay
                                    position="top"
                                    className={"coin-hover-tooltip"}
                                    isIcon={false}
                                    isInfo={true}
                                    isText={true}
                                    text={data?.displayAddress || data?.address}
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
                </div>
              ) : null}
            </Col>
          </Row>
        </>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  portfolioState: state.PortfolioState,
  defiState: state.DefiState,
  commonState: state.CommonState,
});

const mapDispatchToProps = {
  getUserWallet,
  // page flag
  updateWalletListFlag,
  updateDefiData,
  getProtocolBalanceApi,

  getExchangeBalances,
};
export default connect(mapStateToProps, mapDispatchToProps)(PieChart2);
