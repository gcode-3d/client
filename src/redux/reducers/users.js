import getToken from "../../tools/getToken";

export default function userReducer(
  state = {
    token: getToken() ? "auth-" + getToken() : null,
  },
  action
) {
  switch (action.type) {
    case "socket/event/server/ready":
      return {
        ...state,
        username: action.user.username,
        permissions: action.user.permissions,
      };

    case "socket/connectUsingToken":
      return {
        ...state,
        token: action.token,
      };
    case "socket/event/builtin/close":
      return {
        token: state.token,
      };
  }

  return state;
}
