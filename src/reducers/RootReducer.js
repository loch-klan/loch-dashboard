import { combineReducers } from 'redux';
/* PLOP_INJECT_REDUCER_IMPORT */
import { ProfileReducer } from '../app/profile';
import { CommonReducer } from '../app/common';
import { HomeReducer } from '../app/home';

export default combineReducers({
  /* PLOP_INJECT_REDUCER */
	ProfileState: ProfileReducer,
  CommonState: CommonReducer,
  HomeState: HomeReducer,
});