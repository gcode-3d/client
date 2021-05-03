import {
  faWrench,
  faHome,
  faFolderTree,
  faTerminal,
  faBell,
} from "@fortawesome/pro-regular-svg-icons";
import {
  faHome as faHomeSelected,
  faWrench as faWrenchSelected,
  faFolderTree as faFolderTreeSelected,
  faTerminal as faTerminalSelected,
  faBell as faBellSelected,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext } from "react";
import ConnectionContext from "./connectionContext";
import { Link } from "react-router-dom";

export default function StatusBar(props) {
  const connectionContext = useContext(ConnectionContext);
  const permissions = connectionContext.user.permissions;
  let allowedEntries = [];

  if (
    permissions["admin"] ||
    permissions["file.access"] ||
    permissions["file.edit"]
  ) {
    allowedEntries.push(
      <Link
        to="/files"
        className={
          props.pageName == "file" ? "sidebar-item selected" : "sidebar-item"
        }
        key="file"
      >
        <span className="icon">
          <FontAwesomeIcon
            icon={
              props.pageName == "file" ? faFolderTreeSelected : faFolderTree
            }
          />
        </span>
      </Link>
    );
  }
  if (
    permissions["admin"] ||
    permissions["terminal.watch"] ||
    permissions["terminal.send"]
  ) {
    allowedEntries.push(
      <Link
        to="/terminal"
        className={
          props.pageName == "terminal"
            ? "sidebar-item selected"
            : "sidebar-item"
        }
        key="terminal"
      >
        <span className="icon">
          <FontAwesomeIcon
            icon={
              props.pageName == "terminal" ? faTerminalSelected : faTerminal
            }
          />
        </span>
      </Link>
    );
  }
  let notificationItem = (
    <Link
      to="/notifications"
      className={
        props.pageName == "notifications"
          ? "sidebar-item selected"
          : "sidebar-item"
      }
    >
      <span className="icon">
        <FontAwesomeIcon
          icon={props.pageName == "notifications" ? faBellSelected : faBell}
        />
      </span>
    </Link>
  );
  let settingItem =
    permissions["admin"] ||
    permissions["settings.edit"] ||
    permissions["permissions.edit"] ? (
      <Link
        to="/settings"
        className={
          props.pageName == "settings"
            ? "sidebar-item selected"
            : "sidebar-item"
        }
      >
        <span className="icon">
          <FontAwesomeIcon
            icon={props.pageName == "settings" ? faWrenchSelected : faWrench}
          />
        </span>
      </Link>
    ) : undefined;

  return (
    <div className="sidebar">
      <Link
        to="/"
        className={
          props.pageName == "home" ? "sidebar-item selected" : "sidebar-item"
        }
      >
        <span className="icon">
          <FontAwesomeIcon
            icon={props.pageName == "home" ? faHomeSelected : faHome}
          />
        </span>
      </Link>
      {allowedEntries}
      <div className="sidebar-end">
        {settingItem}
        {notificationItem}
      </div>
    </div>
  );
}
