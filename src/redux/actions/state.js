export const stateUpdate = (state, stateDescription) => ({
  type: "socket/event/server/stateUpdate",
  state,
  stateDescription,
});

export const connect = () => ({
  type: "api/connectPrinter",
});

export const reconnect = () => ({
  type: "api/reconnectPrinter",
});

export const disconnect = () => ({
  type: "api/disconnectPrinter",
});

export const emergency = () => ({
  type: "api/emergency",
});
