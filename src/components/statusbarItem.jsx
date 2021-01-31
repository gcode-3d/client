import React, { useState } from "react";
export default function StatusBarItem(props) {
  return (
    <a className="navbar-item" onClick={props.onClick}>
      <span className="icon-text">
        <span className="icon">{props.icon}</span>
        <span>{props.children}</span>
      </span>
    </a>
  );
}
