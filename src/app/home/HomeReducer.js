import { RECEIVE_POSTS } from "./ActionTypes";
const INITIAL_STATE = {
  otpReceived: false,
  otpCode: "",
  otpVerified: false,
  countryCode: "+91",
  userObj: null,
  cnbcActive: false,
};
const HomeReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case RECEIVE_POSTS:
      return { ...state, json: action.json };
    default:
      return state;
  }
};
export default HomeReducer;
