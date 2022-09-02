import { COINS_LIST, WALLET_LIST } from "./ActionTypes";
const INITIAL_STATE = {
    coinsList: [],
    walletList: []
};
const OnboardingReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case COINS_LIST:
            return { ...state, coinsList: action.payload };
        case WALLET_LIST:
            let updateWalletList = state.walletList || [];
            let index = updateWalletList.findIndex(
                walletList => walletList.id === action.payload.id
            );
            if (index > -1) {
                let coinIndex = updateWalletList[index].coins.findIndex(
                    walletList => walletList.coinName === action.payload.coinName
                );
                if (coinIndex <= -1) {
                    updateWalletList[index].coins.push({
                        coinCode: action.payload.coinCode,
                        coinSymbol: action.payload.coinSymbol,
                        coinName: action.payload.coinName,
                    })
                }
            } else {
                updateWalletList.push({
                    id: action.payload.id,
                    coins: [{
                        coinCode: action.payload.coinCode,
                        coinSymbol: action.payload.coinSymbol,
                        coinName: action.payload.coinName
                    }],
                    address: action.payload.address
                })
            }
            return { ...state, walletList: updateWalletList };
        default:
            return state
    }
};
export default OnboardingReducer