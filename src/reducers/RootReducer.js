import { combineReducers } from "redux";
/* PLOP_INJECT_REDUCER_IMPORT */
import { DefiReducer } from "../app/defi";
import { CohortReducer } from "../app/cohort";
import { ProfileReducer } from "../app/profile";
import { CommonReducer } from "../app/common";
import { HomeReducer } from "../app/home";
import OnboardingReducer from "../app/onboarding/OnboardingReducer";
import PortfolioReducer from "../app/Portfolio/PortfolioReducer";
import WalletReducer from "../app/wallet/WalletReducer";
import IntelligenceReducer from "../app/intelligence/IntelligenceReducer";

export default combineReducers({
  /* PLOP_INJECT_REDUCER */
  DefiState: DefiReducer,
  CohortState: CohortReducer,
  ProfileState: ProfileReducer,
  CommonState: CommonReducer,
  HomeState: HomeReducer,
  OnboardingState: OnboardingReducer,
  PortfolioState: PortfolioReducer,
  WalletState: WalletReducer,
  IntelligenceState: IntelligenceReducer,
});
