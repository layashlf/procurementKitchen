import { configureStore } from "@reduxjs/toolkit";
import sheetReducer from "./reducers";

export const store = configureStore({
  reducer: {
    pageData: sheetReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
