import { toast } from "react-toastify";
import { postLoginInstance, preLoginInstance } from "../../utils";
import { COINS_LIST, WALLET_LIST,UPDATE_LIST } from "./ActionTypes";
import addWallet from "./addWallet";
import { dispatch } from 'react-redux';
import {
  WalletAddressTextbox,
  EmailAddressVerified,
  UserSignedinCorrectly,
  UserWrongCode,
} from "../../utils/AnalyticsFunctions.js";
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
                    if (res.data.data.chain_detected) {
                         WalletAddressTextbox({
                        //    session_id: "none",
                           address: wallet.address,
                           chains_detected: wallet.coinName,
                         });
                    }

                    dispatch({
                        type: WALLET_LIST,
                        payload: {
                            id: wallet.id,
                            coinCode: wallet.coinCode,
                            coinSymbol: wallet.coinSymbol,
                            coinName: wallet.coinName,
                            address: wallet.address,
                            chain_detected: res.data.data.chain_detected,
                            coinColor: wallet.coinColor
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

export const signIn = (ctx, data) => {

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
              Please enter a valid email
              </div>
            </div>
            );
            // toast.error(res.data.message || "Something went Wrong")

        }
        else if (res.data.error === false) {
            //email Valid
EmailAddressVerified({ email_address: ctx.state.email });
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

export const verifyUser = (ctx, info) => {

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
              obj['address'] = apiResponse.user.wallets[i].address;
              obj['displayAddress'] = apiResponse.user.wallets[i]?.display_address;
              const chainsDetected = apiResponse.wallets[apiResponse.user.user_wallets[i].address].chains;
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
                    chain_detected: coinDetected,
                  coinColor: chain.color})
              });
              obj['wallet_metadata']= apiResponse.user.user_wallets[i].wallet;
              obj['id'] = `wallet${i+1}`;
              obj['coinFound'] = apiResponse.wallets[apiResponse.user.user_wallets[i].address].chains.length > 0 ? true : false;
              addWallet.push(obj);
          }
            // console.log('addWallet',addWallet);
            ctx.props.history.push({
              pathname: "/portfolio",
              state: {addWallet}
            })
            UserSignedinCorrectly({
              email_address: res.data.data.user.email,
              session_id: res.data.data.user.id,
            });


        }
        else {

           UserWrongCode({ email_address: ctx.state.email });
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
      const allChains = ctx.props.OnboardingState.coinsList
      let newAddWallet = [];
      const apiResponse = res.data.data;
      // console.log('apiResponse',apiResponse);
      // console.log('allChains',allChains);
      for (let i = 0; i < apiResponse.user.wallets.length; i++){
        let obj = {}; // <----- new Object
        obj['address'] = apiResponse.user.user_wallets[i].address;
              obj['displayAddress'] = apiResponse.user.user_wallets[i]?.display_address;
              const chainsDetected = apiResponse.wallets[apiResponse.user.user_wallets[i].address].chains;
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
                    chain_detected: coinDetected,
                  coinColor: chain.color})
              });
              obj['wallet_metadata']= apiResponse.user.user_wallets[i].wallet;
              obj['id'] = `wallet${i+1}`;
              obj['coinFound'] = apiResponse.wallets[apiResponse.user.user_wallets[i].address].chains.length > 0 ? true : false;
              newAddWallet.push(obj);
      }
      // console.log('newAddWallet',newAddWallet);
      ctx.props.history.push({
        pathname: '/portfolio',
        state: {addWallet: newAddWallet}
      })
  }else{
      toast.error(res.data.message || "Something Went Wrong")
  }
  })
}

