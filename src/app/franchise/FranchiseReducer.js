import { SET_FRANCHISE_LOCATION } from "./ActionTypes";
const INITIAL_STATE = {
    franchiseLocationData: "",
};
const FranchiseReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SET_FRANCHISE_LOCATION:
            return { ...state, franchiseLocationData: action.payload };
        default:
            return state
    }
};
export default FranchiseReducer