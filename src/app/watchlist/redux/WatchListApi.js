import postLoginInstance from "../../../utils/PostLoginAxios";
import {
  GET_WATCHLIST_DATA,
  GET_WATCHLIST_DATA_LOADING,
  TOP_ACCOUNT_IN_WATCHLIST,
} from "./ActionTypes";
export const getWatchList = (data) => {
  return function (dispatch, getState) {
    postLoginInstance
      .post("wallet/user-wallet/get-watchlist", data)
      .then((res) => {
        dispatch({
          type: GET_WATCHLIST_DATA_LOADING,
          payload: false,
        });
        if (!res.data.error) {
          if (res.data.data) {
            dispatch({
              type: GET_WATCHLIST_DATA,
              payload: res.data.data,
            });
          }
        }
      })
      .catch((err) => {
        dispatch({
          type: GET_WATCHLIST_DATA_LOADING,
          payload: false,
        });
      });
  };
};
export const getWatchListLoading = () => {
  return function (dispatch, getState) {
    dispatch({
      type: GET_WATCHLIST_DATA_LOADING,
      payload: true,
    });
  };
};
export const updateAddToWatchList = (data) => {
  return function (dispatch, getState) {
    postLoginInstance
      .post("wallet/user-wallet/add-update-watchlist", data)
      .then((res) => {
        if (!res.data.error) {
        }
      })
      .catch((err) => {});
  };
};
export const removeFromWatchList = (data) => {
  return function (dispatch, getState) {
    postLoginInstance
      .post("wallet/user-wallet/delete-watchlist", data)
      .then((res) => {
        if (!res.data.error) {
        }
      })
      .catch((err) => {});
  };
};

export const getWatchListByUser = (data) => {
  return function (dispatch, getState) {
    postLoginInstance
      .post("wallet/user-wallet/get-watchlist-by-user")
      .then((res) => {
        if (!res.data.error) {
          if (res.data.data && res.data.data.addresses) {
            dispatch({
              type: TOP_ACCOUNT_IN_WATCHLIST,
              payload: res.data.data.addresses,
            });
          }
        }
      })
      .catch((err) => {});
  };
};
