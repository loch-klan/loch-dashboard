import { GET_ALL_COHORT, RECEIVE_POSTS, UPDATE_COHORT } from "./ActionTypes";
const INITIAL_STATE = {
  cardList: [],
  sortedList: [],
  total_addresses: 0,
};
const CohortReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_ALL_COHORT:
      return {
        ...state,
        cardList: action.payload.cardList,
        sortedList: action.payload.sortedList,
        total_addresses: action.payload.total_addresses,
      };
    case UPDATE_COHORT:
      return {
        ...state,
        sortedList: action.payload.sortedList,
      };
    default:
      return state;
  }
};
export default CohortReducer;
