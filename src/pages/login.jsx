import { faSpinner } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import "../styles/login.css";
import GETURL from "../tools/geturl";

module.exports = ({ callback }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [doRemember, setRemember] = useState(true);
  const [isBusy, setBusy] = useState(false);
  const [showError, setError] = useState(false);
  const [customErrorMessage, setCustomError] = useState(null);

  useEffect(() => {
    let unmount = false;
    (async () => {
      try {
        var result = await fetch(GETURL() + "/api/ping");
        if (!result.ok && !unmount) {
          setCustomError("Error: Cannot connect to server.");
        }
      } catch (e) {
        console.error(e);
        if (!unmount) {
          setCustomError("Error: Cannot connect to server.");
        }
      }
    })();
    return () => {
      unmount = true;
    };
  }, []);

  return (
    <div className="loginContainer">
      <div className="loginBox">
        <h1>You need to login first:</h1>
        {customErrorMessage && (
          <span className="errorMessage">{customErrorMessage}</span>
        )}
        <label htmlFor="login_username">
          Username{" "}
          <span hidden={!(showError && username.length == 0)}>
            - Enter a username
          </span>
        </label>
        <input
          id="login_username"
          type="text"
          placeholder="Username"
          value={username}
          required={true}
          onChange={(e) => {
            setError(false);
            setUsername(e.currentTarget.value);
          }}
        />
        <label htmlFor="login_password">
          Password{" "}
          <span hidden={!(showError && password.length == 0)}>
            - Enter a password
          </span>
        </label>

        <input
          id="login_password"
          type="password"
          placeholder="Password"
          required={true}
          value={password}
          onChange={(e) => {
            setError(false);
            setPassword(e.currentTarget.value);
          }}
        />
        <label htmlFor="login_remember">
          <input
            type="checkbox"
            checked={doRemember}
            id="login_remember"
            onChange={(e) => {
              setRemember(e.currentTarget.checked);
            }}
          />
          Remember this login
        </label>

        <button disabled={isBusy} onClick={handleLogin}>
          {isBusy ? <FontAwesomeIcon icon={faSpinner} spin={true} /> : "Log in"}
        </button>
      </div>
    </div>
  );
  function handleLogin() {
    if (password.length == 0 || username.length == 0) {
      return setError(true);
    }
    setError(false);
    setBusy(true);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("username", username);
    urlencoded.append("password", password);
    urlencoded.append("remember", doRemember ? "true" : false);
    urlencoded.append("datetime", new Date().toISOString());

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };
    setBusy(true);
    fetch(GETURL() + "/api/login", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.error) {
          console.log("error", result.message);
          setCustomError(result.message);
          setBusy(false);
        } else if (result.token != null) {
          if ("Storage" in window) {
            if (doRemember) {
              localStorage.setItem("auth", result.token);
            } else {
              sessionStorage.setItem("auth", result.token);
            }
            callback();
          } else {
            callback(token);
          }
        }
      })
      .catch((error) => {
        console.log("error", error);
        setCustomError("Something went wrong while logging in.");
        setBusy(false);
      });
  }
};
