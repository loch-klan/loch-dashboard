import { GET_DEFI_DATA } from "./ActionTypes";

// update defi data
export const updateDefiData = (data, ctx) => {
  return function (dispatch, getState) {
    dispatch({
      type: GET_DEFI_DATA,
      payload: {
        ...data,
      },
    });
  };
};
