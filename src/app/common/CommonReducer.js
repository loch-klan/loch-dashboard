import { PAGE_POPUP, SET_COMMON_REDUCER, SET_DEFAULT_VALUE, WALLET_LIST_UPDATED } from "./ActionTypes";

const INITIAL_STATE = {
  isSidebarOpen: false,
  isPopup:true,
  home: false,
  intelligence: false,
  asset_value: false,
  insight: false,
  defi: false,
  defi_home: false,
  
};

const CommonReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_COMMON_REDUCER:
      return {
        ...state,
        ...action.payload,
      };
    case WALLET_LIST_UPDATED:
      // console.log("value", action.payload);
      return { ...state, ...action.payload };
    case PAGE_POPUP: return {...state, isPopup: action.payload}
    case SET_DEFAULT_VALUE:return {
      ...state,
      home: false,
      intelligence: false,
      asset_value: false,
      insight: false,
      defi: false,
      defi_home:false,
    };
    default:
      return state
  }
};
export default CommonReducer