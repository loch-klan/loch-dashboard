import { YIELD_POOLS } from "./ActionTypes";
const INITIAL_STATE = [];
const YieldPoolReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case YIELD_POOLS:
      return action.payload ? action.payload : [];

    default:
      return state;
  }
};
export default YieldPoolReducer;
