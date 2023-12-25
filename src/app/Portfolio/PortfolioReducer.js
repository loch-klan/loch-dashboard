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
  currency: JSON.parse(window.sessionStorage.getItem("currency")),

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

          if (action.payload.userWalletList?.total_amount) {
            let tempTotalAmt = action.payload.userWalletList?.total_amount
              ? action.payload.userWalletList?.total_amount
              : 0;
            tempTotalAmt = tempTotalAmt * currencyRate;
            chainPortfolio[action.payload.userWalletList?.chain?.id].total =
              tempTotalAmt;
            updateWalletTotal = updateWalletTotal + tempTotalAmt;
          } else {
            chainPortfolio[
              action.payload.userWalletList?.chain?.id
            ].total = 0.0;
          }
        }
      }

      // userWalletList: updateWalletList,
      // return { ...state, walletTotal: updateWalletTotal, chainWallet: { ...updatedChainWallet }, chainPortfolio: {...chainPortfolio}, coinRateList: {...state.coinRateList, ...action.payload.assetPrice} };
      return {
        ...state,
        walletTotal: updateWalletTotal,
        chainPortfolio: { ...chainPortfolio },
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
