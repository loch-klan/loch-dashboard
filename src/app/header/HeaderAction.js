import { LOCAL_WALLET, IS_WALLET_CONNECTED } from "./HeaderActionTypes";

// returning promise so that it can be used as a callback
export const setHeaderReducer = (payload) => (dispatch) => {
  dispatch({
    type: LOCAL_WALLET,
    payload,
  });
};
export const setIsWalletConnectedReducer = (payload) => (dispatch) => {
  console.log("Action called?");
  dispatch({
    type: IS_WALLET_CONNECTED,
    payload,
  });
};
