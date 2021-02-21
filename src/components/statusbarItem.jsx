import React, { useState } from "react";
export default function StatusBarItem(props) {
  let dropdown = <div className="navbar-dropdown">{props.children}</div>;
  return (
    <div
      className={"navbar-item has-dropdown is-hoverable"}
      onClick={props.onClick}
    >
      <a className="navbar-item">
        <span className="icon-text">
          <span className="icon">{props.icon}</span>
          <span>{props.title}</span>
        </span>
      </a>
      {props.children != undefined && dropdown}
    </div>
  );
}
