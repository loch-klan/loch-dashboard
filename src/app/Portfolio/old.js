import React from "react";
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import { connect } from "react-redux";
import WelcomeCard from "./WelcomeCard";
import PieChart from "./PieChart";
import LineChartSlider from "./LineCharSlider";
import {
  getCoinRate,
  getDetailsByLinkApi,
  getExchangeBalance,
  getUserWallet,
  getYesterdaysBalanceApi,
  settingDefaultValues,
  getExternalEventsApi,
} from "./Api";
import { Button, Image, Row, Col } from "react-bootstrap";
import AddWalletModalIcon from "../../assets/images/icons/wallet-icon.svg";
import FixAddModal from "../common/FixAddModal";
import { getAllCoins } from "../onboarding/Api.js";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import TransactionTable from "../intelligence/TransactionTable";
import BarGraphSection from "./../common/BarGraphSection";
import {
  getAllInsightsApi,
  getProfitAndLossApi,
  searchTransactionApi,
} from "../intelligence/Api.js";
import {
  SEARCH_BY_WALLET_ADDRESS_IN,
  Method,
  START_INDEX,
  SORT_BY_TIMESTAMP,
  SORT_BY_FROM_WALLET,
  SORT_BY_TO_WALLET,
  SORT_BY_ASSET,
  SORT_BY_USD_VALUE_THEN,
  SORT_BY_METHOD,
  GROUP_BY_MONTH,
  GROUP_BY_YEAR,
  GroupByOptions,
  GROUP_BY_DATE,
  DEFAULT_PRICE,
  InsightType,
} from "../../utils/Constant";
import sortByIcon from "../../assets/images/icons/triangle-down.svg";
import moment from "moment";
import unrecognizedIcon from "../../assets/images/icons/unrecognisedicon.svg";
import reduceCost from "../../assets/images/icons/reduce-cost.svg";
import reduceRisk from "../../assets/images/icons/reduce-risk.svg";
import increaseYield from "../../assets/images/icons/increase-yield.svg";
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
import { getAssetGraphDataApi } from "./Api";
import { getAllCounterFeeApi } from "../cost/Api";
import Loading from "../common/Loading";
import FeedbackForm from "../common/FeedbackForm";
import { CurrencyType, UpgradeTriggered } from "../../utils/ReusableFunctions";
import PieChart2 from "./PieChart2";
import UpgradeModal from "../common/upgradeModal";
import { GetAllPlan, getUser } from "../common/Api";
import { toast } from "react-toastify";
import { GraphHeader } from "../common/GraphHeader";

class Portfolio extends BaseReactComponent {
  constructor(props) {
    super(props);
    // console.log("props", props);
    if (props.location.state) {
      // window.sessionStorage.setItem(
      //   "addWallet",
      //   JSON.stringify(props.location.state?.addWallet)
      // );
    }

    this.state = {
      id: props.match.params?.id,
      userWalletList: window.sessionStorage.getItem("addWallet")
        ? JSON.parse(window.sessionStorage.getItem("addWallet"))
        : [],

      // page loader
      loader: false,

      // fix wallet address modal
      fixModal: false,

      // add wallet address modal
      addModal: false,

      // networth total loader
      isLoading: true,

      // transaction history table
      tableLoading: true,

      // asset value laoder
      graphLoading: true,

      // not used any where but update on api
      barGraphLoading: true,

      // not used any where
      toggleAddWallet: true,

      // sort
      sort: [{ key: SORT_BY_TIMESTAMP, value: false }],

      // transaction history table row limit
      limit: 6,

      // transaction history sort
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

      // page start time to calc page spent
      startTime: "",

      // get netflow api response
      GraphData: [],

      // netflow graph data
      graphValue: null,

      // external events data it set after asset value chart api response get
      externalEvents: [],

      // netflow loader
      netFlowLoading: true,

      // when go btn clicked run all api
      isUpdate: 0,

      // yesterday balance
      yesterdayBalance: 0,

      // current page name
      currentPage: "Home",

      // get currency
      currency: JSON.parse(window.sessionStorage.getItem("currency")),

      // not used any where on this page
      counterGraphDigit: 3,

      // Used in transaction history and piechart as props
      assetPrice: null,

      // asset value chart re load time
      isTimeOut: true,

      // undetected btn
      showBtn: false,

      // when we get response from api then its true
      apiResponse: false,

      // upgrade plan
      userPlan:
        JSON.parse(window.sessionStorage.getItem("currentPlan")) || "Free",
      upgradeModal: false,
      isStatic: false,
      triggerId: 0,

      // get lock token
      lochToken: JSON.parse(window.sessionStorage.getItem("stopClick")),

      // insight
      updatedInsightList: "",
      isLoadingInsight: true,

      // yeild and deb total
      totalYield: 0,
      totalDebt: 0,
    };
  }

  // get token
  getToken = () => {
    // console.log(this.state.lochToken)
    let token = window.sessionStorage.getItem("lochToken");
    if (!this.state.lochToken) {
      this.setState({
        lochToken: JSON.parse(window.sessionStorage.getItem("stopClick")),
      });
      setTimeout(() => {
        this.getToken();
      }, 1000);
    }

    if (token !== "jsk") {
      window.sessionStorage.setItem("stopClick", true);
      let obj = UpgradeTriggered();

      if (obj.trigger) {
        this.setState(
          {
            triggerId: obj.id,
            isStatic: true,
          },
          () => {
            this.upgradeModal();
          }
        );
      }
    }
  };

  // upgrade modal
  upgradeModal = () => {
    this.setState({
      upgradeModal: !this.state.upgradeModal,
    });
  };

  // toggle wallet btn
  handleToggleAddWallet = () => {
    this.setState({
      toggleAddWallet: true,
    });
  };

  // when press go this function run
  handleChangeList = (value) => {
    this.setState({
      userWalletList: value,
      isUpdate: this.state.isUpdate == 0 ? 1 : 0,
      isLoading: true,
      isLoadingInsight: true,
    });
  };

  // undetected modal
  handleFixModal = () => {
    this.setState({
      fixModal: !this.state.fixModal,
      // isUpdate: this.state.isUpdate == 0 && this.state.fixModal ? 1 : 0,
    });
  };

  // add wallet modal
  handleAddModal = () => {
    this.setState({
      addModal: !this.state.addModal,
      toggleAddWallet: false,
    });
  };

  componentDidMount() {
    // get token to check if wallet address loaded on not
    this.getToken();
    this.state.startTime = new Date() * 1;

    // if share link store share id to show upgrade modal
    if (this.props.match.params.id) {
      window.sessionStorage.setItem("share_id", this.props.match.params.id);
    }

    HomePage({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });

    if (this.props.location.state?.noLoad) {
    } else {
      // call api if no share link
      this.apiCall();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // Wallet update response when press go
    if (this.state.apiResponse) {
      if (this.props.location.state?.noLoad === undefined) {
        this.props.getCoinRate();
        this.setState({
          apiResponse: false,
        });
      }
    }

    // Typical usage (don't forget to compare props):
    // Check if the coin rate api values are changed
    if (
      this.props.portfolioState.coinRateList !==
      prevProps.portfolioState.coinRateList
    ) {
      // console.log("inside coin rate list");
      // if wallet address change
      if (
        this.state &&
        this.state.userWalletList &&
        this.state.userWalletList?.length > 0
      ) {
        // console.log("inside if");
        // Resetting the user wallet list, total and chain wallet
        this.props.settingDefaultValues();

        // Loops on coins to fetch details of each coin which exist in wallet
        let isFound = false;
        this.state.userWalletList?.map((wallet, i) => {
          if (wallet.coinFound) {
            isFound = true;
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

          if (i === this.state.userWalletList?.length - 1) {
            // run this api if itws value 0
            this.props.getYesterdaysBalanceApi(this);
            this.setState({
              loader: false,
            });
          }
        });

        // connect exchange api
        this.props.getExchangeBalance("binance", this);
        this.props.getExchangeBalance("coinbase", this);

        if (!isFound) {
          this.setState({
            loader: false,
            isLoading: false,
          });
        }
      } else {
        // console.log("inside else");
        // Resetting the user wallet list, total and chain wallet
        this.props.settingDefaultValues();

        // when wallet address not present run connect exchnage api
        this.props.getExchangeBalance("binance", this);
        this.props.getExchangeBalance("coinbase", this);

        // net worth total loader
        this.setState({ isLoading: false });
      }

      if (prevProps.userWalletList !== this.state.userWalletList) {
        // console.log("inside diff userWalletlist");
        this.state.userWalletList?.length > 0 &&
          this.setState({
            netFlowLoading: true,
            isLoadingInsight: true,
          });

        // run this when table value is []
        this.getTableData();

        // asset value run when its value null
        this.getGraphData();

        // - remove form home
        // getAllCounterFeeApi(this, false, false);

        // run when graphValue == null and  GraphData: [],
        this.props.getProfitAndLossApi(this, false, false, false);

        // run this api if itws value 0
        this.props.getYesterdaysBalanceApi(this);

        // run when updatedInsightList === ""
        this.props.getAllInsightsApi(this);
        this.props.GetAllPlan();
        this.props.getUser(this);
      }
    } else if (prevState.sort !== this.state.sort) {
      // sort table
      this.getTableData();
    } else if (
      prevProps.location.state?.noLoad !== this.props.location.state?.noLoad
    ) {
      // if share link
      if (this.props.location.state?.addWallet != undefined) {
        window.sessionStorage.setItem(
          "addWallet",
          JSON.stringify(this.props.location.state?.addWallet)
        );
        this.setState({ userWalletList: this.props.location.state?.addWallet });
        this.apiCall();
      }
    }
  }

  apiCall = () => {
    //console.log("APPCALL");
    this.props.getAllCoins();
    if (this.props.match.params.id) {
      // if share link call this app
      this.props.getDetailsByLinkApi(this.props.match.params.id, this);
    } else {
      // run all api
      // console.log("run all api");

      // update wallet
      this.props.getCoinRate();

      // transaction history
      this.getTableData();

      // asset value chart
      this.getGraphData();

      // counter free chart api - remove form home
      // getAllCounterFeeApi(this, false, false);

      // netflow api
      this.props.getProfitAndLossApi(this, false, false, false);

      // Insight api
      this.props.getAllInsightsApi(this);

      // get all upgrade plans
      this.props.GetAllPlan();

      // get users current plan
      this.props.getUser(this);
    }
  };

  componentWillUnmount() {
    let endTime = new Date() * 1;
    let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
    TimeSpentHome({
      time_spent: TimeSpent,
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
    });
  }

  // asset value chart api call
  getGraphData = (groupByValue = GROUP_BY_MONTH) => {
    //console.log("calling graph");
    this.setState({ graphLoading: true });
    let addressList = [];
    this.state.userWalletList.map((wallet) => addressList.push(wallet.address));
    let data = new URLSearchParams();
    data.append("wallet_addresses", JSON.stringify(addressList));
    data.append("group_criteria", groupByValue);
    this.props.getAssetGraphDataApi(data, this);
    this.state.isTimeOut &&
      setTimeout(() => {
        this.setState(
          {
            isTimeOut: false,
          },
          () => {
            this.props.getAssetGraphDataApi(data, this);
            // //console.log("api called", this);
          }
        );
      }, 10000);
  };

  // filter asset value chart
  handleGroupBy = (value) => {
    let groupByValue = GroupByOptions.getGroupBy(value);
    this.getGraphData(groupByValue);
  };

  // transaction history table data
  getTableData = () => {
    //console.log("calling table");
    this.setState({ tableLoading: true });
    let arr = this.state.userWalletList;
    let address = arr?.map((wallet) => {
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

  // when api return response then this function run
  CheckApiResponse = (value) => {
    if (this.props.location.state?.noLoad === undefined) {
      this.setState({
        apiResponse: value,
      });
    }
  };

  // sort transaction history api
  handleTableSort = (val) => {
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
          // console.log("el.up", el.up)
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

    this.setState({
      sort: obj,
      tableSortOpt: sort,
    });
  };

  // this is for undetected wallet button zIndex
  undetectedWallet = (e) => {
    this.setState({
      showBtn: e,
    });
  };

  // get yeild and debt total from piechart component
  getProtocolTotal = (yeild, debt) => {
    this.setState({
      totalYield: yeild,
      totalDebt: debt,
    });
  };

  render() {
    const { table, assetPriceList } = this.props.intelligenceState;
    const { userWalletList, currency } = this.state;
    // console.log("reducer state",this.props.portfolioState)

    //     console.log("reducer state", this.state);

    // console.log(
    //   "asset price state",
    //  this.state?.assetPrice? Object.keys(this.state?.assetPrice)?.length:""
    // );
    //  console.log(
    //    "asset price redux",
    //    this.props.portfolioState?.assetPrice ?Object.keys(
    //      this.props.portfolioState?.assetPrice
    //    )?.length :""
    //  );

    // transaction history calculations
    let tableData =
      table &&
      table.map((row) => {
        let walletFromData = null;
        let walletToData = null;

        userWalletList &&
          userWalletList.map((wallet) => {
            if (
              wallet.address?.toLowerCase() ===
                row.from_wallet.address?.toLowerCase() ||
              wallet.displayAddress?.toLowerCase() ===
                row.from_wallet.address?.toLowerCase()
            ) {
              walletFromData = {
                wallet_metaData: wallet.wallet_metadata,
                displayAddress: wallet.displayAddress,
                nickname: wallet?.nickname,
              };
            }
            if (
              wallet.address?.toLowerCase() ==
                row.to_wallet.address?.toLowerCase() ||
              wallet.displayAddress?.toLowerCase() ==
                row.to_wallet.address?.toLowerCase()
            ) {
              walletToData = {
                wallet_metaData: wallet.wallet_metadata,
                displayAddress: wallet.displayAddress,
                nickname: wallet?.nickname,
              };
            }
          });

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
          usdValueThen: {
            value: row.asset.value,
            id: row.asset.id,
            assetPrice: row.asset_price,
          },
        };
      });

    const columnList = [
      {
        labelName: (
          <div
            className="cp history-table-header-col"
            id="time"
            onClick={() => {
              this.handleTableSort("time");
              TransactionHistoryDate({
                session_id: getCurrentUser().id,
                email_address: getCurrentUser().email,
              });
            }}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Date
            </span>
            <Image
              src={sortByIcon}
              className={
                !this.state.tableSortOpt[0].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "time",
        // coumnWidth: 73,
        coumnWidth: 0.2,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "time") {
            return moment(rowData.time).format("MM/DD/YY");
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col"
            id="from"
            onClick={() => {
              this.handleTableSort("from");
              TransactionHistoryFrom({
                session_id: getCurrentUser().id,
                email_address: getCurrentUser().email,
              });
            }}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              From
            </span>
            <Image
              src={sortByIcon}
              className={
                !this.state.tableSortOpt[1].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "from",
        // coumnWidth: 61,
        coumnWidth: 0.17,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "from") {
            // console.log("row", rowData)
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                // text={rowData.from.address}
                text={
                  (rowData.from.metaData?.nickname
                    ? rowData.from.metaData?.nickname + ": "
                    : "") +
                  (rowData.from.wallet_metaData?.text
                    ? rowData.from.wallet_metaData?.text + ": "
                    : "") +
                  (rowData.from.metaData?.displayAddress &&
                  rowData.from.metaData?.displayAddress !== rowData.from.address
                    ? rowData.from.metaData?.displayAddress + ": "
                    : "") +
                  rowData.from.address
                }
              >
                {rowData.from.metaData?.wallet_metaData ? (
                  <Image
                    src={
                      rowData.from.metaData?.wallet_metaData?.symbol ||
                      unrecognizedIcon
                    }
                    className="history-table-icon"
                    onMouseEnter={() => {
                      // //console.log("address", rowData.from.metaData);
                      TransactionHistoryAddress({
                        session_id: getCurrentUser().id,
                        email_address: getCurrentUser().email,
                        address_hovered: rowData.from.address,
                        display_name: rowData.from.wallet_metaData?.text
                          ? rowData.from.wallet_metaData?.text
                          : rowData.from.metaData?.displayAddress,
                      });
                    }}
                  />
                ) : rowData.from.wallet_metaData.symbol ||
                  rowData.from.wallet_metaData.text ||
                  rowData.from.metaData?.nickname ? (
                  rowData.from.wallet_metaData.symbol ? (
                    <Image
                      src={rowData.from.wallet_metaData.symbol}
                      className="history-table-icon"
                      onMouseEnter={() => {
                        //  //console.log(
                        //    "address",
                        //    rowData.from.metaData
                        //  );
                        TransactionHistoryAddress({
                          session_id: getCurrentUser().id,
                          email_address: getCurrentUser().email,
                          address_hovered: rowData.from.address,
                          display_name: rowData.from.wallet_metaData?.text
                            ? rowData.from.wallet_metaData?.text
                            : rowData.from.metaData?.displayAddress,
                        });
                      }}
                    />
                  ) : rowData.from.metaData?.nickname ? (
                    <span
                      onMouseEnter={() => {
                        //  //console.log(
                        //    "address",
                        //    rowData.from.metaData
                        //  );
                        TransactionHistoryAddress({
                          session_id: getCurrentUser().id,
                          email_address: getCurrentUser().email,
                          address_hovered: rowData.from.address,
                          display_name: rowData.from.wallet_metaData?.text
                            ? rowData.from.wallet_metaData?.text
                            : rowData.from.metaData?.displayAddress,
                        });
                      }}
                    >
                      {rowData.from.metaData?.nickname}
                    </span>
                  ) : (
                    <span
                      onMouseEnter={() => {
                        //  //console.log(
                        //    "address",
                        //    rowData.from.metaData
                        //  );
                        TransactionHistoryAddress({
                          session_id: getCurrentUser().id,
                          email_address: getCurrentUser().email,
                          address_hovered: rowData.from.address,
                          display_name: rowData.from.wallet_metaData?.text
                            ? rowData.from.wallet_metaData?.text
                            : rowData.from.metaData?.displayAddress,
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
                        display_name: rowData.from.wallet_metaData?.text
                          ? rowData.from.wallet_metaData?.text
                          : rowData.from.metaData?.displayAddress,
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
                        display_name: rowData.from.wallet_metaData?.text
                          ? rowData.from.wallet_metaData?.text
                          : rowData.from.metaData?.displayAddress,
                      });
                    }}
                  />
                )}
                {/* <Image src={rowData.from.wallet_metaData.symbol} className="history-table-icon" /> */}
              </CustomOverlay>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col"
            id="to"
            onClick={() => {
              this.handleTableSort("to");
              TransactionHistoryTo({
                session_id: getCurrentUser().id,
                email_address: getCurrentUser().email,
              });
            }}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              To
            </span>
            <Image
              src={sortByIcon}
              className={
                !this.state.tableSortOpt[2].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "to",
        coumnWidth: 0.17,
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
                  (rowData.to.metaData?.nickname
                    ? rowData.to.metaData?.nickname + ": "
                    : "") +
                  (rowData.to.wallet_metaData?.text
                    ? rowData.to.wallet_metaData?.text + ": "
                    : "") +
                  (rowData.to.metaData?.displayAddress &&
                  rowData.to.metaData?.displayAddress !== rowData.to.address
                    ? rowData.to.metaData?.displayAddress + ": "
                    : "") +
                  rowData.to.address
                }
              >
                {rowData.to.metaData?.wallet_metaData ? (
                  <Image
                    src={
                      rowData.to.metaData?.wallet_metaData?.symbol ||
                      unrecognizedIcon
                    }
                    className="history-table-icon heyyyy"
                    onMouseEnter={() => {
                      TransactionHistoryAddress({
                        session_id: getCurrentUser().id,
                        email_address: getCurrentUser().email,
                        address_hovered: rowData.to.address,
                        display_name: rowData.to.wallet_metaData?.text
                          ? rowData.to.wallet_metaData?.text
                          : rowData.to.metaData?.displayAddress,
                      });
                    }}
                  />
                ) : rowData.to.wallet_metaData.symbol ||
                  rowData.to.wallet_metaData.text ||
                  rowData.to.metaData?.nickname ? (
                  rowData.to.wallet_metaData.symbol ? (
                    <Image
                      src={rowData.to.wallet_metaData.symbol}
                      className="history-table-icon"
                      onMouseEnter={() => {
                        TransactionHistoryAddress({
                          session_id: getCurrentUser().id,
                          email_address: getCurrentUser().email,
                          address_hovered: rowData.to.address,
                          display_name: rowData.to.wallet_metaData?.text
                            ? rowData.to.wallet_metaData?.text
                            : rowData.to.metaData?.displayAddress,
                        });
                      }}
                    />
                  ) : rowData.to.metaData?.nickname ? (
                    <span
                      onMouseEnter={() => {
                        TransactionHistoryAddress({
                          session_id: getCurrentUser().id,
                          email_address: getCurrentUser().email,
                          address_hovered: rowData.to.address,
                          display_name: rowData.to.wallet_metaData?.text
                            ? rowData.to.wallet_metaData?.text
                            : rowData.to.metaData?.displayAddress,
                        });
                      }}
                    >
                      {rowData.to.metaData?.nickname}
                    </span>
                  ) : (
                    <span
                      onMouseEnter={() => {
                        TransactionHistoryAddress({
                          session_id: getCurrentUser().id,
                          email_address: getCurrentUser().email,
                          address_hovered: rowData.to.address,
                          display_name: rowData.to.wallet_metaData?.text
                            ? rowData.to.wallet_metaData?.text
                            : rowData.to.metaData?.displayAddress,
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
                        display_name: rowData.to.wallet_metaData?.text
                          ? rowData.to.wallet_metaData?.text
                          : rowData.to.metaData?.displayAddress,
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
                        display_name: rowData.to.wallet_metaData?.text
                          ? rowData.to.wallet_metaData?.text
                          : rowData.to.metaData?.displayAddress,
                      });
                    }}
                  />
                )}
              </CustomOverlay>
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col"
            id="asset"
            onClick={() => {
              this.handleTableSort("asset");
              TransactionHistoryAsset({
                session_id: getCurrentUser().id,
                email_address: getCurrentUser().email,
              });
            }}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              Asset
            </span>
            <Image
              src={sortByIcon}
              className={
                !this.state.tableSortOpt[3].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
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
            );
          }
        },
      },
      {
        labelName: (
          <div
            className="cp history-table-header-col"
            id="usdValue"
            onClick={() => {
              this.handleTableSort("usdValue");
              TransactionHistoryUSD({
                session_id: getCurrentUser().id,
                email_address: getCurrentUser().email,
              });
            }}
          >
            <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
              {CurrencyType(true)} Value
            </span>
            <Image
              src={sortByIcon}
              className={
                !this.state.tableSortOpt[4].up ? "rotateDown" : "rotateUp"
              }
            />
          </div>
        ),
        dataKey: "usdValue",
        coumnWidth: 0.25,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "usdValue") {
            let chain = Object.entries(assetPriceList);
            let value;
            chain.find((chain) => {
              // if (chain[0] === rowData.usdValueToday.id) {
              //   value =
              //     rowData.usdValueToday.value *
              //       chain[1].quote.USD.price *
              //       currency?.rate || DEFAULT_PRICE;
              //   return;
              // }
              if (chain[0] === rowData.usdValueThen.id) {
                value =
                  rowData.usdValueThen.value *
                  rowData.usdValueThen.assetPrice *
                  (currency?.rate || 1);
              }
            });
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={Number(value?.toFixed(2)).toLocaleString("en-US")}
              >
                <div className="inter-display-medium f-s-13 lh-16 grey-313 ellipsis-div">
                  {Number(value?.toFixed(2)).toLocaleString("en-US")}
                </div>
              </CustomOverlay>
            );
          }
        },
      },
      // {
      //   labelName: (
      //     <div
      //       className="cp history-table-header-col"
      //       id="method"
      //       onClick={() => {
      //         this.handleTableSort("method");
      //         TransactionHistoryMethod({
      //           session_id: getCurrentUser().id,
      //           email_address: getCurrentUser().email,
      //         });
      //       }}
      //     >
      //       <span className="inter-display-medium f-s-13 lh-16 grey-4F4">
      //         Method
      //       </span>
      //       <Image
      //         src={sortByIcon}
      //         className={
      //           !this.state.tableSortOpt[5].up ? "rotateDown" : "rotateUp"
      //         }
      //       />
      //     </div>
      //   ),
      //   dataKey: "method",
      //   coumnWidth: 0.22,
      //   isCell: true,
      //   cell: (rowData, dataKey) => {
      //     if (dataKey === "method") {
      //       return (
      //         <div className="inter-display-medium f-s-13 lh-16 black-191 history-table-method transfer">
      //           {rowData.method}
      //         </div>
      //       );
      //     }
      //   },
      // },
    ];
    // //console.log("table data", tableData)
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
                {/* welcome card */}
                <WelcomeCard
                  isSidebarClosed={this.props.isSidebarClosed}
                  apiResponse={(e) => this.CheckApiResponse(e)}
                  // yesterday balance
                  yesterdayBalance={this.props.portfolioState.yesterdayBalance}
                  // toggleAddWallet={this.state.toggleAddWallet}
                  // handleToggleAddWallet={this.handleToggleAddWallet}

                  // decrement={true}

                  // total network and percentage calculate
                  assetTotal={
                    this.props.portfolioState &&
                    this.props.portfolioState.walletTotal
                      ? this.props.portfolioState.walletTotal +
                        this.state.totalYield -
                        this.state.totalDebt
                      : 0 + this.state.totalYield - this.state.totalDebt
                  }
                  // history
                  history={this.props.history}
                  // add wallet address modal
                  handleAddModal={this.handleAddModal}
                  // net worth total
                  // isLoading={this.state.isLoading}

                  // walletTotal={
                  //   this.props.portfolioState.walletTotal +
                  //   this.state.totalYield -
                  //   this.state.totalDebt
                  // }

                  // manage wallet
                  handleManage={() => {
                    this.props.history.push("/wallets");
                    ManageWallets({
                      session_id: getCurrentUser().id,
                      email_address: getCurrentUser().email,
                    });
                  }}
                />
              </div>

              <div className="portfolio-section" style={{ minWidth: "85rem" }}>
                <PieChart2
                  userWalletData={
                    this.props.portfolioState &&
                    this.props.portfolioState.chainWallet &&
                    Object.keys(this.props.portfolioState.chainWallet).length >
                      0
                      ? Object.values(this.props.portfolioState.chainWallet)
                      : null
                  }
                  chainPortfolio={
                    this.props.portfolioState &&
                    this.props.portfolioState.chainPortfolio &&
                    Object.keys(this.props.portfolioState.chainPortfolio)
                      .length > 0
                      ? Object.values(this.props.portfolioState.chainPortfolio)
                      : null
                  }
                  allCoinList={
                    this.props.OnboardingState &&
                    this.props.OnboardingState.coinsList &&
                    Object.keys(this.props.OnboardingState.coinsList).length > 0
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
                  isUpdate={this.state.isUpdate}
                  walletTotal={this.props.portfolioState.walletTotal}
                  handleAddModal={this.handleAddModal}
                  handleManage={() => {
                    this.props.history.push("/wallets");
                    ManageWallets({
                      session_id: getCurrentUser().id,
                      email_address: getCurrentUser().email,
                    });
                  }}
                  undetectedWallet={(e) => this.undetectedWallet(e)}
                  getProtocolTotal={this.getProtocolTotal}
                />
                {this.state.userWalletList?.findIndex(
                  (w) => w.coinFound !== true
                ) > -1 && this.state.userWalletList[0]?.address !== "" ? (
                  <div
                    className="fix-div"
                    id="fixbtn"
                    style={this.state.showBtn ? { display: "none" } : {}}
                  >
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

              <div className="m-b-22 graph-table-section">
                <Row>
                  <Col md={6}>
                    <div
                      className="m-r-16 section-table"
                      // style={{ paddingBottom: "1.15rem" }}
                    >
                      <LineChartSlider
                        assetValueData={
                          this.props.portfolioState.assetValueData &&
                          this.props.portfolioState.assetValueData
                        }
                        externalEvents={
                          this.state.externalEvents && this.state.externalEvents
                        }
                        coinLists={this.props.OnboardingState.coinsLists}
                        isScrollVisible={false}
                        handleGroupBy={(value) => this.handleGroupBy(value)}
                        graphLoading={this.state.graphLoading}
                        // graphLoading={true}
                        isUpdate={this.state.isUpdate}
                        handleClick={() => {
                          if (this.state.lochToken) {
                            this.props.history.push(
                              "/intelligence/asset-value"
                            );
                          }
                        }}
                        hideTimeFilter={true}
                        hideChainFilter={true}
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="profit-chart">
                      <div
                        className={`bar-graph-section m-b-32`}
                        style={{ paddingBottom: "0rem" }}
                      >
                        <GraphHeader
                          title={"Insights"}
                          subtitle={"Valuable insights based on your assets"}
                          isArrow={true}
                          handleClick={() => {
                            // console.log("wallet", this.state.userWalletList);
                            if (this.state.lochToken) {
                              this.props.history.push("/intelligence/insights");
                            }
                          }}
                        />
                        <div className="insights-wrapper">
                          {/* <h2 className="inter-display-medium f-s-25 lh-30 black-191">This week</h2> */}
                          {this.state.isLoading ? (
                            <div
                              style={{
                                height: "35rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Loading />
                            </div>
                          ) : this.props.intelligenceState.updatedInsightList &&
                            this.props.intelligenceState.updatedInsightList
                              .length > 0 ? (
                            this.props.intelligenceState.updatedInsightList
                              ?.slice(0, 3)
                              .map((insight, key) => {
                                // console.log("insignt", insight);
                                return (
                                  <div
                                    className="insights-card"
                                    key={key}
                                    style={{ padding: 0, boxShadow: "none" }}
                                  >
                                    <Image
                                      src={
                                        insight.insight_type ===
                                        InsightType.COST_REDUCTION
                                          ? reduceCost
                                          : insight.insight_type ===
                                            InsightType.RISK_REDUCTION
                                          ? reduceRisk
                                          : increaseYield
                                      }
                                      className="insight-icon"
                                    />
                                    <div className="insights-content">
                                      <h5 className="inter-display-bold f-s-10 lh-12 title-chip">
                                        {InsightType.getText(
                                          insight.insight_type
                                        )}
                                      </h5>
                                      <p
                                        className="inter-display-medium f-s-13 lh-16 grey-969"
                                        dangerouslySetInnerHTML={{
                                          __html: insight.sub_title,
                                        }}
                                      ></p>
                                      <h4
                                        className="inter-display-medium f-s-16 lh-19 grey-313"
                                        dangerouslySetInnerHTML={{
                                          __html: insight.title,
                                        }}
                                      ></h4>
                                    </div>
                                  </div>
                                );
                              })
                          ) : (
                            <div
                              style={{
                                height: "35rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <h5 className="inter-display-medium f-s-16 lh-19 grey-313 m-b-8 text-center">
                                {
                                  "This wallet is not active enough for us to generate any useful insights here :)."
                                }
                              </h5>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
              <div className="m-b-22 graph-table-section">
                <Row>
                  <Col md={6}>
                    <div
                      className="m-r-16 section-table"
                      style={{ paddingBottom: "1.6rem" }}
                    >
                      <TransactionTable
                        title="Transaction History"
                        handleClick={() => {
                          // console.log("wallet", this.state.userWalletList);
                          if (this.state.lochToken) {
                            this.props.history.push(
                              "/intelligence/transaction-history"
                            );
                            TransactionHistoryEView({
                              session_id: getCurrentUser().id,
                              email_address: getCurrentUser().email,
                            });
                          }
                        }}
                        subTitle="Sort, filter, and dissect all your transactions from one place"
                        tableData={tableData}
                        columnList={columnList}
                        headerHeight={60}
                        isLoading={this.state.tableLoading}
                        addWatermark
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="profit-chart">
                      <BarGraphSection
                        headerTitle="Net Flows"
                        headerSubTitle="Understand your portfolio's net flows"
                        isArrow={true}
                        handleClick={() => {
                          if (this.state.lochToken) {
                            ProfitLossEV({
                              session_id: getCurrentUser().id,
                              email_address: getCurrentUser().email,
                            });
                            this.props.history.push("/intelligence#netflow");
                          }
                        }}
                        isScrollVisible={false}
                        data={
                          this.props.intelligenceState.graphValue &&
                          this.props.intelligenceState.graphValue[0]
                        }
                        options={
                          this.props.intelligenceState.graphValue &&
                          this.props.intelligenceState.graphValue[1]
                        }
                        coinsList={this.props.OnboardingState.coinsList}
                        marginBottom="m-b-32"
                        showFooter={false}
                        showBadges={false}
                        showPercentage={
                          this.props.intelligenceState.graphValue &&
                          this.props.intelligenceState.graphValue[2]
                        }
                        isLoading={this.state.netFlowLoading}
                        className={"portfolio-profit-and-loss"}
                      />
                    </div>
                  </Col>
                </Row>
              </div>

              <hr className="m-t-60" />
              <p className="inter-display-medium f-s-13 lh-16 m-b-26 grey-ADA m-t-16 m-b-16">
                The content made available on this web page and our mobile
                applications ("Platform") is for informational purposes only.
                You should not construe any such information or other material
                as financial advice in any way. All information provided on the
                Platform is provided on an as is and available basis, based on
                the data provided by the end user on the Platform. Nothing
                contained on our Platform constitutes a solicitation,
                recommendation, endorsement, or offer by us or any third-party
                service provider to buy or sell any securities or other
                financial instruments in this or in any other jurisdiction in
                which such solicitation or offer would be unlawful under the
                securities laws of such jurisdiction. All content on this
                Platform is information of a general nature and does not address
                the circumstances of any particular individual or entity.
                Nothing in the Platform constitutes financial advice, nor does
                any information on the Platform constitute a comprehensive or
                complete statement of the matters discussed or the law relating
                thereto. You alone assume the sole responsibility of evaluating
                the merits and risks associated with the use of any information
                or other content on the platform before making any decisions
                based on such information. In exchange for using the Platform,
                you agree not to hold us, our affiliates, or any third-party
                service provider liable for any possible claim for damages
                arising from any decision you make based on information or other
                content made available to you through the Platform.
              </p>
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
            apiResponse={(e) => this.CheckApiResponse(e)}
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
            apiResponse={(e) => this.CheckApiResponse(e)}
          />
        )}

        {this.state.upgradeModal && (
          <UpgradeModal
            show={this.state.upgradeModal}
            onHide={this.upgradeModal}
            history={this.props.history}
            isShare={window.sessionStorage.getItem("share_id")}
            isStatic={this.state.isStatic}
            triggerId={this.state.triggerId}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  portfolioState: state.PortfolioState,
  OnboardingState: state.OnboardingState,
  intelligenceState: state.IntelligenceState,
});
const mapDispatchToProps = {
  getCoinRate,
  getUserWallet,
  settingDefaultValues,
  getAllCoins,
  searchTransactionApi,
  getAssetGraphDataApi,
  getDetailsByLinkApi,
  getProfitAndLossApi,
  getExchangeBalance,
  getYesterdaysBalanceApi,
  getExternalEventsApi,
  getAllInsightsApi,
  GetAllPlan,
  getUser,
};
Portfolio.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);
