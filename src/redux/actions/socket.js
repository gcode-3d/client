export const socketConnect = (host, token) => ({
  type: "socket/connectUsingToken",
  host,
  token,
});

export const socketEventConnectionOpen = () => ({
  type: "socket/event/builtin/open",
});

export const socketEventConnectionClose = () => ({
  type: "socket/event/builtin/close",
});

export const socketEventReady = (
  user,
  printerState,
  printerStateDescription
) => ({
  type: "socket/event/server/ready",
  user,
  printerState,
  printerStateDescription,
});

export function setCurrentUser(username, permissions) {
  return {
    type: "user/setUserInfo",
    payload: {
      username,
      permissions,
    },
  };
}
