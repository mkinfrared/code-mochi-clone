import axios, { AxiosResponse } from "axios";
import Router from "next/router";
import { all, call, put, takeEvery } from "redux-saga/effects";

import {
  getCurrentUserFail,
  getCurrentUserSuccess
} from "src/store/reducers/user/actions";
import { UserActionType } from "src/store/reducers/user/types";

function* getUserSaga() {
  try {
    const response: AxiosResponse = yield axios.get(
      "http://localhost:4747/me",
      { withCredentials: true }
    );
    const user = response.data;
    yield put(getCurrentUserSuccess(user));
    yield call(Router.push, "/");
  } catch {
    yield put(getCurrentUserFail());
  }
}

function* watchRequestUserSaga() {
  yield takeEvery(UserActionType.GET_USER_REQUEST, getUserSaga);
}

function* userSaga() {
  yield all([call(watchRequestUserSaga)]);
}
export default userSaga;
