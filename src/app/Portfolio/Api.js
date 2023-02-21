import { postLoginInstance, preLoginInstance } from "../../utils";
import { COIN_RATE_LIST, USER_WALLET_LIST, DEFAULT_VALUES } from "./ActionTypes";
import { toast } from "react-toastify";
import { AssetType, DEFAULT_PRICE } from "../../utils/Constant";
import moment from "moment";
import { getAllCounterFeeApi } from "../cost/Api";
import { getProfitAndLossApi } from "../intelligence/Api";
import { GetAllPlan, getUser } from "../common/Api";

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
              
              // console.log(
              //   "asset",
              //   moment(res.data?.data.user_wallet?.modified_on).valueOf()
              // );
              // if (isRefresh) {
                
                localStorage.setItem(
                  "refreshApiTime",
                  moment(res.data?.data.user_wallet?.modified_on).valueOf()
                );

                isRefresh && ctx.getCurrentTime();

              // }

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

export const getExchangeBalance = (exchangeName, ctx) => {
  return function (dispatch, getState) {
   console.log(exchangeName);
   let data = new URLSearchParams();
   data.append("exchange", exchangeName);

   postLoginInstance
     .post("wallet/user-wallet/get-exchange-balance", data)
     .then((res) => {
       let userWalletList =
         res.data &&
         res.data.data.user_wallet &&
         res.data.data.user_wallet.assets &&
         res.data.data.user_wallet.assets.length > 0 &&
         res.data.data.user_wallet.active
           ? res.data.data.user_wallet
           : [];
       // localStorage.setItem(
       //   "refreshApiTime",
       //   moment(res.data?.data.user_wallet?.modified_on).valueOf()
       // );
       // isRefresh && ctx.getCurrentTime();
       dispatch({
         type: USER_WALLET_LIST,
         payload: {
           address: exchangeName,
           userWalletList: userWalletList,
           assetPrice: res.data?.data.asset_prices,
         },
       });
       if (ctx) {
         ctx.setState({
           isLoading: false,
           assetPrice: {
             ...ctx.state.assetPrice,
             ...res.data?.data.asset_prices,
           },
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
  data.append("token", link);
  
  return async function (dispatch, getState) {
  preLoginInstance.post("organisation/user/get-portfolio-by-link", data)
          .then((res) => {
              if(!res.data.error){
                // console.log('getState',getState().OnboardingState.coinsList);
                // console.log('res',res);
                const allChains = res.data.data.chains;
                //   .map((chain) => {
                //   return {
                //     chain_detected: false,
                //   coinCode: chain.code,
                //   coinColor:chain.color,
                //   coinName:chain.name,
                //     coinSymbol: chain.symbol,
                //   }
                // })
                  // getState().OnboardingState.coinsList;
             

                
                
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
                  obj["nickname"] = apiResponse.user.user_wallets[i]?.nickname;
                  obj["showAddress"] =
                    apiResponse.user.user_wallets[i]?.nickname === ""
                      ? true
                      : false;
                  obj["showNickname"] =
                    apiResponse.user.user_wallets[i]?.nickname !== ""
                      ? true
                      : false;

              }
              // console.log('addWallet',addWallet);
                localStorage.setItem("addWallet", JSON.stringify(addWallet))
                // sessionStorage.setItem("addWallet", JSON.stringify(addWallet));
                ctx.setState({
                  isLoading: false,
                  userWalletList:addWallet
                })
                
                // ctx.handleResponse && ctx.handleResponse();
                // console.log("add",addWallet.length)
                let userPlan = JSON.parse(localStorage.getItem("currentPlan")) || "Free"; 
                if (addWallet.length > userPlan.wallet_address_limit) {
                  ctx.setState({
                    isStatic: true,
                  }, () => {
                      ctx.upgradeModal && ctx.upgradeModal();
                  })
                  
                }
               

                if (ctx.handleResponse) {
                  ctx.handleResponse();
                } else {

                 
                  ctx.props.getCoinRate();
                  ctx.getTableData();
                  ctx.getGraphData();
                  getAllCounterFeeApi(ctx, false, false);
                  getProfitAndLossApi(ctx, false, false, false);
                         GetAllPlan();
                          getUser(ctx);
                }
                
                
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

export const getProtocolBalanceApi = (ctx,data) => {
  postLoginInstance
    .post("wallet/user-wallet/get-protocol-balance", data)
    .then((res) => {
      if (!res.data.error) {
        let currency = JSON.parse(localStorage.getItem("currency"));

        let cardList = ctx.state.cardList || [];
        let totalYield = ctx.state.totalYield || 0;
        let totalDebt = ctx.state.totalDebt || 0;
        let BalanceSheetValue = ctx.state.BalanceSheetValue || {};

        let userWallets = res.data.data.user_wallet;

        userWallets?.map((item) => {
          let totalUsd = 0;
          let yeild_total = 0;
          let debt_total = 0;

          let tableRow = [];
          if (item.assets?.length !== 0) {
            item?.assets.map((asset) => {
              let assetSymbol = [];
              let userAssetSymbol = [];
              let balance = [];
              asset?.tokens?.map((token) => {
                balance.push({
                  value: token.value,
                  code: token.code,
                });
                if (!userAssetSymbol.includes(token.code)) {
                  assetSymbol.push({
                    symbol: token.symbol,
                    code: token.code,
                  });
                  userAssetSymbol.push(token.code);
                }
              });
              let typename = AssetType.getText(asset.product_type);
              let type = asset.product_type;
              let usdValue = asset.balance_usd;
              let type_text = "";

              if (type !== 30) {
                yeild_total = yeild_total + usdValue;
                type_text = "Yield";
              } else {
                debt_total = debt_total + usdValue;
                 type_text = "Debt";
              }

              if (BalanceSheetValue[type] === undefined) {
                BalanceSheetValue[type] = {
                  name: typename,
                  totalPrice: usdValue,
                  id: type,
                   type_text: type_text
                };
              } else {
                BalanceSheetValue[type].totalPrice =
                  BalanceSheetValue[type]?.totalPrice + usdValue;
              }

              tableRow.push({
                assets: assetSymbol,
                type_name: typename,
                type: type,
                usdValue: usdValue,
                balance: balance,
              });
            });

            
            // card total
            totalUsd = yeild_total - debt_total;

            // balance sheet totals
            totalYield = totalYield + yeild_total;
            totalDebt = totalDebt + debt_total;
            cardList.push({
              name: item.name,
              address: item.address,
              symbol: item.symbol,
              totalUsd: totalUsd,
              row: tableRow,
            });
          }
        });

        let YieldValues = [];
            let DebtValues = [];

            Object.keys(BalanceSheetValue).map((key) => {
              BalanceSheetValue[key].type_text === "Yield"
                ? YieldValues.push(BalanceSheetValue[key])
                : DebtValues.push(BalanceSheetValue[key]);
            });
        // console.log(BalanceSheetValue);
        // console.log(YieldValues);
        // console.log(DebtValues);
      let  allAssetType = [20,30,40,50,60,70];
         allAssetType.map((e) => {
              let isfound = false;
              YieldValues &&
                YieldValues.map((item) => {
                  if (item.id === e) {
                    isfound = true;
                  }
                });

              if (!isfound && e !== 30) {
                YieldValues.push({
                  id: e,
                  name: AssetType.getText(e),
                  totalPrice: 0,
                });
              }
            });
            if (DebtValues.length === 0) {
              DebtValues.push({
                id: 30,
                name: AssetType.getText(30),
                totalPrice: 0,
              });
            }
        let sorted = cardList?.length === 0 ? "" : cardList.sort((a, b) => b.totalUsd - a.totalUsd);
        YieldValues = YieldValues.sort((a, b) => b.totalPrice - a.totalPrice);
        DebtValues = DebtValues.sort((a, b) => b.totalPrice - a.totalPrice);

       

        setTimeout(() => {
          ctx.setState({
            totalYield,
            totalDebt,
            cardList,
            sortedList: sorted,
            DebtValues,
            YieldValues,
            BalanceSheetValue,
          });
        },100)

      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    })
    .catch((err) => {
      console.log("Catch", err);
    });
};