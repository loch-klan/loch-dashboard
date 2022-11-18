import React from 'react';
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import { connect } from "react-redux";
import WelcomeCard from './WelcomeCard';
import PieChart from './PieChart';
import LineChart from './LineChart';
import { getCoinRate, getDetailsByLinkApi, getUserWallet, settingDefaultValues } from "./Api";
import { Loading } from 'react-loading-dot';
import { Button, Image, Row, Col } from 'react-bootstrap';
import AddWalletModalIcon from '../../assets/images/icons/wallet-icon.svg'
import FixAddModal from '../common/FixAddModal';
import { getAllCoins } from '../onboarding/Api.js'
import Metamask from '../../assets/images/MetamaskIcon.svg'
import Ethereum from '../../assets/images/icons/ether-coin.svg'
import CustomOverlay from '../../utils/commonComponent/CustomOverlay';
import TransactionTable from '../intelligence/TransactionTable';
import CoinChip from './../wallet/CoinChip';
import BarGraphSection from './../common/BarGraphSection';
import GainIcon from '../../assets/images/icons/GainIcon.svg'
import LossIcon from '../../assets/images/icons/LossIcon.svg'
import { searchTransactionApi } from '../intelligence/Api.js'
import { SEARCH_BY_WALLET_ADDRESS_IN, Method, START_INDEX, SORT_BY_TIMESTAMP , SORT_BY_FROM_WALLET, SORT_BY_TO_WALLET, SORT_BY_ASSET,SORT_BY_USD_VALUE_THEN, SORT_BY_METHOD, GROUP_BY_MONTH, GROUP_BY_YEAR, GroupByOptions, GROUP_BY_DATE} from '../../utils/Constant'
import sortByIcon from '../../assets/images/icons/TriangleDown.svg'
import moment from "moment"
import unrecognizedIcon from '../../image/unrecognized.svg'
import ExportIconWhite from '../../assets/images/apiModalFrame.svg'
import {
  ManageWallets,
  TransactionHistoryEView,
  VolumeTradeByCP,
  AverageCostBasisEView,
  TimeSpentHome,
} from "../../utils/AnalyticsFunctions.js";
import { getCurrentUser } from "../../utils/ManageToken";


import {getAssetGraphDataApi} from './Api';

class Portfolio extends BaseReactComponent {
  constructor(props) {
    super(props);
    props.location.state &&
      localStorage.setItem(
        "addWallet",
        JSON.stringify(props.location.state.addWallet)
      );
    this.state = {
      userWalletList: JSON.parse(localStorage.getItem("addWallet")),
      assetTotalValue: 0,
      loader: false,
      coinAvailable: true,
      fixModal: false,
      addModal: false,
      isLoading: true,
      tableLoading: true,
      graphLoading: true,
      sort: [{ key: SORT_BY_TIMESTAMP, value: false }],
      limit: 6,
      tableSortOpt: [
        {
          title: "time",
          up: false,
        },
        {
          title: "from",
          up: false,
        },
        {
          title: "to",
          up: false,
        },
        {
          title: "asset",
          up: false,
        },
        {
          title: "usdValue",
          up: false,
        },
        {
          title: "method",
          up: false,
        },
      ],
      startTime: "",
    };
  }

  handleChangeList = (value) => {
    this.setState({
      userWalletList: value,
    });
    this.props.getCoinRate();
  };
  handleFixModal = () => {
    this.setState({
      fixModal: !this.state.fixModal,
    });
  };

    handleAddModal = () => {
        this.setState({
            addModal: !this.state.addModal
        })
    }
    componentDidMount() {
      this.state.startTime = new Date() * 1;
    console.log("page Enter", this.state.startTime / 1000);
        if (this.props.match.params.id) {
            getDetailsByLinkApi(this.props.match.params.id, this)
        }
        this.props.getCoinRate()
        this.props.getAllCoins()
        this.getTableData()
        this.getGraphData()
    }

    componentWillUnmount() {
      let endTime = new Date() * 1;
      let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
      console.log("page Leave", endTime / 1000);
      console.log("Time Spent", TimeSpent);
      TimeSpentHome({ time_spent: TimeSpent + " seconds", session_id: getCurrentUser().id, email_address: getCurrentUser().email });
    }

    getGraphData = (groupByValue = GROUP_BY_MONTH) =>{
this.setState({graphLoading: true})
      let addressList = [];
      this.state.userWalletList.map((wallet)=> addressList.push(wallet.address))
      // console.log('addressList',addressList);
      let data = new URLSearchParams();
      data.append("wallet_addresses", JSON.stringify(addressList))
      data.append("group_criteria", groupByValue);
      getAssetGraphDataApi(data, this)
    }
    handleGroupBy = (value)=>{
      let groupByValue = GroupByOptions.getGroupBy(value);
      this.getGraphData(groupByValue)
    }
    getTableData = () => {
      this.setState({tableLoading: true})
        let arr = JSON.parse(localStorage.getItem("addWallet"))
        let address = arr.map((wallet) => {
            return wallet.address
        })
        let condition = [{ key: SEARCH_BY_WALLET_ADDRESS_IN, value: address }]
        let data = new URLSearchParams()
        data.append("start", START_INDEX)
        data.append("conditions", JSON.stringify(condition))
        data.append("limit", this.state.limit)
        data.append("sorts", JSON.stringify(this.state.sort))
        this.props.searchTransactionApi(data, this)
    }
    componentDidUpdate(prevProps , prevState) {
        // Typical usage (don't forget to compare props):
        // Check if the coin rate api values are changed
        if (this.props.portfolioState.coinRateList !== prevProps.portfolioState.coinRateList) {
            if (this.state && this.state.userWalletList && this.state.userWalletList.length > 0) {
                // console.log("ComponentdidUpdate")
                // Resetting the user wallet list, total and chain wallet
                this.props.settingDefaultValues();
                // Loops on coins to fetch details of each coin which exist in wallet
                this.state.userWalletList.map((wallet, i) => {
                    if (wallet.coinFound) {
                        wallet.coins.map((coin) => {
                            let userCoinWallet = {
                                address: wallet.address,
                                coinCode: coin.coinCode
                            }
                            this.props.getUserWallet(userCoinWallet, this)
                        })
                    }
                    if (i === (this.state.userWalletList.length - 1)) {
                        this.setState({
                            loader: false
                        });
                    }
                })
                // this.getTableData()
            }
            else {
                // console.log('Heyyy');
                // this.getTableData()
                this.props.settingDefaultValues();
            }
            if (prevProps.userWalletList !== this.state.userWalletList) {
                this.getTableData()
                this.getGraphData()
            }
        }
        else if(prevState.sort !== this.state.sort)
        {
            // console.log("Calling")
            this.getTableData()
        }
    }

  handleTableSort = (val) => {
    // console.log(val)
    let sort = [...this.state.tableSortOpt];
    let obj = [];
    sort.map((el) => {
      if (el.title === val) {
        if (val === "time") {
          obj = [
            {
              key: SORT_BY_TIMESTAMP,
              value: !el.up,
            },
          ];
        } else if (val === "from") {
          obj = [
            {
              key: SORT_BY_FROM_WALLET,
              value: !el.up,
            },
          ];
        } else if (val === "to") {
          obj = [
            {
              key: SORT_BY_TO_WALLET,
              value: !el.up,
            },
          ];
        } else if (val === "asset") {
          obj = [
            {
              key: SORT_BY_ASSET,
              value: !el.up,
            },
          ];
        } else if (val === "usdValue") {
          obj = [
            {
              key: SORT_BY_USD_VALUE_THEN,
              value: !el.up,
            },
          ];
        } else if (val === "method") {
          obj = [
            {
              key: SORT_BY_METHOD,
              value: !el.up,
            },
          ];
        }
        el.up = !el.up;
      } else {
        el.up = false;
      }
    });

    let check = sort.some((e) => e.up === true);
    let arr = [];

    if (check) {
      // when any sort option is true then sort the table with that option key
      // console.log("Check true")
      arr = obj;
    } else {
      // when all sort are false then sort by time in descending order
      // arr.slice(1,1)
      // console.log("Check False ")
      arr = [
        {
          key: SORT_BY_TIMESTAMP,
          value: false,
        },
      ];
    }

    // console.log(obj)
    this.setState({
      sort: arr,
      tableSortOpt: sort,
    });
  };

  render() {
    const { table } = this.props.intelligenceState;

    let tableData =
      table &&
      table.map((row) => {
        return {
          time: row.timestamp,
          from: {
            address: row.from_wallet.address,
            // wallet_metaData: row.from_wallet.wallet_metaData
            // wallet_metaData: {
            //   symbol: row.from_wallet.wallet_metaData
            //     ? row.from_wallet.wallet_metaData.symbol
            //     : unrecognizedIcon,
            // },
            wallet_metaData: {
              symbol: row.from_wallet.wallet_metadata ? row.from_wallet.wallet_metadata.symbol : null,
              text: row.from_wallet.wallet_metadata ? row.from_wallet.wallet_metadata.name : null
          }
          },
          to: {
            address: row.to_wallet.address,
            // wallet_metaData: row.to_wallet.wallet_metaData,
            // wallet_metaData: {
            //   symbol: row.to_wallet.wallet_metaData
            //     ? row.to_wallet.wallet_metaData.symbol
            //     : unrecognizedIcon,
            // },
            wallet_metaData: {
              symbol: row.to_wallet.wallet_metadata ? row.to_wallet.wallet_metadata.symbol : null,
              text: row.to_wallet.wallet_metadata ? row.to_wallet.wallet_metadata.name : null
          },
          },
          asset: {
            code: row.asset.code,
            symbol: row.asset.symbol,
          },

                usdValueToday: {
                    value: row.asset.value,
                    id: row.asset.id,
                },
                method: row.method
            }
        })


        const columnList = [
            {
                labelName:
                    <div className='cp history-table-header-col' id="time" onClick={() => this.handleTableSort("time")}>
                        <span className='inter-display-medium f-s-13 lh-16 grey-4F4'>Date</span>
                        <Image src={sortByIcon} className={!this.state.tableSortOpt[0].up ? "rotateDown" : "rotateUp"} />
                    </div>,
                dataKey: "time",
                // coumnWidth: 73,
                coumnWidth: 0.27,
                isCell: true,
                cell: (rowData, dataKey) => {
                    if (dataKey === "time") {
                        return moment(rowData.time).format('DD/MM/YYYY')
                    }
                }
            },
            {
                labelName:
                    <div className='cp history-table-header-col' id="from" onClick={() => this.handleTableSort("from")}>
                        <span className='inter-display-medium f-s-13 lh-16 grey-4F4'>From</span>
                        <Image src={sortByIcon} className={!this.state.tableSortOpt[1].up ? "rotateDown" : "rotateUp"} />
                    </div>,
                dataKey: "from",
                // coumnWidth: 61,
                coumnWidth: 0.12,
                isCell: true,
                cell: (rowData, dataKey) => {
                    if (dataKey === "from") {
                        return (
                            <CustomOverlay
                                position="top"
                                isIcon={false}
                                isInfo={true}
                                isText={true}
                                text={rowData.from.address}
                            >
                               {
                                rowData.from.wallet_metaData.symbol || rowData.from.wallet_metaData.text
                                ?
                                rowData.from.wallet_metaData.symbol
                                ?
                                <Image src={unrecognizedIcon} className="history-table-icon" />
                                :
                                <span>{rowData.from.wallet_metaData.text}</span>
                                :
                                 <Image src={unrecognizedIcon} className="history-table-icon" />
                              }
                                {/* <Image src={rowData.from.wallet_metaData.symbol} className="history-table-icon" /> */}
                            </CustomOverlay>
                        )
                    }
                }
            },
            {
                labelName:
                    <div className='cp history-table-header-col' id="to" onClick={() => this.handleTableSort("to")}>
                        <span className='inter-display-medium f-s-13 lh-16 grey-4F4'>To</span>
                        <Image src={sortByIcon} className={!this.state.tableSortOpt[2].up ? "rotateDown" : "rotateUp"} />
                    </div>,
                dataKey: "to",
                coumnWidth: 0.12,
                isCell: true,
                cell: (rowData, dataKey) => {
                    if (dataKey === "to") {
                        return (
                            <CustomOverlay
                                position="top"
                                isIcon={false}
                                isInfo={true}
                                isText={true}
                                text={rowData.to.address}
                            >
                                {/* <Image src={rowData.to.wallet_metaData.symbol} className="history-table-icon" /> */}
                                {
                                rowData.to.wallet_metaData.symbol || rowData.to.wallet_metaData.text
                                ?
                                rowData.to.wallet_metaData.symbol
                                ?
                                <Image src={unrecognizedIcon} className="history-table-icon" />
                                :
                                <span>{rowData.to.wallet_metaData.text}</span>
                                :
                                 <Image src={unrecognizedIcon} className="history-table-icon" />
                              }
                            </CustomOverlay>
                        )
                    }
                }
            },
            {
                labelName:
                <div className='cp history-table-header-col' id="asset" onClick={()=>this.handleTableSort("asset")}>
                    <span className='inter-display-medium f-s-13 lh-16 grey-4F4'>Asset</span>
                    <Image src={sortByIcon} className={!this.state.tableSortOpt[3].up ? "rotateDown" :"rotateUp"}/>
                </div>,
                dataKey: "asset",
                coumnWidth: 0.22,
                isCell: true,
                cell: (rowData, dataKey) => {
                    if (dataKey === "asset") {
                        return (
                             <CustomOverlay
                                position="top"
                                isIcon={false}
                                isInfo={true}
                                isText={true}
                                text={rowData.asset.code}
                            >
                            {/* <CoinChip
                                coin_img_src={rowData.asset.symbol}
                                // coin_code={rowData.asset.code}
                            /> */}
                            <Image src={rowData.asset.symbol} className="asset-symbol" />
                            </CustomOverlay>
                        )
                    }
                }
            },
            {
                labelName:
                <div className='cp history-table-header-col' id="usdValue" onClick={()=>this.handleTableSort("usdValue")}>
                    <span className='inter-display-medium f-s-13 lh-16 grey-4F4'>USD Value</span>
                    <Image src={sortByIcon} className={!this.state.tableSortOpt[4].up ? "rotateDown" :"rotateUp"}/>
                </div>,
                dataKey: "usdValue",
                coumnWidth: 0.15,
                isCell: true,
                cell: (rowData, dataKey) => {

                    if (dataKey === "usdValue") {
                        let chain = Object.entries(this.props.portfolioState.coinRateList)
                        let value;
                        chain.find((chain) => {
                            if (chain[0] === rowData.usdValueToday.id) {
                              value = (rowData.usdValueToday.value * chain[1].quote.USD.price)
                                return
                            }
                        })
                        // return value?.toFixed(2);
                        // return value
                        return (<CustomOverlay
                            position="top"
                            isIcon={false}
                            isInfo={true}
                            isText={true}
                            text={value?.toFixed(2)}
                        >
                            <div className="inter-display-medium f-s-13 lh-16 grey-313 ellipsis-div">{value?.toFixed(2)}</div>
                        </CustomOverlay>)
                    }
                }
            },
            {
                labelName:
                <div className='cp history-table-header-col' id="method" onClick={()=>this.handleTableSort("method")}>
                    <span className='inter-display-medium f-s-13 lh-16 grey-4F4'>Method</span>
                    <Image src={sortByIcon} className={!this.state.tableSortOpt[5].up ? "rotateDown" :"rotateUp"}/>
                </div>,
                dataKey: "method",
                coumnWidth: 0.22,
                isCell: true,
                cell: (rowData, dataKey) => {
                    if (dataKey === "method") {
                        return (
                            // <div
                            //     className={
                            //         `inter-display-medium f-s-13 lh-16 black-191 history-table-method
                            //         ${rowData.method === Method.BURN ? "burn"
                            //             :
                            //             rowData.method === Method.TRANSFER ? "transfer"
                            //                 :
                            //                 rowData.method === Method.MINT ? "mint"
                            //                     :
                            //                     rowData.method === Method.COMMIT ? "commit"
                            //                         :
                            //                         ""
                            //         }`
                            //     }
                            // >
                              <div className='inter-display-medium f-s-13 lh-16 black-191 history-table-method transfer'>
                              {rowData.method}
                                {/* {
                                    Method.getText(rowData.method)
                                } */}
                            </div>
                        )
                    }
                }
            }
        ]

    const labels = ["AAVE", "Binance", "Kraken", "Gemini", "Coinbase"];

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          min: 0,
          max: 40000,

          ticks: {
            stepSize: 8000,
            padding: 8,
            size: 12,
            lineHeight: 20,
            // family: "Helvetica Neue",
            family: "Inter-Regular",
            weight: 400,
            color: "#B0B1B3",
          },
          grid: {
            drawBorder: false,
            display: true,
            borderDash: (ctx) => (ctx.index == 0 ? [0] : [4]),
            drawTicks: false,
          },
        },
        x: {
          ticks: {
            font: "Inter-SemiBold",
            size: 10,
            lineHeight: 12,
            weight: 600,
            color: "#86909C",
            maxRotation: 0,
            minRotation: 0,
          },
          grid: {
            display: false,
            borderWidth: 1,
          },
        },
      },
    };

        const data = {
            labels,
            datasets: [
                {
                    data: [26000, 32300, 7600, 6000, 800],
                    backgroundColor: [
                        "rgba(100, 190, 205, 0.3)",
                        "rgba(34, 151, 219, 0.3)",
                        "rgba(114, 87, 211, 0.3)",
                        "rgba(141, 141, 141, 0.3)",
                        " rgba(84, 84, 191, 0.3)",
                    ],
                    borderColor: [
                        "#64BECD",
                        "#2297DB",
                        "#7257D3",
                        "#8D8D8D",
                        "#5454BF",
                    ],
                    borderWidth: 2,
                    borderRadius: {
                        topLeft: 6,
                        topRight: 6
                    },
                    borderSkipped: false,
                    barThickness: 38
                }
            ]
        }
        const costColumnData = [
            {
                labelName: "Asset",
                dataKey: "Asset",
                coumnWidth: 0.2,
                // coumnWidth: 118,
                isCell: true,
                cell: (rowData, dataKey) => {
                    if (dataKey === "Asset") {
                        return (
                            <CoinChip
                                coin_img_src={rowData.Asset}
                                coin_code="ETH"
                            />
                        )
                    }
                }
            }, {
                labelName: "Average Cost Price",
                dataKey: "AverageCostPrice",
                // coumnWidth: 153,
                coumnWidth: 0.2,
                isCell: true,
                cell: (rowData, dataKey) => {
                    if (dataKey === "AverageCostPrice") {
                        return <div className='inter-display-medium f-s-13 lh-16 grey-313 cost-common'>{rowData.AverageCostPrice}</div>
                    }
                }
            }, {
                labelName: "Current Price",
                dataKey: "CurrentPrice",
                // coumnWidth: 128,
                coumnWidth: 0.2,
                isCell: true,
                cell: (rowData, dataKey) => {
                    if (dataKey === "CurrentPrice") {
                        return <div className='inter-display-medium f-s-13 lh-16 grey-313 cost-common'>{rowData.CurrentPrice}</div>
                    }
                }
            }, {
                labelName: "Amount",
                dataKey: "Amount",
                // coumnWidth: 108,
                coumnWidth: 0.2,
                isCell: true,
                cell: (rowData, dataKey) => {
                    if (dataKey === "Amount") {
                        return rowData.Amount
                    }
                }
            }, {
                labelName: "Cost Basis",
                dataKey: "CostBasis",
                // coumnWidth: 100,
                coumnWidth: 0.2,
                isCell: true,
                cell: (rowData, dataKey) => {
                    if (dataKey === "CostBasis") {
                        return rowData.CostBasis
                    }
                }
            }, {
                labelName: "CurrentValue",
                dataKey: "CurrentValue",
                // coumnWidth: 140,
                coumnWidth: 0.2,
                isCell: true,
                cell: (rowData, dataKey) => {
                    if (dataKey === "CurrentValue") {
                        return rowData.CurrentValue
                    }
                }
            }, {
                labelName: "% Gain / Loss",
                dataKey: "GainLoss",
                // coumnWidth: 128,
                coumnWidth: 0.25,
                isCell: true,
                cell: (rowData, dataKey) => {
                    if (dataKey === "GainLoss") {
                        return (
                            <div className={`gainLoss ${rowData.GainLoss.status === "loss" ? "loss" : "gain"}`}>
                                <Image src={rowData.GainLoss.symbol} />
                                <div className="inter-display-medium f-s-13 lh-16 grey-313">{rowData.GainLoss.value}</div>
                            </div>)
                    }
                }
            }]
        const costTableData = [
            {
                Asset: Ethereum,
                AverageCostPrice: "$800.00",
                CurrentPrice: "$1,390.00",
                Amount: 3.97,
                CostBasis: 1.75,
                CurrentValue: "$5,514.00",
                GainLoss: {
                    status: "gain",
                    symbol: GainIcon,
                    // "42.45%",
                    value: "42.45%",
                }
            },
            {
                Asset: Ethereum,
                AverageCostPrice: "$25,000.00",
                CurrentPrice: "$21,080.00",
                Amount: 3.97,
                CostBasis: 2.56,
                CurrentValue: "$22,280.50",
                GainLoss: {
                    status: "loss",
                    symbol: LossIcon,
                    // "-18.45%"
                    value: "-18.45%"
                }
            }
        ]
        return (
            <div>
                {this.state.loader ? <Loading /> :
                    <div className="portfolio-page-section" >
                        {/* <Sidebar ownerName="" /> */}
                        <div className='portfolio-container page'>
                            <div className='portfolio-section'>
                                <WelcomeCard
                                    decrement={true}
                                    assetTotal={this.props.portfolioState && this.props.portfolioState.walletTotal ? this.props.portfolioState.walletTotal : 0}
                                    loader={this.state.loader}
                                    history={this.props.history}
                                    handleAddModal={this.handleAddModal}
                                    isLoading={this.state.isLoading}
                                    walletTotal={this.props.portfolioState.walletTotal}
                                    handleManage={() => {
                                      this.props.history.push("/wallets");
                                      ManageWallets({
                                        session_id: getCurrentUser().id,
                                        email_address: getCurrentUser().email,
                                      });
                                    }}
                                />
                            </div>
                            <div className='portfolio-section '>
                                <PieChart
                                    userWalletData={this.props.portfolioState && this.props.portfolioState.chainWallet && Object.keys(this.props.portfolioState.chainWallet).length > 0 ? Object.values(this.props.portfolioState.chainWallet) : null}
                                    assetTotal={this.props.portfolioState && this.props.portfolioState.walletTotal ? this.props.portfolioState.walletTotal : 0}
                                    // loader={this.state.loader}
                                    isLoading={this.state.isLoading}
                                    walletTotal={this.props.portfolioState.walletTotal}
                                />
                                {this.state.userWalletList.findIndex(w => w.coinFound !== true) > -1 && this.state.userWalletList[0].address !== ""

                                    ?
                                    <div className='fix-div' id="fixbtn">
                                        <div className='m-r-8 decribe-div'>
                                            <div className='inter-display-semi-bold f-s-16 lh-19 m-b-4 black-262'>Wallet undetected</div>
                                            <div className='inter-display-medium f-s-13 lh-16 grey-737'>One or more wallets were not detected </div>
                                        </div>
                                        <Button className='secondary-btn' onClick={this.handleFixModal}>Fix</Button>
                                    </div>
                                    : ""}
                            </div>
                            <div className='portfolio-section m-b-32'>
                                <LineChart
                                  assetValueData={this.state.assetValueData && this.state.assetValueData}
                                  coinLists={this.props.OnboardingState.coinsLists}
                                  isScrollVisible={false}
                                  handleGroupBy={(value)=>this.handleGroupBy(value)}
                                  graphLoading={this.state.graphLoading}
                                />
                            </div>
                            <div className='m-b-22 graph-table-section'>
                                <Row>
                                    <Col md={6}>
                                        <div className='m-r-16 section-table'>
                                            <TransactionTable
                                                title="Transaction History"
                                                handleClick={() => {
                                                  this.props.history.push(
                                                    "/intelligence/transaction-history"
                                                  );
                                                  TransactionHistoryEView({
                                                    session_id: getCurrentUser().id,
                                                    email_address: getCurrentUser().email,
                                                  });
                                                }}
                                                subTitle="In the last month"
                                                tableData={tableData}
                                                columnList={columnList}
                                                headerHeight={60}
                                                isLoading={this.state.tableLoading}
                                            />
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className='section-chart'>
                                          <div className='coming-soon-div'>
                                          <Image src={ExportIconWhite} className="coming-soon-img" />
                                          <p className='inter-display-regular f-s-13 lh-16 black-191'>This feature is coming soon.</p>
                                          </div>
                                            <BarGraphSection
                                                headerTitle="Volume Traded by Counterparty"
                                                headerSubTitle="In the last month"
                                                isArrow={true}
                                                data={data}
                                                options={options}
                                                isScroll={false}
                                                comingSoon={true}
                                            // width="100%"
                                            // height="100%"
                                            handleClick={() => {
                                              VolumeTradeByCP({
                                                session_id: getCurrentUser().id,
                                                email_address: getCurrentUser().email,
                                              });
                                            }}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            <div className='m-b-40 portfolio-cost-table-section'>
                            <div className='coming-soon-div'>
                                          <Image src={ExportIconWhite} className="coming-soon-img" />
                                          <p className='inter-display-regular f-s-13 lh-16 black-191'>This feature is coming soon.</p>
                                          </div>
                                <div className='portfolio-cost-table'>
                                    <TransactionTable
                                        title="Average Cost Basis"
                                        subTitle="Understand your average entry price"
                                        tableData={costTableData}
                                        columnList={costColumnData}
                                        headerHeight={64}
                                        comingSoon={true}
                                        handleClick={() => {
                                          AverageCostBasisEView({
                                            session_id: getCurrentUser().id,
                                            email_address: getCurrentUser().email,
                                          });
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {
                    this.state.fixModal &&
                    <FixAddModal
                        show={this.state.fixModal}
                        onHide={this.handleFixModal}
                        //  modalIcon={AddWalletModalIcon}
                        title="Fix your wallet connection"
                        subtitle="Add your wallet address to get started"
                        // fixWalletAddress={fixWalletAddress}
                        btnText="Done"
                        btnStatus={true}
                        history={this.props.history}
                        modalType="fixwallet"
                        changeWalletList={this.handleChangeList}
                    />
                }
                {this.state.addModal &&
                    <FixAddModal
                        show={this.state.addModal}
                        onHide={this.handleAddModal}
                        modalIcon={AddWalletModalIcon}
                        title="Add wallet address"
                        subtitle="Add more wallet address here"
                        modalType="addwallet"
                        btnStatus={false}
                        btnText="Go"
                        history={this.props.history}
                        changeWalletList={this.handleChangeList}
                    />}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    portfolioState: state.PortfolioState,
    OnboardingState: state.OnboardingState,
    intelligenceState: state.IntelligenceState
});
const mapDispatchToProps = {
    getCoinRate,
    getUserWallet,
    settingDefaultValues,
    getAllCoins,
    searchTransactionApi,
    getAssetGraphDataApi
}
Portfolio.propTypes = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);

