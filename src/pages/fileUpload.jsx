import { faTimes } from "@fortawesome/pro-regular-svg-icons";
import { faFilePlus, faFileUpload } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import "../styles/fileUpload.css";
import GETURL from "../tools/geturl";
export default function FileUpload(props) {
  const [isDraggingOver, setDraggingOver] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [state, setState] = useState(0);
  if (isDraggingOver && !file) {
    return (
      <div className="fileUpload isDropping">
        <h1 className="title">Drop your file here</h1>
      </div>
    );
  }

  let fileUpload = (
    <div
      className="fileUpload has-text-right"
      onDrop={drop}
      onDragEnter={dragEnter}
      onDragOver={dragOver}
      onDragLeave={dragLeave}
    >
      <h1 className="title has-text-centered">
        Upload a .gcode file{" "}
        <span
          className={"icon pointer_cursor " + (state !== 0 ? "is-hidden" : "")}
          onClick={props.onClose}
        >
          <FontAwesomeIcon icon={faTimes} />
        </span>
      </h1>
      <h2
        className={
          "subtitle has-text-centered" + (state !== 0 ? "" : " is-hidden")
        }
      >
        {state == 2
          ? "This file already exists, would you like to replace the file?"
          : "This file is too large, make sure your gcode file is under 20mb"}
      </h2>
      <br />
      <div
        className={
          "file is-centered  is-boxed is-danger" + (file ? "has-name" : "")
        }
      >
        <label className="file-label">
          <input
            onChange={handleChange}
            disabled={uploading}
            className="file-input"
            type="file"
            accept=".gcode"
            name="file"
          />
          <span className="file-cta">
            <span className="file-icon">
              <FontAwesomeIcon icon={faFileUpload} />
            </span>
            <span className="file-label">Choose a file…</span>
          </span>
          {file != null && (
            <span className="file-name has-text-left">{file.name}</span>
          )}
        </label>
      </div>
      {uploading && (
        <button className="button is-warning is-loading" disabled={true}>
          Uploading..
        </button>
      )}
      {!uploading && state == 0 && (
        <button
          className="button is-success"
          onClick={() => {
            uploadFile(false);
          }}
          disabled={file == null}
        >
          Upload
        </button>
      )}
      {!uploading && state == 2 && (
        <div className="buttons is-right">
          <button
            className="button is-text"
            onClick={() => uploadFile(true)}
            disabled={file == null}
          >
            Replace
          </button>
          <button
            className="button is-success"
            onClick={() => {
              setFile(null);
              setState(0);
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );

  let fileUploadSuccess = (
    <div className="fileUpload">
      <h1 className="title">Your file has uploaded successfully</h1>
      <h1 className="subtitle">
        {" "}
        You can close this popup by pressing the button below
      </h1>
      <button className="button is-danger" onClick={props.onClose}>
        Close
      </button>
    </div>
  );

  let fileUploadIssue = (
    <div className="fileUpload">
      <h1 className="title">Couldn't upload this file</h1>
      <h1 className="subtitle">
        Something went wrong while uploading this file, check if it is a valid
        .gcode file or try again later.
      </h1>
      <button className="button is-danger" onClick={props.onClose}>
        Close
      </button>
    </div>
  );

  if (state == 0 || state == 2 || state == 3) {
    return fileUpload;
  } else if (state == 4) {
    return fileUploadIssue;
  } else if (state == 1) {
    return fileUploadSuccess;
  } else {
    return (
      <div className="fileUpload">
        <h1 className="title">File successfully uploaded</h1>
        <h2 className="subtitle">
          <span className="icon">
            <FontAwesomeIcon icon={faFilePlus} />
          </span>{" "}
          {file.name}
        </h2>
        <br />
        <br />
        <br />
        <div className="buttons is-right">
          <button
            className="button is-text"
            onClick={() => {
              setState(0);
              setFile(null);
            }}
          >
            Upload more
          </button>
          <button className="button is-success">Close</button>
        </div>
      </div>
    );
  }
  function uploadFile(force) {
    if (!file || uploading) {
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      return setState(3);
    }
    if (!file.name.trim().endsWith(".gcode")) {
      return setState(4);
    }
    setUploading(true);
    let headers = new Headers();
    headers.append(
      "Authorization",
      "auth-" +
        (localStorage.getItem("auth") != null
          ? localStorage.getItem("auth")
          : sessionStorage.getItem("auth"))
    );
    if (force === true) {
      headers.append("X-force-upload", "true");
    }
    let formData = new FormData();
    formData.append("file", file);
    fetch(GETURL() + "/api/files/", { method: "PUT", body: formData, headers })
      .then((response) => {
        setUploading(false);

        if (response.ok) {
          return setState(1);
        }
        if (response.status == 409) {
          return setState(2);
        }
        if (response.status == 413) {
          return setState(3);
        }
        return setState(-1);
      })
      .catch((e) => {
        console.error(e);
        setUploading(false);
        setState(-1);
      });
  }

  function dragOver(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  function dragEnter(e) {
    e.stopPropagation();
    e.preventDefault();
    setDraggingOver(true);
  }
  function dragLeave(e) {
    e.stopPropagation();
    console.log("Dragleave");
    setDraggingOver(false);
    e.preventDefault();

    console.log(e);
  }
  function drop(e) {
    e.stopPropagation();
    e.preventDefault();
    console.log("DROP --->>>");
    console.log(e);
    console.log("DROP ---<<<");
  }

  function handleChange(e) {
    if (uploading) {
      return;
    }
    setState(0);
    let files = e.currentTarget.files;
    if (files.length == 0) {
      return setFile(null);
    }
    setFile(files[0]);
  }
}
