import { toast } from "react-toastify";
import { postLoginInstance } from "../../utils";
import { GET_EMULATION_DATA } from "./EmulationsActionTypes";

export const getEmulations = (ctx) => {
  return async function (dispatch, getState) {
    postLoginInstance
      .post("wallet/user-wallet/get-copy-trade")
      .then((res) => {
        if (!res.data.error) {
          if (res.data.data) {
            const tempResHolder = res?.data?.data?.result;
            if (tempResHolder && tempResHolder.length > 0) {
              const tempConvertedArr = tempResHolder.map((individualRes) => {
                let tempCurrentBalance = 0;
                let tempTradeDeposit = 0;
                let tempUnrealizedPnL = 0;

                if (individualRes.current_amount) {
                  tempCurrentBalance = individualRes.current_amount;
                }
                if (individualRes.deposit) {
                  tempTradeDeposit = individualRes.deposit;
                }
                if (
                  (tempCurrentBalance || tempCurrentBalance === 0) &&
                  (tempTradeDeposit || tempTradeDeposit === 0)
                ) {
                  tempUnrealizedPnL = tempCurrentBalance - tempTradeDeposit;
                }

                return {
                  currentBalance: tempCurrentBalance,
                  tradeDeposit: tempTradeDeposit,
                  wallet: individualRes.copy_wallet,
                  unrealizedPnL: tempUnrealizedPnL,
                };
              });
              dispatch({
                type: GET_EMULATION_DATA,
                payload: tempConvertedArr,
              });
            } else {
              ctx.setState({
                emulationsLoading: false,
              });
            }
          }
        }
      })
      .catch((err) => {
        ctx.setState({
          emulationsLoading: false,
        });
      });
  };
};
export const addEmulations = (data, hideModal, resetBtn) => {
  return async function (dispatch, getState) {
    postLoginInstance
      .post("wallet/user-wallet/add-copy-trade", data)
      .then((res) => {
        if (resetBtn) {
          resetBtn();
        }
        if (!res.data.error) {
          if (res.data.data) {
            if (hideModal) {
              hideModal(true);
            }
          }
        } else {
          toast.error(res.data.message || "Something went wrong");
        }
      })
      .catch((err) => {
        if (resetBtn) {
          resetBtn();
        }
      });
  };
};
