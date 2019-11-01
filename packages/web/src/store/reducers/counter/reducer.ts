import { Reducer } from "redux";

import { Counter, CounterActionTypes } from "./types";

const initialState: Counter = {
  number: 0
};

const reducer: Reducer = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case CounterActionTypes.INCREMENT_SUCCESS:
      return { ...state, number: state.number + 1 };
    case CounterActionTypes.DECREMENT_SUCCESS:
      return { ...state, number: state.number - 1 };
    case CounterActionTypes.RESET_SUCCESS:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
