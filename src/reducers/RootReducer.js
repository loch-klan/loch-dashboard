import { combineReducers } from "redux";
/* PLOP_INJECT_REDUCER_IMPORT */
import { DefiReducer } from "../app/defi";
import { CohortReducer } from "../app/cohort";
import { ProfileReducer } from "../app/profile";

import { HomeReducer } from "../app/home";
import OnboardingReducer from "../app/onboarding/OnboardingReducer";
import {
  HeaderReducer,
  IsWalletConnectedReducer,
  MetamaskConnectedReducer,
} from "../app//header/HeaderReducer";
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
import YieldOpportunitiesReducer from "../app/yieldOpportunities/YieldOpportunitiesReducer";
import YieldPoolReducer from "../app/yieldOpportunities/YieldPoolReducer";
import {
  InflowOutflowSelectedAssetReducer,
  InflowOutflowChartReducer,
  InflowOutflowAssetListReducer,
  InflowOutflowTimeTabReducer,
  InflowOutflowWalletReducer,
} from "../app/intelligence/InflowOutflowReducer";
import {
  CommonReducer,
  AddLocalAddWalletReducer,
} from "../app/common/CommonReducer";

export default combineReducers({
  /* PLOP_INJECT_REDUCER */
  DefiState: DefiReducer,
  HeaderState: HeaderReducer,
  IsWalletConnectedState: IsWalletConnectedReducer,
  MetamaskConnectedState: MetamaskConnectedReducer,
  CohortState: CohortReducer,
  ProfileState: ProfileReducer,
  YieldOpportunitiesState: YieldOpportunitiesReducer,
  YieldPoolState: YieldPoolReducer,
  CommonState: CommonReducer,
  LochUserState: LochUserReducer,
  HomeState: HomeReducer,
  OnboardingState: OnboardingReducer,
  PortfolioState: PortfolioReducer,
  WalletState: WalletReducer,
  IntelligenceState: IntelligenceReducer,
  InflowOutflowSelectedAssetState: InflowOutflowSelectedAssetReducer,
  InflowOutflowAssetListState: InflowOutflowAssetListReducer,
  InflowOutflowChartState: InflowOutflowChartReducer,
  InflowOutflowWalletState: InflowOutflowWalletReducer,
  InflowOutflowTimeTabState: InflowOutflowTimeTabReducer,
  AddLocalAddWalletState: AddLocalAddWalletReducer,
  TopAccountState: TopAccountReducer,
  WatchListState: WatchListReducer,
  TopAccountsInWatchListState: TopAccountsInWatchListReducer,
  WatchListLoadingState: WatchListLoadingReducer,
});
