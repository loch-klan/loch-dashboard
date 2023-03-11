import { GET_DEFI_DATA } from "./ActionTypes";
const INITIAL_STATE = {
  totalYield: 0,
  totalDebt: 0,
  cardList: [],
  sortedList: [],
  DebtValues: [],
  YieldValues: [],
  BalanceSheetValue: {},
};
const DefiReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case GET_DEFI_DATA:
        // console.log("dt",action.payload)
        return { ...state,...action.payload};
      default:
        return state;
    }
};
export default DefiReducer