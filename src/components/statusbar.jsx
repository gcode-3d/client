import React, { useContext, useEffect, useState } from "react";
import "../styles/statusbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBug,
  faCube,
  faExclamationCircle,
  faPlug,
  faUser,
} from "@fortawesome/pro-regular-svg-icons";
import { faSlash } from "@fortawesome/pro-solid-svg-icons";
import { faCircle } from "@fortawesome/pro-duotone-svg-icons";
import ConnectionContext from "./connectionContext";
import StatusBarItem from "./statusbarItem";
import { Link } from "react-router-dom";

export default function StatusBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const connectionContext = useContext(ConnectionContext);
  const userContent = (
    <StatusBarItem
      icon={<FontAwesomeIcon icon={faUser} />}
      title={connectionContext.user.username}
    >
      <a onClick={logout} className="navbar-item">
        Logout
      </a>
    </StatusBarItem>
  );

  return (
    <nav className="navbar is-dark">
      <div className="navbar-brand">
        <Link to="/">
          <FontAwesomeIcon icon={faCube} size={"lg"} />
        </Link>
      </div>
      <a
        role="button"
        className="navbar-burger"
        data-target="navMenu"
        aria-label="menu"
        aria-expanded="false"
        onClick={() => {
          setMenuOpen(!menuOpen);
        }}
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>

      <div className={"navbar-menu " + (menuOpen ? "is-active" : "")}>
        <div className="navbar-end">
          {getStateItem(
            connectionContext.state,
            connectionContext.stateDescription
          )}
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
function getStateItem(state, description) {
  let icon;
  switch (state) {
    case "Disconnected":
      icon = (
        <span className="fa-layers fa-fw">
          <FontAwesomeIcon icon={faPlug} />
          <FontAwesomeIcon icon={faSlash} size="sm" flip={"horizontal"} />
        </span>
      );
      return (
        <StatusBarItem icon={icon} title="Printer disconnected"></StatusBarItem>
      );
    case "Connected":
      icon = <FontAwesomeIcon icon={faCircle} color="#2aba2a" />;
      return (
        <StatusBarItem icon={icon} title="Printer connected"></StatusBarItem>
      );
    case "Errored":
      icon = <FontAwesomeIcon icon={faExclamationCircle} color="red" />;
      return (
        <StatusBarItem icon={icon} title="Failed to connect">
          <div className="navbar-item">Error Message:</div>
          <div className="navbar-item">{description}</div>
        </StatusBarItem>
      );
    default:
      icon = <FontAwesomeIcon icon={faBug} color="#2aba2a" />;
      return (
        <StatusBarItem icon={icon} title={`Unknown state (${state})`}>
          <div className="navbar-item">Additional info:</div>
          <div className="navbar-item">{description}</div>
        </StatusBarItem>
      );
  }
}
