import { all, call, put, takeEvery } from "@redux-saga/core/effects";

import { decrementSuccess, incrementSuccess, resetSuccess } from "./actions";
import { CounterActionTypes } from "./types";

function* incrementSaga() {
  yield put(incrementSuccess());
}

function* watchIncrementSaga() {
  yield takeEvery(CounterActionTypes.INCREMENT, incrementSaga);
}

function* decrementSaga() {
  yield put(decrementSuccess());
}

function* watchDecrementSaga() {
  yield takeEvery(CounterActionTypes.DECREMENT, decrementSaga);
}

function* resetSaga() {
  yield put(resetSuccess());
}

function* watchResetSaga() {
  yield takeEvery(CounterActionTypes.RESET, resetSaga);
}

export default function* counterSaga() {
  yield all([
    call(watchIncrementSaga),
    call(watchDecrementSaga),
    call(watchResetSaga)
  ]);
}
