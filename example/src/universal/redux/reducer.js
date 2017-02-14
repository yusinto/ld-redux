import { combineReducers } from 'redux';
import Home from '../domain/home/homeReducer';
import ldRedux from 'ld-redux';

export default combineReducers({
  Home,
  LD: ldRedux.reducer(),
});