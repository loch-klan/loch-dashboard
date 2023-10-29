import {
  LOCAL_WALLET,
  IS_WALLET_CONNECTED,
  CONNECTED_METAMASK,
} from "./HeaderActionTypes";

// returning promise so that it can be used as a callback
export const setHeaderReducer = (payload) => (dispatch) => {
  dispatch({
    type: LOCAL_WALLET,
    payload,
  });
};
export const setIsWalletConnectedReducer = (payload) => (dispatch) => {
  dispatch({
    type: IS_WALLET_CONNECTED,
    payload,
  });
};
export const setMetamaskConnectedReducer = (payload) => (dispatch) => {
  dispatch({
    type: CONNECTED_METAMASK,
    payload,
  });
};
