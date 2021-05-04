export default function printerStateReducer(state = {}, action) {
  switch (action.type) {
    case "socket/event/server/ready":
      return {
        state: action.printerState,
      };
    case "socket/event/builtin/close":
      return {};
  }

  return state;
}
