import React, { useEffect, useState, useContext } from "react";
import { DateTime } from "luxon";
import "../styles/notifications.scss";
import PageContainer from "../components/pageContainer";
import getURL from "../tools/geturl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArchive,
  faInfoCircle,
  faSort,
  faSortDown,
  faSortUp,
} from "@fortawesome/pro-duotone-svg-icons";
import { faSync, faEye, faUndo } from "@fortawesome/pro-regular-svg-icons";

import ActionBar from "../components/actionBar";

const directions = {
  NEUTRAL: 0,
  UP: 1,
  DOWN: 2,
};

export default function NotificationPage() {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [contentDirection, setContentDirection] = useState(directions.NEUTRAL);
  const [typeDirection, setTypeDirection] = useState(directions.NEUTRAL);
  const [dateDirection, setDateDirection] = useState(directions.DOWN);
  const [dismissedVisible, setDismissedVisible] = useState(false);

  var hasCleanedUp = false;
  useEffect(() => {
    reload();
    return () => {
      hasCleanedUp = true;
    };
  }, []);

  function reload() {
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

    fetch(getURL() + "/api/notifications", {
      method: "GET",
      headers: headers,
    })
      .then((response) => response.json())
      .then((notifications) => {
        if (hasCleanedUp) {
          return;
        }
        setNotifications(notifications);
        setTimeout(() => {
          if (hasCleanedUp) {
            return;
          }
          setLoading(false);
        }, 1000);
      })
      .catch((e) => {
        setLoading(false);
        throw e;
      });
  }
  let showDismissed = (
    <span
      onClick={() => {
        setDismissedVisible(!dismissedVisible);
      }}
    >
      <FontAwesomeIcon icon={faEye} /> {dismissedVisible ? "Hide" : "Show"}{" "}
      dismissed
    </span>
  );
  let refreshPage = (
    <span onClick={() => reload()}>
      <FontAwesomeIcon icon={faSync} spin={loading} /> Reload
    </span>
  );
  return (
    <PageContainer page="notifications">
      <div className="container">
        <ActionBar items={[showDismissed, refreshPage]} />
        <table
          id="notificationList"
          className="table is-fullwidth is-hoverable has-text-left"
        >
          <thead>
            <tr>
              <th onClick={handleTypeDirectionupdate}>
                <span className="icon-text">
                  <span>Type</span>
                  <span className="icon">
                    <FontAwesomeIcon
                      icon={
                        typeDirection == directions.NEUTRAL
                          ? faSort
                          : typeDirection == directions.UP
                          ? faSortUp
                          : faSortDown
                      }
                    />
                  </span>
                </span>
              </th>
              <th onClick={handleDirectionUpdate}>
                <span className="icon-text">
                  <span>Details</span>
                  <span className="icon">
                    <FontAwesomeIcon
                      icon={
                        contentDirection == directions.NEUTRAL
                          ? faSort
                          : contentDirection == directions.UP
                          ? faSortUp
                          : faSortDown
                      }
                    />
                  </span>
                </span>
              </th>
              <th className="time" onClick={handleDateDirectionUpdate}>
                <span className="icon-text">
                  <span>Time</span>
                  <span className="icon">
                    <FontAwesomeIcon
                      icon={
                        dateDirection == directions.NEUTRAL
                          ? faSort
                          : dateDirection == directions.UP
                          ? faSortUp
                          : faSortDown
                      }
                    />
                  </span>
                </span>
              </th>
              <th className="archiveButtons"></th>
            </tr>
          </thead>
          <tbody>
            {notifications
              .filter((i) => dismissedVisible || i.dismissed == false)
              .sort((a, b) => {
                if (contentDirection !== directions.NEUTRAL) {
                  var result = a.content.localeCompare(b.content);
                  if (result == 0) {
                    return 0;
                  } else if (
                    result == 1 &&
                    contentDirection === directions.UP
                  ) {
                    return -1;
                  } else if (
                    result == -1 &&
                    contentDirection === directions.UP
                  ) {
                    return 1;
                  }
                  return result;
                } else if (typeDirection !== directions.NEUTRAL) {
                  var result = a.type.localeCompare(b.type);
                  if (result == 0) {
                    return 0;
                  } else if (result == 1 && typeDirection === directions.UP) {
                    return -1;
                  } else if (result == -1 && typeDirection === directions.UP) {
                    return 1;
                  }
                  return result;
                } else if (dateDirection !== directions.NEUTRAL) {
                  if (new Date(a.date).getTime() < new Date(b.date).getTime()) {
                    return dateDirection == directions.UP ? -1 : 1;
                  }
                  if (new Date(a.date).getTime() > new Date(b.date).getTime()) {
                    return dateDirection == directions.UP ? 1 : -1;
                  }
                  return 0;
                }
                return;
              })
              .sort((a, b) => {
                if (a.dismissed && !b.dismissed) {
                  return 1;
                } else if (!a.dismissed && b.dismissed) {
                  return -1;
                }
                return 0;
              })
              .map((notification) => {
                return (
                  <tr
                    key={notification.id}
                    className={notification.dismissed ? "dismissed" : undefined}
                  >
                    <td>{notification.type}</td>
                    <td>{notification.content}</td>
                    <td>
                      <span className="icon-text">
                        <span>
                          {DateTime.fromISO(notification.date).toRelative()}
                        </span>
                        <span className="icon">
                          <FontAwesomeIcon
                            icon={faInfoCircle}
                            className="fa-swap-opacity"
                            title={DateTime.fromISO(
                              notification.date
                            ).toLocaleString(
                              DateTime.DATETIME_FULL_WITH_SECONDS
                            )}
                          />
                        </span>
                      </span>
                    </td>
                    <td
                      className="dismiss"
                      onClick={() =>
                        dismissNotifications(
                          notification.id,
                          !notification.dismissed
                        )
                          .then(reload)
                          .catch(console.error)
                      }
                    >
                      <span className="icon">
                        <FontAwesomeIcon
                          icon={notification.dismissed ? faUndo : faArchive}
                          className="fa-swap-opacity"
                        />
                      </span>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
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
    setContentDirection(directions.NEUTRAL);
    setTypeDirection(directions.NEUTRAL);
  }
  function handleDirectionUpdate() {
    setContentDirection(
      contentDirection === directions.NEUTRAL
        ? directions.UP
        : contentDirection === directions.UP
        ? directions.DOWN
        : directions.UP
    );
    setDateDirection(directions.NEUTRAL);
    setTypeDirection(directions.NEUTRAL);
  }
  function handleTypeDirectionupdate() {
    setTypeDirection(
      typeDirection === directions.NEUTRAL
        ? directions.UP
        : typeDirection === directions.UP
        ? directions.DOWN
        : directions.UP
    );
    setDateDirection(directions.NEUTRAL);
    setContentDirection(directions.NEUTRAL);
  }

  function dismissNotifications(id, state) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append(
        "authorization",
        "auth-" +
          (localStorage.getItem("auth") || sessionStorage.getItem("auth"))
      );
      fetch(
        getURL() +
          "/api/notifications/dismiss/" +
          id +
          "/" +
          (state ? "1" : "0"),
        {
          method: "POST",
          headers,
        }
      )
        .then((response) => {
          if (response.ok) {
            resolve();
          } else {
            reject();
          }
        })
        .catch(reject);
    });
  }
}
