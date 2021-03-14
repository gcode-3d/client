import React, { useEffect, useState } from "react";
import Emitter from "./tools/emitter";
import PageManager from "./components/pageManager";
import ConnectionError from "./pages/connectionError";
import LoginScreen from "./pages/login";
let connection;
let localSocketDetailCopyWebsocketOnly = false;
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
    }
  };
  const connect = () => {
    let socket;
    if (process.env.NODE_ENV === "production") {
      socket = new WebSocket(
        window.location.protocol === "https:"
          ? "wss://" + window.location.host + "/ws"
          : "ws://" + window.location.host + "/ws",
        [`auth-${getToken()}`]
      );
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

    socket.onclose = (e) => {
      Emitter.emit("socket.closed");
      setSocketDetails(null);
      localSocketDetailCopyWebsocketOnly = null;
      if (e.code == 4001) {
        localStorage.removeItem("auth");
        sessionStorage.removeItem("auth");
        return setAuthenticatedState(false);
      }
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
      console.error("Websocket errored: ", err, "Closing socket");
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
    switch (data.type) {
      case "ready":
        Emitter.emit("server.ready", data.content);

        setSocketDetails(data.content);
        localSocketDetailCopyWebsocketOnly = data.content;
        break;
      case "state_update":
        Emitter.emit("server.device_update", {
          old_state: {
            state: localSocketDetailCopyWebsocketOnly.state,
            description: localSocketDetailCopyWebsocketOnly.description,
          },
          new_state: data.content,
        });

        setSocketDetails({
          ...localSocketDetailCopyWebsocketOnly,
          state: data.content.state,
          description: data.content.description,
        });

        localSocketDetailCopyWebsocketOnly = {
          ...localSocketDetailCopyWebsocketOnly,
          state: data.content.state,
          description: data.content.description,
        };

        break;
      case "temperature_change":
        Emitter.emit("server.temperature_update", data.content);
        setSocketDetails({
          ...localSocketDetailCopyWebsocketOnly,
          description: {
            ...localSocketDetailCopyWebsocketOnly.details,
            temp_data: data.content,
          },
        });

        localSocketDetailCopyWebsocketOnly = {
          ...localSocketDetailCopyWebsocketOnly,
          description: {
            ...localSocketDetailCopyWebsocketOnly.details,
            temp_data: data.content,
          },
        };

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
