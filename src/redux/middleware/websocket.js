import {
  socketConnect,
  socketEventConnectionOpen,
  socketEventConnectionClose,
  socketEventReady,
} from "../actions/socket";

import { stateUpdate } from "../actions/state";
import { temperatureChange } from "../actions/temperature";
import { terminalMessageReceive } from "../actions/terminal";
import { notificationMessageReceive } from "../actions/notification";

let timeout;

const websocketMiddleware = () => {
  let socket = null;

  const onOpen = (store) => (event) => {
    console.log("websocket opened", event.target.url);
    store.dispatch(socketEventConnectionOpen());
  };

  const onClose = (store) => () => {
    store.dispatch(socketEventConnectionClose());
  };

  const onMessage = (store) => (event) => {
    let payload = JSON.parse(event.data);
    let eventName = payload.type;
    let eventBody = payload.content;

    switch (eventName) {
      case "ready":
        store.dispatch(
          socketEventReady(
            eventBody.user,
            eventBody.state,
            eventBody.description
          )
        );
        break;
      case "temperature_change":
        store.dispatch(temperatureChange(eventBody));
        break;
      case "state_update":
        store.dispatch(stateUpdate(eventBody.state, eventBody.description));
        break;
      case "terminal_message":
        eventBody.forEach((message) => {
          store.dispatch(terminalMessageReceive(message));
        });
        break;
      case "notification":
        store.dispatch(notificationMessageReceive(eventBody));
        break;
      default:
        console.log("Unknown type " + payload.type, payload);
        break;
    }
  };
  return (store) => (next) => (action) => {
    switch (action.type) {
      case "socket/connectUsingToken":
        if (socket !== null) {
          socket.close();
        }
        if (!action.token) {
          localStorage.removeItem("auth");
          sessionStorage.removeItem("auth");
          window.location.reload();
          return;
        }

        socket = new WebSocket(action.host, [action.token]);

        socket.onmessage = onMessage(store);
        socket.onclose = onClose(store);
        socket.onopen = onOpen(store);
        break;

      case "socket/disconnect":
        if (socket !== null) {
          socket.close();
        }
        socket.null;
        if (timeout != null) {
          clearTimeout(timeout);
          timeout = null;
        }
        break;
      case "socket/event/builtin/close":
        if (timeout != null) {
          clearTimeout(timeout);
          timeout = null;
        }
        timeout = setTimeout(() => {
          let url =
            process.env.NODE_ENV === "production"
              ? window.location.protocol === "https:"
                ? "wss://" + window.location.host + "/ws"
                : "ws://" + window.location.host + "/ws"
              : "ws://localhost:8000/ws";
          store.dispatch(socketConnect(url, store.getState().user.token));
        }, 5000);
    }
    return next(action);
  };
};

export default websocketMiddleware();
