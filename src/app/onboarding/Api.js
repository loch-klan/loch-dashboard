import { toast } from "react-toastify";
import { postLoginInstance, preLoginInstance } from "../../utils";
import { COINS_LIST, WALLET_LIST } from "./ActionTypes";
export const getAllCoins = () => {
    return async function (dispatch, getState) {
        let data = new URLSearchParams();
        postLoginInstance
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

export const detectCoin = (wallet,ctx=null) => {
    return function (dispatch, getState) {
        let data = new URLSearchParams();
        data.append("chain", wallet.coinCode);
        data.append("wallet_address", wallet.address);
        postLoginInstance
            .post("wallet/chain/detect-chain", data)
            .then((res) => {
                // && res.data.data.chain_detected
                if (!res.error && res.data) {
                    dispatch({
                        type: WALLET_LIST,
                        payload: {
                            id: wallet.id,
                            coinCode: wallet.coinCode,
                            coinSymbol: wallet.coinSymbol,
                            coinName: wallet.coinName,
                            address: wallet.address,
                            chain_detected: res.data.data.chain_detected,
                            isLast: wallet.isLast
                        }
                    });
                    if(ctx && res.data.data.chain_detected){
                        ctx.handleSetCoin(wallet)
                    }
                }
            })
            .catch((err) => {
                console.log("Catch", err);
            });
    };
};

export const signIn = (ctx,data)=>{
    preLoginInstance.post('organisation/user/send-otp',data)
    .then(res =>{
        if(res.data.error)
        {
            toast.error(res.data.message || "Something went Wrong")
        }
        else if(res.data.error === false){
            ctx.setState({
                isVerificationRequired:true
            })
        }
    })
    .catch(err =>{
        console.log("error while signing",err)
    })
}

export const verifyUser = (ctx,info)=>{
    preLoginInstance.post('organisation/user/verify-otp',info)
    .then(res=>{
        console.log(res.data.data.user)
        if(!res.data.error){
            localStorage.setItem("userDetail",JSON.stringify(res.data.data.user));
            ctx.props.history.push("/portfolio")
        }
        else{
            toast.error(res.data.message || "Something Went Wrong")
        }
    })
    .catch(err =>{
        console.log("error while verifying",err)
    })
}