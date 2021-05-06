import { notificationDissmiss } from "../actions/notification";
const notificationMiddleware = () => {
  return (store) => (next) => (action) => {
    switch (action.type) {
      case "socket/event/server/notification_receive":
        setTimeout(() => {
          store.dispatch(notificationDissmiss(action.payload.id));
        }, 30000);
    }
    return next(action);
  };
};

export default notificationMiddleware();
