import { LOCAL_WALLET } from "./HeaderActionTypes";

// returning promise so that it can be used as a callback
export const setHeaderReducer = (payload) => (dispatch) => {
  dispatch({
    type: LOCAL_WALLET,
    payload,
  });
};
