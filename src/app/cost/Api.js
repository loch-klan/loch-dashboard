import { postLoginInstance } from "../../utils";
import getGraphData from "./getGraphData";

export const getAllFee = (ctx, startDate, endDate) => {
   let data = new URLSearchParams();
    if (startDate) {
         data.append("start_datetime", startDate);
         data.append("end_datetime", endDate);
    }
    postLoginInstance.post("wallet/transaction/get-gas-fee-overtime", data).then((res) => {
        console.log(res, "get All fees");
         console.log(res, "get All fees");

           
        ctx.setState({
            GraphData: res.data.data.gas_fee_overtime,
            graphValue: getGraphData(res.data.data.gas_fee_overtime)
        });

        
      
    });

   
    
    
}