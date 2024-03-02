import { postLoginInstance } from "../../utils";
import { GET_EMULATION_DATA } from "./EmulationsActionTypes";

export const getEmulations = () => {
  return async function (dispatch, getState) {
    postLoginInstance
      .post("wallet/user-wallet/get-copy-trade")
      .then((res) => {
        if (!res.data.error) {
          if (res.data.data) {
            const tempResHolder = res?.data?.data?.result;
            if (tempResHolder && tempResHolder.length > 0) {
              const tempConvertedArr = tempResHolder.map((individualRes) => {
                return {
                  currentBalance: individualRes.current_amount,
                  tradeDeposit: individualRes.deposit,
                  wallet: individualRes.wallet,
                };
              });
              dispatch({
                type: GET_EMULATION_DATA,
                payload: tempConvertedArr,
              });
            }
          }
        }
      })
      .catch((err) => {});
  };
};
