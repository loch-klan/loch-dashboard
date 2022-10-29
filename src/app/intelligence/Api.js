import { postLoginInstance } from "../../utils";
import { toast } from "react-toastify";
import { API_LIMIT } from "../../utils/Constant";
export const searchTransactionApi = (ctx, data, page = 0) => {
    return function (dispatch, getState) {
        postLoginInstance.post("wallet/transaction/search-transaction", data)
            .then((res) => {
                console.log(page)
                if (!res.data.error) {
                    ctx.setState({
                        table : res.data.data.results,
                        totalPages: Math.ceil(res.data.data.total_count / API_LIMIT),
                        currentPage: page,
                    })
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

export const getFilters = () => {
    return function (dispatch, getState) {
        let data = new URLSearchParams()
        postLoginInstance.post("wallet/transaction/get-transaction-filter",data)
        .then((res) =>  {
            console.log(res)
        })
        .catch((err) => {
            console.log("getFilter ", err)
        })
    }
}
