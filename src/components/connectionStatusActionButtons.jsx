import {
  faLink,
  faPowerOff,
  faStopCircle,
  faSync,
} from "@fortawesome/pro-regular-svg-icons";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import getURL from "../tools/geturl";

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
              onClick={disconnect}
            >
              <FontAwesomeIcon icon={faPowerOff} />
            </button>
            <button
              title="Reconnect Device"
              disabled={loading}
              className="button is-small is-warning"
              onClick={reconnect}
            >
              <FontAwesomeIcon icon={faSync} />
            </button>
          </div>
        </div>
      );
    case "Printing":
      if (permissions.admin != true) {
        return null;
      }
      let buttons = [];
      if (permissions.admin == true || permissions["connection.edit"]) {
        buttons.push(
          <button
            title="Disconnect device"
            className="button is-small is-danger"
            disabled={loading}
            key="Disconnect"
            onClick={disconnect}
          >
            <FontAwesomeIcon icon={faPowerOff} />
          </button>
        );
        buttons.push(
          <button
            key="Reconnect"
            title="Reconnect Device"
            disabled={loading}
            className="button is-small is-warning"
            onClick={reconnect}
          >
            <FontAwesomeIcon icon={faSync} />
          </button>
        );
      }
      if (permissions.admin == true || permissions["print_state.edit"]) {
        buttons.push(
          <button
            title="Cancel print"
            className="button is-small is-danger"
            disabled={loading}
            key="CancelPrint"
            onClick={cancelPrint}
          >
            <FontAwesomeIcon icon={faStopCircle} />
          </button>
        );
      }
      return (
        <div className="connectionStatusActionButton">
          <div className="buttons is-centered">{buttons}</div>
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
              onClick={connect}
            >
              <FontAwesomeIcon icon={faLink} /> Connect printer
            </button>
          </div>
        </div>
      );
    default:
      return null;
  }
  function cancelPrint() {
    sendCommand("/api/print/", "DELETE");
  }
  function connect() {
    sendCommand("/api/connection", "PUT");
  }
  function disconnect() {
    sendCommand("/api/connection", "DELETE");
  }
  function reconnect() {
    sendCommand("/api/connection", "POST");
  }
  function sendCommand(url, method) {
    setLoading(true);
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
        if (response.ok) {
          return setLoading(false);
        }
        console.error(
          `Couldn't update connection. status received: ${response.status} - method used: ${method}`
        );
      })
      .catch((error) => console.log("error", error));
  }
}
