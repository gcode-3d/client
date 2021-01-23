import React, { useEffect, useState } from "react";
import Emitter from "../tools/emitter";
import "../styles/statusbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCube, faUser } from "@fortawesome/pro-regular-svg-icons";

export default function StatusBar(_) {
  const [username, setUserName] = new useState(null);
  useEffect(() => {
    return function () {
      console.log("context:>");
      console.log(context);
      setUserName(context.user.username);
    };
  }, []);
  const userContent = (
    <div className="statusbar-item">
      <FontAwesomeIcon icon={faUser} />
      <span>{" " + username}</span>
    </div>
  );
  return (
    <div className="statusbar">
      <div className="icon">
        <FontAwesomeIcon icon={faCube} size={"lg"} />
      </div>

      <div className="content">{username == null ? null : userContent}</div>
    </div>
  );
}
