import React, { Suspense, useEffect, useState } from "react";
import Emitter from "./tools/emitter";
import PageManager from "./components/pagemanager";
import ConnectionError from "./pages/connectionError";
import Setup from "./pages/setup";
import LoginScreen from "./pages/login";
let connection;

export default function App() {
  const [ws, setWS] = useState(null);
  const [socketDetails, setSocketDetails] = useState(false);
  const [isAuthenticated, setAuthenticatedState] = useState(false);

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
      delete ws;
    }
  };
  const connect = () => {
    let socket = new WebSocket("ws://localhost:8000/ws", [
      `auth-${getToken()}`,
    ]);
    let connectInterval;

    socket.onopen = () => {
      console.log("Connected websocket..");
      setWS(socket);

      socket.onmessage = handleMessage;

      Emitter.emit("socket.open");

      this.timeout = 250;
      clearTimeout(connectInterval);
    };

    socket.onclose = () => {
      Emitter.emit("socket.closed");
      setSocketDetails(null);

      console.log(
        `Websocket closed. Reconnect attempt in: ${Math.min(
          10000 / 1000,
          (this.timeout + this.timeout) / 1000
        )}`
      );
      this.timeout += this.timeout;
      connectInterval = setTimeout(
        checkAndTryReconnect,
        Math.min(10000, this.timeout)
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
  } else if (socketDetails.user != null) {
    return (
      <PageManager user={socketDetails.user} state={socketDetails.state} />
    );
  } else if (socketDetails.setup === true) {
    return <Setup />;
  } else {
    return <h1>Something went wrong, try again later.</h1>;
  }
}
