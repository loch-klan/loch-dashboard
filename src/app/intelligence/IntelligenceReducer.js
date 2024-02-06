import { API_LIMIT } from "../../utils/Constant";
import {
  ALL_TRANSACTION_HISTORY,
  ALL_TRANSACTION_HISTORY_HOME,
  AVERAGE_COST_BASIS,
  AVERAGE_COST_RESET,
  AVERAGE_COST_SORT,
  COUNTER_PARTY_VOLUME,
  DARK_MODE,
  GAS_FEES,
  INSIGHT_DATA,
  NETFLOW_GRAPH,
  PORTFOLIO_ASSET,
  TRANSACTION_FILTER,
} from "./ActionTypes";
const INITIAL_STATE = {
  table: [],
  currentPage: 1,
  totalCount: null,
  totalPage: null,
  assetPriceList: [],
  updatedInsightList: "",

  // for home
  table_home: [],
  assetPriceList_home: [],

  // get all netflow api response
  GraphData: [],
  // all netflowh data
  graphValue: null,

  // get all asset value
  ProfitLossAsset: [],

  // filters
  assetFilter: [],
  yearFilter: [],
  methodFilter: [],

  // counter party
  counterPartyData: [],
  counterPartyValue: null,

  // gas fees
  GraphfeeData: [],
  graphfeeValue: null,

  // average cost basis
  Average_cost_basis: [],
  Average_cost_basis_all: [],
  totalPercentage: 0,
};
const IntelligenceReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ALL_TRANSACTION_HISTORY:
      return {
        ...state,
        table: action.payload.results,
        assetPriceList: action.payload.objects.asset_prices,
        totalCount: action.payload.total_count,
        totalPage: Math.ceil(action.payload.total_count / API_LIMIT),
        currentPage: action.currentPage,
      };
    case ALL_TRANSACTION_HISTORY_HOME:
      return {
        ...state,
        table_home: action.payload.results,
        table_home_count: action.payload.total_count,
        assetPriceList_home: action.payload.objects.asset_prices,
      };
    case INSIGHT_DATA:
      return {
        ...state,
        updatedInsightList: action.payload.updatedInsightList,
      };
    case NETFLOW_GRAPH:
      return {
        ...state,
        GraphData: action.payload.GraphData,
        graphValue: action.payload.graphValue,
      };
    case PORTFOLIO_ASSET:
      return {
        ...state,
        ProfitLossAsset: action.payload.ProfitLossAsset,
        ProfitLossAssetData: action.payload.ProfitLossAssetData,
      };
    case TRANSACTION_FILTER:
      return {
        ...state,
        assetFilter: action.payload.assetFilter,
        yearFilter: action.payload.yearFilter,
        methodFilter: action.payload.methodFilter,
      };
    case COUNTER_PARTY_VOLUME:
      return {
        ...state,
        counterPartyData: action.payload.counterPartyData,
        counterPartyValue: action.payload.counterPartyValue,
      };
    case GAS_FEES:
      return {
        ...state,
        GraphfeeData: action.payload.GraphfeeData,
        graphfeeValue: action.payload.graphfeeValue,
      };
    case AVERAGE_COST_BASIS:
      return {
        ...state,
        Average_cost_basis: action.payload.Average_cost_basis,
        Average_cost_basis_all: action.payload.Average_cost_basis,
        totalPercentage: action.payload.totalPercentage,
        net_return: action.payload.net_return,
        total_bal: action.payload.total_bal,
        total_cost: action.payload.total_cost,
        total_gain: action.payload.total_gain,
      };
    case AVERAGE_COST_RESET:
      return { ...state, Average_cost_basis: state.Average_cost_basis_all };
    case AVERAGE_COST_SORT:
      return { ...state, Average_cost_basis: action.payload };
    default:
      return state;
  }
};
export default IntelligenceReducer;
