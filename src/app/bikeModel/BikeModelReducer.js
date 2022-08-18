import { GET_ALL_VEHICLE_PRICING } from "./ActionTypes";
const INITIAL_STATE = {
  pricingData: [],
};
const BikeModelReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_ALL_VEHICLE_PRICING:
      return { pricingData: action.payload.results };
    default:
      return state;
  }
};
export default BikeModelReducer;
