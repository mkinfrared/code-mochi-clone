import { createSelector } from "reselect";

import { AppState } from "src/store/store.type";

const getUserId = (state: AppState) => state.user.id;
const getUserIdSelector = createSelector(
  getUserId,
  id => id
);

export default getUserIdSelector;
