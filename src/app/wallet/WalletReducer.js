import { ALL_WALLET } from "./ActionTypes";
const INITIAL_STATE = {
  walletList: "",
  totalWalletAmt:0,
};
const WalletReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ALL_WALLET:
            return {
              ...state,
              walletList: action.payload.walletdata,
              totalWalletAmt: action.payload.totalWalletAmt,
            };
        default:
            return state
    }
};
export default WalletReducer