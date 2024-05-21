import { postLoginInstance } from "../../utils";
import { toast } from "react-toastify";
import { getAllTransactionHistory } from "./IntelligenceAction";
import { getProfitAndLossData } from "./getProfitAndLossData";
import { CurrencyType } from "../../utils/ReusableFunctions";
import { getProfitLossAsset } from "./stackGrapgh";

import {
  ALL_TRANSACTION_HISTORY_HOME,
  INFLOW_OUTFLOW_CHART_ASSET_LIST,
  INFLOW_OUTFLOW_CHART_ASSET_SELECTED,
  INFLOW_OUTFLOW_CHART_DATA,
  INFLOW_OUTFLOW_TIME_TAB,
  INFLOW_OUTFLOW_WALLET,
  INSIGHT_DATA,
  NETFLOW_GRAPH,
  PORTFOLIO_ASSET,
  TRANSACTION_FILTER,
} from "./ActionTypes";

export const getInflowsAndOutflowsGraphDataApi = (data, ctx) => {
  return async function (dispatch, getState) {
    let currency = JSON.parse(window.localStorage.getItem("currency"));
    let currencyRate = currency?.rate || 1;
    postLoginInstance
      .post("wallet/user-wallet/get-buy-sell", data)
      .then((res) => {
        if (!res.data.error) {
          if (res.data.data.data && res.data.data.data.length > 0) {
            const tempConvertedValue = res.data.data.data.map((resData) => {
              return {
                price: resData.price ? resData.price * currencyRate : 0,
                received: resData.received ? resData.received : 0,
                received_value: resData.received_value
                  ? resData.received_value * currencyRate
                  : 0,
                send: resData.send ? resData.send : 0,
                send_value: resData.send_value
                  ? resData.send_value * currencyRate
                  : 0,
                timestamp: resData.timestamp ? resData.timestamp : 0,
              };
            });
            const shouldRecallApis =
              window.localStorage.getItem("shouldRecallApis");
            if (!shouldRecallApis || shouldRecallApis === "false") {
              ctx.setState({
                graphLoading: false,
                // inflowsOutflowsList: tempConvertedValue,
              });
            }
            dispatch({
              type: INFLOW_OUTFLOW_CHART_DATA,
              payload: tempConvertedValue,
            });
          } else {
            const shouldRecallApis =
              window.localStorage.getItem("shouldRecallApis");
            if (!shouldRecallApis || shouldRecallApis === "false") {
              ctx.setState({
                graphLoading: false,
                // inflowsOutflowsList: [],
              });
            }
            dispatch({
              type: INFLOW_OUTFLOW_CHART_DATA,
              payload: [],
            });
          }
        } else {
          ctx.setState({
            graphLoading: false,
          });
          toast.error(res.data.message || "Something Went Wrong");
        }
      })
      .catch((err) => {
        ctx.setState({
          graphLoading: false,
        });
        console.log("Catch", err);
      });
  };
};
export const setInflowsAndOutflowsTimeTab = (data) => {
  return async function (dispatch, getState) {
    dispatch({
      type: INFLOW_OUTFLOW_TIME_TAB,
      payload: data,
    });
  };
};
export const setInflowsAndOutflowsWalletList = (data) => {
  return async function (dispatch, getState) {
    dispatch({
      type: INFLOW_OUTFLOW_WALLET,
      payload: data,
    });
  };
};
export const setSelectedInflowOutflowsAssetBlank = () => {
  return async function (dispatch, getState) {
    dispatch({
      type: INFLOW_OUTFLOW_CHART_ASSET_SELECTED,
      payload: "",
    });
  };
};
const testerFun = async (transactionData) => {
  if (window.ethereum) {
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // let signer = provider.getSigner();
    // const txResponse = await signer.sendTransaction(transactionData);
    // console.log("signer.sendTransaction response ", txResponse);
  }
};
export const sendAmount = (data, ctx) => {
  return async function (dispatch, getState) {
    postLoginInstance
      .post("wallet/user-wallet/get-trxn", data)
      .then((res) => {
        console.log("user-wallet/get-trxn response ", res.data.data[0]);
        if (res) {
          testerFun(res.data.data[0]);
        }
      })
      .catch((err) => {
        ctx.setState({
          graphLoading: false,
        });
        console.log("get-trxn Catch", err);
      });
  };
};
export const getInflowsAndOutflowsAssetsApi = (data, ctx) => {
  return async function (dispatch, getState) {
    postLoginInstance
      .post("wallet/transaction/get-transaction-asset-filter", data)
      .then((res) => {
        if (!res.data.error) {
          if (res.data.data.assets.length > 0) {
            dispatch({
              type: INFLOW_OUTFLOW_CHART_ASSET_LIST,
              payload: res.data.data.assets,
            });

            let isEth = res.data.data.assets.findIndex((resRes) => {
              return resRes.asset.code === "ETH";
            });
            if (isEth > -1) {
              const tempAsset = res.data.data.assets[isEth]._id
                ? res.data.data.assets[isEth]._id
                : "";
              dispatch({
                type: INFLOW_OUTFLOW_CHART_ASSET_SELECTED,
                payload: tempAsset,
              });
            } else {
              let isBtc = res.data.data.assets.findIndex((resRes) => {
                return resRes.asset.code === "BTC";
              });
              if (isBtc > -1) {
                const tempAsset = res.data.data.assets[isBtc]._id
                  ? res.data.data.assets[isBtc]._id
                  : "";
                dispatch({
                  type: INFLOW_OUTFLOW_CHART_ASSET_SELECTED,
                  payload: tempAsset,
                });
              } else {
                const firstItem = res.data.data.assets[0]._id
                  ? res.data.data.assets[0]._id
                  : "";
                if (firstItem) {
                  dispatch({
                    type: INFLOW_OUTFLOW_CHART_ASSET_SELECTED,
                    payload: firstItem,
                  });
                } else {
                  ctx.setState({
                    graphLoading: false,
                  });
                }
              }
            }
          } else {
            ctx.setState({
              graphLoading: false,
            });
          }
        } else {
          ctx.setState({
            graphLoading: false,
          });
        }
      })
      .catch((err) => {
        ctx.setState({
          graphLoading: false,
        });
        console.log("Catch", err);
      });
  };
};
export const searchTransactionApi = (
  data,
  ctx,
  page = 0,
  isDefault = true,
  callAnyways = false
) => {
  return async function (dispatch, getState) {
    postLoginInstance
      .post("wallet/transaction/search-transaction", data)
      .then((res) => {
        if (ctx) {
          ctx.setState({
            tableLoading: false,
          });
        }
        // console.log(page)
        if (!res.data.error) {
          if (callAnyways || (page === 0 && isDefault)) {
            dispatch(getAllTransactionHistory(res.data.data, page, ctx));
          }
          if (ctx.getAllTransactionHistoryLocal) {
            ctx.getAllTransactionHistoryLocal(res.data.data, page, ctx);
          }
        } else {
          toast.error(res.data.message || "Something Went Wrong");
        }
      })
      .catch((err) => {
        if (ctx) {
          ctx.setState({
            tableLoading: false,
          });
        }
        // console.log("Search transaction ", err)
      });
  };
};

export const getFilters = (ctx) => {
  return async function (dispatch, getState) {
    let data = new URLSearchParams();

    postLoginInstance
      .post("wallet/transaction/get-transaction-filter", data)
      .then((res) => {
        let assetFilter = [{ value: "allAssets", label: "All tokens" }];
        res.data.data.filters.asset_filters.map((item) => {
          let obj = {
            value: item._id,
            label: item.asset.name,
            code: item.asset.code,
          };
          assetFilter.push(obj);
        });
        let yearFilter = [{ value: "allYear", label: "All years" }];
        res.data.data.filters.year_filter.map((item) => {
          let obj = {
            value: item,
            label: item,
          };
          yearFilter.push(obj);
        });
        let methodFilter = [{ value: "allMethod", label: "All methods" }];
        res.data.data.filters.method_filters.map((item) => {
          let obj = {
            value: item,
            label: item,
          };
          methodFilter.push(obj);
        });
        dispatch({
          type: TRANSACTION_FILTER,
          payload: {
            assetFilter,
            yearFilter,
            methodFilter,
          },
        });
        if (ctx) {
          ctx.setState({
            assetFilter,
            yearFilter,
            methodFilter,
          });
        }
      })
      .catch((err) => {
        // console.log("getFilter ", err)
      });
  };
};

export const getProfitAndLossApi = (
  ctx,
  startDate,
  endDate,
  selectedChains = false,
  selectedAsset = false
) => {
  // console.log("inside api", startDate,endDate)
  return async function (dispatch, getState) {
    let data = new URLSearchParams();
    if (startDate) {
      data.append("start_datetime", startDate);
      data.append("end_datetime", endDate);
    }
    if (selectedChains && selectedChains.length > 0) {
      data.append("chains", JSON.stringify(selectedChains));
    }
    if (selectedAsset && selectedAsset.length > 0) {
      data.append("asset_ids", JSON.stringify(selectedAsset));
    }

    postLoginInstance
      .post("wallet/transaction/get-profit-loss", data)
      .then((res) => {
        // console.log("calling get profit and loss ", res);
        if (!res.data.error) {
          dispatch({
            type: NETFLOW_GRAPH,
            payload: {
              GraphData: res.data.data.profit_loss,
              graphValue: getProfitAndLossData(res.data.data.profit_loss, ctx),
            },
          });
          ctx.setState({
            //  GraphData: res.data.data.profit_loss,
            netFlowLoading: false,
            //  graphValue: getProfitAndLossData(res.data.data.profit_loss),
          });
        } else {
          toast.error(res.data.message || "Something Went Wrong");
        }
      });
  };
};

export const getAllInsightsApi = (ctx) => {
  return async function (dispatch, getState) {
    let data = new URLSearchParams();
    data.append("currency_code", CurrencyType(true));

    postLoginInstance
      .post("wallet/user-wallet/get-wallet-insights", data)
      .then((res) => {
        if (!res.data.error) {
          dispatch({
            type: INSIGHT_DATA,
            payload: {
              updatedInsightList: res.data.data.insights,
            },
          });

          if (ctx?.state.currentPage === "Home") {
            ctx.setState({
              //  insightList: res.data.data.insights,
              //  updatedInsightList: res.data.data.insights,
              isLoadingInsight: false,
              settings: {
                ...ctx.state.settings,
                slidesToShow: res.data.data.insights?.length === 1 ? 1 : 1.5,
              },
            });
          } else {
            //  console.log("else insight")
            ctx.setState({
              //  insightList: res.data.data.insights,
              //  updatedInsightList: res.data.data.insights,
              isLoading: false,
            });
          }
        } else {
          toast.error(res.data.message || "Something Went Wrong");
        }
      })
      .catch((err) => {
        // console.log("err ", err)
      });
  };
};

export const getAssetProfitLoss = (
  ctx,
  startDate,
  endDate,
  selectedChains = false,
  selectedAsset = false,
  isDefault = true,
  isPremiumUser = false
) => {
  return async function (dispatch, getState) {
    let data = new URLSearchParams();
    if (startDate) {
      data.append("start_datetime", startDate);
      data.append("end_datetime", endDate);
    }
    if (selectedChains && selectedChains.length > 0) {
      data.append("chains", JSON.stringify(selectedChains));
    }
    if (selectedAsset && selectedAsset.length > 0) {
      data.append("asset_ids", JSON.stringify(selectedAsset));
    }
    postLoginInstance
      .post("wallet/transaction/get-asset-profit-loss", data)
      .then((res) => {
        if (!res.data.error) {
          if (isDefault) {
            dispatch({
              type: PORTFOLIO_ASSET,
              payload: {
                ProfitLossAsset: getProfitLossAsset(
                  res.data.data?.profit_loss,
                  ctx,
                  isPremiumUser
                ),
                ProfitLossAssetData: res.data.data?.profit_loss,
              },
            });
          }
          if (ctx.setProfitLossAssetLocal) {
            ctx.setProfitLossAssetLocal(
              getProfitLossAsset(res.data.data?.profit_loss, ctx, isPremiumUser)
            );
          }
          const shouldRecallApis =
            window.localStorage.getItem("shouldRecallApis");
          if (!shouldRecallApis || shouldRecallApis === "false") {
            if (ctx) {
              ctx.setState({
                //  GraphData: res.data.data.profit_loss,
                netFlowLoading: false,
                //  graphValue: getProfitAndLossData(res.data.data.profit_loss),
              });
            }
          } else {
            if (ctx) {
              ctx.setState({
                shouldNetFlowLoading: false,
              });
            }
          }
          //  ctx.setState({
          //    ProfitLossAsset: getProfitLossAsset(res.data.data?.profit_loss),
          //    //    updatedInsightList: res.data.data.insights,
          //    //    isLoading: false,
          //  });
        } else {
          toast.error(res.data.message || "Something Went Wrong");
        }
      })
      .catch((err) => {
        // console.log("err ", err)
      });
  };
};
export const updateAssetProfitLoss = (
  passedData,
  ctx,
  isPremiumUser = false
) => {
  return async function (dispatch, getState) {
    dispatch({
      type: PORTFOLIO_ASSET,
      payload: {
        ProfitLossAsset: getProfitLossAsset(passedData, ctx, isPremiumUser),
        ProfitLossAssetData: passedData,
      },
    });
    if (ctx.setProfitLossAssetLocal) {
      ctx.setProfitLossAssetLocal(
        getProfitLossAsset(passedData, ctx, isPremiumUser)
      );
    }
  };
};

export const getTransactionAsset = (data, ctx, isCodeInsteadOfLabel) => {
  postLoginInstance
    .post("wallet/transaction/get-transaction-asset-filter")
    .then((res) => {
      if (!res.data.error) {
        let assetFilter = [{ value: "allAssets", label: "All tokens" }];
        if (isCodeInsteadOfLabel) {
          res?.data?.data?.assets?.forEach((e) => {
            assetFilter.push({
              value: e._id,
              label: e.asset?.code ? e.asset?.code : e.asset.name,
              code: e.asset?.code ? e.asset.code : "",
            });
          });
        } else {
          res?.data?.data?.assets?.forEach((e) => {
            assetFilter.push({
              value: e._id,
              label: e.asset.name,
              code: e.asset?.code ? e.asset.code : "",
            });
          });
        }
        ctx.setState({
          AssetList: assetFilter,
        });
      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    })
    .catch((err) => {
      // console.log("err ", err)
    });
};
