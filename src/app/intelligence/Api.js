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
                    if(ctx){
                        ctx.setState({
                            isLoading:false,
                        })
                    }
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
    postLoginInstance.post("wallet/transaction/get-transaction-filter", data)
        .then((res) => {
            let assetFilter = [{value : "allAssets" , label : "All assets"}]
            res.data.data.filters.asset_filters.map((item) => {
                let obj = {
                    value: item._id,
                    label: item.asset.name,
                }
                assetFilter.push(obj)
            })
            let yearFilter = [{value:'allYear',label:'All Year'}]
            res.data.data.filters.year_filter.map((item)=>{
                // console.log(item)
                let obj  = {
                    value: item,
                    label: item,
                }
                yearFilter.push(obj)
            })
            if (ctx){
                ctx.setState({
                    assetFilter: assetFilter,
                    yearFilter: yearFilter
                })
            }
        })
        .catch((err) => {
            console.log("getFilter ", err)
        })
}
