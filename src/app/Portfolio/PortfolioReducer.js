import { COIN_RATE_LIST, USER_WALLET_LIST } from "./ActionTypes";
const INITIAL_STATE = {
    coinRateList: [],
    userWalletList: [],
    walletTotal: 0
};
const PortfolioReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case COIN_RATE_LIST:
            return { ...state, coinRateList: Object.values(action.payload) };
        case USER_WALLET_LIST:
            let updateWalletList = state.userWalletList || [];
            let updateWalletTotal = state.walletTotal || 0;
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
                    let value = state.coinRateList.filter((e) => e.code === action.payload.userWalletList.assets[i].asset.code)[0].quote
                    let assetIndex = updateWalletList[index]["coinAssets"].findIndex(
                        assetList => assetList.assetCode === action.payload.userWalletList.assets[i].asset.code
                    );
                    if (assetIndex <= -1) {
                        updateWalletList[index]["coinAssets"].push({
                            assetCode: action.payload.userWalletList.assets[i].asset.code,
                            assetName: action.payload.userWalletList.assets[i].asset.name,
                            assetSymbol: action.payload.userWalletList.assets[i].asset.symbol,
                            chainCode: action.payload.userWalletList.assets[i].chain.code,
                            chainSymbol: action.payload.userWalletList.assets[i].chain.symbol,
                            chainName: action.payload.userWalletList.assets[i].chain.name,
                            count: action.payload.userWalletList.assets[i].count,
                            assetValue: value ? action.payload.userWalletList.assets[i].count * value.USD.price : action.payload.userWalletList.assets[i].count
                        })
                    } else {
                        updateWalletList[index]["coinAssets"][assetIndex].count =
                            updateWalletList[index]["coinAssets"][assetIndex].count + action.payload.userWalletList.assets[i].count
                        updateWalletList[index]["coinAssets"][assetIndex].assetValue =
                            updateWalletList[index]["coinAssets"][assetIndex].assetValue + (value ? action.payload.userWalletList.assets[i].count * value.USD.price : action.payload.userWalletList.assets[i].count)
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

                    let updatedAssetIndex = updateWalletList[index]["coinAssets"].findIndex(
                        assetList => assetList.assetCode === action.payload.userWalletList.assets[i].asset.code
                    );
                    updateWalletTotal = updateWalletTotal + updateWalletList[index]["coinAssets"][updatedAssetIndex].assetValue;
                }
            }
            return { ...state, userWalletList: updateWalletList, walletTotal: updateWalletTotal };
        default:
            return state
    }
};
export default PortfolioReducer