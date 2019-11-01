import { combineReducers } from "redux";

import counter from "./counter/reducer";
import user from "./user/reducer";

export default combineReducers({ counter, user });
