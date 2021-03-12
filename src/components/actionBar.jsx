import React from "react";
import "../styles/actionBar.scss";
export default function ActionBar(props) {
  let items = [];
  if (typeof props.items != "array") {
    items[0] = (
      <div
        key={0}
        onClick={props.items.props.onClick}
        className="column is-narrow is-hoverable"
      >
        {props.items}
      </div>
    );
  } else {
    items = props.items.map((i, n) => {
      <div
        key={n}
        onClick={i.onClick}
        className="column is-narrow is-hoverable"
      >
        {i}
      </div>;
    });
  }
  return (
    <div className="actionBar columns">
      <div className="column"></div>

      {items}
      <div className="column is-1"></div>
    </div>
  );
}
