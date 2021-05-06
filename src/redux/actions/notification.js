export const notificationMessageReceive = (payload) => ({
  type: "socket/event/server/notification_receive",
  payload,
});

export const notificationDissmiss = (id) => ({
  type: "api/notification/dismiss",
  id,
});
