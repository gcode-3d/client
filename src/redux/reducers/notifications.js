export default function printerStateReducer(state = [], action) {
  switch (action.type) {
    case "socket/event/server/notification_receive":
      let copiedState = [...state];
      copiedState.push(action.payload);
      return copiedState;
    case "api/notification/dismiss":
      return state.filter((notification) => notification.id !== action.id);
  }

  return state;
}
