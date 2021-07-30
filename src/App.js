import React, { useEffect, Suspense } from "react";

import { useSelector, useDispatch } from "react-redux";
import { socketConnect } from "./redux/actions/socket";

import LoginScreen from "./pages/login";
import PageManager from "./components/pageManager";
import * as Sentry from "@sentry/react";
import LoadingPage from "./pages/loading";

export default function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => {
    return state.user;
  });
  const printerState = useSelector((state) => {
    return state.printer.state;
  });
  const loadedSettings = useSelector((state) => {
    return state.settings;
  });

  useEffect(handleLogin, []);

  function handleLogin(token) {
    if (token) {
      let url =
        window.location.protocol === "https:"
          ? "wss://" +
            window.location.hostname +
            ":" +
            window.location.port +
            "/ws"
          : "ws://" +
            window.location.hostname +
            ":" +
            window.location.port +
            "/ws";
      dispatch(socketConnect(url, token));
    } else if (user.token) {
      let url =
        process.env.NODE_ENV === "production"
          ? window.location.protocol === "https:"
            ? "wss://" +
              window.location.host +
              ":" +
              window.location.port +
              "/ws"
            : "ws://" +
              window.location.host +
              ":" +
              window.location.port +
              "/ws"
          : "ws://localhost:8000/ws";

      dispatch(socketConnect(url, user.token));
    }

    return () => {
      console.log("cleanup action");
    };
  }

  // If no token found, go to the login window.
  if (!user.token) {
    return <LoginScreen callback={handleLogin} />;
  }
  // If no printerstate is set yet, There hasn't been any connection yet.
  if (!printerState || !loadedSettings) {
    return <LoadingPage />;
  }

  return (
    <Sentry.ErrorBoundary fallback={"An error has occurred."}>
      <Suspense fallback={<LoadingPage />}>
        <PageManager />
      </Suspense>
    </Sentry.ErrorBoundary>
  );
}
