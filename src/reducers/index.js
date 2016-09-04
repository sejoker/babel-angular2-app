import { combineReducers } from 'redux';
import { counterReducer } from './counter.js';

export const rootReducer = combineReducers({
  counter: counterReducer
});