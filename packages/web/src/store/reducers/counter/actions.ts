import { action } from "typesafe-actions";

import { CounterActionTypes } from "./types";

const increment = () => action(CounterActionTypes.INCREMENT);

const incrementSuccess = () => action(CounterActionTypes.INCREMENT_SUCCESS);

const decrement = () => action(CounterActionTypes.DECREMENT);

const decrementSuccess = () => action(CounterActionTypes.DECREMENT_SUCCESS);

const reset = () => action(CounterActionTypes.RESET);

const resetSuccess = () => action(CounterActionTypes.RESET_SUCCESS);

export {
  increment,
  incrementSuccess,
  decrement,
  decrementSuccess,
  reset,
  resetSuccess
};
