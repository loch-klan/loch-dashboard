import { combineReducers } from 'redux';
/* PLOP_INJECT_REDUCER_IMPORT */
import { SettlementReducer } from '../app/settlement';
import { FranchiseReducer } from '../app/franchise';
import { BookingManagementReducer } from '../app/bookingManagement';
import { CouponsReducer } from '../app/coupons';
import { LocationMasterReducer } from '../app/locationMaster';
import { BatteryModelReducer } from '../app/batteryModel';
import { IotModelReducer } from '../app/iotModel';
import { UserManagementReducer } from '../app/userManagement';
import { BatteryReducer } from '../app/battery';
import { BikeModelReducer } from '../app/bikeModel';
import { IotReducer } from '../app/iot';
import { VehiclesReducer } from '../app/vehicles';
import { CustomersReducer } from '../app/customers';
import { LoginReducer } from '../app/login';
import { CommonReducer } from '../app/common';
import { HomeReducer } from '../app/home';

export default combineReducers({
  /* PLOP_INJECT_REDUCER */
	SettlementState: SettlementReducer,
	FranchiseState: FranchiseReducer,
	BookingManagementState: BookingManagementReducer,
	CouponsState: CouponsReducer,
	LocationMasterState: LocationMasterReducer,
	BatteryModelState: BatteryModelReducer,
  IotModelState: IotModelReducer,
  UserManagementState: UserManagementReducer,
  BatteryState: BatteryReducer,
  BikeModelState: BikeModelReducer,
  IotState: IotReducer,
  VehiclesState: VehiclesReducer,
  CustomersState: CustomersReducer,
  LoginState: LoginReducer,
  CommonState: CommonReducer,
  HomeState: HomeReducer,
});