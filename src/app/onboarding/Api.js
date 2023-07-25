import { toast } from "react-toastify";
import { postLoginInstance, preLoginInstance } from "../../utils";
import { COINS_LIST, WALLET_LIST, PARENT_COINS_LIST } from "./ActionTypes";
import {
  WalletAddressTextbox,
  EmailAddressVerified,
  UserSignedinCorrectly,
  UserWrongCode,
  EmailNotFound,
  WhaleWalletAddressTextbox,
  setUserProperties,
  signInUser,
  signUpProperties,
} from "../../utils/AnalyticsFunctions.js";
import { getCurrentUser, setLocalStoraage } from "../../utils/ManageToken";
export const getAllCoins = (handleShareLinkUser = null) => {
  return async function (dispatch, getState) {
    let data = new URLSearchParams();
    postLoginInstance
      .post("wallet/chain/get-chains", data)
      .then((res) => {
        let coinsList =
          res.data && res.data.data && res.data.data.chains.length > 0
            ? res.data.data.chains
            : [];
        dispatch({
          type: COINS_LIST,
          payload: coinsList,
        });
        handleShareLinkUser && handleShareLinkUser();
      })
      .catch((err) => {
        // console.log("Catch", err);
      });
  };
};

export const getAllParentChains = () => {
  return async function (dispatch, getState) {
    let data = new URLSearchParams();
    postLoginInstance
      .post("wallet/chain/get-parent-chains", data)
      .then((res) => {
        let coinsList =
          res.data && res.data.data && res.data.data.chains.length > 0
            ? res.data.data.chains
            : [];
        dispatch({
          type: PARENT_COINS_LIST,
          payload: coinsList,
        });
      })
      .catch((err) => {
        // console.log("Catch", err);
      });
  };
};

export const detectCoin = (wallet, ctx = null, isCohort = false, index = 0) => {
  return function (dispatch, getState) {
    let data = new URLSearchParams();
    data.append("chain", wallet.coinCode);
    data.append("wallet_address", wallet.address);
    postLoginInstance
      .post("wallet/chain/detect-chain", data)
      .then((res) => {
        // && res.data.data.chain_detected

        if (!res.error && res.data) {
          if (
            res.data.data.chain_detected &&
            !isCohort &&
            !ctx?.topAccountPage
          ) {
            WalletAddressTextbox({
              session_id: "",
              address: wallet.address,
              chains_detected: wallet.coinName,
            });
          }

          if (isCohort) {
            WhaleWalletAddressTextbox({
              session_id: getCurrentUser().id,
              email_address: getCurrentUser().email,
              address: wallet.address,
              chains_detected: wallet.coinName,
            });
          }

          if (!isCohort && !ctx?.topAccountPage) {
            // wallet.address = res.data.data.wallet_address;
            dispatch({
              type: WALLET_LIST,
              payload: {
                id: wallet.id,
                coinCode: wallet.coinCode,
                coinSymbol: wallet.coinSymbol,
                coinName: wallet.coinName,
                apiaddress: res.data.data.wallet_address,
                address: wallet.address,
                chain_detected: res.data.data.chain_detected,
                coinColor: wallet.coinColor,
                subChains: wallet.subChains,
              },
            });
          }

          if (ctx) {
            // console.log("walletr", res.data.data.wallet_address, wallet);
            ctx.handleSetCoin({
              ...wallet,
              chain_detected: res.data.data.chain_detected,
              apiaddress: res.data.data.wallet_address,
            });

            if (
              ctx?.state.isTopAccountPage &&
              index === ctx?.props?.OnboardingState.parentCoinList?.length - 1
            ) {
              setTimeout(() => {
                ctx?.CalculateOverview && ctx?.CalculateOverview();
              }, 1000);
            }
          }
        }
      })
      .catch((err) => {
        // console.log("Catch", err);
      });
  };
};
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
            ctx.handleSetNameTag({ ...wallet }, resNameTag);
          }
        }
      })
      .catch((err) => {
        // console.log("Catch", err);
      });
  };
};

export const signIn = (ctx, data) => {
  preLoginInstance
    .post("organisation/user/send-otp", data)
    .then((res) => {
      if (res.data.error) {
        // toast.error(
        //   <div className="custom-toast-msg">
        //     <div>
        //     {res.data.message}
        //     </div>
        //     <div className="inter-display-medium f-s-13 lh-16 grey-737 m-t-04">
        //     Please enter a valid email
        //     </div>
        //   </div>
        //   );
        // toast.error(res.data.message || "Something went Wrong")
        ctx.setState({ emailError: true });
        EmailNotFound({ email_address: ctx.state.email });
      } else if (res.data.error === false) {
        //email Valid
        EmailAddressVerified({ email_address: ctx.state.email });
        ctx.setState({
          isVerificationRequired: true,
          text: "",
          emailError: false,
        });
        ctx.props.handleStateChange("verifyCode");
      }
    })
    .catch((err) => {
      // console.log("error while signing",err)
    });
};

export const verifyUser = (ctx, info) => {
  preLoginInstance
    .post("organisation/user/verify-otp", info)
    .then((res) => {
      // console.log(res.data.data.user)
      if (!res.data.error) {
        localStorage.setItem("lochUser", JSON.stringify(res.data.data.user));
        localStorage.setItem("lochToken", res.data.data.token);
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
        localStorage.setItem(
          "currentPlan",
          JSON.stringify({
            ...plan,
            influencer_pod_limit: -1,
          })
        );
        // localStorage.setItem(
        //   "currentPlan",
        //   JSON.stringify({...res.data.data?.current_plan,influencer_pod_limit:
        // res.data.data?.current_plan.name === "Free" ? 1 : -1,})
        // );

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
            apiResponse?.user?.user_wallets[i]?.nickname === "" ? true : false;
          obj["showNickname"] =
            apiResponse?.user?.user_wallets[i]?.nickname !== "" ? true : false;

          addWallet.push(obj);
        }

        // Mixpanel function
        signInUser({
          email_address: res.data.data.user?.email,
          userId: res.data.data.user?.link,
          first_name: res.data.data.user?.first_name,
          last_name: res.data.data.user?.last_name,
          track: "Landing page sign in",
        });
        // console.log("addWallet", addWallet);
        localStorage.setItem("addWallet", JSON.stringify(addWallet));
        ctx.props.history.push({
          pathname: "/home",
          state: { addWallet },
        });
        UserSignedinCorrectly({
          email_address: res.data.data.user.email,
          session_id: res.data.data.user?.link,
        });
      } else {
        UserWrongCode({ email_address: ctx.state.email });
        toast.error(
          <div className="custom-toast-msg">
            <div>{res.data.message}</div>
            <div className="inter-display-medium f-s-13 lh-16 grey-737 m-t-04">
              Please enter a valid otp
            </div>
          </div>
        );
        // toast.error(res.data.message || "Something Went Wrong")
      }
    })
    .catch((err) => {
      console.log("error while verifying", err);
    });
};

export const createAnonymousUserApi = (
  data,
  ctx,
  addWallet,
  userFunction = null
) => {
  // localStorage.setItem('currency',JSON.stringify({
  //         active: true,
  //         code: "USD",
  //         id: "6399a2d35a10114b677299fe",
  //         name: "United States Dollar",
  //         symbol: "$",
  //         rate: 1,
  // }))

  localStorage.setItem("stopClick", false);

  localStorage.setItem("lochToken", "jsk");

  if (!ctx.props.ishome) {
    if (!ctx.state?.podName) {
      !ctx.state?.id &&
        ctx.props?.history.push({
          pathname: ctx.state?.id ? ctx.state?.link : "/home",
          // state: {addWallet: ctx.state.id ? addWallet : newAddWallet}
          state: {
            noLoad: true,
            redirectPath: ctx.state?.redirectPath,
            hash: ctx?.state?.hash,
          },
        });
    }
  }

  postLoginInstance.post("organisation/user/create-user", data).then((res) => {
    // console.log("inside create user function")
    if (!res.data.error) {
      localStorage.setItem("lochDummyUser", res.data.data.user.link);
      localStorage.setItem("lochToken", res.data.data.token);

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
      localStorage.setItem(
        "currentPlan",
        JSON.stringify({
          ...plan,
          influencer_pod_limit: -1,
        })
      );
      // localStorage.setItem(
      //   "currentPlan",
      //   JSON.stringify({...res.data.data.current_plan,influencer_pod_limit:
      // res.data.data?.current_plan.name === "Free" ? 1 : -1,})
      // );

      localStorage.setItem("stopClick", true);

      signUpProperties({
        userId: res.data.data.user.link,
        email_address: "",
        first_name: "",
        last_name: "",
      });

      const allChains = ctx.props.OnboardingState.coinsList;

      let newAddWallet = [];
      const apiResponse = res.data.data;
      // console.log("res ", apiResponse)
      for (let i = 0; i < apiResponse.user.user_wallets.length; i++) {
        let obj = {}; // <----- new Object
        obj["address"] = apiResponse.user.user_wallets[i].address;
        obj["displayAddress"] =
          apiResponse.user.user_wallets[i]?.display_address;
        const chainsDetected =
          apiResponse.wallets[apiResponse.user.user_wallets[i].address]
            ?.chains ||
          apiResponse.wallets[
            apiResponse.user.user_wallets[i].address.toLowerCase()
          ]?.chains;

        obj["coins"] = allChains?.map((chain) => {
          let coinDetected = false;
          chainsDetected?.map((item) => {
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
        obj["wallet_metadata"] = apiResponse.user?.user_wallets[i]?.wallet;
        obj["id"] = `wallet${i + 1}`;
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
        newAddWallet.push(obj);
      }
      if (ctx.state.podName) {
        localStorage.setItem("addWallet", JSON.stringify(newAddWallet));
      } else {
        localStorage.setItem(
          "addWallet",
          JSON.stringify(ctx.state.id ? addWallet : newAddWallet)
        );
      }
      // console.log("wallet", addWallet);
      if (userFunction) {
        // console.log("user function found");
        ctx.getUrl();
        localStorage.setItem("stop_redirect", true);
        setTimeout(() => {
          userFunction();
        }, 100);
      } else {
        //  console.log("user function not found");
        if (ctx.state?.podName) {
          //  console.log("podname login redirect to link", ctx.state?.link);
          ctx.props?.history.push({
            pathname: ctx.state?.link,
          });
        } else {
          // console.log("replace")
          ctx.props.history.replace({
            pathname: ctx.state?.id ? ctx.state?.link : "/home",
            state: {
              addWallet: ctx.state?.id ? addWallet : newAddWallet,
              noLoad: false,
              redirectPath: ctx.state?.redirectPath,
              hash: ctx?.state?.hash,
            },
          });
        }
      }
    } else {
      toast.error(res.data.message || "Something Went Wrong");
    }
  });
};

// create user for app feature
export const AppFeaturesCreateUser = (data, ctx, userFunction = null) => {
  localStorage.setItem("stopClick", false);

  localStorage.setItem("lochToken", "jsk");

  postLoginInstance.post("organisation/user/create-user", data).then((res) => {
    console.log("inside create user function", res);
    if (!res.data.error) {
      localStorage.setItem("lochDummyUser", res.data.data.user.link);
      localStorage.setItem("lochToken", res.data.data.token);

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
      localStorage.setItem(
        "currentPlan",
        JSON.stringify({
          ...plan,
          influencer_pod_limit: -1,
        })
      );
      // localStorage.setItem(
      //   "currentPlan",
      //   JSON.stringify({...res.data.data.current_plan,influencer_pod_limit:
      // res.data.data?.current_plan.name === "Free" ? 1 : -1,})
      // );

      localStorage.setItem("stopClick", true);
      // localStorage.setItem("defi_access", true);
      // localStorage.setItem("isPopup", true);
      // // localStorage.setItem("whalepodview", true);
      // localStorage.setItem(
      //   "whalepodview",
      //   JSON.stringify({ access: true, id: "" })
      // );
      // localStorage.setItem("previewAddress", "");

      //  localStorage.setItem(
      //    "isSubmenu",
      //    JSON.stringify({
      //      me: true,
      //      discover: false,
      //      intelligence: false,
      //      topAccount: false,
      //      topAccountintelligence: false,
      //    })
      //  );
      setLocalStoraage();

      signUpProperties({
        userId: res.data.data.user.link,
        email_address: "",
        first_name: "",
        last_name: "",
      });

      const allChains = ctx.props.OnboardingState.coinsList;

      let newAddWallet = [];
      const apiResponse = res.data.data;
      // console.log("res ", apiResponse)
      for (let i = 0; i < apiResponse.user.user_wallets.length; i++) {
        let obj = {}; // <----- new Object
        obj["address"] = apiResponse.user.user_wallets[i].address;
        obj["displayAddress"] =
          apiResponse.user.user_wallets[i]?.display_address;
        const chainsDetected =
          apiResponse.wallets[apiResponse.user.user_wallets[i].address]
            ?.chains ||
          apiResponse.wallets[
            apiResponse.user.user_wallets[i].address.toLowerCase()
          ]?.chains;

        obj["coins"] = allChains?.map((chain) => {
          let coinDetected = false;
          chainsDetected?.map((item) => {
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
        obj["wallet_metadata"] = apiResponse.user?.user_wallets[i]?.wallet;
        obj["id"] = `wallet${i + 1}`;
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
        newAddWallet.push(obj);
      }
      localStorage.setItem("addWallet", JSON.stringify(newAddWallet));
      if (userFunction) {
        setTimeout(() => {
          userFunction();
        }, 200);
      }
    } else {
      toast.error(res.data.message || "Something Went Wrong");
    }
  });
};
