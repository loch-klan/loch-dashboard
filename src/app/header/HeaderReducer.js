import {
  LOCAL_WALLET,
  IS_WALLET_CONNECTED,
  CONNECTED_METAMASK,
} from "./HeaderActionTypes";
const INITIAL_STATE = {
  wallet: [],
};
export const HeaderReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOCAL_WALLET:
      return { wallet: action.payload };
    default:
      return state;
  }
};
export const IsWalletConnectedReducer = (state = false, action) => {
  switch (action.type) {
    case IS_WALLET_CONNECTED:
      return action.payload;
    default:
      return state;
  }
};
export const MetamaskConnectedReducer = (state = "", action) => {
  switch (action.type) {
    case CONNECTED_METAMASK:
      return action.payload;
    default:
      return state;
  }
};
