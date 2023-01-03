import { DEFAULT_PRICE } from "../../utils/Constant";
import { COIN_RATE_LIST, USER_WALLET_LIST, DEFAULT_VALUES } from "./ActionTypes";
const INITIAL_STATE = {
    coinRateList: [],
    // userWalletList: [],
    chainWallet: [],
    walletTotal: 0,
    currency: JSON.parse(localStorage.getItem('currency')),
};
const PortfolioReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case COIN_RATE_LIST:
        return {
          ...state,
          coinRateList: { ...state.coinRateList, ...action.payload },
        };
      // return { ...state, coinRateList: action.payload };
      case USER_WALLET_LIST:
        let updateWalletTotal = state.walletTotal || 0;
        let updatedChainWallet = state.chainWallet || [];
        let chainPortfolio = state.chainPortfolio || {};
        // console.log('updatedChainWallet', updatedChainWallet);

        // console.log("state", state)
        if (
          action.payload &&
          action.payload.userWalletList &&
          action.payload.userWalletList.assets &&
          action.payload.userWalletList.assets.length > 0
        ) {
          if (!(action.payload.userWalletList.chain.id in chainPortfolio)) {
            chainPortfolio[action.payload.userWalletList.chain.id] =
              action.payload.userWalletList.chain;

            chainPortfolio[action.payload.userWalletList.chain.id].total = 0.0;
          }
          for (
            let i = 0;
            i < action.payload.userWalletList.assets.length;
            i++
          ) {
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
              state.currency?.rate;
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
                state.currency?.rate
              : action.payload.userWalletList.assets[i].count * DEFAULT_PRICE;
            chainPortfolio[action.payload.userWalletList.chain.id].total =
              chainPortfolio[action.payload.userWalletList.chain.id].total +
              assetValue;

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
                assetSymbol:
                  action.payload.userWalletList.assets[i].asset.symbol,
                color: action.payload.userWalletList.assets[i].asset.color,
                chain: [
                  {
                    chainCode:
                      action.payload.userWalletList.assets[i].chain.code,
                    chainSymbol:
                      action.payload.userWalletList.assets[i].chain.symbol,
                    chainName:
                      action.payload.userWalletList.assets[i].chain.name,
                    assetCount: action.payload.userWalletList.assets[i].count,
                    address: action.payload.userWalletList.address,
                  },
                ],
                totalCount: action.payload.userWalletList.assets[i].count,
                assetValue: value
                  ? action.payload.userWalletList.assets[i].count *
                    (value && value.USD && value.USD.price
                      ? value.USD.price
                      : DEFAULT_PRICE) *
                    state.currency?.rate
                  : action.payload.userWalletList.assets[i].count *
                    DEFAULT_PRICE,
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
                chainCode: action.payload.userWalletList.assets[i].chain.code,
                chainSymbol:
                  action.payload.userWalletList.assets[i].chain.symbol,
                chainName: action.payload.userWalletList.assets[i].chain.name,
                assetCount: action.payload.userWalletList.assets[i].count,
                // color: action.payload.userWalletList.assets[i].asset.color,
                address: action.payload.userWalletList.address,
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
                    state.currency?.rate
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
        };
      case DEFAULT_VALUES:
        return { ...state, chainWallet: [], walletTotal: 0 };
      default:
        return state;
    }
};
export default PortfolioReducer