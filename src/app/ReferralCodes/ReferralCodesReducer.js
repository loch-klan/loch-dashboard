import { GET_REFERRAL_CODES } from "./ReferralCodesActionTypes";

const INITIAL_STATE = [];

export const ReferralCodesReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_REFERRAL_CODES:
      return action.payload;
    default:
      return state;
  }
};
