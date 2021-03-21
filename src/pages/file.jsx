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
import { faPlusCircle, faSync } from "@fortawesome/pro-regular-svg-icons";

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
  const [loading, setLoading] = useState(false);
  const [selectedPrint, setSelectedPrint] = useState(null);
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

  useEffect(() => {
    setSelectedPrint(null);
  }, [connectionContext.state]);

  function reloadFiles() {
    if (loading) {
      return;
    }
    setLoading(true);
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
        setTimeout(() => {
          if (hasCleanedUp) {
            return;
          }
          setLoading(false);
          // Give the ilusion the button does anything, because usually this list is loaded quickly with no / just a few files
        }, 1000);
      })
      .catch((e) => {
        setLoading(false);
        throw e;
      });
  }
  let uploadFile = (
    <span onClick={() => setFileUploadModal(true)}>
      <FontAwesomeIcon icon={faPlusCircle} /> Upload file
    </span>
  );
  let refreshPage = (
    <span onClick={() => reloadFiles()}>
      <FontAwesomeIcon icon={faSync} spin={loading} /> Reload files
    </span>
  );
  return (
    <PageContainer page="file">
      <ActionBar items={[uploadFile, refreshPage]} />
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
                  print_disabled={selectedPrint != null}
                  print_loading={
                    selectedPrint != null && file.name === selectedPrint
                  }
                  setSelectedPrint={() => {
                    setSelectedPrint(file.name);
                  }}
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
