import { SET_COMMON_REDUCER } from "./ActionTypes";

const INITIAL_STATE = {
  isSidebarOpen: false,
};

const CommonReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_COMMON_REDUCER:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state
  }
};
export default CommonReducer