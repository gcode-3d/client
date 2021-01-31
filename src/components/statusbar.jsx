import React, { useContext, useEffect, useState } from "react";
import "../styles/statusbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCube, faPlug, faUser } from "@fortawesome/pro-regular-svg-icons";
import { faComputerSpeaker, faSlash } from "@fortawesome/pro-solid-svg-icons";
import ConnectionContext from "./connectionContext";
import StatusBarItem from "./statusbarItem";
import { Link } from "react-router-dom";

export default function StatusBar() {
  const connectionContext = useContext(ConnectionContext);
  const userContent = (
    <StatusBarItem icon={<FontAwesomeIcon icon={faUser} />} onClick={logout}>
      {connectionContext.user.username}
    </StatusBarItem>
  );

  return (
    <nav className="navbar is-dark">
      <div className="navbar-brand">
        <Link to="/">
          <FontAwesomeIcon icon={faCube} size={"lg"} />
        </Link>
      </div>
      <div className="navbar-menu">
        <div className="navbar-end">
          {getStateItem(connectionContext.state)}
          {connectionContext.user == null ? null : userContent}
        </div>
      </div>
    </nav>
  );
}

function logout() {
  console.log("test!");
  localStorage.removeItem("auth");
  sessionStorage.removeItem("auth");
  window.location.reload();
}
function getStateItem(state) {
  switch (state) {
    case "Disconnected":
      let icon = (
        <span className="fa-layers fa-fw">
          <FontAwesomeIcon icon={faPlug} />
          <FontAwesomeIcon icon={faSlash} size="sm" flip={"horizontal"} />
        </span>
      );
      return <StatusBarItem icon={icon}>Printer disconnected</StatusBarItem>;
    default:
      return false;
  }
}
