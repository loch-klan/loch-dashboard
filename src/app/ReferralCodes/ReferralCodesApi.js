import { toast } from "react-toastify";
import postLoginInstance from "../../utils/PostLoginAxios";
import { GET_REFERRAL_CODES } from "./ReferralCodesActionTypes";

export const getReferallCodes = (stopLoader) => {
  return async function (dispatch, getState) {
    postLoginInstance
      .post("organisation/user/get-referral-codes")
      .then((res) => {
        if (res.data && !res.data.error && res.data.data) {
          dispatch({
            type: GET_REFERRAL_CODES,
            payload: [...res.data.data],
          });
        } else {
          toast.error(res.data.message || "Something went wrong");
          if (stopLoader) {
            stopLoader();
          }
        }
      })
      .catch((err) => {
        console.log("fixwallet", err);
        if (stopLoader) {
          stopLoader();
        }
      });
  };
};
