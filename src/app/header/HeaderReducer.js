import { LOCAL_WALLET } from "./HeaderActionTypes";
const INITIAL_STATE = {
  wallet: [],
};
const HeaderReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOCAL_WALLET:
      return { wallet: action.payload };

    default:
      return state;
  }
};
export default HeaderReducer;
