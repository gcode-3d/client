import React, { useState } from "react";
export default function StatusBarItem(props) {
  let dropdown = <div className="navbar-dropdown">{props.children}</div>;
  let size = null;
  switch (props.size) {
    case "large":
      size = "20em";
      break;
    case "medium":
      size = "10em";
      break;
    case "small":
      size = "5em";
      break;
  }
  return (
    <div
      className={"navbar-item has-dropdown is-hoverable"}
      onClick={props.onClick}
      style={{
        minWidth: size,
      }}
    >
      <a
        className="navbar-item"
        style={{
          minWidth: size,
        }}
      >
        <span className="icon-text">
          <span className="icon">{props.icon}</span>
          <span>{props.title}</span>
        </span>
      </a>
      {props.children != undefined && dropdown}
    </div>
  );
}
