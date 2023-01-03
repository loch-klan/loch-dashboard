import React from 'react';
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import { connect } from "react-redux";
import WelcomeCard from './WelcomeCard';
import PieChart from './PieChart';
import LineChartSlider from "./LineCharSlider";
import { getCoinRate, getDetailsByLinkApi, getUserWallet, getYesterdaysBalanceApi, settingDefaultValues } from "./Api";
import { Button, Image, Row, Col } from 'react-bootstrap';
import AddWalletModalIcon from '../../assets/images/icons/wallet-icon.svg'
import FixAddModal from '../common/FixAddModal';
import { getAllCoins } from '../onboarding/Api.js'
import CustomOverlay from '../../utils/commonComponent/CustomOverlay';
import TransactionTable from '../intelligence/TransactionTable';
import BarGraphSection from './../common/BarGraphSection';
import { getProfitAndLossApi, searchTransactionApi } from '../intelligence/Api.js'
import { SEARCH_BY_WALLET_ADDRESS_IN, Method, START_INDEX, SORT_BY_TIMESTAMP , SORT_BY_FROM_WALLET, SORT_BY_TO_WALLET, SORT_BY_ASSET,SORT_BY_USD_VALUE_THEN, SORT_BY_METHOD, GROUP_BY_MONTH, GROUP_BY_YEAR, GroupByOptions, GROUP_BY_DATE, DEFAULT_PRICE} from '../../utils/Constant'
import sortByIcon from '../../assets/images/icons/triangle-down.svg'
import moment from "moment"
import unrecognizedIcon from '../../image/unrecognized.svg'
import {
  ManageWallets,
  TransactionHistoryEView,
  VolumeTradeByCP,
  AverageCostBasisEView,
  TimeSpentHome,
  TransactionHistoryAddress,
  TransactionHistoryDate,
  TransactionHistoryFrom,
  TransactionHistoryTo,
  TransactionHistoryAsset,
  TransactionHistoryUSD,
  TransactionHistoryMethod,
  ProfitLossEV,
  HomePage,
} from "../../utils/AnalyticsFunctions.js";
import { getCurrentUser } from "../../utils/ManageToken";
import {getAssetGraphDataApi} from './Api';
import { getAllCounterFeeApi } from '../cost/Api';
import Loading from '../common/Loading';
import FeedbackForm from '../common/FeedbackForm';
import { CurrencyType } from '../../utils/ReusableFunctions';
import PieChart2 from './PieChart2';

class Portfolio extends BaseReactComponent {
  constructor(props) {
    super(props);
    props.location.state &&
      props.location.state.addWallet &&
      localStorage.setItem(
        "addWallet",
        JSON.stringify(props.location.state.addWallet)
      );
    this.state = {
      id: props.match.params?.id,
      userWalletList: localStorage.getItem("addWallet")
        ? JSON.parse(localStorage.getItem("addWallet"))
        : [],
      assetTotalValue: 0,
      loader: false,
      coinAvailable: true,
      fixModal: false,
      addModal: false,
      isLoading: true,
      tableLoading: true,
      graphLoading: true,
      barGraphLoading: true,
      toggleAddWallet: true,
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
      GraphData: [],
      graphValue: null,
      externalEvents: [],
      counterGraphLoading: true,
      counterPartyData: [],
      counterPartyValue: null,
      isUpdate: 0,
      yesterdayBalance: 0,
      currentPage: "Home",
      // selectedCurrency: JSON.parse(localStorage.getItem('currency')),
      currency: JSON.parse(localStorage.getItem("currency")),
      counterGraphDigit: 3,
      assetPrice: null
    };
  }

  handleToggleAddWallet = () => {
    this.setState({
      toggleAddWallet: true,
    });
  };
  handleChangeList = (value) => {
    this.setState({
      userWalletList: value,
      isUpdate: this.state.isUpdate == 0 ? 1 : 0,
    });
    this.props.getCoinRate();
  };
  handleFixModal = () => {
    this.setState({
      fixModal: !this.state.fixModal,
      isUpdate: this.state.isUpdate == 0 ? 1 : 0,
    });
  };

  handleAddModal = () => {
    this.setState({
      addModal: !this.state.addModal,
      toggleAddWallet: false,
    });
  };
  componentDidMount() {
    this.state.startTime = new Date() * 1;
    // console.log("page Enter", this.state.startTime / 1000);
    HomePage({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
    if (this.props.location.state?.noLoad) {
    } else {
      this.apiCall();
    }
  }

  apiCall = () => {
    this.props.getAllCoins();
    if (this.props.match.params.id) {
      this.props.getDetailsByLinkApi(this.props.match.params.id, this);
    }
    this.props.getCoinRate();
    this.getTableData();
    this.getGraphData();
    getAllCounterFeeApi(this, false, false);
    getProfitAndLossApi(this, false, false, false);
    // getYesterdaysBalanceApi(this);
  };

  componentWillUnmount() {
    let endTime = new Date() * 1;
    let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
    // console.log("page Leave", endTime / 1000);
    // console.log("Time Spent", TimeSpent);
    TimeSpentHome({
      time_spent: TimeSpent,
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
  }

  getGraphData = (groupByValue = GROUP_BY_MONTH) => {
    this.setState({ graphLoading: true });
    let addressList = [];
    this.state.userWalletList.map((wallet) => addressList.push(wallet.address));
    // console.log('addressList',addressList);
    let data = new URLSearchParams();
    data.append("wallet_addresses", JSON.stringify(addressList));
    data.append("group_criteria", groupByValue);
    getAssetGraphDataApi(data, this);
  };
  handleGroupBy = (value) => {
    let groupByValue = GroupByOptions.getGroupBy(value);
    this.getGraphData(groupByValue);
  };
  getTableData = () => {
    this.setState({ tableLoading: true });
    let arr = JSON.parse(localStorage.getItem("addWallet") || "");
    let address = arr.map((wallet) => {
      return wallet.address;
    });
    let condition = [{ key: SEARCH_BY_WALLET_ADDRESS_IN, value: address }];
    let data = new URLSearchParams();
    data.append("start", START_INDEX);
    data.append("conditions", JSON.stringify(condition));
    data.append("limit", this.state.limit);
    data.append("sorts", JSON.stringify(this.state.sort));
    this.props.searchTransactionApi(data, this);
  };
  componentDidUpdate(prevProps, prevState) {
    // Typical usage (don't forget to compare props):
    // Check if the coin rate api values are changed
    if (
      this.props.portfolioState.coinRateList !==
      prevProps.portfolioState.coinRateList
    ) {
      if (
        this.state &&
        this.state.userWalletList &&
        this.state.userWalletList.length > 0
      ) {
        // console.log("ComponentdidUpdate")
        // Resetting the user wallet list, total and chain wallet
        this.props.settingDefaultValues();
        // Loops on coins to fetch details of each coin which exist in wallet
        this.state.userWalletList.map((wallet, i) => {
          if (wallet.coinFound) {
            wallet.coins.map((coin) => {
              if (coin.chain_detected) {
                let userCoinWallet = {
                  address: wallet.address,
                  coinCode: coin.coinCode,
                };
                this.props.getUserWallet(userCoinWallet, this);
              }
            });
          }
          if (i === this.state.userWalletList.length - 1) {
            getYesterdaysBalanceApi(this);
            this.setState({
              loader: false,
            });
          }
        });
        // this.getTableData()
      } else {
        // console.log('Heyyy');
        // this.getTableData()
        this.props.settingDefaultValues();
        this.setState({ isLoading: false });
      }
      if (prevProps.userWalletList !== this.state.userWalletList) {
        // console.log('byeee');
        this.state.userWalletList.length > 0 &&
          this.setState({ isLoading: true });
        // this.apiCall();
        this.getTableData();
        this.getGraphData();
        getAllCounterFeeApi(this, false, false);
        getProfitAndLossApi(this, false, false, false);
        getYesterdaysBalanceApi(this);
      }
    } else if (prevState.sort !== this.state.sort) {
      this.getTableData();
    } else if (
      prevProps.location.state?.noLoad !== this.props.location.state?.noLoad
    ) {
      localStorage.setItem(
        "addWallet",
        JSON.stringify(this.props.location.state.addWallet)
      );
      this.setState({ userWalletList: this.props.location.state.addWallet });
      this.apiCall();
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
    const { table, assetPriceList } = this.props.intelligenceState;
    const { userWalletList, currency } = this.state;
    // console.log("wallet list", this.state.userWalletList);
    let tableData =
      table &&
      table.map((row) => {
        let walletFromData = null;
        let walletToData = null;
        userWalletList && userWalletList.map((wallet)=>{
          if(
            wallet.address?.toLowerCase() === row.from_wallet.address?.toLowerCase() ||
            wallet.displayAddress?.toLowerCase() === row.from_wallet.address?.toLowerCase()){
              walletFromData = {
                wallet_metaData: wallet.wallet_metadata,
                displayAddress: wallet.displayAddress
              }
            }
            if(wallet.address?.toLowerCase() == row.to_wallet.address?.toLowerCase() ||
              wallet.displayAddress?.toLowerCase() == row.to_wallet.address?.toLowerCase()){
                walletToData = {
                  wallet_metaData: wallet.wallet_metadata,
                  displayAddress: wallet.displayAddress
                }
              }
          })
        return {
          time: row.timestamp,
          from: {
            address: row.from_wallet.address,
            metaData: walletFromData,
            wallet_metaData: {
              symbol: row.from_wallet.wallet_metadata
                ? row.from_wallet.wallet_metadata.symbol
                : null,
              text: row.from_wallet.wallet_metadata
                ? row.from_wallet.wallet_metadata.name
                : null,
            },
          },
          to: {
            address: row.to_wallet.address,
            metaData: walletToData,
            wallet_metaData: {
              symbol: row.to_wallet.wallet_metadata
                ? row.to_wallet.wallet_metadata.symbol
                : null,
              text: row.to_wallet.wallet_metadata
                ? row.to_wallet.wallet_metadata.name
                : null,
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
                <div className='cp history-table-header-col' id="time" onClick={() => {
                  this.handleTableSort("time");
                  TransactionHistoryDate({session_id: getCurrentUser().id, email_address: getCurrentUser().email});
                }}>
                        <span className='inter-display-medium f-s-13 lh-16 grey-4F4'>Date</span>
                        <Image src={sortByIcon} className={!this.state.tableSortOpt[0].up ? "rotateDown" : "rotateUp"} />
                    </div>,
                dataKey: "time",
                // coumnWidth: 73,
                coumnWidth: 0.2,
                isCell: true,
                cell: (rowData, dataKey) => {
                    if (dataKey === "time") {
                        return moment(rowData.time).format('DD/MM/YY')
                    }
                }
            },
            {
                labelName:
                <div className='cp history-table-header-col' id="from" onClick={() => {
                  this.handleTableSort("from");
                   TransactionHistoryFrom({
                     session_id: getCurrentUser().id,
                     email_address: getCurrentUser().email,
                   });
                }}>
                        <span className='inter-display-medium f-s-13 lh-16 grey-4F4'>From</span>
                        <Image src={sortByIcon} className={!this.state.tableSortOpt[1].up ? "rotateDown" : "rotateUp"} />
                    </div>,
                dataKey: "from",
                // coumnWidth: 61,
                coumnWidth: 0.14,
                isCell: true,
                cell: (rowData, dataKey) => {
                    if (dataKey === "from") {
                        return (
                          <CustomOverlay
                            position="top"
                            isIcon={false}
                            isInfo={true}
                            isText={true}
                            // text={rowData.from.address}
                            text={
                              rowData.from.metaData?.displayAddress
                                ? rowData.from.metaData?.displayAddress +
                                  ": " +
                                  rowData.from.address
                                : rowData.from.address
                            }
                          >
                            {rowData.from.metaData?.wallet_metaData ? (
                              <Image
                                src={
                                  rowData.from.metaData?.wallet_metaData
                                    ?.symbol || unrecognizedIcon
                                }
                                className="history-table-icon"
                                onMouseEnter={() => {
                                  // console.log("address", rowData.from.metaData);
                                  TransactionHistoryAddress({
                                    session_id: getCurrentUser().id,
                                    email_address: getCurrentUser().email,
                                    address_hovered: rowData.from.address,
                                    display_name: rowData.from.metaData?.displayAddress
                                  });
                                }}
                              />
                            ) : rowData.from.wallet_metaData.symbol ||
                              rowData.from.wallet_metaData.text ? (
                              rowData.from.wallet_metaData.symbol ? (
                                <Image
                                  src={rowData.from.wallet_metaData.symbol}
                                  className="history-table-icon"
                                  onMouseEnter={() => {
                                    //  console.log(
                                    //    "address",
                                    //    rowData.from.metaData
                                    //  );
                                    TransactionHistoryAddress({
                                      session_id: getCurrentUser().id,
                                      email_address: getCurrentUser().email,
                                      address_hovered: rowData.from.address,
                                      display_name:
                                        rowData.from.metaData?.displayAddress,
                                    });
                                  }}
                                />
                              ) : (
                                <span
                                  onMouseEnter={() => {
                                    //  console.log(
                                    //    "address",
                                    //    rowData.from.metaData
                                    //  );
                                    TransactionHistoryAddress({
                                      session_id: getCurrentUser().id,
                                      email_address: getCurrentUser().email,
                                      address_hovered: rowData.from.address,
                                      display_name:
                                        rowData.from.metaData?.displayAddress,
                                    });
                                  }}
                                >
                                  {rowData.from.wallet_metaData.text}
                                </span>
                              )
                            ) : rowData.from.metaData?.displayAddress ? (
                              <span
                                onMouseEnter={() => {
                                   
                                 TransactionHistoryAddress({
                                   session_id: getCurrentUser().id,
                                   email_address: getCurrentUser().email,
                                   address_hovered: rowData.from.address,
                                   display_name:
                                     rowData.from.metaData?.displayAddress,
                                 });
                                }}
                              >
                                {rowData.from.metaData?.displayAddress}
                              </span>
                            ) : (
                              <Image
                                src={unrecognizedIcon}
                                className="history-table-icon"
                                onMouseEnter={() => {
                                   
                                  TransactionHistoryAddress({
                                    session_id: getCurrentUser().id,
                                    email_address: getCurrentUser().email,
                                    address_hovered: rowData.from.address,
                                    display_name:
                                      rowData.from.metaData?.displayAddress,
                                  });
                                }}
                              />
                            )}
                            {/* <Image src={rowData.from.wallet_metaData.symbol} className="history-table-icon" /> */}
                          </CustomOverlay>
                        );
                    }
                }
            },
            {
                labelName:
                <div className='cp history-table-header-col' id="to" onClick={() => {
                  this.handleTableSort("to");
                  TransactionHistoryTo({
                    session_id: getCurrentUser().id,
                    email_address: getCurrentUser().email,
                  });

                }}>
                        <span className='inter-display-medium f-s-13 lh-16 grey-4F4'>To</span>
                        <Image src={sortByIcon} className={!this.state.tableSortOpt[2].up ? "rotateDown" : "rotateUp"} />
                    </div>,
                dataKey: "to",
                coumnWidth: 0.14,
                isCell: true,
                cell: (rowData, dataKey) => {
                    if (dataKey === "to") {
                        return (
                          <CustomOverlay
                            position="top"
                            isIcon={false}
                            isInfo={true}
                            isText={true}
                            // text={rowData.to.address}
                            text={
                              rowData.to.metaData?.displayAddress
                                ? rowData.to.metaData?.displayAddress +
                                  ": " +
                                  rowData.to.address
                                : rowData.to.address
                            }
                          >
                            {rowData.to.metaData?.wallet_metaData ? (
                              <Image
                                src={
                                  rowData.to.metaData?.wallet_metaData
                                    ?.symbol || unrecognizedIcon
                                }
                                className="history-table-icon heyyyy"
                                onMouseEnter={() => {
                                  TransactionHistoryAddress({
                                    session_id: getCurrentUser().id,
                                    email_address: getCurrentUser().email,
                                    address_hovered: rowData.to.address,
                                    display_name:
                                      rowData.to.metaData?.displayAddress,
                                  });
                                }}
                              />
                            ) : rowData.to.wallet_metaData.symbol ||
                              rowData.to.wallet_metaData.text ? (
                              rowData.to.wallet_metaData.symbol ? (
                                <Image
                                  src={rowData.to.wallet_metaData.symbol}
                                  className="history-table-icon"
                                  onMouseEnter={() => {
                                    TransactionHistoryAddress({
                                      session_id: getCurrentUser().id,
                                      email_address: getCurrentUser().email,
                                      address_hovered: rowData.to.address,
                                      display_name:
                                        rowData.to.metaData?.displayAddress,
                                    });
                                  }}
                                />
                              ) : (
                                <span
                                  onMouseEnter={() => {
                                    TransactionHistoryAddress({
                                      session_id: getCurrentUser().id,
                                      email_address: getCurrentUser().email,
                                      address_hovered: rowData.to.address,
                                      display_name:
                                        rowData.to.metaData?.displayAddress,
                                    });
                                  }}
                                >
                                  {rowData.to.wallet_metaData.text}
                                </span>
                              )
                            ) : rowData.to.metaData?.displayAddress ? (
                              <span
                                onMouseEnter={() => {
                                  TransactionHistoryAddress({
                                    session_id: getCurrentUser().id,
                                    email_address: getCurrentUser().email,
                                    address_hovered: rowData.to.address,
                                    display_name:
                                      rowData.to.metaData?.displayAddress,
                                  });
                                }}
                              >
                                {rowData.to.metaData?.displayAddress}
                              </span>
                            ) : (
                              <Image
                                src={unrecognizedIcon}
                                className="history-table-icon"
                                onMouseEnter={() => {
                                  TransactionHistoryAddress({
                                    session_id: getCurrentUser().id,
                                    email_address: getCurrentUser().email,
                                    address_hovered: rowData.to.address,
                                    display_name:
                                      rowData.to.metaData?.displayAddress,
                                  });
                                }}
                              />
                            )}
                          </CustomOverlay>
                        );
                    }
                }
            },
            {
                labelName:
                <div className='cp history-table-header-col' id="asset" onClick={() => {
                  this.handleTableSort("asset");
                    TransactionHistoryAsset({
                      session_id: getCurrentUser().id,
                      email_address: getCurrentUser().email,
                    });
                }}>
                    <span className='inter-display-medium f-s-13 lh-16 grey-4F4'>Asset</span>
                    <Image src={sortByIcon} className={!this.state.tableSortOpt[3].up ? "rotateDown" :"rotateUp"}/>
                </div>,
                dataKey: "asset",
                coumnWidth: 0.2,
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
                            <Image src={rowData.asset.symbol} className="asset-symbol" />
                            </CustomOverlay>
                        )
                    }
                }
            },
            {
                labelName:
                <div className='cp history-table-header-col' id="usdValue" onClick={() => {
                  this.handleTableSort("usdValue");
                  TransactionHistoryUSD({
                    session_id: getCurrentUser().id,
                    email_address: getCurrentUser().email,
                  });
                }}>
                    <span className='inter-display-medium f-s-13 lh-16 grey-4F4'>{CurrencyType(true)} Value</span>
                    <Image src={sortByIcon} className={!this.state.tableSortOpt[4].up ? "rotateDown" :"rotateUp"}/>
                </div>,
                dataKey: "usdValue",
                coumnWidth: 0.15,
                isCell: true,
                cell: (rowData, dataKey) => {

                    if (dataKey === "usdValue") {
                        let chain = Object.entries(assetPriceList)
                        let value;
                        chain.find((chain) => {
                            if (chain[0] === rowData.usdValueToday.id) {
                              value = (rowData.usdValueToday.value * chain[1].quote.USD.price * currency?.rate || DEFAULT_PRICE)
                                return
                            }
                        })
                        return (<CustomOverlay
                            position="top"
                            isIcon={false}
                            isInfo={true}
                            isText={true}
                            text={Number(value?.toFixed(2)).toLocaleString('en-US')}
                        >
                            <div className="inter-display-medium f-s-13 lh-16 grey-313 ellipsis-div">{Number(value?.toFixed(2)).toLocaleString('en-US')}</div>
                        </CustomOverlay>)
                    }
                }
            },
            {
                labelName:
                <div className='cp history-table-header-col' id="method" onClick={() => {
                  this.handleTableSort("method");
                   TransactionHistoryMethod({
                     session_id: getCurrentUser().id,
                     email_address: getCurrentUser().email,
                   });
                }}>
                    <span className='inter-display-medium f-s-13 lh-16 grey-4F4'>Method</span>
                    <Image src={sortByIcon} className={!this.state.tableSortOpt[5].up ? "rotateDown" :"rotateUp"}/>
                </div>,
                dataKey: "method",
                coumnWidth: 0.22,
                isCell: true,
                cell: (rowData, dataKey) => {
                    if (dataKey === "method") {
                        return (
                              <div className='inter-display-medium f-s-13 lh-16 black-191 history-table-method transfer'>
                              {rowData.method}
                            </div>
                        )
                    }
                }
            }
        ]
        return (
          <div>
            {this.state.loader ? (
              <Loading />
            ) : (
              <div className="portfolio-page-section">
                <div
                  className="portfolio-container page"
                  style={{ overflow: "visible" }}
                >
                  <div className="portfolio-section">
                    <WelcomeCard
                      yesterdayBalance={this.state.yesterdayBalance}
                      toggleAddWallet={this.state.toggleAddWallet}
                      handleToggleAddWallet={this.handleToggleAddWallet}
                      decrement={true}
                      assetTotal={
                        this.props.portfolioState &&
                        this.props.portfolioState.walletTotal
                          ? this.props.portfolioState.walletTotal
                          : 0
                      }
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
                  {/* <div
                    className="portfolio-section"
                    style={{ minWidth: "85rem", overflow: "hidden" }}
                  >
                    <PieChart
                      userWalletData={
                        this.props.portfolioState &&
                        this.props.portfolioState.chainWallet &&
                        Object.keys(this.props.portfolioState.chainWallet)
                          .length > 0
                          ? Object.values(this.props.portfolioState.chainWallet)
                          : null
                      }
                      assetTotal={
                        this.props.portfolioState &&
                        this.props.portfolioState.walletTotal
                          ? this.props.portfolioState.walletTotal
                          : 0
                      }
                      // loader={this.state.loader}
                      isLoading={this.state.isLoading}
                      walletTotal={this.props.portfolioState.walletTotal}
                    />
                    {this.state.userWalletList.findIndex(
                      (w) => w.coinFound !== true
                    ) > -1 && this.state.userWalletList[0].address !== "" ? (
                      <div className="fix-div" id="fixbtn">
                        <div className="m-r-8 decribe-div">
                          <div className="inter-display-semi-bold f-s-16 lh-19 m-b-4 black-262">
                            Wallet undetected
                          </div>
                          <div className="inter-display-medium f-s-13 lh-16 grey-737">
                            One or more wallets were not detected{" "}
                          </div>
                        </div>
                        <Button
                          className="secondary-btn"
                          onClick={this.handleFixModal}
                        >
                          Fix
                        </Button>
                      </div>
                    ) : (
                      ""
                    )}
                  </div> */}
                  <div
                    className="portfolio-section"
                    style={{ minWidth: "85rem" }}
                  >
                    <PieChart2
                      userWalletData={
                        this.props.portfolioState &&
                        this.props.portfolioState.chainWallet &&
                        Object.keys(this.props.portfolioState.chainWallet)
                          .length > 0
                          ? Object.values(this.props.portfolioState.chainWallet)
                          : null
                      }
                      chainPortfolio={
                        this.props.portfolioState &&
                        this.props.portfolioState.chainPortfolio &&
                        Object.keys(this.props.portfolioState.chainPortfolio)
                          .length > 0
                          ? Object.values(
                              this.props.portfolioState.chainPortfolio
                            )
                          : null
                      }
                      allCoinList={
                        this.props.OnboardingState &&
                        this.props.OnboardingState.coinsList &&
                        Object.keys(this.props.OnboardingState.coinsList)
                          .length > 0
                          ? Object.values(this.props.OnboardingState.coinsList)
                          : null
                      }
                      assetTotal={
                        this.props.portfolioState &&
                        this.props.portfolioState.walletTotal
                          ? this.props.portfolioState.walletTotal
                          : 0
                      }
                      assetPrice={
                        this.state.assetPrice &&
                        Object.keys(this.state.assetPrice).length > 0
                          ? Object.values(this.state.assetPrice)
                          : null
                      }
                      // loader={this.state.loader}
                      isLoading={this.state.isLoading}
                      walletTotal={this.props.portfolioState.walletTotal}
                      handleAddModal={this.handleAddModal}
                      handleManage={() => {
                        this.props.history.push("/wallets");
                        ManageWallets({
                          session_id: getCurrentUser().id,
                          email_address: getCurrentUser().email,
                        });
                      }}
                    />
                    {this.state.userWalletList.findIndex(
                      (w) => w.coinFound !== true
                    ) > -1 && this.state.userWalletList[0].address !== "" ? (
                      <div className="fix-div" id="fixbtn">
                        <div className="m-r-8 decribe-div">
                          <div className="inter-display-semi-bold f-s-16 lh-19 m-b-4 black-262">
                            Wallet undetected
                          </div>
                          <div className="inter-display-medium f-s-13 lh-16 grey-737">
                            One or more wallets were not detected{" "}
                          </div>
                        </div>
                        <Button
                          className="secondary-btn"
                          onClick={this.handleFixModal}
                        >
                          Fix
                        </Button>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="portfolio-section m-b-32">
                    <LineChartSlider
                      assetValueData={
                        this.state.assetValueData && this.state.assetValueData
                      }
                      externalEvents={
                        this.state.externalEvents && this.state.externalEvents
                      }
                      coinLists={this.props.OnboardingState.coinsLists}
                      isScrollVisible={false}
                      handleGroupBy={(value) => this.handleGroupBy(value)}
                      graphLoading={this.state.graphLoading}
                      isUpdate={this.state.isUpdate}
                      handleClick={() => {
                        this.props.history.push("/intelligence/asset-value");
                      }}
                    />
                  </div>
                  <div className="m-b-22 graph-table-section">
                    <Row>
                      <Col md={6}>
                        <div
                          className="m-r-16 section-table"
                          style={{ paddingBottom: "1.15rem" }}
                        >
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
                        <div className="profit-chart">
                          {this.state.graphValue ? (
                            <BarGraphSection
                              headerTitle="Net Flows"
                              headerSubTitle="Understand your entire portfolio's performance"
                              isArrow={true}
                              handleClick={() => {
                                this.props.history.push("/intelligence");
                                ProfitLossEV({
                                  session_id: getCurrentUser().id,
                                  email_address: getCurrentUser().email,
                                });
                              }}
                              isScrollVisible={false}
                              data={this.state.graphValue[0]}
                              options={this.state.graphValue[1]}
                              coinsList={this.props.OnboardingState.coinsList}
                              // timeFunction={(e,activeBadgeList) => this.timeFilter(e, activeBadgeList)}
                              marginBottom="m-b-32"
                              showFooter={false}
                              showBadges={false}
                              showPercentage={this.state.graphValue[2]}
                              // footerLabels = {["Max" , "5 Years","1 Year","6 Months","1 Week"]}
                              // handleBadge={(activeBadgeList, activeFooter) => this.handleBadge(activeBadgeList, activeFooter)}
                              // comingSoon={true}
                              className={"portfolio-profit-and-loss"}
                            />
                          ) : (
                            <div className="loading-wrapper">
                              <Loading />
                              <br />
                              <br />
                            </div>
                          )}
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <div className="m-b-40 portfolio-cost-table-section">
                    <div className="section-chart">
                      {this.state.counterPartyValue &&
                      !this.state.counterGraphLoading ? (
                        <BarGraphSection
                          headerTitle="Counterparty Volume Over Time"
                          headerSubTitle="Understand how much your counterparty charges you"
                          isArrow={true}
                          handleClick={() => {
                            VolumeTradeByCP({
                              session_id: getCurrentUser().id,
                              email_address: getCurrentUser().email,
                            });
                            this.props.history.push("/costs#cp");
                          }}
                          data={this.state.counterPartyValue[0]}
                          options={this.state.counterPartyValue[1]}
                          options2={this.state.counterPartyValue[2]}
                          digit={this.state.counterGraphDigit}
                          isScroll={true}
                          isScrollVisible={false}
                          comingSoon={false}
                          className={"portfolio-counterparty-fee"}
                        />
                      ) : (
                        <div className="loading-wrapper">
                          <Loading />
                          <br />
                          <br />
                        </div>
                      )}
                    </div>
                  </div>
                  <FeedbackForm page={"Home Page"} attribution={true} />
                </div>
              </div>
            )}
            {this.state.fixModal && (
              <FixAddModal
                show={this.state.fixModal}
                onHide={this.handleFixModal}
                //  modalIcon={AddWalletModalIcon}
                title="Fix your wallet address"
                subtitle="Add your wallet address to get started"
                // fixWalletAddress={fixWalletAddress}
                btnText="Done"
                btnStatus={true}
                history={this.props.history}
                modalType="fixwallet"
                changeWalletList={this.handleChangeList}
              />
            )}
            {this.state.addModal && (
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
              />
            )}
          </div>
        );
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
    getAssetGraphDataApi,
    getDetailsByLinkApi
}
Portfolio.propTypes = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);

