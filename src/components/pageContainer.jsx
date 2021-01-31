import React from "react";
import StatusBar from "../components/statusbar";
import Sidebar from "../components/sidebar";
import "../styles/page.css";

export default function PageContainer(props) {
  return (
    <>
      <StatusBar />
      <div className="page">
        <Sidebar pageName={props.page} />
        <div className="page-content">{props.children}</div>
      </div>
    </>
  );
}
