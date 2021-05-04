import React, { useEffect, Suspense } from "react";

import { useSelector, useDispatch } from "react-redux";
import { socketConnect } from "./redux/actions";

import LoginScreen from "./pages/login";
import PageManager from "./components/pageManager";
import ErrorBoundary from "./components/errorBoundary.jsx";

import getToken from "./tools/getToken";

export default function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => {
    return state.user;
  });
  const printerState = useSelector((state) => {
    return state.printer.state;
  });

  useEffect(handleLogin, []);

  function handleLogin() {
    var token = getToken();
    if (token) {
      let url =
        process.env.NODE_ENV === "production"
          ? window.location.protocol === "https:"
            ? "wss://" + window.location.host + "/ws"
            : "ws://" + window.location.host + "/ws"
          : "ws://localhost:8000/ws";
      dispatch(socketConnect(url, "auth-" + token));
    }

    return () => {
      console.log("cleanup action");
    };
  }

  // If no token found, go to the login window.
  if (!getToken()) {
    return <LoginScreen callback={handleLogin} />;
  }
  // If no printerstate is set yet, There hasn't been any connection yet.
  if (!printerState) {
    // TODO: Add loading widget
    return <h1>Loading</h1>;
  }
  return (
    <ErrorBoundary>
      <Suspense fallback={<h1>Loading</h1>}>
        <PageManager />
      </Suspense>
    </ErrorBoundary>
  );
}
