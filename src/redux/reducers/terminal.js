let initialState = [];
if (sessionStorage.getItem("terminalCache")) {
  try {
    initialState = JSON.parse(sessionStorage.getItem("terminalCache"));
    // initialState.push({message: "Started new session at xx xx"})
  } catch (e) {
    console.error(e);
  }
}

let terminalAmount = 400;

export default function terminalReducer(state = initialState, action) {
  switch (action.type) {
    case "socket/event/server/terminalMessage":
      let stateCopy = JSON.parse(JSON.stringify(state));
      if (state.length >= terminalAmount) {
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
    case "api/settings/store":
      if (action.settingData["N_clientTerminalAmount"] != null) {
        terminalAmount =
          action.settingData["N_clientTerminalAmount"] == 0
            ? 400
            : action.settingData["N_clientTerminalAmount"];
      }
      terminalAmount = 400;
      return state;
  }

  return state;
}
