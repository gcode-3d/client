import React, { Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ErrorBoundary from "./errorBoundary.jsx";
import PrivateRoute from "./privateRoute";

const Home = React.lazy(() => import("../pages/index"));
const SettingPage = lazy(() => import("../pages/settings"));
const UnknownPage = lazy(() => import("../pages/unknown"));
const TerminalPage = lazy(() => import("../pages/terminal"));
const FilePage = lazy(() => import("../pages/file"));
const NotificationPage = lazy(() => import("../pages/notifications"));

export default function PageManager(props) {
  const user = useSelector((state) => state.user);
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <ErrorBoundary>
            <Suspense>
              <Home />
            </Suspense>
          </ErrorBoundary>
        </Route>

        <Route path="/notifications">
          <ErrorBoundary>
            <Suspense>
              <Suspense>
                <NotificationPage />
              </Suspense>
            </Suspense>
          </ErrorBoundary>
        </Route>

        <PrivateRoute
          path="/settings"
          authed={
            user.permissions["admin"] || user.permissions["settings.edit"]
          }
        >
          <Suspense>
            <SettingPage />
          </Suspense>
        </PrivateRoute>

        <PrivateRoute
          path="/terminal"
          authed={
            user.permissions["admin"] ||
            user.permissions["terminal.watch"] ||
            user.permissions["terminal.send"]
          }
        >
          <Suspense>
            <TerminalPage />
          </Suspense>
        </PrivateRoute>

        <PrivateRoute
          path="/files"
          authed={
            user.permissions["admin"] ||
            user.permissions["file.access"] ||
            user.permissions["file.edit"]
          }
        >
          <Suspense>
            <FilePage />
          </Suspense>
        </PrivateRoute>

        <Route>
          <Suspense>
            <UnknownPage />
          </Suspense>
        </Route>
      </Switch>
    </Router>
  );
}
