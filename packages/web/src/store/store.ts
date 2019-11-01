import { applyMiddleware, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";

import rootReducer from "src/store/reducers";
import rootSaga from "src/store/saga";
import { ReduxSagaStore } from "src/store/store.type";

const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  const store: ReduxSagaStore = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(sagaMiddleware))
  );

  store.sagaTask = sagaMiddleware.run(rootSaga);

  return store;
};

export default configureStore;
