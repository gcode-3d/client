let initialState = [];
if (!sessionStorage.getItem("terminalCache")) {
  try {
    initialState = JSON.parse(sessionStorage.getItem("terminalCache"));
    // initialState.push({message: "Started new session at xx xx"})
  } catch (e) {
    console.error(e);
  }
}
export default function terminalReducer(state = initialState, action) {
  switch (action.type) {
    case "socket/event/server/terminalMessage":
      let stateCopy = JSON.parse(JSON.stringify(state));
      if (state.length >= 50) {
        stateCopy.shift();
      }

      if (state.length > 0) {
        let lastMessage = stateCopy[stateCopy.length - 1];
        if (lastMessage.message == action.payload.message) {
          stateCopy[stateCopy.length - 1].amount = lastMessage.amount + 1;
        } else {
          stateCopy.push({
            amount: 0,
            ...action.payload,
          });
        }
      } else {
        stateCopy.push({
          amount: 0,
          ...action.payload,
        });
      }

      return stateCopy;
  }

  return state;
}
