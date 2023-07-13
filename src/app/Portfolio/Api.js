import { postLoginInstance, preLoginInstance } from "../../utils";
import {
  COIN_RATE_LIST,
  USER_WALLET_LIST,
  DEFAULT_VALUES,
  YESTERDAY_BALANCE,
  ASSET_VALUE_GRAPH,
  EXTERNAL_EVENTS,
} from "./ActionTypes";
import { toast } from "react-toastify";
import { AssetType, DEFAULT_PRICE } from "../../utils/Constant";
import moment from "moment";
import { getAllCounterFeeApi } from "../cost/Api";
import { getAllInsightsApi, getProfitAndLossApi } from "../intelligence/Api";
import { GetAllPlan, getUser } from "../common/Api";
import { GET_DEFI_DATA } from "../defi/ActionTypes";
import {
  TOP_DEFAULT_VALUES,
  TOP_EXTERNAL_EVENTS,
  TOP_GET_DEFI_DATA,
  TOP_USER_WALLET_LIST,
  TOP_YESTERDAY_BALANCE,
} from "../topAccount/ActionTypes";

export const getCoinRate = () => {
  return async function (dispatch, getState) {
    let data = new URLSearchParams();
    postLoginInstance
      .post("wallet/chain/get-crypto-asset-rates", data)
      .then((res) => {
        let coinRateList =
          res.data &&
          res.data.data &&
          Object.keys(res.data.data.rates).length > 0
            ? res.data.data.rates
            : [];
        // console.log("cooin redux", coinRateList);
        // console.log("cooin redux", res.data.data);
        dispatch({
          type: COIN_RATE_LIST,
          payload: coinRateList,
        });
      })
      .catch((err) => {
        console.log("Catch", err);
      });
  };
};

export const getUserWallet = (wallet, ctx, isRefresh, index) => {
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
        let userWalletList =
          res.data &&
          res.data.data.user_wallet &&
          res.data.data.user_wallet.assets &&
          res.data.data.user_wallet.assets.length > 0 &&
          res.data.data.user_wallet.active
            ? res.data.data.user_wallet
            : [];

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
          type: ctx?.state?.isTopAccountPage
            ? TOP_USER_WALLET_LIST
            : USER_WALLET_LIST,
          payload: {
            address: wallet.address,
            userWalletList: userWalletList,
            assetPrice: res.data?.data.asset_prices,
          },
        });
        // dispatch({
        //   type: COIN_RATE_LIST,
        //   payload: res.data?.data.asset_prices,
        // });
        // console.log("state", ctx.props.portfolioState.walletTotal, ctx);

        if (ctx) {
          ctx.setState({
            // isLoading: false,
            assetPrice: {
              ...ctx.state.assetPrice,
              ...res.data?.data.asset_prices,
            },
          });
        }
        if (ctx.state.userWalletList?.length - 1 === index) {
          setTimeout(() => {
            ctx.setState({
              isLoading: false,
              isLoadingNet: false,
              isStopLoading: true,
            });
          }, (ctx.state.userWalletList?.length || 1) * 1500);
        }
      })
      .catch((err) => {
        console.log("Catch", err);
      });
  };
};

export const getExchangeBalance = (exchangeName, ctx) => {
  return function (dispatch, getState) {
    //  console.log(exchangeName);
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
          type: ctx?.state?.isTopAccountPage
            ? TOP_USER_WALLET_LIST
            : USER_WALLET_LIST,
          payload: {
            address: exchangeName,
            userWalletList: userWalletList,
            assetPrice: res.data?.data.asset_prices,
          },
        });
        if (ctx) {
          ctx.setState({
            //  isLoading: false,
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

export const getExchangeBalances = (ctx, isRefresh = false) => {
  return function (dispatch, getState) {
    let data = new URLSearchParams();
    if (!isRefresh) {
      data.append("update_balance", false);
    } else {
      //  console.log("On Refresh Api Called", wallet);
      data.append("update_balance", true);
    }

    postLoginInstance
      .post("wallet/user-wallet/get-exchange-balances", data)
      .then((res) => {
        let userWalletList =
          res.data && res.data.data.user_wallets && res.data.data.user_wallets
            ? res.data.data.user_wallets
            : [];

        localStorage.setItem(
          "refreshApiTime",
          moment(res.data?.data.user_wallet?.modified_on).valueOf()
        );
        isRefresh && ctx.getCurrentTime();

        userWalletList?.map((item, i) => {
          setTimeout(() => {
            dispatch({
              type: ctx?.state?.isTopAccountPage
                ? TOP_USER_WALLET_LIST
                : USER_WALLET_LIST,
              payload: {
                address: item.protocol.name,
                userWalletList: item,
                assetPrice: res.data?.data.asset_prices,
                // assetPrice: i === 0 ? res.data?.data.asset_prices: {},
              },
            });
          }, 200);
        });
        if (ctx) {
          ctx.setState({
            isLoading: false,
            isLoadingNet: false,
            isStopLoading: true,
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

export const settingDefaultValues = (ctx) => {
  return function (dispatch, getState) {
    dispatch({
      type: ctx?.state?.isTopAccountPage ? TOP_DEFAULT_VALUES : DEFAULT_VALUES,
    });
  };
};

export const getDetailsByLinkApi = (link, ctx = null) => {
  const data = new URLSearchParams();
  data.append("token", link);

  return async function (dispatch, getState) {
    preLoginInstance
      .post("organisation/user/get-portfolio-by-link", data)
      .then((res) => {
        if (!res.data.error) {
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
          for (let i = 0; i < apiResponse.user.user_wallets.length; i++) {
            let obj = {}; // <----- new Object
            obj["address"] = apiResponse.user.user_wallets[i].address;
            obj["displayAddress"] =
              apiResponse.user.user_wallets[i]?.display_address;
            // const chainsDetected = apiResponse.wallets[apiResponse.user.user_wallets[i].address].chains;
            const chainsDetected =
              apiResponse.wallets[apiResponse?.user?.user_wallets[i]?.address]
                ?.chains ||
              apiResponse.wallets[
                apiResponse.user?.user_wallets[i]?.address.toLowerCase()
              ]?.chains;

            obj["coins"] = allChains.map((chain) => {
              let coinDetected = false;
              chainsDetected.map((item) => {
                if (item.id === chain.id) {
                  coinDetected = true;
                }
              });
              return {
                coinCode: chain.code,
                coinSymbol: chain.symbol,
                coinName: chain.name,
                chain_detected: coinDetected,
                coinColor: chain.color,
              };
            });
            obj["wallet_metadata"] = apiResponse.user.user_wallets[i].wallet;
            obj["id"] = `wallet${i + 1}`;

            // obj['coinFound'] = apiResponse.wallets[apiResponse.user.user_wallets[i].address].chains.length > 0 ? true : false;

            let chainLength =
              apiResponse.wallets[apiResponse.user?.user_wallets[i]?.address]
                ?.chains?.length ||
              apiResponse.wallets[
                apiResponse.user?.user_wallets[i]?.address.toLowerCase()
              ]?.chains?.length;
            obj["coinFound"] = chainLength > 0 ? true : false;

            addWallet.push(obj);
            obj["nickname"] = apiResponse.user.user_wallets[i]?.nickname;
            obj["showAddress"] =
              apiResponse.user.user_wallets[i]?.nickname === "" ? true : false;
            obj["showNickname"] =
              apiResponse.user.user_wallets[i]?.nickname !== "" ? true : false;
          }
          // console.log('addWallet',addWallet);
          localStorage.setItem("addWallet", JSON.stringify(addWallet));
          // sessionStorage.setItem("addWallet", JSON.stringify(addWallet));
          ctx.setState({
            // isLoading: false,
            userWalletList: addWallet,
          });

          // ctx.handleResponse && ctx.handleResponse();
          // console.log("add",addWallet.length)
          let userPlan = JSON.parse(localStorage.getItem("currentPlan"));

          if (
            addWallet.length > userPlan?.wallet_address_limit &&
            userPlan?.wallet_address_limit != -1
          ) {
            ctx.setState(
              {
                isStatic: true,
              },
              () => {
                setTimeout(() => {
                  ctx.upgradeModal && ctx.upgradeModal();
                }, 5000);
              }
            );
          }

          if (ctx.handleResponse) {
            ctx.handleResponse();
          } else {
            // ctx.props.getCoinRate();
            // ctx.getTableData();
            // ctx.getGraphData();
            // getAllCounterFeeApi(ctx, false, false);
            // ctx.props.getProfitAndLossApi(ctx, false, false, false);
            //  ctx.props.getAllInsightsApi(ctx);
            //        GetAllPlan();
            // getUser(ctx);
            ctx.props.setPageFlagDefault();
          }
        } else {
          // toast.error(res.data.message || "Something Went Wrong")
          ctx && ctx?.props.history.push("/welcome");
        }
      })
      .catch((err) => {
        console.log("Catch", err);
      });
  };
};
let count = 1;

export const getAssetGraphDataApi = (data, ctx, ActionType) => {
  // console.log("before",data, ctx, ActionType);
  return async function (dispatch, getState) {
    postLoginInstance
      .post("wallet/user-wallet/get-asset-value-graph", data)
      .then((res) => {
        //  console.log("all data", res, ActionType);
        if (!res.data.error) {
          dispatch({
            type: ActionType,
            payload: {
              data: res.data.data.asset_value_data,
              loader: !res.data.data.data_loaded,
            },
          });
          ctx.setState({
            //  assetValueData: res.data.data.asset_value_data,
            graphLoading: false,
            assetValueDataLoaded: !res.data.data.data_loaded,
          });
          ctx.props.getExternalEventsApi(ctx);
          if (!res.data.data.data_loaded) {
            ctx.setState({ assetValueDataLoaded: false });
            setTimeout(() => {
              if (count < 8) {
                ctx.props.getAssetGraphDataApi(data, ctx, ActionType);
                count++;
              }
            }, 15000);
          } else {
            ctx.setState({ assetValueDataLoaded: true });
            let obj = JSON.parse(localStorage.getItem("assetValueLoader"));
            if (obj) {
              localStorage.setItem(
                "assetValueLoader",
                JSON.stringify({
                  me: !ctx?.state?.isTopAccountPage ? false : obj?.me,
                  topaccount: ctx?.state?.isTopAccountPage
                    ? false
                    : obj?.topaccount,
                })
              );
            }
          }
        } else {
          toast.error(res.data.message || "Something Went Wrong");
        }
      })
      .catch((err) => {
        console.log("Catch", err);
      });
  };
};

export const getExternalEventsApi = (ctx) => {
  return async function (dispatch, getState) {
    postLoginInstance
      .post("common/master/get-all-events")
      .then((res) => {
        // console.log("res", res);
        if (!res.data.error) {
          dispatch({
            type: ctx?.state?.isTopAccountPage
              ? TOP_EXTERNAL_EVENTS
              : EXTERNAL_EVENTS,
            payload: {
              externalEvents: res.data.data.events,
            },
          });
          ctx.setState({
            // externalEvents: res.data.data.events,
          });
        } else {
          toast.error(res.data.message || "Something Went Wrong");
        }
      })
      .catch((err) => {
        console.log("Catch", err);
      });
  };
};

export const getYesterdaysBalanceApi = (ctx) => {
  return async function (dispatch, getState) {
    let data = new URLSearchParams();
    if (ctx?.state?.isTopAccountPage) {
      let addressObj = localStorage.getItem("previewAddress")
        ? [JSON.parse(localStorage.getItem("previewAddress"))]
        : [];
      let address = addressObj?.map((e) => e?.address);
      data.append("wallet_address", JSON.stringify(address));
    }
    postLoginInstance
      .post("wallet/user-wallet/get-yesterday-portfolio-balance", data)
      .then((res) => {
        if (!res.data.error) {
          let currency = JSON.parse(localStorage.getItem("currency"));
          let balance = res.data.data.balance * currency?.rate;
          dispatch({
            type: ctx?.state?.isTopAccountPage
              ? TOP_YESTERDAY_BALANCE
              : YESTERDAY_BALANCE,
            payload: { balance },
          });

          // ctx.setState({
          //    yesterdayBalance: res.data.data.balance * currency?.rate,
          // });
        } else {
          toast.error(res.data.message || "Something Went Wrong");
        }
      })
      .catch((err) => {
        console.log("Catch", err);
      });
  };
};

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
};

export const getProtocolBalanceApi = (ctx, data) => {
  return function (dispatch, getState) {
    postLoginInstance
      .post("wallet/user-wallet/get-protocol-balance", data)
      .then((res) => {
        if (!res.data.error) {
          let currency = JSON.parse(localStorage.getItem("currency"));

          let cardList = ctx.props.defiState.cardList || [];
          let totalYield = ctx.props.defiState.totalYield;
          let totalDebt = ctx.props.defiState.totalDebt;

          let BalanceSheetValue = ctx.props.defiState.BalanceSheetValue || {};
          // console.log("Yeild before", BalanceSheetValue, cardList);
          let userWallets = res.data.data.user_wallet;

          userWallets?.map((item) => {
            let totalUsd = 0;
            let yeild_total = 0;
            let debt_total = 0;

            let tableRow = [];

            // getting all type in this array per card
            let assetTypes = item?.assets?.map((e) => e?.product_type);
            // console.log("asset types", item?.name, assetTypes);

            let debtTypes = assetTypes.includes(40) ? [30, 50] : [30];
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
                // if 50 in debtTypes then add 50 data into borrowed means 30
                let typename =
                  asset.product_type === 50 &&
                  debtTypes.includes(asset.product_type)
                    ? AssetType.getText(30)
                    : AssetType.getText(asset.product_type);
                let type =
                  asset.product_type === 50 &&
                  debtTypes.includes(asset.product_type)
                    ? 30
                    : asset.product_type;
                let usdValue = asset.balance_usd;
                let type_text = "";

                if (!debtTypes.includes(type)) {
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
                    type_text: type_text,
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

          let allAssetType = [20, 30, 40, 50, 60, 70];
          allAssetType.map((e) => {
            let isfound = false;
            YieldValues &&
              YieldValues.map((item) => {
                if (item.id === e) {
                  isfound = true;
                }
              });

            if (!isfound && ![30].includes(e)) {
              YieldValues.push({
                id: e,
                name: AssetType.getText(e),
                totalPrice: 0,
              });
            }
          });
          if (DebtValues.length === 0) {
            [30]?.map((e) => {
              DebtValues.push({
                id: e,
                name: AssetType.getText(e),
                totalPrice: 0,
              });
            });
          }
          let sorted =
            cardList?.length === 0
              ? ""
              : cardList.sort((a, b) => b.totalUsd - a.totalUsd);
          YieldValues = YieldValues.sort((a, b) => b.totalPrice - a.totalPrice);
          DebtValues = DebtValues.sort((a, b) => b.totalPrice - a.totalPrice);

          let totalY = 0;
          YieldValues.map((e) => (totalY = totalY + e.totalPrice));

          let totalD = 0;
          DebtValues.map((e) => (totalD = totalD + e.totalPrice));

          setTimeout(() => {
            dispatch({
              type: ctx?.state?.isTopAccountPage
                ? TOP_GET_DEFI_DATA
                : GET_DEFI_DATA,
              payload: {
                totalYield: totalY,
                totalDebt: totalD,
                cardList,
                sortedList: sorted,
                DebtValues,
                YieldValues,
                BalanceSheetValue,
              },
            });
            ctx.setState({
              defiLoader: false,
            });
          }, 100);
        } else {
          toast.error(res.data.message || "Something Went Wrong");
        }
      })
      .catch((err) => {
        console.log("Catch", err);
      });
  };
};

export const AssetValueEmail = (data, ctx) => {
  postLoginInstance
    .post("wallet/user-wallet/notify-asset-value-chart", data)
    .then((res) => {
      if (!res.data.error) {
        let obj = JSON.parse(localStorage.getItem("assetValueLoader"));
        localStorage.setItem(
          "assetValueLoader",
          JSON.stringify({
            me: ctx?.props.from === "me" ? true : obj?.me,
            topaccount:
              ctx?.props.from === "topaccount" ? true : obj?.topaccount,
          })
        );
        toast.success("Email added");
        ctx.state.onHide();
      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    })
    .catch((err) => {
      console.log("Catch", err);
    });
};
