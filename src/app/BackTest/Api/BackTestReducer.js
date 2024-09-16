import {
  GET_BACK_TEST_CHART_DATA,
  GET_BACK_TEST_QUERIES,
  GET_BACK_TEST_TABLE_DATA,
  GET_LATEST_STRATEGY_ID,
} from "./BackTestActionTypes";

const INITIAL_STATE = {};

export const BackTestChartReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_BACK_TEST_CHART_DATA:
      return action.payload;
    default:
      return state;
  }
};
export const BackTestTableReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_BACK_TEST_TABLE_DATA:
      return action.payload;
    default:
      return state;
  }
};
export const BackTestQueryReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_BACK_TEST_QUERIES:
      return action.payload;
    default:
      return state;
  }
};
export const BackTestLatestStrategyReducer = (
  state = INITIAL_STATE,
  action
) => {
  switch (action.type) {
    case GET_LATEST_STRATEGY_ID:
      return action.payload;
    default:
      return state;
  }
};
