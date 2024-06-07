import { postLoginInstance } from "../../utils";
import { addLocalWalletList } from "../common/Api";
import { YIELD_POOLS } from "../yieldOpportunities/ActionTypes";

export const autoLoginApi = (ctx, redirectTo) => {
  return async function (dispatch, getState) {
    postLoginInstance
      .post("organisation/user/get-user-portfolio")
      .then((res) => {
        if (!res.data.error) {
          if (res.data.data.user) {
            window.localStorage.setItem(
              "lochUser",
              JSON.stringify(res.data.data.user)
            );
          }
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
          window.localStorage.setItem(
            "currentPlan",
            JSON.stringify({
              ...plan,
              influencer_pod_limit: -1,
            })
          );
          window.localStorage.setItem("stopClick", true);

          const allChains = res.data.data.chains;
          let addWallet = [];
          const apiResponse = res.data.data;
          for (let i = 0; i < apiResponse?.user?.user_wallets?.length; i++) {
            let obj = {};
            obj["address"] = apiResponse?.user?.user_wallets[i]?.address;

            obj["displayAddress"] =
              apiResponse.user.user_wallets[i]?.display_address;

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
            addWallet.push(obj);
          }
          if (addWallet) {
            window.localStorage.setItem("addWallet", JSON.stringify(addWallet));
            addLocalWalletList(JSON.stringify(addWallet));
          }
          window.localStorage.setItem("stop_redirect", true);
          if (ctx && ctx.props?.setPageFlagDefault) {
            ctx.props.setPageFlagDefault();
          }
          if (ctx && ctx.props.history) {
            if (redirectTo) {
              ctx.props.history.push(redirectTo);
            } else {
              ctx.props.history.push("/home");
            }
          }
          if (window.localStorage.getItem("lochToken")) {
            postLoginInstance
              .post("wallet/user-wallet/add-yield-pools")
              .then((res) => {
                dispatch({
                  type: YIELD_POOLS,
                  payload: res,
                });
              })
              .catch(() => {});

            postLoginInstance
              .post("wallet/user-wallet/add-nfts")
              .then((res) => {})
              .catch(() => {});
          }
        } else {
          if (ctx && ctx.props.history) {
            ctx.props.history.push("/welcome");
          }
        }
      })
      .catch((err) => {
        if (ctx && ctx.props.history) {
          ctx.props.history.push("/welcome");
        }
      });
  };
};
