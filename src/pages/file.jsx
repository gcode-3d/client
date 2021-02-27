import React, { useEffect, useState, useContext } from "react";
import PageContainer from "../components/pageContainer";
import GETURL from "../tools/geturl";
import { DateTime } from "luxon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortDown,
  faSortUp,
} from "@fortawesome/pro-duotone-svg-icons";
import {
  faDownload,
  faEdit,
  faPrint,
  faTrashAlt,
} from "@fortawesome/pro-regular-svg-icons";

import ConnectionContext from "../components/connectionContext";
import { faSlash } from "@fortawesome/pro-solid-svg-icons";

const directions = {
  NEUTRAL: 0,
  UP: 1,
  DOWN: 2,
};

export default function FilePage() {
  const connectionContext = useContext(ConnectionContext);

  const [files, setFiles] = useState([]);
  const [filenameDirection, setFileDirection] = useState(directions.NEUTRAL);
  const [dateDirection, setDateDirection] = useState(directions.NEUTRAL);
  console.log(connectionContext);
  let actions = [<FontAwesomeIcon key="download" icon={faDownload} />];
  if (connectionContext.state == "Connected") {
    actions.push(<FontAwesomeIcon key="print" icon={faPrint} />);
  } else {
    actions.push(
      <span key="print" className="fa-layers fa-fw">
        <FontAwesomeIcon icon={faPrint} />
        <FontAwesomeIcon icon={faSlash} size="sm" flip={"horizontal"} />
      </span>
    );
  }
  if (
    connectionContext.user.permissions["admin"] ||
    connectionContext.user.permissions["file.edit"]
  ) {
    actions.push(<FontAwesomeIcon key="edit" icon={faEdit} />);
    actions.push(<FontAwesomeIcon key="delete" icon={faTrashAlt} />);
  }

  var hasCleanedUp = false;
  useEffect(() => {
    var headers = new Headers();
    headers.append(
      "Authorization",
      "auth-" +
        (localStorage.getItem("auth") === null
          ? sessionStorage.getItem("auth")
          : localStorage.getItem("auth"))
    );

    fetch(GETURL() + "/api/files", {
      method: "GET",
      headers: headers,
    })
      .then((response) => response.json())
      .then((files) => {
        if (hasCleanedUp) {
          return;
        }
        setFiles(files);
      })
      .catch((e) => {
        throw e;
      });

    return () => {
      hasCleanedUp = true;
    };
  }, []);
  return (
    <PageContainer page="file">
      <table className="table is-fullwidth is-hoverable">
        <thead>
          <tr>
            <th onClick={handleFileDirectionUpdate}>
              Filename{" "}
              <FontAwesomeIcon
                icon={
                  filenameDirection == directions.NEUTRAL
                    ? faSort
                    : filenameDirection == directions.UP
                    ? faSortUp
                    : faSortDown
                }
              />
            </th>
            <th onClick={handleDateDirectionUpdate}>
              Uploaded{" "}
              <FontAwesomeIcon
                icon={
                  dateDirection == directions.NEUTRAL
                    ? faSort
                    : dateDirection == directions.UP
                    ? faSortUp
                    : faSortDown
                }
              />
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {files
            .sort((a, b) => {
              if (filenameDirection !== directions.NEUTRAL) {
                var result = a.name.localeCompare(b.name);
                if (result == 0) {
                  return 0;
                } else if (result == 1 && filenameDirection === directions.UP) {
                  return -1;
                } else if (
                  result == -1 &&
                  filenameDirection === directions.UP
                ) {
                  return 1;
                }
                return result;
              } else if (dateDirection !== directions.NEUTRAL) {
                if (a.uploaded < b.uploaded) {
                  return dateDirection == directions.UP ? -1 : 1;
                }
                if (a.uploaded > b.uploaded) {
                  return dateDirection == directions.UP ? 1 : -1;
                }
                return 0;
              }
              return;
            })
            .map((file) => {
              return (
                <tr key={file.name}>
                  <td title={file.name}>{file.name}</td>
                  <td title={file.uploaded}>
                    {DateTime.fromISO(file.uploaded).toLocaleString(
                      DateTime.DATETIME_FULL
                    )}
                  </td>
                  <td>{actions}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </PageContainer>
  );

  function handleDateDirectionUpdate() {
    setDateDirection(
      dateDirection === directions.NEUTRAL
        ? directions.UP
        : dateDirection === directions.UP
        ? directions.DOWN
        : directions.UP
    );
    setFileDirection(directions.NEUTRAL);
  }
  function handleFileDirectionUpdate() {
    setFileDirection(
      filenameDirection === directions.NEUTRAL
        ? directions.UP
        : filenameDirection === directions.UP
        ? directions.DOWN
        : directions.UP
    );
    setDateDirection(directions.NEUTRAL);
  }
}
