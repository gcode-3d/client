import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ConnectionContext from "./connectionContext.jsx";
import ErrorBoundary from "./errorBoundary.jsx";
import PrivateRoute from "./privateRoute";

const Home = React.lazy(() => import("../pages/index"));
const SettingPage = lazy(() => import("../pages/settings"));
const UnknownPage = lazy(() => import("../pages/unknown"));
const TerminalPage = lazy(() => import("../pages/terminal"));
const FilePage = lazy(() => import("../pages/file"));

export default function PageManager(props) {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <ErrorBoundary>
            <Suspense>
              <ConnectionContext.Provider
                value={{
                  state: props.state.state,
                  stateDescription: props.state.description,
                  terminalData: props.terminalData || [],
                  user: {
                    username: props.user.username,
                    permissions: props.user.permissions,
                  },
                }}
              >
                <Home />
              </ConnectionContext.Provider>
            </Suspense>
          </ErrorBoundary>
        </Route>

        <PrivateRoute
          path="/settings"
          authed={
            props.user.permissions["admin"] ||
            props.user.permissions["settings.edit"]
          }
        >
          <ConnectionContext.Provider
            value={{
              state: props.state.state,
              stateDescription: props.state.description,
              terminalData: props.terminalData || [],
              user: {
                username: props.user.username,
                permissions: props.user.permissions,
              },
            }}
          >
            <Suspense>
              <SettingPage />
            </Suspense>
          </ConnectionContext.Provider>
        </PrivateRoute>

        <PrivateRoute
          path="/terminal"
          authed={
            props.user.permissions["admin"] ||
            props.user.permissions["terminal.watch"] ||
            props.user.permissions["terminal.send"]
          }
        >
          <ConnectionContext.Provider
            value={{
              state: props.state.state,
              stateDescription: props.state.description,
              terminalData: props.terminalData || [],
              user: {
                username: props.user.username,
                permissions: props.user.permissions,
              },
            }}
          >
            <Suspense>
              <TerminalPage />
            </Suspense>
          </ConnectionContext.Provider>
        </PrivateRoute>

        <PrivateRoute
          path="/files"
          authed={
            props.user.permissions["admin"] ||
            props.user.permissions["file.access"] ||
            props.user.permissions["file.edit"]
          }
        >
          <ConnectionContext.Provider
            value={{
              state: props.state.state,
              stateDescription: props.state.description,
              terminalData: props.terminalData || [],
              user: {
                username: props.user.username,
                permissions: props.user.permissions,
              },
            }}
          >
            <Suspense>
              <FilePage />
            </Suspense>
          </ConnectionContext.Provider>
        </PrivateRoute>

        <Route>
          <ConnectionContext.Provider
            value={{
              state: props.state.state,
              stateDescription: props.state.description,
              terminalData: props.terminalData || [],
              user: {
                username: props.user.username,
                permissions: props.user.permissions,
              },
            }}
          >
            <Suspense>
              <UnknownPage />
            </Suspense>
          </ConnectionContext.Provider>
        </Route>
      </Switch>
    </Router>
  );
}
