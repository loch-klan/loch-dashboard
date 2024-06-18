import moment from "moment";
import { toast } from "react-toastify";
import { preLoginInstance } from "../../utils";
import {
  ConnectExEmailVerified,
  CopyTradeSignInPopupEmailVerified,
  FollowSignInPopupEmailVerified,
  GeneralPopupEmailVerified,
  Home_CE_OAuthCompleted,
  LP_CE_OAuthCompleted,
  LochPointsSignInPopupEmailVerified,
  SignInModalOTPverified,
  UpgradeSignInPopupEmailAdded,
  Wallet_CE_OAuthCompleted,
  WhalePopupEmailVerified,
  signInUser,
  signUpProperties,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser, setLocalStoraage } from "../../utils/ManageToken";
import { whichSignUpMethod } from "../../utils/ReusableFunctions";
import { DARK_MODE } from "../intelligence/ActionTypes";
import { YIELD_POOLS } from "../yieldOpportunities/ActionTypes";
import postLoginInstance from "./../../utils/PostLoginAxios";
import {
  CURRENT_USER_PAYMENT_PLAN,
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
        window.localStorage.setItem(
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
        window.localStorage.setItem("lochToken", res.data.data.token);
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

export const CheckPremiumAfterAPI = () => {
  return function (dispatch, getState) {
    dispatch({
      type: CURRENT_USER_PAYMENT_PLAN,
      payload: Math.random(),
    });
  };
};
export const SwitchDarkMode = (passedData) => {
  return function (dispatch, getState) {
    dispatch({
      type: DARK_MODE,
      payload: passedData,
    });
  };
};

export const removeAddressFromNotify = (passedData, funCall) => {
  return async function (dispatch, getState) {
    postLoginInstance
      .post("wallet/user-wallet/cancel-user-notification", passedData)
      .then((res) => {
        if (res.data && !res.data.error) {
          toast.success("Notification removed successfully");
          if (funCall) {
            funCall();
          }
        }
      })
      .catch(() => {
        toast.error("Something went wrong");
      });
  };
};
export const createUserPayment = (passedData, stopCreditBtnLoading) => {
  return async function (dispatch, getState) {
    postLoginInstance
      .post("commerce/payment/create-payment", passedData)
      .then((res) => {
        if (stopCreditBtnLoading) {
          stopCreditBtnLoading();
        }
        if (!res.data.error) {
          const redirectUrl = res.data.data?.payment?.payment_url;
          if (redirectUrl) {
            window.open(redirectUrl, "_self");
          }
        } else {
          toast.error("Something went wrong");
        }
      })
      .catch((err) => {
        if (stopCreditBtnLoading) {
          stopCreditBtnLoading();
        }
        toast.error("Something went wrong");
        // console.log("fixwallet",err)
      });
  };
};
export const fixWalletApi = (ctx, info, stopBtnLoading) => {
  postLoginInstance
    .post("organisation/user/update-user", info)
    .then((res) => {
      if (stopBtnLoading) {
        stopBtnLoading();
      }
      if (!res.data.error) {
        ctx.handleRedirection();
        // ctx.props.history.push('/welcome');
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    })
    .catch((err) => {
      if (stopBtnLoading) {
        stopBtnLoading();
      }
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
          if (ctx.hideTheTopBarHistoryItems) {
            ctx.hideTheTopBarHistoryItems();
          }
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
          window.localStorage.setItem(
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
          if (ctx.CheckApiResponseMobileLayout) {
            ctx.CheckApiResponseMobileLayout();
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
                addWallet: JSON.parse(window.localStorage.getItem("addWallet")),
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
          postLoginInstance
            .post("wallet/user-wallet/add-nfts", yieldData)
            .then(() => {
              // const allChains = getState().OnboardingState.coinsList;
            })
            .catch((err) => {});
        } else {
          toast.error(res.data.message || "Something went wrong");
          if (ctx.hideTheTopBarHistoryItems) {
            ctx.hideTheTopBarHistoryItems();
          }
          if (ctx.cancelAddingWallet) {
            // ctx.cancelAddingWallet();
            ctx.setState({
              disableAddBtn: false,
            });
          }
        }
        if (ctx.goToHomeAfterReplace) {
          if (ctx.props.setPageFlagDefault) {
            ctx.props.setPageFlagDefault();
          }
          setTimeout(() => {
            ctx.goToHomeAfterReplace();
          }, 300);
        }
      })
      .catch((err) => {
        if (ctx.goToHomeAfterReplace) {
          ctx.goToHomeAfterReplace();
        }
        if (ctx.cancelAddingWallet) {
          // ctx.cancelAddingWallet();
          ctx.setState({
            disableAddBtn: false,
          });
        }
      });
  };
};

export const verifyEmailApi = (ctx, data, stayOnWelcomePage) => {
  preLoginInstance
    .post("organisation/user/verify-email", data)
    .then((res) => {
      if (!res.data.error) {
        window.localStorage.setItem("lochToken", res.data?.data?.token);
        // window.localStorage.setItem("addWallet", JSON.stringify([]));
        window.localStorage.setItem("stopClick", true);
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
        window.localStorage.setItem(
          "currentPlan",
          JSON.stringify({
            ...plan,
            influencer_pod_limit: -1,
          })
        );
        // actual
        // window.localStorage.setItem(
        //   "currentPlan",
        //   JSON.stringify({...res.data?.data?.current_plan,influencer_pod_limit:
        // res.data.data?.current_plan.name === "Free" ? 1 : -1,} || {})
        // );
        //  let obj = JSON.parse(window.localStorage.getItem("lochUser"));
        let obj = {
          first_name: res.data.data.user?.first_name,
          last_name: res.data.data.user?.last_name,
          email: res.data.data.user?.email,
          mobile: res.data.data.user?.mobile,
          link: res.data.data.user?.link,
          referred_by: res.data.data.user?.referred_by,
        };

        window.localStorage.setItem("lochUser", JSON.stringify(obj));

        // window.localStorage.setItem("defi_access", true);
        // window.localStorage.setItem("isPopup", true);
        // // window.localStorage.setItem("whalepodview", true);
        // window.localStorage.setItem(
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
        getUserAddresses(ctx, stayOnWelcomePage, true);
      } else {
        ctx.setState({ error: true });
      }
    })
    .catch((err) => {
      // console.log("fixwallet",err)
    });
};

// get user detail for chain

export const getUserAddresses = (
  ctx,
  stayOnWelcomePage = false,
  showSuccessMessage = false
) => {
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

      window.localStorage.setItem("addWallet", JSON.stringify(newAddWallet));
      addLocalWalletList(JSON.stringify(newAddWallet));
      setTimeout(() => {
        if (showSuccessMessage) {
          setTimeout(() => {
            toast.success("Congratulations! Your email has been verified");
          }, 1000);
        }
        if (stayOnWelcomePage) {
          ctx.props.history.push({
            pathname: "/welcome",
            state: {
              isVerified: !apiResponse?.wallets ? true : false,
            },
          });
        } else {
          ctx.props.history.push({
            pathname: "/home",
            state: {
              isVerified: !apiResponse?.wallets ? true : false,
            },
          });
        }
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
        window.localStorage.setItem("lochToken", res.data?.data?.token);
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
        window.localStorage.setItem("addWallet", JSON.stringify(newAddWallet));
        addLocalWalletList(JSON.stringify(newAddWallet));

        // window.localStorage.setItem("addWallet", JSON.stringify(walletAddress));
        window.localStorage.setItem("stopClick", true);
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
        window.localStorage.setItem(
          "currentPlan",
          JSON.stringify({
            ...plan,
            influencer_pod_limit: -1,
          })
        );
        // window.localStorage.setItem(
        //   "currentPlan",
        //   JSON.stringify({...res.data?.data?.current_plan,influencer_pod_limit:
        // res.data.data?.current_plan.name === "Free" ? 1 : -1} || {})
        // );
        //  let obj = JSON.parse(window.localStorage.getItem("lochUser"));
        let obj = {
          first_name: res.data.data.user?.first_name,
          last_name: res.data.data.user?.last_name,
          email: res.data.data.user?.email,
          mobile: res.data.data.user?.mobile,
          link: res.data.data.user?.link,
          referred_by: res.data.data.user?.referred_by,
        };
        window.localStorage.setItem("lochUser", JSON.stringify(obj));
        // window.localStorage.setItem("defi_access", true);
        // window.localStorage.setItem("isPopup", true);
        // // window.localStorage.setItem("whalepodview", true);
        // window.localStorage.setItem(
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

export const addUserNotification = (data, successFunCall, errorFunCall) => {
  return async function (dispatch, getState) {
    postLoginInstance
      .post("wallet/user-wallet/add-user-notification", data)
      .then((res) => {
        if (!res.data.error) {
          toast.success(
            <div className="custom-toast-msg">
              <div>Successfully added</div>
              <div className="inter-display-medium f-s-13 lh-16 grey-737 m-t-04">
                Transaction notification
              </div>
            </div>
          );

          if (successFunCall) {
            successFunCall();
          }
        } else {
          toast.error("Something went wrong");
          if (errorFunCall) {
            errorFunCall();
          }
        }
      })
      .catch((err) => {
        toast.error("Something went wrong");
        if (errorFunCall) {
          errorFunCall();
        }
      });
  };
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
          let addWallet = JSON.parse(window.localStorage.getItem("addWallet"));
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
            window.localStorage.setItem("addWallet", JSON.stringify(addWallet));
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

export const sendUserFeedbackApi = (data, addFeedbackPoints) => {
  return async function (dispatch, getState) {
    postLoginInstance
      .post("organisation/user/add-user-feedback", data)
      .then((res) => {
        if (!res.data.error) {
          toast.success("Thank you for your feedback");
          if (addFeedbackPoints) {
            addFeedbackPoints();
          }
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
  setAllCurrencyList([
    {
      active: true,
      code: "AFN",
      id: "63a2e7e86f28b73c887e88c5",
      name: "Afghan Afghani",
      symbol: "Afs",
    },
    {
      active: true,
      code: "ARS",
      id: "63a2e7e86f28b73c887e88ca",
      name: "Argentine Peso",
      symbol: "$",
    },
    {
      active: true,
      code: "AUD",
      id: "63a2e7e86f28b73c887e88cb",
      name: "Australian Dollar",
      symbol: "$",
    },
    {
      active: true,
      code: "BRL",
      id: "63a2e7e86f28b73c887e88d7",
      name: "Brazilian Real",
      symbol: "R$",
    },
    {
      active: true,
      code: "BTC",
      id: "63a2e7e86f28b73c887e88d9",
      name: "Bitcoin",
      symbol: "\u20bf",
    },
    {
      active: true,
      code: "CAD",
      id: "63a2e7e86f28b73c887e88de",
      name: "Canadian Dollar",
      symbol: "$",
    },
    {
      active: true,
      code: "CNY",
      id: "63a2e7e86f28b73c887e88e4",
      name: "Chinese Yuan",
      symbol: "\u00a5",
    },
    {
      active: true,
      code: "COP",
      id: "63a2e7e86f28b73c887e88e5",
      name: "Colombian Peso",
      symbol: "Col$",
    },
    {
      active: true,
      code: "ETH",
      id: "63a2e7e86f28b73c887e88da",
      name: "Ethers",
      symbol: "\u039e",
    },
    {
      active: true,
      code: "EUR",
      id: "63a2e7e86f28b73c887e88f2",
      name: "Euro",
      symbol: "\u20ac",
    },
    {
      active: true,
      code: "GBP",
      id: "63a2e7e86f28b73c887e88f5",
      name: "British Pound Sterling",
      symbol: "\u00a3",
    },
    {
      active: true,
      code: "INR",
      id: "63a2e7e86f28b73c887e8906",
      name: "Indian Rupee",
      symbol: "\u20b9",
    },
    {
      active: true,
      code: "KES",
      id: "63a2e7e86f28b73c887e890e",
      name: "Kenyan Shilling",
      symbol: "KSh",
    },
    {
      active: true,
      code: "NGN",
      id: "63a2e7e86f28b73c887e892c",
      name: "Nigerian Naira",
      symbol: "\u20a6",
    },
    {
      active: true,
      code: "PHP",
      id: "63a2e7e86f28b73c887e8935",
      name: "Philippine Peso",
      symbol: "\u20b1",
    },
    {
      active: true,
      code: "PKR",
      id: "63a2e7e86f28b73c887e8936",
      name: "Pakistani Rupee",
      symbol: "Rs.",
    },
    {
      active: true,
      code: "RUB",
      id: "63a2e7e86f28b73c887e893c",
      name: "Russian Ruble",
      symbol: "\u20bd",
    },
    {
      active: true,
      code: "THB",
      id: "63a2e7e86f28b73c887e894e",
      name: "Thai Baht",
      symbol: "\u0e3f",
    },
    {
      active: true,
      code: "TZS",
      id: "63a2e7e86f28b73c887e8956",
      name: "Tanzanian Shilling",
      symbol: "TZS",
    },
    {
      active: true,
      code: "UAH",
      id: "63a2e7e86f28b73c887e8957",
      name: "Ukrainian Hryvnia",
      symbol: "UAH",
    },
    {
      active: true,
      code: "USD",
      id: "63a2e7e86f28b73c887e8959",
      name: "United States Dollar",
      symbol: "$",
    },
    {
      active: true,
      code: "VND",
      id: "63a2e7e86f28b73c887e895e",
      name: "Vietnamese Dong",
      symbol: "\u20ab",
    },
    {
      active: true,
      code: "ZAR",
      id: "63a2e7e86f28b73c887e896b",
      name: "South African Rand",
      symbol: "R",
    },
  ]);
  // postLoginInstance
  //   .post("common/master/get-all-currencies")
  //   .then((res) => {
  //     console.log("data ", res.data.data.currencies);
  //     if (!res.data.error) {
  //       // console.log('set');
  //     } else {
  //       toast.error(res.data.message || "Something went wrong");
  //     }
  //   })
  //   .catch((err) => {
  //     console.log("err", err);
  //   });
};
export const getAllCurrencyRatesApi = () => {
  window.localStorage.setItem(
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

  // postLoginInstance
  //   .post("common/master/get-currency-rates")
  //   .then((res) => {
  //     if (!res.data.error) {
  //       let currency = JSON.parse(
  //         window.localStorage.getItem("currency")
  //       ) || {
  //         active: true,
  //         code: "USD",
  //         id: "6399a2d35a10114b677299fe",
  //         name: "United States Dollar",
  //         symbol: "$",
  //         rate: 1,
  //       };
  //       for (const [key, value] of Object.entries(res.data.data.rates.rates)) {
  //         // console.log(`${key}: ${value}`);
  //         if (key === currency?.code) {
  //           currency = {
  //             ...currency,
  //             rate: value,
  //           };
  //         }
  //       }
  //       window.localStorage.setItem("currency", JSON.stringify(currency));
  //       window.localStorage.setItem(
  //         "currencyRates",
  //         JSON.stringify(res.data.data.rates)
  //       );
  //     } else {
  //       toast.error(res.data.message || "Something went wrong");
  //     }
  //   })
  //   .catch((err) => {
  //     console.log("err", err);
  //   });
};

// Send Email OTP from whale pod

export const SendOtp = (data, ctx, isForMobile, isCopyTrader, resendOtp) => {
  postLoginInstance
    .post("organisation/user/send-email-otp", data)
    .then((res) => {
      if (!res.data.error) {
        if (resendOtp) {
          toast.success("OTP sent successfully");
        }
        if (isForMobile && ctx.showSignInOtpPage) {
          ctx.showSignInOtpPage();
        }
        if (isCopyTrader && ctx.toggleAuthModal) {
          ctx.toggleAuthModal("verify");
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
        if (isForMobile && ctx.handleError) {
          ctx.handleError();
        }
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

export const VerifyEmail = (
  data,
  ctx,
  passedStopUpdate,
  passedEmail,
  handleVerificationError
) => {
  postLoginInstance
    .post("organisation/user/verify-otp-code", data)
    .then((res) => {
      if (!res.data.error) {
        let isOptValid = res.data.data.otp_verified;
        if (isOptValid) {
          const signUpMethod = whichSignUpMethod();
          SignInModalOTPverified({
            session_id: getCurrentUser().id,
            email_address: passedEmail,
            signUpMethod: signUpMethod,
          });
        }
        let token = res.data.data.token;

        //  window.localStorage.setItem(
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
        window.localStorage.setItem(
          "currentPlan",
          JSON.stringify({
            ...plan,
            influencer_pod_limit: -1,
          })
        );
        // window.localStorage.setItem(
        //   "currentPlan",
        //   JSON.stringify({
        //     ...res.data.data?.current_plan,
        //     influencer_pod_limit:
        //       res.data.data?.current_plan.name === "Free" ? 1 : -1,
        //   })
        // );
        window.localStorage.setItem("lochToken", token);
        const userId = window.localStorage.getItem("lochDummyUser");

        // reset redux
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
        } else if (ctx.props.tracking === "Loch points profile") {
          LochPointsSignInPopupEmailVerified({
            session_id: getCurrentUser().id,
            email_address: res.data.data.user?.email,
            from: ctx.props.tracking,
          });
        } else if (ctx.props.tracking === "Follow sign in popup") {
          FollowSignInPopupEmailVerified({
            session_id: getCurrentUser().id,
            email_address: res.data.data.user?.email,
          });
        } else if (ctx.props.tracking === "Copy trade") {
          CopyTradeSignInPopupEmailVerified({
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
        let obj = JSON.parse(window.localStorage.getItem("lochUser"));
        obj = {
          ...obj,
          first_name: res.data.data.user?.first_name,
          last_name: res.data.data.user?.last_name,
          email: res.data.data.user?.email,
          mobile: res.data.data.user?.mobile,
          link: res.data.data.user?.link,
          referred_by: res.data.data.user?.referred_by,
        };

        window.localStorage.setItem("lochUser", JSON.stringify(obj));

        ctx.setState(
          {
            isOptInValid: false,
          },
          () => {
            if (ctx.props.stopUpdate || passedStopUpdate) {
              window.localStorage.removeItem("lochDummyUser");

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
              window.localStorage.setItem(
                "addWallet",
                JSON.stringify(addWallet)
              );
              addLocalWalletList(JSON.stringify(addWallet));
              //  console.log("only sign");
              setTimeout(() => {
                if (ctx.state.onHide) {
                  if (ctx.verifyOtpSuccessfull) {
                    ctx.verifyOtpSuccessfull();
                  } else {
                    ctx.state.onHide();
                  }
                }
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

                  window.localStorage.setItem(
                    "addWallet",
                    JSON.stringify(newAddWallet)
                  );
                }

                if (ctx.AddEmailModal) {
                  // for upgrade
                  ctx.AddEmailModal();
                } else {
                  setTimeout(() => {
                    if (ctx.state && ctx.state.onHide) {
                      if (ctx.verifyOtpSuccessfull) {
                        ctx.verifyOtpSuccessfull();
                      } else {
                        ctx.state.onHide();
                      }
                    }
                  }, 3000);
                }
              }
            }
            ctx.props.setPageFlagDefault && ctx.props.setPageFlagDefault();
            if (ctx.onVerifiedOtp) {
              ctx.onVerifiedOtp();
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
        if (handleVerificationError) {
          handleVerificationError(true);
        }
        // invalid otp
        ctx.setState({
          isOptInValid: true,
        });
      }
    })
    .catch((err) => {
      if (handleVerificationError) {
        handleVerificationError();
      }
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

        // window.localStorage.setItem("lochDummyUser", null);g
        window.localStorage.removeItem("lochDummyUser");
        let obj = JSON.parse(window.localStorage.getItem("lochUser"));
        obj = {
          ...obj,
          first_name: ctx.state.firstName,
          last_name: ctx.state.lastName,
          email: res.data.data.user.email
            ? res.data.data.user.email
            : ctx.state.email,
          mobile: ctx.state.mobileNumber,
          link: res.data.data.user.link,
          referred_by: res.data.data.user.referred_by,
        };
        window.localStorage.setItem("lochUser", JSON.stringify(obj));
        // toast.success(" Your wallets and pods has been saved");
        if (ctx.AddEmailModal) {
          // for upgrade
          ctx.AddEmailModal();
        } else {
          // for whale watch
          if (ctx.verifyOtpSuccessfull) {
            ctx.verifyOtpSuccessfull();
          } else {
            ctx.state.onHide();
          }
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
    const tempItemHolder = [
      {
        defi_enabled: false,
        export_address_limit: 1,
        id: "63f301edd3d94dbf8162e84a",
        is_default: true,
        is_trial: false,
        name: "Free",
        notifications_limit: 0,
        notifications_provided: false,
        plan_reference_id: "prod_NOEBdez1NVZcuk",
        trial_days: 30,
        upload_csv: true,
        wallet_address_limit: 5,
        whale_pod_address_limit: 5,
        whale_pod_limit: 1,
      },
      {
        defi_enabled: true,
        export_address_limit: -1,
        id: "63f301edd3d94dbf8162e84b",
        is_default: false,
        is_trial: false,
        name: "Baron",
        notifications_limit: 100,
        notifications_provided: true,
        plan_reference_id: "prod_NOEBrbf0jzIxfx",
        prices: [
          {
            active: true,
            billing_scheme: "per_unit",
            created: 1678353991,
            currency: "usd",
            custom_unit_amount: null,
            id: "price_1Mjfk3FKqIbhlomAkPsNOxec",
            livemode: true,
            lookup_key: null,
            metadata: {},
            nickname: null,
            object: "price",
            product: "prod_NOEBrbf0jzIxfx",
            recurring: {
              aggregate_usage: null,
              interval: "month",
              interval_count: 1,
              trial_period_days: null,
              usage_type: "licensed",
            },
            tax_behavior: "exclusive",
            tiers_mode: null,
            transform_quantity: null,
            type: "recurring",
            unit_amount: 9900,
            unit_amount_decimal: "9900",
          },
        ],
        trial_days: 30,
        upload_csv: true,
        wallet_address_limit: 50,
        whale_pod_address_limit: 50,
        whale_pod_limit: 10,
      },
      {
        defi_enabled: true,
        export_address_limit: -1,
        id: "63f301eed3d94dbf8162e84c",
        is_default: false,
        is_trial: false,
        name: "Sovereign",
        notifications_limit: -1,
        notifications_provided: true,
        plan_reference_id: "prod_NOEBIpuFvPRxoo",
        prices: [
          {
            active: true,
            billing_scheme: "per_unit",
            created: 1678354026,
            currency: "usd",
            custom_unit_amount: null,
            id: "price_1MjfkcFKqIbhlomA7pGtztNB",
            livemode: true,
            lookup_key: null,
            metadata: {},
            nickname: null,
            object: "price",
            product: "prod_NOEBIpuFvPRxoo",
            recurring: {
              aggregate_usage: null,
              interval: "month",
              interval_count: 1,
              trial_period_days: null,
              usage_type: "licensed",
            },
            tax_behavior: "exclusive",
            tiers_mode: null,
            transform_quantity: null,
            type: "recurring",
            unit_amount: 99900,
            unit_amount_decimal: "99900",
          },
        ],
        trial_days: 30,
        upload_csv: true,
        wallet_address_limit: -1,
        whale_pod_address_limit: -1,
        whale_pod_limit: -1,
      },
      {
        defi_enabled: true,
        export_address_limit: -1,
        id: "63eb32769b5e4daf6b588208",
        is_default: false,
        is_trial: true,
        name: "Trial",
        notifications_limit: -1,
        notifications_provided: true,
        plan_reference_id: "prod_NUNmkYIJJ1DW8Q",
        prices: [
          {
            active: true,
            billing_scheme: "per_unit",
            created: 1678289703,
            currency: "usd",
            custom_unit_amount: null,
            id: "price_1MjP19FKqIbhlomAnfjJXxwb",
            livemode: true,
            lookup_key: null,
            metadata: {},
            nickname: null,
            object: "price",
            product: "prod_NUNmkYIJJ1DW8Q",
            recurring: null,
            tax_behavior: "exclusive",
            tiers_mode: null,
            transform_quantity: null,
            type: "one_time",
            unit_amount: 500,
            unit_amount_decimal: "500",
          },
        ],
        trial_days: 1,
        upload_csv: true,
        wallet_address_limit: -1,
        whale_pod_address_limit: -1,
        whale_pod_limit: -1,
      },
    ];
    window.localStorage.setItem("Plans", JSON.stringify(tempItemHolder));

    //   postLoginInstance
    //     .post("commerce/plan/get-all-plans")
    //     .then((res) => {
    //       if (!res.data.error) {
    //         // Analytics

    //         window.localStorage.setItem(
    //           "Plans",
    //           JSON.stringify(res.data.data.plans)
    //         );
    //         // toast.success(" Your wallets and pods has been saved");
    //       }
    //     })
    //     .catch((err) => {
    //       console.log("err", err);
    //     });
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
        window.localStorage.setItem(
          "currentPlan",
          JSON.stringify({
            ...plan,
            influencer_pod_limit: -1,
          })
        );

        // window.localStorage.setItem(
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
  return async function (dispatch, getState) {
    postLoginInstance.post("organisation/user/get-user").then((res) => {
      if (!res.data.error) {
        let currentUserPlan = "Free";
        if (res.data?.data?.current_plan?.name) {
          currentUserPlan = res.data.data.current_plan.name;
        }

        window.localStorage.setItem("currentUserPaymentPlan", currentUserPlan);
        dispatch({
          type: CURRENT_USER_PAYMENT_PLAN,
          payload: currentUserPlan,
        });

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
        window.localStorage.setItem(
          "currentPlan",
          JSON.stringify({
            ...plan,
            influencer_pod_limit: -1,
          })
        );
        // window.localStorage.setItem(
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
            referred_by: res.data.data.user?.referred_by,
          };

          window.localStorage.setItem("lochUser", JSON.stringify(obj));
        }
        if (
          ctx?.props?.location?.search === "?status=success" ||
          showToast === true
        ) {
          // console.log(ctx,showToast)
          // toast.success(
          //   <div
          //     style={{
          //       width: "38rem",
          //     }}
          //   >
          //     {res.data.data.current_plan.name === "Trial"
          //       ? `Congratulations you’re a sovereign for a day!`
          //       : `Congratulations! You’re
          //   officially a ${res.data.data.current_plan.name}.`}
          //   </div>
          // );
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

export const setPageFlagDefault = (deleteRecall = false) => {
  return async function (dispatch, getState) {
    if (deleteRecall) {
      window.localStorage.removeItem("shouldRecallApis");
    }
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
        window.localStorage.setItem(
          "currentPlan",
          JSON.stringify({
            ...plan,
            influencer_pod_limit: -1,
          })
        );

        // window.localStorage.setItem(
        //   "currentPlan",
        //   JSON.stringify({
        //     ...res.data.data?.current_plan,
        //     influencer_pod_limit:
        //       res.data.data?.current_plan.name === "Free" ? 1 : -1,
        //   })
        // );
        window.localStorage.setItem("lochToken", token);
        const userId = window.localStorage.getItem("lochDummyUser");

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
          window.localStorage.removeItem("lochDummyUser");
          let obj = JSON.parse(window.localStorage.getItem("lochUser"));
          obj = {
            ...obj,
            first_name: res.data.data.user?.first_name,
            last_name: res.data.data.user?.last_name,
            email: res.data.data.user?.email,
            mobile: res.data.data.user?.mobile,
            link: res.data.data.user?.link,
            referred_by: res.data.data.user?.referred_by,
          };

          window.localStorage.setItem("lochUser", JSON.stringify(obj));

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
          window.localStorage.setItem("addWallet", JSON.stringify(addWallet));
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
            let obj = JSON.parse(window.localStorage.getItem("lochUser"));
            obj = {
              ...obj,
              first_name: "",
              last_name: "",
              email: res.data.data.user?.email,
              mobile: "",
              link: res.data.data.user?.link,
              referred_by: res.data.data.user?.referred_by,
            };
            window.localStorage.setItem("lochUser", JSON.stringify(obj));

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

              window.localStorage.setItem(
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
