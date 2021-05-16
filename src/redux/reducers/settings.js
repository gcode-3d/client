export default function settingReducer(state = null, action) {
  switch (action.type) {
    case "api/settings/store":
      let copiedState = !state
        ? { ...action.settingData }
        : {
            ...state,
            ...action.settingData,
          };
      return copiedState;
  }

  return state;
}
