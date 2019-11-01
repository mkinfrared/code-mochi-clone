import { all, call } from "redux-saga/effects";
import es6promise from "es6-promise";

import "isomorphic-unfetch";
import userSaga from "src/store/reducers/user/saga";
import counterSaga from "src/store/reducers/counter/saga";

es6promise.polyfill();

function* rootSaga() {
  yield all([call(counterSaga), call(userSaga)]);
}

export default rootSaga;
