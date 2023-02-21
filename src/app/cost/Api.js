import { toast } from "react-toastify";
import { postLoginInstance } from "../../utils";
import {getGraphData, getCounterGraphData} from "./getGraphData";

export const getAllFeeApi = (ctx, startDate, endDate) => {
   let data = new URLSearchParams();
    if (startDate) {
         data.append("start_datetime", startDate);
         data.append("end_datetime", endDate);
    }
    postLoginInstance.post("wallet/transaction/get-gas-fee-overtime", data)
    .then((res) => {
      if(!res.data.error){
        ctx.setState({
          barGraphLoading: false,
          GraphData: res.data.data,
          graphValue: getGraphData(res.data.data, ctx),
          gasFeesGraphLoading:false,
        });
      } else{
        toast.error(res.data.message || "Something Went Wrong")
      }

    });
}
export const getAllCounterFeeApi = (ctx, startDate, endDate) => {
  
   let data = new URLSearchParams();
    if (startDate) {
         data.append("start_datetime", startDate);
         data.append("end_datetime", endDate);
    }
    postLoginInstance.post("wallet/transaction/get-counter-party-volume-traded", data)
    .then((res) => {
      if (!res.data.error) {
        //  console.log("calling counter fees");
        let g_data = res.data.data.counter_party_volume_traded.sort((a, b) => {
          return b.total_volume - a.total_volume;
        });
        g_data = g_data.slice(0,3);
        // console.log("data", g_data)
        ctx.setState({
          counterGraphLoading: false,
          counterPartyData: res.data.data.counter_party_volume_traded,
          counterPartyValue:
            ctx.state.currentPage === "Home"
              ? getCounterGraphData(g_data,ctx)
              : getCounterGraphData(
                  res.data.data.counter_party_volume_traded,
                  ctx
                ),
        });
      } else{
        toast.error(res.data.message || "Something Went Wrong")
      }

    });
}

// add update account - connect exchange
export const addUpdateAccount = (data,ctx) => {

  postLoginInstance
    .post("organisation/user/add-update-user-account", data)
    .then((res) => {
      if (!res.data.error) {

         ctx.props.getExchangeBalance("Binance", ctx);
         ctx.props.getExchangeBalance("Coinbase", ctx);
        ctx.state.onHide();
        
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