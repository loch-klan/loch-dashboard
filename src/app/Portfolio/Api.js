import { toast } from "react-toastify";
import { postLoginInstance, preLoginInstance } from "../../utils";
import { COIN_RATE_LIST, USER_WALLET_LIST, DEFAULT_VALUES } from "./ActionTypes";

export const getCoinRate = () => {
    return async function (dispatch, getState) {
        let data = new URLSearchParams();
        postLoginInstance
            .post("wallet/chain/get-crypto-asset-rates", data)
            .then((res) => {
                let coinRateList = res.data && res.data.data && Object.keys(res.data.data.rates).length > 0 ? res.data.data.rates : []
                dispatch({
                    type: COIN_RATE_LIST,
                    payload: coinRateList
                });
            })
            .catch((err) => {
                console.log("Catch", err);
            });
    };
};

export const getUserWallet = (wallet) => {
    return function (dispatch, getState) {
        let data = new URLSearchParams();
        data.append("chain", wallet.coinCode);
        data.append("wallet_address", wallet.address);
        postLoginInstance
            .post("wallet/user-wallet/get-balance", data)
            .then((res) => {
                let userWalletList = res.data && res.data.data.user_wallet && res.data.data.user_wallet.assets && res.data.data.user_wallet.assets.length > 0 && res.data.data.user_wallet.active ? res.data.data.user_wallet : []
                dispatch({
                    type: USER_WALLET_LIST,
                    payload: {
                        address: wallet.address,
                        userWalletList: userWalletList
                    }
                });
            })
            .catch((err) => {
                console.log("Catch", err);
            });

        // && res.data.data.chain_detected
        // if (!res.error && res.data) {
        //     dispatch({
        //         type: USER_WALLET_LIST,
        //         payload: {
        //             id: wallet.id,
        //             coinCode: wallet.coinCode,
        //             coinSymbol: wallet.coinSymbol,
        //             coinName: wallet.coinName,
        //             address: wallet.address,
        //             chain_detected: res.data.data.chain_detected,
        //             isLast: wallet.isLast
        //         }
        //     });
        // }
    };
};

export const settingDefaultValues = (wallet) => {
    return function (dispatch, getState) {
        dispatch({
            type: DEFAULT_VALUES
        });
    };
};