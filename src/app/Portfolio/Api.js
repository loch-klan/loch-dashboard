import { postLoginInstance, preLoginInstance } from "../../utils";
import { COIN_RATE_LIST, USER_WALLET_LIST, DEFAULT_VALUES } from "./ActionTypes";
import { toast } from "react-toastify";
import { AssetType, DEFAULT_PRICE } from "../../utils/Constant";

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

export const getUserWallet = (wallet, ctx, isRefresh) => {
  
  return function (dispatch, getState) {
      
      let data = new URLSearchParams();
       data.append("chain", wallet.coinCode);
      data.append("wallet_address", wallet.address);
      
    if (!isRefresh) {
        
         data.append("update_balance", false);
    } else {
      //  console.log("On Refresh Api Called", wallet);
          data.append("update_balance", true);
      }
    
        postLoginInstance
            .post("wallet/user-wallet/get-balance", data)
            .then((res) => {
              let userWalletList = res.data && res.data.data.user_wallet && res.data.data.user_wallet.assets && res.data.data.user_wallet.assets.length > 0 && res.data.data.user_wallet.active ? res.data.data.user_wallet : []
              
              // console.log("asset", res.data?.data)
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
              // console.log("state", ctx.props.portfolioState.walletTotal, ctx);
              
            
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

export const getAllProtocol = (ctx) => {
  postLoginInstance
    .post("wallet/chain/get-all-protocols")
    .then((res) => {
      if (!res.data.error) {
        // console.log("all protocols", res.data.data.protocols);
        ctx.setState({
          allProtocols: res.data.data.protocols,
        });
        ctx.getYieldBalance();
      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    })
    .catch((err) => {
      console.log("Catch", err);
    });
}

export const getYieldBalanceApi = (ctx,data) => {
  postLoginInstance
    .post("wallet/user-wallet/get-yield-balance",data)
    .then((res) => {
      if (!res.data.error) {
        let currency = JSON.parse(localStorage.getItem("currency"));
        let allAssetType = [20, 40, 30, 50];
        let yieldData = ctx.state.yieldData || [];
        // console.log("yield balance", res.data.data);
        //   console.log("yield data", yieldData);
        res.data.data &&
          res.data.data.user_wallet &&
          res.data.data.user_wallet.assets &&
          res.data.data.user_wallet.assets.map((item) => {
            let name = AssetType.getText(item.asset.asset_type);
            let type =
              (item.asset.asset_type === 20 ||
              item.asset.asset_type === 40 ||
              item.asset.asset_type === 50) ? "Yield" : "Debt";
            let matchedCodeData = res.data.data.asset_prices[item.asset.id];
             let value =
               matchedCodeData && matchedCodeData
                 ? matchedCodeData.quote
                 : DEFAULT_PRICE;
             let currentPrice =
               item.count *
               (value && value.USD && value.USD.price
                 ? value.USD.price
                 : DEFAULT_PRICE) * currency?.rate;
            if (yieldData[item.asset.asset_type] === undefined) {
              yieldData[item.asset.asset_type] = {
                id: item.asset.asset_type,
                name: name ? name : "",
                totalPrice: currentPrice,
                type: type,
              };
            } else {
              yieldData[item.asset.asset_type].totalPrice =
                yieldData[item.asset.asset_type]?.totalPrice + currentPrice;
            }
            let YieldValues = [];
            let DebtValues = [];
     
          Object.keys(yieldData).map(
            (key) => {
              yieldData[key].type === "Yield"
                ? YieldValues.push(yieldData[key])
                : DebtValues.push(yieldData[key]);
            }
          );
            // console.log("yield", YieldValues, "Debt", DebtValues)
             let yeldTotal = 0;
             YieldValues &&
               YieldValues.map((e) => (yeldTotal += e.totalPrice));

             let debtTotal = 0;
             DebtValues &&
               DebtValues.map((e) => (debtTotal += e.totalPrice));
            allAssetType.map((e) => {
             
              let isfound = false;
              YieldValues && YieldValues.map((item) => {
     
                if (item.id === e) {
                  isfound = true;
                }
              });

              if (!isfound && e !== 30) {
            
                YieldValues.push({
                  id: e,
                  name: AssetType.getText(e),
                  totalPrice: 0,
                  type: "Yield",
                });
              }
            });
            if (DebtValues.length === 0) {
              DebtValues.push({
                id: 30,
                name: AssetType.getText(30),
                totalPrice: 0,
                type: "Debt",
              });;
            }
              // console.log("y value", YieldValues, "D value", DebtValues);
             ctx.setState({
               yieldData: { ...yieldData },
               YieldValues,
               DebtValues,
               yeldTotal,
               debtTotal,
             });
          });
        // ctx.setState({
        //   allProtocols: res.data.data.protocols,
        // });
      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    })
    .catch((err) => {
      console.log("Catch", err);
    });
};