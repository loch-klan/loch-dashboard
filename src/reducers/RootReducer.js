import { combineReducers } from 'redux';
/* PLOP_INJECT_REDUCER_IMPORT */
import { CommonReducer } from '../app/common';
import { HomeReducer } from '../app/home';

export default combineReducers({
  /* PLOP_INJECT_REDUCER */
  CommonState: CommonReducer,
  HomeState: HomeReducer,
});