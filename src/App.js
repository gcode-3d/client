import React, { Suspense, useEffect, useState } from "react";
import Emitter from "./tools/emitter";
import PageManager from "./components/pageManager";
import ConnectionError from "./pages/connectionError";
import Setup from "./pages/setup";
import ConnectionContext from "./components/connectionContext.jsx";
import LoginScreen from "./pages/login";
import StatusBarLight from "./components/statusBarLight";
let connection;

export default function App() {
  const [ws, setWS] = useState(null);
  const [socketDetails, setSocketDetails] = useState(false);
  const [isAuthenticated, setAuthenticatedState] = useState(false);
  var timeout = 250;
  useEffect(() => {
    Emitter.on("client.tryConnect", checkAndTryReconnect);
    return handleLogin();
  }, []);

  function handleLogin() {
    var token = getToken();
    if (token) {
      setAuthenticatedState(true);
      let interval = connect();
      return cleanup(interval);
    } else {
      setAuthenticatedState(false);
    }
  }
  function getToken() {
    if (window.localStorage.getItem("auth") !== null) {
      return window.localStorage.getItem("auth");
    } else if (window.sessionStorage.getItem("auth") !== null) {
      return window.sessionStorage.getItem("auth");
    }
  }

  const cleanup = (interval) => {
    Emitter.removeListener("client.tryConnect", checkAndTryReconnect);
    clearInterval(interval);
    if (ws != null) {
      ws.onclose = null;
      ws = null;
    }
  };
  const connect = () => {
    let socket;
    if (process.env.NODE_ENV === "production") {
      socket = new WebSocket("ws://localhost/ws", [`auth-${getToken()}`]);
    } else {
      socket = new WebSocket("ws://localhost:8000/ws", [`auth-${getToken()}`]);
    }
    let connectInterval;

    socket.onopen = () => {
      console.log("Connected websocket..");
      setWS(socket);

      socket.onmessage = handleMessage;

      Emitter.emit("socket.open");

      timeout = 250;
      clearTimeout(connectInterval);
    };

    socket.onclose = () => {
      Emitter.emit("socket.closed");
      setSocketDetails(null);

      console.log(
        `Websocket closed. Reconnect attempt in: ${Math.min(
          10000 / 1000,
          (timeout + timeout) / 1000
        )}`
      );
      timeout += timeout;
      connectInterval = setTimeout(
        checkAndTryReconnect,
        Math.min(10000, timeout)
      );
    };

    socket.onerror = (err) => {
      console.error("Websocket errored: ", err.message, "Closing socket");
      socket.close();
    };
    return connectInterval;
  };
  const checkAndTryReconnect = () => {
    if (!ws || ws.readyState == WebSocket.CLOSED) {
      connect();
    }
  };
  function handleMessage(message) {
    let data = message.data;
    Emitter.emit("socket.rawMessage", data);
    try {
      data = JSON.parse(data);
    } catch (e) {
      console.error(e);
      return;
    }
    console.log(data);
    switch (data.type) {
      case "ready":
        Emitter.emit("server.ready", data.content);
        setSocketDetails(data.content);
        break;
      default:
        console.error("Unknown data event type: " + data.type);
    }
  }
  if (!isAuthenticated) {
    return <LoginScreen callback={handleLogin} />;
  }
  if (!socketDetails) {
    return <ConnectionError />;
  } else if (socketDetails.setup === true) {
    if (
      socketDetails.user.permissions["admin"] == true ||
      socketDetails.user.permissions["settings.edit"] == true
    ) {
      return (
        <ConnectionContext.Provider
          value={{
            state: null,
            stateDescription: null,
            user: {
              username: socketDetails.user.username,
              permissions: socketDetails.user.permissions,
            },
          }}
        >
          <Setup />
        </ConnectionContext.Provider>
      );
    } else {
      return (
        <ConnectionContext.Provider
          value={{
            state: null,
            stateDescription: null,
            user: {
              username: socketDetails.user.username,
              permissions: socketDetails.user.permissions,
            },
          }}
        >
          <StatusBarLight />
          <h1 className="subtitle has-text-centered">
            The server is not yet set up. Please wait until an administrator has
            setup the server.
          </h1>
        </ConnectionContext.Provider>
      );
    }
  } else if (socketDetails.user != null) {
    return (
      <PageManager
        user={socketDetails.user}
        state={{
          state: socketDetails.state,
          description: socketDetails.description,
        }}
      />
    );
  } else {
    return <h1>Something went wrong, try again later.</h1>;
  }
}
