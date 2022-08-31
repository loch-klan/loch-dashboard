import { toast } from "react-toastify";
import { preLoginInstance } from "../../utils";
import { COINS_LIST } from "./ActionTypes";
export const getAllCoins = () => {
    return async function (dispatch, getState) {
        let data = new URLSearchParams();
        preLoginInstance
            .post("wallet/chain/get-chains", data)
            .then((res) => {
                let coinsList = res.data && res.data.data && res.data.data.chains.length > 0 ? res.data.data.chains : []
                // ctx.setState({
                //     coinsList: coinsList,
                // });
                dispatch({
                    type: COINS_LIST,
                    payload: coinsList
                });
            })
            .catch((err) => {
                console.log("Catch", err);
            });
    };
};

export const detectCoin = (data, cb) => {
    // return function (dispatch, getState) {
    preLoginInstance
        .post("/common/master/add-update-location", data)
        .then((res) => {
            // console.log("res", res);
            if (!res.data.error) {
                cb();
                toast.success(res.data.message || "Something went wrong");
            } else {
                toast.error(res.data.message || "Something went wrong");
            }
        })
        .catch((err) => {
            console.log("Catch", err);
        });
    // };
};