import { preLoginInstance } from "../../utils";
import { TOP_GET_DEFI_DATA } from "../topAccount/ActionTypes";
import { GET_DEFI_DATA } from "./ActionTypes";

// update defi data
export const updateDefiData = (data, ctx) => {
  return function (dispatch, getState) {
    dispatch({
      type: ctx?.state?.isTopAccountPage ? TOP_GET_DEFI_DATA : GET_DEFI_DATA,
      payload: {
        ...data,
      },
    });
  };
};
