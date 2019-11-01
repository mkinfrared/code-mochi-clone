export interface User {
  id: string;
  name: string;
}

export enum UserActionType {
  GET_USER_REQUEST = "GET_USER_REQUEST",
  GET_USER_SUCCESS = "GET_USER_SUCCESS",
  GET_USER_FAIL = "GET_USER_FAIL",
  SET_USER = "SET_USER"
}
