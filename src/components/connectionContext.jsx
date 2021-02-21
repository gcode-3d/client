import React from "react";

const ConnectionContext = React.createContext({
  state: "Unknown",
  stateDescription: null,
  user: {
    username: "Unknown",
    permissions: new Map(),
  },
});
export default ConnectionContext;
