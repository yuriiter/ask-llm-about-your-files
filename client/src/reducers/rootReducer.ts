import { combineReducers } from "redux";
import globalReducer from "./globalReducer";

const rootReducer = combineReducers({
  global: globalReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
