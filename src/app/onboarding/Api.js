import { toast } from "react-toastify";
import { preLoginInstance } from "../../utils";
import { COINS_LIST, WALLET_LIST } from "./ActionTypes";
export const getAllCoins = () => {
    return async function (dispatch, getState) {
        let data = new URLSearchParams();
        preLoginInstance
            .post("wallet/chain/get-chains", data)
            .then((res) => {
                let coinsList = res.data && res.data.data && res.data.data.chains.length > 0 ? res.data.data.chains : []
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

export const detectCoin = (wallet) => {
    return function (dispatch, getState) {
        let data = new URLSearchParams();
        data.append("chain", wallet.coin);
        data.append("wallet_address", wallet.address);
        // console.log(data)
        preLoginInstance
            .post("wallet/chain/detect-chain", data)
            .then((res) => {
                console.log(res)
                // dispatch({
                //     type: WALLET_LIST,
                //     payload: coinsList
                // });
            })
            .catch((err) => {
                console.log("Catch", err);
            });
    };
};