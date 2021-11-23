import React from "react";
import { Route, Navigate } from "react-router-dom";

function ProtectedRoute({ loggedIn: loggedIn, component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (loggedIn) {
          return <Component />;
        } else {
          return (
            <Navigate to={{ pathname: "/", state: { from: props.location } }} />
          );
        }
      }}
    />
  );
}

export default ProtectedRoute;
