import React, { Suspense, useEffect, useState } from "react";
import Emitter from "./tools/emitter";
import PageManager from "./components/pageManager";
import ConnectionError from "./pages/connectionError";
import LoginScreen from "./pages/login";
import ErrorBoundary from "./components/errorBoundary";
let localSocketDetailCopyWebsocketOnly = false;
let terminalDataCopy = [];
let socket;

export default function App() {
  const [ws, setWS] = useState(null);
  const [socketDetails, setSocketDetails] = useState(false);
  const [terminalData, setTerminalData] = useState([]);
  const [isAuthenticated, setAuthenticatedState] = useState(false);
  var timeout = 250;
  useEffect(() => {
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
      terminalDataCopy = [];
      if (e.code == 4001) {
        console.log("4001");
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
        if (!localSocketDetailCopyWebsocketOnly.description) {
          localSocketDetailCopyWebsocketOnly.description = {
            tempData: [],
          };
        }
        if (!localSocketDetailCopyWebsocketOnly.description.tempData) {
          localSocketDetailCopyWebsocketOnly.description.tempData = [];
        }
        let copy = [...localSocketDetailCopyWebsocketOnly.description.tempData];
        copy.push(data.content);
        if (copy.length > 50) {
          copy.shift();
        }
        setSocketDetails({
          ...localSocketDetailCopyWebsocketOnly,
          description: {
            ...localSocketDetailCopyWebsocketOnly.description,
            tempData: copy,
          },
        });

        localSocketDetailCopyWebsocketOnly = {
          ...localSocketDetailCopyWebsocketOnly,
          description: {
            ...localSocketDetailCopyWebsocketOnly.description,
            tempData: copy,
          },
        };

        break;
      case "message_receive":
        if (terminalDataCopy.length > 0) {
          Emitter.emit("terminal.receive", data.content);
          let lastMessage = terminalDataCopy[terminalDataCopy.length - 1];
          if (lastMessage.data === data.content.message) {
            let temp = [...terminalDataCopy];
            temp[terminalDataCopy.length - 1].amount++;
            setTerminalData(temp);

            terminalDataCopy = temp;
            return;
          }
        }
        setTerminalData([
          ...terminalDataCopy.slice(Math.max(terminalDataCopy.length - 300, 0)),
          {
            type: data.content.type,
            data: data.content.message,
            amount: 1,
            id: data.content.type == "INPUT" ? data.content.id : null,
          },
        ]);

        terminalDataCopy = [
          ...terminalDataCopy.slice(Math.max(terminalDataCopy.length - 300, 0)),
          {
            type: data.content.type,
            data: data.content.message,
            amount: 1,
            id: data.content.type == "INPUT" ? data.content.id : null,
          },
        ];

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
      <ErrorBoundary>
        <Suspense fallback={<h1>Loading</h1>}>
          <PageManager
            user={socketDetails.user}
            terminalData={terminalData}
            state={{
              state: socketDetails.state,
              description: socketDetails.description,
            }}
          />
        </Suspense>
      </ErrorBoundary>
    );
  } else {
    return <h1>Something went wrong, try again later.</h1>;
  }
}
