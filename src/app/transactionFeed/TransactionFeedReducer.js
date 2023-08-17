import { YIELD_OPPORTUNITIES } from "./ActionTypes";
const INITIAL_STATE = [];
const YieldOpportunitiesReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case YIELD_OPPORTUNITIES:
      return action.payload ? action.payload : [];

    default:
      return state;
  }
};
export default YieldOpportunitiesReducer;
