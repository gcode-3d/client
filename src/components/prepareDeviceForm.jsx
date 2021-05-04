import { faExclamationTriangle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import GETURL from "../tools/geturl.js";
let baudrates = [
  "Auto",
  115200,
  57600,
  38400,
  19200,
  14400,
  9600,
  4800,
  2400,
  1200,
  300,
  110,
];

export default function PrepareDeviceForm({ path }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setError] = useState(undefined);
  const [name, setName] = useState("");
  const [xSize, setXSize] = useState("");
  const [ySize, setYSize] = useState("");
  const [zSize, setZSize] = useState("");
  const [heatedBed, setHeatedBed] = useState(false);
  const [heatedChamber, setHeatedChamber] = useState(false);
  const [baudrate, setBaudrate] = useState(baudrates[0]);
  return (
    <div className="prepareDeviceForm">
      <div className="columns">
        <div
          className="column is-one-third has-text-left"
          style={{ margin: "auto" }}
        >
          <div className="field">
            <label className="label">
              Device name <span className="tag is-danger">Required</span>
            </label>
            <div className="control">
              <input
                className="input"
                disabled={loading}
                required={true}
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
                type="text"
                placeholder="A name to recognise your device"
              />
            </div>
          </div>
          <div className="field">
            <div className="columns">
              <div className="column is-one-third control">
                <label className="label">
                  Width (X) <span className="tag is-danger">Required</span>
                </label>
                <input
                  className="input"
                  disabled={loading}
                  onChange={(e) => setXSize(e.currentTarget.value)}
                  required={true}
                  type="number"
                  value={xSize}
                  placeholder="Size in mm"
                />
              </div>
              <div className="column is-one-third control ">
                <label className="label">
                  Depth (Y) <span className="tag is-danger">Required</span>
                </label>
                <input
                  className="input"
                  disabled={loading}
                  onChange={(e) => setYSize(e.currentTarget.value)}
                  required={true}
                  type="number"
                  value={ySize}
                  placeholder="Size in mm"
                />
              </div>
              <div className="column is-one-third control">
                <label className="label">
                  Height (Z) <span className="tag is-danger">Required</span>
                </label>
                <input
                  className="input"
                  disabled={loading}
                  onChange={(e) => setZSize(e.currentTarget.value)}
                  required={true}
                  type="number"
                  value={zSize}
                  placeholder="Size in mm"
                />
              </div>
            </div>
          </div>
          <div className="field">
            <label className="label">Temperature</label>
            <div className="columns">
              <div className="column is-half">
                <label className="checkbox">
                  <input
                    checked={heatedBed}
                    onChange={(e) => setHeatedBed(e.currentTarget.checked)}
                    disabled={loading}
                    type="checkbox"
                  />{" "}
                  Heated bed
                </label>
              </div>
              <div className="column is-half">
                <label className="checkbox">
                  <input
                    checked={heatedChamber}
                    onChange={(e) => setHeatedChamber(e.currentTarget.checked)}
                    disabled={loading}
                    type="checkbox"
                  />{" "}
                  Heated chamber
                </label>
              </div>
            </div>
          </div>
          <div className="field">
            <label className="label">
              Baudrate <span className="tag is-danger">Required</span>
            </label>
            <div className="select">
              <select
                disabled={loading}
                value={baudrate}
                onChange={(e) => setBaudrate(e.currentTarget.value)}
              >
                {baudrates.map((br) => {
                  return (
                    <option key={br} value={br}>
                      {br}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="field">
            {errorMsg && (
              <h5 className="is-size-5 hint has-text-warning">
                <FontAwesomeIcon icon={faExclamationTriangle} /> {errorMsg}
              </h5>
            )}

            <div className="control">
              <button
                onClick={testConnection}
                disabled={loading}
                className={"button is-info " + (loading && "is-loading")}
              >
                Test connection
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  function testConnection(e) {
    setLoading(true);
    setError();

    if (name.trim().length == 0) {
      setError("Device name isn't set");
      setLoading(false);
      return;
    }
    if (name.trim().length > 254) {
      setError("Device name cannot be longer then 254 characters");
      setLoading(false);
      return;
    }
    if (xSize.trim().length == 0 || isNaN(xSize)) {
      setLoading(false);
      return setError("Width should be a number");
    } else if (isNaN(ySize) || ySize.trim().length == 0) {
      setLoading(false);
      return setError("Depth should be a number");
    } else if (isNaN(zSize) || zSize.trim().length == 0) {
      setLoading(false);
      return setError("Height should be a number");
    }
    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      "auth-" + (localStorage.getItem("auth") || sessionStorage.getItem("auth"))
    );
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("name", name);
    urlencoded.append("width", xSize);
    urlencoded.append("depth", ySize);
    urlencoded.append("height", zSize);
    urlencoded.append("heatedBed", heatedBed);
    urlencoded.append("heatedChamber", heatedChamber);
    urlencoded.append("baudRate", baudrate);
    urlencoded.append("path", path);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
    };

    fetch(GETURL() + "/api/setup", requestOptions)
      .then((response) => {
        if (!response.ok) {
          setLoading(false);
          return setError(
            "An error occurred while setting up. Try again later"
          );
        }
        response.text().then((result) => console.log(result));
      })
      .catch((error) => {
        console.log("error", error);
        setLoading(false);
        setError("An error occurred while setting up. Try again later");
      });
  }
}
