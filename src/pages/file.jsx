import React, { useEffect, useState, useContext } from "react";
import "../styles/filePage.css";
import PageContainer from "../components/pageContainer";
import GETURL from "../tools/geturl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortDown,
  faSortUp,
} from "@fortawesome/pro-duotone-svg-icons";
import { faPlusCircle } from "@fortawesome/pro-regular-svg-icons";

import ConnectionContext from "../components/connectionContext";
import ActionBar from "../components/actionBar";
import BoxModal from "../components/boxModal";
import FileUpload from "./fileUpload";
import FileRow from "../components/fileRow";

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

  const [fileUploadModalVisible, setFileUploadModal] = useState(false);

  var hasCleanedUp = false;
  useEffect(() => {
    reloadFiles();
    return () => {
      hasCleanedUp = true;
    };
  }, []);

  function reloadFiles() {
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
  }
  let uploadFile = (
    <span onClick={() => setFileUploadModal(true)}>
      <FontAwesomeIcon icon={faPlusCircle} /> Upload file
    </span>
  );
  return (
    <PageContainer page="file">
      <ActionBar items={uploadFile} />
      {fileUploadModalVisible && (
        <BoxModal>
          <FileUpload
            onClose={() => {
              setFileUploadModal(false);
              reloadFiles();
            }}
          />
        </BoxModal>
      )}
      <table id="filelist" className="table is-fullwidth is-hoverable">
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
                <FileRow
                  reloadPage={reloadFiles}
                  context={connectionContext}
                  file={file}
                  key={file.name}
                />
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
