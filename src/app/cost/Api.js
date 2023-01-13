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
          GraphData: res.data.data.gas_fee_overtime,
          graphValue: getGraphData(res.data.data.gas_fee_overtime, ctx),
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