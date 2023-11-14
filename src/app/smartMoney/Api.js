import { toast } from "react-toastify";
import { postLoginInstance, preLoginInstance } from "../../utils";
import { API_LIMIT } from "../../utils/Constant";
import { getCurrentUser, setLocalStoraage } from "../../utils/ManageToken";
import {
  SmartMoneyAddressAdded,
  SmartMoneyAddressAddedAttempted,
  SmartMoneySignIn,
  SmartMoneySignUp,
} from "../../utils/AnalyticsFunctions";

export const getSmartMoney = (data, ctx, apiLimit) => {
  return async function (dispatch, getState) {
    postLoginInstance

      .post("wallet/user-wallet/get-smart-money", data)
      .then((res) => {
        if (!res.data.error) {
          let tempLimit = API_LIMIT;
          if (apiLimit) {
            const numberLimit = Number(apiLimit);
            tempLimit = numberLimit;
          }
          let tableData = res?.data?.data?.accounts?.map((e) => ({
            account: e?.address,
            networth: e?.net_worth,
            tagName: e?.name_tag,
            netflows: e?.net_flow,
            profits: e?.profits,
            returns: e?.returns,
            rank: e?.rank,
          }));
          ctx.setState({
            accountList: tableData,
            tableLoading: false,
            totalPage: Math.ceil(res.data.data.total_count / tempLimit),
          });
        } else {
          toast.error(res.data.message || "Something Went Wrong");
        }
      });
  };
};
export const addSmartMoney = (data, ctx, address, nameTag, email) => {
  SmartMoneyAddressAddedAttempted({
    session_id: getCurrentUser().id,
    email_address: getCurrentUser().email,
    address: address,
    nameTag: nameTag,
  });
  return async function (dispatch, getState) {
    postLoginInstance
      .post("/wallet/user-wallet/add-smart-money", data)
      .then((res) => {
        if (!res.data.error) {
          ctx.setState({
            addButtonVisible: true,
            loadAddBtn: false,
          });
          if (res.data.message === "Successfully added") {
            SmartMoneyAddressAdded({
              session_id: getCurrentUser().id,
              email_address: getCurrentUser().email,
              address: address,
              nameTag: nameTag,
            });
            ctx.setState({
              addressAdded: true,
              addressNotOneMil: false,
              addressAlreadyPresent: false,
            });
          } else if (res.data.message === "Low balance") {
            ctx.setState({
              addressAdded: false,
              addressNotOneMil: true,
              addressAlreadyPresent: false,
            });
          } else if (res.data.message === "Enter a valid wallet address") {
            ctx.setState({
              addressAdded: false,
              addressNotOneMil: false,
              addressAlreadyPresent: false,
            });
            toast.error("Enter a valid wallet address");
          } else if (res.data.message === "Address already used in Loch") {
            ctx.setState({
              addressAdded: false,
              addressNotOneMil: false,
              addressAlreadyPresent: true,
            });
          }
        } else {
          toast.error(res.data.message || "Something Went Wrong");
        }
      });
  };
};
export const smartMoneySignUpApi = (ctx, info, passedEmail) => {
  return async function (dispatch, getState) {
    postLoginInstance
      .post("organisation/user/update-user", info)
      .then((res) => {
        if (!res.data.error) {
          ctx.handleSuccesfulSignUp();
          SmartMoneySignUp({
            session_id: getCurrentUser().id,
            email_address: passedEmail,
          });
        } else {
          toast.error(res.data.message || "Something went wrong");
          ctx.handleSignUpError();
        }
      })
      .catch((err) => {
        // console.log("fixwallet",err)
      });
  };
};

export const smartMoneySignInApi = (data, ctx) => {
  return async function (dispatch, getState) {
    postLoginInstance
      .post("organisation/user/send-email-otp", data)
      .then((res) => {
        if (!res.data.error) {
          if (ctx.handleSuccesfulSignIn) {
            ctx.handleSuccesfulSignIn();
          }
        } else {
          if (ctx.handleSignInError) {
            ctx.handleSignInError();
          }
        }
      })
      .catch((err) => {
        if (ctx.handleSignInError) {
          ctx.handleSignInError();
        }
      });
  };
};

export const VerifySmartMoneyEmailOtp = (data, ctx, passedEmail) => {
  return async function (dispatch, getState) {
    postLoginInstance
      .post("organisation/user/verify-otp-code", data)
      .then((res) => {
        ctx.setState({
          loadingVerificationOtpBtn: false,
        });
        if (!res.data.error) {
          SmartMoneySignIn({
            session_id: getCurrentUser().id,
            email_address: passedEmail,
          });
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

          window.sessionStorage.setItem("lochToken", token);
          setTimeout(() => {
            ctx.props.setPageFlagDefault && ctx.props.setPageFlagDefault();
          }, 500);

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

          if (isOptValid) {
            if (ctx.emailIsVerified) {
              ctx.emailIsVerified();
            } else {
              toast.success(`Email verified`);
            }
          }
        } else if (res.data.error === true) {
          ctx.setState({
            isOptInValid: true,
          });
        }
      })
      .catch((err) => {
        ctx.setState({
          loadingVerificationOtpBtn: false,
        });
        console.log("err", err);
      });
  };
};
export const createAnonymousUserSmartMoneyApi = (data) => {
  return function (dispatch, getState) {
    window.sessionStorage.setItem("stopClick", false);

    window.sessionStorage.setItem("lochToken", "jsk");

    postLoginInstance
      .post("organisation/user/create-user", data)
      .then((res) => {
        if (!res.data.error) {
          window.sessionStorage.setItem(
            "lochDummyUser",
            res.data.data.user.link
          );
          window.sessionStorage.setItem("lochToken", res.data.data.token);

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

          window.sessionStorage.setItem("stopClick", true);
        } else {
          // toast.error(res.data.message || "Something Went Wrong");
        }
      });
  };
};
export const verifyEmailLinkApi = (ctx, data) => {
  preLoginInstance
    .post("organisation/user/verify-email", data)
    .then((res) => {
      if (!res.data.error) {
        window.sessionStorage.setItem("lochToken", res.data?.data?.token);
        window.sessionStorage.setItem("stopClick", true);
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
        window.sessionStorage.setItem(
          "currentPlan",
          JSON.stringify({
            ...plan,
            influencer_pod_limit: -1,
          })
        );

        let obj = {
          first_name: res.data.data.user?.first_name,
          last_name: res.data.data.user?.last_name,
          email: res.data.data.user?.email,
          mobile: res.data.data.user?.mobile,
          link: res.data.data.user?.link,
        };

        window.sessionStorage.setItem("lochUser", JSON.stringify(obj));

        setLocalStoraage();

        // ctx.setState({ error: false });
        ctx.props.history.push({
          pathname: "/smart-money",
        });
      } else {
        // ctx.setState({ error: true });
      }
    })
    .catch((err) => {
      // console.log("fixwallet",err)
    });
};
