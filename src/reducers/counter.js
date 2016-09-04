import { CounterActions } from '../actions/counterActions';

const INITIAL_STATE = 0;

export function counterReducer(state = INITIAL_STATE, action) {

  switch (action.type) {
    case CounterActions.INCREMENT_COUNTER:
      return state + 1;
    case CounterActions.DECREMENT_COUNTER:
      return state - 1;
    case CounterActions.RANDOMIZE_COUNTER:
      return action.payload;
    default:
      return state;
  }
}