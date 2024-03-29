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
          toast.error("Something went wrong");
          if (stopLoader) {
            stopLoader();
          }
        }
      })
      .catch((err) => {
        toast.error("Something went wrong");
        if (stopLoader) {
          stopLoader();
        }
      });
  };
};
export const checkReferallCodeValid = (data, goToSignUp, stopLoader) => {
  return async function (dispatch, getState) {
    postLoginInstance
      .post("organisation/user/valid-ref-code", data)
      .then((res) => {
        if (res.data && !res.data.error) {
          if (goToSignUp) {
            goToSignUp();
          }
        } else {
          toast.error("Invalid Referral Code");
          if (stopLoader) {
            stopLoader();
          }
        }
      })
      .catch((err) => {
        toast.error("Something went wrong");
        if (stopLoader) {
          stopLoader();
        }
      });
  };
};
