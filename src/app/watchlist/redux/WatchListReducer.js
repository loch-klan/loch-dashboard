import {
  GET_WATCHLIST_DATA,
  GET_WATCHLIST_DATA_LOADING,
  TOP_ACCOUNT_IN_WATCHLIST,
} from "./ActionTypes";
const INITIAL_STATE = {
  total_count: 0,
  watchlist: [],
};
const INITIAL_TOP_ACCOUNTS_IN_WATCHLIST_STATE = [];
export const WatchListReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_WATCHLIST_DATA:
      return action.payload;
    default:
      return state;
  }
};
export const WatchListLoadingReducer = (state = false, action) => {
  switch (action.type) {
    case GET_WATCHLIST_DATA_LOADING:
      return action.payload;
    default:
      return state;
  }
};
export const TopAccountsInWatchListReducer = (
  state = INITIAL_TOP_ACCOUNTS_IN_WATCHLIST_STATE,
  action
) => {
  switch (action.type) {
    case TOP_ACCOUNT_IN_WATCHLIST:
      return action.payload;
    default:
      return state;
  }
};
