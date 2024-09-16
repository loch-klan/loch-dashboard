import { GET_STRATEGY_DISCOVERY_TABLE_DATA } from "./StrategyDiscoveryActionTypes";

const INITIAL_STATE = {};

export const StrategyDiscoveryTableReducer = (
  state = INITIAL_STATE,
  action
) => {
  switch (action.type) {
    case GET_STRATEGY_DISCOVERY_TABLE_DATA:
      return action.payload;
    default:
      return state;
  }
};
