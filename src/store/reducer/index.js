import { combineReducers } from 'redux';
import loginReducer from './loginReducer';

const rootreducers = combineReducers({
  stateOne: loginReducer
})

export default rootreducers;