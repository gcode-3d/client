import React, { useState, useEffect, Suspense, lazy, Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "../pages/index";
const context = React.createContext({ user: null });

export default function PageManager() {
  return (
    <Router>
      <Suspense fallback={<div>Loading content</div>}>
        <Switch>
          <Route path="/">
            <context.Provider>
              <Home />
            </context.Provider>
          </Route>
        </Switch>
      </Suspense>
    </Router>
  );
}
