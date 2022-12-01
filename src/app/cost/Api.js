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
            graphValue: getGraphData(res.data.data.gas_fee_overtime)
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
      if(!res.data.error){
        ctx.setState({
          counterGraphLoading: false,
          counterPartyData: res.data.data.counter_party_volume_traded,
          counterPartyValue: getCounterGraphData(res.data.data.counter_party_volume_traded)
        });
      } else{
        toast.error(res.data.message || "Something Went Wrong")
      }

    });
}