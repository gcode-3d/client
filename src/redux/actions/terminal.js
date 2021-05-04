export const terminalMessageReceive = (payload) => ({
  type: "socket/event/server/terminalMessage",
  payload,
});
