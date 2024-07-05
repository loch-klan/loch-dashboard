import { ALL_WALLET, RESET_ALL_WALLET } from "./ActionTypes";
const INITIAL_STATE = {
  walletList: "",
  totalWalletAmt: 0,
};
const WalletReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ALL_WALLET:
      return {
        ...state,
        walletList: action.payload.walletdata,
        totalWalletAmt: action.payload.totalWalletAmt,
      };
    case RESET_ALL_WALLET:
      return INITIAL_STATE;
    default:
      return state;
  }
};
export default WalletReducer;
