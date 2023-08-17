import { combineReducers } from "redux";
/* PLOP_INJECT_REDUCER_IMPORT */
import { DefiReducer } from "../app/defi";
import { CohortReducer } from "../app/cohort";
import { ProfileReducer } from "../app/profile";
import { CommonReducer } from "../app/common";
import { HomeReducer } from "../app/home";
import OnboardingReducer from "../app/onboarding/OnboardingReducer";
import HeaderReducer from "../app//header/HeaderReducer";
import PortfolioReducer from "../app/Portfolio/PortfolioReducer";
import WalletReducer from "../app/wallet/WalletReducer";
import IntelligenceReducer from "../app/intelligence/IntelligenceReducer";
import TopAccountReducer from "../app/topAccount/TopAccountReducer";
import {
  TopAccountsInWatchListReducer,
  WatchListLoadingReducer,
  WatchListReducer,
} from "../app/watchlist/redux/WatchListReducer";
import LochUserReducer from "../app/profile/LochUserReducer";

export default combineReducers({
  /* PLOP_INJECT_REDUCER */
  DefiState: DefiReducer,
  HeaderState: HeaderReducer,
  LochUserState: LochUserReducer,
  CohortState: CohortReducer,
  ProfileState: ProfileReducer,
  CommonState: CommonReducer,
  HomeState: HomeReducer,
  OnboardingState: OnboardingReducer,
  PortfolioState: PortfolioReducer,
  WalletState: WalletReducer,
  IntelligenceState: IntelligenceReducer,
  TopAccountState: TopAccountReducer,
  WatchListState: WatchListReducer,
  TopAccountsInWatchListState: TopAccountsInWatchListReducer,
  WatchListLoadingState: WatchListLoadingReducer,
});
