import { API_LIMIT, DEFAULT_PRICE } from "../../utils/Constant";
import { TOP_ALL_TRANSACTION_HISTORY, TOP_ALL_TRANSACTION_HISTORY_HOME, TOP_ASSET_VALUE_GRAPH, TOP_ASSET_VALUE_GRAPH_DAY, TOP_ASSET_VALUE_GRAPH_MONTH, TOP_ASSET_VALUE_GRAPH_YEAR, TOP_AVERAGE_COST_BASIS, TOP_AVERAGE_COST_RESET, TOP_AVERAGE_COST_SORT, TOP_COUNTER_PARTY_VOLUME, TOP_DEFAULT_VALUES, TOP_EXTERNAL_EVENTS, TOP_GAS_FEES, TOP_INSIGHT_DATA, TOP_NETFLOW_GRAPH, TOP_PORTFOLIO_ASSET, TOP_TRANSACTION_FILTER, TOP_USER_WALLET_LIST, TOP_YESTERDAY_BALANCE } from "./ActionTypes";
const INITIAL_STATE = {
  //  top account home
  coinRateList: [],
  chainWallet: [],
  walletTotal: 0,
  currency: JSON.parse(localStorage.getItem("currency")),
  // yesterday balance
  yesterdayBalance: 0,

  // Used in piechart as props
  assetPrice: null,

  // asset value chart
  assetValueData: null,
  assetValueYear: null,
  assetValueMonth: null,
  assetValueDay: null,
  assetValueDataLoaded: false,
  // external events data it set after asset value chart api response get
  externalEvents: [],

  // centralizedExchanges
  centralizedExchanges: 0,

  // Intelligence
  table: [],
  currentPage: 1,
  totalCount: null,
  totalPage: null,
  assetPriceList: [],
  updatedInsightList: "",

  // for home
  table_home: [],
  assetPriceList_home: [],

  // get all netflow api response
  GraphData: [],
  // all netflowh data
  graphValue: null,

  // get all asset value
  ProfitLossAsset: [],

  // filters
  assetFilter: [],
  yearFilter: [],
  methodFilter: [],

  // counter party
  counterPartyData: [],
  counterPartyValue: null,

  // gas fees
  GraphfeeData: [],
  graphfeeValue: null,

  // average cost basis
  Average_cost_basis: [],
  Average_cost_basis_all: [],
  totalPercentage: 0,
};
const TopAccountReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TOP_USER_WALLET_LIST:
      console.log("action.payload", action.payload);
      let updateWalletTotal = state.walletTotal || 0;
      let updatedChainWallet = state.chainWallet || [];
      let chainPortfolio = state.chainPortfolio || {};
      let currencyRate = state.currency?.rate || 1;
      let CentralizedExchanges = state.centralizedExchanges || 0;

      // calculating CentralizedExchanges,

      if (action.payload.userWalletList?.protocol) {
        CentralizedExchanges =
          CentralizedExchanges + action.payload.userWalletList?.total_amount;
      }
      if (
        action.payload &&
        action.payload.userWalletList &&
        action.payload.userWalletList.assets &&
        action.payload.userWalletList.assets.length > 0
      ) {
        if (!(action.payload.userWalletList?.chain?.id in chainPortfolio)) {
          chainPortfolio[action.payload.userWalletList?.chain?.id] =
            action.payload.userWalletList?.chain;

          if (action.payload.userWalletList?.chain) {
            chainPortfolio[
              action.payload.userWalletList?.chain?.id
            ].total = 0.0;
          }
        }
        for (let i = 0; i < action.payload.userWalletList.assets.length; i++) {
          // Filter coin rate from coinRate state variable
          // if(action.payload.userWalletList.assets[i].asset.code === 'PAXG'){
          //     console.log(action.payload.userWalletList.assets[i])
          // }
          // console.log('action.payload.userWalletList',action.payload.userWalletList);
          // let matchedCodeData = state.coinRateList[action.payload.userWalletList.assets[i].asset.id]
          let matchedCodeData =
            action.payload.assetPrice[
              action.payload.userWalletList.assets[i].asset.id
            ];
          let value =
            matchedCodeData && matchedCodeData
              ? matchedCodeData.quote
              : DEFAULT_PRICE;
          let currentPrice =
            action.payload.userWalletList.assets[i].count *
            (value && value.USD && value.USD.price
              ? value.USD.price
              : DEFAULT_PRICE) *
            currencyRate;
          // Get coin asset index
          // let assetIndex = updatedChainWallet.findIndex(
          //     assetList => assetList.assetCode === action.payload.userWalletList.assets[i].asset.code
          // );

          // if (assetIndex <= -1) {
          let assetValue = value
            ? action.payload.userWalletList.assets[i].count *
              (value && value.USD && value.USD.price
                ? value.USD.price
                : DEFAULT_PRICE) *
              currencyRate
            : action.payload.userWalletList.assets[i].count * DEFAULT_PRICE;

          if (action.payload.userWalletList?.chain) {
            chainPortfolio[action.payload.userWalletList?.chain?.id].total =
              chainPortfolio[action.payload.userWalletList?.chain?.id].total +
              assetValue;
          }
          // console.log("state", action.payload.userWalletList);
          if (
            updatedChainWallet[
              action.payload.userWalletList.assets[i].asset.id
            ] === undefined
          ) {
            // updatedChainWallet.push({
            updatedChainWallet[
              action.payload.userWalletList.assets[i].asset.id
            ] = {
              assetType:
                action.payload.userWalletList.assets[i].asset.asset_type,
              assetCode: action.payload.userWalletList.assets[i].asset.code,
              assetId: action.payload.userWalletList.assets[i].asset.id,
              assetName: action.payload.userWalletList.assets[i].asset.name,
              assetSymbol: action.payload.userWalletList.assets[i].asset.symbol,
              color: action.payload.userWalletList.assets[i].asset.color,
              chain: [
                {
                  chainCode:
                    action.payload.userWalletList.assets[i]?.chain?.code,
                  chainSymbol:
                    action.payload.userWalletList.assets[i]?.chain?.symbol,
                  chainName:
                    action.payload.userWalletList.assets[i]?.chain?.name,
                  assetCount: action.payload.userWalletList.assets[i].count,
                  address: action.payload.userWalletList.address,
                  protocalName: action.payload.userWalletList?.protocol?.name,
                },
              ],
              totalCount: action.payload.userWalletList.assets[i].count,
              assetValue: value
                ? action.payload.userWalletList.assets[i].count *
                  (value && value.USD && value.USD.price
                    ? value.USD.price
                    : DEFAULT_PRICE) *
                  currencyRate
                : action.payload.userWalletList.assets[i].count * DEFAULT_PRICE,
            };
            // assetIndex = (updatedChainWallet.length - 1)
          } else {
            // Check if chain exist in the asset
            // let chainExist = updatedChainWallet[assetIndex]["chain"].findIndex(
            //     chainList => chainList.chainCode === action.payload.userWalletList.assets[i].chain.code
            // );
            // If chain doesn't exist
            // if (chainExist <= -1) {
            // if (updatedChainWallet[action.payload.userWalletList.assets[i].asset.code]["chain"] === undefined) {

            updatedChainWallet[
              action.payload.userWalletList.assets[i].asset.id
            ]["chain"].push({
              chainCode: action.payload.userWalletList.assets[i]?.chain?.code,
              chainSymbol:
                action.payload.userWalletList.assets[i]?.chain?.symbol,
              chainName: action.payload.userWalletList.assets[i]?.chain?.name,
              assetCount: action.payload.userWalletList.assets[i]?.count,
              // color: action.payload.userWalletList.assets[i].asset.color,
              address: action.payload.userWalletList.address,
              protocalName: action.payload.userWalletList?.protocol?.name,
            });
            // }
            // Update the total count and asset value
            updatedChainWallet[
              action.payload.userWalletList.assets[i].asset.id
            ].totalCount =
              updatedChainWallet[
                action.payload.userWalletList.assets[i].asset.id
              ].totalCount + action.payload.userWalletList.assets[i].count;
            updatedChainWallet[
              action.payload.userWalletList.assets[i].asset.id
            ].assetValue =
              updatedChainWallet[
                action.payload.userWalletList.assets[i].asset.id
              ].assetValue +
              (value
                ? action.payload.userWalletList.assets[i].count *
                  (value && value.USD && value.USD.price
                    ? value.USD.price
                    : DEFAULT_PRICE) *
                  currencyRate
                : action.payload.userWalletList.assets[i].count *
                  DEFAULT_PRICE);
          }

          updateWalletTotal = updateWalletTotal + currentPrice;
        }
      }

      // userWalletList: updateWalletList,
      // return { ...state, walletTotal: updateWalletTotal, chainWallet: { ...updatedChainWallet }, chainPortfolio: {...chainPortfolio}, coinRateList: {...state.coinRateList, ...action.payload.assetPrice} };
      return {
        ...state,
        walletTotal: updateWalletTotal,
        chainWallet: { ...updatedChainWallet },
        chainPortfolio: { ...chainPortfolio },
        assetPrice: { ...state.assetPrice, ...action.payload.assetPrice },
        centralizedExchanges: CentralizedExchanges * currencyRate,
      };
    case TOP_YESTERDAY_BALANCE:
      return { ...state, yesterdayBalance: action.payload.balance };
    case TOP_ASSET_VALUE_GRAPH:
      return {
        ...state,
        assetValueData: action.payload.data,
        assetValueDataLoaded: action.payload.loader,
      };
    case TOP_ASSET_VALUE_GRAPH_MONTH:
      return {
        ...state,
        assetValueMonth: action.payload.data,
        assetValueDataLoaded: action.payload.loader,
      };
    case TOP_ASSET_VALUE_GRAPH_YEAR:
      return {
        ...state,
        assetValueYear: action.payload.data,
        assetValueDataLoaded: action.payload.loader,
      };
    case TOP_ASSET_VALUE_GRAPH_DAY:
      return {
        ...state,
        assetValueDay: action.payload.data,
        assetValueDataLoaded: action.payload.loader,
      };
    case TOP_EXTERNAL_EVENTS:
      return { ...state, externalEvents: action.payload.externalEvents };

    case TOP_DEFAULT_VALUES:
      return {
        ...state,
        chainWallet: [],
        walletTotal: 0,
        chainPortfolio: {},
        yesterdayBalance: 0,
        assetPrice: null,
        assetValueData: null,
        externalEvents: [],
        assetValueYear: null,
        assetValueMonth: null,
        assetValueDay: null,
        assetValueDataLoaded: false,
        centralizedExchanges: 0,
      };
    // intelligence
    case TOP_ALL_TRANSACTION_HISTORY:
      return {
        ...state,
        table: action.payload.results,
        assetPriceList: action.payload.objects.asset_prices,
        totalCount: action.payload.total_count,
        totalPage: Math.ceil(action.payload.total_count / API_LIMIT),
        currentPage: action.currentPage,
      };
    case TOP_ALL_TRANSACTION_HISTORY_HOME:
      return {
        ...state,
        table_home: action.payload.results,
        assetPriceList_home: action.payload.objects.asset_prices,
      };
    case TOP_INSIGHT_DATA:
      return {
        ...state,
        updatedInsightList: action.payload.updatedInsightList,
      };
    case TOP_NETFLOW_GRAPH:
      return {
        ...state,
        GraphData: action.payload.GraphData,
        graphValue: action.payload.graphValue,
      };
    case TOP_PORTFOLIO_ASSET:
      return { ...state, ProfitLossAsset: action.payload.ProfitLossAsset };
    case TOP_TRANSACTION_FILTER:
      return {
        ...state,
        assetFilter: action.payload.assetFilter,
        yearFilter: action.payload.yearFilter,
        methodFilter: action.payload.methodFilter,
      };
    case TOP_COUNTER_PARTY_VOLUME:
      return {
        ...state,
        counterPartyData: action.payload.counterPartyData,
        counterPartyValue: action.payload.counterPartyValue,
      };
    case TOP_GAS_FEES:
      return {
        ...state,
        GraphfeeData: action.payload.GraphfeeData,
        graphfeeValue: action.payload.graphfeeValue,
      };
    case TOP_AVERAGE_COST_BASIS:
      return {
        ...state,
        Average_cost_basis: action.payload.Average_cost_basis,
        Average_cost_basis_all: action.payload.Average_cost_basis,
        totalPercentage: action.payload.totalPercentage,
      };
    case TOP_AVERAGE_COST_RESET:
      return { ...state, Average_cost_basis: state.Average_cost_basis_all };
    case TOP_AVERAGE_COST_SORT:
      return { ...state, Average_cost_basis: action.payload };
    default:
      return state;
  }
};
export default TopAccountReducer;
