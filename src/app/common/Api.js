import moment from "moment";
import { toast } from "react-toastify";
import { preLoginInstance } from "../../utils";
import {
  ConnectExEmailVerified,
  FollowSignInPopupEmailVerified,
  GeneralPopupEmailVerified,
  Home_CE_OAuthCompleted,
  LP_CE_OAuthCompleted,
  SigninMenuEmailVerified,
  UpgradeSignInPopupEmailAdded,
  Wallet_CE_OAuthCompleted,
  WhaleCreateAccountEmailVerified,
  WhalePopupEmailVerified,
  signInUser,
  signUpProperties,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser, setLocalStoraage } from "../../utils/ManageToken";
import { YIELD_POOLS } from "../yieldOpportunities/ActionTypes";
import postLoginInstance from "./../../utils/PostLoginAxios";
import {
  LOCAL_ADD_WALLET_LIST,
  SET_DEFAULT_VALUE,
  TOP_SET_DEFAULT_VALUE,
  WALLET_LIST_UPDATED,
} from "./ActionTypes";

export const loginApi = (ctx, data) => {
  preLoginInstance
    .post("common/test/temp-login", data)
    .then((res) => {
      // console.log('res',res);
      if (!res.data.error) {
        // console.log('res', res.data.data.token);
        // console.log('ctx');
        window.sessionStorage.setItem(
          "currency",
          JSON.stringify({
            active: true,
            code: "USD",
            id: "6399a2d35a10114b677299fe",
            name: "United States Dollar",
            symbol: "$",
            rate: 1,
          })
        );
        window.sessionStorage.setItem("lochToken", res.data.data.token);
        if (ctx.state.link && ctx.state.id) {
          ctx.props.getAllCoins(ctx.handleShareLinkUser);
        } else {
          ctx.props.history.push("/welcome");
        }
      } else {
        toast.error(res.data.message || "Something went wrong");
        ctx.setState({
          errorMessage: res.data.message || "Invalid Credentials",
        });
      }
    })
    .catch((err) => {
      ctx.setState({
        errorMessage: "Something went wrong",
      });
    });
};

export const addLocalWalletList = (passedData) => {
  return function (dispatch, getState) {
    dispatch({
      type: LOCAL_ADD_WALLET_LIST,
      payload: passedData,
    });
  };
};
export const fixWalletApi = (ctx, info) => {
  postLoginInstance
    .post("organisation/user/update-user", info)
    .then((res) => {
      if (!res.data.error) {
        ctx.handleRedirection();
        // ctx.props.history.push('/welcome');
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    })
    .catch((err) => {
      // console.log("fixwallet",err)
    });
};

export const updateUserWalletApi = (
  data,
  ctx,
  yieldData,
  setToSearchHistory
) => {
  return function (dispatch, getState) {
    postLoginInstance
      .post("organisation/user/update-user-wallet", data)
      .then((res) => {
        if (!res.data.error) {
          if (setToSearchHistory && ctx.addWalletToHistory) {
            ctx.addWalletToHistory();
          }
          if (ctx.cancelAddingWallet) {
            // ctx.cancelAddingWallet();
            ctx.setState({
              disableAddBtn: false,
            });
          }
          const allChains = ctx.props.OnboardingState.coinsList;
          let newAddWallet = [];
          const apiResponse = res.data.data;
          // console.log("res", apiResponse)
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
            newAddWallet.push(obj);
          }
          // console.log('newAddWallet',newAddWallet);
          window.sessionStorage.setItem(
            "addWallet",
            JSON.stringify(newAddWallet)
          );
          if (ctx.props.addLocalWalletList) {
            ctx.props.addLocalWalletList(JSON.stringify(newAddWallet));
          }
          ctx.state.changeList && ctx.state.changeList(newAddWallet);
          if (ctx.props.apiResponse) {
            // ctx.setState({
            //    recievedResponse: true
            // })

            ctx.props.apiResponse(true);
          }

          if (ctx.props.handleUpdateWallet) {
            ctx.props.handleUpdateWallet();
          }
          if (ctx.state.pageName == "Landing Page") {
            ctx.props.history?.push("/home");
          } else {
            ctx.props.history?.push({
              pathname: ctx.props.pathName,
              state: {
                addWallet: JSON.parse(
                  window.sessionStorage.getItem("addWallet")
                ),
              },
            });
          }
          postLoginInstance
            .post("wallet/user-wallet/add-yield-pools", yieldData)
            .then(() => {
              dispatch({
                type: YIELD_POOLS,
                payload: res,
              });
              // const allChains = getState().OnboardingState.coinsList;
            })
            .catch((err) => {});
        } else {
          toast.error(res.data.message || "Something went wrong");
          if (ctx.cancelAddingWallet) {
            // ctx.cancelAddingWallet();
            ctx.setState({
              disableAddBtn: false,
            });
          }
        }
      })
      .catch((err) => {
        console.log("Three ", err);
        if (ctx.cancelAddingWallet) {
          // ctx.cancelAddingWallet();
          ctx.setState({
            disableAddBtn: false,
          });
        }
      });
  };
};

export const verifyEmailApi = (ctx, data) => {
  preLoginInstance
    .post("organisation/user/verify-email", data)
    .then((res) => {
      if (!res.data.error) {
        window.sessionStorage.setItem("lochToken", res.data?.data?.token);
        // window.sessionStorage.setItem("addWallet", JSON.stringify([]));
        window.sessionStorage.setItem("stopClick", true);
        // free pricing
        let plan = {
          defi_enabled: true,
          export_address_limit: -1,
          id: "63eb32769b5e4daf6b588207",
          is_default: false,
          is_trial: false,
          name: "Sovereign",
          notifications_limit: -1,
          notifications_provided: true,
          plan_reference_id: "prod_NM0aQTO38msDkq",
          subscription: {
            active: true,
            created_on: "2023-04-06 06:41:11.302000+00:00",
            id: "642e69878cc994b64ca49272",
            modified_on: "2023-04-06 06:41:11.302000+00:00",
            plan_id: "63eb32769b5e4daf6b588207",
            plan_reference_id: "prod_NM0aQTO38msDkq",
            subscription_reference_id: "",
            trial_subscription: false,
            user_id: "63f89011251cc82aeebfcae5",
            valid_till: "2023-05-06 00:00:00+00:00",
          },
          trial_days: 30,
          upload_csv: true,
          wallet_address_limit: -1,
          whale_pod_address_limit: -1,
          whale_pod_limit: -1,
          influencer_pod_limit: -1,
        };
        // free pricing
        window.sessionStorage.setItem(
          "currentPlan",
          JSON.stringify({
            ...plan,
            influencer_pod_limit: -1,
          })
        );
        // actual
        // window.sessionStorage.setItem(
        //   "currentPlan",
        //   JSON.stringify({...res.data?.data?.current_plan,influencer_pod_limit:
        // res.data.data?.current_plan.name === "Free" ? 1 : -1,} || {})
        // );
        //  let obj = JSON.parse(window.sessionStorage.getItem("lochUser"));
        let obj = {
          first_name: res.data.data.user?.first_name,
          last_name: res.data.data.user?.last_name,
          email: res.data.data.user?.email,
          mobile: res.data.data.user?.mobile,
          link: res.data.data.user?.link,
        };

        window.sessionStorage.setItem("lochUser", JSON.stringify(obj));

        // window.sessionStorage.setItem("defi_access", true);
        // window.sessionStorage.setItem("isPopup", true);
        // // window.sessionStorage.setItem("whalepodview", true);
        // window.sessionStorage.setItem(
        //   "whalepodview",
        //   JSON.stringify({ access: true, id: "" })
        // );
        setLocalStoraage();
        signUpProperties({
          userId: res?.data?.data?.user?.link,
          email_address: res?.data?.data?.user?.email,
          first_name: res?.data?.data?.user?.first_name,
          last_name: res?.data?.data?.user?.last_name,
        });
        ctx.setState({ error: false });
        // setTimeout(() => {
        //   ctx.props.history.push({
        //     pathname: "/home",
        //     state: {
        //       isVerified: true,
        //       chainDetect:true,
        //     },
        //   });
        // }, 3000);
        getUserAddresses(ctx);
      } else {
        ctx.setState({ error: true });
      }
    })
    .catch((err) => {
      // console.log("fixwallet",err)
    });
};

// get user detail for chain

export const getUserAddresses = (ctx) => {
  postLoginInstance.post("organisation/user/get-user").then((res) => {
    if (!res.data.error) {
      let apiResponse = res.data?.data;
      let newAddWallet = [];
      if (apiResponse?.wallets) {
        // const allChains = getState().OnboardingState.coinsList;
        const allChains = ctx.props?.OnboardingState?.coinsList;

        // console.log("res", apiResponse)
        for (let i = 0; i < apiResponse?.user?.user_wallets?.length; i++) {
          let obj = {}; // <----- new Object
          obj["address"] = apiResponse?.user?.user_wallets[i]?.address;

          obj["displayAddress"] =
            apiResponse?.user?.user_wallets[i]?.display_address;

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
          obj["wallet_metadata"] = apiResponse?.user?.user_wallets[i]?.wallet;
          obj["id"] = `wallet${i + 1}`;
          // obj['coinFound'] = apiResponse.wallets[apiResponse.user.user_wallets[i].address].chains.length > 0 ? true : false;
          let chainLength =
            apiResponse.wallets[apiResponse.user?.user_wallets[i]?.address]
              ?.chains?.length ||
            apiResponse?.wallets[
              apiResponse.user?.user_wallets[i]?.address.toLowerCase()
            ]?.chains?.length;
          obj["coinFound"] = chainLength > 0 ? true : false;

          obj["nickname"] = apiResponse?.user?.user_wallets[i]?.nickname;
          obj["showAddress"] =
            apiResponse?.user?.user_wallets[i]?.nickname === "" ? true : false;
          obj["showNickname"] =
            apiResponse?.user?.user_wallets[i]?.nickname !== "" ? true : false;
          obj["nameTag"] = apiResponse.user.user_wallets[i].tag
            ? apiResponse.user.user_wallets[i].tag
            : "";
          obj["showNameTag"] = apiResponse.user.user_wallets[i].tag
            ? true
            : false;
          newAddWallet.push(obj);
        }
      }
      // console.log('newAddWallet',newAddWallet);

      window.sessionStorage.setItem("addWallet", JSON.stringify(newAddWallet));
      addLocalWalletList(JSON.stringify(newAddWallet));
      setTimeout(() => {
        ctx.props.history.push({
          pathname: "/home",
          state: {
            isVerified: !apiResponse?.wallets ? true : false,
          },
        });
      }, 3000);
    } else {
      toast.error(res.data.message || "Something Went Wrong");
    }
  });
};

export const sendWhopCode = (ctx, data) => {
  //  console.log("ctx", ctx.props.OnboardingState.coinsList);
  // setTimeout(() => {

  // }, 3000);
  preLoginInstance
    .post("commerce/payment/create-user-whop", data)
    .then((res) => {
      if (!res.data.error) {
        window.sessionStorage.setItem("lochToken", res.data?.data?.token);
        let apiResponse = res.data?.data;
        let newAddWallet = [];
        if (apiResponse?.wallets) {
          // const allChains = getState().OnboardingState.coinsList;
          const allChains = ctx.props?.OnboardingState?.coinsList;

          // console.log("res", apiResponse)
          for (let i = 0; i < apiResponse?.user?.user_wallets?.length; i++) {
            let obj = {}; // <----- new Object
            obj["address"] = apiResponse?.user?.user_wallets[i]?.address;

            obj["displayAddress"] =
              apiResponse?.user?.user_wallets[i]?.display_address;

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
            obj["wallet_metadata"] = apiResponse?.user?.user_wallets[i]?.wallet;
            obj["id"] = `wallet${i + 1}`;
            // obj['coinFound'] = apiResponse.wallets[apiResponse.user.user_wallets[i].address].chains.length > 0 ? true : false;
            let chainLength =
              apiResponse.wallets[apiResponse.user?.user_wallets[i]?.address]
                ?.chains?.length ||
              apiResponse?.wallets[
                apiResponse.user?.user_wallets[i]?.address.toLowerCase()
              ]?.chains?.length;
            obj["coinFound"] = chainLength > 0 ? true : false;

            obj["nickname"] = apiResponse?.user?.user_wallets[i]?.nickname;
            obj["showAddress"] =
              apiResponse?.user?.user_wallets[i]?.nickname === ""
                ? true
                : false;
            obj["showNickname"] =
              apiResponse?.user?.user_wallets[i]?.nickname !== ""
                ? true
                : false;
            obj["nameTag"] = apiResponse.user.user_wallets[i].tag
              ? apiResponse.user.user_wallets[i].tag
              : "";
            obj["showNameTag"] = apiResponse.user.user_wallets[i].tag
              ? true
              : false;
            newAddWallet.push(obj);
          }
        }
        // console.log('newAddWallet',newAddWallet);
        window.sessionStorage.setItem(
          "addWallet",
          JSON.stringify(newAddWallet)
        );
        addLocalWalletList(JSON.stringify(newAddWallet));

        // window.sessionStorage.setItem("addWallet", JSON.stringify(walletAddress));
        window.sessionStorage.setItem("stopClick", true);
        // free pricing
        let plan = {
          defi_enabled: true,
          export_address_limit: -1,
          id: "63eb32769b5e4daf6b588207",
          is_default: false,
          is_trial: false,
          name: "Sovereign",
          notifications_limit: -1,
          notifications_provided: true,
          plan_reference_id: "prod_NM0aQTO38msDkq",
          subscription: {
            active: true,
            created_on: "2023-04-06 06:41:11.302000+00:00",
            id: "642e69878cc994b64ca49272",
            modified_on: "2023-04-06 06:41:11.302000+00:00",
            plan_id: "63eb32769b5e4daf6b588207",
            plan_reference_id: "prod_NM0aQTO38msDkq",
            subscription_reference_id: "",
            trial_subscription: false,
            user_id: "63f89011251cc82aeebfcae5",
            valid_till: "2023-05-06 00:00:00+00:00",
          },
          trial_days: 30,
          upload_csv: true,
          wallet_address_limit: -1,
          whale_pod_address_limit: -1,
          whale_pod_limit: -1,
          influencer_pod_limit: -1,
        };
        // free pricing
        window.sessionStorage.setItem(
          "currentPlan",
          JSON.stringify({
            ...plan,
            influencer_pod_limit: -1,
          })
        );
        // window.sessionStorage.setItem(
        //   "currentPlan",
        //   JSON.stringify({...res.data?.data?.current_plan,influencer_pod_limit:
        // res.data.data?.current_plan.name === "Free" ? 1 : -1} || {})
        // );
        //  let obj = JSON.parse(window.sessionStorage.getItem("lochUser"));
        let obj = {
          first_name: res.data.data.user?.first_name,
          last_name: res.data.data.user?.last_name,
          email: res.data.data.user?.email,
          mobile: res.data.data.user?.mobile,
          link: res.data.data.user?.link,
        };
        window.sessionStorage.setItem("lochUser", JSON.stringify(obj));
        // window.sessionStorage.setItem("defi_access", true);
        // window.sessionStorage.setItem("isPopup", true);
        // // window.sessionStorage.setItem("whalepodview", true);
        // window.sessionStorage.setItem(
        //   "whalepodview",
        //   JSON.stringify({ access: true, id: "" })
        // );
        setLocalStoraage();
        signUpProperties({
          userId: res?.data?.data?.user?.link,
          email_address: res?.data?.data?.user?.email,
          first_name: res?.data?.data?.user?.first_name,
          last_name: res?.data?.data?.user?.last_name,
        });
        ctx.setState({ error: false, msg: "Redirecting you to Loch" });
        setTimeout(() => {
          ctx.props.history.push({
            pathname: "/home",
            state: {
              isVerified: !apiResponse?.wallets ? true : false,
            },
          });
        }, 3000);
      } else {
        ctx.setState({ error: true });
      }
    })
    .catch((err) => {
      // console.log("fixwallet",err)
    });
};

export const getDetectedChainsApi = (ctx) => {
  return async function (dispatch, getState) {
    postLoginInstance
      .post("wallet/user-wallet/get-detected-chains")
      .then((res) => {
        if (!res.data.error) {
          // console.log('res',res);
          // CHAIN LIST
          //
          ctx.setState({
            total_addresses: res.data.data.total_wallet_addresses,
          });

          let chainList = [];
          ctx.props.OnboardingState.coinsList.map((item) => {
            return chainList.push({
              coinCode: item.code,
              coinSymbol: item.symbol,
              coinName: item.name,
              chain_detected: false,
              coinColor: item.color,
            });
          });
          // console.log('chainList',chainList);
          let addWallet = JSON.parse(
            window.sessionStorage.getItem("addWallet")
          );
          let totalChainDetechted = 0;
          addWallet = addWallet?.map((e) => ({ ...e, apiAddress: e.address }));
          // console.log('addWallet',addWallet);
          let xyz = Object.keys(res.data.data.chains).map((chain) => ({
            address: chain,
            display_address: res.data.data.chains[chain].display_address,
            chains: res.data.data.chains[chain].chains,
          }));
          // console.log("addwallet", xyz, res.data.data.chains);
          addWallet?.map((wallet) => {
            let userWallet = null;
            let coinFound = false;
            xyz.map((item) => {
              if (
                item.address === wallet.address ||
                item.address === wallet.address.toLowerCase() ||
                item.display_address === wallet.address
              ) {
                userWallet = item;
              }
            });

            // console.log("chain", userWallet);

            let chainsDetected = chainList.map((chain) => {
              let dummyChain = { ...chain };
              let isDetected = false;
              userWallet?.chains?.map((userChain) => {
                if (userChain.code === dummyChain.coinCode) {
                  isDetected = true;
                  coinFound = true;
                  totalChainDetechted = totalChainDetechted + 1;
                }
              });
              dummyChain.chain_detected = isDetected;
              return dummyChain;
            });
            wallet.coinFound = coinFound;
            wallet.coins = chainsDetected;
          });

          ctx.setState({
            addWalletList:
              addWallet?.length > 0
                ? addWallet
                : [
                    {
                      id: `wallet${(addWallet?.length || 0) + 1}`,
                      address: "",
                      coins: [],
                      displayAddress: "",
                      wallet_metadata: {},
                      showAddress: true,
                      showNickname: true,
                      showNameTag: true,
                      nickname: "",
                      apiAddress: "",
                    },
                  ],
            chainLoader: false,
            totalChainDetechted: totalChainDetechted,
          });
          addWallet &&
            addWallet.length > 0 &&
            window.sessionStorage.setItem(
              "addWallet",
              JSON.stringify(addWallet)
            );
          addLocalWalletList(JSON.stringify(addWallet));
        } else {
          toast.error(res.data.message || "Something went wrong");
        }
      })
      .catch((err) => {
        console.log("fixwallet", err);
      });
  };
};

export const sendUserFeedbackApi = (data) => {
  return async function (dispatch, getState) {
    postLoginInstance
      .post("organisation/user/add-user-feedback", data)
      .then((res) => {
        if (!res.data.error) {
          toast.success("Thank you for your feedback");
        } else {
          toast.error(res.data.message || "Something went wrong");
        }
      })
      .catch((err) => {
        console.log("fixwallet", err);
      });
  };
};

export const exportDataApi = (data, ctx) => {
  postLoginInstance
    .post(ctx.state.selectedExportItem.apiurl, data)
    .then((res) => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      // link.setAttribute('download', 'file.txt');
      link.setAttribute(
        "download",
        `${ctx.state.selectedExportItem.fileName}-${moment(
          ctx.state.fromDate
        ).format("ll")}-${moment(ctx.state.toDate).format("ll")}.csv`
      );
      document.body.appendChild(link);
      link.click();
      ctx.setState({
        loadingExportFile: false,
      });
    })
    .catch((err) => {
      ctx.setState({
        loadingExportFile: false,
      });
      console.log("Catch", err);
    });
};

export const sendFeedbackApi = (data, ctx) => {
  postLoginInstance
    .post("common/master/send-feedback", data)
    .then((res) => {
      ctx.props.onHide();
      toast.success("Thank you very much for your feedback");
      // ctx.setState({
      //   ...(type === FeedbackType.POSITIVE ? {favorite: "Thank you very much for your feedback"} : {worst: "Thank you very much for your feedback"}),
      // });
      // setTimeout(function(){
      //   ctx.setState({
      //     ...(type === FeedbackType.POSITIVE ? {favorite: ""} : {worst: ""}),
      //     ...(type === FeedbackType.POSITIVE ? {disabledFav: false} : {disabled: false}),
      //   });
      // }, 4000)
    })
    .catch((err) => {
      console.log("Catch", err);
    });
};

export const getAllCurrencyApi = (setAllCurrencyList) => {
  postLoginInstance
    .post("common/master/get-all-currencies")
    .then((res) => {
      if (!res.data.error) {
        // console.log('set');
        setAllCurrencyList(res.data.data.currencies);
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    })
    .catch((err) => {
      console.log("err", err);
    });
};
export const getAllCurrencyRatesApi = () => {
  postLoginInstance
    .post("common/master/get-currency-rates")
    .then((res) => {
      if (!res.data.error) {
        let currency = JSON.parse(
          window.sessionStorage.getItem("currency")
        ) || {
          active: true,
          code: "USD",
          id: "6399a2d35a10114b677299fe",
          name: "United States Dollar",
          symbol: "$",
          rate: 1,
        };

        for (const [key, value] of Object.entries(res.data.data.rates.rates)) {
          // console.log(`${key}: ${value}`);
          if (key === currency?.code) {
            currency = {
              ...currency,
              rate: value,
            };
          }
        }
        window.sessionStorage.setItem("currency", JSON.stringify(currency));
        window.sessionStorage.setItem(
          "currencyRates",
          JSON.stringify(res.data.data.rates)
        );
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    })
    .catch((err) => {
      console.log("err", err);
    });
};

// Send Email OTP from whale pod

export const SendOtp = (data, ctx, isForMobile) => {
  postLoginInstance
    .post("organisation/user/send-email-otp", data)
    .then((res) => {
      if (!res.data.error) {
        if (isForMobile && ctx.showSignInOtpPage) {
          ctx.showSignInOtpPage();
        }
        // console.log("res", res.data);
        else {
          let otp = res.data.data.opt_token;
          ctx.setState({
            isShowOtp: true,
            isEmailNotExist: res.data.data.is_new_user,
            modalTitle: "Verify email",
            modalDescription: ctx?.props?.stopUpdate
              ? "Enter the verification code sent to your email to sign in your account"
              : res.data.data.is_new_user
              ? "Enter the verification code sent to your email to save the wallets and pods to your account"
              : "Enter the verification code sent to your email to update the existing wallets and pods for your account",
          });
        }
      } else if (res.data.error === true) {
        toast.error(res.data.message || "Something Went Wrong");
      }
    })
    .catch((err) => {
      if (isForMobile && ctx.handleError) {
        ctx.handleError();
      }
      console.log("err", err);
      toast.error("Something Went Wrong");
    });
};

// Verify email

export const VerifyEmail = (data, ctx) => {
  postLoginInstance
    .post("organisation/user/verify-otp-code", data)
    .then((res) => {
      if (!res.data.error) {
        let isOptValid = res.data.data.otp_verified;
        let token = res.data.data.token;

        //  window.sessionStorage.setItem(
        //    "currentPlan",
        //    JSON.stringify(res.data.data?.current_plan)
        //  );
        // free pricing
        let plan = {
          defi_enabled: true,
          export_address_limit: -1,
          id: "63eb32769b5e4daf6b588207",
          is_default: false,
          is_trial: false,
          name: "Sovereign",
          notifications_limit: -1,
          notifications_provided: true,
          plan_reference_id: "prod_NM0aQTO38msDkq",
          subscription: {
            active: true,
            created_on: "2023-04-06 06:41:11.302000+00:00",
            id: "642e69878cc994b64ca49272",
            modified_on: "2023-04-06 06:41:11.302000+00:00",
            plan_id: "63eb32769b5e4daf6b588207",
            plan_reference_id: "prod_NM0aQTO38msDkq",
            subscription_reference_id: "",
            trial_subscription: false,
            user_id: "63f89011251cc82aeebfcae5",
            valid_till: "2023-05-06 00:00:00+00:00",
          },
          trial_days: 30,
          upload_csv: true,
          wallet_address_limit: -1,
          whale_pod_address_limit: -1,
          whale_pod_limit: -1,
          influencer_pod_limit: -1,
        };
        // free pricing
        window.sessionStorage.setItem(
          "currentPlan",
          JSON.stringify({
            ...plan,
            influencer_pod_limit: -1,
          })
        );
        // window.sessionStorage.setItem(
        //   "currentPlan",
        //   JSON.stringify({
        //     ...res.data.data?.current_plan,
        //     influencer_pod_limit:
        //       res.data.data?.current_plan.name === "Free" ? 1 : -1,
        //   })
        // );
        window.sessionStorage.setItem("lochToken", token);
        const userId = window.sessionStorage.getItem("lochDummyUser");

        // reset redux
        ctx.props.setPageFlagDefault && ctx.props.setPageFlagDefault();
        // if (res.data.data.is_new_user) {
        //   signUpProperties({
        //     email_address: res.data.data.user?.email,
        //     userId: res.data.data.user?.link,
        //     first_name: res.data.data.user?.first_name,
        //     last_name: res.data.data.user?.last_name,
        //   });

        // } else {

        //   signInUser({
        //     email_address: res.data.data.user?.email,
        //     userId: res.data.data.user?.link,
        //     first_name: res.data.data.user?.first_name,
        //     last_name: res.data.data.user?.last_name,
        //   });
        // }

        // signin popup general
        // SigninModalTrack({
        //   session_id: getCurrentUser().id,
        //   email_address: res.data.data.user?.email,
        //   from: ctx.props.tracking,
        // });

        // Analytics
        let track = ctx.props.tracking;
        if (ctx.props.tracking === "Sign in button") {
          SigninMenuEmailVerified({
            session_id: getCurrentUser().id,
            email_address: res.data.data.user?.email,
          });
        } else if (ctx.props.tracking === "Whale watching") {
          WhalePopupEmailVerified({
            session_id: getCurrentUser().id,
            email_address: res.data.data.user?.email,
          });
        } else if (ctx.props.tracking === "Wallet connect exchange") {
          ConnectExEmailVerified({
            session_id: getCurrentUser().id,
            email_address: res.data.data.user?.email,
            from: ctx.props.tracking,
          });
        } else if (ctx.props.tracking === "Home connect exchange") {
          ConnectExEmailVerified({
            session_id: getCurrentUser().id,
            email_address: res.data.data.user?.email,
            from: ctx.props.tracking,
          });
        } else if (ctx.props.tracking === "Upgrade sign in popup") {
          UpgradeSignInPopupEmailAdded({
            session_id: getCurrentUser().id,
            email_address: res.data.data.user?.email,
            from: ctx.props.tracking,
          });
        } else if (ctx.props.tracking === "Follow sign in popup") {
          FollowSignInPopupEmailVerified({
            session_id: getCurrentUser().id,
            email_address: res.data.data.user?.email,
          });
        }
        if (ctx.props?.popupType === "general_popup") {
          //
          GeneralPopupEmailVerified({
            session_id: getCurrentUser().id,
            email_added: res.data.data.user?.email,
            from: ctx.props?.tracking,
          });
          track = "generic pop up";
        }

        if (ctx?.state?.tracking === "Create or sign in from Upgrade pop up") {
          track = ctx?.state?.tracking;
        }
        signInUser({
          email_address: res.data.data.user?.email,
          userId: res.data.data.user?.link,
          first_name: res.data.data.user?.first_name,
          last_name: res.data.data.user?.last_name,
          track: track,
        });
        ctx.setState(
          {
            isOptInValid: false,
          },
          () => {
            if (ctx.props.stopUpdate) {
              window.sessionStorage.removeItem("lochDummyUser");
              let obj = JSON.parse(window.sessionStorage.getItem("lochUser"));
              obj = {
                ...obj,
                first_name: res.data.data.user?.first_name,
                last_name: res.data.data.user?.last_name,
                email: res.data.data.user?.email,
                mobile: res.data.data.user?.mobile,
                link: res.data.data.user?.link,
              };

              window.sessionStorage.setItem("lochUser", JSON.stringify(obj));

              const allChains = ctx.props.OnboardingState.coinsList;
              let addWallet = [];
              const apiResponse = res.data.data;
              for (
                let i = 0;
                i < apiResponse?.user?.user_wallets?.length;
                i++
              ) {
                let obj = {}; // <----- new Object
                // obj['address'] = apiResponse.user.wallets[i].address;
                obj["address"] = apiResponse?.user?.user_wallets[i]?.address;

                // obj['displayAddress'] = apiResponse.user.wallets[i]?.display_address;
                obj["displayAddress"] =
                  apiResponse.user.user_wallets[i]?.display_address;
                // const chainsDetected =
                //   apiResponse.wallets[apiResponse?.user?.user_wallets[i]?.address]
                //     .chains;

                const chainsDetected =
                  apiResponse.wallets[
                    apiResponse?.user?.user_wallets[i]?.address
                  ]?.chains ||
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
                obj["wallet_metadata"] =
                  apiResponse?.user?.user_wallets[i]?.wallet;
                obj["id"] = `wallet${i + 1}`;

                let chainLength =
                  apiResponse.wallets[
                    apiResponse?.user?.user_wallets[i]?.address
                  ]?.chains?.length ||
                  apiResponse.wallets[
                    apiResponse?.user?.user_wallets[i]?.address.toLowerCase()
                  ]?.chains?.length;

                obj["coinFound"] = chainLength > 0 ? true : false;

                obj["nickname"] = apiResponse?.user?.user_wallets[i]?.nickname;
                obj["showAddress"] =
                  apiResponse?.user?.user_wallets[i]?.nickname === ""
                    ? true
                    : false;
                obj["showNickname"] =
                  apiResponse?.user?.user_wallets[i]?.nickname !== ""
                    ? true
                    : false;
                obj["apiAddress"] = apiResponse?.user?.user_wallets[i]?.address;
                obj["nameTag"] = apiResponse.user.user_wallets[i].tag
                  ? apiResponse.user.user_wallets[i].tag
                  : "";
                obj["showNameTag"] = apiResponse.user.user_wallets[i].tag
                  ? true
                  : false;

                addWallet.push(obj);
              }
              window.sessionStorage.setItem(
                "addWallet",
                JSON.stringify(addWallet)
              );
              addLocalWalletList(JSON.stringify(addWallet));
              //  console.log("only sign");
              setTimeout(() => {
                ctx.state.onHide();
                // console.log("reload")
                window.location.reload();
              }, 3000);
            } else {
              if (userId) {
                // if dummy user
                // for whale watach it will overwirte data
                //  console.log("only whale watch for both new and old");
                let userdata = new URLSearchParams();
                userdata.append("old_user_id", userId);
                UpdateUserDetails(userdata, ctx);
              } else {
                // console.log("welcome upgrade signin")
                let obj = JSON.parse(window.sessionStorage.getItem("lochUser"));
                obj = {
                  ...obj,
                  first_name: "",
                  last_name: "",
                  email: res.data.data.user?.email,
                  mobile: "",
                  link: res.data.data.user?.link,
                };
                window.sessionStorage.setItem("lochUser", JSON.stringify(obj));

                // update wallet
                const apiResponse = res.data.data;
                if (apiResponse?.user) {
                  let newAddWallet = [];
                  const allChains = ctx.props.OnboardingState.coinsList;
                  // console.log("res ", apiResponse)
                  for (
                    let i = 0;
                    i < apiResponse.user?.user_wallets?.length;
                    i++
                  ) {
                    let obj = {}; // <----- new Object
                    obj["address"] = apiResponse.user?.user_wallets[i].address;

                    obj["displayAddress"] =
                      apiResponse.user?.user_wallets[i]?.display_address;
                    obj["wallet_metadata"] =
                      apiResponse.user?.user_wallets[i].wallet;
                    obj["id"] = `wallet${i + 1}`;

                    // const chainsDetected =
                    //   apiResponse.wallets[
                    //     apiResponse.user?.user_wallets[i].address
                    //   ].chains;
                    const chainsDetected =
                      apiResponse.wallets[
                        apiResponse?.user?.user_wallets[i]?.address
                      ]?.chains ||
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

                    // obj["coinFound"] =
                    //   apiResponse.wallets[
                    //     apiResponse.user?.user_wallets[i].address
                    //   ].chains.length > 0
                    //     ? true
                    //     : false;
                    let chainLength =
                      apiResponse.wallets[
                        apiResponse.user?.user_wallets[i]?.address
                      ]?.chains?.length ||
                      apiResponse.wallets[
                        apiResponse.user?.user_wallets[i]?.address.toLowerCase()
                      ]?.chains?.length;
                    obj["coinFound"] = chainLength > 0 ? true : false;

                    obj["nickname"] =
                      apiResponse.user?.user_wallets[i]?.nickname;
                    obj["showAddress"] =
                      apiResponse.user?.user_wallets[i]?.nickname === ""
                        ? true
                        : false;
                    obj["showNickname"] =
                      apiResponse.user?.user_wallets[i]?.nickname !== ""
                        ? true
                        : false;
                    obj["nameTag"] = apiResponse.user.user_wallets[i].tag
                      ? apiResponse.user.user_wallets[i].tag
                      : "";
                    obj["showNameTag"] = apiResponse.user.user_wallets[i].tag
                      ? true
                      : false;
                    obj["apiAddress"] =
                      apiResponse.user?.user_wallets[i]?.address;

                    newAddWallet.push(obj);
                  }

                  window.sessionStorage.setItem(
                    "addWallet",
                    JSON.stringify(newAddWallet)
                  );
                }

                if (ctx.AddEmailModal) {
                  // for upgrade
                  ctx.AddEmailModal();
                } else {
                  setTimeout(() => {
                    ctx.state.onHide();
                  }, 3000);
                }
              }
            }
          }
        );
        if (isOptValid) {
          if (ctx.emailIsVerified) {
            ctx.emailIsVerified();
          } else {
            toast.success(`Email verified`);
          }
        }

        // console.log("user id ", userId)
      } else if (res.data.error === true) {
        // invalid otp
        ctx.setState({
          isOptInValid: true,
        });
      }
    })
    .catch((err) => {
      console.log("err", err);
    });
};

// Update user details

export const UpdateUserDetails = (data, ctx) => {
  postLoginInstance
    .post("organisation/user/update-user-details", data)
    .then((res) => {
      if (!res.data.error) {
        // Analytics
        WhaleCreateAccountEmailVerified({
          session_id: res.data.data.user.link,
          email_address: res.data.data.user.email
            ? res.data.data.user.email
            : ctx.state.email,
        });
        // window.sessionStorage.setItem("lochDummyUser", null);g
        window.sessionStorage.removeItem("lochDummyUser");
        let obj = JSON.parse(window.sessionStorage.getItem("lochUser"));
        obj = {
          ...obj,
          first_name: ctx.state.firstName,
          last_name: ctx.state.lastName,
          email: res.data.data.user.email
            ? res.data.data.user.email
            : ctx.state.email,
          mobile: ctx.state.mobileNumber,
          link: res.data.data.user.link,
        };
        window.sessionStorage.setItem("lochUser", JSON.stringify(obj));
        // toast.success(" Your wallets and pods has been saved");
        if (ctx.AddEmailModal) {
          // for upgrade
          ctx.AddEmailModal();
        } else {
          // for whale watch
          ctx.state.onHide();
        }
      }
    })
    .catch((err) => {
      console.log("err", err);
    });
};

// get-all-plans
export const GetAllPlan = () => {
  return async function () {
    postLoginInstance
      .post("commerce/plan/get-all-plans")
      .then((res) => {
        if (!res.data.error) {
          // Analytics

          window.sessionStorage.setItem(
            "Plans",
            JSON.stringify(res.data.data.plans)
          );
          // toast.success(" Your wallets and pods has been saved");
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
};

export const GetDefaultPlan = () => {
  postLoginInstance
    .post("commerce/plan/get-default-plan")
    .then((res) => {
      if (!res.data.error) {
        // Analytics

        // free pricing
        let plan = {
          defi_enabled: true,
          export_address_limit: -1,
          id: "63eb32769b5e4daf6b588207",
          is_default: false,
          is_trial: false,
          name: "Sovereign",
          notifications_limit: -1,
          notifications_provided: true,
          plan_reference_id: "prod_NM0aQTO38msDkq",
          subscription: {
            active: true,
            created_on: "2023-04-06 06:41:11.302000+00:00",
            id: "642e69878cc994b64ca49272",
            modified_on: "2023-04-06 06:41:11.302000+00:00",
            plan_id: "63eb32769b5e4daf6b588207",
            plan_reference_id: "prod_NM0aQTO38msDkq",
            subscription_reference_id: "",
            trial_subscription: false,
            user_id: "63f89011251cc82aeebfcae5",
            valid_till: "2023-05-06 00:00:00+00:00",
          },
          trial_days: 30,
          upload_csv: true,
          wallet_address_limit: -1,
          whale_pod_address_limit: -1,
          whale_pod_limit: -1,
          influencer_pod_limit: -1,
        };
        // free pricing
        window.sessionStorage.setItem(
          "currentPlan",
          JSON.stringify({
            ...plan,
            influencer_pod_limit: -1,
          })
        );

        // window.sessionStorage.setItem(
        //   "currentPlan",
        //   JSON.stringify({
        //     ...res.data.data.plan,
        //     influencer_pod_limit: res.data.data.plan.name === "Free" ? 1 : -1,
        //   })
        // );

        // toast.success(" Your wallets and pods has been saved");
      }
    })
    .catch((err) => {
      console.log("err", err);
    });
};

// get-all-plans
export const CreatePyment = (data, ctx) => {
  postLoginInstance
    .post("commerce/payment/create-payment", data)
    .then((res) => {
      if (!res.data.error) {
        // Analytics
        ctx.setState({
          payment_link: res.data.data.payment.payment_url,
        });

        // toast.success(" Your wallets and pods has been saved");
      }
    })
    .catch((err) => {
      console.log("err", err);
    });
};

export const getUser = (ctx = null, showToast = false) => {
  return async function () {
    postLoginInstance.post("organisation/user/get-user").then((res) => {
      if (!res.data.error) {
        // free pricing
        let plan = {
          defi_enabled: true,
          export_address_limit: -1,
          id: "63eb32769b5e4daf6b588207",
          is_default: false,
          is_trial: false,
          name: "Sovereign",
          notifications_limit: -1,
          notifications_provided: true,
          plan_reference_id: "prod_NM0aQTO38msDkq",
          subscription: {
            active: true,
            created_on: "2023-04-06 06:41:11.302000+00:00",
            id: "642e69878cc994b64ca49272",
            modified_on: "2023-04-06 06:41:11.302000+00:00",
            plan_id: "63eb32769b5e4daf6b588207",
            plan_reference_id: "prod_NM0aQTO38msDkq",
            subscription_reference_id: "",
            trial_subscription: false,
            user_id: "63f89011251cc82aeebfcae5",
            valid_till: "2023-05-06 00:00:00+00:00",
          },
          trial_days: 30,
          upload_csv: true,
          wallet_address_limit: -1,
          whale_pod_address_limit: -1,
          whale_pod_limit: -1,
          influencer_pod_limit: -1,
        };
        // free pricing
        window.sessionStorage.setItem(
          "currentPlan",
          JSON.stringify({
            ...plan,
            influencer_pod_limit: -1,
          })
        );
        // window.sessionStorage.setItem(
        //   "currentPlan",
        //   JSON.stringify({
        //     ...res.data.data.current_plan,
        //     influencer_pod_limit:
        //       res.data.data.current_plan.name === "Free" ? 1 : -1,
        //   })
        // );

        if (ctx?.props?.location?.state?.isVerified) {
          let obj = {
            first_name: res.data.data.user?.first_name,
            last_name: res.data.data.user?.last_name,
            email: res.data.data.user?.email,
            mobile: res.data.data.user?.mobile,
            link: res.data.data.user?.link,
          };

          window.sessionStorage.setItem("lochUser", JSON.stringify(obj));
        }
        if (
          ctx?.props?.location?.search === "?status=success" ||
          showToast === true
        ) {
          // console.log(ctx,showToast)
          toast.success(
            <div
              style={{
                width: "38rem",
              }}
            >
              {res.data.data.current_plan.name === "Trial"
                ? `Congratulations you’re a sovereign for a day!`
                : `Congratulations! You’re
            officially a ${res.data.data.current_plan.name}.`}
            </div>
          );
          if (showToast) {
          } else {
            ctx.props.history.replace("/home");
          }
        }
      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    });
  };
};

export const GetAuthUrl = (data, ctx) => {
  postLoginInstance
    .post("organisation/user/get-authorize-url", data)
    .then((res) => {
      if (!res.data.error) {
        ctx.setState({
          AuthUrl: res?.data?.data?.url,
        });
      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    });
};

export const updateAccessToken = (data, ctx, name) => {
  // console.log("this",name)
  postLoginInstance
    .post("organisation/user/update-access-token", data)
    .then((res) => {
      if (!res.data.error) {
        // ctx.setState({
        //   AuthUrl: res?.data?.data?.url,
        // });
        if (ctx.props.tracking === "home page") {
          Home_CE_OAuthCompleted({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
            exchange_name: name,
          });
        } else if (ctx.props.tracking === "landing page") {
          LP_CE_OAuthCompleted({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
            exchange_name: name,
          });
        } else if (ctx.props.tracking === "wallet page") {
          Wallet_CE_OAuthCompleted({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
            exchange_name: name,
          });
        }
        ctx.setState({
          isLoadingbtn: false,
        });
        if (ctx.props.ishome) {
          toast.success(`${name} connected to loch`);
          ctx.handleUpdateList();
          setTimeout(() => {
            //  ctx.props.handleBackConnect(ctx.state.connectExchangesList);
            ctx.handleBack();
            //  toast.success(`${name} connected to loch`);
          }, 200);
        } else {
          toast.success(`${name} connected to loch`);
          ctx.state.onHide();
          // window.location.reload();
          setTimeout(() => {
            ctx.props.setPageFlagDefault();
            ctx.props?.handleUpdate && ctx.props.handleUpdate();
            ctx.props.openPopup();
          }, 1000);
        }
      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    });
};

// Nametag API
export const detectNameTag = (
  wallet,
  ctx = null,
  isCohort = false,
  index = 0
) => {
  return function (dispatch, getState) {
    let data = new URLSearchParams();
    data.append("address", wallet.address);
    postLoginInstance
      .post("wallet/user-wallet/get-nametag", data)
      .then((res) => {
        if (
          !res.error &&
          res.data &&
          res.data.data &&
          res.data.data.result &&
          res.data.data.result.length > 0
        ) {
          if (res.data.data.result[0] && ctx) {
            const resNameTag = res.data.data.result[0];
            if (ctx.handleSetNameTag) {
              ctx.handleSetNameTag({ ...wallet }, resNameTag);
            }
          } else {
            if (ctx.handleSetNameTag) {
              ctx.handleSetNameTag({ ...wallet }, "");
            }
            if (ctx.handleSetNameTagLoadingFalse) {
              ctx.handleSetNameTagLoadingFalse({ ...wallet });
            }
          }
        } else {
          if (ctx.handleSetNameTag) {
            ctx.handleSetNameTag({ ...wallet }, "");
          }
          if (ctx.handleSetNameTagLoadingFalse) {
            ctx.handleSetNameTagLoadingFalse({ ...wallet });
          }
        }
      })
      .catch((err) => {
        // console.log("Catch", err);
        if (ctx.handleSetNameTagLoadingFalse) {
          ctx.handleSetNameTagLoadingFalse({ ...wallet });
        }
        if (ctx.handleSetNameTag) {
          ctx.handleSetNameTag({ ...wallet }, "");
        }
      });
  };
};
// api page flage

export const updateWalletListFlag = (page, status) => {
  let payload = {};
  payload[page] = status;
  return async function (dispatch, getState) {
    dispatch({
      type: WALLET_LIST_UPDATED,
      payload: { ...payload },
    });
  };
};

// set page flags to false

export const setPageFlagDefault = () => {
  return async function (dispatch, getState) {
    dispatch({
      type: SET_DEFAULT_VALUE,
    });
  };
};

// set page flags to false for top accont pages

export const TopsetPageFlagDefault = () => {
  return function (dispatch, getState) {
    dispatch({
      type: TOP_SET_DEFAULT_VALUE,
    });
  };
};

// export const PopupState = () => {
//   return function (dispatch, getState) {
//     console.log("ds")
//     dispatch({
//       type: PAGE_POPUP,
//       payload:false
//     });
//   }
// }

// Update crypto payment
export const UpdateCryptoPayment = (data, ctx, userFunction = null) => {
  postLoginInstance
    .post("commerce/payment/update-user-crypto-payment", data)
    .then((res) => {
      if (!res.data.error) {
        userFunction();
      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    });
};

// Signin Wallet
export const SigninWallet = (data, ctx, userFunction = null) => {
  postLoginInstance
    .post("organisation/user/signin-with-wallet", data)
    .then((res) => {
      if (!res.data.error) {
        let token = res.data.data.token;

        // free pricing
        let plan = {
          defi_enabled: true,
          export_address_limit: -1,
          id: "63eb32769b5e4daf6b588207",
          is_default: false,
          is_trial: false,
          name: "Sovereign",
          notifications_limit: -1,
          notifications_provided: true,
          plan_reference_id: "prod_NM0aQTO38msDkq",
          subscription: {
            active: true,
            created_on: "2023-04-06 06:41:11.302000+00:00",
            id: "642e69878cc994b64ca49272",
            modified_on: "2023-04-06 06:41:11.302000+00:00",
            plan_id: "63eb32769b5e4daf6b588207",
            plan_reference_id: "prod_NM0aQTO38msDkq",
            subscription_reference_id: "",
            trial_subscription: false,
            user_id: "63f89011251cc82aeebfcae5",
            valid_till: "2023-05-06 00:00:00+00:00",
          },
          trial_days: 30,
          upload_csv: true,
          wallet_address_limit: -1,
          whale_pod_address_limit: -1,
          whale_pod_limit: -1,
          influencer_pod_limit: -1,
        };
        // free pricing
        window.sessionStorage.setItem(
          "currentPlan",
          JSON.stringify({
            ...plan,
            influencer_pod_limit: -1,
          })
        );

        // window.sessionStorage.setItem(
        //   "currentPlan",
        //   JSON.stringify({
        //     ...res.data.data?.current_plan,
        //     influencer_pod_limit:
        //       res.data.data?.current_plan.name === "Free" ? 1 : -1,
        //   })
        // );
        window.sessionStorage.setItem("lochToken", token);
        const userId = window.sessionStorage.getItem("lochDummyUser");

        // reset redux
        ctx.props.setPageFlagDefault && ctx.props.setPageFlagDefault();
        // if (res.data.data.is_new_user) {
        //   signUpProperties({
        //     email_address: res.data.data.user?.email,
        //     userId: res.data.data.user?.link,
        //     first_name: res.data.data.user?.first_name,
        //     last_name: res.data.data.user?.last_name,
        //   });

        // } else {

        //   signInUser({
        //     email_address: res.data.data.user?.email,
        //     userId: res.data.data.user?.link,
        //     first_name: res.data.data.user?.first_name,
        //     last_name: res.data.data.user?.last_name,
        //   });
        // }
        signInUser({
          email_address: res.data.data.user?.email,
          userId: res.data.data.user?.link,
          first_name: res.data.data.user?.first_name,
          last_name: res.data.data.user?.last_name,
          //  track:"metamask wallet"
        });
        // signin popup
        //  SigninModalTrack({
        //    session_id: getCurrentUser().id,
        //    email_address: res.data.data.user?.email,
        //    from: ctx.props.tracking,
        //  });
        if (ctx.props.stopUpdate) {
          window.sessionStorage.removeItem("lochDummyUser");
          let obj = JSON.parse(window.sessionStorage.getItem("lochUser"));
          obj = {
            ...obj,
            first_name: res.data.data.user?.first_name,
            last_name: res.data.data.user?.last_name,
            email: res.data.data.user?.email,
            mobile: res.data.data.user?.mobile,
            link: res.data.data.user?.link,
          };

          window.sessionStorage.setItem("lochUser", JSON.stringify(obj));

          const allChains = ctx.props.OnboardingState.coinsList;
          let addWallet = [];
          const apiResponse = res.data.data;
          for (let i = 0; i < apiResponse?.user?.user_wallets?.length; i++) {
            let obj = {}; // <----- new Object
            // obj['address'] = apiResponse.user.wallets[i].address;
            obj["address"] = apiResponse?.user?.user_wallets[i]?.address;

            // obj['displayAddress'] = apiResponse.user.wallets[i]?.display_address;
            obj["displayAddress"] =
              apiResponse.user.user_wallets[i]?.display_address;
            // const chainsDetected =
            //   apiResponse.wallets[apiResponse?.user?.user_wallets[i]?.address]
            //     .chains;

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
            obj["wallet_metadata"] = apiResponse?.user?.user_wallets[i]?.wallet;
            obj["id"] = `wallet${i + 1}`;

            let chainLength =
              apiResponse.wallets[apiResponse?.user?.user_wallets[i]?.address]
                ?.chains?.length ||
              apiResponse.wallets[
                apiResponse?.user?.user_wallets[i]?.address.toLowerCase()
              ]?.chains?.length;

            obj["coinFound"] = chainLength > 0 ? true : false;

            obj["nickname"] = apiResponse?.user?.user_wallets[i]?.nickname;
            obj["showAddress"] =
              apiResponse?.user?.user_wallets[i]?.nickname === ""
                ? true
                : false;
            obj["showNickname"] =
              apiResponse?.user?.user_wallets[i]?.nickname !== ""
                ? true
                : false;
            obj["nameTag"] = apiResponse.user.user_wallets[i].tag
              ? apiResponse.user.user_wallets[i].tag
              : "";
            obj["showNameTag"] = apiResponse.user.user_wallets[i].tag
              ? true
              : false;
            obj["apiAddress"] = apiResponse?.user?.user_wallets[i]?.address;

            addWallet.push(obj);
          }
          window.sessionStorage.setItem("addWallet", JSON.stringify(addWallet));
          addLocalWalletList(JSON.stringify(addWallet));

          setTimeout(() => {
            ctx.state.onHide();
            // console.log("reload")
            window.location.reload();
          }, 1000);
        } else {
          if (userId) {
            let userdata = new URLSearchParams();
            userdata.append("old_user_id", userId);
            UpdateUserDetails(userdata, ctx);
          } else {
            let obj = JSON.parse(window.sessionStorage.getItem("lochUser"));
            obj = {
              ...obj,
              first_name: "",
              last_name: "",
              email: res.data.data.user?.email,
              mobile: "",
              link: res.data.data.user?.link,
            };
            window.sessionStorage.setItem("lochUser", JSON.stringify(obj));

            // update wallet
            const apiResponse = res.data.data;
            if (apiResponse?.user) {
              let newAddWallet = [];
              const allChains = ctx.props.OnboardingState.coinsList;
              // console.log("res ", apiResponse)
              for (let i = 0; i < apiResponse.user?.user_wallets?.length; i++) {
                let obj = {}; // <----- new Object
                obj["address"] = apiResponse.user?.user_wallets[i].address;

                obj["displayAddress"] =
                  apiResponse.user?.user_wallets[i]?.display_address;
                obj["wallet_metadata"] =
                  apiResponse.user?.user_wallets[i].wallet;
                obj["id"] = `wallet${i + 1}`;

                // const chainsDetected =
                //   apiResponse.wallets[
                //     apiResponse.user?.user_wallets[i].address
                //   ].chains;
                const chainsDetected =
                  apiResponse.wallets[
                    apiResponse?.user?.user_wallets[i]?.address
                  ]?.chains ||
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

                // obj["coinFound"] =
                //   apiResponse.wallets[
                //     apiResponse.user?.user_wallets[i].address
                //   ].chains.length > 0
                //     ? true
                //     : false;
                let chainLength =
                  apiResponse.wallets[
                    apiResponse.user?.user_wallets[i]?.address
                  ]?.chains?.length ||
                  apiResponse.wallets[
                    apiResponse.user?.user_wallets[i]?.address.toLowerCase()
                  ]?.chains?.length;
                obj["coinFound"] = chainLength > 0 ? true : false;

                obj["nickname"] = apiResponse.user?.user_wallets[i]?.nickname;
                obj["showAddress"] =
                  apiResponse.user?.user_wallets[i]?.nickname === ""
                    ? true
                    : false;
                obj["showNickname"] =
                  apiResponse.user?.user_wallets[i]?.nickname !== ""
                    ? true
                    : false;
                obj["nameTag"] = apiResponse.user.user_wallets[i].tag
                  ? apiResponse.user.user_wallets[i].tag
                  : "";
                obj["showNameTag"] = apiResponse.user.user_wallets[i].tag
                  ? true
                  : false;
                obj["apiAddress"] = apiResponse.user?.user_wallets[i]?.address;

                newAddWallet.push(obj);
              }

              window.sessionStorage.setItem(
                "addWallet",
                JSON.stringify(newAddWallet)
              );
              addLocalWalletList(JSON.stringify(newAddWallet));
            }

            if (userFunction) {
              userFunction();
            } else {
              //  console.log("whale");
              ctx.state.onHide();
            }
          }
        }
      } else {
        toast.error(res.data.message || "Something Went Wrong");
      }
    });
};

// Update crypto payment
export const CreateUserLandingPage = (data, ctx) => {
  postLoginInstance.post("organisation/user/signup", data).then((res) => {
    if (!res.data.error) {
      // userFunction();
      ctx.setState({
        emailAdded: true,
        is_new_user: res.data.data.is_new_user,
      });

      setTimeout(() => {
        ctx.props.history.push("/welcome");
      }, 5000);
    } else {
      toast.error(res.data.message || "Something Went Wrong");
    }
  });
};
