const tempMiddleWare = () => {
  return (store) => (next) => (action) => {
    switch (action.type) {
      case "socket/event/server/temperatureChange":
        sessionStorage.setItem(
          "temp",
          JSON.stringify(store.getState().tempData)
        );
    }
    return next(action);
  };
};

export default tempMiddleWare();
