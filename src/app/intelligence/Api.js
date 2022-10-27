import { postLoginInstance } from "../../utils";
import { toast } from "react-toastify";
export const searchTransactionApi = (ctx, data) => {
    return function (dispatch, getState) {
        postLoginInstance.post("wallet/transaction/search-transaction", data)
            .then((res) => {
                // console.log(res.data.data.results)
                if (!res.data.error) {

                    ctx.setState({
                        table : res.data.data.results
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
