import {
  CURRENT_USER_PAYMENT_PLAN,
  LOCAL_ADD_WALLET_LIST,
  PAGE_POPUP,
  SET_COMMON_REDUCER,
  SET_DEFAULT_VALUE,
  TOP_SET_DEFAULT_VALUE,
  WALLET_LIST_UPDATED,
} from "./ActionTypes";

const INITIAL_STATE = {
  profileReferralPage: false,
  nftPage: false,
  mobileLayout: false,
  profilePage: false,
  profilePageWalletModal: false,
  creditPointsBlock: false,
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
  yieldOpportunities: false,
  defi_home: false,
  smart_money: false,
  profile_credit: false,
  gasFeesPage: false,
  counterpartyVolumePage: false,
  emulationsPage: false,
  assetsPage: false,
  realizedGainsPage: false,
  mobilePortfolioPage: false,
  // top account
  top_home: false,
  top_intelligence: false,
  top_asset_value: false,
  top_insight: false,
  top_defi: false,
};
const INITIAL_PAYMENT_STATE = "Free";
export const UserPaymentReducer = (state = INITIAL_PAYMENT_STATE, action) => {
  switch (action.type) {
    case CURRENT_USER_PAYMENT_PLAN:
      return action.payload;
    default:
      return state;
  }
};
export const CommonReducer = (state = INITIAL_STATE, action) => {
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
        profilePage: false,
        profilePageWalletModal: false,
        creditPointsBlock: false,
        home: false,
        intelligence: false,
        asset_value: false,
        insight: false,
        defi: false,
        yieldOpportunities: false,
        transactionHistory: false,
        whaleWatch: false,
        whaleWatchIndividual: false,
        cost: false,
        defi_home: false,
        smart_money: false,
        profile_credit: false,
        gasFeesPage: false,
        counterpartyVolumePage: false,
        emulationsPage: false,
        assetsPage: false,
        realizedGainsPage: false,
        mobilePortfolioPage: false,
        mobileLayout: false,
        nftPage: false,
        profileReferralPage: false,
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
export const AddLocalAddWalletReducer = (state = [], action) => {
  switch (action.type) {
    case LOCAL_ADD_WALLET_LIST:
      return action.payload;
    default:
      return state;
  }
};
