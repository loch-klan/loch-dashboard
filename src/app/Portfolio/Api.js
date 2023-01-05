import { postLoginInstance, preLoginInstance } from "../../utils";
import { COIN_RATE_LIST, USER_WALLET_LIST, DEFAULT_VALUES } from "./ActionTypes";
import { toast } from "react-toastify";

export const getCoinRate = () => {
    return async function (dispatch, getState) {
        let data = new URLSearchParams();
        postLoginInstance
            .post("wallet/chain/get-crypto-asset-rates", data)
            .then((res) => {
              let coinRateList = res.data && res.data.data && Object.keys(res.data.data.rates).length > 0 ? res.data.data.rates : [];
              // console.log("cooin redux", coinRateList);
              // console.log("cooin redux", res.data.data);
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

export const getUserWallet = (wallet,ctx) => {
    return function (dispatch, getState) {
        let data = new URLSearchParams();
        data.append("chain", wallet.coinCode);
        data.append("wallet_address", wallet.address);
        postLoginInstance
            .post("wallet/user-wallet/get-balance", data)
            .then((res) => {
              let userWalletList = res.data && res.data.data.user_wallet && res.data.data.user_wallet.assets && res.data.data.user_wallet.assets.length > 0 && res.data.data.user_wallet.active ? res.data.data.user_wallet : []
              
              // console.log("asset", res.data?.data.asset_prices)
                dispatch({
                    type: USER_WALLET_LIST,
                    payload: {
                        address: wallet.address,
                        userWalletList: userWalletList,
                        assetPrice: res.data?.data.asset_prices,
                    }
                });
              // dispatch({
              //   type: COIN_RATE_LIST,
              //   payload: res.data?.data.asset_prices,
              // });
            
                if(ctx){
                  ctx.setState({
                    isLoading: false,
                    assetPrice: {...ctx.state.assetPrice, ...res.data?.data.asset_prices},
                  });
                }
            })
            .catch((err) => {
                console.log("Catch", err);
            });
    };
};

export const settingDefaultValues = (wallet) => {
    return function (dispatch, getState) {
        dispatch({
            type: DEFAULT_VALUES
        });
    };
};

export const getDetailsByLinkApi = (link,ctx=null) => {
  const data = new URLSearchParams();
  data.append("token",link);
  return async function (dispatch, getState) {
  preLoginInstance.post("organisation/user/get-portfolio-by-link", data)
          .then((res) => {
              if(!res.data.error){
                // console.log('getState',getState().OnboardingState.coinsList);
                // console.log('res',res);
                const allChains = getState().OnboardingState.coinsList;
                // console.log('allChains',allChains);
                let addWallet = [];
                const apiResponse = res.data.data;
                for (let i = 0; i < apiResponse.user.user_wallets.length; i++){
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
                  addWallet.push(obj);

              }
              // console.log('addWallet',addWallet);
              localStorage.setItem("addWallet",JSON.stringify(addWallet))
              ctx.setState({isLoading:false})
              ctx.handleResponse && ctx.handleResponse();
              } else{
                toast.error(res.data.message || "Something Went Wrong")
              }
          })
          .catch((err) => {
              console.log("Catch", err);
          });
        }
};

export const getAssetGraphDataApi = (data, ctx) => {
  // postLoginInstance
  //   .post("wallet/user-wallet/get-all-asset-value-graph", data)
  postLoginInstance
    .post("wallet/user-wallet/get-asset-value-graph", data).then((res) => {
      // console.log("all data", res);
      
      if (!res.data.error) {
        ctx.setState({
          assetValueData: res.data.data.asset_value_data,
          graphLoading: false,
        });
        getExternalEventsApi(ctx);
        
      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    })
    .catch((err) => {
      console.log("Catch", err);
    });
}

export const getExternalEventsApi = (ctx) => {
  postLoginInstance
    .post("common/master/get-all-events")
    .then((res) => {
      // console.log("res", res);
      if (!res.data.error) {
        ctx.setState({
          externalEvents: res.data.data.events,
        });
      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    })
    .catch((err) => {
      console.log("Catch", err);
    });
};

export const getYesterdaysBalanceApi = (ctx) =>{
  postLoginInstance.post("wallet/user-wallet/get-yesterday-portfolio-balance")
  .then((res)=>{
    if (!res.data.error) {
      let currency= JSON.parse(localStorage.getItem('currency'));
      ctx.setState({
        yesterdayBalance: res.data.data.balance * currency?.rate ,
      });
    } else {
      toast.error(res.data.message || "Something Went Wrong");
    }
  })
  .catch((err) => {
    console.log("Catch", err);
  });
}