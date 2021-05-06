import { configureStore } from "@reduxjs/toolkit";

import printer from "./reducers/printer.js";
import user from "./reducers/users";
import tempData from "./reducers/temperature";
import terminal from "./reducers/terminal";
import notifications from "./reducers/notifications";

import websocketMiddleware from "./middleware/websocket";
import tempMiddleWare from "./middleware/temperature";
import apiMiddleware from "./middleware/api";
import terminalMiddelWare from "./middleware/terminal";
import notificationMiddleWare from "./middleware/notifications";

const store = configureStore({
  reducer: {
    printer,
    user,
    tempData,
    terminal,
    notifications,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      websocketMiddleware,
      tempMiddleWare,
      apiMiddleware,
      terminalMiddelWare,
      notificationMiddleWare
    ),
});

export default store;
