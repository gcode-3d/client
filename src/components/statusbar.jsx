import React, { useContext, useEffect, useState } from "react";
import "../styles/statusbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
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
import ConnectionStatusActionButtons from "./connectionStatusActionButtons";

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
            connectionContext.stateDescription,
            connectionContext.user
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
function getStateItem(state, description, user) {
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
        <StatusBarItem icon={icon} title="Printer disconnected">
          <div className="navbar-item">Your printer is disconnected</div>
          <ConnectionStatusActionButtons state={state} user={user} />
        </StatusBarItem>
      );
    case "Connected":
      icon = <FontAwesomeIcon icon={faCircle} color="#2aba2a" />;
      if (
        !description ||
        !description.tempData ||
        description.tempData.length == 0
      ) {
        return (
          <StatusBarItem icon={icon} title="Printer connected">
            <ConnectionStatusActionButtons state={state} user={user} />
          </StatusBarItem>
        );
      }
      let tempComponents = [];
      let temp = description.tempData[description.tempData.length - 1];
      if (temp.tools.length == 1) {
        if (temp.tools[0].targetTemp != 0) {
          tempComponents.push(
            <div key="extruder0" className="navbar-item">
              <b>Extruder:</b>
              <span className="temperature">
                {temp.tools[0].currentTemp}°C{" "}
                <FontAwesomeIcon icon={faArrowRight} />{" "}
                {temp.tools[0].targetTemp}
                °C
              </span>
            </div>
          );
        } else {
          tempComponents.push(
            <div key="extruder0" className="navbar-item">
              <b>Extruder:</b>
              <span className="temperature">{temp.tools[0].currentTemp}°C</span>
            </div>
          );
        }
      } else {
        for (var i = 0; i < temp.tools.length; i++) {
          if (temp.tools[i].targetTemp != 0) {
            tempComponents.push(
              <div key={"extruder" + i} className="navbar-item">
                <b>Extruder {i + 1}: </b>
                <span className="temperature">
                  {temp.tools[i].currentTemp}°C
                  <FontAwesomeIcon icon={faArrowRight} />
                  {temp.tools[i].targetTemp}°C
                </span>
              </div>
            );
          } else {
            tempComponents.push(
              <div key={"extruder" + i} className="navbar-item">
                <span className="temperature">
                  <b>Extruder {i + 1}: </b>
                  {temp.tools[i].currentTemp}°C
                </span>
              </div>
            );
          }
        }
      }

      if (temp.bed != null) {
        if (temp.bed.targetTemp != 0) {
          tempComponents.push(
            <div key="bed" className="navbar-item">
              <b>Bed:</b> {temp.bed.currentTemp}°C
              <FontAwesomeIcon icon={faArrowRight} />
              {temp.bed.targetTemp}°C
            </div>
          );
        } else {
          tempComponents.push(
            <div key="bed" className="navbar-item">
              <b>Bed:</b>
              <span className="temperature">{temp.bed.currentTemp}°C</span>
            </div>
          );
        }
      }
      if (temp.chamber != null) {
        if (temp.chamber.targetTemp != 0) {
          tempComponents.push(
            <div key="chamber" className="navbar-item">
              <b>Chamber:</b> {temp.chamber.currentTemp}°C
              <FontAwesomeIcon icon={faArrowRight} />
              {temp.chamber.targetTemp}°C
            </div>
          );
        } else {
          tempComponents.push(
            <div key="chamber" className="navbar-item">
              <b>Chamber:</b>
              <span className="temperature">{temp.chamber.currentTemp}°C</span>
            </div>
          );
        }
      }

      return (
        <StatusBarItem icon={icon} title="Printer connected">
          <div className="navbar-item">
            <h1 className="is-size-5">Temperatures:</h1>
          </div>
          {tempComponents}
          <ConnectionStatusActionButtons state={state} user={user} />
        </StatusBarItem>
      );
    case "Errored":
      icon = <FontAwesomeIcon icon={faExclamationCircle} color="red" />;
      return (
        <StatusBarItem icon={icon} title="Failed to connect">
          <div className="navbar-item">Error Message:</div>
          <div className="navbar-item">{description.errorDescription}</div>
          <ConnectionStatusActionButtons state={state} user={user} />
        </StatusBarItem>
      );
    default:
      icon = <FontAwesomeIcon icon={faBug} color="#2aba2a" />;
      return (
        <StatusBarItem icon={icon} title={`Unknown state (${state})`}>
          <div className="navbar-item">Additional info:</div>
          <div className="navbar-item">
            {typeof description == "string"
              ? description
              : JSON.stringify(description)}
          </div>
        </StatusBarItem>
      );
  }
}
