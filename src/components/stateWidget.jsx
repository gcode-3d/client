import React, { useContext } from "react";
import ConnectionContext from "./connectionContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBug,
  faExclamationCircle,
  faPrint,
  faSpinnerThird,
} from "@fortawesome/pro-regular-svg-icons";
import { faCircle, faWifi } from "@fortawesome/pro-duotone-svg-icons";
import "../styles/stateWidget.css";
import PrintStatusWidget from "./printStatusWidget";
import getURL from "../tools/geturl";

export default function StateWidget() {
  let context = useContext(ConnectionContext);
  let printInfo = null;
  if (
    context.state == "Printing" &&
    context.stateDescription != null &&
    context.stateDescription.printInfo != null
  ) {
    printInfo = {
      printTime:
        context.stateDescription.printInfo.estEndTime !== null
          ? new Date(context.stateDescription.printInfo.estEndTime).getTime() -
            new Date(context.stateDescription.printInfo.startTime).getTime()
          : 0,
      progress: context.stateDescription.printInfo.progress,
      tempInfo:
        context.stateDescription.tempData != null
          ? context.stateDescription.tempData[
              context.stateDescription.tempData.length - 1
            ]
          : null,
    };
  }
  return (
    <div className="columns status-widget">
      <StatusColumn
        printerName={"harry"}
        state={context.state}
        stateDescription={context.stateDescription}
      />
      <QuickActions
        state={context.state}
        stateDescription={context.stateDescription}
      />
      <div className="column is-narrow">
        {context.state == "Printing" && context.stateDescription.printInfo && (
          <PrintStatusWidget
            printTime={printInfo.printTime}
            progress={printInfo.progress}
            tempInfo={printInfo.tempInfo}
          />
        )}
      </div>
    </div>
  );
}

function StatusColumn(props) {
  let color = "#595959";
  let icon = null;
  switch (props.state) {
    case "Disconnected":
      icon = <FontAwesomeIcon icon={faCircle} />;
      color = "#595959";
      break;
    case "Errored":
      icon = <FontAwesomeIcon icon={faExclamationCircle} />;
      color = "#ff0000";
      break;
    case "Printing":
      icon = <FontAwesomeIcon icon={faPrint} />;
      color = "#2aba2a";
      break;
    case "Connected":
      icon = <FontAwesomeIcon icon={faCircle} />;
      color = "#2aba2a";
      break;
    case "Preparing":
      icon = <FontAwesomeIcon icon={faSpinnerThird} spin={true} />;
      color = "##fffc4e";
      break;
    case "Connecting":
      icon = <FontAwesomeIcon icon={faWifi} />;
      color = "#2fffd8";
      break;
    default:
      icon = <FontAwesomeIcon icon={faBug} />;
      break;
  }
  return (
    <div className="column">
      <div className="status-icon" style={{ color }}>
        {icon}
      </div>
      <div className="status-text">
        <h1 className="title">
          {props.printerName.includes("printer")
            ? `${props.printerName[0].toUpperCase()}${props.printerName.slice(
                1
              )}`
            : `${props.printerName[0].toUpperCase()}${props.printerName.slice(
                1
              )}-Printer`}
        </h1>
        <h4 className="subtitle">
          {getStatusText(props.state, props.stateDescription)}
        </h4>
      </div>
    </div>
  );

  function getStatusText(state, description) {
    switch (state) {
      case "Errored":
        if (description.errorDescription != null) {
          return "Encountered an error: " + description.errorDescription;
        }
        return `Encountered an unknown error: Consult the logs for more information.`;
      case "Disconnected":
        return "Your printer is disconnected";
      case "Printing":
        return `Currently printing ${
          description.printInfo ? description.printInfo.file.name : "Unknown"
        }`;
      case "Connecting":
        return `Attempting to connect to your printer, this could take a few seconds.`;
      case "Connected":
        return `Your printer is connected`;
      case "Preparing":
        return `Analysing gcode file for new print ${
          description.printInfo ? description.printInfo.file.name : "Unknown"
        }`;
      default:
        return `Unknown state: ${state}`;
    }
  }
}

function QuickActions({ state }) {
  let actions = [];

  let connectButton = (
    <a key="connect" onClick={connect}>
      Connect printer
    </a>
  );

  let reconnectButton = (
    <a key="reconnect" onClick={reconnect}>
      Reconnect printer
    </a>
  );

  let disconnectButton = (
    <a key="disconnect" onClick={disconnect}>
      Disconnect printer
    </a>
  );

  let emergencyButton = (
    <a key="emergency" style={{ color: "#B94C4C" }} onClick={emergency}>
      Emergency shutdown
    </a>
  );

  let cancelPrintButton = (
    <a key="cancel" onClick={cancel}>
      cancel printer
    </a>
  );

  switch (state) {
    case "Errored":
      actions.push(connectButton);
      break;
    case "Disconnected":
      actions.push(connectButton);
      break;
    case "Printing":
    case "Preparing":
      actions.push(cancelPrintButton);
      actions.push(reconnectButton);
      actions.push(disconnectButton);
      actions.push(emergencyButton);
      break;
    case "Connected":
      actions.push(reconnectButton);
      actions.push(disconnectButton);
      actions.push(emergencyButton);
  }
  if (actions.length == 0) {
    return null;
  }

  return (
    <div className="column is-narrow has-text-right">
      <h1 className="title">Quick actions</h1>
      <div className="spacedList">{actions}</div>
    </div>
  );
  function connect() {
    sendCommand("/api/connection/", "PUT");
  }
  function disconnect() {
    sendCommand("/api/connection/", "DELETE");
  }
  function reconnect() {
    sendCommand("/api/connection/", "POST");
  }
  function emergency() {
    sendCommand("/api/connection/emergency/", "POST");
  }
  function cancel() {
    sendCommand("/api/print/cancel", "PUT");
  }
  function sendCommand(url, method) {
    let headers = new Headers();
    headers.append(
      "Authorization",
      "auth-" + (localStorage.getItem("auth") || sessionStorage.getItem("auth"))
    );

    var requestOptions = {
      method: method,
      headers: headers,
    };

    fetch(getURL() + url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          console.error(
            `Couldn't update connection. status received: ${response.status} - method used: ${method}`
          );
        }
      })
      .catch((error) => console.log("error", error));
  }
}
