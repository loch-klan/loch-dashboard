import { toast } from "react-toastify";
import { postLoginInstance } from "../../utils";
import {
  Home_CE_ApiSyncCompleted,
  LP_CE_ApiSyncCompleted,
  Wallet_CE_ApiSyncCompleted,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import {
  AVERAGE_COST_BASIS,
  AVERAGE_COST_RESET,
  AVERAGE_COST_SORT,
  COUNTER_PARTY_VOLUME,
  GAS_FEES,
} from "../intelligence/ActionTypes";
import { getGraphData, getCounterGraphData } from "./getGraphData";
import { YIELD_POOLS } from "../yieldOpportunities/ActionTypes";

export const getAllFeeApi = (ctx, startDate, endDate, isDefault = true) => {
  return async function (dispatch, getState) {
    let data = new URLSearchParams();
    if (startDate) {
      data.append("start_datetime", startDate);
      data.append("end_datetime", endDate);
    }

    postLoginInstance
      .post("wallet/transaction/get-gas-fee-overtime", data)
      .then((res) => {
        if (!res.data.error) {
          if (isDefault) {
            dispatch({
              type: GAS_FEES,
              payload: {
                GraphfeeData: res.data.data,
                graphfeeValue: getGraphData(res.data.data, ctx),
              },
            });
          }
          if (ctx.setLocalGasFees) {
            ctx.setLocalGasFees(
              res.data.data,
              getGraphData(res.data.data, ctx)
            );
          }
          ctx.setState({
            barGraphLoading: false,
            //  GraphData: res.data.data,
            //  graphValue: getGraphData(res.data.data, ctx),
            gasFeesGraphLoading: false,
          });
        } else {
          toast.error(res.data.message || "Something Went Wrong");
        }
      });
  };
};
export const getAllCounterFeeApi = (
  ctx,
  startDate,
  endDate,
  isDefault = true
) => {
  return async function (dispatch, getState) {
    let data = new URLSearchParams();
    if (startDate) {
      data.append("start_datetime", startDate);
      data.append("end_datetime", endDate);
    }

    postLoginInstance
      .post("wallet/transaction/get-counter-party-volume-traded", data)
      .then((res) => {
        if (!res.data.error) {
          //  console.log("calling counter fees");
          let g_data = res.data.data.counter_party_volume_traded.sort(
            (a, b) => {
              let bTotal_volume = b.total_volume ? b.total_volume : 0;
              let aTotal_volume = a.total_volume ? a.total_volume : 0;
              return bTotal_volume - aTotal_volume;
            }
          );
          // g_data = g_data.slice(0, 3);
          // console.log("data", g_data)
          if (isDefault) {
            dispatch({
              type: COUNTER_PARTY_VOLUME,
              payload: {
                counterPartyData: g_data,
                counterPartyValue:
                  ctx.state.currentPage === "Home"
                    ? getCounterGraphData(g_data, ctx, true)
                    : getCounterGraphData(g_data, ctx),
              },
            });
          }

          if (ctx.setLocalCounterParty) {
            ctx.setLocalCounterParty(g_data, getCounterGraphData(g_data, ctx));
          }
          ctx.setState({
            counterGraphLoading: false,
            // counterPartyData: res.data.data.counter_party_volume_traded,
            // counterPartyValue:
            //   ctx.state.currentPage === "Home"
            //     ? getCounterGraphData(g_data, ctx)
            //     : getCounterGraphData(
            //         res.data.data.counter_party_volume_traded,
            //         ctx
            //       ),
          });
        } else {
          toast.error(res.data.message || "Something Went Wrong");
          ctx.setState({
            counterGraphLoading: false,
          });
        }
      })
      .catch((err) => {
        ctx.setState({
          counterGraphLoading: false,
        });
      });
  };
};

// update counterpary value and data
export const updateCounterParty = (data, value, ctx) => {
  return function (dispatch, getState) {
    dispatch({
      type: COUNTER_PARTY_VOLUME,
      payload: {
        counterPartyData: data,
        counterPartyValue: value,
      },
    });
  };
};

// update counterpary value and data
export const updateFeeGraph = (data, value, ctx, isDefault = true) => {
  return function (dispatch, getState) {
    if (isDefault) {
      dispatch({
        type: GAS_FEES,
        payload: {
          GraphfeeData: data,
          graphfeeValue: value,
        },
      });
    }
    if (ctx.setLocalGasFees) {
      ctx.setLocalGasFees(data, value);
    }
  };
};

// add update account - connect exchange
export const addUpdateAccount = (data, ctx) => {
  postLoginInstance
    .post("organisation/user/add-update-user-account", data)
    .then((res) => {
      if (!res.data.error) {
        //  ctx.props.getExchangeBalance("binance", ctx);
        // ctx.props.getExchangeBalance("coinbase", ctx);
        // Api sync attempted
        if (ctx.props.tracking === "home page") {
          Home_CE_ApiSyncCompleted({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
            exchange_name: ctx.state.selection.name,
          });
        } else if (ctx.props.tracking === "landing page") {
          LP_CE_ApiSyncCompleted({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
            exchange_name: ctx.state.selection.name,
          });
        } else if (ctx.props.tracking === "wallet page") {
          Wallet_CE_ApiSyncCompleted({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
            exchange_name: ctx.state.selection.name,
          });
        }

        ctx.setState({
          isLoadingbtn: false,
        });
        if (ctx.props.ishome) {
          toast.success(
            <div className="custom-toast-msg" style={{ width: "43rem" }}>
              <div>{ctx.state.selection.name + " connected to Loch"}</div>
              <div className="inter-display-medium f-s-13 lh-16 grey-737 m-t-04">
                It may take a few seconds for all the transactions to load.
              </div>
            </div>
          );
          ctx.handleUpdateList();

          setTimeout(() => {
            // ctx.props.handleBackConnect(ctx.state.connectExchangesList);
            ctx.handleBack();
          }, 200);
        } else {
          toast.success(
            <div className="custom-toast-msg" style={{ width: "43rem" }}>
              <div>{ctx.state.selection.name + " connected to Loch"}</div>
              <div className="inter-display-medium f-s-13 lh-16 grey-737 m-t-04">
                It may take a few seconds for all the transactions to load.
              </div>
            </div>
          );
          ctx.state.onHide();
          // window.location.reload();
          setTimeout(() => {
            ctx.props.setPageFlagDefault();
            ctx.props?.handleUpdate && ctx.props?.handleUpdate();

            ctx.props.openPopup();
          }, 1000);
        }
      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    });
};

// get user account - connect exchange
export const getUserAccount = (data, ctx) => {
  postLoginInstance
    .post("organisation/user/get-user-account-by-exchange", data)
    .then((res) => {
      if (!res.data.error) {
        let apiResponse = res.data.data.account;
        if (apiResponse) {
          ctx.setState({
            connectionName: apiResponse?.name,
            apiSecret: apiResponse.credentials.api_secret,
            apiKey: apiResponse.credentials.api_key,
          });
        }
      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    });
};

export const getAvgCostBasis = (ctx) => {
  return async function (dispatch, getState) {
    let data = new URLSearchParams();

    postLoginInstance
      .post("wallet/user-wallet/get-average-cost-basis", data)
      .then((res) => {
        if (!res.data.error) {
          let ApiResponse = res?.data.data?.assets;
          let netReturn = res?.data.data?.net_return
            ? res?.data.data?.net_return
            : 0;
          let totalBalance = res?.data.data?.total_bal
            ? res?.data.data?.total_bal
            : 0;
          let totalCost = res?.data.data?.total_cost
            ? res?.data.data?.total_cost
            : 0;
          let totalGain = res?.data.data?.total_gain
            ? res?.data.data?.total_gain
            : 0;

          let currency = JSON.parse(window.localStorage.getItem("currency"));

          let AssetsList = [];
          let totalCostBasis = 0;
          let totalCurrentValue = 0;
          ApiResponse?.map((item) => {
            let costBasis =
              item.count * item.average_price * (currency?.rate || 1);
            let current_price =
              item.count * item.current_price * (currency?.rate || 1);

            totalCostBasis = totalCostBasis + costBasis;
            totalCurrentValue = totalCurrentValue + current_price;
            AssetsList.push({
              chain: item?.chain
                ? {
                    name: item?.chain?.name,
                    code: item?.chain?.code,
                    color: item?.chain?.color,
                    symbol: item?.chain?.symbol,
                  }
                : null,
              Asset: item.asset.symbol,
              AssetCode: item.asset.code,
              AssetName: item.asset.name,
              AverageCostPrice: item.average_price * (currency?.rate || 1),
              CurrentPrice: item.current_price * (currency?.rate || 1),
              Amount: item.count * (currency?.rate || 1),
              CostBasis: costBasis,
              GainAmount: item.gain ? item.gain : 0,
              CurrentValue: current_price,
              weight: item.weight,
              GainLoss:
                costBasis == 0
                  ? 0
                  : ((current_price - costBasis) / costBasis) * 100,
            });
          });
          // Remove this
          let totalPercentage = netReturn ? netReturn.toFixed(2) : 0;
          // totalCostBasis === 0
          //   ? 0
          //   : (
          //       ((totalCurrentValue - totalCostBasis) / totalCostBasis) *
          //       100
          //     ).toFixed(2);

          // console.log("Asset",AssetsList)
          dispatch({
            type: AVERAGE_COST_BASIS,
            payload: {
              Average_cost_basis: AssetsList,
              totalPercentage: totalPercentage,
              net_return: netReturn,
              total_bal: totalBalance,
              total_cost: totalCost,
              total_gain: totalGain,
            },
          });
          if (window.localStorage.getItem("lochToken")) {
            postLoginInstance
              .post("wallet/user-wallet/add-yield-pools")
              .then((res) => {
                dispatch({
                  type: YIELD_POOLS,
                  payload: res,
                });
              })
              .catch(() => {
                console.log("Issue here");
              });

            postLoginInstance
              .post("wallet/user-wallet/add-nfts")
              .then((res) => {})
              .catch(() => {
                console.log("Issue here");
              });
          }
          const shouldRecallApis =
            window.localStorage.getItem("shouldRecallApis");
          if (!shouldRecallApis || shouldRecallApis === "false") {
            ctx.setState(
              {
                AvgCostLoading: false,
              },
              () => {
                setTimeout(() => {
                  if (ctx.sortArray) {
                    ctx.sortArray("CurrentValue", false);
                  }
                }, 100);
              }
            );
          } else {
            ctx.setState({
              shouldAvgCostLoading: false,
            });
          }
        } else {
          toast.error(res.data.message || "Something Went Wrong");
        }
      });
  };
};

// sort average cost basis

export const updateAverageCostBasis = (data, ctx) => {
  return async function (dispatch, getState) {
    dispatch({
      type: AVERAGE_COST_SORT,
      payload: data,
    });
  };
};

// reset average cost basis

export const ResetAverageCostBasis = (ctx) => {
  return async function (dispatch, getState) {
    dispatch({
      type: AVERAGE_COST_RESET,
    });
  };
};
