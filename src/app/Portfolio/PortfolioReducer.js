import {
  ASSET_VALUE_GRAPH,
  ASSET_VALUE_GRAPH_DAY,
  ASSET_VALUE_GRAPH_MONTH,
  ASSET_VALUE_GRAPH_YEAR,
  COIN_RATE_LIST,
  DEFAULT_VALUES,
  EXTERNAL_EVENTS,
  USER_WALLET_LIST,
  YESTERDAY_BALANCE,
} from "./ActionTypes";

const INITIAL_STATE = {
  coinRateList: [],
  chainWallet: [],
  walletTotal: 0,
  currency: window.localStorage.getItem("currency")
    ? JSON.parse(window.localStorage.getItem("currency"))
    : {},

  // yesterday balance
  yesterdayBalance: 0,

  // Used in piechart as props
  assetPrice: null,

  // asset value chart
  assetValueData: null,
  assetValueYear: null,
  assetValueMonth: null,

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
        let tempExchangeHolderAmt = action.payload.userWalletList?.total_amount;
        if (tempExchangeHolderAmt) {
          tempExchangeHolderAmt = tempExchangeHolderAmt * currencyRate;
        } else {
          tempExchangeHolderAmt = 0;
        }
        CentralizedExchanges = CentralizedExchanges + tempExchangeHolderAmt;
        updateWalletTotal = updateWalletTotal + tempExchangeHolderAmt;
      }
      if (
        action.payload &&
        action.payload.userWalletList &&
        action.payload.userWalletList.assets &&
        action.payload.userWalletList.assets.length > 0
      ) {
        if (action.payload.userWalletList?.chain) {
          if (!(action.payload.userWalletList?.chain?.id in chainPortfolio)) {
            chainPortfolio[action.payload.userWalletList?.chain?.id] =
              action.payload.userWalletList?.chain;
          }

          if (action.payload.userWalletList?.total_amount) {
            let tempTotalAmt = action.payload.userWalletList?.total_amount
              ? action.payload.userWalletList?.total_amount
              : 0;
            tempTotalAmt = tempTotalAmt * currencyRate;
            if (action.payload.userWalletList?.chain?.id) {
              if (
                chainPortfolio[action.payload.userWalletList?.chain?.id]
                  .allAmounts
              ) {
                chainPortfolio[
                  action.payload.userWalletList?.chain?.id
                ].allAmounts = [
                  ...chainPortfolio[action.payload.userWalletList?.chain?.id]
                    .allAmounts,
                  tempTotalAmt,
                ];
              } else {
                chainPortfolio[
                  action.payload.userWalletList?.chain?.id
                ].allAmounts = [tempTotalAmt];
              }
            }
            let tempTotal = 0;
            chainPortfolio[
              action.payload.userWalletList?.chain?.id
            ].allAmounts.forEach((resResRes) => {
              tempTotal = resResRes + tempTotal;
            });
            chainPortfolio[action.payload.userWalletList?.chain?.id].total =
              tempTotal;
            let tempAmtHolder = 0;
            for (const element in chainPortfolio) {
              if (chainPortfolio[element] && chainPortfolio[element].total) {
                tempAmtHolder = chainPortfolio[element].total + tempAmtHolder;
              }
            }
            updateWalletTotal = tempAmtHolder;
          } else {
            let tempHolder = 0;
            if (
              chainPortfolio[action.payload.userWalletList?.chain?.id]?.total
            ) {
              tempHolder =
                chainPortfolio[action.payload.userWalletList?.chain?.id].total;
            }
            chainPortfolio[action.payload.userWalletList?.chain?.id].total =
              tempHolder;
          }
        }
      }

      // userWalletList: updateWalletList,
      // return { ...state, walletTotal: updateWalletTotal, chainWallet: { ...updatedChainWallet }, chainPortfolio: {...chainPortfolio}, coinRateList: {...state.coinRateList, ...action.payload.assetPrice} };
      return {
        ...state,
        walletTotal: updateWalletTotal,
        chainPortfolio: { ...chainPortfolio },
        centralizedExchanges: CentralizedExchanges,
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

        assetValueDataLoaded: false,
        centralizedExchanges: 0,
      };
    default:
      return state;
  }
};
export default PortfolioReducer;
