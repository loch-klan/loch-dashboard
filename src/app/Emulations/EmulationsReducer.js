import { GET_EMULATION_DATA } from "./EmulationsActionTypes";

const INITIAL_STATE = {};

export const EmulationsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_EMULATION_DATA:
      return action.payload;
    default:
      return state;
  }
};
