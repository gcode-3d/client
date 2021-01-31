import React from "react";
import { Route, Redirect } from "react-router-dom";

export default function PrivateRoute({ children, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        authed === true ? (
          children
        ) : (
          <Redirect to={{ pathname: "/", state: { from: props.location } }} />
        )
      }
    />
  );
}
