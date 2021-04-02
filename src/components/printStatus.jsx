import React, { useContext } from "react";
import ConnectionContext from "./connectionContext";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff, faSync } from "@fortawesome/pro-regular-svg-icons";
import emitter from "../tools/emitter";
import { DateTime } from "luxon";
export default function PrintStatusWidget() {
  let context = useContext(ConnectionContext);
  if (
    context.state == "Printing" &&
    context.stateDescription.printInfo != null
  ) {
    const now = DateTime.local();
    const past = DateTime.fromISO(context.stateDescription.printInfo.startTime);
    const diff = now.diff(past, "minutes");

    const estEndTime = DateTime.fromISO(
      context.stateDescription.printInfo.estEndTime
    );
    const endDiff = now.diff(estEndTime, "minutes");
    return (
      <div>
        <h1 className="title">
          Printing {context.stateDescription.printInfo.file.name} (
          {context.stateDescription.printInfo.progress}%)
        </h1>
        <h1 className="subtitle">
          Started {Math.floor(diff.minutes)} minutes ago.
        </h1>

        {context.stateDescription.printInfo.estEndTime != null && (
          <h1 className="subtitle">
            The print will finish in about{" "}
            {Math.floor(Math.abs(endDiff.minutes))} minutes.
          </h1>
        )}
      </div>
    );
  } else if (context.state == "Connected") {
    return (
      <div>
        <h1 className="title">Not currently printing</h1>
        <h1 className="subtitle">
          Your printer is not printing at the moment,
          <br /> start a new print in the <Link to="/files">files page</Link>
          <hr />
          <div className="buttons is-centered">
            <button
              className="button has-icon is-warning"
              onClick={() => {
                emitter.emit("client.state.update", "reconnect");
              }}
            >
              <FontAwesomeIcon icon={faSync} /> Reconnect printer
            </button>
            <button
              className="button has-icon is-danger"
              onClick={() => {
                emitter.emit("client.state.update", "disconnect");
              }}
            >
              <FontAwesomeIcon icon={faPowerOff} /> Disconnect printer
            </button>
          </div>
        </h1>
      </div>
    );
  } else {
    return <div>Unknown print state</div>;
  }
}
