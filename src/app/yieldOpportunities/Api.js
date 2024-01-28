import { postLoginInstance } from "../../utils";
import { API_LIMIT } from "../../utils/Constant";
import { YIELD_OPPORTUNITIES } from "./ActionTypes";

export const getYieldOpportunities = (
  data,
  page = 0,
  ctx,
  isDefault = true
) => {
  return function (dispatch, getState) {
    postLoginInstance
      .post("wallet/user-wallet/get-yield-pools", data)
      .then((res) => {
        if (!res.data.error) {
          if (res.data?.data) {
            let totalPage = 0;
            let totalTempCount = 0;
            if (res.data?.data.total_count) {
              totalTempCount = res.data?.data.total_count;
            }
            if (totalTempCount) {
              totalPage = Math.ceil(totalTempCount / API_LIMIT);
            }
            let sendData = {
              ...res.data.data,
              totalPage: totalPage,
              currentPage: page,
            };
            if (page === 0 && isDefault) {
              dispatch({
                type: YIELD_OPPORTUNITIES,
                payload: sendData,
              });
            }
            if (ctx.getAllYieldOppLocal) {
              ctx.getAllYieldOppLocal(sendData);
            }
          }
        } else {
        }
      })
      .catch((err) => {});
  };
};
