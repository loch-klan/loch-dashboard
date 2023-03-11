import { toast } from "react-toastify";
import { postLoginInstance } from "../../utils";
import { COUNTER_PARTY_VOLUME, GAS_FEES } from "../intelligence/ActionTypes";
import {getGraphData, getCounterGraphData} from "./getGraphData";

export const getAllFeeApi = (ctx, startDate, endDate) => {

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
            dispatch({
              type: GAS_FEES,
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
  }
  
}
export const getAllCounterFeeApi = (ctx, startDate, endDate) => {
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
                return b.total_volume - a.total_volume;
              }
            );
            g_data = g_data.slice(0, 3);
            // console.log("data", g_data)
            dispatch({
              type: COUNTER_PARTY_VOLUME,
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
  }
 
  
}

// update counterpary value and data
export const updateCounterParty = (data, value) => {
  return function (dispatch, getState) {
    dispatch({
      type: COUNTER_PARTY_VOLUME,
      payload: {
        counterPartyData: data,
        counterPartyValue: value,
      },
    });
  };
}

// update counterpary value and data
export const updateFeeGraph = (data, value) => {
  return function (dispatch, getState) {
    dispatch({
      type: GAS_FEES,
      payload: {
        GraphfeeData: data,
        graphfeeValue: value,
      },
    });
  };
}

// add update account - connect exchange
export const addUpdateAccount = (data,ctx) => {

  postLoginInstance
    .post("organisation/user/add-update-user-account", data)
    .then((res) => {
      if (!res.data.error) {

        //  ctx.props.getExchangeBalance("binance", ctx);
        // ctx.props.getExchangeBalance("coinbase", ctx);
        toast.success(ctx.state.selection.name + " connected to loch");
        ctx.state.onHide();
        // window.location.reload();
        ctx.props?.handleUpdate && ctx.props.handleUpdate();
        
      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    });
};

// get user account - connect exchange
export const getUserAccount = (data,ctx) => {

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