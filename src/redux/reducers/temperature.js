let initialState = [];
if (!sessionStorage.getItem("temp")) {
  try {
    initialState = JSON.parse(sessionStorage.getItem("temp"));
  } catch (e) {
    console.error(e);
  }
}

export default function temperatureReducer(state = initialState, action) {
  switch (action.type) {
    case "socket/event/server/temperatureChange":
      let stateCopy = [...state];
      if (state.length >= 50) {
        stateCopy.shift();
      }
      stateCopy.push(action.payload);
      return stateCopy;
  }

  return state;
}
