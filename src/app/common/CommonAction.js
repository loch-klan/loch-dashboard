import { SET_COMMON_REDUCER } from "./ActionTypes";

// returning promise so that it can be used as a callback
export const setCommonReducer = (payload) => (dispatch) => {
  dispatch({
    type: SET_COMMON_REDUCER,
    payload,
  });
  return Promise.resolve();
};
