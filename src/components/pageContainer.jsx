import React from "react";
import { useSelector } from "react-redux";
import StatusBar from "../components/statusbar";
import Sidebar from "../components/sidebar";

import NotificationPreview from "../components/notificationPreview";

import "../styles/page.scss";

export default function PageContainer(props) {
  let notifications = useSelector((state) => state.notifications);
  let notificationComponents = notifications
    .sort()
    .map((notification) => (
      <NotificationPreview key={notification.id} notification={notification} />
    ));

  return (
    <>
      <StatusBar />
      <div className={"page " + props.page}>
        <Sidebar pageName={props.page} />
        <div className="page-content">{props.children}</div>
      </div>
      {notifications.length > 0 && (
        <div className="notification-container">{notificationComponents}</div>
      )}
    </>
  );
}
