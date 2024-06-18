import { toast } from "react-toastify";
import postLoginInstance from "../../../utils/PostLoginAxios";
import {
  GET_WATCHLIST_DATA,
  GET_WATCHLIST_DATA_LOADING,
  TOP_ACCOUNT_IN_WATCHLIST,
} from "./ActionTypes";
export const getWatchList = (data) => {
  return async function (dispatch, getState) {
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
  return async function (dispatch, getState) {
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
  return async function (dispatch, getState) {
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
  return async function (dispatch, getState) {
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

export const addAddressToWatchList = (
  data,
  ctx,
  passedAddress,
  passedNameTag
) => {
  return async function () {
    postLoginInstance
      .post("wallet/user-wallet/add-update-watchlist", data)
      .then((res) => {
        if (!res.data.error && ctx.showAddressesAdded) {
          ctx.showAddressesAdded(passedAddress, passedNameTag, true);
        }
        if (ctx.addressAddedFun) {
          ctx.addressAddedFun();
        }
      })
      .catch((err) => {
        if (ctx.hideModal) {
          ctx.hideModal();
        }
        if (ctx.refetchList) {
          ctx.refetchList();
        }
        console.log("Something went wrong");
      });
  };
};
export const removeAddressFromWatchList = (
  data,
  ctx,
  passedAddress,
  passedNameTag
) => {
  return async function () {
    postLoginInstance
      .post("wallet/user-wallet/delete-watchlist", data)
      .then((res) => {
        if (!res.data.error) {
          if (ctx.refetchList) {
            ctx.refetchList();
            if (ctx.addressDeleted) {
              ctx.addressDeleted(passedAddress, passedNameTag);
            }
          } else {
            if (ctx.addressDeleted) {
              ctx.addressDeleted(passedAddress, passedNameTag);
            }
          }
        } else {
          toast.error("Something Went Wrong");
        }
      })
      .catch((err) => {
        toast.error("Something Went Wrong");
      });
  };
};
