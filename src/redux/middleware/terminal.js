const terminalMiddelWare = () => {
  return (store) => (next) => (action) => {
    switch (action.type) {
      case "socket/event/server/terminalMessage":
        sessionStorage.setItem(
          "terminalCache",
          JSON.stringify(store.getState().terminal)
        );
    }
    return next(action);
  };
};

export default terminalMiddelWare();
