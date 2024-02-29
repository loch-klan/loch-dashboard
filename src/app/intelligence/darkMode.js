import { DARK_MODE } from "./ActionTypes";
const INITIAL_STATE = {
  flag: false,
};
const DarkModeReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DARK_MODE:
      // console.log("dt",action.payload)
      return { flag: action.payload };
    default:
      return state;
  }
};
export default DarkModeReducer;
