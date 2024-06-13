import { toast } from "react-toastify";
import postLoginInstance from "./../../utils/PostLoginAxios";
import { signInUser } from "../../utils/AnalyticsFunctions";
import { LOCH_USER } from "./ActionTypes";
export const updateUser = (data, ctx) => {
  return async function (dispatch, getState) {
    postLoginInstance
      .post("organisation/user/update-user", data)
      .then((res) => {
        if (!res.data.error) {
          // console.log(data)
          let obj = JSON.parse(window.localStorage.getItem("lochUser"));
          obj = {
            ...obj,
            first_name: ctx.state.firstName,
            last_name: ctx.state.lastName,
            email: ctx.state.email,
            mobile: ctx.state.mobileNumber,
            link: ctx.state.link,
            referred_by: ctx.state.referred_by,
          };
          window.localStorage.setItem("lochUser", JSON.stringify(obj));
          dispatch({
            type: LOCH_USER,
            payload: JSON.stringify(obj),
          });
          // toast.success("Profile Successfully Updated");
          // console.log("ctx",ctx)
          if (ctx.props.modalType === "create_account") {
            ctx.props.isSkip();
            // ctx.state.onHide();
          } else {
            if (ctx.state.modalType === "Email") {
              toast.success(
                <div className="custom-toast-msg">
                  <div>Email updated</div>
                  <div className="inter-display-medium f-s-13 lh-16 grey-737 m-t-04">
                    You’ve successfully updated your profile
                  </div>
                </div>
              );
              signInUser({
                email_address: ctx.state.email,
                track: "Email added after metamask connect",
              });
              ctx.state.onHide(true);

              setTimeout(() => {
                window.location.reload();
              }, 500);
            } else {
              signInUser({
                email_address: ctx.state.email,
                userId: ctx.state.link,
                first_name: ctx.state.firstName,
                last_name: ctx.state.lastName,
                mobile: ctx.state.mobileNumber,
                track: "Profile page",
              });
              toast.success(
                <div className="custom-toast-msg">
                  <div>Profile updated</div>
                  <div className="inter-display-medium f-s-13 lh-16 grey-737 m-t-04">
                    You’ve successfully updated your profile
                  </div>
                </div>
              );
            }
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

export const ManageLink = (ctx) => {
  postLoginInstance
    .post("commerce/payment/get-manage-billing-url")
    .then((res) => {
      if (!res.data.error) {
        ctx.setState({
          manageUrl: res.data?.data?.url,
        });
      }
      // console.log(data)
    })
    .catch((err) => {
      console.log("fixwallet", err);
    });
};
export const getUserCredits = (ctx, lochUser) => {
  return async function (dispatch, getState) {
    postLoginInstance
      .post("wallet/user-wallet/get-credits")
      .then((res) => {
        if (ctx) {
          ctx.setState({
            loading: false,
          });
        }
        if (!res.data?.error) {
          if (res.data?.data && res.data.data[0]) {
            const tempHolder = res.data.data[0];
            if (tempHolder.top) {
              ctx.setState({ topPercentage: tempHolder.top });
            }
            if (tempHolder.total) {
              ctx.setState({ lochScore: tempHolder.total });
            }
            if (tempHolder.credits) {
              let tempAnswerHolder = [];
              tempHolder.credits.forEach((minData) => {
                if (!(lochUser && lochUser.email)) {
                  if (minData === "ens_added" || minData === "address_added") {
                    tempAnswerHolder.push(minData);
                  }
                } else {
                  if (minData !== "multiple_address_added") {
                    tempAnswerHolder.push(minData);
                  }
                }
              });
              ctx.setState({ tasksDone: tempAnswerHolder });
            }
          }
        } else {
          toast.error(res.data.message || "Something Went Wrong");
        }
      })
      .catch((err) => {
        if (ctx) {
          ctx.setState({
            loading: false,
          });
        }
        console.log("get credits error ", err);
      });
  };
};
export const addUserCredits = (data, ctx, resetCreditPoints) => {
  return async function (dispatch, getState) {
    postLoginInstance
      .post("wallet/user-wallet/add-credits", data)
      .then((res) => {
        if (resetCreditPoints) {
          resetCreditPoints();
        } else if (ctx && ctx.callApi) {
          ctx.callApi();
        }
      })
      .catch((err) => {
        console.log("add credits error ", err);
      });
  };
};
