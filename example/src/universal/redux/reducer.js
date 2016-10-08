import { combineReducers } from 'redux';
import Home from '../domain/home/homeReducer';
import {ldReducer} from 'ld-redux';

export default combineReducers({
  Home,
  LD: ldReducer,
});