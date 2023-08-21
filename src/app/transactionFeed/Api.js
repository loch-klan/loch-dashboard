import { postLoginInstance } from "../../utils";
import { YIELD_OPPORTUNITIES } from "./ActionTypes";

export const getYieldOpportunities = (data, page = 0) => {
  return function (dispatch, getState) {
    postLoginInstance
      .post("wallet/user-wallet/get-yield-opportunities", data)
      .then((res) => {
        if (!res.data.error) {
          if (res.data?.data) {
            dispatch({
              type: YIELD_OPPORTUNITIES,
              payload: res.data.data,
            });
          }
        } else {
        }
      })
      .catch((err) => {});
  };
};
