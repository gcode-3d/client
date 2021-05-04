import { configureStore } from "@reduxjs/toolkit";

import printer from "./reducers/printer.js";
import user from "./reducers/users";

import websocketMiddleware from "./websocketMiddleWare";

const store = configureStore({
  reducer: {
    printer,
    user,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(websocketMiddleware),
});

export default store;
