import React from "react";
import "../styles/modal.css";

export default function BoxModal(props) {
  return (
    <div className="modal">
      <div className="modal-background"></div>
      <div className="modal-content">
        <div className="modal-box">
          <h1 className="header">{props.header}</h1>
          <div className="content">{props.children}</div>
        </div>
      </div>
    </div>
  );
}
