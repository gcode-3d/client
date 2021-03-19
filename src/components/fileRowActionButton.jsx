import React from "react";
export default function FileRowActionButton(props) {
  return (
    <button
      disabled={props.disabled}
      title={props.title}
      onClick={props.onClick}
      className={
        "button is-small is-outlined" +
        getColor(props.color) +
        loading(props.loading)
      }
    >
      {props.children}
    </button>
  );
}
function loading(isLoading) {
  if (!isLoading) {
    return "";
  }
  return " is-loading";
}

function getColor(color) {
  if (color) {
    return " is-" + color;
  }
  return "";
}
