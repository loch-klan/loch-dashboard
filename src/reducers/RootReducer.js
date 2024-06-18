import { combineReducers } from "redux";
/* PLOP_INJECT_REDUCER_IMPORT */

import { DefiReducer } from "../app/defi";
import { ProfileReducer } from "../app/profile";

import {
  HeaderReducer,
  IsWalletConnectedReducer,
  MetamaskConnectedReducer,
} from "../app//header/HeaderReducer";
import PortfolioReducer from "../app/Portfolio/PortfolioReducer";
import {
  AddLocalAddWalletReducer,
  CommonReducer,
  UserPaymentReducer,
} from "../app/common/CommonReducer";
import { HomeReducer } from "../app/home";
import {
  InflowOutflowAssetListReducer,
  InflowOutflowChartReducer,
  InflowOutflowSelectedAssetReducer,
  InflowOutflowTimeTabReducer,
  InflowOutflowWalletReducer,
} from "../app/intelligence/InflowOutflowReducer";
import IntelligenceReducer from "../app/intelligence/IntelligenceReducer";
import OnboardingReducer from "../app/onboarding/OnboardingReducer";
import LochUserReducer from "../app/profile/LochUserReducer";

import WalletReducer from "../app/wallet/WalletReducer";
import {
  TopAccountsInWatchListReducer,
  WatchListLoadingReducer,
  WatchListReducer,
} from "../app/watchlist/redux/WatchListReducer";
import YieldOpportunitiesReducer from "../app/yieldOpportunities/YieldOpportunitiesReducer";
import YieldPoolReducer from "../app/yieldOpportunities/YieldPoolReducer";
import DarkModeReducer from "../app/intelligence/darkMode";
import { NFTReducer } from "../app/nft/NftReducer";
import { EmulationsReducer } from "../app/Emulations/EmulationsReducer";
import { ReferralCodesReducer } from "../app/ReferralCodes/ReferralCodesReducer";

export default combineReducers({
  /* PLOP_INJECT_REDUCER */
  DefiState: DefiReducer,
  HeaderState: HeaderReducer,
  IsWalletConnectedState: IsWalletConnectedReducer,
  MetamaskConnectedState: MetamaskConnectedReducer,

  ProfileState: ProfileReducer,
  YieldOpportunitiesState: YieldOpportunitiesReducer,
  YieldPoolState: YieldPoolReducer,
  CommonState: CommonReducer,
  UserPaymentState: UserPaymentReducer,
  LochUserState: LochUserReducer,
  HomeState: HomeReducer,
  OnboardingState: OnboardingReducer,
  PortfolioState: PortfolioReducer,
  WalletState: WalletReducer,
  IntelligenceState: IntelligenceReducer,
  darkModeState: DarkModeReducer,
  InflowOutflowSelectedAssetState: InflowOutflowSelectedAssetReducer,
  InflowOutflowAssetListState: InflowOutflowAssetListReducer,
  InflowOutflowChartState: InflowOutflowChartReducer,
  InflowOutflowWalletState: InflowOutflowWalletReducer,
  InflowOutflowTimeTabState: InflowOutflowTimeTabReducer,
  AddLocalAddWalletState: AddLocalAddWalletReducer,

  WatchListState: WatchListReducer,
  NFTState: NFTReducer,
  EmulationsState: EmulationsReducer,
  ReferralCodesState: ReferralCodesReducer,
  TopAccountsInWatchListState: TopAccountsInWatchListReducer,
  WatchListLoadingState: WatchListLoadingReducer,
});
