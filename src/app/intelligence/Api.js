import { postLoginInstance } from "../../utils";
import { toast } from "react-toastify";
import { getAllTransactionHistory } from "./IntelligenceAction";

export const searchTransactionApi = (data , ctx, page = 0) => {
    return function (dispatch, getState) {
        postLoginInstance.post("wallet/transaction/search-transaction", data)
            .then((res) => {
                console.log(page)
                if (!res.data.error) {
                    dispatch(getAllTransactionHistory(res.data.data, page))
                    setTimeout(()=>{
                        {ctx.setState({
                        isLoading:false,
                      })}}
                      ,1000)
                }
                else {
                    toast.error(res.data.message || "Something Went Wrong")
                }
            })
            .catch((err) => {
                console.log("Search transaction ", err)
            })
    }
}

export const getFilters = (ctx) => {
        let data = new URLSearchParams()
        postLoginInstance.post("wallet/transaction/get-transaction-filter",data)
        .then((res) =>  {
            ctx.setState({
              assetFilter: res.data.data.filters.asset_filters.map((item) => ({
                value: item._id,
                label: item.asset.name,
              })),
              yearFilter: res.data.data.filters.year_filter.map((item) => ({
                value: item,
                label: item,
              }))
            })
        })
        .catch((err) => {
            console.log("getFilter ", err)
        })
}
