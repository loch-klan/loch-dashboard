import {
  PAGE_POPUP,
  SET_COMMON_REDUCER,
  SET_DEFAULT_VALUE,
  TOP_SET_DEFAULT_VALUE,
  WALLET_LIST_UPDATED,
} from "./ActionTypes";

const INITIAL_STATE = {
  isSidebarOpen: false,
  isPopup: true,
  home: false,
  intelligence: false,
  transactionHistory: false,
  cost: false,
  whaleWatch: false,
  whaleWatchIndividual: false,
  asset_value: false,
  insight: false,
  defi: false,
  defi_home: false,

  // top account
  top_home: false,
  top_intelligence: false,
  top_asset_value: false,
  top_insight: false,
  top_defi: false,
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
    case PAGE_POPUP:
      return { ...state, isPopup: action.payload };
    case SET_DEFAULT_VALUE:
      return {
        ...state,
        home: false,
        intelligence: false,
        asset_value: false,
        insight: false,
        defi: false,
        transactionHistory: false,
        whaleWatch: false,
        whaleWatchIndividual: false,
        cost: false,
        defi_home: false,
      };
    case TOP_SET_DEFAULT_VALUE:
      return {
        ...state,
        top_home: false,
        top_intelligence: false,
        top_asset_value: false,
        top_insight: false,
        top_defi: false,
      };
    default:
      return state;
  }
};
export default CommonReducer;
