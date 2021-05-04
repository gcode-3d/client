export const stateUpdate = (state, stateDescription) => ({
  type: "socket/event/server/stateUpdate",
  state,
  stateDescription,
});
