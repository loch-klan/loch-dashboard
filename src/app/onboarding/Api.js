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
        data.append("chain", wallet.coinCode);
        data.append("wallet_address", wallet.address);
        preLoginInstance
            .post("wallet/chain/detect-chain", data)
            .then((res) => {
                if (!res.error && res.data && res.data.data.chain_detected) {
                    dispatch({
                        type: WALLET_LIST,
                        payload: {
                            id: wallet.id,
                            coinCode: wallet.coinCode,
                            coinSymbol: wallet.coinSymbol,
                            coinName: wallet.coinName,
                            address: wallet.address
                        }
                    });
                }
            })
            .catch((err) => {
                console.log("Catch", err);
            });
    };
};