import {
  faCheckCircle,
  faExclamationCircle,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import GETURL from "../../tools/geturl";
import SettingDeviceField from "./settingDeviceField";

let activeTimeout;

export default function SettingRow(props) {
  const [value, setValue] = useState(props.value == null ? "" : props.value);
  const [loading, setLoading] = useState(false);
  const [errorInfo, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    if (props._name.startsWith("B")) {
      saveSetting();
    }
  }, [value]);

  useEffect(() => {
    return () => {
      if (activeTimeout) {
        clearTimeout(activeTimeout);
      }
    };
  }, []);

  let statusIcons = (
    <>
      {errorInfo != null && (
        <div
          className="is-flex has-text-danger"
          style={{ alignItems: "center" }}
        >
          <span
            className="icon is-medium"
            title={errorInfo == null ? "" : errorInfo}
          >
            <FontAwesomeIcon icon={faExclamationCircle} />
          </span>
        </div>
      )}
      {saved && (
        <div
          className="is-flex has-text-success"
          style={{ alignItems: "center" }}
        >
          <span className="icon is-medium">
            <FontAwesomeIcon icon={faCheckCircle} />
          </span>
        </div>
      )}
    </>
  );
  if (props._name.startsWith("B")) {
    return (
      <div className="field is-horizontal">
        <div className="field-label is-normal  has-text-left">
          <label className="label" title={props.description}>
            {props.name}
          </label>
        </div>
        <div className="field-body">
          <div className="control">
            <div className={"select " + (loading ? "is-loading" : "")}>
              <select value={value} disabled={loading} onChange={handleChange}>
                <option value={true}>Enable</option>
                <option value={false}>Disable</option>
              </select>
            </div>
          </div>
          {statusIcons}
        </div>
      </div>
    );
  }

  if (props._name.startsWith("N")) {
    return (
      <div className="field is-horizontal">
        <div className="field-label is-normal has-text-left">
          <label className="label" title={props.description}>
            {props.name}
          </label>
        </div>
        <div className="field-body">
          <div className={"control " + (loading ? "is-loading" : "")}>
            <input
              onChange={handleChange}
              onBlur={saveSetting}
              className="input"
              type="number"
              step="0.01"
              disabled={loading}
              placeholder={props.example}
              value={value}
            />
          </div>
          {statusIcons}
        </div>
      </div>
    );
  }

  if (props._name.startsWith("D_")) {
    return (
      <SettingDeviceField
        onChange={handleChange}
        loading={loading}
        statusIcons={statusIcons}
        placeholder={props.example}
        setError={() => {
          setError("Couldn't load device list");
        }}
        value={value}
        name={props.name}
        description={props.description}
      />
    );
  }

  return (
    <div className="field is-horizontal">
      <div className="field-label is-normal has-text-left">
        <label className="label" title={props.description}>
          {props.name}
        </label>
      </div>
      <div className="field-body">
        <div className={"control " + (loading ? "is-loading" : "")}>
          <input
            onChange={handleChange}
            className="input"
            readOnly={loading}
            type="text"
            placeholder={props.example}
            value={value}
            onBlur={saveSetting}
          />
        </div>

        {statusIcons}
      </div>
    </div>
  );
  function handleChange(e) {
    if (!e.target.type == "number" && !e.target.value) {
      return;
    }
    setValue(e.target.value);
  }

  function saveSetting() {
    if (value === (props.value == null ? "" : props.value)) {
      return;
    }
    if (activeTimeout) {
      clearTimeout(activeTimeout);
    }
    setSaved(false);
    setError(null);
    setLoading(true);

    if (
      props._name.startsWith("N_") &&
      !/^-?\d+(?:[.,]\d{0,2})?$/.test(value)
    ) {
      setError(
        "Please enter a valid number, with up to 2 digits after the comma."
      );
      setLoading(false);
      return;
    }
    if (
      props._name.startsWith("N_") &&
      (value.endsWith(".") || value.endsWith(","))
    ) {
      console.log("CHANGING");
      setValue(value.slice(0, -1));
    }

    var headers = new Headers();
    headers.append(
      "Authorization",
      "auth-" + (localStorage.getItem("auth") || sessionStorage.getItem("auth"))
    );
    headers.append("Content-Type", "application/json");

    var json = JSON.stringify({
      settingName: props._name,
      settingValue: value,
    });

    var requestOptions = {
      method: "POST",
      headers,
      body: json,
    };
    fetch(GETURL() + "/api/settings/", requestOptions)
      .then(async (response) => {
        setLoading(false);

        if (response.ok) {
          setSaved(true);
          if (activeTimeout) {
            clearTimeout(activeTimeout);
          }
          activeTimeout = setTimeout(() => {
            setSaved(false);
          }, 4000);
          props.onValueChange(value);
        } else {
          let text = await response.text();
          try {
            let json = JSON.parse(text);
            if (json.error) {
              console.error(json.message);
              setError("Error: " + json.message);
            } else {
              setError("An error has occured, try again");
              console.error(text);
            }
          } catch {
            console.error(">>", text);
            setError("An error has occured, try again");
          }
          setValue(props.value);
        }
      })
      .catch((error) => {
        setLoading(false);
        setValue(props.value);

        console.log("error", error);
        setError("An error has occured, try again");
      });
  }
}
