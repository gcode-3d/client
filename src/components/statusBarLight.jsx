import React, { useContext, useState } from "react";
import "../styles/statusbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCube, faUser } from "@fortawesome/pro-regular-svg-icons";
import ConnectionContext from "./connectionContext";
import StatusBarItem from "./statusbarItem";

export default function StatusBarLight() {
  const [menuOpen, setMenuOpen] = useState(false);
  const connectionContext = useContext(ConnectionContext);
  const userContent = (
    <StatusBarItem icon={<FontAwesomeIcon icon={faUser} />} onClick={logout}>
      {connectionContext.user.username}
    </StatusBarItem>
  );

  return (
    <nav className="navbar is-dark">
      <div className="navbar-brand">
        <FontAwesomeIcon icon={faCube} size={"lg"} />
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

      <div className={"navbar-menu " + (menuOpen && "is-active")}>
        <div className="navbar-end">
          {connectionContext.user == null ? null : userContent}
        </div>
      </div>
    </nav>
  );
}

function logout() {
  localStorage.removeItem("auth");
  sessionStorage.removeItem("auth");
  window.location.reload();
}
