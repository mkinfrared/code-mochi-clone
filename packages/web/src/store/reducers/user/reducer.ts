import { Reducer } from "redux";

import { User, UserActionType } from "src/store/reducers/user/types";

const initialState: User = {
  id: "",
  name: ""
};

const reducer: Reducer<User> = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UserActionType.GET_USER_SUCCESS:
      return { ...state, ...payload };
    case UserActionType.SET_USER:
      return { ...state, ...payload };
    default:
      return state;
  }
};

export default reducer;
