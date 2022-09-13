import { COIN_RATE_LIST, USER_WALLET_LIST } from "./ActionTypes";
const INITIAL_STATE = {
    coinRateList: [],
    userWalletList: []
};
const PortfolioReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case COIN_RATE_LIST:
            return { ...state, coinRateList: action.payload };
        case USER_WALLET_LIST:
            let updateWalletList = state.userWalletList || [];
            let index = updateWalletList.findIndex(
                walletList => walletList.address === action.payload.address
            );
            if (index <= -1) {
                updateWalletList.push({
                    address: action.payload.address,
                    chains: []
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
                    updateWalletList[index]["chains"][chainIndex]["assets"].push({
                        assetCode: action.payload.userWalletList.assets[i].asset.code,
                        assetName: action.payload.userWalletList.assets[i].asset.name,
                        assetSymbol: action.payload.userWalletList.assets[i].asset.symbol,
                        coinCode: action.payload.userWalletList.assets[i].chain.code,
                        coinSymbol: action.payload.userWalletList.assets[i].chain.symbol,
                        coinName: action.payload.userWalletList.assets[i].chain.name,
                        count: action.payload.userWalletList.assets[i].count
                    })
                }
            }
            return { ...state, userWalletList: updateWalletList };
        default:
            return state
    }
};
export default PortfolioReducer