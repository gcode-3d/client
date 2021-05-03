import React from "react";
import "../styles/actionBar.scss";
export default function ActionBar(props) {
  let items = [];
  if (props.items.constructor.name != "Array") {
    items[0] = (
      <div
        key={0}
        onClick={
          props.items.props.disabled ? undefined : props.items.props.onClick
        }
        className={
          "column is-narrow is-hoverable" +
          (props.items.props.disabled ? " is-disabled" : "")
        }
      >
        {props.items}
      </div>
    );
  } else {
    items = props.items.map((i, n) => {
      return (
        <div
          key={n}
          onClick={i.props.disabled ? undefined : i.props.onClick}
          className={
            "column is-narrow is-hoverable" +
            (i.props.disabled ? " is-disabled" : "")
          }
        >
          {i}
        </div>
      );
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
