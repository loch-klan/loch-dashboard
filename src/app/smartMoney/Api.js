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
            following: e?.following,
            notify: e?.notify,
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
export const addSmartMoney = (data, ctx, address, nameTag, isMobile) => {
  SmartMoneyAddressAddedAttempted({
    session_id: getCurrentUser().id,
    email_address: getCurrentUser().email,
    address: address,
    nameTag: nameTag,
    isMobile: isMobile,
  });
  return async function (dispatch, getState) {
    postLoginInstance
      .post("/wallet/user-wallet/add-smart-money", data)
      .then((res) => {
        if (!res.data.error) {
          if (!isMobile) {
            ctx.setState({
              addButtonVisible: true,
              loadAddBtn: false,
            });
          }
          if (res.data.message === "Successfully added") {
            SmartMoneyAddressAdded({
              session_id: getCurrentUser().id,
              email_address: getCurrentUser().email,
              address: address,
              nameTag: nameTag,
              isMobile: isMobile,
            });
            if (isMobile) {
              if (ctx.addressSuccesfullyAdded) {
                ctx.addressSuccesfullyAdded();
              }
            } else {
              ctx.setState({
                addressAdded: true,
                addressAlreadyPresent: false,
                showSignUpPage: false,
                showVerifyEmail: false,
                showSignInPage: false,
                addressNotOneMil: false,
              });
            }
          } else if (res.data.message === "Low balance") {
            if (isMobile) {
              if (ctx.addressLowBalance) {
                ctx.addressLowBalance();
              }
            } else {
              ctx.setState({
                addressNotOneMil: true,
                addressAlreadyPresent: false,
                showSignUpPage: false,
                showVerifyEmail: false,
                showSignInPage: false,
                addressAdded: false,
              });
            }
          } else if (res.data.message === "Enter a valid wallet address") {
            if (isMobile) {
            } else {
              ctx.setState({
                addressAlreadyPresent: false,
                showSignUpPage: false,
                showVerifyEmail: false,
                showSignInPage: false,
                addressAdded: false,
                addressNotOneMil: false,
              });
            }
            toast.error("Enter a valid wallet address");
          } else if (res.data.message === "Address already used in Loch") {
            if (isMobile) {
              if (ctx.addressAlreadyPresent) {
                ctx.addressAlreadyPresent();
              }
            } else {
              ctx.setState({
                addressAlreadyPresent: true,
                showSignUpPage: false,
                showVerifyEmail: false,
                showSignInPage: false,
                addressAdded: false,
                addressNotOneMil: false,
              });
            }
          }
        } else {
          toast.error(res.data.message || "Something Went Wrong");
          if (ctx.handleAddSmartMoneyError) {
            ctx.handleAddSmartMoneyError();
          }
        }
      });
  };
};
export const smartMoneySignUpApi = (ctx, info, passedEmail, isMobile) => {
  return async function (dispatch, getState) {
    postLoginInstance
      .post("organisation/user/update-user", info)
      .then((res) => {
        if (!res.data.error) {
          ctx.handleSuccesfulSignUp();
          SmartMoneySignUp({
            session_id: getCurrentUser().id,
            email_address: passedEmail,
            isMobile: isMobile,
          });
        } else {
          toast.error(res.data.message || "Something went wrong");
          if (isMobile && ctx.handleError) {
            ctx.handleError();
          }
          if (ctx.handleSignUpError) {
            ctx.handleSignUpError();
          }
        }
      })
      .catch((err) => {
        if (isMobile && ctx.handleError) {
          ctx.handleError();
        }
        toast.error("Something Went Wrong");
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
          toast.error("Something Went Wrong");
          if (ctx.handleSignInError) {
            ctx.handleSignInError();
          }
        }
      })
      .catch((err) => {
        toast.error("Something Went Wrong");
        if (ctx.handleSignInError) {
          ctx.handleSignInError();
        }
      });
  };
};

export const VerifySmartMoneyEmailOtp = (data, ctx, passedEmail, isMobile) => {
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
            isMobile: isMobile,
          });
          let isOptValid = res.data.data.otp_verified;
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

          window.localStorage.setItem("lochToken", token);
          setTimeout(() => {
            ctx.props.setPageFlagDefault && ctx.props.setPageFlagDefault();
          }, 500);

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

          if (isOptValid) {
            if (ctx.emailIsVerified) {
              ctx.emailIsVerified();
            } else {
              toast.success(`Email verified`);
            }
          }
        } else if (res.data.error === true) {
          toast.error(
            res.data?.message ? res.data?.message : "Something Went Wrong"
          );
          ctx.setState({
            isOptInValid: true,
          });
          if (isMobile && ctx.handleError) {
            ctx.handleError();
          }
        }
        if (ctx.props.updateWalletListFlag) {
          ctx.props.updateWalletListFlag("mobileLayout", false);
        }
      })
      .catch((err) => {
        toast.error("Something Went Wrong");
        ctx.setState({
          loadingVerificationOtpBtn: false,
        });
      });
  };
};
export const createAnonymousUserSmartMoneyApi = (data) => {
  return function (dispatch, getState) {
    window.localStorage.setItem("stopClick", false);

    window.localStorage.setItem("lochToken", "jsk");

    postLoginInstance
      .post("organisation/user/create-user", data)
      .then((res) => {
        if (!res.data.error) {
          window.localStorage.setItem("lochDummyUser", res.data.data.user.link);
          window.localStorage.setItem("lochToken", res.data.data.token);

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

          window.localStorage.setItem("stopClick", true);
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
        window.localStorage.setItem("lochToken", res.data?.data?.token);
        window.localStorage.setItem("stopClick", true);
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

        let obj = {
          first_name: res.data.data.user?.first_name,
          last_name: res.data.data.user?.last_name,
          email: res.data.data.user?.email,
          mobile: res.data.data.user?.mobile,
          link: res.data.data.user?.link,
          referred_by: res.data.data.user?.referred_by,
        };

        window.localStorage.setItem("lochUser", JSON.stringify(obj));

        setLocalStoraage();

        // ctx.setState({ error: false });
        ctx.props.history.push({
          pathname: "/leaderboard",
        });
      } else {
        // ctx.setState({ error: true });
      }
    })
    .catch((err) => {
      // console.log("fixwallet",err)
    });
};
