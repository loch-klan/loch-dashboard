import { COINS_LIST } from "./ActionTypes";
const INITIAL_STATE = {
    coinsList: [],
};
const OnboardingReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case COINS_LIST:
            return { ...state, coinsList: action.payload };
        default:
            return state
    }
};
export default OnboardingReducer