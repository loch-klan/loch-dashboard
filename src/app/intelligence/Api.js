import { postLoginInstance } from "../../utils";
import { toast } from "react-toastify";
import { getAllTransactionHistory } from "./IntelligenceAction";
import { getProfitAndLossData } from "./getProfitAndLossData";
import { CurrencyType } from "../../utils/ReusableFunctions";
import { getProfitLossAsset } from "./stackGrapgh";

import {
  ALL_TRANSACTION_HISTORY_HOME,
  INSIGHT_DATA,
  NETFLOW_GRAPH,
  PORTFOLIO_ASSET,
  TRANSACTION_FILTER,
} from "./ActionTypes";
import {
  TOP_ALL_TRANSACTION_HISTORY_HOME,
  TOP_INSIGHT_DATA,
  TOP_NETFLOW_GRAPH,
  TOP_PORTFOLIO_ASSET,
  TOP_TRANSACTION_FILTER,
} from "../topAccount/ActionTypes";

export const getInflowsAndOutflowsGraphDataApi = (ctx, ActionType) => {
  // console.log("before",data, ctx, ActionType);
  return async function (dispatch, getState) {
    postLoginInstance
      .post("wallet/user-wallet/get-buy-sell")
      .then((res) => {
        if (!res.data.error) {
          ctx.setState({
            //  assetValueData: res.data.data.asset_value_data,
            graphLoading: false,
            inflowsOutflowsList: res.data.data.data,
          });
          // ctx.props.getExternalEventsApi(ctx);
          if (!res.data.data.data_loaded) {
            //   if (ActionType === "ASSET_VALUE_GRAPH_DAY") {
            //     ctx.setState({ assetValueDataLoaded: false });
            //   }
            //   setTimeout(() => {
            //     ctx.props.getAssetGraphDataApi(data, ctx, ActionType);
            //   }, 15000);
          } else {
            // ctx.setState({ assetValueDataLoaded: true });
            // let obj = JSON.parse(localStorage.getItem("assetValueLoader"));
            // if (obj) {
            //   localStorage.setItem(
            //     "assetValueLoader",
            //     JSON.stringify({
            //       me: !ctx?.state?.isTopAccountPage ? false : obj?.me,
            //       topaccount: ctx?.state?.isTopAccountPage
            //         ? false
            //         : obj?.topaccount,
            //     })
            //   );
            // }
          }
        } else {
          toast.error(res.data.message || "Something Went Wrong");
        }
      })
      .catch((err) => {
        console.log("Catch", err);
      });
  };
};
export const searchTransactionApi = (data, ctx, page = 0) => {
  return function (dispatch, getState) {
    postLoginInstance
      .post("wallet/transaction/search-transaction", data)
      .then((res) => {
        // console.log(page)
        if (!res.data.error) {
          if (ctx.state.currentPage === "Home") {
            dispatch({
              type: ctx?.state?.isTopAccountPage
                ? TOP_ALL_TRANSACTION_HISTORY_HOME
                : ALL_TRANSACTION_HISTORY_HOME,
              payload: res.data.data,
            });
          } else {
            dispatch(getAllTransactionHistory(res.data.data, page, ctx));
          }

          if (ctx) {
            ctx.setState({
              tableLoading: false,
            });
          }
        } else {
          toast.error(res.data.message || "Something Went Wrong");
        }
      })
      .catch((err) => {
        // console.log("Search transaction ", err)
      });
  };
};

export const getFilters = (ctx) => {
  return async function (dispatch, getState) {
    let data = new URLSearchParams();
    if (ctx?.state?.isTopAccountPage) {
      let addressObj = localStorage.getItem("previewAddress")
        ? [JSON.parse(localStorage.getItem("previewAddress"))]
        : [];
      let address = addressObj?.map((e) => e?.address);
      data.append("wallet_address", JSON.stringify(address));
    }
    postLoginInstance
      .post("wallet/transaction/get-transaction-filter", data)
      .then((res) => {
        let assetFilter = [{ value: "allAssets", label: "All assets" }];
        res.data.data.filters.asset_filters.map((item) => {
          let obj = {
            value: item._id,
            label: item.asset.name,
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
          type: ctx?.state?.isTopAccountPage
            ? TOP_TRANSACTION_FILTER
            : TRANSACTION_FILTER,
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

    if (ctx?.state?.isTopAccountPage) {
      let addressObj = localStorage.getItem("previewAddress")
        ? [JSON.parse(localStorage.getItem("previewAddress"))]
        : [];
      let address = addressObj?.map((e) => e?.address);
      // console.log("address", address);
      data.append("wallet_address", JSON.stringify(address));
    }
    postLoginInstance
      .post("wallet/transaction/get-profit-loss", data)
      .then((res) => {
        //   console.log("calling get profit and loss");
        if (!res.data.error) {
          dispatch({
            type: ctx?.state?.isTopAccountPage
              ? TOP_NETFLOW_GRAPH
              : NETFLOW_GRAPH,
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
    if (ctx?.state?.isTopAccountPage) {
      let addressObj = localStorage.getItem("previewAddress")
        ? [JSON.parse(localStorage.getItem("previewAddress"))]
        : [];
      let address = addressObj?.map((e) => e?.address);
      data.append("wallet_address", JSON.stringify(address));
    }
    postLoginInstance
      .post("wallet/user-wallet/get-wallet-insights", data)
      .then((res) => {
        if (!res.data.error) {
          // console.log("insights", res.data.data.insights);
          dispatch({
            type: ctx?.state?.isTopAccountPage
              ? TOP_INSIGHT_DATA
              : INSIGHT_DATA,
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
  selectedAsset = false
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

    if (ctx?.state?.isTopAccountPage) {
      let addressObj = localStorage.getItem("previewAddress")
        ? [JSON.parse(localStorage.getItem("previewAddress"))]
        : [];
      let address = addressObj?.map((e) => e?.address);
      data.append("wallet_address", JSON.stringify(address));
    }

    postLoginInstance
      .post("wallet/transaction/get-asset-profit-loss", data)
      .then((res) => {
        if (!res.data.error) {
          //  console.log("get profit loss", res.data.data);
          dispatch({
            type: ctx?.state?.isTopAccountPage
              ? TOP_PORTFOLIO_ASSET
              : PORTFOLIO_ASSET,
            payload: {
              ProfitLossAsset: getProfitLossAsset(res.data.data?.profit_loss),
            },
          });
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

export const getTransactionAsset = (data, ctx) => {
  postLoginInstance
    .post("wallet/transaction/get-transaction-asset-filter")
    .then((res) => {
      if (!res.data.error) {
        let assetFilter = [{ value: "allAssets", label: "All assets" }];
        res?.data?.data?.assets?.map((e) => {
          assetFilter.push({
            value: e._id,
            label: e.asset.name,
          });
        });
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
