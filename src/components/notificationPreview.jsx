import { faTimesCircle } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useDispatch } from "react-redux";
import { notificationDissmiss } from "../redux/actions/notification";

export default function NotificationPreview(props) {
  const dispatch = useDispatch();
  return (
    <div className="notification-box">
      <span className="icon-text">
        <span>{props.notification.content}</span>
        <span
          className="icon"
          onClick={() => {
            dispatch(notificationDissmiss(props.notification.id));
          }}
        >
          <FontAwesomeIcon icon={faTimesCircle} />
        </span>
      </span>
    </div>
  );
}
