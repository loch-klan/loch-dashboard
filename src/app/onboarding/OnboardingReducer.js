import { COINS_LIST, WALLET_LIST } from "./ActionTypes";
const INITIAL_STATE = {
    coinsList: [],
};
const OnboardingReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case COINS_LIST:
            return { ...state, coinsList: action.payload };
        case WALLET_LIST:
            return { ...state, walletList: action.payload };
        default:
            return state
    }
};
export default OnboardingReducer