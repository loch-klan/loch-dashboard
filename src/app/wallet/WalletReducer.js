import { ALL_WALLET } from "./ActionTypes";
const INITIAL_STATE = {
    walletList: "",
};
const WalletReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ALL_WALLET:
            return { ...state, walletList: action.payload };
        default:
            return state
    }
};
export default WalletReducer