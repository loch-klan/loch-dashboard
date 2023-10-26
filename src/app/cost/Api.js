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
import {
  TOP_AVERAGE_COST_BASIS,
  TOP_AVERAGE_COST_RESET,
  TOP_AVERAGE_COST_SORT,
  TOP_COUNTER_PARTY_VOLUME,
  TOP_GAS_FEES,
} from "../topAccount/ActionTypes";

export const getAllFeeApi = (ctx, startDate, endDate) => {
  return async function (dispatch, getState) {
    let data = new URLSearchParams();
    if (startDate) {
      data.append("start_datetime", startDate);
      data.append("end_datetime", endDate);
    }

    if (ctx?.state?.isTopAccountPage) {
      let addressObj = window.sessionStorage.getItem("previewAddress")
        ? [JSON.parse(window.sessionStorage.getItem("previewAddress"))]
        : [];
      let address = addressObj?.map((e) => e?.address);
      data.append("wallet_address", JSON.stringify(address));
    }
    postLoginInstance
      .post("wallet/transaction/get-gas-fee-overtime", data)
      .then((res) => {
        if (!res.data.error) {
          dispatch({
            type: ctx?.state?.isTopAccountPage ? TOP_GAS_FEES : GAS_FEES,
            payload: {
              GraphfeeData: res.data.data,
              graphfeeValue: getGraphData(res.data.data, ctx),
            },
          });
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
export const getAllCounterFeeApi = (ctx, startDate, endDate) => {
  return async function (dispatch, getState) {
    let data = new URLSearchParams();
    if (startDate) {
      data.append("start_datetime", startDate);
      data.append("end_datetime", endDate);
    }
    if (ctx?.state?.isTopAccountPage) {
      let addressObj = window.sessionStorage.getItem("previewAddress")
        ? [JSON.parse(window.sessionStorage.getItem("previewAddress"))]
        : [];
      let address = addressObj?.map((e) => e?.address);
      data.append("wallet_address", JSON.stringify(address));
    }
    postLoginInstance
      .post("wallet/transaction/get-counter-party-volume-traded", data)
      .then((res) => {
        if (!res.data.error) {
          //  console.log("calling counter fees");
          let g_data = res.data.data.counter_party_volume_traded.sort(
            (a, b) => {
              return b.total_volume - a.total_volume;
            }
          );
          g_data = g_data.slice(0, 3);
          // console.log("data", g_data)
          dispatch({
            type: ctx?.state?.isTopAccountPage
              ? TOP_COUNTER_PARTY_VOLUME
              : COUNTER_PARTY_VOLUME,
            payload: {
              counterPartyData: res.data.data.counter_party_volume_traded,
              counterPartyValue:
                ctx.state.currentPage === "Home"
                  ? getCounterGraphData(g_data, ctx)
                  : getCounterGraphData(
                      res.data.data.counter_party_volume_traded,
                      ctx
                    ),
            },
          });
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
        }
      });
  };
};

// update counterpary value and data
export const updateCounterParty = (data, value, ctx) => {
  return function (dispatch, getState) {
    dispatch({
      type: ctx?.state?.isTopAccountPage
        ? TOP_COUNTER_PARTY_VOLUME
        : COUNTER_PARTY_VOLUME,
      payload: {
        counterPartyData: data,
        counterPartyValue: value,
      },
    });
  };
};

// update counterpary value and data
export const updateFeeGraph = (data, value, ctx) => {
  return function (dispatch, getState) {
    dispatch({
      type: ctx?.state?.isTopAccountPage ? TOP_GAS_FEES : GAS_FEES,
      payload: {
        GraphfeeData: data,
        graphfeeValue: value,
      },
    });
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
    if (ctx?.state?.isTopAccountPage) {
      let addressObj = window.sessionStorage.getItem("previewAddress")
        ? [JSON.parse(window.sessionStorage.getItem("previewAddress"))]
        : [];
      let address = addressObj?.map((e) => e?.address);
      data.append("wallet_address", JSON.stringify(address));
    }
    postLoginInstance
      .post("wallet/user-wallet/get-average-cost-basis", data)
      .then((res) => {
        if (!res.data.error) {
          let ApiResponse = res?.data.data?.assets;
          let currency = JSON.parse(window.sessionStorage.getItem("currency"));
          // let ApiResponse = [
          //   {
          //     asset: {
          //       asset_type: 10,
          //       code: "MKR",
          //       color: "#1aab9b",
          //       decimals: 18,
          //       exchange_account_id: "0e1b1e62-5bf2-5448-8b03-724f05dec9bc",
          //       id: "632cc3507113e1f4bb330970",
          //       name: "Maker",
          //       symbol:
          //         "https://assets.coingecko.com/coins/images/1364/large/Mark_Maker.png?1585191826",
          //       token_address: "",
          //     },
          //     average_price: 671.16,
          //     count: 9.06e-6,
          //     current_price: 671.16,
          //   },
          //   {
          //     asset: {
          //       asset_type: 10,
          //       code: "USDC",
          //       color: "#2775ca",
          //       decimals: 6,
          //       exchange_account_id: "c32b4bea-88d6-5468-9cee-636e43b58a02",
          //       id: "632cc3507113e1f4bb33096b",
          //       name: "USD Coin",
          //       symbol:
          //         "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389",
          //       token_address: "",
          //     },
          //     average_price: 1.004,
          //     count: 0.066067,
          //     current_price: 1.004,
          //   },
          //   {
          //     asset: {
          //       asset_type: 10,
          //       code: "MATIC",
          //       color: "#8247e5",
          //       decimals: 18,
          //       exchange_account_id: "fffc45ed-e0ec-5f77-b981-77b16906e1c9",
          //       id: "632cc34f7113e1f4bb33038f",
          //       name: "Polygon",
          //       symbol:
          //         "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png?1624446912",
          //       token_address: "",
          //     },
          //     average_price: 1.12,
          //     count: 136.695878787893109,
          //     current_price: 1.12,
          //   },
          //   {
          //     asset: {
          //       asset_type: 10,
          //       code: "AVAX",
          //       color: "#e84142",
          //       decimals: 18,
          //       exchange_account_id: "5ee02f4f-9443-5e1a-b2c0-c5bad08b76db",
          //       id: "632cc34f7113e1f4bb330582",
          //       name: "Avalanche",
          //       symbol:
          //         "https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png?1670992574",
          //       token_address: "",
          //     },
          //     average_price: 16.8666666,
          //     count: 0.007777770845,
          //     current_price: 166.5888566668,
          //   },
          //   {
          //     asset: {
          //       asset_type: 10,
          //       code: "SOL",
          //       color: "#00FFA3",
          //       decimals: 0,
          //       exchange_account_id: "a3a92dce-816f-5109-8eee-d1a4b03340a9",
          //       id: "632cc34e7113e1f4bb32ffa6",
          //       name: "Solana",
          //       symbol:
          //         "https://assets.coingecko.com/coins/images/4128/large/solana.png?1640133422",
          //       token_address: "",
          //     },
          //     average_price: 22.56666665,
          //     count: 289.066660900083327136,
          //     current_price: 554.5656655,
          //   },
          //   {
          //     asset: {
          //       asset_type: 10,
          //       code: "ETH",
          //       color: "#62688f",
          //       decimals: 18,
          //       exchange_account_id: "ede55050-46ff-5310-87d1-6587600a9862",
          //       id: "632cc34e7113e1f4bb32fdb2",
          //       name: "Ethereum",
          //       symbol:
          //         "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
          //       token_address: "",
          //     },
          //     average_price: 1754.14,
          //     count: 0.0013709090909090909097676767182,
          //     current_price: 1754.1667777774,
          //   },
          //   {
          //     asset: {
          //       asset_type: 10,
          //       code: "BTC",
          //       color: "#f7931a",
          //       decimals: 0,
          //       exchange_account_id: "06b5114e-b540-5220-a098-c792440fbfc6",
          //       id: "632cc3507113e1f4bb33096a",
          //       name: "Bitcoin",
          //       symbol:
          //         "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579",
          //       token_address: "",
          //     },
          //     average_price: 0,
          //     count: 0.0909090909099090909090909099,
          //     current_price: 279.565666,
          //   },
          // ];

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
              GainLoss:
                costBasis == 0
                  ? 0
                  : ((current_price - costBasis) / costBasis) * 100,
            });
          });

          let totalPercentage =
            totalCostBasis === 0
              ? 0
              : (
                  ((totalCurrentValue - totalCostBasis) / totalCostBasis) *
                  100
                ).toFixed(2);

          // console.log("Asset",AssetsList)
          dispatch({
            type: ctx?.state?.isTopAccountPage
              ? TOP_AVERAGE_COST_BASIS
              : AVERAGE_COST_BASIS,
            payload: {
              Average_cost_basis: AssetsList,
              totalPercentage: totalPercentage,
            },
          });

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
          toast.error(res.data.message || "Something Went Wrong");
        }
      });
  };
};

// sort average cost basis

export const updateAverageCostBasis = (data, ctx) => {
  return async function (dispatch, getState) {
    dispatch({
      type: ctx?.state?.isTopAccountPage
        ? TOP_AVERAGE_COST_SORT
        : AVERAGE_COST_SORT,
      payload: data,
    });
  };
};

// reset average cost basis

export const ResetAverageCostBasis = (ctx) => {
  return async function (dispatch, getState) {
    dispatch({
      type: ctx?.state?.isTopAccountPage
        ? TOP_AVERAGE_COST_RESET
        : AVERAGE_COST_RESET,
    });
  };
};
