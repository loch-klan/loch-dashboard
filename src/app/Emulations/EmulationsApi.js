import { toast } from "react-toastify";
import { postLoginInstance } from "../../utils";
import { GET_EMULATION_DATA } from "./EmulationsActionTypes";
import {
  CopyTradeAdded,
  CopyTradeRemoved,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";

export const getCopyTrade = (ctx) => {
  return async function (dispatch, getState) {
    postLoginInstance
      .post("wallet/user-wallet/get-copy-trade")
      .then((res) => {
        if (!res.data.error) {
          if (res.data.data) {
            const tempResHolder = res?.data?.data?.result;
            const tempCopyTradeResHolder = tempResHolder.copy_trades;
            const tempCopyTradePaymentStatus = tempResHolder.payment_status;
            const tempAvailableCopyTradeResHolder =
              tempResHolder.available_trades;

            let tempConvertedArr = [];
            let tempAvailableCopyTradesArr = [];
            if (tempCopyTradeResHolder && tempCopyTradeResHolder.length > 0) {
              tempConvertedArr = tempCopyTradeResHolder.map((individualRes) => {
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
                  tradeId: individualRes._id,
                };
              });
              tempAvailableCopyTradesArr = [];
              if (
                tempAvailableCopyTradeResHolder &&
                tempAvailableCopyTradeResHolder.length > 0
              ) {
                tempAvailableCopyTradesArr =
                  tempAvailableCopyTradeResHolder.map((indiRes) => {
                    let valueOne = 0;
                    let valueTwo = 0;
                    let assetOne = "";
                    let assetTwo = "";
                    let copyAddress = "";
                    let tempId = "";

                    if (indiRes.value1) {
                      valueOne = indiRes.value1;
                    }
                    if (indiRes.value2) {
                      valueTwo = indiRes.value2;
                    }
                    if (indiRes.asset1) {
                      assetOne = indiRes.asset1;
                    }
                    if (indiRes.asset2) {
                      assetTwo = indiRes.asset2;
                    }
                    if (indiRes.copy_address) {
                      copyAddress = indiRes.copy_address;
                    }
                    if (indiRes.id) {
                      tempId = indiRes.id;
                    }

                    return {
                      assetFrom: assetOne,
                      assetTo: assetTwo,
                      valueFrom: valueOne,
                      valueTo: valueTwo,
                      copyAddress: copyAddress,
                      id: tempId,
                    };
                  });
              }
            } else {
              ctx.setState({
                emulationsLoading: false,
              });
            }
            dispatch({
              type: GET_EMULATION_DATA,
              payload: {
                copyTrades: tempConvertedArr,
                availableCopyTrades: tempAvailableCopyTradesArr,
                paymentStatus: tempCopyTradePaymentStatus,
              },
            });
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
export const addCopyTrade = (
  data,
  hideModal,
  resetBtn,
  address,
  amount,
  email
) => {
  return async function (dispatch, getState) {
    postLoginInstance
      .post("wallet/user-wallet/add-copy-trade", data)
      .then((res) => {
        if (resetBtn) {
          resetBtn();
        }
        if (hideModal) {
          hideModal(true);
        }
        if (!res.data.error) {
          CopyTradeAdded({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
            copied_wallet: address,
            amount: amount,
            notification_email: email,
          });
          if (res.data.data) {
            toast.success(
              <div className="custom-toast-msg">
                <div>Congratulations! Your setup is complete</div>
                <div className="inter-display-medium f-s-13 lh-16 grey-737 m-t-04">
                  You’ll receive notifications detailing the exact copy trades
                </div>
              </div>
            );
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

export const removeCopyTrade = (data, resetBtn, address) => {
  return async function (dispatch, getState) {
    postLoginInstance
      .post("wallet/user-wallet/cancel-copy-trade", data)
      .then((res) => {
        if (!res.data.error) {
          if (resetBtn) {
            resetBtn();
          }
          CopyTradeRemoved({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
            wallet: address,
          });
          if (res.data.data) {
            toast.success("Trade cancelled");
          }
        } else {
          toast.error("Something went wrong");
        }
      })
      .catch((err) => {
        if (resetBtn) {
          resetBtn();
          toast.error("Something went wrong");
        }
      });
  };
};
export const updaetAvailableCopyTraes = (data, recallCopyTrader, isConfirm) => {
  return async function (dispatch, getState) {
    postLoginInstance

      .post("wallet/transaction/update-copy-trade-transaction", data)
      .then((res) => {
        if (!res.data.error) {
          if (res.data.data) {
            if (isConfirm) {
              toast.success("Congratulations! Trade confirmed");
            } else {
              toast.success("Trade rejected ");
            }
            if (recallCopyTrader) {
              recallCopyTrader();
            }
          }
        } else {
          toast.error(res.data.message || "Something went wrong");
        }
      })
      .catch((err) => {});
  };
};
export const copyTradePaid = (data, goToUrl, hideModal) => {
  return async function (dispatch, getState) {
    postLoginInstance
      .post("commerce/payment/coinbase-payment", data)
      .then((res) => {
        console.log("response res ", res);
        if (!res.data.error && goToUrl) {
          // window.open(goToUrl, "_self");
        } else {
          // toast.error(res.data.message || "Something went wrong");
        }
      })
      .catch((err) => {
        // toast.error("Something went wrong");
      });
  };
};
