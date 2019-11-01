import { Store } from "redux";
import { Task } from "redux-saga";

import rootReducer from "src/store/reducers";

export interface ReduxSagaStore extends Store<AppState> {
  sagaTask?: Task;
}
export type AppState = ReturnType<typeof rootReducer>;
