import moment from "moment";
import { toast } from "react-toastify";
import { postLoginInstance, preLoginInstance } from "../../utils";
import { addLocalWalletList } from "../common/Api";
import { GET_DEFI_DATA } from "../defi/ActionTypes";

import {
  COIN_RATE_LIST,
  DEFAULT_VALUES,
  EXTERNAL_EVENTS,
  USER_WALLET_LIST,
  YESTERDAY_BALANCE,
} from "./ActionTypes";

export const isNewAddress = (data, multipleRecall) => {
  return async function () {
    preLoginInstance
      .post("wallet/user-wallet/new-address", data)
      .then((res) => {
        if (!res.data?.error) {
          if (multipleRecall) {
            multipleRecall(res.data.data.result);
          } else {
            window.localStorage.setItem(
              "shouldRecallApis",
              res.data.data.result
            );
          }
        } else {
          window.localStorage.setItem("shouldRecallApis", false);
        }
      })
      .catch((err) => {
        window.localStorage.setItem("shouldRecallApis", false);
      });
  };
};
export const isFollowedByUser = (data, ctx) => {
  return async function () {
    postLoginInstance
      .post("wallet/user-wallet/followed-by-user", data)
      .then((res) => {
        if (!res.data?.error) {
          if (res.data?.data.following) {
            if (ctx.showAddressesAdded) {
              ctx.showAddressesAdded();
            }
          } else {
            if (ctx.addressDeleted) {
              ctx.addressDeleted();
            }
          }
        }
      })
      .catch((err) => {});
  };
};
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
  return async function (dispatch, getState) {
    let data = new URLSearchParams();
    console.log("chains ++", wallet.coinCode);
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

        window.localStorage.setItem(
          "refreshApiTime",
          moment(res.data?.data.user_wallet?.modified_on).valueOf()
        );

        if (isRefresh && ctx.getCurrentTime) {
          ctx.getCurrentTime();
        }

        // }

        dispatch({
          type: USER_WALLET_LIST,
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
  return async function (dispatch, getState) {
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
        // window.localStorage.setItem(
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
  return async function (dispatch, getState) {
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

        window.localStorage.setItem(
          "refreshApiTime",
          moment(res.data?.data.user_wallet?.modified_on).valueOf()
        );
        if (isRefresh && ctx.getCurrentTime) {
          ctx.getCurrentTime();
        }

        userWalletList?.map((item, i) => {
          setTimeout(() => {
            dispatch({
              type: USER_WALLET_LIST,
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
  return async function (dispatch, getState) {
    dispatch({
      type: DEFAULT_VALUES,
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
            obj["nameTag"] = apiResponse.user.user_wallets[i].tag
              ? apiResponse.user.user_wallets[i].tag
              : "";
            obj["showNameTag"] = apiResponse.user.user_wallets[i].tag
              ? true
              : false;
          }
          // console.log('addWallet',addWallet);
          window.localStorage.setItem("addWallet", JSON.stringify(addWallet));
          addLocalWalletList(JSON.stringify(addWallet));
          // localStorage.setItem("addWallet", JSON.stringify(addWallet));
          ctx.setState({
            // isLoading: false,
            userWalletList: addWallet,
          });

          // ctx.handleResponse && ctx.handleResponse();
          // console.log("add",addWallet.length)
          let userPlan = JSON.parse(window.localStorage.getItem("currentPlan"));

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
            if (ActionType === "ASSET_VALUE_GRAPH_DAY") {
              ctx.setState({ assetValueDataLoaded: false });
            }
            setTimeout(() => {
              if (count < 8) {
                ctx.props.getAssetGraphDataApi(data, ctx, ActionType);
                count++;
              } else {
                if (ActionType === "ASSET_VALUE_GRAPH_DAY") {
                  ctx.setState({ assetValueDataLoaded: true });
                }
              }
            }, 15000);
          } else {
            ctx.setState({ assetValueDataLoaded: true });
            let obj = JSON.parse(
              window.localStorage.getItem("assetValueLoader")
            );
            if (obj) {
              window.localStorage.setItem(
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
            type: EXTERNAL_EVENTS,
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
      let addressObj = window.localStorage.getItem("previewAddress")
        ? [JSON.parse(window.localStorage.getItem("previewAddress"))]
        : [];
      let address = addressObj?.map((e) => e?.address);
      data.append("wallet_address", JSON.stringify(address));
    }
    postLoginInstance
      .post("wallet/user-wallet/get-yesterday-portfolio-balance", data)
      .then((res) => {
        if (!res.data.error) {
          let currency = JSON.parse(window.localStorage.getItem("currency"));
          let balance = res.data.data.balance * currency?.rate;
          dispatch({
            type: YESTERDAY_BALANCE,
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
  return async function (dispatch, getState) {
    postLoginInstance
      .post("wallet/user-wallet/get-debank-balance", data)
      .then((res) => {
        if (!res.data.error) {
          let defiList = [];
          let totalYield = 0;
          let totalDebt = 0;
          let lastYieldValues = [];
          let lastDebtValues = [];

          let totalSuppliedPrice = 0;
          let totalLentPrice = 0;
          let totalRewardPrice = 0;
          let totalStakedPrice = 0;
          let totalPoolPrice = 0;
          let totalBorrowedPrice = 0;

          const tempUserWallet = res.data?.data?.user_wallet;

          const defiData = [];
          tempUserWallet.map((userWalletData) => {
            let suppliedItems = {
              type: "Supplied",
              walletItems: [],
            };
            let lentItems = {
              type: "Lent",
              walletItems: [],
            };
            let rewardItems = {
              type: "Reward",
              walletItems: [],
            };
            let stakedItems = {
              type: "Staked",
              walletItems: [],
            };
            let poolItems = {
              type: "Pool",
              walletItems: [],
            };
            let borrowedItems = {
              type: "Borrowed",
              walletItems: [],
            };
            const curDefiBlock = {
              name: userWalletData.name ? userWalletData.name : "",
              logoUrl: userWalletData.logo_url ? userWalletData.logo_url : "",
              siteUrl: userWalletData.site_url ? userWalletData.site_url : "",
              netBalance: userWalletData.net_balance
                ? userWalletData.net_balance
                : "",
              tag: userWalletData.tag ? userWalletData.tag : "",
              items: [],
            };
            const defiWalletItems = [];
            if (userWalletData?.items) {
              userWalletData.items.map((walletItems) => {
                let totalUsdValue = 0;
                if (walletItems.usd_value) {
                  walletItems.usd_value.map((usdAmount) => {
                    totalUsdValue = totalUsdValue + usdAmount;
                    return null;
                  });
                }
                let assetText = "";
                const tempAllLogos = [];
                if (walletItems.logo.length > 0) {
                  walletItems.logo.forEach((individualLogos) => {
                    if (individualLogos) {
                      tempAllLogos.push(individualLogos);
                    }
                  });
                }
                if (
                  userWalletData?.tag?.toLowerCase() === "staked" &&
                  walletItems.pool
                ) {
                  totalStakedPrice = totalStakedPrice + totalUsdValue;
                  walletItems.pool.map((tempAssetText) => {
                    if (assetText) {
                      assetText = assetText + "+" + tempAssetText;
                    } else {
                      assetText = tempAssetText;
                    }
                    return null;
                  });
                  const tempWalletItem = {
                    balance: walletItems.balance ? walletItems.balance : [],
                    logos: tempAllLogos ? tempAllLogos : [],
                    usdValue: totalUsdValue,
                    asset: assetText,
                  };
                  stakedItems.walletItems.push(tempWalletItem);
                } else {
                  if (walletItems.supplied) {
                    totalSuppliedPrice = totalSuppliedPrice + totalUsdValue;
                    walletItems.supplied.map((tempAssetText) => {
                      if (assetText) {
                        assetText = assetText + "+" + tempAssetText;
                      } else {
                        assetText = tempAssetText;
                      }
                      return null;
                    });
                    const tempWalletItem = {
                      balance: walletItems.balance ? walletItems.balance : [],
                      logos: tempAllLogos ? tempAllLogos : [],
                      usdValue: totalUsdValue,
                      asset: assetText,
                    };
                    suppliedItems.walletItems.push(tempWalletItem);
                  } else if (walletItems.lent) {
                    totalLentPrice = totalLentPrice + totalUsdValue;
                    walletItems.lent.map((tempAssetText) => {
                      if (assetText) {
                        assetText = assetText + "+" + tempAssetText;
                      } else {
                        assetText = tempAssetText;
                      }
                      return null;
                    });
                    const tempWalletItem = {
                      balance: walletItems.balance ? walletItems.balance : [],
                      logos: tempAllLogos ? tempAllLogos : [],
                      usdValue: totalUsdValue,
                      asset: assetText,
                    };
                    lentItems.walletItems.push(tempWalletItem);
                  } else if (walletItems.reward) {
                    totalRewardPrice = totalRewardPrice + totalUsdValue;
                    walletItems.reward.map((tempAssetText) => {
                      if (assetText) {
                        assetText = assetText + "+" + tempAssetText;
                      } else {
                        assetText = tempAssetText;
                      }
                      return null;
                    });
                    const tempWalletItem = {
                      balance: walletItems.balance ? walletItems.balance : [],
                      logos: tempAllLogos ? tempAllLogos : [],
                      usdValue: totalUsdValue,
                      asset: assetText,
                    };
                    rewardItems.walletItems.push(tempWalletItem);
                  } else if (walletItems.staked) {
                    totalStakedPrice = totalStakedPrice + totalUsdValue;
                    walletItems.staked.map((tempAssetText) => {
                      if (assetText) {
                        assetText = assetText + "+" + tempAssetText;
                      } else {
                        assetText = tempAssetText;
                      }
                      return null;
                    });
                    const tempWalletItem = {
                      balance: walletItems.balance ? walletItems.balance : [],
                      logos: tempAllLogos ? tempAllLogos : [],
                      usdValue: totalUsdValue,
                      asset: assetText,
                    };
                    stakedItems.walletItems.push(tempWalletItem);
                  } else if (walletItems.pool) {
                    totalPoolPrice = totalPoolPrice + totalUsdValue;
                    walletItems.pool.map((tempAssetText) => {
                      if (assetText) {
                        assetText = assetText + " + " + tempAssetText;
                      } else {
                        assetText = tempAssetText;
                      }
                      return null;
                    });
                    const tempWalletItem = {
                      balance: walletItems.balance ? walletItems.balance : [],
                      logos: tempAllLogos ? tempAllLogos : [],
                      usdValue: totalUsdValue,
                      asset: assetText,
                    };
                    poolItems.walletItems.push(tempWalletItem);
                  } else if (walletItems.borrowed) {
                    totalBorrowedPrice = totalBorrowedPrice + totalUsdValue;
                    walletItems.borrowed.map((tempAssetText) => {
                      if (assetText) {
                        assetText = assetText + "+" + tempAssetText;
                      } else {
                        assetText = tempAssetText;
                      }
                      return null;
                    });
                    const tempWalletItem = {
                      balance: walletItems.balance ? walletItems.balance : [],
                      logos: tempAllLogos ? tempAllLogos : [],
                      usdValue: totalUsdValue,
                      asset: assetText,
                    };
                    borrowedItems.walletItems.push(tempWalletItem);
                  }
                }
                return null;
              });
            }
            if (suppliedItems.walletItems.length > 0) {
              defiWalletItems.push(suppliedItems);
            }
            if (lentItems.walletItems.length > 0) {
              defiWalletItems.push(lentItems);
            }
            if (rewardItems.walletItems.length > 0) {
              defiWalletItems.push(rewardItems);
            }
            if (stakedItems.walletItems.length > 0) {
              defiWalletItems.push(stakedItems);
            }
            if (poolItems.walletItems.length > 0) {
              defiWalletItems.push(poolItems);
            }
            if (borrowedItems.walletItems.length > 0) {
              defiWalletItems.push(borrowedItems);
            }
            curDefiBlock.items = defiWalletItems;
            defiData.push(curDefiBlock);
            return null;
          });
          const YieldValues = [
            {
              id: 1,
              name: "Supplied",
              totalPrice: totalSuppliedPrice,
              type_text: "Yield",
            },
            {
              id: 2,
              name: "Lent",
              totalPrice: totalLentPrice,
              type_text: "Yield",
            },
            {
              id: 3,
              name: "Reward",
              totalPrice: totalRewardPrice,
              type_text: "Yield",
            },
            {
              id: 4,
              name: "Staked",
              totalPrice: totalStakedPrice,
              type_text: "Yield",
            },
            {
              id: 5,
              name: "Pool",
              totalPrice: totalPoolPrice,
              type_text: "Yield",
            },
          ];
          if (lastYieldValues.length > 0) {
            YieldValues.forEach((resData) => {
              let lastValue = 0;
              lastYieldValues.forEach((resRes) => {
                if (
                  resData.name &&
                  resRes.name &&
                  resData.name === resRes.name
                ) {
                  lastValue = resRes.totalPrice;
                }
              });
              resData.totalPrice = resData.totalPrice + lastValue;
            });
          }

          YieldValues.sort(function (a, b) {
            var keyA = a.totalPrice,
              keyB = b.totalPrice;
            // Compare the 2 dates
            if (keyA > keyB) return -1;
            if (keyA < keyB) return 1;
            return 0;
          });
          const DebtValues = [
            {
              id: 6,
              name: "Borrowed",
              totalPrice: totalBorrowedPrice,
            },
          ];
          if (lastDebtValues.length > 0) {
            DebtValues.forEach((resData) => {
              let lastValue = 0;
              lastDebtValues.forEach((resRes) => {
                if (
                  resData.name &&
                  resRes.name &&
                  resData.name === resRes.name
                ) {
                  lastValue = resRes.totalPrice;
                }
              });
              resData.totalPrice = resData.totalPrice + lastValue;
            });
          }
          const tempTotalYeild =
            totalSuppliedPrice +
            totalLentPrice +
            totalRewardPrice +
            totalStakedPrice +
            totalPoolPrice +
            totalYield;
          setTimeout(() => {
            dispatch({
              type: GET_DEFI_DATA,
              payload: {
                defiList: [...defiData, ...defiList],
                YieldValues: YieldValues,
                DebtValues: DebtValues,
                totalYield: tempTotalYeild,
                totalDebt: totalBorrowedPrice + totalDebt,
              },
            });
            setTimeout(() => {
              if (ctx.sortArray) {
                ctx.sortArray("netBalance", false);
              }
            }, 100);
          }, 100);
        } else {
          toast.error(res.data.message || "Something Went Wrong");
        }
        ctx.setState({
          defiLoader: false,
        });
        return false;
      })
      .catch((err) => {
        ctx.setState({
          defiLoader: false,
        });
        console.log("getDebankDefiApi error ", err);
      });
  };
};

export const AssetValueEmail = (data, ctx) => {
  postLoginInstance
    .post("wallet/user-wallet/notify-asset-value-chart", data)
    .then((res) => {
      if (!res.data.error) {
        let obj = JSON.parse(window.localStorage.getItem("assetValueLoader"));
        window.localStorage.setItem(
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
