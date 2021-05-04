import {
  socketEventConnectionOpen,
  socketEventConnectionClose,
  socketEventReady,
} from "../actions/socket";

import { stateUpdate } from "../actions/state";

import { temperatureChange } from "../actions/temperature";

import { terminalMessageReceive } from "../actions/terminal";

const websocketMiddleware = () => {
  let socket = null;

  const onOpen = (store) => (event) => {
    console.log("websocket opened", event.target.url);
    store.dispatch(socketEventConnectionOpen());
  };

  const onClose = (store) => (event) => {
    console.log("websocket closed");
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

        break;
    }
    return next(action);
  };
};

export default websocketMiddleware();
