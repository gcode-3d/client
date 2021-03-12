import React from "react";
export default function FileRowActionButton(props) {
  return (
    <button
      disabled={props.disabled}
      title={props.title}
      onClick={props.onClick}
      className={"button is-small is-outlined " + getColor(props.color)}
    >
      {props.children}
    </button>
  );
}

function getColor(color) {
  if (color) {
    return "is-" + color;
  }
  return "";
}
