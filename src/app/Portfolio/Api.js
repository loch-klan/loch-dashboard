import { postLoginInstance, preLoginInstance } from "../../utils";
import { COIN_RATE_LIST, USER_WALLET_LIST, DEFAULT_VALUES } from "./ActionTypes";
import { toast } from "react-toastify";

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

export const getUserWallet = (wallet,ctx) => {
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
                if(ctx){
                  ctx.setState({isLoading:false})
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

export const getDetailsByLinkApi = (link,ctx) => {
  const data = new URLSearchParams();
  data.append("token",link);
  preLoginInstance
          .post("organisation/user/get-portfolio-by-link", data)
          .then((res) => {
              if(!res.data.error){
                let addWallet = [];
                for (let i = 0; i < res.data.data.user.wallets.length; i++){
                  let obj = {}; // <----- new Object
                  obj['address'] = res.data.data.user.wallets[i];
                  obj['coins'] = res.data.data.wallets[res.data.data.user.wallets[i]].chains.map((item)=>{
                    return ({coinCode: item.code,
                    coinSymbol: item.symbol,
                    coinName: item.name,
                    chain_detected: item ? true : false})
                  });
                  obj['id'] = `wallet${i+1}`;
                  obj['coinFound'] = res.data.data.wallets[res.data.data.user.wallets[i]].chains ? true : false;
                  addWallet.push(obj);

              }
              ctx.setState({isLoading:false})
              } else{
                toast.error(res.data.message || "Something Went Wrong")
              }
          })
          .catch((err) => {
              console.log("Catch", err);
          });
};

export const getAssetGraphDataApi = (data, ctx) => {
  // postLoginInstance
  //   .post("wallet/user-wallet/get-all-asset-value-graph", data)
  postLoginInstance
    .post("wallet/user-wallet/get-asset-value-graph", data).then((res) => {
      console.log("all data", res);
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
      console.log("res", res);
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