import { DEFAULT_PRICE } from "../../utils/Constant";
import { COIN_RATE_LIST, USER_WALLET_LIST } from "./ActionTypes";
const INITIAL_STATE = {
    coinRateList: [],
    userWalletList: [],
    chainWallet: [],
    walletTotal: 0
};
const PortfolioReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case COIN_RATE_LIST:
            return { ...state, coinRateList: Object.values(action.payload) };
        case USER_WALLET_LIST:
            let updateWalletList = state.userWalletList || [];
            let updateWalletTotal = state.walletTotal || 0;
            let updatedChainWallet = state.chainWallet || [];
            let index = updateWalletList.findIndex(
                walletList => walletList.address === action.payload.address
            );
            if (index <= -1) {
                updateWalletList.push({
                    address: action.payload.address,
                    chains: [],
                    coinAssets: []
                })
                index = updateWalletList.findIndex(
                    walletList => walletList.address === action.payload.address
                );
            }
            if (action.payload.userWalletList.assets && action.payload.userWalletList.assets.length > 0) {
                let chainIndex = updateWalletList[index]["chains"].findIndex(
                    chainList => chainList.chainCode === action.payload.userWalletList.assets[0].chain.code
                );
                if (chainIndex <= -1) {
                    updateWalletList[index]["chains"].push({
                        chainCode: action.payload.userWalletList.assets[0].chain.code,
                        assets: []
                    })
                    chainIndex = updateWalletList[index]["chains"].findIndex(
                        chainList => chainList.chainCode === action.payload.userWalletList.assets[0].chain.code
                    );
                }
                for (let i = 0; i < action.payload.userWalletList.assets.length; i++) {
                    let matchedCodeData = state.coinRateList.filter((e) => e.code === action.payload.userWalletList.assets[i].asset.code)
                    // console.log('matchedCodedata',matchedCodeData);
                    let value = matchedCodeData && matchedCodeData[0] ? matchedCodeData[0].quote : DEFAULT_PRICE;
                    if(value === DEFAULT_PRICE || !value){
                      continue;
                    }
                    let currentPrice = action.payload.userWalletList.assets[i].count*value.USD.price;
                    let assetIndex = updateWalletList[index]["coinAssets"].findIndex(
                        assetList => assetList.assetCode === action.payload.userWalletList.assets[i].asset.code
                    );
                    let chainAssetIndex = updatedChainWallet.findIndex(
                        assetList => assetList.assetCode === action.payload.userWalletList.assets[i].asset.code
                    );
                    if (chainAssetIndex <= -1) {
                        updatedChainWallet.push({
                            assetCode: action.payload.userWalletList.assets[i].asset.code,
                            assetName: action.payload.userWalletList.assets[i].asset.name,
                            assetSymbol: action.payload.userWalletList.assets[i].asset.symbol,
                            chainCode: action.payload.userWalletList.assets[i].chain.code,
                            chainSymbol: action.payload.userWalletList.assets[i].chain.symbol,
                            chainName: action.payload.userWalletList.assets[i].chain.name,
                            count: action.payload.userWalletList.assets[i].count,
                            assetValue: value ? action.payload.userWalletList.assets[i].count * value.USD.price : action.payload.userWalletList.assets[i].count * DEFAULT_PRICE
                        })
                    } else {

                        updatedChainWallet[chainAssetIndex].count =
                            updatedChainWallet[chainAssetIndex].count + action.payload.userWalletList.assets[i].count
                        updatedChainWallet[chainAssetIndex].assetValue =
                            updatedChainWallet[chainAssetIndex].assetValue + (value ? action.payload.userWalletList.assets[i].count * value.USD.price : action.payload.userWalletList.assets[i].count * DEFAULT_PRICE)
                    }
                    if (assetIndex <= -1) {
                        updateWalletList[index]["coinAssets"].push({
                            assetCode: action.payload.userWalletList.assets[i].asset.code,
                            assetName: action.payload.userWalletList.assets[i].asset.name,
                            assetSymbol: action.payload.userWalletList.assets[i].asset.symbol,
                            chainCode: action.payload.userWalletList.assets[i].chain.code,
                            chainSymbol: action.payload.userWalletList.assets[i].chain.symbol,
                            chainName: action.payload.userWalletList.assets[i].chain.name,
                            count: action.payload.userWalletList.assets[i].count,
                            assetValue: value ? action.payload.userWalletList.assets[i].count * value.USD.price : action.payload.userWalletList.assets[i].count * DEFAULT_PRICE
                        })
                    } else {

                        updateWalletList[index]["coinAssets"][assetIndex].count =
                            updateWalletList[index]["coinAssets"][assetIndex].count + action.payload.userWalletList.assets[i].count
                        updateWalletList[index]["coinAssets"][assetIndex].assetValue =
                            updateWalletList[index]["coinAssets"][assetIndex].assetValue + (value ? action.payload.userWalletList.assets[i].count * value.USD.price : action.payload.userWalletList.assets[i].count * DEFAULT_PRICE)

                    }
                    updateWalletList[index]["chains"][chainIndex]["assets"].push({
                        assetCode: action.payload.userWalletList.assets[i].asset.code,
                        assetName: action.payload.userWalletList.assets[i].asset.name,
                        assetSymbol: action.payload.userWalletList.assets[i].asset.symbol,
                        chainCode: action.payload.userWalletList.assets[i].chain.code,
                        chainSymbol: action.payload.userWalletList.assets[i].chain.symbol,
                        chainName: action.payload.userWalletList.assets[i].chain.name,
                        count: action.payload.userWalletList.assets[i].count
                    })

                    // let updatedAssetIndex = updateWalletList[index]["coinAssets"].findIndex(
                    //     assetList => assetList.assetCode === action.payload.userWalletList.assets[i].asset.code
                    // );
                    // updateWalletTotal = updateWalletTotal + updateWalletList[index]["coinAssets"][updatedAssetIndex].assetValue;
                    // let updatedChainIndex = updatedChainWallet.findIndex(
                    //     assetList => assetList.assetCode === action.payload.userWalletList.assets[i].asset.code
                    // );

                    // updateWalletTotal = updateWalletTotal + updatedChainWallet[updatedChainIndex].assetValue;

                    updateWalletTotal = updateWalletTotal + currentPrice;

                    // console.log('assetValue', updatedChainWallet[updatedChainIndex].assetValue, updatedChainWallet[updatedChainIndex].assetCode);
                }
            }
            return { ...state, userWalletList: updateWalletList, walletTotal: updateWalletTotal, chainWallet: [...updatedChainWallet] };
        default:
            return state
    }
};
export default PortfolioReducer