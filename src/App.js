import React, { useEffect, Suspense } from "react";

import { useSelector, useDispatch } from "react-redux";
import { socketConnect } from "./redux/actions/socket";

import LoginScreen from "./pages/login";
import PageManager from "./components/pageManager";
import ErrorBoundary from "./components/errorBoundary.jsx";
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

  console.log(loadedSettings);

  useEffect(handleLogin, []);

  function handleLogin() {
    if (user.token) {
      let url =
        process.env.NODE_ENV === "production"
          ? window.location.protocol === "https:"
            ? "wss://" + window.location.host + "/ws"
            : "ws://" + window.location.host + "/ws"
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
    <ErrorBoundary>
      <Suspense fallback={<LoadingPage />}>
        <PageManager />
      </Suspense>
    </ErrorBoundary>
  );
}
