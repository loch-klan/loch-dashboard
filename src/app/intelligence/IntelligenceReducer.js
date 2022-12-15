import { API_LIMIT } from "../../utils/Constant";
import { ALL_TRANSACTION_HISTORY } from "./ActionTypes";
const INITIAL_STATE = {
    table: [],
    currentPage: 1,
    totalCount: null,
    totalPage: null,
    assetPriceList: [],
};
const IntelligenceReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ALL_TRANSACTION_HISTORY:
            return {
              ...state,
              table : action.payload.results,
              assetPriceList : action.payload.objects.asset_prices,
              totalCount: action.payload.total_count,
              totalPage: Math.ceil(action.payload.total_count / API_LIMIT),
              currentPage: action.currentPage
            };
        default:
            return state
    }
};
export default IntelligenceReducer