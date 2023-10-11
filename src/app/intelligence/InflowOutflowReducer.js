import {
  INFLOW_OUTFLOW_CHART_ASSET_LIST,
  INFLOW_OUTFLOW_CHART_ASSET_SELECTED,
  INFLOW_OUTFLOW_CHART_DATA,
  INFLOW_OUTFLOW_TIME_TAB,
  INFLOW_OUTFLOW_WALLET,
} from "./ActionTypes";
const INITIAL_STATE = null;
const INITIAL_GRAPH_STATE = [];
export const InflowOutflowSelectedAssetReducer = (
  state = INITIAL_STATE,
  action
) => {
  switch (action.type) {
    case INFLOW_OUTFLOW_CHART_ASSET_SELECTED:
      return action.payload;

    default:
      return state;
  }
};
export const InflowOutflowChartReducer = (
  state = INITIAL_GRAPH_STATE,
  action
) => {
  switch (action.type) {
    case INFLOW_OUTFLOW_CHART_DATA:
      return action.payload;

    default:
      return state;
  }
};
export const InflowOutflowAssetListReducer = (
  state = INITIAL_GRAPH_STATE,
  action
) => {
  switch (action.type) {
    case INFLOW_OUTFLOW_CHART_ASSET_LIST:
      return action.payload;

    default:
      return state;
  }
};
export const InflowOutflowTimeTabReducer = (state = "Max", action) => {
  switch (action.type) {
    case INFLOW_OUTFLOW_TIME_TAB:
      return action.payload;

    default:
      return state;
  }
};
export const InflowOutflowWalletReducer = (state = "", action) => {
  switch (action.type) {
    case INFLOW_OUTFLOW_WALLET:
      return action.payload;

    default:
      return state;
  }
};
