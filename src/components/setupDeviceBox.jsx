import { faServer } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function SetupDeviceBox(props) {
  return (
    <div className="deviceBox" onClick={props.onClick}>
      <FontAwesomeIcon icon={faServer} size="3x" />
      <h1>{props.device.path}</h1>
      <h2>{props.device.manufacturer}</h2>
    </div>
  );
}
