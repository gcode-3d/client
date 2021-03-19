import React from "react";

const ConnectionContext = React.createContext({
  state: "Unknown",
  stateDescription: null,
  terminalData: [],
  user: {
    username: "Unknown",
    permissions: {},
  },
});
export default ConnectionContext;
