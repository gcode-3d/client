import React, { Suspense, useEffect, useState } from "react";
import Emitter from "./tools/emitter";
import IndexPage from "../src/pages/index";
import PageManager from "./components/pagemanager";
import ConnectionError from "./pages/connectionError";
let connection;

export default function App() {
  const [ws, setWS] = useState(null);
  const [isSocketOpen, setSocketState] = useState(false);
  useEffect(() => {
    let interval = connect();
    Emitter.on("client.tryConnect", checkAndTryReconnect);
    return cleanup(interval);
  }, []);

  const cleanup = (interval) => {
    Emitter.removeListener("client.tryConnect", checkAndTryReconnect);
    clearInterval(interval);
    if (ws != null) {
      ws.onclose = null;
      delete ws;
    }
  };
  const connect = () => {
    let socket = new WebSocket("ws://localhost:8000/ws");
    let connectInterval;

    socket.onopen = () => {
      console.log("Connected websocket..");
      setWS(socket);

      socket.onmessage = handleMessage;

      Emitter.emit("socket.open");
      setSocketState(true);

      this.timeout = 250;
      clearTimeout(connectInterval);
    };

    socket.onclose = (e) => {
      Emitter.emit("socket.closed");
      setSocketState(false);

      console.log(
        `Websocket closed. Reconnect attempt in: ${Math.min(
          10000 / 1000,
          (this.timeout + this.timeout) / 1000
        )}`,
        e.reason
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

  if (isSocketOpen) {
    return <PageManager />;
  } else {
    return <ConnectionError />;
  }
}

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
      break;
    default:
      console.error("Unknown data event type: " + data.type);
  }
}
