export interface Counter {
  number: number;
}

export enum CounterActionTypes {
  INCREMENT = "@@counter/INCREMENT",
  INCREMENT_SUCCESS = "@@counter/INCREMENT_SUCCESS",
  DECREMENT = "@@counter/DECREMENT",
  DECREMENT_SUCCESS = "@@counter/DECREMENT_SUCCESS",
  RESET = "@@counter/RESET",
  RESET_SUCCESS = "@@counter/RESET_SUCCESS"
}
