import React, { useEffect, useState } from "react";
import { DateTime } from "luxon";
import GETURL from "../tools/geturl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSlash } from "@fortawesome/pro-solid-svg-icons";
import {
  faDownload,
  faEdit,
  faPrint,
  faTrashAlt,
} from "@fortawesome/pro-regular-svg-icons";
import FileRowActionButton from "./fileRowActionButton";
import { useSelector } from "react-redux";

import * as Sentry from "@sentry/react";

export default function FileRow({
  file,
  reloadPage,
  setSelectedPrint,
  ...props
}) {
  const printerInfo = useSelector((state) => state.printer);
  const user = useSelector((state) => state.user);

  return (
    <tr>
      <td title={file.name}>{file.name}</td>
      <td title={file.uploaded}>
        {DateTime.fromISO(file.uploaded).toLocaleString(DateTime.DATETIME_FULL)}
      </td>
      <td>{getActions(file)}</td>
    </tr>
  );
  function getActions(file) {
    let actions = [
      <FileRowActionButton
        onClick={() => {
          downloadFile(file);
        }}
        title={"Download " + file.name}
        color="info"
        key="download"
      >
        <FontAwesomeIcon icon={faDownload} />
      </FileRowActionButton>,
    ];
    if (user.permissions["admin"] || user.permissions["print_state.edit"]) {
      if (printerInfo.state == "Connected") {
        actions.push(
          <FileRowActionButton
            title={
              !props.loading
                ? "Start a print using " + file.name
                : "Starting print using " + file.name
            }
            key="print"
            color="success"
            disabled={props.print_disabled}
            loading={props.print_loading}
            onClick={() => {
              setSelectedPrint();
            }}
          >
            <FontAwesomeIcon icon={faPrint} />
          </FileRowActionButton>
        );
      } else {
        actions.push(
          <FileRowActionButton
            key="print"
            title={
              "Your printer is not ready to print, make sure the printer is connected & not currently printing."
            }
            color="danger"
            disabled={true}
          >
            <span key="print" className="fa-layers fa-fw">
              <FontAwesomeIcon icon={faPrint} />
              <FontAwesomeIcon icon={faSlash} size="sm" flip={"horizontal"} />
            </span>
          </FileRowActionButton>
        );
      }
    }
    if (user.permissions["admin"] || user.permissions["file.edit"]) {
      actions.push(
        <FileRowActionButton
          title={
            printerInfo.state == "Printing"
              ? file.name == printerInfo.stateDescription.printInfo.file.name
                ? "Cannot rename " + file.name + ". It's currently printing."
                : "Rename " + file.name
              : "Rename " + file.name
          }
          key="edit"
          disabled={
            printerInfo.state == "Printing"
              ? file.name == printerInfo.stateDescription.printInfo.file.name
                ? true
                : false
              : false
          }
          color="warning"
          onClick={() => renameFile(file, reloadPage)}
        >
          <FontAwesomeIcon icon={faEdit} />
        </FileRowActionButton>
      );
      actions.push(
        <FileRowActionButton
          title={
            printerInfo.state == "Printing"
              ? file.name == printerInfo.stateDescription.printInfo.file.name
                ? "Cannot delete " + file.name + ". It's currently printing."
                : "Delete " + file.name
              : "Delete " + file.name
          }
          key="delete"
          color="danger"
          disabled={
            printerInfo.state == "Printing"
              ? file.name == printerInfo.stateDescription.printInfo.file.name
                ? true
                : false
              : false
          }
          onClick={() => {
            deleteFile(file, reloadPage);
          }}
        >
          <FontAwesomeIcon icon={faTrashAlt} />
        </FileRowActionButton>
      );
    }
    return <div className="file-button-container ">{actions}</div>;
  }
}

function downloadFile(file) {
  var link = document.createElement("a");
  link.href =
    GETURL() +
    "/api/file/" +
    file.name +
    "?authorization=" +
    (localStorage.getItem("auth") != null
      ? localStorage.getItem("auth")
      : sessionStorage.getItem("auth"));
  link.download = file.name;
  link.target = "_blank";
  link.click();
}

function deleteFile(file, cb) {
  let result = confirm('Are you sure you want to delete "' + file.name + '"?');
  if (!result) {
    return;
  }
  let headers = new Headers();
  headers.append(
    "Authorization",
    localStorage.getItem("auth") != null
      ? localStorage.getItem("auth")
      : sessionStorage.getItem("auth")
  );
  fetch(GETURL() + "/api/file/" + file.name, {
    method: "DELETE",
    headers,
  })
    .then((res) => {
      console.log(res.status);
      if (res.ok) {
        return cb();
      } else {
        alert("Couldn't remove \"" + file.name + '", Try again later.');
        cb();
      }
    })
    .catch((e) => {
      Sentry.captureException(e);
      alert("Couldn't remove \"" + file.name + '", Try again later.');
    });
}

function renameFile(file, cb) {
  let newName = prompt(
    'Specify the new name for "' + file.name + '":',
    file.name
  );
  if (!newName) {
    return;
  }
  if (newName === file.name) {
    alert("The new name is the same as the old name.");
    return cb();
  }
  if (!newName.endsWith(".gcode")) {
    alert('This name is not valid, it must end with ".gcode"');
    return renameFile(file, cb);
  }
  if (/^\w*\.gcode$/.test(newName) == false) {
    alert(
      "This name is not valid, you can only use characters a-Z 0-9 and underscores."
    );
    return renameFile(file, cb);
  }
  let headers = new Headers();
  headers.append(
    "Authorization",
    localStorage.getItem("auth") != null
      ? localStorage.getItem("auth")
      : sessionStorage.getItem("auth")
  );
  headers.append("Content-Type", "Application/json");
  fetch(GETURL() + "/api/files/rename", {
    method: "POST",
    headers,
    body: JSON.stringify({
      new_name: newName,
      old_name: file.name,
    }),
  })
    .then((res) => {
      if (res.ok) {
        alert("Succesfully renamed " + file.name + " to " + newName);
        return cb();
      } else {
        alert(
          "Couldn't rename \"" +
            file.name +
            '" to "' +
            newName +
            '", Try again later.'
        );
        cb();
      }
    })
    .catch((e) => {
      Sentry.captureException(e);
      alert("Couldn't rename \"" + file.name + '", Try again later.');
    });
}
