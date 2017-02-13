import { combineReducers } from 'redux';
import Home from '../domain/home/homeReducer';
import ldRedux from '../../../../lib';

export default combineReducers({
  Home,
  LD: ldRedux.reducer(),
});