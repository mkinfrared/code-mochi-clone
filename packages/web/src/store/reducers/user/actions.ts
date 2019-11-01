import { action } from "typesafe-actions";

import { User, UserActionType } from "src/store/reducers/user/types";

const getCurrentUserRequest = () => action(UserActionType.GET_USER_REQUEST);
const getCurrentUserFail = () => action(UserActionType.GET_USER_FAIL);
const getCurrentUserSuccess = (user: User) =>
  action(UserActionType.GET_USER_SUCCESS, user);
const setCurrentUser = (user: User) => action(UserActionType.SET_USER, user);

export {
  getCurrentUserRequest,
  getCurrentUserFail,
  getCurrentUserSuccess,
  setCurrentUser
};
