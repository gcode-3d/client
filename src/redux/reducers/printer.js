export default function printerStateReducer(state = {}, action) {
  switch (action.type) {
    case "socket/event/server/ready":
      return {
        state: action.printerState,
        stateDescription: action.printerStateDescription,
      };
    case "socket/event/builtin/close":
      return {};
    case "socket/event/server/stateUpdate":
      return {
        state: action.state,
        stateDescription: action.stateDescription,
      };
    case "api/connectPrinter":
      return {
        state: "Connecting",
        stateDescription: null,
      };
  }

  return state;
}
