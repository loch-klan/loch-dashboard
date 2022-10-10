import { WALLET_LIST } from "./ActionTypes";
const INITIAL_STATE = {
    walletList: "",
};
const WalletReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case WALLET_LIST:
            return { ...state, walletList: action.payload };
        default:
            return state
    }
};
export default WalletReducer