import rootReducer from "../reducers/rootReducer";
import { configureStore } from "@reduxjs/toolkit";
import { saveToLocalStorage } from "../reduxMiddleware";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(saveToLocalStorage),
});

export default store;

export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
