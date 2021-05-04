import { configureStore } from "@reduxjs/toolkit";

import printer from "./reducers/printer.js";
import user from "./reducers/users";
import tempData from "./reducers/temperature";
import terminal from "./reducers/terminal";

import websocketMiddleware from "./middleware/websocket";
import tempMiddleWare from "./middleware/temperature";
import apiMiddleware from "./middleware/api";
import terminalMiddelWare from "./middleware/terminal";

const store = configureStore({
  reducer: {
    printer,
    user,
    tempData,
    terminal,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      websocketMiddleware,
      tempMiddleWare,
      apiMiddleware,
      terminalMiddelWare
    ),
});

export default store;
