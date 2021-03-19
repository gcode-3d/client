import React, { useState, useEffect, Suspense, lazy, Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "../pages/index";
import SettingPage from "../pages/settings";
import UnknownPage from "../pages/unknown";
import FilePage from "../pages/file";
import TerminalPage from "../pages/terminal";
import ConnectionContext from "./connectionContext.jsx";
import PrivateRoute from "./privateRoute";

export default function PageManager(props) {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
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
            <SettingPage />
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
            <TerminalPage />
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
            <FilePage />
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
            <UnknownPage />
          </ConnectionContext.Provider>
        </Route>
      </Switch>
    </Router>
  );
}
