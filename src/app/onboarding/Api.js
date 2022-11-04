import { toast } from "react-toastify";
import { postLoginInstance, preLoginInstance } from "../../utils";
import { COINS_LIST, WALLET_LIST,UPDATE_LIST } from "./ActionTypes";
import addWallet from "./addWallet";
import { dispatch } from 'react-redux';
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
                        }
                    });
                    if(ctx){
                        ctx.handleSetCoin({...wallet,chain_detected:res.data.data.chain_detected})
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
          toast.error(
            <div className="custom-toast-msg">
              <div>
              {res.data.message}
              </div>
              <div className="inter-display-medium f-s-13 lh-16 grey-737 m-t-04">
              Please enter a valid user
              </div>
            </div>
            );
            // toast.error(res.data.message || "Something went Wrong")
        }
        else if(res.data.error === false){
            ctx.setState({
                isVerificationRequired:true,
                text:""
            })
            ctx.props.handleStateChange("verifyCode")
        }
    })
    .catch(err =>{
        console.log("error while signing",err)
    })
}

export const verifyUser = (ctx,info)=>{
    preLoginInstance.post('organisation/user/verify-otp',info)
    .then(res=>{
        // console.log(res.data.data.user)
        if(!res.data.error){
            localStorage.setItem("lochUser",JSON.stringify(res.data.data.user));
            localStorage.setItem('lochToken', res.data.data.token);
            const allChains = ctx.props.OnboardingState.coinsList
            let addWallet = [];
            const apiResponse = res.data.data;
            for (let i = 0; i < apiResponse.user.wallets.length; i++){
              let obj = {}; // <----- new Object
              obj['address'] = apiResponse.user.wallets[i];
              const chainsDetected = apiResponse.wallets[apiResponse.user.wallets[i]].chains;
              obj['coins'] = allChains.map((chain)=>{
                let coinDetected = false;
                chainsDetected.map((item)=>{
                  if(item.id === chain.id){
                    coinDetected = true;
                  }
                })
                return ({coinCode: chain.code,
                    coinSymbol: chain.symbol,
                    coinName: chain.name,
                    chain_detected: coinDetected})
              })
              obj['id'] = `wallet${i+1}`;
              obj['coinFound'] = apiResponse.wallets[apiResponse.user.wallets[i]].chains.length > 0 ? true : false;
              addWallet.push(obj);
          }
            // console.log('addWallet',addWallet);
            ctx.props.history.push({
              pathname: "/portfolio",
              state: {addWallet}
            })
        }
        else{
          toast.error(
            <div className="custom-toast-msg">
              <div>
              {res.data.message}
              </div>
              <div className="inter-display-medium f-s-13 lh-16 grey-737 m-t-04">
              Please enter a valid otp
              </div>
            </div>
            );
            // toast.error(res.data.message || "Something Went Wrong")
        }
    })
    .catch(err =>{
        console.log("error while verifying",err)
    })
}

export const createAnonymousUserApi = (data, ctx, addWallet) =>{
  postLoginInstance.post('organisation/user/create-user',data)
  .then(res=>{
    if(!res.data.error){
      localStorage.setItem("lochDummyUser", res.data.data.user.link)
      localStorage.setItem("lochToken", res.data.data.token)
      // console.log('addWallet',addWallet);
      ctx.props.history.push({
        pathname: '/portfolio',
        state: {addWallet}
      })
  }else{
      toast.error(res.data.message || "Something Went Wrong")
  }
  })
}

