import { faLink, faPowerOff, faSync } from "@fortawesome/pro-regular-svg-icons";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import emitter from "../tools/emitter";

export default function ConnectionStatusActionButtons(props) {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    return () => {
      setLoading(false);
    };
  }, [props]);
  if (!props.user) {
    return null;
  }
  let permissions = props.user.permissions;
  switch (props.state) {
    case "Connected":
      if (permissions.admin != true && permissions["connection.edit"] != true) {
        return null;
      }
      return (
        <div className="connectionStatusActionButton">
          <div className="buttons is-centered">
            <button
              title="Disconnect device"
              className="button is-small is-danger"
              disabled={loading}
              onClick={() => {
                setLoading(true);
                emitter.emit("client.state.update", "disconnect");
              }}
            >
              <FontAwesomeIcon icon={faPowerOff} />
            </button>
            <button
              title="Reconnect Device"
              disabled={loading}
              className="button is-small is-warning"
              onClick={() => {
                setLoading(true);
                emitter.emit("client.state.update", "reconnect");
              }}
            >
              <FontAwesomeIcon icon={faSync} />
            </button>
          </div>
        </div>
      );
    case "Disconnected":
    case "Errored":
      if (permissions.admin != true && permissions["connection.edit"] != true) {
        return null;
      }
      return (
        <div className="connectionStatusActionButton">
          <div className="buttons is-centered">
            <button
              title="Connect Device"
              disabled={loading}
              className={"button is-success " + (loading ? "is-loading" : "")}
              onClick={() => {
                setLoading(true);
                emitter.emit("client.state.update", "connect");
              }}
            >
              <FontAwesomeIcon icon={faLink} /> Connect printer
            </button>
          </div>
        </div>
      );
    default:
      return null;
  }
}
