import {
  faLink,
  faPowerOff,
  faStopCircle,
  faSync,
} from "@fortawesome/pro-regular-svg-icons";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  connect as connectAction,
  reconnect as reconnectAction,
  disconnect as disconnectAction,
} from "../redux/actions/state";
import { cancelPrintAction } from "../redux/actions/file";
import { useDispatch } from "react-redux";

export default function ConnectionStatusActionButtons(props) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
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
    case "Connecting":
      return (
        <div className="connectionStatusActionButton">
          <div className="buttons is-centered">
            <button
              title="Connect Device"
              disabled={true}
              className={"button is-success is-loading"}
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
    dispatch(cancelPrintAction());
  }
  function connect() {
    dispatch(connectAction());
  }
  function disconnect() {
    dispatch(disconnectAction());
  }
  function reconnect() {
    dispatch(reconnectAction());
  }
}
