import React, { useEffect, useState } from "react";
import GETURL from "../../tools/geturl";

export default function SettingDeviceField(props) {
  const [devices, setDevices] = useState([]);
  useEffect(() => {
    var headers = new Headers();
    headers.append(
      "Authorization",
      "auth-" + (localStorage.getItem("auth") || sessionStorage.getItem("auth"))
    );
    headers.append("Content-Type", "application/json");

    var requestOptions = {
      method: "GET",
      headers,
    };
    fetch(GETURL() + "/api/deviceList/", requestOptions)
      .then(async (response) => {
        if (response.ok) {
          try {
            let devices = await response.json();
            setDevices(devices);
          } catch (e) {
            props.setError();
          }
        } else {
          props.setError();
        }
      })
      .catch((error) => {
        console.log("error", error);
        props.setError();
      });
  }, []);

  return (
    <div className="field is-horizontal">
      <div className="field-label is-normal  has-text-left">
        <label className="label" title={props.description}>
          {props.name}
        </label>
      </div>
      <div className="field-body">
        <div className="control">
          <div
            className={
              "select " +
              (props.loading || devices.length == 0 ? "is-loading" : "")
            }
          >
            <select
              value={props.value}
              disabled={props.loading || devices.length == 0}
              onChange={props.onChange}
            >
              {devices.length == 0 && (
                <option value={props.value}>{props.value}</option>
              )}
              {devices.map((device) => (
                <option key={device.name} value={device.name}>
                  {device.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {props.statusIcons}
      </div>
    </div>
  );
}
