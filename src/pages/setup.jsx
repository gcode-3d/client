import { faSyncAlt } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import SetupDeviceBox from "../components/setupDeviceBox";
import StatusBarLight from "../components/statusBarLight";
import "../styles/setup.css";
import PrepareDeviceSetupPage from "./prepareDeviceForSetup";
export default function Setup() {
  const [loading, setLoading] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selected, setSelected] = useState(null);
  let unmounted = false;
  useEffect(function () {
    reloadDevices();
    return function () {
      unmounted = true;
    };
  }, []);

  const deviceSelector = (
    <>
      {" "}
      {devices.length == 0 && (
        <h1 className="is-size-5">No devices detected</h1>
      )}
      <div className="setup-inner">
        {devices.map((device, index) => {
          return (
            <SetupDeviceBox
              device={device}
              key={index}
              onClick={() => {
                setSelected(device);
              }}
            />
          );
        })}
      </div>
    </>
  );

  if (selected) {
    return (
      <>
        <StatusBarLight />
        <PrepareDeviceSetupPage device={selected} />
      </>
    );
  }

  return (
    <>
      <StatusBarLight />
      <div className="setup">
        <h1 className="title">Setting up a new device</h1>
        <h1 className="subtitle">
          <a onClick={reloadDevices} disabled={loading}>
            <span className="icon-text">
              <span className="icon">
                <FontAwesomeIcon icon={faSyncAlt} spin={loading} />
              </span>
              {loading ? (
                <span>Reloading detected devices...</span>
              ) : (
                <span>Reload detected devices</span>
              )}
            </span>
          </a>
        </h1>
        {selected ? selectedPage : deviceSelector}
      </div>
    </>
  );
  function reloadDevices() {
    if (!loading) {
      if (!unmounted) {
        setLoading(true);
      }
      var headers = new Headers();
      headers.append(
        "Authorization",
        "auth-" +
          (localStorage.getItem("auth") || sessionStorage.getItem("auth"))
      );

      var requestOptions = {
        method: "GET",
        headers: headers,
      };

      fetch("/api/fetchDevices", requestOptions)
        .then(async (response) => {
          let json = await response.json();
          if (!unmounted) {
            setDevices(json);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);
          if (!unmounted) {
            setLoading(false);
          }
        });
    }
  }
}
