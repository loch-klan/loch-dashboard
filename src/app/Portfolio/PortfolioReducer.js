import { DEFAULT_PRICE } from "../../utils/Constant";
import {
  COIN_RATE_LIST,
  USER_WALLET_LIST,
  DEFAULT_VALUES,
  YESTERDAY_BALANCE,
  ASSET_VALUE_GRAPH,
  EXTERNAL_EVENTS,
  ASSET_VALUE_GRAPH_MONTH,
  ASSET_VALUE_GRAPH_YEAR,
  ASSET_VALUE_GRAPH_DAY,
} from "./ActionTypes";
const INITIAL_STATE = {
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
};
const PortfolioReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case COIN_RATE_LIST:
      // return {
      //   ...state,
      //   coinRateList: { ...state.coinRateList, ...action.payload },
      // };
      return { ...state, coinRateList: action.payload };
    case USER_WALLET_LIST:
      // console.log("action.payload", action.payload);
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

          if (currentPrice > 100000000000) {
            continue;
          }
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
          if (assetValue > 100000000000) {
            continue;
          }
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
    case YESTERDAY_BALANCE:
      return { ...state, yesterdayBalance: action.payload.balance };
    case ASSET_VALUE_GRAPH:
      return {
        ...state,
        assetValueData: action.payload.data,
        assetValueDataLoaded: action.payload.loader,
      };
    case ASSET_VALUE_GRAPH_MONTH:
      return {
        ...state,
        assetValueMonth: action.payload.data,
        assetValueDataLoaded: action.payload.loader,
      };
    case ASSET_VALUE_GRAPH_YEAR:
      return {
        ...state,
        assetValueYear: action.payload.data,
        assetValueDataLoaded: action.payload.loader,
      };
    case ASSET_VALUE_GRAPH_DAY:
      return {
        ...state,
        assetValueDay: action.payload.data,
        assetValueDataLoaded: action.payload.loader,
      };
    case EXTERNAL_EVENTS:
      return { ...state, externalEvents: action.payload.externalEvents };

    case DEFAULT_VALUES:
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
    default:
      return state;
  }
};
export default PortfolioReducer;
