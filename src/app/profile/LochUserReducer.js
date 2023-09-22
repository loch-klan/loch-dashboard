import { LOCH_USER } from "./ActionTypes";
const INITIAL_STATE = null;
const LochUserReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOCH_USER:
      return action.payload;
    default:
      return state;
  }
};
export default LochUserReducer;
