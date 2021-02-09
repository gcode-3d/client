import { faAngleDown } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import PrepareDeviceForm from "../components/prepareDeviceForm";
export default function PrepareDeviceSetupPage({ device }) {
  const [name, setName] = useState(null);
  console.log(device);

  // TODO: Move dropdown into Component
  return (
    <div className="page-content">
      <h1 className="title">Setting up {name || device.path}</h1>
      <h1 className="subtitle">{device.manufacturer}</h1>
      <div className="dropdown is-hoverable">
        <div className="dropdown-trigger">
          <button
            className="button is-text"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
          >
            <span>Advanced information</span>
            <span className="icon is-small">
              <FontAwesomeIcon icon={faAngleDown} />
            </span>
          </button>
        </div>
        <div className="dropdown-menu" id="dropdown-menu" role="menu">
          <div className="dropdown-content">
            <div className="dropdown-item">
              <table className="table has-text-black">
                <tbody>
                  {Object.entries(device).map((i) => {
                    return (
                      <tr key={i[0]}>
                        <td>{i[0]}</td>
                        <td>{i[1] || "Unknown"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <PrepareDeviceForm path={device.path} />
    </div>
  );
}
